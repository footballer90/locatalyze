// app/(marketing)/analyse/[city]/page.tsx
// Dynamic city route — handles /analyse/{city} for cities without a static page
// generateStaticParams pre-renders all supported city slugs at build time

import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getCityPageData, SUPPORTED_CITY_SLUGS } from '@/lib/analyse-data/cities'
import { CityHero } from '@/components/analyse/CityHero'
import { SuburbCard } from '@/components/analyse/SuburbCard'
import { ComparisonTable } from '@/components/analyse/ComparisonTable'
import { FAQSection } from '@/components/analyse/FAQSection'
import { CTASection } from '@/components/analyse/CTASection'
import { C } from '@/components/analyse/AnalyseTheme'

interface Props {
  params: Promise<{ city: string }>
}

export async function generateStaticParams() {
  return SUPPORTED_CITY_SLUGS.map((city) => ({ city }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params
  const data = getCityPageData(city)
  if (!data) return { title: 'City Not Found' }
  return {
    title: data.metaTitle,
    description: data.metaDescription,
    alternates: {
      canonical: `https://www.locatalyze.com/analyse/${city}`,
    },
    openGraph: {
      title: data.metaTitle,
      description: data.metaDescription,
      url: `https://www.locatalyze.com/analyse/${city}`,
    },
  }
}

export default async function CityPage({ params }: Props) {
  const { city } = await params
  const data = getCityPageData(city)

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

  return (
    <div style={{ backgroundColor: '#FFFFFF', color: '#1C1917', minHeight: '100vh' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Hero */}
      <CityHero
        cityName={data.name}
        citySlug={data.slug}
        tagline={data.tagline}
        statChips={data.stats.slice(0, 3).map((s) => ({ text: `${s.value} — ${s.label.split(' ').slice(0, 6).join(' ')}...` }))}
      />

      {/* Methodology Banner */}
      <div
        style={{
          backgroundColor: C.amberBg,
          borderBottom: `1px solid ${C.amberBdr}`,
          padding: '12px 24px',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ fontSize: '13px', color: C.amber, margin: 0 }}>
            <strong>Methodology:</strong> Scores based on foot traffic density, demographic income distribution, commercial rent viability, competitive density, and accessibility. Data sourced from ABS (2024), CoreLogic, CBRE, and Locatalyze proprietary analysis.
          </p>
        </div>
      </div>

      {/* Stats */}
      <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '20px',
            }}
          >
            {data.stats.map((stat) => (
              <div
                key={stat.value}
                style={{
                  padding: '24px',
                  backgroundColor: C.white,
                  borderRadius: '12px',
                  border: `1px solid ${C.border}`,
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: '30px',
                    fontWeight: 800,
                    color: C.brand,
                    marginBottom: '8px',
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: C.n800, marginBottom: '6px', lineHeight: '1.4' }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: '11px', color: C.mutedLight }}>{stat.source}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Overview */}
      <section style={{ padding: '56px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '28px' }}>
            {data.name} Business Landscape
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '20px',
              fontSize: '16px',
              lineHeight: '1.75',
              color: C.n800,
            }}
          >
            {data.overviewParagraphs.map((para, i) => (
              <p key={i} style={{ margin: 0 }}>
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Business Types */}
      {data.businessTypes.length > 0 && (
        <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>
              Where to Locate by Business Type
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '20px',
              }}
            >
              {data.businessTypes.map((bt) => (
                <div
                  key={bt.type}
                  style={{
                    padding: '20px',
                    backgroundColor: C.white,
                    borderRadius: '10px',
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: C.brand, marginBottom: '8px' }}>
                    {bt.type}
                  </h3>
                  <p style={{ fontSize: '13px', color: C.muted, lineHeight: '1.6', margin: '0 0 10px' }}>
                    {bt.insight}
                  </p>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {bt.bestSuburbs.map((s) => (
                      <span
                        key={s}
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          padding: '3px 8px',
                          backgroundColor: C.n100,
                          borderRadius: '4px',
                          color: C.n700,
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Suburb Directory */}
      <section id="suburbs" style={{ padding: '56px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '12px' }}>
            Suburb Directory
          </h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px' }}>
            All suburbs scored across foot traffic, demographics, rent viability, competition gap, and accessibility.
          </p>

          {data.suburbCategories.map((category) => (
            <div key={category.title} style={{ marginBottom: '52px' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: C.brand, marginBottom: '6px' }}>
                  {category.title}
                </h3>
                <p style={{ fontSize: '14px', color: C.muted, margin: 0 }}>
                  {category.description}
                </p>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '16px',
                }}
              >
                {category.suburbs.map((suburb) => (
                  <SuburbCard
                    key={suburb.slug}
                    name={suburb.name}
                    slug={suburb.slug}
                    citySlug={data.slug}
                    description={suburb.description}
                    score={suburb.score}
                    verdict={suburb.verdict}
                    rentRange={suburb.rentRange}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      {data.suburbCategories.flatMap((c) => c.suburbs).length > 3 && (
        <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>
              Quick Comparison
            </h2>
            <ComparisonTable
              rows={data.suburbCategories
                .flatMap((c) => c.suburbs)
                .slice(0, 8)
                .map((s) => ({
                  name: s.name,
                  score: s.score,
                  verdict: s.verdict,
                  rent: s.rentRange,
                  footTraffic: s.score >= 85 ? 'Very High' : s.score >= 75 ? 'High' : s.score >= 65 ? 'Medium' : 'Lower',
                  bestFor: s.description.split('.')[0],
                }))}
            />
          </div>
        </section>
      )}

      {/* Suburb Analysis */}
      {data.comparisons.length > 0 && (
        <section style={{ padding: '48px 24px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>
              Head-to-Head: Suburb Analysis
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                gap: '20px',
              }}
            >
              {data.comparisons.map((comp) => (
                <div
                  key={comp.title}
                  style={{
                    padding: '24px',
                    backgroundColor: C.white,
                    borderRadius: '10px',
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: C.brand, marginBottom: '12px' }}>
                    {comp.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: C.n800, lineHeight: '1.7', margin: 0 }}>
                    {comp.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Hidden Gems */}
      {data.hiddenGems.length > 0 && (
        <section style={{ padding: '48px 24px', backgroundColor: C.purpleBg }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '8px' }}>
              Underrated Suburbs Worth Considering
            </h2>
            <p style={{ fontSize: '15px', color: C.muted, marginBottom: '28px' }}>
              Markets that consistently outperform their reputation — and their rent.
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '20px',
              }}
            >
              {data.hiddenGems.map((gem) => (
                <Link
                  key={gem.slug}
                  href={`/analyse/${data.slug}/${gem.slug}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    style={{
                      padding: '22px',
                      backgroundColor: C.white,
                      borderRadius: '10px',
                      border: `1px solid ${C.border}`,
                      cursor: 'pointer',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '10px',
                      }}
                    >
                      <h3 style={{ fontSize: '16px', fontWeight: 700, color: C.n900, margin: 0 }}>
                        {gem.name}
                      </h3>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          color: C.purple,
                          backgroundColor: C.purpleBg,
                          padding: '3px 10px',
                          borderRadius: '20px',
                          border: `1px solid rgba(124,58,237,0.2)`,
                        }}
                      >
                        UNDERRATED
                      </span>
                    </div>
                    <p style={{ fontSize: '13px', color: C.muted, lineHeight: '1.65', margin: 0 }}>
                      {gem.why}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* High Risk Zones */}
      {data.highRiskZones.length > 0 && (
        <section style={{ padding: '48px 24px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '8px' }}>
              High-Risk Zones
            </h2>
            <p style={{ fontSize: '15px', color: C.muted, marginBottom: '28px' }}>
              Oversaturated or economically challenging locations where most operators struggle.
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '20px',
              }}
            >
              {data.highRiskZones.map((zone) => (
                <div
                  key={zone.slug}
                  style={{
                    padding: '22px',
                    backgroundColor: C.redBg,
                    borderRadius: '10px',
                    border: `1px solid ${C.redBdr}`,
                  }}
                >
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: C.red, marginBottom: '10px' }}>
                    Warning {zone.name}
                  </h3>
                  <p style={{ fontSize: '13px', color: C.n800, lineHeight: '1.65', margin: 0 }}>
                    {zone.why}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <FAQSection faqs={data.faqs} title={`${data.name} Business Location — FAQ`} />

      {/* CTA */}
      <CTASection
        title={`Ready to find your ${data.name} location?`}
        subtitle={`Run a free analysis on any ${data.name} address. Get foot traffic data, demographic breakdown, rent benchmarks, and competitive analysis in minutes.`}
        variant="green"
      />

      {/* Footer Nav */}
      <section
        style={{
          padding: '28px 24px',
          backgroundColor: C.n50,
          borderTop: `1px solid ${C.border}`,
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            gap: '20px',
            flexWrap: 'wrap',
            fontSize: '13px',
          }}
        >
          <Link href="/analyse" style={{ color: C.brand, fontWeight: 600, textDecoration: 'none' }}>
            ← All Cities
          </Link>
          {data.suburbCategories[0]?.suburbs.slice(0, 3).map((s) => (
            <Link
              key={s.slug}
              href={`/analyse/${data.slug}/${s.slug}`}
              style={{ color: C.brand, textDecoration: 'none', fontWeight: 500 }}
            >
              {s.name} →
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
