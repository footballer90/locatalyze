export const dynamic = 'force-dynamic'
export const dynamicParams = true
// app/(marketing)/location/[city]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CITIES, BUSINESS_TYPES, CITY_SLUGS, getCityTypeInsight, getScoreColor } from '@/lib/location-data'

export const dynamicParams = true
export const revalidate = 86400

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }) {
  const { city: citySlug } = await params
  const city = CITIES.find(c => c.slug === citySlug)
  if (!city) return {}
  return {
    title: `Business Location Analysis ${city.name} ${city.state} | Locatalyze`,
    description: `Market analysis for opening a business in ${city.name}. Explore foot traffic, demographics, rent ranges, and opportunity scores across ${city.name}'s top suburbs.`,
    keywords: `business location ${city.name}, open business ${city.name}, ${city.name} market analysis, commercial rent ${city.name}, best suburbs for business ${city.name}`,
  }
}

const S = {
  page: { fontFamily: "'DM Sans','Inter','Helvetica Neue',Arial,sans-serif", color: '#0F172A', background: '#FFFFFF', minHeight: '100vh' },
  hero: { background: 'linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 50%, #F8FAFC 100%)', borderBottom: '1px solid #E2E8F0', padding: '80px 24px 64px' },
  heroInner: { maxWidth: 900, margin: '0 auto' },
  breadcrumb: { fontSize: 13, color: '#64748B', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6 },
  tag: { display: 'inline-block', background: '#D1FAE5', color: '#059669', borderRadius: 20, padding: '4px 14px', fontSize: 13, fontWeight: 600, marginBottom: 16 },
  h1: { fontSize: 'clamp(32px,5vw,52px)', fontWeight: 700, lineHeight: 1.1, margin: '0 0 16px', color: '#0F172A' },
  emerald: { color: '#059669' },
  subtitle: { fontSize: 18, color: '#64748B', lineHeight: 1.6, maxWidth: 640, margin: '0 0 32px' },
  statRow: { display: 'flex', flexWrap: 'wrap' as const, gap: 24, marginTop: 8 },
  stat: { background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '16px 24px', minWidth: 140 },
  statLabel: { fontSize: 12, color: '#64748B', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: 4 },
  statValue: { fontSize: 22, fontWeight: 700, color: '#0F172A' },
  section: { padding: '64px 24px' },
  inner: { maxWidth: 900, margin: '0 auto' },
  sectionTitle: { fontSize: 28, fontWeight: 700, marginBottom: 8, color: '#0F172A' },
  sectionSub: { fontSize: 16, color: '#64748B', marginBottom: 40 },
  grid2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 20 },
  grid3: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16 },
  card: { border: '1px solid #E2E8F0', borderRadius: 16, padding: 24, background: '#FFFFFF' },
  areaCard: { border: '1px solid #E2E8F0', borderRadius: 14, padding: 20, background: '#FFFFFF' },
  areaName: { fontSize: 16, fontWeight: 700, marginBottom: 4, color: '#0F172A' },
  areaVibe: { fontSize: 13, color: '#64748B', marginBottom: 12 },
  areaRent: { fontSize: 14, fontWeight: 600, color: '#059669' },
  typeGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 16 },
  typeCard: { border: '1px solid #E2E8F0', borderRadius: 14, padding: 20, background: '#FFFFFF', textDecoration: 'none', display: 'block', color: 'inherit' },
  typeEmoji: { fontSize: 28, marginBottom: 10 },
  typeName: { fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 6 },
  scoreBar: { height: 6, borderRadius: 4, background: '#E2E8F0', marginTop: 8, overflow: 'hidden' },
  scoreLabel: { fontSize: 12, color: '#64748B', marginTop: 4 },
  pillRow: { display: 'flex', flexWrap: 'wrap' as const, gap: 10, marginTop: 12 },
  pill: { fontSize: 13, background: '#F1F5F9', color: '#334155', borderRadius: 8, padding: '6px 14px' },
  pillGreen: { fontSize: 13, background: '#D1FAE5', color: '#065F46', borderRadius: 8, padding: '6px 14px' },
  cta: { background: 'linear-gradient(135deg, #059669 0%, #0F766E 100%)', padding: '64px 24px', textAlign: 'center' as const },
  ctaTitle: { fontSize: 32, fontWeight: 700, color: '#FFFFFF', marginBottom: 12 },
  ctaSub: { fontSize: 17, color: '#A7F3D0', marginBottom: 32 },
  ctaBtn: { display: 'inline-block', background: '#FFFFFF', color: '#059669', fontWeight: 700, fontSize: 16, padding: '14px 36px', borderRadius: 100, textDecoration: 'none' },
  divider: { height: 1, background: '#E2E8F0', margin: '0 24px' },
}

function trafficBadgeStyle(level: string) {
  return {
    display: 'inline-block', fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 20,
    background: level === 'Very High' ? '#D1FAE5' : level === 'High' ? '#DBEAFE' : level === 'Moderate' ? '#FEF3C7' : '#F1F5F9',
    color: level === 'Very High' ? '#059669' : level === 'High' ? '#1D4ED8' : level === 'Moderate' ? '#D97706' : '#64748B',
  }
}

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: citySlug } = await params
  const city = CITIES.find(c => c.slug === citySlug)
  if (!city) notFound()

  return (
    <div style={S.page}>
      <section style={S.hero}>
        <div style={S.heroInner}>
          <div style={S.breadcrumb}>
            <Link href="/" style={{ color: '#64748B', textDecoration: 'none' }}>Home</Link>
            <span>›</span>
            <Link href="/location" style={{ color: '#64748B', textDecoration: 'none' }}>Locations</Link>
            <span>›</span>
            <span style={{ color: '#0F172A' }}>{city.name}</span>
          </div>
          <div style={S.tag}>📍 {city.state}</div>
          <h1 style={S.h1}>
            Business Location Analysis<br />
            <span style={S.emerald}>{city.name}</span>
          </h1>
          <p style={S.subtitle}>{city.description}</p>
          <div style={S.statRow}>
            <div style={S.stat}>
              <div style={S.statLabel}>Population</div>
              <div style={S.statValue}>{city.population}</div>
            </div>
            <div style={S.stat}>
              <div style={S.statLabel}>Avg Income</div>
              <div style={S.statValue}>{city.avgIncome}</div>
            </div>
            <div style={S.stat}>
              <div style={S.statLabel}>Market Demand</div>
              <div style={{ ...S.statValue, color: getScoreColor(city.demandScore) }}>{city.demandScore}/100</div>
            </div>
            <div style={S.stat}>
              <div style={S.statLabel}>Business Climate</div>
              <div style={S.statValue}>{city.businessClimate}</div>
            </div>
          </div>
        </div>
      </section>

      <section style={S.section}>
        <div style={S.inner}>
          <h2 style={S.sectionTitle}>Top Areas in {city.name}</h2>
          <p style={S.sectionSub}>Commercial rent ranges and foot traffic by precinct</p>
          <div style={S.grid3}>
            {city.topAreas.map(area => (
              <div key={area.name} style={S.areaCard}>
                <div style={S.areaName}>{area.name}</div>
                <div style={S.areaVibe}>{area.vibe}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={S.areaRent}>{area.rentRange}</div>
                  <span style={trafficBadgeStyle(area.footTraffic)}>{area.footTraffic}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={S.divider} />

      <section style={S.section}>
        <div style={S.inner}>
          <h2 style={S.sectionTitle}>Analyse by Business Type</h2>
          <p style={S.sectionSub}>See demand scores and opportunity insights for each business category in {city.name}</p>
          <div style={S.typeGrid}>
            {BUSINESS_TYPES.map(type => {
              const insight = getCityTypeInsight(city.slug, type.slug)
              return (
                <Link key={type.slug} href={`/location/${city.slug}/${type.slug}`} style={S.typeCard}>
                  <div style={S.typeEmoji}>{type.emoji}</div>
                  <div style={S.typeName}>{type.name}</div>
                  <div style={{ fontSize: 12, color: '#64748B' }}>Demand</div>
                  <div style={S.scoreBar}>
                    <div style={{ height: '100%', width: `${insight.demandScore}%`, background: getScoreColor(insight.demandScore), borderRadius: 4 }} />
                  </div>
                  <div style={S.scoreLabel}>{insight.demandScore}/100 · {insight.verdict}</div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <div style={S.divider} />

      <section style={S.section}>
        <div style={S.inner}>
          <div style={S.grid2}>
            <div style={S.card}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: '#059669' }}>✓ Market Strengths</h3>
              <div style={S.pillRow}>
                {city.strengths.map(s => <span key={s} style={S.pillGreen}>{s}</span>)}
              </div>
            </div>
            <div style={S.card}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: '#DC2626' }}>⚠ Market Challenges</h3>
              <div style={S.pillRow}>
                {city.challenges.map(c => <span key={c} style={S.pill}>{c}</span>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div style={S.divider} />

      <section style={S.section}>
        <div style={S.inner}>
          <h2 style={S.sectionTitle}>Economic Overview</h2>
          <div style={{ ...S.card, display: 'flex', flexWrap: 'wrap' as const, gap: 32 }}>
            <div style={{ flex: '1 1 280px' }}>
              <div style={S.statLabel}>Key Industries</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#0F172A', marginTop: 8 }}>{city.economy}</div>
            </div>
            <div style={{ flex: '1 1 280px' }}>
              <div style={S.statLabel}>City Tagline</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#0F172A', marginTop: 8 }}>{city.tagline}</div>
            </div>
          </div>
        </div>
      </section>

      <section style={S.cta}>
        <div style={S.ctaTitle}>Ready to Analyse a Location in {city.name}?</div>
        <div style={S.ctaSub}>Get a full feasibility report with scores, competitor analysis, and financial estimates</div>
        <Link href="/analyse" style={S.ctaBtn}>Analyse a Location →</Link>
      </section>
    </div>
  )
}
