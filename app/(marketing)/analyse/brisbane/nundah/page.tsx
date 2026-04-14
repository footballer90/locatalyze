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
        )})}
      </div>
      {voted !== null && <div style={{ marginTop: 16, padding: '12px 16px', background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 10 }}><p style={{ fontSize: 13, color: '#047857', margin: 0 }}>Ready to run a full analysis for {suburb}?{' '}<Link href="/onboarding" style={{ fontWeight: 700, textDecoration: 'underline', color: '#047857' }}>Analyse free →</Link></p></div>}
    </div>
  )
}
const SCHEMAS = [
  { '@context': 'https://schema.org', '@type': 'Article', headline: 'Nundah Business Location Analysis 2026 — Locatalyze', description: 'Sandgate Road and Nundah Village have developed a genuine community café culture that draws customers from across the northern suburbs. The demographic has shifted toward younger professionals over five years, creating an improving quality market at accessible middle-ring rents.', datePublished: '2026-04-01', dateModified: '2026-04-12', author: { '@type': 'Organization', name: 'Locatalyze', url: 'https://locatalyze.com' } },
  { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
    {
      '@type': 'Question',
      name: 'Is Nundah a good suburb for a café?',
      acceptedAnswer: { '@type': 'Answer', text: "For a well-differentiated specialty café, yes. For a generic café entering an established community market, the establishment period will be longer than in earlier-stage suburbs. Nundah's café culture is real and community-loyal — new entrants must earn that loyalty through quality and community presence, not inherit it through location alone." },
    },
    {
      '@type': 'Question',
      name: 'What is the commercial rent in Nundah?',
      acceptedAnswer: { '@type': 'Answer', text: "Nundah Village core positions (Sandgate Road and Buckland Road precinct): $3,000–$4,500/month. Secondary Sandgate Road positions: $2,000–$3,500/month. Off-strip residential positions: $1,500–$2,500/month. Nundah rents reflect the suburb's middle-ring quality — accessible but not entry-level." },
    },
    {
      '@type': 'Question',
      name: 'How has Nundah changed commercially in the last 5 years?',
      acceptedAnswer: { '@type': 'Answer', text: 'Significantly. The café and hospitality quality ceiling has risen materially as young professionals moved in and incumbent operators raised their game to meet new customer expectations. The strip character has shifted from functional suburban to genuine community café culture. This transition is now well-advanced — Nundah is established rather than transitioning, which means lower early-mover advantage but lower establishment risk.' },
    },
  ] },
]
export default function NundahPage() {
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
            <Link href="/analyse" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Analyse</Link>{' / '}<Link href="/analyse/brisbane" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Brisbane</Link>{' / '}Nundah
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 900, margin: '0 0 12px 0', lineHeight: 1.15 }}>Nundah</h1>
          <p style={{ fontSize: 16, lineHeight: 1.7, opacity: 0.9, margin: '0 0 28px 0', maxWidth: 620 }}>Sandgate Road and Nundah Village have developed a genuine community café culture that draws customers from across the northern suburbs. The demographic has shifted toward younger professionals over five years, creating an improving quality market at accessible middle-ring rents.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' as const }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '16px 24px', textAlign: 'center' as const }}>
              <div style={{ fontSize: 36, fontWeight: 900, lineHeight: 1 }}>72</div>
              <div style={{ fontSize: 11, opacity: 0.8, marginTop: 4 }}>Overall Score</div>
            </div>
            <div><VerdictBadge v="GO" /><div style={{ fontSize: 12, opacity: 0.75, marginTop: 8 }}>QLD 4012 • Revenue potential $25K–$50K/mo</div></div>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginTop: 32, marginBottom: 40 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 24px 0' }}>Location Scores</h2>
          <ScoreBar label='Foot Traffic' value={72} />
          <ScoreBar label='Demographics' value={73} />
          <ScoreBar label='Rent Viability' value={76} />
          <ScoreBar label='Competition Gap' value={68} />
        </div>
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 20px 0' }}>Business Environment</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Nundah has completed the early stage of the demographic transition that Newmarket and Aspley are still moving through. The suburb's Sandgate Road and Nundah Village strip has developed a café culture that is real, community-driven, and relatively well-established. Young professionals who priced out of Fortitude Valley and New Farm over the past decade found Nundah — 8km north of the CBD, 15 minutes to the Valley by train, affordable by inner-city standards — and brought their spending habits with them. The result is a strip with an improving quality ceiling that didn't exist 10 years ago.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>The Nundah Village precinct around Sandgate Road between Buckland Road and Gibbon Street has become the commercial heart of the suburb's café culture. Quality operators have established here and built loyal customer bases from the surrounding residential catchment — not just immediate Nundah residents, but professionals from Clayfield, Hendra, and Wavell Heights who travel to Nundah for the community character. This cross-suburb draw is the commercial signal that a strip has reached a quality threshold: customers don't just visit because it's convenient, they visit because they prefer it.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>The airport corridor connection adds a commercial layer unique to Nundah. The suburb sits on the main road and rail connection between Brisbane CBD and the airport, creating a consistent flow of travellers, airport workers, and logistics professionals through the area on weekdays. This is not a major commercial driver — travellers rarely stop for quality coffee on the way to or from the airport — but airport staff (25,000+ people employed at Brisbane Airport) represent a potential regular customer base for operators who build awareness within the airport workforce.</p>
          </div>
        </div>
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 16px 0' }}>Competition Analysis</h2>
          <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Nundah's café competition is established — several quality independents have built loyal customer bases on Sandgate Road. The competitive gap is in specific categories: quality evening dining (the strip is lunch-and-café dominant; good-quality dinner is underserved), specialty wellness and fitness (the professional demographic demands quality yoga and fitness; current operators are moderate), and allied health (growing professional population with healthcare needs thin on quality supply). New café entrants must differentiate clearly — generic positioning against established loyalty will be slow.</p>
        </div>
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 20px 0' }}>What Works Here</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Quality Evening Dining (Neighbourhood Restaurant)</h3>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, margin: 0 }}>Nundah's professional demographic currently drives to New Farm or Fortitude Valley for quality dinner. A 35-seat neighbourhood restaurant at $50–$65 per head with Thursday–Sunday focus fills the gap. Community loyalty in Nundah builds quickly for quality operators. Revenue $30,000–$50,000/month.</p>
            </div>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Allied Health (Physio, Psychology, Yoga)</h3>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, margin: 0 }}>The arriving young professional demographic has above-average demand for allied health and wellness. A physiotherapy or yoga studio positioned for the professional catchment finds referral-driven growth from a demographic that prioritises health spending. Revenue $30,000–$50,000/month.</p>
            </div>
            <div style={{ background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Specialty Café (Differentiated)</h3>
                <VerdictBadge v="CAUTION" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, margin: 0 }}>Café market is established. A new entrant must offer genuine differentiation — specialty roaster, distinct food program, community programming — to displace loyalty from existing operators. Generic café entry will establish slowly. Revenue $25,000–$40,000/month for a well-differentiated operator.</p>
            </div>
          </div>
        </div>
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 20px 0' }}>Key Risks</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 20 }}>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.amber}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px 0' }}>Established Café Loyalty</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>Nundah's café culture has established operators with strong community loyalty. New café entrants face a longer establishment period than in earlier-stage suburbs like Newmarket. Budget for 12–18 months to build revenue to model levels.</p>
            </div>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.amber}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px 0' }}>Strip Length Limits Prime Positions</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>The Nundah Village core is compact. Prime positions (high foot traffic, good visibility) are limited. Secondary positions on Sandgate Road away from the village core have materially lower walk-in foot traffic.</p>
            </div>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.amber}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px 0' }}>Airport Traffic Doesn't Convert Well</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>Despite proximity to the airport, airport-transit foot traffic doesn't convert to commercial customers at high rates. Operators who model revenue based on airport worker or traveller volumes will be disappointed; the suburb's commercial strength comes from the residential catchment, not transit traffic.</p>
            </div>
          </div>
        </div>
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 20px 0' }}>Compare Nearby Suburbs</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <Link href="/analyse/brisbane/chermside" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 16, cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = S.brand)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = S.border)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Chermside</h4>
                  <VerdictBadge v="CAUTION" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: S.brand }}>68</div>
                <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>4km west, shopping centre</div>
              </div>
            </Link>
            <Link href="/analyse/brisbane/newmarket" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 16, cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = S.brand)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = S.border)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Newmarket</h4>
                  <VerdictBadge v="GO" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: S.brand }}>72</div>
                <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>6km south, comparable stage</div>
              </div>
            </Link>
            <Link href="/analyse/brisbane/fortitude-valley" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 16, cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = S.brand)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = S.border)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Fortitude Valley</h4>
                  <VerdictBadge v="GO" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: S.brand }}>74</div>
                <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>8km south, improving</div>
              </div>
            </Link>
          </div>
        </div>
        <SuburbPoll suburb="Nundah" votes={[47, 35, 18]} />
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 20px 0' }}>Final Verdict</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Nundah is a GO for operators who understand that the suburb's commercial opportunity is in its evening and wellness gaps, not in its café market (which is adequately served). The professional demographic is there, the community loyalty pattern is established, and the rents ($2,500–$4,500/month) remain accessible relative to the demographic quality. An operator who fills the evening dining or wellness gap finds a receptive community that actively patronises local quality.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>The Nundah value proposition is most compelling for operators who want an established community character without Paddington or West End rents. The trade-off is lower foot traffic density and a longer establishment curve than the premier inner-ring strips. For operators who understand that trade-off and plan accordingly, Nundah is a reliable and improving commercial market.</p>
          </div>
        </div>
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px 0' }}>Frequently Asked Questions</h2>
          <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 20, marginTop: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 8px 0' }}>Is Nundah a good suburb for a café?</h3>
            <p style={{ fontSize: 13, color: S.n900, lineHeight: 1.7, margin: 0 }}>For a well-differentiated specialty café, yes. For a generic café entering an established community market, the establishment period will be longer than in earlier-stage suburbs. Nundah's café culture is real and community-loyal — new entrants must earn that loyalty through quality and community presence, not inherit it through location alone.</p>
          </div>
          <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 20, marginTop: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 8px 0' }}>What is the commercial rent in Nundah?</h3>
            <p style={{ fontSize: 13, color: S.n900, lineHeight: 1.7, margin: 0 }}>Nundah Village core positions (Sandgate Road and Buckland Road precinct): $3,000–$4,500/month. Secondary Sandgate Road positions: $2,000–$3,500/month. Off-strip residential positions: $1,500–$2,500/month. Nundah rents reflect the suburb's middle-ring quality — accessible but not entry-level.</p>
          </div>
          <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 20, marginTop: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 8px 0' }}>How has Nundah changed commercially in the last 5 years?</h3>
            <p style={{ fontSize: 13, color: S.n900, lineHeight: 1.7, margin: 0 }}>Significantly. The café and hospitality quality ceiling has risen materially as young professionals moved in and incumbent operators raised their game to meet new customer expectations. The strip character has shifted from functional suburban to genuine community café culture. This transition is now well-advanced — Nundah is established rather than transitioning, which means lower early-mover advantage but lower establishment risk.</p>
          </div>
        </div>
        <div style={{ background: `linear-gradient(135deg, #059669 0%, #047857 100%)`, borderRadius: 16, padding: '40px 32px', marginBottom: 48, textAlign: 'center' as const }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: S.white, margin: '0 0 10px 0' }}>Ready to analyse your Nundah location?</h3>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', margin: '0 0 24px 0' }}>Get foot traffic, competition, demographics, and a GO/CAUTION/NO verdict for your specific address.</p>
          <Link href="/onboarding" style={{ display: 'inline-block', background: S.white, color: '#059669', padding: '13px 28px', borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>Analyse your address →</Link>
        </div>
        <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 32, paddingBottom: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' as const, gap: 12 }}>
          <Link href="/analyse/brisbane" style={{ fontSize: 13, fontWeight: 600, color: S.brand, textDecoration: 'none' }}>← Back to Brisbane</Link>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' as const }}>
            <Link href="/analyse/brisbane/chermside" style={{ fontSize: 13, color: S.brand, textDecoration: 'none' }}>Chermside</Link> <Link href="/analyse/brisbane/newmarket" style={{ fontSize: 13, color: S.brand, textDecoration: 'none' }}>Newmarket</Link> <Link href="/analyse/brisbane/fortitude-valley" style={{ fontSize: 13, color: S.brand, textDecoration: 'none' }}>Fortitude Valley</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
