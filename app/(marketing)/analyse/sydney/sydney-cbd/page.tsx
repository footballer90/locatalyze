'use client'

import Link from 'next/link'
import { useState } from 'react'

const S = {
  brand: '#0891B2',
  brandLight: '#06B6D4',
  emerald: '#059669',
  emeraldBg: '#ECFDF5',
  emeraldBdr: '#A7F3D0',
  amber: '#D97706',
  amberBg: '#FFFBEB',
  amberBdr: '#FDE68A',
  red: '#DC2626',
  redBg: '#FEF2F2',
  redBdr: '#FECACA',
  muted: '#64748B',
  border: '#E2E8F0',
  n50: '#FAFAF9',
  n100: '#F5F5F4',
  n900: '#1C1917',
  white: '#FFFFFF',
}

type Verdict = 'GO' | 'CAUTION' | 'NO'

function VerdictBadge({ v }: { v: Verdict }) {
  const styles: Record<Verdict, { bg: string; color: string; text: string }> = {
    GO: { bg: S.emeraldBg, color: S.emerald, text: 'GO' },
    CAUTION: { bg: S.amberBg, color: S.amber, text: 'CAUTION' },
    NO: { bg: S.redBg, color: S.red, text: 'NO' },
  }
  const style = styles[v]
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: '600',
        backgroundColor: style.bg,
        color: style.color,
        border: `1px solid ${style.color}`,
      }}
    >
      {style.text}
    </span>
  )
}

interface ScoreBarProps {
  label: string
  value: number
}

function ScoreBar({ label, value }: ScoreBarProps) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontSize: '14px', fontWeight: '600', color: S.n900 }}>{label}</span>
        <span style={{ fontSize: '14px', fontWeight: '700', color: S.brand }}>{value}/100</span>
      </div>
      <div style={{ width: '100%', height: '8px', backgroundColor: S.border, borderRadius: '4px', overflow: 'hidden' }}>
        <div
          style={{
            width: `${value}%`,
            height: '100%',
            backgroundColor: S.brand,
            transition: 'width 0.3s ease',
          }}
        />
      </div>
    </div>
  )
}

interface SuburbCardProps {
  name: string
  slug: string
  score: number
  verdict: Verdict
}

function SuburbCard({ name, slug, score, verdict }: SuburbCardProps) {
  return (
    <Link
      href={`/analyse/sydney/${slug}`}
      style={{
        display: 'block',
        padding: '16px',
        backgroundColor: S.white,
        borderRadius: '8px',
        border: `1px solid ${S.border}`,
        textDecoration: 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = S.brand
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(8, 145, 178, 0.1)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = S.border
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h4 style={{ fontSize: '14px', fontWeight: '600', color: S.n900, margin: 0 }}>{name}</h4>
        <span style={{ fontSize: '18px', fontWeight: '700', color: S.brand }}>{score}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <VerdictBadge v={verdict} />
        <span style={{ fontSize: '11px', color: S.brand, fontWeight: '600' }}>Compare →</span>
      </div>
    </Link>
  )
}

interface SuburbPollProps {
  suburb: string
}

function SuburbPoll({ suburb }: SuburbPollProps) {
  const [voted, setVoted] = useState<number | null>(null)
  const [votes, setVotes] = useState<number[]>([42, 28, 30])

  const handleVote = (index: number): void => {
    if (voted === null) {
      const newVotes = [...votes]
      newVotes[index]++
      setVotes(newVotes)
      setVoted(index)
    }
  }

  const total = votes.reduce((a, b) => a + b, 0)
  const options = ['Yes', 'Maybe', 'No']

  return (
    <div style={{ padding: '24px', backgroundColor: S.n50, borderRadius: '8px', border: `1px solid ${S.border}` }}>
      <h3 style={{ fontSize: '16px', fontWeight: '600', color: S.n900, marginBottom: '16px' }}>
        Would you open a business in {suburb}?
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
        {options.map((option, i) => (
          <div
            key={option}
            onClick={() => handleVote(i)}
            style={{
              padding: '12px',
              backgroundColor: S.white,
              borderRadius: '6px',
              border: voted === i ? `2px solid ${S.brand}` : `1px solid ${S.border}`,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (voted === null) {
                e.currentTarget.style.borderColor = S.brand
              }
            }}
            onMouseLeave={(e) => {
              if (voted === null) {
                e.currentTarget.style.borderColor = S.border
              }
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '14px', fontWeight: '600', color: S.n900 }}>{option}</span>
              <span style={{ fontSize: '12px', color: S.muted }}>
                {total > 0 ? `${Math.round((votes[i] / total) * 100)}%` : '0%'}
              </span>
            </div>
            <div style={{ width: '100%', height: '6px', backgroundColor: S.border, borderRadius: '3px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${total > 0 ? (votes[i] / total) * 100 : 0}%`,
                  height: '100%',
                  backgroundColor: i === 0 ? S.emerald : i === 1 ? S.amber : S.red,
                  transition: 'width 0.3s ease',
                }}
              /></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function SydneyCBDPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': ['Article', 'FAQPage'],
    headline: 'Sydney CBD Business Analysis: Rent, Foot Traffic, and Competition Guide',
    description: 'Deep analysis of Sydney CBD for business location. Rent economics, foot traffic data, demographics, and market fit for restaurants, retail, and services.',
    author: { '@type': 'Organization', name: 'Locatalyze' },
    datePublished: '2025-03-01',
    dateModified: '2026-03-24',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <nav
        style={{
          position: 'sticky',
          top: 0,
          backgroundColor: S.white,
          borderBottom: `1px solid ${S.border}`,
          zIndex: 40,
          padding: '12px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ fontSize: '16px', fontWeight: '700', color: S.brand }}>
          Locatalyze
        </div>
        <Link
          href="/onboarding"
          style={{
            padding: '8px 16px',
            backgroundColor: S.emerald,
            color: S.white,
            borderRadius: '6px',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '600',
          }}
        >
          Analyse free →
        </Link>
      </nav>

      <section
        style={{
          background: `linear-gradient(135deg, #0E7490 0%, ${S.brand} 50%, ${S.brandLight} 100%)`,
          color: S.white,
          padding: '48px 24px',
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px', opacity: 0.9 }}>
            Location Guides &gt; Sydney &gt; Sydney CBD
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <h1 style={{ fontSize: '36px', fontWeight: '700', margin: 0 }}>Sydney CBD</h1>
            <span style={{ fontSize: '32px', fontWeight: '700' }}>78</span>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <VerdictBadge v="CAUTION" />
          </div>
          <p style={{ fontSize: '16px', lineHeight: '1.6', opacity: 0.95, margin: 0 }}>
            Financial hub with premium foot traffic but severe rent economics. A volume game — you need 300+ customers daily to survive.
          </p>
        </div>
      </section>

      <section style={{ padding: '32px 24px', backgroundColor: S.n50 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ padding: '20px', borderRadius: '8px', border: `1px solid ${S.amber}`, backgroundColor: S.amberBg }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: S.amber, marginBottom: '8px', margin: 0 }}>
              Quick Verdict
            </h3>
            <p style={{ fontSize: '14px', color: S.n900, lineHeight: '1.6', margin: 0 }}>
              Sydney CBD delivers unmatched foot traffic (95/100) but rent economics are punishing. Retail spaces rent at $15,000–$38,000 monthly; hospitality at $12,000–$25,000. Only two operator types survive: (1) Premium high-ticket hospitality targeting finance workers, and (2) high-volume quick-service chains with efficient unit economics. For most small business operators, margins don't work here. If you need CBD presence, position yourself in fringe areas like Barangaroo or Chippendale, not the core.
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: S.n900 }}>
            Business Scores
          </h2>
          <ScoreBar label="Foot Traffic" value={95} />
          <ScoreBar label="Demographics" value={82} />
          <ScoreBar label="Rent Viability" value={38} />
          <ScoreBar label="Competition" value={89} />
        </div>
      </section>

      <section style={{ padding: '48px 24px', backgroundColor: S.n50 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: S.n900 }}>
            Business Environment
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', fontSize: '16px', lineHeight: '1.7', color: S.n900 }}>
            <p>
              Sydney CBD is fundamentally a financial district. The 35,000+ workers employed in banking, investment, and professional services converge on a 2km² footprint. This creates extraordinary foot traffic density — the highest in Sydney. But it also means the customer base is highly specific: professionals with limited time, high income, and specific preferences. A generic coffee concept fails; a premium café targeting $25+ average transaction succeeds. A mid-market restaurant dies; a 120-seat fine dining concept thrives.
            </p>
            <p>
              Hybrid work has permanently damaged CBD foot traffic. Post-COVID, office occupancy in the CBD sits at 65–70%, down from 95%+ pre-pandemic. This means lunch trade is no longer the reliable revenue engine it once was. Tuesday–Thursday drive most foot traffic; Monday and Friday are materially weaker. Operators who plan around a five-day revenue model are shocked to discover Monday and Friday generate only 60–70% of Tuesday–Thursday numbers. The lease agreement they signed assumes 100% occupancy economics.
            </p>
            <p>
              Retail rents are in full reset mode. Incentives from 2020–2022 (landlords offering 6–12 months free rent) are expiring. New tenancies are priced on zero concessions. A street-level retail space that rented for $12,000/mo in 2021 with 12 months free is re-signing at $16,000–18,000/mo in 2026 with zero incentives. That's a 50% real price increase, not accounting for CPI growth. Operators who renewed during the incentive period face severe sticker shock.
            </p>
            <p>
              Foot traffic concentrates in specific corridors: Martin Place, Barangaroo, QVB, and Pitt Street Mall. Try to operate two blocks away from these anchors and foot traffic drops 60%. The rent delta between a prime corner and a secondary location is 30–40%, but the foot traffic delta is much steeper. Location matters more in the CBD than anywhere else in Sydney.
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: S.n900 }}>
            Competition Analysis
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', fontSize: '16px', lineHeight: '1.7', color: S.n900 }}>
            <p>
              Competition in the CBD is intense and consolidating. Independent operators have been replaced by chains with significant capital backing. Specialty Coffee is dominated by franchises; quick-service is dominated by established brands. A single independent café trying to compete with Paramount, Two Hands, and Brunswick Aces is fighting a losing battle. The established players have volume discounts on supply, operational efficiency from 20+ locations, and marketing budgets. The only way an independent wins is through extreme differentiation — a concept that couldn't exist as a franchise because it's too idiosyncratic.
            </p>
            <p>
              Restaurant competition is similarly brutal. Every successful fine dining concept in the CBD is operated by an established hospitality group with 3+ venues. Quay, Aria, Mr. Wong — these are all operated by restaurant groups with institutional backing. Trying to open an independent fine dining restaurant in the CBD against these operators requires $500k+ in capital, exceptional culinary credentials, and connections with media/influencers. Most independent operators don't have these assets.
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 24px', backgroundColor: S.n50 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: S.n900 }}>
            Demographics & Spending Power
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', fontSize: '16px', lineHeight: '1.7', color: S.n900 }}>
            <p>
              Sydney CBD's working population has median income of $95,000–110,000, well above metropolitan average. But here's the catch: this is a transient population. Most CBD workers have 30–60 minute commutes. They don't live nearby. They arrive between 8:30–9:30am, work 9–5, and leave. Retail and hospitality footfall is heavily time-concentrated. Try to operate a concept that thrives on after-work hanging out (a casual bar, for example) and you'll discover the foot traffic drops 80% after 6pm. The worker demographic is optimized for lunch (11:30am–1:30pm) and coffee (8–9am). Nothing else.
            </p>
            <p>
              Tourist foot traffic adds meaningful volume but creates economic friction. Tourists are price-sensitive and they convert poorly for retail. A tourist will buy a $6 coffee; a CBD worker will buy a $6 coffee. But a tourist won't buy a $40 t-shirt; a CBD worker will. Tourism sustains quick-service and hospitality; it destroys specialty retail economics.
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: S.n900 }}>
            What Works Here
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
            <div style={{ padding: '20px', backgroundColor: S.white, borderRadius: '8px', border: `1px solid ${S.border}` }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: S.brand, marginBottom: '8px' }}>Premium Hospitality</h3>
              <p style={{ fontSize: '14px', color: S.muted, lineHeight: '1.6', margin: 0 }}>
                High-ticket dining (tasting menus $150+/person) works because CBD workers and international visitors spend freely on special occasions. Volume is lower than casual concepts but margins are 40–50% higher. Requires exceptional culinary credentials and PR network.
              </p>
            </div>
            <div style={{ padding: '20px', backgroundColor: S.white, borderRadius: '8px', border: `1px solid ${S.border}` }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: S.brand, marginBottom: '8px' }}>Office-Adjacent Cafés</h3>
              <p style={{ fontSize: '14px', color: S.muted, lineHeight: '1.6', margin: 0 }}>
                Fast-casual coffee and lunch concepts targeting finance workers. 10–11am coffee spike, 12–1pm lunch rush, 3pm afternoon coffee. If you optimize for these 3-hour windows with efficient operations, margins work. High volume, low ticket, high velocity.
              </p>
            </div>
            <div style={{ padding: '20px', backgroundColor: S.white, borderRadius: '8px', border: `1px solid ${S.border}` }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: S.brand, marginBottom: '8px' }}>Tourist-Dependent Retail</h3>
              <p style={{ fontSize: '14px', color: S.muted, lineHeight: '1.6', margin: 0 }}>
                Souvenir retail, international brands, and duty-free-adjacent concepts. Low margin per unit but volume overcomes rent cost. Most successful retail in CBD is international brand franchises or duty-free equivalents.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 24px', backgroundColor: S.n50 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: S.n900 }}>
            What Fails Here
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
            <div style={{ padding: '20px', backgroundColor: S.white, borderRadius: '8px', border: `1px solid ${S.border}` }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: S.red, marginBottom: '8px' }}>Budget Retail Concepts</h3>
              <p style={{ fontSize: '14px', color: S.muted, lineHeight: '1.6', margin: 0 }}>
                Discount fashion, fast-fashion, and budget homewares don't work in CBD. Westfield and suburban shopping centers capture this demographic. CBD rent can't be justified by discount margins.
              </p>
            </div>
            <div style={{ padding: '20px', backgroundColor: S.white, borderRadius: '8px', border: `1px solid ${S.border}` }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: S.red, marginBottom: '8px' }}>Independent Mid-Market Restaurants</h3>
              <p style={{ fontSize: '14px', color: S.muted, lineHeight: '1.6', margin: 0 }}>
                A $40–60 per head independent restaurant fails because established hospitality groups monopolize the market. Limited differentiation and massive rent overhead kill margins.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: S.n900 }}>
            Underrated Opportunities
          </h2>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: S.n900, marginBottom: '16px' }}>
            The Martin Place–Barangaroo lunchtime corridor is genuinely underserved for quick casual dining. 11am–2pm generates 18,000+ daily foot traffic of high-income workers. A well-positioned casual dining concept (Southeast Asian cuisine, for example) with efficient operations and 80+ seats could generate $1.1M–$1.3M annual revenue. Most operators overlook this because they chase the dinner market (which barely exists in the CBD). The money is at lunch.
          </p>
        </div>
      </section>

      <section style={{ padding: '48px 24px', backgroundColor: S.n50 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: S.n900 }}>
            Key Risks
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
            <div style={{ padding: '16px', backgroundColor: S.white, borderRadius: '8px', border: `1px solid ${S.border}` }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: S.red, marginBottom: '6px' }}>Post-Pandemic Hybrid Work</h3>
              <p style={{ fontSize: '14px', color: S.muted, margin: 0 }}>
                Office occupancy will never return to pre-2020 levels. Plan for 65–70% occupancy baseline, not 95%. Monday and Friday are weak; center revenue models around Tuesday–Thursday.
              </p>
            </div>
            <div style={{ padding: '16px', backgroundColor: S.white, borderRadius: '8px', border: `1px solid ${S.border}` }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: S.red, marginBottom: '6px' }}>Rent Reset Shock</h3>
              <p style={{ fontSize: '14px', color: S.muted, margin: 0 }}>
                Incentive periods are expiring. Real rents (including amortization of concessions) are rising 40–50%. Operators face 3–5 year breaks with materially higher renewal rent.
              </p>
            </div>
            <div style={{ padding: '16px', backgroundColor: S.white, borderRadius: '8px', border: `1px solid ${S.border}` }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: S.red, marginBottom: '6px' }}>Consolidation of Retail</h3>
              <p style={{ fontSize: '14px', color: S.muted, margin: 0 }}>
                Independent operators are being replaced by chains and franchises. Competition is increasingly professional and well-capitalized. Margins for new entrants are tighter than ever.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: S.n900 }}>
            Compare with Nearby Suburbs
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            <SuburbCard name="Surry Hills" slug="surry-hills" score={87} verdict="GO" />
            <SuburbCard name="North Sydney" slug="north-sydney" score={76} verdict="GO" />
            <SuburbCard name="Parramatta" slug="parramatta" score={84} verdict="GO" />
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 24px', backgroundColor: S.n50 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <SuburbPoll suburb="Sydney CBD" />
        </div>
      </section>

      <section style={{ padding: '48px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: S.n900 }}>
            Final Verdict
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', fontSize: '16px', lineHeight: '1.7', color: S.n900 }}>
            <p>
              Sydney CBD is a location of contradictions. Highest foot traffic in Sydney paired with worst rent economics. Best demographic (highest income) paired with most transient customer base (workers, not residents). For the right concept — premium hospitality or high-volume quick service — CBD can work. For most small business operators, it's a value trap. The location feels prestigious, foot traffic looks impressive, but rent multiples destroy unit economics.
            </p>
            <p>
              If you need CBD presence, position yourself in secondary locations (Barangaroo, Chippendale, or inner CBD fringes like Liverpool Street) where rents are 30–40% lower and foot traffic is still substantial. Better to be a big fish in a slightly smaller pond than a small fish drowning in rent costs in the core. Focus your operational excellence on the lunch corridor (11am–2pm) and Tuesday–Thursday. Ignore dinner and Monday–Friday evenings. Own your niche within the CBD's specific economics, don't fight the CBD's overall market structure.
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 24px', backgroundColor: S.emeraldBg }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px', color: S.emerald }}>
            Get Sydney CBD-specific data
          </h2>
          <p style={{ fontSize: '14px', color: S.emerald, marginBottom: '16px', lineHeight: '1.6' }}>
            Analyse your specific Sydney CBD address to see exact foot traffic, demographic breakdown, and comparable rents.
          </p>
          <Link
            href="/onboarding"
            style={{
              display: 'inline-block',
              padding: '12px 28px',
              backgroundColor: S.emerald,
              color: S.white,
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '600',
            }}
          >
            Analyse free →
          </Link>
        </div>
      </section>

      <section style={{ padding: '32px 24px', backgroundColor: S.n50, borderTop: `1px solid ${S.border}` }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', fontSize: '13px', color: S.muted, display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Link href="/analyse/sydney" style={{ color: S.brand, textDecoration: 'none', fontWeight: '600' }}>
            Back to Sydney Hub
          </Link>
          <Link href="/analyse/sydney/surry-hills" style={{ color: S.brand, textDecoration: 'none', fontWeight: '600' }}>
            Surry Hills Analysis →
          </Link>
          <Link href="/analyse/sydney/parramatta" style={{ color: S.brand, textDecoration: 'none', fontWeight: '600' }}>
            Parramatta Analysis →
          </Link>
        </div>
      </section>
    </>
  )
}
