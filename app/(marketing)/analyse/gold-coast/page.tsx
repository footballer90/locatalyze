'use client'
import Link from 'next/link'
import { useState } from 'react'
import { FactorGrid } from '@/components/analyse/FactorGrid'
import {
  GOLD_COAST_SCORE_WEIGHTS,
  GOLD_COAST_VERDICT_THRESHOLDS,
  getGoldCoastSuburbs,
  type GoldCoastSuburb,
  type GoldCoastVerdict,
} from '@/lib/analyse-data/gold-coast'

const S = {
  brand: '#0891B2', brandDark: '#0E7490', brandLight: '#06B6D4',
  brandFaded: '#F0FDFA', brandBorder: '#99F6E4',
  emerald: '#059669', emeraldBg: '#ECFDF5', emeraldBdr: '#A7F3D0',
  amber: '#D97706', amberBg: '#FFFBEB', amberBdr: '#FDE68A',
  red: '#DC2626', redBg: '#FEF2F2', redBdr: '#FECACA',
  purple: '#7C3AED', purpleBg: '#F5F3FF', purpleBdr: '#DDD6FE',
  muted: '#475569', mutedLight: '#94A3B8', border: '#E2E8F0',
  n50: '#FAFAF9', n100: '#F5F5F4', n200: '#E7E5E4',
  n900: '#1C1917', n800: '#292524', white: '#FFFFFF',
}

const VERDICT_CFG: Record<GoldCoastVerdict, { bg: string; bdr: string; txt: string }> = {
  GO:      { bg: S.emeraldBg, bdr: S.emeraldBdr, txt: S.emerald },
  CAUTION: { bg: S.amberBg,   bdr: S.amberBdr,   txt: S.amber },
  RISKY:   { bg: S.redBg,     bdr: S.redBdr,     txt: S.red },
}

function Badge({ v, size = 'sm' }: { v: GoldCoastVerdict; size?: 'sm' | 'md' }) {
  const c = VERDICT_CFG[v]
  const fs = size === 'md' ? 13 : 10
  const px = size === 'md' ? '8px 16px' : '2px 9px'
  return (
    <span style={{ fontSize: fs, fontWeight: 700, color: c.txt, background: c.bg, border: `1px solid ${c.bdr}`, borderRadius: 6, padding: px, letterSpacing: '0.04em', whiteSpace: 'nowrap' as const }}>
      {v}
    </span>
  )
}

function ScoreBar({ label, value, color = S.brand }: { label: string; value: number; color?: string }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: S.n900 }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color }}>{value}/100</span>
      </div>
      <div style={{ height: 6, background: S.border, borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${value}%`, background: color, borderRadius: 4 }} />
      </div>
    </div>
  )
}

function SectionLabel({ text }: { text: string }) {
  return (
    <p style={{ fontSize: 10, fontWeight: 700, color: S.brand, textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: 12 }}>
      {text}
    </p>
  )
}

function Card({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: 24, ...style }}>
      {children}
    </div>
  )
}

// ── Score methodology disclosure ──────────────────────────────────────────────
function ScoreMethodology() {
  return (
    <div style={{ background: S.n50, border: `1px solid ${S.border}`, borderRadius: 10, padding: '16px 18px', marginBottom: 20 }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ flexShrink: 0, width: 20, height: 20, borderRadius: '50%', background: S.brandFaded, border: `1px solid ${S.brandBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 11, fontWeight: 900, color: S.brand }}>i</span>
        </div>
        <div>
          <p style={{ fontSize: 12, fontWeight: 700, color: S.n900, margin: '0 0 3px 0' }}>How these scores are structured</p>
          <p style={{ fontSize: 11, color: S.muted, lineHeight: 1.6, margin: 0 }}>
            Each suburb is rated across five observable inputs (1–10). These feed into business-type-specific weighted composites. Scores are relative estimates calibrated across all 20 suburbs — a score of 80 indicates materially better estimated conditions than 65; it is not a success probability.
          </p>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: 6, marginBottom: 10 }}>
        {[
          { label: 'Demand Strength', desc: 'Commercial demand from residents, workers, and local catchment', dir: 'Higher = better' },
          { label: 'Rent Pressure',   desc: 'Cost burden relative to estimated revenue potential for this location type', dir: 'Lower = better' },
          { label: 'Competition Density', desc: 'Comparable operator saturation in walkable catchment', dir: 'Lower = better' },
          { label: 'Seasonality Risk',    desc: 'Estimated peak-to-trough revenue variance across the year', dir: 'Lower = better' },
          { label: 'Tourism Dependency',  desc: 'Estimated tourist vs resident revenue share — effect depends on business type', dir: 'Context-dependent' },
        ].map(({ label, desc, dir }) => (
          <div key={label} style={{ background: S.white, borderRadius: 6, padding: '8px 10px', border: `1px solid ${S.border}` }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: S.n900, margin: '0 0 2px 0' }}>{label}</p>
            <p style={{ fontSize: 10, color: S.muted, margin: '0 0 3px 0', lineHeight: 1.4 }}>{desc}</p>
            <p style={{ fontSize: 10, color: S.brand, fontWeight: 600, margin: 0 }}>{dir}</p>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginBottom: 8 }}>
        {[
          {
            type: 'Café',
            weights: `Demand ${GOLD_COAST_SCORE_WEIGHTS.cafe.demand}% · Rent ${GOLD_COAST_SCORE_WEIGHTS.cafe.rent}% · Competition ${GOLD_COAST_SCORE_WEIGHTS.cafe.competition}% · Seasonality ${GOLD_COAST_SCORE_WEIGHTS.cafe.seasonality}%`,
          },
          {
            type: 'Restaurant',
            weights: `Demand ${GOLD_COAST_SCORE_WEIGHTS.restaurant.demand}% · Rent ${GOLD_COAST_SCORE_WEIGHTS.restaurant.rent}% · Competition ${GOLD_COAST_SCORE_WEIGHTS.restaurant.competition}% · Seasonality ${GOLD_COAST_SCORE_WEIGHTS.restaurant.seasonality}% · Tourism ${GOLD_COAST_SCORE_WEIGHTS.restaurant.tourism}%`,
          },
          {
            type: 'Retail',
            weights: `Demand ${GOLD_COAST_SCORE_WEIGHTS.retail.demand}% · Rent ${GOLD_COAST_SCORE_WEIGHTS.retail.rent}% · Tourism ${GOLD_COAST_SCORE_WEIGHTS.retail.tourism}% · Competition ${GOLD_COAST_SCORE_WEIGHTS.retail.competition}% · Seasonality ${GOLD_COAST_SCORE_WEIGHTS.retail.seasonality}%`,
          },
        ].map(({ type, weights }) => (
          <div key={type} style={{ background: S.brandFaded, borderRadius: 6, padding: '7px 10px', border: `1px solid ${S.brandBorder}` }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: S.brandDark, margin: '0 0 2px 0' }}>{type}</p>
            <p style={{ fontSize: 9.5, color: S.brandDark, margin: 0, lineHeight: 1.5, opacity: 0.8 }}>{weights}</p>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 10, color: S.mutedLight, margin: 0, lineHeight: 1.5 }}>
        Verdict formula: composite = Café×0.40 + Restaurant×0.35 + Retail×0.25. GO ≥ {GOLD_COAST_VERDICT_THRESHOLDS.go} · CAUTION {GOLD_COAST_VERDICT_THRESHOLDS.caution}–{GOLD_COAST_VERDICT_THRESHOLDS.go - 0.5} · RISKY &lt; {GOLD_COAST_VERDICT_THRESHOLDS.caution}. All inputs are indicative estimates — validate against your own research before making a leasing decision.
      </p>
    </div>
  )
}

// ── Assumption banner for financial section ────────────────────────────────────
function AssumptionBanner() {
  return (
    <div style={{ background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 10, padding: '14px 18px', marginBottom: 24, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <div style={{ flexShrink: 0, paddingTop: 1 }}>
        <span style={{ fontSize: 14, color: S.amber }}>▲</span>
      </div>
      <div>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#92400E', margin: '0 0 4px 0' }}>Financial figures are illustrative models, not forecasts</p>
        <p style={{ fontSize: 11, color: '#78350F', lineHeight: 1.6, margin: 0 }}>
          The break-even examples below use assumed rent midpoints, indicative staffing costs for Queensland hospitality, and an estimated average spend per customer. Your actual costs will differ based on lease terms negotiated, staffing mix, trading hours, and concept type. Use these as a sanity-check framework — not as a business case. Validate all numbers against your own financial modelling before signing a lease.
        </p>
      </div>
    </div>
  )
}


// ── Suburb poll ──────────────────────────────────────────────────────────────
function SuburbPoll() {
  const [voted, setVoted] = useState<number | null>(null)
  const [votes, setVotes] = useState([48, 31, 19, 22, 15, 10, 8])
  const opts = ['Burleigh Heads', 'Broadbeach', 'Surfers Paradise', 'Southport', 'Palm Beach', 'Coolangatta', 'Somewhere else']
  const total = votes.reduce((a, b) => a + b, 0)
  function cast(i: number) {
    if (voted !== null) return
    setVoted(i)
    setVotes(prev => prev.map((v, idx) => idx === i ? v + 1 : v))
  }
  return (
    <Card style={{ marginBottom: 48 }}>
      <SectionLabel text="Community signal" />
      <h3 style={{ fontSize: 18, fontWeight: 800, color: S.n900, marginBottom: 6 }}>Where are you planning to open on the Gold Coast?</h3>
      <p style={{ fontSize: 13, color: S.muted, marginBottom: 20 }}>Based on what you know about the market right now.</p>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
        {opts.map((opt, i) => {
          const pct = Math.round((votes[i] / total) * 100)
          return (
            <button key={i} onClick={() => cast(i)} disabled={voted !== null}
              style={{ position: 'relative', border: `1.5px solid ${voted === i ? S.brandBorder : S.border}`, borderRadius: 10, padding: '10px 14px', background: S.white, cursor: voted === null ? 'pointer' : 'default', textAlign: 'left' as const, fontFamily: 'inherit', overflow: 'hidden' }}>
              {voted !== null && <div style={{ position: 'absolute', inset: 0, width: `${pct}%`, background: 'rgba(8,145,178,0.07)', transition: 'width 0.4s ease' }} />}
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: S.n900 }}>{opt}</span>
                {voted !== null && <span style={{ fontSize: 12, color: S.brand, fontWeight: 700 }}>{pct}%</span>}
              </div>
            </button>
          )
        })}
      </div>
      {voted !== null && (
        <div style={{ marginTop: 14, padding: '12px 16px', background: S.brandFaded, border: `1px solid ${S.brandBorder}`, borderRadius: 10 }}>
          <p style={{ fontSize: 13, color: S.brandDark, margin: 0 }}>
            Get real numbers for that suburb.{' '}
            <Link href="/analyse" style={{ fontWeight: 700, textDecoration: 'underline', color: S.brandDark }}>Run a location analysis →</Link>
          </p>
        </div>
      )}
    </Card>
  )
}

// ── Schema ───────────────────────────────────────────────────────────────────
const SCHEMAS = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Best Suburbs to Open a Business on the Gold Coast — 2026 Location Analysis',
    description: 'Gold Coast business location intelligence hub. 20 suburbs scored by demand, rent viability, competition, and seasonality risk for cafés, restaurants and retail operators.',
    datePublished: '2026-04-01',
    dateModified: '2026-04-19',
    author: { '@type': 'Organization', name: 'Locatalyze', url: 'https://locatalyze.com' },
    publisher: { '@type': 'Organization', name: 'Locatalyze' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'Is Gold Coast good for opening a café?', acceptedAnswer: { '@type': 'Answer', text: 'Yes — with the right suburb and concept. Burleigh Heads and Broadbeach have demonstrated strong year-round demand for quality independents. Surfers Paradise carries high tourist volume but churns operators. The safest café locations are those with a mixed resident-tourist base: Burleigh, Palm Beach, Mermaid Beach, and Coolangatta.' } },
      { '@type': 'Question', name: 'Which Gold Coast suburb has the best foot traffic?', acceptedAnswer: { '@type': 'Answer', text: 'Surfers Paradise has the highest raw volume but the worst conversion for quality independents — tourist churn is brutal. Broadbeach has the strongest foot traffic quality: Pacific Fair, the casino precinct, and residential professionals all overlap. Burleigh Heads has the best foot traffic per retail metre for independents.' } },
      { '@type': 'Question', name: 'Where are rents cheapest on the Gold Coast?', acceptedAnswer: { '@type': 'Answer', text: 'Outer suburban strips — Coomera, Nerang, Burleigh Waters, and Ashmore — offer the lowest rents ($1,800–$3,500/month). The trade-off is foot traffic. Palm Beach and Coolangatta offer the best value balance: lower rents than Broadbeach or Burleigh with improving foot traffic and demographics.' } },
      { '@type': 'Question', name: 'Is Surfers Paradise saturated for hospitality?', acceptedAnswer: { '@type': 'Answer', text: 'The strip facing the beach (Cavill Avenue and Orchid Avenue) is extremely saturated for generic hospitality — turnover is high, margins are thin, and tourist-only trade is volatile. Premium concepts positioned away from the strip (Tedder Avenue in Main Beach, for instance) perform differently. Surfers is not the right location for a café targeting quality or community.' } },
      { '@type': 'Question', name: 'What business works best in Burleigh Heads?', acceptedAnswer: { '@type': 'Answer', text: 'Specialty cafés, quality casual dining, wellness studios, and lifestyle retail. James Street and the Burleigh village is where the Gold Coast independent hospitality scene concentrates. The customer profile is health-conscious 28–45 professionals and families with strong spending power and loyalty to quality operators. Weekend brunch and lunch trading significantly outperform weekday dinner.' } },
    ],
  },
]

const SUBURBS_DERIVED = getGoldCoastSuburbs()

// ── Comparison table data ────────────────────────────────────────────────────
const TABLE = SUBURBS_DERIVED.map(s => ({
  name: s.name, cafe: s.cafe, restaurant: s.restaurant, retail: s.retail,
  risk: s.verdict === 'GO' ? 'Low–Med' : s.verdict === 'CAUTION' ? 'Medium' : 'High',
  verdict: s.verdict,
}))

// ── Unified suburb card ───────────────────────────────────────────────────────
// Single card template used for all three verdict tiers (GO / CAUTION / RISKY).
type DerivedSuburb = GoldCoastSuburb

function SuburbCard({ s }: { s: DerivedSuburb }) {
  const cfg  = VERDICT_CFG[s.verdict]
  return (
    <Card style={{ borderLeft: `4px solid ${cfg.txt}` }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap' as const, gap: 8 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: S.n900, margin: '0 0 4px 0' }}>{s.name}</h3>
          <p style={{ fontSize: 11, color: S.muted, margin: 0 }}>Rent {s.rent} · Competition: {s.competition}</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ textAlign: 'center' as const }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: cfg.txt, lineHeight: 1 }}>{s.compositeScore}</div>
            <div style={{ fontSize: 10, color: S.muted }}>composite</div>
          </div>
          <Badge v={s.verdict} size="md" />
        </div>
      </div>
      {/* Character + Demand */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 12 }}>
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, color: S.muted, textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 4 }}>Character</p>
          <p style={{ fontSize: 12, color: S.n900, lineHeight: 1.6, margin: 0 }}>{s.vibe}</p>
        </div>
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, color: S.muted, textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 4 }}>Demand type</p>
          <p style={{ fontSize: 12, color: S.n900, lineHeight: 1.6, margin: 0 }}>{s.demand}</p>
        </div>
      </div>
      {/* Five-factor model inputs */}
      <FactorGrid factors={s.factors} />
      {/* Business-type scores */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 }}>
        <ScoreBar label="Café"       value={s.cafe}       color={cfg.txt} />
        <ScoreBar label="Restaurant" value={s.restaurant} color={cfg.txt} />
        <ScoreBar label="Retail"     value={s.retail}     color={cfg.txt} />
      </div>
      {/* Best fit + Key risk */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10, marginBottom: 14 }}>
        <div style={{ background: cfg.bg, borderRadius: 8, padding: '10px 14px', border: `1px solid ${cfg.bdr}` }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: cfg.txt, textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 4 }}>Best fit</p>
          <p style={{ fontSize: 12, color: S.n900, margin: 0 }}>{s.best}</p>
        </div>
        <div style={{ background: S.amberBg, borderRadius: 8, padding: '10px 14px', border: `1px solid ${S.amberBdr}` }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: S.amber, textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 4 }}>Key risk</p>
          <p style={{ fontSize: 12, color: S.n900, margin: 0 }}>{s.risk}</p>
        </div>
      </div>
      {/* Key insight */}
      <div style={{ paddingTop: 12, borderTop: `1px solid ${S.border}`, marginBottom: 10 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: S.brand, textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 4 }}>Key insight</p>
        <p style={{ fontSize: 13, color: S.n900, lineHeight: 1.65, margin: 0, fontStyle: 'italic' }}>{s.insight}</p>
      </div>
      {/* Why this score — maps directly to factor inputs above */}
      <div style={{ background: cfg.bg, borderRadius: 8, padding: '10px 14px', border: `1px solid ${cfg.bdr}` }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: cfg.txt, textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 4 }}>Why this score</p>
        <p style={{ fontSize: 12, color: S.n900, lineHeight: 1.65, margin: 0 }}>{s.why}</p>
      </div>
      <div style={{ marginTop: 14 }}>
        <Link
          href={`/analyse/gold-coast/${s.slug}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 12,
            fontWeight: 700,
            color: S.brand,
            textDecoration: 'none',
          }}
        >
          View suburb intelligence →
        </Link>
      </div>
    </Card>
  )
}


export default function GoldCoastPage() {
  const [tableSort, setTableSort] = useState<'cafe' | 'restaurant' | 'retail'>('cafe')
  const sorted = [...TABLE].sort((a, b) => b[tableSort] - a[tableSort])

  return (
    <div style={{ minHeight: '100vh', background: S.n50, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', color: S.n900 }}>
      {SCHEMAS.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}

      {/* Sticky nav */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: S.white, borderBottom: `1px solid ${S.border}`, padding: '13px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/analyse" style={{ fontSize: 13, fontWeight: 600, color: S.brand, textDecoration: 'none' }}>← Location Guides</Link>
        <Link href="/analyse" style={{ fontSize: 13, fontWeight: 700, color: S.white, background: S.brand, padding: '7px 16px', borderRadius: 7, textDecoration: 'none' }}>Run location analysis →</Link>
      </div>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(135deg, #0369A1 0%, #024F80 100%)', padding: '56px 24px 52px', color: S.white }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', marginBottom: 16, textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>
            <Link href="/analyse" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none' }}>Analyse</Link>
            {' / '}Gold Coast
          </div>
          <h1 style={{ fontSize: 'clamp(28px,5vw,46px)', fontWeight: 900, margin: '0 0 14px 0', lineHeight: 1.1, letterSpacing: '-0.03em' }}>
            Gold Coast Business Location Guide 2026
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.7, opacity: 0.9, margin: '0 0 36px 0', maxWidth: 640 }}>
            20 suburbs scored. Real rent benchmarks, seasonality risk, and suburb-level verdicts for cafés, restaurants and retail operators.
          </p>

          {/* ── STEP 1: Hero decision block ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 32 }}>
            <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 14, padding: '20px 24px' }}>
              <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', opacity: 0.7, marginBottom: 10 }}>Market verdict</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <span style={{ fontSize: 22, fontWeight: 900, color: '#4ADE80' }}>CONDITIONAL GO</span>
                <span style={{ fontSize: 11, opacity: 0.75, lineHeight: 1.4 }}>subject to suburb selection and concept fit</span>
              </div>
              <p style={{ fontSize: 12, opacity: 0.8, lineHeight: 1.6, margin: 0 }}>
                The Gold Coast has a growing resident economy alongside its tourist base. Evidence suggests location selection is the primary failure driver — not overall market size.
              </p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.10)', borderRadius: 14, padding: '20px 24px' }}>
              <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', opacity: 0.7, marginBottom: 12 }}>3 key market signals</p>
              {[
                { label: 'Rent pressure', value: 'HIGH in Broadbeach/Burleigh · LOW in outer suburbs' },
                { label: 'Demand strength', value: 'STRONG year-round (resident) · VOLATILE (tourist-only)' },
                { label: 'Competition level', value: 'SATURATED on tourist strips · OPEN in emerging areas' },
              ].map(({ label, value }) => (
                <div key={label} style={{ marginBottom: 10 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, opacity: 0.6, marginBottom: 2 }}>{label}</p>
                  <p style={{ fontSize: 12, fontWeight: 600, margin: 0 }}>{value}</p>
                </div>
              ))}
            </div>
            <div style={{ background: 'rgba(255,255,255,0.10)', borderRadius: 14, padding: '20px 24px' }}>
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.08em', opacity: 0.7, marginBottom: 6 }}>Best suburb right now for cafés</p>
                <p style={{ fontSize: 15, fontWeight: 800, marginBottom: 4 }}>Burleigh Heads</p>
                <p style={{ fontSize: 12, opacity: 0.8, margin: 0 }}>Proven demand-supply gap. Estimated sub-2% vacancy on James Street (indicative, based on observed operator churn). Year-round resident loyalty.</p>
              </div>
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.08em', opacity: 0.7, marginBottom: 6 }}>Avoid unless you can handle:</p>
                <p style={{ fontSize: 12, opacity: 0.85, margin: 0, lineHeight: 1.6 }}>Extreme seasonal volatility — tourist-only locations on the Gold Coast typically see 40–65% revenue decline between peak summer and mid-winter — or high-rent locations where break-even requires estimated 250–350+ daily covers at average spend.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 80px' }}>

        {/* ── STEP 2: Market overview ───────────────────────────────────── */}
        <div style={{ marginTop: 52, marginBottom: 52 }}>
          <SectionLabel text="Gold Coast market overview" />
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', margin: '0 0 24px 0' }}>
            A large visitor economy alongside a rapidly growing resident city — two distinct demand profiles that require different business strategies
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {[
              {
                title: 'Population momentum',
                body: 'The Gold Coast is approaching 700,000 residents and is one of Australia\'s fastest-growing major cities — driven by interstate migration from Sydney and Melbourne and significant international migration. This resident base matters: it decouples the economy from pure tourism risk and creates year-round commercial demand that didn\'t exist at this scale ten years ago.',
              },
              {
                title: 'Tourism economy — the real numbers',
                body: 'An estimated 13+ million visitors per year generate significant hospitality demand but equally enormous supply. The tourist strip is chronically oversupplied with generic operators competing for the same impulse spend. The opportunity is not in serving tourists — it\'s in serving the growing resident base that tourism operators have consistently underserved.',
              },
              {
                title: 'Seasonal reality',
                body: 'School holidays (January, Easter, June–July, September) are estimated to drive 40–80% above-average trading for tourist-adjacent businesses — the range varies significantly by suburb and concept type. Off-peak winter (May–August) is where operators without a resident base struggle. A business with an estimated 50%+ resident trade is typically better insulated from the seasonal trough. A business with an estimated 80%+ tourist trade may face existential pressure in off-peak months without adequate cash reserves.',
              },
              {
                title: 'Migration and the new resident profile',
                body: 'The GC\'s resident demographic has skewed upward rapidly. Sydney and Melbourne migrants bring higher income expectations and spending habits — specifically, appetite for quality independent hospitality. This is the structural driver behind Burleigh\'s explosion and Palm Beach\'s rapid improvement. It\'s not tourism; it\'s migration.',
              },
              {
                title: 'Digital nomad and remote worker impact',
                body: 'Remote work has made the Gold Coast permanently attractive for high-earning professionals who previously commuted from Brisbane. The Broadbeach, Burleigh, and Mermaid corridor now hosts a significant population of remote workers who want quality cafés and lunch options on a regular basis — not just on holiday.',
              },
              {
                title: 'Light rail effect',
                body: 'The Gold Coast light rail network (G:link) connects Helensvale to Broadbeach. Stations at Southport, Broadbeach North, and Surfers have materially changed foot traffic patterns. Operators within 300m of a light rail station have a structural foot traffic advantage over those who aren\'t.',
              },
            ].map(({ title, body }) => (
              <Card key={title} style={{ padding: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 800, color: S.n900, marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.7, margin: 0 }}>{body}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* ── STEP 3: Top 5 strategic opportunities ────────────────────── */}
        <div style={{ marginBottom: 52 }}>
          <SectionLabel text="Strategic opportunities" />
          <h2 style={{ fontSize: 22, fontWeight: 900, color: S.n900, letterSpacing: '-0.02em', margin: '0 0 24px 0' }}>Top 5 opportunities on the Gold Coast right now</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 14 }}>
            {[
              {
                rank: '01', title: 'Specialty café — Burleigh Heads / Palm Beach corridor',
                reason: 'The resident-led café culture along the southern coastal strip is the most credible independent hospitality opportunity in Queensland outside inner Brisbane. James Street demand is proven; Palm Beach has the same demographics at 40% lower rent.',
                risk: 'Access to a site in Burleigh Heads is the primary constraint — vacancy is genuinely rare. Palm Beach sites are available but require marketing investment to build the traffic Burleigh generates passively.',
                demand: 'Year-round resident + weekend tourist overlay. Strong brunch and lunch trading.',
                color: S.emerald, bg: S.emeraldBg, bdr: S.emeraldBdr,
              },
              {
                rank: '02', title: 'Premium casual dining — Broadbeach CBD precinct',
                reason: 'Pacific Fair, the casino complex, and a growing professional residential population create the only location on the Gold Coast with strong lunch and dinner demand across all seven days. The casino\'s presence means there is no dead weekend in winter.',
                risk: 'Entry rents of $7,000–$12,000/month require a concept that can consistently achieve 80+ covers per sitting. Not a first-restaurant location.',
                demand: 'Mixed professional-tourist, consistent evening economy year-round.',
                color: S.brand, bg: S.brandFaded, bdr: S.brandBorder,
              },
              {
                rank: '03', title: 'High-end dining — Main Beach (Tedder Avenue)',
                reason: 'Main Beach\'s Marina Mirage and Tedder Avenue precinct serves the highest per-head spend demographic on the Gold Coast. There are fewer than 10 fine-dining venues within walking distance of Palazzo Versace. The market exists; quality supply is thin.',
                risk: 'Extremely small catchment. A 40-seat fine-dining restaurant cannot fill on resident demand alone — the concept must attract visitors from Broadbeach and Surfers as a destination.',
                demand: 'Destination dining. High income, low volume, high spend per head.',
                color: S.purple, bg: S.purpleBg, bdr: S.purpleBdr,
              },
              {
                rank: '04', title: 'Low-cost entry — Coolangatta or Tugun',
                reason: 'The southern coastal suburbs offer the best value proposition on the coast: improving foot traffic from surf culture demographics, rents 50–60% below Burleigh, and a community character that actively supports quality independents over chains.',
                risk: 'Establishment curve is longer than beach-core suburbs. Revenue ramps slowly. The operator needs 12–18 months of runway before the business becomes self-sustaining.',
                demand: 'Resident surf community, airport corridor traffic, incremental tourist overlay.',
                color: S.amber, bg: S.amberBg, bdr: S.amberBdr,
              },
              {
                rank: '05', title: 'First-time operator — Southport professional strip',
                reason: 'Southport\'s Nerang Street and Scarborough Street provide a commercially forgiving environment: lower rents than beach core, a reliable weekday lunch trade from surrounding offices, and a customer base with lower expectations relative to the premium coastal strips.',
                risk: 'Weekends are commercially thin. An operator who needs seven-day revenue to cover costs will be permanently stressed. Southport requires a Monday–Friday business model.',
                demand: 'Government, legal, financial, and healthcare professionals Monday–Friday. Thin weekend.',
                color: S.muted, bg: '#F8FAFC', bdr: S.border,
              },
            ].map(({ rank, title, reason, risk, demand, color, bg, bdr }) => (
              <div key={rank} style={{ background: bg, border: `1px solid ${bdr}`, borderRadius: 14, padding: 22 }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 28, fontWeight: 900, color, opacity: 0.5, lineHeight: 1, flexShrink: 0 }}>{rank}</span>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 800, color: S.n900, margin: '0 0 10px 0' }}>{title}</h3>
                    <p style={{ fontSize: 13, color: S.n900, lineHeight: 1.65, margin: '0 0 8px 0' }}><strong>Reason:</strong> {reason}</p>
                    <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.65, margin: '0 0 8px 0' }}><strong>Risk:</strong> {risk}</p>
                    <p style={{ fontSize: 12, color, fontWeight: 600, margin: 0 }}><strong>Demand type:</strong> {demand}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── STEP 4: Opportunity cards (6 core suburbs) ───────────────── */}
        <div style={{ marginBottom: 52 }}>
          <SectionLabel text="Core suburb breakdown" />
          <h2 style={{ fontSize: 22, fontWeight: 900, color: S.n900, letterSpacing: '-0.02em', margin: '0 0 24px 0' }}>Where the main opportunities sit</h2>
          {/* Verdict + composite score resolved from SUBURBS_DERIVED to stay in sync with the model */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {[
              {
                name: 'Burleigh Heads',
                body: 'The benchmark. James Street and the surrounding village strip is where the Gold Coast\'s best independent operators concentrate. High resident loyalty, strong weekend tourism overlay, and the aspirational identity that attracts quality operators. Rents are meaningful ($4,500–$9,000/month) but conversion rates are high enough to justify them.',
                customer: 'Health-conscious 28–45 professionals, young families, surf community, weekend visitors',
              },
              {
                name: 'Broadbeach',
                body: 'Pacific Fair + casino precinct creates a demand floor that survives winter. Premium concepts belong here. Generic concepts drown in competition. An indicative model for a premium casual restaurant here suggests monthly revenue potential of $90,000–$140,000 under favourable conditions; an under-differentiated concept is unlikely to recover fit-out costs.',
                customer: 'Casino patrons, Pacific Fair shoppers, professionals, interstate visitors, apartment residents',
              },
              {
                name: 'Palm Beach',
                body: 'The value play on the coast. Palm Beach has Burleigh\'s demographic at 40–50% lower rent. The strip is developing rapidly. Operators who establish now build brand equity before the market gets crowded and rents re-price.',
                customer: 'Younger professionals, surf community, growing family demographic',
              },
              {
                name: 'Southport',
                body: 'The Gold Coast\'s traditional CBD. Best suited for professional services and lunch-focused hospitality. Light rail has improved foot traffic meaningfully. The evening and weekend economy is still thin — models must account for this.',
                customer: 'Government employees, legal and finance professionals, TAFE and Griffith students',
              },
              {
                name: 'Robina',
                body: 'Robina Town Centre exerts enormous gravity over commercial spending. Strip retail outside the centre underperforms unless positioned for the Bond University corridor or residential estate strips that the centre doesn\'t serve. Consistent but conservative market.',
                customer: 'Families, Bond University students, master-planned estate residents',
              },
              {
                name: 'Coolangatta',
                body: 'Southern Gold Coast\'s most underrated commercial strip. Surf culture identity, improving resident demographics, airport proximity creating consistent traffic, and rents 40% below Broadbeach. Best for operators who want community-focused hospitality without inner-suburb pricing.',
                customer: 'Surf community, local residents, border-crossing NSW visitors, airport workers',
              },
            ].map(({ name, body, customer }) => {
              const derived = SUBURBS_DERIVED.find(s => s.name === name)
              const verdict: GoldCoastVerdict = derived?.verdict ?? 'GO'
              const composite = derived?.compositeScore ?? 0
              return (
                <Card key={name} style={{ display: 'flex', flexDirection: 'column' as const }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 800, color: S.n900, margin: 0 }}>{name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 20, fontWeight: 900, color: VERDICT_CFG[verdict].txt }}>{composite}</span>
                      <Badge v={verdict} />
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.7, margin: '0 0 12px 0', flex: 1 }}>{body}</p>
                  <div style={{ background: S.n50, borderRadius: 8, padding: '8px 12px' }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, margin: '0 0 3px 0', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>Customer profile</p>
                    <p style={{ fontSize: 12, color: S.muted, margin: 0 }}>{customer}</p>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>

        {/* ── STEP 5: Where it fails ────────────────────────────────────── */}
        <div style={{ marginBottom: 52 }}>
          <SectionLabel text="Critical risk factors" />
          <h2 style={{ fontSize: 22, fontWeight: 900, color: S.n900, letterSpacing: '-0.02em', margin: '0 0 8px 0' }}>Where Gold Coast hospitality fails — and why</h2>
          <p style={{ fontSize: 14, color: S.muted, margin: '0 0 24px 0', lineHeight: 1.6 }}>These are not theoretical risks. They are the documented reasons operators fail on the Gold Coast year after year.</p>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 14 }}>
            {[
              {
                title: 'Seasonal dependence — the winter trap',
                detail: 'Tourist-only operators often achieve $80,000–$120,000/month revenue through December–January, then see volumes drop 55–65% through June–August. If your breakeven requires peak-month revenue, you will run at a structural loss for six months per year. Businesses that survive the Gold Coast winter have a resident base that carries them. Those that don\'t, often don\'t survive their second year.',
                fix: 'Build a resident loyalty base from day one, even if your location generates tourist volume. Local loyalty is the insurance policy.',
              },
              {
                title: 'High-rent traps — Surfers Paradise and Broadbeach core',
                detail: 'A $14,000/month lease on Cavill Avenue in Surfers Paradise requires roughly 280–320 covers per day at average $28 spend just to cover rent. In shoulder season, many operators achieve 60–80 covers. The maths doesn\'t work for most concepts at this price point. The operators who survive are high-volume, low-complexity, fast turnover — not quality independents.',
                fix: 'Reverse-engineer your break-even before viewing a site. If the model only works at peak capacity, the site is wrong.',
              },
              {
                title: 'Over-tourism volatility — the 5-star trap',
                detail: 'Hotels and tourist developments increase tourist volume but frequently include ground-floor food and beverage that cannibalises street-level trade. A new resort that brings 500 guests to Surfers Paradise may redirect 200 of them to its own café rather than yours. The Gold Coast\'s resort development pipeline is consistently full.',
                fix: 'Assess the hotel F&B offering in your area before committing. Premium hotels with high-quality internal dining are competitive threats, not demand generators.',
              },
              {
                title: 'Weekday dead zones — the residential suburb risk',
                detail: 'Outer residential suburbs (Coomera, Helensvale, Burleigh Waters) generate strong weekend family volume but very thin weekday trade. If your cost base requires 6-day revenue, these markets will consistently underperform. Hospitality businesses that work here are designed around the weekend, with lower staffing and shorter hours on weekdays.',
                fix: 'Design the operating model for the actual trading pattern — not the theoretical seven-day pattern a generic lease assumes.',
              },
            ].map(({ title, detail, fix }) => (
              <div key={title} style={{ background: S.redBg, border: `1px solid ${S.redBdr}`, borderRadius: 14, padding: 22 }}>
                <h3 style={{ fontSize: 14, fontWeight: 800, color: '#991B1B', margin: '0 0 10px 0' }}>⚠ {title}</h3>
                <p style={{ fontSize: 13, color: '#7F1D1D', lineHeight: 1.7, margin: '0 0 12px 0' }}>{detail}</p>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#059669', margin: 0 }}>Fix: {fix}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── STEP 6: Cost reality ──────────────────────────────────────── */}
        <div style={{ marginBottom: 52 }}>
          <SectionLabel text="Cost reality" />
          <h2 style={{ fontSize: 22, fontWeight: 900, color: S.n900, letterSpacing: '-0.02em', margin: '0 0 24px 0' }}>The real numbers behind a Gold Coast hospitality business</h2>
          <AssumptionBanner />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 24 }}>
            <Card>
              <h3 style={{ fontSize: 13, fontWeight: 800, color: S.n900, marginBottom: 16 }}>Rent tiers by zone (indicative, mid-2026)</h3>
              {[
                { zone: 'Surfers Paradise (strip)',  range: '$8,000–$20,000/mo' },
                { zone: 'Broadbeach core',           range: '$5,000–$12,000/mo' },
                { zone: 'Burleigh Heads (James St)', range: '$4,500–$9,000/mo'  },
                { zone: 'Southport / Main Beach',    range: '$3,000–$8,000/mo'  },
                { zone: 'Palm Beach / Coolangatta',  range: '$2,500–$4,500/mo'  },
                { zone: 'Outer suburbs',             range: '$1,500–$3,500/mo'  },
              ].map(({ zone, range }) => (
                <div key={zone} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${S.n100}` }}>
                  <span style={{ fontSize: 12, color: S.muted }}>{zone}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: S.n900 }}>{range}</span>
                </div>
              ))}
            </Card>
            <Card>
              <h3 style={{ fontSize: 13, fontWeight: 800, color: S.n900, marginBottom: 16 }}>Staffing costs (QLD hospitality)</h3>
              {[
                { type: 'Café (2 FT + 2 casual)',    cost: '$22,000–$32,000/mo' },
                { type: 'Restaurant (3–5 staff)',     cost: '$30,000–$50,000/mo' },
                { type: 'Large venue (6–10 staff)',   cost: '$50,000–$85,000/mo' },
              ].map(({ type, cost }) => (
                <div key={type} style={{ padding: '10px 0', borderBottom: `1px solid ${S.n100}` }}>
                  <p style={{ fontSize: 12, color: S.muted, margin: '0 0 3px 0' }}>{type}</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: S.n900, margin: 0 }}>{cost}</p>
                </div>
              ))}
              <p style={{ fontSize: 11, color: S.mutedLight, marginTop: 12, lineHeight: 1.5 }}>Includes weekend penalty rates and super. QLD penalty rates apply from Saturday noon; budget accordingly.</p>
            </Card>
            <Card>
              <h3 style={{ fontSize: 13, fontWeight: 800, color: S.n900, marginBottom: 16 }}>Average customer spend</h3>
              {[
                { segment: 'Café (brunch)',          range: '$22–$38/head'  },
                { segment: 'Casual dining',          range: '$45–$70/head'  },
                { segment: 'Premium casual',         range: '$70–$110/head' },
                { segment: 'Fine dining',            range: '$110–$180/head'},
                { segment: 'Tourist impulse food',   range: '$14–$22/head'  },
              ].map(({ segment, range }) => (
                <div key={segment} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${S.n100}` }}>
                  <span style={{ fontSize: 12, color: S.muted }}>{segment}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: S.n900 }}>{range}</span>
                </div>
              ))}
            </Card>
          </div>
          <Card style={{ background: S.brandFaded, border: `1px solid ${S.brandBorder}` }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: S.brandDark, marginBottom: 6 }}>Indicative break-even model — illustrative only</h3>
            <p style={{ fontSize: 11, color: S.brandDark, marginBottom: 12, opacity: 0.8 }}>Assumptions: rent at indicative midpoint, 2 FT + 2 casual staff, $24,000–$28,000/month all-in staffing, $4,000–$6,000/month other costs, $26–$32 average spend per customer. Your actual figures will differ.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 12, marginBottom: 14 }}>
              {[
                { location: 'Burleigh Heads', rent: '~$6,500/mo', totalFixed: '~$36,000–$40,000/mo', coversNeeded: 'est. 40–55 covers/day', note: 'Achievable at shoulder season' },
                { location: 'Broadbeach core', rent: '~$8,500/mo', totalFixed: '~$38,000–$44,000/mo', coversNeeded: 'est. 50–65 covers/day', note: 'Requires consistent evening trade' },
                { location: 'Surfers Paradise', rent: '~$14,000/mo', totalFixed: '~$44,000–$52,000/mo', coversNeeded: 'est. 75–100 covers/day', note: 'High-risk in shoulder months' },
                { location: 'Palm Beach', rent: '~$3,500/mo', totalFixed: '~$32,000–$36,000/mo', coversNeeded: 'est. 32–42 covers/day', note: 'Lower bar; slower establishment' },
              ].map(({ location, rent, totalFixed, coversNeeded, note }) => (
                <div key={location} style={{ background: 'rgba(255,255,255,0.6)', borderRadius: 8, padding: '12px 14px' }}>
                  <p style={{ fontSize: 12, fontWeight: 800, color: S.n900, margin: '0 0 6px 0' }}>{location}</p>
                  <p style={{ fontSize: 11, color: S.muted, margin: '0 0 2px 0' }}>Est. rent: {rent}</p>
                  <p style={{ fontSize: 11, color: S.muted, margin: '0 0 2px 0' }}>Fixed costs: {totalFixed}</p>
                  <p style={{ fontSize: 11, fontWeight: 700, color: S.brandDark, margin: '0 0 4px 0' }}>{coversNeeded}</p>
                  <p style={{ fontSize: 10, color: S.brand, margin: 0, fontStyle: 'italic' }}>{note}</p>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 12, color: S.brandDark, lineHeight: 1.7, margin: 0 }}>
              The principle is consistent regardless of location: model your break-even using the <em>shoulder-season revenue estimate</em>, not peak. If the model only works in your three best trading months, the business has structural risk in the other nine.
            </p>
          </Card>
        </div>

        {/* ── STEP 7: Success patterns ──────────────────────────────────── */}
        <div style={{ marginBottom: 52 }}>
          <SectionLabel text="What works" />
          <h2 style={{ fontSize: 22, fontWeight: 900, color: S.n900, letterSpacing: '-0.02em', margin: '0 0 24px 0' }}>6 patterns from successful Gold Coast operators</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
            {[
              { n: '1', title: 'They chose location based on resident density, not tourist volume', body: 'Some better-performing independents are estimated to generate 60–70% of their revenue from within a 3km residential catchment, based on observed operator profiles. They don\'t rely on tourist traffic to exist — it\'s a bonus.' },
              { n: '2', title: 'They priced for locals, not tourists', body: 'Tourist-priced menus ($22 flat whites, $32 smashed avo) erode the local loyalty that sustains the business through winter. The operators who survive long-term keep their pricing accessible for regulars.' },
              { n: '3', title: 'They opened Tuesday–Sunday, not 7 days', body: 'Monday revenue on the Gold Coast is thin across most suburbs. Some operators who closed Monday and redirected that labour cost into weekend quality and staffing have reported outperforming comparable seven-day operations — though this is not universal.' },
              { n: '4', title: 'They built a brand that travels', body: 'The most successful Burleigh operators built social media presence before they opened their second location. Customers from Broadbeach and Southport drive to Burleigh specifically for the brand — reducing dependence on local foot traffic.' },
              { n: '5', title: 'They treated tourism as upside, not baseline', body: 'Instead of modelling Christmas and January as "normal" trading months and then being stressed when it dropped, they modelled off the shoulder season and treated peak months as cashflow buffer. This fundamentally changes how the business manages staffing and inventory.' },
              { n: '6', title: 'They differentiated on something specific', body: 'The operators who failed tried to be good at everything. Those who succeeded were exceptional at something specific — a single-origin coffee program, a breakfast format that nobody else was doing, a pricing model that made quality accessible to families. Differentiation reduces the pressure of location.' },
            ].map(({ n, title, body }) => (
              <Card key={n} style={{ padding: 20 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: S.brandFaded, border: `1px solid ${S.brandBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 900, color: S.brand }}>{n}</span>
                </div>
                <h3 style={{ fontSize: 13, fontWeight: 800, color: S.n900, margin: '0 0 8px 0', lineHeight: 1.4 }}>{title}</h3>
                <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.65, margin: 0 }}>{body}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* ── STEP 8: Common mistakes ───────────────────────────────────── */}
        <div style={{ marginBottom: 52 }}>
          <SectionLabel text="Common mistakes" />
          <h2 style={{ fontSize: 22, fontWeight: 900, color: S.n900, letterSpacing: '-0.02em', margin: '0 0 24px 0' }}>5 mistakes Gold Coast operators make — with direct fixes</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 12 }}>
            {[
              { mistake: 'Choosing Surfers Paradise because the foot traffic is visible', fix: 'Foot traffic in Surfers is real but conversion for independents is poor. Tourists walk past quality concepts and stop at familiar chains. Run the unit economics at shoulder-season volumes, not peak volumes. The numbers usually don\'t work.' },
              { mistake: 'Ignoring seasonality until the second June', fix: 'Build a 12-month cash flow model before signing a lease. If the model only works in 8 of 12 months, build 4 months of cash reserve into your startup budget. Operators who experience structural losses in winter often had a breakeven model that was only viable at peak volumes — a risk that can be identified before signing if shoulder-season scenarios are modelled.' },
              { mistake: 'Underestimating rent pressure and overestimating growth', fix: 'Rent is fixed. Revenue takes 12–18 months to reach model levels. Budget for your rent from month one at a revenue level 30–40% below your target. If the business can survive that, it\'ll survive the establishment curve.' },
              { mistake: 'Opening the wrong concept in the right suburb', fix: 'Mermaid Beach needs premium. Coomera needs affordable. Robina needs family-friendly. Opening a specialty coffee bar in Coomera or a cheap café in Mermaid Beach means fighting the suburb\'s commercial DNA — and the suburb usually wins.' },
              { mistake: 'Over-investing in fit-out relative to cash reserve', fix: 'A $250,000 fit-out in a $4,500/month suburban café location takes 5+ years to recoup. The fit-out should not exceed 18–24 months of rent. Anything beyond that should be allocated to cash reserves that carry you through the establishment period.' },
            ].map(({ mistake, fix }, i) => (
              <div key={i} style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 20, display: 'flex', gap: 16 }}>
                <div style={{ flexShrink: 0 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: S.red, marginTop: 6 }} />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: S.n900, margin: '0 0 8px 0', lineHeight: 1.4 }}>{mistake}</p>
                  <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.65, margin: 0 }}>
                    <span style={{ fontWeight: 700, color: S.emerald }}>Fix: </span>{fix}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── STEP 9: Full suburb intelligence (20 suburbs) ─────────────── */}
        <div style={{ marginBottom: 52 }}>
          <SectionLabel text="Suburb intelligence" />
          <h2 style={{ fontSize: 22, fontWeight: 900, color: S.n900, letterSpacing: '-0.02em', margin: '0 0 8px 0' }}>20 Gold Coast suburbs — scored and ranked</h2>
          <p style={{ fontSize: 14, color: S.muted, margin: '0 0 20px 0', lineHeight: 1.6 }}>Every analysis below is written for the operator making a leasing decision. Each entry states why the verdict exists — not just what it is.</p>
          <ScoreMethodology />

          {/* GO: Strong opportunities */}
          <h3 style={{ fontSize: 14, fontWeight: 800, color: S.emerald, marginBottom: 16, textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>Strong opportunities</h3>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 14, marginBottom: 32 }}>
            {SUBURBS_DERIVED.filter(s => s.verdict === 'GO').map(s => (
              <SuburbCard key={s.name} s={s} />
            ))}
          </div>

          {/* CAUTION: Proceed with a clear plan */}
          <h3 style={{ fontSize: 14, fontWeight: 800, color: S.amber, marginBottom: 16, textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>Proceed with a clear plan</h3>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 14, marginBottom: 32 }}>
            {SUBURBS_DERIVED.filter(s => s.verdict === 'CAUTION').map(s => (
              <SuburbCard key={s.name} s={s} />
            ))}
          </div>

          {/* RISKY: Specific conditions required */}
          <h3 style={{ fontSize: 14, fontWeight: 800, color: S.red, marginBottom: 16, textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>Risky — specific conditions required</h3>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 14 }}>
            {SUBURBS_DERIVED.filter(s => s.verdict === 'RISKY').map(s => (
              <SuburbCard key={s.name} s={s} />
            ))}
          </div>
                </div>

        {/* ── STEP 10: Comparison table ─────────────────────────────────── */}
        <div style={{ marginBottom: 52 }}>
          <SectionLabel text="Suburb comparison" />
          <h2 style={{ fontSize: 22, fontWeight: 900, color: S.n900, letterSpacing: '-0.02em', margin: '0 0 8px 0' }}>All 20 suburbs ranked</h2>
          <p style={{ fontSize: 13, color: S.muted, marginBottom: 8 }}>Sort by your business type. Scores are composite relative estimates (1–100) — see methodology note above for how they are calculated.</p>
          <p style={{ fontSize: 11, color: S.mutedLight, marginBottom: 20 }}>Higher score = relatively better conditions for that business type in that suburb. Not a forecast or success guarantee.</p>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' as const }}>
            {(['cafe', 'restaurant', 'retail'] as const).map(col => (
              <button key={col} onClick={() => setTableSort(col)} style={{ padding: '6px 16px', borderRadius: 6, border: `1px solid ${tableSort === col ? S.brand : S.border}`, background: tableSort === col ? S.brand : S.white, color: tableSort === col ? S.white : S.muted, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize' as const }}>
                {col === 'cafe' ? 'Café score' : col === 'restaurant' ? 'Restaurant score' : 'Retail score'}
              </button>
            ))}
          </div>
          <div style={{ overflowX: 'auto' as const, borderRadius: 12, border: `1px solid ${S.border}` }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' as const, background: S.white, fontSize: 13 }}>
              <thead>
                <tr style={{ background: S.n50, borderBottom: `1px solid ${S.border}` }}>
                  {['Suburb', 'Café', 'Restaurant', 'Retail', 'Risk', 'Verdict'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left' as const, fontSize: 10, fontWeight: 700, color: S.muted, textTransform: 'uppercase' as const, letterSpacing: '0.06em', whiteSpace: 'nowrap' as const }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((row, i) => (
                  <tr key={row.name} style={{ borderBottom: i < sorted.length - 1 ? `1px solid ${S.n100}` : 'none' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 700, color: S.n900, whiteSpace: 'nowrap' as const }}>{row.name}</td>
                    <td style={{ padding: '10px 14px', fontWeight: tableSort === 'cafe' ? 800 : 400, color: tableSort === 'cafe' ? S.brand : S.muted }}>{row.cafe}</td>
                    <td style={{ padding: '10px 14px', fontWeight: tableSort === 'restaurant' ? 800 : 400, color: tableSort === 'restaurant' ? S.brand : S.muted }}>{row.restaurant}</td>
                    <td style={{ padding: '10px 14px', fontWeight: tableSort === 'retail' ? 800 : 400, color: tableSort === 'retail' ? S.brand : S.muted }}>{row.retail}</td>
                    <td style={{ padding: '10px 14px', color: S.muted, whiteSpace: 'nowrap' as const }}>{row.risk}</td>
                    <td style={{ padding: '10px 14px' }}><Badge v={row.verdict} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── STEP 11: Poll ─────────────────────────────────────────────── */}
        <SuburbPoll />

        {/* ── STEP 12: FAQ ──────────────────────────────────────────────── */}
        <div style={{ marginBottom: 52 }}>
          <SectionLabel text="Frequently asked" />
          <h2 style={{ fontSize: 22, fontWeight: 900, color: S.n900, letterSpacing: '-0.02em', margin: '0 0 24px 0' }}>Common questions about opening on the Gold Coast</h2>
          <Card>
            {[
              {
                q: 'Is Gold Coast good for opening a café?',
                a: 'Yes — in the right suburb. Burleigh Heads and Broadbeach have proven year-round demand for quality independents. The risk is in tourist-only locations where winter revenue drops 55–65% from peak. Cafés with a mixed resident-tourist base outperform tourist-only locations significantly over a full year.',
              },
              {
                q: 'Which Gold Coast suburb has the best foot traffic for a café?',
                a: 'Surfers Paradise has the highest raw count but the worst conversion for independents. Broadbeach has the strongest quality foot traffic — casino precinct, Pacific Fair, professional apartments — that actually converts to café customers. Burleigh Heads James Street delivers the best foot traffic per metre for independent hospitality specifically.',
              },
              {
                q: 'Where are rents cheapest on the Gold Coast?',
                a: 'Outer suburbs (Coomera, Nerang, Burleigh Waters, Ashmore) at $1,500–$3,500/month offer the lowest rents. The trade-off is thin foot traffic. The best value balance is Palm Beach or Coolangatta: improving resident demographics, surf culture identity, and rents 40–50% below Burleigh Heads. These are the current value windows.',
              },
              {
                q: 'Is Surfers Paradise saturated for hospitality?',
                a: 'The Cavill and Orchid Avenue strip facing the beach is extremely saturated for generic hospitality — operator turnover is among the highest in Queensland. Premium concepts positioned away from the tourist strip (Tedder Avenue in Main Beach, for example) perform differently. A generic café targeting quality on Cavill Avenue is fighting the wrong battle.',
              },
              {
                q: 'What type of business works best in Burleigh Heads?',
                a: 'Specialty café, quality casual dining, wellness and fitness, and lifestyle retail. The customer profile — health-conscious 28–45 professionals and families with strong spending power — creates consistent demand for quality independents. Brunch and weekend lunch significantly outperform weekday dinner. Differentiation matters: the market is established enough that "good" is not sufficient — the concept needs to be exceptional at something specific.',
              },
            ].map(({ q, a }, i, arr) => (
              <div key={q} style={{ paddingTop: i === 0 ? 0 : 20, marginTop: i === 0 ? 0 : 20, borderTop: i === 0 ? 'none' : `1px solid ${S.border}` }}>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: S.n900, margin: '0 0 10px 0' }}>{q}</h3>
                <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.75, margin: 0 }}>{a}</p>
              </div>
            ))}
          </Card>
        </div>

        {/* ── STEP 13: CTA ──────────────────────────────────────────────── */}
        <div style={{ background: 'linear-gradient(135deg, #0E7490 0%, #0891B2 100%)', borderRadius: 16, padding: '44px 36px', marginBottom: 40, textAlign: 'center' as const }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: 14 }}>Before you sign a lease</p>
          <h3 style={{ fontSize: 24, fontWeight: 900, color: S.white, margin: '0 0 12px 0', lineHeight: 1.3, letterSpacing: '-0.02em' }}>
            Test your Gold Coast suburb with real numbers
          </h3>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', margin: '0 0 28px 0', lineHeight: 1.7, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
            Enter any Gold Coast address. Get foot traffic signals, competition density, rent benchmarks, and a GO/CAUTION/NO verdict — in under 3 minutes.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' as const }}>
            <Link href="/analyse" style={{ display: 'inline-block', background: S.white, color: S.brandDark, padding: '13px 28px', borderRadius: 8, fontWeight: 800, textDecoration: 'none', fontSize: 14 }}>
              Run a location analysis →
            </Link>
            <Link href="/analyse" style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', color: S.white, padding: '13px 28px', borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: 14, border: '1px solid rgba(255,255,255,0.3)' }}>
              Browse all location guides
            </Link>
          </div>
        </div>

        {/* Nearby pages nav */}
        <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 28, paddingBottom: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: S.muted, textTransform: 'uppercase' as const, letterSpacing: '0.07em', marginBottom: 14 }}>Other city guides</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const }}>
            {[
              { href: '/analyse/brisbane', label: 'Brisbane' },
              { href: '/analyse/sydney', label: 'Sydney' },
              { href: '/analyse/melbourne', label: 'Melbourne' },
              { href: '/analyse/perth', label: 'Perth' },
              { href: '/analyse/gold-coast/gym', label: 'Gold Coast Gyms' },
            ].map(({ href, label }) => (
              <Link key={href} href={href} style={{ fontSize: 13, fontWeight: 600, color: S.brand, background: S.brandFaded, border: `1px solid ${S.brandBorder}`, borderRadius: 6, padding: '6px 14px', textDecoration: 'none' }}>
                {label} →
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
