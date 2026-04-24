// app/(marketing)/suburb/[suburb]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { SUBURBS, SUBURB_SLUGS, getSuburb, getSuburbsByCity } from '@/lib/suburb-data'
import { BUSINESS_TYPES, getScoreColor } from '@/lib/location-data'

export async function generateStaticParams() {
 return SUBURB_SLUGS.map(suburb => ({ suburb }))
}


const S = {
  page: { fontFamily: "'DM Sans','Inter','Helvetica Neue',Arial,sans-serif", color: '#0F172A', background: '#FFFFFF', minHeight: '100vh' },
 hero: { background: 'linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 50%, #F8FAFC 100%)', borderBottom: '1px solid #E2E8F0', padding: '80px 24px 64px' },
 heroInner: { maxWidth: 900, margin: '0 auto' },
 breadcrumb: { fontSize: 13, color: '#64748B', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' as const },
 vibeTag: { display: 'inline-block', background: '#D1FAE5', color: '#065F46', borderRadius: 20, padding: '5px 16px', fontSize: 13, fontWeight: 600, marginBottom: 16 },
 h1: { fontSize: 'clamp(28px,4.5vw,50px)', fontWeight: 700, lineHeight: 1.1, margin: '0 0 16px', color: '#0F172A' },
 emerald: { color: '#059669' },
 subtitle: { fontSize: 18, color: '#64748B', lineHeight: 1.7, maxWidth: 680, margin: '0 0 32px' },
 statRow: { display: 'flex', flexWrap: 'wrap' as const, gap: 16 },
 stat: { background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '14px 20px', minWidth: 120 },
 statLabel: { fontSize: 11, color: '#64748B', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 4 },
 statValue: { fontSize: 20, fontWeight: 700, color: '#0F172A' },
 section: { padding: '60px 24px' },
 inner: { maxWidth: 900, margin: '0 auto' },
 sectionTitle: { fontSize: 26, fontWeight: 700, marginBottom: 8, color: '#0F172A' },
 sectionSub: { fontSize: 16, color: '#64748B', marginBottom: 32 },
 divider: { height: 1, background: '#E2E8F0' },
 grid2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 },
 card: { border: '1px solid #E2E8F0', borderRadius: 16, padding: 24, background: '#FFFFFF' },
 typeGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 14 },
 typeCard: { border: '1px solid #E2E8F0', borderRadius: 14, padding: 18, background: '#FFFFFF', textDecoration: 'none', display: 'block', color: 'inherit' },
 barBg: { height: 7, borderRadius: 6, background: '#E2E8F0', overflow: 'hidden', marginTop: 8 },
 pillRow: { display: 'flex', flexWrap: 'wrap' as const, gap: 8 },
 pill: { fontSize: 13, background: '#F1F5F9', color: '#334155', borderRadius: 8, padding: '5px 12px' },
 pillGreen: { fontSize: 13, background: '#D1FAE5', color: '#065F46', borderRadius: 8, padding: '5px 12px' },
 pillRed: { fontSize: 13, background: '#FEE2E2', color: '#991B1B', borderRadius: 8, padding: '5px 12px' },
 streetList: { display: 'flex', flexDirection: 'column' as const, gap: 8 },
 street: { display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, fontWeight: 600, color: '#0F172A' },
 anchorList: { display: 'flex', flexDirection: 'column' as const, gap: 8 },
 anchor: { fontSize: 14, color: '#334155', display: 'flex', alignItems: 'center', gap: 8 },
 insightBox: { background: 'linear-gradient(135deg,#F0FDF4,#ECFDF5)', border: '1px solid #A7F3D0', borderRadius: 16, padding: 28 },
 insightText: { fontSize: 17, lineHeight: 1.75, color: '#0F172A', fontStyle: 'italic' as const },
 nearbyGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 12 },
 nearbyCard: { border: '1px solid #E2E8F0', borderRadius: 12, padding: '16px 20px', textDecoration: 'none', color: 'inherit', display: 'block' },
 trafficBadge: (t: string) => ({
    display: 'inline-block', fontSize: 12, fontWeight: 700, padding: '3px 12px', borderRadius: 20,
  background: t === 'Very High' ? '#D1FAE5' : t === 'High' ? '#DBEAFE' : t === 'Moderate' ? '#FEF3C7' : '#F1F5F9',
  color: t === 'Very High' ? '#059669' : t === 'High' ? '#1D4ED8' : t === 'Moderate' ? '#D97706' : '#64748B',
 }),
  parkBadge: (p: string) => ({
    display: 'inline-block', fontSize: 12, fontWeight: 700, padding: '3px 12px', borderRadius: 20,
  background: p === 'Easy' ? '#D1FAE5' : p === 'Moderate' ? '#FEF3C7' : p === 'Difficult' ? '#FEE2E2' : '#FEE2E2',
  color: p === 'Easy' ? '#059669' : p === 'Moderate' ? '#D97706' : '#DC2626',
 }),
  cta: { background: 'linear-gradient(135deg,#059669 0%,#0F766E 100%)', padding: '64px 24px', textAlign: 'center' as const },
 ctaTitle: { fontSize: 28, fontWeight: 700, color: '#FFFFFF', marginBottom: 12 },
 ctaSub: { fontSize: 17, color: '#A7F3D0', marginBottom: 32 },
 ctaBtn: { display: 'inline-block', background: '#FFFFFF', color: '#059669', fontWeight: 700, fontSize: 16, padding: '14px 36px', borderRadius: 100, textDecoration: 'none' },
}

export async function generateMetadata({ params }: { params: Promise<{ suburb: string }> }) {
 const { suburb: slug } = await params
  const name = slug.replace(/-/g, ' ').replace(/w/g, c => c.toUpperCase())
 return {
    title: `${name} business location analysis — Locatalyze`,
    description: `Is ${name} a good location for your business? Market demand, rent ranges, and competitor density — AI analysis in about 90 seconds.`,
    alternates: { canonical: `https://locatalyze.com/suburb/${slug}` },
  }
}

export default async function SuburbPage({ params }: { params: Promise<{ suburb: string }> }) {
  const { suburb: suburbSlug } = await params
  const suburb = getSuburb(suburbSlug)
  if (!suburb) notFound()

  const nearbySuburbs = getSuburbsByCity(suburb.citySlug)
    .filter(s => s.slug !== suburb.slug)
    .slice(0, 4)

  return (
    <div style={S.page}>
      {/* HERO */}
      <section style={S.hero}>
        <div style={S.heroInner}>
          <div style={S.breadcrumb}>
            <Link href="/" style={{ color: '#64748B', textDecoration: 'none' }}>Home</Link>
      <span>›</span>
            <Link href="/location" style={{ color: '#64748B', textDecoration: 'none' }}>Locations</Link>
      <span>›</span>
            <Link href={`/location/${suburb.citySlug}`} style={{ color: '#64748B', textDecoration: 'none' }}>{suburb.city}</Link>
      <span>›</span>
            <span style={{ color: '#0F172A' }}>{suburb.name}</span>
     </div>
          <div style={S.vibeTag}> {suburb.vibe}</div>
          <h1 style={S.h1}>
            Opening a Business in<br />
            <span style={S.emerald}>{suburb.name}, {suburb.city}</span>
          </h1>
          <p style={S.subtitle}>{suburb.description}</p>
          <div style={S.statRow}>
            <div style={S.stat}>
              <div style={S.statLabel}>Population</div>
              <div style={S.statValue}>{suburb.population}</div>
            </div>
            <div style={S.stat}>
              <div style={S.statLabel}>Avg Income</div>
              <div style={S.statValue}>{suburb.avgIncome}</div>
            </div>
            <div style={S.stat}>
              <div style={S.statLabel}>Foot Traffic</div>
              <div style={{ marginTop: 6 }}><span style={S.trafficBadge(suburb.footTraffic)}>{suburb.footTraffic}</span></div>
            </div>
            <div style={S.stat}>
              <div style={S.statLabel}>Parking</div>
              <div style={{ marginTop: 6 }}><span style={S.parkBadge(suburb.parkingEase)}>{suburb.parkingEase}</span></div>
            </div>
            <div style={S.stat}>
              <div style={S.statLabel}>Rent Range</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#059669', marginTop: 4 }}>{suburb.rentRange}</div>
      </div>
          </div>
        </div>
      </section>

      {/* DEMAND BY BUSINESS TYPE */}
      <section style={S.section}>
        <div style={S.inner}>
          <h2 style={S.sectionTitle}>Demand by Business Type</h2>
          <p style={S.sectionSub}>How well does {suburb.name} suit each type of business?</p>
          <div style={S.typeGrid}>
            {BUSINESS_TYPES.map(type => {
              const score = suburb.demandScores[type.slug as keyof typeof suburb.demandScores]
              const isBestFor = suburb.bestFor.includes(type.slug)
              return (
                <div key={type.slug} style={{ ...S.typeCard, borderColor: isBestFor ? '#A7F3D0' : '#E2E8F0' }}>
         <div style={{ fontSize: 26, marginBottom: 8 }}>{type.emoji}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 2 }}>{type.name}</div>
         {isBestFor && <div style={{ fontSize: 11, color: '#059669', fontWeight: 700, marginBottom: 4 }}> RECOMMENDED</div>}
         <div style={S.barBg}>
                    <div style={{ height: '100%', width: `${score}%`, background: getScoreColor(score), borderRadius: 6 }} />
         </div>
                  <div style={{ fontSize: 12, color: '#64748B', marginTop: 5 }}>{score}/100</div>
        </div>
              )
            })}
          </div>
        </div>
      </section>

      <div style={S.divider} />

      {/* KEY INSIGHT */}
      <section style={S.section}>
        <div style={S.inner}>
          <h2 style={S.sectionTitle}>Market Insight</h2>
          <div style={S.insightBox}>
            <p style={S.insightText}>&ldquo;{suburb.keyInsight}&rdquo;</p>
            <div style={{ marginTop: 16, fontSize: 13, color: '#64748B' }}>— Locatalyze Market Analysis</div>
     </div>
        </div>
      </section>

      <div style={S.divider} />

      {/* TOP STREETS + NEARBY ANCHORS */}
      <section style={S.section}>
        <div style={S.inner}>
          <div style={S.grid2}>
            <div style={S.card}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: '#0F172A' }}> Top Commercial Streets</h3>
       <div style={S.streetList}>
                {suburb.topStreets.map(s => (
                  <div key={s} style={S.street}>
                    <span style={{ color: '#059669', fontSize: 18 }}>→</span> {s}
         </div>
                ))}
              </div>
            </div>
            <div style={S.card}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: '#0F172A' }}> Nearby Traffic Drivers</h3>
       <div style={S.anchorList}>
                {suburb.nearbyAnchors.map(a => (
                  <div key={a} style={S.anchor}>
                    <span style={{ color: '#059669' }}>•</span> {a}
         </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div style={S.divider} />

      {/* BEST/NOT BEST FOR + DEMOGRAPHICS */}
      <section style={S.section}>
        <div style={S.inner}>
          <div style={S.grid2}>
            <div style={S.card}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: '#0F172A' }}>Best suited for</h3>
       <p style={{ fontSize: 13, color: '#64748B', marginBottom: 16 }}>Business types with strong opportunity in {suburb.name}</p>
       <div style={S.pillRow}>
                {suburb.bestFor.map(t => {
                  const type = BUSINESS_TYPES.find(bt => bt.slug === t)
                  return <span key={t} style={S.pillGreen}>{type?.emoji} {type?.name}</span>
                })}
              </div>
              {suburb.notBestFor.length > 0 && (
                <>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginTop: 24, marginBottom: 8, color: '#64748B' }}>Tougher market</h3>
         <div style={S.pillRow}>
                    {suburb.notBestFor.map(t => {
                      const type = BUSINESS_TYPES.find(bt => bt.slug === t)
                      return <span key={t} style={S.pillRed}>{type?.emoji} {type?.name}</span>
                    })}
                  </div>
                </>
              )}
            </div>
            <div style={S.card}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: '#0F172A' }}>Who shops here</h3>
       <div style={{ fontSize: 15, color: '#334155', lineHeight: 1.7 }}>{suburb.demographics}</div>
       <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #F1F5F9' }}>
        <div style={S.statLabel}>Suburb Vibe</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#0F172A', marginTop: 6 }}>{suburb.vibe}</div>
       </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEARBY SUBURBS */}
      {nearbySuburbs.length > 0 && (
        <>
          <div style={S.divider} />
          <section style={S.section}>
            <div style={S.inner}>
              <h2 style={S.sectionTitle}>Other Suburbs in {suburb.city}</h2>
              <div style={S.nearbyGrid}>
                {nearbySuburbs.map(s => (
                  <Link key={s.slug} href={`/suburb/${s.slug}`} style={S.nearbyCard}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>{s.name}</div>
          <div style={{ fontSize: 13, color: '#64748B', marginBottom: 10 }}>{s.vibe}</div>
          <span style={S.trafficBadge(s.footTraffic)}>{s.footTraffic} traffic</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* CTA */}
      <section style={S.cta}>
        <div style={S.ctaTitle}>Analyse a Specific Address in {suburb.name}</div>
        <div style={S.ctaSub}>Get exact scores for your chosen location — competitor density, foot traffic estimate, and financial projections</div>
        <Link href="/analyse" style={S.ctaBtn}>Run a Location Analysis →</Link>
   </section>
    </div>
  )
}