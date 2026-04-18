// app/(marketing)/location/page.tsx
import Link from 'next/link'
import { CITIES, BUSINESS_TYPES, getScoreColor } from '@/lib/location-data'
import { toolsHubRef } from '@/lib/funnel-links'

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

  // Free-tool promo row
  toolSection: { background: '#0F172A', padding: '64px 24px', borderTop: '1px solid #E2E8F0' },
  toolInner: { maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 48, alignItems: 'center' },
  toolBadge: { display: 'inline-flex', alignItems: 'center' as const, gap: 8, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 100, padding: '6px 14px', fontSize: 12, color: '#A7F3D0', fontWeight: 600, marginBottom: 16 },
  toolTitle: { fontSize: 'clamp(26px,3.4vw,40px)', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.15, marginBottom: 14, letterSpacing: '-0.01em' },
  toolSub: { fontSize: 16, color: '#94A3B8', lineHeight: 1.65, marginBottom: 24, maxWidth: 520 },
  toolBtns: { display: 'flex', gap: 12, flexWrap: 'wrap' as const },
  toolPrimary: { background: '#059669', color: '#FFFFFF', fontWeight: 700, fontSize: 15, padding: '13px 26px', borderRadius: 12, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' as const, gap: 8 },
  toolGhost: { color: '#CBD5E1', fontSize: 14, fontWeight: 500, textDecoration: 'underline', textUnderlineOffset: 4, alignSelf: 'center' as const },
  toolPreview: { background: '#0B1220', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 24, color: '#FFFFFF' },
  toolPreviewLabel: { fontSize: 11, color: '#64748B', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, marginBottom: 6 },
  toolPreviewVerdict: { fontSize: 36, fontWeight: 800, color: '#34D399', lineHeight: 1, marginBottom: 14 },
  toolPreviewRow: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: 13 },
  toolPreviewLbl: { color: '#94A3B8' },
  toolPreviewVal: { color: '#FFFFFF', fontWeight: 600 },
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

      {/* Free tools funnel — hub + viability */}
      <section style={S.toolSection}>
        <div style={S.toolInner} className="homepage-tool-row">
          <div>
            <div style={S.toolBadge}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399', display: 'inline-block' }} />
              Free tools · No signup
            </div>
            <h2 style={S.toolTitle}>
              Before you sign a lease —<br />check if the business will actually work.
            </h2>
            <p style={S.toolSub}>
              Pick your business type and suburb. Get an instant GO / CAUTION / NO verdict with
              estimated revenue, profit and break-even — in 10 seconds, no signup.
            </p>
            <div style={S.toolBtns}>
              <Link href={toolsHubRef('home_hero')} style={S.toolPrimary}>
                Free tools hub
                <span style={{ fontSize: 16 }}>→</span>
              </Link>
              <Link href="/tools/business-viability-checker?ref=home_viability" style={{ ...S.toolPrimary, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.28)' }}>
                Viability checker
                <span style={{ fontSize: 16 }}>→</span>
              </Link>
              <Link href="/sample-report" style={S.toolGhost}>See a paid sample report</Link>
            </div>
          </div>

          <div style={S.toolPreview}>
            <div style={S.toolPreviewLabel}>Preview · Café · Surry Hills</div>
            <div style={S.toolPreviewVerdict}>GO</div>
            <div style={S.toolPreviewRow}>
              <span style={S.toolPreviewLbl}>Demand score</span>
              <span style={S.toolPreviewVal}>87/100</span>
            </div>
            <div style={S.toolPreviewRow}>
              <span style={S.toolPreviewLbl}>Base revenue / mo</span>
              <span style={S.toolPreviewVal}>$72k</span>
            </div>
            <div style={S.toolPreviewRow}>
              <span style={S.toolPreviewLbl}>Base net profit / mo</span>
              <span style={{ ...S.toolPreviewVal, color: '#34D399' }}>$14k</span>
            </div>
            <div style={S.toolPreviewRow}>
              <span style={S.toolPreviewLbl}>Break-even</span>
              <span style={S.toolPreviewVal}>13 months</span>
            </div>
          </div>
        </div>
      </section>

      <section style={S.cta}>
        <div style={S.ctaTitle}>Need a Specific Address Analysed?</div>
        <div style={S.ctaSub}>Enter any suburb in Australia and get a full feasibility report in minutes</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', alignItems: 'center' }}>
          <Link href={toolsHubRef('home_footer')} style={{
            ...S.ctaBtn,
            background: 'transparent',
            color: '#FFFFFF',
            border: '2px solid rgba(255,255,255,0.55)',
          }}>
            Try free tools first →
          </Link>
          <Link href="/analyse" style={S.ctaBtn}>Start a Location Analysis →</Link>
        </div>
        <p style={{ fontSize: 13, color: 'rgba(167,243,208,0.85)', marginTop: 16, maxWidth: 480, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.55 }}>
          Free tools validate the idea; a full analysis is for when you have a real address.
        </p>
      </section>
    </div>
  )
}