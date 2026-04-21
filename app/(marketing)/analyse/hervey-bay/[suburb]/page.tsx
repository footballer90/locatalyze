import type { Metadata } from 'next'
import Link from 'next/link'
import { C, ScoreBar, SuburbCard } from '@/components/analyse'
import { FactorGrid } from '@/components/analyse/FactorGrid'
import {
  getHerveyBaySuburb,
  getHerveyBaySuburbSlugs,
  getHerveyBayNearbySuburbs,
  type HerveyBaySuburb,
} from '@/lib/analyse-data/hervey-bay'
import type { LocationVerdict } from '@/lib/analyse-data/scoring-engine'

interface Props {
  params: Promise<{ suburb: string }>
}

function verdictStyles(verdict: LocationVerdict) {
  if (verdict === 'GO') return { bg: C.emeraldBg, bdr: C.emeraldBdr, txt: C.emerald }
  if (verdict === 'CAUTION') return { bg: C.amberBg, bdr: C.amberBdr, txt: C.amber }
  return { bg: C.redBg, bdr: C.redBdr, txt: C.red }
}

function bestFitLabel(suburb: HerveyBaySuburb) {
  return [
    { label: 'Café', value: suburb.cafe },
    { label: 'Restaurant', value: suburb.restaurant },
    { label: 'Retail', value: suburb.retail },
  ].sort((a, b) => b.value - a.value)[0]
}

function SuburbFallback({ suburbSlug }: { suburbSlug: string }) {
  const alternatives = getHerveyBayNearbySuburbs('', 3)
  return (
    <div style={{ minHeight: '100vh', background: C.n50 }}>
      <section style={{ borderBottom: `1px solid ${C.border}`, background: C.white, padding: '56px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', fontSize: 13, color: C.muted, marginBottom: 18 }}>
            <Link href="/analyse" style={{ color: C.brand, textDecoration: 'none' }}>Analyse</Link>
            <span>›</span>
            <Link href="/analyse/hervey-bay" style={{ color: C.brand, textDecoration: 'none' }}>Hervey Bay</Link>
            <span>›</span>
            <span style={{ color: C.n900, fontWeight: 700 }}>Suburb not found</span>
          </div>
          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 18, padding: 32 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: C.brand, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px 0' }}>Hervey Bay Suburb Intelligence</p>
            <h1 style={{ fontSize: 'clamp(28px, 5vw, 44px)', lineHeight: 1.1, color: C.n900, margin: '0 0 12px 0' }}>
              We couldn&apos;t find a page for &quot;{suburbSlug}&quot;
            </h1>
            <p style={{ maxWidth: 680, fontSize: 16, lineHeight: 1.7, color: C.muted, margin: '0 0 22px 0' }}>
              This suburb isn&apos;t in the current Hervey Bay dataset. You can run a full analysis on any address, or explore our scored suburbs below.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/analyse/hervey-bay" style={{ background: C.brand, color: C.white, textDecoration: 'none', fontWeight: 700, padding: '12px 18px', borderRadius: 10 }}>Back to Hervey Bay overview</Link>
              <Link href="/onboarding" style={{ background: C.white, color: C.brand, textDecoration: 'none', fontWeight: 700, padding: '12px 18px', borderRadius: 10, border: `1px solid ${C.border}` }}>Run a fresh analysis</Link>
            </div>
          </div>
        </div>
      </section>
      <section style={{ padding: '40px 24px 72px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: C.n900, margin: '0 0 18px 0' }}>Top Hervey Bay suburbs</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {alternatives.map((s) => (
              <SuburbCard key={s.slug} citySlug="hervey-bay" name={s.name} slug={s.slug} description={s.why[0]} score={s.compositeScore} verdict={s.verdict === 'RISKY' ? 'NO' : s.verdict} rentRange="" />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function SuburbSchema({ suburb }: { suburb: HerveyBaySuburb }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${suburb.name} Hervey Bay Business Location Analysis — ${suburb.verdict} (${suburb.compositeScore}/100)`,
    description: `${suburb.name} scores ${suburb.compositeScore}/100 for Hervey Bay business suitability with a ${suburb.verdict} verdict for cafés, restaurants, and retail.`,
    author: { '@type': 'Organization', name: 'Locatalyze' },
    publisher: { '@type': 'Organization', name: 'Locatalyze', url: 'https://www.locatalyze.com' },
    dateModified: '2026-04-21',
    about: {
      '@type': 'Place',
      name: `${suburb.name}, Hervey Bay QLD`,
      address: { '@type': 'PostalAddress', addressLocality: suburb.name, addressRegion: 'QLD', addressCountry: 'AU' },
    },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function generateStaticParams() {
  return getHerveyBaySuburbSlugs().map((slug) => ({ suburb: slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { suburb } = await params
  const data = getHerveyBaySuburb(decodeURIComponent(suburb))
  if (!data) return { title: 'Hervey Bay suburb not found — Locatalyze', description: 'This Hervey Bay suburb is not in the current analysis dataset.' }
  return {
    title: `${data.name} Hervey Bay Business Analysis — ${data.verdict} (${data.compositeScore}/100)`,
    description: `${data.name} scores ${data.compositeScore}/100 with a ${data.verdict} verdict. Engine-derived scores for cafés, restaurants, and retail operators considering ${data.name}, QLD.`,
    alternates: { canonical: `https://www.locatalyze.com/analyse/hervey-bay/${data.slug}` },
    openGraph: {
      title: `${data.name} Hervey Bay Business Analysis`,
      description: `${data.name} scores ${data.compositeScore}/100 — café ${data.cafe}, restaurant ${data.restaurant}, retail ${data.retail}.`,
      url: `https://www.locatalyze.com/analyse/hervey-bay/${data.slug}`,
      type: 'article',
    },
  }
}

export default async function HerveyBaySuburbPage({ params }: Props) {
  const { suburb } = await params
  const data = getHerveyBaySuburb(decodeURIComponent(suburb))

  if (!data) return <SuburbFallback suburbSlug={decodeURIComponent(suburb)} />

  const verdict = verdictStyles(data.verdict)
  const bestFit = bestFitLabel(data)
  const nearby = getHerveyBayNearbySuburbs(data.slug, 3)

  return (
    <div style={{ minHeight: '100vh', background: C.n50 }}>
      <SuburbSchema suburb={data} />

      {/* ── Hero — deep teal/ocean gradient for Hervey Bay ── */}
      <section style={{ background: 'linear-gradient(135deg, #083344 0%, #0E7490 50%, #0891B2 100%)', color: '#FFFFFF', padding: '56px 24px 52px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', fontSize: 12, opacity: 0.82, marginBottom: 16 }}>
            <Link href="/analyse" style={{ color: 'inherit', textDecoration: 'none' }}>Analyse</Link>
            <span>›</span>
            <Link href="/analyse/hervey-bay" style={{ color: 'inherit', textDecoration: 'none' }}>Hervey Bay</Link>
            <span>›</span>
            <span style={{ fontWeight: 700 }}>{data.name}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 22, alignItems: 'start' }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#CFFAFE', margin: '0 0 12px 0' }}>Hervey Bay Suburb Intelligence</p>
              <h1 style={{ fontSize: 'clamp(34px, 6vw, 54px)', lineHeight: 1.03, margin: '0 0 14px 0' }}>{data.name}</h1>
              <p style={{ maxWidth: 560, fontSize: 15, lineHeight: 1.7, color: '#A5F3FC', margin: '0 0 20px 0' }}>{data.why[0]}</p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ display: 'inline-block', padding: '8px 16px', borderRadius: 999, fontWeight: 800, fontSize: 13, letterSpacing: '0.06em', color: verdict.txt, background: verdict.bg, border: `1px solid ${verdict.bdr}` }}>
                  {data.verdict}
                </span>
                <span style={{ fontSize: 14, color: '#CFFAFE' }}>Best fit: {bestFit.label} ({bestFit.value}/100)</span>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.16)', borderRadius: 18, padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 18, marginBottom: 20 }}>
                <div>
                  <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#CFFAFE', margin: '0 0 6px 0' }}>Composite score</p>
                  <div style={{ fontSize: 64, lineHeight: 0.92, fontWeight: 900 }}>{data.compositeScore}</div>
                  <div style={{ fontSize: 13, color: '#CFFAFE', marginTop: 6 }}>out of 100</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#CFFAFE', margin: '0 0 6px 0' }}>Verdict</p>
                  <p style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.2, margin: 0 }}>{data.verdict}</p>
                  <p style={{ fontSize: 13, color: '#CFFAFE', marginTop: 4 }}>
                    {data.verdict === 'GO' ? 'Conditions support entry' : data.verdict === 'CAUTION' ? 'Proceed with clear plan' : 'High structural risk'}
                  </p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                {[{ label: 'Café', value: data.cafe }, { label: 'Restaurant', value: data.restaurant }, { label: 'Retail', value: data.retail }].map(({ label, value }) => (
                  <div key={label} style={{ textAlign: 'center', padding: '10px 6px', background: 'rgba(255,255,255,0.10)', borderRadius: 10 }}>
                    <div style={{ fontSize: 24, fontWeight: 900, lineHeight: 1 }}>{value}</div>
                    <div style={{ fontSize: 11, color: '#CFFAFE', marginTop: 4 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Body ── */}
      <section style={{ padding: '32px 24px 72px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gap: 24 }}>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 18, padding: 26 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: C.brand, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px 0' }}>Factor Breakdown</p>
              <h2 style={{ fontSize: 22, lineHeight: 1.2, color: C.n900, margin: '0 0 6px 0' }}>Five-factor model</h2>
              <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, margin: '0 0 4px 0' }}>Each factor is scored 1–10. Higher demand is better; lower rent, competition, and seasonality are better. Tourism is context-dependent.</p>
              <FactorGrid factors={data.locationFactors} />
            </div>

            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 18, padding: 26 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: C.brand, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px 0' }}>Business-Type Scores</p>
              <h2 style={{ fontSize: 22, lineHeight: 1.2, color: C.n900, margin: '0 0 16px 0' }}>How each format performs</h2>
              <ScoreBar label="Café / Specialty Coffee" value={data.cafe} />
              <ScoreBar label="Full-Service Restaurant" value={data.restaurant} />
              <ScoreBar label="Independent Retail" value={data.retail} />
              <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.6, margin: '14px 0 0 0' }}>Scores use engine-derived weights: cafés weight demand and rent most heavily; restaurants factor tourism; retail factors tourism and demand equally.</p>
            </div>
          </div>

          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 18, padding: 26 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: C.brand, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px 0' }}>Analyst Notes — {data.name}</p>
            <h2 style={{ fontSize: 22, lineHeight: 1.2, color: C.n900, margin: '0 0 18px 0' }}>What the data says about this location</h2>
            <div style={{ display: 'grid', gap: 14 }}>
              {data.why.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <div style={{ flexShrink: 0, width: 28, height: 28, borderRadius: '50%', background: '#CFFAFE', border: '1px solid #A5F3FC', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
                    <span style={{ fontSize: 12, fontWeight: 900, color: '#0891B2' }}>{i + 1}</span>
                  </div>
                  <p style={{ fontSize: 15, lineHeight: 1.7, color: C.n900, margin: 0 }}>{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: C.n50, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 20px' }}>
            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, margin: 0 }}>
              <strong style={{ color: C.n900 }}>Methodology:</strong> Scores are engine-derived from five observable inputs (demand strength, rent pressure, competition density, seasonality risk, tourism dependency — each 1–10). These feed into business-type-specific weighted composites via a single scoring engine used across all markets. Scores are relative estimates calibrated across all Hervey Bay suburbs — a score of 75 indicates materially better conditions than 60; it is not a success probability or guarantee.
            </p>
          </div>

          <div style={{ background: 'linear-gradient(135deg, #083344 0%, #0891B2 100%)', borderRadius: 18, padding: '32px 28px', textAlign: 'center' }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#FFFFFF', margin: '0 0 10px 0' }}>Have a specific address in {data.name}?</h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.85)', margin: '0 0 20px 0', lineHeight: 1.65 }}>Run a full competitor map, rent benchmark, and GO/CAUTION/NO verdict for any {data.name} address. Free.</p>
            <Link href="/onboarding" style={{ display: 'inline-block', padding: '14px 28px', backgroundColor: '#CFFAFE', color: '#083344', borderRadius: 10, textDecoration: 'none', fontSize: 15, fontWeight: 800 }}>
              Analyse your {data.name} address →
            </Link>
          </div>

          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: C.n900, margin: '0 0 16px 0' }}>Other Hervey Bay suburbs to consider</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
              {nearby.map((s) => (
                <SuburbCard key={s.slug} citySlug="hervey-bay" name={s.name} slug={s.slug} description={s.why[0]} score={s.compositeScore} verdict={s.verdict === 'RISKY' ? 'NO' : s.verdict} rentRange="" />
              ))}
            </div>
          </div>

          <div style={{ paddingTop: 8 }}>
            <Link href="/analyse/hervey-bay" style={{ fontSize: 14, fontWeight: 700, color: C.brand, textDecoration: 'none' }}>← Back to Hervey Bay overview</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
