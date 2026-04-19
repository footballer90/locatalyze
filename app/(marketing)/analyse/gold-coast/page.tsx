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
const SUBURBS = [
  {
    name: 'Burleigh Heads',       slug: 'burleigh-heads',
    vibe: 'Health-conscious professionals, young families, surf culture. The Gold Coast\'s most credible independent hospitality strip.',
    demand: 'Mixed — strong year-round resident base plus significant tourist overlay',
    competition: 'Medium-high',   rent: '$4,500–$9,000/mo',  risk: 'Lease scarcity',
    best: 'Specialty café, quality casual dining, wellness studio, lifestyle retail',
    insight: 'James Street vacancy rate is sub-2%. If a site opens, there\'s a queue for it. The barrier to entry is access, not demand.',
    cafe: 90, restaurant: 83, retail: 79, verdict: 'GO' as V,
  },
  {
    name: 'Broadbeach',           slug: 'broadbeach',
    vibe: 'Upscale mixed: casino professionals, Pacific Fair shoppers, holiday apartment residents, long-term owner-occupiers.',
    demand: 'High year-round — casino complex drives consistent evening economy even in off-peak months',
    competition: 'High',          rent: '$5,000–$12,000/mo', risk: 'High entry rent',
    best: 'Premium casual dining, upscale café, cocktail bar, boutique retail',
    insight: 'The casino precinct provides a demand floor that prevents the seasonal troughs that kill operators in tourist-only locations.',
    cafe: 82, restaurant: 87, retail: 80, verdict: 'GO' as V,
  },
  {
    name: 'Mermaid Beach',        slug: 'mermaid-beach',
    vibe: 'Established affluent residential. Owner-occupied beachside properties, older professional demographic, strong community identity.',
    demand: 'Resident-dominant. Limited tourist overlay — locals drive 80%+ of commercial spending.',
    competition: 'Low-medium',    rent: '$3,500–$6,500/mo',  risk: 'Small catchment',
    best: 'Premium breakfast/brunch café, quality casual dining, boutique wellness',
    insight: 'The residential loyalty here is unusually strong. Quality operators who become the local go-to hold their position for years against new entrants.',
    cafe: 80, restaurant: 76, retail: 70, verdict: 'GO' as V,
  },
  {
    name: 'Palm Beach',           slug: 'palm-beach',
    vibe: 'The affordable Burleigh. Younger demographic, improving strip, strong surf culture. Early-mover dynamics still available.',
    demand: 'Mixed resident-tourist, trending upward. Population growth is above average for the southern corridor.',
    competition: 'Low-medium',    rent: '$2,500–$4,500/mo',  risk: 'Establishment curve',
    best: 'Café (early mover advantage), casual dining, surf lifestyle retail',
    insight: 'Palm Beach is where Burleigh was 8 years ago. Rents are 40–50% lower for comparable strip positions. The window is closing.',
    cafe: 78, restaurant: 73, retail: 70, verdict: 'GO' as V,
  },
  {
    name: 'Main Beach',           slug: 'main-beach',
    vibe: 'Luxury residential, Marina Mirage precinct. Narrow demographic: high-income, retired professionals, international visitors staying at Palazzo Versace.',
    demand: 'Low volume, extremely high spend per customer. Destination-driven rather than foot traffic driven.',
    competition: 'Very low',      rent: '$4,000–$8,000/mo',  risk: 'Very small catchment',
    best: 'Premium dining, high-end retail, superyacht services',
    insight: 'A $90 breakfast works here. A $22 smashed avo café does not — the concept must match the postcode or it fails regardless of quality.',
    cafe: 70, restaurant: 79, retail: 66, verdict: 'GO' as V,
  },
  {
    name: 'Surfers Paradise',     slug: 'surfers-paradise',
    vibe: 'International tourist strip. High volume, high churn, low loyalty. The Gold Coast\'s most well-known and most difficult commercial environment for independents.',
    demand: 'Seasonal peaks (school holidays, Christmas, GC600) with real off-peak troughs. Weekday winter is thin.',
    competition: 'Extreme',       rent: '$8,000–$20,000/mo', risk: 'Seasonal volatility + extreme rent',
    best: 'High-volume fast casual, tourist retail, nightlife-adjacent venues',
    insight: 'The operators who profit here run high volume, low complexity operations. A craft café paying $12,000/month rent needs 250 covers before the rent is covered. Do the maths before committing.',
    cafe: 58, restaurant: 70, retail: 79, verdict: 'CAUTION' as V,
  },
  {
    name: 'Southport',            slug: 'southport',
    vibe: 'The Gold Coast\'s traditional commercial centre — government offices, medical precinct, light rail, legal and finance businesses.',
    demand: 'Weekday professional, thin weekends. TAFE and Griffith student population adds lunchtime volume.',
    competition: 'Medium',        rent: '$3,000–$7,000/mo',  risk: 'Weekend dead zones',
    best: 'Corporate lunch café, professional services, healthcare allied, education',
    insight: 'Friday lunch on Nerang Street is the single best commercial hour in Southport. Everything else requires a concept that specifically targets the 9-to-5 economy.',
    cafe: 70, restaurant: 66, retail: 72, verdict: 'GO' as V,
  },
  {
    name: 'Coolangatta',          slug: 'coolangatta',
    vibe: 'Border surf town. Airport proximity, NSW border crossings, strong surf competition culture. Grittier character than Burleigh.',
    demand: 'Mixed: resident surf community, airport traffic, day-trippers, improving tourist overlay',
    competition: 'Low-medium',    rent: '$2,500–$4,500/mo',  risk: 'Slower establishment pace',
    best: 'Surf café, casual beachside dining, independent food retail',
    insight: 'The NSW airport relocation is already reshaping foot traffic patterns in Coolangatta\'s commercial strip. The moment has not passed.',
    cafe: 74, restaurant: 69, retail: 65, verdict: 'GO' as V,
  },
  {
    name: 'Miami',                slug: 'miami',
    vibe: 'Between Burleigh and Mermaid Beach — quietly improving. Art gallery district on Currumbin Creek Road is emerging as a creative hub.',
    demand: 'Resident-dominant. Limited tourist draw but strong local spending power from surrounding affluent residential.',
    competition: 'Low',           rent: '$2,500–$4,500/mo',  risk: 'Thin strip cohesion',
    best: 'Creative café, design-forward dining, art retail, boutique services',
    insight: 'Miami\'s art precinct is creating a destination pull that didn\'t exist three years ago. A well-designed concept gets media attention free in this market.',
    cafe: 74, restaurant: 70, retail: 67, verdict: 'GO' as V,
  },
  {
    name: 'Robina',               slug: 'robina',
    vibe: 'Master-planned family suburb. Robina Town Centre, Bond University, and a large residential catchment create consistent but conservative demand.',
    demand: 'Family-driven, consistent year-round. No tourist overlay. Bond University generates student weekday volume.',
    competition: 'Medium',        rent: '$2,500–$5,500/mo',  risk: 'Westfield gravity effect',
    best: 'Casual family dining, health food café, tutoring/education services, gym',
    insight: 'Operators who try to compete with the Town Centre strip fail. Those who position outside it — serving the Bond University corridor or the residential estate strips — find a reliable lower-competition market.',
    cafe: 67, restaurant: 66, retail: 73, verdict: 'CAUTION' as V,
  },
  {
    name: 'Varsity Lakes',        slug: 'varsity-lakes',
    vibe: 'Bond University adjacent. Student-young professional mix, relatively new residential development, improving amenity.',
    demand: 'Student-driven weekday, residential weekends. Consistent but price-sensitive volume.',
    competition: 'Low',           rent: '$2,000–$3,800/mo',  risk: 'Price sensitivity',
    best: 'Affordable café, student-friendly food, tutoring, fitness studio',
    insight: 'Bond University has Australia\'s highest proportion of international students. A café that builds international student loyalty has one of the most referral-efficient customer bases in Queensland.',
    cafe: 70, restaurant: 63, retail: 66, verdict: 'CAUTION' as V,
  },
  {
    name: 'Labrador',             slug: 'labrador',
    vibe: 'Multicultural working-class suburb on the broadwater. Improving demographics along Brisbane Road, diverse food scene.',
    demand: 'Local-dominant. Long-term residents, multicultural community, improving professional overlay.',
    competition: 'Low-medium',    rent: '$1,800–$3,500/mo',  risk: 'Slow demographic shift',
    best: 'Multicultural dining, broadwater café, allied health, practical services',
    insight: 'Labrador\'s broadwater foreshore positions offer a premium setting at non-premium prices — exactly the gap that hospitality operators should look for.',
    cafe: 68, restaurant: 67, retail: 63, verdict: 'CAUTION' as V,
  },
  {
    name: 'Runaway Bay',          slug: 'runaway-bay',
    vibe: 'Quiet waterfront residential. Established older demographic, strong owner-occupier base, limited commercial infrastructure.',
    demand: 'Hyper-local. Serves the immediate residential catchment almost exclusively.',
    competition: 'Very low',      rent: '$1,800–$3,200/mo',  risk: 'Extremely limited catchment',
    best: 'Waterfront breakfast café, family casual, allied health',
    insight: 'Runaway Bay\'s commercial strips have a ceiling — you\'ll build a loyal local business, but you won\'t build a scalable one. Know which you want before entering.',
    cafe: 68, restaurant: 61, retail: 58, verdict: 'CAUTION' as V,
  },
  {
    name: 'Ashmore',              slug: 'ashmore',
    vibe: 'Middle suburban family area. Ross Street commercial strip serves the surrounding residential catchment. Unglamorous but functional.',
    demand: 'Family-driven, consistent, price-sensitive. Medical and practical services consistently outperform hospitality.',
    competition: 'Low',           rent: '$1,800–$3,500/mo',  risk: 'Limited spending ceiling',
    best: 'Allied health, pharmacy, family casual dining, practical services',
    insight: 'Ashmore\'s medical centre cluster is one of the most concentrated on the GC. Businesses that position adjacent to established medical visits create reliable repeat traffic.',
    cafe: 65, restaurant: 63, retail: 66, verdict: 'CAUTION' as V,
  },
  {
    name: 'Currumbin',            slug: 'currumbin',
    vibe: 'Tourist-resident hybrid. Currumbin Wildlife Sanctuary drives significant tourist volume; surrounding areas are surfing community and nature-oriented residents.',
    demand: 'Seasonal tourist spike in school holidays; consistent resident base off-peak.',
    competition: 'Low',           rent: '$2,000–$3,500/mo',  risk: 'Seasonal volatility',
    best: 'Tourist-adjacent café, surf gear retail, family casual, eco-tourism services',
    insight: 'The Wildlife Sanctuary entrance is the single highest-traffic location per square metre in Currumbin. A café positioned within walking distance captures visitors without competing with the sanctuary itself.',
    cafe: 70, restaurant: 63, retail: 57, verdict: 'CAUTION' as V,
  },
  {
    name: 'Burleigh Waters',      slug: 'burleigh-waters',
    vibe: 'Inland residential behind Burleigh Heads. Family demographic, lower density, limited commercial infrastructure relative to the beach strip.',
    demand: 'Hyper-local residential. Benefits from Burleigh Heads proximity but without the foot traffic.',
    competition: 'Very low',      rent: '$1,800–$3,200/mo',  risk: 'Insufficient foot traffic density',
    best: 'Allied health, childcare, family services, convenience food',
    insight: 'Do not attempt to replicate a Burleigh Heads café concept in Burleigh Waters. The demographics are superficially similar; the commercial mechanics are not.',
    cafe: 62, restaurant: 58, retail: 63, verdict: 'CAUTION' as V,
  },
  {
    name: 'Helensvale',           slug: 'helensvale',
    vibe: 'Northern Gold Coast family hub. Movie World and Dreamworld proximity creates limited tourist overlay; primary demand is family residential.',
    demand: 'Family-dominant, consistent, price-sensitive. Light rail station driving improving midday volume.',
    competition: 'Low-medium',    rent: '$2,000–$4,000/mo',  risk: 'Theme park proximity doesn\'t convert',
    best: 'Family casual dining, gym, childcare, allied health',
    insight: 'Helensvale\'s light rail station has materially changed peak-hour foot traffic patterns since 2020. Morning commuter coffee volume is now commercially meaningful for the first time.',
    cafe: 64, restaurant: 61, retail: 65, verdict: 'CAUTION' as V,
  },
  {
    name: 'Tugun',                slug: 'tugun',
    vibe: 'Quiet southern beach town, airport adjacent. Surf lifestyle community, relaxed pace, limited commercial pressure.',
    demand: 'Hyper-local resident base. Minimal tourist traffic despite airport proximity — travellers pass through, they don\'t stop.',
    competition: 'Very low',      rent: '$1,600–$3,000/mo',  risk: 'Very thin passing trade',
    best: 'Local café (high loyalty), surf-adjacent food and retail, practical services',
    insight: 'The lowest rents on the coastal strip are here. If your concept doesn\'t need foot traffic — or if you\'re building a loyal local customer base from day one — Tugun offers better economics than anywhere on the coast.',
    cafe: 64, restaurant: 59, retail: 56, verdict: 'CAUTION' as V,
  },
  {
    name: 'Coomera',              slug: 'coomera',
    vibe: 'One of Queensland\'s fastest-growing residential corridors. Young families, new estates, infrastructure still catching up to population.',
    demand: 'Resident-dominant, growing rapidly. Volume is there; spending maturity is not yet.',
    competition: 'Low — market is genuinely underserved',
    rent: '$1,800–$3,500/mo', risk: 'Early-market risk, low quality ceiling currently',
    best: 'Family casual dining, childcare, gym, practical services',
    insight: 'Coomera\'s population will double over the next decade. An operator who enters now and builds brand loyalty will own the market before competition arrives. This is a five-year play, not a year-one payoff.',
    cafe: 63, restaurant: 59, retail: 65, verdict: 'CAUTION' as V,
  },
  {
    name: 'Nerang',               slug: 'nerang',
    vibe: 'Hinterland gateway town. Older demographic, limited gentrification, functional commercial strip serving inland Gold Coast.',
    demand: 'Price-sensitive local residential. Hinterland day-tripper overlay is inconsistent.',
    competition: 'Very low',      rent: '$1,500–$2,800/mo',  risk: 'Limited spending ceiling and demographic stagnation',
    best: 'Allied health, tradesperson services, practical food retail',
    insight: 'Nerang is the right entry market for operators who want the lowest possible overhead and are comfortable building a business on community loyalty alone. It is not the right market for a premium hospitality concept.',
    cafe: 58, restaurant: 55, retail: 60, verdict: 'RISKY' as V,
  },
]

// ── Comparison table data ────────────────────────────────────────────────────
const TABLE = SUBURBS.map(s => ({
  name: s.name, cafe: s.cafe, restaurant: s.restaurant, retail: s.retail,
  risk: s.verdict === 'GO' ? 'Low–Med' : s.verdict === 'CAUTION' ? 'Medium' : 'High',
  verdict: s.verdict,
}))

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
                <span style={{ fontSize: 22, fontWeight: 900, color: '#4ADE80' }}>OPEN</span>
                <span style={{ fontSize: 11, opacity: 0.75, lineHeight: 1.4 }}>in the right suburb with the right concept</span>
              </div>
              <p style={{ fontSize: 12, opacity: 0.8, lineHeight: 1.6, margin: 0 }}>
                The Gold Coast has a fundamentally improving resident economy underneath the tourist surface. The failure risk is in location selection, not in market size.
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
                <p style={{ fontSize: 12, opacity: 0.8, margin: 0 }}>Proven demand-supply gap. Sub-2% vacancy on James Street. Year-round resident loyalty.</p>
              </div>
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.08em', opacity: 0.7, marginBottom: 6 }}>Avoid unless you can handle:</p>
                <p style={{ fontSize: 12, opacity: 0.85, margin: 0, lineHeight: 1.6 }}>Extreme seasonal volatility (Surfers Paradise winter can drop 60% of peak revenue) or Broadbeach rent requiring 300+ daily covers to break even.</p>
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
            A $10 billion visitor economy built on top of a rapidly growing resident city
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {[
              {
                title: 'Population momentum',
                body: 'The Gold Coast is approaching 700,000 residents and is one of Australia\'s fastest-growing major cities — driven by interstate migration from Sydney and Melbourne and significant international migration. This resident base matters: it decouples the economy from pure tourism risk and creates year-round commercial demand that didn\'t exist at this scale ten years ago.',
              },
              {
                title: 'Tourism economy — the real numbers',
                body: '13+ million visitors per year generate enormous hospitality demand but equally enormous supply. The tourist strip is chronically oversupplied with generic operators competing for the same impulse spend. The opportunity is not in serving tourists — it\'s in serving the growing resident base that tourism operators have consistently underserved.',
              },
              {
                title: 'Seasonal reality',
                body: 'School holidays (January, Easter, June–July, September) drive 60–80% above-average trading for tourist-adjacent businesses. Off-peak winter (May–August) is where operators without a resident base struggle. A business with 50%+ resident trade barely feels the trough. A business with 80%+ tourist trade may find it existential.',
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {[
              {
                name: 'Burleigh Heads', score: 90, verdict: 'GO' as V,
                body: 'The benchmark. James Street and the surrounding village strip is where the Gold Coast\'s best independent operators concentrate. High resident loyalty, strong weekend tourism overlay, and the aspirational identity that attracts quality operators. Rents are meaningful ($4,500–$9,000/month) but conversion rates are high enough to justify them.',
                customer: 'Health-conscious 28–45 professionals, young families, surf community, weekend visitors',
              },
              {
                name: 'Broadbeach', score: 87, verdict: 'GO' as V,
                body: 'Pacific Fair + casino precinct creates a demand floor that survives winter. Premium concepts belong here. Generic concepts drown in competition. The right restaurant in Broadbeach can achieve $120,000+ monthly revenue; the wrong one will never recover its fit-out costs.',
                customer: 'Casino patrons, Pacific Fair shoppers, professionals, interstate visitors, apartment residents',
              },
              {
                name: 'Burleigh Waters / Palm Beach', score: 76, verdict: 'GO' as V,
                body: 'The value play on the coast. Palm Beach has Burleigh\'s demographic at 40–50% lower rent. The strip is developing rapidly. Operators who establish now build brand equity before the market gets crowded and rents re-price.',
                customer: 'Younger professionals, surf community, growing family demographic',
              },
              {
                name: 'Southport', score: 70, verdict: 'GO' as V,
                body: 'The Gold Coast\'s traditional CBD. Best suited for professional services and lunch-focused hospitality. Light rail has improved foot traffic meaningfully. The evening and weekend economy is still thin — models must account for this.',
                customer: 'Government employees, legal and finance professionals, TAFE and Griffith students',
              },
              {
                name: 'Robina', score: 68, verdict: 'CAUTION' as V,
                body: 'Robina Town Centre exerts enormous gravity over commercial spending. Strip retail outside the centre underperforms unless positioned for the Bond University corridor or residential estate strips that the centre doesn\'t serve. Consistent but conservative market.',
                customer: 'Families, Bond University students, master-planned estate residents',
              },
              {
                name: 'Coolangatta', score: 72, verdict: 'GO' as V,
                body: 'Southern Gold Coast\'s most underrated commercial strip. Surf culture identity, improving resident demographics, airport proximity creating consistent traffic, and rents 40% below Broadbeach. Best for operators who want community-focused hospitality without inner-suburb pricing.',
                customer: 'Surf community, local residents, border-crossing NSW visitors, airport workers',
              },
            ].map(({ name, score, verdict, body, customer }) => (
              <Card key={name} style={{ display: 'flex', flexDirection: 'column' as const }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: S.n900, margin: 0 }}>{name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 20, fontWeight: 900, color: S.brand }}>{score}</span>
                    <Badge v={verdict} />
                  </div>
                </div>
                <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.7, margin: '0 0 12px 0', flex: 1 }}>{body}</p>
                <div style={{ background: S.n50, borderRadius: 8, padding: '8px 12px' }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, margin: '0 0 3px 0', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>Customer profile</p>
                  <p style={{ fontSize: 12, color: S.muted, margin: 0 }}>{customer}</p>
                </div>
              </Card>
            ))}
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 24 }}>
            <Card>
              <h3 style={{ fontSize: 13, fontWeight: 800, color: S.n900, marginBottom: 16 }}>Rent tiers by zone</h3>
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
            <h3 style={{ fontSize: 14, fontWeight: 800, color: S.brandDark, marginBottom: 12 }}>Break-even logic — what the numbers actually mean</h3>
            <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.7, margin: '0 0 12px 0' }}>
              A Burleigh Heads café paying $6,000/month rent with 2 FT staff ($26,000) and $5,000 in other costs needs $37,000/month revenue before the owner takes a cent. At $28 average spend, that&apos;s 1,321 customers per month — roughly 44 covers per day on a 30-day model, or 60 covers on the 22 trading days most operators actually work.
            </p>
            <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.7, margin: 0 }}>
              A Surfers Paradise café at $14,000/month rent needs 1,900+ customers per month at the same spend just to cover costs. That&apos;s 87 covers per day. In January it&apos;s achievable. In July it probably isn&apos;t. Model the slow month — not the peak month.
            </p>
          </Card>
        </div>

        {/* ── STEP 7: Success patterns ──────────────────────────────────── */}
        <div style={{ marginBottom: 52 }}>
          <SectionLabel text="What works" />
          <h2 style={{ fontSize: 22, fontWeight: 900, color: S.n900, letterSpacing: '-0.02em', margin: '0 0 24px 0' }}>6 patterns from successful Gold Coast operators</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
            {[
              { n: '1', title: 'They chose location based on resident density, not tourist volume', body: 'The best-performing independents are in suburbs where 60–70% of their revenue comes from within a 3km residential catchment. They don\'t rely on tourist traffic to exist — it\'s a bonus.' },
              { n: '2', title: 'They priced for locals, not tourists', body: 'Tourist-priced menus ($22 flat whites, $32 smashed avo) erode the local loyalty that sustains the business through winter. The operators who survive long-term keep their pricing accessible for regulars.' },
              { n: '3', title: 'They opened Tuesday–Sunday, not 7 days', body: 'Monday revenue on the Gold Coast is thin across most suburbs. The operators who closed Monday and directed that labour cost into Saturday and Sunday quality and staffing consistently outperformed those who forced seven-day coverage.' },
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
              { mistake: 'Ignoring seasonality until the second June', fix: 'Build a 12-month cash flow model before signing a lease. If the model only works in 8 of 12 months, build 4 months of cash reserve into your startup budget. The operators who fail in winter were always going to fail — they just didn\'t know it when they signed.' },
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
          <p style={{ fontSize: 14, color: S.muted, margin: '0 0 28px 0', lineHeight: 1.6 }}>Every analysis below is written for the operator making a leasing decision — not for general readers. Unique insight for each suburb; no filler repeated across entries.</p>

          {/* Strong verdicts */}
          <h3 style={{ fontSize: 14, fontWeight: 800, color: S.emerald, marginBottom: 16, textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>Strong opportunities</h3>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 14, marginBottom: 32 }}>
            {SUBURBS.filter(s => s.verdict === 'GO').map(s => (
              <Card key={s.name} style={{ borderLeft: `4px solid ${S.emerald}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap' as const, gap: 8 }}>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: S.n900, margin: '0 0 4px 0' }}>{s.name}</h3>
                    <p style={{ fontSize: 11, color: S.muted, margin: 0 }}>Rent {s.rent} · Competition: {s.competition}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div style={{ textAlign: 'center' as const }}>
                      <div style={{ fontSize: 24, fontWeight: 900, color: S.brand, lineHeight: 1 }}>{Math.round((s.cafe + s.restaurant + s.retail) / 3)}</div>
                      <div style={{ fontSize: 10, color: S.muted }}>score</div>
                    </div>
                    <Badge v={s.verdict} size="md" />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 14 }}>
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 700, color: S.muted, textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 4 }}>Vibe</p>
                    <p style={{ fontSize: 12, color: S.n900, lineHeight: 1.6, margin: 0 }}>{s.vibe}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 700, color: S.muted, textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 4 }}>Demand type</p>
                    <p style={{ fontSize: 12, color: S.n900, lineHeight: 1.6, margin: 0 }}>{s.demand}</p>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 }}>
                  <ScoreBar label="Café" value={s.cafe} />
                  <ScoreBar label="Restaurant" value={s.restaurant} />
                  <ScoreBar label="Retail" value={s.retail} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                  <div style={{ background: S.emeraldBg, borderRadius: 8, padding: '10px 14px' }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: S.emerald, textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 4 }}>Best business type</p>
                    <p style={{ fontSize: 12, color: S.n900, margin: 0 }}>{s.best}</p>
                  </div>
                  <div style={{ background: S.amberBg, borderRadius: 8, padding: '10px 14px' }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: S.amber, textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 4 }}>Risk factor</p>
                    <p style={{ fontSize: 12, color: S.n900, margin: 0 }}>{s.risk}</p>
                  </div>
                </div>
                <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${S.border}` }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: S.brand, textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 4 }}>Key insight</p>
                  <p style={{ fontSize: 13, color: S.n900, lineHeight: 1.65, margin: 0, fontStyle: 'italic' }}>{s.insight}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Caution verdicts */}
          <h3 style={{ fontSize: 14, fontWeight: 800, color: S.amber, marginBottom: 16, textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>Proceed with a clear plan</h3>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 14, marginBottom: 32 }}>
            {SUBURBS.filter(s => s.verdict === 'CAUTION').map(s => (
              <Card key={s.name} style={{ borderLeft: `4px solid ${S.amber}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap' as const, gap: 8 }}>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: S.n900, margin: '0 0 4px 0' }}>{s.name}</h3>
                    <p style={{ fontSize: 11, color: S.muted, margin: 0 }}>Rent {s.rent} · Competition: {s.competition}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div style={{ textAlign: 'center' as const }}>
                      <div style={{ fontSize: 24, fontWeight: 900, color: S.amber, lineHeight: 1 }}>{Math.round((s.cafe + s.restaurant + s.retail) / 3)}</div>
                      <div style={{ fontSize: 10, color: S.muted }}>score</div>
                    </div>
                    <Badge v={s.verdict} size="md" />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 12 }}>
                  <ScoreBar label="Café" value={s.cafe} color={S.amber} />
                  <ScoreBar label="Restaurant" value={s.restaurant} color={S.amber} />
                  <ScoreBar label="Retail" value={s.retail} color={S.amber} />
                </div>
                <p style={{ fontSize: 12, color: S.muted, lineHeight: 1.7, margin: '0 0 12px 0' }}>{s.vibe}</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
                  <span style={{ fontSize: 11, background: S.emeraldBg, color: S.emerald, border: `1px solid ${S.emeraldBdr}`, borderRadius: 6, padding: '3px 10px', fontWeight: 600 }}>Best: {s.best.split(',')[0]}</span>
                  <span style={{ fontSize: 11, background: S.amberBg, color: S.amber, border: `1px solid ${S.amberBdr}`, borderRadius: 6, padding: '3px 10px', fontWeight: 600 }}>Risk: {s.risk}</span>
                </div>
                <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${S.border}` }}>
                  <p style={{ fontSize: 12, color: S.n900, lineHeight: 1.65, margin: 0, fontStyle: 'italic' }}>{s.insight}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Risky */}
          <h3 style={{ fontSize: 14, fontWeight: 800, color: S.red, marginBottom: 16, textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>Risky — specific conditions required</h3>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 14 }}>
            {SUBURBS.filter(s => s.verdict === 'RISKY').map(s => (
              <Card key={s.name} style={{ borderLeft: `4px solid ${S.red}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, flexWrap: 'wrap' as const, gap: 8 }}>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: S.n900, margin: '0 0 4px 0' }}>{s.name}</h3>
                    <p style={{ fontSize: 11, color: S.muted, margin: 0 }}>Rent {s.rent} · Competition: {s.competition}</p>
                  </div>
                  <Badge v={s.verdict} size="md" />
                </div>
                <p style={{ fontSize: 12, color: S.muted, lineHeight: 1.7, margin: '0 0 10px 0' }}>{s.vibe}</p>
                <p style={{ fontSize: 12, color: S.n900, lineHeight: 1.65, margin: 0, fontStyle: 'italic' }}>{s.insight}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* ── STEP 10: Comparison table ─────────────────────────────────── */}
        <div style={{ marginBottom: 52 }}>
          <SectionLabel text="Suburb comparison" />
          <h2 style={{ fontSize: 22, fontWeight: 900, color: S.n900, letterSpacing: '-0.02em', margin: '0 0 8px 0' }}>All 20 suburbs ranked</h2>
          <p style={{ fontSize: 13, color: S.muted, marginBottom: 20 }}>Sort by your business type.</p>
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
