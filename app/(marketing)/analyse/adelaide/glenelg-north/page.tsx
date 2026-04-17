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
    headline: "Opening a Business in Glenelg North, Adelaide: 2026 Location Guide",
    description: "Glenelg North offers coastal proximity without Jetty Road rents — a lower-cost entry into the southern coastal corridor with a solid residential base and genuine competition gaps.",
    author: { '@type': 'Organisation', name: 'Locatalyze', url: 'https://www.locatalyze.com' },
    publisher: { '@type': 'Organisation', name: 'Locatalyze' },
    datePublished: '2026-01-01',
    dateModified: '2026-04-01',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
    { '@type': 'Question', name: "Is Glenelg North a good alternative to Glenelg for opening a cafe?", acceptedAnswer: { '@type': 'Answer', text: "Yes, for operators who want coastal proximity without Jetty Road rents and competition. Glenelg North rents are 30-40% lower. The trade-off is lower foot traffic — you are building a neighbourhood loyalty business rather than capturing tourist and strip walk-in trade. For a first-time operator with capital constraints, it can be a better entry point." } },
    { '@type': 'Question', name: "What is the difference between Glenelg and Glenelg North commercially?", acceptedAnswer: { '@type': 'Answer', text: "Glenelg has Jetty Road — a mature, high-foot-traffic destination strip with tourist uplift. Glenelg North has neighbourhood commercial nodes serving residential catchments. Glenelg has higher volume potential and higher rents. Glenelg North has better margin economics at lower volumes and less competition." } },
    { '@type': 'Question', name: "What demographics does Glenelg North attract?", acceptedAnswer: { '@type': 'Answer', text: "Predominantly families and professional couples, median household income around $84,000, high owner-occupier rates. Similar to the broader Glenelg demographic but slightly more family-oriented and less tourist-influenced." } }
    ],
  },
]

export default function GlenelgNorthPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF9', fontFamily: "'DM Sans','Helvetica Neue',Arial,sans-serif", color: '#1C1917' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMAS) }} />

      <nav style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/analyse/adelaide" style={{ fontSize: 13, fontWeight: 700, color: '#0891B2', textDecoration: 'none' }}>← Adelaide</Link>
        <Link href="/onboarding" style={{ background: '#0891B2', color: '#FFFFFF', borderRadius: 10, padding: '8px 18px', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>Analyse free →</Link>
      </nav>

      <div style={{ background: 'linear-gradient(135deg, #0E7490 0%, #0891B2 100%)', padding: '52px 24px 44px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
            <Link href="/analyse/adelaide" style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>Adelaide</Link>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>›</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Glenelg North</span>
          </div>
          <h1 style={{ fontSize: 'clamp(26px,5vw,46px)', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 14 }}>
            Opening a Business in Glenelg North, SA: 2026 Location Analysis
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', maxWidth: 580, lineHeight: 1.7, marginBottom: 22 }}>
            Glenelg North offers coastal proximity without Jetty Road rents — a lower-cost entry into the southern coastal corridor with a solid residential base and genuine competition gaps.
          </p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <VerdictBadge v="GO" />
            <span style={{ fontSize: 28, fontWeight: 900, color: '#FFFFFF' }}>71/100</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>Location score</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '4px 12px' }}>$2,800–$5,000/mo</span>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 12 }}>Brighton Road corridor · coastal adjacent · $84K median income · Glenelg overflow catchment</p>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px 80px' }}>

        <section style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, padding: 24, marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#1C1917', marginBottom: 20 }}>Location Scorecard</h2>
          <ScoreBar label="Foot Traffic" value={66} />
          <ScoreBar label="Demographics" value={80} />
          <ScoreBar label="Rent Viability" value={82} />
          <ScoreBar label="Competition Gap" value={78} />
          <p style={{ fontSize: 11, color: '#64748B', marginTop: 8 }}>Scores reflect foot traffic patterns, demographic alignment, rent viability, and competition gap for Glenelg North.</p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, color: '#1C1917' }}>Business Environment</h2>
          <p style={{ fontSize: 15, lineHeight: 1.75, marginBottom: 14, color: '#64748B' }}>Glenelg North sits immediately north of Glenelg proper — close enough to benefit from the coastal demographic and lifestyle pull but without the rent premiums that prime Jetty Road commands. The suburb's commercial activity is spread across Brighton Road and a few secondary nodes, serving the surrounding residential catchment of Glenelg North, Novar Gardens, and Oaklands Park.</p>
          <p style={{ fontSize: 15, lineHeight: 1.75, marginBottom: 14, color: '#64748B' }}>The demographic is strong relative to the rents. Median household income around $84,000, an age profile that skews toward families and professional couples, and high owner-occupier rates create a stable consumer base. These are residents who regularly use the Glenelg precinct for dining and retail but would prefer quality options closer to home — a gap that a well-positioned independent can fill.</p>
          <p style={{ fontSize: 15, lineHeight: 1.75, marginBottom: 14, color: '#64748B' }}>Rents are 30–40% below Glenelg prime: commercial tenancies on Brighton Road run $2,800–$5,000 per month, with some quality positions available in the $3,000–$4,000 range. For operators who do not need the Jetty Road foot traffic and can build a local loyal following, these rents produce significantly better margin economics than the main Glenelg strip.</p>
        </section>

        <section style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, padding: 24, marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#1C1917', marginBottom: 12 }}>Competition Analysis</h2>
          <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.7 }}>The competition in Glenelg North is thin — there is no established quality cafe, no premium casual dining, and wellness services are limited. The field is populated by legacy local operators and a handful of service businesses. For an independent concept that offers genuine quality, the competitive barriers are low and the local demographic is receptive.</p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, color: '#1C1917' }}>What Works Here</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 14 }}>
              <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 12, padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.08em' }}>GO</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Neighbourhood cafe with local loyalty focus</p>
                <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6 }}>The residential catchment supports a daily-habit cafe that serves the morning commuter and weekend brunch market. Without Jetty Road's tourist noise, building genuine local loyalty is faster — regulars drive volume consistently.</p>
              </div>
              <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 12, padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.08em' }}>GO</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Allied health and wellness</p>
                <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6 }}>The southern coastal demographic has strong demand for physio, pilates, and wellness services. The existing supply in Glenelg North is thin relative to the population size and income level.</p>
              </div>
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 12, padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.08em' }}>CAUTION</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Destination dining requiring wider catchment</p>
                <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6 }}>Glenelg North lacks the foot traffic density for a destination dining concept that relies on visitors travelling specifically from other suburbs. A concept that serves the local residential base works; one that needs metro-wide draw does not.</p>
              </div>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, color: '#1C1917' }}>Key Risks</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: '13px 16px' }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#92400E', marginBottom: 3 }}>Overshadowed by Glenelg proper</p>
                <p style={{ fontSize: 12, color: '#78350F', lineHeight: 1.6 }}>Jetty Road is 10–15 minutes walk away. Some residents default to Glenelg for dining and retail rather than the local strip. Building a strong reason-to-visit locally is essential.</p>
              </div>
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: '13px 16px' }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#92400E', marginBottom: 3 }}>Lower foot traffic than coastal strip</p>
                <p style={{ fontSize: 12, color: '#78350F', lineHeight: 1.6 }}>Without beach proximity and the Glenelg tram as a foot traffic driver, Glenelg North commercial strips rely on residential and passing trade. Concepts need to work at lower base volumes.</p>
              </div>
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: '13px 16px' }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#92400E', marginBottom: 3 }}>Limited commercial stock quality</p>
                <p style={{ fontSize: 12, color: '#78350F', lineHeight: 1.6 }}>Some Glenelg North commercial tenancies are older and require significant fit-out investment. Condition and configuration vary — due diligence on building quality is important before committing.</p>
              </div>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, color: '#1C1917' }}>Compare Nearby Suburbs</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14 }}>
              <a href="/analyse/adelaide/glenelg" style={{ textDecoration: 'none' }}>
                <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: '14px 16px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#1C1917' }}>Glenelg</span>
                    <VerdictBadge v="GO" />
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#0891B2' }}>81</div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>Jetty Rd · stronger strip</div>
                </div>
              </a>
              <a href="/analyse/adelaide/henley-beach" style={{ textDecoration: 'none' }}>
                <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: '14px 16px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#1C1917' }}>Henley Beach</span>
                    <VerdictBadge v="GO" />
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#0891B2' }}>74</div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>Coastal · Henley Sq</div>
                </div>
              </a>
              <a href="/analyse/adelaide/mitcham" style={{ textDecoration: 'none' }}>
                <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: '14px 16px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#1C1917' }}>Mitcham</span>
                    <VerdictBadge v="GO" />
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#0891B2' }}>72</div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>Inner south · similar model</div>
                </div>
              </a>
          </div>
        </section>

        <SuburbPoll suburb="Glenelg North" votes={[40, 27, 17, 11, 5]} />

        <section style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, padding: 24, marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <VerdictBadge v="GO" />
            <h2 style={{ fontSize: 16, fontWeight: 800, color: '#1C1917' }}>Final Verdict: Glenelg North</h2>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: '#64748B', marginBottom: 10 }}>Glenelg North earns a GO as a lower-cost entry point into the southern coastal market. The demographics justify quality independent businesses — the income and lifestyle profile support cafe culture, wellness, and casual dining. The rents are genuinely attractive relative to the catchment quality.</p>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: '#64748B', marginBottom: 10 }}>The formula for success is neighbourhood loyalty, not destination traffic. Operators who build genuine local relationships and earn regular visits from the residential catchment create sustainable businesses here at economics that are genuinely difficult to replicate on Jetty Road.</p>
        </section>

        <section style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, padding: 24, marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#1C1917', marginBottom: 20 }}>Frequently Asked Questions</h2>
              <details style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: 12, marginBottom: 12 }}>
                <summary style={{ fontSize: 13, fontWeight: 700, color: '#1C1917', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  Is Glenelg North a good alternative to Glenelg for opening a cafe? <span style={{ color: '#0891B2' }}>+</span>
                </summary>
                <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.7, marginTop: 10 }}>Yes, for operators who want coastal proximity without Jetty Road rents and competition. Glenelg North rents are 30-40% lower. The trade-off is lower foot traffic — you are building a neighbourhood loyalty business rather than capturing tourist and strip walk-in trade. For a first-time operator with capital constraints, it can be a better entry point.</p>
              </details>
              <details style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: 12, marginBottom: 12 }}>
                <summary style={{ fontSize: 13, fontWeight: 700, color: '#1C1917', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  What is the difference between Glenelg and Glenelg North commercially? <span style={{ color: '#0891B2' }}>+</span>
                </summary>
                <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.7, marginTop: 10 }}>Glenelg has Jetty Road — a mature, high-foot-traffic destination strip with tourist uplift. Glenelg North has neighbourhood commercial nodes serving residential catchments. Glenelg has higher volume potential and higher rents. Glenelg North has better margin economics at lower volumes and less competition.</p>
              </details>
              <details style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: 12, marginBottom: 12 }}>
                <summary style={{ fontSize: 13, fontWeight: 700, color: '#1C1917', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  What demographics does Glenelg North attract? <span style={{ color: '#0891B2' }}>+</span>
                </summary>
                <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.7, marginTop: 10 }}>Predominantly families and professional couples, median household income around $84,000, high owner-occupier rates. Similar to the broader Glenelg demographic but slightly more family-oriented and less tourist-influenced.</p>
              </details>
        </section>

        <div style={{ background: 'linear-gradient(135deg, #0F766E 0%, #0B5E57 100%)', borderRadius: 14, padding: '44px 40px', textAlign: 'center', marginBottom: 44 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#FFFFFF', marginBottom: 10 }}>Analyse Your Glenelg North Address</h2>
          <p style={{ fontSize: 14, color: 'rgba(167,243,208,0.8)', marginBottom: 24, maxWidth: 440, margin: '0 auto 24px', lineHeight: 1.7 }}>
            Get a full GO/CAUTION/NO verdict with competitor map, financial model and 3-year projection for your specific address in Glenelg North. First report free.
          </p>
          <Link href="/onboarding" style={{ background: '#FFFFFF', color: '#0F766E', borderRadius: 10, padding: '14px 32px', fontSize: 15, fontWeight: 800, textDecoration: 'none', display: 'inline-block' }}>
            Start Free Analysis →
          </Link>
        </div>

        <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: 24, display: 'flex', gap: 12, justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Link href="/analyse/adelaide" style={{ fontSize: 13, fontWeight: 700, color: '#0891B2', textDecoration: 'none' }}>← Back to Adelaide</Link>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {[{ slug: "glenelg", name: "Glenelg" }, { slug: "henley-beach", name: "Henley Beach" }, { slug: "mitcham", name: "Mitcham" }].map(n => (
              <Link key={n.slug} href={`/analyse/adelaide/${n.slug}`} style={{ fontSize: 13, fontWeight: 700, color: '#0891B2', textDecoration: 'none' }}>{n.name}</Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
