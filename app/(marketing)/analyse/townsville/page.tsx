import Link from 'next/link'
import type { Metadata } from 'next'
import { SuburbCard } from '@/components/analyse/SuburbCard'
import { C } from '@/components/analyse/AnalyseTheme'
import { getTownsvilleSuburbs } from '@/lib/analyse-data/townsville'

export const metadata: Metadata = {
  title: 'Best Suburbs to Open a Business in Townsville — 2026 Location Guide',
  description:
    'Townsville business location guide 2026. 10 suburbs scored by foot traffic, rent viability, defence sector demand, and competition. Find the best Townsville suburb for your café, restaurant, or retail business.',
  alternates: { canonical: 'https://locatalyze.com/analyse/townsville' },
  openGraph: {
    title: 'Best Suburbs to Open a Business in Townsville — 2026 Location Guide',
    description: '10 Townsville suburbs ranked and scored. Engine-derived GO/CAUTION/NO verdicts for cafés, restaurants, and retail operators.',
    url: 'https://locatalyze.com/analyse/townsville',
  },
}

export default function TownsvillePage() {
  const suburbs = getTownsvilleSuburbs()

  return (
    <div style={{ minHeight: '100vh', background: C.n50 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'Article',
        headline: 'Best Suburbs to Open a Business in Townsville 2026',
        author: { '@type': 'Organization', name: 'Locatalyze' },
        publisher: { '@type': 'Organization', name: 'Locatalyze', url: 'https://locatalyze.com' },
        url: 'https://locatalyze.com/analyse/townsville', dateModified: '2026-04-20',
      }) }} />

      <section style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #1D4ED8 50%, #2563EB 100%)', color: '#FFFFFF', padding: '56px 24px 52px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', fontSize: 12, opacity: 0.82, marginBottom: 16 }}>
            <Link href="/analyse" style={{ color: 'inherit', textDecoration: 'none' }}>Analyse</Link>
            <span>›</span>
            <span style={{ fontWeight: 700 }}>Townsville</span>
          </div>
          <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#BAE6FD', margin: '0 0 12px 0' }}>North Queensland · Location Intelligence</p>
          <h1 style={{ fontSize: 'clamp(32px, 6vw, 52px)', lineHeight: 1.05, margin: '0 0 16px 0' }}>
            Best Suburbs to Open a Business<br />in Townsville — 2026
          </h1>
          <p style={{ maxWidth: 640, fontSize: 16, lineHeight: 1.7, color: '#E0F2FE', margin: '0 0 24px 0' }}>
            10 Townsville suburbs scored across defence sector demand, retail infrastructure, rent pressure, and competition density. Townsville's economy is distinct — use data, not assumptions.
          </p>
          <Link href="/onboarding" style={{ background: '#E0F2FE', color: '#1E3A5F', textDecoration: 'none', fontWeight: 800, padding: '13px 22px', borderRadius: 10, fontSize: 15 }}>
            Analyse a Townsville address →
          </Link>
        </div>
      </section>

      <section style={{ padding: '40px 24px 72px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: C.n900, margin: 0 }}>All scored Townsville suburbs</h2>
            <span style={{ fontSize: 13, color: C.muted }}>{suburbs.length} suburbs · sorted by score</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
            {[...suburbs].sort((a, b) => b.compositeScore - a.compositeScore).map((s) => (
              <SuburbCard key={s.slug} citySlug="townsville" name={s.name} slug={s.slug} description={s.why[0]} score={s.compositeScore} verdict={s.verdict === 'RISKY' ? 'NO' : s.verdict} rentRange="" />
            ))}
          </div>
          <div style={{ marginTop: 48, background: 'linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)', borderRadius: 18, padding: '32px 28px', textAlign: 'center' }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#FFFFFF', margin: '0 0 10px 0' }}>Have a specific Townsville address in mind?</h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.85)', margin: '0 0 20px 0', lineHeight: 1.65 }}>Get a full competitor map, rent benchmark, and GO/CAUTION/NO verdict for any Townsville address. Free, no account required.</p>
            <Link href="/onboarding" style={{ display: 'inline-block', padding: '14px 28px', backgroundColor: '#E0F2FE', color: '#1E3A5F', borderRadius: 10, textDecoration: 'none', fontSize: 15, fontWeight: 800 }}>Analyse your Townsville address →</Link>
          </div>
          <div style={{ marginTop: 20 }}><Link href="/analyse" style={{ fontSize: 14, fontWeight: 700, color: C.brand, textDecoration: 'none' }}>← All cities</Link></div>
        </div>
      </section>
    </div>
  )
}
