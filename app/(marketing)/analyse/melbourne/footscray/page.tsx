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
    headline: 'Opening a Business in Footscray VIC 3011: 2026 Location Analysis',
    description: 'In genuine transition — and the transition is now clearly real. Vietnamese food culture meets an arriving professional cohort. Two customer bases, two price points, one unusually resilient business mo',
    datePublished: '2026-04-01',
    author: { '@type': 'Organization', name: 'Locatalyze' },
  },
  {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: [{
      '@type': 'Question',
      name: 'Is Footscray Melbourne a good location for opening a café in 2026?',
      acceptedAnswer: { '@type': 'Answer', text: 'Footscray is a strong GO for specialty coffee in 2026. Rents of $4,000–$6,500 per month are 40–50% below Fitzroy, while the professional residential catchment is growing at 8–10% annually. Specialty coffee operators who opened in Footscray in 2019–2022 have seen consistent growth as the professional' },
    }],
  },
]

export default function FootscrayPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FFFFFF', fontFamily: "'DM Sans','Helvetica Neue',Arial,sans-serif", color: S.n900 }}>
      {SCHEMAS.map((s, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />)}
<div style={{ background: 'linear-gradient(135deg, #0E7490 0%, #0891B2 100%)', padding: '52px 24px 44px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
            <Link href="/analyse/melbourne" style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>Melbourne</Link>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>›</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Footscray</span>
          </div>
          <h1 style={{ fontSize: 'clamp(26px,5vw,44px)', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 14 }}>
            Opening a Business in Footscray VIC 3011: 2026 Location Analysis
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.78)', maxWidth: 600, lineHeight: 1.7, marginBottom: 22 }}>
            In genuine transition — and the transition is now clearly real. Vietnamese food culture meets an arriving professional cohort. Two customer bases, two price points, one unusually resilient business model.
          </p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <VerdictBadge v="GO" />
            <span style={{ fontSize: 24, fontWeight: 900, color: S.white }}>77/100</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>Location score</span>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '44px 24px 80px' }}>
        <section style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: 28, marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 22, color: S.n900 }}>Location Scorecard</h2>
          <ScoreBar label="Foot Traffic" value={78} />
          <ScoreBar label="Demographics" value={72} />
          <ScoreBar label="Rent Viability" value={78} />
          <ScoreBar label="Competition Gap" value={76} />
        </section>
        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18, color: S.n900 }}>Business Environment</h2>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 16, color: S.muted }}>Footscray has been 'about to gentrify' for so long that scepticism about the transition was reasonable. That scepticism is no longer justified. The demographic data from 2022–2026 shows a clear shift: younger professional renters, priced out of the inner north, have arrived in Footscray in numbers sufficient to materially change the commercial landscape. Household income in Footscray has increased from an average of $55,000 in 2018 to approximately $68,000 in 2025. The character of the suburb has not changed — the Vietnamese community, the market, the multicultural texture are all intact — but the commercial opportunity has expanded.</p>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 16, color: S.muted }}>Vietnamese food is Footscray's dominant commercial characteristic and its most powerful competitive advantage. Footscray has been Melbourne's Vietnamese food hub since the Vietnamese-Australian community established itself here in the 1980s. The Vietnam Town precinct on Hopkins Street and Barkly Street contains some of the most authentic, long-standing Vietnamese restaurants in Australia — pho restaurants that have operated for 30+ years, banh mi shops, Vietnamese coffee venues, and grocery stores serving a community that extends well beyond Footscray itself. This isn't a niche market; it's a nationally recognised food destination that draws visitors from across Melbourne.</p>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 16, color: S.muted }}>The arriving professional cohort has brought its own commercial expectations. A barista who moves from Fitzroy to Footscray doesn't stop wanting specialty coffee; they bring their consumption habits with them. Specialty coffee operators in Footscray who opened in 2019–2022 have seen consistent growth as the professional residential base has expanded. The same pattern applies to natural wine bars, quality brunch concepts, and independent retail. These concepts are not competing with the Vietnamese food community — they're serving a different customer at a different time of day and price point.</p>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 16, color: S.muted }}>Rents in Footscray are among the most compelling of any inner-west Melbourne location. Commercial tenancies on Hopkins Street and Barkly Street run $4,000–$7,000/month — approximately 40–50% below equivalent Fitzroy positions. The foot traffic differential does not justify this rent gap entirely — Footscray generates 20,000+ weekly pedestrian passes on Hopkins Street, which is within 25% of Smith Street Fitzroy's count. For operators who are sensitive to rent economics, Footscray's risk-adjusted case is strong.</p>
        </section>
        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18, color: S.n900 }}>Competition Analysis</h2>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 16, color: S.muted }}>Footscray's competition falls into two entirely separate categories that rarely overlap. The Vietnamese food sector is well-established and community-loyal — a new Vietnamese restaurant in Footscray faces 40 years of accumulated competitor advantage and must offer something genuinely distinct to succeed. The specialty hospitality sector (coffee, natural wine, quality brunch) is emerging and underserved — a quality specialty coffee bar in Footscray in 2026 faces 3–4 competitors for a catchment that is actively looking for more options.</p>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 16, color: S.muted }}>The gap most visible in Footscray's competitive landscape is in quality evening dining for the professional residential base. The $45–$75 per head full-service restaurant that the arriving professional cohort wants is barely represented in the suburb. This demographic currently drives to Richmond or South Melbourne for dinner because Footscray doesn't offer enough at their preferred price point. An operator who can fill this gap — quality, full-service, $50–$80 per head — would face limited direct competition in a catchment that has the income and the appetite.</p>
        </section>
        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18, color: S.n900 }}>What Works Here</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            <div style={{ padding: 18, background: S.emeraldBg, borderRadius: 12, border: `1px solid ${S.emeraldBdr}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: S.n900 }}>Specialty Coffee Bar</span>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, margin: 0, lineHeight: 1.6 }}>Hopkins or Barkly Street. $6–$8 coffee, $20–$35 food. Professional residential catchment growing 8–10% annually. Tram corridor foot traffic. Rent $4,000–$6,500/month — Melbourne's best coffee economics. Revenue: $80,000–$120,000/month.</p>
            </div>
            <div style={{ padding: 18, background: S.emeraldBg, borderRadius: 12, border: `1px solid ${S.emeraldBdr}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: S.n900 }}>Quality Full-Service Restaurant</span>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, margin: 0, lineHeight: 1.6 }}>Evening focus. $50–$80 per head. Fills genuine gap for professional residential customer. Non-Vietnamese format only — don't compete against 40-year community operators. Revenue: $80,000–$130,000/month.</p>
            </div>
            <div style={{ padding: 18, background: S.amberBg, borderRadius: 12, border: `1px solid ${S.amberBdr}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: S.n900 }}>Vietnamese Food (authentic concept only)</span>
                <VerdictBadge v="CAUTION" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, margin: 0, lineHeight: 1.6 }}>Only viable with genuine Vietnamese culinary credentials and community connection. The existing operators have 20–40 year loyalty. Pho, banh mi, or specialty Vietnamese format with a specific point of difference. Revenue: $60,000–$100,000/month.</p>
            </div>
          </div>
        </section>
        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18, color: S.n900 }}>Key Risks</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: 18, background: S.amberBg, borderRadius: 10, border: `1px solid ${S.amberBdr}` }}>
              <h4 style={{ fontSize: 14, fontWeight: 800, color: S.amber, marginBottom: 8 }}>Gentrification Timeline Is Not Delivered Yet</h4>
              <p style={{ fontSize: 13, color: '#92400E', margin: 0, lineHeight: 1.6 }}>The demographic shift is real but not complete. The household income of $68K is higher than 2018 but still below Fitzroy ($98K) or Brunswick ($85K). Premium pricing strategies appropriate for Fitzroy demographics will underperform in Footscray's current income composition. Price for the actual market, not the projected future market.</p>
            </div>
            <div style={{ padding: 18, background: S.amberBg, borderRadius: 10, border: `1px solid ${S.amberBdr}` }}>
              <h4 style={{ fontSize: 14, fontWeight: 800, color: S.amber, marginBottom: 8 }}>Don't Compete With Vietnamese Community Operators</h4>
              <p style={{ fontSize: 13, color: '#92400E', margin: 0, lineHeight: 1.6 }}>The Vietnamese food community in Footscray has 40 years of customer loyalty and cultural authenticity that cannot be replicated. A non-Vietnamese operator entering the Vietnamese food category will lose this competition. Serve the professional arriving cohort; complement the Vietnamese community rather than competing with it.</p>
            </div>
            <div style={{ padding: 18, background: S.amberBg, borderRadius: 10, border: `1px solid ${S.amberBdr}` }}>
              <h4 style={{ fontSize: 14, fontWeight: 800, color: S.amber, marginBottom: 8 }}>Some Streets Have Lower Foot Traffic Than Hopkins/Barkly</h4>
              <p style={{ fontSize: 13, color: '#92400E', margin: 0, lineHeight: 1.6 }}>Footscray's commercial energy is concentrated on Hopkins Street and Barkly Street. Operators signing on adjacent streets without verifying specific foot counts may find significantly lower traffic than the suburb-level statistics suggest.</p>
            </div>
          </div>
        </section>
        <SuburbPoll suburb="Footscray" votes={[60, 28, 12]} />
        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18, color: S.n900 }}>Nearby Suburbs to Compare</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
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
          </div>
        </section>
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18, color: S.n900 }}>Final Verdict</h2>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 14, color: S.muted }}>Footscray is a GO — one of Melbourne's genuinely compelling opportunities for operators who can tolerate a suburb in transition rather than a fully matured market. The rent economics are the best in Melbourne's inner west, the demographic is improving, and the customer-to-quality-café ratio remains more favourable than the inner north. The window for early-mover advantage is 2024–2027.</p>
          <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 14, color: S.muted }}>The specific playbook: specialty coffee or quality evening restaurant on Hopkins or Barkly Street, serving the professional residential demographic that has arrived and is actively looking for more quality options. At $4,500–$6,500/month rent for a concept that generates $80,000–$120,000/month, the economics are among Melbourne's best. In 2028–2030, these rents will be materially higher as the suburb's transformation becomes more apparent. The time to sign is now.</p>
        </section>
        <div style={{ background: 'linear-gradient(135deg, #047857, #059669)', borderRadius: 14, padding: 40, textAlign: 'center', marginBottom: 44 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#FFFFFF', marginBottom: 12 }}>Analyse your Footscray address</h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 24, lineHeight: 1.6 }}>Get a specific rent benchmark, competitor map, and GO/CAUTION/NO verdict for your exact address. Free.</p>
          <Link href="/onboarding" style={{ background: S.white, color: S.emerald, borderRadius: 10, padding: '14px 32px', fontSize: 15, fontWeight: 800, textDecoration: 'none', display: 'inline-block' }}>Start free analysis →</Link>
        </div>
        <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 28, display: 'flex', gap: 16, justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Link href="/analyse/melbourne" style={{ fontSize: 13, fontWeight: 700, color: S.brand, textDecoration: 'none' }}>← Back to Melbourne</Link>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link href="/analyse/melbourne/docklands" style={{ fontSize: 13, fontWeight: 600, color: S.brand, textDecoration: 'none' }}>Docklands</Link>
            <Link href="/analyse/melbourne/northcote" style={{ fontSize: 13, fontWeight: 600, color: S.brand, textDecoration: 'none' }}>Northcote</Link>
            <Link href="/analyse/melbourne/brunswick" style={{ fontSize: 13, fontWeight: 600, color: S.brand, textDecoration: 'none' }}>Brunswick</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
