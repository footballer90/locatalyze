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
    headline: 'Opening a Business in Melbourne CBD VIC 3000: 2026 Location Analysis',
    description: "Australia's highest foot traffic address with Australia's highest rents. Hybrid work has permanently reshaped the economics — here is what still works and what doesn't in 2026.",
    datePublished: '2026-04-01',
    author: { '@type': 'Organization', name: 'Locatalyze' },
  },
  {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: [{
      '@type': 'Question',
      name: 'Is Melbourne CBD viable for independent cafés in 2026?',
      acceptedAnswer: { '@type': 'Answer', text: 'For most independent cafés, no. CBD retail rents of $20,000–$50,000 per month require 400+ daily customers at $8+ per transaction just to cover occupancy. Hybrid work has reduced peak Monday and Friday office density to 50–55% of 2019 levels. The laneway precincts remain viable but at premium rents, capturing tourist and spontaneous trade. QSR volume plays and premium fine dining have better structural economics in the CBD than the independent café model.' },
    }],
  },
]

export default function MelbourneCBDPage() {
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
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Melbourne CBD</span>
          </div>
          <h1 style={{ fontSize: 'clamp(26px,5vw,44px)', fontWeight: 900, color: S.white, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 14 }}>
            Opening a Business in Melbourne CBD VIC 3000: 2026 Location Analysis
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.78)', maxWidth: 600, lineHeight: 1.7, marginBottom: 22 }}>
            Australia's highest foot traffic address with Australia's highest rents. Hybrid work has permanently reshaped the economics — here is what still works and what doesn't in 2026.
          </p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <VerdictBadge v="CAUTION" />
            <span style={{ fontSize: 24, fontWeight: 900, color: S.white }}>72/100</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>Location score</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '44px 24px 80px' }}>

        <section style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: 28, marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 22, color: S.n900 }}>Location Scorecard</h2>
          <ScoreBar label="Foot Traffic" value={95} />
          <ScoreBar label="Demographics" value={78} />
          <ScoreBar label="Rent Viability" value={35} />
          <ScoreBar label="Competition Gap" value={58} />
        </section>

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18, color: S.n900 }}>Business Environment</h2>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 16, color: S.muted }}>Melbourne's CBD was the most vibrant independent hospitality precinct in Australia before 2020 — the laneway café culture, the coffee bars on Flinders Lane, the lunch trade from Collins Street law firms. That version of the CBD is structurally challenged in 2026. Office vacancy sits at 14%, which means roughly one in seven CBD office floors is empty. Hybrid work has reduced peak-day foot populations on Tuesdays and Wednesdays to 70–75% of pre-pandemic levels. Mondays and Fridays see 50–55%. The lunch trade that sustained 200 independent cafés across the CBD grid has thinned and consolidated.</p>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 16, color: S.muted }}>What remains is real but different. The laneway precincts — Degraves Street, Centre Place, Hardware Lane — have recovered because they serve tourist and spontaneous foot traffic rather than office workers. Degraves Street in summer 2025–2026 was running close to 2019 visitor numbers during peak periods. But these tenancies are also the most expensive in the country per square metre, with operators paying $800–$1,200/sqm annually in prime positions.</p>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 16, color: S.muted }}>The demographic of CBD visitors has shifted. The weekday lunch customer — a 35–55 year old professional earning $120K+ with a $20 lunch budget — is spending fewer days in the CBD. The tourist and leisure visitor is spending more days here as international travel recovered post-2023. This shift benefits hospitality concepts that serve a leisure demographic (full-service, experience-oriented) and disadvantages quick-service lunch concepts built around office density.</p>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 16, color: S.muted }}>The CBD still justifies premium rents for the right category. A 120-seat fine dining restaurant on Flinders Lane charging $130 per head can absorb a $30,000/month rent on 60% occupancy. A 40-seat independent café charging $6 for a flat white on the same block cannot. Understanding whether your concept's margin structure survives the rent is the only question that matters here.</p>
        </section>

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18, color: S.n900 }}>Competition Analysis</h2>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 16, color: S.muted }}>Competition in the Melbourne CBD is the most intense in Australia by venue count — 2,400+ food and beverage outlets operate within the CBD grid. QSR is most saturated, with customer choice making differentiation extremely difficult without brand recognition or price advantage. The specialty coffee category has consolidated — around 30–40 genuinely high-quality independents now serve a market that had 120+ before 2020. The premium dining category has recovered strongly, driven by returning corporate entertainment budgets and international business travel.</p>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 16, color: S.muted }}>The genuine competition gap in the CBD is in the lunch range of $18–$35 — quality, fresh, fast. The CBD has plenty of $12–$16 QSR and plenty of $80–$130 fine dining. The mid-tier that workers and visitors would pay $22–$28 for a genuinely good bowl or plate is relatively underserved. But the weekend foot traffic drop (40–50% vs peak Tuesday–Wednesday) eliminates 30–35% of potential weekly revenue for anyone modelling from a Thursday count.</p>
        </section>

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18, color: S.n900 }}>What Works Here</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            <div style={{ padding: 18, background: S.emeraldBg, borderRadius: 12, border: `1px solid ${S.emeraldBdr}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: S.n900 }}>Premium Fine Dining</span>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, margin: 0, lineHeight: 1.6 }}>Flinders Lane and Collins Street tier. $100–$150 per head, 60–80 seats, strong corporate lunch and private dining channels. Melbourne CBD is Australia's largest market for corporate entertainment. Revenue: $250,000–$400,000/month.</p>
            </div>
            <div style={{ padding: 18, background: S.emeraldBg, borderRadius: 12, border: `1px solid ${S.emeraldBdr}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: S.n900 }}>High-Volume QSR</span>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, margin: 0, lineHeight: 1.6 }}>Swanston Street or Bourke Street Mall position. 400+ transactions/day required to justify $20,000+/month rent. Franchise or proven format only — not a proving ground for new concepts. Revenue: $180,000–$280,000/month.</p>
            </div>
            <div style={{ padding: 18, background: S.amberBg, borderRadius: 12, border: `1px solid ${S.amberBdr}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: S.n900 }}>Laneway Specialty Coffee</span>
                <VerdictBadge v="CAUTION" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, margin: 0, lineHeight: 1.6 }}>Degraves Street or Centre Place. Tourist + worker hybrid catchment. Revenue drops 35–40% on weekends and public holidays. Must price for tourists ($7–$8 per coffee) to offset weekday volume losses. Revenue: $80,000–$130,000/month.</p>
            </div>
          </div>
        </section>

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18, color: S.n900 }}>Key Risks</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: 18, background: S.amberBg, borderRadius: 10, border: `1px solid ${S.amberBdr}` }}>
              <h4 style={{ fontSize: 14, fontWeight: 800, color: S.amber, marginBottom: 8 }}>Structural Office Vacancy</h4>
              <p style={{ fontSize: 13, color: '#92400E', margin: 0, lineHeight: 1.6 }}>14% office vacancy in CBD towers is not improving meaningfully. The hybrid workers who haven't returned are largely working from home permanently. Any business model that relies on pre-2020 weekday lunch density is underwriting itself against a market that no longer exists at those levels.</p>
            </div>
            <div style={{ padding: 18, background: S.amberBg, borderRadius: 10, border: `1px solid ${S.amberBdr}` }}>
              <h4 style={{ fontSize: 14, fontWeight: 800, color: S.amber, marginBottom: 8 }}>Lease Terms Are Punishing</h4>
              <p style={{ fontSize: 13, color: '#92400E', margin: 0, lineHeight: 1.6 }}>CBD landlords typically require 5+5 year leases with personal guarantees and bank guarantees of 6 months rent. A 10-year commitment at $25,000/month is $3,000,000 in rent obligation before any other costs. The downside risk on a failed CBD tenancy is existential for an independent operator.</p>
            </div>
            <div style={{ padding: 18, background: S.amberBg, borderRadius: 10, border: `1px solid ${S.amberBdr}` }}>
              <h4 style={{ fontSize: 14, fontWeight: 800, color: S.amber, marginBottom: 8 }}>Weekend Revenue Gap</h4>
              <p style={{ fontSize: 13, color: '#92400E', margin: 0, lineHeight: 1.6 }}>CBD foot traffic drops 40–50% on weekends versus peak Tuesday–Wednesday. Concepts that model revenue from a Thursday foot count consistently overstate annual revenue. Build your financial model on Monday and Saturday counts — that average is closer to the actual baseline.</p>
            </div>
          </div>
        </section>

        <SuburbPoll suburb="Melbourne CBD" votes={[32, 41, 27]} />

        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18, color: S.n900 }}>Nearby Suburbs to Compare</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <Link key="southbank" href="/analyse/melbourne/southbank" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 800, margin: 0, color: S.n900 }}>Southbank</h4>
                  <VerdictBadge v="CAUTION" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: S.brand }}>71</div>
                <div style={{ fontSize: 11, color: S.mutedLight, fontWeight: 600 }}>/ 100</div>
              </div>
            </Link>
            <Link key="fitzroy" href="/analyse/melbourne/fitzroy" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 800, margin: 0, color: S.n900 }}>Fitzroy</h4>
                  <VerdictBadge v="GO" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: S.brand }}>86</div>
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
          </div>
        </section>

        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18, color: S.n900 }}>Final Verdict</h2>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 14, color: S.muted }}>The Melbourne CBD is a CAUTION — not because of its foot traffic, which remains extraordinary, but because of what it costs to access that foot traffic. At $20,000–$50,000/month, you need a concept with the margin structure to absorb occupancy at 15–20% of revenue. That means a concept generating $150,000–$300,000 per month minimum. Independent cafés and small retailers rarely reach those numbers in the current office-density environment.</p>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 14, color: S.muted }}>The operators succeeding in the CBD in 2026 are those who either have the volume (QSR chains doing 500+ transactions daily), the margin (fine dining at $120+ per head), or the location intelligence (laneway operators who understood tourist recovery and positioned for it before rents normalised). Run a conservative, specific financial model before committing to any CBD lease — and model your worst week, not your best.</p>
        </section>

        <div style={{ background: 'linear-gradient(135deg, #047857, #059669)', borderRadius: 14, padding: 40, textAlign: 'center', marginBottom: 44 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: S.white, marginBottom: 12 }}>Analyse your Melbourne CBD address</h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 24, lineHeight: 1.6 }}>Get a specific rent benchmark, competitor map, and GO/CAUTION/NO verdict for your exact address. Free.</p>
          <Link href="/onboarding" style={{ background: S.white, color: S.emerald, borderRadius: 10, padding: '14px 32px', fontSize: 15, fontWeight: 800, textDecoration: 'none', display: 'inline-block' }}>
            Start free analysis →
          </Link>
        </div>

        <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 28, display: 'flex', gap: 16, justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Link href="/analyse/melbourne" style={{ fontSize: 13, fontWeight: 700, color: S.brand, textDecoration: 'none' }}>← Back to Melbourne</Link>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link href="/analyse/melbourne/southbank" style={{ fontSize: 13, fontWeight: 600, color: S.brand, textDecoration: 'none' }}>Southbank</Link>
            <Link href="/analyse/melbourne/fitzroy" style={{ fontSize: 13, fontWeight: 600, color: S.brand, textDecoration: 'none' }}>Fitzroy</Link>
            <Link href="/analyse/melbourne/docklands" style={{ fontSize: 13, fontWeight: 600, color: S.brand, textDecoration: 'none' }}>Docklands</Link>
          </div>
        </div>

      </div>
    </div>
  )
}
