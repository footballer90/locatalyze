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
    headline: 'Liverpool - Business Location Intelligence',
    description:
      'In-depth analysis of Liverpool for business site selection. Verdict: GO. Score 73/100.',
    image: 'https://locatalyze.com/liverpool-hero.jpg',
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
        name: 'Is Liverpool a good area to open a business?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Liverpool Hospital (6,000+ employees), government employment, and the Western Sydney Aerotropolis infrastructure create genuine demand for hospitality, health, and professional services.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is commercial rent like in Liverpool Sydney?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Macquarie Street and Elizabeth Street: $2,800–$5,000/month. Secondary positions: $2,000–$3,500/month. These rents are 40–50% below Parramatta CBD equivalents.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does Western Sydney Airport affect Liverpool businesses?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The Aerotropolis (opening 2026) will materially shift the income profile of the southern corridor. Operators entering now capture rent advantage before prices reprice.',
        },
      },
      {
        '@type': 'Question',
        name: 'What businesses work near Liverpool Hospital?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Cafés, quick-service restaurants, and allied health operators within 500m of the hospital have captive demand. Physiotherapy, dental, and general practice are all underserved.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is Liverpool business environment improving?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Streetscape investment (2023+), airport infrastructure development, and population growth are creating long-term business confidence.',
        },
      },
    ],
  },
}

const SCORE_BARS: ScoreBarProps[] = [
  { label: 'Foot Traffic', value: 79 },
  { label: 'Demographics', value: 68 },
  { label: 'Rent Viability', value: 82 },
  { label: 'Competition', value: 65 },
]

const BUSINESS_FIT: BusinessFitItem[] = [
  {
    type: 'Healthcare/allied health',
    verdict: 'GO',
    reason:
      'Liverpool Hospital (third-largest in NSW) generates consistent demand. Physiotherapy, dental, and general practice underserved.',
  },
  {
    type: 'Cafés',
    verdict: 'GO',
    reason:
      'Government and hospital workers represent stable weekday customer base. Morning and lunch predictable.',
  },
  {
    type: 'Legal/financial services',
    verdict: 'GO',
    reason:
      'Court precinct and Immigration complex create consistent demand for legal documents, migration agents, translation services.',
  },
  {
    type: 'Restaurants',
    verdict: 'CAUTION',
    reason:
      'Competitive from strong multicultural operators; generic concepts face margin pressure. Authenticity required.',
  },
  {
    type: 'Premium retail',
    verdict: 'NO',
    reason: 'Income and demographic ceiling. Westfield Liverpool competition overwhelming.',
  },
  {
    type: 'Boutique fitness',
    verdict: 'CAUTION',
    reason:
      'Viability depends on proximity to higher-income corridors (Prestons, Cecil Hills).',
  },
]

const NEARBY: NearbySuburb[] = [
  { name: 'Bankstown', slug: 'bankstown', score: 70, verdict: 'GO' },
  { name: 'Campbelltown', slug: 'campbelltown', score: 73, verdict: 'GO' },
  { name: 'Fairfield', slug: 'fairfield', score: 67, verdict: 'CAUTION' },
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
  const [votes, setVotes] = useState<number[]>([38, 39, 23])
  const total = votes.reduce((a, b) => a + b, 0)

  function handleVote(i: number): void {
    if (voted !== null) return
    setVoted(i)
    setVotes((prev) => prev.map((v, idx) => (idx === i ? v + 1 : v)))
  }

  const options = ['Yes, hospital demand is real', 'Maybe, depends on concept', 'No, too risky']

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

export default function LiverpoolPage() {
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
            {' / Liverpool'}
          </div>
          <h1
            style={{
              fontSize: 42,
              fontWeight: 700,
              margin: '0 0 16px 0',
              lineHeight: 1.2,
            }}
          >
            Liverpool
          </h1>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <VerdictBadge v="GO" />
            <span style={{ fontSize: 28, fontWeight: 700 }}>73/100</span>
          </div>
          <p
            style={{
              fontSize: 16,
              margin: '16px 0 0 0',
              opacity: 0.95,
              lineHeight: 1.5,
            }}
          >
            Hospital anchor with aerotropolis infrastructure upside. Strategic
            timing advantage for operators entering pre-airport economic repricing.
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
              Timing is the advantage
            </h2>
          </div>
          <p style={{ color: S.n900, lineHeight: 1.6, margin: '0 0 0 0' }}>
            Liverpool's business case is built on two anchors: Liverpool Hospital's
            6,000-employee captive market, and Western Sydney Airport's infrastructure
            repricing coming in 2026. The primary opportunity is capturing the hospital
            and government demand now, at rents 40–50% below Parramatta CBD, before the
            airport fundamentally shifts the suburb's income and rent profiles. The
            secondary opportunity is establishing in growth corridors (Edmondson Park,
            Ingleburn fringe) ahead of airport-driven residential development.
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
            Liverpool has been the subject of several false dawns as a business
            destination, but the underlying infrastructure build is becoming
            undeniable. The Western Sydney Aerotropolis, anchored by Western
            Sydney International Airport (opening 2026), sits within Liverpool LGA.
            The airport's 10,000-employee operational phase will materially shift
            the income profile of the LGA's southern corridor. Operators who
            establish now, before the infrastructure premium reprices rents,
            capture a meaningful timing advantage.
          </p>
          <p style={{ lineHeight: 1.7, color: S.n900, marginBottom: 16 }}>
            Liverpool Hospital is the structural constant that most business
            analysts underweight. The third-largest hospital in NSW employs 6,000+
            clinical and administrative staff, most of whom work standard business
            hours with predictable break windows. Macquarie Street cafés,
            quick-service restaurants, and allied health operators within 500m of
            the hospital entrance access a captive, high-frequency customer base.
            This is not foot traffic speculation — it is modellable demand.
          </p>
          <p style={{ lineHeight: 1.7, color: S.n900, marginBottom: 0 }}>
            The Macquarie Street and Elizabeth Street commercial strip is genuinely
            improving. Council has invested materially in streetscape and activation
            since 2023. The challenge remains the presence of high vacancy rates on
            secondary streets, which creates a perception of decline that doesn't
            reflect the primary strip's genuine vibrancy. Operators who assess the
            primary strip independently — rather than judging Liverpool from its
            secondary streets — will find a different picture.
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
            The multicultural dining sector is Liverpool's competitive intensity
            point. Vietnamese, Lebanese, Turkish, and Chinese operators are deeply
            entrenched with loyal community followings. These operators do not
            compete on price alone — they compete on authenticity and community
            trust, which is harder for new entrants to replicate. Any new restaurant
            concept entering Liverpool needs a clear differentiation that doesn't
            directly compete with established ethnic cuisine operators.
          </p>
          <p style={{ lineHeight: 1.7, color: S.n900, marginBottom: 0 }}>
            The café market is less competitive than it appears. The hospital-adjacent
            strip has three quality independent cafés serving 6,000+ hospital employees.
            The actual demand-to-supply ratio suggests the market could absorb one to
            two more quality independent operators without saturation. The morning rush
            (7–9am) and lunch (12–2pm) are where incremental volume exists.
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
            Liverpool LGA has one of Sydney's highest culturally diverse populations
            — over 60 nationalities are represented, with significant Lebanese,
            Vietnamese, Filipino, and Indian communities. This creates both
            opportunity (unmet niche demand within communities) and challenge (generic
            operator positioning rarely lands). Businesses that engage with specific
            community preferences — whether through menu, marketing, or service style
            — outperform generic concepts.
          </p>
          <p style={{ lineHeight: 1.7, color: S.n900, marginBottom: 0 }}>
            Income demographics are growing. The median household income of $74,000
            will shift materially upward as the aerotropolis employment corridor
            activates from 2026 onward. Operators who model Liverpool at current
            income levels rather than projected 2028–2030 levels may be underestimating
            the 5-year business case.
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
              Premium dining (over $70pp)
            </h3>
            <p style={{ color: S.n900, margin: 0, lineHeight: 1.6 }}>
              The income demographic doesn't support it. The few attempts have
              failed within 18 months.
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
              Fashion retail above $60 ATV
            </h3>
            <p style={{ color: S.n900, margin: 0, lineHeight: 1.6 }}>
              Competition from Westfield Liverpool is overwhelming for mid-to-premium
              retail. Independent operators can't match the draw.
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
              Aerotropolis fringe entry
            </h3>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.6,
                margin: '0 0 12px 0',
              }}
            >
              The aerotropolis adjacent corridor (Edmondson Park, Ingleburn fringe)
              is the single most undervalued business location in the Liverpool LGA.
              Residential development is outpacing commercial development by 3:1.
            </p>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.6,
                margin: 0,
                fontWeight: 600,
              }}
            >
              A café or health services operator entering at $2,200/month before 2026
              airport opening positions for post-airport repricing to $4,500+. This is
              timing arbitrage.
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
              Airport construction timeline risk
            </h3>
            <p style={{ color: S.n900, margin: 0, lineHeight: 1.6 }}>
              Delays extend the pre-growth window but also extend the lower-income
              period. The 2026 opening is current plan but not guaranteed.
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
              Secondary street vacancy creates perception of decline
            </h3>
            <p style={{ color: S.n900, margin: 0, lineHeight: 1.6 }}>
              This affects foot traffic even on primary strips. Primary strip analysis
              should be independent of secondary street conditions.
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
              Westfield Liverpool gravitational pull
            </h3>
            <p style={{ color: S.n900, margin: 0, lineHeight: 1.6 }}>
              Exerts strong pull on retail. Independent operators on adjacent strips
              face high headwinds for premium retail positioning.
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

        <SuburbPoll suburb="Liverpool" />

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
            Liverpool's business case is timing-dependent. The hospital anchor is
            real and provides stable, modellable demand for hospitality and health
            services. But the suburb's long-term growth story — the real economic
            leverage — is the Western Sydney Aerotropolis. Operators entering now at
            current rents ($2,800–$5,000/month) are entering before that repricing.
            This is a 3–5 year advantage that narrows as the airport infrastructure
            becomes visible and rents normalise upward.
          </p>
          <p style={{ lineHeight: 1.7, color: S.n900, marginBottom: 0 }}>
            The execution risk is positioning. Liverpool's cultural diversity is
            genuine strength, but it also means that generic Western concepts fail
            harder than in suburbs with more homogeneous demographics. Concepts that
            authentically address specific community preferences — whether that's a
            Vietnamese café, Lebanese bakery, or immigration support services — win.
            Generic "world fusion" doesn't work. Pick a lane that has community trust.
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
          <h3 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 12px 0' }}>
            Find your winning location
          </h3>
          <p
            style={{
              fontSize: 14,
              margin: '0 0 20px 0',
              opacity: 0.95,
            }}
          >
            Get detailed market analysis for any Sydney suburb.
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
            href="/analyse/sydney/bankstown"
            style={{
              fontSize: 13,
              color: S.muted,
              textDecoration: 'none',
            }}
          >
            Bankstown
          </Link>
          <span style={{ color: S.border }}>•</span>
          <Link
            href="/analyse/sydney/campbelltown"
            style={{
              fontSize: 13,
              color: S.muted,
              textDecoration: 'none',
            }}
          >
            Campbelltown
          </Link>
        </div>
      </div>
    </>
  )
}
