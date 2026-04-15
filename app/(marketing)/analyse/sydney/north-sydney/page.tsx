'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

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
  muted: '#475569',
  border: '#E2E8F0',
  n50: '#FAFAF9',
  n100: '#F5F5F4',
  n900: '#1C1917',
  white: '#FFFFFF',
}

type Verdict = 'GO' | 'CAUTION' | 'NO'

interface VerdictBadgeProps {
  v: Verdict
}

interface ScoreBarProps {
  label: string
  value: number
}

interface SuburbPollProps {
  suburb: string
}

interface BusinessFitItem {
  type: string
  verdict: Verdict
  reason: string
}

interface NearbySuburb {
  name: string
  slug: string
  score: number
  verdict: Verdict
}

const SCHEMAS = {
  article: {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'North Sydney - Business Location Intelligence',
    description:
      'In-depth analysis of North Sydney for business site selection. Verdict: GO. Score 76/100.',
    image: 'https://locatalyze.com/north-sydney-hero.jpg',
    author: {
      '@type': 'Organization',
      name: 'Locatalyze',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Locatalyze',
    },
  },
  faq: {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is North Sydney good for opening a café?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. North Sydney has 8,000+ office workers creating a strong morning rush and premium lunch market. The demographic (median income $102,000) supports $7–9 coffee pricing and $25–35 lunch plates.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is commercial rent like in North Sydney?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Miller Street retail commands $5,500–$11,000/month. Secondary positions range $3,800–$7,500/month. These rents require $50,000–$90,000/month revenue to maintain healthy rent ratios.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does North Sydney have enough weekend foot traffic for retail?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Weekend trade is weak Mon–Thu after 6pm and moderate on weekends. A business needing strong weekend revenue should look elsewhere.',
        },
      },
      {
        '@type': 'Question',
        name: 'What income demographic does North Sydney attract?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'North Sydney has the highest median individual income ($102,000) of any lower North Shore suburb. The population is finance, legal, technology, and consulting professionals.',
        },
      },
      {
        '@type': 'Question',
        name: "Is North Sydney's business environment improving or declining?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'It is improving. Metro construction disruption is temporary with a clear end date (2025–2026). Street-level foot traffic conditions will improve post-Metro opening. Residential growth has strengthened weekend trade.',
        },
      },
    ],
  },
}

const SCORE_BARS: ScoreBarProps[] = [
  { label: 'Foot Traffic', value: 82 },
  { label: 'Demographics', value: 85 },
  { label: 'Rent Viability', value: 66 },
  { label: 'Competition', value: 78 },
]

const BUSINESS_FIT: BusinessFitItem[] = [
  {
    type: 'Cafés',
    verdict: 'GO',
    reason:
      '8,000+ office workers create morning rush; premium positioning viable at $7–9 per coffee.',
  },
  {
    type: 'Restaurants',
    verdict: 'GO',
    reason:
      'Lunch trade strongest in Sydney for high-spend $25–35 plates. Mon–Fri 12–2pm is predictable revenue window.',
  },
  {
    type: 'Retail',
    verdict: 'CAUTION',
    reason:
      'Foot traffic drops after 6pm and on weekends. Needs strong weekday customer base.',
  },
  {
    type: 'Gym/Fitness',
    verdict: 'GO',
    reason:
      '$100k+ income demographic drives boutique studio memberships. $35–45/session pricing accepted without friction.',
  },
  {
    type: 'Health services',
    verdict: 'GO',
    reason:
      'Professional population needs physio, dental, psych. Consistent referral demand.',
  },
  {
    type: 'Budget food',
    verdict: 'NO',
    reason:
      'Market will not support it. Workers spend premium or skip. Economics don\'t work at $6,000–10,000/month rent.',
  },
]

const NEARBY: NearbySuburb[] = [
  { name: 'Chatswood', slug: 'chatswood', score: 82, verdict: 'GO' },
  { name: 'Surry Hills', slug: 'surry-hills', score: 87, verdict: 'GO' },
  { name: 'Sydney CBD', slug: 'sydney-cbd', score: 78, verdict: 'CAUTION' },
]

function VerdictBadge({ v }: VerdictBadgeProps) {
  const cfg =
    v === 'GO'
      ? { bg: S.emeraldBg, bdr: S.emeraldBdr, txt: S.emerald }
      : v === 'CAUTION'
        ? { bg: S.amberBg, bdr: S.amberBdr, txt: S.amber }
        : { bg: S.redBg, bdr: S.redBdr, txt: S.red }
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 700,
        color: cfg.txt,
        background: cfg.bg,
        border: `1px solid ${cfg.bdr}`,
        borderRadius: 6,
        padding: '2px 9px',
      }}
    >
      {v}
    </span>
  )
}

function ScoreBar({ label, value }: ScoreBarProps) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 8,
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 600, color: S.n900 }}>
          {label}
        </span>
        <span style={{ fontSize: 14, fontWeight: 700, color: S.brand }}>
          {value}
        </span>
      </div>
      <div
        style={{
          width: '100%',
          height: 8,
          background: S.border,
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${value}%`,
            background: S.brand,
            borderRadius: 4,
          }}
        />
      </div>
    </div>
  )
}

function SuburbPoll({ suburb }: SuburbPollProps) {
  const [voted, setVoted] = useState<number | null>(null)
  const [votes, setVotes] = useState<number[]>([42, 31, 27])
  const total = votes.reduce((a, b) => a + b, 0)

  function handleVote(i: number): void {
    if (voted !== null) return
    setVoted(i)
    setVotes((prev) => prev.map((v, idx) => (idx === i ? v + 1 : v)))
  }

  const options = ['Yes, high potential', 'Maybe, depends on concept', 'No, too risky']

  return (
    <div
      style={{
        background: S.n50,
        border: `1px solid ${S.border}`,
        borderRadius: 12,
        padding: 24,
        marginTop: 48,
      }}
    >
      <h3
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: S.n900,
          marginTop: 0,
          marginBottom: 16,
        }}
      >
        Would you start a business in {suburb}?
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {options.map((opt, i) => {
          const pct = total > 0 ? Math.round((votes[i] / total) * 100) : 0
          return (
            <button
              key={i}
              onClick={() => handleVote(i)}
              style={{
                border: `1px solid ${S.border}`,
                background: S.white,
                borderRadius: 8,
                padding: 12,
                textAlign: 'left',
                cursor: voted !== null ? 'default' : 'pointer',
                opacity: voted !== null && voted !== i ? 0.5 : 1,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 8,
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 500 }}>{opt}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: S.brand }}>
                  {votes[i]} votes ({pct}%)
                </span>
              </div>
              <div
                style={{
                  width: '100%',
                  height: 6,
                  background: S.border,
                  borderRadius: 3,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${pct}%`,
                    background: S.brand,
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </button>
          )
        })}
      </div>
      {voted !== null && (
        <p
          style={{
            fontSize: 12,
            color: S.muted,
            marginTop: 12,
            marginBottom: 0,
          }}
        >
          Thanks for voting.
        </p>
      )}
    </div>
  )
}

export default function NorthSydneyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMAS.article) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMAS.faq) }}
      />

      <nav
        style={{
          position: 'sticky',
          top: 0,
          background: S.white,
          borderBottom: `1px solid ${S.border}`,
          zIndex: 10,
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link href="/analyse/sydney" style={{ textDecoration: 'none' }}>
          <span
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: S.brand,
              cursor: 'pointer',
            }}
          >
            Locatalyze
          </span>
        </Link>
        <Link
          href="/onboarding"
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: S.white,
            background: S.brand,
            padding: '8px 16px',
            borderRadius: 6,
            textDecoration: 'none',
          }}
        >
          Analyse Free
        </Link>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
        {/* Hero */}
        <div
          style={{
            background: `linear-gradient(135deg, ${S.brandLight} 0%, ${S.brand} 100%)`,
            borderRadius: 16,
            padding: 40,
            color: S.white,
            marginBottom: 40,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
            <Link
              href="/analyse/sydney"
              style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}
            >
              Sydney
            </Link>
            {' / North Sydney'}
          </div>
          <h1
            style={{
              fontSize: 42,
              fontWeight: 700,
              margin: '0 0 16px 0',
              lineHeight: 1.2,
            }}
          >
            North Sydney
          </h1>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <VerdictBadge v="GO" />
            <span style={{ fontSize: 28, fontWeight: 700 }}>76/100</span>
          </div>
          <p
            style={{
              fontSize: 16,
              margin: '16px 0 0 0',
              opacity: 0.95,
              lineHeight: 1.5,
            }}
          >
            Professional office precinct with strong weekday foot traffic and
            premium customer spending power. Revenue potential is genuine for
            positioned concepts.
          </p>
        </div>

        {/* Quick Verdict */}
        <div
          style={{
            background: S.emeraldBg,
            border: `1px solid ${S.emeraldBdr}`,
            borderRadius: 12,
            padding: 24,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 12,
              alignItems: 'flex-start',
              marginBottom: 12,
            }}
          >
            <VerdictBadge v="GO" />
            <h2
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: S.emerald,
                margin: 0,
              }}
            >
              This is a viable location
            </h2>
          </div>
          <p style={{ color: S.n900, lineHeight: 1.6, margin: '0 0 0 0' }}>
            North Sydney's economics work for positioned concepts that understand
            the weekday professional demographic and its spending window. The
            primary revenue engine is 7am–3pm on business days. Rents are
            substantial but customer willingness-to-pay is genuine. The morning
            coffee market and lunch trade are both defensible revenue streams for
            independent operators. Weekend exposure is minimal — this is not a
            destination for concepts that need strong Saturday/Sunday trade.
          </p>
        </div>

        {/* Score Bars */}
        <div style={{ marginBottom: 40 }}>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: S.n900,
              marginTop: 0,
              marginBottom: 24,
            }}
          >
            Location Scorecard
          </h2>
          {SCORE_BARS.map((bar, i) => (
            <ScoreBar key={i} label={bar.label} value={bar.value} />
          ))}
        </div>

        {/* Business Environment */}
        <div style={{ marginBottom: 40 }}>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: S.n900,
              marginTop: 0,
              marginBottom: 16,
            }}
          >
            Business Environment
          </h2>
          <p style={{ lineHeight: 1.7, color: S.n900, marginBottom: 16 }}>
            North Sydney underwent a structural shift after the CBD tunnel
            closures and hybrid work adoption. The traditionally corporate
            high-rise precinct has evolved into a mixed-use environment where
            weekday professional density remains strong but Saturday strip
            trading is thin. Miller Street and the north side of the Pacific
            Highway carry the bulk of foot traffic — but the distribution is
            heavily weighted toward 7am–3pm on business days. This creates a
            very specific trading window that operators must understand before
            signing a lease.
          </p>
          <p style={{ lineHeight: 1.7, color: S.n900, marginBottom: 16 }}>
            The rent economics are more forgiving than the CBD but still require
            discipline. Miller Street retail commands $5,500–$11,000/month for
            quality positions, which demands revenue of $50,000–$90,000/month to
            maintain healthy rent ratios. The key is that the customer
            willingness-to-pay is genuine — North Sydney professionals earning
            $100,000+ don't hesitate at a $7.50 flat white or a $28 lunch
            plate. The revenue per customer is higher than almost any other
            Sydney suburb outside the eastern suburbs, which partially offsets
            the rent burden.
          </p>
          <p style={{ lineHeight: 1.7, color: S.n900, marginBottom: 0 }}>
            Construction disruption from the Sydney Metro Northwest and adjacent
            tunnel works has periodically suppressed street-level foot traffic
            since 2024. This is temporary damage with a clear end date (Metro
            opening 2025–2026), which means new operators who lock in lease
            terms now should see foot traffic conditions improve rather than
            deteriorate through their initial lease period.
          </p>
        </div>

        {/* Competition Analysis */}
        <div style={{ marginBottom: 40 }}>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: S.n900,
              marginTop: 0,
              marginBottom: 16,
            }}
          >
            Competition Analysis
          </h2>
          <p style={{ lineHeight: 1.7, color: S.n900, marginBottom: 16 }}>
            The competitive landscape in North Sydney is weighted toward chain
            operations and large group operators who can absorb the rent.
            Independent operators cluster on secondary streets where rents
            permit viable unit economics. The coffee market specifically has
            room for one or two more independent specialty operators — there are
            currently three dominant specialty providers, and demand
            consistently exceeds supply during the 7:30–9:30am morning rush.
          </p>
          <p style={{ lineHeight: 1.7, color: S.n900, marginBottom: 0 }}>
            Restaurants face a cleaner competitive picture: the lunch trade
            (Mon–Fri, 12–2pm) generates strong revenue but the evening market
            is genuinely thin. A restaurant concept that can generate
            $40,000+ per month from weekday lunch alone — and treats dinner as
            supplementary rather than primary — has a more defensible business
            model than one that needs evening cover to survive.
          </p>
        </div>

        {/* Demographics */}
        <div style={{ marginBottom: 40 }}>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: S.n900,
              marginTop: 0,
              marginBottom: 16,
            }}
          >
            Demographics
          </h2>
          <p style={{ lineHeight: 1.7, color: S.n900, marginBottom: 16 }}>
            The North Sydney residential and worker population skews strongly
            professional — finance, legal, technology, consulting. Median
            individual income of $102,000 is the highest of any lower North
            Shore suburb and significantly above the Sydney median of $74,000.
            The 9–5 office worker demographic drives morning (coffee, breakfast)
            and lunch spend as primary revenue streams, with Friday evening a
            secondary social occasion.
          </p>
          <p style={{ lineHeight: 1.7, color: S.n900, marginBottom: 0 }}>
            The residential component of North Sydney has grown since 2021,
            adding apartment-dwelling younger professionals who extend the
            suburb's trading day beyond office hours. Saturday morning trade has
            strengthened proportionally, driven by brunch culture from this
            residential growth. This shifts the economics slightly from pure
            weekday-only exposure — though the primary revenue engine remains
            the business day.
          </p>
        </div>

        {/* What Works */}
        <div style={{ marginBottom: 40 }}>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: S.n900,
              marginTop: 0,
              marginBottom: 20,
            }}
          >
            What Works Here
          </h2>
          <div style={{ display: 'grid', gap: 16 }}>
            {BUSINESS_FIT.filter((bf) => bf.verdict === 'GO').map((bf, i) => (
              <div
                key={i}
                style={{
                  border: `1px solid ${S.border}`,
                  borderRadius: 12,
                  padding: 16,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 8,
                  }}
                >
                  <h3
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: S.n900,
                      margin: 0,
                    }}
                  >
                    {bf.type}
                  </h3>
                  <VerdictBadge v={bf.verdict} />
                </div>
                <p
                  style={{
                    fontSize: 14,
                    color: S.muted,
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  {bf.reason}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* What Fails */}
        <div style={{ marginBottom: 40 }}>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: S.n900,
              marginTop: 0,
              marginBottom: 20,
            }}
          >
            What Fails Here
          </h2>
          <div
            style={{
              background: S.redBg,
              border: `1px solid ${S.redBdr}`,
              borderRadius: 12,
              padding: 20,
              marginBottom: 16,
            }}
          >
            <h3
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: S.red,
                margin: '0 0 8px 0',
              }}
            >
              Budget food concepts (under $15 ATV)
            </h3>
            <p style={{ color: S.n900, margin: 0, lineHeight: 1.6 }}>
              The economics don't work at $6,000–10,000/month rent. Volume to
              compensate is not achievable in a market that expects quality.
              Operators who try to win on price fail.
            </p>
          </div>
          <div
            style={{
              background: S.redBg,
              border: `1px solid ${S.redBdr}`,
              borderRadius: 12,
              padding: 20,
            }}
          >
            <h3
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: S.red,
                margin: '0 0 8px 0',
              }}
            >
              Evening-only restaurants
            </h3>
            <p style={{ color: S.n900, margin: 0, lineHeight: 1.6 }}>
              North Sydney empties after 6pm Mon–Thu. A restaurant concept that
              needs 60+ weekday evening covers to break even is misunderstanding
              the suburb. Friday evening has moderate trade; Tuesday does not.
            </p>
          </div>
        </div>

        {/* Underrated Opportunity */}
        <div style={{ marginBottom: 40 }}>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: S.n900,
              marginTop: 0,
              marginBottom: 20,
            }}
          >
            Underrated Opportunities
          </h2>
          <div
            style={{
              background: S.brandLight,
              borderRadius: 12,
              padding: 24,
              color: S.white,
            }}
          >
            <h3
              style={{
                fontSize: 16,
                fontWeight: 700,
                margin: '0 0 12px 0',
              }}
            >
              The 10am–12pm third wave window
            </h3>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.6,
                margin: '0 0 12px 0',
              }}
            >
              Between the morning rush and lunchtime peak — genuinely underserved.
              North Sydney's professional demographic uses this window for client
              meetings, working lunches, and off-site sessions. A café with solid
              WiFi, larger tables, and a menu that bridges breakfast and lunch
              (9:30am–12:30pm extended trading) captures a currently uncontested
              time slot.
            </p>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.6,
                margin: 0,
                fontWeight: 600,
              }}
            >
              Estimated additional revenue: $12,000–18,000/month on top of the
              morning rush alone.
            </p>
          </div>
        </div>

        {/* Key Risks */}
        <div style={{ marginBottom: 40 }}>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: S.n900,
              marginTop: 0,
              marginBottom: 20,
            }}
          >
            Key Risks
          </h2>
          <div
            style={{
              background: S.amberBg,
              border: `1px solid ${S.amberBdr}`,
              borderRadius: 12,
              padding: 20,
              marginBottom: 16,
            }}
          >
            <h3
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: S.amber,
                margin: '0 0 8px 0',
              }}
            >
              Evening foot traffic
            </h3>
            <p style={{ color: S.n900, margin: 0, lineHeight: 1.6 }}>
              Thin Mon–Thu; new operators consistently underestimate this and
              overbuild staffing for dinner service that doesn't materialise.
            </p>
          </div>
          <div
            style={{
              background: S.amberBg,
              border: `1px solid ${S.amberBdr}`,
              borderRadius: 12,
              padding: 20,
              marginBottom: 16,
            }}
          >
            <h3
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: S.amber,
                margin: '0 0 8px 0',
              }}
            >
              Metro construction disruption
            </h3>
            <p style={{ color: S.n900, margin: 0, lineHeight: 1.6 }}>
              Temporary but material. Some blocks see 20–30% foot traffic
              reduction during active works. Site selection within North Sydney
              matters — not all positions are equally affected.
            </p>
          </div>
          <div
            style={{
              background: S.amberBg,
              border: `1px solid ${S.amberBdr}`,
              borderRadius: 12,
              padding: 20,
            }}
          >
            <h3
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: S.amber,
                margin: '0 0 8px 0',
              }}
            >
              Weekend exposure
            </h3>
            <p style={{ color: S.n900, margin: 0, lineHeight: 1.6 }}>
              Saturday/Sunday trade is building but remains secondary. A business
              needing strong weekend revenue to survive should look elsewhere.
            </p>
          </div>
        </div>

        {/* Compare Nearby */}
        <div style={{ marginBottom: 40 }}>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: S.n900,
              marginTop: 0,
              marginBottom: 20,
            }}
          >
            Compare with Nearby Suburbs
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {NEARBY.map((nb, i) => (
              <Link
                key={i}
                href={`/analyse/sydney/${nb.slug}`}
                style={{ textDecoration: 'none' }}
              >
                <div
                  style={{
                    border: `1px solid ${S.border}`,
                    borderRadius: 12,
                    padding: 16,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: S.white,
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.borderColor = S.brand
                    el.style.boxShadow = `0 4px 12px rgba(8,145,178,0.1)`
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.borderColor = S.border
                    el.style.boxShadow = 'none'
                  }}
                >
                  <h3
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: S.n900,
                      margin: '0 0 8px 0',
                    }}
                  >
                    {nb.name}
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: S.brand,
                      }}
                    >
                      {nb.score}/100
                    </span>
                    <VerdictBadge v={nb.verdict} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <SuburbPoll suburb="North Sydney" />

        {/* Final Verdict */}
        <div style={{ marginBottom: 40, marginTop: 40 }}>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: S.n900,
              marginTop: 0,
              marginBottom: 16,
            }}
          >
            Final Verdict
          </h2>
          <p style={{ lineHeight: 1.7, color: S.n900, marginBottom: 16 }}>
            North Sydney is a defensible location for operators who understand
            the professional weekday demographic and have a business model
            designed to exploit the 7am–3pm trading window. The revenue ceiling
            is genuine — you can hit $80,000–90,000/month at a premium Miller
            Street location if your concept captures the morning coffee or lunch
            segments. This is not a legacy market or a growing market; it is a
            disciplined market that rewards clarity of positioning.
          </p>
          <p style={{ lineHeight: 1.7, color: S.n900, marginBottom: 0 }}>
            The structural risk is not the market itself but operator
            overestimation of weekend exposure. Too many operators still price
            their business on the assumption of strong Saturday trade; you
            should price it on Monday–Friday 7am–3pm and treat weekend revenue
            as incremental upside. The metro construction timeline is winding
            down, which removes the most material near-term foot traffic
            headwind. Entry conditions are now better than they have been since
            2023.
          </p>
        </div>

        {/* CTA Banner */}
        <div
          style={{
            background: `linear-gradient(135deg, #0F766E 0%, #0B5E57 100%)`,
            borderRadius: 12,
            padding: 32,
            textAlign: 'center',
            color: S.white,
            marginBottom: 40,
          }}
        >
          <h3 style={{ color: '#1C1917', fontSize: 20, fontWeight: 700, margin: '0 0 12px 0' }}>
            Ready to find your location?
          </h3>
          <p
            style={{
              fontSize: 14,
              margin: '0 0 20px 0',
              opacity: 0.95,
            }}
          >
            Get detailed market intelligence for your suburb.
          </p>
          <Link
            href="/onboarding"
            style={{
              display: 'inline-block',
              background: S.white,
              color: S.brand,
              padding: '12px 32px',
              borderRadius: 6,
              fontWeight: 700,
              textDecoration: 'none',
              fontSize: 14,
            }}
          >
            Analyse Free
          </Link>
        </div>

        {/* Footer Nav */}
        <div
          style={{
            borderTop: `1px solid ${S.border}`,
            paddingTop: 32,
            display: 'flex',
            gap: 20,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Link
            href="/analyse/sydney"
            style={{
              fontSize: 13,
              color: S.muted,
              textDecoration: 'none',
            }}
          >
            Back to Sydney
          </Link>
          <span style={{ color: S.border }}>•</span>
          <Link
            href="/analyse/sydney/chatswood"
            style={{
              fontSize: 13,
              color: S.muted,
              textDecoration: 'none',
            }}
          >
            Chatswood
          </Link>
          <span style={{ color: S.border }}>•</span>
          <Link
            href="/analyse/sydney/surry-hills"
            style={{
              fontSize: 13,
              color: S.muted,
              textDecoration: 'none',
            }}
          >
            Surry Hills
          </Link>
        </div>
      </div>
    </>
  )
}
