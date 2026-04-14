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
    headline: 'Opening a Business in Southbank VIC 3006: 2026 Location Analysis',
    description: "Yarra riverfront premium with a structural thin-ness problem. Event and tourist trade is real — but the residential density to sustain everyday hospitality isn't there yet.",
    datePublished: '2026-04-01',
    author: { '@type': 'Organization', name: 'Locatalyze' },
  },
  {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: [{
      '@type': 'Question',
      name: 'Is Southbank Melbourne good for a restaurant in 2026?',
      acceptedAnswer: { '@type': 'Answer', text: "Southbank works for specific restaurant formats — premium riverside dining with strong corporate and event channels, or daytime tourist concepts near the NGV. It does not work well for independent operators trying to build regular local trade. The residential density is thin relative to the commercial strip, and rents of $10,000–$22,000 per month require event or tourist revenue strategies that most independent operators don't have." },
    }],
  },
]

export default function SouthbankPage() {
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
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Southbank</span>
          </div>
          <h1 style={{ fontSize: 'clamp(26px,5vw,44px)', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 14 }}>
            Opening a Business in Southbank VIC 3006: 2026 Location Analysis
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.78)', maxWidth: 600, lineHeight: 1.7, marginBottom: 22 }}>
            Yarra riverfront premium with a structural thin-ness problem. Event and tourist trade is real — but the residential density to sustain everyday hospitality isn't there yet.
          </p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <VerdictBadge v="CAUTION" />
            <span style={{ fontSize: 24, fontWeight: 900, color: S.white }}>71/100</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>Location score</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '44px 24px 80px' }}>

        <section style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: 28, marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 22, color: S.n900 }}>Location Scorecard</h2>
          <ScoreBar label="Foot Traffic" value={76} />
          <ScoreBar label="Demographics" value={72} />
          <ScoreBar label="Rent Viability" value={45} />
          <ScoreBar label="Competition Gap" value={62} />
        </section>

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18, color: S.n900 }}>Business Environment</h2>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 16, color: S.muted }}>Southbank's commercial case rests on its event and tourist infrastructure — Crown Entertainment Complex, the Arts Centre Melbourne, Hamer Hall, the National Gallery of Victoria, and the MCG events that move 80,000+ people past the Yarra Promenade on AFL final days. This is real foot traffic. A 180-seat riverside restaurant on a Hamer Hall sold-out night can take $40,000 in one evening. The problem is the Tuesday after that Hamer Hall night, when the same restaurant might do $4,000.</p>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 16, color: S.muted }}>The residential population of Southbank is larger than it was a decade ago — the apartment towers along City Road and Sturt Street house 25,000+ residents — but the density relative to the commercial strip is still thin. The Yarra Promenade and Southgate complex have significant tenancies built for event-day traffic that struggle to find a sustainable customer base on ordinary weekday evenings. Office workers from the adjacent Freshwater Place and ANZ headquarters provide weekday lunch trade, but that cohort has also been reduced by hybrid work patterns.</p>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 16, color: S.muted }}>Corporate hospitality budgets are the third pillar of the Southbank economy, and they matter more here than in most Melbourne precincts. The convention centre (MCEC) draws international and interstate delegates who stay in Southbank hotels and eat within walking distance. But post-pandemic, corporate hospitality spend per delegate has declined as organisations became more cost-conscious. The premium riverside venues that thrived on $150 per head corporate dinners have had to work harder and discount more than their menus suggest.</p>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 16, color: S.muted }}>What Southbank does offer that few Melbourne locations can match is a daytime tourist trade that is growing. International visitor numbers to Melbourne recovered through 2024–2025, and Southbank — with the NGV, the casino, and the river promenade — captures a disproportionate share of that visitor time. Café and casual dining concepts positioned for the 11am–3pm leisure tourist do reasonably well here. Fine dining positioned for the corporate dinner does well on specific nights. Everything in between struggles.</p>
        </section>

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18, color: S.n900 }}>Competition Analysis</h2>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 16, color: S.muted }}>The Southgate complex and the Yarra Promenade host around 80 food and beverage venues, creating a concentrated competitive environment for what is a relatively small population base. The Crown complex adds another 30+ venues that compete for the same tourist and event trade. In this environment, differentiation is difficult — especially because tourists typically choose visible, branded, or review-driven venues rather than discovering independents. The venues at Southgate with the best river views consistently outperform those set back even 15 metres, regardless of food quality.</p>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 16, color: S.muted }}>The competition gap for specific niches is genuine. There is no Vietnamese restaurant in Southbank. There is no specialty coffee bar with a serious roasting program. There is no quality Japanese izakaya. These gaps exist because the cost of entry (rents of $10,000–$22,000/month) filters out the independent operators who would typically fill them. The operators who can afford Southbank rents are almost exclusively licensed venues with event revenue strategies — not specialty food concepts.</p>
        </section>

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18, color: S.n900 }}>What Works Here</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            <div style={{ padding: 18, background: S.amberBg, borderRadius: 12, border: `1px solid ${S.amberBdr}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: S.n900 }}>Premium Riverside Dining</span>
                <VerdictBadge v="CAUTION" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, margin: 0, lineHeight: 1.6 }}>Event-night positioning essential. $80–$130 per head with strong private dining and corporate booking channels. Revenue varies dramatically — peak event weeks $200,000+, quiet weeks $40,000–$60,000. Seasonal cash flow management is critical.</p>
            </div>
            <div style={{ padding: 18, background: S.emeraldBg, borderRadius: 12, border: `1px solid ${S.emeraldBdr}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: S.n900 }}>Daytime Tourist Café</span>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, margin: 0, lineHeight: 1.6 }}>NGV-adjacent or Yarra Promenade position. 11am–3pm peak. International and interstate tourist demographic. Average $18–$28 per visitor. Needs strong coffee program and all-day menu. Revenue: $60,000–$90,000/month.</p>
            </div>
            <div style={{ padding: 18, background: S.amberBg, borderRadius: 12, border: `1px solid ${S.amberBdr}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: S.n900 }}>Corporate Lunch Venue</span>
                <VerdictBadge v="CAUTION" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, margin: 0, lineHeight: 1.6 }}>Freshwater Place and ANZ tower office catchment. $25–$45 lunch range. Weekday-only revenue model. Friday is already half of Monday; summer corporate break reduces December–January significantly. Revenue: $50,000–$80,000/month weekday-only.</p>
            </div>
          </div>
        </section>

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18, color: S.n900 }}>Key Risks</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: 18, background: S.amberBg, borderRadius: 10, border: `1px solid ${S.amberBdr}` }}>
              <h4 style={{ fontSize: 14, fontWeight: 800, color: S.amber, marginBottom: 8 }}>Event Dependency Creates Cash Flow Volatility</h4>
              <p style={{ fontSize: 13, color: '#92400E', margin: 0, lineHeight: 1.6 }}>A venue that does $40,000 on a Hamer Hall sold-out night and $4,000 on a quiet Tuesday creates cash flow that is very hard to manage. Southbank operators need significant cash reserves to bridge between event peaks.</p>
            </div>
            <div style={{ padding: 18, background: S.amberBg, borderRadius: 10, border: `1px solid ${S.amberBdr}` }}>
              <h4 style={{ fontSize: 14, fontWeight: 800, color: S.amber, marginBottom: 8 }}>Residential Thin-ness Limits Evening Trade</h4>
              <p style={{ fontSize: 13, color: '#92400E', margin: 0, lineHeight: 1.6 }}>25,000 Southbank residents sounds like a catchment. In practice, many are young professionals who go out in Fitzroy or South Melbourne rather than eating locally in a precinct they associate with tourists and Crown. The independent dinner trade from residents is thinner than apartment counts suggest.</p>
            </div>
            <div style={{ padding: 18, background: S.amberBg, borderRadius: 10, border: `1px solid ${S.amberBdr}` }}>
              <h4 style={{ fontSize: 14, fontWeight: 800, color: S.amber, marginBottom: 8 }}>Rents Don't Fully Reflect Current Trade</h4>
              <p style={{ fontSize: 13, color: '#92400E', margin: 0, lineHeight: 1.6 }}>Southbank landlords built rent expectations on pre-pandemic corporate hospitality volumes that have not fully returned. Some tenancies are still priced at 2018 face rents despite occupancy conditions that have materially changed. Negotiate hard on effective rent, not face rent.</p>
            </div>
          </div>
        </section>

        <SuburbPoll suburb="Southbank" votes={[28, 44, 28]} />

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18, color: S.n900 }}>Nearby Suburbs to Compare</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <Link key="melbourne-cbd" href="/analyse/melbourne/melbourne-cbd" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 800, margin: 0, color: S.n900 }}>Melbourne CBD</h4>
                  <VerdictBadge v="CAUTION" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: S.brand }}>72</div>
                <div style={{ fontSize: 11, color: S.mutedLight, fontWeight: 600 }}>/ 100</div>
              </div>
            </Link>
            <Link key="docklands" href="/analyse/melbourne/docklands" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 800, margin: 0, color: S.n900 }}>Docklands</h4>
                  <VerdictBadge v="CAUTION" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: S.brand }}>65</div>
                <div style={{ fontSize: 11, color: S.mutedLight, fontWeight: 600 }}>/ 100</div>
              </div>
            </Link>
            <Link key="south-yarra" href="/analyse/melbourne/south-yarra" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 800, margin: 0, color: S.n900 }}>South Yarra</h4>
                  <VerdictBadge v="GO" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: S.brand }}>82</div>
                <div style={{ fontSize: 11, color: S.mutedLight, fontWeight: 600 }}>/ 100</div>
              </div>
            </Link>
          </div>
        </section>

        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18, color: S.n900 }}>Final Verdict</h2>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 14, color: S.muted }}>Southbank is CAUTION for most independent operators. The venue types that succeed here — premium riverside dining, large corporate entertainment venues, daytime tourist cafés — require either serious capital (to ride the event-revenue volatility) or specific catchment positioning (NGV-adjacent for tourist trade, office-tower-adjacent for corporate lunch). The general hospitality concept hoping to build a regular local clientele in Southbank will find the customer base thinner than the foot traffic count suggests.</p>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 14, color: S.muted }}>The strongest opportunity in Southbank right now is the daytime tourist café positioned near the NGV or Hamer Hall, capturing the growing international visitor trade with a quality offer at $18–$28 per head. Rents in secondary Southbank positions ($10,000–$14,000/month) are more negotiable than face rents indicate. If you can get a strong fit-out contribution and 12+ months rent-free, the economics improve materially.</p>
        </section>

        <div style={{ background: 'linear-gradient(135deg, #047857, #059669)', borderRadius: 14, padding: 40, textAlign: 'center', marginBottom: 44 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0F172A', marginBottom: 12 }}>Analyse your Southbank address</h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 24, lineHeight: 1.6 }}>Get a specific rent benchmark, competitor map, and GO/CAUTION/NO verdict for your exact address. Free.</p>
          <Link href="/onboarding" style={{ background: S.white, color: S.emerald, borderRadius: 10, padding: '14px 32px', fontSize: 15, fontWeight: 800, textDecoration: 'none', display: 'inline-block' }}>
            Start free analysis →
          </Link>
        </div>

        <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 28, display: 'flex', gap: 16, justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Link href="/analyse/melbourne" style={{ fontSize: 13, fontWeight: 700, color: S.brand, textDecoration: 'none' }}>← Back to Melbourne</Link>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link href="/analyse/melbourne/melbourne-cbd" style={{ fontSize: 13, fontWeight: 600, color: S.brand, textDecoration: 'none' }}>Melbourne CBD</Link>
            <Link href="/analyse/melbourne/docklands" style={{ fontSize: 13, fontWeight: 600, color: S.brand, textDecoration: 'none' }}>Docklands</Link>
            <Link href="/analyse/melbourne/south-yarra" style={{ fontSize: 13, fontWeight: 600, color: S.brand, textDecoration: 'none' }}>South Yarra</Link>
          </div>
        </div>

      </div>
    </div>
  )
}
