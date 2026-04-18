// app/(marketing)/location/page.tsx
import Link from 'next/link'
import { CITIES, BUSINESS_TYPES, getScoreColor } from '@/lib/location-data'

export const metadata = {
  title: 'Business Location Analysis — Australian Cities | Locatalyze',
  description: 'Market demand scores, rent ranges and opportunity insights for opening a business across all major Australian cities. Compare cafes, restaurants, retail, gyms and takeaway markets.',
}

const S = {
  page: { fontFamily: "'DM Sans','Inter','Helvetica Neue',Arial,sans-serif", color: '#0F172A', background: '#FFFFFF', minHeight: '100vh' },
  hero: { background: 'linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 50%, #F8FAFC 100%)', borderBottom: '1px solid #E2E8F0', padding: '80px 24px 64px', textAlign: 'center' as const },
  h1: { fontSize: 'clamp(32px,5vw,56px)', fontWeight: 700, lineHeight: 1.1, margin: '0 0 16px', color: '#0F172A' },
  emerald: { color: '#059669' },
  subtitle: { fontSize: 18, color: '#64748B', lineHeight: 1.6, maxWidth: 600, margin: '0 auto 32px' },
  statRow: { display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap' as const },
  statBox: { textAlign: 'center' as const },
  statNum: { fontSize: 36, fontWeight: 800, color: '#059669' },
  statLabel: { fontSize: 14, color: '#64748B' },
  section: { padding: '64px 24px' },
  inner: { maxWidth: 1100, margin: '0 auto' },
  sectionTitle: { fontSize: 28, fontWeight: 700, marginBottom: 8, color: '#0F172A' },
  sectionSub: { fontSize: 16, color: '#64748B', marginBottom: 40 },
  cityGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20 },
  cityCard: { border: '1px solid #E2E8F0', borderRadius: 16, padding: 24, textDecoration: 'none', color: 'inherit', display: 'block', background: '#FFFFFF' },
  cityTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  cityName: { fontSize: 20, fontWeight: 700, color: '#0F172A' },
  cityState: { fontSize: 12, background: '#F1F5F9', color: '#64748B', borderRadius: 6, padding: '3px 10px', fontWeight: 600 },
  cityDesc: { fontSize: 14, color: '#64748B', lineHeight: 1.5, marginBottom: 16 },
  scoreRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderTop: '1px solid #F1F5F9' },
  typeStrip: { display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' as const },
  typePill: { fontSize: 12, background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 6, padding: '4px 10px', textDecoration: 'none', color: '#334155' },
  cta: { background: 'linear-gradient(135deg, #059669 0%, #0F766E 100%)', padding: '64px 24px', textAlign: 'center' as const },
  ctaTitle: { fontSize: 32, fontWeight: 700, color: '#FFFFFF', marginBottom: 12 },
  ctaSub: { fontSize: 17, color: '#A7F3D0', marginBottom: 32 },
  ctaBtn: { display: 'inline-block', background: '#FFFFFF', color: '#059669', fontWeight: 700, fontSize: 16, padding: '14px 36px', borderRadius: 100, textDecoration: 'none' },

}

export default function LocationIndexPage() {
  return (
    <div style={S.page}>
      <section style={S.hero}>
        <h1 style={S.h1}>
          Business Location Analysis<br />
          <span style={S.emerald}>Across Australia</span>
        </h1>
        <p style={S.subtitle}>
          Market demand scores, rent ranges, and opportunity insights for every major Australian city — by business type.
        </p>
        <div style={S.statRow}>
          <div style={S.statBox}>
            <div style={S.statNum}>12</div>
            <div style={S.statLabel}>Cities Covered</div>
          </div>
          <div style={S.statBox}>
            <div style={S.statNum}>5</div>
            <div style={S.statLabel}>Business Types</div>
          </div>
          <div style={S.statBox}>
            <div style={S.statNum}>72</div>
            <div style={S.statLabel}>Market Reports</div>
          </div>
        </div>
      </section>

      <section style={S.section}>
        <div style={S.inner}>
          <h2 style={S.sectionTitle}>Choose a City</h2>
          <p style={S.sectionSub}>Select a city to see market overview and business type breakdowns</p>
          <div style={S.cityGrid}>
            {CITIES.map(city => (
              <Link key={city.slug} href={`/location/${city.slug}`} style={S.cityCard}>
                <div style={S.cityTop}>
                  <div style={S.cityName}>{city.name}</div>
                  <span style={S.cityState}>{city.state}</span>
                </div>
                <div style={S.cityDesc}>{city.tagline}</div>
                <div style={S.scoreRow}>
                  <span style={{ fontSize: 13, color: '#64748B' }}>Market Demand</span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: getScoreColor(city.demandScore) }}>{city.demandScore}/100</span>
                </div>
                <div style={S.scoreRow}>
                  <span style={{ fontSize: 13, color: '#64748B' }}>Population</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>{city.population}</span>
                </div>
                <div style={S.typeStrip}>
                  {BUSINESS_TYPES.map(t => (
                    <span key={t.slug} style={S.typePill}>{t.emoji} {t.name}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>


      <section style={S.cta}>
        <div style={S.ctaTitle}>Need a Specific Address Analysed?</div>
        <div style={S.ctaSub}>Enter any suburb in Australia and get a full feasibility report in minutes</div>
        <Link href="/analyse" style={S.ctaBtn}>Start a Location Analysis →</Link>
      </section>
    </div>
  )
}