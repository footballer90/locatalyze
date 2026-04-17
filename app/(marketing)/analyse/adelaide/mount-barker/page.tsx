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
    headline: 'Opening a Business in Mount Barker, Adelaide: 2026 Location Guide',
    description: "Adelaide Hills gateway with rapid population growth, limited competition, and low rents — but business viability is acutely dependent on your concept's compatibility with the regional family demographic.",
    author: { '@type': 'Organisation', name: 'Locatalyze', url: 'https://www.locatalyze.com' },
    publisher: { '@type': 'Organisation', name: 'Locatalyze' },
    datePublished: '2026-01-01',
    dateModified: '2026-04-01',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
    { '@type': 'Question', name: "Is Mount Barker growing fast enough to support a new café?", acceptedAnswer: { '@type': 'Answer', text: "The population growth is genuine and fast — from under 20,000 to a projected 70,000–80,000 by 2040. The café opportunity is real, but the concept needs to be calibrated to a family demographic, not an inner-suburb professional one. A well-executed casual café with family-friendly positioning, competitive pricing, and good food can build a strong business as the population grows." } },
    { '@type': 'Question', name: "What rents can I expect in Mount Barker?", acceptedAnswer: { '@type': 'Answer', text: "Ground-floor commercial tenancies run $1,500–$3,000 per month — among the lowest in any growing Adelaide-area market. This creates exceptional margin economics for operators whose concept fits the market. The challenge is not the rent; it is generating consistent volume in a less foot-traffic-dense environment." } },
    { '@type': 'Question', name: "What types of businesses are missing in Mount Barker?", acceptedAnswer: { '@type': 'Answer', text: "Quality independent hospitality (the existing offer is primarily chain-dominated), specialist allied health services, premium fitness and wellness concepts accessible enough for family demographics, and specialty food retail. The gap between population size and commercial offering is large and growing as the population expands." } }
    ],
  },
]

export default function MountBarkerPage() {
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
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Mount Barker</span>
          </div>
          <h1 style={{ fontSize: 'clamp(26px,5vw,46px)', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 14 }}>
            Opening a Business in Mount Barker, SA: 2026 Location Analysis
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', maxWidth: 580, lineHeight: 1.7, marginBottom: 22 }}>
            Adelaide Hills gateway with rapid population growth, limited competition, and low rents — but business viability is acutely dependent on your concept's compatibility with the regional family demographic.
          </p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <VerdictBadge v="CAUTION" />
            <span style={{ fontSize: 28, fontWeight: 900, color: '#FFFFFF' }}>66/100</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>Location score</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '4px 12px' }}>$1,500–$3,000/mo</span>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 12 }}>Adelaide Hills gateway · Bald Hills Road precinct · $85K median income · fastest-growing SA satellite city</p>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* Score card */}
        <section style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: 24, marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: S.n900, marginBottom: 20 }}>Location Scorecard</h2>
          <ScoreBar label="Foot Traffic" value={64} />
          <ScoreBar label="Demographics" value={74} />
          <ScoreBar label="Rent Viability" value={90} />
          <ScoreBar label="Competition Gap" value={86} />
          <p style={{ fontSize: 11, color: S.muted, marginTop: 8 }}>Scores reflect foot traffic patterns, demographic alignment, rent viability, and competition gap for Mount Barker.</p>
        </section>

        {/* Business environment */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, color: S.n900 }}>Business Environment</h2>
          <p style={{ fontSize: 15, lineHeight: 1.75, marginBottom: 14, color: S.muted }}>Mount Barker is the fastest-growing satellite city in South Australia, driven by housing affordability and lifestyle appeal for families priced out of inner Adelaide. The population has grown from under 20,000 to over 35,000 in the last decade and is projected to reach 70,000–80,000 by 2040. For commercial operators, this growth trajectory creates opportunities that don't exist in established, competitively dense metropolitan suburbs.</p>
          <p style={{ fontSize: 15, lineHeight: 1.75, marginBottom: 14, color: S.muted }}>The demographic is predominantly young families and dual-income households who have moved from metropolitan Adelaide — median household income around $85,000, high owner-occupier rates, and family-oriented consumer behaviour. Spending patterns lean toward family dining, convenience, health services, and home improvement rather than the premium independent hospitality that inner-suburb operators favour. Understanding this distinction is essential before committing.</p>
          <p style={{ fontSize: 15, lineHeight: 1.75, marginBottom: 14, color: S.muted }}>Commercial rents are the lowest in this index: $1,500–$3,000 per month for quality commercial tenancies. Land and building costs are far below metropolitan equivalents. For operators whose concept fits the market, the rent economics create extraordinary margin headroom — the challenge is finding the right concept for a regional family demographic rather than an inner-suburb professional one.</p>
        </section>

        {/* Competition */}
        <section style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: 24, marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: S.n900, marginBottom: 12 }}>Competition Analysis</h2>
          <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.7 }}>Mount Barker's commercial competition is primarily chain retail and services — major supermarkets, pharmacy chains, national QSR. The independent segment is thin and often low-quality. Genuine specialty hospitality, premium casual dining, and quality wellness services are underrepresented relative to the growing population. For operators who understand regional family demographics, the competition is genuinely limited.</p>
        </section>

        {/* What works */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, color: S.n900 }}>What Works Here</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 14 }}>
              <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 12, padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.08em' }}>GO</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Family-oriented dining and casual hospitality</p>
                <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6 }}>The large and growing family demographic creates strong demand for casual dining concepts that welcome children, offer value, and have space for groups. This is genuinely underserved relative to population size.</p>
              </div>
              <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 12, padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.08em' }}>GO</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Allied health and medical services</p>
                <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6 }}>Rapid population growth consistently outpaces health service provision in satellite cities. Physio, GP-adjacent allied health, maternal and child health, and dental/allied dental services have very low competition and strong demand.</p>
              </div>
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 12, padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.08em' }}>CAUTION</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Premium hospitality targeting inner-suburb demographics</p>
                <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6 }}>A premium specialty café or fine-dining concept designed for inner-Adelaide professional demographics will find a smaller target market in Mount Barker. The income is there, but the consumer behaviour is family-oriented rather than premium-dining oriented.</p>
              </div>
          </div>
        </section>

        {/* Key risks */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, color: S.n900 }}>Key Risks</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: '13px 16px' }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#92400E', marginBottom: 3 }}>Distance from metropolitan hospitality ecosystem</p>
                <p style={{ fontSize: 12, color: '#78350F', lineHeight: 1.6 }}>Mount Barker is 30km from the CBD and outside the metro hospitality media and events ecosystem. Building brand awareness without the organic publicity of inner-suburb media coverage requires deliberate effort.</p>
              </div>
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: '13px 16px' }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#92400E', marginBottom: 3 }}>Car-dependent, large-format competition</p>
                <p style={{ fontSize: 12, color: '#78350F', lineHeight: 1.6 }}>Large format retail and drive-to shopping centres dominate regional commercial spending. Street-level independents need to be in or adjacent to high-traffic nodes to capture meaningful walk-in business.</p>
              </div>
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: '13px 16px' }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#92400E', marginBottom: 3 }}>Concept-market mismatch is common</p>
                <p style={{ fontSize: 12, color: '#78350F', lineHeight: 1.6 }}>Operators who open a concept designed for inner-suburb demographics in Mount Barker consistently underperform. The market is family-oriented, value-conscious, and practical — not premium-seeking.</p>
              </div>
          </div>
        </section>

        {/* Compare nearby */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, color: S.n900 }}>Compare Nearby Suburbs</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14 }}>
              <a href="/analyse/adelaide/norwood" style={{ textDecoration: 'none' }}>
                <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: '14px 16px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: S.n900 }}>Norwood</span>
                    <VerdictBadge v="GO" />
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: S.brand }}>86</div>
                  <div style={{ fontSize: 11, color: S.muted, marginTop: 2 }}>Inner east · benchmark</div>
                </div>
              </a>
              <a href="/analyse/adelaide/burnside" style={{ textDecoration: 'none' }}>
                <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: '14px 16px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: S.n900 }}>Burnside</span>
                    <VerdictBadge v="GO" />
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: S.brand }}>73</div>
                  <div style={{ fontSize: 11, color: S.muted, marginTop: 2 }}>Eastern hills entry</div>
                </div>
              </a>
              <a href="/analyse/adelaide/mitcham" style={{ textDecoration: 'none' }}>
                <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: '14px 16px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: S.n900 }}>Mitcham</span>
                    <VerdictBadge v="GO" />
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: S.brand }}>72</div>
                  <div style={{ fontSize: 11, color: S.muted, marginTop: 2 }}>Inner south · similar income</div>
                </div>
              </a>
          </div>
        </section>

        {/* Poll */}
        <SuburbPoll suburb="Mount Barker" votes={[36, 23, 19, 14, 8]} />

        {/* Final verdict */}
        <section style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: 24, marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <VerdictBadge v="CAUTION" />
            <h2 style={{ fontSize: 16, fontWeight: 800, color: S.n900 }}>Final Verdict: Mount Barker</h2>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: S.muted, marginBottom: 10 }}>Mount Barker is a CAUTION — not because the opportunity is absent but because concept-market fit is the defining variable. Operators who bring concepts designed for inner-suburban professionals will find a smaller audience than expected. Operators who design for the actual market — young families, dual incomes, practical spending priorities — will find almost no competition and extraordinary rent economics.</p>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: S.muted, marginBottom: 10 }}>The growth trajectory of Mount Barker makes it one of the most interesting medium-term bets in South Australia. The question is whether your concept is right for a regional family city. If the answer is yes, the numbers are compelling.</p>
        </section>

        {/* FAQ */}
        <section style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: 24, marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: S.n900, marginBottom: 20 }}>Frequently Asked Questions</h2>
              <details style={{ borderBottom: `1px solid ${S.border}`, paddingBottom: 12, marginBottom: 12 }}>
                <summary style={{ fontSize: 13, fontWeight: 700, color: S.n900, cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  Is Mount Barker growing fast enough to support a new café? <span style={{ color: S.brand }}>+</span>
                </summary>
                <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.7, marginTop: 10 }}>The population growth is genuine and fast — from under 20,000 to a projected 70,000–80,000 by 2040. The café opportunity is real, but the concept needs to be calibrated to a family demographic, not an inner-suburb professional one. A well-executed casual café with family-friendly positioning, competitive pricing, and good food can build a strong business as the population grows.</p>
              </details>
              <details style={{ borderBottom: `1px solid ${S.border}`, paddingBottom: 12, marginBottom: 12 }}>
                <summary style={{ fontSize: 13, fontWeight: 700, color: S.n900, cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  What rents can I expect in Mount Barker? <span style={{ color: S.brand }}>+</span>
                </summary>
                <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.7, marginTop: 10 }}>Ground-floor commercial tenancies run $1,500–$3,000 per month — among the lowest in any growing Adelaide-area market. This creates exceptional margin economics for operators whose concept fits the market. The challenge is not the rent; it is generating consistent volume in a less foot-traffic-dense environment.</p>
              </details>
              <details style={{ borderBottom: `1px solid ${S.border}`, paddingBottom: 12, marginBottom: 12 }}>
                <summary style={{ fontSize: 13, fontWeight: 700, color: S.n900, cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  What types of businesses are missing in Mount Barker? <span style={{ color: S.brand }}>+</span>
                </summary>
                <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.7, marginTop: 10 }}>Quality independent hospitality (the existing offer is primarily chain-dominated), specialist allied health services, premium fitness and wellness concepts accessible enough for family demographics, and specialty food retail. The gap between population size and commercial offering is large and growing as the population expands.</p>
              </details>
        </section>

        {/* CTA */}
        <div style={{ background: 'linear-gradient(135deg, #0F766E 0%, #0B5E57 100%)', borderRadius: 14, padding: '44px 40px', textAlign: 'center', marginBottom: 44 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#FFFFFF', marginBottom: 10 }}>Analyse Your Mount Barker Address</h2>
          <p style={{ fontSize: 14, color: 'rgba(167,243,208,0.8)', marginBottom: 24, maxWidth: 440, margin: '0 auto 24px', lineHeight: 1.7 }}>
            Get a full GO/CAUTION/NO verdict with competitor map, financial model and 3-year projection for your specific address in Mount Barker. First report free.
          </p>
          <Link href="/onboarding" style={{ background: '#FFFFFF', color: '#0F766E', borderRadius: 10, padding: '14px 32px', fontSize: 15, fontWeight: 800, textDecoration: 'none', display: 'inline-block' }}>
            Start Free Analysis →
          </Link>
        </div>

        {/* Footer nav */}
        <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 24, display: 'flex', gap: 12, justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Link href="/analyse/adelaide" style={{ fontSize: 13, fontWeight: 700, color: S.brand, textDecoration: 'none' }}>← Back to Adelaide</Link>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {[{ slug: "norwood", name: "Norwood" }, { slug: "burnside", name: "Burnside" }, { slug: "mitcham", name: "Mitcham" }].map(n => (
              <Link key={n.slug} href={`/analyse/adelaide/${n.slug}`} style={{ fontSize: 13, fontWeight: 700, color: S.brand, textDecoration: 'none' }}>{n.name}</Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
