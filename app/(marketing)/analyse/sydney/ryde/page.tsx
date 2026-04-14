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
    headline: 'Ryde - Business Location Intelligence',
    description:
      'In-depth analysis of Ryde for business site selection. Verdict: GO. Score 77/100.',
    image: 'https://locatalyze.com/ryde-hero.jpg',
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
        name: 'Is Ryde good for opening a restaurant?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Ryde LGA has the highest proportion of Chinese-Australian residents outside Sydney CBD. Asian cuisine (particularly Cantonese, Mandarin, and specialty Japanese) commands strong demand.',
        },
      },
      {
        '@type': 'Question',
        name: 'What businesses work in Ryde?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Asian cuisine restaurants, specialist cafés, boutique fitness, allied health, professional services. All premium positioning works — the demographic (median income $90,000) supports it.',
        },
      },
      {
        '@type': 'Question',
        name: 'How competitive is the café market in Ryde?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Competitive but not saturated. Specialty positioning (specialty coffee, Asian-influenced, brunch-focused) succeeds. Generic café concepts underperform.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is commercial rent in Ryde?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Top Ryde City anchor: $4,000–$7,000/month. Church Street and Victoria Road secondary strips: $2,800–$5,000/month. Secondary positions offer 40% rent advantage.',
        },
      },
    ],
  },
}

const SCORE_BARS: ScoreBarProps[] = [
  { label: 'Foot Traffic', value: 80 },
  { label: 'Demographics', value: 82 },
  { label: 'Rent Viability', value: 72 },
  { label: 'Competition', value: 76 },
]

const BUSINESS_FIT: BusinessFitItem[] = [
  {
    type: 'Asian cuisine restaurants',
    verdict: 'GO',
    reason:
      '35% Chinese-Australian population, strong dining culture. Cantonese, Mandarin, and specialty Japanese all perform well.',
  },
  {
    type: 'Cafés',
    verdict: 'GO',
    reason:
      'Professional demographic (90k+ income), high café spend. Specialty positioning wins; generic underperforms.',
  },
  {
    type: 'Healthcare/allied health',
    verdict: 'GO',
    reason:
      'Strong demographic, growing need. Macquarie University Hospital proximity (Meadowbank) strengthens demand.',
  },
  {
    type: 'Premium retail',
    verdict: 'CAUTION',
    reason:
      'Top Ryde competition for independent operators. Secondary positions on Church Street offer better unit economics.',
  },
  {
    type: 'Gyms/fitness',
    verdict: 'GO',
    reason:
      '90k+ income, professional demographic. Boutique model viable at premium pricing ($45–65/session).',
  },
  {
    type: 'Budget food',
    verdict: 'NO',
    reason:
      'Demographic expects quality; value positioning undersells the market. Ryde rejects commodity pricing.',
  },
]

const NEARBY: NearbySuburb[] = [
  { name: 'Chatswood', slug: 'chatswood', score: 82, verdict: 'GO' },
  { name: 'North Sydney', slug: 'north-sydney', score: 76, verdict: 'GO' },
  { name: 'Hornsby', slug: 'hornsby', score: 72, verdict: 'GO' },
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
  const [votes, setVotes] = useState<number[]>([45, 38, 17])
  const total = votes.reduce((a, b) => a + b, 0)

  function handleVote(i: number): void {
    if (voted !== null) return
    setVoted(i)
    setVotes((prev) => prev.map((v, idx) => (idx === i ? v + 1 : v)))
  }

  const options = ['Yes, strong demographics', 'Maybe, rent is high', 'No, too competitive']

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

export default function RydePage() {
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
            {' / Ryde'}
          </div>
          <h1
            style={{
              fontSize: 42,
              fontWeight: 700,
              margin: '0 0 16px 0',
              lineHeight: 1.2,
            }}
          >
            Ryde
          </h1>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <VerdictBadge v="GO" />
            <span style={{ fontSize: 28, fontWeight: 700 }}>77/100</span>
          </div>
          <p
            style={{
              fontSize: 16,
              margin: '16px 0 0 0',
              opacity: 0.95,
              lineHeight: 1.5,
            }}
          >
            High-income professional demographic with strongest Asian dining market.
            Rents are elevated but customer willingness-to-pay justifies premium
            positioning.
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
              Premium positioning is defensible
            </h2>
          </div>
          <p style={{ color: S.n900, lineHeight: 1.6, margin: '0 0 0 0' }}>
            Ryde's business case is built on demographics and cultural positioning.
            Median household income of $90,000, highest concentration of
            Chinese-Australian residents outside the CBD, and strong professional
            density create genuine demand for premium and specialty concepts. Rents
            are elevated ($4,000–$7,000/month Top Ryde, $2,800–$5,000/month secondary
            strips), but customer willingness-to-pay supports these economics.
            Success requires positioning discipline — generic concepts fail, but
            authentic Asian dining and premium specialty concepts win.
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
            Ryde LGA has the highest proportion of Chinese-Australian residents of
            any major Sydney suburb outside the CBD precinct. This is not a
            demographic detail — it is the defining structural fact of the market.
            35% of the population identifies as Chinese-Australian. This creates
            authentic demand for Cantonese, Mandarin, and specialty Japanese dining
            that far exceeds what demographics alone suggest.
          </p>
          <p style={{ lineHeight: 1.7, color: S.n900, marginBottom: 16 }}>
            Top Ryde City Shopping Centre anchors the commercial precinct. Independent
            operators must position around rather than against it. Church Street and
            Victoria Road secondary strips offer viable independent positions at 40%
            below Top Ryde anchor rents ($2,800–$5,000/month vs. $4,000–$7,000/month).
            The secondary positions have lower foot traffic but access the same
            demographic willingness-to-pay and benefit from lower rent burden.
          </p>
          <p style={{ lineHeight: 1.7, color: S.n900, marginBottom: 0 }}>
            Macquarie University Hospital proximity (via Meadowbank station corridor,
            800m away) strengthens allied health and professional services demand.
            The professional demographic is concentrated in finance, technology, and
            consulting sectors, creating high and consistent customer spending across
            food, fitness, and health services.
          </p>
        </div>

        {/* Competition and Positioning */}
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
            Competition and Market Positioning
          </h2>
          <p style={{ lineHeight: 1.7, color: S.n900, marginBottom: 16 }}>
            Ryde is genuinely competitive at the premium end, but the competition is
            sophisticated. Existing operators in the Chinese cuisine space are
            established and strong. This is not a weak competitive landscape; it is a
            sophisticated one. New entrants must have differentiation that addresses
            the specific community preferences — whether that's a particular regional
            cuisine (Hunan, Sichuan), specialty dining experience (omakase, family-style
            banquets), or price positioning that justifies premium placement.
          </p>
          <p style={{ lineHeight: 1.7, color: S.n900, marginBottom: 0 }}>
            The café market is competitive but not saturated. Specialty positioning
            succeeds — whether that's specialty coffee, Asian-influenced brunch, or
            professional working environments. Generic café concepts underperform.
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
            Demographics and Income Profile
          </h2>
          <p style={{ lineHeight: 1.7, color: S.n900, marginBottom: 0 }}>
            Median household income of $90,000 significantly exceeds the Sydney median.
            The population skews professional — finance, technology, consulting, and
            health sectors dominate employment. This demographic does not price-shop
            aggressively; they trade off price for quality, convenience, and
            experience. A $18 coffee is acceptable if it's specialty-positioned. A
            $35 lunch plate is normal if it's authentic or premium quality. This
            willingness-to-pay is the economic foundation that makes Ryde's elevated
            rents viable.
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
              Budget retail and value-oriented food concepts
            </h3>
            <p style={{ color: S.n900, margin: 0, lineHeight: 1.6 }}>
              The demographic expects quality; budget positioning undersells the
              market. Ryde rejects commodity pricing and generic Western concepts.
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
              Generic Western dining without premium positioning
            </h3>
            <p style={{ color: S.n900, margin: 0, lineHeight: 1.6 }}>
              A generic burger restaurant or pizza concept at standard pricing
              doesn't address the demographic's preferences. Authenticity wins;
              commodity doesn't.
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
              Meadowbank/Shepherd's Bay secondary corridor
            </h3>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.6,
                margin: '0 0 12px 0',
              }}
            >
              800m from Top Ryde with $3,000/month rents vs. $7,000/month anchor
              positions. Access to the same income demographic but at materially lower
              rent burden.
            </p>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.6,
                margin: 0,
                fontWeight: 600,
              }}
            >
              A small specialty café or wellness operator here has a 3-year window
              before rents normalise upward as the corridor activates. This is
              timing advantage.
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
              Elevated rent burden
            </h3>
            <p style={{ color: S.n900, margin: 0, lineHeight: 1.6 }}>
              Top Ryde positions ($4,000–$7,000/month) require $50,000–$70,000/month
              revenue to maintain healthy rent ratios. Only positioned concepts with
              strong unit economics work.
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
              Sophisticated competition
            </h3>
            <p style={{ color: S.n900, margin: 0, lineHeight: 1.6 }}>
              Established operators in Asian cuisine are strong and well-capitalized.
              Differentiation is essential — generic "Asian fusion" concepts fail.
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
              Execution risk on premium positioning
            </h3>
            <p style={{ color: S.n900, margin: 0, lineHeight: 1.6 }}>
              Premium positioning requires consistent quality and delivery. Missteps
              are unforgiving in a market that's willing to pay for quality.
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

        <SuburbPoll suburb="Ryde" />

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
            Ryde works for positioned concepts that respect the demographic's
            preferences and willingness-to-pay. The market is sophisticated and
            unforgiving of generic positioning. A specialty coffee operator, an
            authentic Cantonese restaurant, a boutique fitness concept at premium
            pricing — these concepts work. A generic café, a budget burger restaurant,
            a value-oriented retail outlet — these concepts fail.
          </p>
          <p style={{ lineHeight: 1.7, color: S.n900, marginBottom: 0 }}>
            The structural advantage is demographic: high income, professional density,
            cultural preference alignment. The structural constraint is rent: Top Ryde
            positions require $50,000+/month revenue. Use secondary positions
            (Church Street, Victoria Road, Meadowbank corridor) for lower rent burden
            if entry economics are tight. The Meadowbank corridor is the single most
            undervalued position in the LGA — low rent today, strong demographic access,
            and 3-year window before rent normalization.
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
            Find your perfect location
          </h3>
          <p
            style={{
              fontSize: 14,
              margin: '0 0 20px 0',
              opacity: 0.95,
            }}
          >
            Get detailed intelligence for your business location.
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
            href="/analyse/sydney/hornsby"
            style={{
              fontSize: 13,
              color: S.muted,
              textDecoration: 'none',
            }}
          >
            Hornsby
          </Link>
        </div>
      </div>
    </>
  )
}
