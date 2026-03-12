export const dynamic = 'force-dynamic'
export const dynamicParams = true
// app/(marketing)/location/[city]/[type]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
// lazy-loaded below


export async function generateMetadata({ params }: { params: Promise<{ city: string; type: string }> }) {
  const { city: citySlug, type: typeSlug } = await params
  const city = CITIES.find(c => c.slug === citySlug)
  const type = BUSINESS_TYPES.find(t => t.slug === typeSlug)
  if (!city || !type) return {}
  return {
    title: `${type.name} Market Analysis ${city.name} ${city.state} | Locatalyze`,
    description: `Is ${city.name} a good location to open a ${type.name.toLowerCase().replace(/s$/, '')}? Full market demand analysis, top suburbs, rent ranges, competition scores, and SWOT.`,
    keywords: `open ${type.name.toLowerCase()} ${city.name}, ${type.name.toLowerCase()} market ${city.name}, best location ${type.name.toLowerCase()} ${city.name}, ${city.name} ${type.name.toLowerCase()} analysis`,
  }
}

const S = {
  page: { fontFamily: "'DM Sans','Inter','Helvetica Neue',Arial,sans-serif", color: '#0F172A', background: '#FFFFFF', minHeight: '100vh' },
  hero: { background: 'linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 50%, #F8FAFC 100%)', borderBottom: '1px solid #E2E8F0', padding: '80px 24px 64px' },
  heroInner: { maxWidth: 900, margin: '0 auto' },
  breadcrumb: { fontSize: 13, color: '#64748B', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' as const },
  h1: { fontSize: 'clamp(28px,4vw,48px)', fontWeight: 700, lineHeight: 1.15, margin: '0 0 16px', color: '#0F172A' },
  emerald: { color: '#059669' },
  subtitle: { fontSize: 18, color: '#64748B', lineHeight: 1.6, maxWidth: 640, margin: '0 0 32px' },
  statRow: { display: 'flex', flexWrap: 'wrap' as const, gap: 20 },
  stat: { background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '16px 24px', minWidth: 130 },
  statLabel: { fontSize: 12, color: '#64748B', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: 4 },
  statValue: { fontSize: 22, fontWeight: 700, color: '#0F172A' },
  section: { padding: '64px 24px' },
  inner: { maxWidth: 900, margin: '0 auto' },
  sectionTitle: { fontSize: 26, fontWeight: 700, marginBottom: 8, color: '#0F172A' },
  sectionSub: { fontSize: 16, color: '#64748B', marginBottom: 36 },
  grid2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 },
  card: { border: '1px solid #E2E8F0', borderRadius: 16, padding: 24, background: '#FFFFFF' },
  scoreRow: { display: 'flex', flexDirection: 'column' as const, gap: 16 },
  scoreLine: { display: 'flex', flexDirection: 'column' as const, gap: 6 },
  scoreHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  scoreName: { fontSize: 14, fontWeight: 600, color: '#0F172A' },
  barBg: { height: 8, borderRadius: 8, background: '#E2E8F0', overflow: 'hidden' },
  divider: { height: 1, background: '#E2E8F0' },
  swotGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16 },
  suburbGrid: { display: 'flex', flexWrap: 'wrap' as const, gap: 10 },
  suburb: { background: '#F0FDF4', border: '1px solid #A7F3D0', color: '#065F46', borderRadius: 8, padding: '8px 16px', fontSize: 14, fontWeight: 600 },
  insightBox: { background: 'linear-gradient(135deg, #F0FDF4, #ECFDF5)', border: '1px solid #A7F3D0', borderRadius: 16, padding: 28 },
  insightText: { fontSize: 17, lineHeight: 1.7, color: '#0F172A', fontStyle: 'italic' as const },
  cta: { background: 'linear-gradient(135deg, #059669 0%, #0F766E 100%)', padding: '64px 24px', textAlign: 'center' as const },
  ctaTitle: { fontSize: 28, fontWeight: 700, color: '#FFFFFF', marginBottom: 12 },
  ctaSub: { fontSize: 17, color: '#A7F3D0', marginBottom: 32 },
  ctaBtn: { display: 'inline-block', background: '#FFFFFF', color: '#059669', fontWeight: 700, fontSize: 16, padding: '14px 36px', borderRadius: 100, textDecoration: 'none' },
  relatedGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12 },
  relatedCard: { border: '1px solid #E2E8F0', borderRadius: 12, padding: '16px 20px', textDecoration: 'none', color: 'inherit', display: 'block' },
}

function verdictBadgeStyle(verdict: string) {
  const colors: Record<string, { bg: string; color: string }> = {
    'High Opportunity': { bg: '#D1FAE5', color: '#065F46' },
    'Moderate Opportunity': { bg: '#FEF3C7', color: '#92400E' },
    'Emerging': { bg: '#DBEAFE', color: '#1E40AF' },
    'Saturated': { bg: '#FEE2E2', color: '#991B1B' },
  }
  const c = colors[verdict] || colors['Emerging']
  return { display: 'inline-flex', alignItems: 'center', gap: 8, background: c.bg, color: c.color, borderRadius: 100, padding: '8px 20px', fontSize: 15, fontWeight: 700, marginBottom: 20 }
}

function swotCardStyle(color: string, bg: string) {
  return { border: `1px solid ${color}40`, borderRadius: 14, padding: 20, background: bg }
}

export default async function CityTypePage({ params }: { params: Promise<{ city: string; type: string }> }) {
  const { city: citySlug, type: typeSlug } = await params
  const city = CITIES.find(c => c.slug === citySlug)
  const type = BUSINESS_TYPES.find(t => t.slug === typeSlug)
  if (!city || !type) notFound()

  const insight = getCityTypeInsight(city.slug, type.slug)

  return (
    <div style={S.page}>
      <section style={S.hero}>
        <div style={S.heroInner}>
          <div style={S.breadcrumb}>
            <Link href="/" style={{ color: '#64748B', textDecoration: 'none' }}>Home</Link>
            <span>›</span>
            <Link href="/location" style={{ color: '#64748B', textDecoration: 'none' }}>Locations</Link>
            <span>›</span>
            <Link href={`/location/${city.slug}`} style={{ color: '#64748B', textDecoration: 'none' }}>{city.name}</Link>
            <span>›</span>
            <span style={{ color: '#0F172A' }}>{type.name}</span>
          </div>
          <div style={verdictBadgeStyle(insight.verdict)}>{type.emoji} {insight.verdict}</div>
          <h1 style={S.h1}>
            {type.name} Market Analysis<br />
            <span style={S.emerald}>{city.name}, {city.state}</span>
          </h1>
          <p style={S.subtitle}>
            Is {city.name} a good place to open a {type.name.toLowerCase().replace(/s$/, '')}? Here&apos;s what the data says.
          </p>
          <div style={S.statRow}>
            <div style={S.stat}>
              <div style={S.statLabel}>Demand</div>
              <div style={{ ...S.statValue, color: getScoreColor(insight.demandScore) }}>{insight.demandScore}/100</div>
            </div>
            <div style={S.stat}>
              <div style={S.statLabel}>Competition</div>
              <div style={{ ...S.statValue, color: getScoreColor(100 - insight.competitionScore) }}>{insight.competitionScore}/100</div>
            </div>
            <div style={S.stat}>
              <div style={S.statLabel}>Opportunity</div>
              <div style={{ ...S.statValue, color: getScoreColor(insight.opportunityScore) }}>{insight.opportunityScore}/100</div>
            </div>
            <div style={S.stat}>
              <div style={S.statLabel}>Avg Rent</div>
              <div style={{ ...S.statValue, fontSize: 15, paddingTop: 4 }}>{insight.avgRent}</div>
            </div>
          </div>
        </div>
      </section>

      <section style={S.section}>
        <div style={S.inner}>
          <div style={S.grid2}>
            <div style={S.card}>
              <h2 style={{ ...S.sectionTitle, marginBottom: 24 }}>Score Breakdown</h2>
              <div style={S.scoreRow}>
                {[
                  { label: 'Market Demand', score: insight.demandScore, inverse: false },
                  { label: 'Competition Level', score: insight.competitionScore, inverse: true },
                  { label: 'Opportunity Score', score: insight.opportunityScore, inverse: false },
                ].map(({ label, score, inverse }) => (
                  <div key={label} style={S.scoreLine}>
                    <div style={S.scoreHeader}>
                      <span style={S.scoreName}>{label}</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: getScoreColor(inverse ? 100 - score : score) }}>{score}</span>
                    </div>
                    <div style={S.barBg}>
                      <div style={{ height: '100%', width: `${score}%`, background: getScoreColor(inverse ? 100 - score : score), borderRadius: 8 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={S.card}>
              <h2 style={{ ...S.sectionTitle, marginBottom: 8 }}>Best Suburbs</h2>
              <p style={{ fontSize: 14, color: '#64748B', marginBottom: 20 }}>Top areas for {type.name.toLowerCase()} in {city.name}</p>
              <div style={S.suburbGrid}>
                {insight.topSuburbs.map(s => <span key={s} style={S.suburb}>📍 {s}</span>)}
              </div>
              <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #E2E8F0' }}>
                <div style={S.statLabel}>Key Success Factors</div>
                {type.keySuccessFactors.map(f => (
                  <div key={f} style={{ fontSize: 14, color: '#334155', padding: '6px 0', borderBottom: '1px solid #F1F5F9' }}>✓ {f}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div style={S.divider} />

      <section style={S.section}>
        <div style={S.inner}>
          <h2 style={S.sectionTitle}>Market Insight</h2>
          <div style={S.insightBox}>
            <p style={S.insightText}>&ldquo;{insight.insight}&rdquo;</p>
            <div style={{ marginTop: 16, fontSize: 13, color: '#64748B' }}>— Locatalyze Market Analysis Engine</div>
          </div>
        </div>
      </section>

      <div style={S.divider} />

      <section style={S.section}>
        <div style={S.inner}>
          <h2 style={S.sectionTitle}>SWOT Analysis</h2>
          <p style={S.sectionSub}>{type.name} in {city.name} — market-level factors</p>
          <div style={S.swotGrid}>
            <div style={swotCardStyle('#059669', '#F0FDF4')}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#059669', marginBottom: 12 }}>💪 Strengths</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
                {insight.swot.strengths.map(s => <li key={s} style={{ fontSize: 14, color: '#334155', lineHeight: 1.4 }}>• {s}</li>)}
              </ul>
            </div>
            <div style={swotCardStyle('#D97706', '#FFFBEB')}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#D97706', marginBottom: 12 }}>⚠️ Weaknesses</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
                {insight.swot.weaknesses.map(s => <li key={s} style={{ fontSize: 14, color: '#334155', lineHeight: 1.4 }}>• {s}</li>)}
              </ul>
            </div>
            <div style={swotCardStyle('#0891B2', '#F0F9FF')}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0891B2', marginBottom: 12 }}>🚀 Opportunities</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
                {insight.swot.opportunities.map(s => <li key={s} style={{ fontSize: 14, color: '#334155', lineHeight: 1.4 }}>• {s}</li>)}
              </ul>
            </div>
            <div style={swotCardStyle('#DC2626', '#FFF5F5')}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#DC2626', marginBottom: 12 }}>⚡ Threats</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
                {insight.swot.threats.map(s => <li key={s} style={{ fontSize: 14, color: '#334155', lineHeight: 1.4 }}>• {s}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div style={S.divider} />

      <section style={S.section}>
        <div style={S.inner}>
          <h2 style={S.sectionTitle}>Typical Costs for {type.name}</h2>
          <div style={S.grid2}>
            <div style={S.card}>
              <div style={S.statLabel}>Startup Investment</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: '#0F172A', marginTop: 8 }}>{type.avgStartupCost}</div>
              <div style={{ fontSize: 13, color: '#64748B', marginTop: 8 }}>Includes fit-out, equipment, licences and working capital</div>
            </div>
            <div style={S.card}>
              <div style={S.statLabel}>Monthly Revenue (Mature)</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: '#059669', marginTop: 8 }}>{type.avgMonthlyRevenue}</div>
              <div style={{ fontSize: 13, color: '#64748B', marginTop: 8 }}>Average for well-located, established {type.name.toLowerCase()}</div>
            </div>
          </div>
        </div>
      </section>

      <div style={S.divider} />

      <section style={S.section}>
        <div style={S.inner}>
          <h2 style={S.sectionTitle}>Other Business Types in {city.name}</h2>
          <div style={S.relatedGrid}>
            {BUSINESS_TYPES.filter(t => t.slug !== type.slug).map(t => (
              <Link key={t.slug} href={`/location/${city.slug}/${t.slug}`} style={S.relatedCard}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{t.emoji}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{t.name}</div>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>View analysis →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section style={S.cta}>
        <div style={S.ctaTitle}>Analyse a Specific Address in {city.name}</div>
        <div style={S.ctaSub}>Get a precise feasibility score for any suburb — with competitor data, foot traffic and financial projections</div>
        <Link href="/analyse" style={S.ctaBtn}>Run a Location Analysis →</Link>
      </section>
    </div>
  )
}
