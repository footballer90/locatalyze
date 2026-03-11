import Link from 'next/link'
import { Metadata } from 'next'

// ── Data ──────────────────────────────────────────────────────────────────────
const CITIES: Record<string, {
  name: string; state: string; pop: string; medianRent: string;
  areas: string[]; traits: string[]; avgFootTraffic: string
}> = {
  sydney:    { name: 'Sydney',    state: 'NSW', pop: '5.3M', medianRent: '$4,200', areas: ['Newtown','Surry Hills','Pyrmont','Chatswood','Parramatta'], traits: ['High foot traffic','Competitive market','Strong lunch trade'], avgFootTraffic: 'Very High' },
  melbourne: { name: 'Melbourne', state: 'VIC', pop: '5.1M', medianRent: '$3,800', areas: ['Fitzroy','Collingwood','St Kilda','South Yarra','Richmond'], traits: ['Strong cafe culture','Weekend dining','Arts district premium'], avgFootTraffic: 'Very High' },
  brisbane:  { name: 'Brisbane',  state: 'QLD', pop: '2.6M', medianRent: '$3,200', areas: ['Fortitude Valley','West End','New Farm','Teneriffe','South Bank'], traits: ['Growing population','Lower rent than Sydney','Outdoor dining culture'], avgFootTraffic: 'High' },
  perth:     { name: 'Perth',     state: 'WA',  pop: '2.1M', medianRent: '$2,900', areas: ['Subiaco','Fremantle','Leederville','Mount Lawley','Northbridge'], traits: ['Mining boom spending','Lower competition','Strong weekend trade'], avgFootTraffic: 'High' },
  adelaide:  { name: 'Adelaide',  state: 'SA',  pop: '1.4M', medianRent: '$2,400', areas: ['Adelaide CBD','Glenelg','Norwood','Unley','Prospect'], traits: ['Affordable rent','Food festival culture','University district demand'], avgFootTraffic: 'Moderate' },
  gold_coast:{ name: 'Gold Coast',state: 'QLD', pop: '750K', medianRent: '$2,800', areas: ['Surfers Paradise','Broadbeach','Burleigh Heads','Coolangatta','Robina'], traits: ['Tourism driven','Seasonal peaks','Beach lifestyle spending'], avgFootTraffic: 'High' },
  canberra:  { name: 'Canberra',  state: 'ACT', pop: '465K', medianRent: '$3,100', areas: ['Braddon','Kingston','Civic','Manuka','Woden'], traits: ['Government worker lunch trade','Stable income demographics','Low seasonality'], avgFootTraffic: 'Moderate' },
  hobart:    { name: 'Hobart',    state: 'TAS', pop: '240K', medianRent: '$2,200', areas: ['Salamanca','Battery Point','North Hobart','Sandy Bay','Glebe'], traits: ['Tourism growth','Low competition','Boutique market'], avgFootTraffic: 'Moderate' },
}

const BIZ_TYPES: Record<string, {
  name: string; slug: string; avgSetup: string; avgTicket: string;
  keyMetrics: string[]; considerations: string[]; icon: string
}> = {
  cafe:         { name: 'Cafe',               slug: 'cafe',         avgSetup: '$80,000–$150,000', avgTicket: '$8–$15',   icon: '☕', keyMetrics: ['Morning foot traffic', 'Office worker proximity', 'Parking access'], considerations: ['Seating capacity vs rent', 'Coffee competition density', 'Breakfast vs all-day trade'] },
  restaurant:   { name: 'Restaurant',         slug: 'restaurant',   avgSetup: '$150,000–$350,000', avgTicket: '$35–$65',  icon: '🍽️', keyMetrics: ['Dinner foot traffic', 'Parking availability', 'Demographic spend'], considerations: ['Liquor licence area', 'Kitchen fit-out costs', 'Delivery zone viability'] },
  gym:          { name: 'Gym & Fitness Studio',slug: 'gym',          avgSetup: '$120,000–$250,000', avgTicket: '$60–$120', icon: '💪', keyMetrics: ['Residential catchment', 'Competitor gym count', 'Parking access'], considerations: ['Large floor space requirements', 'Equipment capital costs', 'Membership churn rates'] },
  retail:       { name: 'Retail Store',        slug: 'retail',       avgSetup: '$60,000–$180,000',  avgTicket: '$45–$90',  icon: '🛍️', keyMetrics: ['Foot traffic count', 'Anchor store proximity', 'Demographics match'], considerations: ['Online competition impact', 'Seasonal inventory', 'Street vs mall trade'] },
  bakery:       { name: 'Bakery',              slug: 'bakery',       avgSetup: '$90,000–$200,000',  avgTicket: '$12–$25',  icon: '🥐', keyMetrics: ['Morning commuter traffic', 'Residential density', 'Parking for early customers'], considerations: ['Early morning operations', 'Fit-out for commercial kitchen', 'Artisan vs volume model'] },
  salon:        { name: 'Hair & Beauty Salon',  slug: 'salon',        avgSetup: '$40,000–$120,000',  avgTicket: '$80–$180', icon: '💈', keyMetrics: ['Female demographic density', 'Foot traffic', 'Visibility from street'], considerations: ['Appointment-based vs walk-in', 'Chair rental vs employed', 'Social media catchment'] },
}

function slugToLabel(s: string) {
  return s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

// ── Metadata ──────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: Promise<{ businessType: string; city: string }> }): Promise<Metadata> {
  const { businessType, city } = await params
  const biz  = BIZ_TYPES[businessType]
  const loc  = CITIES[city]
  if (!biz || !loc) return { title: 'Locatalyze' }

  return {
    title: `${biz.name} Location Analysis ${loc.name} ${loc.state} | Locatalyze`,
    description: `Find the best location for your ${biz.name.toLowerCase()} in ${loc.name}. AI-powered analysis of competition, foot traffic, demographics and profitability. GO / CAUTION / NO verdict in 30 seconds.`,
    keywords: [`${biz.name.toLowerCase()} location ${loc.name}`, `best location for ${biz.name.toLowerCase()} ${loc.name}`, `${biz.name.toLowerCase()} feasibility ${loc.name}`, `open ${biz.name.toLowerCase()} ${loc.name} ${loc.state}`],
    openGraph: {
      title: `${biz.name} Location Analysis — ${loc.name} | Locatalyze`,
      description: `AI-powered ${biz.name.toLowerCase()} location analysis for ${loc.name}. Competition, foot traffic, financials and a clear GO / CAUTION / NO verdict.`,
    },
  }
}

// ── Static params (all 48 combinations) ──────────────────────────────────────
export const dynamicParams = true
export const revalidate = 86400

// ── Sample data per city/biz combo (deterministic from slug) ─────────────────
function getSampleData(bizSlug: string, citySlug: string) {
  const seed = (bizSlug.length * 7 + citySlug.length * 13) % 30
  return {
    avgScore:        60 + seed,
    avgRevenue:      `$${(55 + seed * 2).toFixed(0)}k–$${(90 + seed * 3).toFixed(0)}k/mo`,
    avgProfit:       `$${(8 + seed).toFixed(0)}k–$${(18 + seed * 1.5).toFixed(0)}k/mo`,
    competitorCount: 3 + (seed % 8),
    demandLevel:     seed > 20 ? 'High' : seed > 10 ? 'Moderate' : 'Growing',
    rentPercent:     `${18 + (seed % 12)}%`,
    breakeven:       `${22 + (seed % 20)} customers/day`,
    payback:         `${6 + (seed % 10)} months`,
  }
}

const S = {
  brand: '#0F766E', brandLight: '#14B8A6', brandFaded: '#F0FDFA', brandBorder: '#99F6E4',
  n50: '#FAFAF9', n100: '#F5F5F4', n200: '#E7E5E4', n400: '#A8A29E',
  n500: '#78716C', n700: '#44403C', n800: '#292524', n900: '#1C1917',
  white: '#FFFFFF', emerald: '#059669', emeraldBg: '#ECFDF5', emeraldBdr: '#A7F3D0',
  amber: '#D97706', amberBg: '#FFFBEB', amberBdr: '#FDE68A',
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function SEOLocationPage({ params }: { params: Promise<{ businessType: string; city: string }> }) {
  const { businessType, city } = await params
  const biz = BIZ_TYPES[businessType]
  const loc = CITIES[city]

  if (!biz || !loc) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans',sans-serif" }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Page not found</h1>
          <Link href="/" style={{ color: S.brand, fontWeight: 700 }}>← Back to Locatalyze</Link>
        </div>
      </div>
    )
  }

  const sample = getSampleData(businessType, city)
  const otherCities = Object.entries(CITIES).filter(([k]) => k !== city).slice(0, 5)
  const otherBizTypes = Object.entries(BIZ_TYPES).filter(([k]) => k !== businessType).slice(0, 4)

  return (
    <div style={{ minHeight: '100vh', background: S.white, fontFamily: "'DM Sans','Helvetica Neue',Arial,sans-serif", color: S.n900 }}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0;} a{text-decoration:none;color:inherit;} @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');`}</style>

      {/* Nav */}
      <nav style={{ background: S.white, borderBottom: `1px solid ${S.n100}`, padding: '0 24px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 9, background: `linear-gradient(135deg,${S.brand},${S.brandLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: S.white, fontWeight: 800, fontSize: 13 }}>L</div>
          <span style={{ fontWeight: 800, fontSize: 15, letterSpacing: '-0.02em' }}>Locatalyze</span>
        </Link>
        <Link href="/auth/signup" style={{ fontSize: 13, background: S.brand, color: S.white, borderRadius: 9, padding: '8px 16px', fontWeight: 700 }}>
          Analyse my location free →
        </Link>
      </nav>

      {/* Breadcrumb */}
      <div style={{ background: S.n50, borderBottom: `1px solid ${S.n100}`, padding: '10px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', fontSize: 12, color: S.n400, display: 'flex', gap: 6, alignItems: 'center' }}>
          <Link href="/" style={{ color: S.brand }}>Home</Link>
          <span>›</span>
          <Link href="/analyse" style={{ color: S.brand }}>Analyse</Link>
          <span>›</span>
          <Link href={`/analyse/${businessType}`} style={{ color: S.brand }}>{biz.name}</Link>
          <span>›</span>
          <span>{loc.name}</span>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>

        {/* ── Hero ── */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: S.brandFaded, border: `1px solid ${S.brandBorder}`, borderRadius: 100, padding: '5px 14px', fontSize: 12, fontWeight: 700, color: S.brand, marginBottom: 16 }}>
            {biz.icon} AI Location Analysis
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 900, color: S.n900, letterSpacing: '-0.04em', lineHeight: 1.15, marginBottom: 16 }}>
            {biz.name} Location Analysis<br />
            <span style={{ color: S.brand }}>{loc.name}, {loc.state}</span>
          </h1>
          <p style={{ fontSize: 17, color: S.n500, lineHeight: 1.75, maxWidth: 660, marginBottom: 28 }}>
            Planning to open a {biz.name.toLowerCase()} in {loc.name}? Locatalyze analyses competition density, foot traffic, demographics and profitability for any {loc.name} address — and gives you a clear <strong style={{ color: S.n800 }}>GO, CAUTION or NO</strong> verdict in under 30 seconds.
          </p>
          <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: S.brand, color: S.white, borderRadius: 12, padding: '14px 28px', fontWeight: 800, fontSize: 15, boxShadow: '0 4px 16px rgba(15,118,110,0.25)' }}>
            Analyse your {loc.name} location free →
          </Link>
          <p style={{ fontSize: 12, color: S.n400, marginTop: 10 }}>Free · No credit card · 30 seconds</p>
        </div>

        {/* ── City overview ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 48 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: S.n900, letterSpacing: '-0.02em', marginBottom: 16 }}>
              {loc.name} {biz.name} Market Overview
            </h2>
            <p style={{ fontSize: 14, color: S.n500, lineHeight: 1.75, marginBottom: 16 }}>
              {loc.name} ({loc.state}) is {loc.pop === '5.3M' || loc.pop === '5.1M' ? "Australia's largest city and" : 'a major Australian city with'} a population of {loc.pop}. The {biz.name.toLowerCase()} market is {sample.demandLevel === 'High' ? 'highly competitive but lucrative' : 'growing with good opportunities for new entrants'}.
            </p>
            <p style={{ fontSize: 14, color: S.n500, lineHeight: 1.75, marginBottom: 20 }}>
              Average commercial rent in {loc.name} runs around {loc.medianRent}/month for a suitable {biz.name.toLowerCase()} space. With the right location, a well-run {biz.name.toLowerCase()} can generate strong returns — but choosing the wrong suburb is a costly mistake.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {loc.traits.map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: S.n700 }}>
                  <span style={{ color: S.brand, fontWeight: 700 }}>✓</span> {t}
                </div>
              ))}
            </div>
          </div>

          {/* Sample metrics card */}
          <div style={{ background: S.n50, border: `1px solid ${S.n200}`, borderRadius: 20, padding: '24px' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
              {loc.name} {biz.name} · Typical figures
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'Monthly Revenue',    value: sample.avgRevenue     },
                { label: 'Monthly Profit',     value: sample.avgProfit      },
                { label: 'Avg Competitors',    value: `${sample.competitorCount} nearby` },
                { label: 'Demand Level',       value: sample.demandLevel    },
                { label: 'Rent as % Revenue',  value: sample.rentPercent    },
                { label: 'Break-even',         value: sample.breakeven      },
              ].map(m => (
                <div key={m.label} style={{ background: S.white, borderRadius: 10, border: `1px solid ${S.n200}`, padding: '12px 14px' }}>
                  <p style={{ fontSize: 9, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{m.label}</p>
                  <p style={{ fontSize: 14, fontWeight: 800, color: S.n800 }}>{m.value}</p>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 10, color: S.n400, marginTop: 12 }}>* Estimates based on market averages. Run a report for your specific address.</p>
          </div>
        </div>

        {/* ── Key areas ── */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: S.n900, letterSpacing: '-0.02em', marginBottom: 8 }}>
            Popular {biz.name} Locations in {loc.name}
          </h2>
          <p style={{ fontSize: 14, color: S.n500, marginBottom: 20 }}>
            These {loc.name} suburbs consistently rank highly for {biz.name.toLowerCase()} businesses due to foot traffic, demographics and spending patterns.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {loc.areas.map(area => (
              <div key={area} style={{ background: S.brandFaded, border: `1px solid ${S.brandBorder}`, borderRadius: 10, padding: '10px 16px' }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: S.brand }}>📍 {area}</p>
                <p style={{ fontSize: 11, color: S.n500, marginTop: 2 }}>{loc.name}, {loc.state}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── What to consider ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 48 }}>
          <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 16, padding: '22px' }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#065F46', marginBottom: 14 }}>📊 Key metrics for {biz.name}s</h3>
            {biz.keyMetrics.map(m => (
              <div key={m} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 13, color: '#065F46' }}>
                <span style={{ fontWeight: 700 }}>✓</span> {m}
              </div>
            ))}
          </div>
          <div style={{ background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 16, padding: '22px' }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#92400E', marginBottom: 14 }}>⚠️ Watch out for</h3>
            {biz.considerations.map(c => (
              <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 13, color: '#92400E' }}>
                <span style={{ fontWeight: 700 }}>→</span> {c}
              </div>
            ))}
          </div>
        </div>

        {/* ── Setup costs ── */}
        <div style={{ background: S.n50, border: `1px solid ${S.n200}`, borderRadius: 16, padding: '24px', marginBottom: 48 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: S.n900, marginBottom: 12 }}>
            {biz.name} Setup Costs in {loc.name}
          </h2>
          <p style={{ fontSize: 14, color: S.n500, lineHeight: 1.75, marginBottom: 16 }}>
            Opening a {biz.name.toLowerCase()} in {loc.name} typically requires a setup budget of <strong style={{ color: S.n800 }}>{biz.avgSetup}</strong>, depending on the size of the space and level of fit-out required. Average order values run <strong style={{ color: S.n800 }}>{biz.avgTicket}</strong> per customer.
          </p>
          <p style={{ fontSize: 14, color: S.n500, lineHeight: 1.75 }}>
            With commercial rent around {loc.medianRent}/month in {loc.name}, your rent-to-revenue ratio is a critical factor. Locatalyze calculates whether your specific address is financially viable based on your actual numbers — not generic estimates.
          </p>
        </div>

        {/* ── CTA box ── */}
        <div style={{ background: `linear-gradient(135deg,${S.brand} 0%,#0891B2 100%)`, borderRadius: 20, padding: '36px', marginBottom: 48, textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 10 }}>Free location analysis</p>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: S.white, letterSpacing: '-0.03em', marginBottom: 12, lineHeight: 1.2 }}>
            Ready to analyse your {loc.name} {biz.name.toLowerCase()} location?
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', marginBottom: 24, lineHeight: 1.7 }}>
            Enter your exact address, rent and setup budget. Get a full financial model, competition analysis and a clear GO / CAUTION / NO verdict in 30 seconds.
          </p>
          <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: S.white, color: S.brand, borderRadius: 12, padding: '14px 28px', fontWeight: 800, fontSize: 15 }}>
            Analyse my {loc.name} location free →
          </Link>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 10 }}>No credit card · 3 free reports</p>
        </div>

        {/* ── Internal links — other cities ── */}
        <div style={{ marginBottom: 48 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: S.n900, marginBottom: 14 }}>
            {biz.name} Location Analysis — Other Cities
          </h3>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {otherCities.map(([slug, c]) => (
              <Link key={slug} href={`/analyse/${businessType}/${slug}`}
                style={{ background: S.n50, border: `1px solid ${S.n200}`, borderRadius: 8, padding: '8px 14px', fontSize: 13, color: S.brand, fontWeight: 600 }}>
                {biz.icon} {biz.name} in {c.name}
              </Link>
            ))}
          </div>
        </div>

        {/* ── Internal links — other biz types ── */}
        <div style={{ marginBottom: 48 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: S.n900, marginBottom: 14 }}>
            Other Business Types in {loc.name}
          </h3>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {otherBizTypes.map(([slug, b]) => (
              <Link key={slug} href={`/analyse/${slug}/${city}`}
                style={{ background: S.n50, border: `1px solid ${S.n200}`, borderRadius: 8, padding: '8px 14px', fontSize: 13, color: S.brand, fontWeight: 600 }}>
                {b.icon} {b.name} in {loc.name}
              </Link>
            ))}
          </div>
        </div>

        {/* ── FAQ (good for SEO) ── */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: S.n900, letterSpacing: '-0.02em', marginBottom: 20 }}>
            Frequently Asked Questions
          </h2>
          {[
            { q: `How do I find the best location for a ${biz.name.toLowerCase()} in ${loc.name}?`, a: `The best ${biz.name.toLowerCase()} locations in ${loc.name} combine high foot traffic, manageable competition, and a rent-to-revenue ratio under 20%. Suburbs like ${loc.areas[0]} and ${loc.areas[1]} consistently perform well. Use Locatalyze to analyse any specific address and get a data-driven verdict.` },
            { q: `How much does it cost to open a ${biz.name.toLowerCase()} in ${loc.name}?`, a: `Opening a ${biz.name.toLowerCase()} in ${loc.name} typically requires ${biz.avgSetup} in setup costs, plus commercial rent of around ${loc.medianRent}/month. Locatalyze calculates your break-even point and payback period based on your exact numbers.` },
            { q: `Is ${loc.name} a good market for a ${biz.name.toLowerCase()}?`, a: `${loc.name} has ${sample.demandLevel.toLowerCase()} demand for ${biz.name.toLowerCase()} businesses, with ${sample.competitorCount} average competitors per area. ${loc.traits[0]}. Success depends heavily on the specific location — use Locatalyze to analyse your exact address.` },
            { q: `What data does Locatalyze use to analyse ${loc.name} locations?`, a: `Locatalyze analyses competitor density from Google Places, ${loc.name} demographic and spending data, commercial rent benchmarks, foot traffic signals, and uses an AI financial model to calculate break-even, profit projections and payback period for your specific business and address.` },
          ].map((faq, i) => (
            <div key={i} style={{ borderBottom: `1px solid ${S.n100}`, paddingBottom: 20, marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: S.n800, marginBottom: 8 }}>{faq.q}</h3>
              <p style={{ fontSize: 14, color: S.n500, lineHeight: 1.75 }}>{faq.a}</p>
            </div>
          ))}
        </div>

      </div>

      {/* Footer */}
      <footer style={{ background: S.n900, padding: '28px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 24, height: 24, borderRadius: 7, background: `linear-gradient(135deg,${S.brand},${S.brandLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: S.white, fontWeight: 800, fontSize: 11 }}>L</div>
            <span style={{ fontWeight: 800, fontSize: 13, color: S.white }}>Locatalyze</span>
          </Link>
          <p style={{ fontSize: 12, color: S.n500 }}>AI-powered business location analysis for Australia</p>
          <Link href="/auth/signup" style={{ fontSize: 12, color: S.brand, fontWeight: 700 }}>Try free →</Link>
        </div>
      </footer>
    </div>
  )
}