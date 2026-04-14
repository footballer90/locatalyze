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
    headline: 'Woolloongabba Business Location Analysis 2026 — Locatalyze',
    description: 'The strongest growth trajectory in Brisbane in 2026. Post-Olympic infrastructure — Cross River Rail, Gabba precinct upgrade, residential build-out — is fundamentally reshaping this suburb. Logan Road rents still reflect the old Woolloongabba, not the one arriving by 2032.',
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
      name: 'How will the 2032 Olympics affect Woolloongabba businesses?',
      acceptedAnswer: { '@type': 'Answer', text: "Directly and materially. The Gabba is the primary Olympic stadium, requiring full precinct upgrade. Cross River Rail, residential build-out, and hospitality precinct development are transforming the suburb's commercial character now, before 2032. Operators who establish in 2026 will have 6 years of below-market rent before the Olympic-era commercial maturity arrives." },
    },
    {
      '@type': 'Question',
      name: 'What is the commercial rent in Woolloongabba?',
      acceptedAnswer: { '@type': 'Answer', text: 'Logan Road prime positions: $4,000–$6,500/month. Secondary street positions: $2,500–$4,000/month. Stadium-adjacent positions (Stanley Street): $3,000–$5,500/month. Rents currently reflect the old Woolloongabba, not the post-Olympic version. This is the window.' },
    },
    {
      '@type': 'Question',
      name: 'Is Woolloongabba safe and accessible?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. Cross River Rail makes Woolloongabba 12 minutes from the CBD by direct train. The precinct is undergoing active urban upgrade funded by Olympic infrastructure. The historic safety concerns of the 1990s Woolloongabba are not current — the suburb has been stable and improving for over a decade.' },
    },
    ],
  },
]

export default function WoolloongabbaPage() {
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
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 16, textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>
            <Link href="/analyse" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Analyse</Link>{' / '}
            <Link href="/analyse/brisbane" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Brisbane</Link>{' / '}Woolloongabba
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 900, margin: '0 0 12px 0', lineHeight: 1.15 }}>Woolloongabba</h1>
          <p style={{ fontSize: 16, lineHeight: 1.7, opacity: 0.9, margin: '0 0 28px 0', maxWidth: 620 }}>The strongest growth trajectory in Brisbane in 2026. Post-Olympic infrastructure — Cross River Rail, Gabba precinct upgrade, residential build-out — is fundamentally reshaping this suburb. Logan Road rents still reflect the old Woolloongabba, not the one arriving by 2032.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' as const }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '16px 24px', textAlign: 'center' as const }}>
              <div style={{ fontSize: 36, fontWeight: 900, lineHeight: 1 }}>79</div>
              <div style={{ fontSize: 11, opacity: 0.8, marginTop: 4 }}>Overall Score</div>
            </div>
            <div>
              <VerdictBadge v="GO" />
              <div style={{ fontSize: 12, opacity: 0.75, marginTop: 8 }}>QLD 4102 • Revenue potential $35K–$75K/mo</div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginTop: 32, marginBottom: 40 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 24px 0' }}>Location Scores</h2>
          <ScoreBar label='Foot Traffic' value={78} />
          <ScoreBar label='Demographics' value={76} />
          <ScoreBar label='Rent Viability' value={82} />
          <ScoreBar label='Competition Gap' value={79} />
        </div>
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1C1917', margin: '0 0 20px 0' }}>Business Environment</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Woolloongabba's commercial transformation is the single most consequential real estate story in inner Brisbane in 2026. The Gabba has been Brisbane's sports precinct for 100 years — cricket, AFL, State of Origin — but the Olympic build-out is changing its commercial character in ways that sports ancillary alone never could. Cross River Rail's Woolloongabba station opened in 2024 and has brought the suburb to within 12 minutes of the CBD by direct rail. The precinct upgrade for the 2032 Olympics — $1B+ in committed infrastructure — has transformed developer sentiment. Residential towers are under construction. The demographic arriving into new Woolloongabba apartments is the same professional cohort driving West End and Paddington's commercial success.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Logan Road between Ipswich Road and Main Street has been Woolloongabba's commercial anchor for decades. The strip has historically served a patchy mix of automotive service businesses, fast food, and convenience retail — not the food and lifestyle mix its new residential population demands. This mismatch between arriving demographic and existing commercial supply is precisely the opportunity window. Operators who enter Logan Road now capture the gap between the demographic that is arriving and the commercial supply that has not yet responded to it.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Stadium trade adds a revenue layer that suburban operators elsewhere don't access. The Gabba draws 25,000+ crowds for cricket and AFL. Pre-match and post-match foot traffic on Logan Road is genuine and high-spending. Operators who understand how to position for event-day trade — high throughput, efficient service, positioned on the pedestrian flow from the stadium to public transport — build a revenue layer from 15–20 major event days per year that materially improves annual economics. This is not the primary revenue driver, but it is a structural advantage that Woolloongabba operators have and others do not.</p>
          </div>
        </div>
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 16px 0' }}>Competition Analysis</h2>
          <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Woolloongabba's current commercial mix is thin in quality food and hospitality relative to its arriving demographic. Logan Road has chains (McDonald's, Red Rooster) and established automotive and trade businesses but few quality independent operators targeting the professional cohort. The gap between incoming residential demographic and current commercial supply is among the largest of any inner-Brisbane suburb. First-mover operators entering in 2025–2026 are establishing before the market has repriced to reflect Olympic-era demand.</p>
        </div>
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1C1917', margin: '0 0 20px 0' }}>What Works Here</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1C1917', margin: 0 }}>Quality Café (Professional and Family)</h3>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, margin: 0 }}>The arriving residential population — professional, 28–45, income $85,000–$110,000 — needs quality coffee and food that the current Logan Road supply does not provide. A specialty café positioned for this demographic can achieve $40,000–$65,000/month within 18 months of opening, rising as residential density increases.</p>
            </div>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1C1917', margin: 0 }}>Allied Health (Physio, GP, Psychology)</h3>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, margin: 0 }}>Woolloongabba's new residential population has healthcare needs that current supply does not meet. A GP practice or physiotherapy clinic in the precinct captures structural demand from residents who currently travel to Annerley or Greenslopes. Revenue $45,000–$75,000/month with low competition from established operators.</p>
            </div>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1C1917', margin: 0 }}>Stadium-Anchored Casual Dining</h3>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, margin: 0 }}>Event-day revenue from Gabba crowds (25,000+ attendance per major match) adds a structural layer to annual economics. A casual dining operator that handles high event-day throughput efficiently and builds weekday resident trade as a base revenue floor can achieve strong annual revenue with the event-day layer as upside.</p>
            </div>
          </div>
        </div>
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 20px 0' }}>Key Risks</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 20 }}>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.amber}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#1C1917', margin: '0 0 4px 0' }}>Olympic Timeline Risk</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>The 2032 Olympics are the long-term demand driver but the current position requires 6 years of trading before the Olympic-era commercial maturity arrives. Operators must model interim revenue at current (pre-Olympic) demand levels, not projected 2032 levels.</p>
            </div>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.amber}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#1C1917', margin: '0 0 4px 0' }}>Logan Road Strip Character Transition</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>Logan Road's current automotive and trade character makes the strip's presentation less attractive than West End or Paddington. Foot traffic culture is forming, not established. Early operators must build customer habit, not inherit it.</p>
            </div>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.amber}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#1C1917', margin: '0 0 4px 0' }}>Construction Disruption</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>Active Olympic precinct construction creates noise, access, and parking disruption near the Gabba. Operators should assess specific position impacts from construction timelines before committing to leases near active build sites.</p>
            </div>
          </div>
        </div>
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1C1917', margin: '0 0 20px 0' }}>Compare Nearby Suburbs</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <Link href="/analyse/brisbane/annerley" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 16, cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = S.brand)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = S.border)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Annerley</h4>
                  <VerdictBadge v="GO" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: S.brand }}>70</div>
                <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>2km south, value position</div>
              </div>
            </Link>
            <Link href="/analyse/brisbane/south-brisbane" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 16, cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = S.brand)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = S.border)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>South Brisbane</h4>
                  <VerdictBadge v="GO" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: S.brand }}>74</div>
                <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>2km north, cultural precinct</div>
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
                <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>1km east, riverside</div>
              </div>
            </Link>
          </div>
        </div>
        <SuburbPoll suburb="Woolloongabba" votes={[56, 32, 12]} />
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 20px 0' }}>Final Verdict</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Woolloongabba is the opportunity call of 2026 for Brisbane operators. The combination of Olympic infrastructure, Cross River Rail access, and residential demographic arrival creates a window for early entry at below-future-market rent levels. Operators who enter in 2025–2026 capture the lease before the Olympic-era repricing arrives. The comparison is to operators who entered Paddington 15 years ago or West End 20 years ago — before the rents reflected the demographic.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>The risk is timeline: the full commercial maturity of Woolloongabba is 2030+, not 2026. Operators who enter now must model 3–5 years of below-full-potential revenue before the precinct reaches maturity. Operators with conservative cost structures, correct positioning for the arriving demographic, and patience with establishment curve will find Woolloongabba the best commercial value play in inner Brisbane.</p>
          </div>
        </div>
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px 0' }}>Frequently Asked Questions</h2>
          <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 20, marginTop: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 8px 0' }}>How will the 2032 Olympics affect Woolloongabba businesses?</h3>
            <p style={{ fontSize: 13, color: S.n900, lineHeight: 1.7, margin: 0 }}>Directly and materially. The Gabba is the primary Olympic stadium, requiring full precinct upgrade. Cross River Rail, residential build-out, and hospitality precinct development are transforming the suburb's commercial character now, before 2032. Operators who establish in 2026 will have 6 years of below-market rent before the Olympic-era commercial maturity arrives.</p>
          </div>
          <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 20, marginTop: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 8px 0' }}>What is the commercial rent in Woolloongabba?</h3>
            <p style={{ fontSize: 13, color: S.n900, lineHeight: 1.7, margin: 0 }}>Logan Road prime positions: $4,000–$6,500/month. Secondary street positions: $2,500–$4,000/month. Stadium-adjacent positions (Stanley Street): $3,000–$5,500/month. Rents currently reflect the old Woolloongabba, not the post-Olympic version. This is the window.</p>
          </div>
          <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 20, marginTop: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 8px 0' }}>Is Woolloongabba safe and accessible?</h3>
            <p style={{ fontSize: 13, color: S.n900, lineHeight: 1.7, margin: 0 }}>Yes. Cross River Rail makes Woolloongabba 12 minutes from the CBD by direct train. The precinct is undergoing active urban upgrade funded by Olympic infrastructure. The historic safety concerns of the 1990s Woolloongabba are not current — the suburb has been stable and improving for over a decade.</p>
          </div>
        </div>
        <div style={{ background: `linear-gradient(135deg, #059669 0%, #047857 100%)`, borderRadius: 16, padding: '40px 32px', marginBottom: 48, textAlign: 'center' as const }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', margin: '0 0 10px 0' }}>Ready to analyse your Woolloongabba location?</h3>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', margin: '0 0 24px 0' }}>Get foot traffic, competition, demographics, and a GO/CAUTION/NO verdict for your specific address.</p>
          <Link href="/onboarding" style={{ display: 'inline-block', background: S.white, color: '#059669', padding: '13px 28px', borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>Analyse your address →</Link>
        </div>
        <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 32, paddingBottom: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' as const, gap: 12 }}>
          <Link href="/analyse/brisbane" style={{ fontSize: 13, fontWeight: 600, color: S.brand, textDecoration: 'none' }}>← Back to Brisbane</Link>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' as const }}>
            <Link href="/analyse/brisbane/annerley" style={{ fontSize: 13, color: S.brand, textDecoration: 'none' }}>Annerley</Link> <Link href="/analyse/brisbane/south-brisbane" style={{ fontSize: 13, color: S.brand, textDecoration: 'none' }}>South Brisbane</Link> <Link href="/analyse/brisbane/kangaroo-point" style={{ fontSize: 13, color: S.brand, textDecoration: 'none' }}>Kangaroo Point</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
