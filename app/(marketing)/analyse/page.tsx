// app/(marketing)/analyse/page.tsx
// Locatalyze /analyse hub — SEO + conversion page
// Targets: "where to open a business in Australia", "best city to start a business Australia"
// Server component — fully static, no client state needed

import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Where to Open a Business in Australia — Location Analysis by City (2026)',
  description:
    'Suburb-by-suburb scores for cafés, restaurants, retail and service businesses across every Australian capital plus 13 regional hubs. Rent benchmarks, foot traffic data, GO/CAUTION/NO verdicts and break-even analysis for 200+ locations — Sydney, Melbourne, Brisbane, Perth, Adelaide, Sunshine Coast, Geelong, Cairns, Mackay and more.',
  alternates: { canonical: 'https://www.locatalyze.com/analyse' },
  openGraph: {
    title: 'Where to Open a Business in Australia — Location Analysis by City (2026)',
    description:
      'Suburb-by-suburb scores for every major Australian city. Foot traffic, rent benchmarks, and GO/CAUTION/NO verdicts for 100+ locations.',
    url: 'https://www.locatalyze.com/analyse',
  },
}

const S = {
  brand: '#0891B2',
  brandLight: '#06B6D4',
  brandDark: '#0E7490',
  emerald: '#059669',
  emeraldBg: '#ECFDF5',
  emeraldBdr: '#A7F3D0',
  amber: '#D97706',
  amberBg: '#FFFBEB',
  amberBdr: '#FDE68A',
  red: '#DC2626',
  redBg: '#FEF2F2',
  muted: '#475569',
  mutedLight: '#94A3B8',
  border: '#E2E8F0',
  n50: '#F8FAFC',
  n100: '#F1F5F9',
  n700: '#334155',
  n800: '#1E293B',
  n900: '#0F172A',
  white: '#FFFFFF',
}

const CITIES = [
  {
    name: 'Sydney',
    slug: 'sydney',
    state: 'NSW',
    tagline: "Australia's most expensive — and most rewarding — business market",
    topSuburbs: ['Parramatta', 'Surry Hills', 'Chatswood'],
    rentFrom: '$1,800/mo',
    score: 88,
    highlight: 'Best rent-to-foottraffic ratio: Parramatta',
    color: '#0891B2',
    bgColor: '#EFF6FF',
  },
  {
    name: 'Melbourne',
    slug: 'melbourne',
    state: 'VIC',
    tagline: "Australia's café capital — where culture and commerce converge",
    topSuburbs: ['Fitzroy', 'Northcote', 'Footscray'],
    rentFrom: '$2,200/mo',
    score: 91,
    highlight: 'Highest café culture sophistication in Australia',
    color: '#7C3AED',
    bgColor: '#F5F3FF',
  },
  {
    name: 'Brisbane',
    slug: 'brisbane',
    state: 'QLD',
    tagline: '2032 Olympics effect — Australia\'s fastest-moving commercial market',
    topSuburbs: ['New Farm', 'Paddington', 'West End'],
    rentFrom: '$1,600/mo',
    score: 79,
    highlight: '35% lower rents than Sydney with strong demand growth',
    color: '#D97706',
    bgColor: '#FFFBEB',
  },
  {
    name: 'Perth',
    slug: 'perth',
    state: 'WA',
    tagline: 'Resource economy, above-average incomes, undervalued rents',
    topSuburbs: ['Subiaco', 'Leederville', 'Mount Lawley'],
    rentFrom: '$1,400/mo',
    score: 74,
    highlight: 'Mining sector incomes drive above-average discretionary spend',
    color: '#059669',
    bgColor: '#ECFDF5',
  },
  {
    name: 'Adelaide',
    slug: 'adelaide',
    state: 'SA',
    tagline: "Australia's most affordable major city for commercial leasing",
    topSuburbs: ['Norwood', 'Unley', 'Prospect'],
    rentFrom: '$1,200/mo',
    score: 62,
    highlight: 'Lowest commercial rent per sqm of any major Australian capital',
    color: '#DC2626',
    bgColor: '#FEF2F2',
  },
  {
    name: 'Canberra',
    slug: 'canberra',
    state: 'ACT',
    tagline: 'Captive government workforce, highest median income in Australia',
    topSuburbs: ['Braddon', 'Kingston', 'Manuka'],
    rentFrom: '$2,000/mo',
    score: 68,
    highlight: 'Government worker spending is stable, predictable, high income',
    color: '#0891B2',
    bgColor: '#EFF6FF',
  },
  {
    name: 'Newcastle',
    slug: 'newcastle',
    state: 'NSW',
    tagline: 'Mid-transformation coastal city — strong café culture, harbour renewal, improving demographics',
    topSuburbs: ['Merewether', 'Hamilton', 'Cooks Hill'],
    rentFrom: '$1,000/mo',
    score: 72,
    highlight: 'Best suburbs in Newcastle: Merewether, Hamilton, Cooks Hill',
    color: '#059669',
    bgColor: '#ECFDF5',
  },
  {
    name: 'Gold Coast',
    slug: 'gold-coast',
    state: 'QLD',
    tagline: 'Tourism powerhouse with under-served local demand — a two-speed market',
    topSuburbs: ['Burleigh Heads', 'Broadbeach', 'Palm Beach'],
    rentFrom: '$1,400/mo',
    score: 74,
    highlight: 'Best local demand: Burleigh Heads and Palm Beach strip',
    color: '#F59E0B',
    bgColor: '#FFFBEB',
  },
  {
    name: 'Wollongong',
    slug: 'wollongong',
    state: 'NSW',
    tagline: 'University city revitalising fast — underpriced relative to demand strength',
    topSuburbs: ['Wollongong CBD', 'Thirroul', 'Corrimal'],
    rentFrom: '$800/mo',
    score: 69,
    highlight: 'Lowest commercial rents per foot-traffic unit in NSW coastal strip',
    color: '#0891B2',
    bgColor: '#EFF6FF',
  },
  {
    name: 'Hobart',
    slug: 'hobart',
    state: 'TAS',
    tagline: 'MONA effect — premium food culture, tight supply, high spend-per-visitor',
    topSuburbs: ['Battery Point', 'North Hobart', 'Sandy Bay'],
    rentFrom: '$900/mo',
    score: 71,
    highlight: 'North Hobart strip: highest independent dining density per capita in TAS',
    color: '#1E3A5F',
    bgColor: '#EFF6FF',
  },
  {
    name: 'Darwin',
    slug: 'darwin',
    state: 'NT',
    tagline: 'Compact city with high government spending power — manage the Wet season cycle',
    topSuburbs: ['Darwin CBD', 'Parap', 'Fannie Bay'],
    rentFrom: '$1,200/mo',
    score: 63,
    highlight: 'High household income but acute dry/wet season revenue swings',
    color: '#0F766E',
    bgColor: '#F0FDFA',
  },
]

const REGIONAL_CITIES = [
  { name: 'Sunshine Coast', slug: 'sunshine-coast', state: 'QLD', suburbs: 10, color: '#C2410C' },
  { name: 'Geelong', slug: 'geelong', state: 'VIC', suburbs: 10, color: '#0369A1' },
  { name: 'Ballarat', slug: 'ballarat', state: 'VIC', suburbs: 10, color: '#B45309' },
  { name: 'Bendigo', slug: 'bendigo', state: 'VIC', suburbs: 10, color: '#C2410C' },
  { name: 'Cairns', slug: 'cairns', state: 'QLD', suburbs: 11, color: '#0F766E' },
  { name: 'Townsville', slug: 'townsville', state: 'QLD', suburbs: 10, color: '#1D4ED8' },
  { name: 'Toowoomba', slug: 'toowoomba', state: 'QLD', suburbs: 10, color: '#166534' },
  { name: 'Bundaberg', slug: 'bundaberg', state: 'QLD', suburbs: 8, color: '#A16207' },
  { name: 'Ipswich', slug: 'ipswich', state: 'QLD', suburbs: 8, color: '#57534E' },
  { name: 'Launceston', slug: 'launceston', state: 'TAS', suburbs: 10, color: '#1E40AF' },
  { name: 'Hervey Bay', slug: 'hervey-bay', state: 'QLD', suburbs: 7, color: '#0891B2' },
  { name: 'Mackay', slug: 'mackay', state: 'QLD', suburbs: 8, color: '#7C3AED' },
  { name: 'Rockhampton', slug: 'rockhampton', state: 'QLD', suburbs: 8, color: '#B45309' },
  { name: 'Coffs Harbour', slug: 'coffs-harbour', state: 'NSW', suburbs: 8, color: '#15803D' },
  { name: 'Port Macquarie', slug: 'port-macquarie', state: 'NSW', suburbs: 8, color: '#0284C7' },
  { name: 'Maitland', slug: 'maitland', state: 'NSW', suburbs: 8, color: '#C2410C' },
  { name: 'Wagga Wagga', slug: 'wagga-wagga', state: 'NSW', suburbs: 8, color: '#B45309' },
  { name: 'Albury-Wodonga', slug: 'albury-wodonga', state: 'NSW/VIC', suburbs: 8, color: '#0891B2' },
  { name: 'Orange', slug: 'orange', state: 'NSW', suburbs: 7, color: '#EA580C' },
  { name: 'Mandurah', slug: 'mandurah', state: 'WA', suburbs: 8, color: '#0D9488' },
  { name: 'Bunbury', slug: 'bunbury', state: 'WA', suburbs: 8, color: '#2563EB' },
  { name: 'Geraldton', slug: 'geraldton', state: 'WA', suburbs: 7, color: '#F97316' },
  { name: 'Shepparton', slug: 'shepparton', state: 'VIC', suburbs: 8, color: '#16A34A' },
  { name: 'Mildura', slug: 'mildura', state: 'VIC', suburbs: 8, color: '#D97706' },
  { name: 'Warrnambool', slug: 'warrnambool', state: 'VIC', suburbs: 7, color: '#1D4ED8' },
  { name: 'Devonport', slug: 'devonport', state: 'TAS', suburbs: 7, color: '#10B981' },
  { name: 'Mount Gambier', slug: 'mount-gambier', state: 'SA', suburbs: 7, color: '#3B82F6' },
  { name: 'Alice Springs', slug: 'alice-springs', state: 'NT', suburbs: 7, color: '#DC2626' },
]

const POPULAR_SEARCHES = [
  { label: 'Best café locations in Sydney 2026', href: '/analyse/sydney', tag: 'Cafés' },
  { label: 'Where to open a restaurant in Melbourne', href: '/analyse/melbourne', tag: 'Restaurants' },
  { label: 'Brisbane business suburbs 2026', href: '/analyse/brisbane', tag: 'Brisbane' },
  { label: 'Perth café locations rent vs foot traffic', href: '/analyse/perth', tag: 'Perth' },
  { label: 'Best suburbs in Newcastle to open a business', href: '/analyse/newcastle', tag: 'Newcastle' },
  { label: 'Newcastle commercial rent benchmarks 2026', href: '/analyse/newcastle', tag: 'Newcastle' },
  { label: 'Parramatta vs Sydney CBD — rent & revenue', href: '/analyse/sydney/parramatta', tag: 'Comparison' },
  { label: 'Ultimo Sydney business analysis — UTS precinct', href: '/analyse/sydney/ultimo', tag: 'Suburb' },
  { label: 'Western Sydney business suburb guide', href: '/analyse/sydney', tag: 'Western Sydney' },
  { label: 'Melbourne inner north café market saturation', href: '/analyse/melbourne', tag: 'Melbourne' },
  { label: 'Best suburbs to open a café in Sydney', href: '/analyse/sydney', tag: 'Cafés' },
  { label: 'Low-rent high-foot-traffic Sydney suburbs', href: '/analyse/sydney', tag: 'Sydney' },
  { label: 'Parramatta business opportunity 2026', href: '/analyse/sydney/parramatta', tag: 'Parramatta' },
  { label: 'Is Ultimo good for a café or restaurant?', href: '/analyse/sydney/ultimo', tag: 'Ultimo' },
  { label: 'Best Hobart suburbs to open a business 2026', href: '/analyse/hobart', tag: 'Hobart' },
  { label: 'Ballarat business location guide 2026', href: '/analyse/ballarat', tag: 'Ballarat' },
  { label: 'Cairns café and restaurant location scores', href: '/analyse/cairns', tag: 'Cairns' },
  { label: 'Toowoomba business suburbs — GO/CAUTION/NO', href: '/analyse/toowoomba', tag: 'Toowoomba' },
  { label: 'Bendigo commercial location analysis 2026', href: '/analyse/bendigo', tag: 'Bendigo' },
  { label: 'Gold Coast café and restaurant location guide', href: '/analyse/gold-coast', tag: 'Gold Coast' },
  { label: 'Darwin business location — dry vs wet season', href: '/analyse/darwin', tag: 'Darwin' },
  { label: 'Launceston suburb scores for cafés and dining', href: '/analyse/launceston', tag: 'Launceston' },
  { label: 'Sunshine Coast business location guide 2026', href: '/analyse/sunshine-coast', tag: 'Sunshine Coast' },
  { label: 'Geelong café and retail suburb analysis', href: '/analyse/geelong', tag: 'Geelong' },
  { label: 'Hervey Bay business location scores 2026', href: '/analyse/hervey-bay', tag: 'Hervey Bay' },
  { label: 'Mackay suburb guide for cafés and retail', href: '/analyse/mackay', tag: 'Mackay' },
  { label: 'Rockhampton business location analysis', href: '/analyse/rockhampton', tag: 'Rockhampton' },
  { label: 'Coffs Harbour suburb scores for cafes and retail', href: '/analyse/coffs-harbour', tag: 'Coffs Harbour' },
  { label: 'Port Macquarie business location guide 2026', href: '/analyse/port-macquarie', tag: 'Port Macquarie' },
  { label: 'Maitland business suburb analysis — Hunter Valley', href: '/analyse/maitland', tag: 'Maitland' },
  { label: 'Wagga Wagga cafe and restaurant location scores', href: '/analyse/wagga-wagga', tag: 'Wagga Wagga' },
  { label: 'Albury-Wodonga cross-border business guide 2026', href: '/analyse/albury-wodonga', tag: 'Albury-Wodonga' },
  { label: 'Orange NSW food tourism business locations', href: '/analyse/orange', tag: 'Orange' },
  { label: 'Mandurah suburb scores for cafes and dining', href: '/analyse/mandurah', tag: 'Mandurah' },
  { label: 'Bunbury business location analysis 2026', href: '/analyse/bunbury', tag: 'Bunbury' },
  { label: 'Geraldton business location guide — WA Midwest', href: '/analyse/geraldton', tag: 'Geraldton' },
  { label: 'Shepparton cafe and retail suburb scores', href: '/analyse/shepparton', tag: 'Shepparton' },
  { label: 'Mildura business locations — Murray River region', href: '/analyse/mildura', tag: 'Mildura' },
  { label: 'Warrnambool business suburb guide 2026', href: '/analyse/warrnambool', tag: 'Warrnambool' },
  { label: 'Devonport business location scores — TAS', href: '/analyse/devonport', tag: 'Devonport' },
  { label: 'Mount Gambier cafe and restaurant analysis', href: '/analyse/mount-gambier', tag: 'Mount Gambier' },
  { label: 'Alice Springs business location guide 2026', href: '/analyse/alice-springs', tag: 'Alice Springs' },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Enter your address',
    body: "Type in any Australian street address — commercial, retail strip, or mixed-use precinct. Locatalyze geocodes your location and pulls data from its 100,000+ datapoint location model.",
    label: 'Input',
  },
  {
    step: '02',
    title: 'We analyse 6 factors',
    body: 'Foot traffic density, demographic income distribution, competitive density, rent viability ratio, accessibility score, and growth trajectory. Each factor is weighted based on your business type.',
    label: 'Analysis',
  },
  {
    step: '03',
    title: 'Get your GO/CAUTION/NO verdict',
    body: "You receive an overall score out of 100, a GO/CAUTION/NO verdict, break-even calculations, competitive mapping, demographic breakdown, and a 3-year revenue projection.",
    label: 'Report',
  },
]

const MISTAKES = [
  {
    title: 'Choosing rent over foot traffic',
    body: "The cheapest location isn't the best location. A $2,000/month position with 50 daily pedestrians and a $7,000 position with 400 daily pedestrians have fundamentally different economics. The decision must be made on revenue-per-dollar-of-rent, not absolute rent.",
  },
  {
    title: 'Ignoring the competition gap',
    body: 'The number of competing businesses matters less than the ratio of customers to businesses. Surry Hills has 400+ hospitality venues — but also 8,000+ daily food-and-drink consumers. A suburb with 3 cafés and 6,000 students is a better market for a new café operator.',
  },
  {
    title: 'CBD bias',
    body: "Most new operators assume CBD is best. It rarely is for independent businesses. CBD rents in Sydney require $500K+ annual revenue to break even. Parramatta, 30km west, offers 70% of the foot traffic at 40% of the rent.",
  },
  {
    title: 'Ignoring day-part economics',
    body: 'A location with 5,000 daily pedestrians matters less than when those pedestrians walk past. Ultimo has high daytime foot traffic but virtually none on evenings and weekends. A business relying on dinner trade will struggle despite "high foot traffic" scores.',
  },
]

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the best city to start a business in Australia?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Melbourne scores highest on our model (91) for hospitality and creative businesses due to its sophisticated consumer base and established café culture. Sydney scores 88 but comes with significantly higher commercial rents. Brisbane is the growth-upside market — lower rents, strong population migration, and Olympics infrastructure investment. The 'best' city depends on your business type, capital capacity, and risk tolerance.",
      },
    },
    {
      '@type': 'Question',
      name: 'Which Australian city has the cheapest commercial rent?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Adelaide is consistently the most affordable major Australian capital for commercial leasing — retail positions from $1,200/month, compared to $7,000–$14,000 in Sydney's inner suburbs. Perth and Brisbane also offer materially lower rents than Sydney and Melbourne. The cheapest rent isn't always the best value — the metric that matters is revenue-per-dollar-of-rent.",
      },
    },
    {
      '@type': 'Question',
      name: 'How does Locatalyze score business locations?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Locatalyze uses a six-factor weighted suburb model: foot traffic density (22%), demographic income and spending (18%), commercial rent viability (25%), competitive density and competition gap (15%), accessibility and transport (12%), and growth trajectory (8%). Each factor is calibrated by business type — for example a café weights foot traffic higher than a professional services fit-out.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where should I open a café in Australia?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "For cafés specifically: Melbourne's inner north (Fitzroy, Northcote) has the most sophisticated coffee culture but highest saturation. Sydney's second-tier suburbs (Ryde, Hornsby, Parramatta) have the best customer-to-café ratios. Brisbane's Paddington and New Farm are underserved premium markets. Perth's Subiaco and Leederville punch above their weight. The single most consistent factor for café success is customer-to-venue ratio, not prestige of location.",
      },
    },
    {
      '@type': 'Question',
      name: 'Is it better to open in a CBD or a suburb?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "For most independent operators, a strong suburban commercial strip outperforms CBD on risk-adjusted economics. CBD locations offer maximum foot traffic but at rent levels that require extraordinary volume to sustain. Parramatta (Sydney), Fitzroy (Melbourne), and Paddington (Brisbane) each offer inner-city consumer demographics at 40–60% lower rent than their respective CBDs.",
      },
    },
    {
      '@type': 'Question',
      name: 'Is Parramatta a good place to open a café or restaurant?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Yes — Parramatta is one of Sydney's strongest emerging hospitality markets. Specialty coffee scores 89/100 on our model (GO verdict), with projected monthly revenue of $22,000–$34,000 for a well-positioned café. Commercial rents run $4,500–$7,000/month — roughly 40% below Sydney CBD. A $48 billion urban renewal program and significant infrastructure investment are driving sustained population and spending growth through to 2030.",
      },
    },
    {
      '@type': 'Question',
      name: 'Is Ultimo Sydney good for a small business?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Ultimo scores 68/100 (CAUTION) and is highly polarised by the academic calendar. The 45,000+ UTS student population drives strong weekday daytime demand — but foot traffic drops 60–70% during the 15-week semester break. Businesses that can model semester-break revenue independently (healthcare, allied health, co-working) outperform hospitality operators who rely on student volume. Harris Street commercial rents from $4,500/month.",
      },
    },
    {
      '@type': 'Question',
      name: 'What is the break-even revenue for a café in Sydney?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Break-even varies significantly by suburb. In Sydney CBD, a café typically needs $420,000–$600,000 annual revenue to cover $11,000–$14,000/month rent plus labour and COGS. In Parramatta, the same break-even is $280,000–$360,000 against $4,500–$7,000/month rent. In Ultimo, break-even is approximately $240,000–$300,000 but must be modelled across 37 active trading weeks, not 52, to account for the semester break impact.",
      },
    },
  ],
}

export default function AnalysePage() {
  return (
    <div style={{ backgroundColor: '#FFFFFF', color: S.n900, minHeight: '100vh' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />

      {/* ── HERO ── */}
      <section
        style={{
          background: `linear-gradient(135deg, ${S.brandDark} 0%, ${S.brand} 55%, ${S.brandLight} 100%)`,
          padding: '80px 24px',
          textAlign: 'center',
          color: S.white,
        }}
      >
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div
            style={{
              display: 'inline-block',
              padding: '6px 14px',
              backgroundColor: 'rgba(255,255,255,0.18)',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '20px',
              border: '1px solid rgba(255,255,255,0.3)',
            }}
          >
            Australian Business Location Intelligence
          </div>
          <h1
            style={{
              fontSize: 'clamp(30px, 5.5vw, 52px)',
              fontWeight: 900,
              lineHeight: '1.15',
              marginBottom: '20px',
              letterSpacing: '-0.5px',
            }}
          >
            Where to Open a Business in Australia
          </h1>
          <p
            style={{
              fontSize: '19px',
              lineHeight: '1.65',
              opacity: 0.93,
              maxWidth: '660px',
              margin: '0 auto 16px',
            }}
          >
            Choosing the wrong location costs 6–12 months of revenue. Foot traffic, rent economics, demographics, and competition — analysed suburb by suburb across every major Australian city.
          </p>
          <p
            style={{
              fontSize: '14px',
              opacity: 0.75,
              marginBottom: '36px',
            }}
          >
            100+ suburbs scored · ABS 2024 data · Updated Q1 2026
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/onboarding"
              style={{
                padding: '15px 30px',
                backgroundColor: S.emerald,
                color: S.white,
                borderRadius: '9px',
                textDecoration: 'none',
                fontSize: '15px',
                fontWeight: 700,
              }}
            >
              Analyse your address free →
            </Link>
            <a
              href="#cities"
              style={{
                padding: '15px 30px',
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: S.white,
                borderRadius: '9px',
                textDecoration: 'none',
                fontSize: '15px',
                fontWeight: 600,
                border: '2px solid rgba(255,255,255,0.4)',
              }}
            >
              Explore cities ↓
            </a>
          </div>
        </div>
      </section>

      {/* ── RISK BANNER ── */}
      <section style={{ backgroundColor: S.amberBg, borderBottom: `1px solid ${S.amberBdr}`, padding: '20px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '32px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { stat: '31%', desc: 'Hospitality businesses fail in Year 1 in inner Sydney' },
            { stat: '60%', desc: 'Of failures attributed to poor location choice (ASIC data)' },
            { stat: '$180K', desc: 'Average first-year loss from wrong location decision' },
          ].map((item) => (
            <div key={item.stat} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 800, color: S.amber }}>{item.stat}</div>
              <div style={{ fontSize: '12px', color: S.n800, maxWidth: '180px', lineHeight: '1.4' }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── INTRO ── */}
      <section style={{ padding: '60px 24px', backgroundColor: S.white }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: S.n900, marginBottom: '24px', lineHeight: '1.3' }}>
            Why Location is Make-or-Break for Australian Small Businesses
          </h2>
          <div style={{ display: 'grid', gap: '20px' }}>
            {[
              "Most Australian small business failures aren't caused by bad products or poor execution — they're caused by underestimating the financial weight of a bad location. A café in Surry Hills with $11,000/month rent needs 280 covers per day just to cover that single expense. The same café concept in Parramatta, 30 minutes west, needs 120 covers to cover rent of $5,500/month. The difference between thriving and fighting isn't the coffee — it's the 160 covers per day you don't have to find.",
              "The Australian commercial property market rewards operators who understand granular local dynamics. Rent, foot traffic, demographics, and competition don't exist at the 'Sydney' or 'Melbourne' level — they exist at the suburb level. Fitzroy and Dandenong are both 'Melbourne suburbs' with completely different economics, demographics, and consumer behaviour. Treating them the same is a $100,000 mistake.",
              "Locatalyze analyses 6 weighted factors — foot traffic, demographics, rent viability, competition, accessibility, and growth trajectory — at the suburb level for every major Australian city. The result: an objective, data-backed GO/CAUTION/NO verdict for any address in Australia, calibrated for your specific business type.",
            ].map((p, i) => (
              <p key={i} style={{ fontSize: '16px', lineHeight: '1.8', color: S.n800, margin: 0 }}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ── CITY CARDS ── */}
      <section id="cities" style={{ padding: '60px 24px', backgroundColor: S.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: S.n900, marginBottom: '10px', lineHeight: '1.2' }}>
              Explore Australian Cities
            </h2>
            <p style={{ fontSize: '16px', color: S.muted, margin: 0 }}>
              Each city guide includes suburb scores, rent benchmarks, and business-type recommendations.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
            {CITIES.map((city) => (
              <Link
                key={city.slug}
                href={`/analyse/${city.slug}`}
                style={{ textDecoration: 'none' }}
              >
                <div
                  style={{
                    backgroundColor: S.white,
                    borderRadius: '14px',
                    border: `1px solid ${S.border}`,
                    padding: '24px',
                    cursor: 'pointer',
                    transition: 'box-shadow 0.2s',
                  }}
                >
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <h3 style={{ fontSize: '20px', fontWeight: 800, color: S.n900, margin: 0, lineHeight: '1.2' }}>
                        {city.name}
                      </h3>
                      <div style={{ fontSize: '12px', color: S.mutedLight, fontWeight: 600, marginTop: '2px' }}>{city.state}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '28px', fontWeight: 900, color: city.color, lineHeight: 1 }}>{city.score}</div>
                      <div style={{ fontSize: '10px', color: S.mutedLight, fontWeight: 600 }}>DEMAND</div>
                    </div>
                  </div>

                  {/* Tagline */}
                  <p style={{ fontSize: '13px', color: S.muted, lineHeight: '1.55', margin: '0 0 14px', minHeight: '40px' }}>
                    {city.tagline}
                  </p>

                  {/* Highlight */}
                  <div
                    style={{
                      padding: '10px 12px',
                      backgroundColor: city.bgColor,
                      borderRadius: '8px',
                      marginBottom: '14px',
                    }}
                  >
                    <div style={{ fontSize: '12px', color: city.color, fontWeight: 600 }}>{city.highlight}</div>
                  </div>

                  {/* Top suburbs */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '11px', color: S.mutedLight, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                      Top Suburbs
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {city.topSuburbs.map((s) => (
                        <span
                          key={s}
                          style={{
                            fontSize: '12px',
                            fontWeight: 600,
                            padding: '4px 9px',
                            backgroundColor: S.n100,
                            borderRadius: '5px',
                            color: S.n700,
                          }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: `1px solid ${S.border}` }}>
                    <span style={{ fontSize: '12px', color: S.mutedLight }}>Rent from {city.rentFrom}</span>
                    <span style={{ fontSize: '13px', color: city.color, fontWeight: 700 }}>View guide →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── REGIONAL CITIES ── */}
      <section id="regional" style={{ padding: '0 24px 56px', backgroundColor: S.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: S.n900, margin: '0 0 6px 0' }}>Regional &amp; emerging cities</h2>
            <p style={{ fontSize: '14px', color: S.muted, margin: 0 }}>Engine-scored suburb pages — same model, built for these markets.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            {REGIONAL_CITIES.map((city) => (
              <Link
                key={city.slug}
                href={`/analyse/${city.slug}`}
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  backgroundColor: S.white,
                  border: `1px solid ${S.border}`,
                  borderRadius: '12px',
                  padding: '16px 18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: S.n900 }}>{city.name}</div>
                    <div style={{ fontSize: '11px', color: S.mutedLight, fontWeight: 600, marginTop: '2px' }}>{city.state}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', color: city.color, fontWeight: 700 }}>{city.suburbs} suburbs</div>
                    <div style={{ fontSize: '11px', color: S.mutedLight, marginTop: 2 }}>scored →</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── MID CTA ── */}
      <section
        style={{
          padding: '56px 24px',
          background: `linear-gradient(135deg, ${S.brandDark}, ${S.brand})`,
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A', marginBottom: '14px', lineHeight: '1.3' }}>
            Have a specific address in mind?
          </h2>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.85)', marginBottom: '28px', lineHeight: '1.65' }}>
            Don't rely on gut feel. Get a data-backed GO/CAUTION/NO verdict on any Australian address in about 90 seconds — free.
          </p>
          <Link
            href="/onboarding"
            style={{
              display: 'inline-block',
              padding: '15px 34px',
              backgroundColor: S.emerald,
              color: S.white,
              borderRadius: '9px',
              textDecoration: 'none',
              fontSize: '15px',
              fontWeight: 700,
            }}
          >
            Analyse your address free →
          </Link>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: '72px 24px', backgroundColor: S.white }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: S.n900, marginBottom: '12px', lineHeight: '1.2' }}>
              How Locatalyze Works
            </h2>
            <p style={{ fontSize: '16px', color: S.muted, maxWidth: '560px', margin: '0 auto' }}>
              A data model that scores 6 location factors against your specific business type, in about 90 seconds.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px' }}>
            {HOW_IT_WORKS.map((step) => (
              <div
                key={step.step}
                style={{
                  padding: '28px',
                  backgroundColor: S.n50,
                  borderRadius: '14px',
                  border: `1px solid ${S.border}`,
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: S.brand,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span style={{ padding: '2px 7px', backgroundColor: S.brand, color: S.white, borderRadius: '4px', fontSize: '10px', fontWeight: 800, letterSpacing: '0.06em' }}>{step.label}</span>
                  Step {step.step}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: S.n900, marginBottom: '10px', lineHeight: '1.3' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '14px', color: S.muted, lineHeight: '1.7', margin: 0 }}>
                  {step.body}
                </p>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: '32px',
              padding: '20px 24px',
              backgroundColor: S.emeraldBg,
              borderRadius: '12px',
              border: `1px solid ${S.emeraldBdr}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: S.emerald }}>Free analysis — no card required</div>
              <div style={{ fontSize: '13px', color: '#047857' }}>First report free: verdict, map & score. Full P&L, break-even, PDF & more from $29.</div>
            </div>
            <Link
              href="/onboarding"
              style={{
                padding: '12px 24px',
                backgroundColor: S.emerald,
                color: S.white,
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 700,
                whiteSpace: 'nowrap',
              }}
            >
              Start free →
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHAT MOST OPERATORS GET WRONG ── */}
      <section style={{ padding: '64px 24px', backgroundColor: S.n50 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '30px', fontWeight: 800, color: S.n900, marginBottom: '10px', lineHeight: '1.2' }}>
            What Most Operators Get Wrong
          </h2>
          <p style={{ fontSize: '15px', color: S.muted, marginBottom: '36px' }}>
            The four mistakes that separate failed locations from successful ones.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {MISTAKES.map((m, i) => (
              <div
                key={i}
                style={{
                  padding: '24px',
                  backgroundColor: S.white,
                  borderRadius: '12px',
                  border: `1px solid ${S.border}`,
                  borderTop: `3px solid ${S.brand}`,
                }}
              >
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: S.n900, marginBottom: '10px', lineHeight: '1.4' }}>
                  {m.title}
                </h3>
                <p style={{ fontSize: '13px', color: S.muted, lineHeight: '1.7', margin: 0 }}>
                  {m.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DARK CTA — after mistakes ── */}
      <section style={{ padding: '56px 24px', backgroundColor: S.n900 }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div
            style={{
              display: 'inline-block',
              padding: '4px 12px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.6)',
              marginBottom: '16px',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            Before You Commit to a Lease
          </div>
          <h2
            style={{
              fontSize: 'clamp(22px, 4vw, 32px)',
              fontWeight: 800,
              color: '#0F172A',
              marginBottom: '14px',
              lineHeight: '1.25',
            }}
          >
            One analysis. Three minutes. Could save you $180,000.
          </h2>
          <p
            style={{
              fontSize: '16px',
              color: 'rgba(255,255,255,0.72)',
              marginBottom: '28px',
              lineHeight: '1.7',
              maxWidth: '580px',
            }}
          >
            The four mistakes above compound into one outcome: a location that can never generate enough revenue to justify its rent. Locatalyze analyses foot traffic, demographics, competition and rent viability before you sign.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link
              href="/onboarding"
              style={{
                padding: '13px 28px',
                backgroundColor: S.emerald,
                color: S.white,
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 700,
              }}
            >
              Analyse your address free →
            </Link>
            <Link
              href="/analyse/sydney"
              style={{
                padding: '13px 28px',
                backgroundColor: 'transparent',
                color: 'rgba(255,255,255,0.8)',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 600,
                border: '1px solid rgba(255,255,255,0.25)',
              }}
            >
              Browse Sydney suburbs
            </Link>
          </div>
        </div>
      </section>

      {/* ── POPULAR SEARCHES ── */}
      <section style={{ padding: '56px 24px', backgroundColor: S.white }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 800, color: S.n900, marginBottom: '24px' }}>
            Popular Business Location Searches
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
            {POPULAR_SEARCHES.map((search) => (
              <Link
                key={search.label}
                href={search.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '14px 16px',
                  backgroundColor: S.n50,
                  borderRadius: '9px',
                  border: `1px solid ${S.border}`,
                  textDecoration: 'none',
                }}
              >
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '3px 7px',
                    backgroundColor: S.brand,
                    color: S.white,
                    borderRadius: '4px',
                    whiteSpace: 'nowrap',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  {search.tag}
                </span>
                <span style={{ fontSize: '13px', color: S.n800, fontWeight: 500, lineHeight: '1.4' }}>{search.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── BY BUSINESS TYPE ── */}
      <section style={{ padding: '56px 24px', backgroundColor: S.n50 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 800, color: S.n900, marginBottom: '24px' }}>
            Location Strategy by Business Type
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {[
              {
                type: 'Cafés & Specialty Coffee',
                href: '/use-case/cafes',
                cities: 'Sydney → Parramatta, Ryde · Melbourne → Northcote, Fitzroy · Brisbane → New Farm',
                insight: "Customer-to-café ratio is the #1 metric. The inner west is oversaturated. Second-tier suburbs in Sydney and Melbourne offer 3–4x better ratios at 40% lower rent.",
                color: '#92400E',
                bg: '#FEF3C7',
              },
              {
                type: 'Restaurants',
                href: '/use-case/restaurants',
                cities: 'Sydney → Surry Hills, Chatswood · Melbourne → Fitzroy, South Yarra · Brisbane → Paddington',
                insight: "Full-service dining requires $90K+ household income. Only specific suburbs in each city reliably sustain $60–$80 average covers.",
                color: '#991B1B',
                bg: '#FEE2E2',
              },
              {
                type: 'Retail Stores',
                href: '/use-case/retail',
                cities: 'Sydney → Chatswood, Parramatta · Melbourne → South Yarra · Perth → Subiaco',
                insight: "Premium retail clusters in high-income suburbs. Value retail dominates outer-ring and suburban centres. The squeezed middle struggles everywhere.",
                color: '#1E40AF',
                bg: '#DBEAFE',
              },
              {
                type: 'Gyms & Fitness',
                href: '/use-case/gyms',
                cities: 'Sydney → Bondi, Chatswood · Melbourne → Fitzroy, South Yarra · Brisbane → Paddington',
                insight: "Boutique fitness (pilates, yoga, HIIT) clusters in high-income inner suburbs. Budget gyms work in outer-ring residential areas.",
                color: '#065F46',
                bg: '#D1FAE5',
              },
            ].map((bt) => (
              <Link key={bt.type} href={bt.href} style={{ textDecoration: 'none' }}>
                <div style={{ padding: '20px', backgroundColor: S.white, borderRadius: '10px', border: `1px solid ${S.border}`, height: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', backgroundColor: bt.bg, color: bt.color, borderRadius: '4px' }}>
                      {bt.type}
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: S.muted, lineHeight: '1.6', margin: '0 0 10px' }}>{bt.insight}</p>
                  <p style={{ fontSize: '11px', color: S.mutedLight, lineHeight: '1.5', margin: 0 }}>{bt.cities}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '64px 24px', backgroundColor: S.white }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: S.n900, marginBottom: '36px', lineHeight: '1.3' }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {[
              {
                q: 'What is the best city to start a business in Australia?',
                a: "Melbourne scores highest (91) for hospitality and creative businesses due to its sophisticated consumer base and café culture. Sydney scores 88 but comes with significantly higher commercial rents. Brisbane is the growth-upside market — lower rents, strong population migration, and Olympics infrastructure. The 'best' city depends on your business type, capital capacity, and risk tolerance.",
              },
              {
                q: 'Which Australian city has the cheapest commercial rent?',
                a: "Adelaide is consistently the most affordable major Australian capital — retail positions from $1,200/month, compared to $7,000–$14,000 in Sydney's inner suburbs. Perth and Brisbane also offer materially lower rents. The cheapest rent isn't always best value — the metric that matters is revenue-per-dollar-of-rent, not absolute rent.",
              },
              {
                q: 'Is it better to open in a CBD or a suburb?',
                a: "For most independent operators, a strong suburban commercial strip outperforms CBD on risk-adjusted economics. CBD locations offer maximum foot traffic at rent levels that require extraordinary volume. Parramatta (Sydney), Fitzroy (Melbourne), and Paddington (Brisbane) each offer inner-city consumer demographics at 40–60% lower rent than their respective CBDs.",
              },
              {
                q: 'Where should I open a café in Australia?',
                a: "Melbourne's inner north (Fitzroy, Northcote) has the most sophisticated coffee culture but high saturation. Sydney's second-tier suburbs (Ryde, Hornsby, Parramatta) have the best customer-to-café ratios. Brisbane's Paddington and New Farm are underserved premium markets. The single most consistent factor for café success is customer-to-venue ratio, not prestige of location.",
              },
              {
                q: 'How does Locatalyze score locations?',
                a: 'Locatalyze uses a six-factor weighted suburb model: foot traffic density (22%), demographic income and spending (18%), commercial rent viability (25%), competitive density and competition gap (15%), accessibility and transport (12%), and growth trajectory (8%). Each factor is calibrated by business type — for example a café weights foot traffic higher than a professional services fit-out.',
              },
              {
                q: 'Is Parramatta a good place to open a café or restaurant?',
                a: "Yes — Parramatta is one of Sydney's strongest emerging hospitality markets. Specialty coffee scores 89/100 (GO verdict), with projected monthly revenue of $22,000–$34,000. Commercial rents of $4,500–$7,000/month are roughly 40% below Sydney CBD. A $48 billion urban renewal program is driving sustained population and spending growth through to 2030.",
              },
              {
                q: 'Is Ultimo Sydney good for a small business?',
                a: "Ultimo scores 68/100 (CAUTION) — highly polarised by the academic calendar. The 45,000+ UTS student population drives strong weekday daytime demand, but foot traffic drops 60–70% during the 15-week semester break. Healthcare, allied health and co-working businesses outperform hospitality operators who depend on student volume. Commercial rents from $4,500/month on Harris Street.",
              },
              {
                q: 'What is the break-even revenue for a café in Sydney?',
                a: "Break-even varies sharply by suburb. In Sydney CBD, a café needs $420,000–$600,000/year to cover $11,000–$14,000/month rent. In Parramatta, the same break-even is $280,000–$360,000 against $4,500–$7,000/month rent. In Ultimo, break-even is $240,000–$300,000 but must be modelled across 37 active trading weeks — not 52 — to account for the semester break.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                style={{
                  padding: '24px 0',
                  borderBottom: `1px solid ${S.border}`,
                }}
              >
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: S.n900, marginBottom: '10px', lineHeight: '1.4' }}>
                  {faq.q}
                </h3>
                <p style={{ fontSize: '14px', color: S.muted, lineHeight: '1.75', margin: 0 }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section
        style={{
          padding: '72px 24px',
          background: `linear-gradient(135deg, #047857 0%, ${S.emerald} 100%)`,
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '34px', fontWeight: 900, color: '#0F172A', marginBottom: '16px', lineHeight: '1.2' }}>
            Stop guessing. Start analysing.
          </h2>
          <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.88)', marginBottom: '32px', lineHeight: '1.65' }}>
            Choosing the wrong location is the single most common reason Australian small businesses fail in year one. One analysis takes about 90 seconds and is completely free.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/onboarding"
              style={{
                padding: '16px 36px',
                backgroundColor: S.white,
                color: S.emerald,
                borderRadius: '9px',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: 800,
              }}
            >
              Analyse your address free →
            </Link>
            <Link
              href="#cities"
              style={{
                padding: '16px 28px',
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: S.white,
                borderRadius: '9px',
                textDecoration: 'none',
                fontSize: '15px',
                fontWeight: 600,
                border: '2px solid rgba(255,255,255,0.4)',
              }}
            >
              Browse city guides
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER NAV ── */}
      <section style={{ padding: '28px 24px', backgroundColor: S.n50, borderTop: `1px solid ${S.border}` }}>
        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            display: 'flex',
            gap: '20px',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '13px',
          }}
        >
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Link href="/analyse/sydney" style={{ color: S.brand, textDecoration: 'none', fontWeight: 600 }}>Sydney</Link>
            <Link href="/analyse/sydney/parramatta" style={{ color: S.muted, textDecoration: 'none' }}>Parramatta</Link>
            <Link href="/analyse/sydney/ultimo" style={{ color: S.muted, textDecoration: 'none' }}>Ultimo</Link>
            <Link href="/analyse/melbourne" style={{ color: S.brand, textDecoration: 'none', fontWeight: 600 }}>Melbourne</Link>
            <Link href="/analyse/brisbane" style={{ color: S.brand, textDecoration: 'none', fontWeight: 600 }}>Brisbane</Link>
            <Link href="/analyse/perth" style={{ color: S.brand, textDecoration: 'none', fontWeight: 600 }}>Perth</Link>
            <Link href="/analyse/adelaide" style={{ color: S.brand, textDecoration: 'none', fontWeight: 600 }}>Adelaide</Link>
          </div>
          <div style={{ color: S.mutedLight }}>
            © 2026 Locatalyze · Australian Business Location Intelligence
          </div>
        </div>
      </section>
    </div>
  )
}
