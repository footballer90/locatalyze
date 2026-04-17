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
    headline: 'Opening a Business in Elizabeth, Adelaide: 2026 Location Guide',
    description: "Elizabeth is South Australia\'s most challenged commercial market — a large but low-income northern catchment with intense chain competition. Only specific concept types are viable for independent operators.",
    author: { '@type': 'Organisation', name: 'Locatalyze', url: 'https://www.locatalyze.com' },
    publisher: { '@type': 'Organisation', name: 'Locatalyze' },
    datePublished: '2026-01-01',
    dateModified: '2026-04-01',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
    { '@type': 'Question', name: "Can a café succeed in Elizabeth?", acceptedAnswer: { '@type': 'Answer', text: "It can, but only with a model specifically calibrated to the market. A café that prices aggressively, offers strong value, and builds genuine community relationships can generate volume from the large resident population. A café priced and positioned for an inner-suburb demographic will not find its market. The business case depends on whether you can generate sufficient volume at low price points given the rent advantage." } },
    { '@type': 'Question', name: "What are the rents like in Elizabeth?", acceptedAnswer: { '@type': 'Answer', text: "Among the lowest in metropolitan Australia — $1,200–$2,500 per month for most commercial tenancies. This is the primary commercial attraction of the location. The question is whether the demographic generates enough revenue at its price point tolerance to make the overall economics work." } },
    { '@type': 'Question', name: "Is Elizabeth improving commercially?", acceptedAnswer: { '@type': 'Answer', text: "There are government-funded urban renewal investments in the Playford area, and some new residential development is occurring. However, the demographic transformation required to substantially change the commercial landscape is a very long-term proposition. The income base that defines the current commercial environment will not change quickly." } }
    ],
  },
]

export default function ElizabethPage() {
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
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Elizabeth</span>
          </div>
          <h1 style={{ fontSize: 'clamp(26px,5vw,46px)', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 14 }}>
            Opening a Business in Elizabeth, SA: 2026 Location Analysis
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', maxWidth: 580, lineHeight: 1.7, marginBottom: 22 }}>
            Elizabeth is South Australia's most challenged commercial market — a large but low-income northern catchment with intense chain competition. Only specific concept types are viable for independent operators.
          </p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <VerdictBadge v="CAUTION" />
            <span style={{ fontSize: 28, fontWeight: 900, color: '#FFFFFF' }}>57/100</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>Location score</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '4px 12px' }}>$1,200–$2,500/mo</span>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 12 }}>Elizabeth City Centre · John Rice Avenue · $56K median income · largest northern public housing precinct</p>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* Score card */}
        <section style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, padding: 24, marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#1C1917', marginBottom: 20 }}>Location Scorecard</h2>
          <ScoreBar label="Foot Traffic" value={65} />
          <ScoreBar label="Demographics" value={38} />
          <ScoreBar label="Rent Viability" value={90} />
          <ScoreBar label="Competition Gap" value={68} />
          <p style={{ fontSize: 11, color: '#64748B', marginTop: 8 }}>Scores reflect foot traffic patterns, demographic alignment, rent viability, and competition gap for Elizabeth.</p>
        </section>

        {/* Business environment */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, color: '#1C1917' }}>Business Environment</h2>
          <p style={{ fontSize: 15, lineHeight: 1.75, marginBottom: 14, color: '#64748B' }}>Elizabeth is a planned satellite city 25km north of Adelaide's CBD, developed in the 1950s as a major public housing estate. The suburb has South Australia's highest concentration of public housing, among the lowest household incomes in metropolitan Adelaide, and significant social disadvantage indicators. Understanding this context is essential before making any commercial decision — it determines what business models are viable and which are not.</p>
          <p style={{ fontSize: 15, lineHeight: 1.75, marginBottom: 14, color: '#64748B' }}>The commercial centre at Elizabeth City Centre and surrounding precincts does have genuine foot traffic from the large resident population, and the catchment extends across the broader northern Playford council area. However, spending behaviour is acutely price-sensitive and average transaction values are low. The commercial ecosystem is dominated by discount retailers, community services, and government-funded businesses — the independent premium hospitality and wellness sector essentially does not exist here.</p>
          <p style={{ fontSize: 15, lineHeight: 1.75, marginBottom: 14, color: '#64748B' }}>Rents are the lowest in metropolitan Adelaide: $1,200–$2,500 per month for most commercial tenancies. This creates an operating cost structure that can work for specific business models — high-volume value hospitality, community services, essential retail — but this advantage is contingent on generating sufficient volume from a constrained-income demographic.</p>
        </section>

        {/* Competition */}
        <section style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, padding: 24, marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#1C1917', marginBottom: 12 }}>Competition Analysis</h2>
          <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.7 }}>Elizabeth's commercial competition is heavily chain and discount oriented. National fast food chains, discount variety, and government-funded services dominate. The independent sector is thin and concentrated in community-aligned services and ethnic cuisine. There are gaps in quality food and nutrition services, but "quality" must be interpreted within the price constraints of the local demographic.</p>
        </section>

        {/* What works */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, color: '#1C1917' }}>What Works Here</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 14 }}>
              <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 12, padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.08em' }}>GO</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Community-aligned essential services</p>
                <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6 }}>Businesses that provide essential services — health screening, financial counselling, community dining — at accessible prices and with genuine community engagement can build strong loyalty in Elizabeth. Many have government funding pathways that supplement commercial revenue.</p>
              </div>
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 12, padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.08em' }}>CAUTION</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Value food at accessible prices</p>
                <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6 }}>A café or casual dining concept that prices aggressively, offers good value, and understands the budget constraints of the local demographic can generate volume. Margins are thin but rent is extremely low. The model requires operational efficiency and low food costs.</p>
              </div>
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 12, padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.08em' }}>CAUTION</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Standard independent hospitality</p>
                <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6 }}>A standard independent café or restaurant priced at inner-suburb levels will not find its market in Elizabeth. The demographic cannot consistently support even mid-market independent pricing.</p>
              </div>
          </div>
        </section>

        {/* Key risks */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, color: '#1C1917' }}>Key Risks</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: '13px 16px' }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#92400E', marginBottom: 3 }}>Low income severely constrains average spend</p>
                <p style={{ fontSize: 12, color: '#78350F', lineHeight: 1.6 }}>Median household income around $56,000, with a large proportion of residents on government income support. Average transaction values are the lowest in metropolitan Adelaide. Revenue models must be built on volume at low prices, not quality margins.</p>
              </div>
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: '13px 16px' }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#92400E', marginBottom: 3 }}>Social disadvantage indicators affect trading environment</p>
                <p style={{ fontSize: 12, color: '#78350F', lineHeight: 1.6 }}>Elizabeth has elevated rates of crime, anti-social behaviour, and associated operational challenges. Security costs, property management, and staff retention are all higher-than-average considerations for commercial operators.</p>
              </div>
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: '13px 16px' }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#92400E', marginBottom: 3 }}>Chain competition is entrenched</p>
                <p style={{ fontSize: 12, color: '#78350F', lineHeight: 1.6 }}>Major QSR chains with national marketing budgets and loss-leader pricing dominate the value food market. Independent operators who try to compete on price alone face a structural disadvantage.</p>
              </div>
          </div>
        </section>

        {/* Compare nearby */}
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
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>Adjacent south · better demographics</div>
                </div>
              </a>
              <a href="/analyse/adelaide/prospect" style={{ textDecoration: 'none' }}>
                <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: '14px 16px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#1C1917' }}>Prospect</span>
                    <VerdictBadge v="GO" />
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#0891B2' }}>78</div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>Inner north · much stronger</div>
                </div>
              </a>
              <a href="/analyse/adelaide/modbury" style={{ textDecoration: 'none' }}>
                <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: '14px 16px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#1C1917' }}>Modbury</span>
                    <VerdictBadge v="CAUTION" />
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#0891B2' }}>65</div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>NE metro · similar challenges</div>
                </div>
              </a>
          </div>
        </section>

        {/* Poll */}
        <SuburbPoll suburb="Elizabeth" votes={[31, 24, 22, 14, 9]} />

        {/* Final verdict */}
        <section style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, padding: 24, marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <VerdictBadge v="CAUTION" />
            <h2 style={{ fontSize: 16, fontWeight: 800, color: '#1C1917' }}>Final Verdict: Elizabeth</h2>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: '#64748B', marginBottom: 10 }}>Elizabeth is rated CAUTION — not NO — because specific business models can work here, but the conditions for success are significantly different from anywhere else in this index. The demographic realities are real and must be factored into every aspect of the business model, from pricing to product to staffing.</p>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: '#64748B', marginBottom: 10 }}>This location makes sense for operators with specific community-service orientations, government funding pathways, or volume-based models calibrated to a low-income demographic. It does not make sense for operators who want to replicate an inner-suburb independent hospitality or retail model in a location with low rents.</p>
        </section>

        {/* FAQ */}
        <section style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, padding: 24, marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#1C1917', marginBottom: 20 }}>Frequently Asked Questions</h2>
              <details style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: 12, marginBottom: 12 }}>
                <summary style={{ fontSize: 13, fontWeight: 700, color: '#1C1917', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  Can a café succeed in Elizabeth? <span style={{ color: '#0891B2' }}>+</span>
                </summary>
                <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.7, marginTop: 10 }}>It can, but only with a model specifically calibrated to the market. A café that prices aggressively, offers strong value, and builds genuine community relationships can generate volume from the large resident population. A café priced and positioned for an inner-suburb demographic will not find its market. The business case depends on whether you can generate sufficient volume at low price points given the rent advantage.</p>
              </details>
              <details style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: 12, marginBottom: 12 }}>
                <summary style={{ fontSize: 13, fontWeight: 700, color: '#1C1917', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  What are the rents like in Elizabeth? <span style={{ color: '#0891B2' }}>+</span>
                </summary>
                <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.7, marginTop: 10 }}>Among the lowest in metropolitan Australia — $1,200–$2,500 per month for most commercial tenancies. This is the primary commercial attraction of the location. The question is whether the demographic generates enough revenue at its price point tolerance to make the overall economics work.</p>
              </details>
              <details style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: 12, marginBottom: 12 }}>
                <summary style={{ fontSize: 13, fontWeight: 700, color: '#1C1917', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  Is Elizabeth improving commercially? <span style={{ color: '#0891B2' }}>+</span>
                </summary>
                <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.7, marginTop: 10 }}>There are government-funded urban renewal investments in the Playford area, and some new residential development is occurring. However, the demographic transformation required to substantially change the commercial landscape is a very long-term proposition. The income base that defines the current commercial environment will not change quickly.</p>
              </details>
        </section>

        {/* CTA */}
        <div style={{ background: 'linear-gradient(135deg, #0F766E 0%, #0B5E57 100%)', borderRadius: 14, padding: '44px 40px', textAlign: 'center', marginBottom: 44 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#FFFFFF', marginBottom: 10 }}>Analyse Your Elizabeth Address</h2>
          <p style={{ fontSize: 14, color: 'rgba(167,243,208,0.8)', marginBottom: 24, maxWidth: 440, margin: '0 auto 24px', lineHeight: 1.7 }}>
            Get a full GO/CAUTION/NO verdict with competitor map, financial model and 3-year projection for your specific address in Elizabeth. First report free.
          </p>
          <Link href="/onboarding" style={{ background: '#FFFFFF', color: '#0F766E', borderRadius: 10, padding: '14px 32px', fontSize: 15, fontWeight: 800, textDecoration: 'none', display: 'inline-block' }}>
            Start Free Analysis →
          </Link>
        </div>

        {/* Footer nav */}
        <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: 24, display: 'flex', gap: 12, justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Link href="/analyse/adelaide" style={{ fontSize: 13, fontWeight: 700, color: '#0891B2', textDecoration: 'none' }}>← Back to Adelaide</Link>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {[{ slug: "salisbury", name: "Salisbury" }, { slug: "prospect", name: "Prospect" }, { slug: "modbury", name: "Modbury" }].map(n => (
              <Link key={n.slug} href={`/analyse/adelaide/${n.slug}`} style={{ fontSize: 13, fontWeight: 700, color: '#0891B2', textDecoration: 'none' }}>{n.name}</Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
