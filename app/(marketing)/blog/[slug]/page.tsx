import Link from 'next/link'

const S = {
  brand: '#0F766E', brandLight: '#14B8A6', brandFaded: '#F0FDFA', brandBorder: '#99F6E4',
  n50: '#FAFAF9', n100: '#F5F5F4', n200: '#E7E5E4', n400: '#A8A29E', n500: '#78716C',
  n700: '#44403C', n800: '#292524', n900: '#1C1917', white: '#FFFFFF',
  headerBg: '#0C1F1C', font: "'DM Sans', sans-serif",
  amber: '#D97706',
}

const POSTS: Record<string, {
  category: string; date: string; readTime: string; emoji: string
  title: string; intro: string; sections: { heading: string; body: string }[]
}> = {
  'cafe-location-guide-australia': {
    category: 'Cafes', date: 'Feb 28, 2026', readTime: '6 min read', emoji: '☕',
    title: 'How to choose the perfect café location in Australia (2026 guide)',
    intro: 'The difference between a thriving café and a closed one often comes down to one decision made before the doors ever opened. Location is not just important — it is everything. Here is what the data says about picking the right site.',
    sections: [
      { heading: 'Foot traffic is your revenue engine', body: 'For a café, the morning commuter window between 7am and 9am is where a majority of revenue is made. Before you sign anything, visit the location at 7am on a Tuesday. Count pedestrians for 10 minutes. A viable café site in a suburban setting needs at least 40–60 people per hour passing. In a CBD, the bar is much higher.' },
      { heading: 'The rent-to-revenue test', body: 'Café rent should sit below 12% of your monthly revenue. At an average spend of $9–12 per customer, you need to run the numbers carefully. A $4,000/month lease requires roughly 400–450 transactions per month just to cover rent — before staff, COGS or any other costs.' },
      { heading: 'Competition: friend or foe?', body: 'Two or three cafes nearby is actually healthy — it signals the market exists and customers are in the habit of buying coffee in that area. What you want to avoid is direct saturation: more than five cafes within 200 metres is a red flag unless foot traffic is exceptionally high.' },
      { heading: 'Demographic signals that matter', body: 'Look for suburbs with high proportions of professionals aged 25–45, above-average household income, and proximity to office precincts. ABS Census data by suburb gives you household income, age breakdown, and employment type — all of which predict coffee spend.' },
      { heading: 'Use data before you visit', body: 'Running a Locatalyze analysis on any Australian address gives you a competition score, demographic breakdown, estimated daily customer count and a financial model — in 30 seconds. It will not replace a site visit, but it will tell you whether a visit is worth making.' },
    ],
  },
  'restaurant-lease-mistakes': {
    category: 'Restaurants', date: 'Feb 14, 2026', readTime: '5 min read', emoji: '🍽️',
    title: '7 lease mistakes Australian restaurant owners make — and how to avoid them',
    intro: 'Signing a commercial lease without proper due diligence is the number one reason new restaurants fail in their first year. These are the traps to watch for.',
    sections: [
      { heading: '1. Signing without a market study', body: 'Most restaurant owners visit a location once, like the feel of it, and sign. A proper market study takes a week — competitor mapping, demographic analysis, foot traffic counts at different times and days. Skip this and you are betting hundreds of thousands on instinct.' },
      { heading: '2. Ignoring the rent-to-revenue ratio', body: 'Restaurant rent above 15% of projected monthly revenue is a serious warning sign. Above 20% is almost always fatal. Run the numbers before you fall in love with a space.' },
      { heading: '3. Overlooking extraction and fit-out costs', body: 'A venue without existing commercial kitchen infrastructure can add $80,000–$150,000 in fit-out costs. Always factor this into your total site cost before comparing locations.' },
      { heading: '4. Not testing the evening trade', body: 'A street that looks busy at lunchtime can be dead at dinner. Visit at 7:30pm on a Friday before committing. Are neighbouring restaurants busy? Are people walking around looking for somewhere to eat?' },
      { heading: '5. Underestimating seasonal risk', body: 'Some locations are highly seasonal — tourist areas, beach suburbs, event precincts. If your revenue model depends on peak-season trade to subsidise quiet months, your cash flow needs to reflect that.' },
      { heading: '6. Ignoring parking', body: 'Dinner diners drive. A restaurant with no parking within 400 metres will lose a meaningful percentage of would-be customers — especially families and older demographics.' },
      { heading: '7. Not getting a lawyer to review the lease', body: 'Commercial leases are complex. Rent review clauses, make-good obligations, and exclusivity clauses can cost you tens of thousands. A commercial tenancy solicitor costs $500–1,500 to review a lease. It is always worth it.' },
    ],
  },
  'foot-traffic-vs-demographics': {
    category: 'Strategy', date: 'Jan 30, 2026', readTime: '7 min read', emoji: '📊',
    title: 'Foot traffic vs demographics: which matters more for your business?',
    intro: 'A busy street is not always a profitable one. We break down when foot traffic wins, when demographics are the real driver, and how to weight both for your specific business type.',
    sections: [
      { heading: 'The foot traffic case', body: 'For impulse-purchase businesses — cafes, takeaway, convenience retail — foot traffic is the primary revenue driver. If people are not walking past, you are invisible. No amount of great product or demographics compensates for zero eyeballs.' },
      { heading: 'The demographics case', body: 'For destination businesses — specialty retail, gyms, medical services, professional services — customers seek you out deliberately. Demographics matter more than pedestrian volume. A gym in a low-foot-traffic suburb with 15,000 households within 3km will outperform one on a busy street surrounded by retirees.' },
      { heading: 'How to weight them', body: 'Ask yourself: would a customer specifically search for and travel to my business? If yes, demographics dominate. If your business depends on passing trade and impulse decisions, foot traffic is the primary signal. Most businesses fall somewhere in between.' },
      { heading: 'The Locatalyze approach', body: 'Our scoring model weights foot traffic (proxied by daytime population density and commuter flow) and demographics separately, then combines them based on your business type. A café and a gym in the same location will get different scores because the weighting differs.' },
    ],
  },
  'retail-competition-scoring': {
    category: 'Retail', date: 'Jan 16, 2026', readTime: '4 min read', emoji: '👗',
    title: 'Understanding competition scoring: what 500m really means for retail',
    intro: 'Our competition model looks at businesses within a 500m radius. Here is why that radius matters, and what the intensity score is actually measuring.',
    sections: [
      { heading: 'Why 500m?', body: 'Research consistently shows that for street-level retail, the effective competitive radius is 400–600m. Beyond that, customers make a deliberate decision to travel — which means competition becomes less direct. Within 500m, a competitor is a daily alternative in the customer mind.' },
      { heading: 'What gets counted', body: 'We count businesses in the same category (or near-category) from OpenStreetMap data. For a café, we count all cafes, bakeries and takeaway coffee. For a gym, we count gyms, yoga studios, pilates and CrossFit boxes.' },
      { heading: 'The intensity score', body: 'It is not just a count. A street with 6 small independent cafes scores differently to a street with 3 cafes including a Gloria Jeans and a Hudsons. We weight by competitor size and type where data allows.' },
      { heading: 'High competition is not always bad', body: 'A high competition score in a high-traffic precinct can still produce a GO verdict if demand exceeds supply. The model looks at both sides of the equation.' },
    ],
  },
  'suburb-data-australia': {
    category: 'Data', date: 'Jan 3, 2026', readTime: '5 min read', emoji: '🏘️',
    title: 'How we use ABS census data to score Australian suburbs',
    intro: 'Population density, median income, household type — learn how every suburb in Australia gets scored and what the numbers actually mean for your business.',
    sections: [
      { heading: 'The ABS Census as a business tool', body: 'The Australian Bureau of Statistics Census collects data on every household in Australia every five years. The 2021 Census data covers population, income, age, household type, employment and more — broken down to the suburb level (Statistical Area Level 2).' },
      { heading: 'Median household income', body: 'This is one of our strongest demand signals. Higher median income correlates with higher discretionary spend — better for cafes, specialty retail, gyms and restaurants. Lower income suburbs are not non-viable, but price point and business type need to match.' },
      { heading: 'Age and household type', body: 'A suburb of young professionals (25–35, singles and couples) has a different demand profile to a suburb of families with young children or retirees. We match your business type to the demographic profile that most predicts demand.' },
      { heading: 'Population density and growth', body: 'Raw population within the catchment area matters. A suburb of 8,000 people within 1km is a different opportunity to one with 2,000. Growth projections (where available) tell you whether you are entering a growing or declining catchment.' },
    ],
  },
  'gym-location-analysis': {
    category: 'Gyms', date: 'Dec 18, 2025', readTime: '5 min read', emoji: '💪',
    title: 'Opening a gym in Australia? Here is what location data actually tells you',
    intro: 'The gym market is more competitive than ever. Before you commit to a lease, here is how to read the signals that separate viable locations from expensive mistakes.',
    sections: [
      { heading: 'The saturation problem', body: 'Australia has one of the highest gym-per-capita rates in the world. 24/7 gyms (Anytime Fitness, Snap Fitness, Plus Fitness) have blanketed the suburbs. A boutique gym needs a meaningful point of difference AND a location with manageable direct competition within 1km.' },
      { heading: 'Residential density is everything', body: 'Unlike cafes, gyms are destination businesses. Most members come from within 3km. A suburb with 10,000+ households within that radius is viable territory. One with 3,000 is very difficult unless you have a highly specialised offering (CrossFit, martial arts, etc).' },
      { heading: 'What the competition score means for gyms', body: 'For gyms, we extend our competition radius to 2km rather than 500m. A 24/7 gym 800m away is a direct competitor. We count all fitness operators — gyms, yoga, pilates, CrossFit, personal training studios — not just traditional gyms.' },
      { heading: 'The membership math', body: 'A 300sqm boutique gym at $4,500/month rent, staffed by 2 part-time employees, needs roughly 180–220 active members at $60/week to break even. Model your specific pricing and cost structure before committing to a floor plate.' },
    ],
  },
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = POSTS[slug]

  if (!post) {
    return (
      <>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <div style={{ minHeight: '100vh', background: S.n50, fontFamily: S.font, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', textAlign: 'center', padding: 40 }}>
          <span style={{ fontSize: 48, marginBottom: 16 }}>📭</span>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: S.n900, marginBottom: 8 }}>Article not found</h1>
          <p style={{ fontSize: 15, color: S.n500, marginBottom: 24 }}>This article may have moved or been updated.</p>
          <Link href="/blog" style={{ background: S.brand, color: '#fff', borderRadius: 10, padding: '11px 24px', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>← Back to blog</Link>
        </div>
      </>
    )
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <div style={{ minHeight: '100vh', background: S.n50, fontFamily: S.font }}>

        {/* Hero */}
        <div style={{ background: S.headerBg, padding: '60px 24px 48px', textAlign: 'center' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 32 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg,${S.brand},${S.brandLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 13 }}>L</div>
            <span style={{ fontWeight: 800, fontSize: 15, color: '#F9FAFB', letterSpacing: '-0.02em' }}>Locatalyze</span>
          </Link>
          <span style={{ fontSize: 48, display: 'block', marginBottom: 14 }}>{post.emoji}</span>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(15,118,110,0.15)', border: '1px solid rgba(15,118,110,0.3)', borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700, color: S.brandLight, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 14 }}>{post.category}</div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#F9FAFB', letterSpacing: '-0.5px', lineHeight: 1.25, maxWidth: 640, margin: '0 auto 16px' }}>{post.title}</h1>
          <p style={{ fontSize: 13, color: '#6B7280' }}>{post.date} · {post.readTime}</p>
        </div>

        {/* Article body */}
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 24px 80px' }}>

          {/* Intro */}
          <p style={{ fontSize: 17, color: S.n700, lineHeight: 1.8, marginBottom: 40, fontWeight: 500 }}>{post.intro}</p>

          {/* Sections */}
          {post.sections.map((section, i) => (
            <div key={i} style={{ marginBottom: 36 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: S.n900, letterSpacing: '-0.02em', marginBottom: 12 }}>{section.heading}</h2>
              <p style={{ fontSize: 15, color: S.n500, lineHeight: 1.85 }}>{section.body}</p>
            </div>
          ))}

          {/* CTA */}
          <div style={{ background: `linear-gradient(135deg,${S.brand},#0891B2)`, borderRadius: 20, padding: '36px', textAlign: 'center', marginTop: 48 }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 10 }}>Ready to analyse your location?</h3>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 20 }}>Get a full feasibility report for any Australian address in 30 seconds. Free to start.</p>
            <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fff', color: S.brand, borderRadius: 10, padding: '11px 24px', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
              Run my free analysis →
            </Link>
          </div>

          {/* Back link */}
          <div style={{ marginTop: 32, textAlign: 'center' }}>
            <Link href="/blog" style={{ fontSize: 14, color: S.brand, fontWeight: 600, textDecoration: 'none' }}>← Back to all articles</Link>
          </div>
        </div>
      </div>
    </>
  )
}