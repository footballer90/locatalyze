export const dynamic = 'force-dynamic'

import Link from 'next/link'

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
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16, maxWidth: 1000, margin: '0 auto', padding: '48px 24px' },
  card: { border: '1px solid #E2E8F0', borderRadius: 16, padding: 20, background: '#FFFFFF', textDecoration: 'none', color: 'inherit', display: 'block' },
  cardName: { fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 4 },
  cardCity: { fontSize: 13, color: '#64748B', marginBottom: 10 },
  cta: { background: 'linear-gradient(135deg,#059669 0%,#0F766E 100%)', padding: '64px 24px', textAlign: 'center' as const },
  ctaBtn: { display: 'inline-block', background: '#FFFFFF', color: '#059669', fontWeight: 700, fontSize: 16, padding: '14px 36px', borderRadius: 100, textDecoration: 'none' },
}

export default async function SuburbsPage() {
  const { SUBURBS } = await import('@/lib/suburb-data')
  const { getScoreColor } = await import('@/lib/location-data')

  return (
    <div style={S.page}>
      <section style={S.hero}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h1 style={S.h1}>
            Best Suburbs to Open a Business<br />
            <span style={S.emerald}>in Australia</span>
          </h1>
          <p style={S.subtitle}>
            Browse demand scores, foot traffic, rent ranges and market insights for {SUBURBS.length}+ suburbs across Australia.
          </p>
        </div>
      </section>

      <div style={S.grid}>
        {SUBURBS.map(suburb => {
          const avgScore = Math.round(
            Object.values(suburb.demandScores).reduce((a, b) => a + b, 0) /
            Object.values(suburb.demandScores).length
          )
          return (
            <Link key={suburb.slug} href={`/suburb/${suburb.slug}`} style={S.card}>
              <div style={S.cardName}>{suburb.name}</div>
              <div style={S.cardCity}>{suburb.city}, {suburb.state}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 20,
                  background: suburb.footTraffic === 'Very High' ? '#D1FAE5' : suburb.footTraffic === 'High' ? '#DBEAFE' : '#FEF3C7',
                  color: suburb.footTraffic === 'Very High' ? '#059669' : suburb.footTraffic === 'High' ? '#1D4ED8' : '#D97706',
                }}>{suburb.footTraffic} traffic</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: getScoreColor(avgScore) }}>{avgScore}/100</span>
              </div>
              <div style={{ fontSize: 12, color: '#64748B', marginTop: 8 }}>{suburb.rentRange}</div>
            </Link>
          )
        })}
      </div>

      <section style={S.cta}>
        <div style={{ fontSize: 28, fontWeight: 700, color: '#FFFFFF', marginBottom: 12 }}>Analyse a Specific Address</div>
        <div style={{ fontSize: 17, color: '#A7F3D0', marginBottom: 32 }}>Get exact scores for your chosen location in 30 seconds</div>
        <Link href="/analyse" style={S.ctaBtn}>Run a Location Analysis →</Link>
      </section>
    </div>
  )
}
