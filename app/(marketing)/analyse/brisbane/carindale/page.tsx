'use client'
import Link from 'next/link'
import { useState } from 'react'
const S = {
  brand: '#0891B2', brandLight: '#06B6D4',
  emerald: '#059669', emeraldBg: '#ECFDF5', emeraldBdr: '#A7F3D0',
  amber: '#D97706', amberBg: '#FFFBEB', amberBdr: '#FDE68A',
  red: '#DC2626', redBg: '#FEF2F2', redBdr: '#FECACA',
  muted: '#64748B', mutedLight: '#94A3B8', border: '#E2E8F0',
  n50: '#FAFAF9', n100: '#F5F5F4', n800: '#292524', n900: '#1C1917', white: '#FFFFFF',
}
type Verdict = 'GO' | 'CAUTION' | 'NO'
function VerdictBadge({ v }: { v: Verdict }) {
  const cfg: Record<Verdict, { bg: string; bdr: string; txt: string; label: string }> = {
    GO: { bg: S.emeraldBg, bdr: S.emeraldBdr, txt: S.emerald, label: 'GO' },
    CAUTION: { bg: S.amberBg, bdr: S.amberBdr, txt: S.amber, label: 'CAUTION' },
    NO: { bg: S.redBg, bdr: S.redBdr, txt: S.red, label: 'NO' },
  }
  const c = cfg[v]
  return <span style={{ fontSize: 11, fontWeight: 700, color: c.txt, background: c.bg, border: `1px solid ${c.bdr}`, borderRadius: 6, padding: '3px 10px', letterSpacing: '0.04em' }}>{c.label}</span>
}
function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: S.n900 }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: S.brand }}>{value}/100</span>
      </div>
      <div style={{ height: 7, background: S.border, borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${value}%`, background: S.brand, borderRadius: 4 }} />
      </div>
    </div>
  )
}
function SuburbPoll({ suburb, votes: initVotes }: { suburb: string; votes: number[] }) {
  const [voted, setVoted] = useState<number | null>(null)
  const [votes, setVotes] = useState(initVotes)
  const total = votes.reduce((a, b) => a + b, 0)
  function cast(i: number) { if (voted !== null) return; setVoted(i); setVotes(prev => prev.map((v, idx) => idx === i ? v + 1 : v)) }
  const opts = ['Yes — I would open here', 'Maybe — needs more research', 'No — wrong market for me']
  return (
    <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
      <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 6, color: S.n900 }}>Would you open a business in {suburb}?</h3>
      <p style={{ fontSize: 13, color: S.muted, margin: '0 0 20px 0' }}>Based on what you've read above.</p>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
        {opts.map((opt, i) => { const pct = Math.round((votes[i] / total) * 100); return (
          <button key={i} onClick={() => cast(i)} disabled={voted !== null}
            style={{ position: 'relative', border: `1.5px solid ${voted === i ? S.emeraldBdr : S.border}`, borderRadius: 10, padding: '12px 16px', background: S.white, cursor: voted === null ? 'pointer' : 'default', textAlign: 'left' as const, fontFamily: 'inherit', overflow: 'hidden' }}>
            {voted !== null && <div style={{ position: 'absolute', inset: 0, width: `${pct}%`, background: 'rgba(8,145,178,0.07)', transition: 'width 0.4s ease' }} />}
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: S.n900 }}>{opt}</span>
              {voted !== null && <span style={{ fontSize: 12, color: S.brand, fontWeight: 700 }}>{pct}%</span>}
            </div>
          </button>
        )}  })}
      </div>
      {voted !== null && <div style={{ marginTop: 16, padding: '12px 16px', background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 10 }}><p style={{ fontSize: 13, color: '#047857', margin: 0 }}>Ready to run a full analysis for {suburb}?{' '}<Link href="/onboarding" style={{ fontWeight: 700, textDecoration: 'underline', color: '#047857' }}>Analyse free →</Link></p></div>}
    </div>
  )
}
const SCHEMAS = [
  { '@context': 'https://schema.org', '@type': 'Article', headline: 'Carindale Business Location Analysis 2026 — Locatalyze', description: "Southeast Brisbane's family demographic anchor. Westfield Carindale drives foot traffic to the precinct but concentrates spending inside the mall. Old Cleveland Road strip positions outside the centre serve the family demographic with specific needs the mall cannot efficiently provide — healthcare, specialty food, community café.", datePublished: '2026-04-01', dateModified: '2026-04-12', author: { '@type': 'Organization', name: 'Locatalyze', url: 'https://locatalyze.com' } },
  { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
    {
      '@type': 'Question',
      name: 'Is Carindale a good suburb for a café?',
      acceptedAnswer: { '@type': 'Answer', text: "For a family-focused café with outdoor space, high chairs, and a children's menu, yes. Old Cleveland Road serves the family demographic that uses Westfield for retail but wants a community café experience for Saturday brunch. A generic café competing for the same convenience trade as the Westfield food court will struggle." },
    },
    {
      '@type': 'Question',
      name: 'What is the commercial rent in Carindale?',
      acceptedAnswer: { '@type': 'Answer', text: 'Old Cleveland Road prime strip positions: $3,500–$5,200/month. Secondary positions: $2,200–$3,500/month. These rents are above lower-income outer suburbs but below Westfield internal tenancy costs. Negotiate fit-out contributions for longer leases.' },
    },
    {
      '@type': 'Question',
      name: 'How does the Westfield affect Carindale strip retail?',
      acceptedAnswer: { '@type': 'Answer', text: "Westfield Carindale concentrates mainstream retail spending inside its walls, reducing strip retail walk-in foot traffic. Strip operators succeed by serving needs the mall cannot host efficiently: family allied health, community café character, children's education, and personal services requiring a community relationship. Direct competition with Westfield categories is inadvisable." },
    },
  ] },
]
export default function CarindalePage() {
  return (
    <div style={{ minHeight: '100vh', background: S.n50, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {SCHEMAS.map((s, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />)}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: S.white, borderBottom: `1px solid ${S.border}`, padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/analyse/brisbane" style={{ fontSize: 13, fontWeight: 600, color: S.brand, textDecoration: 'none' }}>← Brisbane</Link>
        <Link href="/onboarding" style={{ fontSize: 13, fontWeight: 700, color: S.white, background: S.brand, padding: '8px 18px', borderRadius: 7, textDecoration: 'none' }}>Analyse free →</Link>
      </div>
      <div style={{ background: `linear-gradient(135deg, #0891B2 0%, #0369A1 100%)`, padding: '56px 24px 48px', color: S.white }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 16, textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>
            <Link href="/analyse" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Analyse</Link>{' / '}<Link href="/analyse/brisbane" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Brisbane</Link>{' / '}Carindale
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 900, margin: '0 0 12px 0', lineHeight: 1.15 }}>Carindale</h1>
          <p style={{ fontSize: 16, lineHeight: 1.7, opacity: 0.9, margin: '0 0 28px 0', maxWidth: 620 }}>Southeast Brisbane's family demographic anchor. Westfield Carindale drives foot traffic to the precinct but concentrates spending inside the mall. Old Cleveland Road strip positions outside the centre serve the family demographic with specific needs the mall cannot efficiently provide — healthcare, specialty food, community café.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' as const }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '16px 24px', textAlign: 'center' as const }}>
              <div style={{ fontSize: 36, fontWeight: 900, lineHeight: 1 }}>71</div>
              <div style={{ fontSize: 11, opacity: 0.8, marginTop: 4 }}>Overall Score</div>
            </div>
            <div><VerdictBadge v="GO" /><div style={{ fontSize: 12, opacity: 0.75, marginTop: 8 }}>QLD 4152 • Revenue potential $25K–$55K/mo for correctly positioned concepts</div></div>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginTop: 32, marginBottom: 40 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 24px 0' }}>Location Scores</h2>
          <ScoreBar label='Foot Traffic' value={74} />
          <ScoreBar label='Demographics' value={73} />
          <ScoreBar label='Rent Viability' value={74} />
          <ScoreBar label='Competition Gap' value={64} />
        </div>
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 20px 0' }}>Business Environment</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Carindale's commercial landscape is defined by Westfield Carindale — one of southeast Brisbane's primary retail destinations, drawing 10+ million visits annually. Unlike the challenge this poses for traditional retail, it creates a reliable foot traffic volume in the precinct that benefits adjacent strip operators who serve needs the mall cannot host efficiently. Families driving to Westfield from across the eastern suburbs pass Old Cleveland Road strip businesses, providing exposure to a wide geographic catchment that a standalone suburban strip would not naturally command.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>The family demographic in Carindale and surrounding eastern suburbs (Carina Heights, Camp Hill, Mansfield) is among the strongest in Brisbane for specific service categories. Median household income approaches $88,000, with above-average proportion of families with children aged 0–14. These families spend heavily on healthcare (particularly paediatric and allied health), children's education services, and family casual dining. These spending categories align with exactly the businesses that Westfield cannot serve well — the mall's medical centre format doesn't build the same relationship as a community allied health practice; its food court doesn't deliver the family dining experience that a quality restaurant does.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Old Cleveland Road between Carindale Way and Mina Parade provides the primary strip commercial opportunity. These positions carry genuine foot traffic from local residents and Westfield-adjacent passing trade while offering rents materially below what the Westfield internal tenancies cost. A well-positioned strip operator on Old Cleveland Road captures the residential walk-in catchment and benefits from the gravitational pull of the major centre nearby without paying the centre's rent and compliance requirements.</p>
          </div>
        </div>
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 16px 0' }}>Competition Analysis</h2>
          <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Inside Westfield, chain competition is absolute. Outside the centre on Old Cleveland Road, competition is moderate and predominantly chain-oriented (fast food, convenience). Quality independent operators are thin on the strip — a quality café, family health practice, or specialty food operator on Old Cleveland Road would face limited direct quality competition from incumbents. The challenge is not competition; it is building awareness and habit in a customer base that defaults to the Westfield for most of its commercial needs.</p>
        </div>
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 20px 0' }}>What Works Here</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Family Allied Health (Paediatric Focus)</h3>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, margin: 0 }}>Carindale's family demographic has strong paediatric healthcare demand — children's dentistry, paediatric physiotherapy, occupational therapy, and family GP. A practice positioned explicitly for families with children finds consistent demand from the eastern suburbs catchment that extends well beyond the immediate residential area. Revenue $45,000–$65,000/month.</p>
            </div>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Family Casual Café (Outside Westfield)</h3>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, margin: 0 }}>A family-friendly café with high chairs, a children's menu, and outdoor space serves the Saturday morning family brunch market that the Westfield food court cannot replicate. Revenue $30,000–$50,000/month from a well-positioned Old Cleveland Road operator.</p>
            </div>
            <div style={{ background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Children's Education (Tutoring, Music, Sport)</h3>
                <VerdictBadge v="CAUTION" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, margin: 0 }}>Carindale's family demographic has strong tutoring and children's activity demand. The after-school and weekend education market is underserved by quality operators. Revenue potential $25,000–$45,000/month. Viable but requires active marketing to stand out from the established Kumon and similar chain tutoring operators.</p>
            </div>
          </div>
        </div>
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 20px 0' }}>Key Risks</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 20 }}>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.amber}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px 0' }}>Westfield Gravity Captures Primary Spend</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>Families drive to Westfield for their primary shopping. Strip operators on Old Cleveland Road capture residual or specialist spending — significant but not equivalent to mall foot traffic. Revenue models must be built on deliberately-acquired customers, not passive walk-in volume.</p>
            </div>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.amber}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px 0' }}>Car-Dependent Catchment</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>The Carindale eastern suburbs catchment is car-dependent. Parking on Old Cleveland Road is limited — operators must assess specific site parking availability before committing. Poor parking is a material barrier for family customers who arrive with children and strollers.</p>
            </div>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.amber}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px 0' }}>Lower Foot Traffic Density Than Inner Suburbs</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>Carindale's strip foot traffic is below Paddington or West End at comparable rent levels. Revenue per square metre will be lower. Cost structures must reflect middle-ring suburban trading volumes, not inner-city strip volumes.</p>
            </div>
          </div>
        </div>
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 20px 0' }}>Compare Nearby Suburbs</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <Link href="/analyse/brisbane/mount-gravatt" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 16, cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = S.brand)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = S.border)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Mount Gravatt</h4>
                  <VerdictBadge v="GO" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: S.brand }}>72</div>
                <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>5km west, university anchor</div>
              </div>
            </Link>
            <Link href="/analyse/brisbane/greenslopes" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 16, cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = S.brand)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = S.border)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Greenslopes</h4>
                  <VerdictBadge v="GO" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: S.brand }}>73</div>
                <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>8km north, hospital district</div>
              </div>
            </Link>
            <Link href="/analyse/brisbane/chermside" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 16, cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = S.brand)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = S.border)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Chermside</h4>
                  <VerdictBadge v="CAUTION" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: S.brand }}>68</div>
                <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>15km north, similar challenge</div>
              </div>
            </Link>
          </div>
        </div>
        <SuburbPoll suburb=Carindale votes={[42, 37, 21]} />
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 20px 0' }}>Final Verdict</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Carindale is a GO for operators who position for the family demographic's specific needs — paediatric healthcare, family casual dining, children's education — and accept that Westfield captures the mainstream retail spending. The eastern suburbs family demographic is genuinely strong ($88,000 median household income, high family concentration), and operators who serve their specific non-mall needs find loyal, referral-driven customer bases.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>The error in Carindale is attempting to compete with the Westfield for mainstream traffic. Strip retail adjacent to a centre of this scale cannot compete on the same commercial terms. The opportunity is narrow but real: healthcare, community café, education, and personal services that the mall's format cannot replicate. Operators who understand this and position accordingly find Carindale viable.</p>
          </div>
        </div>
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px 0' }}>Frequently Asked Questions</h2>
          <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 20, marginTop: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 8px 0' }}>Is Carindale a good suburb for a café?</h3>
            <p style={{ fontSize: 13, color: S.n900, lineHeight: 1.7, margin: 0 }}>For a family-focused café with outdoor space, high chairs, and a children's menu, yes. Old Cleveland Road serves the family demographic that uses Westfield for retail but wants a community café experience for Saturday brunch. A generic café competing for the same convenience trade as the Westfield food court will struggle.</p>
          </div>
          <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 20, marginTop: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 8px 0' }}>What is the commercial rent in Carindale?</h3>
            <p style={{ fontSize: 13, color: S.n900, lineHeight: 1.7, margin: 0 }}>Old Cleveland Road prime strip positions: $3,500–$5,200/month. Secondary positions: $2,200–$3,500/month. These rents are above lower-income outer suburbs but below Westfield internal tenancy costs. Negotiate fit-out contributions for longer leases.</p>
          </div>
          <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 20, marginTop: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 8px 0' }}>How does the Westfield affect Carindale strip retail?</h3>
            <p style={{ fontSize: 13, color: S.n900, lineHeight: 1.7, margin: 0 }}>Westfield Carindale concentrates mainstream retail spending inside its walls, reducing strip retail walk-in foot traffic. Strip operators succeed by serving needs the mall cannot host efficiently: family allied health, community café character, children's education, and personal services requiring a community relationship. Direct competition with Westfield categories is inadvisable.</p>
          </div>
        </div>
        <div style={{ background: `linear-gradient(135deg, #059669 0%, #047857 100%)`, borderRadius: 16, padding: '40px 32px', marginBottom: 48, textAlign: 'center' as const }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: S.white, margin: '0 0 10px 0' }}>Ready to analyse your Carindale location?</h3>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', margin: '0 0 24px 0' }}>Get foot traffic, competition, demographics, and a GO/CAUTION/NO verdict for your specific address.</p>
          <Link href="/onboarding" style={{ display: 'inline-block', background: S.white, color: '#059669', padding: '13px 28px', borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>Analyse your address →</Link>
        </div>
        <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 32, paddingBottom: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' as const, gap: 12 }}>
          <Link href="/analyse/brisbane" style={{ fontSize: 13, fontWeight: 600, color: S.brand, textDecoration: 'none' }}>← Back to Brisbane</Link>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' as const }}>
            <Link href="/analyse/brisbane/mount-gravatt" style={{ fontSize: 13, color: S.brand, textDecoration: 'none' }}>Mount Gravatt</Link> <Link href="/analyse/brisbane/greenslopes" style={{ fontSize: 13, color: S.brand, textDecoration: 'none' }}>Greenslopes</Link> <Link href="/analyse/brisbane/chermside" style={{ fontSize: 13, color: S.brand, textDecoration: 'none' }}>Chermside</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
