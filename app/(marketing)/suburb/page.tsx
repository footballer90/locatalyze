// app/(marketing)/suburb/page.tsx
import Link from 'next/link'
import { SUBURBS } from '@/lib/suburb-data'
import { getScoreColor } from '@/lib/location-data'

export const metadata = {
  title: 'Best Suburbs to Open a Business in Australia | Locatalyze',
  description: 'Suburb-level market analysis for opening a café, restaurant, retail store, gym or takeaway in Australia. Browse demand scores, foot traffic, rent ranges for 60+ suburbs.',
}

const S = {
  page: { fontFamily: "'DM Sans','Inter','Helvetica Neue',Arial,sans-serif", color: '#0F172A', background: '#FFFFFF', minHeight: '100vh' },
  hero: { background: 'linear-gradient(135deg,#F0FDF4 0%,#ECFDF5 50%,#F8FAFC 100%)', borderBottom: '1px solid #E2E8F0', padding: '80px 24px 64px', textAlign: 'center' as const },
  h1: { fontSize: 'clamp(28px,4.5vw,52px)', fontWeight: 700, lineHeight: 1.1, margin: '0 0 16px', color: '#0F172A' },
  emerald: { color: '#059669' },
  subtitle: { fontSize: 18, color: '#64748B', lineHeight: 1.6, maxWidth: 600, margin: '0 auto 40px' },
  statRow: { display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' as const },
  statBox: { textAlign: 'center' as const },
  statNum: { fontSize: 40, fontWeight: 800, color: '#059669' },
  statLabel: { fontSize: 14, color: '#64748B' },
  section: { padding: '56px 24px' },
  inner: { maxWidth: 1100, margin: '0 auto' },
  cityHeader: { fontSize: 22, fontWeight: 700, color: '#0F172A', marginBottom: 16, paddingBottom: 12, borderBottom: '2px solid #059669', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cityLink: { fontSize: 14, color: '#059669', textDecoration: 'none', fontWeight: 600 },
  suburbGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 14, marginBottom: 48 },
  suburbCard: { border: '1px solid #E2E8F0', borderRadius: 14, padding: 18, textDecoration: 'none', color: 'inherit', display: 'block', background: '#FFFFFF' },
  suburbName: { fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 4 },
  suburbVibe: { fontSize: 13, color: '#64748B', marginBottom: 12 },
  scoreRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  rentTag: { fontSize: 12, color: '#059669', fontWeight: 600 },
  trafficBadge: (t: string) => ({
    fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
    background: t === 'Very High' ? '#D1FAE5' : t === 'High' ? '#DBEAFE' : t === 'Moderate' ? '#FEF3C7' : '#F1F5F9',
    color: t === 'Very High' ? '#059669' : t === 'High' ? '#1D4ED8' : t === 'Moderate' ? '#D97706' : '#64748B',
  }),
  cta: { background: 'linear-gradient(135deg,#059669 0%,#0F766E 100%)', padding: '64px 24px', textAlign: 'center' as const },
  ctaTitle: { fontSize: 28, fontWeight: 700, color: '#FFFFFF', marginBottom: 12 },
  ctaSub: { fontSize: 17, color: '#A7F3D0', marginBottom: 32 },
  ctaBtn: { display: 'inline-block', background: '#FFFFFF', color: '#059669', fontWeight: 700, fontSize: 16, padding: '14px 36px', borderRadius: 100, textDecoration: 'none' },
}

// Group suburbs by city
const CITIES_ORDER = ['perth','sydney','melbourne','brisbane','adelaide','gold-coast','canberra','newcastle']

export default function SuburbIndexPage() {
  const grouped = CITIES_ORDER.map(citySlug => ({
    citySlug,
    cityName: SUBURBS.find(s => s.citySlug === citySlug)?.city ?? citySlug,
    suburbs: SUBURBS.filter(s => s.citySlug === citySlug),
  })).filter(g => g.suburbs.length > 0)

  return (
    <div style={S.page}>
      <section style={S.hero}>
        <h1 style={S.h1}>
          Best Suburbs to Open a Business<br />
          <span style={S.emerald}>Across Australia</span>
        </h1>
        <p style={S.subtitle}>
          Suburb-level demand scores, foot traffic, rent ranges and market insights — for every major Australian city.
        </p>
        <div style={S.statRow}>
          <div style={S.statBox}>
            <div style={S.statNum}>{SUBURBS.length}+</div>
            <div style={S.statLabel}>Suburbs Analysed</div>
          </div>
          <div style={S.statBox}>
            <div style={S.statNum}>8</div>
            <div style={S.statLabel}>Cities Covered</div>
          </div>
          <div style={S.statBox}>
            <div style={S.statNum}>5</div>
            <div style={S.statLabel}>Business Types</div>
          </div>
        </div>
      </section>

      <section style={S.section}>
        <div style={S.inner}>
          {grouped.map(({ citySlug, cityName, suburbs }) => (
            <div key={citySlug}>
              <div style={S.cityHeader}>
                <span>{cityName}</span>
                <Link href={`/location/${citySlug}`} style={S.cityLink}>View {cityName} overview →</Link>
              </div>
              <div style={S.suburbGrid}>
                {suburbs.map(suburb => {
                  const topScore = Math.max(...Object.values(suburb.demandScores))
                  return (
                    <Link key={suburb.slug} href={`/suburb/${suburb.slug}`} style={S.suburbCard}>
                      <div style={S.suburbName}>{suburb.name}</div>
                      <div style={S.suburbVibe}>{suburb.vibe}</div>
                      <div style={S.scoreRow}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: getScoreColor(topScore) }}>
                          {topScore}/100 peak demand
                        </span>
                        <span style={S.trafficBadge(suburb.footTraffic)}>{suburb.footTraffic}</span>
                      </div>
                      <div style={{ ...S.rentTag, marginTop: 8 }}>{suburb.rentRange}</div>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={S.cta}>
        <div style={S.ctaTitle}>Need a Precise Location Score?</div>
        <div style={S.ctaSub}>Enter any suburb and business type to get a full feasibility report</div>
        <Link href="/analyse" style={S.ctaBtn}>Analyse a Location →</Link>
      </section>
    </div>
  )
}