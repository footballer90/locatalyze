import Link from 'next/link'
import type { Metadata } from 'next'
import { SuburbCard } from '@/components/analyse/SuburbCard'
import { C } from '@/components/analyse/AnalyseTheme'
import { getBendigoSuburbs } from '@/lib/analyse-data/bendigo'

export const metadata: Metadata = {
  title: 'Best Suburbs to Open a Business in Bendigo — 2026 Location Guide',
  description:
    'Bendigo business location guide 2026. 10 suburbs scored by foot traffic, rent viability, tourism, and competition. Find the best Bendigo suburb for your café, restaurant, or retail business.',
  alternates: { canonical: 'https://locatalyze.com/analyse/bendigo' },
  openGraph: {
    title: 'Best Suburbs to Open a Business in Bendigo — 2026 Location Guide',
    description: '10 Bendigo suburbs ranked and scored. Engine-derived GO/CAUTION/NO verdicts for cafés, restaurants, and retail operators.',
    url: 'https://locatalyze.com/analyse/bendigo',
  },
}

export default function BendigoPage() {
  const suburbs = getBendigoSuburbs()

  return (
    <div style={{ minHeight: '100vh', background: C.n50 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'Article',
        headline: 'Best Suburbs to Open a Business in Bendigo 2026',
        author: { '@type': 'Organization', name: 'Locatalyze' },
        publisher: { '@type': 'Organization', name: 'Locatalyze', url: 'https://locatalyze.com' },
        url: 'https://locatalyze.com/analyse/bendigo', dateModified: '2026-04-20',
      }) }} />

      <section style={{ background: 'linear-gradient(135deg, #7C2D12 0%, #C2410C 50%, #EA580C 100%)', color: '#FFFFFF', padding: '56px 24px 52px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', fontSize: 12, opacity: 0.82, marginBottom: 16 }}>
            <Link href="/analyse" style={{ color: 'inherit', textDecoration: 'none' }}>Analyse</Link>
            <span>›</span>
            <span style={{ fontWeight: 700 }}>Bendigo</span>
          </div>
          <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#FDBA74', margin: '0 0 12px 0' }}>Regional Victoria · Location Intelligence</p>
          <h1 style={{ fontSize: 'clamp(32px, 6vw, 52px)', lineHeight: 1.05, margin: '0 0 16px 0' }}>
            Best Suburbs to Open a Business<br />in Bendigo — 2026
          </h1>
          <p style={{ maxWidth: 640, fontSize: 16, lineHeight: 1.7, color: '#FFEDD5', margin: '0 0 24px 0' }}>
            10 Bendigo suburbs scored across demand, rent pressure, competition density, seasonality, and tourism. Engine-derived verdicts across all business types.
          </p>
          <Link href="/onboarding" style={{ background: '#FFEDD5', color: '#7C2D12', textDecoration: 'none', fontWeight: 800, padding: '13px 22px', borderRadius: 10, fontSize: 15 }}>
            Analyse a Bendigo address →
          </Link>
        </div>
      </section>

      <section style={{ padding: '40px 24px 72px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: C.n900, margin: 0 }}>All scored Bendigo suburbs</h2>
            <span style={{ fontSize: 13, color: C.muted }}>{suburbs.length} suburbs · sorted by score</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
            {[...suburbs].sort((a, b) => b.compositeScore - a.compositeScore).map((s) => (
              <SuburbCard key={s.slug} citySlug="bendigo" name={s.name} slug={s.slug} description={s.why[0]} score={s.compositeScore} verdict={s.verdict === 'RISKY' ? 'NO' : s.verdict} rentRange="" />
            ))}
          </div>
          <div style={{ marginTop: 48, background: 'linear-gradient(135deg, #7C2D12 0%, #EA580C 100%)', borderRadius: 18, padding: '32px 28px', textAlign: 'center' }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#FFFFFF', margin: '0 0 10px 0' }}>Have a specific Bendigo address in mind?</h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.85)', margin: '0 0 20px 0', lineHeight: 1.65 }}>Get a full competitor map, rent benchmark, and GO/CAUTION/NO verdict for any Bendigo address. Free, no account required.</p>
            <Link href="/onboarding" style={{ display: 'inline-block', padding: '14px 28px', backgroundColor: '#FFEDD5', color: '#7C2D12', borderRadius: 10, textDecoration: 'none', fontSize: 15, fontWeight: 800 }}>Analyse your Bendigo address →</Link>
          </div>
          <div style={{ marginTop: 20 }}><Link href="/analyse" style={{ fontSize: 14, fontWeight: 700, color: C.brand, textDecoration: 'none' }}>← All cities</Link></div>
        </div>
      </section>
    </div>
  )
}
