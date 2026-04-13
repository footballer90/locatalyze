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
  const cfg: Record<Verdict, { bg: string; bdr: string; txt: string; label: string }> = {
    GO: { bg: S.emeraldBg, bdr: S.emeraldBdr, txt: S.emerald, label: 'GO' },
    CAUTION: { bg: S.amberBg, bdr: S.amberBdr, txt: S.amber, label: 'CAUTION' },
    NO: { bg: S.redBg, bdr: S.redBdr, txt: S.red, label: 'NO' },
  }
  const c = cfg[v]
  return (
    <span style={{ fontSize: 11, fontWeight: 700, color: c.txt, background: c.bg, border: `1px solid ${c.bdr}`, borderRadius: 6, padding: '3px 10px', letterSpacing: '0.04em' }}>
      {c.label}
    </span>
  )
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: S.n900 }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: S.brand }}>{value}/100</span>
      </div>
      <div style={{ height: 7, background: S.border, borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${value}%`, background: S.brand, borderRadius: 4 }} />
      </div>
    </div>
  )
}

function SuburbPoll({ suburb, votes: initVotes }: { suburb: string; votes: number[] }) {
  const [voted, setVoted] = useState<number | null>(null)
  const [votes, setVotes] = useState(initVotes)
  const total = votes.reduce((a, b) => a + b, 0)
  function cast(i: number) {
    if (voted !== null) return
    setVoted(i)
    setVotes(prev => prev.map((v, idx) => idx === i ? v + 1 : v))
  }
  const opts = ['Yes — I would open here', 'Maybe — needs more research', 'No — wrong market for me']
  return (
    <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
      <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 6, color: S.n900 }}>Would you open a business in {suburb}?</h3>
      <p style={{ fontSize: 13, color: S.muted, margin: '0 0 20px 0' }}>Based on what you've read above.</p>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
        {opts.map((opt, i) => {
          const pct = Math.round((votes[i] / total) * 100)
          return (
            <button key={i} onClick={() => cast(i)} disabled={voted !== null}
              style={{ position: 'relative', border: `1.5px solid ${voted === i ? S.emeraldBdr : S.border}`, borderRadius: 10, padding: '12px 16px', background: S.white, cursor: voted === null ? 'pointer' : 'default', textAlign: : "left' as const, fontFamily: 'inherit", overflow: 'hidden' }}>
              {voted !== null && <div style={{ position: 'absolute', inset: 0, width: `${pct}%`, background: 'rgba(8,145,178,0.07)', transition: 'width 0.4s ease' }} />}
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: S.n900 }}>{opt}</span>
                {voted !== null && <span style={{ fontSize: 12, color: S.brand, fontWeight: 700 }}>{pct}%</span>}
              </div>
            </button>
          )
        })}
      </div>
      {voted !== null && (
        <div style={{ marginTop: 16, padding: '12px 16px', background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 10 }}>
          <p style={{ fontSize: 13, color: '#047857', margin: 0 }}>Ready to run a full location analysis for {suburb}?{' '}<Link href="/onboarding" style={{ fontWeight: 700, textDecoration: 'underline', color: '#047857' }}>Analyse free →</Link></p>
        </div>
      )}
    </div>
  )
}

const SCHEMAS = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Paddington Business Location Analysis 2026 — Locatalyze',
    description: "Queensland's benchmark for independent hospitality. Given Terrace produces more successful independent businesses per square metre than anywhere else in the state. The community actively chooses local over chain — and pays premium prices for quality.",
    datePublished: '2026-04-01',
    dateModified: '2026-04-12',
    author: { '@type': 'Organization', name: 'Locatalyze', url: 'https://locatalyze.com' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
    {
      '@type': 'Question',
      name: "What makes Paddington Brisbane's best commercial suburb?",
      acceptedAnswer: { '@type': 'Answer', text: 'Three factors: demographic quality (median household income ~$105,000, professional and creative concentration), community loyalty (residents actively choose independent operators over chains as a point of identity), and an established culture of quality-seeking hospitality customers who return consistently. The combination creates a market that is uniquely forgiving of premium pricing and uniquely rewarding of quality execution.' },
    },
    {
      '@type': 'Question',
      name: 'What is the commercial rent on Given Terrace?',
      acceptedAnswer: { '@type': 'Answer', text: 'Prime Given Terrace positions: $5,500–$8,000/month. Secondary Given Terrace positions: $4,000–$6,000/month. Off-street Latrobe Terrace and Enoggera Terrace: $2,500–$4,500/month. Paddington rents are justified by the demographic quality but require revenue modelling before committing.' },
    },
    {
      '@type': 'Question',
      name: 'Is Paddington oversaturated?',
      acceptedAnswer: { '@type': 'Answer', text: 'Not by Brisbane standards — but it has established operators with deep community loyalty. The saturation question is category-specific: café and casual dining have strong incumbents; evening dining and premium wellness have competitive gaps. A new entrant with differentiation finds room; a generic concept taking on established loyalty does not.' },
    },
    ],
  },
]

export default function PaddingtonPage() {
  return (
    <div style={{ minHeight: '100vh', background: S.n50, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {SCHEMAS.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: S.white, borderBottom: `1px solid ${S.border}`, padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/analyse/brisbane" style={{ fontSize: 13, fontWeight: 600, color: S.brand, textDecoration: 'none' }}>← Brisbane</Link>
        <Link href="/onboarding" style={{ fontSize: 13, fontWeight: 700, color: S.white, background: S.brand, padding: '8px 18px', borderRadius: 7, textDecoration: 'none' }}>Analyse free →</Link>
      </div>
      <div style={{ background: `linear-gradient(135deg, #0891B2 0%, #0369A1 100%)`, padding: '56px 24px 48px', color: S.white }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 16, textTransform: : "uppercase' as const, letterSpacing: '0.08em" }}>
            <Link href="/analyse" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Analyse</Link>{' / '}
            <Link href="/analyse/brisbane" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Brisbane</Link>{' / '}Paddington
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 900, margin: '0 0 12px 0', lineHeight: 1.15 }}>Paddington</h1>
          <p style={{ fontSize: 16, lineHeight: 1.7, opacity: 0.9, margin: '0 0 28px 0', maxWidth: 620 }}>Queensland's benchmark for independent hospitality. Given Terrace produces more successful independent businesses per square metre than anywhere else in the state. The community actively chooses local over chain — and pays premium prices for quality.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' as const }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '16px 24px', textAlign: 'center' as const }}>
              <div style={{ fontSize: 36, fontWeight: 900, lineHeight: 1 }}>87</div>
              <div style={{ fontSize: 11, opacity: 0.8, marginTop: 4 }}>Overall Score</div>
            </div>
            <div>
              <VerdictBadge v="GO" />
              <div style={{ fontSize: 12, opacity: 0.75, marginTop: 8 }}>QLD 4064 • Revenue potential $45K–$95K/mo</div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginTop: 32, marginBottom: 40 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 24px 0' }}>Location Scores</h2>
          <ScoreBar label='Foot Traffic' value={86} />
          <ScoreBar label='Demographics' value={87} />
          <ScoreBar label='Rent Viability' value={80} />
          <ScoreBar label='Competition Gap' value={84} />
        </div>
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 20px 0' }}>Business Environment</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Given Terrace is the commercial strip that defines the ceiling of Queensland independent hospitality. Five venues on a 600-metre stretch that can credibly hold their own against Melbourne's inner north or Sydney's Surry Hills. The demographic that shops and eats on Given Terrace — educated professionals, design and creative industry workers, families with established income — actively supports independent operators as a point of identity. They chose Paddington to live in because it isn't the CBD. Their commercial choices reflect the same values. This creates a loyalty pattern that chains cannot replicate by outspending: the Paddington customer chooses independent on principle.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>The commercial concentration on Given Terrace from Caxton Street to Latrobe Terrace is tight. Not many tenancies. When a Given Terrace position comes available, it typically generates multiple inquiries within weeks. Operators who are serious about Paddington need to move decisively when tenancies come up — the vacancy window is short and landlords have pricing power. Off-street secondary positions (Latrobe Terrace, Enoggera Terrace) exist at lower rent but with materially lower foot traffic and walk-in customer access.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Paddington's demographic income profile is among the strongest in Queensland outside of Hamilton and Ascot. Median household income approaches $105,000 — placing it in the top 5% of Queensland suburbs. Average spend per visit in Paddington hospitality is above the Brisbane inner-ring average. Customers budget for quality, make deliberate choices, and return for experiences that meet their standards. This is the market where premium pricing works because the customer expects and values the premium.</p>
          </div>
        </div>
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 16px 0' }}>Competition Analysis</h2>
          <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Given Terrace competition is established and quality-focused. Landmark operators (Taro's Fish and Chips, cafe institutions that have been trading for decades) hold positions with loyal customer bases that new entrants must work around rather than displace. The competitive gap is in specific categories: quality evening dining (the Terrace is stronger at lunch and café than at dinner), premium wellness and fitness (strong demographic demand, limited quality operators), and retail concepts with genuine lifestyle positioning. Generic café opening on Given Terrace against established operators will have a difficult two years. Differentiated concept with a clear offering will find an audience.</p>
        </div>
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 20px 0' }}>What Works Here</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Premium Breakfast and Brunch Café</h3>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, margin: 0 }}>The Given Terrace Saturday morning is Paddington's commercial peak. A quality café with outdoor seating, specialty coffee program, and a serious brunch menu can achieve $60,000–$95,000/month. The demographic pays for quality and returns consistently. Revenue is less seasonal than coastal suburbs.</p>
            </div>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Evening Dining — Mid to Premium</h3>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, margin: 0 }}>Paddington's dinner market is underserved relative to its lunch and café strength. A 40-seat restaurant at $70–$90 per head with strong Thursday–Saturday evening trade finds immediate demand from residents who currently drive to New Farm or South Brisbane for quality dinner. Revenue $55,000–$85,000/month.</p>
            </div>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Premium Wellness (Pilates, Yoga, Physio)</h3>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, margin: 0 }}>Paddington's professional demographic has above-average wellness spending habits. Boutique pilates and yoga studios with quality instruction and premium positioning find strong referral networks and loyal clientele from the surrounding residential catchment. Revenue $45,000–$70,000/month.</p>
            </div>
          </div>
        </div>
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 20px 0' }}>Key Risks</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 20 }}>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.amber}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px 0' }}>Limited Vacancy</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>Given Terrace tenancies are rare. Operators may wait 12–18 months for the right position. Off-strip alternatives exist but at materially lower foot traffic.</p>
            </div>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.amber}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px 0' }}>High Community Standards</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>Paddington customers are experienced and quality-discerning. Below-standard product or service is communicated immediately through word-of-mouth and online reviews. There is less tolerance for a 'getting started' phase here than in outer-ring suburbs.</p>
            </div>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.amber}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px 0' }}>Parking Limited for Drive-In Customers</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>Given Terrace parking is constrained. The suburb's commercial strength is residential walk-in, not drive-from-afar destination. Concepts requiring large geographic catchment to generate sufficient volume face access constraints.</p>
            </div>
          </div>
        </div>
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 20px 0' }}>Compare Nearby Suburbs</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <Link href="/analyse/brisbane/west-end" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 16, cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = S.brand)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = S.border)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>West End</h4>
                  <VerdictBadge v="GO" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: S.brand }}>85</div>
                <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>3km south, comparable culture</div>
              </div>
            </Link>
            <Link href="/analyse/brisbane/new-farm" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 16, cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = S.brand)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = S.border)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>New Farm</h4>
                  <VerdictBadge v="GO" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: S.brand }}>80</div>
                <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>3km east, riverfront premium</div>
              </div>
            </Link>
            <Link href="/analyse/brisbane/toowong" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 16, cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = S.brand)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = S.border)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Toowong</h4>
                  <VerdictBadge v="GO" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: S.brand }}>73</div>
                <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>3km west, university gateway</div>
              </div>
            </Link>
          </div>
        </div>
        <SuburbPoll suburb="Paddington" votes={[68, 22, 10]} />
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 20px 0' }}>Final Verdict</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Paddington is Queensland's highest-scoring commercial location and deserves the score. The combination of exceptional demographics, genuine community loyalty to independent operators, and an established culture of quality-seeking hospitality customers creates a market that rewards operators who meet its standards. The score of 87 is not promotional — it reflects real market conditions.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>The constraint is vacancy. Operators who want Paddington must be prepared to move quickly when positions come available and to pay competitive rent for prime positions. The alternative is patience with a secondary position at lower rent while building customer base. Either strategy can work — but both require the quality of product that the Paddington customer demands. Average is not sufficient here.</p>
          </div>
        </div>
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px 0' }}>Frequently Asked Questions</h2>
          <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 20, marginTop: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 8px 0' }}>What makes Paddington Brisbane's best commercial suburb?</h3>
            <p style={{ fontSize: 13, color: S.n900, lineHeight: 1.7, margin: 0 }}>Three factors: demographic quality (median household income ~$105,000, professional and creative concentration), community loyalty (residents actively choose independent operators over chains as a point of identity), and an established culture of quality-seeking hospitality customers who return consistently. The combination creates a market that is uniquely forgiving of premium pricing and uniquely rewarding of quality execution.</p>
          </div>
          <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 20, marginTop: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 8px 0' }}>What is the commercial rent on Given Terrace?</h3>
            <p style={{ fontSize: 13, color: S.n900, lineHeight: 1.7, margin: 0 }}>Prime Given Terrace positions: $5,500–$8,000/month. Secondary Given Terrace positions: $4,000–$6,000/month. Off-street Latrobe Terrace and Enoggera Terrace: $2,500–$4,500/month. Paddington rents are justified by the demographic quality but require revenue modelling before committing.</p>
          </div>
          <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 20, marginTop: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 8px 0' }}>Is Paddington oversaturated?</h3>
            <p style={{ fontSize: 13, color: S.n900, lineHeight: 1.7, margin: 0 }}>Not by Brisbane standards — but it has established operators with deep community loyalty. The saturation question is category-specific: café and casual dining have strong incumbents; evening dining and premium wellness have competitive gaps. A new entrant with differentiation finds room; a generic concept taking on established loyalty does not.</p>
          </div>
        </div>
        <div style={{ background: `linear-gradient(135deg, #059669 0%, #047857 100%)`, borderRadius: 16, padding: '40px 32px', marginBottom: 48, textAlign: 'center' as const }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: S.white, margin: '0 0 10px 0' }}>Ready to analyse your Paddington location?</h3>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', margin: '0 0 24px 0' }}>Get foot traffic, competition, demographics, and a GO/CAUTION/NO verdict for your specific address.</p>
          <Link href="/onboarding" style={{ display: 'inline-block', background: S.white, color: '#059669', padding: '13px 28px', borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>Analyse your address →</Link>
        </div>
        <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 32, paddingBottom: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' as const, gap: 12 }}>
          <Link href="/analyse/brisbane" style={{ fontSize: 13, fontWeight: 600, color: S.brand, textDecoration: 'none' }}>← Back to Brisbane</Link>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' as const }}>
            <Link href="/analyse/brisbane/west-end" style={{ fontSize: 13, color: S.brand, textDecoration: 'none' }}>West End</Link> <Link href="/analyse/brisbane/new-farm" style={{ fontSize: 13, color: S.brand, textDecoration: 'none' }}>New Farm</Link> <Link href="/analyse/brisbane/toowong" style={{ fontSize: 13, color: S.brand, textDecoration: 'none' }}>Toowong</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
