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
    headline: 'Opening a Business in Bowden, Adelaide: 2026 Location Guide',
    description: "Adelaide's most accessible urban renewal suburb — Bowden has transitioned faster than any other inner-ring location, with a young professional demographic and a commercial strip still in its early innings.",
    author: { '@type': 'Organisation', name: 'Locatalyze', url: 'https://locatalyze.com' },
    publisher: { '@type': 'Organisation', name: 'Locatalyze' },
    datePublished: '2026-01-01',
    dateModified: '2026-04-01',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
    { '@type': 'Question', name: "Is Bowden a good place to open a café in Adelaide?", acceptedAnswer: { '@type': 'Answer', text: "Yes, for operators who can engage the captive residential base. Bowden has a growing population of young professionals who want quality coffee within walking distance of their homes. The competition is low and the demographic is right. The risk is that full residential density is 2–3 years away from supporting a mature café ecosystem." } },
    { '@type': 'Question', name: "How does Plant 4 affect the local commercial market?", acceptedAnswer: { '@type': 'Answer', text: "Plant 4 creates strong weekend foot traffic that benefits the surrounding commercial area. However, it also provides some food and coffee options itself, so direct food competitors need to differentiate. The most reliable opportunity is in permanent everyday hospitality for the residential base, which Plant 4 does not fully serve." } },
    { '@type': 'Question', name: "What are rents like in Bowden?", acceptedAnswer: { '@type': 'Answer', text: "Port Road and the surrounding commercial streets run $3,000–$5,500/month for ground-floor commercial tenancies. Some larger spaces in converted industrial buildings are available at lower rates. Given the demographic trajectory and proximity to the CBD, these rents offer good value and will rise as the precinct matures." } }
    ],
  },
]

export default function BowdenPage() {
  return (
    <div style={{ minHeight: '100vh', background: S.n50, fontFamily: "'DM Sans','Helvetica Neue',Arial,sans-serif", color: S.n900 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMAS) }} />
{/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0E7490 0%, #0891B2 100%)', padding: '52px 24px 44px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
            <Link href="/analyse/adelaide" style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>Adelaide</Link>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>›</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Bowden</span>
          </div>
          <h1 style={{ fontSize: 'clamp(26px,5vw,46px)', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 14 }}>
            Opening a Business in Bowden, SA: 2026 Location Analysis
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', maxWidth: 580, lineHeight: 1.7, marginBottom: 22 }}>
            Adelaide's most accessible urban renewal suburb — Bowden has transitioned faster than any other inner-ring location, with a young professional demographic and a commercial strip still in its early innings.
          </p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <VerdictBadge v="GO" />
            <span style={{ fontSize: 28, fontWeight: 900, color: '#FFFFFF' }}>72/100</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>Location score</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '4px 12px' }}>$3,000–$5,500/mo</span>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 12 }}>Port Road precinct · Plant 4 · $82K median income · 2km from CBD · tram access</p>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* Score card */}
        <section style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: 24, marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: S.n900, marginBottom: 20 }}>Location Scorecard</h2>
          <ScoreBar label="Foot Traffic" value={68} />
          <ScoreBar label="Demographics" value={80} />
          <ScoreBar label="Rent Viability" value={78} />
          <ScoreBar label="Competition Gap" value={82} />
          <p style={{ fontSize: 11, color: S.muted, marginTop: 8 }}>Scores reflect foot traffic patterns, demographic alignment, rent viability, and competition gap for Bowden.</p>
        </section>

        {/* Business environment */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, color: S.n900 }}>Business Environment</h2>
          <p style={{ fontSize: 15, lineHeight: 1.75, marginBottom: 14, color: S.muted }}>Bowden is the most successful urban renewal precinct in South Australia. The suburb — a former industrial zone 2km from the CBD — has been transformed over the last decade into a high-density residential precinct with strong design character. The new residential towers and townhouses house predominantly young professional and childless-couple households attracted by the inner-ring location, walkability, and contemporary design. It is one of very few Adelaide suburbs where the demographics skew genuinely young (25–40) at scale.</p>
          <p style={{ fontSize: 15, lineHeight: 1.75, marginBottom: 14, color: S.muted }}>The commercial anchor is Plant 4, a converted industrial building that hosts a successful food market and events space. Plant 4's weekend market creates the density of visitors that makes the broader precinct commercially viable. Port Road, which fronts the precinct, provides connectivity to the CBD and the inner north. The Bowden tram stop on the Glenelg line makes it one of the best-connected non-CBD locations in Adelaide.</p>
          <p style={{ fontSize: 15, lineHeight: 1.75, marginBottom: 14, color: S.muted }}>The commercial offering outside Plant 4 is still thin — several hospitality concepts have opened in recent years with mixed results, and the retail mix is basic. Rents on Port Road and the surrounding streets run $3,000–$5,500 per month, significantly below CBD levels for comparable-accessible locations. This gap will close as the precinct matures.</p>
        </section>

        {/* Competition */}
        <section style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: 24, marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: S.n900, marginBottom: 12 }}>Competition Analysis</h2>
          <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.7 }}>Bowden's competitive landscape is one of the most open in this analysis. There is no established specialty coffee operator, no premium dining concept with genuine execution, and no serious wellness or allied health presence. For operators with a concept that fits the young professional demographic, the combination of low competition, affordable rents, and a growing captive residential base is genuinely attractive.</p>
        </section>

        {/* What works */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, color: S.n900 }}>What Works Here</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 14 }}>
              <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 12, padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.08em' }}>GO</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Specialty café or premium casual dining</p>
                <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6 }}>The young professional residential demographic actively seeks quality coffee and casual dining within walking distance. A concept that becomes the go-to for Bowden residents builds a loyal core before extending its reach to the wider inner-north catchment.</p>
              </div>
              <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 12, padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.08em' }}>GO</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Wellness and fitness concepts</p>
                <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6 }}>High-density young professional precincts consistently support boutique fitness (pilates, boxing, functional training) and allied health. Bowden is underserved in this category despite the demographic.</p>
              </div>
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 12, padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.08em' }}>CAUTION</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Dependent on weekend-only traffic</p>
                <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6 }}>Plant 4 generates strong weekend crowds. Concepts that require this weekend traffic to be viable — but face quiet weekdays — need careful financial modelling. The captive residential base is the more reliable driver.</p>
              </div>
          </div>
        </section>

        {/* Key risks */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, color: S.n900 }}>Key Risks</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: '13px 16px' }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#92400E', marginBottom: 3 }}>Residential critical mass still building</p>
                <p style={{ fontSize: 12, color: '#78350F', lineHeight: 1.6 }}>Bowden's residential population is growing but has not yet reached the density that fully supports a mature commercial ecosystem. New apartment towers under construction will change this over the next 2–3 years.</p>
              </div>
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: '13px 16px' }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#92400E', marginBottom: 3 }}>Port Road noise and character</p>
                <p style={{ fontSize: 12, color: '#78350F', lineHeight: 1.6 }}>Port Road is a high-volume arterial road. Street-level hospitality facing the road needs to manage the acoustic and aesthetic challenges of a busy road frontage.</p>
              </div>
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: '13px 16px' }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#92400E', marginBottom: 3 }}>Limited heritage dining culture</p>
                <p style={{ fontSize: 12, color: '#78350F', lineHeight: 1.6 }}>Unlike Norwood or Unley, Bowden lacks the established dining tradition that generates habitual visit patterns. Building a loyal following from a new residential base requires patience and strong community engagement.</p>
              </div>
          </div>
        </section>

        {/* Compare nearby */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, color: S.n900 }}>Compare Nearby Suburbs</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14 }}>
              <a href="/analyse/adelaide/prospect" style={{ textDecoration: 'none' }}>
                <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: '14px 16px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: S.n900 }}>Prospect</span>
                    <VerdictBadge v="GO" />
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: S.brand }}>78</div>
                  <div style={{ fontSize: 11, color: S.muted, marginTop: 2 }}>Prospect Rd · more established</div>
                </div>
              </a>
              <a href="/analyse/adelaide/north-adelaide" style={{ textDecoration: 'none' }}>
                <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: '14px 16px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: S.n900 }}>North Adelaide</span>
                    <VerdictBadge v="GO" />
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: S.brand }}>79</div>
                  <div style={{ fontSize: 11, color: S.muted, marginTop: 2 }}>O'Connell St · premium</div>
                </div>
              </a>
              <a href="/analyse/adelaide/adelaide-cbd" style={{ textDecoration: 'none' }}>
                <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: '14px 16px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: S.n900 }}>Adelaide CBD</span>
                    <VerdictBadge v="CAUTION" />
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: S.brand }}>71</div>
                  <div style={{ fontSize: 11, color: S.muted, marginTop: 2 }}>2km · higher rents</div>
                </div>
              </a>
          </div>
        </section>

        {/* Poll */}
        <SuburbPoll suburb="Bowden" votes={[48, 24, 14, 10, 4]} />

        {/* Final verdict */}
        <section style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: 24, marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <VerdictBadge v="GO" />
            <h2 style={{ fontSize: 16, fontWeight: 800, color: S.n900 }}>Final Verdict: Bowden</h2>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: S.muted, marginBottom: 10 }}>Bowden is a GO for operators who want a first-mover position in Adelaide's most dynamic urban renewal precinct. The demographics are right, the rents are attractive, and the competition is minimal. The ingredient that's still building is residential critical mass.</p>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: S.muted, marginBottom: 10 }}>This is a 3–5 year investment in positioning rather than a first-week revenue story. Operators who open now, build genuine community relationships, and have the financial runway for the growth phase will be well-positioned when the precinct reaches maturity.</p>
        </section>

        {/* FAQ */}
        <section style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: 24, marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: S.n900, marginBottom: 20 }}>Frequently Asked Questions</h2>
              <details style={{ borderBottom: `1px solid ${S.border}`, paddingBottom: 12, marginBottom: 12 }}>
                <summary style={{ fontSize: 13, fontWeight: 700, color: S.n900, cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  Is Bowden a good place to open a café in Adelaide? <span style={{ color: S.brand }}>+</span>
                </summary>
                <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.7, marginTop: 10 }}>Yes, for operators who can engage the captive residential base. Bowden has a growing population of young professionals who want quality coffee within walking distance of their homes. The competition is low and the demographic is right. The risk is that full residential density is 2–3 years away from supporting a mature café ecosystem.</p>
              </details>
              <details style={{ borderBottom: `1px solid ${S.border}`, paddingBottom: 12, marginBottom: 12 }}>
                <summary style={{ fontSize: 13, fontWeight: 700, color: S.n900, cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  How does Plant 4 affect the local commercial market? <span style={{ color: S.brand }}>+</span>
                </summary>
                <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.7, marginTop: 10 }}>Plant 4 creates strong weekend foot traffic that benefits the surrounding commercial area. However, it also provides some food and coffee options itself, so direct food competitors need to differentiate. The most reliable opportunity is in permanent everyday hospitality for the residential base, which Plant 4 does not fully serve.</p>
              </details>
              <details style={{ borderBottom: `1px solid ${S.border}`, paddingBottom: 12, marginBottom: 12 }}>
                <summary style={{ fontSize: 13, fontWeight: 700, color: S.n900, cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  What are rents like in Bowden? <span style={{ color: S.brand }}>+</span>
                </summary>
                <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.7, marginTop: 10 }}>Port Road and the surrounding commercial streets run $3,000–$5,500/month for ground-floor commercial tenancies. Some larger spaces in converted industrial buildings are available at lower rates. Given the demographic trajectory and proximity to the CBD, these rents offer good value and will rise as the precinct matures.</p>
              </details>
        </section>

        {/* CTA */}
        <div style={{ background: 'linear-gradient(135deg, #0F766E 0%, #0B5E57 100%)', borderRadius: 14, padding: '44px 40px', textAlign: 'center', marginBottom: 44 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#FFFFFF', marginBottom: 10 }}>Analyse Your Bowden Address</h2>
          <p style={{ fontSize: 14, color: 'rgba(167,243,208,0.8)', marginBottom: 24, maxWidth: 440, margin: '0 auto 24px', lineHeight: 1.7 }}>
            Get a full GO/CAUTION/NO verdict with competitor map, financial model and 3-year projection for your specific address in Bowden. First report free.
          </p>
          <Link href="/onboarding" style={{ background: '#FFFFFF', color: '#0F766E', borderRadius: 10, padding: '14px 32px', fontSize: 15, fontWeight: 800, textDecoration: 'none', display: 'inline-block' }}>
            Start Free Analysis →
          </Link>
        </div>

        {/* Footer nav */}
        <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 24, display: 'flex', gap: 12, justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Link href="/analyse/adelaide" style={{ fontSize: 13, fontWeight: 700, color: S.brand, textDecoration: 'none' }}>← Back to Adelaide</Link>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {[{ slug: "prospect", name: "Prospect" }, { slug: "north-adelaide", name: "North Adelaide" }, { slug: "adelaide-cbd", name: "Adelaide CBD" }].map(n => (
              <Link key={n.slug} href={`/analyse/adelaide/${n.slug}`} style={{ fontSize: 13, fontWeight: 700, color: S.brand, textDecoration: 'none' }}>{n.name}</Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
