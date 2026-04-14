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
    headline: 'Blacktown - Business Location Intelligence',
    description:
      'In-depth analysis of Blacktown for business site selection. Verdict: GO. Score 71/100.',
    image: 'https://locatalyze.com/blacktown-hero.jpg',
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
        name: 'Is Blacktown a good place to open a business?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Blacktown offers strong foot traffic (Westpoint centre, station precinct), affordable rents ($2,500–$4,500/month), and growing population. Economics work for volume-based and value-oriented concepts.',
        },
      },
      {
        '@type': 'Question',
        name: 'What type of business works in Blacktown?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Family-format casual dining, value-focused gyms, allied health, and retail. Concepts must price for the demographic income ceiling ($72,000 median) and focus on family units rather than individuals.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do Blacktown rents compare to Parramatta?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Blacktown Main Street rents ($2,500–$4,500/month) are 40–50% below Parramatta CBD equivalent positions. This rent advantage is Blacktown's defining economic edge.",
        },
      },
      {
        '@type': 'Question',
        name: 'Is Blacktown demographics changing?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. The LGA added 28,000 residents 2021–2026, weighted toward younger families. This drives growing demand for convenience, health/wellness, and family services.',
        },
      },
      {
        '@type': 'Question',
        name: 'What are the main risks of operating in Blacktown?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Westpoint gravitational pull on foot traffic, price sensitivity punishing premium positioning, and crime perception barriers for after-dark hospitality.',
        },
      },
    ],
  },
}

const SCORE_BARS: ScoreBarProps[] = [
  { label: 'Foot Traffic', value: 78 },
  { label: 'Demographics', value: 66 },
  { label: 'Rent Viability', value: 85 },
  { label: 'Competition', value: 68 },
]

const BUSINESS_FIT: BusinessFitItem[] = [
  {
    type: 'Cafés',
    verdict: 'GO',
    reason: 'Under-served market with lower competition. Price-accessible format. Strong morning and weekday base.',
  },
  {
    type: 'Restaurants',
    verdict: 'CAUTION',
    reason:
      'Multicultural competition is strong; generic Western fails. Authentic concepts succeed.',
  },
  {
    type: 'Retail',
    verdict: 'GO',
    reason:
      'Family-oriented, essential goods market. Value proposition critical; margin pressure is real.',
  },
  {
    type: 'Gym/Fitness',
    verdict: 'GO',
    reason: 'Underserved market. Low-cost membership model ($25–35/month) viable.',
  },
  {
    type: 'Health services',
    verdict: 'GO',
    reason:
      'Hospital proximity creates consistent demand. Allied health and dental underserved.',
  },
  {
    type: 'Luxury/premium',
    verdict: 'NO',
    reason: 'Income demographics do not support premium price points. Market punishes it.',
  },
]

const NEARBY: NearbySuburb[] = [
  { name: 'Parramatta', slug: 'parramatta', score: 84, verdict: 'GO' },
  { name: 'Merrylands', slug: 'merrylands', score: 74, verdict: 'GO' },
  { name: 'Penrith', slug: 'penrith', score: 76, verdict: 'GO' },
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
  const [votes, setVotes] = useState<number[]>([35, 42, 23])
  const total = votes.reduce((a, b) => a + b, 0)

  function handleVote(i: number): void {
    if (voted !== null) return
    setVoted(i)
    setVotes((prev) => prev.map((v, idx) => (idx === i ? v + 1 : v)))
  }

  const options = ['Yes, strong economics', 'Maybe, depends on rent', 'No, too risky']

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

export default function BlacktownPage() {
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
            {' / Blacktown'}
          </div>
          <h1
            style={{
              fontSize: 42,
              fontWeight: 700,
              margin: '0 0 16px 0',
              lineHeight: 1.2,
            }}
          >
            Blacktown
          </h1>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <VerdictBadge v="GO" />
            <span style={{ fontSize: 28, fontWeight: 700 }}>71/100</span>
          </div>
          <p
            style={{
              fontSize: 16,
              margin: '16px 0 0 0',
              opacity: 0.95,
              lineHeight: 1.5,
            }}
          >
            Western Sydney's rent advantage with growing family demographic.
            Strong foot traffic and under-served market create genuine economics
            for volume-based concepts.
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
              Economics work here
            </h2>
          </div>
          <p style={{ color: S.n900, lineHeight: 1.6, margin: '0 0 0 0' }}>
            Blacktown is Western Sydney's most misread suburb. The common narrative
            of low income and high risk obscures the genuine economic fundamentals:
            strong foot traffic, rents one-third of inner-suburban equivalents, and
            growing population weighted toward younger families. The constraint is
            not foot traffic quantity but customer spending power. Success requires
            discipline on positioning and pricing — premium concepts fail, but
            volume-based family-oriented and value-focused businesses perform well.
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
            Blacktown is Western Sydney's most misread suburb in the context of
            business viability. The common narrative — low income, high risk —
            obscures a more nuanced picture. The suburb's actual foot traffic,
            driven by Westpoint Shopping Centre, Blacktown Station, and the
            largest outdoor market precinct in Western Sydney, generates pedestrian
            volume that compares favourably to many inner-suburban strips. The
            issue is not foot traffic quantity; it is customer spending power and
            willingness-to-pay for premium positioning.
          </p>
          <p style={{ lineHeight: 1.7, color: S.n900, marginBottom: 16 }}>
            Commercial rents are among the most affordable of any major Sydney
            transport hub. Main Street and the station precinct offer retail
            positions at $2,500–$4,500/month — one-third of equivalent Chatswood
            positions. This rent advantage is the defining economic fact of
            Blacktown. A business that generates $20,000/month in revenue and
            pays $3,000/month rent operates at a 15% rent ratio. The same revenue
            at a Chatswood rent of $8,000/month is economically unviable.
            Blacktown's economics reward businesses that operate at volume and
            value price points.
          </p>
          <p style={{ lineHeight: 1.7, color: S.n900, marginBottom: 0 }}>
            Population growth is Blacktown LGA's clearest structural signal. The
            LGA added 28,000 residents between 2021–2026, with growth
            concentrated in younger families (median age 34). This demographic
            spends on convenience, family-oriented services, and health/wellness
            at increasing rates. Infrastructure investment (NorthConnex, Western
            Sydney Airport precinct) is creating long-term confidence in the LGA
            as a business environment.
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
            The competitive landscape is defined by the Westpoint Shopping
            Centre, which anchors chain and franchise operators. Independent
            operators have deliberately moved away from direct Westpoint
            competition and clustered on the eastern end of Main Street and in
            the Blacktown station precinct. These operators face lower foot
            traffic but also lower rent and less direct chain competition.
          </p>
          <p style={{ lineHeight: 1.7, color: S.n900, marginBottom: 0 }}>
            The multicultural food sector is genuinely competitive. Blacktown has
            a high concentration of Chinese, Indian, Filipino, Vietnamese, and
            Pacific Islander communities, each supporting their own preferred food
            operators. This is both a competitive challenge (established loyalty
            to specific operators) and an opportunity (unmet demand for quality
            within each community).
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
            Blacktown's median household income of $72,000 is below the Sydney
            median but above many outer-Western suburbs. The income distribution
            is wider than the median suggests — a significant professional cohort
            within the LGA earns $90,000–$130,000, particularly in newer estate
            corridors near transport nodes. This cohort is underserved by the
            current retail and hospitality offer, which skews heavily toward
            mass-market value.
          </p>
          <p style={{ lineHeight: 1.7, color: S.n900, marginBottom: 0 }}>
            Family structure is the dominant demographic characteristic: Blacktown
            has the highest proportion of families with dependent children of any
            major Sydney suburb. This drives spending on childcare, education, and
            family-format dining, while limiting premium casual dining. Businesses
            that understand the family unit — rather than the individual consumer
            — unlock Blacktown's strongest spending segment.
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
              Premium positioning (degustation, specialty retail over $60 ATV)
            </h3>
            <p style={{ color: S.n900, margin: 0, lineHeight: 1.6 }}>
              The demographic ceiling is real. Operators who try to import eastern
              suburbs pricing consistently fail within 18 months.
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
              Luxury retail
            </h3>
            <p style={{ color: S.n900, margin: 0, lineHeight: 1.6 }}>
              Blacktown customers are value-oriented. A $180 handbag retailer
              next to a $9 bubble tea shop is a positioning mismatch that doesn't
              resolve itself with time.
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
              After-school food corridor
            </h3>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.6,
                margin: '0 0 12px 0',
              }}
            >
              The 2:30–5:30pm weekday window serving 40,000+ school-age children
              in the LGA is significantly underserved. A concept targeting parents
              picking up children — quick-serve, family-priced, quality above
              fast-food — could generate consistent revenue in this time window.
            </p>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.6,
                margin: 0,
                fontWeight: 600,
              }}
            >
              This is a predictable, non-seasonal revenue stream: $2,000–3,500 daily
              revenue.
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
              Westpoint dependency
            </h3>
            <p style={{ color: S.n900, margin: 0, lineHeight: 1.6 }}>
              Businesses near the centre benefit from foot traffic but compete
              with aggressive chain pricing. Moving 200m away from Westpoint
              changes the economics materially.
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
              Price sensitivity
            </h3>
            <p style={{ color: S.n900, margin: 0, lineHeight: 1.6 }}>
              The market will punish operators who try to reprice value items
              above $15–18 before the demographic has shifted. Patience is required
              for premium repositioning.
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
              Crime perception
            </h3>
            <p style={{ color: S.n900, margin: 0, lineHeight: 1.6 }}>
              Blacktown's public safety reputation (improved since 2022) still
              affects some consumer segments. After-dark hospitality faces higher
              barriers than inner-suburb equivalents.
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

        <SuburbPoll suburb="Blacktown" />

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
            Blacktown works if you understand and respect the demographic. The
            economics are more forgiving than inner suburbs — you can operate a
            viable business at $20,000/month revenue because rents are $3,000/month.
            This is genuine advantage. The test is positioning discipline: does
            your concept fit the family-unit, value-oriented demographic, or are
            you trying to import a Surry Hills or Paddington concept that the
            market will reject?
          </p>
          <p style={{ lineHeight: 1.7, color: S.n900, marginBottom: 0 }}>
            Population growth weighted toward younger families is the strongest
            structural signal. This cohort spends reliably on convenience, education,
            health, and family dining. The after-school corridor is underexploited.
            Operators who build business models around these insights — rather than
            fighting the demographic's actual preferences — position themselves to
            capture Western Sydney's fastest-growing purchasing segments.
          </p>
        </div>

        {/* CTA Banner */}
        <div
          style={{
            background: `linear-gradient(135deg, ${S.brand} 0%, ${S.brandLight} 100%)`,
            borderRadius: 12,
            padding: 32,
            textAlign: 'center',
            color: S.white,
            marginBottom: 40,
          }}
        >
          <h3 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 12px 0' }}>
            Ready to analyse your suburb?
          </h3>
          <p
            style={{
              fontSize: 14,
              margin: '0 0 20px 0',
              opacity: 0.95,
            }}
          >
            Get detailed market intelligence for your location.
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
            href="/analyse/sydney/parramatta"
            style={{
              fontSize: 13,
              color: S.muted,
              textDecoration: 'none',
            }}
          >
            Parramatta
          </Link>
          <span style={{ color: S.border }}>•</span>
          <Link
            href="/analyse/sydney/penrith"
            style={{
              fontSize: 13,
              color: S.muted,
              textDecoration: 'none',
            }}
          >
            Penrith
          </Link>
        </div>
      </div>
    </>
  )
}
