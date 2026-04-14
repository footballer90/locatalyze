'use client'
import Link from 'next/link'
import { useState } from 'react'

const S = {
  brand: '#0891B2', brandLight: '#06B6D4',
  emerald: '#059669', emeraldBg: '#ECFDF5', emeraldBdr: '#A7F3D0',
  amber: '#D97706', amberBg: '#FFFBEB', amberBdr: '#FDE68A',
  red: '#DC2626', redBg: '#FEF2F2', redBdr: '#FECACA',
  muted: '#475569', mutedLight: '#94A3B8', border: '#E2E8F0',
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
  return (
    <span style={{ fontSize: 11, fontWeight: 700, color: c.txt, background: c.bg, border: `1px solid ${c.bdr}`, borderRadius: 6, padding: '3px 10px', letterSpacing: '0.04em' }}>
      {c.label}
    </span>
  )
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
  function cast(i: number) {
    if (voted !== null) return
    setVoted(i)
    setVotes(prev => prev.map((v, idx) => idx === i ? v + 1 : v))
  }
  const opts = ['Yes — I would open here', 'Maybe — needs more research', 'No — wrong market for me']
  return (
    <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
      <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 6, color: S.n900 }}>Would you open a business in {suburb}?</h3>
      <p style={{ fontSize: 13, color: S.muted, marginBottom: 20, margin: '0 0 20px 0' }}>Based on what you've read above.</p>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
        {opts.map((opt, i) => {
          const pct = Math.round((votes[i] / total) * 100)
          return (
            <button key={i} onClick={() => cast(i)} disabled={voted !== null}
              style={{ position: 'relative', border: `1.5px solid ${voted === i ? S.emeraldBdr : S.border}`, borderRadius: 10, padding: '12px 16px', background: S.white, cursor: voted === null ? 'pointer' : 'default', textAlign: 'left' as const, fontFamily: 'inherit', overflow: 'hidden' }}>
              {voted !== null && (
                <div style={{ position: 'absolute', inset: 0, width: `${pct}%`, background: 'rgba(8,145,178,0.07)', transition: 'width 0.4s ease' }} />
              )}
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: S.n900 }}>{opt}</span>
                {voted !== null && <span style={{ fontSize: 12, color: S.brand, fontWeight: 700 }}>{pct}%</span>}
              </div>
            </button>
          )
        })}
      </div>
      {voted !== null && (
        <div style={{ marginTop: 16, padding: '12px 16px', background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 10 }}>
          <p style={{ fontSize: 13, color: '#047857', margin: 0 }}>
            Ready to run a full location analysis for {suburb}?{' '}
            <Link href="/onboarding" style={{ fontWeight: 700, textDecoration: 'underline', color: '#047857' }}>Analyse free →</Link>
          </p>
        </div>
      )}
    </div>
  )
}

const SCHEMAS = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'New Farm Business Location Analysis 2026 — Locatalyze',
    description: "Brisbane's brunch capital with a demand-supply gap that is unusual for an inner suburb of this quality. Brunswick Street and Merthyr Road carry exceptional weekend foot traffic, but only three independent cafés currently serve it. Riverfront premium positioning justifies higher price points.",
    datePublished: '2026-04-01',
    dateModified: '2026-04-12',
    author: { '@type': 'Organization', name: 'Locatalyze', url: 'https://locatalyze.com' },
    publisher: { '@type': 'Organization', name: 'Locatalyze' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
    {
      '@type': 'Question',
      name: 'Why does New Farm have so few cafés?',
      acceptedAnswer: { '@type': 'Answer', text: "New Farm has historically been a residential suburb with a commercial strip that hasn't attracted the operator investment its demographics would suggest. Low historical vacancy, established operator loyalty among the three existing operators, and the suburb's quieter character relative to Paddington or West End have kept new entrant numbers low. This is changing as the residential population grows and word of the demand gap spreads among operators." },
    },
    {
      '@type': 'Question',
      name: 'What rent should I expect in New Farm?',
      acceptedAnswer: { '@type': 'Answer', text: 'Brunswick Street and Merthyr Road prime positions: $4,500–$7,500/month. Secondary positions on Barker Street and surrounding streets: $3,000–$5,000/month. New Farm rents are meaningfully lower than Paddington equivalents — at this stage, before the operator quality has caught up to the demographics.' },
    },
    {
      '@type': 'Question',
      name: 'Is New Farm good for a restaurant?',
      acceptedAnswer: { '@type': 'Answer', text: "Yes. New Farm residents currently leave the suburb for quality dinner — there is no equivalent of Paddington's Given Terrace restaurant concentration. A 40-seat mid-price restaurant ($55–$75 per head) with Thursday–Sunday evening focus would find strong early demand from a demographic eager for quality local dining." },
    },
    ],
  },
]

export default function NewFarmPage() {
  return (
    <div style={{ minHeight: '100vh', background: S.n50, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {SCHEMAS.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}

      {/* Sticky nav */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: S.white, borderBottom: `1px solid ${S.border}`, padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/analyse/brisbane" style={{ fontSize: 13, fontWeight: 600, color: S.brand, textDecoration: 'none' }}>← Brisbane</Link>
        <Link href="/onboarding" style={{ fontSize: 13, fontWeight: 700, color: S.white, background: S.brand, padding: '8px 18px', borderRadius: 7, textDecoration: 'none' }}>Analyse free →</Link>
      </div>

      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, #0891B2 0%, #0369A1 100%)`, padding: '56px 24px 48px', color: S.white }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 16, textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>
            <Link href="/analyse" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Analyse</Link>
            {' / '}
            <Link href="/analyse/brisbane" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Brisbane</Link>
            {' / '}
            New Farm
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 900, margin: '0 0 12px 0', lineHeight: 1.15 }}>
            New Farm
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.7, opacity: 0.9, margin: '0 0 28px 0', maxWidth: 620 }}>
            Brisbane's brunch capital with a demand-supply gap that is unusual for an inner suburb of this quality. Brunswick Street and Merthyr Road carry exceptional weekend foot traffic, but only three independent cafés currently serve it. Riverfront premium positioning justifies higher price points.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' as const }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '16px 24px', textAlign: 'center' as const }}>
              <div style={{ fontSize: 36, fontWeight: 900, lineHeight: 1 }}>80</div>
              <div style={{ fontSize: 11, opacity: 0.8, marginTop: 4 }}>Overall Score</div>
            </div>
            <div>
              <VerdictBadge v="GO" />
              <div style={{ fontSize: 12, opacity: 0.75, marginTop: 8 }}>QLD 4005 • Revenue potential $45K–$85K/mo</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px' }}>

        {/* Score card */}
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginTop: 32, marginBottom: 40 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 24px 0' }}>Location Scores</h2>
          <ScoreBar label='Foot Traffic' value={82} />
          <ScoreBar label='Demographics' value={83} />
          <ScoreBar label='Rent Viability' value={71} />
          <ScoreBar label='Competition Gap' value={76} />
        </div>

        {/* Business environment */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1C1917', margin: '0 0 20px 0' }}>Business Environment</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>New Farm's commercial opportunity is most clearly articulated by a single data point: on a Saturday morning between 9am and 12pm, Brunswick Street and Merthyr Road carry genuine brunch foot traffic that rivals any inner-suburb strip in Brisbane — and there are three independent cafés to absorb it. Three. In Paddington or West End, that same foot traffic would be served by 12–15 operators. The demand-supply gap in New Farm's weekend brunch market is one of the most acute in Brisbane, and it exists because New Farm has been a residential suburb whose commercial strip has not kept pace with its population quality.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>The demographic profile of New Farm is among the strongest in Queensland. Median household income approaches $95,000 — placing it among the top 10 suburbs in the state by income concentration. The residential character is established professionals, architects, lawyers, and media figures who have chosen New Farm precisely because it is quieter and more refined than Paddington or West End. These residents have the same spending habits as Paddington customers but fewer local options for those habits. The New Farm customer who wants quality brunch currently either queues at one of the three existing operators or drives to Paddington.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>The riverfront positioning of New Farm creates an aspirational dining premium that is genuine and sustainable. Restaurants and cafés with views of or proximity to the Brisbane River can command higher price points and attract customers who are choosing a dining experience, not just fuelling up. Weekend foot traffic from New Farm Park visitors, ferry users at the Merthyr Park ferry terminal, and cyclists along the riverside path adds to the resident base a layer of active-lifestyle customers whose spending patterns align well with quality food and coffee.</p>
          </div>
        </div>

        {/* Competition */}
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 16px 0' }}>Competition Analysis</h2>
          <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Competition in New Farm is thin relative to demand — which is the core opportunity. Three independent cafés, a small number of established restaurants, and very little recent new entrant activity. The absence of competition should be read as an opportunity signal, not a warning sign: New Farm's residential character has historically discouraged commercial investment rather than signalling weak demand. The residential quality is superb; the operator quality has not caught up.</p>
        </div>

        {/* What works */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1C1917', margin: '0 0 20px 0' }}>What Works Here</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1C1917', margin: 0 }}>Specialty Brunch Café (Weekend Revenue Engine)</h3>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, margin: 0 }}>Saturday–Sunday 8am–2pm is where New Farm's commercial opportunity concentrates. A 40–50 seat specialty café with strong brunch program, quality coffee, and outdoor seating along Brunswick Street could achieve $55,000–$80,000/month. The demand-supply ratio makes customer acquisition easier than any comparable suburb.</p>
            </div>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1C1917', margin: 0 }}>Premium Evening Dining</h3>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, margin: 0 }}>New Farm residents currently travel to Paddington or West End for quality dinner. A 40-seat mid-price restaurant ($55–$75 per head) positioned for Thursday–Sunday evening trade would find immediate support from a demographic that wants quality locally. Revenue $50,000–$75,000/month within 12 months of opening.</p>
            </div>
            <div style={{ background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1C1917', margin: 0 }}>Retail (Lifestyle/Homewares)</h3>
                <VerdictBadge v="CAUTION" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, margin: 0 }}>New Farm's affluent residential base supports quality lifestyle retail, but the strip has limited pedestrian retail habit compared to Paddington. Destination retail with a strong online presence to complement in-store sales is more viable than walk-in retail alone.</p>
            </div>
          </div>
        </div>

        {/* Key risks */}
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 20px 0' }}>Key Risks</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 20 }}>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.amber}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#1C1917', margin: '0 0 4px 0' }}>Weekday Residential Base is Smaller Than Weekend</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>New Farm's commercial strip relies heavily on weekend and evening trade. Weekday foot traffic is primarily residential — residents walking for coffee or lunch. A business that requires strong Monday–Friday volume to support its cost base will find New Farm challenging.</p>
            </div>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.amber}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#1C1917', margin: '0 0 4px 0' }}>Premium Rent for Premium Positioning</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>New Farm riverfront positions ($5,500–$7,500/month) are premium for the suburb's current commercial development. Revenue models need to account for weekend-heavy trading patterns before the rent position works.</p>
            </div>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.amber}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#1C1917', margin: '0 0 4px 0' }}>Limited Public Transport for Non-Residents</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>New Farm lacks direct train access. Ferry is available at Merthyr Park but serves primarily weekend leisure. Operators dependent on a broad city-wide customer base find that most customers arrive by car, creating parking constraints on weekends.</p>
            </div>
          </div>
        </div>

        {/* Nearby suburbs */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1C1917', margin: '0 0 20px 0' }}>Compare Nearby Suburbs</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <Link href="/analyse/brisbane/teneriffe" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 16, cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = S.brand)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = S.border)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Teneriffe</h4>
                  <VerdictBadge v="GO" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: S.brand }}>75</div>
                <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>Adjacent, wool store precinct</div>
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
                <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>1km west, day trade improving</div>
              </div>
            </Link>
            <Link href="/analyse/brisbane/kangaroo-point" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 16, cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = S.brand)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = S.border)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Kangaroo Point</h4>
                  <VerdictBadge v="GO" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: S.brand }}>76</div>
                <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>Across the river</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Poll */}
        <SuburbPoll suburb="New Farm" votes={[55, 30, 15]} />

        {/* Final verdict */}
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 20px 0' }}>Final Verdict</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>New Farm is a GO with one of the most compelling specific arguments of any Brisbane suburb: demand-supply imbalance in the weekend brunch market is acute and currently unresolved. Three independent cafés for a suburb of New Farm's demographic quality is an unusual market condition. Operators who move first to close this gap will build customer loyalty and revenue momentum before competition arrives.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>The caveat is that New Farm's commercial opportunity concentrates in specific time windows — weekend brunch and Thursday–Sunday evenings. An operator who builds around these peaks and manages costs conservatively through the mid-week trough will find New Farm viable. An operator who models New Farm as an all-week, all-hours commercial strip will be disappointed by Monday–Wednesday revenue.</p>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px 0' }}>Frequently Asked Questions</h2>
          <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 20, marginTop: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 8px 0' }}>Why does New Farm have so few cafés?</h3>
            <p style={{ fontSize: 13, color: S.n900, lineHeight: 1.7, margin: 0 }}>New Farm has historically been a residential suburb with a commercial strip that hasn't attracted the operator investment its demographics would suggest. Low historical vacancy, established operator loyalty among the three existing operators, and the suburb's quieter character relative to Paddington or West End have kept new entrant numbers low. This is changing as the residential population grows and word of the demand gap spreads among operators.</p>
          </div>
          <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 20, marginTop: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 8px 0' }}>What rent should I expect in New Farm?</h3>
            <p style={{ fontSize: 13, color: S.n900, lineHeight: 1.7, margin: 0 }}>Brunswick Street and Merthyr Road prime positions: $4,500–$7,500/month. Secondary positions on Barker Street and surrounding streets: $3,000–$5,000/month. New Farm rents are meaningfully lower than Paddington equivalents — at this stage, before the operator quality has caught up to the demographics.</p>
          </div>
          <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 20, marginTop: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 8px 0' }}>Is New Farm good for a restaurant?</h3>
            <p style={{ fontSize: 13, color: S.n900, lineHeight: 1.7, margin: 0 }}>Yes. New Farm residents currently leave the suburb for quality dinner — there is no equivalent of Paddington's Given Terrace restaurant concentration. A 40-seat mid-price restaurant ($55–$75 per head) with Thursday–Sunday evening focus would find strong early demand from a demographic eager for quality local dining.</p>
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: `linear-gradient(135deg, #059669 0%, #047857 100%)`, borderRadius: 16, padding: '40px 32px', marginBottom: 48, textAlign: 'center' as const }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', margin: '0 0 10px 0' }}>Ready to analyse your New Farm location?</h3>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', margin: '0 0 24px 0' }}>Get foot traffic, competition, demographics, and a GO/CAUTION/NO verdict for your specific address.</p>
          <Link href="/onboarding" style={{ display: 'inline-block', background: S.white, color: '#059669', padding: '13px 28px', borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>Analyse your address →</Link>
        </div>

        {/* Footer nav */}
        <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 32, paddingBottom: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' as const, gap: 12 }}>
          <Link href="/analyse/brisbane" style={{ fontSize: 13, fontWeight: 600, color: S.brand, textDecoration: 'none' }}>← Back to Brisbane</Link>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' as const }}>
            {/* nearby links */}
          </div>
        </div>

      </div>
    </div>
  )
}
