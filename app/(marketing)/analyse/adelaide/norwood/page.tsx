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
    headline: 'Opening a Business in Norwood, Adelaide: 2026 Location Guide',
    description: "Adelaide's highest-scoring commercial suburb. The Parade is a mature, high-income strip with year-round demand, manageable rents, and a consumer base that actively seeks out quality independent operators.",
    author: { '@type': 'Organisation', name: 'Locatalyze', url: 'https://locatalyze.com' },
    publisher: { '@type': 'Organisation', name: 'Locatalyze' },
    datePublished: '2026-01-01',
    dateModified: '2026-04-01',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
    { '@type': 'Question', name: "Is The Parade in Norwood the best place to open a café in Adelaide?", acceptedAnswer: { '@type': 'Answer', text: "By the numbers, yes — it scores highest among all Adelaide commercial strips for the combination of foot traffic, demographics, rent viability, and competition gap. The main consideration is that it is competitive, and a generic concept will struggle. A café with clear specialty positioning, genuine quality, and a specific cuisine or coffee identity has a strong chance of building a loyal following quickly." } },
    { '@type': 'Question', name: "What types of business do best on The Parade?", acceptedAnswer: { '@type': 'Answer', text: "Premium independent hospitality (café, bar, restaurant), specialty retail (not chains), allied health and wellness, and professional services with community presence. The Parade demographic has high discretionary spend and actively supports quality independents over chains." } },
    { '@type': 'Question', name: "How do Norwood rents compare to Melbourne equivalents?", acceptedAnswer: { '@type': 'Answer', text: "Meaningfully lower. A prime Norwood Parade position at $6,000–$7,500/month would cost $12,000–$20,000 on a comparable-traffic Melbourne strip like Brunswick or Fitzroy. Adelaide's lower rents combined with a genuinely high-income demographic produce better margin economics for well-run operations." } }
    ],
  },
]

export default function NorwoodPage() {
  return (
    <div style={{ minHeight: '100vh', background: S.n50, fontFamily: "'DM Sans','Helvetica Neue',Arial,sans-serif", color: S.n900 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMAS) }} />
{/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0E7490 0%, #0891B2 100%)', padding: '52px 24px 44px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
            <Link href="/analyse/adelaide" style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>Adelaide</Link>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>›</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Norwood</span>
          </div>
          <h1 style={{ fontSize: 'clamp(26px,5vw,46px)', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 14 }}>
            Opening a Business in Norwood, SA: 2026 Location Analysis
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', maxWidth: 580, lineHeight: 1.7, marginBottom: 22 }}>
            Adelaide's highest-scoring commercial suburb. The Parade is a mature, high-income strip with year-round demand, manageable rents, and a consumer base that actively seeks out quality independent operators.
          </p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <VerdictBadge v="GO" />
            <span style={{ fontSize: 28, fontWeight: 900, color: '#FFFFFF' }}>86/100</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>Location score</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '4px 12px' }}>$4,000–$7,500/mo</span>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 12 }}>The Parade strip · 1km of continuous retail · median income $98,000 · SA's strongest independent dining corridor</p>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* Score card */}
        <section style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: 24, marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: S.n900, marginBottom: 20 }}>Location Scorecard</h2>
          <ScoreBar label="Foot Traffic" value={87} />
          <ScoreBar label="Demographics" value={90} />
          <ScoreBar label="Rent Viability" value={82} />
          <ScoreBar label="Competition Gap" value={78} />
          <p style={{ fontSize: 11, color: S.muted, marginTop: 8 }}>Scores reflect foot traffic patterns, demographic alignment, rent viability, and competition gap for Norwood.</p>
        </section>

        {/* Business environment */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, color: S.n900 }}>Business Environment</h2>
          <p style={{ fontSize: 15, lineHeight: 1.75, marginBottom: 14, color: S.muted }}>Norwood's The Parade is the benchmark independent retail and dining strip in South Australia. The 1km stretch from Osmond Terrace to The Parade's western end hosts approximately 250 tenancies, with hospitality, specialty retail, and professional services co-existing at a density that sustains strong foot traffic year-round. Unlike CBD strips that depend on office workers, The Parade draws from a residential catchment with high discretionary spending.</p>
          <p style={{ fontSize: 15, lineHeight: 1.75, marginBottom: 14, color: S.muted }}>The demographic profile is the best of any Adelaide suburb for premium independent businesses. Median household income at $98,000, age skew 30–55, very high owner-occupier rate, and a resident base that has historically supported independent operators over chains. The Parade has maintained a relatively low chain-to-independent ratio compared to equivalent-sized strips in other Australian cities — this reflects both tenant preference and an active local community that values the independent character.</p>
          <p style={{ fontSize: 15, lineHeight: 1.75, marginBottom: 14, color: S.muted }}>Rents are competitive relative to the quality of the trading environment. Prime positions on The Parade run $5,500–$7,500 per month; secondary positions are $4,000–$5,500. These are meaningfully below comparable-traffic Melbourne or Sydney strips, and the revenue potential justifies the rent in a way that holds up to scrutiny. A 60sqm café with 80 daily covers at $22 average spend generates $70,000+ monthly revenue — against $6,000–$7,000 rent, that's an 8–10% ratio.</p>
        </section>

        {/* Competition */}
        <section style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: 24, marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: S.n900, marginBottom: 12 }}>Competition Analysis</h2>
          <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.7 }}>The Parade is competitive for café and mid-market dining but has genuine gaps at the premium end. Several cafés are performing well, but specialty concepts with strong provenance, premium wine or cocktail programs, and cuisine categories not yet represented have opened and succeeded here. The retail landscape has some strength in lifestyle and homewares with gaps in specialty food, wellness, and concept retail.</p>
        </section>

        {/* What works */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, color: S.n900 }}>What Works Here</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 14 }}>
              <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 12, padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.08em' }}>GO</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Premium specialty café</p>
                <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6 }}>The demographic supports $22–$35 average spend. Competition for generic café is real but quality ceiling exists — the current field has no clear specialty coffee leader, and a roastery-aligned concept would own the category.</p>
              </div>
              <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 12, padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.08em' }}>GO</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Licensed restaurant with clear concept</p>
                <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6 }}>Evening dining demand is consistent and income-qualified. The Parade has a growing reputation for destination dining. A concept with clear cuisine identity and genuine execution can establish in 6–9 months.</p>
              </div>
              <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 12, padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.08em' }}>GO</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Wellness and allied health</p>
                <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6 }}>Pilates, physio, psychology, and specialist wellness have strong demand from the professional residential base. Several concepts have operated successfully on The Parade for 5+ years.</p>
              </div>
          </div>
        </section>

        {/* Key risks */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, color: S.n900 }}>Key Risks</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: '13px 16px' }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#92400E', marginBottom: 3 }}>Parking competition on peak days</p>
                <p style={{ fontSize: 12, color: '#78350F', lineHeight: 1.6 }}>The Parade draws from a wide catchment. Saturday parking is competitive and can deter some visitors. Businesses relying heavily on Saturday trade need to factor in a percentage of lost visits due to parking friction.</p>
              </div>
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: '13px 16px' }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#92400E', marginBottom: 3 }}>High community standards</p>
                <p style={{ fontSize: 12, color: '#78350F', lineHeight: 1.6 }}>The Norwood residential community is engaged and opinionated. A concept that doesn't fit the strip's character or generates noise, waste, or delivery friction will face pushback from the community association.</p>
              </div>
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: '13px 16px' }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#92400E', marginBottom: 3 }}>Competition from Unley and Hyde Park</p>
                <p style={{ fontSize: 12, color: '#78350F', lineHeight: 1.6 }}>The King William Road corridor is strengthening as a dining destination. Some spending that previously concentrated in Norwood is now distributed across the inner-east and inner-south strips.</p>
              </div>
          </div>
        </section>

        {/* Compare nearby */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16, color: S.n900 }}>Compare Nearby Suburbs</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14 }}>
              <a href="/analyse/adelaide/unley" style={{ textDecoration: 'none' }}>
                <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: '14px 16px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: S.n900 }}>Unley</span>
                    <VerdictBadge v="GO" />
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: S.brand }}>84</div>
                  <div style={{ fontSize: 11, color: S.muted, marginTop: 2 }}>King William Rd · strong</div>
                </div>
              </a>
              <a href="/analyse/adelaide/burnside" style={{ textDecoration: 'none' }}>
                <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: '14px 16px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: S.n900 }}>Burnside</span>
                    <VerdictBadge v="GO" />
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: S.brand }}>73</div>
                  <div style={{ fontSize: 11, color: S.muted, marginTop: 2 }}>Eastern premium</div>
                </div>
              </a>
              <a href="/analyse/adelaide/hyde-park" style={{ textDecoration: 'none' }}>
                <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: '14px 16px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: S.n900 }}>Hyde Park</span>
                    <VerdictBadge v="GO" />
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: S.brand }}>75</div>
                  <div style={{ fontSize: 11, color: S.muted, marginTop: 2 }}>KWR south · growing</div>
                </div>
              </a>
          </div>
        </section>

        {/* Poll */}
        <SuburbPoll suburb="Norwood" votes={[45, 26, 15, 10, 4]} />

        {/* Final verdict */}
        <section style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: 24, marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <VerdictBadge v="GO" />
            <h2 style={{ fontSize: 16, fontWeight: 800, color: S.n900 }}>Final Verdict: Norwood</h2>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: S.muted, marginBottom: 10 }}>Norwood is Adelaide's strongest suburb for independent business operators — the combination of demographic quality, foot traffic consistency, manageable rents, and community culture that actively supports independent concepts is rare at this level anywhere in Australia.</p>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: S.muted, marginBottom: 10 }}>The bar for success here is high because competition is genuine and customers are experienced. But operators who meet that bar — with clear concepts, genuine quality, and real engagement with the Norwood community — build businesses here that last. The Parade has independents that have been trading for 10–20+ years. That tenure is the most meaningful evidence a commercial strip can offer.</p>
        </section>

        {/* FAQ */}
        <section style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: 24, marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: S.n900, marginBottom: 20 }}>Frequently Asked Questions</h2>
              <details style={{ borderBottom: `1px solid ${S.border}`, paddingBottom: 12, marginBottom: 12 }}>
                <summary style={{ fontSize: 13, fontWeight: 700, color: S.n900, cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  Is The Parade in Norwood the best place to open a café in Adelaide? <span style={{ color: S.brand }}>+</span>
                </summary>
                <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.7, marginTop: 10 }}>By the numbers, yes — it scores highest among all Adelaide commercial strips for the combination of foot traffic, demographics, rent viability, and competition gap. The main consideration is that it is competitive, and a generic concept will struggle. A café with clear specialty positioning, genuine quality, and a specific cuisine or coffee identity has a strong chance of building a loyal following quickly.</p>
              </details>
              <details style={{ borderBottom: `1px solid ${S.border}`, paddingBottom: 12, marginBottom: 12 }}>
                <summary style={{ fontSize: 13, fontWeight: 700, color: S.n900, cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  What types of business do best on The Parade? <span style={{ color: S.brand }}>+</span>
                </summary>
                <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.7, marginTop: 10 }}>Premium independent hospitality (café, bar, restaurant), specialty retail (not chains), allied health and wellness, and professional services with community presence. The Parade demographic has high discretionary spend and actively supports quality independents over chains.</p>
              </details>
              <details style={{ borderBottom: `1px solid ${S.border}`, paddingBottom: 12, marginBottom: 12 }}>
                <summary style={{ fontSize: 13, fontWeight: 700, color: S.n900, cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  How do Norwood rents compare to Melbourne equivalents? <span style={{ color: S.brand }}>+</span>
                </summary>
                <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.7, marginTop: 10 }}>Meaningfully lower. A prime Norwood Parade position at $6,000–$7,500/month would cost $12,000–$20,000 on a comparable-traffic Melbourne strip like Brunswick or Fitzroy. Adelaide's lower rents combined with a genuinely high-income demographic produce better margin economics for well-run operations.</p>
              </details>
        </section>

        {/* CTA */}
        <div style={{ background: 'linear-gradient(135deg, #0F766E 0%, #0B5E57 100%)', borderRadius: 14, padding: '44px 40px', textAlign: 'center', marginBottom: 44 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#FFFFFF', marginBottom: 10 }}>Analyse Your Norwood Address</h2>
          <p style={{ fontSize: 14, color: 'rgba(167,243,208,0.8)', marginBottom: 24, maxWidth: 440, margin: '0 auto 24px', lineHeight: 1.7 }}>
            Get a full GO/CAUTION/NO verdict with competitor map, financial model and 3-year projection for your specific address in Norwood. First report free.
          </p>
          <Link href="/onboarding" style={{ background: '#FFFFFF', color: '#0F766E', borderRadius: 10, padding: '14px 32px', fontSize: 15, fontWeight: 800, textDecoration: 'none', display: 'inline-block' }}>
            Start Free Analysis →
          </Link>
        </div>

        {/* Footer nav */}
        <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 24, display: 'flex', gap: 12, justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Link href="/analyse/adelaide" style={{ fontSize: 13, fontWeight: 700, color: S.brand, textDecoration: 'none' }}>← Back to Adelaide</Link>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {[{ slug: "unley", name: "Unley" }, { slug: "burnside", name: "Burnside" }, { slug: "hyde-park", name: "Hyde Park" }].map(n => (
              <Link key={n.slug} href={`/analyse/adelaide/${n.slug}`} style={{ fontSize: 13, fontWeight: 700, color: S.brand, textDecoration: 'none' }}>{n.name}</Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
