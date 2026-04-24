import Link from 'next/link'
import type { Metadata } from 'next'
import { SuburbCard } from '@/components/analyse/SuburbCard'
import { C } from '@/components/analyse/AnalyseTheme'
import { getIpswichSuburbs } from '@/lib/analyse-data/ipswich'

export const metadata: Metadata = {
  title: 'Best Suburbs to Open a Business in Ipswich — 2026 Location Guide',
  description:
    'Ipswich business location guide 2026. Suburbs scored by foot traffic, infrastructure growth, rent viability, and competition. Find the best Ipswich suburb for your café, restaurant, or retail business.',
  alternates: { canonical: 'https://locatalyze.com/analyse/ipswich' },
  openGraph: {
    title: 'Best Suburbs to Open a Business in Ipswich — 2026 Location Guide',
    description: 'Ipswich suburbs ranked and scored. Engine-derived GO/CAUTION/NO verdicts for cafés, restaurants, and retail operators.',
    url: 'https://locatalyze.com/analyse/ipswich',
  },
}

export default function IpswichPage() {
  const suburbs = getIpswichSuburbs()

  return (
    <div style={{ minHeight: '100vh', background: C.n50 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'Article',
        headline: 'Best Suburbs to Open a Business in Ipswich 2026',
        author: { '@type': 'Organization', name: 'Locatalyze' },
        publisher: { '@type': 'Organization', name: 'Locatalyze', url: 'https://locatalyze.com' },
        url: 'https://locatalyze.com/analyse/ipswich', dateModified: '2026-04-20',
      }) }} />

      <section style={{ background: 'linear-gradient(135deg, #44403C 0%, #78716C 50%, #57534E 100%)', color: '#FFFFFF', padding: '56px 24px 52px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', fontSize: 12, opacity: 0.82, marginBottom: 16 }}>
            <Link href="/analyse" style={{ color: 'inherit', textDecoration: 'none' }}>Analyse</Link>
            <span>›</span>
            <span style={{ fontWeight: 700 }}>Ipswich</span>
          </div>
          <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#D6D3D1', margin: '0 0 12px 0' }}>South East Queensland · Location Intelligence</p>
          <h1 style={{ fontSize: 'clamp(32px, 6vw, 52px)', lineHeight: 1.05, margin: '0 0 16px 0' }}>
            Best Suburbs to Open a Business<br />in Ipswich — 2026
          </h1>
          <p style={{ maxWidth: 640, fontSize: 16, lineHeight: 1.7, color: '#E7E5E4', margin: '0 0 24px 0' }}>
            Ipswich suburbs scored across demand, rent pressure, competition density, seasonality, and heritage tourism. One of South East Queensland&apos;s fastest-growing councils — but location quality varies significantly.
          </p>
          <Link href="/onboarding" style={{ background: '#F5F5F4', color: '#44403C', textDecoration: 'none', fontWeight: 800, padding: '13px 22px', borderRadius: 10, fontSize: 15 }}>
            Analyse an Ipswich address →
          </Link>
        </div>
      </section>

      <section style={{ padding: '40px 24px 72px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: C.n900, margin: 0 }}>All scored Ipswich suburbs</h2>
            <span style={{ fontSize: 13, color: C.muted }}>{suburbs.length} suburbs · sorted by score</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
            {[...suburbs].sort((a, b) => b.compositeScore - a.compositeScore).map((s) => (
              <SuburbCard key={s.slug} citySlug="ipswich" name={s.name} slug={s.slug} description={s.why[0]} score={s.compositeScore} verdict={s.verdict === 'RISKY' ? 'NO' : s.verdict} rentRange="" />
            ))}
          </div>
          <div style={{ marginTop: 48, background: 'linear-gradient(135deg, #44403C 0%, #78716C 100%)', borderRadius: 18, padding: '32px 28px', textAlign: 'center' }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#FFFFFF', margin: '0 0 10px 0' }}>Have a specific Ipswich address in mind?</h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.85)', margin: '0 0 20px 0', lineHeight: 1.65 }}>Get a full competitor map, rent benchmark, and GO/CAUTION/NO verdict for any Ipswich address. Free, no account required.</p>
            <Link href="/onboarding" style={{ display: 'inline-block', padding: '14px 28px', backgroundColor: '#F5F5F4', color: '#44403C', borderRadius: 10, textDecoration: 'none', fontSize: 15, fontWeight: 800 }}>Analyse your Ipswich address →</Link>
          </div>
          <div style={{ marginTop: 20 }}><Link href="/analyse" style={{ fontSize: 14, fontWeight: 700, color: C.brand, textDecoration: 'none' }}>← All cities</Link></div>
        </div>
      </section>
    </div>
  )
}
