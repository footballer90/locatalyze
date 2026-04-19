// app/(marketing)/analyse/newcastle/[suburb]/page.tsx
// Static suburb intelligence pages — 20 Newcastle suburbs
// Server component: generateStaticParams + generateMetadata + full consulting-style render

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  getNewcastleSuburb,
  getAllNewcastleSuburbs,
  NEWCASTLE_SUBURB_SLUGS,
  type NewcastleSuburb,
  type Verdict,
  type FitRating,
} from '@/lib/newcastle-suburbs'

// ── Static generation ────────────────────────────────────────────────────────
export function generateStaticParams() {
  return NEWCASTLE_SUBURB_SLUGS.map((slug) => ({ suburb: slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ suburb: string }>
}): Promise<Metadata> {
  const { suburb } = await params
  const data = getNewcastleSuburb(suburb)
  if (!data) return { title: 'Not Found' }
  return {
    title: data.metaTitle,
    description: data.metaDescription,
    alternates: {
      canonical: `https://www.locatalyze.com/analyse/newcastle/${data.slug}`,
    },
    openGraph: {
      title: data.metaTitle,
      description: data.metaDescription,
      url: `https://www.locatalyze.com/analyse/newcastle/${data.slug}`,
      type: 'article',
    },
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────
const S = {
  brand: '#0891B2',
  brandLight: '#E0F7FA',
  emerald: '#059669',
  emeraldBg: '#ECFDF5',
  emeraldBdr: '#A7F3D0',
  amber: '#D97706',
  amberBg: '#FFFBEB',
  amberBdr: '#FDE68A',
  red: '#DC2626',
  redBg: '#FEF2F2',
  redBdr: '#FECACA',
  muted: '#475569',
  border: '#E2E8F0',
  n50: '#FAFAF9',
  n100: '#F5F5F4',
  n900: '#1C1917',
  white: '#FFFFFF',
}

function verdictColors(v: Verdict) {
  if (v === 'GO') return { bg: S.emeraldBg, bdr: S.emeraldBdr, txt: S.emerald }
  if (v === 'CAUTION') return { bg: S.amberBg, bdr: S.amberBdr, txt: S.amber }
  return { bg: S.redBg, bdr: S.redBdr, txt: S.red }
}

function fitColors(r: FitRating) {
  if (r === 'Excellent') return { bg: S.emeraldBg, txt: S.emerald }
  if (r === 'Good') return { bg: '#EFF6FF', txt: '#1D4ED8' }
  if (r === 'Fair') return { bg: S.amberBg, txt: S.amber }
  return { bg: S.redBg, txt: S.red }
}

function levelDot(level: string) {
  if (level === 'Very High' || level === 'High') return '#059669'
  if (level === 'Medium') return '#D97706'
  return '#94A3B8'
}

// ── Schema ───────────────────────────────────────────────────────────────────
function SuburbSchema({ suburb }: { suburb: NewcastleSuburb }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: suburb.metaTitle,
    description: suburb.metaDescription,
    author: { '@type': 'Organization', name: 'Locatalyze', url: 'https://www.locatalyze.com' },
    publisher: { '@type': 'Organization', name: 'Locatalyze' },
    datePublished: '2026-04-01',
    dateModified: '2026-04-19',
    url: `https://www.locatalyze.com/analyse/newcastle/${suburb.slug}`,
    about: {
      '@type': 'Place',
      name: `${suburb.name}, Newcastle NSW`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: suburb.name,
        addressRegion: 'NSW',
        addressCountry: 'AU',
      },
    },
  }

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.locatalyze.com' },
      { '@type': 'ListItem', position: 2, name: 'Newcastle Business Guide', item: 'https://www.locatalyze.com/analyse/newcastle' },
      { '@type': 'ListItem', position: 3, name: suburb.name, item: `https://www.locatalyze.com/analyse/newcastle/${suburb.slug}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
    </>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default async function NewcastleSuburbPage({
  params,
}: {
  params: Promise<{ suburb: string }>
}) {
  const { suburb: slugParam } = await params
  const suburb = getNewcastleSuburb(slugParam)
  if (!suburb) notFound()

  const vc = verdictColors(suburb.verdict)
  const allSuburbs = getAllNewcastleSuburbs()
  const otherSuburbs = allSuburbs.filter((s) => s.slug !== suburb.slug).slice(0, 4)

  return (
    <>
      <SuburbSchema suburb={suburb} />
      <div style={{ background: S.n50, minHeight: '100vh', paddingBottom: 80 }}>

        {/* Breadcrumb */}
        <div style={{ background: S.white, borderBottom: `1px solid ${S.border}`, padding: '12px 20px', fontSize: 13 }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' as const }}>
            <Link href="/" style={{ color: S.brand, textDecoration: 'none' }}>Home</Link>
            <span style={{ color: S.muted }}>/</span>
            <Link href="/analyse/newcastle" style={{ color: S.brand, textDecoration: 'none' }}>Newcastle</Link>
            <span style={{ color: S.muted }}>/</span>
            <span style={{ color: S.muted, fontWeight: 600 }}>{suburb.name}</span>
          </div>
        </div>

        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg, #0891B2 0%, #0369A1 100%)', padding: '56px 20px', color: S.white }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, justifyContent: 'space-between', alignItems: 'flex-start', gap: 24, marginBottom: 32 }}>
              <div style={{ flex: 1, minWidth: 280 }}>
                <p style={{ fontSize: 12, color: '#BAE6FD', marginBottom: 8, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' as const }}>
                  Newcastle Business Location Analysis
                </p>
                <h1 style={{ fontSize: 40, fontWeight: 900, marginBottom: 10, lineHeight: 1.15 }}>{suburb.name}</h1>
                <p style={{ fontSize: 16, color: '#E0F2FE', maxWidth: 600, lineHeight: 1.5 }}>{suburb.heroSubline}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'flex-end', gap: 12 }}>
                <span style={{
                  fontSize: 15, fontWeight: 800, color: vc.txt, background: vc.bg,
                  border: `1.5px solid ${vc.bdr}`, borderRadius: 8, padding: '6px 18px',
                }}>
                  {suburb.verdict}
                </span>
                <div style={{ textAlign: 'right' as const }}>
                  <p style={{ fontSize: 12, color: '#BAE6FD' }}>Est. Revenue Range</p>
                  <p style={{ fontSize: 18, fontWeight: 700 }}>{suburb.revenueRange}</p>
                </div>
              </div>
            </div>

            {/* Hero stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 20 }}>
              {[
                { label: 'Rent Range', value: suburb.rentRange },
                { label: 'Competition', value: suburb.competitionLevel },
                { label: 'Foot Traffic', value: suburb.footTrafficLevel },
                { label: 'Median Income', value: suburb.medianIncome },
                { label: 'Risk/Reward', value: suburb.riskReward },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p style={{ fontSize: 11, color: '#BAE6FD', marginBottom: 4, textTransform: 'uppercase' as const, letterSpacing: 0.5 }}>{label}</p>
                  <p style={{ fontSize: 15, fontWeight: 700 }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Verdict Panel */}
        <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 20px' }}>
          <div style={{ background: vc.bg, border: `1.5px solid ${vc.bdr}`, borderRadius: 16, padding: '28px 32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <span style={{ fontSize: 22, fontWeight: 900, color: vc.txt }}>VERDICT: {suburb.verdict}</span>
            </div>
            <p style={{ fontSize: 15, color: '#1C1917', lineHeight: 1.7 }}>{suburb.verdictReason}</p>
          </div>
        </div>

        {/* Suburb Overview */}
        <div style={{ maxWidth: 1200, margin: '32px auto', padding: '0 20px' }}>
          <div style={{ background: S.white, borderRadius: 16, border: `1px solid ${S.border}`, padding: '32px 36px' }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: S.n900, marginBottom: 24 }}>Suburb Intelligence</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32 }}>
              <div>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: S.brand, marginBottom: 8, textTransform: 'uppercase' as const, letterSpacing: 0.5 }}>Demographics</h3>
                <p style={{ fontSize: 14, color: S.muted, lineHeight: 1.65 }}>{suburb.demographics}</p>
              </div>
              <div>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: S.brand, marginBottom: 8, textTransform: 'uppercase' as const, letterSpacing: 0.5 }}>Spending Behaviour</h3>
                <p style={{ fontSize: 14, color: S.muted, lineHeight: 1.65 }}>{suburb.spendingBehavior}</p>
              </div>
              <div>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: S.brand, marginBottom: 8, textTransform: 'uppercase' as const, letterSpacing: 0.5 }}>Suburb Character</h3>
                <p style={{ fontSize: 14, color: S.muted, lineHeight: 1.65 }}>{suburb.suburbVibe}</p>
              </div>
            </div>

            {/* Peak zones + anchors */}
            <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 28 }}>
              <div>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: S.brand, marginBottom: 10, textTransform: 'uppercase' as const, letterSpacing: 0.5 }}>Peak Trading Zones</h3>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 6 }}>
                  {suburb.peakZones.map((z) => (
                    <div key={z} style={{ fontSize: 13, color: S.n900, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <span style={{ color: S.brand, marginTop: 2, flexShrink: 0 }}>›</span>
                      <span>{z}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: S.brand, marginBottom: 10, textTransform: 'uppercase' as const, letterSpacing: 0.5 }}>Anchor Businesses</h3>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 6 }}>
                  {suburb.anchorBusinesses.map((a) => (
                    <div key={a} style={{ fontSize: 13, color: S.n900, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <span style={{ color: S.brand, marginTop: 2, flexShrink: 0 }}>›</span>
                      <span>{a}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: S.brand, marginBottom: 10, textTransform: 'uppercase' as const, letterSpacing: 0.5 }}>Market Signals</h3>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
                  {[
                    { label: 'Competition', value: suburb.competitionLevel },
                    { label: 'Foot Traffic', value: suburb.footTrafficLevel },
                    { label: 'Saturation', value: suburb.saturationLevel },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, color: S.muted }}>{label}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: levelDot(value), background: `${levelDot(value)}18`, padding: '2px 10px', borderRadius: 20 }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Business Fit Grid */}
        <div style={{ maxWidth: 1200, margin: '32px auto', padding: '0 20px' }}>
          <div style={{ background: S.white, borderRadius: 16, border: `1px solid ${S.border}`, padding: '32px 36px' }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: S.n900, marginBottom: 24 }}>Business Fit by Type</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
              {(
                [
                  ['Café', suburb.businessFit.cafe],
                  ['Restaurant', suburb.businessFit.restaurant],
                  ['Retail', suburb.businessFit.retail],
                  ['Gym / Fitness', suburb.businessFit.gym],
                ] as const
              ).map(([type, fit]) => {
                const fc = fitColors(fit.rating)
                return (
                  <div key={type} style={{ border: `1px solid ${S.border}`, borderRadius: 12, padding: '20px 22px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: S.n900 }}>{type}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: fc.txt, background: fc.bg, borderRadius: 20, padding: '2px 10px' }}>{fit.rating}</span>
                    </div>
                    <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6 }}>{fit.reason}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Competition + Market Gaps */}
        <div style={{ maxWidth: 1200, margin: '32px auto', padding: '0 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>

          <div style={{ background: S.white, borderRadius: 16, border: `1px solid ${S.border}`, padding: '28px 32px' }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: S.n900, marginBottom: 20 }}>Competition Analysis</h2>
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 12, color: S.muted, marginBottom: 4, textTransform: 'uppercase' as const, letterSpacing: 0.5 }}>Competitor Count</p>
              <p style={{ fontSize: 18, fontWeight: 700, color: S.n900 }}>{suburb.competitorCount}</p>
            </div>
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 12, color: S.muted, marginBottom: 4, textTransform: 'uppercase' as const, letterSpacing: 0.5 }}>Saturation Level</p>
              <p style={{ fontSize: 15, fontWeight: 700, color: levelDot(suburb.saturationLevel) }}>{suburb.saturationLevel}</p>
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: S.n900, marginBottom: 8 }}>What&apos;s Working</p>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.65 }}>{suburb.whatWorking}</p>
            </div>
          </div>

          <div style={{ background: S.white, borderRadius: 16, border: `1px solid ${S.border}`, padding: '28px 32px' }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: S.n900, marginBottom: 20 }}>Market Gaps</h2>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
              {suburb.marketGaps.map((gap) => (
                <div key={gap} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 14px', background: S.emeraldBg, borderRadius: 10 }}>
                  <span style={{ color: S.emerald, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                  <span style={{ fontSize: 13, color: '#064E3B', lineHeight: 1.5 }}>{gap}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rent Analysis */}
        <div style={{ maxWidth: 1200, margin: '32px auto', padding: '0 20px' }}>
          <div style={{ background: S.white, borderRadius: 16, border: `1px solid ${S.border}`, padding: '32px 36px' }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: S.n900, marginBottom: 24 }}>Rent Analysis</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 28 }}>
              <div>
                <p style={{ fontSize: 12, color: S.muted, marginBottom: 6, textTransform: 'uppercase' as const, letterSpacing: 0.5 }}>Typical Rent Range</p>
                <p style={{ fontSize: 28, fontWeight: 900, color: S.brand, marginBottom: 4 }}>{suburb.rentRange}</p>
                <p style={{ fontSize: 13, color: S.muted }}>Level: <strong>{suburb.rentLevel}</strong></p>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: suburb.rentJustified ? S.emerald : S.amber }}>
                    {suburb.rentJustified ? 'Rent is Justified' : 'Rent Requires Caution'}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.65 }}>{suburb.rentReason}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Success / Failure */}
        <div style={{ maxWidth: 1200, margin: '32px auto', padding: '0 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>

          <div style={{ background: S.emeraldBg, borderRadius: 16, border: `1.5px solid ${S.emeraldBdr}`, padding: '28px 32px' }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#064E3B', marginBottom: 18 }}>This works ONLY if…</h2>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 12 }}>
              {suburb.successConditions.map((c) => (
                <div key={c} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ color: S.emerald, fontWeight: 700, flexShrink: 0, fontSize: 15 }}>✓</span>
                  <p style={{ fontSize: 13, color: '#064E3B', lineHeight: 1.6 }}>{c}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: S.redBg, borderRadius: 16, border: `1.5px solid ${S.redBdr}`, padding: '28px 32px' }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#7F1D1D', marginBottom: 18 }}>This fails if…</h2>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 12 }}>
              {suburb.failureRisks.map((r) => (
                <div key={r} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ color: S.red, fontWeight: 700, flexShrink: 0, fontSize: 15 }}>✕</span>
                  <p style={{ fontSize: 13, color: '#7F1D1D', lineHeight: 1.6 }}>{r}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Key Insight */}
        <div style={{ maxWidth: 1200, margin: '32px auto', padding: '0 20px' }}>
          <div style={{ background: '#F0F9FF', border: `1.5px solid ${S.brand}40`, borderRadius: 16, padding: '28px 32px' }}>
            <p style={{ fontSize: 11, color: S.brand, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 10 }}>Key Insight</p>
            <p style={{ fontSize: 16, color: '#0C4A6E', lineHeight: 1.75, fontStyle: 'italic' }}>&ldquo;{suburb.keyInsight}&rdquo;</p>
          </div>
        </div>

        {/* CTA Panel */}
        <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 20px' }}>
          <div style={{ background: 'linear-gradient(135deg, #0891B2 0%, #0369A1 100%)', borderRadius: 20, padding: '48px 40px', color: S.white, textAlign: 'center' as const }}>
            <h2 style={{ fontSize: 26, fontWeight: 900, marginBottom: 12 }}>
              Get a Full AI Report for {suburb.name}
            </h2>
            <p style={{ fontSize: 15, color: '#E0F2FE', marginBottom: 28, maxWidth: 540, margin: '0 auto 28px' }}>
              Enter your specific address and business type to receive competitor intelligence, exact rent benchmarks, and a GO / CAUTION / NO verdict with financial projections.
            </p>
            <Link
              href="/onboarding"
              style={{
                display: 'inline-block', background: S.white, color: S.brand,
                padding: '14px 32px', borderRadius: 10, fontWeight: 800, fontSize: 16,
                textDecoration: 'none', letterSpacing: 0.2,
              }}
            >
              Analyse My Location →
            </Link>
            <p style={{ fontSize: 12, color: '#BAE6FD', marginTop: 14 }}>Free to start · Report in 90 seconds</p>
          </div>
        </div>

        {/* Related Suburbs */}
        <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 20px' }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: S.n900, marginBottom: 20 }}>Compare Nearby Suburbs</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {suburb.relatedSuburbs.map((rel) => (
              <Link key={rel.slug} href={`/analyse/newcastle/${rel.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: S.white, padding: '18px 22px', borderRadius: 12,
                  border: `1px solid ${S.border}`, transition: 'all 0.2s',
                }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: S.n900, marginBottom: 6 }}>{rel.name}</p>
                  <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.5 }}>{rel.reason}</p>
                  <p style={{ fontSize: 12, color: S.brand, fontWeight: 700, marginTop: 10 }}>Full analysis →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* All Newcastle Suburbs table */}
        <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 20px' }}>
          <div style={{ background: S.white, borderRadius: 16, border: `1px solid ${S.border}`, padding: '32px 36px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: S.n900 }}>More Newcastle Suburbs</h2>
              <Link href="/analyse/newcastle" style={{ fontSize: 13, color: S.brand, textDecoration: 'none', fontWeight: 600 }}>View full guide →</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8 }}>
              {otherSuburbs.map((s) => {
                const svc = verdictColors(s.verdict)
                return (
                  <Link key={s.slug} href={`/analyse/newcastle/${s.slug}`} style={{ textDecoration: 'none' }}>
                    <div style={{ padding: '10px 14px', border: `1px solid ${S.border}`, borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, color: S.n900, fontWeight: 600 }}>{s.name}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: svc.txt, background: svc.bg, borderRadius: 4, padding: '1px 6px' }}>{s.verdict}</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* Back link */}
        <div style={{ maxWidth: 1200, margin: '48px auto', padding: '0 20px' }}>
          <Link href="/analyse/newcastle" style={{ display: 'inline-block', padding: '12px 20px', border: `1px solid ${S.border}`, borderRadius: 10, color: S.brand, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
            ← Back to Newcastle Business Guide
          </Link>
        </div>

        {/* Footer */}
        <div style={{ background: S.n100, borderTop: `1px solid ${S.border}`, padding: '40px 20px', marginTop: 40 }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32, marginBottom: 32 }}>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: S.n900, marginBottom: 10 }}>{suburb.name}</p>
                <p style={{ fontSize: 12, color: S.muted }}>Verdict: {suburb.verdict}</p>
                <p style={{ fontSize: 12, color: S.muted }}>Rent: {suburb.rentRange}</p>
                <p style={{ fontSize: 12, color: S.muted }}>Income: {suburb.medianIncome}</p>
              </div>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: S.n900, marginBottom: 10 }}>Locatalyze</p>
                <Link href="/" style={{ fontSize: 12, color: S.brand, textDecoration: 'none', display: 'block', marginBottom: 4 }}>Home</Link>
                <Link href="/analyse/newcastle" style={{ fontSize: 12, color: S.brand, textDecoration: 'none', display: 'block', marginBottom: 4 }}>Newcastle Guide</Link>
                <Link href="/onboarding" style={{ fontSize: 12, color: S.brand, textDecoration: 'none', display: 'block' }}>Start Free Analysis</Link>
              </div>
            </div>
            <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 20, textAlign: 'center' as const }}>
              <p style={{ fontSize: 12, color: S.muted }}>
                © 2026 Locatalyze · Data current as of April 2026 · {suburb.name}, Newcastle NSW
              </p>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}
