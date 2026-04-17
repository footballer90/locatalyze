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
  const cfg = {
    GO:      { bg: '#ECFDF5', border: '#A7F3D0', color: '#059669', label: 'GO' },
    CAUTION: { bg: '#FFFBEB', border: '#FDE68A', color: '#D97706', label: 'CAUTION' },
    NO:      { bg: '#FEF2F2', border: '#FECACA', color: '#DC2626', label: 'NO' },
  }[v]
  return (
    <span style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color,
      borderRadius: 8, padding: '3px 10px', fontSize: 11, fontWeight: 800, letterSpacing: '0.06em' }}>
      {cfg.label}
    </span>
  )
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const color = value >= 70 ? S.emerald : value >= 50 ? S.amber : S.red
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 12, color: S.muted, fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 800, color }}>{value}/100</span>
      </div>
      <div style={{ height: 6, background: S.border, borderRadius: 100, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${value}%`, background: color, borderRadius: 100 }} />
      </div>
    </div>
  )
}

function SuburbPoll({ suburb, votes: initVotes }: { suburb: string; votes: number[] }) {
  const [voted, setVoted] = useState<number | null>(null)
  const [votes, setVotes] = useState(initVotes)
  const opts = ["Café or coffee shop", "Restaurant or bar", "Retail or boutique", "Allied health or wellness", "Professional services"]
  const total = votes.reduce((a, b) => a + b, 0)
  const vote = (i: number) => {
    if (voted !== null) return
    setVoted(i)
    setVotes(v => v.map((n, j) => j === i ? n + 1 : n))
  }
  return (
    <section style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: 24, marginBottom: 32 }}>
      <h3 style={{ fontSize: 15, fontWeight: 800, color: S.n900, marginBottom: 4 }}>What business are you planning in {suburb}?</h3>
      <p style={{ fontSize: 12, color: S.muted, marginBottom: 16 }}>{voted === null ? 'Vote to see results' : `${total + 1} votes`}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {opts.map((opt, i) => {
          const pct = voted !== null ? Math.round(votes[i] / (total + 1) * 100) : 0
          return (
            <button key={i} onClick={() => vote(i)} style={{
              position: 'relative', textAlign: 'left', background: voted === i ? S.emeraldBg : S.n50,
              border: `1px solid ${voted === i ? S.emeraldBdr : S.border}`, borderRadius: 10,
              padding: '10px 14px', cursor: voted !== null ? 'default' : 'pointer', overflow: 'hidden',
            }}>
              {voted !== null && <div style={{ position: 'absolute', inset: 0, background: S.emeraldBg, width: `${pct}%`, opacity: 0.4, borderRadius: 10 }} />}
              <span style={{ position: 'relative', fontSize: 13, fontWeight: 600, color: S.n900 }}>{opt}</span>
              {voted !== null && <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 12, fontWeight: 700, color: S.emerald }}>{pct}%</span>}
            </button>
          )
        })}
      </div>
    </section>
  )
}

const SCHEMAS = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Opening a Business in Thebarton, Adelaide: 2026 Location Guide',
    description: "Thebarton's industrial-to-creative transition is real but early — the suburb has genuine character and improving demographics, but commercial viability for mainstream business types remains dependent on the pace of gentrification.",
    author: { '@type': 'Organisation', name: 'Locatalyze', url: 'https://www.locatalyze.com' },
    publisher: { '@type': 'Organisation', name: 'Locatalyze' },
    datePublished: '2026-01-01',
    dateModified: '2026-04-01',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
    { '@type': 'Question', name: "What kind of businesses succeed in Thebarton?", acceptedAnswer: { '@type': 'Answer', text: "Production-plus-retail concepts with genuine craft identity, breweries and specialty beverage producers who can attract enthusiasts, and creative services businesses that use the industrial space affordably. Standard hospitality and retail concepts that depend on passing foot traffic struggle without a deliberate destination strategy." } },
    { '@type': 'Question', name: "How far along is Thebarton's gentrification compared to Bowden?", acceptedAnswer: { '@type': 'Answer', text: "Bowden has a cleaner, more planned transition anchored by deliberate urban renewal development. Thebarton's transition is more organic and dispersed — the creative precinct character is genuine but the commercial ecosystem is less cohesive. Bowden is 3–5 years ahead of Thebarton by most measures." } },
    { '@type': 'Question', name: "Are the rents in Thebarton genuinely low?", acceptedAnswer: { '@type': 'Answer', text: "Yes — commercial and industrial spaces in Thebarton are among the most affordable in metro-accessible Adelaide. $2,200–$4,500/month for ground-floor commercial tenancies, and converted warehouse spaces can be negotiated at lower rates on long leases. This rent level provides substantial margin headroom for operators who can generate consistent volume." } }
    ],
  },
]

export default function ThebartonPage() {
  return (
    <div style={{ minHeight: '100vh', background: S.n50, fontFamily: "'DM Sans','Helvetica Neue',Arial,sans-serif", color: S.n900 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMAS) }} />

      {/* Sticky nav */}
      <nav style={{ background: S.white, borderBottom: `1px solid ${S.border}`, padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/analyse/adelaide" style={{ fontSize: 13, fontWeight: 700, color: S.brand, textDecoration: 'none' }}>← Adelaide</Link>
        <Link href="/onboarding" style={{ background: S.brand, color: S.white, borderRadius: 10, padding: '8px 18px', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>Analyse free →</Link>
      </nav>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0E7490 0%, #0891B2 100%)', padding: '52px 24px 44px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
            <Link href="/analyse/adelaide" style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>Adelaide</Link>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>›</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Thebarton</span>
          </div>
          <h1 style={{ fontSize: 'clamp(26px,5vw,46px)', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 14 }}>
            Opening a Business in Thebarton, SA: 2026 Location Analysis
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', maxWidth: 580, lineHeight: 1.7, marginBottom: 22 }}>
            Thebarton's industrial-to-creative transition is real but early — the suburb has genuine character and improving demographics, but commercial viability for mainstream business types remains dependent on the pace of gentrification.
          </p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <VerdictBadge v="CAUTION" />
            <span style={{ fontSize: 28, fontWeight: 900, color: '#FFFFFF' }}>69/100</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>Location score</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '4px 12px' }}>$2,200–$4,500/mo</span>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 12 }}>South Road · Henley Beach Road node · $76K median income · creative precinct emerging</p>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* Score card */}
        <section style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: 24, marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: S.n900, marginBottom: 20 }}>Location Scorecard</h2>
          <ScoreBar label="Foot Traffic" value={60} />
          <ScoreBar label="Demographics" value={68} />
          <ScoreBar label="Rent Viability" value={86} />
          <ScoreBar label="Competition Gap" value={84} />
          <p style={{ fontSize: 11, color: S.muted, marginTop: 8 }}>Scores reflect foot traffic patterns, demographic alignment, rent viability, and competition gap for Thebarton.</p>
        </section>

        {/* Business environment */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, color: S.n900 }}>Business Environment</h2>
          <p style={{ fontSize: 15, lineHeight: 1.75, marginBottom: 14, color: S.muted }}>Thebarton sits in Adelaide's inner west — 4km from the CBD — and has historically been a light-industrial and working-class residential suburb. Over the last decade it has experienced a creative precinct transition: artist studios, small-batch breweries, specialty food producers, and some hospitality concepts have moved into the former industrial buildings. This transition is genuine but patchy.</p>
          <p style={{ fontSize: 15, lineHeight: 1.75, marginBottom: 14, color: S.muted }}>The demographic is improving but still well below the inner-east benchmarks. Median household income around $76,000 reflects both the traditional residential base and an incoming younger, creatively employed cohort. The two groups have different spending behaviours and different expectations — operators who understand this dual demographic design their offer accordingly.</p>
          <p style={{ fontSize: 15, lineHeight: 1.75, marginBottom: 14, color: S.muted }}>Rents are among the lowest for any inner-ring Adelaide suburb: commercial tenancies run $2,200–$4,500/month, and converted industrial spaces can be configured for much lower cost. This rent level means the margin economics can work even at modest trading volumes — the challenge is generating those volumes in a suburb that does not yet have destination-level foot traffic.</p>
        </section>

        {/* Competition */}
        <section style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: 24, marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: S.n900, marginBottom: 12 }}>Competition Analysis</h2>
          <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.7 }}>Thebarton's commercial competitive field is sparse. The hospitality mix is thin and low-quality outside a small cluster of breweries and creative-economy adjacent concepts. Traditional retail and services are underdeveloped. For concepts that fit the creative precinct identity — specialty food, craft beverage, artisan production with retail — the competition is minimal.</p>
        </section>

        {/* What works */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, color: S.n900 }}>What Works Here</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 14 }}>
              <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 12, padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.08em' }}>GO</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Production-plus-retail concepts</p>
                <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6 }}>Thebarton's industrial character supports businesses that combine production and retail — small-batch roasting, craft brewing, artisan baking with front-of-house sales. Several of Adelaide's most successful specialty food producers have established in this model here.</p>
              </div>
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 12, padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.08em' }}>CAUTION</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Standard café or restaurant</p>
                <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6 }}>Without the foot traffic anchor of a destination precinct, a standalone café or restaurant in Thebarton needs to be genuinely worth the trip. Day-in, day-out walk-in volume is insufficient to sustain a full-week operation without a compelling offer.</p>
              </div>
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 12, padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.08em' }}>CAUTION</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Premium price-point retail</p>
                <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6 }}>The current demographic mix does not consistently support premium price points. A concept aimed at the incoming creative professional cohort needs to be patient as that demographic builds in density.</p>
              </div>
          </div>
        </section>

        {/* Key risks */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, color: S.n900 }}>Key Risks</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: '13px 16px' }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#92400E', marginBottom: 3 }}>Gentrification pace uncertainty</p>
                <p style={{ fontSize: 12, color: '#78350F', lineHeight: 1.6 }}>The creative precinct transition is real but slower than equivalent transformations in Melbourne or Sydney inner-west suburbs. Timelines are difficult to predict and operators assuming rapid change may face a longer wait.</p>
              </div>
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: '13px 16px' }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#92400E', marginBottom: 3 }}>Low pedestrian density</p>
                <p style={{ fontSize: 12, color: '#78350F', lineHeight: 1.6 }}>Outside specific nodes and event days, street-level foot traffic in Thebarton is low. Car-dependent access and limited pedestrian infrastructure means businesses need destination-quality to generate visits.</p>
              </div>
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: '13px 16px' }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#92400E', marginBottom: 3 }}>Industrial character limits hospitality formats</p>
                <p style={{ fontSize: 12, color: '#78350F', lineHeight: 1.6 }}>Converted warehouses require significant investment to create functional hospitality spaces. Heritage protections and building condition issues can complicate and extend fit-out timelines.</p>
              </div>
          </div>
        </section>

        {/* Compare nearby */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, color: S.n900 }}>Compare Nearby Suburbs</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14 }}>
              <a href="/analyse/adelaide/bowden" style={{ textDecoration: 'none' }}>
                <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: '14px 16px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: S.n900 }}>Bowden</span>
                    <VerdictBadge v="GO" />
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: S.brand }}>72</div>
                  <div style={{ fontSize: 11, color: S.muted, marginTop: 2 }}>Adjacent · more developed</div>
                </div>
              </a>
              <a href="/analyse/adelaide/prospect" style={{ textDecoration: 'none' }}>
                <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: '14px 16px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: S.n900 }}>Prospect</span>
                    <VerdictBadge v="GO" />
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: S.brand }}>78</div>
                  <div style={{ fontSize: 11, color: S.muted, marginTop: 2 }}>Inner north · safer choice</div>
                </div>
              </a>
              <a href="/analyse/adelaide/north-adelaide" style={{ textDecoration: 'none' }}>
                <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: '14px 16px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: S.n900 }}>North Adelaide</span>
                    <VerdictBadge v="GO" />
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: S.brand }}>79</div>
                  <div style={{ fontSize: 11, color: S.muted, marginTop: 2 }}>O'Connell · premium</div>
                </div>
              </a>
          </div>
        </section>

        {/* Poll */}
        <SuburbPoll suburb="Thebarton" votes={[39, 26, 18, 12, 5]} />

        {/* Final verdict */}
        <section style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: 24, marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <VerdictBadge v="CAUTION" />
            <h2 style={{ fontSize: 16, fontWeight: 800, color: S.n900 }}>Final Verdict: Thebarton</h2>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: S.muted, marginBottom: 10 }}>Thebarton is a CAUTION — not because the opportunity is absent but because the timing risk is real. The creative precinct transition is genuine and the rent economics are extraordinary, but foot traffic outside events and destination visits is not yet sufficient for mainstream hospitality models.</p>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: S.muted, marginBottom: 10 }}>The right operator for Thebarton is one whose concept fits the precinct identity, who can operate profitably at modest volumes given the rent advantage, and who has the conviction to wait for the surrounding demographic to mature. That operator has a genuine opportunity. The operator who opens a generic café hoping for foot traffic that hasn't materialised yet will struggle.</p>
        </section>

        {/* FAQ */}
        <section style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: 24, marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: S.n900, marginBottom: 20 }}>Frequently Asked Questions</h2>
              <details style={{ borderBottom: `1px solid ${S.border}`, paddingBottom: 12, marginBottom: 12 }}>
                <summary style={{ fontSize: 13, fontWeight: 700, color: S.n900, cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  What kind of businesses succeed in Thebarton? <span style={{ color: S.brand }}>+</span>
                </summary>
                <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.7, marginTop: 10 }}>Production-plus-retail concepts with genuine craft identity, breweries and specialty beverage producers who can attract enthusiasts, and creative services businesses that use the industrial space affordably. Standard hospitality and retail concepts that depend on passing foot traffic struggle without a deliberate destination strategy.</p>
              </details>
              <details style={{ borderBottom: `1px solid ${S.border}`, paddingBottom: 12, marginBottom: 12 }}>
                <summary style={{ fontSize: 13, fontWeight: 700, color: S.n900, cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  How far along is Thebarton's gentrification compared to Bowden? <span style={{ color: S.brand }}>+</span>
                </summary>
                <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.7, marginTop: 10 }}>Bowden has a cleaner, more planned transition anchored by deliberate urban renewal development. Thebarton's transition is more organic and dispersed — the creative precinct character is genuine but the commercial ecosystem is less cohesive. Bowden is 3–5 years ahead of Thebarton by most measures.</p>
              </details>
              <details style={{ borderBottom: `1px solid ${S.border}`, paddingBottom: 12, marginBottom: 12 }}>
                <summary style={{ fontSize: 13, fontWeight: 700, color: S.n900, cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  Are the rents in Thebarton genuinely low? <span style={{ color: S.brand }}>+</span>
                </summary>
                <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.7, marginTop: 10 }}>Yes — commercial and industrial spaces in Thebarton are among the most affordable in metro-accessible Adelaide. $2,200–$4,500/month for ground-floor commercial tenancies, and converted warehouse spaces can be negotiated at lower rates on long leases. This rent level provides substantial margin headroom for operators who can generate consistent volume.</p>
              </details>
        </section>

        {/* CTA */}
        <div style={{ background: 'linear-gradient(135deg, #0F766E 0%, #0B5E57 100%)', borderRadius: 14, padding: '44px 40px', textAlign: 'center', marginBottom: 44 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#FFFFFF', marginBottom: 10 }}>Analyse Your Thebarton Address</h2>
          <p style={{ fontSize: 14, color: 'rgba(167,243,208,0.8)', marginBottom: 24, maxWidth: 440, margin: '0 auto 24px', lineHeight: 1.7 }}>
            Get a full GO/CAUTION/NO verdict with competitor map, financial model and 3-year projection for your specific address in Thebarton. First report free.
          </p>
          <Link href="/onboarding" style={{ background: '#FFFFFF', color: '#0F766E', borderRadius: 10, padding: '14px 32px', fontSize: 15, fontWeight: 800, textDecoration: 'none', display: 'inline-block' }}>
            Start Free Analysis →
          </Link>
        </div>

        {/* Footer nav */}
        <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 24, display: 'flex', gap: 12, justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Link href="/analyse/adelaide" style={{ fontSize: 13, fontWeight: 700, color: S.brand, textDecoration: 'none' }}>← Back to Adelaide</Link>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {[{ slug: "bowden", name: "Bowden" }, { slug: "prospect", name: "Prospect" }, { slug: "north-adelaide", name: "North Adelaide" }].map(n => (
              <Link key={n.slug} href={`/analyse/adelaide/${n.slug}`} style={{ fontSize: 13, fontWeight: 700, color: S.brand, textDecoration: 'none' }}>{n.name}</Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
