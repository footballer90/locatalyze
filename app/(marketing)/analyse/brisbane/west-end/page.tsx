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
      <p style={{ fontSize: 13, color: S.muted, marginBottom: 20, margin: '0 0 20px 0' }}>Based on what you've read above.</p>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
        {opts.map((opt, i) => {
          const pct = Math.round((votes[i] / total) * 100)
          return (
            <button key={i} onClick={() => cast(i)} disabled={voted !== null}
              style={{ position: 'relative', border: `1.5px solid ${voted === i ? S.emeraldBdr : S.border}`, borderRadius: 10, padding: '12px 16px', background: S.white, cursor: voted === null ? 'pointer' : 'default', textAlign: : "left' as const, fontFamily: 'inherit", overflow: 'hidden' }}>
              {voted !== null && (
                <div style={{ position: 'absolute', inset: 0, width: `${pct}%`, background: 'rgba(8,145,178,0.07)', transition: 'width 0.4s ease' }} />
              )}
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
          <p style={{ fontSize: 13, color: '#047857', margin: 0 }}>
            Ready to run a full location analysis for {suburb}?{' '}
            <Link href="/onboarding" style={{ fontWeight: 700, textDecoration: 'underline', color: '#047857' }}>Analyse free →</Link>
          </p>
        </div>
      )}
    </div>
  )
}

const SCHEMAS = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'West End Business Location Analysis 2026 — Locatalyze',
    description: "Brisbane's Fitzroy. Boundary Street has a genuine independent hospitality culture built over two decades — not manufactured character but the real thing. Educated demographics, community loyalty to local operators, and rents that still work for quality concepts.",
    datePublished: '2026-04-01',
    dateModified: '2026-04-12',
    author: { '@type': 'Organization', name: 'Locatalyze', url: 'https://locatalyze.com' },
    publisher: { '@type': 'Organization', name: 'Locatalyze' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
    {
      '@type': 'Question',
      name: 'What is West End Brisbane known for commercially?',
      acceptedAnswer: { '@type': 'Answer', text: "Boundary Street is Brisbane's premier independent hospitality strip — 30 years of café, restaurant, and bar culture built by owner-operators rather than chains. The demographic (educated, 25–45, high discretionary spend) actively supports independent operators. It is the commercial precinct that most closely resembles Melbourne's Fitzroy or Sydney's Newtown." },
    },
    {
      '@type': 'Question',
      name: 'What rent should I expect in West End Brisbane?',
      acceptedAnswer: { '@type': 'Answer', text: 'Boundary Street prime positions: $6,000–$9,000/month. Secondary Vulture Street positions: $3,500–$5,500/month. Off-strip Boggo Road and Montague Road: $2,500–$4,500/month. Incentives (rent-free periods, fit-out contributions) are available in current market conditions — negotiate before signing.' },
    },
    {
      '@type': 'Question',
      name: 'Is West End oversaturated for cafés?',
      acceptedAnswer: { '@type': 'Answer', text: 'For generic cafés, yes — the strip has strong existing operators with deep community loyalty. For differentiated concepts (specialty roaster, distinct food program, wellness café), the market can absorb new quality entrants. The key is a genuine point of difference that gives the West End community a reason to switch from their existing loyalty.' },
    },
    ],
  },
]

export default function WestEndPage() {
  return (
    <div style={{ minHeight: '100vh', background: S.n50, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {SCHEMAS.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}

      {/* Sticky nav */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: S.white, borderBottom: `1px solid ${S.border}`, padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/analyse/brisbane" style={{ fontSize: 13, fontWeight: 600, color: S.brand, textDecoration: 'none' }}>← Brisbane</Link>
        <Link href="/onboarding" style={{ fontSize: 13, fontWeight: 700, color: S.white, background: S.brand, padding: '8px 18px', borderRadius: 7, textDecoration: 'none' }}>Analyse free →</Link>
      </div>

      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, #0891B2 0%, #0369A1 100%)`, padding: '56px 24px 48px', color: S.white }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 16, textTransform: : "uppercase' as const, letterSpacing: '0.08em" }}>
            <Link href="/analyse" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Analyse</Link>
            {' / '}
            <Link href="/analyse/brisbane" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Brisbane</Link>
            {' / '}
            West End
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 900, margin: '0 0 12px 0', lineHeight: 1.15 }}>
            West End
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.7, opacity: 0.9, margin: '0 0 28px 0', maxWidth: 620 }}>
            Brisbane's Fitzroy. Boundary Street has a genuine independent hospitality culture built over two decades — not manufactured character but the real thing. Educated demographics, community loyalty to local operators, and rents that still work for quality concepts.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' as const }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '16px 24px', textAlign: 'center' as const }}>
              <div style={{ fontSize: 36, fontWeight: 900, lineHeight: 1 }}>85</div>
              <div style={{ fontSize: 11, opacity: 0.8, marginTop: 4 }}>Overall Score</div>
            </div>
            <div>
              <VerdictBadge v="GO" />
              <div style={{ fontSize: 12, opacity: 0.75, marginTop: 8 }}>QLD 4101 • Revenue potential $40K–$90K/mo</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px' }}>

        {/* Score card */}
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginTop: 32, marginBottom: 40 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 24px 0' }}>Location Scores</h2>
          <ScoreBar label='Foot Traffic' value={84} />
          <ScoreBar label='Demographics' value={83} />
          <ScoreBar label='Rent Viability' value={78} />
          <ScoreBar label='Competition Gap' value={82} />
        </div>

        {/* Business environment */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 20px 0' }}>Business Environment</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>West End is the suburb that Brisbane hospitality operators point to when they want to prove Brisbane can do what Melbourne does. Boundary Street from Vulture Street to Montague Road has accumulated 30 years of independent operator culture — venues that have survived multiple economic cycles, built genuine community loyalty, and created a street character that is the product of authentic decisions rather than precinct branding. The customers here are not tourists or passing foot traffic. They are residents who walk from home, regulars who have been coming to the same café for a decade, and a community that actively chooses independent over chain as a point of identity.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>The demographic profile of West End is one of the most commercially advantageous in Queensland. Median household income sits at approximately $88,000 — above Brisbane average but not stratospheric. More importantly, the income composition skews toward younger professionals, creative industry workers, academics from nearby universities, and established residents who have maintained spending habits through successive economic cycles. This demographic spends on food, culture, and experience at rates significantly above what income alone would predict. The West End customer is not value-hunting — they are quality-seeking.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>West End rents at $5,000–$9,000/month on Boundary Street prime positions represent the upper range for the suburb, with secondary Vulture Street and Boggo Road positions available from $3,000. These are still materially lower than equivalent strips in Melbourne's inner north or Sydney's inner west. An operator running a 60-seat café or small restaurant on Boundary Street with average spend of $28 and 80 covers daily reaches $67,200 monthly revenue — at $8,000/month rent, occupancy cost is 12%. That arithmetic works. The same concept in Surry Hills at $12,000 rent faces a 17% occupancy cost on the same revenue. The West End margin advantage is structural.</p>
          </div>
        </div>

        {/* Competition */}
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 16px 0' }}>Competition Analysis</h2>
          <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>West End competition is real and established. Boundary Street has been occupied by quality operators for decades — Gunshop Café, Gauge, Burrito Bar are institutions that have customer loyalty that new entrants cannot replicate immediately. The competitive gap is not in café or casual dining (both are well-served) but in underexplored categories: specialty wine and natural wine bars, premium wellness and personal training, quality retail with a distinct concept, and mid-price dinner dining (the strip's weakness relative to its lunch trade). Healthcare and allied health are also underserved relative to the demographic.</p>
        </div>

        {/* What works */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 20px 0' }}>What Works Here</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Specialty Café (Differentiated Concept)</h3>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, margin: 0 }}>West End rewards differentiation. A café with a roasting program, specialty origin coffee, or distinct food concept attracts loyal West End regulars who are bored of generic offerings. Revenue $50,000–$75,000/month for a well-positioned 40-seat operator with strong weekend brunch trade.</p>
            </div>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Evening Dining — Wine and Small Plates</h3>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, margin: 0 }}>The West End evening market is underserved relative to its lunch dominance. A natural wine bar or quality small-plates restaurant fills a gap that the current operator mix doesn't fully address. Revenue $45,000–$70,000/month for a venue with strong Thursday–Sunday evening trade.</p>
            </div>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Allied Health (Physio, Psychology, Yoga)</h3>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, margin: 0 }}>West End's professional and creative demographic has above-average demand for allied health and wellness services. Yoga studios, physiotherapy, and psychology practices find strong referral networks and loyal clientele. Revenue $40,000–$65,000/month for a well-positioned allied health practice.</p>
            </div>
          </div>
        </div>

        {/* Key risks */}
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 20px 0' }}>Key Risks</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 20 }}>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.amber}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px 0' }}>Established Operator Loyalty</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>West End regulars are loyal to incumbents. New entrants take longer to establish than in suburbs with less embedded operator culture. Budget for a 9–12 month establishment period before revenue stabilises.</p>
            </div>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.amber}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px 0' }}>Limited Vacancy</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>Quality Boundary Street tenancies move quickly. Operators waiting for the perfect position may wait 18+ months. Secondary streets (Vulture, Montague) offer faster entry at lower rent but with lower foot traffic.</p>
            </div>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.amber}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px 0' }}>Parking Constraints</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>West End has limited parking, which deters some demographics. The residential walk-in customer is strong; the car-dependent outer-suburbs customer is harder to reach. Concepts requiring destination-drive customer acquisition face access constraints.</p>
            </div>
          </div>
        </div>

        {/* Nearby suburbs */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 20px 0' }}>Compare Nearby Suburbs</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <Link href="/analyse/brisbane/south-brisbane" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 16, cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = S.brand)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = S.border)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>South Brisbane</h4>
                  <VerdictBadge v="GO" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: S.brand }}>74</div>
                <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>1.5km, cultural precinct</div>
              </div>
            </Link>
            <Link href="/analyse/brisbane/woolloongabba" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 16, cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = S.brand)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = S.border)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Woolloongabba</h4>
                  <VerdictBadge v="GO" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: S.brand }}>79</div>
                <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>2km, growth trajectory</div>
              </div>
            </Link>
            <Link href="/analyse/brisbane/annerley" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 16, cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = S.brand)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = S.border)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Annerley</h4>
                  <VerdictBadge v="GO" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: S.brand }}>70</div>
                <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>3km south, value play</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Poll */}
        <SuburbPoll suburb="West End" votes={[62, 25, 13]} />

        {/* Final verdict */}
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 20px 0' }}>Final Verdict</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>West End is one of Queensland's strongest commercial locations for independent operators with quality concepts. The economics work, the demographics are right, and the community actively supports independent businesses. A score of 85 reflects both the genuine quality of the market and the reality that competition is meaningful — this is not an empty strip waiting to be filled.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>The error operators make in West End is underestimating how long it takes to earn community loyalty in a suburb where existing operators have 10-year relationships with their customers. The first six months require sustained quality, visible community engagement, and patience with below-forecast revenue while trust is built. Operators who approach West End with that understanding build durable businesses here. Those who expect immediate demand based on demographics alone are typically disappointed by slower establishment than projected.</p>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px 0' }}>Frequently Asked Questions</h2>
          <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 20, marginTop: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 8px 0' }}>What is West End Brisbane known for commercially?</h3>
            <p style={{ fontSize: 13, color: S.n900, lineHeight: 1.7, margin: 0 }}>Boundary Street is Brisbane's premier independent hospitality strip — 30 years of café, restaurant, and bar culture built by owner-operators rather than chains. The demographic (educated, 25–45, high discretionary spend) actively supports independent operators. It is the commercial precinct that most closely resembles Melbourne's Fitzroy or Sydney's Newtown.</p>
          </div>
          <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 20, marginTop: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 8px 0' }}>What rent should I expect in West End Brisbane?</h3>
            <p style={{ fontSize: 13, color: S.n900, lineHeight: 1.7, margin: 0 }}>Boundary Street prime positions: $6,000–$9,000/month. Secondary Vulture Street positions: $3,500–$5,500/month. Off-strip Boggo Road and Montague Road: $2,500–$4,500/month. Incentives (rent-free periods, fit-out contributions) are available in current market conditions — negotiate before signing.</p>
          </div>
          <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 20, marginTop: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 8px 0' }}>Is West End oversaturated for cafés?</h3>
            <p style={{ fontSize: 13, color: S.n900, lineHeight: 1.7, margin: 0 }}>For generic cafés, yes — the strip has strong existing operators with deep community loyalty. For differentiated concepts (specialty roaster, distinct food program, wellness café), the market can absorb new quality entrants. The key is a genuine point of difference that gives the West End community a reason to switch from their existing loyalty.</p>
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: `linear-gradient(135deg, #059669 0%, #047857 100%)`, borderRadius: 16, padding: '40px 32px', marginBottom: 48, textAlign: 'center' as const }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: S.white, margin: '0 0 10px 0' }}>Ready to analyse your West End location?</h3>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', margin: '0 0 24px 0' }}>Get foot traffic, competition, demographics, and a GO/CAUTION/NO verdict for your specific address.</p>
          <Link href="/onboarding" style={{ display: 'inline-block', background: S.white, color: '#059669', padding: '13px 28px', borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>Analyse your address →</Link>
        </div>

        {/* Footer nav */}
        <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 32, paddingBottom: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' as const, gap: 12 }}>
          <Link href="/analyse/brisbane" style={{ fontSize: 13, fontWeight: 600, color: S.brand, textDecoration: 'none' }}>← Back to Brisbane</Link>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' as const }}>
            {/* nearby links */}
          </div>
        </div>

      </div>
    </div>
  )
}
