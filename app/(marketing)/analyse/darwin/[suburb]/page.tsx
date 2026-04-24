import type { Metadata } from 'next'
import Link from 'next/link'
import { C, ScoreBar, SuburbCard, VerdictBadge } from '@/components/analyse'
import { FactorGrid } from '@/components/analyse/FactorGrid'
import {
  getDarwinNearbySuburbs,
  getDarwinSuburb,
  getDarwinSuburbStaticParams,
  type DarwinSuburb,
} from '@/lib/analyse-data/darwin'

interface Props {
  params: Promise<{ suburb: string }>
}

function bestFit(suburb: DarwinSuburb) {
  return [
    { label: 'Cafe', value: suburb.cafe },
    { label: 'Restaurant', value: suburb.restaurant },
    { label: 'Retail', value: suburb.retail },
  ].sort((a, b) => b.value - a.value)[0]
}

function summaryItems(suburb: DarwinSuburb): string[] {
  const seasonality =
    suburb.factors.seasonality >= 7
      ? `${suburb.name} carries a ${suburb.factors.seasonality}/10 seasonality score, so wet-season planning matters as much as dry-season upside.`
      : `${suburb.name} is less seasonal than Darwin City, with seasonality at ${suburb.factors.seasonality}/10.`

  const competition =
    suburb.factors.competition >= 7
      ? `Competition is ${suburb.factors.competition}/10, so the market pressure comes from existing operators and dominant centres rather than weak demand alone.`
      : `Competition is ${suburb.factors.competition}/10, which leaves more room for an operator with a clear position.`

  return [seasonality, competition, suburb.why[0]]
}

function SuburbFallback({ suburb }: { suburb: string }) {
  const nearby = getDarwinNearbySuburbs('', 3)

  return (
    <div style={{ minHeight: '100vh', background: C.n50 }}>
      <section style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: '56px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', fontSize: 13, color: C.muted, marginBottom: 18 }}>
            <Link href="/analyse" style={{ color: C.brand, textDecoration: 'none' }}>Analyse</Link>
            <span>›</span>
            <Link href="/analyse/darwin" style={{ color: C.brand, textDecoration: 'none' }}>Darwin</Link>
            <span>›</span>
            <span style={{ color: C.n900, fontWeight: 700 }}>Suburb not found</span>
          </div>
          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 18, padding: 32 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: C.brand, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px 0' }}>
              Darwin Drill-Down
            </p>
            <h1 style={{ fontSize: 'clamp(30px, 5vw, 46px)', lineHeight: 1.1, color: C.n900, margin: '0 0 12px 0' }}>
              We couldn&apos;t find a suburb page for &quot;{suburb}&quot;
            </h1>
            <p style={{ maxWidth: 760, fontSize: 16, lineHeight: 1.7, color: C.muted, margin: '0 0 22px 0' }}>
              The Darwin route matches both slugs and suburb names, so this usually means the suburb is not in the Darwin dataset yet.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link
                href="/analyse/darwin"
                style={{
                  background: C.brand,
                  color: C.white,
                  textDecoration: 'none',
                  fontWeight: 700,
                  padding: '12px 18px',
                  borderRadius: 10,
                }}
              >
                Back to Darwin overview
              </Link>
              <Link
                href="/analyse"
                style={{
                  background: C.white,
                  color: C.brand,
                  textDecoration: 'none',
                  fontWeight: 700,
                  padding: '12px 18px',
                  borderRadius: 10,
                  border: `1px solid ${C.border}`,
                }}
              >
                Run a fresh analysis
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section style={{ padding: '40px 24px 72px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: C.n900, margin: '0 0 18px 0' }}>
            Darwin suburbs already scored
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {nearby.map((candidate) => (
              <SuburbCard
                key={candidate.slug}
                citySlug="darwin"
                name={candidate.name}
                slug={candidate.slug}
                description={candidate.why[0]}
                score={candidate.compositeScore}
                verdict={candidate.verdict}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export function generateStaticParams() {
  return getDarwinSuburbStaticParams()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { suburb } = await params
  const data = getDarwinSuburb(decodeURIComponent(suburb))

  if (!data) {
    return {
      title: 'Darwin suburb not found',
      description: 'This Darwin suburb is not available in the current analysis dataset.',
    }
  }

  return {
    title: `${data.name}, Darwin Business Analysis — ${data.verdict} (${data.compositeScore}/100)`,
    description: `${data.name} scores ${data.compositeScore}/100 with a ${data.verdict} verdict for Darwin cafes, restaurants, and retail operators.`,
    alternates: {
      canonical: `https://locatalyze.com/analyse/darwin/${data.slug}`,
    },
    openGraph: {
      title: `${data.name}, Darwin Business Analysis`,
      description: `${data.name} scores ${data.compositeScore}/100 with a ${data.verdict} verdict for Darwin cafes, restaurants, and retail operators.`,
      type: 'article',
      url: `https://locatalyze.com/analyse/darwin/${data.slug}`,
    },
  }
}

export default async function DarwinSuburbPage({ params }: Props) {
  const { suburb } = await params
  const data = getDarwinSuburb(decodeURIComponent(suburb))

  if (!data) {
    return <SuburbFallback suburb={decodeURIComponent(suburb)} />
  }

  const nearby = getDarwinNearbySuburbs(data.slug, 3)
  const strongestFit = bestFit(data)
  const insights = summaryItems(data)

  return (
    <div style={{ minHeight: '100vh', background: C.n50 }}>
      <section
        style={{
          background: 'linear-gradient(135deg, #0369A1 0%, #024F80 100%)',
          color: C.white,
          padding: '56px 24px 52px',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', fontSize: 12, opacity: 0.82, marginBottom: 16 }}>
            <Link href="/analyse" style={{ color: 'inherit', textDecoration: 'none' }}>Analyse</Link>
            <span>›</span>
            <Link href="/analyse/darwin" style={{ color: 'inherit', textDecoration: 'none' }}>Darwin</Link>
            <span>›</span>
            <span style={{ fontWeight: 700 }}>{data.name}</span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 22,
              alignItems: 'start',
            }}
          >
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#BAE6FD', margin: '0 0 12px 0' }}>
                Darwin Suburb Intelligence
              </p>
              <h1 style={{ fontSize: 'clamp(34px, 6vw, 54px)', lineHeight: 1.03, margin: '0 0 12px 0' }}>
                {data.name}
              </h1>
              <p style={{ maxWidth: 680, fontSize: 16, lineHeight: 1.7, color: '#E0F2FE', margin: '0 0 18px 0' }}>
                {data.why[0]}
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                <VerdictBadge verdict={data.verdict} size="lg" />
                <span style={{ fontSize: 14, color: '#BAE6FD' }}>
                  Best fit: {strongestFit.label} ({strongestFit.value}/100)
                </span>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.16)',
                borderRadius: 18,
                padding: 24,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 18, marginBottom: 20 }}>
                <div>
                  <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#BAE6FD', margin: '0 0 6px 0' }}>
                    Composite score
                  </p>
                  <div style={{ fontSize: 64, lineHeight: 0.92, fontWeight: 900 }}>{data.compositeScore}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#BAE6FD', margin: '0 0 6px 0' }}>
                    Engine
                  </p>
                  <p style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.5, margin: 0 }}>Shared 5-factor model</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14 }}>
                {[
                  { label: 'Demand', value: `${data.factors.demand}/10` },
                  { label: 'Rent', value: `${data.factors.rent}/10` },
                  { label: 'Competition', value: `${data.factors.competition}/10` },
                ].map((item) => (
                  <div key={item.label}>
                    <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#BAE6FD', margin: '0 0 5px 0' }}>
                      {item.label}
                    </p>
                    <p style={{ fontSize: 13, lineHeight: 1.55, margin: 0 }}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '32px 24px 72px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gap: 24 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 24,
            }}
          >
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 18, padding: 26 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: C.brand, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px 0' }}>
                Factor Breakdown
              </p>
              <h2 style={{ fontSize: 24, lineHeight: 1.15, color: C.n900, margin: '0 0 10px 0' }}>
                Five-factor model input
              </h2>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: C.muted, margin: '0 0 10px 0' }}>
                These are the Darwin-specific factor values that feed directly into the shared scoring engine.
              </p>
              <FactorGrid factors={data.locationFactors} />
            </div>

            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 18, padding: 26 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: C.brand, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px 0' }}>
                Business Suitability
              </p>
              <h2 style={{ fontSize: 24, lineHeight: 1.15, color: C.n900, margin: '0 0 10px 0' }}>
                Engine output by business type
              </h2>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: C.muted, margin: '0 0 18px 0' }}>
                Darwin does not use a separate scoring model here. These are the direct outputs from `computeLocationModel()`.
              </p>
              <ScoreBar label="Cafe suitability" value={data.cafe} />
              <ScoreBar label="Restaurant suitability" value={data.restaurant} />
              <ScoreBar label="Retail suitability" value={data.retail} />
            </div>
          </div>

          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 18, padding: 28 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: C.brand, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px 0' }}>
              Why This Score
            </p>
            <h2 style={{ fontSize: 26, lineHeight: 1.1, color: C.n900, margin: '0 0 12px 0' }}>
              What is driving {data.name}&apos;s {data.verdict.toLowerCase()} verdict?
            </h2>
            <div style={{ display: 'grid', gap: 12 }}>
              {data.why.map((item) => (
                <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ color: C.brand, fontWeight: 900, marginTop: 1 }}>•</span>
                  <p style={{ fontSize: 15, lineHeight: 1.8, color: C.muted, margin: 0 }}>{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 24,
            }}
          >
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 18, padding: 26 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: C.brand, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px 0' }}>
                Risk + Opportunity
              </p>
              <h2 style={{ fontSize: 24, lineHeight: 1.15, color: C.n900, margin: '0 0 12px 0' }}>
                Key Darwin takeaways
              </h2>
              <div style={{ display: 'grid', gap: 12 }}>
                {insights.map((item) => (
                  <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ color: C.brand, fontWeight: 900, marginTop: 1 }}>•</span>
                    <p style={{ fontSize: 14, lineHeight: 1.7, color: C.muted, margin: 0 }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 18, padding: 26 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: C.brand, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px 0' }}>
                Next Step
              </p>
              <h2 style={{ fontSize: 24, lineHeight: 1.15, color: C.n900, margin: '0 0 12px 0' }}>
                Use the suburb verdict to narrow the Darwin search
              </h2>
              <p style={{ fontSize: 14, lineHeight: 1.75, color: C.muted, margin: '0 0 18px 0' }}>
                {data.name} is strongest for {strongestFit.label.toLowerCase()} operators, but exact site economics still decide whether a tenancy works. The suburb page tells you where Darwin conditions are supportive before you go block-by-block.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link
                  href="/analyse/darwin"
                  style={{
                    background: C.brand,
                    color: C.white,
                    textDecoration: 'none',
                    fontWeight: 700,
                    padding: '12px 18px',
                    borderRadius: 10,
                  }}
                >
                  Back to Darwin overview
                </Link>
                <Link
                  href="/analyse"
                  style={{
                    background: C.white,
                    color: C.brand,
                    textDecoration: 'none',
                    fontWeight: 700,
                    padding: '12px 18px',
                    borderRadius: 10,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  Run location analysis
                </Link>
              </div>
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: C.n900, margin: '0 0 18px 0' }}>
              Compare Darwin suburbs
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
              {nearby.map((candidate) => (
                <SuburbCard
                  key={candidate.slug}
                  citySlug="darwin"
                  name={candidate.name}
                  slug={candidate.slug}
                  description={candidate.why[0]}
                  score={candidate.compositeScore}
                  verdict={candidate.verdict}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
