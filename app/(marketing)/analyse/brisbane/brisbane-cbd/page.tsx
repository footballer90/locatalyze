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
    headline: 'Brisbane CBD Business Location Analysis 2026 — Locatalyze',
    description: "Queensland's commercial core. Queen Street Mall foot traffic is genuine but CBD rents of $12,000–$28,000/month demand extraordinary volumes. Post-pandemic office recovery at 70–75% has permanently restructured who succeeds here.",
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
      name: 'Is Brisbane CBD good for a café?',
      acceptedAnswer: { '@type': 'Answer', text: "Only with differentiation. Generic café economics don't survive $15,000–$28,000/month rent without extraordinary volume. A specialty concept with roaster retail, corporate catering, or a specific offering that builds loyalty beyond convenience can work. A standard café in a strip position hoping for CBD foot traffic will be marginalised by chain positions." },
    },
    {
      '@type': 'Question',
      name: 'What is the rent in Brisbane CBD?',
      acceptedAnswer: { '@type': 'Answer', text: 'Prime Queen Street Mall positions: $20,000–$28,000/month. CBD laneway and secondary street positions: $12,000–$18,000/month. CBD fringe (creek end, upper CBD): $8,000–$14,000/month. All figures gross — negotiate hard for fit-out contributions and rent-free periods in current market conditions.' },
    },
    {
      '@type': 'Question',
      name: 'How has the Brisbane CBD changed post-pandemic?',
      acceptedAnswer: { '@type': 'Answer', text: 'Office occupancy has settled at 68–72% of 2019 peak on best days (Tues–Wed) and 45–55% on Mondays and Fridays. This is now structural, not transitional. CBD operators who have survived have repositioned around premium, corporate entertainment, and higher average transaction values rather than volume-dependent models.' },
    },
    ],
  },
]

export default function BrisbaneCBDPage() {
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
      <div style={{ background: `linear-gradient(135deg, #0369A1 0%, #024F80 100%)`, padding: '56px 24px 48px', color: S.white }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 16, textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>
            <Link href="/analyse" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Analyse</Link>
            {' / '}
            <Link href="/analyse/brisbane" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Brisbane</Link>
            {' / '}
            Brisbane CBD
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 900, margin: '0 0 12px 0', lineHeight: 1.15 }}>
            Brisbane CBD
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.7, opacity: 0.9, margin: '0 0 28px 0', maxWidth: 620 }}>
            Queensland's commercial core. Queen Street Mall foot traffic is genuine but CBD rents of $12,000–$28,000/month demand extraordinary volumes. Post-pandemic office recovery at 70–75% has permanently restructured who succeeds here.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' as const }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '16px 24px', textAlign: 'center' as const }}>
              <div style={{ fontSize: 36, fontWeight: 900, lineHeight: 1 }}>72</div>
              <div style={{ fontSize: 11, opacity: 0.8, marginTop: 4 }}>Overall Score</div>
            </div>
            <div>
              <VerdictBadge v="CAUTION" />
              <div style={{ fontSize: 12, opacity: 0.75, marginTop: 8 }}>QLD 4000 • Revenue potential $45K–$120K/mo for viable concepts</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px' }}>

        {/* Score card */}
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginTop: 32, marginBottom: 40 }}>
          <h2 style={{ color: '#1C1917', fontSize: 16, fontWeight: 700, margin: '0 0 24px 0' }}>Location Scores</h2>
          <ScoreBar label='Foot Traffic' value={88} />
          <ScoreBar label='Demographics' value={74} />
          <ScoreBar label='Rent Viability' value={52} />
          <ScoreBar label='Competition Gap' value={68} />
        </div>

        {/* Business environment */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1C1917', margin: '0 0 20px 0' }}>Business Environment</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Brisbane CBD operates at two speeds simultaneously. Queen Street Mall on a Saturday afternoon has foot traffic density that competes with any retail precinct in Australia. Queen Street between 11am and 2pm on a Tuesday carries a professional worker concentration that is real and substantial. Both of these observations are true, and neither of them changes the fundamental arithmetic problem of CBD rent: at $15,000–$28,000/month for a viable retail position, you need extraordinary revenue just to be standing. Most independent operators are not in the position to absorb 12 months of rent while establishing customer base.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>The structural change from hybrid work is now permanent, not transitional. Brisbane CBD office occupancy runs at 68–72% of 2019 peak levels on the best days — Tuesdays and Wednesdays — and falls to 45–55% on Mondays and Fridays. The lunchtime populations that made the CBD viable for a 60-seat café in 2018 are not fully there anymore. Operators who signed pre-2020 leases and model their 2026 revenue against 2018 foot traffic assumptions are the ones in trouble. New operators entering the CBD need to model against current occupancy data, not historical benchmarks.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>The businesses succeeding in the CBD in 2026 are premium concepts with high average transaction values. A fine dining restaurant at $90 per head with 60 covers on a Friday evening builds a revenue model that works at CBD rents. A specialty coffee bar with strong off-peak trade, corporate catering, and a retail coffee bean offering builds a model. A bulk-billing GP whose revenue comes from Medicare, not retail walk-ins, builds a model. The category that does not build a model is the generic 80-seat café competing on convenience. That model needed 2019 foot traffic, and 2019 foot traffic is not coming back.</p>
          </div>
        </div>

        {/* Competition */}
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 18, fontWeight: 700, margin: '0 0 16px 0' }}>Competition Analysis</h2>
          <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>CBD competition is intense across all categories. Coffee is particularly saturated — major chains (Toby's Estate, Single O, Mecca Espresso) hold positions across the CBD grid that independent operators cannot outcompete on convenience or marketing reach. The competitive opportunity in the CBD is where chains do not go: highly specific cuisine concepts, premium wellness, allied health in CBD-adjacent buildings, and corporate service operators with relationships that drive captive revenue.</p>
        </div>

        {/* What works */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1C1917', margin: '0 0 20px 0' }}>What Works Here</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1C1917', margin: 0 }}>Premium Fine Dining ($80+ per head)</h3>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, margin: 0 }}>The CBD corporate entertainment market is real and premium-priced. Quality three-course dining with wine at $100–$150 per person is well-supported by Friday and Saturday evening trade, corporate lunches, and pre-theatre. Revenue potential $90,000–$130,000/month for a well-positioned 60-seat restaurant.</p>
            </div>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1C1917', margin: 0 }}>Corporate Allied Health (Physio, Psychology)</h3>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, margin: 0 }}>CBD workers with corporate health funds actively seek quality allied health within walking distance. Medicare-funded bulk-billing services or privately-billed premium practices in CBD towers attract consistent professional clientele. Revenue $50,000–$80,000/month with low competition from chains.</p>
            </div>
            <div style={{ background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1C1917', margin: 0 }}>Specialty Coffee (Owner-Operated)</h3>
                <VerdictBadge v="CAUTION" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, margin: 0 }}>Viable only with a differentiating angle: roaster retail, cold brew production, or a distinct concept that builds loyalty beyond convenience. Strip-mall coffee competing on location alone will be squeezed out by chain positions.</p>
            </div>
          </div>
        </div>

        {/* Key risks */}
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 18, fontWeight: 700, margin: '0 0 20px 0' }}>Key Risks</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 20 }}>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.amber}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#1C1917', margin: '0 0 4px 0' }}>Rent Mathematics</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>At $20,000+/month rent, you need $200,000+ monthly revenue before profit. Most categories cannot sustain this without extraordinary volume or high average transaction values.</p>
            </div>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.amber}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#1C1917', margin: '0 0 4px 0' }}>Hybrid Work Structural Decline</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>Office population is not returning to 2019 levels. Models built on full-week CBD occupancy assumptions will persistently underperform against projections.</p>
            </div>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.amber}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#1C1917', margin: '0 0 4px 0' }}>Queen Street Mall Leasing Terms</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>Mall tenancies often carry percentage-of-revenue clauses that claw back profits during strong trading periods. Read lease terms carefully before CBD commitments.</p>
            </div>
          </div>
        </div>

        {/* Nearby suburbs */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1C1917', margin: '0 0 20px 0' }}>Compare Nearby Suburbs</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <Link href="/analyse/brisbane/fortitude-valley" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 16, cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = S.brand)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = S.border)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h4 style={{ color: '#1C1917', fontSize: 14, fontWeight: 700, margin: 0 }}>Fortitude Valley</h4>
                  <VerdictBadge v="GO" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: S.brand }}>74</div>
                <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>1.2km north, better economics</div>
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
                <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>River crossing, cultural precinct</div>
              </div>
            </Link>
            <Link href="/analyse/brisbane/spring-hill" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 16, cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = S.brand)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = S.border)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h4 style={{ color: '#1C1917', fontSize: 14, fontWeight: 700, margin: 0 }}>Spring Hill</h4>
                  <VerdictBadge v="CAUTION" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: S.brand }}>69</div>
                <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>Office district, weekday only</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Poll */}
        <SuburbPoll suburb="Brisbane CBD" votes={[28, 34, 38]} />

        {/* Final verdict */}
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 18, fontWeight: 700, margin: '0 0 20px 0' }}>Final Verdict</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Brisbane CBD is CAUTION, not NO. The distinction matters. The CBD has genuine foot traffic, real professional spending, and specific categories that perform. Premium hospitality, corporate allied health, and specialty concepts with non-generic positioning can and do succeed here. The error is not that the CBD is impossible — it is that the CBD is unforgiving of average concepts.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Operators considering the CBD should model at 70% of assumed peak foot traffic, not 100%. They should budget for six months of below-model trading while establishing customer loyalty. They should identify a specific competitive angle that neither chains nor generic independent operators occupy. With that preparation, the CBD is a viable market. Without it, the rent mathematics will end the business within 18 months.</p>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 18, fontWeight: 700, margin: '0 0 4px 0' }}>Frequently Asked Questions</h2>
          <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 20, marginTop: 20 }}>
            <h3 style={{ color: '#1C1917', fontSize: 15, fontWeight: 700, margin: '0 0 8px 0' }}>Is Brisbane CBD good for a café?</h3>
            <p style={{ fontSize: 13, color: S.n900, lineHeight: 1.7, margin: 0 }}>Only with differentiation. Generic café economics don't survive $15,000–$28,000/month rent without extraordinary volume. A specialty concept with roaster retail, corporate catering, or a specific offering that builds loyalty beyond convenience can work. A standard café in a strip position hoping for CBD foot traffic will be marginalised by chain positions.</p>
          </div>
          <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 20, marginTop: 20 }}>
            <h3 style={{ color: '#1C1917', fontSize: 15, fontWeight: 700, margin: '0 0 8px 0' }}>What is the rent in Brisbane CBD?</h3>
            <p style={{ fontSize: 13, color: S.n900, lineHeight: 1.7, margin: 0 }}>Prime Queen Street Mall positions: $20,000–$28,000/month. CBD laneway and secondary street positions: $12,000–$18,000/month. CBD fringe (creek end, upper CBD): $8,000–$14,000/month. All figures gross — negotiate hard for fit-out contributions and rent-free periods in current market conditions.</p>
          </div>
          <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 20, marginTop: 20 }}>
            <h3 style={{ color: '#1C1917', fontSize: 15, fontWeight: 700, margin: '0 0 8px 0' }}>How has the Brisbane CBD changed post-pandemic?</h3>
            <p style={{ fontSize: 13, color: S.n900, lineHeight: 1.7, margin: 0 }}>Office occupancy has settled at 68–72% of 2019 peak on best days (Tues–Wed) and 45–55% on Mondays and Fridays. This is now structural, not transitional. CBD operators who have survived have repositioned around premium, corporate entertainment, and higher average transaction values rather than volume-dependent models.</p>
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: `linear-gradient(135deg, #059669 0%, #047857 100%)`, borderRadius: 16, padding: '40px 32px', marginBottom: 48, textAlign: 'center' as const }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: '#FFFFFF', margin: '0 0 10px 0' }}>Ready to analyse your Brisbane CBD location?</h3>
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
