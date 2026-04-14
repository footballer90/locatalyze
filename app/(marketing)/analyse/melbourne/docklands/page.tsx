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
    headline: 'Opening a Business in Docklands VIC 3008: 2026 Location Analysis',
    description: "Melbourne's most visible commercial planning challenge. Office weekday trade is real. Evenings and weekends remain structurally thin despite 20 years of residential development.",
    datePublished: '2026-04-01',
    author: { '@type': 'Organization', name: 'Locatalyze' },
  },
  {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: [{
      '@type': 'Question',
      name: 'Is Docklands Melbourne a good location for a restaurant or café?',
      acceptedAnswer: { '@type': 'Answer', text: 'Docklands is a CAUTION for most restaurant and café concepts. Weekday office worker lunch trade is genuine but limited to 8am–3pm Monday–Friday. Evening and weekend trade is structurally thin despite 13,000 residents. The venues that succeed in Docklands are those with corporate event channels, Marv' },
    }],
  },
]

export default function DocklandsPage() {
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
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Docklands</span>
          </div>
          <h1 style={{ fontSize: 'clamp(26px,5vw,44px)', fontWeight: 900, color: S.white, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 14 }}>
            Opening a Business in Docklands VIC 3008: 2026 Location Analysis
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.78)', maxWidth: 600, lineHeight: 1.7, marginBottom: 22 }}>
            Melbourne's most visible commercial planning challenge. Office weekday trade is real. Evenings and weekends remain structurally thin despite 20 years of residential development.
          </p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <VerdictBadge v="CAUTION" />
            <span style={{ fontSize: 24, fontWeight: 900, color: S.white }}>65/100</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>Location score</span>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '44px 24px 80px' }}>
        <section style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: 28, marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 22, color: S.n900 }}>Location Scorecard</h2>
          <ScoreBar label="Foot Traffic" value={62} />
          <ScoreBar label="Demographics" value={74} />
          <ScoreBar label="Rent Viability" value={48} />
          <ScoreBar label="Competition Gap" value={58} />
        </section>
        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18, color: S.n900 }}>Business Environment</h2>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 16, color: S.muted }}>Docklands was Melbourne's most ambitious urban renewal project and its most instructive commercial planning failure. Twenty years of development and $10 billion in public and private investment have produced a suburb with 13,000 residents, 40,000 weekday office workers, significant public art, and a waterfront amenity — and a commercial strip that struggles to generate the spontaneous street life that makes urban precincts commercially viable. The fundamental problem is design: a precinct optimised for cars and towers rather than for pedestrian-scale street activity.</p>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 16, color: S.muted }}>The office worker population is the most commercially viable element of Docklands. The major employers — ANZ, NAB, Transurban, Transport for Victoria, and various government departments — provide a consistent weekday lunch and coffee demand from 8am to 3pm. A café positioned within 100m of a major Docklands tower entrance will see genuine morning and lunch trade Monday–Friday. The issue is that this demand disappears on weekends, reduces by 30–40% on Fridays, and is compressed into a 5-hour window that limits the daily revenue ceiling.</p>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 16, color: S.muted }}>New Quay and Harbour Town are the two commercial precincts in Docklands with the most functional street life. New Quay (the waterfront promenade around Victoria Harbour) has benefited from the residential towers that directly overlook it — residents with disposable income, high-rise apartments, and no suburban backyard tend to spend more locally on hospitality than suburban residents. Weekend trade at New Quay has improved meaningfully from 2022 to 2026 as the resident base matured and the area developed habitual patterns.</p>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 16, color: S.muted }}>The Marvel Stadium (formerly Etihad) is Docklands' most significant foot traffic generator outside the weekday office peak. Stadium events — AFL games, concerts, soccer — draw 25,000–56,000 attendees who pass through Docklands. Pre-game and post-game hospitality near Marvel Stadium can be genuinely lucrative for operators positioned correctly. But this event trade is episodic — typically 30–40 events annually — and cannot support the rent economics of a Docklands tenancy independently.</p>
        </section>
        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18, color: S.n900 }}>Competition Analysis</h2>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 16, color: S.muted }}>Docklands' competitive environment has fewer venues than might be expected for its office worker population — largely because the commercial conditions (weak evening and weekend trade, high rents) have deterred the independent operators who would typically fill a precinct of this size. What exists is a mix of large, licensed venue operators who have the corporate and event channels to sustain Docklands economics, and smaller operators serving the office tower lunch trade. The quality of independent hospitality in Docklands remains below what the demographic income would predict.</p>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 16, color: S.muted }}>The specific competition gap is in quality casual dining for the evening residential market. The 13,000 Docklands residents have limited quality options for weeknight dining without leaving the precinct. New Quay and the immediate surrounds have three or four quality restaurants; the rest of the precinct is largely fast casual. An operator who can build genuine resident loyalty — serving the Docklands residential base as their primary customer rather than the office worker lunch as their primary customer — has a more sustainable business model in this precinct.</p>
        </section>
        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18, color: S.n900 }}>What Works Here</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            <div style={{ padding: 18, background: S.amberBg, borderRadius: 12, border: `1px solid ${S.amberBdr}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: S.n900 }}>Office Tower Lunch Café</span>
                <VerdictBadge v="CAUTION" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, margin: 0, lineHeight: 1.6 }}>Within 100m of ANZ or NAB tower entrance. Weekday 7:30am–2:30pm trade window. $7–$9 coffee, $16–$28 lunch. Weekend revenue negligible. Revenue: $50,000–$80,000/month (weekday only model). Requires very low rent or long rent-free negotiation.</p>
            </div>
            <div style={{ padding: 18, background: S.amberBg, borderRadius: 12, border: `1px solid ${S.amberBdr}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: S.n900 }}>New Quay Waterfront Restaurant</span>
                <VerdictBadge v="CAUTION" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, margin: 0, lineHeight: 1.6 }}>Resident-focused evening and weekend dining. $65–$95 per head, strong wine list. Building loyalty with 13,000 residents who rarely leave the precinct for dinner. Revenue: $80,000–$130,000/month with corporate event supplement.</p>
            </div>
            <div style={{ padding: 18, background: S.emeraldBg, borderRadius: 12, border: `1px solid ${S.emeraldBdr}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: S.n900 }}>Marvel Stadium Event Hospitality</span>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, margin: 0, lineHeight: 1.6 }}>Event-adjacent positioning. Pre-game crowds of 25,000–56,000 need hospitality within walking distance. High volume, limited menu, high margin. 30–40 event days annually plus weekday corporate. Revenue heavily event-dependent.</p>
            </div>
          </div>
        </section>
        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18, color: S.n900 }}>Key Risks</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: 18, background: S.amberBg, borderRadius: 10, border: `1px solid ${S.amberBdr}` }}>
              <h4 style={{ fontSize: 14, fontWeight: 800, color: S.amber, marginBottom: 8 }}>Structural Weakness Is Not a Cycle Issue</h4>
              <p style={{ fontSize: 13, color: '#92400E', margin: 0, lineHeight: 1.6 }}>Docklands' thin evening and weekend trade is a design failure, not a temporary problem awaiting a catalyst. Twenty years of initiatives have not fundamentally altered pedestrian behaviour in the precinct. Operators who model a Docklands tenancy on 'improving' street life are taking on structural risk, not cyclical risk.</p>
            </div>
            <div style={{ padding: 18, background: S.amberBg, borderRadius: 10, border: `1px solid ${S.amberBdr}` }}>
              <h4 style={{ fontSize: 14, fontWeight: 800, color: S.amber, marginBottom: 8 }}>Rents Don't Always Reflect Reality</h4>
              <p style={{ fontSize: 13, color: '#92400E', margin: 0, lineHeight: 1.6 }}>Some Docklands landlords maintain face rents based on office-tower proximity that don't reflect the actual trading conditions. Push hard on effective rent — rent-free periods of 12–18 months, substantial fit-out contributions, and 3+3 rather than 5+5 lease structures are all achievable from motivated landlords in areas with persistent vacancy.</p>
            </div>
            <div style={{ padding: 18, background: S.amberBg, borderRadius: 10, border: `1px solid ${S.amberBdr}` }}>
              <h4 style={{ fontSize: 14, fontWeight: 800, color: S.amber, marginBottom: 8 }}>Event Revenue Is Not Baseline Revenue</h4>
              <p style={{ fontSize: 13, color: '#92400E', margin: 0, lineHeight: 1.6 }}>Marvel Stadium events are genuine revenue spikes but cannot be used to justify lease economics. Calculate what your venue earns on a non-event Tuesday and non-event Saturday. If those numbers don't support the rent, the event premium doesn't change the fundamental math.</p>
            </div>
          </div>
        </section>
        <SuburbPoll suburb="Docklands" votes={[22, 38, 40]} />
        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18, color: S.n900 }}>Nearby Suburbs to Compare</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <Link href="/analyse/melbourne/melbourne-cbd" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 800, margin: 0, color: S.n900 }}>Melbourne CBD</h4>
                  <VerdictBadge v="CAUTION" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: S.brand }}>72</div>
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
          </div>
        </section>
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18, color: S.n900 }}>Final Verdict</h2>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 14, color: S.muted }}>Docklands is a CAUTION — not because the suburb is entirely non-viable, but because the specific conditions under which it works are narrow. Office tower lunch trade Monday–Friday, event-adjacent positioning on Marvel Stadium event days, and New Quay residential dining are the three viable commercial niches. Everything outside these niches struggles.</p>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 14, color: S.muted }}>The only defensible reason to sign a Docklands lease in 2026 is if you can negotiate an exceptional effective rent (12+ months rent-free, substantial fit-out contribution) that reduces your occupancy cost to a level that the weekday-only revenue model can sustain. Without that negotiation, the risk-adjusted economics of Docklands compare unfavourably to Footscray, Northcote, or Preston — all of which offer better foot traffic quality, lower rents, and more sustainable customer bases.</p>
        </section>
        <div style={{ background: 'linear-gradient(135deg, #047857, #059669)', borderRadius: 14, padding: 40, textAlign: 'center', marginBottom: 44 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: S.white, marginBottom: 12 }}>Analyse your Docklands address</h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 24, lineHeight: 1.6 }}>Get a specific rent benchmark, competitor map, and GO/CAUTION/NO verdict for your exact address. Free.</p>
          <Link href="/onboarding" style={{ background: S.white, color: S.emerald, borderRadius: 10, padding: '14px 32px', fontSize: 15, fontWeight: 800, textDecoration: 'none', display: 'inline-block' }}>Start free analysis →</Link>
        </div>
        <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 28, display: 'flex', gap: 16, justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Link href="/analyse/melbourne" style={{ fontSize: 13, fontWeight: 700, color: S.brand, textDecoration: 'none' }}>← Back to Melbourne</Link>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link href="/analyse/melbourne/melbourne-cbd" style={{ fontSize: 13, fontWeight: 600, color: S.brand, textDecoration: 'none' }}>Melbourne CBD</Link>
            <Link href="/analyse/melbourne/southbank" style={{ fontSize: 13, fontWeight: 600, color: S.brand, textDecoration: 'none' }}>Southbank</Link>
            <Link href="/analyse/melbourne/footscray" style={{ fontSize: 13, fontWeight: 600, color: S.brand, textDecoration: 'none' }}>Footscray</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
