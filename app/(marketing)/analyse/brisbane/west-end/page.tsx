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
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
        {['Yes', 'Maybe', 'No'].map((opt, i) => {
          const pct = Math.round((votes[i] / total) * 100)
          return (
            <button key={opt} onClick={() => handleVote(i)} disabled={voted !== null}
              style={{ position: 'relative', border: `1.5px solid ${voted === i ? S.emeraldBdr : S.border}`, borderRadius: 10, padding: '12px 16px', background: S.white, cursor: voted === null ? 'pointer' : 'default', textAlign: 'left' as const, fontFamily: 'inherit', overflow: 'hidden' }}>
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
          <p style={{ fontSize: 13, color: '#047857', margin: 0 }}>Run a full analysis for {suburb}: <Link href="/onboarding" style={{ fontWeight: 700, textDecoration: 'underline' }}>Start free →</Link></p>
        </div>
      )}
    </div>
  )
}

function NearbySuburbCard({ name, slug, score, verdict }: { name: string; slug: string; score: number; verdict: Verdict }) {
  return (
    <Link href={`/analyse/brisbane/${slug}`}>
      <div style={{ background: S.n50, border: `1px solid ${S.border}`, borderRadius: 10, padding: 16, cursor: 'pointer', textDecoration: 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{name}</div>
            <div style={{ fontSize: 12, color: S.muted }}>Score: {score}</div>
          </div>
          <VerdictBadge v={verdict} />
        </div>
      </div>
    </Link>
  )
}

export default function WestEndPage() {
  return (
    <div style={{ background: S.white }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px 20px', borderBottom: `1px solid ${S.border}` }}>
        <div style={{ fontSize: 12, color: S.muted }}>
          <Link href="/analyse" style={{ color: S.brand, textDecoration: 'none' }}>Analyse</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <Link href="/analyse/brisbane" style={{ color: S.brand, textDecoration: 'none' }}>Brisbane</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ fontWeight: 600 }}>West End</span>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '60px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 44, fontWeight: 900, lineHeight: 1.2, marginBottom: 8, color: S.n900 }}>West End</h1>
            <div style={{ fontSize: 16, color: S.muted }}>QLD 4101</div>
          </div>
          <VerdictBadge v="GO" />
        </div>

        <p style={{ fontSize: 18, lineHeight: 1.7, color: S.muted, maxWidth: 900, marginBottom: 40 }}>
          West End is Brisbane's most walkable suburb and the flagship of the city's food and retail renaissance. Walk Score 78, diverse cultural communities (Latin American, Greek, Vietnamese), QUT proximity, and Boundary Street's all-day precinct positioning create genuinely exceptional opportunity. Rents are lower than premium South Brisbane or CBD yet foot traffic and demographics match. Multiple competitors within 500m remain viable due to demand depth. This is the highest-viability inner suburb for emerging concepts.
        </p>

        <div style={{ background: S.n50, borderRadius: 16, padding: 32, marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 28 }}>Opportunity Score: 85/100 (Highest Brisbane Score)</h2>
          <div>
            <ScoreBar label="Foot Traffic" value={88} />
            <ScoreBar label="Area Demographics" value={84} />
            <ScoreBar label="Rent Viability" value={76} />
            <ScoreBar label="Competition Gap" value={82} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 40 }}>
          <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 12, color: S.muted, marginBottom: 8 }}>Boundary Street Prime</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: S.brand }}>$3,200–$5,800</div>
            <div style={{ fontSize: 13, color: S.muted, marginTop: 4 }}>Premium precinct per month</div>
          </div>
          <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 12, color: S.muted, marginBottom: 8 }}>Secondary Locations</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: S.brand }}>$2,200–$4,000</div>
            <div style={{ fontSize: 13, color: S.muted, marginTop: 4 }}>Adjacent streets per month</div>
          </div>
          <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 12, color: S.muted, marginBottom: 8 }}>Median Income</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: S.brand }}>$85,000</div>
            <div style={{ fontSize: 13, color: S.muted, marginTop: 4 }}>Quality demographic base</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '60px 20px', borderTop: `1px solid ${S.border}` }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 32 }}>Why West End is Brisbane's Top Suburb</h2>

        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Walk Score 78 — Brisbane's Most Pedestrian-Friendly Precinct</h3>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: S.muted, marginBottom: 24 }}>
          West End is the only Brisbane suburb with Walk Score 78 — comparable to inner-city Melbourne and Sydney suburbs. Boundary Street creates a continuous pedestrian shopping experience with active ground-floor retail, wide footpaths, outdoor dining culture, and genuine street vibrancy. This pedestrian-focused positioning drives substantially higher foot traffic per capita than car-dependent suburbs.
        </p>

        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>All-Day Precinct — Balanced Day-Part Revenue</h3>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: S.muted, marginBottom: 24 }}>
          Unlike CBD (concentrated lunchtime), South Brisbane (evening/weekend), or Fortitude Valley (nightlife heavy), West End generates balanced foot traffic across all day-parts. Breakfast, lunch, afternoon tea, and evening trade all perform. QUT student population (15,000+) drives consistent weekday daytime traffic. Weekend foot traffic rivals CBD. This makes West End suitable for any time-of-day concept — no day-part penalty.
        </p>

        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Cultural Diversity and Food Tourism</h3>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: S.muted, marginBottom: 24 }}>
          West End's Latin American, Greek, Vietnamese, and Middle Eastern communities create genuine food tourism corridors. Authentic cuisine operators find ready audiences. This cultural diversity supports premium positioning for ethnic restaurants while also supporting quick-service, casual dining, and pastry shops. Interstate migration to Brisbane is selecting West End as the destination — Sydney and Melbourne food culture expectations are highest here.
        </p>

        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Why 5 Competitors Within 500m Is Still Viable</h3>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: S.muted, marginBottom: 24 }}>
          West End's competition gap (82/100) is among Brisbane's highest despite having numerous operators. Demand depth is exceptional — foot traffic is sufficient to sustain multiple high-quality concepts in close proximity. Different cuisines and positioning (casual vs premium, healthy vs indulgent, etc.) allow specialization and coexistence. This is rare in Australian retail.
        </p>

        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Rent Viability — Best Rent-to-Turnover Ratio in Inner Brisbane</h3>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: S.muted, marginBottom: 0 }}>
          West End achieves 76/100 rent viability — highest among GO-rated inner suburbs — because rents ($3,200–$5,800/mo) are significantly lower than CBD or South Brisbane premium locations, yet foot traffic and demographics are comparable. This creates best-in-class unit economics for emerging concepts. You get Paddington-level customer quality at West End pricing.
        </p>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '60px 20px', borderTop: `1px solid ${S.border}` }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 32 }}>Detailed Opportunity Analysis</h2>

        <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 24, marginBottom: 28 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: S.emerald, marginBottom: 12 }}>Best For (GO Categories)</h3>
          <ul style={{ fontSize: 14, lineHeight: 1.8, color: S.muted, margin: 0, paddingLeft: 20 }}>
            <li>Emerging food concepts (first-location risk spreading across audience)</li>
            <li>Cultural cuisine positioning — especially Latin, Greek, Vietnamese, Asian</li>
            <li>Quality casual dining and upscale quick-service</li>
            <li>Boutique and independent retail</li>
            <li>Wellness, health services, and fitness concepts</li>
            <li>Any concept leveraging food tourism and walkability</li>
          </ul>
        </div>

        <div style={{ background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 12, padding: 24, marginBottom: 28 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: S.amber, marginBottom: 12 }}>Caution (Moderate Risk)</h3>
          <ul style={{ fontSize: 14, lineHeight: 1.8, color: S.muted, margin: 0, paddingLeft: 20 }}>
            <li>Concepts requiring extensive on-site parking (West End is pedestrian-centric)</li>
            <li>High-volume, low-margin models (rent-to-margin mismatch)</li>
            <li>Generic or undifferentiated offerings (competition is increasingly sophisticated)</li>
          </ul>
        </div>

        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, marginTop: 32 }}>West End vs Paddington: The Emerging vs Established Play</h3>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: S.muted, marginBottom: 16 }}>
          Paddington (87/100) scores higher than West End (85/100) due to slightly higher demographics and positioning, but West End has better rent viability. Paddington is established; West End is transitional. Choose West End for emerging concepts needing better unit economics; choose Paddington for established concepts willing to pay for premium positioning.
        </p>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '60px 20px', borderTop: `1px solid ${S.border}` }}>
        <SuburbPoll suburb="West End" />
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '60px 20px', borderTop: `1px solid ${S.border}` }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 24 }}>Nearby Suburbs Worth Comparing</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          <NearbySuburbCard name="South Brisbane" slug="south-brisbane" score={82} verdict="GO" />
          <NearbySuburbCard name="Paddington" slug="paddington" score={87} verdict="GO" />
          <NearbySuburbCard name="New Farm" slug="new-farm" score={80} verdict="GO" />
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '60px 20px', borderTop: `1px solid ${S.border}` }}>
        <div style={{ background: S.brandLight, borderRadius: 16, padding: 40, textAlign: 'center' as const }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16, color: S.white }}>Ready to Open in West End?</h2>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: S.white, marginBottom: 24 }}>Get detailed Boundary Street competitor maps, foot traffic data, and rent forecasts.</p>
          <Link href="/onboarding" style={{ display: 'inline-block', background: S.white, color: S.brand, padding: '14px 32px', borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: 15 }}>Start Free Analysis →</Link>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 20px', borderTop: `1px solid ${S.border}`, color: S.muted }}>
        <div style={{ fontSize: 13, marginBottom: 20 }}>
          <Link href="/analyse/brisbane" style={{ color: S.brand, textDecoration: 'none', fontWeight: 600 }}>← Back to Brisbane</Link>
        </div>
        <p style={{ fontSize: 12, marginBottom: 0 }}>Compare with South Brisbane, Paddington, or New Farm to make your location decision.</p>
      </div>
    </div>
  )
}
