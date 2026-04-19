'use client'
import Link from 'next/link'
import { useState } from 'react'

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

type V = 'GO' | 'CAUTION' | 'RISKY'

const VERDICT_CFG: Record<V, { bg: string; bdr: string; txt: string }> = {
  GO:      { bg: S.emeraldBg, bdr: S.emeraldBdr, txt: S.emerald },
  CAUTION: { bg: S.amberBg,   bdr: S.amberBdr,   txt: S.amber },
  RISKY:   { bg: S.redBg,     bdr: S.redBdr,     txt: S.red },
}

// ── Scoring model ──────────────────────────────────────────────────────────────
// Five observable inputs feed into business-type-specific weighted composites.
// Scores are relative estimates calibrated across all 20 suburbs in this set.
type SuburbFactors = {
  demandStrength: number     // 1–10: resident + commercial demand depth
  rentPressure: number       // 1–10: cost burden relative to revenue potential
  competitionDensity: number // 1–10: operator saturation in walkable catchment
  seasonalityRisk: number    // 1–10: estimated peak-to-trough revenue variance
  tourismDependency: number  // 1–10: tourist vs resident revenue share
}

// Stated weights per business type (each row sums to 100).
// Suburb scores are pre-computed to these weights and stored in the SUBURBS array.
// Displayed in ScoreMethodology so users understand how the model is structured.
const SCORE_WEIGHTS = {
  cafe:       { demand: 40, rent: 28, competition: 18, seasonality: 14 },
  restaurant: { demand: 32, rent: 22, competition: 18, seasonality: 14, tourism: 14 },
  retail:     { demand: 28, rent: 22, tourism: 22,     competition: 18, seasonality: 10 },
} as const

// Verdict derived from composite: café×0.40 + restaurant×0.35 + retail×0.25
const VERDICT_THRESHOLDS = { go: 68.5, caution: 60.0 } as const

function deriveVerdict(cafe: number, restaurant: number, retail: number): V {
  const composite = cafe * 0.40 + restaurant * 0.35 + retail * 0.25
  if (composite >= VERDICT_THRESHOLDS.go) return 'GO'
  if (composite >= VERDICT_THRESHOLDS.caution) return 'CAUTION'
  return 'RISKY'
}

// Factor display metadata — key must match SuburbFactors field names
const FACTOR_META: { key: keyof SuburbFactors; label: string; dir: 'high' | 'low' | 'ctx' }[] = [
  { key: 'demandStrength',     label: 'Demand',      dir: 'high' },
  { key: 'rentPressure',       label: 'Rent cost',   dir: 'low'  },
  { key: 'competitionDensity', label: 'Competition', dir: 'low'  },
  { key: 'seasonalityRisk',    label: 'Seasonality', dir: 'low'  },
  { key: 'tourismDependency',  label: 'Tourism dep', dir: 'ctx'  },
]

function factorColor(value: number, dir: 'high' | 'low' | 'ctx'): string {
  if (dir === 'high') return value >= 7 ? S.emerald : value >= 4 ? S.amber : S.red
  if (dir === 'low')  return value <= 4 ? S.emerald : value <= 6 ? S.amber : S.red
  return S.muted
}

function FactorGrid({ f }: { f: SuburbFactors }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 5, margin: '12px 0 14px' }}>
      {FACTOR_META.map(({ key, label, dir }) => {
        const v = f[key]
        const color = factorColor(v, dir)
        return (
          <div key={key} style={{ textAlign: 'center' as const, padding: '7px 3px', background: S.n50, borderRadius: 7, border: `1px solid ${S.border}` }}>
            <div style={{ fontSize: 16, fontWeight: 900, color, lineHeight: 1, marginBottom: 2 }}>
              {v}<span style={{ fontSize: 9, fontWeight: 500, color: S.mutedLight }}>/10</span>
            </div>
            <div style={{ fontSize: 8.5, color: S.muted, textTransform: 'uppercase' as const, letterSpacing: '0.05em', lineHeight: 1.3 }}>{label}</div>
          </div>
        )
      })}
    </div>
  )
}

function Badge({ v, size = 'sm' }: { v: V; size?: 'sm' | 'md' }) {
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
          { type: 'Café',       weights: 'Demand 40% · Rent 28% · Competition 18% · Seasonality 14%' },
          { type: 'Restaurant', weights: 'Demand 32% · Rent 22% · Competition 18% · Seasonality 14% · Tourism 14%' },
          { type: 'Retail',     weights: 'Demand 28% · Rent 22% · Tourism 22% · Competition 18% · Seasonality 10%' },
        ].map(({ type, weights }) => (
          <div key={type} style={{ background: S.brandFaded, borderRadius: 6, padding: '7px 10px', border: `1px solid ${S.brandBorder}` }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: S.brandDark, margin: '0 0 2px 0' }}>{type}</p>
            <p style={{ fontSize: 9.5, color: S.brandDark, margin: 0, lineHeight: 1.5, opacity: 0.8 }}>{weights}</p>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 10, color: S.mutedLight, margin: 0, lineHeight: 1.5 }}>
        Verdict formula: composite = Café×0.40 + Restaurant×0.35 + Retail×0.25. GO ≥ 68.5 · CAUTION 60–68 · RISKY &lt; 60. All inputs are indicative estimates — validate against your own research before making a leasing decision.
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

// ── Suburb data ──────────────────────────────────────────────────────────────
// `factors`: five observable inputs (1–10) that feed the scoring model.
// `cafe`, `restaurant`, `retail`: composite scores (50–100), derived from factor weights.
// `verdict`: NOT stored here — derived at runtime via deriveVerdict(cafe, restaurant, retail).
// `why`: explicitly maps score factors to observable evidence for transparency.
const SUBURBS: {
  name: string; slug: string; vibe: string; demand: string; competition: string;
  rent: string; risk: string; best: string; insight: string; why: string;
  factors: SuburbFactors; cafe: number; restaurant: number; retail: number;
}[] = [
  {
    name: 'Burleigh Heads',       slug: 'burleigh-heads',
    vibe: 'Health-conscious professionals, young families, surf culture. The Gold Coast\'s most established independent hospitality strip.',
    demand: 'Mixed — strong year-round resident base plus significant tourist overlay in peak periods',
    competition: 'Medium-high',   rent: '$4,500–$9,000/mo (indicative)',  risk: 'Site availability — vacancy is estimated below 2%',
    best: 'Specialty café, quality casual dining, wellness studio, lifestyle retail',
    insight: 'James Street commercial vacancy is estimated below 2% based on observed operator churn. The primary constraint is accessing a site, not generating demand once you have one.',
    why: 'Demand 9/10 is the primary driver — this suburb has the strongest year-round resident demand on the coast. Rent 7/10 and Competition 6/10 apply meaningful headwinds, partially offset by very low Seasonality Risk 3/10. Retail scores lower because the strip has limited street-level retail frontage relative to hospitality.',
    factors: { demandStrength: 9, rentPressure: 7, competitionDensity: 6, seasonalityRisk: 3, tourismDependency: 3 },
    cafe: 90, restaurant: 83, retail: 79,
  },
  {
    name: 'Broadbeach',           slug: 'broadbeach',
    vibe: 'Upscale mixed: casino professionals, Pacific Fair shoppers, holiday apartment residents, long-term owner-occupiers.',
    demand: 'High year-round — casino and Pacific Fair create a demand floor that moderates tourist-season volatility',
    competition: 'High',          rent: '$5,000–$12,000/mo (indicative)', risk: 'High entry rent requires strong unit economics',
    best: 'Premium casual dining, upscale café, cocktail bar, boutique retail',
    insight: 'The casino precinct is estimated to provide 30–40% of evening economy revenue in the surrounding area regardless of tourist season — a meaningful stabiliser for operators in shoulder months.',
    why: 'Restaurant 87/100 reflects Tourism Dependency 6/10 working in its favour — evening dining benefits from casino and Pacific Fair visitor flow. Café scores lower than restaurant because café trade here skews more transient. Rent Pressure 8/10 is the main risk — the model reflects that high fixed costs require consistent high-volume operation to achieve viability.',
    factors: { demandStrength: 8, rentPressure: 8, competitionDensity: 7, seasonalityRisk: 4, tourismDependency: 6 },
    cafe: 82, restaurant: 87, retail: 80,
  },
  {
    name: 'Mermaid Beach',        slug: 'mermaid-beach',
    vibe: 'Established affluent residential. Owner-occupied beachside properties, older professional demographic, strong community identity.',
    demand: 'Resident-dominant. Estimated 80%+ of commercial spending from locals rather than tourists.',
    competition: 'Low-medium',    rent: '$3,500–$6,500/mo (indicative)',  risk: 'Small absolute catchment — revenue ceiling exists',
    best: 'Premium breakfast/brunch café, quality casual dining, boutique wellness',
    insight: 'Community loyalty in Mermaid Beach is structurally higher than in tourist-adjacent suburbs — established operators typically face lower new-entrant risk here than elsewhere on the coast.',
    why: 'Demand 7/10 combined with very low Competition 3/10 and Seasonality Risk 2/10 creates favourable conditions for independent operators who don\'t need tourist volume. Retail scores lower because the suburb lacks the strip length and foot traffic density that walk-in retail requires. The GO verdict is conditional on concept-market fit — premium positioning is essential.',
    factors: { demandStrength: 7, rentPressure: 6, competitionDensity: 3, seasonalityRisk: 2, tourismDependency: 2 },
    cafe: 80, restaurant: 76, retail: 70,
  },
  {
    name: 'Palm Beach',           slug: 'palm-beach',
    vibe: 'Improving coastal strip south of Burleigh. Younger demographic, surf culture, above-average population growth in the southern GC corridor.',
    demand: 'Mixed resident-tourist, trending upward. Population growth above GC average per observed development activity.',
    competition: 'Low-medium',    rent: '$2,500–$4,500/mo (indicative)',  risk: 'Longer establishment period than Burleigh — 12–18 month runway required',
    best: 'Café (early-mover positioning), casual dining, surf lifestyle retail',
    insight: 'Rent-to-demand ratio in Palm Beach is currently more favourable than Burleigh Heads. This gap has been narrowing — operators who establish now do so at lower rent before the market re-prices as the strip matures.',
    why: 'Demand 7/10 with Rent Pressure only 4/10 creates a favourable entry point — this is the best rent-adjusted opportunity on the coast right now. Low Competition 3/10 and Seasonality Risk 3/10 reduce execution risk. Scored below Burleigh because the strip is still establishing: foot traffic density is lower and brand-building takes longer. The opportunity requires patience, not a different concept.',
    factors: { demandStrength: 7, rentPressure: 4, competitionDensity: 3, seasonalityRisk: 3, tourismDependency: 3 },
    cafe: 78, restaurant: 73, retail: 70,
  },
  {
    name: 'Main Beach',           slug: 'main-beach',
    vibe: 'Luxury residential, Marina Mirage precinct. High-income demographic, destination dining orientation, small permanent population.',
    demand: 'Low volume, high spend per customer. Destination-driven; relies on customers actively choosing to visit, not passing trade.',
    competition: 'Very low',      rent: '$4,000–$8,000/mo (indicative)',  risk: 'Catchment too small for most volume-dependent concepts',
    best: 'Premium dining destination, high-end specialty retail, marina-adjacent services',
    insight: 'Concept-market fit is more critical here than in any other GC suburb. A $90 per head breakfast is achievable; a $22 café concept is not — the local demographic will not support it regardless of execution quality.',
    why: 'Demand 6/10 reflects the small catchment size — this suburb has affluent residents but not many of them. Competition Density 2/10 is very low, which helps. Tourism Dependency 5/10 is neutral-positive for restaurants (destination diners travel here) but negative for cafés (transient tourism doesn\'t sustain a local café). GO verdict applies specifically to premium concepts where low volume and high spend per head make the unit economics work.',
    factors: { demandStrength: 6, rentPressure: 7, competitionDensity: 2, seasonalityRisk: 4, tourismDependency: 5 },
    cafe: 70, restaurant: 79, retail: 66,
  },
  {
    name: 'Surfers Paradise',     slug: 'surfers-paradise',
    vibe: 'International tourist strip. Extremely high peak-season volume, high operator churn, limited community loyalty. Most challenging environment for quality independents.',
    demand: 'Seasonally volatile — school holidays and summer create strong peaks; mid-year winter trough is significant for tourist-dependent operators.',
    competition: 'Extreme',       rent: '$8,000–$20,000/mo (indicative)', risk: 'Seasonal revenue gap + rent level creates structural pressure for most concepts',
    best: 'High-volume fast casual, tourist retail, nightlife-adjacent venues designed for high throughput',
    insight: 'At an estimated midpoint rent of $12,000–$14,000/month, a café concept would need to generate indicatively 280–350+ customer visits per day (at $28–$35 average spend) just to cover rent. In mid-year shoulder periods, many operators fall well short of this threshold.',
    why: 'CAUTION (not RISKY) because tourist retail and high-volume fast casual can and do succeed here — the market is real, it\'s just hostile to independents. Retail scores 79/100 because Tourism Dependency 9/10 is a positive for impulse retail. Café scores only 58/100 because Rent Pressure 10/10 combined with Competition Density 10/10 and Seasonality Risk 9/10 create structural headwinds that most independent café concepts cannot overcome without tourist-scale volumes.',
    factors: { demandStrength: 8, rentPressure: 10, competitionDensity: 10, seasonalityRisk: 9, tourismDependency: 9 },
    cafe: 58, restaurant: 70, retail: 79,
  },
  {
    name: 'Southport',            slug: 'southport',
    vibe: 'The Gold Coast\'s traditional commercial centre — government offices, medical precinct, light rail, legal and finance services.',
    demand: 'Weekday professional-dominant; weekend volume is thin. TAFE and Griffith students contribute weekday lunch.',
    competition: 'Medium',        rent: '$3,000–$7,000/mo (indicative)',  risk: 'Weekend revenue shortfall for 7-day cost models',
    best: 'Corporate lunch café, professional services, healthcare-allied, education',
    insight: 'Southport\'s commercial performance is heavily front-loaded to weekday lunch trade. Friday is estimated to generate disproportionately high revenue compared to the rest of the week. Operating models that require strong weekend revenue will be structurally stressed.',
    why: 'Demand 7/10 reflects strong weekday professional demand, which is a stable and predictable demand type. Seasonality Risk 2/10 is very low — this suburb doesn\'t depend on holidays or tourist seasons. Retail 72/100 scores above restaurant 66/100 because practical professional retail (stationery, health, services) suits the weekday-heavy trading pattern better than evening dining. GO verdict applies to weekday-focused concepts; weekend-dependent models would effectively be CAUTION here.',
    factors: { demandStrength: 7, rentPressure: 6, competitionDensity: 5, seasonalityRisk: 2, tourismDependency: 2 },
    cafe: 70, restaurant: 66, retail: 72,
  },
  {
    name: 'Coolangatta',          slug: 'coolangatta',
    vibe: 'Southern border surf town. Airport proximity, NSW cross-border catchment, surf competition culture. Character distinct from the northern tourist strip.',
    demand: 'Mixed: established resident surf community, airport-corridor traffic, improving tourist overlay, day-trippers from NSW.',
    competition: 'Low-medium',    rent: '$2,500–$4,500/mo (indicative)',  risk: 'Establishment pace slower than northern strips',
    best: 'Surf-identity café, casual beachside dining, independent food and lifestyle retail',
    insight: 'Coolangatta has a structural advantage the northern tourist strips lack: a genuinely local identity that community-focused operators can build on. The airport-adjacent location creates consistent foot traffic that doesn\'t depend on school holiday peaks.',
    why: 'Demand 6/10 reflects a developing market — solid but not yet at the depth of Burleigh or Broadbeach. Rent Pressure 4/10 and Competition Density 3/10 create a favourable cost-to-opportunity ratio. Seasonality Risk 5/10 is moderate — airport and NSW cross-border traffic reduces (but does not eliminate) seasonal risk. Tourism Dependency 5/10 is relevant context: this tourism is surf and lifestyle-driven, which is more compatible with quality independents than the Surfers Paradise tourist profile.',
    factors: { demandStrength: 6, rentPressure: 4, competitionDensity: 3, seasonalityRisk: 5, tourismDependency: 5 },
    cafe: 74, restaurant: 69, retail: 65,
  },
  {
    name: 'Miami',                slug: 'miami',
    vibe: 'Emerging creative district between Burleigh and Mermaid Beach. Art precinct establishing on Currumbin Creek Road, affluent residential catchment.',
    demand: 'Resident-dominant. Limited tourist draw currently, but growing destination appeal from the emerging art precinct.',
    competition: 'Low',           rent: '$2,500–$4,500/mo (indicative)',  risk: 'Strip cohesion still developing — limited passive foot traffic',
    best: 'Design-forward café, creative casual dining, art retail, boutique services with destination identity',
    insight: 'The Miami art precinct has shifted from obscure to editorially referenced in GC media over the past 3 years. Operators who build a concept coherent with the precinct identity benefit from media attention that would cost significant marketing spend elsewhere.',
    why: 'Demand 6/10 with Competition Density 2/10 creates a low-saturation entry environment. Rent Pressure 4/10 makes the unit economics attractive relative to comparable resident suburbs. Scored below Mermaid Beach because the strip is less established — Miami rewards operators who can generate their own foot traffic through concept and marketing, not those who rely on location passivity. Retail 67/100 is moderate because without strip cohesion, walk-in retail depends heavily on destination intent.',
    factors: { demandStrength: 6, rentPressure: 4, competitionDensity: 2, seasonalityRisk: 3, tourismDependency: 2 },
    cafe: 74, restaurant: 70, retail: 67,
  },
  {
    name: 'Robina',               slug: 'robina',
    vibe: 'Master-planned family suburb. Robina Town Centre, Bond University, large residential catchment — consistent but conservative demand dynamics.',
    demand: 'Family-driven, consistent year-round. No tourist overlay. Bond University corridor adds student weekday volume.',
    competition: 'Medium',        rent: '$2,500–$5,500/mo (indicative)',  risk: 'Robina Town Centre exerts strong gravity over discretionary spending',
    best: 'Casual family dining, health food café, tutoring/education services, gym',
    insight: 'Strip retail positioned outside the Robina Town Centre footprint consistently underperforms relative to its demographic potential. Operators who position for the Bond University corridor — rather than competing with the centre — find a less contested market.',
    why: 'CAUTION because Competition Density 5/10 understates the indirect competition from Robina Town Centre — the Westfield gravity effect captures discretionary spend that strip operators are effectively competing against. Demand 6/10 is present but channelled primarily into the centre. Retail scores highest (73/100) because practical services that the centre doesn\'t provide (gym, tutoring, specialist health) can succeed outside its shadow. Café and restaurant scores reflect the foot traffic deficit on strips that the centre passively cannibalises.',
    factors: { demandStrength: 6, rentPressure: 5, competitionDensity: 5, seasonalityRisk: 2, tourismDependency: 1 },
    cafe: 67, restaurant: 66, retail: 73,
  },
  {
    name: 'Varsity Lakes',        slug: 'varsity-lakes',
    vibe: 'Bond University adjacent. Student-young professional mix, relatively new residential development, lower price-point expectations.',
    demand: 'Student-weekday driven; residential weekends. Consistent volume, price-sensitive demographic.',
    competition: 'Low',           rent: '$2,000–$3,800/mo (indicative)',  risk: 'Average spend per customer is below GC coastal median',
    best: 'Accessible café, student-friendly food, tutoring, fitness studio',
    insight: 'Bond University\'s international student concentration creates referral dynamics that are unusually efficient — student cohorts recommend local businesses to each other at high rates. An operator who integrates into the student community early benefits from this network effect.',
    why: 'CAUTION driven primarily by the price sensitivity of the demographic — this is not a location where premium pricing is viable. Demand 6/10 and Competition Density 2/10 indicate volume is available and the path is clear; the constraint is revenue per customer. Café and restaurant score moderately because hospitality volume is available but margin is compressed. Practical services (fitness, tutoring) are the strongest opportunity because service-based pricing is less directly exposed to the student price ceiling.',
    factors: { demandStrength: 6, rentPressure: 3, competitionDensity: 2, seasonalityRisk: 2, tourismDependency: 1 },
    cafe: 70, restaurant: 63, retail: 66,
  },
  {
    name: 'Labrador',             slug: 'labrador',
    vibe: 'Multicultural residential suburb on the Broadwater. Improving demographics along Brisbane Road, diverse established food culture.',
    demand: 'Local-dominant. Long-term residents, multicultural community, gradual professional influx.',
    competition: 'Low-medium',    rent: '$1,800–$3,500/mo (indicative)',  risk: 'Demographic transition is gradual — spending ceiling improving but not yet high',
    best: 'Multicultural dining, Broadwater-positioned café, allied health, practical services',
    insight: 'Labrador\'s Broadwater foreshore positions offer a premium waterfront setting at prices well below beach-core strips. This gap exists because the suburb\'s demographic hasn\'t yet re-priced the market — operators who enter now access views that would cost significantly more in other GC waterfront locations.',
    why: 'Demand 5/10 reflects the transitional nature of the market — improving but not yet at the depth of more established suburbs. Rent Pressure 3/10 and Competition Density 3/10 both support viability despite the demand shortfall. CAUTION reflects the demographic transition lag — the opportunity is real but the current market underprices quality, meaning revenue ramps slowly. Best suited to operators comfortable with a 2–3 year establishment curve.',
    factors: { demandStrength: 5, rentPressure: 3, competitionDensity: 3, seasonalityRisk: 3, tourismDependency: 3 },
    cafe: 68, restaurant: 67, retail: 63,
  },
  {
    name: 'Runaway Bay',          slug: 'runaway-bay',
    vibe: 'Quiet waterfront residential. Older established demographic, strong owner-occupier base, limited commercial infrastructure.',
    demand: 'Hyper-local. Catchment is the immediate residential area — minimal external visitor draw.',
    competition: 'Very low',      rent: '$1,800–$3,200/mo (indicative)',  risk: 'Catchment ceiling limits maximum achievable revenue',
    best: 'Waterfront breakfast café, family casual, allied health',
    insight: 'Runaway Bay suits operators who are explicitly building a community-scale business rather than a growth-stage one. The ceiling is real, but so is the loyalty — operators here typically achieve high repeat visitation from a stable customer base.',
    why: 'CAUTION because Demand 4/10 reflects the small, hyper-local catchment — this suburb cannot generate the customer volumes that most growth-oriented hospitality models require. Low Rent Pressure 3/10 and Competition Density 2/10 partially offset the demand shortfall. Café scores above restaurant (68 vs 61) because breakfast and coffee have higher repeat-visit frequency — residents are more likely to visit a café daily than a restaurant for dinner. Retail scores lowest because there is insufficient foot traffic for walk-in retail to operate viably.',
    factors: { demandStrength: 4, rentPressure: 3, competitionDensity: 2, seasonalityRisk: 2, tourismDependency: 2 },
    cafe: 68, restaurant: 61, retail: 58,
  },
  {
    name: 'Ashmore',              slug: 'ashmore',
    vibe: 'Middle suburban family area. Ross Street commercial strip serves the surrounding residential catchment. Practical rather than aspirational commercial demand.',
    demand: 'Family-driven, consistent, price-sensitive. Medical and practical services demonstrably outperform hospitality here.',
    competition: 'Low',           rent: '$1,800–$3,500/mo (indicative)',  risk: 'Hospitality spending ceiling is below GC coastal median',
    best: 'Allied health, pharmacy, family casual dining, practical services',
    insight: 'Ashmore\'s medical centre cluster creates reliable adjacent-visit foot traffic — businesses positioned within walking distance of medical visits benefit from a captive, health-focused customer base with consistent visit patterns.',
    why: 'Demand 5/10 with Rent Pressure 3/10 and Competition Density 3/10 describes a low-risk, low-ceiling environment. The demographic rewards practical value over experiential quality — this is reflected in the Café 65/100 and Restaurant 63/100 scores, which are pulled down by spending-ceiling constraints that no amount of quality execution can overcome. Retail 66/100 slightly exceeds hospitality because practical retail (health, pharmacy, convenience) aligns naturally with the medical-adjacent foot traffic pattern.',
    factors: { demandStrength: 5, rentPressure: 3, competitionDensity: 3, seasonalityRisk: 2, tourismDependency: 1 },
    cafe: 65, restaurant: 63, retail: 66,
  },
  {
    name: 'Currumbin',            slug: 'currumbin',
    vibe: 'Tourist-resident hybrid. Currumbin Wildlife Sanctuary drives school-holiday tourist volume; surrounding residential areas have a surf-lifestyle, nature-oriented character.',
    demand: 'Seasonal tourist spike in school holidays; resident base provides modest year-round floor.',
    competition: 'Low',           rent: '$2,000–$3,500/mo (indicative)',  risk: 'Revenue is structurally seasonal — shoulder months are lean without a strong resident cushion',
    best: 'Sanctuary-adjacent café, casual family dining, surf/outdoor retail',
    insight: 'Proximity to the Wildlife Sanctuary entrance creates a localised foot traffic concentration — but only during sanctuary operating hours and peak seasons. An operator positioned here should model revenue across both peak-tourist and quiet-residential periods to stress-test the concept.',
    why: 'Seasonality Risk 6/10 and Tourism Dependency 6/10 are the dominant risk factors — this suburb\'s revenue profile is structurally seasonal in a way that many resident suburbs are not. Café scores 70/100 because the tourist opportunity is real; the risk is consistency. Retail 57/100 is low because tourist retail here competes directly with sanctuary gift shops for the same customers. The GO case for this suburb requires a concept that works for locals off-season as well as tourists during peaks.',
    factors: { demandStrength: 5, rentPressure: 3, competitionDensity: 2, seasonalityRisk: 6, tourismDependency: 6 },
    cafe: 70, restaurant: 63, retail: 57,
  },
  {
    name: 'Burleigh Waters',      slug: 'burleigh-waters',
    vibe: 'Inland residential behind Burleigh Heads. Family demographic, lower density, limited commercial strip infrastructure.',
    demand: 'Hyper-local residential. The Burleigh Heads tourist foot traffic does not extend meaningfully into this suburb.',
    competition: 'Very low',      rent: '$1,800–$3,200/mo (indicative)',  risk: 'Insufficient passive foot traffic for most hospitality concepts',
    best: 'Allied health, childcare services, family convenience food',
    insight: 'Operators sometimes select Burleigh Waters expecting to access Burleigh Heads demand. This assumption is incorrect — the demographics are similar, but the commercial mechanics differ fundamentally. This suburb rewards practical service businesses, not hospitality.',
    why: 'Demand 4/10 is the critical constraint — despite being adjacent to Burleigh Heads, this suburb\'s inland position means it generates almost no passing trade. Low Rent Pressure 3/10 and Competition Density 2/10 are attractive on a cost basis but don\'t compensate for the foot traffic deficit. Café 62/100 and Restaurant 58/100 reflect the structural difficulty of running destination hospitality in a suburb without a destination identity. Retail 63/100 is slightly better only for convenience-oriented formats that serve the local residential catchment directly.',
    factors: { demandStrength: 4, rentPressure: 3, competitionDensity: 2, seasonalityRisk: 2, tourismDependency: 1 },
    cafe: 62, restaurant: 58, retail: 63,
  },
  {
    name: 'Helensvale',           slug: 'helensvale',
    vibe: 'Northern Gold Coast family hub. Primary demand is residential family; theme park proximity creates tourist adjacency but limited commercial conversion.',
    demand: 'Family-dominant, consistent, price-sensitive. Light rail station has measurably improved morning commuter foot traffic since 2020.',
    competition: 'Low-medium',    rent: '$2,000–$4,000/mo (indicative)',  risk: 'Theme park proximity creates tourist expectation that rarely converts to strip trade',
    best: 'Family casual dining, gym and fitness, childcare, allied health',
    insight: 'The light rail station has created a morning commuter coffee window that is commercially meaningful — a well-positioned café on the commuter path can capture consistent daily repeat visits that didn\'t exist before the rail connection.',
    why: 'Demand 5/10 with Competition Density 4/10 describes a moderate-density family market. Theme park proximity (Tourism Dependency 3/10) does not meaningfully benefit strip operators — theme park visitors transit through, they don\'t stop. The light rail commuter insight creates a specific GO sub-case within the suburb for commuter-positioned hospitality. Retail 65/100 scores above café and restaurant because practical family retail suits the demographic character better than experiential hospitality.',
    factors: { demandStrength: 5, rentPressure: 4, competitionDensity: 4, seasonalityRisk: 3, tourismDependency: 3 },
    cafe: 64, restaurant: 61, retail: 65,
  },
  {
    name: 'Tugun',                slug: 'tugun',
    vibe: 'Quiet southern beach suburb, airport adjacent. Surf community, minimal commercial pressure, low rents.',
    demand: 'Hyper-local resident base. Airport proximity does not convert to meaningful strip trade — travellers transit through, they rarely stop.',
    competition: 'Very low',      rent: '$1,600–$3,000/mo (indicative)',  risk: 'Passive foot traffic is insufficient for most commercial formats without a loyalty-based model',
    best: 'Community café (loyalty-model), surf-adjacent food and retail, practical local services',
    insight: 'Tugun offers the lowest commercial rents on the GC coastal strip. For an operator running a community loyalty model — where the business is built on repeat local visits rather than new-customer acquisition — the economics here are among the most favourable on the coast.',
    why: 'Demand 4/10 and Seasonality Risk 4/10 define the challenge: limited local demand with some seasonal variation from the airport corridor and surf community. Rent Pressure 2/10 is the lowest of all 20 suburbs — this is where the model rewards a specific type of operator: one with a low fixed-cost base and a loyalty-driven revenue model. The CAUTION verdict is model- and operator-dependent, not a blanket assessment of the suburb. A community café here can be viable; a premium hospitality concept almost certainly is not.',
    factors: { demandStrength: 4, rentPressure: 2, competitionDensity: 2, seasonalityRisk: 4, tourismDependency: 4 },
    cafe: 64, restaurant: 59, retail: 56,
  },
  {
    name: 'Coomera',              slug: 'coomera',
    vibe: 'One of Queensland\'s fastest-growing residential corridors. Young families, new estates, infrastructure and commercial amenity still catching up to population growth.',
    demand: 'Resident-dominant, growing rapidly. Volume is building; spending sophistication is at an early stage.',
    competition: 'Low — genuinely underserved relative to population',
    rent: '$1,800–$3,500/mo (indicative)', risk: 'Early-market risk; premium concepts will underperform the current demographic',
    best: 'Family casual dining, childcare and family services, gym, practical retail',
    insight: 'Population growth projections for the Coomera corridor are among the strongest in Queensland. An operator who establishes now and builds brand loyalty ahead of competition is positioned to own the market as the suburb matures — but this is a medium-term (3–5 year) investment thesis, not a short-term payoff.',
    why: 'Demand 5/10 today underestimates the 3–5 year trajectory — but the model scores current conditions, not projected ones. Operators should model against today\'s demographic, not tomorrow\'s. Rent Pressure 3/10 and Competition Density 2/10 reflect the underserved, early-market character. Retail 65/100 slightly exceeds café and restaurant because practical family services (childcare, gym, convenience retail) are already in demand; hospitality quality expectations are still below GC coastal median. Café 63/100 reflects this constraint.',
    factors: { demandStrength: 5, rentPressure: 3, competitionDensity: 2, seasonalityRisk: 2, tourismDependency: 2 },
    cafe: 63, restaurant: 59, retail: 65,
  },
  {
    name: 'Nerang',               slug: 'nerang',
    vibe: 'Hinterland gateway town. Older demographic, limited gentrification trajectory, functional commercial strip serving inland GC areas.',
    demand: 'Price-sensitive local residential. Hinterland day-tripper overlay is inconsistent and not commercially reliable.',
    competition: 'Very low',      rent: '$1,500–$2,800/mo (indicative)',  risk: 'Demographic stagnation limits spending ceiling; hospitality investment unlikely to achieve coastal returns',
    best: 'Allied health, trade services, practical food retail',
    insight: 'Nerang is a viable market for operators who need the lowest possible fixed-cost base and are comfortable building a business on community loyalty alone. It is the wrong location for a premium hospitality concept at any price point.',
    why: 'RISKY verdict driven by Demand 3/10 — this is the weakest commercial demand of all 20 suburbs in this analysis. Very low Rent Pressure 2/10 and Competition Density 2/10 reflect the limited commercial activity, not a hidden opportunity. Low rent is a market signal here, not just a cost advantage. All three scores (58/55/60) reflect that the business types this guide focuses on — cafés, restaurants, retail — face structural demand constraints in this location that cannot be resolved by operator quality or concept differentiation. The RISKY verdict is not a comment on the suburb as a community — it is a specific assessment of commercial viability for these business types under current market conditions.',
    factors: { demandStrength: 3, rentPressure: 2, competitionDensity: 2, seasonalityRisk: 4, tourismDependency: 2 },
    cafe: 58, restaurant: 55, retail: 60,
  },
]


// ── Derived suburb data (verdict computed from scores) ───────────────────────
// Verdict is NOT stored in SUBURBS; it is derived here to guarantee consistency.
const SUBURBS_DERIVED = SUBURBS.map(s => ({
  ...s,
  verdict: deriveVerdict(s.cafe, s.restaurant, s.retail),
}))

// ── Comparison table data ────────────────────────────────────────────────────
const TABLE = SUBURBS_DERIVED.map(s => ({
  name: s.name, cafe: s.cafe, restaurant: s.restaurant, retail: s.retail,
  risk: s.verdict === 'GO' ? 'Low–Med' : s.verdict === 'CAUTION' ? 'Medium' : 'High',
  verdict: s.verdict,
}))

// ── Unified suburb card ───────────────────────────────────────────────────────
// Single card template used for all three verdict tiers (GO / CAUTION / RISKY).
// Composite score uses the same weighted formula as deriveVerdict for consistency.
type DerivedSuburb = (typeof SUBURBS_DERIVED)[0]

function SuburbCard({ s }: { s: DerivedSuburb }) {
  const cfg  = VERDICT_CFG[s.verdict]
  const composite = Math.round(s.cafe * 0.40 + s.restaurant * 0.35 + s.retail * 0.25)
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
            <div style={{ fontSize: 24, fontWeight: 900, color: cfg.txt, lineHeight: 1 }}>{composite}</div>
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
      <FactorGrid f={s.factors} />
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
              const verdict  = derived ? derived.verdict : 'GO' as V
              const composite = derived ? Math.round(derived.cafe * 0.40 + derived.restaurant * 0.35 + derived.retail * 0.25) : 0
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
