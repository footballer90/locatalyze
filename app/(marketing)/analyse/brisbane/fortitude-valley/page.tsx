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

export default function FortitudeValleyPage() {
  return (
    <div style={{ background: S.white }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px 20px', borderBottom: `1px solid ${S.border}` }}>
        <div style={{ fontSize: 12, color: S.muted }}>
          <Link href="/analyse" style={{ color: S.brand, textDecoration: 'none' }}>Analyse</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <Link href="/analyse/brisbane" style={{ color: S.brand, textDecoration: 'none' }}>Brisbane</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ fontWeight: 600 }}>Fortitude Valley</span>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '60px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 44, fontWeight: 900, lineHeight: 1.2, marginBottom: 8, color: S.n900 }}>Fortitude Valley</h1>
            <div style={{ fontSize: 16, color: S.muted }}>QLD 4006</div>
          </div>
          <VerdictBadge v="GO" />
        </div>

        <p style={{ fontSize: 18, lineHeight: 1.7, color: S.muted, maxWidth: 900, marginBottom: 40 }}>
          Fortitude Valley is Brisbane's transitional hub, shifting from entertainment district to 24-hour mixed-use precinct. James Street has emerged as an independent retail and premium food corridor rivalling West End for quality positioning. Rents are positioned between CBD premium and West End accessibility, making it ideal for established concepts with strong brand recognition. Weekday morning trade requires specific attention — the nightlife-to-daytime transition is incomplete, creating softer off-peak demand.
        </p>

        <div style={{ background: S.n50, borderRadius: 16, padding: 32, marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 28 }}>Opportunity Score: 74/100</h2>
          <div>
            <ScoreBar label="Foot Traffic" value={82} />
            <ScoreBar label="Area Demographics" value={74} />
            <ScoreBar label="Rent Viability" value={62} />
            <ScoreBar label="Competition Gap" value={68} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 40 }}>
          <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 12, color: S.muted, marginBottom: 8 }}>Prime Location Rent</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: S.brand }}>$5,000–$10,000</div>
            <div style={{ fontSize: 13, color: S.muted, marginTop: 4 }}>Ann/Brunswick/Wickham per month</div>
          </div>
          <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 12, color: S.muted, marginBottom: 8 }}>Secondary Locations</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: S.brand }}>$3,200–$6,500</div>
            <div style={{ fontSize: 13, color: S.muted, marginTop: 4 }}>Surrounding streets per month</div>
          </div>
          <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 12, color: S.muted, marginBottom: 8 }}>Median Income</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: S.brand }}>$78,000</div>
            <div style={{ fontSize: 13, color: S.muted, marginTop: 4 }}>Mixed professional and creative demographic</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '60px 20px', borderTop: `1px solid ${S.border}` }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 32 }}>Fortitude Valley Market Analysis</h2>

        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>The Nightlife-to-Daytime Transition</h3>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: S.muted, marginBottom: 24 }}>
          Fortitude Valley's history as Brisbane's entertainment district (pubs, clubs, late-night venues) is still dominant in perception and foot traffic patterns. However, the precinct is transitioning to mixed-use with increasing daytime food, retail, and office use. This creates opportunity for daytime-focused concepts, but also creates risk: weekday morning trade (7–10am) is substantially softer than West End or Paddington. Concepts with strong evening positioning (dinner, drinks) will succeed; breakfast-first models risk underperformance.
        </p>

        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>James Street — Brisbane's Fastest-Growing Independent Retail Corridor</h3>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: S.muted, marginBottom: 24 }}>
          James Street has emerged as the premier independent retail and premium food destination in Brisbane. Fashion, design, and lifestyle retailers have established a genuine precinct culture. Food offering ranges from premium restaurants to speciality coffee and casual dining. James Street competes directly with West End and Paddington Given Terrace for quality-conscious customers. Rents ($6,000–$10,000/mo) are positioned between CBD and West End, justified by foot traffic and demographic positioning.
        </p>

        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Rent Viability Caution — Why Scores Lower Than Expected</h3>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: S.muted, marginBottom: 24 }}>
          Rent viability (62/100) is lower than foot traffic might suggest because rent is high relative to weekday daytime spending power. The $5,000–$10,000/mo rent assumes evening and weekend performance to offset daytime softness. Concepts positioned for day trade only (office workers, morning shoppers) will struggle. Only concepts with strong evening positioning should target prime James Street locations; daytime-focused concepts are better served on secondary streets at lower rent.
        </p>

        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>High Competition on James Street</h3>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: S.muted, marginBottom: 0 }}>
          James Street's success has attracted significant operator density. The competition gap (68/100) reflects that demand is strong but operator supply is also elevated. Differentiation through brand, cuisine positioning, and unique offering is critical. Generic food or retail concepts face steep competition; niche, distinctive, or established-brand concepts will succeed.
        </p>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '60px 20px', borderTop: `1px solid ${S.border}` }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 32 }}>Detailed Opportunity Analysis</h2>

        <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 24, marginBottom: 28 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: S.emerald, marginBottom: 12 }}>Best For (GO Categories)</h3>
          <ul style={{ fontSize: 14, lineHeight: 1.8, color: S.muted, margin: 0, paddingLeft: 20 }}>
            <li>Premium restaurants with evening focus (dinner revenue anchors)</li>
            <li>Wine and cocktail bars (established nightlife + daytime transition)</li>
            <li>Independent fashion and design retail (James Street precinct culture)</li>
            <li>Established-brand concepts with strong recognition (compete on positioning not novelty)</li>
            <li>Concepts with multi-daypart positioning (breakfast soft; evening/weekend strength)</li>
          </ul>
        </div>

        <div style={{ background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 12, padding: 24, marginBottom: 28 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: S.amber, marginBottom: 12 }}>Caution (Higher Risk)</h3>
          <ul style={{ fontSize: 14, lineHeight: 1.8, color: S.muted, margin: 0, paddingLeft: 20 }}>
            <li>Breakfast-first café concepts (weekday morning trade too soft)</li>
            <li>Concepts without established brand or unique differentiation</li>
            <li>Quick-service positioned for office worker lunch (limited office population)</li>
            <li>Emerging concepts without capital for competitive positioning</li>
            <li>Daytime-focused retail (limited deep retail demographics)</li>
          </ul>
        </div>

        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, marginTop: 32 }}>Why Rents Are High Relative to Viability</h3>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: S.muted, marginBottom: 16 }}>
          Fortitude Valley rents ($5,000–$10,000/mo) are aggressive for daytime cash flow but justified by evening and weekend revenue potential. Operators pay a "nightlife + transition premium." Concepts that can't fill that evening premium should negotiate secondary street locations at $3,200–$6,500/mo where daytime positioning is more viable.
        </p>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '60px 20px', borderTop: `1px solid ${S.border}` }}>
        <SuburbPoll suburb="Fortitude Valley" />
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '60px 20px', borderTop: `1px solid ${S.border}` }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 24 }}>Nearby Suburbs Worth Comparing</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          <NearbySuburbCard name="Brisbane CBD" slug="brisbane-cbd" score={77} verdict="GO" />
          <NearbySuburbCard name="New Farm" slug="new-farm" score={80} verdict="GO" />
          <NearbySuburbCard name="Nundah" slug="nundah" score={74} verdict="GO" />
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '60px 20px', borderTop: `1px solid ${S.border}` }}>
        <div style={{ background: S.brandLight, borderRadius: 16, padding: 40, textAlign: 'center' as const }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16, color: S.white }}>Ready to Analyze Fortitude Valley?</h2>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: S.white, marginBottom: 24 }}>Get detailed demographic data, James Street competitor maps, and rent forecasts.</p>
          <Link href="/onboarding" style={{ display: 'inline-block', background: S.white, color: S.brand, padding: '14px 32px', borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: 15 }}>Start Free Analysis →</Link>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 20px', borderTop: `1px solid ${S.border}`, color: S.muted }}>
        <div style={{ fontSize: 13, marginBottom: 20 }}>
          <Link href="/analyse/brisbane" style={{ color: S.brand, textDecoration: 'none', fontWeight: 600 }}>← Back to Brisbane</Link>
        </div>
        <p style={{ fontSize: 12, marginBottom: 0 }}>Compare with Brisbane CBD, New Farm, or Nundah to find your ideal location.</p>
      </div>
    </div>
  )
}
