import type { Metadata } from 'next'
import Link from 'next/link'
import { C, ScoreBar, SuburbCard } from '@/components/analyse'
import { FactorGrid } from '@/components/analyse/FactorGrid'
import { getDarwinSuburbs, type DarwinSuburb } from '@/lib/analyse-data/darwin'

export const metadata: Metadata = {
  title: 'Darwin Business Location Analysis — Café, Restaurant & Retail',
  description:
    'Darwin suburb-by-suburb location intelligence scored through the shared 5-factor engine for cafes, restaurants, and retail.',
  alternates: {
    canonical: 'https://www.locatalyze.com/analyse/darwin',
  },
  openGraph: {
    title: 'Darwin Business Location Analysis — Café, Restaurant & Retail',
    description:
      'Darwin suburb-by-suburb location intelligence scored through the shared 5-factor engine for cafes, restaurants, and retail.',
    type: 'website',
    url: 'https://www.locatalyze.com/analyse/darwin',
  },
}

function verdictStyles(verdict: DarwinSuburb['verdict']) {
  if (verdict === 'GO') return { bg: C.emeraldBg, bdr: C.emeraldBdr, txt: C.emerald }
  if (verdict === 'CAUTION') return { bg: C.amberBg, bdr: C.amberBdr, txt: C.amber }
  return { bg: C.redBg, bdr: C.redBdr, txt: C.red }
}

function bestFit(suburb: DarwinSuburb) {
  return [
    { label: 'Cafe', value: suburb.cafe },
    { label: 'Restaurant', value: suburb.restaurant },
    { label: 'Retail', value: suburb.retail },
  ].sort((a, b) => b.value - a.value)[0]
}

function demandLabel(suburb: DarwinSuburb) {
  if (suburb.factors.tourism >= 7) return 'Tourism-led demand cluster'
  if (suburb.factors.demand >= 8) return 'Strong local demand cluster'
  if (suburb.factors.demand >= 6) return 'Localized suburban demand'
  return 'Smaller catchment demand'
}

function rentLabel(suburb: DarwinSuburb) {
  if (suburb.factors.rent >= 7) return `Rent pressure ${suburb.factors.rent}/10`
  if (suburb.factors.rent >= 5) return `Moderate rent ${suburb.factors.rent}/10`
  return `Accessible rent ${suburb.factors.rent}/10`
}

function riskSummary(suburb: DarwinSuburb) {
  if (suburb.factors.seasonality >= 7) {
    return 'Wet/dry season volatility is a real operating constraint.'
  }

  if (suburb.factors.competition >= 7) {
    return 'The main risk is competitive pressure, not lack of demand.'
  }

  if (suburb.factors.tourism <= 3) {
    return 'This is a repeat-local market rather than a visitor market.'
  }

  return 'This suburb has more balanced downside than Darwin City.'
}

function FeaturedSuburb({ suburb }: { suburb: DarwinSuburb }) {
  const verdict = verdictStyles(suburb.verdict)
  const strongestFit = bestFit(suburb)

  return (
    <div
      style={{
        background: C.white,
        border: `1px solid ${C.border}`,
        borderRadius: 18,
        padding: 24,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 16,
          alignItems: 'flex-start',
          marginBottom: 14,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <p
            style={{
              fontSize: 11,
              color: C.brand,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              margin: '0 0 6px 0',
            }}
          >
            Darwin Snapshot
          </p>
          <h3 style={{ fontSize: 24, fontWeight: 800, color: C.n900, margin: 0 }}>{suburb.name}</h3>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 34, lineHeight: 1, fontWeight: 900, color: verdict.txt }}>
            {suburb.compositeScore}
          </div>
          <div
            style={{
              display: 'inline-block',
              marginTop: 8,
              padding: '6px 12px',
              borderRadius: 999,
              border: `1px solid ${verdict.bdr}`,
              background: verdict.bg,
              color: verdict.txt,
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: '0.06em',
            }}
          >
            {suburb.verdict}
          </div>
        </div>
      </div>

      <p style={{ fontSize: 14, lineHeight: 1.7, color: C.muted, margin: '0 0 12px 0' }}>
        {suburb.why[0]}
      </p>

      <FactorGrid factors={suburb.locationFactors} />

      <div style={{ marginTop: 12 }}>
        <ScoreBar label="Cafe" value={suburb.cafe} />
        <ScoreBar label="Restaurant" value={suburb.restaurant} />
        <ScoreBar label="Retail" value={suburb.retail} />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 12,
          marginTop: 14,
        }}
      >
        {[
          { label: 'Demand type', value: demandLabel(suburb) },
          { label: 'Cost signal', value: rentLabel(suburb) },
          { label: 'Best fit', value: `${strongestFit.label} ${strongestFit.value}/100` },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              background: C.n50,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              padding: 14,
            }}
          >
            <p
              style={{
                fontSize: 10,
                color: C.mutedLight,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                margin: '0 0 4px 0',
              }}
            >
              {item.label}
            </p>
            <p style={{ fontSize: 13, color: C.n900, lineHeight: 1.55, margin: 0 }}>{item.value}</p>
          </div>
        ))}
      </div>

      <Link
        href={`/analyse/darwin/${suburb.slug}`}
        style={{
          display: 'inline-flex',
          marginTop: 16,
          fontSize: 13,
          fontWeight: 700,
          color: C.brand,
          textDecoration: 'none',
        }}
      >
        Open suburb drill-down →
      </Link>
    </div>
  )
}

export default function DarwinPage() {
  const suburbs = getDarwinSuburbs().sort((a, b) => b.compositeScore - a.compositeScore)
  const featured = suburbs.slice(0, 3)

  return (
    <div style={{ minHeight: '100vh', background: C.n50 }}>
      <section
        style={{
          background: 'linear-gradient(135deg, #0369A1 0%, #024F80 100%)',
          color: C.white,
          padding: '56px 24px 52px',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontSize: 12, opacity: 0.82, marginBottom: 16 }}>
            <Link href="/analyse" style={{ color: 'inherit', textDecoration: 'none' }}>
              Analyse
            </Link>{' '}
            / Darwin
          </div>
          <h1 style={{ fontSize: 'clamp(34px, 6vw, 54px)', lineHeight: 1.03, margin: '0 0 12px 0' }}>
            Darwin Business Location Guide
          </h1>
          <p style={{ maxWidth: 760, fontSize: 16, lineHeight: 1.72, color: '#E0F2FE', margin: '0 0 24px 0' }}>
            Darwin uses the same 5-factor scoring engine as Gold Coast, but the factor values reflect Darwin&apos;s own trading reality: smaller demand clusters, stronger wet/dry season swings, and a sharper split between tourism-led and suburban repeat-use markets.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 16,
            }}
          >
            {[
              { label: 'Suburbs scored', value: `${suburbs.length}` },
              { label: 'Best current play', value: `${suburbs[0].name} (${suburbs[0].compositeScore})` },
              { label: 'Model', value: 'Shared 5-factor engine' },
              { label: 'Main Darwin risk', value: 'Seasonality + clustered demand' },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.16)',
                  borderRadius: 16,
                  padding: 18,
                }}
              >
                <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#BAE6FD', margin: '0 0 6px 0' }}>
                  {item.label}
                </p>
                <p style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.5, margin: 0 }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '32px 24px 72px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gap: 28 }}>
          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 18, padding: 26 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: C.brand, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px 0' }}>
              Darwin Read
            </p>
            <h2 style={{ fontSize: 28, lineHeight: 1.1, color: C.n900, margin: '0 0 10px 0' }}>
              What the engine is seeing in Darwin
            </h2>
            <div style={{ display: 'grid', gap: 12 }}>
              {[
                'Darwin City carries the deepest demand and strongest restaurant upside, but it also has the heaviest seasonality and tourism exposure.',
                'Parap and Nightcliff rate well because they combine repeat local demand with lower rent and less saturation than the CBD core.',
                'Casuarina and Palmerston behave very differently: Casuarina is dominated by competitive pressure, while Palmerston is a lower-cost suburban repeat-use market.',
              ].map((line) => (
                <p key={line} style={{ fontSize: 15, lineHeight: 1.75, color: C.muted, margin: 0 }}>
                  {line}
                </p>
              ))}
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: C.n900, margin: '0 0 18px 0' }}>
              Darwin suburb snapshots
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 18 }}>
              {featured.map((suburb) => (
                <FeaturedSuburb key={suburb.slug} suburb={suburb} />
              ))}
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: C.n900, margin: '0 0 10px 0' }}>
              Full Darwin suburb index
            </h2>
            <p style={{ fontSize: 15, color: C.muted, margin: '0 0 18px 0', lineHeight: 1.7 }}>
              Every suburb card below reads from the same Darwin dataset and shared scoring engine. No suburb has hand-entered scores or verdicts.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
              {suburbs.map((suburb) => (
                <SuburbCard
                  key={suburb.slug}
                  citySlug="darwin"
                  name={suburb.name}
                  slug={suburb.slug}
                  description={suburb.why[0]}
                  score={suburb.compositeScore}
                  verdict={suburb.verdict}
                  rentRange={rentLabel(suburb)}
                />
              ))}
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 18,
            }}
          >
            {suburbs.slice(0, 4).map((suburb) => (
              <div
                key={suburb.slug}
                style={{
                  background: C.white,
                  border: `1px solid ${C.border}`,
                  borderRadius: 16,
                  padding: 20,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 10 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: C.n900, margin: 0 }}>{suburb.name}</h3>
                  <span style={{ fontSize: 18, fontWeight: 900, color: verdictStyles(suburb.verdict).txt }}>
                    {suburb.compositeScore}
                  </span>
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.65, color: C.muted, margin: '0 0 8px 0' }}>
                  {riskSummary(suburb)}
                </p>
                <p style={{ fontSize: 13, lineHeight: 1.65, color: C.muted, margin: 0 }}>
                  {suburb.why[1]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
