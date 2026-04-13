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
    headline: 'Fortitude Valley Business Location Analysis 2026 — Locatalyze',
    description: "Beyond the nightlife reputation. The Valley's Brunswick Street and Ann Street daytime trade has materially improved over five years as creative industry professionals, apartment residents, and media workers have replaced the strip's old identity with a genuine all-day commercial precinct.",
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
      name: 'Is Fortitude Valley safe for daytime business?',
      acceptedAnswer: { '@type': 'Answer', text: "Yes — the security issues associated with the Valley's late-night economy are time-limited. Daytime and early evening trading (9am–9pm) is safe and operates normally. The Valley's retail and café operators trade without safety concerns during standard business hours. Late-night trading (after 10pm) carries different considerations." },
    },
    {
      '@type': 'Question',
      name: 'What is the commercial rent in Fortitude Valley?',
      acceptedAnswer: { '@type': 'Answer', text: 'Brunswick Street Mall and primary strip positions: $5,000–$7,000/month. Ann Street and secondary positions: $3,500–$5,500/month. Off-strip and laneway positions: $2,500–$4,000/month. The Valley offers inner-city positioning at rent levels materially below the CBD and Paddington.' },
    },
    {
      '@type': 'Question',
      name: "How has the Valley's daytime food culture changed?",
      acceptedAnswer: { '@type': 'Answer', text: 'Significantly. Pre-2015, the Valley had minimal quality daytime food offering — a handful of cafés for the thin daytime worker population. Post-residential build-out, the Valley has a permanent population that demands café quality comparable to New Farm or Paddington. The supply of quality operators has not yet fully caught up, creating opportunity for new entrants.' },
    },
    ],
  },
]

export default function FortitudeValleyPage() {
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
            Fortitude Valley
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 900, margin: '0 0 12px 0', lineHeight: 1.15 }}>
            Fortitude Valley
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.7, opacity: 0.9, margin: '0 0 28px 0', maxWidth: 620 }}>
            Beyond the nightlife reputation. The Valley's Brunswick Street and Ann Street daytime trade has materially improved over five years as creative industry professionals, apartment residents, and media workers have replaced the strip's old identity with a genuine all-day commercial precinct.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' as const }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '16px 24px', textAlign: 'center' as const }}>
              <div style={{ fontSize: 36, fontWeight: 900, lineHeight: 1 }}>74</div>
              <div style={{ fontSize: 11, opacity: 0.8, marginTop: 4 }}>Overall Score</div>
            </div>
            <div>
              <VerdictBadge v="GO" />
              <div style={{ fontSize: 12, opacity: 0.75, marginTop: 8 }}>QLD 4006 • Revenue potential $35K–$80K/mo</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px' }}>

        {/* Score card */}
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginTop: 32, marginBottom: 40 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 24px 0' }}>Location Scores</h2>
          <ScoreBar label='Foot Traffic' value={78} />
          <ScoreBar label='Demographics' value={73} />
          <ScoreBar label='Rent Viability' value={70} />
          <ScoreBar label='Competition Gap' value={72} />
        </div>

        {/* Business environment */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 20px 0' }}>Business Environment</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>The Fortitude Valley reputation problem is now a decade out of date, but it persists in the minds of operators who haven't visited recently. In 2015, the Valley was Queensland's nightlife precinct — Ann Street and Brunswick Street were for bars and clubs, daytime trading was quiet, and the residential population was sparse. In 2026, the Valley is something else. The apartment build-out since 2016 — substantial post-GFC residential towers that transformed the Valley's population density — has brought 8,000+ permanent residents to a precinct that previously had almost none. These residents need cafés, lunch, and professional services in the same way that any residential population does.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Brunswick Street Mall daytime trading is now the highest it has been in the Valley's commercial history. The demographic mix includes creative industry workers (the Brunswick Street creative agency and media cluster is real and substantial), residents of the post-2015 apartment stock, and spill-over from Newstead and Teneriffe to the north, which have been the primary beneficiaries of the Valley's residential growth. Daytime foot traffic between 8am and 3pm on weekdays is genuinely different from what it was five years ago.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>The Valley's commercial rents ($4,000–$7,000/month for Brunswick Street positions) sit above the outer-ring suburbs but below the premium of Paddington or West End. For operators who want inner-city positioning at defensible rent levels, the Valley is the market. The nightlife economy — still present but more curated and less chaotic than its 2008 peak — adds evening revenue potential that complements daytime trade.</p>
          </div>
        </div>

        {/* Competition */}
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 16px 0' }}>Competition Analysis</h2>
          <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Competition in the Valley is changing character. Established nightlife operators (bars, clubs, late-night venues) are being joined by daytime café and lunch operators who have recognised the residential and professional opportunity. The competitive gap is in categories the nightlife economy doesn't serve: specialty coffee with all-day food, premium lunch for creative industry workers, wellness and fitness for the apartment resident population. Healthcare and allied health are undersupplied for the resident density.</p>
        </div>

        {/* What works */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 20px 0' }}>What Works Here</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Daytime Specialty Café (Creative Industry Positioning)</h3>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, margin: 0 }}>The Valley's Brunswick Street creative cluster (media, design, advertising agencies) creates a quality-seeking weekday lunch and coffee market. A specialty café with strong food program and laptop-friendly format finds consistent Monday–Friday revenue from creative professionals. Revenue $40,000–$65,000/month for a well-positioned 50-seat operator.</p>
            </div>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Quality Casual Dinner + Bar</h3>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, margin: 0 }}>Valley evenings on Thursday–Saturday have real foot traffic from residents and the broader Brisbane population. A mid-price restaurant with bar program ($50–$70 per head) can build Thursday–Saturday evening revenue that supplements weekend brunch. Revenue $45,000–$80,000/month with strong evening trading.</p>
            </div>
            <div style={{ background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Breakfast-Only Café (Mon–Fri)</h3>
                <VerdictBadge v="CAUTION" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, margin: 0 }}>Viable but constrained — weekend Valley foot traffic is event-driven and requires a different customer acquisition strategy than weekday resident-and-worker trade. Businesses that only trade well Monday–Friday will find the Valley's weekday profile works but weekends require additional programming.</p>
            </div>
          </div>
        </div>

        {/* Key risks */}
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 20px 0' }}>Key Risks</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 20 }}>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.amber}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px 0' }}>Reputation Lag Among Non-Residents</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>Outer-suburb customers still associate the Valley with its 2010 nightlife identity. Building a customer base that extends beyond residents and the immediate creative precinct requires active marketing to counter the outdated reputation.</p>
            </div>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.amber}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px 0' }}>Alcohol Licensing Complexity</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>The Valley's late-night trading history has produced complex liquor licensing conditions in the precinct. Operators planning venues with evening liquor service should obtain independent licensing advice before signing leases.</p>
            </div>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.amber}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px 0' }}>Weekend Foot Traffic Inconsistency</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>Valley weekend foot traffic is event-dependent in a way that weekday professional trade is not. Revenue planning must distinguish between event-weekend peaks and quiet weekend troughs.</p>
            </div>
          </div>
        </div>

        {/* Nearby suburbs */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 20px 0' }}>Compare Nearby Suburbs</h2>
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
                <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>Adjacent north, professional</div>
              </div>
            </Link>
            <Link href="/analyse/brisbane/new-farm" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 16, cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = S.brand)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = S.border)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>New Farm</h4>
                  <VerdictBadge v="GO" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: S.brand }}>80</div>
                <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>2km east, riverfront premium</div>
              </div>
            </Link>
            <Link href="/analyse/brisbane/brisbane-cbd" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 16, cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = S.brand)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = S.border)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Brisbane CBD</h4>
                  <VerdictBadge v="CAUTION" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: S.brand }}>72</div>
                <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>1.2km south, high rent</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Poll */}
        <SuburbPoll suburb="Fortitude Valley" votes={[48, 33, 19]} />

        {/* Final verdict */}
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 20px 0' }}>Final Verdict</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Fortitude Valley is a GO for operators who understand its current reality, not its historical reputation. The daytime trading conditions have materially improved and the residential population has grown substantially. Operators who enter the Valley in 2026 with a quality daytime concept — specialty café, lunch, wellness — find a market that has underinvested in quality food relative to its current demographic.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>The Valley GO verdict carries an asterisk: success requires understanding that the Valley is still a neighbourhood in transition. The establishment period may be longer than in West End or Paddington, where community loyalty cycles are more mature. Valley customers are forming habits, not carrying them. Operators who are patient with the establishment curve and consistent in quality will find the Valley a viable and improving market.</p>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px 0' }}>Frequently Asked Questions</h2>
          <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 20, marginTop: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 8px 0' }}>Is Fortitude Valley safe for daytime business?</h3>
            <p style={{ fontSize: 13, color: S.n900, lineHeight: 1.7, margin: 0 }}>Yes — the security issues associated with the Valley's late-night economy are time-limited. Daytime and early evening trading (9am–9pm) is safe and operates normally. The Valley's retail and café operators trade without safety concerns during standard business hours. Late-night trading (after 10pm) carries different considerations.</p>
          </div>
          <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 20, marginTop: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 8px 0' }}>What is the commercial rent in Fortitude Valley?</h3>
            <p style={{ fontSize: 13, color: S.n900, lineHeight: 1.7, margin: 0 }}>Brunswick Street Mall and primary strip positions: $5,000–$7,000/month. Ann Street and secondary positions: $3,500–$5,500/month. Off-strip and laneway positions: $2,500–$4,000/month. The Valley offers inner-city positioning at rent levels materially below the CBD and Paddington.</p>
          </div>
          <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 20, marginTop: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 8px 0' }}>How has the Valley's daytime food culture changed?</h3>
            <p style={{ fontSize: 13, color: S.n900, lineHeight: 1.7, margin: 0 }}>Significantly. Pre-2015, the Valley had minimal quality daytime food offering — a handful of cafés for the thin daytime worker population. Post-residential build-out, the Valley has a permanent population that demands café quality comparable to New Farm or Paddington. The supply of quality operators has not yet fully caught up, creating opportunity for new entrants.</p>
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: `linear-gradient(135deg, #059669 0%, #047857 100%)`, borderRadius: 16, padding: '40px 32px', marginBottom: 48, textAlign: 'center' as const }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: S.white, margin: '0 0 10px 0' }}>Ready to analyse your Fortitude Valley location?</h3>
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
