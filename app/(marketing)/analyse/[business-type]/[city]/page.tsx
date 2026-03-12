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
export async function generateMetadata({ params }: { params: { businessType: string; city: string } }): Promise<Metadata> {
  const { businessType, city } = params
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

// ── Static params / ISR ───────────────────────────────────────────────────────
export const dynamicParams = true
export const revalidate = 86400 // 24h caching

// ── Sample data per city/biz combo ─────────────────────────────────────────────
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

// ── Colors / Styles ───────────────────────────────────────────────────────────
const S = {
  brand: '#0F766E', brandLight: '#14B8A6', brandFaded: '#F0FDFA', brandBorder: '#99F6E4',
  n50: '#FAFAF9', n100: '#F5F5F4', n200: '#E7E5E4', n400: '#A8A29E',
  n500: '#78716C', n700: '#44403C', n800: '#292524', n900: '#1C1917',
  white: '#FFFFFF', emerald: '#059669', emeraldBg: '#ECFDF5', emeraldBdr: '#A7F3D0',
  amber: '#D97706', amberBg: '#FFFBEB', amberBdr: '#FDE68A',
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function SEOLocationPage({ params }: { params: { businessType: string; city: string } }) {
  const { businessType, city } = params
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
      {/* ... your JSX content stays exactly the same ... */}
      {/* Copy your existing JSX here (hero, overview, metrics, FAQ, footer) */}
    </div>
  )
}