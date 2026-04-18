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
  const color = value >= 70 ? '#059669' : value >= 50 ? '#D97706' : '#DC2626'
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 800, color }}>{value}/100</span>
      </div>
      <div style={{ height: 6, background: '#E2E8F0', borderRadius: 100, overflow: 'hidden' }}>
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
    <section style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, padding: 24, marginBottom: 32 }}>
      <h3 style={{ fontSize: 15, fontWeight: 800, color: '#1C1917', marginBottom: 4 }}>What business are you planning in {suburb}?</h3>
      <p style={{ fontSize: 12, color: '#64748B', marginBottom: 16 }}>{voted === null ? 'Vote to see results' : `${total + 1} votes`}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {opts.map((opt, i) => {
          const pct = voted !== null ? Math.round(votes[i] / (total + 1) * 100) : 0
          return (
            <button key={i} onClick={() => vote(i)} style={{
              position: 'relative', textAlign: 'left', background: voted === i ? '#ECFDF5' : '#FAFAF9',
              border: `1px solid ${voted === i ? '#A7F3D0' : '#E2E8F0'}`, borderRadius: 10,
              padding: '10px 14px', cursor: voted !== null ? 'default' : 'pointer', overflow: 'hidden',
            }}>
              {voted !== null && <div style={{ position: 'absolute', inset: 0, background: '#ECFDF5', width: `${pct}%`, opacity: 0.4, borderRadius: 10 }} />}
              <span style={{ position: 'relative', fontSize: 13, fontWeight: 600, color: '#1C1917' }}>{opt}</span>
              {voted !== null && <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 12, fontWeight: 700, color: '#059669' }}>{pct}%</span>}
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
    headline: "Opening a Business in Modbury, Adelaide: 2026 Location Guide",
    description: "Modbury's Tea Tree Plaza precinct serves the largest north-eastern metropolitan catchment — but chain dominance, moderate demographics, and car-dependent access create a challenging environment for independent operators.",
    author: { '@type': 'Organisation', name: 'Locatalyze', url: 'https://www.locatalyze.com' },
    publisher: { '@type': 'Organisation', name: 'Locatalyze' },
    datePublished: '2026-01-01',
    dateModified: '2026-04-01',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
    { '@type': 'Question', name: "Can a cafe compete with Tea Tree Plaza food court in Modbury?", acceptedAnswer: { '@type': 'Answer', text: "Directly competing on price and convenience is difficult — the food court has scale advantages. The opportunity is in offering something the food court cannot: genuine specialty quality, atmosphere, a specific cuisine identity, or a community-oriented experience. A cafe that is clearly superior in product quality and offers a reason to make a specific visit can build a loyal following from the large north-eastern catchment." } },
    { '@type': 'Question', name: "What are rents like outside Tea Tree Plaza in Modbury?", acceptedAnswer: { '@type': 'Answer', text: "Street-level commercial tenancies in the Modbury Triangle and surrounding precinct run $1,800–$3,800 per month — meaningfully below the centre's tenancy costs and among the more affordable options in metro Adelaide. The challenge is generating volume without the centre's pedestrian flow." } },
    { '@type': 'Question', name: "What is the best type of business to open in Modbury?", acceptedAnswer: { '@type': 'Answer', text: "Allied health and specialist services that serve the large north-eastern catchment are consistently successful here. They benefit from the area's population density without being directly affected by Tea Tree Plaza's retail dominance. For hospitality, a concept with clear differentiation from the food court and strong local community positioning has the best chance." } }
    ],
  },
]

export default function ModburyPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF9', fontFamily: "'DM Sans','Helvetica Neue',Arial,sans-serif", color: '#1C1917' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMAS) }} />
<div style={{ background: 'linear-gradient(135deg, #0E7490 0%, #0891B2 100%)', padding: '52px 24px 44px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
            <Link href="/analyse/adelaide" style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>Adelaide</Link>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>›</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Modbury</span>
          </div>
          <h1 style={{ fontSize: 'clamp(26px,5vw,46px)', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 14 }}>
            Opening a Business in Modbury, SA: 2026 Location Analysis
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', maxWidth: 580, lineHeight: 1.7, marginBottom: 22 }}>
            Modbury's Tea Tree Plaza precinct serves the largest north-eastern metropolitan catchment — but chain dominance, moderate demographics, and car-dependent access create a challenging environment for independent operators.
          </p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <VerdictBadge v="CAUTION" />
            <span style={{ fontSize: 28, fontWeight: 900, color: '#FFFFFF' }}>65/100</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>Location score</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '4px 12px' }}>$1,800–$3,800/mo</span>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 12 }}>Tea Tree Plaza precinct · Modbury Triangle · $73K median income · largest NE metro commercial hub</p>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px 80px' }}>

        <section style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, padding: 24, marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#1C1917', marginBottom: 20 }}>Location Scorecard</h2>
          <ScoreBar label="Foot Traffic" value={69} />
          <ScoreBar label="Demographics" value={60} />
          <ScoreBar label="Rent Viability" value={85} />
          <ScoreBar label="Competition Gap" value={71} />
          <p style={{ fontSize: 11, color: '#64748B', marginTop: 8 }}>Scores reflect foot traffic patterns, demographic alignment, rent viability, and competition gap for Modbury.</p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, color: '#1C1917' }}>Business Environment</h2>
          <p style={{ fontSize: 15, lineHeight: 1.75, marginBottom: 14, color: '#64748B' }}>Modbury is the commercial hub of Adelaide's north-eastern suburbs, anchored by Tea Tree Plaza — one of Adelaide's major regional shopping centres. The precinct draws from a large north-eastern catchment covering Modbury, Tea Tree Gully, Golden Grove, Ridgewood, and surrounding suburbs — approximately 100,000–120,000 residents. This volume is genuine but the spending profile is markedly different from inner-suburb markets.</p>
          <p style={{ fontSize: 15, lineHeight: 1.75, marginBottom: 14, color: '#64748B' }}>The demographic is middle-suburban: median household income around $73,000, predominantly families and established working households, high car-ownership and car-dependent behaviour. Consumer spending is concentrated in the major centre formats — Tea Tree Plaza captures the majority of retail and food service spending through its anchored tenants and food court. Independent street-level operators outside the centre compete against this gravity.</p>
          <p style={{ fontSize: 15, lineHeight: 1.75, marginBottom: 14, color: '#64748B' }}>Rents outside Tea Tree Plaza are in the $1,800–$3,800 per month range for street commercial tenancies in the surrounding Modbury Triangle precinct. Inside the centre, rents are higher and subject to centre management terms. Street-level operators who can be adjacent to but distinct from the centre's offer are best positioned — they capture overflow traffic without competing directly with the centre's tenants.</p>
        </section>

        <section style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, padding: 24, marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#1C1917', marginBottom: 12 }}>Competition Analysis</h2>
          <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.7 }}>The competitive landscape in Modbury is dominated by Tea Tree Plaza's national chain tenants. The independent segment is thin — a handful of ethnic restaurants and service businesses operate in the surrounding streets. There are genuine gaps in quality independent hospitality, specialty retail, and wellness services, but the chain competition for attention and spending is significant.</p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, color: '#1C1917' }}>What Works Here</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 14 }}>
              <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 12, padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.08em' }}>GO</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Allied health and specialist services</p>
                <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6 }}>Medical, dental, physio, and allied health services adjacent to or near Tea Tree Plaza benefit from the centre traffic driver while serving the large north-eastern catchment. Several successful practices have operated in the Modbury area for many years.</p>
              </div>
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 12, padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.08em' }}>CAUTION</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Independent cafe or casual dining</p>
                <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6 }}>An independent cafe or restaurant outside Tea Tree Plaza must offer something the centre's food court does not — genuine quality, atmosphere, or a specific cuisine identity. Without clear differentiation, the centre's convenience factor wins.</p>
              </div>
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 12, padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.08em' }}>CAUTION</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Premium retail</p>
                <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6 }}>The current demographic does not strongly support premium independent retail. Specialty food and boutique concepts need to be accessible in pricing and clearly superior in quality to the centre's offer to generate consistent visits.</p>
              </div>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, color: '#1C1917' }}>Key Risks</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: '13px 16px' }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#92400E', marginBottom: 3 }}>Tea Tree Plaza dominates spending</p>
                <p style={{ fontSize: 12, color: '#78350F', lineHeight: 1.6 }}>The regional shopping centre captures the majority of retail and food spending in the north-eastern corridor. Independent operators must have a compelling reason for a specific visit or benefit from the centre overflow.</p>
              </div>
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: '13px 16px' }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#92400E', marginBottom: 3 }}>Car-dependent and pedestrian-poor environment</p>
                <p style={{ fontSize: 12, color: '#78350F', lineHeight: 1.6 }}>Modbury's commercial environment is designed around car access. Street-level foot traffic outside the centre's car parks is low. Businesses need parking-adjacent positions to be viable.</p>
              </div>
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: '13px 16px' }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#92400E', marginBottom: 3 }}>Moderate demographic limits average spend</p>
                <p style={{ fontSize: 12, color: '#78350F', lineHeight: 1.6 }}>Median household income of $73,000 and family-oriented spending patterns create price sensitivity. Premium price points face resistance from a demographic accustomed to centre-format pricing.</p>
              </div>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, color: '#1C1917' }}>Compare Nearby Suburbs</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14 }}>
              <a href="/analyse/adelaide/salisbury" style={{ textDecoration: 'none' }}>
                <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: '14px 16px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#1C1917' }}>Salisbury</span>
                    <VerdictBadge v="CAUTION" />
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#0891B2' }}>63</div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>NW · similar profile</div>
                </div>
              </a>
              <a href="/analyse/adelaide/prospect" style={{ textDecoration: 'none' }}>
                <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: '14px 16px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#1C1917' }}>Prospect</span>
                    <VerdictBadge v="GO" />
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#0891B2' }}>78</div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>Inner north · better demographics</div>
                </div>
              </a>
              <a href="/analyse/adelaide/norwood" style={{ textDecoration: 'none' }}>
                <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: '14px 16px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#1C1917' }}>Norwood</span>
                    <VerdictBadge v="GO" />
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#0891B2' }}>86</div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>Inner east · benchmark</div>
                </div>
              </a>
          </div>
        </section>

        <SuburbPoll suburb="Modbury" votes={[33, 26, 21, 13, 7]} />

        <section style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, padding: 24, marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <VerdictBadge v="CAUTION" />
            <h2 style={{ fontSize: 16, fontWeight: 800, color: '#1C1917' }}>Final Verdict: Modbury</h2>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: '#64748B', marginBottom: 10 }}>Modbury is rated CAUTION because the opportunity is real but structurally constrained. The north-eastern catchment is large and the rents are low — but Tea Tree Plaza's dominance is significant, the demographic is price-sensitive, and the pedestrian environment outside the centre is poor.</p>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: '#64748B', marginBottom: 10 }}>The operators who succeed in Modbury understand the market clearly: allied health with specific expertise, or hospitality with strong differentiation from the centre's offer. Operators who enter with inner-suburb expectations and concepts will find the structural barriers difficult to overcome.</p>
        </section>

        <section style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, padding: 24, marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#1C1917', marginBottom: 20 }}>Frequently Asked Questions</h2>
              <details style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: 12, marginBottom: 12 }}>
                <summary style={{ fontSize: 13, fontWeight: 700, color: '#1C1917', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  Can a cafe compete with Tea Tree Plaza food court in Modbury? <span style={{ color: '#0891B2' }}>+</span>
                </summary>
                <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.7, marginTop: 10 }}>Directly competing on price and convenience is difficult — the food court has scale advantages. The opportunity is in offering something the food court cannot: genuine specialty quality, atmosphere, a specific cuisine identity, or a community-oriented experience. A cafe that is clearly superior in product quality and offers a reason to make a specific visit can build a loyal following from the large north-eastern catchment.</p>
              </details>
              <details style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: 12, marginBottom: 12 }}>
                <summary style={{ fontSize: 13, fontWeight: 700, color: '#1C1917', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  What are rents like outside Tea Tree Plaza in Modbury? <span style={{ color: '#0891B2' }}>+</span>
                </summary>
                <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.7, marginTop: 10 }}>Street-level commercial tenancies in the Modbury Triangle and surrounding precinct run $1,800–$3,800 per month — meaningfully below the centre's tenancy costs and among the more affordable options in metro Adelaide. The challenge is generating volume without the centre's pedestrian flow.</p>
              </details>
              <details style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: 12, marginBottom: 12 }}>
                <summary style={{ fontSize: 13, fontWeight: 700, color: '#1C1917', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  What is the best type of business to open in Modbury? <span style={{ color: '#0891B2' }}>+</span>
                </summary>
                <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.7, marginTop: 10 }}>Allied health and specialist services that serve the large north-eastern catchment are consistently successful here. They benefit from the area's population density without being directly affected by Tea Tree Plaza's retail dominance. For hospitality, a concept with clear differentiation from the food court and strong local community positioning has the best chance.</p>
              </details>
        </section>

        <div style={{ background: 'linear-gradient(135deg, #0F766E 0%, #0B5E57 100%)', borderRadius: 14, padding: '44px 40px', textAlign: 'center', marginBottom: 44 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#FFFFFF', marginBottom: 10 }}>Analyse Your Modbury Address</h2>
          <p style={{ fontSize: 14, color: 'rgba(167,243,208,0.8)', marginBottom: 24, maxWidth: 440, margin: '0 auto 24px', lineHeight: 1.7 }}>
            Get a full GO/CAUTION/NO verdict with competitor map, financial model and 3-year projection for your specific address in Modbury. First report free.
          </p>
          <Link href="/onboarding" style={{ background: '#FFFFFF', color: '#0F766E', borderRadius: 10, padding: '14px 32px', fontSize: 15, fontWeight: 800, textDecoration: 'none', display: 'inline-block' }}>
            Start Free Analysis →
          </Link>
        </div>

        <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: 24, display: 'flex', gap: 12, justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Link href="/analyse/adelaide" style={{ fontSize: 13, fontWeight: 700, color: '#0891B2', textDecoration: 'none' }}>← Back to Adelaide</Link>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {[{ slug: "salisbury", name: "Salisbury" }, { slug: "prospect", name: "Prospect" }, { slug: "norwood", name: "Norwood" }].map(n => (
              <Link key={n.slug} href={`/analyse/adelaide/${n.slug}`} style={{ fontSize: 13, fontWeight: 700, color: '#0891B2', textDecoration: 'none' }}>{n.name}</Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
