import type { Metadata } from 'next'
import Link from 'next/link'
import { C, ScoreBar, SuburbCard } from '@/components/analyse'
import { FactorGrid } from '@/components/analyse/FactorGrid'
import {
  getGoldCoastNearbySuburbs,
  getGoldCoastSuburb,
  getGoldCoastSuburbStaticParams,
  type GoldCoastSuburb,
  type GoldCoastVerdict,
} from '@/lib/analyse-data/gold-coast'

interface Props {
  params: Promise<{ suburb: string }>
}

function verdictStyles(verdict: GoldCoastVerdict) {
  if (verdict === 'GO') return { bg: C.emeraldBg, bdr: C.emeraldBdr, txt: C.emerald }
  if (verdict === 'CAUTION') return { bg: C.amberBg, bdr: C.amberBdr, txt: C.amber }
  return { bg: C.redBg, bdr: C.redBdr, txt: C.red }
}

function bestFitLabel(suburb: GoldCoastSuburb) {
  const scores = [
    { label: 'Cafe', value: suburb.cafe },
    { label: 'Restaurant', value: suburb.restaurant },
    { label: 'Retail', value: suburb.retail },
  ]

  return scores.sort((a, b) => b.value - a.value)[0]
}

function buildSummaryItems(suburb: GoldCoastSuburb): string[] {
  const strongestDriver =
    suburb.factors.demandStrength >= 7
      ? `Demand strength is ${suburb.factors.demandStrength}/10, which supports ${suburb.demand.toLowerCase()}.`
      : `Demand strength is only ${suburb.factors.demandStrength}/10, so the suburb depends on tighter concept-market fit than the top-tier Gold Coast strips.`

  const mainHeadwind =
    suburb.factors.rentPressure >= 7
      ? `Rent pressure sits at ${suburb.factors.rentPressure}/10 and the current guide range of ${suburb.rent} means fixed costs will punish weak execution quickly.`
      : suburb.factors.competitionDensity >= 6
        ? `Competition density is ${suburb.factors.competitionDensity}/10, so you are entering an already-contested strip rather than an obvious whitespace market.`
        : suburb.factors.seasonalityRisk >= 5
          ? `Seasonality risk is ${suburb.factors.seasonalityRisk}/10, so peak periods matter and off-season trading needs to be modelled explicitly.`
          : `Competition density is ${suburb.factors.competitionDensity}/10 and rent pressure is ${suburb.factors.rentPressure}/10, which keeps the downside more manageable than most coastal strips.`

  return [strongestDriver, mainHeadwind, suburb.insight]
}

function SuburbFallback({ suburb }: { suburb: string }) {
  const alternatives = getGoldCoastNearbySuburbs('', 3)

  return (
    <div style={{ minHeight: '100vh', background: C.n50 }}>
      <section style={{ borderBottom: `1px solid ${C.border}`, background: C.white, padding: '56px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', fontSize: 13, color: C.muted, marginBottom: 18 }}>
            <Link href="/analyse" style={{ color: C.brand, textDecoration: 'none' }}>Analyse</Link>
            <span>›</span>
            <Link href="/analyse/gold-coast" style={{ color: C.brand, textDecoration: 'none' }}>Gold Coast</Link>
            <span>›</span>
            <span style={{ color: C.n900, fontWeight: 700 }}>Suburb not found</span>
          </div>

          <div
            style={{
              background: C.white,
              border: `1px solid ${C.border}`,
              borderRadius: 18,
              padding: '32px',
            }}
          >
            <p style={{ fontSize: 12, fontWeight: 700, color: C.brand, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px 0' }}>
              Gold Coast Drill-Down
            </p>
            <h1 style={{ fontSize: 'clamp(30px, 5vw, 46px)', lineHeight: 1.1, color: C.n900, margin: '0 0 12px 0' }}>
              We couldn&apos;t find a suburb page for &quot;{suburb}&quot;
            </h1>
            <p style={{ maxWidth: 760, fontSize: 16, lineHeight: 1.7, color: C.muted, margin: '0 0 22px 0' }}>
              The suburb slug can be matched by either page slug or suburb name, so this usually means the Gold Coast dataset does not include that market yet.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link
                href="/analyse/gold-coast"
                style={{
                  background: C.brand,
                  color: C.white,
                  textDecoration: 'none',
                  fontWeight: 700,
                  padding: '12px 18px',
                  borderRadius: 10,
                }}
              >
                Back to Gold Coast overview
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
            Popular Gold Coast suburbs
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {alternatives.map((candidate) => (
              <SuburbCard
                key={candidate.slug}
                citySlug="gold-coast"
                name={candidate.name}
                slug={candidate.slug}
                description={candidate.best}
                score={candidate.compositeScore}
                verdict={candidate.verdict === 'RISKY' ? 'NO' : candidate.verdict}
                rentRange={candidate.rent}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function SuburbSchema({ suburb }: { suburb: GoldCoastSuburb }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${suburb.name} Gold Coast Business Analysis`,
    description: `${suburb.name} scored ${suburb.compositeScore}/100 for Gold Coast business suitability with a ${suburb.verdict} verdict.`,
    author: { '@type': 'Organization', name: 'Locatalyze' },
    publisher: { '@type': 'Organization', name: 'Locatalyze', url: 'https://locatalyze.com' },
    dateModified: '2026-04-19',
    about: {
      '@type': 'Place',
      name: `${suburb.name}, Gold Coast QLD`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: suburb.name,
        addressRegion: 'QLD',
        addressCountry: 'AU',
      },
    },
  }

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  )
}

export function generateStaticParams() {
  return getGoldCoastSuburbStaticParams()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { suburb } = await params
  const decodedSuburb = decodeURIComponent(suburb)
  const data = getGoldCoastSuburb(decodedSuburb)

  if (!data) {
    return {
      title: 'Gold Coast suburb not found',
      description: 'This Gold Coast suburb is not available in the current analysis dataset.',
    }
  }

  return {
    title: `${data.name}, Gold Coast Business Analysis — ${data.verdict} (${data.compositeScore}/100)`,
    description: `${data.name} scores ${data.compositeScore}/100 with a ${data.verdict} verdict for Gold Coast cafes, restaurants, and retail operators.`,
    alternates: {
      canonical: `https://locatalyze.com/analyse/gold-coast/${data.slug}`,
    },
    openGraph: {
      title: `${data.name}, Gold Coast Business Analysis`,
      description: `${data.name} scores ${data.compositeScore}/100 with a ${data.verdict} verdict for Gold Coast cafes, restaurants, and retail operators.`,
      url: `https://locatalyze.com/analyse/gold-coast/${data.slug}`,
      type: 'article',
    },
  }
}

export default async function GoldCoastSuburbPage({ params }: Props) {
  const { suburb } = await params
  const decodedSuburb = decodeURIComponent(suburb)
  const data = getGoldCoastSuburb(decodedSuburb)

  if (!data) {
    return <SuburbFallback suburb={decodedSuburb} />
  }

  const verdict = verdictStyles(data.verdict)
  const bestFit = bestFitLabel(data)
  const nearby = getGoldCoastNearbySuburbs(data.slug, 3)
  const summaryItems = buildSummaryItems(data)

  return (
    <div style={{ minHeight: '100vh', background: C.n50 }}>
      <SuburbSchema suburb={data} />

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
            <Link href="/analyse/gold-coast" style={{ color: 'inherit', textDecoration: 'none' }}>Gold Coast</Link>
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
                Gold Coast Suburb Intelligence
              </p>
              <h1 style={{ fontSize: 'clamp(34px, 6vw, 54px)', lineHeight: 1.03, margin: '0 0 12px 0' }}>
                {data.name}
              </h1>
              <p style={{ maxWidth: 660, fontSize: 16, lineHeight: 1.7, color: '#E0F2FE', margin: '0 0 18px 0' }}>
                {data.vibe}
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '8px 16px',
                    borderRadius: 999,
                    fontWeight: 800,
                    fontSize: 13,
                    letterSpacing: '0.06em',
                    color: verdict.txt,
                    background: verdict.bg,
                    border: `1px solid ${verdict.bdr}`,
                  }}
                >
                  {data.verdict}
                </span>
                <span style={{ fontSize: 14, color: '#BAE6FD' }}>
                  Best fit: {bestFit.label} ({bestFit.value}/100)
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
                    Risk signal
                  </p>
                  <p style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.5, margin: 0 }}>{data.risk}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14 }}>
                {[
                  { label: 'Rent guide', value: data.rent },
                  { label: 'Competition', value: data.competition },
                  { label: 'Demand type', value: data.demand },
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
                Five-factor model output
              </h2>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: C.muted, margin: '0 0 10px 0' }}>
                This suburb uses the same Gold Coast scoring engine as the parent page, so the factor values below are the direct inputs behind the final verdict.
              </p>
              <FactorGrid factors={data.factors} />
            </div>

            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 18, padding: 26 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: C.brand, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px 0' }}>
                Business Suitability
              </p>
              <h2 style={{ fontSize: 24, lineHeight: 1.15, color: C.n900, margin: '0 0 10px 0' }}>
                Cafe, restaurant, and retail fit
              </h2>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: C.muted, margin: '0 0 18px 0' }}>
                These are the existing weighted outputs from the shared Gold Coast model, not hand-written verdicts.
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
              What is driving the {data.verdict.toLowerCase()} verdict in {data.name}?
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: C.muted, margin: '0 0 18px 0', maxWidth: 920 }}>
              {data.why}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
              {[
                { label: 'Demand pattern', value: data.demand },
                { label: 'Competition reality', value: data.competition },
                { label: 'Rent guide', value: data.rent },
                { label: 'Primary risk', value: data.risk },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    background: C.n50,
                    border: `1px solid ${C.border}`,
                    borderRadius: 14,
                    padding: 16,
                  }}
                >
                  <p style={{ fontSize: 10, fontWeight: 700, color: C.mutedLight, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px 0' }}>
                    {item.label}
                  </p>
                  <p style={{ fontSize: 13, lineHeight: 1.65, color: C.n900, margin: 0 }}>
                    {item.value}
                  </p>
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
                Key takeaways
              </h2>
              <div style={{ display: 'grid', gap: 12 }}>
                {summaryItems.map((item) => (
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
                Use this suburb page as a filter, not the final lease decision
              </h2>
              <p style={{ fontSize: 14, lineHeight: 1.75, color: C.muted, margin: '0 0 18px 0' }}>
                {data.name} is strongest for {data.best.toLowerCase()}. The suburb verdict tells you whether the market conditions are supportive, but exact street position and tenancy economics still decide whether an individual site works.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link
                  href="/analyse/gold-coast"
                  style={{
                    background: C.brand,
                    color: C.white,
                    textDecoration: 'none',
                    fontWeight: 700,
                    padding: '12px 18px',
                    borderRadius: 10,
                  }}
                >
                  Back to Gold Coast overview
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

          <div style={{ paddingTop: 6 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: C.n900, margin: '0 0 18px 0' }}>
              Compare nearby Gold Coast plays
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
              {nearby.map((candidate) => (
                <SuburbCard
                  key={candidate.slug}
                  citySlug="gold-coast"
                  name={candidate.name}
                  slug={candidate.slug}
                  description={candidate.best}
                  score={candidate.compositeScore}
                  verdict={candidate.verdict === 'RISKY' ? 'NO' : candidate.verdict}
                  rentRange={candidate.rent}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
