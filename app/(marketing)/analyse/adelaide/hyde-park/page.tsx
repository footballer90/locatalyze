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
    headline: 'Opening a Business in Hyde Park, Adelaide: 2026 Location Guide',
    description: 'Hyde Park's King William Road section is one of Adelaide's quietest premium opportunities — strong demographics, growing foot traffic, and a residential community that actively supports quality independents.',
    author: { '@type': 'Organisation', name: 'Locatalyze', url: 'https://www.locatalyze.com' },
    publisher: { '@type': 'Organisation', name: 'Locatalyze' },
    datePublished: '2026-01-01',
    dateModified: '2026-04-01',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
    { '@type': 'Question', name: 'Is Hyde Park better or worse than Unley for a new café?', acceptedAnswer: { '@type': 'Answer', text: 'Hyde Park offers lower rents and less competition at the cost of lower established foot traffic. For a specialty café with a clear concept and a loyalty-building strategy, Hyde Park can produce better margin economics than Unley while still benefiting from the corridor's overall strength. For an operator who needs immediate walk-in volume, Unley has a more established base.' } },
    { '@type': 'Question', name: 'What is the demographic profile of Hyde Park?', acceptedAnswer: { '@type': 'Answer', text: 'Median household income approaching $99,000, age skew 30–50, very high owner-occupier rates. Predominantly professional households, many with families. A consumer base that is financially comfortable, quality-conscious, and loyal to independents who earn their trust.' } },
    { '@type': 'Question', name: 'What types of businesses have done well in Hyde Park?', acceptedAnswer: { '@type': 'Answer', text: 'Quality cafés and brunch concepts, allied health practices (particularly physio and pilates), and specialty retail with a clear identity. The demographic responds well to operators who engage with the local community and maintain consistent quality standards.' } }
    ],
  },
]

export default function HydeParkPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF9', fontFamily: "'DM Sans','Helvetica Neue',Arial,sans-serif", color: '#1C1917' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMAS) }} />

      {/* Sticky nav */}
      <nav style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/analyse/adelaide" style={{ fontSize: 13, fontWeight: 700, color: '#0891B2', textDecoration: 'none' }}>← Adelaide</Link>
        <Link href="/onboarding" style={{ background: '#0891B2', color: '#FFFFFF', borderRadius: 10, padding: '8px 18px', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>Analyse free →</Link>
      </nav>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0E7490 0%, #0891B2 100%)', padding: '52px 24px 44px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
            <Link href="/analyse/adelaide" style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>Adelaide</Link>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>›</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Hyde Park</span>
          </div>
          <h1 style={{ fontSize: 'clamp(26px,5vw,46px)', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 14 }}>
            Opening a Business in Hyde Park, SA: 2026 Location Analysis
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', maxWidth: 580, lineHeight: 1.7, marginBottom: 22 }}>
            Hyde Park's King William Road section is one of Adelaide's quietest premium opportunities — strong demographics, growing foot traffic, and a residential community that actively supports quality independents.
          </p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <VerdictBadge v="GO" />
            <span style={{ fontSize: 28, fontWeight: 900, color: '#FFFFFF' }}>75/100</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>Location score</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '4px 12px' }}>$4,000–$7,000/mo</span>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 12 }}>King William Road south · Hyde Park village · $99K median income · inner south premium</p>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* Score card */}
        <section style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, padding: 24, marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#1C1917', marginBottom: 20 }}>Location Scorecard</h2>
          <ScoreBar label="Foot Traffic" value={73} />
          <ScoreBar label="Demographics" value={90} />
          <ScoreBar label="Rent Viability" value={76} />
          <ScoreBar label="Competition Gap" value={78} />
          <p style={{ fontSize: 11, color: '#64748B', marginTop: 8 }}>Scores reflect foot traffic patterns, demographic alignment, rent viability, and competition gap for Hyde Park.</p>
        </section>

        {/* Business environment */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, color: '#1C1917' }}>Business Environment</h2>
          <p style={{ fontSize: 15, lineHeight: 1.75, marginBottom: 14, color: '#64748B' }}>Hyde Park sits on the southern section of King William Road, between Unley and the suburb of Goodwood. The commercial strip here is a continuation of the King William Road corridor — the same high-income residential demographic, the same pedestrian culture, and a similar mix of hospitality, health, and lifestyle retail. The key difference from the Unley section is that Hyde Park is slightly less established commercially, with more opportunity for new concepts to define the strip's character.</p>
          <p style={{ fontSize: 15, lineHeight: 1.75, marginBottom: 14, color: '#64748B' }}>The demographic is among the strongest in metropolitan Adelaide for independent businesses. Median household income approaches $99,000, the age profile is 30–50, and owner-occupier rates are high. The Hyde Park consumer is educated, income-qualified, and has formed strong opinions about quality — they actively seek out independent operators they can trust and return consistently when that trust is earned.</p>
          <p style={{ fontSize: 15, lineHeight: 1.75, marginBottom: 14, color: '#64748B' }}>Rents on the Hyde Park section of King William Road sit slightly below the Unley peak: $4,000–$7,000 per month for prime ground-floor commercial. This reflects the strip's slightly lower established foot traffic rather than any demographic weakness. As the strip continues to strengthen — driven by the overall King William Road corridor momentum — these rents will rise.</p>
        </section>

        {/* Competition */}
        <section style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, padding: 24, marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#1C1917', marginBottom: 12 }}>Competition Analysis</h2>
          <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.7 }}>Hyde Park's café and dining market has strengthened over the last 3 years but has genuine gaps at the premium end. There is no dominant specialty coffee operator, and the evening dining market has limited quality representation given the income profile. Wellness and allied health are growing but not yet fully developed. The strip is at an earlier stage than Unley — which is both the opportunity and the risk.</p>
        </section>

        {/* What works */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, color: '#1C1917' }}>What Works Here</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 14 }}>
              <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 12, padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.08em' }}>GO</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Specialty café with premium positioning</p>
                <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6 }}>The demographic supports and actively seeks quality specialty coffee. The current field has no clear category leader on the Hyde Park section. First-mover advantage in specialty coffee is still available at rents that don't yet reflect the demographic quality.</p>
              </div>
              <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 12, padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.08em' }}>GO</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Allied health and wellness services</p>
                <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6 }}>The inner-south professional demographic has consistently strong demand for physiotherapy, pilates, psychology, and specialist dietary services. Hyde Park is underserved relative to its income profile.</p>
              </div>
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 12, padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.08em' }}>CAUTION</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>High-capital licensed restaurant</p>
                <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6 }}>The evening dining market is growing but not as mature as the Unley or Norwood sections of the corridor. A high-capital licensed concept needs 12–18 months to reach full volume. Entry cost should reflect this ramp-up period.</p>
              </div>
          </div>
        </section>

        {/* Key risks */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, color: '#1C1917' }}>Key Risks</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: '13px 16px' }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#92400E', marginBottom: 3 }}>Strip still maturing</p>
                <p style={{ fontSize: 12, color: '#78350F', lineHeight: 1.6 }}>Hyde Park is 3–5 years behind Unley's commercial maturity. Foot traffic is growing but hasn't reached the level that supports walk-in volume for a new concept without a deliberate loyalty-building strategy.</p>
              </div>
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: '13px 16px' }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#92400E', marginBottom: 3 }}>Parking on weekends</p>
                <p style={{ fontSize: 12, color: '#78350F', lineHeight: 1.6 }}>King William Road parking is competitive on Saturday and Sunday mornings. Some visitors from beyond the immediate residential catchment are deterred by parking difficulty during peak periods.</p>
              </div>
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: '13px 16px' }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#92400E', marginBottom: 3 }}>Proximity to stronger strips</p>
                <p style={{ fontSize: 12, color: '#78350F', lineHeight: 1.6 }}>Both Norwood's Parade and the Unley section of King William Road are within 2km. Some Hyde Park residents default to these established strips for dining and retail rather than the local option.</p>
              </div>
          </div>
        </section>

        {/* Compare nearby */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, color: '#1C1917' }}>Compare Nearby Suburbs</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14 }}>
              <a href="/analyse/adelaide/unley" style={{ textDecoration: 'none' }}>
                <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: '14px 16px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#1C1917' }}>Unley</span>
                    <VerdictBadge v="GO" />
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#0891B2' }}>84</div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>KWR north · more mature</div>
                </div>
              </a>
              <a href="/analyse/adelaide/norwood" style={{ textDecoration: 'none' }}>
                <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: '14px 16px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#1C1917' }}>Norwood</span>
                    <VerdictBadge v="GO" />
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#0891B2' }}>86</div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>The Parade · benchmark</div>
                </div>
              </a>
              <a href="/analyse/adelaide/goodwood" style={{ textDecoration: 'none' }}>
                <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: '14px 16px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#1C1917' }}>Goodwood</span>
                    <VerdictBadge v="GO" />
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#0891B2' }}>74</div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>KWR south · adjacent</div>
                </div>
              </a>
          </div>
        </section>

        {/* Poll */}
        <SuburbPoll suburb="Hyde Park" votes={[43, 27, 15, 11, 4]} />

        {/* Final verdict */}
        <section style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, padding: 24, marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <VerdictBadge v="GO" />
            <h2 style={{ fontSize: 16, fontWeight: 800, color: '#1C1917' }}>Final Verdict: Hyde Park</h2>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: '#64748B', marginBottom: 10 }}>Hyde Park is a solid GO — a premium demographic on an improving strip at rents that don't yet fully reflect the catchment quality. The opportunity window for first-mover positioning in specialty coffee and wellness is real and won't remain open indefinitely as the corridor continues to mature.</p>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: '#64748B', marginBottom: 10 }}>The success playbook is the same as Unley and Norwood: clear concept, genuine quality, community engagement, and patience for a 6–9 month loyalty-building phase. Hyde Park rewards that approach with one of the best demographic bases in South Australia.</p>
        </section>

        {/* FAQ */}
        <section style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, padding: 24, marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#1C1917', marginBottom: 20 }}>Frequently Asked Questions</h2>
              <details style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: 12, marginBottom: 12 }}>
                <summary style={{ fontSize: 13, fontWeight: 700, color: '#1C1917', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  Is Hyde Park better or worse than Unley for a new café? <span style={{ color: '#0891B2' }}>+</span>
                </summary>
                <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.7, marginTop: 10 }}>Hyde Park offers lower rents and less competition at the cost of lower established foot traffic. For a specialty café with a clear concept and a loyalty-building strategy, Hyde Park can produce better margin economics than Unley while still benefiting from the corridor's overall strength. For an operator who needs immediate walk-in volume, Unley has a more established base.</p>
              </details>
              <details style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: 12, marginBottom: 12 }}>
                <summary style={{ fontSize: 13, fontWeight: 700, color: '#1C1917', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  What is the demographic profile of Hyde Park? <span style={{ color: '#0891B2' }}>+</span>
                </summary>
                <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.7, marginTop: 10 }}>Median household income approaching $99,000, age skew 30–50, very high owner-occupier rates. Predominantly professional households, many with families. A consumer base that is financially comfortable, quality-conscious, and loyal to independents who earn their trust.</p>
              </details>
              <details style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: 12, marginBottom: 12 }}>
                <summary style={{ fontSize: 13, fontWeight: 700, color: '#1C1917', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  What types of businesses have done well in Hyde Park? <span style={{ color: '#0891B2' }}>+</span>
                </summary>
                <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.7, marginTop: 10 }}>Quality cafés and brunch concepts, allied health practices (particularly physio and pilates), and specialty retail with a clear identity. The demographic responds well to operators who engage with the local community and maintain consistent quality standards.</p>
              </details>
        </section>

        {/* CTA */}
        <div style={{ background: 'linear-gradient(135deg, #0F766E 0%, #0B5E57 100%)', borderRadius: 14, padding: '44px 40px', textAlign: 'center', marginBottom: 44 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#FFFFFF', marginBottom: 10 }}>Analyse Your Hyde Park Address</h2>
          <p style={{ fontSize: 14, color: 'rgba(167,243,208,0.8)', marginBottom: 24, maxWidth: 440, margin: '0 auto 24px', lineHeight: 1.7 }}>
            Get a full GO/CAUTION/NO verdict with competitor map, financial model and 3-year projection for your specific address in Hyde Park. First report free.
          </p>
          <Link href="/onboarding" style={{ background: '#FFFFFF', color: '#0F766E', borderRadius: 10, padding: '14px 32px', fontSize: 15, fontWeight: 800, textDecoration: 'none', display: 'inline-block' }}>
            Start Free Analysis →
          </Link>
        </div>

        {/* Footer nav */}
        <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: 24, display: 'flex', gap: 12, justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Link href="/analyse/adelaide" style={{ fontSize: 13, fontWeight: 700, color: '#0891B2', textDecoration: 'none' }}>← Back to Adelaide</Link>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {[{ slug: "unley", name: "Unley" }, { slug: "norwood", name: "Norwood" }, { slug: "goodwood", name: "Goodwood" }].map(n => (
              <Link key={n.slug} href={`/analyse/adelaide/${n.slug}`} style={{ fontSize: 13, fontWeight: 700, color: '#0891B2', textDecoration: 'none' }}>{n.name}</Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
