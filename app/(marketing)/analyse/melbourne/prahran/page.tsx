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
    headline: 'Opening a Business in Prahran VIC 3181: 2026 Location Analysis',
    description: "Between South Yarra and St Kilda — premium catchment without peak rents. Prahran Market anchors one of Melbourne's most consistent Saturday foot traffic patterns.",
    datePublished: '2026-04-01',
    author: { '@type': 'Organization', name: 'Locatalyze' },
  },
  {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: [{
      '@type': 'Question',
      name: 'Is Prahran a good location to open a café or restaurant in Melbourne?',
      acceptedAnswer: { '@type': 'Answer', text: "Prahran is strong for hospitality, particularly market-adjacent brunch cafés and quality mid-range restaurants serving the residential demographic. The Prahran Market generates 12,000–15,000 Saturday morning visitors who create Melbourne's most consistent Saturday morning foot traffic for surroundin" },
    }],
  },
]

export default function PrahranPage() {
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
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Prahran</span>
          </div>
          <h1 style={{ fontSize: 'clamp(26px,5vw,44px)', fontWeight: 900, color: S.white, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 14 }}>
            Opening a Business in Prahran VIC 3181: 2026 Location Analysis
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.78)', maxWidth: 600, lineHeight: 1.7, marginBottom: 22 }}>
            Between South Yarra and St Kilda — premium catchment without peak rents. Prahran Market anchors one of Melbourne's most consistent Saturday foot traffic patterns.
          </p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <VerdictBadge v="GO" />
            <span style={{ fontSize: 24, fontWeight: 900, color: S.white }}>76/100</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>Location score</span>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '44px 24px 80px' }}>
        <section style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: 28, marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 22, color: S.n900 }}>Location Scorecard</h2>
          <ScoreBar label="Foot Traffic" value={80} />
          <ScoreBar label="Demographics" value={83} />
          <ScoreBar label="Rent Viability" value={65} />
          <ScoreBar label="Competition Gap" value={72} />
        </section>
        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18, color: S.n900 }}>Business Environment</h2>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 16, color: S.muted }}>Prahran occupies a commercially advantageous position between two of Melbourne's strongest hospitality precincts: South Yarra to the north and St Kilda to the south. The suburb's residents — who average $102,000 household income, younger professional, predominantly renting — spend freely at hospitality venues and prefer independent operators to chains. The specific Commercial Road corridor and the Market Lane precinct around the Prahran Market are the commercial spine of the suburb.</p>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 16, color: S.muted }}>Prahran Market is one of the most commercially significant foot traffic anchors in Melbourne's inner suburbs. The market operates Tuesday, Thursday, Friday, Saturday, and Sunday — but Saturday is the defining day, when 12,000–15,000 visitors move through the market and the surrounding streets between 7am and 1pm. Market-adjacent tenancies on Commercial Road and within 200m of the market entrance consistently generate their highest weekly revenue on Saturday mornings. This is different from most Melbourne hospitality strips where Saturday evening is the revenue peak — at Prahran, Saturday morning is the most valuable trading window.</p>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 16, color: S.muted }}>The secondary commercial strips in Prahran — High Street (the main chapel street-adjacent strip) and Greville Street (which runs east off Chapel Street into Prahran) — have different character and different economics. High Street Prahran is a working commercial strip serving the residential catchment with retail services, food, and hospitality at moderate price points. Greville Street is Melbourne's best-known vintage and records precinct, attracting a creative/music culture customer from across Melbourne. Both streets operate at lower rents than Chapel Street and serve a more locally-loyal customer base.</p>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 16, color: S.muted }}>Commercial Road is the highest-traffic arterial through Prahran, connecting Chapel Street to St Kilda Road and serving as the primary cycling and walking route between South Yarra and St Kilda. The hospitality and retail concentration on and immediately off Commercial Road benefits from this through-traffic without paying the Chapel Street premium. Rents on Commercial Road secondary positions run $6,000–$9,500/month — 25–35% below equivalent Chapel Street positions in South Yarra.</p>
        </section>
        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18, color: S.n900 }}>Competition Analysis</h2>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 16, color: S.muted }}>Prahran's competitive environment is well-served but not saturated. The suburb has around 120 food and drink venues serving a residential catchment of 25,000+ and a market-visitor catchment that adds 60,000+ visits per month. The customer-to-venue ratio is more favourable than Fitzroy or South Yarra. The competition gap most visible in Prahran is in quality breakfast and brunch — the Saturday market crowd generates demand for quality morning food that the current supply doesn't fully satisfy. Market-adjacent cafés consistently run 45-minute queues on Saturday mornings despite charging $35–$45 for brunch.</p>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 16, color: S.muted }}>The evening hospitality market in Prahran is underserved relative to the demographic's income and dining propensity. Residents with $102K average household income who want a quality mid-range dinner on a Tuesday night currently go to South Yarra or St Kilda because Prahran doesn't have enough quality options at $50–$80 per head. This gap is real and commercially available to operators who want to serve a loyal, high-income residential customer base.</p>
        </section>
        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18, color: S.n900 }}>What Works Here</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            <div style={{ padding: 18, background: S.emeraldBg, borderRadius: 12, border: `1px solid ${S.emeraldBdr}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: S.n900 }}>Market-Adjacent Brunch Café</span>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, margin: 0, lineHeight: 1.6 }}>Commercial Road within 150m of Prahran Market. Saturday morning 7am–1pm is the highest-revenue trading window in the suburb. $7–$9 coffee, $32–$50 brunch. Queues drive social proof. Revenue: $100,000–$150,000/month.</p>
            </div>
            <div style={{ padding: 18, background: S.emeraldBg, borderRadius: 12, border: `1px solid ${S.emeraldBdr}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: S.n900 }}>Quality Mid-Range Restaurant (evening)</span>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, margin: 0, lineHeight: 1.6 }}>50–70 seats, $55–$80 per head. Fills a genuine gap — Prahran residents go to St Kilda for what they can't find locally. Tuesday–Sunday dinner focus. Revenue: $90,000–$140,000/month.</p>
            </div>
            <div style={{ padding: 18, background: S.emeraldBg, borderRadius: 12, border: `1px solid ${S.emeraldBdr}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: S.n900 }}>Specialty Retail (Greville Street)</span>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, margin: 0, lineHeight: 1.6 }}>Vinyl, vintage, specialty homewares, independent fashion. Destination customers from across Melbourne come to Greville Street specifically. Rent $4,500–$7,000/month. Lower revenue ceiling but strong loyalty. Revenue: $35,000–$65,000/month.</p>
            </div>
          </div>
        </section>
        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18, color: S.n900 }}>Key Risks</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: 18, background: S.amberBg, borderRadius: 10, border: `1px solid ${S.amberBdr}` }}>
              <h4 style={{ fontSize: 14, fontWeight: 800, color: S.amber, marginBottom: 8 }}>Chapel Street Premium Confusion</h4>
              <p style={{ fontSize: 13, color: '#92400E', margin: 0, lineHeight: 1.6 }}>Prahran sits along the southern Chapel Street corridor where vacancy rates are higher than north Chapel. Operators who sign on Chapel Street in the Windsor-Prahran section without verifying specific foot counts risk paying Chapel Street face rents for a secondary-strip foot count. Verify block-by-block, not street-wide.</p>
            </div>
            <div style={{ padding: 18, background: S.amberBg, borderRadius: 10, border: `1px solid ${S.amberBdr}` }}>
              <h4 style={{ fontSize: 14, fontWeight: 800, color: S.amber, marginBottom: 8 }}>Market Day Dependency</h4>
              <p style={{ fontSize: 13, color: '#92400E', margin: 0, lineHeight: 1.6 }}>Market-adjacent operators can become dependent on Saturday morning trade for a disproportionate share of weekly revenue. If the Prahran Market ever closes or relocates — unlikely but not impossible — tenancies positioned specifically for market catchment would face significant disruption.</p>
            </div>
            <div style={{ padding: 18, background: S.amberBg, borderRadius: 10, border: `1px solid ${S.amberBdr}` }}>
              <h4 style={{ fontSize: 14, fontWeight: 800, color: S.amber, marginBottom: 8 }}>Limited Evening Foot Traffic on Some Streets</h4>
              <p style={{ fontSize: 13, color: '#92400E', margin: 0, lineHeight: 1.6 }}>Greville Street and High Street Prahran generate strong daytime foot counts but evening foot traffic is thinner than the residential density suggests. Evening hospitality on these secondary streets needs a destination concept strategy rather than a walk-in capture strategy.</p>
            </div>
          </div>
        </section>
        <SuburbPoll suburb="Prahran" votes={[57, 31, 12]} />
        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18, color: S.n900 }}>Nearby Suburbs to Compare</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
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
            <Link href="/analyse/melbourne/st-kilda" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 800, margin: 0, color: S.n900 }}>St Kilda</h4>
                  <VerdictBadge v="GO" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: S.brand }}>74</div>
                <div style={{ fontSize: 11, color: S.mutedLight, fontWeight: 600 }}>/ 100</div>
              </div>
            </Link>
            <Link href="/analyse/melbourne/richmond" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 800, margin: 0, color: S.n900 }}>Richmond</h4>
                  <VerdictBadge v="GO" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: S.brand }}>83</div>
                <div style={{ fontSize: 11, color: S.mutedLight, fontWeight: 600 }}>/ 100</div>
              </div>
            </Link>
          </div>
        </section>
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18, color: S.n900 }}>Final Verdict</h2>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 14, color: S.muted }}>Prahran is a GO — particularly for the market-adjacent Saturday morning brunch opportunity and for quality evening dining that serves the underserved residential demographic. The suburb sits in a commercial sweet spot: premium demographic ($102K average HHI) without South Yarra premium rents, strong foot traffic anchor (the market) without the seasonal volatility of St Kilda.</p>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 14, color: S.muted }}>The condition for success: market-adjacent or Greville Street positioning, with a concept built around the Saturday morning peak (brunch café) or the evening residential diner (quality restaurant at $55–$80/head). Operators who understand that Prahran's commercial calendar is shaped by the market will capitalise on one of Melbourne's most reliable foot traffic anchors. Operators who sign on Chapel Street in the Windsor section without block-level diligence will face a different and less favourable economic reality.</p>
        </section>
        <div style={{ background: 'linear-gradient(135deg, #047857, #059669)', borderRadius: 14, padding: 40, textAlign: 'center', marginBottom: 44 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: S.white, marginBottom: 12 }}>Analyse your Prahran address</h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 24, lineHeight: 1.6 }}>Get a specific rent benchmark, competitor map, and GO/CAUTION/NO verdict for your exact address. Free.</p>
          <Link href="/onboarding" style={{ background: S.white, color: S.emerald, borderRadius: 10, padding: '14px 32px', fontSize: 15, fontWeight: 800, textDecoration: 'none', display: 'inline-block' }}>Start free analysis →</Link>
        </div>
        <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 28, display: 'flex', gap: 16, justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Link href="/analyse/melbourne" style={{ fontSize: 13, fontWeight: 700, color: S.brand, textDecoration: 'none' }}>← Back to Melbourne</Link>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link href="/analyse/melbourne/south-yarra" style={{ fontSize: 13, fontWeight: 600, color: S.brand, textDecoration: 'none' }}>South Yarra</Link>
            <Link href="/analyse/melbourne/st-kilda" style={{ fontSize: 13, fontWeight: 600, color: S.brand, textDecoration: 'none' }}>St Kilda</Link>
            <Link href="/analyse/melbourne/richmond" style={{ fontSize: 13, fontWeight: 600, color: S.brand, textDecoration: 'none' }}>Richmond</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
