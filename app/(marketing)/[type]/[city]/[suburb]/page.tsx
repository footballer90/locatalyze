// app/(marketing)/[type]/[city]/[suburb]/page.tsx
// Premium suburb × business-type SEO pages powered by suburb-intel.ts

import { notFound }  from 'next/navigation'
import Link          from 'next/link'
import type { Metadata } from 'next'
import {
  getSuburbData,
  getAllSlugs,
  VERDICT_CONFIG,
  COMPETITION_LABELS,
  RENT_LABELS,
  CONFIDENCE_LABELS,
} from '@/lib/suburb-intel'

// ── Static params ─────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  return getAllSlugs().map(({ type, city, suburb }) => ({ type, city, suburb }))
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string; city: string; suburb: string }>
}): Promise<Metadata> {
  const { type, city, suburb } = await params
  const d = getSuburbData(type, city, suburb)
  if (!d) return {}
  return {
    title       : d.metaTitle,
    description : d.metaDescription,
    alternates  : { canonical: `https://locatalyze.com/${type}/${city}/${suburb}` },
    openGraph   : {
      title      : d.metaTitle,
      description: d.metaDescription,
      url        : `https://locatalyze.com/${type}/${city}/${suburb}`,
      type       : 'website',
    },
  }
}

// ── Styles ────────────────────────────────────────────────────────────────────

const S = {
  page: {
    fontFamily : '"DM Sans","Inter","Helvetica Neue",Arial,sans-serif',
    color      : '#0F172A',
    background : '#F8FAFC',
    minHeight  : '100vh',
  } as React.CSSProperties,

  // ── Hero ──────────────────────────────────────────────────────────────────
  hero: {
    background  : 'linear-gradient(160deg,#FFFFFF 0%,#F0FDF4 60%,#ECFDF5 100%)',
    borderBottom: '1px solid #E2E8F0',
    padding     : '72px 24px 60px',
  } as React.CSSProperties,
  heroInner: { maxWidth: 900, margin: '0 auto' } as React.CSSProperties,
  breadcrumb: {
    fontSize  : 13,
    color     : '#64748B',
    marginBottom: 20,
    display   : 'flex',
    alignItems: 'center',
    gap       : 6,
    flexWrap  : 'wrap',
  } as React.CSSProperties,
  breadLink: { color: '#059669', textDecoration: 'none', fontWeight: 600 } as React.CSSProperties,
  heroEyebrow: {
    display     : 'inline-block',
    fontSize    : 12,
    fontWeight  : 700,
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    color       : '#059669',
    background  : '#DCFCE7',
    border      : '1px solid #A7F3D0',
    borderRadius: 999,
    padding     : '4px 12px',
    marginBottom: 16,
  } as React.CSSProperties,
  h1: {
    fontSize    : 'clamp(28px,4.5vw,52px)',
    fontWeight  : 800,
    lineHeight  : 1.1,
    letterSpacing: '-0.025em',
    margin      : '0 0 16px',
    color       : '#0F172A',
  } as React.CSSProperties,
  heroSub: {
    fontSize  : 18,
    color     : '#475569',
    lineHeight: 1.7,
    maxWidth  : 680,
    margin    : '0 0 32px',
  } as React.CSSProperties,
  ctaRow: { display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' as const } as React.CSSProperties,
  ctaBtnPrimary: {
    display        : 'inline-flex',
    alignItems     : 'center',
    gap            : 8,
    background     : '#059669',
    color          : '#FFFFFF',
    fontWeight     : 700,
    fontSize       : 15,
    padding        : '12px 24px',
    borderRadius   : 12,
    textDecoration : 'none',
    whiteSpace     : 'nowrap',
  } as React.CSSProperties,
  ctaBtnSecondary: {
    display       : 'inline-flex',
    alignItems    : 'center',
    gap           : 8,
    background    : 'transparent',
    color         : '#059669',
    fontWeight    : 600,
    fontSize      : 14,
    textDecoration: 'none',
  } as React.CSSProperties,

  // ── Section layout ─────────────────────────────────────────────────────────
  section: { padding: '64px 24px' } as React.CSSProperties,
  sectionAlt: { padding: '64px 24px', background: '#FFFFFF' } as React.CSSProperties,
  inner: { maxWidth: 900, margin: '0 auto' } as React.CSSProperties,
  sectionLabel: {
    fontSize     : 11,
    fontWeight   : 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color        : '#059669',
    marginBottom : 8,
  } as React.CSSProperties,
  sectionTitle: {
    fontSize    : 'clamp(22px,3vw,32px)',
    fontWeight  : 800,
    letterSpacing: '-0.02em',
    margin      : '0 0 10px',
    color       : '#0F172A',
  } as React.CSSProperties,
  sectionSub: {
    fontSize  : 16,
    color     : '#64748B',
    lineHeight: 1.6,
    margin    : '0 0 36px',
    maxWidth  : 640,
  } as React.CSSProperties,
  divider: { height: 1, background: '#E2E8F0', margin: '0' } as React.CSSProperties,

  // ── Verdict panel ──────────────────────────────────────────────────────────
  verdictGrid: {
    display             : 'grid',
    gridTemplateColumns : 'repeat(auto-fit,minmax(170px,1fr))',
    gap                 : 14,
    marginTop           : 32,
  } as React.CSSProperties,
  verdictCard: {
    background  : '#FFFFFF',
    border      : '1px solid #E2E8F0',
    borderRadius: 16,
    padding     : '20px 24px',
  } as React.CSSProperties,
  vcLabel: {
    fontSize     : 11,
    fontWeight   : 700,
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    color        : '#94A3B8',
    marginBottom : 8,
    display      : 'block',
  } as React.CSSProperties,
  vcValue: {
    fontSize  : 22,
    fontWeight: 800,
    color     : '#0F172A',
    lineHeight: 1.2,
  } as React.CSSProperties,
  vcNote: {
    fontSize  : 13,
    color     : '#64748B',
    marginTop : 4,
    lineHeight: 1.4,
  } as React.CSSProperties,

  // ── Score bar ──────────────────────────────────────────────────────────────
  scoreRow: { display: 'flex', flexDirection: 'column' as const, gap: 14 } as React.CSSProperties,
  scoreLine: { display: 'flex', flexDirection: 'column' as const, gap: 6 } as React.CSSProperties,
  scoreHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } as React.CSSProperties,
  scoreName: { fontSize: 14, fontWeight: 600, color: '#0F172A' } as React.CSSProperties,
  scoreVal: { fontSize: 14, fontWeight: 700, color: '#0F172A' } as React.CSSProperties,
  barBg: { height: 8, borderRadius: 8, background: '#E2E8F0', overflow: 'hidden' } as React.CSSProperties,

  // ── Cards / grid ────────────────────────────────────────────────────────────
  grid2: {
    display            : 'grid',
    gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))',
    gap                : 20,
  } as React.CSSProperties,
  card: {
    background  : '#FFFFFF',
    border      : '1px solid #E2E8F0',
    borderRadius: 16,
    padding     : '24px 28px',
  } as React.CSSProperties,
  cardTitle: { fontSize: 17, fontWeight: 700, color: '#0F172A', marginBottom: 12 } as React.CSSProperties,
  prose: { fontSize: 15, lineHeight: 1.8, color: '#334155' } as React.CSSProperties,

  // ── Check list ─────────────────────────────────────────────────────────────
  listItem: {
    display    : 'flex',
    gap        : 12,
    marginBottom: 14,
    alignItems : 'flex-start',
  } as React.CSSProperties,
  dot: (color: string) => ({
    width       : 20,
    height      : 20,
    borderRadius: 999,
    background  : color,
    flexShrink  : 0,
    marginTop   : 2,
    display     : 'flex',
    alignItems  : 'center',
    justifyContent: 'center',
  } as React.CSSProperties),
  listText: { fontSize: 15, lineHeight: 1.65, color: '#334155' } as React.CSSProperties,

  // ── Insight highlight ──────────────────────────────────────────────────────
  insightBox: {
    background  : 'linear-gradient(135deg,#F0FDF4,#ECFDF5)',
    border      : '1px solid #A7F3D0',
    borderRadius: 16,
    padding     : 28,
    margin      : '32px 0',
  } as React.CSSProperties,
  insightText: {
    fontSize  : 16,
    lineHeight: 1.8,
    color     : '#0F172A',
    fontStyle : 'italic',
  } as React.CSSProperties,

  // ── Badge ──────────────────────────────────────────────────────────────────
  badge: (bg: string, color: string) => ({
    display     : 'inline-block',
    fontSize    : 12,
    fontWeight  : 700,
    padding     : '3px 10px',
    borderRadius: 999,
    background  : bg,
    color,
  } as React.CSSProperties),

  // ── Related suburbs ────────────────────────────────────────────────────────
  relatedGrid: {
    display            : 'grid',
    gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))',
    gap                : 12,
  } as React.CSSProperties,
  relatedCard: {
    border        : '1px solid #E2E8F0',
    borderRadius  : 12,
    padding       : '16px 20px',
    textDecoration: 'none',
    color         : 'inherit',
    display       : 'block',
    background    : '#FFFFFF',
  } as React.CSSProperties,

  // ── CTA footer ─────────────────────────────────────────────────────────────
  ctaSection: {
    background : 'linear-gradient(135deg,#059669 0%,#0F766E 100%)',
    padding    : '72px 24px',
    textAlign  : 'center',
  } as React.CSSProperties,
  ctaTitle: { fontSize: 'clamp(24px,3.5vw,38px)', fontWeight: 800, color: '#FFFFFF', margin: '0 0 12px' } as React.CSSProperties,
  ctaSub: { fontSize: 17, color: '#A7F3D0', margin: '0 0 12px', lineHeight: 1.6 } as React.CSSProperties,
  ctaList: {
    display       : 'flex',
    justifyContent: 'center',
    flexWrap      : 'wrap',
    gap           : 24,
    margin        : '24px 0 36px',
  } as React.CSSProperties,
  ctaListItem: { fontSize: 14, color: '#D1FAE5', display: 'flex', alignItems: 'center', gap: 6 } as React.CSSProperties,
  ctaMainBtn: {
    display       : 'inline-block',
    background    : '#FFFFFF',
    color         : '#059669',
    fontWeight    : 800,
    fontSize      : 16,
    padding       : '16px 40px',
    borderRadius  : 100,
    textDecoration: 'none',
  } as React.CSSProperties,

  // ── Methodology ────────────────────────────────────────────────────────────
  methodBox: {
    background  : '#FFFFFF',
    border      : '1px solid #E2E8F0',
    borderRadius: 12,
    padding     : '20px 24px',
    marginTop   : 32,
  } as React.CSSProperties,
  methodText: { fontSize: 13, color: '#64748B', lineHeight: 1.7 } as React.CSSProperties,
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtMoney(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `$${Math.round(n / 1_000)}k`
  return `$${n}`
}

function scoreBarColor(val: number) {
  if (val >= 8) return '#059669'
  if (val >= 6) return '#D97706'
  return '#DC2626'
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function SuburbIntelPage({
  params,
}: {
  params: Promise<{ type: string; city: string; suburb: string }>
}) {
  const { type, city, suburb } = await params
  const d = getSuburbData(type, city, suburb)
  if (!d) notFound()

  const vc = VERDICT_CONFIG[d.verdict]

  const onboardingHref = `/onboarding?ref=suburb-intel&type=${type}&city=${city}&suburb=${suburb}`

  const scoreItems: { label: string; value: number; max: number; fmt?: string }[] = [
    { label: 'Demand Score',         value: d.demandScore,           max: 10 },
    { label: 'Avg Ticket',           value: d.avgTicket,             max: 200, fmt: `$${d.avgTicket}` },
    { label: 'Daily Customers Needed', value: d.dailyCustomersNeeded, max: 200, fmt: `${d.dailyCustomersNeeded}/day` },
  ]

  return (
    <main style={S.page}>

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section style={S.hero}>
        <div style={S.heroInner}>

          {/* Breadcrumb */}
          <nav style={S.breadcrumb} aria-label="breadcrumb">
            <Link href="/" style={S.breadLink}>Home</Link>
            <span style={{ color: '#CBD5E1' }}>›</span>
            <Link href={`/suburb`} style={S.breadLink}>Suburbs</Link>
            <span style={{ color: '#CBD5E1' }}>›</span>
            <Link href={`/suburb/${suburb}`} style={S.breadLink}>{d.suburb}</Link>
            <span style={{ color: '#CBD5E1' }}>›</span>
            <span style={{ color: '#94A3B8' }}>{d.businessLabel}</span>
          </nav>

          <span style={S.heroEyebrow}>{d.state} · {d.city} · Location Intelligence</span>

          <h1 style={S.h1}>
            Is {d.suburb} a good place to open a{' '}
            <span style={{ color: '#059669' }}>{d.businessLabel.toLowerCase()}?</span>
          </h1>

          <p style={S.heroSub}>
            {d.verdictSummary}
          </p>

          <div style={S.ctaRow}>
            <Link href={onboardingHref} style={S.ctaBtnPrimary}>
              Run Full Location Analysis →
            </Link>
            <Link href="#verdict" style={S.ctaBtnSecondary}>
              See verdict ↓
            </Link>
          </div>
        </div>
      </section>

      {/* ── VERDICT PANEL ─────────────────────────────────────────────────────── */}
      <section id="verdict" style={S.sectionAlt}>
        <div style={S.inner}>

          <p style={S.sectionLabel}>Quick verdict</p>
          <h2 style={S.sectionTitle}>The {d.suburb} {d.businessLabel.split('/')[0].trim()} Verdict</h2>
          <p style={S.sectionSub}>
            Based on commercial lease data, demographic benchmarks, and WA hospitality industry metrics.
          </p>

          {/* Verdict badge */}
          <div style={{
            display      : 'inline-flex',
            alignItems   : 'center',
            gap          : 12,
            background   : vc.lightBg,
            border       : `2px solid ${vc.lightBorder}`,
            borderRadius : 16,
            padding      : '14px 24px',
            marginBottom : 8,
          }}>
            <span style={{
              background  : vc.bg,
              color       : '#FFFFFF',
              fontWeight  : 800,
              fontSize    : 22,
              padding     : '4px 18px',
              borderRadius: 10,
              letterSpacing: '0.04em',
            }}>{d.verdict}</span>
            <p style={{ fontSize: 15, color: vc.color, fontWeight: 600, margin: 0 }}>
              {d.verdict === 'GO'
                ? 'Conditions are favourable — proceed with a clear concept.'
                : d.verdict === 'CAUTION'
                ? 'Viable, but specific conditions must be met first.'
                : 'Economics are unfavourable at current rents and demand.'}
            </p>
          </div>

          {/* Metric grid */}
          <div style={S.verdictGrid}>

            <div style={S.verdictCard}>
              <span style={S.vcLabel}>Monthly Revenue</span>
              <div style={S.vcValue}>{fmtMoney(d.monthlyRevenue.low)}–{fmtMoney(d.monthlyRevenue.high)}</div>
              <div style={S.vcNote}>Estimated range, pre-tax</div>
            </div>

            <div style={S.verdictCard}>
              <span style={S.vcLabel}>Monthly Profit</span>
              <div style={{ ...S.vcValue, color: d.monthlyProfit.low > 0 ? '#059669' : '#DC2626' }}>
                {fmtMoney(d.monthlyProfit.low)}–{fmtMoney(d.monthlyProfit.high)}
              </div>
              <div style={S.vcNote}>After costs, no owner wage</div>
            </div>

            <div style={S.verdictCard}>
              <span style={S.vcLabel}>Typical Monthly Rent</span>
              <div style={S.vcValue}>{fmtMoney(d.monthlyRent.low)}–{fmtMoney(d.monthlyRent.high)}</div>
              <div style={S.vcNote}>{RENT_LABELS[d.rentLevel]}</div>
            </div>

            <div style={S.verdictCard}>
              <span style={S.vcLabel}>Competition</span>
              <div style={{ ...S.vcValue, fontSize: 17 }}>{
                d.competitionLevel === 'saturated' ? 'Saturated' :
                d.competitionLevel === 'high'       ? 'High'      :
                d.competitionLevel === 'medium'     ? 'Medium'    : 'Low'
              }</div>
              <div style={S.vcNote}>{COMPETITION_LABELS[d.competitionLevel]}</div>
            </div>

            <div style={S.verdictCard}>
              <span style={S.vcLabel}>Break-Even Target</span>
              <div style={S.vcValue}>{d.dailyCustomersNeeded}</div>
              <div style={S.vcNote}>customers/day before profit</div>
            </div>

            <div style={S.verdictCard}>
              <span style={S.vcLabel}>Avg Transaction</span>
              <div style={S.vcValue}>${d.avgTicket}</div>
              <div style={S.vcNote}>Expected per visit</div>
            </div>

          </div>
        </div>
      </section>

      <div style={S.divider} />

      {/* ── SCORE BREAKDOWN ───────────────────────────────────────────────────── */}
      <section style={S.section}>
        <div style={S.inner}>
          <div style={S.grid2}>

            {/* Score bars */}
            <div style={S.card}>
              <div style={S.cardTitle}>Score Breakdown</div>
              <div style={S.scoreRow}>

                <div style={S.scoreLine}>
                  <div style={S.scoreHeader}>
                    <span style={S.scoreName}>Demand Score</span>
                    <span style={{ ...S.scoreVal, color: scoreBarColor(d.demandScore) }}>
                      {d.demandScore}/10
                    </span>
                  </div>
                  <div style={S.barBg}>
                    <div style={{ height: '100%', width: `${d.demandScore * 10}%`, background: scoreBarColor(d.demandScore), borderRadius: 8 }} />
                  </div>
                </div>

                <div style={S.scoreLine}>
                  <div style={S.scoreHeader}>
                    <span style={S.scoreName}>Rent Pressure</span>
                    <span style={{ ...S.scoreVal, color: d.rentLevel === 'premium' ? '#DC2626' : d.rentLevel === 'above-market' ? '#D97706' : '#059669' }}>
                      {d.rentLevel === 'below-market' ? 'Low' : d.rentLevel === 'at-market' ? 'Moderate' : d.rentLevel === 'above-market' ? 'High' : 'Very High'}
                    </span>
                  </div>
                  <div style={S.barBg}>
                    <div style={{
                      height: '100%',
                      width: d.rentLevel === 'below-market' ? '25%' : d.rentLevel === 'at-market' ? '50%' : d.rentLevel === 'above-market' ? '75%' : '95%',
                      background: d.rentLevel === 'below-market' ? '#059669' : d.rentLevel === 'at-market' ? '#D97706' : '#DC2626',
                      borderRadius: 8,
                    }} />
                  </div>
                </div>

                <div style={S.scoreLine}>
                  <div style={S.scoreHeader}>
                    <span style={S.scoreName}>Competition Density</span>
                    <span style={{ ...S.scoreVal, color: d.competitionLevel === 'saturated' ? '#DC2626' : d.competitionLevel === 'high' ? '#D97706' : '#059669' }}>
                      {d.competitionLevel === 'low' ? '2/4' : d.competitionLevel === 'medium' ? '2/4' : d.competitionLevel === 'high' ? '3/4' : '4/4'}
                    </span>
                  </div>
                  <div style={S.barBg}>
                    <div style={{
                      height: '100%',
                      width: d.competitionLevel === 'low' ? '25%' : d.competitionLevel === 'medium' ? '50%' : d.competitionLevel === 'high' ? '75%' : '100%',
                      background: d.competitionLevel === 'saturated' ? '#DC2626' : d.competitionLevel === 'high' ? '#D97706' : '#059669',
                      borderRadius: 8,
                    }} />
                  </div>
                </div>

                <div style={S.scoreLine}>
                  <div style={S.scoreHeader}>
                    <span style={S.scoreName}>Data Confidence</span>
                    <span style={{ ...S.scoreVal, color: d.confidenceLevel === 'high' ? '#059669' : d.confidenceLevel === 'medium' ? '#D97706' : '#DC2626' }}>
                      {CONFIDENCE_LABELS[d.confidenceLevel].split(' —')[0]}
                    </span>
                  </div>
                  <div style={S.barBg}>
                    <div style={{
                      height: '100%',
                      width: d.confidenceLevel === 'high' ? '90%' : d.confidenceLevel === 'medium' ? '55%' : '25%',
                      background: d.confidenceLevel === 'high' ? '#059669' : d.confidenceLevel === 'medium' ? '#D97706' : '#DC2626',
                      borderRadius: 8,
                    }} />
                  </div>
                </div>

              </div>
            </div>

            {/* Quick comparison */}
            <div style={S.card}>
              <div style={S.cardTitle}>At a Glance</div>
              <table style={{ width: '100%', borderCollapse: 'collapse' as const, fontSize: 14 }}>
                <tbody>
                  {[
                    ['Location',        `${d.suburb}, ${d.city} ${d.state}`],
                    ['Business Type',   d.businessLabel],
                    ['Verdict',         d.verdict],
                    ['Monthly Revenue', `${fmtMoney(d.monthlyRevenue.low)} – ${fmtMoney(d.monthlyRevenue.high)}`],
                    ['Monthly Rent',    `${fmtMoney(d.monthlyRent.low)} – ${fmtMoney(d.monthlyRent.high)}`],
                    ['Avg Ticket',      `$${d.avgTicket}`],
                    ['Break-Even',      `${d.dailyCustomersNeeded} customers/day`],
                    ['Last Updated',    d.lastUpdated],
                  ].map(([label, val]) => (
                    <tr key={label} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '9px 0', color: '#64748B', fontWeight: 600, width: '45%' }}>{label}</td>
                      <td style={{ padding: '9px 0', color: '#0F172A', fontWeight: 500 }}>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </section>

      <div style={S.divider} />

      {/* ── SUBURB PROFILE ────────────────────────────────────────────────────── */}
      <section style={S.sectionAlt}>
        <div style={S.inner}>
          <p style={S.sectionLabel}>Suburb profile</p>
          <h2 style={S.sectionTitle}>Who lives in {d.suburb}?</h2>

          <div style={S.insightBox}>
            <p style={S.insightText}>{d.suburbProfile}</p>
          </div>

          <div style={S.grid2}>
            <div style={S.card}>
              <div style={S.cardTitle}>Demand Analysis</div>
              <p style={S.prose}>{d.demandAnalysis}</p>
            </div>
            <div style={S.card}>
              <div style={S.cardTitle}>Customer Behaviour</div>
              <p style={S.prose}>{d.customerBehavior}</p>
            </div>
          </div>
        </div>
      </section>

      <div style={S.divider} />

      {/* ── COMPETITION + RENT ────────────────────────────────────────────────── */}
      <section style={S.section}>
        <div style={S.inner}>
          <div style={S.grid2}>

            <div>
              <p style={S.sectionLabel}>Competition intelligence</p>
              <h2 style={{ ...S.sectionTitle, marginBottom: 16 }}>How competitive is {d.suburb}?</h2>
              <div style={{
                display    : 'inline-flex',
                alignItems : 'center',
                gap        : 8,
                background : d.competitionLevel === 'saturated' ? '#FEF2F2' : d.competitionLevel === 'high' ? '#FFFBEB' : '#F0FDF4',
                border     : `1px solid ${d.competitionLevel === 'saturated' ? '#FECACA' : d.competitionLevel === 'high' ? '#FDE68A' : '#A7F3D0'}`,
                borderRadius: 10,
                padding    : '6px 14px',
                fontSize   : 13,
                fontWeight : 700,
                color      : d.competitionLevel === 'saturated' ? '#DC2626' : d.competitionLevel === 'high' ? '#D97706' : '#059669',
                marginBottom: 20,
              }}>
                {COMPETITION_LABELS[d.competitionLevel]}
              </div>
              <p style={S.prose}>{d.competitionAnalysis}</p>
            </div>

            <div>
              <p style={S.sectionLabel}>Rent analysis</p>
              <h2 style={{ ...S.sectionTitle, marginBottom: 16 }}>Is the rent worth it?</h2>
              <div style={{
                display    : 'inline-flex',
                alignItems : 'center',
                gap        : 8,
                background : d.rentLevel === 'below-market' ? '#F0FDF4' : d.rentLevel === 'at-market' ? '#FFFBEB' : '#FEF2F2',
                border     : `1px solid ${d.rentLevel === 'below-market' ? '#A7F3D0' : d.rentLevel === 'at-market' ? '#FDE68A' : '#FECACA'}`,
                borderRadius: 10,
                padding    : '6px 14px',
                fontSize   : 13,
                fontWeight : 700,
                color      : d.rentLevel === 'below-market' ? '#059669' : d.rentLevel === 'at-market' ? '#D97706' : '#DC2626',
                marginBottom: 20,
              }}>
                {RENT_LABELS[d.rentLevel]}
              </div>
              <p style={S.prose}>{d.rentAnalysis}</p>
            </div>

          </div>
        </div>
      </section>

      <div style={S.divider} />

      {/* ── SUCCESS CONDITIONS ────────────────────────────────────────────────── */}
      <section style={S.sectionAlt}>
        <div style={S.inner}>
          <p style={S.sectionLabel}>Success conditions</p>
          <h2 style={S.sectionTitle}>What must go right in {d.suburb}</h2>
          <p style={S.sectionSub}>
            This location works — but only under specific conditions. These are the non-negotiables.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 0 }}>
            {d.successConditions.map((item, i) => (
              <div key={i} style={{ ...S.listItem, borderBottom: i < d.successConditions.length - 1 ? '1px solid #F1F5F9' : 'none', paddingBottom: 14 }}>
                <div style={{
                  width       : 26,
                  height      : 26,
                  borderRadius: 999,
                  background  : '#DCFCE7',
                  color       : '#059669',
                  fontWeight  : 800,
                  fontSize    : 12,
                  display     : 'flex',
                  alignItems  : 'center',
                  justifyContent: 'center',
                  flexShrink  : 0,
                  marginTop   : 1,
                }}>
                  {i + 1}
                </div>
                <p style={S.listText}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={S.divider} />

      {/* ── FAILURE RISKS ─────────────────────────────────────────────────────── */}
      <section style={S.section}>
        <div style={S.inner}>
          <p style={S.sectionLabel}>Failure risks</p>
          <h2 style={S.sectionTitle}>What kills businesses in {d.suburb}</h2>
          <p style={S.sectionSub}>
            The most common reasons operators fail here — avoid these before you sign.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 0 }}>
            {d.failureScenarios.map((item, i) => (
              <div key={i} style={{ ...S.listItem, borderBottom: i < d.failureScenarios.length - 1 ? '1px solid #F1F5F9' : 'none', paddingBottom: 14 }}>
                <div style={{
                  width       : 26,
                  height      : 26,
                  borderRadius: 999,
                  background  : '#FEE2E2',
                  color       : '#DC2626',
                  fontWeight  : 800,
                  fontSize    : 16,
                  display     : 'flex',
                  alignItems  : 'center',
                  justifyContent: 'center',
                  flexShrink  : 0,
                  marginTop   : 1,
                }}>
                  ✕
                </div>
                <p style={S.listText}>{item}</p>
              </div>
            ))}
          </div>

          {d.whatWouldMakeItBetter.length > 0 && (
            <>
              <div style={{ height: 32 }} />
              <p style={{ ...S.sectionLabel, marginBottom: 16 }}>What would improve the odds</p>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
                {d.whatWouldMakeItBetter.map((item, i) => (
                  <div key={i} style={S.listItem}>
                    <div style={{
                      width        : 26,
                      height       : 26,
                      borderRadius : 999,
                      background   : '#EFF6FF',
                      color        : '#1D4ED8',
                      fontWeight   : 800,
                      fontSize     : 14,
                      display      : 'flex',
                      alignItems   : 'center',
                      justifyContent: 'center',
                      flexShrink   : 0,
                    }}>→</div>
                    <p style={S.listText}>{item}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <div style={S.divider} />

      {/* ── RELATED SUBURBS ───────────────────────────────────────────────────── */}
      <section style={S.sectionAlt}>
        <div style={S.inner}>
          <p style={S.sectionLabel}>Compare locations</p>
          <h2 style={{ ...S.sectionTitle, marginBottom: 24 }}>Similar markets to consider</h2>
          <div style={S.relatedGrid}>
            {d.relatedSuburbs.map((r) => (
              <Link
                key={`${r.type}/${r.citySlug}/${r.suburbSlug}`}
                href={`/${r.type}/${r.citySlug}/${r.suburbSlug}`}
                style={S.relatedCard}
              >
                <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>{r.label}</div>
                <div style={{ fontSize: 13, color: '#059669', fontWeight: 600 }}>View analysis →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div style={S.divider} />

      {/* ── FINAL CTA ─────────────────────────────────────────────────────────── */}
      <section style={S.ctaSection}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <p style={{ ...S.sectionLabel, color: '#A7F3D0', marginBottom: 12 }}>Ready to go deeper?</p>
          <h2 style={S.ctaTitle}>
            Run a full Locatalyze report for {d.suburb}
          </h2>
          <p style={S.ctaSub}>
            This page gives you the market overview. A full report gives you address-level intelligence.
          </p>

          <div style={S.ctaList}>
            {[
              'Exact competitor names + ratings',
              'Real-time foot traffic data',
              'Address-level rent benchmarks',
              'Demographic catchment map',
              'GO / CAUTION / NO verdict with conditions',
            ].map(item => (
              <div key={item} style={S.ctaListItem}>
                <span style={{ color: '#34D399', fontWeight: 700 }}>✓</span>
                {item}
              </div>
            ))}
          </div>

          <Link href={onboardingHref} style={S.ctaMainBtn}>
            Run {d.suburb} Analysis →
          </Link>
        </div>
      </section>

      {/* ── METHODOLOGY ───────────────────────────────────────────────────────── */}
      <section style={{ ...S.section, paddingTop: 40, paddingBottom: 40 }}>
        <div style={S.inner}>
          <div style={S.methodBox}>
            <p style={{ ...S.methodText, fontWeight: 700, marginBottom: 4 }}>Methodology & Data Notes</p>
            <p style={S.methodText}>{d.dataAssumptions}</p>
            <p style={{ ...S.methodText, marginTop: 6 }}>
              Confidence: {CONFIDENCE_LABELS[d.confidenceLevel]}. Last updated: {d.lastUpdated}.{' '}
              <Link href="/methodology" style={{ color: '#059669' }}>Read full methodology →</Link>
            </p>
          </div>
        </div>
      </section>

    </main>
  )
}
