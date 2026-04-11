// app/(marketing)/analyse/[city]/[suburb]/page.tsx
// Dynamic suburb route — handles /analyse/{city}/{suburb}
// generateStaticParams pre-renders all suburbs in the data layer

import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getSuburbPageData, getAllSuburbKeys } from '@/lib/analyse-data/suburbs'
import { ScoreBar } from '@/components/analyse/ScoreBar'
import { VerdictBadge } from '@/components/analyse/VerdictBadge'
import { RiskBadge } from '@/components/analyse/RiskBadge'
import { FAQSection } from '@/components/analyse/FAQSection'
import { CTASection } from '@/components/analyse/CTASection'
import { PollSection } from '@/components/analyse/PollSection'
import { SuburbCard } from '@/components/analyse/SuburbCard'
import { C } from '@/components/analyse/AnalyseTheme'

interface Props {
  params: Promise<{ city: string; suburb: string }>
}

export async function generateStaticParams() {
  return getAllSuburbKeys().map(({ citySlug, suburbSlug }) => ({
    city: citySlug,
    suburb: suburbSlug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city, suburb } = await params
  const data = getSuburbPageData(city, suburb)
  if (!data) return { title: 'Suburb Not Found' }
  return {
    title: data.metaTitle,
    description: data.metaDescription,
    alternates: {
      canonical: `https://www.locatalyze.com/analyse/${city}/${suburb}`,
    },
    openGraph: {
      title: data.metaTitle,
      description: data.metaDescription,
      url: `https://www.locatalyze.com/analyse/${city}/${suburb}`,
    },
  }
}

export default async function SuburbPage({ params }: Props) {
  const { city, suburb } = await params
  const data = getSuburbPageData(city, suburb)

  if (!data) {
    notFound()
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.metaTitle,
    description: data.metaDescription,
    author: { '@type': 'Organization', name: 'Locatalyze' },
    publisher: { '@type': 'Organization', name: 'Locatalyze', url: 'https://www.locatalyze.com' },
    dateModified: '2026-03-01',
  }

  const scoreColor =
    data.overallScore >= 80 ? C.emerald : data.overallScore >= 65 ? C.brand : C.amber

  return (
    <div style={{ backgroundColor: '#FFFFFF', color: '#1C1917', minHeight: '100vh' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Sticky Nav */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          backgroundColor: C.white,
          borderBottom: `1px solid ${C.border}`,
          zIndex: 40,
          padding: '12px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', gap: '6px', fontSize: '13px', color: C.muted, alignItems: 'center' }}>
          <Link href="/analyse" style={{ color: C.brand, textDecoration: 'none' }}>Analyse</Link>
          <span>›</span>
          <Link href={`/analyse/${city}`} style={{ color: C.brand, textDecoration: 'none' }}>{data.city}</Link>
          <span>›</span>
          <span style={{ fontWeight: 600, color: C.n900 }}>{data.name}</span>
        </div>
        <Link
          href="/onboarding"
          style={{
            padding: '8px 18px',
            backgroundColor: C.emerald,
            color: C.white,
            borderRadius: '6px',
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: 700,
          }}
        >
          Analyse free →
        </Link>
      </nav>

      {/* Hero */}
      <section
        style={{
          padding: '56px 24px',
          backgroundColor: C.white,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <div style={{ fontSize: '13px', color: C.muted, marginBottom: '8px' }}>
                {data.state} {data.postcode}
              </div>
              <h1
                style={{
                  fontSize: 'clamp(32px, 5vw, 48px)',
                  fontWeight: 800,
                  color: C.n900,
                  margin: 0,
                  lineHeight: '1.15',
                }}
              >
                {data.name}
              </h1>
            </div>
            <RiskBadge verdict={data.verdict} />
          </div>

          <p
            style={{
              fontSize: '17px',
              lineHeight: '1.7',
              color: C.muted,
              maxWidth: '860px',
              marginBottom: '36px',
            }}
          >
            {data.summary}
          </p>

          {/* Score Panel */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: '32px',
              backgroundColor: C.n50,
              borderRadius: '14px',
              padding: '28px 32px',
              border: `1px solid ${C.border}`,
              alignItems: 'start',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '64px',
                  fontWeight: 900,
                  color: scoreColor,
                  lineHeight: 1,
                  marginBottom: '4px',
                }}
              >
                {data.overallScore}
              </div>
              <div style={{ fontSize: '12px', color: C.muted, fontWeight: 600 }}>/ 100</div>
              <div style={{ marginTop: '10px' }}>
                <VerdictBadge verdict={data.verdict} size="md" />
              </div>
            </div>
            <div style={{ minWidth: 0 }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: C.n700, marginBottom: '16px' }}>
                Score Breakdown
              </h3>
              <ScoreBar label="Foot Traffic" value={data.scores.footTraffic} />
              <ScoreBar label="Area Demographics" value={data.scores.demographics} />
              <ScoreBar label="Rent Viability" value={data.scores.rentViability} />
              <ScoreBar label="Competition Gap" value={data.scores.competitionGap} />
              <ScoreBar label="Accessibility" value={data.scores.accessibility} />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section style={{ padding: '32px 24px', backgroundColor: C.n50, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            {[
              { label: 'Median Income', value: data.medianIncome },
              { label: 'Population', value: data.population.split('+')[0].trim() },
              { label: 'Competition', value: data.competitionLevel },
              { label: 'Verdict', value: data.verdict },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  backgroundColor: C.white,
                  borderRadius: '8px',
                  border: `1px solid ${C.border}`,
                  padding: '16px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '11px', color: C.mutedLight, fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: C.n900 }}>{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rent Ranges */}
      <section style={{ padding: '48px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: C.n900, marginBottom: '20px' }}>
            Commercial Rent Guide — {data.name}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
            {data.rentRanges.map((r) => (
              <div
                key={r.label}
                style={{
                  backgroundColor: C.white,
                  borderRadius: '10px',
                  border: `1px solid ${C.border}`,
                  padding: '20px',
                }}
              >
                <div style={{ fontSize: '12px', color: C.muted, marginBottom: '8px', fontWeight: 600 }}>
                  {r.label}
                </div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: C.brand, marginBottom: '6px' }}>
                  {r.range}
                </div>
                <div style={{ fontSize: '12px', color: C.muted, lineHeight: '1.5' }}>{r.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '40px',
            }}
          >
            {data.sections.map((section) => (
              <div key={section.heading}>
                <h2
                  style={{
                    fontSize: '22px',
                    fontWeight: 700,
                    color: C.n900,
                    marginBottom: '14px',
                    lineHeight: '1.3',
                  }}
                >
                  {section.heading}
                </h2>
                <p
                  style={{
                    fontSize: '15px',
                    lineHeight: '1.8',
                    color: C.n800,
                    margin: 0,
                  }}
                >
                  {section.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages & Disadvantages */}
      <section style={{ padding: '48px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>
            Advantages & Disadvantages
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {/* Advantages */}
            <div
              style={{
                backgroundColor: C.emeraldBg,
                border: `1px solid ${C.emeraldBdr}`,
                borderRadius: '12px',
                padding: '24px',
              }}
            >
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: C.emerald, marginBottom: '16px' }}>
                ✓ Advantages
              </h3>
              <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {data.advantages.map((adv) => (
                  <li key={adv} style={{ fontSize: '14px', color: C.n800, lineHeight: '1.6' }}>
                    {adv}
                  </li>
                ))}
              </ul>
            </div>
            {/* Disadvantages */}
            <div
              style={{
                backgroundColor: C.amberBg,
                border: `1px solid ${C.amberBdr}`,
                borderRadius: '12px',
                padding: '24px',
              }}
            >
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: C.amber, marginBottom: '16px' }}>
                ⚠ Disadvantages
              </h3>
              <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {data.disadvantages.map((dis) => (
                  <li key={dis} style={{ fontSize: '14px', color: C.n800, lineHeight: '1.6' }}>
                    {dis}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Case Scenario */}
      <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: C.n900, marginBottom: '20px' }}>
            Mini Case Scenario
          </h2>
          <div
            style={{
              backgroundColor: C.white,
              border: `1px solid ${C.border}`,
              borderRadius: '14px',
              padding: '28px',
            }}
          >
            <div style={{ marginBottom: '20px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: C.brand,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  backgroundColor: C.n100,
                  padding: '4px 10px',
                  borderRadius: '4px',
                }}
              >
                Concept
              </span>
              <p
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: C.n900,
                  margin: '10px 0 0',
                  lineHeight: '1.5',
                }}
              >
                {data.caseScenario.concept}
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '16px',
                marginBottom: '24px',
                padding: '20px',
                backgroundColor: C.n50,
                borderRadius: '10px',
              }}
            >
              {[
                { label: 'Monthly Rent', value: `$${data.caseScenario.monthlyRent.toLocaleString()}` },
                { label: 'Daily Covers Needed', value: `${data.caseScenario.dailyCoversRequired}` },
                { label: 'Avg Spend', value: `$${data.caseScenario.avgSpend}` },
                { label: 'Break-even', value: data.caseScenario.breakEvenTimeline.split(' ').slice(0, 2).join(' ') },
              ].map((m) => (
                <div key={m.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: C.mutedLight, marginBottom: '4px', fontWeight: 600 }}>
                    {m.label}
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: C.brand }}>
                    {m.value}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 700, color: C.n700, marginBottom: '10px' }}>
                Key Assumptions
              </h4>
              <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {data.caseScenario.keyAssumptions.map((a) => (
                  <li key={a} style={{ fontSize: '13px', color: C.muted, lineHeight: '1.6' }}>
                    {a}
                  </li>
                ))}
              </ul>
            </div>

            <div
              style={{
                padding: '16px',
                backgroundColor: data.verdict === 'GO' ? C.emeraldBg : data.verdict === 'CAUTION' ? C.amberBg : C.redBg,
                border: `1px solid ${data.verdict === 'GO' ? C.emeraldBdr : data.verdict === 'CAUTION' ? C.amberBdr : C.redBdr}`,
                borderRadius: '8px',
              }}
            >
              <p
                style={{
                  fontSize: '14px',
                  color: C.n800,
                  lineHeight: '1.7',
                  margin: 0,
                }}
              >
                <strong>Verdict:</strong> {data.caseScenario.verdict}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Poll */}
      <PollSection suburbName={data.name} />

      {/* Nearby Suburbs */}
      {data.nearbySuburbs.length > 0 && (
        <section style={{ padding: '48px 24px' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: C.n900, marginBottom: '20px' }}>
              Compare Nearby Suburbs
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '16px',
              }}
            >
              {data.nearbySuburbs.map((ns) => (
                <SuburbCard
                  key={ns.slug}
                  name={ns.name}
                  slug={ns.slug}
                  citySlug={data.citySlug}
                  description=""
                  score={ns.score}
                  verdict={ns.verdict}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Target Customer */}
      <section style={{ padding: '32px 24px', backgroundColor: C.n50, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div
            style={{
              padding: '20px 24px',
              backgroundColor: C.white,
              borderRadius: '10px',
              border: `1px solid ${C.border}`,
            }}
          >
            <span style={{ fontSize: '12px', fontWeight: 700, color: C.brand, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Target Customer Profile
            </span>
            <p style={{ fontSize: '15px', color: C.n800, margin: '8px 0 0', lineHeight: '1.6' }}>
              {data.targetCustomer}
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection faqs={data.faqs} title={`${data.name} Business FAQs`} />

      {/* CTA */}
      <CTASection
        title={`Ready to analyse ${data.name}?`}
        subtitle={`Get a full data-driven analysis for any ${data.name} address — foot traffic, rent benchmarks, competitive mapping, and a GO/CAUTION/NO verdict.`}
        variant="teal"
      />

      {/* Footer Nav */}
      <section
        style={{
          padding: '24px',
          backgroundColor: C.n50,
          borderTop: `1px solid ${C.border}`,
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '13px' }}>
          <Link href={`/analyse/${city}`} style={{ color: C.brand, fontWeight: 600, textDecoration: 'none' }}>
            ← Back to {data.city}
          </Link>
          <Link href="/analyse" style={{ color: C.brand, textDecoration: 'none' }}>
            All cities →
          </Link>
          <Link href="/onboarding" style={{ color: C.emerald, fontWeight: 700, textDecoration: 'none' }}>
            Analyse your location free →
          </Link>
        </div>
      </section>
    </div>
  )
}
