'use client'
import Link from 'next/link'
import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

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

export default function BrisbaneCBDPage() {
  return (
    <div style={{ background: S.white }}>
      {/* Breadcrumbs */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px 20px', borderBottom: `1px solid ${S.border}` }}>
        <div style={{ fontSize: 12, color: S.muted }}>
          <Link href="/analyse" style={{ color: S.brand, textDecoration: 'none' }}>Analyse</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <Link href="/analyse/brisbane" style={{ color: S.brand, textDecoration: 'none' }}>Brisbane</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ fontWeight: 600 }}>Brisbane CBD</span>
        </div>
      </div>

      {/* Hero Section */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '60px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 44, fontWeight: 900, lineHeight: 1.2, marginBottom: 8, color: S.n900 }}>Brisbane CBD</h1>
            <div style={{ fontSize: 16, color: S.muted }}>QLD 4000</div>
          </div>
          <VerdictBadge v="GO" />
        </div>

        <p style={{ fontSize: 18, lineHeight: 1.7, color: S.muted, maxWidth: 900, marginBottom: 40 }}>
          Brisbane's central business district is entering a transformative phase. Cross River Rail (opening 2026) will introduce four new underground stations, fundamentally reshaping foot traffic patterns and commute accessibility. Queen Street Mall remains a retail anchor, but the future opportunity lies in CBD fringe locations and riverfront food/beverage positioning. This is the highest-traffic, highest-rent opportunity in Brisbane — suited for established concepts with strong capital.
        </p>

        {/* Score Section */}
        <div style={{ background: S.n50, borderRadius: 16, padding: 32, marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 28 }}>Opportunity Score: 77/100</h2>
          <div>
            <ScoreBar label="Foot Traffic" value={85} />
            <ScoreBar label="Area Demographics" value={82} />
            <ScoreBar label="Rent Viability" value={55} />
            <ScoreBar label="Competition Gap" value={65} />
          </div>
        </div>

        {/* Key Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 40 }}>
          <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 12, color: S.muted, marginBottom: 8 }}>Commercial Rent Range</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: S.brand }}>$8,000–$22,000</div>
            <div style={{ fontSize: 13, color: S.muted, marginTop: 4 }}>Queen Street Mall precinct per month</div>
          </div>
          <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 12, color: S.muted, marginBottom: 8 }}>Fringe Rent Range</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: S.brand }}>$4,500–$9,000</div>
            <div style={{ fontSize: 13, color: S.muted, marginTop: 4 }}>CBD fringe locations per month</div>
          </div>
          <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 12, color: S.muted, marginBottom: 8 }}>Median Income</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: S.brand }}>$90,000</div>
            <div style={{ fontSize: 13, color: S.muted, marginTop: 4 }}>Affluent CBD workforce demographic</div>
          </div>
        </div>
      </div>

      {/* Market Analysis */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '60px 20px', borderTop: `1px solid ${S.border}` }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 32 }}>Brisbane CBD Market Analysis</h2>

        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>The Cross River Rail Advantage</h3>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: S.muted, marginBottom: 24 }}>
          Cross River Rail will add four new CBD underground stations (Roma Street, Edward Street, Ann Street, and the future Woolly extension). This fundamentally redistributes foot traffic away from Queen Street and towards the river precinct. Eagle Street, which runs parallel to the Brisbane River, will see the greatest traffic uplift. The current Queen Street dominance is transitional — savvy operators are positioning for the post-2026 foot traffic redistribution now.
        </p>

        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Premium Café Positioning on Eagle Street</h3>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: S.muted, marginBottom: 24 }}>
          Eagle Street Riverfront has the most unmet premium café demand in Brisbane CBD. Businesses targeting high-income workers, tourists (via South Bank), and riverside precinct visitors are underserved. A quality speciality coffee concept or premium brunch offering would face significant less direct competition than Queen Street. The rent premium ($1,500–$2,500 higher per month) is justified by traffic exclusivity and demographic targeting.
        </p>

        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>The CBD Lunchtime Economy Strength</h3>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: S.muted, marginBottom: 24 }}>
          Brisbane CBD's lunchtime economy (11:30am–2:00pm) is exceptionally strong. The CBD workforce (50,000+ employees) creates consistent daily foot traffic. However, breakfast (7:00am–10:00am) is softer than Sydney or Melbourne equivalents, and dinner (6:00pm–9:00pm) is underdeveloped except in specific precincts. Concepts optimised for lunch (quick-service, salad bars, casual dining) outperform breakfast-first or dinner-first positioning.
        </p>

        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Rent Viability Caution</h3>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: S.muted, marginBottom: 0 }}>
          Rent viability scores lowest (55/100) among Brisbane's GO-rated suburbs. This reflects that commercial rent ($8,000–$22,000/mo) is aggressive relative to local turnover potential. Queen Street Mall rental commissions (12–15%) further compress margins. Only established concepts with strong unit economics should target CBD prime locations. Emerging concepts should prove model on fringe locations ($4,500–$9,000/mo) before attempting premium rent.
        </p>
      </div>

      {/* Detailed Opportunity Analysis */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '60px 20px', borderTop: `1px solid ${S.border}` }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 32 }}>Detailed Opportunity Analysis</h2>

        <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 24, marginBottom: 28 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: S.emerald, marginBottom: 12 }}>Best For (GO Categories)</h3>
          <ul style={{ fontSize: 14, lineHeight: 1.8, color: S.muted, margin: 0, paddingLeft: 20 }}>
            <li>Premium café concepts with strong unit economics ($8+ per transaction)</li>
            <li>Lunch-optimised quick-service (12–2pm focus)</li>
            <li>Niche independent retail with high price points</li>
            <li>Professional services (accounting, law, consulting) with recurring revenue</li>
            <li>Well-capitalized franchise systems with track record</li>
          </ul>
        </div>

        <div style={{ background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 12, padding: 24, marginBottom: 28 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: S.amber, marginBottom: 12 }}>Caution (Higher Risk)</h3>
          <ul style={{ fontSize: 14, lineHeight: 1.8, color: S.muted, margin: 0, paddingLeft: 20 }}>
            <li>Emerging food concepts without proven traction</li>
            <li>Low-margin food models (70% food cost, thin margins)</li>
            <li>Breakfast-first concepts (weak Brisbane morning trade)</li>
            <li>Retailers dependent on foot traffic (online competition)</li>
            <li>Concepts lacking established brand recognition</li>
          </ul>
        </div>

        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, marginTop: 32 }}>Queen Street Mall vs Eagle Street Positioning</h3>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: S.muted, marginBottom: 16 }}>
          Queen Street Mall (food court focus) generates highest traffic but lowest flexibility. Tenants pay 12–15% commission on top of base rent, heavily compressing margins. Eagle Street and fringe locations offer lower commissions, higher positioning control, and better unit economics. For 2026 onwards: Edge Street locations are the premium positioning for independent concepts.
        </p>
      </div>

      {/* Poll */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '60px 20px', borderTop: `1px solid ${S.border}` }}>
        <SuburbPoll suburb="Brisbane CBD" />
      </div>

      {/* Nearby Suburbs */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '60px 20px', borderTop: `1px solid ${S.border}` }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 24 }}>Nearby Suburbs Worth Comparing</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          <NearbySuburbCard name="South Brisbane" slug="south-brisbane" score={82} verdict="GO" />
          <NearbySuburbCard name="Fortitude Valley" slug="fortitude-valley" score={74} verdict="GO" />
          <NearbySuburbCard name="West End" slug="west-end" score={85} verdict="GO" />
        </div>
      </div>

      {/* CTA */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '60px 20px', borderTop: `1px solid ${S.border}` }}>
        <div style={{ background: S.brandLight, borderRadius: 16, padding: 40, textAlign: 'center' as const }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16, color: S.white }}>Ready to Analyze Brisbane CBD?</h2>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: S.white, marginBottom: 24 }}>Get detailed demographic data, competitor analysis, and rent forecasts for Brisbane CBD locations.</p>
          <Link href="/onboarding" style={{ display: 'inline-block', background: S.white, color: S.brand, padding: '14px 32px', borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: 15 }}>Start Free Analysis →</Link>
        </div>
      </div>

      {/* Footer Nav */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 20px', borderTop: `1px solid ${S.border}`, color: S.muted }}>
        <div style={{ fontSize: 13, marginBottom: 20 }}>
          <Link href="/analyse/brisbane" style={{ color: S.brand, textDecoration: 'none', fontWeight: 600 }}>← Back to Brisbane</Link>
        </div>
        <p style={{ fontSize: 12, marginBottom: 0 }}>Compare with South Brisbane, Fortitude Valley, or West End to find your ideal Brisbane location.</p>
      </div>
    </div>
  )
}
