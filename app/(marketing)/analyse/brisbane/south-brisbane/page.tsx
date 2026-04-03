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

export default function SouthBrisbanePage() {
  return (
    <div style={{ background: S.white }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px 20px', borderBottom: `1px solid ${S.border}` }}>
        <div style={{ fontSize: 12, color: S.muted }}>
          <Link href="/analyse" style={{ color: S.brand, textDecoration: 'none' }}>Analyse</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <Link href="/analyse/brisbane" style={{ color: S.brand, textDecoration: 'none' }}>Brisbane</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ fontWeight: 600 }}>South Brisbane</span>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '60px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 44, fontWeight: 900, lineHeight: 1.2, marginBottom: 8, color: S.n900 }}>South Brisbane</h1>
            <div style={{ fontSize: 16, color: S.muted }}>QLD 4101</div>
          </div>
          <VerdictBadge v="GO" />
        </div>

        <p style={{ fontSize: 18, lineHeight: 1.7, color: S.muted, maxWidth: 900, marginBottom: 40 }}>
          South Brisbane is Brisbane's cultural and culinary heartland. The Gallery of Modern Art (GOMA), Queensland Performing Arts Centre (QPAC), Queensland Museum, and South Bank Parklands create exceptional foot traffic and a tourist multiplier effect. Grey Street and Stanley Street are the strongest independent food and retail corridors in Brisbane. This is the highest-opportunity inner-south suburb for food, beverage, and premium retail positioning — with significantly better rent viability than Brisbane CBD.
        </p>

        <div style={{ background: S.n50, borderRadius: 16, padding: 32, marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 28 }}>Opportunity Score: 82/100</h2>
          <div>
            <ScoreBar label="Foot Traffic" value={83} />
            <ScoreBar label="Demographics" value={84} />
            <ScoreBar label="Rent Viability" value={72} />
            <ScoreBar label="Competition Gap" value={79} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 40 }}>
          <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 12, color: S.muted, marginBottom: 8 }}>Grey Street / Stanley Street</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: S.brand }}>$4,500–$8,000</div>
            <div style={{ fontSize: 13, color: S.muted, marginTop: 4 }}>Premium precinct rent per month</div>
          </div>
          <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 12, color: S.muted, marginBottom: 8 }}>Secondary Locations</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: S.brand }}>$3,000–$5,500</div>
            <div style={{ fontSize: 13, color: S.muted, marginTop: 4 }}>Adjacent street rent per month</div>
          </div>
          <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 12, color: S.muted, marginBottom: 8 }}>Median Income</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: S.brand }}>$92,000</div>
            <div style={{ fontSize: 13, color: S.muted, marginTop: 4 }}>Affluent demographic base</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '60px 20px', borderTop: `1px solid ${S.border}` }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 32 }}>South Brisbane's Cultural Anchor Advantage</h2>

        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>GOMA, QPAC, and Museum Effect</h3>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: S.muted, marginBottom: 24 }}>
          The Gallery of Modern Art, Queensland Performing Arts Centre, and Queensland Museum generate consistent foot traffic throughout the week, with peaks on weekends and school holidays. These anchors drive tourism multipliers — visitors typically spend 3–4 hours in the precinct, creating time-of-visit food purchasing. Unlike CBD (concentrated lunchtime), South Bank visitors are spread across breakfast, lunch, afternoon tea, and casual dining. This creates more even revenue distribution across day-parts.
        </p>

        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Grey Street — Brisbane's Strongest Independent Restaurant Corridor</h3>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: S.muted, marginBottom: 24 }}>
          Grey Street is home to Brisbane's highest-quality independent restaurant cluster. The street's tree-lined positioning, outdoor dining culture, and walkability create an authentic "laneway dining" feeling. High-end restaurants ({'>'} $40 mains) have more success on Grey Street than anywhere else in Brisbane. The rents ($6,000–$8,000/mo for prime locations) are justified by positioning and crowd quality. Established restaurants can command premium pricing; emerging concepts should prove traction on secondary streets first.
        </p>

        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Stanley Street East — Emerging Café Corridor</h3>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: S.muted, marginBottom: 24 }}>
          Stanley Street (East Brisbane direction) is showing early signs of the Grey Street trajectory. Café and light-lunch offerings are increasingly sophisticated. Rents are 30–40% lower than Grey Street ($3,500–$5,000/mo), creating better unit economics for emerging concepts. Weekend brunch is particularly strong. This is a first-mover location for quality café positioning at achievable rent points.
        </p>

        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Tourism Multiplier from South Bank Parklands</h3>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: S.muted, marginBottom: 0 }}>
          South Bank Parklands (44 hectares of gardens, playgrounds, and event space) attracts 10+ million visitors annually. The South Brisbane location benefits from visitor overflow, especially families taking breaks from parkland time. Casual dining, ice cream, beverage concepts, and quick-service gain significant traffic uplift from parkland foot traffic. Seasonal events and school holidays create pronounced traffic spikes.
        </p>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '60px 20px', borderTop: `1px solid ${S.border}` }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 32 }}>Detailed Opportunity Analysis</h2>

        <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 24, marginBottom: 28 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: S.emerald, marginBottom: 12 }}>Best For (GO Categories)</h3>
          <ul style={{ fontSize: 14, lineHeight: 1.8, color: S.muted, margin: 0, paddingLeft: 20 }}>
            <li>Premium independent restaurants ($40+ mains, Grey Street focus)</li>
            <li>Quality café positioning (Stanley Street East emerging lane)</li>
            <li>Wine bars and cocktail venues (Grey Street anchors</li>
            <li>Casual dining and family restaurants (QPAC/GOMA visitor base)</li>
            <li>Ice cream, dessert, and beverage concepts (parkland foot traffic)</li>
            <li>Premium retail and gift shops (tourist and local spending)</li>
          </ul>
        </div>

        <div style={{ background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 12, padding: 24, marginBottom: 28 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: S.amber, marginBottom: 12 }}>Caution (Higher Risk)</h3>
          <ul style={{ fontSize: 14, lineHeight: 1.8, color: S.muted, margin: 0, paddingLeft: 20 }}>
            <li>Budget concepts on premium streets (rent-to-pricing mismatch)</li>
            <li>Concepts requiring high weekday office worker traffic (South Brisbane is evening/weekend heavy)</li>
            <li>Retail dependent on local residential (limited deep residential base)</li>
            <li>Concepts without brand recognition on Grey Street (competition is established)</li>
          </ul>
        </div>

        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, marginTop: 32 }}>Why South Brisbane Scores Higher Than CBD</h3>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: S.muted, marginBottom: 16 }}>
          South Brisbane's rent viability (72/100) significantly exceeds Brisbane CBD (55/100) because foot traffic and customer spending power are comparable, but rents are 50% lower. You're not paying CBD premium pricing for cultural foot traffic. Additionally, South Brisbane's competition gap (79/100) is among Brisbane's highest — demand exceeds operator supply, giving newer entrants room to establish.
        </p>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '60px 20px', borderTop: `1px solid ${S.border}` }}>
        <SuburbPoll suburb="South Brisbane" />
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '60px 20px', borderTop: `1px solid ${S.border}` }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 24 }}>Nearby Suburbs Worth Comparing</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          <NearbySuburbCard name="West End" slug="west-end" score={85} verdict="GO" />
          <NearbySuburbCard name="Brisbane CBD" slug="brisbane-cbd" score={77} verdict="GO" />
          <NearbySuburbCard name="New Farm" slug="new-farm" score={80} verdict="GO" />
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '60px 20px', borderTop: `1px solid ${S.border}` }}>
        <div style={{ background: S.brandLight, borderRadius: 16, padding: 40, textAlign: 'center' as const }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16, color: S.white }}>Ready to Analyze South Brisbane?</h2>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: S.white, marginBottom: 24 }}>Get detailed demographic data, competitor maps, and rent forecasts for South Brisbane locations.</p>
          <Link href="/onboarding" style={{ display: 'inline-block', background: S.white, color: S.brand, padding: '14px 32px', borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: 15 }}>Start Free Analysis →</Link>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 20px', borderTop: `1px solid ${S.border}`, color: S.muted }}>
        <div style={{ fontSize: 13, marginBottom: 20 }}>
          <Link href="/analyse/brisbane" style={{ color: S.brand, textDecoration: 'none', fontWeight: 600 }}>← Back to Brisbane</Link>
        </div>
        <p style={{ fontSize: 12, marginBottom: 0 }}>Compare with West End, Brisbane CBD, or New Farm to find your ideal location.</p>
      </div>
    </div>
  )
}
