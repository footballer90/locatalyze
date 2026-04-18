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
      <p style={{ fontSize: 13, color: S.muted, margin: '0 0 20px 0' }}>Based on what you've read above.</p>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
        {opts.map((opt, i) => {
          const pct = Math.round((votes[i] / total) * 100)
          return (
            <button key={i} onClick={() => cast(i)} disabled={voted !== null}
              style={{ position: 'relative', border: `1.5px solid ${voted === i ? S.emeraldBdr : S.border}`, borderRadius: 10, padding: '12px 16px', background: S.white, cursor: voted === null ? 'pointer' : 'default', textAlign: 'left' as const, fontFamily: 'inherit', overflow: 'hidden' }}>
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
    headline: 'Kangaroo Point Business Location Analysis 2026 — Locatalyze',
    description: 'Riverside professional enclave with a residential population that has outgrown its commercial supply. Story Bridge walkability, ferry access, and the Cliffs as a weekend destination draw foot traffic beyond the resident base. The supply gap is real and currently unresolved.',
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
      name: 'Why is Kangaroo Point undercommercialised for its demographics?',
      acceptedAnswer: { '@type': 'Answer', text: "The suburb's commercial strip has historically been limited in both scale and character — Story Bridge Hotel dominates the venue landscape and smaller operators have struggled to establish in its shadow. The rapid residential growth (apartment building post-2018) has not yet attracted proportionate commercial investment. This is the opportunity window." },
    },
    {
      '@type': 'Question',
      name: 'What is the commercial rent in Kangaroo Point?',
      acceptedAnswer: { '@type': 'Answer', text: 'Main Street and waterfront-adjacent positions: $3,500–$5,500/month. Cliffs-adjacent (Wharf Street) positions: $3,000–$5,000/month. Off-strip residential positions: $2,000–$3,500/month. Kangaroo Point rents are below comparable river-adjacent suburbs and represent good value for the demographic quality.' },
    },
    {
      '@type': 'Question',
      name: 'How does Kangaroo Point compare to New Farm?',
      acceptedAnswer: { '@type': 'Answer', text: "New Farm has stronger all-week commercial character — its residential base generates consistent weekday foot traffic alongside the weekend Merthyr Road trade. Kangaroo Point is more weekend-concentrated. New Farm also has lower vacancy risk — the gap there is well-documented and operators are beginning to fill it. Kangaroo Point's gap is equally real but less talked about, creating potentially more attractive entry conditions." },
    },
    ],
  },
]

export default function KangarooPointPage() {
  return (
    <div style={{ minHeight: '100vh', background: S.n50, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {SCHEMAS.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
<div style={{ background: `linear-gradient(135deg, #0369A1 0%, #024F80 100%)`, padding: '56px 24px 48px', color: S.white }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 16, textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>
            <Link href="/analyse" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Analyse</Link>{' / '}
            <Link href="/analyse/brisbane" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Brisbane</Link>{' / '}Kangaroo Point
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 900, margin: '0 0 12px 0', lineHeight: 1.15 }}>Kangaroo Point</h1>
          <p style={{ fontSize: 16, lineHeight: 1.7, opacity: 0.9, margin: '0 0 28px 0', maxWidth: 620 }}>Riverside professional enclave with a residential population that has outgrown its commercial supply. Story Bridge walkability, ferry access, and the Cliffs as a weekend destination draw foot traffic beyond the resident base. The supply gap is real and currently unresolved.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' as const }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '16px 24px', textAlign: 'center' as const }}>
              <div style={{ fontSize: 36, fontWeight: 900, lineHeight: 1 }}>76</div>
              <div style={{ fontSize: 11, opacity: 0.8, marginTop: 4 }}>Overall Score</div>
            </div>
            <div>
              <VerdictBadge v="GO" />
              <div style={{ fontSize: 12, opacity: 0.75, marginTop: 8 }}>QLD 4169 • Revenue potential $30K–$65K/mo</div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginTop: 32, marginBottom: 40 }}>
          <h2 style={{ color: '#1C1917', fontSize: 16, fontWeight: 700, margin: '0 0 24px 0' }}>Location Scores</h2>
          <ScoreBar label='Foot Traffic' value={76} />
          <ScoreBar label='Demographics' value={79} />
          <ScoreBar label='Rent Viability' value={78} />
          <ScoreBar label='Competition Gap' value={75} />
        </div>
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1C1917', margin: '0 0 20px 0' }}>Business Environment</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Kangaroo Point is the Brisbane suburb that keeps being 'discovered' by operators, then failing to hold their attention, then being rediscovered. The pattern reveals something real about the suburb: the opportunity is genuine, but the execution requirements are more specific than the residential demographics suggest. The suburb's appeal is obvious — riverfront lifestyle, proximity to the CBD (1.2km to the Story Bridge), and a residential population of professionals and young families who earn above average incomes and have established quality-spending habits. The problem has historically been that weekday commercial foot traffic is thin relative to what residential quality implies.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>The Kangaroo Point Cliffs are the commercial wildcard. On a warm Saturday morning, the Cliffs strip (primarily near Wharf Street and the ferry terminal) draws cyclists, joggers, and families from across inner Brisbane in volumes that dwarf the suburb's residential population. These visitors — healthy, activity-oriented, with disposable income and post-exercise appetites — are an ideal customer base for a café or casual food concept. The challenge is that this foot traffic is heavily concentrated in weekend mornings (7am–12pm) and dissipates quickly; the same positions may be very quiet Monday–Friday.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Post-2018 residential development has substantially increased the permanent residential population of Kangaroo Point. Apartment towers on Main Street and the waterfront precinct have added thousands of professional residents who represent a weekday customer base that existing commercial supply has not kept pace with. The suburb has approximately 8,000 permanent residents but commercial operators serving them are thin — a handful of cafés, limited casual dining, and almost no quality dinner offering. The population-to-operator ratio is more favourable for new entrants than most inner-Brisbane suburbs.</p>
          </div>
        </div>
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 18, fontWeight: 700, margin: '0 0 16px 0' }}>Competition Analysis</h2>
          <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Kangaroo Point commercial competition is notably thin for a suburb of its residential profile. The Story Bridge Hotel is the dominant venue and its scale makes it more complement than competition for smaller operators. A handful of café operators serve the Cliffs weekend trade but the strip is not crowded. Quality dinner is almost entirely absent from the suburb's commercial offering. The competitive gap is larger than in West End or Paddington — and the demographic to fill it is there.</p>
        </div>
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1C1917', margin: '0 0 20px 0' }}>What Works Here</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1C1917', margin: 0 }}>Weekend Café (Cliffs and Ferry Terminal Position)</h3>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, margin: 0 }}>Saturday and Sunday 7am–12pm Cliffs foot traffic is genuine and high-quality. A café with outdoor positioning, quality coffee, and post-exercise food (acai bowls, eggs, smoothies) reaches the cyclist and jogger demographic at its peak spending moment. Revenue $35,000–$55,000/month, heavily weighted to weekends.</p>
            </div>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1C1917', margin: 0 }}>Weekday Professional Lunch (Resident-Serving)</h3>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, margin: 0 }}>Main Street and surrounding streets have a permanent resident base that currently drives to Woolloongabba or the CBD for quality lunch. A quality lunch offering (80% takeaway, 20% dine-in) serving the professional resident population Monday–Friday builds consistent weekday revenue. Revenue $25,000–$40,000/month from weekday-only trading.</p>
            </div>
            <div style={{ background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1C1917', margin: 0 }}>Evening Dining (Quality Casual)</h3>
                <VerdictBadge v="CAUTION" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, margin: 0 }}>Viable for a well-conceived concept but requires building loyalty from scratch in a suburb without established dinner culture. The residential demographic has the spending capacity; the dining habit has not yet formed locally. 12–18 month establishment period required before revenue stabilises at model levels.</p>
            </div>
          </div>
        </div>
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 18, fontWeight: 700, margin: '0 0 20px 0' }}>Key Risks</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 20 }}>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.amber}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#1C1917', margin: '0 0 4px 0' }}>Weekday-Weekend Revenue Imbalance</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>Cliffs foot traffic is powerfully weekend-concentrated. Models built on weekend-only revenue need to account for thin weekday trading from the resident base alone. Monthly revenue will have high variance between weekend-peak and weekday-trough weeks.</p>
            </div>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.amber}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#1C1917', margin: '0 0 4px 0' }}>Weather Dependency</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>Outdoor Cliffs trade is weather-dependent in a way that indoor café and restaurant trade is not. A wet July can materially reduce weekend revenue. Revenue modelling must include weather-impact buffers.</p>
            </div>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.amber}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#1C1917', margin: '0 0 4px 0' }}>Parking Constraints for Destination Customers</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>Kangaroo Point is accessible by ferry and on foot from the CBD and New Farm, but car parking is limited. Concepts that require destination-drive customers from outer suburbs face access constraints.</p>
            </div>
          </div>
        </div>
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1C1917', margin: '0 0 20px 0' }}>Compare Nearby Suburbs</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <Link href="/analyse/brisbane/woolloongabba" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 16, cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = S.brand)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = S.border)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h4 style={{ color: '#1C1917', fontSize: 14, fontWeight: 700, margin: 0 }}>Woolloongabba</h4>
                  <VerdictBadge v="GO" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: S.brand }}>79</div>
                <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>2km south, growth zone</div>
              </div>
            </Link>
            <Link href="/analyse/brisbane/new-farm" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 16, cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = S.brand)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = S.border)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h4 style={{ color: '#1C1917', fontSize: 14, fontWeight: 700, margin: 0 }}>New Farm</h4>
                  <VerdictBadge v="GO" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: S.brand }}>80</div>
                <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>Across the river</div>
              </div>
            </Link>
            <Link href="/analyse/brisbane/south-brisbane" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 16, cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = S.brand)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = S.border)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h4 style={{ color: '#1C1917', fontSize: 14, fontWeight: 700, margin: 0 }}>South Brisbane</h4>
                  <VerdictBadge v="GO" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: S.brand }}>74</div>
                <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>2km west, cultural precinct</div>
              </div>
            </Link>
          </div>
        </div>
        <SuburbPoll suburb="Kangaroo Point" votes={[52, 33, 15]} />
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 18, fontWeight: 700, margin: '0 0 20px 0' }}>Final Verdict</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Kangaroo Point is a GO for operators who can work with the suburb's weekend-concentrated commercial character. The demand-supply gap in weekday professional services and quality food is real and structurally unresolved by current operators. The Cliffs weekend opportunity is visible to anyone who visits on a Saturday morning.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Success in Kangaroo Point requires building a business model that works on weekend peaks and manages costs through weekday troughs. An operator who enters expecting five-day uniform trading will be disappointed. An operator who builds around the Saturday–Sunday Cliffs trade and develops a weekday resident lunch offering as the secondary revenue stream will find the suburb commercially viable and growing.</p>
          </div>
        </div>
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 18, fontWeight: 700, margin: '0 0 4px 0' }}>Frequently Asked Questions</h2>
          <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 20, marginTop: 20 }}>
            <h3 style={{ color: '#1C1917', fontSize: 15, fontWeight: 700, margin: '0 0 8px 0' }}>Why is Kangaroo Point undercommercialised for its demographics?</h3>
            <p style={{ fontSize: 13, color: S.n900, lineHeight: 1.7, margin: 0 }}>The suburb's commercial strip has historically been limited in both scale and character — Story Bridge Hotel dominates the venue landscape and smaller operators have struggled to establish in its shadow. The rapid residential growth (apartment building post-2018) has not yet attracted proportionate commercial investment. This is the opportunity window.</p>
          </div>
          <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 20, marginTop: 20 }}>
            <h3 style={{ color: '#1C1917', fontSize: 15, fontWeight: 700, margin: '0 0 8px 0' }}>What is the commercial rent in Kangaroo Point?</h3>
            <p style={{ fontSize: 13, color: S.n900, lineHeight: 1.7, margin: 0 }}>Main Street and waterfront-adjacent positions: $3,500–$5,500/month. Cliffs-adjacent (Wharf Street) positions: $3,000–$5,000/month. Off-strip residential positions: $2,000–$3,500/month. Kangaroo Point rents are below comparable river-adjacent suburbs and represent good value for the demographic quality.</p>
          </div>
          <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 20, marginTop: 20 }}>
            <h3 style={{ color: '#1C1917', fontSize: 15, fontWeight: 700, margin: '0 0 8px 0' }}>How does Kangaroo Point compare to New Farm?</h3>
            <p style={{ fontSize: 13, color: S.n900, lineHeight: 1.7, margin: 0 }}>New Farm has stronger all-week commercial character — its residential base generates consistent weekday foot traffic alongside the weekend Merthyr Road trade. Kangaroo Point is more weekend-concentrated. New Farm also has lower vacancy risk — the gap there is well-documented and operators are beginning to fill it. Kangaroo Point's gap is equally real but less talked about, creating potentially more attractive entry conditions.</p>
          </div>
        </div>
        <div style={{ background: `linear-gradient(135deg, #059669 0%, #047857 100%)`, borderRadius: 16, padding: '40px 32px', marginBottom: 48, textAlign: 'center' as const }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: '#FFFFFF', margin: '0 0 10px 0' }}>Ready to analyse your Kangaroo Point location?</h3>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', margin: '0 0 24px 0' }}>Get foot traffic, competition, demographics, and a GO/CAUTION/NO verdict for your specific address.</p>
          <Link href="/onboarding" style={{ display: 'inline-block', background: S.white, color: '#059669', padding: '13px 28px', borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>Analyse your address →</Link>
        </div>
        <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 32, paddingBottom: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' as const, gap: 12 }}>
          <Link href="/analyse/brisbane" style={{ fontSize: 13, fontWeight: 600, color: S.brand, textDecoration: 'none' }}>← Back to Brisbane</Link>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' as const }}>
            <Link href="/analyse/brisbane/woolloongabba" style={{ fontSize: 13, color: S.brand, textDecoration: 'none' }}>Woolloongabba</Link> <Link href="/analyse/brisbane/new-farm" style={{ fontSize: 13, color: S.brand, textDecoration: 'none' }}>New Farm</Link> <Link href="/analyse/brisbane/south-brisbane" style={{ fontSize: 13, color: S.brand, textDecoration: 'none' }}>South Brisbane</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
