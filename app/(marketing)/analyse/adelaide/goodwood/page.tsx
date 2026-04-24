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
    headline: "Opening a Business in Goodwood, Adelaide: 2026 Location Guide",
    description: "Goodwood Road is an emerging inner-south strip with authentic character, improving demographics, and rents that create a compelling opportunity for operators willing to be early.",
    author: { '@type': 'Organisation', name: 'Locatalyze', url: 'https://locatalyze.com' },
    publisher: { '@type': 'Organisation', name: 'Locatalyze' },
    datePublished: '2026-01-01',
    dateModified: '2026-04-01',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
    { '@type': 'Question', name: "What makes Goodwood different from other King William Road corridor suburbs?", acceptedAnswer: { '@type': 'Answer', text: "Goodwood Road has a more characterful, independent feel than the established Unley or Hyde Park sections. The strip is earlier in its development cycle, which means lower rents and less competition — but also lower baseline foot traffic. It suits operators with a strong independent identity who want to be part of a strip's formation rather than entering an already-mature market." } },
    { '@type': 'Question', name: "What is the demographic mix in Goodwood?", acceptedAnswer: { '@type': 'Answer', text: "A mix of established owner-occupier families and younger professional renters. Median household income around $88,000 — below Unley and Hyde Park but above the metropolitan average. The diversity of the demographic means a concept needs to work across both household types rather than being calibrated only for the premium end." } },
    { '@type': 'Question', name: "How does Goodwood compare to Prospect for an emerging strip?", acceptedAnswer: { '@type': 'Answer', text: "Both are emerging strips with similar demographic profiles and rent economics. Goodwood benefits from the established King William Road corridor momentum and is geographically positioned between Hyde Park and the inner south. Prospect Road has stronger current foot traffic momentum. Both are compelling for operators who want first-mover positioning on growing strips." } }
    ],
  },
]

export default function GoodwoodPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF9', fontFamily: "'DM Sans','Helvetica Neue',Arial,sans-serif", color: '#1C1917' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMAS) }} />
<div style={{ background: 'linear-gradient(135deg, #0E7490 0%, #0891B2 100%)', padding: '52px 24px 44px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
            <Link href="/analyse/adelaide" style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>Adelaide</Link>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>›</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Goodwood</span>
          </div>
          <h1 style={{ fontSize: 'clamp(26px,5vw,46px)', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 14 }}>
            Opening a Business in Goodwood, SA: 2026 Location Analysis
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', maxWidth: 580, lineHeight: 1.7, marginBottom: 22 }}>
            Goodwood Road is an emerging inner-south strip with authentic character, improving demographics, and rents that create a compelling opportunity for operators willing to be early.
          </p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <VerdictBadge v="GO" />
            <span style={{ fontSize: 28, fontWeight: 900, color: '#FFFFFF' }}>74/100</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>Location score</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '4px 12px' }}>$3,200–$5,500/mo</span>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 12 }}>Goodwood Road strip · inner south · $88K median income · character-rich emerging corridor</p>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px 80px' }}>

        <section style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, padding: 24, marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#1C1917', marginBottom: 20 }}>Location Scorecard</h2>
          <ScoreBar label="Foot Traffic" value={71} />
          <ScoreBar label="Demographics" value={83} />
          <ScoreBar label="Rent Viability" value={80} />
          <ScoreBar label="Competition Gap" value={80} />
          <p style={{ fontSize: 11, color: '#64748B', marginTop: 8 }}>Scores reflect foot traffic patterns, demographic alignment, rent viability, and competition gap for Goodwood.</p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, color: '#1C1917' }}>Business Environment</h2>
          <p style={{ fontSize: 15, lineHeight: 1.75, marginBottom: 14, color: '#64748B' }}>Goodwood Road runs through one of Adelaide's most character-rich inner-south suburbs. The strip has a distinctly independent character — lower chain density than comparable-traffic corridors, a mix of long-established service businesses and newer hospitality concepts, and a residential demographic that has been gentrifying steadily over the last decade. Goodwood sits between Hyde Park and the southern suburbs on the King William Road corridor, benefiting from the same inner-south demographic momentum.</p>
          <p style={{ fontSize: 15, lineHeight: 1.75, marginBottom: 14, color: '#64748B' }}>The consumer profile in Goodwood is slightly younger and more mixed than Unley or Hyde Park — median household income around $88,000, an age skew that includes more renters and younger professional households alongside established families. This creates a consumer base that values both quality and value, and is particularly receptive to independent concepts with genuine personality and community identity.</p>
          <p style={{ fontSize: 15, lineHeight: 1.75, marginBottom: 14, color: '#64748B' }}>Rents are below the established strips to the north: prime Goodwood Road positions run $4,000–$5,500 per month, secondary positions $3,200–$4,000. These rents reflect the strip's emerging rather than established status. Operators who secure good positions now at these rates benefit from margin headroom that will reduce as the strip's reputation grows.</p>
        </section>

        <section style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, padding: 24, marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#1C1917', marginBottom: 12 }}>Competition Analysis</h2>
          <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.7 }}>Goodwood Road has a handful of well-regarded independent operators that have built strong local followings, but the strip has significant gaps. There is no dominant specialty cafe, limited premium casual dining, and wellness services are thin given the demographic. The character of the strip — independent, community-oriented, slightly alternative — creates an environment where the right concept can build a loyal following quickly.</p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, color: '#1C1917' }}>What Works Here</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 14 }}>
              <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 12, padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.08em' }}>GO</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Character-driven cafe or brunch</p>
                <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6 }}>Goodwood's community responds strongly to concepts with genuine personality. A cafe with a clear identity — thoughtful design, quality coffee, and community engagement — can build a loyal following on a strip that already values and supports independents.</p>
              </div>
              <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 12, padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.08em' }}>GO</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Casual dining with strong local identity</p>
                <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6 }}>The inner-south demographic supports casual dining with genuine food credentials. Goodwood has the population density and income profile to sustain a well-executed casual restaurant without needing destination-level draw.</p>
              </div>
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 12, padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.08em' }}>CAUTION</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Premium concepts targeting high spend</p>
                <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6 }}>The Goodwood demographic is income-qualified but includes a significant proportion of younger renters with lower discretionary budgets. Concepts that require consistent high spend per head need careful menu and pricing calibration.</p>
              </div>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, color: '#1C1917' }}>Key Risks</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: '13px 16px' }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#92400E', marginBottom: 3 }}>Strip still consolidating</p>
                <p style={{ fontSize: 12, color: '#78350F', lineHeight: 1.6 }}>Goodwood Road has experienced some operator turnover as the strip transitions. New entrants need to be clear about their positioning and have sufficient reserves for a 6–9 month recognition-building phase.</p>
              </div>
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: '13px 16px' }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#92400E', marginBottom: 3 }}>Car access on Goodwood Road</p>
                <p style={{ fontSize: 12, color: '#78350F', lineHeight: 1.6 }}>Goodwood Road carries significant through-traffic. The pedestrian environment has improved but parking access can be challenging, particularly on weekend mornings when the strip is busiest.</p>
              </div>
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: '13px 16px' }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#92400E', marginBottom: 3 }}>Younger renter demographic is price-sensitive</p>
                <p style={{ fontSize: 12, color: '#78350F', lineHeight: 1.6 }}>A meaningful proportion of the Goodwood catchment is younger renters who are quality-conscious but budget-aware. Premium price points need to be matched by strong value perception.</p>
              </div>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, color: '#1C1917' }}>Compare Nearby Suburbs</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14 }}>
              <a href="/analyse/adelaide/hyde-park" style={{ textDecoration: 'none' }}>
                <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: '14px 16px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#1C1917' }}>Hyde Park</span>
                    <VerdictBadge v="GO" />
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#0891B2' }}>75</div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>KWR north · adjacent</div>
                </div>
              </a>
              <a href="/analyse/adelaide/unley" style={{ textDecoration: 'none' }}>
                <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: '14px 16px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#1C1917' }}>Unley</span>
                    <VerdictBadge v="GO" />
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#0891B2' }}>84</div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>KWR · stronger strip</div>
                </div>
              </a>
              <a href="/analyse/adelaide/mitcham" style={{ textDecoration: 'none' }}>
                <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: '14px 16px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#1C1917' }}>Mitcham</span>
                    <VerdictBadge v="GO" />
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#0891B2' }}>72</div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>Village · similar income</div>
                </div>
              </a>
          </div>
        </section>

        <SuburbPoll suburb="Goodwood" votes={[44, 26, 16, 10, 4]} />

        <section style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, padding: 24, marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <VerdictBadge v="GO" />
            <h2 style={{ fontSize: 16, fontWeight: 800, color: '#1C1917' }}>Final Verdict: Goodwood</h2>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: '#64748B', marginBottom: 10 }}>Goodwood earns a GO driven by demographic quality, genuine first-mover opportunities, and rents that create real margin headroom. The strip's independent character means concepts that fit its identity — quality, community-oriented, genuinely good — build loyal followings more quickly than on more generic strips.</p>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: '#64748B', marginBottom: 10 }}>The patience requirement is similar to other emerging strips: 6–9 months for recognition, a strong local identity, and financial reserves for the ramp-up period. Operators who bring those ingredients to Goodwood Road have a genuinely compelling opportunity.</p>
        </section>

        <section style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, padding: 24, marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#1C1917', marginBottom: 20 }}>Frequently Asked Questions</h2>
              <details style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: 12, marginBottom: 12 }}>
                <summary style={{ fontSize: 13, fontWeight: 700, color: '#1C1917', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  What makes Goodwood different from other King William Road corridor suburbs? <span style={{ color: '#0891B2' }}>+</span>
                </summary>
                <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.7, marginTop: 10 }}>Goodwood Road has a more characterful, independent feel than the established Unley or Hyde Park sections. The strip is earlier in its development cycle, which means lower rents and less competition — but also lower baseline foot traffic. It suits operators with a strong independent identity who want to be part of a strip's formation rather than entering an already-mature market.</p>
              </details>
              <details style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: 12, marginBottom: 12 }}>
                <summary style={{ fontSize: 13, fontWeight: 700, color: '#1C1917', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  What is the demographic mix in Goodwood? <span style={{ color: '#0891B2' }}>+</span>
                </summary>
                <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.7, marginTop: 10 }}>A mix of established owner-occupier families and younger professional renters. Median household income around $88,000 — below Unley and Hyde Park but above the metropolitan average. The diversity of the demographic means a concept needs to work across both household types rather than being calibrated only for the premium end.</p>
              </details>
              <details style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: 12, marginBottom: 12 }}>
                <summary style={{ fontSize: 13, fontWeight: 700, color: '#1C1917', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  How does Goodwood compare to Prospect for an emerging strip? <span style={{ color: '#0891B2' }}>+</span>
                </summary>
                <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.7, marginTop: 10 }}>Both are emerging strips with similar demographic profiles and rent economics. Goodwood benefits from the established King William Road corridor momentum and is geographically positioned between Hyde Park and the inner south. Prospect Road has stronger current foot traffic momentum. Both are compelling for operators who want first-mover positioning on growing strips.</p>
              </details>
        </section>

        <div style={{ background: 'linear-gradient(135deg, #0F766E 0%, #0B5E57 100%)', borderRadius: 14, padding: '44px 40px', textAlign: 'center', marginBottom: 44 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#FFFFFF', marginBottom: 10 }}>Analyse Your Goodwood Address</h2>
          <p style={{ fontSize: 14, color: 'rgba(167,243,208,0.8)', marginBottom: 24, maxWidth: 440, margin: '0 auto 24px', lineHeight: 1.7 }}>
            Get a full GO/CAUTION/NO verdict with competitor map, financial model and 3-year projection for your specific address in Goodwood. First report free.
          </p>
          <Link href="/onboarding" style={{ background: '#FFFFFF', color: '#0F766E', borderRadius: 10, padding: '14px 32px', fontSize: 15, fontWeight: 800, textDecoration: 'none', display: 'inline-block' }}>
            Start Free Analysis →
          </Link>
        </div>

        <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: 24, display: 'flex', gap: 12, justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Link href="/analyse/adelaide" style={{ fontSize: 13, fontWeight: 700, color: '#0891B2', textDecoration: 'none' }}>← Back to Adelaide</Link>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {[{ slug: "hyde-park", name: "Hyde Park" }, { slug: "unley", name: "Unley" }, { slug: "mitcham", name: "Mitcham" }].map(n => (
              <Link key={n.slug} href={`/analyse/adelaide/${n.slug}`} style={{ fontSize: 13, fontWeight: 700, color: '#0891B2', textDecoration: 'none' }}>{n.name}</Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
