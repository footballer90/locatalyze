import Link from 'next/link'

const S = {
  brand: '#0F766E', brandLight: '#14B8A6', brandFaded: '#F0FDFA', brandBorder: '#99F6E4',
  n50: '#FAFAF9', n100: '#F5F5F4', n200: '#E7E5E4', n400: '#A8A29E', n500: '#78716C',
  n700: '#44403C', n800: '#292524', n900: '#1C1917', white: '#FFFFFF',
  headerBg: '#0C1F1C', font: "'DM Sans', sans-serif",
  amber: '#D97706',
}

const POSTS = [
  {
    slug: 'cafe-location-guide-australia',
    category: 'Cafes', date: 'Feb 28, 2026', readTime: '8 min read',
    title: 'How to choose the perfect café location in Australia (2026 guide)',
    excerpt: 'Before you spend $80,000 on an espresso machine and fit-out, spend a week on this. The difference between a café that queues out the door and one that closes in 18 months almost always comes down to one decision made before the doors open.',
    img: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800&q=80',
    tags: ['Location strategy', 'Cafes', 'Rent analysis'],
  },
  {
    slug: 'restaurant-lease-mistakes',
    category: 'Restaurants', date: 'Feb 14, 2026', readTime: '6 min read',
    title: '7 commercial lease mistakes Australian restaurant owners make',
    excerpt: 'A commercial lease is the biggest financial commitment most restaurant owners ever make. And yet most sign one without properly understanding what they are agreeing to. Here are the seven mistakes we see repeatedly — and how to avoid every single one.',
    img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    tags: ['Leasing', 'Restaurants', 'Legal'],
  },
  {
    slug: 'foot-traffic-vs-demographics',
    category: 'Strategy', date: 'Jan 30, 2026', readTime: '7 min read',
    title: 'Foot traffic vs demographics: which matters more for your business?',
    excerpt: 'A busy street does not guarantee a profitable business. We break down the situations where foot traffic is king, when demographics are the real driver, and the formula for weighting both against your specific business model.',
    img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
    tags: ['Data', 'Strategy', 'Demographics'],
  },
  {
    slug: 'retail-competition-scoring',
    category: 'Retail', date: 'Jan 16, 2026', readTime: '5 min read',
    title: 'Understanding competition scoring: what 500m really means for retail',
    excerpt: 'Our competition model radius is 500m. That might seem arbitrary, but there is strong research behind it. Here is what the 500m metric is actually measuring, why competitor count alone is not the whole picture, and when high competition can actually be a good sign.',
    img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
    tags: ['Retail', 'Competition', 'Data'],
  },
  {
    slug: 'suburb-data-australia',
    category: 'Data', date: 'Jan 3, 2026', readTime: '6 min read',
    title: 'How ABS census data scores Australian suburbs for business viability',
    excerpt: 'The 2021 Australian Census is one of the most detailed datasets ever collected about where Australians live, earn and spend. Here is how we use it to score every suburb in the country — and what the numbers actually mean when you are choosing a location.',
    img: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80',
    tags: ['Data', 'ABS', 'Demographics'],
  },
  {
    slug: 'gym-location-analysis',
    category: 'Gyms', date: 'Dec 18, 2025', readTime: '6 min read',
    title: 'Opening a gym in Australia? What location data actually tells you',
    excerpt: 'Australia has one of the highest gym densities in the world. 24/7 chains have blanketed the suburbs. Before you commit to 300sqm and a 5-year lease, here is how to read the data that separates a viable location from an expensive mistake.',
    img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
    tags: ['Gyms', 'Fitness', 'Competition'],
  },
]

const CATEGORIES = ['All', 'Cafes', 'Restaurants', 'Retail', 'Gyms', 'Strategy', 'Data']

export default function BlogPage() {
  const [featured, ...rest] = POSTS

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <div style={{ minHeight: '100vh', background: S.n50, fontFamily: S.font }}>

        {/* Header */}
        <div style={{ background: S.headerBg, padding: '60px 24px 48px' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 36 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg,${S.brand},${S.brandLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 13 }}>L</div>
              <span style={{ fontWeight: 800, fontSize: 15, color: '#F9FAFB', letterSpacing: '-0.02em' }}>Locatalyze</span>
            </Link>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(15,118,110,0.15)', border: '1px solid rgba(15,118,110,0.3)', borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700, color: S.brandLight, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 14 }}>The Locatalyze Blog</div>
                <h1 style={{ fontSize: 'clamp(26px, 5vw, 40px)', fontWeight: 800, color: '#F9FAFB', letterSpacing: '-0.04em', lineHeight: 1.2 }}>Location intelligence<br />for Australian founders</h1>
              </div>
              <p style={{ fontSize: 14, color: '#6B7280', maxWidth: 280 }}>Guides, data deep-dives and honest analysis for business owners making location decisions.</p>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 20px 80px' }}>

          {/* Featured post */}
          <div style={{ background: S.white, borderRadius: 20, overflow: 'hidden', border: `1px solid ${S.n200}`, marginBottom: 48, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
            <img src={featured.img} alt={featured.title} style={{ width: '100%', height: 320, objectFit: 'cover', display: 'block' }} />
            <div style={{ padding: '28px 32px' }}>
              <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
                <span style={{ background: S.brandFaded, color: S.brand, borderRadius: 20, padding: '3px 12px', fontSize: 11, fontWeight: 700, border: `1px solid ${S.brandBorder}` }}>{featured.category}</span>
                <span style={{ fontSize: 12, color: S.n400 }}>{featured.date}</span>
                <span style={{ fontSize: 12, color: S.n400 }}>·</span>
                <span style={{ fontSize: 12, color: S.n400 }}>{featured.readTime}</span>
              </div>
              <h2 style={{ fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 800, color: S.n900, letterSpacing: '-0.03em', marginBottom: 12, lineHeight: 1.3 }}>{featured.title}</h2>
              <p style={{ fontSize: 15, color: S.n500, lineHeight: 1.75, marginBottom: 20 }}>{featured.excerpt}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {featured.tags.map(tag => (
                    <span key={tag} style={{ background: S.n50, color: S.n500, border: `1px solid ${S.n200}`, borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 600 }}>{tag}</span>
                  ))}
                </div>
                <Link href={`/blog/${featured.slug}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: S.brand, color: '#fff', borderRadius: 9, padding: '10px 20px', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                  Read article →
                </Link>
              </div>
            </div>
          </div>

          {/* Category pills */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <span key={cat} style={{ background: cat === 'All' ? S.brand : S.white, color: cat === 'All' ? '#fff' : S.n500, border: `1.5px solid ${cat === 'All' ? S.brand : S.n200}`, borderRadius: 20, padding: '6px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                {cat}
              </span>
            ))}
          </div>

          {/* Post grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 20, marginBottom: 56 }}>
            {rest.map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <img src={post.img} alt={post.title} style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }} />
                  <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'center' }}>
                      <span style={{ background: S.brandFaded, color: S.brand, borderRadius: 20, padding: '2px 9px', fontSize: 10, fontWeight: 700 }}>{post.category}</span>
                      <span style={{ fontSize: 11, color: S.n400 }}>{post.readTime}</span>
                    </div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: S.n900, lineHeight: 1.4, marginBottom: 10, flex: 1 }}>{post.title}</h3>
                    <p style={{ fontSize: 13, color: S.n500, lineHeight: 1.65, marginBottom: 14 }}>{post.excerpt.slice(0, 120)}...</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: S.n400 }}>{post.date}</span>
                      <span style={{ fontSize: 13, color: S.brand, fontWeight: 700 }}>Read →</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Newsletter signup */}
          <div style={{ background: S.n900, borderRadius: 20, padding: '40px', textAlign: 'center' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: S.brandLight, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Weekly insights</p>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: '#F9FAFB', letterSpacing: '-0.03em', marginBottom: 10 }}>Get location insights in your inbox</h3>
            <p style={{ fontSize: 14, color: '#9CA3AF', marginBottom: 24 }}>One email per week. New suburb analysis, market trends, and location strategy for Australian founders.</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <input type="email" placeholder="your@email.com"
                style={{ padding: '12px 16px', borderRadius: 10, border: 'none', fontSize: 14, fontFamily: S.font, outline: 'none', minWidth: 240, color: S.n900 }} />
              <button style={{ padding: '12px 24px', background: S.brand, color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: S.font }}>
                Subscribe →
              </button>
            </div>
            <p style={{ fontSize: 11, color: '#4B5563', marginTop: 10 }}>No spam. Unsubscribe any time.</p>
          </div>
        </div>
      </div>
    </>
  )
}