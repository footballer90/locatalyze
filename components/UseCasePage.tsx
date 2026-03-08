'use client'
import Link from 'next/link'

const S = {
  brand: '#0F766E', brandLight: '#14B8A6', brandFaded: '#F0FDFA', brandBorder: '#99F6E4',
  n50: '#FAFAF9', n100: '#F5F5F4', n200: '#E7E5E4', n400: '#A8A29E', n500: '#78716C',
  n700: '#44403C', n800: '#292524', n900: '#1C1917', white: '#FFFFFF',
  emerald: '#059669', emeraldBg: '#ECFDF5', emeraldBdr: '#A7F3D0',
  amber: '#D97706', amberBg: '#FFFBEB', amberBdr: '#FDE68A',
  red: '#DC2626', redBg: '#FEF2F2', redBdr: '#FECACA',
  headerBg: '#0C1F1C', font: "'DM Sans', sans-serif",
}

type Config = {
  icon: string; title: string; subtitle: string; description: string
  keyFactors: { icon: string; title: string; desc: string }[]
  whatToLookFor: string[]; redFlags: string[]; tipTitle: string; tip: string
}

const CONFIGS: Record<string, Config> = {
  cafes: {
    icon: '☕', title: 'Cafes & Coffee', subtitle: 'Location analysis for café owners',
    description: 'Choosing the right location is the single biggest decision a café owner makes. The wrong street can mean years of struggle. The right one can mean a queue out the door from day one.',
    keyFactors: [
      { icon: '👥', title: 'Morning foot traffic', desc: 'Look for locations near offices, schools, train stations or gyms. The 7–9am commuter window is where most café revenue is made.' },
      { icon: '🏢', title: 'Daytime population', desc: 'ABS employment data shows how many workers are within 500m. More workers = more coffee buyers.' },
      { icon: '☕', title: 'Competitor density', desc: '2–3 cafes nearby is healthy competition. 6+ within 200m is oversaturation unless foot traffic is extremely high.' },
      { icon: '💰', title: 'Rent-to-revenue ratio', desc: 'Café rent should ideally be under 12% of revenue. At average spend of $8–12 per customer, you need the foot traffic to support the rent.' },
    ],
    whatToLookFor: ['Corner or end-of-terrace positions with high visibility', 'Street-facing windows or outdoor seating potential', 'Proximity to morning commuter corridors', 'Car parking or public transport within 200m', 'Office buildings, gyms or schools nearby'],
    redFlags: ['More than 5 cafes within 200m', 'Rent above $5,000/month without verified foot traffic', 'No morning commuter flow nearby', 'Residential-only area with low daytime population'],
    tipTitle: 'The 7am test',
    tip: 'Visit the location at 7am on a Tuesday. Count how many people walk past in 10 minutes. Multiply by 6 for an hourly estimate. If it is under 50 people per hour, think carefully about whether coffee volumes will stack up.',
  },
  restaurants: {
    icon: '🍽️', title: 'Restaurants', subtitle: 'Location analysis for restaurant owners',
    description: 'Restaurant location decisions are among the highest-stakes in retail. A lease signed on the wrong site can cost hundreds of thousands. Data changes the odds.',
    keyFactors: [
      { icon: '🌆', title: 'Evening foot traffic', desc: 'Restaurants live and die by dinner trade. Look for locations with strong evening populations — entertainment precincts, high-density residential, or near theatres and venues.' },
      { icon: '🅿️', title: 'Parking & accessibility', desc: 'Dinner diners often drive. Easy parking within 200m significantly affects covers. Public transport access matters for lunch trade.' },
      { icon: '🍽️', title: 'Restaurant competition', desc: 'A dining precinct with complementary restaurants can be a strength — diners visit areas, not just individual restaurants. But direct category overlap within 100m is a risk.' },
      { icon: '📊', title: 'Spend-per-head vs rent', desc: 'A restaurant doing $65 average spend needs far fewer covers to break even than a $25 average. Model your specific price point against the rent.' },
    ],
    whatToLookFor: ['Licensed premises or easy path to liquor licence', 'Existing extraction/ventilation infrastructure', 'High-density residential within 1km', 'Street with restaurant cluster (destination dining effect)', 'Strong weekend evening foot traffic'],
    redFlags: ['No street presence or below-ground only', 'Heavily industrial area with no residential catchment', 'Rent above 15% of projected revenue', 'No parking within 400m for dinner service'],
    tipTitle: 'Friday night test',
    tip: 'Visit at 7:30pm on a Friday. Are other restaurants on the street busy? Are people walking past looking for somewhere to eat? A 10-minute observation tells you more than a week of desk research.',
  },
  retail: {
    icon: '👗', title: 'Retail Stores', subtitle: 'Location analysis for retail store owners',
    description: 'For retail, location is the product. The best inventory in the world cannot save a store on the wrong street. But the right location can carry an average range.',
    keyFactors: [
      { icon: '👟', title: 'Pedestrian volume', desc: 'Retail lives on footfall. Counts above 1,000 people per hour in a retail strip are strong. Shopping centres have their own metrics — lease rates reflect them.' },
      { icon: '💳', title: 'Spending demographics', desc: 'Median household income, age, and household type in the suburb tells you whether the population matches your price point.' },
      { icon: '🏬', title: 'Anchor stores', desc: 'Being adjacent to or near anchor stores (supermarkets, Chemist Warehouse, major fashion chains) drives passive traffic to surrounding retailers.' },
      { icon: '📱', title: 'Online competition context', desc: 'Categories heavily competed by Amazon and online retailers need higher foot traffic to compensate. Experiential or service-led retail has an edge.' },
    ],
    whatToLookFor: ['Street-level presence on high-traffic retail strip', 'Nearby anchor stores or destination retailers', 'Demographics matching your target customer', 'Low vacancy rate on the street (sign of health)', 'Window display potential'],
    redFlags: ['High vacancy rate on the street', 'Demographics significantly misaligned with price point', 'No foot traffic anchors within 200m', 'Lease in declining shopping centre'],
    tipTitle: 'Count the feet',
    tip: 'Stand outside your prospective site at 11am on a Saturday. Count pedestrians walking in both directions for 5 minutes. Multiply by 12 for hourly rate. Compare to a known successful street to calibrate what is normal for your category.',
  },
  gyms: {
    icon: '💪', title: 'Gyms & Fitness', subtitle: 'Location analysis for gym owners',
    description: 'The fitness market in Australia is crowded and competitive. Before committing to a large floor plate and a long lease, the numbers need to stack up definitively.',
    keyFactors: [
      { icon: '🏃', title: 'Residential catchment', desc: 'Most gym members come from within 3km. High-density residential — especially apartments housing 25–45 year olds — is the core catchment profile.' },
      { icon: '💪', title: 'Competition intensity', desc: 'Gym oversaturation is the biggest risk. Count all gyms, 24/7 gyms, yoga studios, CrossFit boxes and boutique fitness within 2km — not just 500m.' },
      { icon: '🅿️', title: 'Parking & size', desc: 'A gym needs a minimum 250–400 sqm for a viable offering. Ground floor or easy upper floor with lift access. Parking for members who drive during peak hours.' },
      { icon: '💰', title: 'Revenue per sqm', desc: 'Gyms operate on membership revenue divided by floor area. High rent for large floor plates requires significant member volumes. Model carefully.' },
    ],
    whatToLookFor: ['High-density residential within 1.5km', 'Ground floor or easy first-floor access', 'Car parking for peak hours (6–8am, 5–7pm)', 'Room for at least 15–20 members simultaneously', 'Limited direct competition within 1km'],
    redFlags: ['More than 3 gyms within 1km', 'Purely commercial area with no residential catchment', 'Rent above $8,000/month without verified membership projections', '24/7 gym (Anytime, Snap, Plus Fitness) directly nearby'],
    tipTitle: 'The 6am test',
    tip: 'Visit the street at 6am on a weekday. Are people jogging? Are there people in activewear? Is there a café open for post-workout coffee? This is a simple proxy for fitness culture in the area.',
  },
  takeaway: {
    icon: '🥡', title: 'Takeaway', subtitle: 'Location analysis for takeaway businesses',
    description: 'Takeaway is one of the most location-sensitive businesses in food. Proximity to foot traffic, residential density, and delivery zone quality all drive viability.',
    keyFactors: [
      { icon: '🚶', title: 'Lunchtime foot traffic', desc: 'Takeaway peaks at lunch and dinner. Office workers within 500m are the core lunch customer. Residential density drives dinner delivery volume.' },
      { icon: '📱', title: 'Delivery platform reach', desc: 'UberEats, DoorDash and Menulog delivery zones mean your physical catchment can extend 3–5km. A slightly lower foot traffic location can be offset by strong delivery demand.' },
      { icon: '🏎️', title: 'Speed of service access', desc: 'Easy access for delivery riders matters. A location on a main road with no parking is frustrating for riders. Side streets with easy pull-in are better.' },
      { icon: '🥡', title: 'Category competition', desc: 'Takeaway categories vary in competition. A well-executed underserved category nearby can be a strong opportunity.' },
    ],
    whatToLookFor: ['Office workers within 500m for lunch trade', 'High-density residential within 2km for delivery', 'Delivery rider access and parking', 'Underserved cuisine category in the area', 'High app-based ordering culture in the suburb'],
    redFlags: ['No offices and low residential density', 'Category already dominated by 3+ operators within 500m', 'Difficult rider access or no loading zone', 'Suburb with low app-based ordering behaviour'],
    tipTitle: 'Check your delivery zone first',
    tip: 'Before signing a lease, map your 3km delivery radius on UberEats or DoorDash. Count residential density in that zone. If there are fewer than 3,000 households within 3km, delivery revenue alone will not sustain you.',
  },
  all: {
    icon: '🏪', title: 'All Business Types', subtitle: 'Location analysis for any business',
    description: 'Locatalyze works for any business that depends on a physical location. Whether you are opening a bookshop, a dog groomer, a nail salon or a co-working space — the same location fundamentals apply.',
    keyFactors: [
      { icon: '👥', title: 'Target customer proximity', desc: 'The most important question: where are your customers? Map their likely home or work location against your prospective site.' },
      { icon: '🏢', title: 'Competitor awareness', desc: 'For any business type, knowing who is nearby — and how they are performing — tells you whether the market is saturated or has room for you.' },
      { icon: '💰', title: 'Rent affordability', desc: 'The fundamental test: can you generate enough revenue at this location to make the rent viable? Our model calculates this for your specific inputs.' },
      { icon: '📊', title: 'Feasibility scoring', desc: 'Locatalyze scores demand, competition, rent and profitability on a 0–100 scale and delivers a single GO / CAUTION / NO verdict.' },
    ],
    whatToLookFor: ['Target demographic concentration nearby', 'Manageable competition within your category', 'Rent below 15% of projected revenue', 'Good visibility and access', 'Complementary businesses nearby'],
    redFlags: ['Demographics significantly misaligned with customer profile', 'Oversaturated market in your category', 'Rent above 20% of projected revenue', 'Low foot traffic with no delivery or online supplement'],
    tipTitle: 'Start with the customer',
    tip: 'Before running the numbers, stand at the location and ask: would my ideal customer walk past here? Would they stop? If the honest answer is no, no amount of data will fix it.',
  },
}

export function UseCasePage({ type }: { type: string }) {
  const config = CONFIGS[type] || CONFIGS.all

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <div style={{ minHeight: '100vh', background: S.n50, fontFamily: S.font }}>
        <div style={{ background: S.headerBg, padding: '60px 24px 48px', textAlign: 'center' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 32 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg,${S.brand},${S.brandLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 13 }}>L</div>
            <span style={{ fontWeight: 800, fontSize: 15, color: '#F9FAFB', letterSpacing: '-0.02em' }}>Locatalyze</span>
          </Link>
          <span style={{ fontSize: 52, display: 'block', marginBottom: 12 }}>{config.icon}</span>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(15,118,110,0.15)', border: '1px solid rgba(15,118,110,0.3)', borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700, color: S.brandLight, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 14 }}>{config.subtitle}</div>
          <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#F9FAFB', letterSpacing: '-0.5px', marginBottom: 12 }}>{config.title}</h1>
          <p style={{ fontSize: 15, color: '#9CA3AF', maxWidth: 520, margin: '0 auto' }}>{config.description}</p>
        </div>

        <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 24px 80px' }}>
          <div style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: S.n900, marginBottom: 20 }}>Key location factors</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 16 }}>
              {config.keyFactors.map(f => (
                <div key={f.title} style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 14, padding: '20px' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: S.brandFaded, border: `1px solid ${S.brandBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{f.icon}</div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: S.n900, marginBottom: 4 }}>{f.title}</p>
                      <p style={{ fontSize: 13, color: S.n500, lineHeight: 1.65 }}>{f.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 48 }}>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 14, padding: '24px' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: S.emerald, marginBottom: 14 }}>✅ What to look for</h3>
              {config.whatToLookFor.map((item, i) => (
                <p key={i} style={{ fontSize: 13, color: '#065F46', lineHeight: 1.65, marginBottom: 6 }}>· {item}</p>
              ))}
            </div>
            <div style={{ background: S.redBg, border: `1px solid ${S.redBdr}`, borderRadius: 14, padding: '24px' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: S.red, marginBottom: 14 }}>🚩 Red flags</h3>
              {config.redFlags.map((item, i) => (
                <p key={i} style={{ fontSize: 13, color: '#991B1B', lineHeight: 1.65, marginBottom: 6 }}>· {item}</p>
              ))}
            </div>
          </div>

          <div style={{ background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 14, padding: '24px', marginBottom: 48 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: S.amber, marginBottom: 8 }}>💡 {config.tipTitle}</p>
            <p style={{ fontSize: 14, color: '#92400E', lineHeight: 1.75 }}>{config.tip}</p>
          </div>

          <div style={{ background: `linear-gradient(135deg,${S.brand},#0891B2)`, borderRadius: 20, padding: '40px', textAlign: 'center' }}>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: 10 }}>Analyse your location now</h3>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 24 }}>Paste any Australian address and get a full feasibility report in 30 seconds. Free to start.</p>
            <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fff', color: S.brand, borderRadius: 10, padding: '12px 24px', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
              Run my free analysis →
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}