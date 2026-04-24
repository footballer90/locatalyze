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
    headline: 'Opening a Business in Semaphore, Adelaide: 2026 Location Guide',
    description: "Semaphore Road is the best value emerging coastal strip in metropolitan Adelaide — growing fast, still affordable, with a genuine community identity and demographic momentum.",
    author: { '@type': 'Organisation', name: 'Locatalyze', url: 'https://locatalyze.com' },
    publisher: { '@type': 'Organisation', name: 'Locatalyze' },
    datePublished: '2026-01-01',
    dateModified: '2026-04-01',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
    { '@type': 'Question', name: "Is Semaphore a good place to open a café in 2026?", acceptedAnswer: { '@type': 'Answer', text: "Yes, if you have the patience for an emerging strip. The demographics are transitioning in the right direction, rents are exceptional, and there are genuine first-mover opportunities in specialty coffee and premium casual dining. The risk is timing — full momentum may take 2–3 years." } },
    { '@type': 'Question', name: "How does Semaphore compare to Henley Beach?", acceptedAnswer: { '@type': 'Answer', text: "Henley Beach has higher foot traffic, a more established commercial ecosystem, and a higher-income existing demographic. Semaphore has lower rents, more competition gaps, and more first-mover upside. For operators with a longer runway and a category-leadership strategy, Semaphore offers better economics; for operators who want a proven strip with more immediate foot traffic, Henley Beach is the safer choice." } },
    { '@type': 'Question', name: "What is the demographic trend in Semaphore?", acceptedAnswer: { '@type': 'Answer', text: "The suburb is in transition. A wave of younger professional households is moving to the Port Adelaide corridor attracted by coastal lifestyle and housing affordability. This is the same demographic shift that transformed suburbs like Brunswick (Melbourne) and Marrickville (Sydney) in earlier cycles. Semaphore is approximately 5 years behind those trajectories." } }
    ],
  },
]

export default function SemaphorePage() {
  return (
    <div style={{ minHeight: '100vh', background: S.n50, fontFamily: "'DM Sans','Helvetica Neue',Arial,sans-serif", color: S.n900 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMAS) }} />
{/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0E7490 0%, #0891B2 100%)', padding: '52px 24px 44px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
            <Link href="/analyse/adelaide" style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>Adelaide</Link>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>›</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Semaphore</span>
          </div>
          <h1 style={{ fontSize: 'clamp(26px,5vw,46px)', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 14 }}>
            Opening a Business in Semaphore, SA: 2026 Location Analysis
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', maxWidth: 580, lineHeight: 1.7, marginBottom: 22 }}>
            Semaphore Road is the best value emerging coastal strip in metropolitan Adelaide — growing fast, still affordable, with a genuine community identity and demographic momentum.
          </p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <VerdictBadge v="GO" />
            <span style={{ fontSize: 28, fontWeight: 900, color: '#FFFFFF' }}>70/100</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>Location score</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '4px 12px' }}>$2,500–$4,500/mo</span>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 12 }}>Semaphore Road · Port Adelaide precinct · $78K median income · strong community identity</p>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* Score card */}
        <section style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: 24, marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: S.n900, marginBottom: 20 }}>Location Scorecard</h2>
          <ScoreBar label="Foot Traffic" value={67} />
          <ScoreBar label="Demographics" value={74} />
          <ScoreBar label="Rent Viability" value={84} />
          <ScoreBar label="Competition Gap" value={80} />
          <p style={{ fontSize: 11, color: S.muted, marginTop: 8 }}>Scores reflect foot traffic patterns, demographic alignment, rent viability, and competition gap for Semaphore.</p>
        </section>

        {/* Business environment */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, color: S.n900 }}>Business Environment</h2>
          <p style={{ fontSize: 15, lineHeight: 1.75, marginBottom: 14, color: S.muted }}>Semaphore Road is Adelaide's emerging coastal strip — still in the early phase of its transition from a traditional neighbourhood commercial street to a destination dining and specialty retail corridor. The strip runs approximately 600m through the suburb, hosting a mix of long-established local services, a growing cluster of independent hospitality, and some early boutique retail. Foot traffic is growing but not yet at the levels of Glenelg or Henley Beach.</p>
          <p style={{ fontSize: 15, lineHeight: 1.75, marginBottom: 14, color: S.muted }}>The demographic is different from the inner-east suburbs — median household income of around $78,000 reflects the Port Adelaide corridor's working-class heritage, though this is changing as younger professional households move in attracted by affordability and the coastal location. The consumer profile is shifting toward the 25–40 professional renter demographic that has driven similar transformations in Melbourne's inner-north and west.</p>
          <p style={{ fontSize: 15, lineHeight: 1.75, marginBottom: 14, color: S.muted }}>Rents are the standout attraction: prime Semaphore Road tenancies run $3,000–$4,500 per month, with some quality positions available below $3,000. These are extraordinary rents for a coastal strip with growing demand — the kind of rent level that provides genuine operating margin headroom for a well-run independent hospitality concept.</p>
        </section>

        {/* Competition */}
        <section style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: 24, marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: S.n900, marginBottom: 12 }}>Competition Analysis</h2>
          <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.7 }}>Semaphore Road's competitive field is genuinely thin at the premium level. There is no serious specialty coffee operator, no premium licensed dining concept, and the wellness segment is almost entirely absent. For first-movers who understand the demographic trajectory, the opportunity to establish category leadership before rents rise is significant.</p>
        </section>

        {/* What works */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, color: S.n900 }}>What Works Here</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 14 }}>
              <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 12, padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.08em' }}>GO</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>First-mover specialty café</p>
                <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6 }}>The strip currently has no serious specialty coffee operator. An operator who establishes the quality-coffee benchmark at Semaphore builds a loyal following from both the existing community and the incoming professional demographic.</p>
              </div>
              <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 12, padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.08em' }}>GO</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Casual dining with community identity</p>
                <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6 }}>Semaphore has a strong community identity and residents actively support local operators who engage with that identity. A casual dining concept with genuine personality — not a generic offer — builds the kind of loyalty that weathers economic cycles.</p>
              </div>
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 12, padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.08em' }}>CAUTION</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Premium concepts requiring high spend</p>
                <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6 }}>The current demographic income base does not yet support fine-dining price points. A premium concept needs to offer genuine value-for-money or target the incoming professional demographic rather than the existing majority.</p>
              </div>
          </div>
        </section>

        {/* Key risks */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, color: S.n900 }}>Key Risks</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: '13px 16px' }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#92400E', marginBottom: 3 }}>Demographic transition still in early phase</p>
                <p style={{ fontSize: 12, color: '#78350F', lineHeight: 1.6 }}>The influx of higher-income younger residents is real but incomplete. Operators betting on the transformation need 2–3 years for the demographic to reach critical mass. Early movers take this risk.</p>
              </div>
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: '13px 16px' }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#92400E', marginBottom: 3 }}>Distance from metropolitan employment hubs</p>
                <p style={{ fontSize: 12, color: '#78350F', lineHeight: 1.6 }}>Semaphore is 14km from the CBD and 20+ minutes from major inner suburban employment centres. The lack of fast public transport limits the weekday lunch market and reduces the density of high-income commuter traffic.</p>
              </div>
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: '13px 16px' }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#92400E', marginBottom: 3 }}>Lower baseline income than inner suburbs</p>
                <p style={{ fontSize: 12, color: '#78350F', lineHeight: 1.6 }}>Current median income is $78,000 — below the inner-east and inner-south benchmarks. Pricing needs to reflect what the current demographic can support while positioning for the incoming cohort.</p>
              </div>
          </div>
        </section>

        {/* Compare nearby */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, color: S.n900 }}>Compare Nearby Suburbs</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14 }}>
              <a href="/analyse/adelaide/henley-beach" style={{ textDecoration: 'none' }}>
                <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: '14px 16px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: S.n900 }}>Henley Beach</span>
                    <VerdictBadge v="GO" />
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: S.brand }}>74</div>
                  <div style={{ fontSize: 11, color: S.muted, marginTop: 2 }}>Coastal · stronger strip</div>
                </div>
              </a>
              <a href="/analyse/adelaide/port-adelaide" style={{ textDecoration: 'none' }}>
                <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: '14px 16px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: S.n900 }}>Port Adelaide</span>
                    <VerdictBadge v="CAUTION" />
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: S.brand }}>68</div>
                  <div style={{ fontSize: 11, color: S.muted, marginTop: 2 }}>Nearby · transitioning</div>
                </div>
              </a>
              <a href="/analyse/adelaide/glenelg" style={{ textDecoration: 'none' }}>
                <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: '14px 16px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: S.n900 }}>Glenelg</span>
                    <VerdictBadge v="GO" />
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: S.brand }}>81</div>
                  <div style={{ fontSize: 11, color: S.muted, marginTop: 2 }}>Jetty Rd · benchmark</div>
                </div>
              </a>
          </div>
        </section>

        {/* Poll */}
        <SuburbPoll suburb="Semaphore" votes={[44, 27, 14, 11, 4]} />

        {/* Final verdict */}
        <section style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: 24, marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <VerdictBadge v="GO" />
            <h2 style={{ fontSize: 16, fontWeight: 800, color: S.n900 }}>Final Verdict: Semaphore</h2>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: S.muted, marginBottom: 10 }}>Semaphore earns a GO on the balance of low rent risk and demographic trajectory upside. The first-mover opportunity in specialty coffee and premium casual dining is genuine — the strip currently has no operator at this level, and the incoming demographic actively seeks it.</p>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: S.muted, marginBottom: 10 }}>This is a patient operator's bet. The economics (rent, margin headroom, low competition) are excellent; the risk is that demographic momentum takes longer than expected. Operators with 2–3 years of runway and a community-engagement mindset have a compelling opportunity here.</p>
        </section>

        {/* FAQ */}
        <section style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: 24, marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: S.n900, marginBottom: 20 }}>Frequently Asked Questions</h2>
              <details style={{ borderBottom: `1px solid ${S.border}`, paddingBottom: 12, marginBottom: 12 }}>
                <summary style={{ fontSize: 13, fontWeight: 700, color: S.n900, cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  Is Semaphore a good place to open a café in 2026? <span style={{ color: S.brand }}>+</span>
                </summary>
                <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.7, marginTop: 10 }}>Yes, if you have the patience for an emerging strip. The demographics are transitioning in the right direction, rents are exceptional, and there are genuine first-mover opportunities in specialty coffee and premium casual dining. The risk is timing — full momentum may take 2–3 years.</p>
              </details>
              <details style={{ borderBottom: `1px solid ${S.border}`, paddingBottom: 12, marginBottom: 12 }}>
                <summary style={{ fontSize: 13, fontWeight: 700, color: S.n900, cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  How does Semaphore compare to Henley Beach? <span style={{ color: S.brand }}>+</span>
                </summary>
                <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.7, marginTop: 10 }}>Henley Beach has higher foot traffic, a more established commercial ecosystem, and a higher-income existing demographic. Semaphore has lower rents, more competition gaps, and more first-mover upside. For operators with a longer runway and a category-leadership strategy, Semaphore offers better economics; for operators who want a proven strip with more immediate foot traffic, Henley Beach is the safer choice.</p>
              </details>
              <details style={{ borderBottom: `1px solid ${S.border}`, paddingBottom: 12, marginBottom: 12 }}>
                <summary style={{ fontSize: 13, fontWeight: 700, color: S.n900, cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  What is the demographic trend in Semaphore? <span style={{ color: S.brand }}>+</span>
                </summary>
                <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.7, marginTop: 10 }}>The suburb is in transition. A wave of younger professional households is moving to the Port Adelaide corridor attracted by coastal lifestyle and housing affordability. This is the same demographic shift that transformed suburbs like Brunswick (Melbourne) and Marrickville (Sydney) in earlier cycles. Semaphore is approximately 5 years behind those trajectories.</p>
              </details>
        </section>

        {/* CTA */}
        <div style={{ background: 'linear-gradient(135deg, #0F766E 0%, #0B5E57 100%)', borderRadius: 14, padding: '44px 40px', textAlign: 'center', marginBottom: 44 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#FFFFFF', marginBottom: 10 }}>Analyse Your Semaphore Address</h2>
          <p style={{ fontSize: 14, color: 'rgba(167,243,208,0.8)', marginBottom: 24, maxWidth: 440, margin: '0 auto 24px', lineHeight: 1.7 }}>
            Get a full GO/CAUTION/NO verdict with competitor map, financial model and 3-year projection for your specific address in Semaphore. First report free.
          </p>
          <Link href="/onboarding" style={{ background: '#FFFFFF', color: '#0F766E', borderRadius: 10, padding: '14px 32px', fontSize: 15, fontWeight: 800, textDecoration: 'none', display: 'inline-block' }}>
            Start Free Analysis →
          </Link>
        </div>

        {/* Footer nav */}
        <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 24, display: 'flex', gap: 12, justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Link href="/analyse/adelaide" style={{ fontSize: 13, fontWeight: 700, color: S.brand, textDecoration: 'none' }}>← Back to Adelaide</Link>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {[{ slug: "henley-beach", name: "Henley Beach" }, { slug: "port-adelaide", name: "Port Adelaide" }, { slug: "glenelg", name: "Glenelg" }].map(n => (
              <Link key={n.slug} href={`/analyse/adelaide/${n.slug}`} style={{ fontSize: 13, fontWeight: 700, color: S.brand, textDecoration: 'none' }}>{n.name}</Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
