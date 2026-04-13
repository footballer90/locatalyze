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
              style={{ position: 'relative', border: `1.5px solid ${voted === i ? S.emeraldBdr : S.border}`, borderRadius: 10, padding: '12px 16px', background: S.white, cursor: voted === null ? 'pointer' : 'default', textAlign: : "left' as const, fontFamily: 'inherit", overflow: 'hidden' }}>
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
    headline: 'South Brisbane Business Location Analysis 2026 — Locatalyze',
    description: 'The cultural precinct south of the river. GOMA, QPAC, and South Bank create a weekend tourist-professional mix that supports premium hospitality. Cultural foot traffic drives aspirational dining and specialty retail above what residential population alone would sustain.',
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
      name: 'Is South Brisbane good for a restaurant?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes, particularly for mid-price to premium restaurants aligned to the cultural precinct audience. Grey Street and Melbourne Street dinner trade is strong on weekends and Friday evenings. Pre-QPAC dining and post-GOMA lunch are established patterns. Revenue $55,000–$90,000/month for a well-positioned 50-seat restaurant.' },
    },
    {
      '@type': 'Question',
      name: 'What is the commercial rent in South Brisbane?',
      acceptedAnswer: { '@type': 'Answer', text: 'Grey Street prime positions: $7,000–$10,000/month. Secondary positions on Melbourne Street and Cultural Centre adjacent: $5,500–$8,000/month. South Bank precinct internal positions require direct negotiation with South Bank Corporation and carry different commercial terms than private tenancy.' },
    },
    {
      '@type': 'Question',
      name: 'How does South Brisbane compare to West End?',
      acceptedAnswer: { '@type': 'Answer', text: 'West End is more consistent — its trade is residential and community-driven, generating reliable week-round foot traffic. South Brisbane is more event-dependent — stronger weekend and event peaks, softer weekday base. West End suits operators who need consistent week-round revenue; South Brisbane suits operators who can perform strongly in peak periods and manage quieter ones.' },
    },
    ],
  },
]

export default function SouthBrisbanePage() {
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
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 16, textTransform: : "uppercase' as const, letterSpacing: '0.08em" }}>
            <Link href="/analyse" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Analyse</Link>
            {' / '}
            <Link href="/analyse/brisbane" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Brisbane</Link>
            {' / '}
            South Brisbane
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 900, margin: '0 0 12px 0', lineHeight: 1.15 }}>
            South Brisbane
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.7, opacity: 0.9, margin: '0 0 28px 0', maxWidth: 620 }}>
            The cultural precinct south of the river. GOMA, QPAC, and South Bank create a weekend tourist-professional mix that supports premium hospitality. Cultural foot traffic drives aspirational dining and specialty retail above what residential population alone would sustain.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' as const }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '16px 24px', textAlign: 'center' as const }}>
              <div style={{ fontSize: 36, fontWeight: 900, lineHeight: 1 }}>74</div>
              <div style={{ fontSize: 11, opacity: 0.8, marginTop: 4 }}>Overall Score</div>
            </div>
            <div>
              <VerdictBadge v="GO" />
              <div style={{ fontSize: 12, opacity: 0.75, marginTop: 8 }}>QLD 4101 • Revenue potential $35K–$90K/mo depending on concept</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px' }}>

        {/* Score card */}
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginTop: 32, marginBottom: 40 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 24px 0' }}>Location Scores</h2>
          <ScoreBar label='Foot Traffic' value={80} />
          <ScoreBar label='Demographics' value={76} />
          <ScoreBar label='Rent Viability' value={65} />
          <ScoreBar label='Competition Gap' value={74} />
        </div>

        {/* Business environment */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 20px 0' }}>Business Environment</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>South Brisbane's commercial character is inseparable from South Bank Parklands and the cultural precinct — GOMA, QPAC, the Queensland Museum, and the Gallery of Modern Art. On a Saturday between 10am and 4pm, South Bank draws 20,000–30,000 visitors who are in an experiential spending mindset. They have left their suburbs to be somewhere. They are willing to pay for quality dining and experiences in a way that Tuesday-afternoon suburbia is not. This is the structural advantage of South Brisbane: it is a destination, not a neighbourhood strip.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>The Grey Street and Melbourne Street corridors are the primary commercial zones for independent operators. These streets carry a mix of permanent residents (apartment stock has grown substantially since 2018), cultural precinct workers, and weekend tourists. The operator mix includes established restaurants that have built loyal followings over a decade and newer entries taking positions vacated by post-pandemic closures. Current vacancy on Grey Street runs at approximately 12% — not extreme, but lower than it was in 2022 when it peaked at 18%.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Rents in South Brisbane ($5,500–$10,000/month for prime Grey Street positions) are materially lower than equivalent Sydney cultural precincts — Surry Hills or Newtown would charge $8,000–$14,000 for comparable demographics. The relative affordability of South Brisbane versus its quality of catchment is the core commercial opportunity. An operator who builds a quality product for the cultural precinct audience — tourist, professional, and arts-adjacent demographic — at Brisbane rents is running a more viable economic model than the equivalent Sydney operator.</p>
          </div>
        </div>

        {/* Competition */}
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 16px 0' }}>Competition Analysis</h2>
          <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>South Brisbane has established competition in casual dining and café, particularly on Grey Street and around South Bank. Chain operators hold positions inside the South Bank precinct itself (the Rainforest Walk and Beach venues). The competitive gap is in premium hospitality — fine dining and specialty dining concepts — and in retail that serves the cultural audience rather than the tourist impulse buyer. A gallery café model, a specialty wine bar, or a chef-driven mid-price restaurant finds less direct competition than a generic café entering a crowded strip.</p>
        </div>

        {/* What works */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 20px 0' }}>What Works Here</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Cultural Precinct Restaurant (Mid–Premium)</h3>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, margin: 0 }}>Grey Street and Melbourne Street dinner trade is strong on weekends and Friday evenings. Cultural audience willingness to pay for quality dining is above Brisbane average. Revenue $55,000–$90,000/month for 50-seat restaurant well-positioned for pre- and post-QPAC trade.</p>
            </div>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Specialty Café (Weekend Brunch Focus)</h3>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, margin: 0 }}>South Bank weekend brunch draws from across Brisbane. A quality specialty café on Grey Street with outdoor seating builds strong weekend trade. Revenue $35,000–$55,000/month. Weekday lunch from cultural precinct workers and residents adds consistent mid-week volume.</p>
            </div>
            <div style={{ background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Independent Retail (Lifestyle/Art)</h3>
                <VerdictBadge v="CAUTION" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, margin: 0 }}>Viable for concepts aligned to the cultural audience — art prints, design objects, quality lifestyle products. Standard retail faces competition from South Bank's internal retail and the online pricing transparency that affects all middle-tier retail.</p>
            </div>
          </div>
        </div>

        {/* Key risks */}
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 20px 0' }}>Key Risks</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 20 }}>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.amber}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px 0' }}>Weekday-Weekend Revenue Split</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>Cultural precinct trade peaks on weekends and school holiday periods. Operators must model realistic weekday trading — resident population without tourist and cultural event support is meaningful but thinner than weekend data implies.</p>
            </div>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.amber}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px 0' }}>Flood Risk in Lease Terms</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>South Brisbane has documented flood risk for some positions near the riverfront. Tenants should confirm insurance terms and flood documentation before committing to leases in lower-lying positions.</p>
            </div>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.amber}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px 0' }}>Event Dependency</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>Major QPAC and GOMA events drive revenue spikes; quiet periods in the cultural calendar create soft weeks. Revenue planning must account for the cultural events calendar, not assume constant foot traffic.</p>
            </div>
          </div>
        </div>

        {/* Nearby suburbs */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 20px 0' }}>Compare Nearby Suburbs</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <Link href="/analyse/brisbane/west-end" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 16, cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = S.brand)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = S.border)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>West End</h4>
                  <VerdictBadge v="GO" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: S.brand }}>85</div>
                <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>1.5km, best indie culture</div>
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
                <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>River crossing, CBD</div>
              </div>
            </Link>
            <Link href="/analyse/brisbane/woolloongabba" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 16, cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = S.brand)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = S.border)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Woolloongabba</h4>
                  <VerdictBadge v="GO" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: S.brand }}>79</div>
                <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>2km south, growth zone</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Poll */}
        <SuburbPoll suburb="South Brisbane" votes={[45, 35, 20]} />

        {/* Final verdict */}
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 20px 0' }}>Final Verdict</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>South Brisbane is a GO for operators who understand the cultural precinct dynamic. The demand is real and above-average in spending willingness. The foot traffic is event-driven but substantial. The rents are defensible against the revenue potential for well-positioned concepts. The key is alignment with the audience: cultural, aspirational, quality-seeking, and willing to pay for experience.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>The operators who underperform in South Brisbane are those who assume South Bank foot traffic is the same as residential foot traffic — it is not. Cultural precinct visitors are weekend and event visitors who plan their dining choices in advance and compare quality. Generic café or generic casual dining positioned for impulse walk-ins will find the cultural audience less captive than expected. Premium and specialty positioning with a clear reason for the cultural audience to seek you out is what works.</p>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px 0' }}>Frequently Asked Questions</h2>
          <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 20, marginTop: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 8px 0' }}>Is South Brisbane good for a restaurant?</h3>
            <p style={{ fontSize: 13, color: S.n900, lineHeight: 1.7, margin: 0 }}>Yes, particularly for mid-price to premium restaurants aligned to the cultural precinct audience. Grey Street and Melbourne Street dinner trade is strong on weekends and Friday evenings. Pre-QPAC dining and post-GOMA lunch are established patterns. Revenue $55,000–$90,000/month for a well-positioned 50-seat restaurant.</p>
          </div>
          <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 20, marginTop: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 8px 0' }}>What is the commercial rent in South Brisbane?</h3>
            <p style={{ fontSize: 13, color: S.n900, lineHeight: 1.7, margin: 0 }}>Grey Street prime positions: $7,000–$10,000/month. Secondary positions on Melbourne Street and Cultural Centre adjacent: $5,500–$8,000/month. South Bank precinct internal positions require direct negotiation with South Bank Corporation and carry different commercial terms than private tenancy.</p>
          </div>
          <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 20, marginTop: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 8px 0' }}>How does South Brisbane compare to West End?</h3>
            <p style={{ fontSize: 13, color: S.n900, lineHeight: 1.7, margin: 0 }}>West End is more consistent — its trade is residential and community-driven, generating reliable week-round foot traffic. South Brisbane is more event-dependent — stronger weekend and event peaks, softer weekday base. West End suits operators who need consistent week-round revenue; South Brisbane suits operators who can perform strongly in peak periods and manage quieter ones.</p>
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: `linear-gradient(135deg, #059669 0%, #047857 100%)`, borderRadius: 16, padding: '40px 32px', marginBottom: 48, textAlign: 'center' as const }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: S.white, margin: '0 0 10px 0' }}>Ready to analyse your South Brisbane location?</h3>
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
