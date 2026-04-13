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
      <p style={{ fontSize: 13, color: S.muted, margin: '0 0 20px 0' }}>Based on what you've read above.</p>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
        {opts.map((opt, i) => {
          const pct = Math.round((votes[i] / total) * 100)
          return (
            <button key={i} onClick={() => cast(i)} disabled={voted !== null}
              style={{ position: 'relative', border: `1.5px solid ${voted === i ? S.emeraldBdr : S.border}`, borderRadius: 10, padding: '12px 16px', background: S.white, cursor: voted === null ? 'pointer' : 'default', textAlign: : "left' as const, fontFamily: 'inherit", overflow: 'hidden' }}>
              {voted !== null && <div style={{ position: 'absolute', inset: 0, width: `${pct}%`, background: 'rgba(8,145,178,0.07)', transition: 'width 0.4s ease' }} />}
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
          <p style={{ fontSize: 13, color: '#047857', margin: 0 }}>Ready to run a full location analysis for {suburb}?{' '}<Link href="/onboarding" style={{ fontWeight: 700, textDecoration: 'underline', color: '#047857' }}>Analyse free →</Link></p>
        </div>
      )}
    </div>
  )
}

const SCHEMAS = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Teneriffe Business Location Analysis 2026 — Locatalyze',
    description: 'Wool store conversions created a character precinct unlike anything else in Brisbane. Creative industry professionals, architects, and agency workers occupy the converted warehouses and bring spending habits that the emerging commercial strip has not fully capitalised on.',
    datePublished: '2026-04-01',
    dateModified: '2026-04-12',
    author: { '@type': 'Organization', name: 'Locatalyze', url: 'https://locatalyze.com' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Teneriffe Brisbane known for commercially?',
      acceptedAnswer: { '@type': 'Answer', text: 'The Teneriffe wool stores — converted from industrial to residential and office use in the 1990s–2000s — created a character precinct that attracted creative industry professionals and agencies. The commercial strip is now catching up to a professional demographic that moved in before the shops. The opportunity is to serve the wool store office population that currently leaves the suburb for quality food.' },
    },
    {
      '@type': 'Question',
      name: 'What is the commercial rent in Teneriffe?',
      acceptedAnswer: { '@type': 'Answer', text: "Wyandra Street and riverfront-adjacent positions: $4,000–$6,500/month. Secondary commercial positions: $2,500–$4,000/month. Teneriffe rents sit above the suburb's current commercial maturity — negotiate aggressively for fit-out contributions and rent-free establishment periods." },
    },
    {
      '@type': 'Question',
      name: 'How does Teneriffe compare to New Farm?',
      acceptedAnswer: { '@type': 'Answer', text: 'New Farm has stronger residential foot traffic and a more developed weekend commercial culture. Teneriffe has a stronger weekday professional worker base from the wool store offices. Teneriffe suits weekday-professional-focused concepts; New Farm suits weekend-brunch-focused concepts. Both suit a smart operator who can serve both markets.' },
    },
    ],
  },
]

export default function TeneriffePage() {
  return (
    <div style={{ minHeight: '100vh', background: S.n50, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {SCHEMAS.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: S.white, borderBottom: `1px solid ${S.border}`, padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/analyse/brisbane" style={{ fontSize: 13, fontWeight: 600, color: S.brand, textDecoration: 'none' }}>← Brisbane</Link>
        <Link href="/onboarding" style={{ fontSize: 13, fontWeight: 700, color: S.white, background: S.brand, padding: '8px 18px', borderRadius: 7, textDecoration: 'none' }}>Analyse free →</Link>
      </div>
      <div style={{ background: `linear-gradient(135deg, #0891B2 0%, #0369A1 100%)`, padding: '56px 24px 48px', color: S.white }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 16, textTransform: : "uppercase' as const, letterSpacing: '0.08em" }}>
            <Link href="/analyse" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Analyse</Link>{' / '}
            <Link href="/analyse/brisbane" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Brisbane</Link>{' / '}Teneriffe
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 900, margin: '0 0 12px 0', lineHeight: 1.15 }}>Teneriffe</h1>
          <p style={{ fontSize: 16, lineHeight: 1.7, opacity: 0.9, margin: '0 0 28px 0', maxWidth: 620 }}>Wool store conversions created a character precinct unlike anything else in Brisbane. Creative industry professionals, architects, and agency workers occupy the converted warehouses and bring spending habits that the emerging commercial strip has not fully capitalised on.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' as const }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '16px 24px', textAlign: 'center' as const }}>
              <div style={{ fontSize: 36, fontWeight: 900, lineHeight: 1 }}>75</div>
              <div style={{ fontSize: 11, opacity: 0.8, marginTop: 4 }}>Overall Score</div>
            </div>
            <div>
              <VerdictBadge v="GO" />
              <div style={{ fontSize: 12, opacity: 0.75, marginTop: 8 }}>QLD 4005 • Revenue potential $35K–$70K/mo</div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginTop: 32, marginBottom: 40 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 24px 0' }}>Location Scores</h2>
          <ScoreBar label='Foot Traffic' value={74} />
          <ScoreBar label='Demographics' value={82} />
          <ScoreBar label='Rent Viability' value={74} />
          <ScoreBar label='Competition Gap' value={73} />
        </div>
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 20px 0' }}>Business Environment</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Teneriffe's commercial identity was created by accident. When the wool stores along the Brisbane River were converted from industrial to residential and office use in the 1990s and 2000s, the suburb acquired a built character — exposed brick, timber floors, warehouse scale — that naturally attracted the creative and professional classes. Architects, designers, advertising agencies, and technology companies moved into the converted wool stores because the spaces suited their working culture. The employees who followed built the residential demographic that now surrounds the commercial opportunities. Teneriffe is, in short, a suburb whose commercial strip is catching up to a demographic that moved in before the shops did.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>The Teneriffe precinct — primarily along Wyandra Street and the riverfront — has a weekday professional lunch market that is its most immediate commercial opportunity. The wool store offices hold thousands of workers who currently walk to New Farm or drive to Fortitude Valley for quality lunch and coffee. An operator positioned on Wyandra Street or adjacent to the wool store cluster serves this captive weekday market without requiring the weekend foot traffic of a residential strip. The economic model is more corporate-catering than community-café, which affects positioning but not revenue potential.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Riverside positioning adds an aspirational premium that complements the wool store aesthetic. Weekend foot traffic along the Riverwalk from New Farm to Teneriffe draws leisure users — cyclists, joggers, families — who spend on food and coffee in the same way that Kangaroo Point's Cliffs draw them. An operator who serves both the weekday professional market and the weekend Riverwalk leisure market builds a dual revenue stream that is more resilient than either alone.</p>
          </div>
        </div>
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 16px 0' }}>Competition Analysis</h2>
          <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Teneriffe has limited commercial operators relative to its demographic quality and worker population. The wool store precinct's office tenants currently leave the suburb for quality food — which is both the evidence of the opportunity and the current commercial gap. Competition is thin, which makes the first-mover advantage real. A quality café or lunch operator on Wyandra Street would not be fighting incumbent loyalty; they would be capturing pent-up demand from an established professional population.</p>
        </div>
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 20px 0' }}>What Works Here</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Specialty Café (Office Precinct Position)</h3>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, margin: 0 }}>The wool store office concentration creates a captive weekday professional market currently underserved by quality coffee and food. A specialty café with quality food program positioned for the worker demographic achieves consistent Monday–Friday revenue with lower weekend dependency than residential strips. Revenue $40,000–$65,000/month.</p>
            </div>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Quality Lunch (Mid-Price, Takeaway-Forward)</h3>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, margin: 0 }}>Wool store workers want quality lunch within walking distance. A mid-price lunch operation at $18–$28 per meal with strong takeaway format serves the working demographic efficiently. Revenue $35,000–$55,000/month from weekday-focused trading.</p>
            </div>
            <div style={{ background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Evening Dining</h3>
                <VerdictBadge v="CAUTION" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, margin: 0 }}>Teneriffe's evening foot traffic is growing but not yet at West End or New Farm levels. An evening concept requires strong proactive marketing and a reason for broader Brisbane to travel to Teneriffe rather than defaulting to established evening precincts.</p>
            </div>
          </div>
        </div>
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 20px 0' }}>Key Risks</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 20 }}>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.amber}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px 0' }}>Weekend Foot Traffic Still Developing</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>Teneriffe's residential population is growing but weekend commercial foot traffic is below what the weekday professional market suggests. Operators who model weekend revenue at weekday levels will be disappointed.</p>
            </div>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.amber}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px 0' }}>Limited Walk-In Commercial Strip</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>Teneriffe does not yet have the walk-in commercial strip culture of Paddington or West End. Customer acquisition requires active marketing and community presence, not just quality product in a passing foot traffic location.</p>
            </div>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.amber}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px 0' }}>Gentrification Premium on Rent</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>Teneriffe rents reflect the suburb's aspirational positioning — $4,000–$6,500/month for commercial positions that may not yet have the foot traffic to justify the premium. Revenue modelling needs to be conservative in the first 12 months.</p>
            </div>
          </div>
        </div>
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 20px 0' }}>Compare Nearby Suburbs</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <Link href="/analyse/brisbane/new-farm" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 16, cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = S.brand)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = S.border)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>New Farm</h4>
                  <VerdictBadge v="GO" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: S.brand }}>80</div>
                <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>Adjacent south, more developed</div>
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
                <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>1km west, daytime improving</div>
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
        <SuburbPoll suburb=Teneriffe votes={[51, 34, 15]} />
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 20px 0' }}>Final Verdict</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Teneriffe is a GO for operators who understand its specific commercial character: a professional-weekday-led market with growing residential weekend component. The wool store office precinct creates a captive customer base that is unusually receptive to quality food and specialty coffee — the creative professional demographic values quality and pays for it.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>The opportunity is to be the quality operator that the Teneriffe professional population currently travels elsewhere to find. New Farm and Fortitude Valley are getting that business. An operator who plants a flag in Teneriffe with quality execution wins the loyalty of a professional demographic before the commercial strip has fully developed — and locks in lease terms before the development is complete.</p>
          </div>
        </div>
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px 0' }}>Frequently Asked Questions</h2>
          <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 20, marginTop: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 8px 0' }}>What is Teneriffe Brisbane known for commercially?</h3>
            <p style={{ fontSize: 13, color: S.n900, lineHeight: 1.7, margin: 0 }}>The Teneriffe wool stores — converted from industrial to residential and office use in the 1990s–2000s — created a character precinct that attracted creative industry professionals and agencies. The commercial strip is now catching up to a professional demographic that moved in before the shops. The opportunity is to serve the wool store office population that currently leaves the suburb for quality food.</p>
          </div>
          <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 20, marginTop: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 8px 0' }}>What is the commercial rent in Teneriffe?</h3>
            <p style={{ fontSize: 13, color: S.n900, lineHeight: 1.7, margin: 0 }}>Wyandra Street and riverfront-adjacent positions: $4,000–$6,500/month. Secondary commercial positions: $2,500–$4,000/month. Teneriffe rents sit above the suburb's current commercial maturity — negotiate aggressively for fit-out contributions and rent-free establishment periods.</p>
          </div>
          <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 20, marginTop: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 8px 0' }}>How does Teneriffe compare to New Farm?</h3>
            <p style={{ fontSize: 13, color: S.n900, lineHeight: 1.7, margin: 0 }}>New Farm has stronger residential foot traffic and a more developed weekend commercial culture. Teneriffe has a stronger weekday professional worker base from the wool store offices. Teneriffe suits weekday-professional-focused concepts; New Farm suits weekend-brunch-focused concepts. Both suit a smart operator who can serve both markets.</p>
          </div>
        </div>
        <div style={{ background: `linear-gradient(135deg, #059669 0%, #047857 100%)`, borderRadius: 16, padding: '40px 32px', marginBottom: 48, textAlign: 'center' as const }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: S.white, margin: '0 0 10px 0' }}>Ready to analyse your Teneriffe location?</h3>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', margin: '0 0 24px 0' }}>Get foot traffic, competition, demographics, and a GO/CAUTION/NO verdict for your specific address.</p>
          <Link href="/onboarding" style={{ display: 'inline-block', background: S.white, color: '#059669', padding: '13px 28px', borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>Analyse your address →</Link>
        </div>
        <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 32, paddingBottom: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' as const, gap: 12 }}>
          <Link href="/analyse/brisbane" style={{ fontSize: 13, fontWeight: 600, color: S.brand, textDecoration: 'none' }}>← Back to Brisbane</Link>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' as const }}>
            <Link href="/analyse/brisbane/new-farm" style={{ fontSize: 13, color: S.brand, textDecoration: 'none' }}>New Farm</Link> <Link href="/analyse/brisbane/fortitude-valley" style={{ fontSize: 13, color: S.brand, textDecoration: 'none' }}>Fortitude Valley</Link> <Link href="/analyse/brisbane/kangaroo-point" style={{ fontSize: 13, color: S.brand, textDecoration: 'none' }}>Kangaroo Point</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
