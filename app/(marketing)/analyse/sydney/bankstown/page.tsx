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
    headline: 'Bankstown - Business Location Intelligence',
    description:
      'In-depth analysis of Bankstown for business site selection. Verdict: GO. Score 70/100.',
    image: 'https://locatalyze.com/bankstown-hero.jpg',
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
        name: 'Is Bankstown good for a restaurant?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, but authenticity is essential. Bankstown is the Cantonese and Lebanese food capital of Sydney. Established ethnic cuisine operators have deep community loyalty. Generic Western concepts fail.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the business environment in Bankstown?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Strong foot traffic from Bankstown Station, Bankstown Central shopping, and Bankstown Airport redevelopment. South Terrace is the operational core. Canterbury Hospital proximity (5km) adds healthcare demand.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does Bankstown compare to Liverpool for a café?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Bankstown has slightly less hospital-adjacent demand but stronger multicultural community. Liverpool has hospital anchor; Bankstown has cultural diversity anchor.',
        },
      },
    ],
  },
}

const SCORE_BARS: ScoreBarProps[] = [
  { label: 'Foot Traffic', value: 76 },
  { label: 'Demographics', value: 65 },
  { label: 'Rent Viability', value: 80 },
  { label: 'Competition', value: 66 },
]

const BUSINESS_FIT: BusinessFitItem[] = [
  {
    type: 'Multicultural cuisine',
    verdict: 'GO',
    reason:
      'Deep community appetite. Cantonese and Lebanese are most entrenched. Authentic concepts win.',
  },
  {
    type: 'Healthcare',
    verdict: 'GO',
    reason:
      'Canterbury Hospital proximity creates demand. Allied health and dental underserved.',
  },
  {
    type: 'Value retail',
    verdict: 'GO',
    reason:
      'Affordability-focused market responds well. Essential goods and volume-based positioning viable.',
  },
  {
    type: 'Cafés',
    verdict: 'CAUTION',
    reason: 'Needs differentiation. Generic positioning underperforms without community anchor.',
  },
  {
    type: 'Premium dining',
    verdict: 'NO',
    reason: 'Income ceiling is real. Market rejects premium repositioning attempts.',
  },
  {
    type: 'Luxury retail',
    verdict: 'NO',
    reason: 'Income demographics do not support premium price points.',
  },
]

const NEARBY: NearbySuburb[] = [
  { name: 'Liverpool', slug: 'liverpool', score: 73, verdict: 'GO' },
  { name: 'Auburn', slug: 'auburn', score: 71, verdict: 'GO' },
  { name: 'Lakemba', slug: 'lakemba', score: 65, verdict: 'CAUTION' },
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
  const [votes, setVotes] = useState<number[]>([36, 40, 24])
  const total = votes.reduce((a, b) => a + b, 0)

  function handleVote(i: number): void {
    if (voted !== null) return
    setVoted(i)
    setVotes((prev) => prev.map((v, idx) => (idx === i ? v + 1 : v)))
  }

  const options = ['Yes, if authentic', 'Maybe, depends on concept', 'No, too risky']

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

export default function BankstownPage() {
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
            {' / Bankstown'}
          </div>
          <h1
            style={{
              fontSize: 42,
              fontWeight: 700,
              margin: '0 0 16px 0',
              lineHeight: 1.2,
            }}
          >
            Bankstown
          </h1>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <VerdictBadge v="GO" />
            <span style={{ fontSize: 28, fontWeight: 700 }}>70/100</span>
          </div>
          <p
            style={{
              fontSize: 16,
              margin: '16px 0 0 0',
              opacity: 0.95,
              lineHeight: 1.5,
            }}
          >
            Cantonese and Lebanese food capital of Sydney. Paul Keating Airport
            redevelopment and Canterbury-Bankstown City Deal create infrastructure
            upside.
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
              Authentic positioning wins
            </h2>
          </div>
          <p style={{ color: S.n900, lineHeight: 1.6, margin: '0 0 0 0' }}>
            Bankstown's business opportunity is rooted in cultural authenticity and
            established community trust. The suburb is the strongest market in Sydney
            for Cantonese cuisine and Lebanese food. The primary economic constraint
            is not foot traffic but income demographics (median $70,000). Success
            requires building concepts around the actual community preferences
            rather than fighting them. Value retail and healthcare are secondary
            opportunity areas.
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
            Bankstown's operational core is South Terrace. All new operators should
            locate within 200m of the main Bankstown Station exit. The station
            precinct generates strong foot traffic from commuters and shoppers. The
            Bankstown Central shopping complex anchors retail activity, but
            independent food operators cluster on South Terrace and the surrounding
            strip where rents permit unit economics that work.
          </p>
          <p style={{ lineHeight: 1.7, color: S.n900, marginBottom: 16 }}>
            The Paul Keating Airport (Bankstown Airport) redevelopment will create
            commercial and residential development over the next 5–10 years. The
            Canterbury-Bankstown City Deal (federal/state infrastructure investment)
            signals long-term commitment to the precinct. These are structural
            positive signals. However, the immediate business environment is defined
            by the existing Bankstown Sports Club, which is the largest single
            hospitality operator in the LGA. This changes competitive dynamics — the
            club captures significant weekend and evening volume that independent
            operators might otherwise access.
          </p>
          <p style={{ lineHeight: 1.7, color: S.n900, marginBottom: 0 }}>
            Commercial rents are competitive: South Terrace positions range
            $2,600–$4,800/month. These rents are materially below Parramatta and
            comparable to Blacktown. The economics reward volume and authenticity
            over premium positioning.
          </p>
        </div>

        {/* Demographics Anchor */}
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
            Demographics and Competitive Positioning
          </h2>
          <p style={{ lineHeight: 1.7, color: S.n900, marginBottom: 16 }}>
            Bankstown is the Cantonese and Lebanese food capital of Sydney — two of
            the most deeply entrenched dining communities in Australia. The Cantonese
            operators have 20+ year tenure, deep family trust, and consistent community
            referrals. Lebanese operators similarly benefit from established community
            loyalty. Any new restaurant operator entering Bankstown needs to understand
            this competitive landscape and either: (a) differentiate within the same
            ethnic cuisine through superior quality/execution, or (b) position in an
            entirely different cuisine category with community demand.
          </p>
          <p style={{ lineHeight: 1.7, color: S.n900, marginBottom: 0 }}>
            Median income of $70,000 is the constraint that defines viable pricing.
            Premium dining (over $35pp) consistently fails. Value positioning works.
            Family-unit dining works. Individual premium casual dining does not.
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
              Premium positioning
            </h3>
            <p style={{ color: S.n900, margin: 0, lineHeight: 1.6 }}>
              Generic Western cuisine at premium price points ($25–35pp) fails
              consistently. The demographic expects authenticity or value, not premium
              casual dining.
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
              Generic café concepts without community differentiation
            </h3>
            <p style={{ color: S.n900, margin: 0, lineHeight: 1.6 }}>
              A café that doesn't address specific community preferences or language
              positioning underperforms against established operators with community
              trust.
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
              Korean and Japanese convenience food
            </h3>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.6,
                margin: '0 0 12px 0',
              }}
            >
              Korean food and Japanese convenience foods are absent from the Bankstown
              strip despite significant Korean and Japanese communities in adjacent
              suburbs (Strathfield, Campsie). The commuter corridor through Bankstown
              Station includes these populations.
            </p>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.6,
                margin: 0,
                fontWeight: 600,
              }}
            >
              First-mover advantage in the $15–22 per-meal Korean fast casual segment
              is material. This is a 3–5 year window before competition inevitably
              enters.
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
              Established competitive moats
            </h3>
            <p style={{ color: S.n900, margin: 0, lineHeight: 1.6 }}>
              Cantonese and Lebanese operators have deep community trust that new
              entrants cannot quickly replicate. Competing directly on their turf
              requires superior execution and time.
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
              Bankstown Sports Club volume capture
            </h3>
            <p style={{ color: S.n900, margin: 0, lineHeight: 1.6 }}>
              The club is the largest single hospitality operator in the LGA. It
              captures significant weekend and evening volume. Independent operators
              can't compete on scale.
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
              Income demographic ceiling
            </h3>
            <p style={{ color: S.n900, margin: 0, lineHeight: 1.6 }}>
              Premium concepts fail. The market will reject pricing above the
              cultural and income expectations of the current demographic.
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

        <SuburbPoll suburb="Bankstown" />

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
            Bankstown works for operators who respect the cultural anchors and
            understand the income demographics. This is not a market for operators
            trying to import eastern suburbs concepts or premium pricing models.
            The economics reward authenticity, volume, and value positioning. If
            you have Cantonese culinary credentials or Lebanese family food
            background, Bankstown is genuinely defensible. If you're building a
            generic Western concept, look elsewhere.
          </p>
          <p style={{ lineHeight: 1.7, color: S.n900, marginBottom: 0 }}>
            The underrated opportunity is Korean food. The demographic
            supply-demand gap exists in the Bankstown strip, but demand exists in
            the broader precinct. The Paul Keating Airport redevelopment creates
            long-term infrastructure upside. For now, success is about community
            positioning discipline.
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
            Analyse your market
          </h3>
          <p
            style={{
              fontSize: 14,
              margin: '0 0 20px 0',
              opacity: 0.95,
            }}
          >
            Get comprehensive market intelligence for your location.
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
            href="/analyse/sydney/liverpool"
            style={{
              fontSize: 13,
              color: S.muted,
              textDecoration: 'none',
            }}
          >
            Liverpool
          </Link>
          <span style={{ color: S.border }}>•</span>
          <Link
            href="/analyse/sydney/auburn"
            style={{
              fontSize: 13,
              color: S.muted,
              textDecoration: 'none',
            }}
          >
            Auburn
          </Link>
        </div>
      </div>
    </>
  )
}
