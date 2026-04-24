import Link from 'next/link'
import type { Metadata } from 'next'
import { SuburbCard } from '@/components/analyse/SuburbCard'
import { C } from '@/components/analyse/AnalyseTheme'
import { getBallaratSuburbs } from '@/lib/analyse-data/ballarat'

export const metadata: Metadata = {
  title: 'Best Suburbs to Open a Business in Ballarat — 2026 Location Guide',
  description:
    'Ballarat business location guide 2026. 10 suburbs scored by foot traffic, rent viability, tourism, and competition gap. Find the best Ballarat suburb for your café, restaurant, or retail business.',
  alternates: { canonical: 'https://locatalyze.com/analyse/ballarat' },
  openGraph: {
    title: 'Best Suburbs to Open a Business in Ballarat — 2026 Location Guide',
    description: '10 Ballarat suburbs ranked and scored. Engine-derived GO/CAUTION/NO verdicts for cafés, restaurants, and retail operators.',
    url: 'https://locatalyze.com/analyse/ballarat',
  },
}

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Best Suburbs to Open a Business in Ballarat 2026',
  description: 'Data-driven guide to Ballarat commercial location decisions — 10 suburbs scored across rent, competition, tourism, and demand.',
  author: { '@type': 'Organization', name: 'Locatalyze' },
  publisher: { '@type': 'Organization', name: 'Locatalyze', url: 'https://locatalyze.com' },
  url: 'https://locatalyze.com/analyse/ballarat',
  datePublished: '2026-01-01',
  dateModified: '2026-04-20',
}

export default function BallaratPage() {
  const suburbs = getBallaratSuburbs()

  return (
    <div style={{ minHeight: '100vh', background: C.n50 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />

      {/* ── Hero ── */}
      <section style={{ background: 'linear-gradient(135deg, #78350F 0%, #B45309 50%, #D97706 100%)', color: '#FFFFFF', padding: '56px 24px 52px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', fontSize: 12, opacity: 0.82, marginBottom: 16 }}>
            <Link href="/analyse" style={{ color: 'inherit', textDecoration: 'none' }}>Analyse</Link>
            <span>›</span>
            <span style={{ fontWeight: 700 }}>Ballarat</span>
          </div>
          <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#FDE68A', margin: '0 0 12px 0' }}>Regional Victoria · Location Intelligence</p>
          <h1 style={{ fontSize: 'clamp(32px, 6vw, 52px)', lineHeight: 1.05, margin: '0 0 16px 0' }}>
            Best Suburbs to Open a Business<br />in Ballarat — 2026
          </h1>
          <p style={{ maxWidth: 640, fontSize: 16, lineHeight: 1.7, color: '#FEF3C7', margin: '0 0 24px 0' }}>
            10 Ballarat suburbs scored across demand, rent pressure, competition density, seasonality, and tourism. Powered by the same engine used across all Australian markets.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/onboarding" style={{ background: '#FEF3C7', color: '#78350F', textDecoration: 'none', fontWeight: 800, padding: '13px 22px', borderRadius: 10, fontSize: 15 }}>
              Analyse a Ballarat address →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Suburb Grid ── */}
      <section style={{ padding: '40px 24px 72px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: C.n900, margin: 0 }}>All scored Ballarat suburbs</h2>
            <span style={{ fontSize: 13, color: C.muted }}>{suburbs.length} suburbs · sorted by score</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
            {[...suburbs].sort((a, b) => b.compositeScore - a.compositeScore).map((s) => (
              <SuburbCard
                key={s.slug}
                citySlug="ballarat"
                name={s.name}
                slug={s.slug}
                description={s.why[0]}
                score={s.compositeScore}
                verdict={s.verdict === 'RISKY' ? 'NO' : s.verdict}
                rentRange=""
              />
            ))}
          </div>

          {/* ── CTA ── */}
          <div style={{ marginTop: 48, background: 'linear-gradient(135deg, #78350F 0%, #D97706 100%)', borderRadius: 18, padding: '32px 28px', textAlign: 'center' }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#FFFFFF', margin: '0 0 10px 0' }}>Have a specific Ballarat address in mind?</h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.85)', margin: '0 0 20px 0', lineHeight: 1.65 }}>Get a full competitor map, rent benchmark, and GO/CAUTION/NO verdict for any Ballarat address. Free, no account required.</p>
            <Link href="/onboarding" style={{ display: 'inline-block', padding: '14px 28px', backgroundColor: '#FEF3C7', color: '#78350F', borderRadius: 10, textDecoration: 'none', fontSize: 15, fontWeight: 800 }}>
              Analyse your Ballarat address →
            </Link>
          </div>

          <div style={{ marginTop: 20 }}>
            <Link href="/analyse" style={{ fontSize: 14, fontWeight: 700, color: C.brand, textDecoration: 'none' }}>← All cities</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
