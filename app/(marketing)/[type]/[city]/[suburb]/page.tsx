import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import {
  getSuburbData,
  getAllSlugs,
  VERDICT_CONFIG,
  COMPETITION_LABELS,
  RENT_LABELS,
  CONFIDENCE_LABELS,
  isHandCraftedIntelKey,
  type SuburbIntelData,
  type VerdictType,
} from '@/lib/suburb-intel'
import { SuburbIntelCapture } from '@/components/analytics/FunnelCapture'
import { onboardingRef, toolsHubRef } from '@/lib/funnel-links'

// ── Static generation ─────────────────────────────────────────────────────────

export function generateStaticParams() {
  return getAllSlugs()
}

type RouteParams = { type: string; city: string; suburb: string }

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>
}): Promise<Metadata> {
  const { type, city, suburb } = await params
  const data = getSuburbData(type, city, suburb)
  if (!data) return {}
  return {
    title      : data.metaTitle,
    description: data.metaDescription,
    alternates : { canonical: `https://www.locatalyze.com/${type}/${city}/${suburb}` },
    openGraph  : {
      title      : data.metaTitle,
      description: data.metaDescription,
      type       : 'article',
      url        : `https://www.locatalyze.com/${type}/${city}/${suburb}`,
    },
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function SuburbIntelPage({
  params,
}: {
  params: Promise<RouteParams>
}) {
  const { type, city, suburb } = await params
  const data = getSuburbData(type, city, suburb)
  if (!data) notFound()

  const vc       = VERDICT_CONFIG[data.verdict]
  const fmtMoney = (n: number) => '$' + n.toLocaleString('en-AU')
  const fmtRange = (r: { low: number; high: number }) =>
    `${fmtMoney(r.low)} – ${fmtMoney(r.high)}`

  const PAGE_CSS = `
.si-page {
  font-family: "DM Sans","Geist","Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif !important;
  background: #f8fafc !important;
  color: #0f172a !important;
}
.si-page * { box-sizing: border-box; }
.si-page h1,.si-page h2,.si-page h3,.si-page h4,
.si-page p,.si-page a,.si-page span,.si-page li {
  font-family: "DM Sans","Geist","Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif !important;
  text-transform: none !important;
  letter-spacing: normal !important;
}
.si-page a { text-decoration: none !important; }

/* shell */
.si-shell {
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 24px;
}
@media (max-width: 768px) { .si-shell { padding: 0 16px; } }

/* ── breadcrumb ── */
.si-breadcrumb {
  padding: 14px 0;
  border-bottom: 1px solid #e2e8f0;
  background: #ffffff !important;
}
.si-breadcrumb-inner {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px !important;
  color: #94a3b8 !important;
}
.si-breadcrumb-inner a {
  color: #64748b !important;
  font-weight: 500 !important;
}
.si-breadcrumb-inner a:hover { color: #0f172a !important; }
.si-breadcrumb-sep { color: #cbd5e1 !important; }

/* ── verdict hero ── */
.si-hero {
  padding: 48px 0 0;
  background: #ffffff !important;
  border-bottom: 1px solid #e2e8f0;
}
@media (max-width: 768px) { .si-hero { padding: 32px 0 0; } }
.si-hero-eyebrow {
  font-size: 11px !important;
  font-weight: 700 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.09em !important;
  color: #64748b !important;
  margin-bottom: 12px !important;
}
.si-hero-h1 {
  font-size: clamp(26px, 4.5vw, 46px) !important;
  font-weight: 800 !important;
  letter-spacing: -0.03em !important;
  line-height: 1.08 !important;
  color: #0f172a !important;
  margin-bottom: 20px !important;
  max-width: 760px !important;
}
.si-verdict-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin-bottom: 36px;
}
.si-verdict-badge {
  display: inline-flex !important;
  align-items: center !important;
  gap: 8px !important;
  border-radius: 12px !important;
  padding: 10px 20px !important;
  font-size: 16px !important;
  font-weight: 800 !important;
  letter-spacing: 0.02em !important;
  color: #ffffff !important;
  flex-shrink: 0 !important;
}
.si-verdict-summary {
  font-size: 15px !important;
  line-height: 1.7 !important;
  color: #64748b !important;
  max-width: 680px !important;
}

/* ── metrics strip ── */
.si-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 0;
  border-top: 1px solid #e2e8f0;
  border-left: 1px solid #e2e8f0;
  margin-top: 0;
}
.si-metric {
  padding: 20px 22px;
  border-right: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
  background: #ffffff !important;
}
.si-metric-label {
  font-size: 10px !important;
  font-weight: 700 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.09em !important;
  color: #94a3b8 !important;
  margin-bottom: 6px !important;
}
.si-metric-value {
  font-size: 17px !important;
  font-weight: 800 !important;
  color: #0f172a !important;
  letter-spacing: -0.02em !important;
  line-height: 1.2 !important;
  margin-bottom: 2px !important;
}
.si-metric-note {
  font-size: 11px !important;
  color: #94a3b8 !important;
}

/* ── layout ── */
.si-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
  padding: 0;
}
@media (min-width: 1024px) {
  .si-layout { grid-template-columns: 1fr 340px; align-items: start; }
}

/* ── main column ── */
.si-main { padding: 48px 0; }
@media (min-width: 1024px) { .si-main { padding: 48px 40px 48px 0; } }
@media (max-width: 768px) { .si-main { padding: 32px 0; } }

.si-section { margin-bottom: 48px; }
.si-section:last-child { margin-bottom: 0; }
.si-section-label {
  font-size: 10px !important;
  font-weight: 700 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.1em !important;
  color: #94a3b8 !important;
  margin-bottom: 10px !important;
}
.si-section-h2 {
  font-size: 20px !important;
  font-weight: 800 !important;
  letter-spacing: -0.02em !important;
  color: #0f172a !important;
  margin-bottom: 14px !important;
  line-height: 1.2 !important;
}
.si-prose {
  font-size: 15px !important;
  line-height: 1.78 !important;
  color: #374151 !important;
}

/* intelligence lists */
.si-list { list-style: none; padding: 0; margin: 0; display: grid; gap: 10px; }
.si-list-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  background: #f8fafc !important;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px 16px;
}
.si-list-icon {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
}
.si-list-text {
  font-size: 14px !important;
  color: #374151 !important;
  line-height: 1.65 !important;
}

/* divider */
.si-divider { border: none; border-top: 1px solid #e2e8f0; margin: 0; }

/* ── sidebar ── */
.si-sidebar {
  padding: 48px 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
@media (min-width: 1024px) {
  .si-sidebar {
    padding: 48px 0;
    border-left: 1px solid #e2e8f0;
    padding-left: 40px;
    position: sticky;
    top: 24px;
  }
}

/* sidebar cards */
.si-card {
  background: #ffffff !important;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(15,23,42,0.04);
}
.si-card-title {
  font-size: 13px !important;
  font-weight: 700 !important;
  color: #0f172a !important;
  margin-bottom: 4px !important;
}
.si-card-desc {
  font-size: 12px !important;
  color: #64748b !important;
  line-height: 1.6 !important;
  margin-bottom: 14px !important;
}
.si-card-btn {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  background: #0f172a !important;
  color: #ffffff !important;
  border-radius: 10px !important;
  padding: 10px 14px !important;
  font-size: 13px !important;
  font-weight: 700 !important;
  transition: background 0.15s !important;
}
.si-card-btn:hover { background: #1e293b !important; color: #ffffff !important; }
.si-card-btn-outline {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  background: #f8fafc !important;
  color: #0f172a !important;
  border: 1px solid #e2e8f0 !important;
  border-radius: 10px !important;
  padding: 10px 14px !important;
  font-size: 13px !important;
  font-weight: 600 !important;
  margin-top: 8px !important;
}
.si-card-btn-outline:hover { border-color: #94a3b8 !important; }

/* related links */
.si-related-list { display: grid; gap: 8px; }
.si-related-link {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  padding: 10px 14px !important;
  background: #f8fafc !important;
  border: 1px solid #e2e8f0 !important;
  border-radius: 10px !important;
  font-size: 13px !important;
  font-weight: 600 !important;
  color: #0f172a !important;
  transition: border-color 0.15s, background 0.15s !important;
}
.si-related-link:hover {
  background: #f1f5f9 !important;
  border-color: #94a3b8 !important;
  color: #0f172a !important;
}

/* methodology */
.si-methodology {
  background: #f8fafc !important;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 20px 22px;
  margin-top: 36px;
}
.si-methodology-title {
  font-size: 12px !important;
  font-weight: 700 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.08em !important;
  color: #94a3b8 !important;
  margin-bottom: 8px !important;
}
.si-methodology-body {
  font-size: 13px !important;
  color: #64748b !important;
  line-height: 1.7 !important;
}
.si-confidence-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
}
.si-confidence-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* ── CTA section ── */
.si-cta {
  background: #0f172a !important;
  padding: 64px 0;
  border-top: 1px solid #1e293b;
  position: relative;
  overflow: hidden;
}
.si-cta::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 50% 70% at 80% 50%, rgba(37,99,235,0.12) 0%, transparent 60%);
  pointer-events: none;
}
.si-cta-inner { max-width: 680px; position: relative; }
.si-cta h2 {
  font-size: clamp(22px, 3.5vw, 36px) !important;
  font-weight: 800 !important;
  letter-spacing: -0.025em !important;
  color: #ffffff !important;
  margin-bottom: 14px !important;
  line-height: 1.15 !important;
}
.si-cta p {
  font-size: 15px !important;
  color: rgba(255,255,255,0.5) !important;
  line-height: 1.75 !important;
  margin-bottom: 28px !important;
}
.si-cta-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 8px;
  margin-bottom: 28px;
}
.si-cta-feature {
  background: rgba(255,255,255,0.04) !important;
  border: 1px solid rgba(255,255,255,0.08) !important;
  border-radius: 10px !important;
  padding: 10px 14px !important;
  font-size: 12px !important;
  color: rgba(255,255,255,0.65) !important;
  line-height: 1.5 !important;
  display: flex !important;
  gap: 8px !important;
  align-items: flex-start !important;
}
.si-cta-btn-primary {
  display: inline-flex !important;
  align-items: center !important;
  gap: 8px !important;
  background: #ffffff !important;
  color: #0f172a !important;
  border-radius: 12px !important;
  padding: 13px 24px !important;
  font-size: 14px !important;
  font-weight: 700 !important;
  letter-spacing: -0.01em !important;
  transition: background 0.15s !important;
}
.si-cta-btn-primary:hover { background: #f1f5f9 !important; color: #0f172a !important; }
.si-cta-btn-secondary {
  display: inline-flex !important;
  align-items: center !important;
  gap: 5px !important;
  color: rgba(255,255,255,0.35) !important;
  font-size: 13px !important;
  font-weight: 500 !important;
  margin-left: 20px !important;
  transition: color 0.15s !important;
}
.si-cta-btn-secondary:hover { color: rgba(255,255,255,0.6) !important; }
.si-cta-btn-tools {
  display: inline-flex !important;
  align-items: center !important;
  gap: 8px !important;
  background: transparent !important;
  color: #ffffff !important;
  border: 1px solid rgba(255,255,255,0.5) !important;
  border-radius: 12px !important;
  padding: 13px 24px !important;
  font-size: 14px !important;
  font-weight: 700 !important;
  letter-spacing: -0.01em !important;
  transition: background 0.15s, border-color 0.15s !important;
}
.si-cta-btn-tools:hover {
  background: rgba(255,255,255,0.1) !important;
  border-color: rgba(255,255,255,0.75) !important;
  color: #ffffff !important;
}
.si-card-btn--brand { background: #0f766e !important; }
.si-card-btn--brand:hover { background: #0d9488 !important; }
`

  const ArrowRight = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  )

  const CheckIcon = ({ color }: { color: string }) => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )

  const WarnIcon = () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#D97706"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  )

  const confidenceDotColor = {
    low   : '#F59E0B',
    medium: '#3B82F6',
    high  : '#10B981',
  }[data.confidenceLevel]

  const rentLevelColor = {
    'below-market' : '#059669',
    'at-market'    : '#2563EB',
    'above-market' : '#D97706',
    'premium'      : '#DC2626',
  }[data.rentLevel]

  const demandDots = Array.from({ length: 10 }, (_, i) => i < data.demandScore)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.metaTitle,
    description: data.metaDescription,
    author: { '@type': 'Organization', name: 'Locatalyze' },
    publisher: { '@type': 'Organization', name: 'Locatalyze', url: 'https://www.locatalyze.com' },
    url: `https://www.locatalyze.com/${type}/${city}/${suburb}`,
    dateModified: '2025-03-01',
  }

  return (
    <main className="si-page">
      <SuburbIntelCapture
        business_type={type}
        city_slug={city}
        suburb_slug={suburb}
        path={`/${type}/${city}/${suburb}`}
        source={isHandCraftedIntelKey(type, city, suburb) ? 'hand_crafted' : 'generated'}
      />
      <style dangerouslySetInnerHTML={{ __html: PAGE_CSS }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <nav className="si-breadcrumb">
        <div className="si-shell">
          <div className="si-breadcrumb-inner">
            <Link href="/">Locatalyze</Link>
            <span className="si-breadcrumb-sep">›</span>
            <Link href={`/${type}/${city}`} style={{ textTransform: 'capitalize' }}>
              {data.city}
            </Link>
            <span className="si-breadcrumb-sep">›</span>
            <span style={{ color: '#0f172a', fontWeight: 600 }}>
              {data.businessLabel} in {data.suburb}
            </span>
          </div>
        </div>
      </nav>

      {/* Hero + Verdict */}
      <section className="si-hero">
        <div className="si-shell">
          <p className="si-hero-eyebrow">
            {data.city}, {data.state} · {data.businessLabel} · Location Intelligence
          </p>
          <h1 className="si-hero-h1">
            Is {data.suburb} good for a {data.businessLabel.toLowerCase()}?
          </h1>

          <div className="si-verdict-row">
            <span
              className="si-verdict-badge"
              style={{ background: vc.bg }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                {data.verdict === 'GO'
                  ? <polyline points="20 6 9 17 4 12"/>
                  : data.verdict === 'CAUTION'
                  ? <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>
                  : <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                }
              </svg>
              Verdict: {vc.label}
            </span>
            <p className="si-verdict-summary">{data.verdictSummary}</p>
          </div>
        </div>

        {/* Metrics strip */}
        <div className="si-shell" style={{ paddingLeft: 0, paddingRight: 0 }}>
          <div className="si-metrics">
            {/* Revenue */}
            <div className="si-metric">
              <div className="si-metric-label">Monthly revenue</div>
              <div className="si-metric-value">{fmtRange(data.monthlyRevenue)}</div>
              <div className="si-metric-note">Realistic operating range</div>
            </div>
            {/* Profit */}
            <div className="si-metric">
              <div className="si-metric-label">Monthly profit</div>
              <div className="si-metric-value" style={{ color: data.monthlyProfit.low > 0 ? '#059669' : '#DC2626' }}>
                {fmtRange(data.monthlyProfit)}
              </div>
              <div className="si-metric-note">After all costs, pre-tax</div>
            </div>
            {/* Rent */}
            <div className="si-metric">
              <div className="si-metric-label">Rent estimate</div>
              <div className="si-metric-value">{fmtRange(data.monthlyRent)}</div>
              <div className="si-metric-note" style={{ color: rentLevelColor, fontWeight: 600 }}>
                {RENT_LABELS[data.rentLevel]}
              </div>
            </div>
            {/* Break-even */}
            <div className="si-metric">
              <div className="si-metric-label">Break-even</div>
              <div className="si-metric-value">{data.dailyCustomersNeeded} customers/day</div>
              <div className="si-metric-note">Minimum to cover fixed costs</div>
            </div>
            {/* Competition */}
            <div className="si-metric">
              <div className="si-metric-label">Competition</div>
              <div className="si-metric-value" style={{ fontSize: 14 }}>
                {COMPETITION_LABELS[data.competitionLevel]}
              </div>
            </div>
            {/* Demand score */}
            <div className="si-metric">
              <div className="si-metric-label">Demand score</div>
              <div style={{ display: 'flex', gap: 3, marginBottom: 4, marginTop: 4 }}>
                {demandDots.map((filled, i) => (
                  <div key={i} style={{
                    width: 16, height: 8, borderRadius: 3,
                    background: filled ? vc.bg : '#e2e8f0',
                  }} />
                ))}
              </div>
              <div className="si-metric-note">{data.demandScore}/10</div>
            </div>
          </div>
        </div>
      </section>

      {/* Funnel: free tools hub (tools → full report) */}
      <div style={{ background: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
        <div className="si-shell" style={{ paddingTop: 16, paddingBottom: 16 }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              padding: '16px 20px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 14,
            }}
          >
            <div style={{ minWidth: 0, maxWidth: 720 }}>
              <div style={{
                fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase',
                color: '#0f766e', marginBottom: 6, fontFamily: 'inherit',
              }}>
                Free tools · Same intelligence layer as paid reports
              </div>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0f172a', lineHeight: 1.45, fontFamily: 'inherit' }}>
                Validate rent, viability, and break-even for {data.suburb} — then run a full report for your exact address.
              </p>
            </div>
            <Link
              href={toolsHubRef('suburb_banner')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                flexShrink: 0,
                background: '#0f766e',
                color: '#fff',
                fontWeight: 700,
                fontSize: 14,
                padding: '12px 18px',
                borderRadius: 10,
                textDecoration: 'none',
                fontFamily: 'inherit',
              }}
            >
              Open free tools hub
              <ArrowRight />
            </Link>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="si-shell">
        <div className="si-layout">

          {/* ── Main column ── */}
          <div className="si-main">

            {/* Suburb profile */}
            <div className="si-section">
              <div className="si-section-label">Suburb profile</div>
              <h2 className="si-section-h2">Who lives here and what is the vibe?</h2>
              <p className="si-prose">{data.suburbProfile}</p>
            </div>

            <hr className="si-divider" />

            {/* Demand */}
            <div className="si-section" style={{ paddingTop: 40 }}>
              <div className="si-section-label">Demand analysis</div>
              <h2 className="si-section-h2">Is there genuine demand for a {data.businessLabel.toLowerCase()} here?</h2>
              <p className="si-prose">{data.demandAnalysis}</p>
            </div>

            <hr className="si-divider" />

            {/* Competition */}
            <div className="si-section" style={{ paddingTop: 40 }}>
              <div className="si-section-label">Competition</div>
              <h2 className="si-section-h2">How competitive is this market?</h2>
              <p className="si-prose">{data.competitionAnalysis}</p>
            </div>

            <hr className="si-divider" />

            {/* Rent */}
            <div className="si-section" style={{ paddingTop: 40 }}>
              <div className="si-section-label">Rent intelligence</div>
              <h2 className="si-section-h2">What does rent actually cost — and what does it demand from you?</h2>
              <p className="si-prose">{data.rentAnalysis}</p>
              <div style={{ marginTop: 16, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Link href={`/tools/rent-overpriced-checker?ref=${encodeURIComponent('suburb_rent')}`} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontSize: 13, fontWeight: 600, color: '#2563EB',
                  border: '1px solid #BFDBFE', background: '#EFF6FF',
                  borderRadius: 999, padding: '6px 14px',
                }}>
                  Check if this rent is overpriced →
                </Link>
                <Link href={`/tools/break-even-foot-traffic?ref=${encodeURIComponent('suburb_rent')}`} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontSize: 13, fontWeight: 600, color: '#0f172a',
                  border: '1px solid #e2e8f0', background: '#f8fafc',
                  borderRadius: 999, padding: '6px 14px',
                }}>
                  Calculate your break-even →
                </Link>
                <Link href={toolsHubRef('suburb_rent')} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontSize: 13, fontWeight: 600, color: '#0f766e',
                  border: '1px solid #99f6e4', background: '#ecfdf5',
                  borderRadius: 999, padding: '6px 14px',
                }}>
                  All free tools →
                </Link>
              </div>
            </div>

            <hr className="si-divider" />

            {/* Customer behaviour */}
            <div className="si-section" style={{ paddingTop: 40 }}>
              <div className="si-section-label">Customer behaviour</div>
              <h2 className="si-section-h2">How does the local customer think and spend?</h2>
              <p className="si-prose">{data.customerBehavior}</p>
            </div>

            <hr className="si-divider" />

            {/* Intelligence layer */}
            <div className="si-section" style={{ paddingTop: 40 }}>
              <div className="si-section-label">Intelligence layer</div>
              <h2 className="si-section-h2">Key conditions for success</h2>
              <ul className="si-list" style={{ marginBottom: 32 }}>
                {data.successConditions.map((c, i) => (
                  <li key={i} className="si-list-item">
                    <span className="si-list-icon" style={{ background: '#ECFDF5' }}>
                      <CheckIcon color="#059669" />
                    </span>
                    <span className="si-list-text">{c}</span>
                  </li>
                ))}
              </ul>

              <h2 className="si-section-h2" style={{ marginTop: 32 }}>Failure scenarios</h2>
              <ul className="si-list" style={{ marginBottom: 32 }}>
                {data.failureScenarios.map((f, i) => (
                  <li key={i} className="si-list-item">
                    <span className="si-list-icon" style={{ background: '#FEF2F2' }}>
                      <WarnIcon />
                    </span>
                    <span className="si-list-text">{f}</span>
                  </li>
                ))}
              </ul>

              <h2 className="si-section-h2" style={{ marginTop: 32 }}>What would make this work better</h2>
              <ul className="si-list">
                {data.whatWouldMakeItBetter.map((w, i) => (
                  <li key={i} className="si-list-item">
                    <span className="si-list-icon" style={{ background: '#EFF6FF' }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#2563EB"
                        strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                      </svg>
                    </span>
                    <span className="si-list-text">{w}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Methodology */}
            <div className="si-methodology">
              <div className="si-methodology-title">How we estimated this</div>
              <p className="si-methodology-body">{data.dataAssumptions}</p>
              <div className="si-confidence-row">
                <div className="si-confidence-dot" style={{ background: confidenceDotColor }} />
                <span style={{ fontSize: 12, color: '#64748b', fontFamily: 'inherit' }}>
                  Confidence: <strong style={{ color: '#0f172a' }}>{CONFIDENCE_LABELS[data.confidenceLevel]}</strong>
                </span>
                <span style={{ fontSize: 12, color: '#94a3b8', marginLeft: 'auto', fontFamily: 'inherit' }}>
                  Last updated: {data.lastUpdated}
                </span>
              </div>
              <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 8, fontFamily: 'inherit', lineHeight: 1.6 }}>
                {data.confidenceNote}
              </p>
            </div>

          </div>{/* /main */}

          {/* ── Sidebar ── */}
          <div className="si-sidebar">

            {/* Tools hub — primary funnel entry */}
            <div className="si-card" style={{
              border: '2px solid #99f6e4',
              background: 'linear-gradient(180deg,#ecfdf5 0%,#ffffff 55%) !important',
            }}>
              <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.09em', color: '#0f766e', marginBottom: 8, fontFamily: 'inherit' }}>
                Free tools hub
              </div>
              <div className="si-card-title" style={{ marginTop: 0 }}>Rent, viability &amp; break-even</div>
              <div className="si-card-desc">
                Run free checks first — same intelligence layer as full reports — then upgrade when you have a site.
              </div>
              <Link href={toolsHubRef('suburb_sidebar')} className="si-card-btn si-card-btn--brand">
                <span>Open free tools hub</span>
                <ArrowRight />
              </Link>
            </div>

            {/* Full report CTA */}
            <div className="si-card" style={{
              background: 'linear-gradient(135deg,#0F172A 0%,#1E3A5F 100%) !important',
              border: 'none',
            }}>
              <div style={{
                background: 'linear-gradient(135deg,#0F172A 0%,#1E3A5F 100%)',
                borderRadius: 14, padding: 20, margin: -20, marginBottom: 0,
              }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: 'rgba(255,255,255,0.4)', marginBottom: 8, fontFamily: 'inherit' }}>
                  Full report
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 6, letterSpacing: '-0.02em', fontFamily: 'inherit', lineHeight: 1.2 }}>
                  Get the full {data.suburb} {data.businessLabel} report
                </div>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, marginBottom: 16, fontFamily: 'inherit' }}>
                  Competitor locations, foot traffic estimate, demographic breakdown, and 12-month P&amp;L model for your exact address.
                </p>
                <Link href={onboardingRef('suburb_intel_report')} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: '#fff', color: '#0f172a', borderRadius: 10,
                  padding: '11px 14px', fontSize: 13, fontWeight: 700,
                  textDecoration: 'none', fontFamily: 'inherit',
                }}>
                  <span>Analyse {data.suburb} →</span>
                  <ArrowRight />
                </Link>
              </div>
            </div>

            {/* Tool: Business Viability */}
            <div className="si-card">
              <div className="si-card-title">Business Viability Checker</div>
              <div className="si-card-desc">
                Get a GO / CAUTION / NO signal with revenue, break-even, and market fit indicators
                for any {data.city} suburb.
              </div>
              <Link href="/tools/business-viability-checker?ref=suburb_card" className="si-card-btn">
                <span>Check viability</span>
                <ArrowRight />
              </Link>
            </div>

            {/* Tool: Break-even */}
            <div className="si-card">
              <div className="si-card-title">Break-Even Calculator</div>
              <div className="si-card-desc">
                Enter your rent and staff setup to see exactly how many customers you need per day
                to break even — with a risk rating.
              </div>
              <Link href="/tools/break-even-foot-traffic?ref=suburb_card" className="si-card-btn">
                <span>Calculate break-even</span>
                <ArrowRight />
              </Link>
              <Link href="/tools/rent-overpriced-checker?ref=suburb_card" className="si-card-btn-outline">
                <span>Check rent →</span>
                <ArrowRight />
              </Link>
            </div>

            {/* Related suburbs */}
            <div className="si-card">
              <div className="si-card-title" style={{ marginBottom: 12 }}>Related locations</div>
              <div className="si-related-list">
                {data.relatedSuburbs.map(r => (
                  <Link
                    key={r.suburbSlug}
                    href={`/${r.type}/${r.citySlug}/${r.suburbSlug}`}
                    className="si-related-link"
                  >
                    <span>{r.label}</span>
                    <ArrowRight />
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Final CTA */}
      <section className="si-cta">
        <div className="si-shell">
          <div className="si-cta-inner">
            <h2>See the full picture for {data.suburb}.</h2>
            <p>
              This analysis uses benchmarks. The full Locatalyze report uses your actual address —
              competitor pins within 500m, estimated daily foot traffic, catchment demographics, and a
              location-specific P&amp;L model.
            </p>
            <div className="si-cta-features">
              {[
                { t: 'Competitor map', d: 'Every direct competitor within 500m of your address.' },
                { t: 'Foot traffic estimate', d: 'Daily visitor volume for your exact street and block.' },
                { t: 'Demographic breakdown', d: 'Income, age, and spending profile for your catchment.' },
                { t: '12-month P&L', d: 'Revenue, costs, and break-even at your actual location.' },
              ].map(f => (
                <div key={f.t} className="si-cta-feature">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#34D399"
                    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span><strong style={{ color: 'rgba(255,255,255,0.8)', display: 'block' }}>{f.t}</strong>{f.d}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
              <Link href={onboardingRef('suburb_footer_report')} className="si-cta-btn-primary">
                Get the {data.suburb} report
                <ArrowRight />
              </Link>
              <Link href={toolsHubRef('suburb_footer')} className="si-cta-btn-tools">
                Free tools hub
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
