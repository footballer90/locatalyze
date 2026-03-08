import Link from 'next/link'

const S = {
  brand: '#0F766E', brandLight: '#14B8A6', brandFaded: '#F0FDFA', brandBorder: '#99F6E4',
  n50: '#FAFAF9', n100: '#F5F5F4', n200: '#E7E5E4', n400: '#A8A29E', n500: '#78716C',
  n700: '#44403C', n800: '#292524', n900: '#1C1917', white: '#FFFFFF',
  headerBg: '#0C1F1C', font: "'DM Sans', sans-serif",
}

const POSTS = [
  {
    slug: 'cafe-location-guide-australia',
    category: 'Cafes', date: 'Feb 28, 2026', readTime: '6 min read',
    title: 'How to choose the perfect café location in Australia (2026 guide)',
    excerpt: 'The difference between a thriving café and a closed one often comes down to one decision made before the doors ever opened. Here is what the data says.',
    emoji: '☕',
  },
  {
    slug: 'restaurant-lease-mistakes',
    category: 'Restaurants', date: 'Feb 14, 2026', readTime: '5 min read',
    title: '7 lease mistakes Australian restaurant owners make — and how to avoid them',
    excerpt: 'Signing a commercial lease without proper due diligence is the number one reason new restaurants fail in their first year. These are the traps to watch for.',
    emoji: '🍽️',
  },
  {
    slug: 'foot-traffic-vs-demographics',
    category: 'Strategy', date: 'Jan 30, 2026', readTime: '7 min read',
    title: 'Foot traffic vs demographics: which matters more for your business?',
    excerpt: 'A busy street is not always a profitable one. We break down when foot traffic wins, when demographics are the real driver, and how to weight both.',
    emoji: '📊',
  },
  {
    slug: 'retail-competition-scoring',
    category: 'Retail', date: 'Jan 16, 2026', readTime: '4 min read',
    title: 'Understanding competition scoring: what 500m really means for retail',
    excerpt: 'Our competition model looks at businesses within a 500m radius. Here is why that radius matters, and what the intensity score is actually measuring.',
    emoji: '👗',
  },
  {
    slug: 'suburb-data-australia',
    category: 'Data', date: 'Jan 3, 2026', readTime: '5 min read',
    title: 'How we use ABS census data to score Australian suburbs',
    excerpt: 'Population density, median income, household type — learn how every suburb in Australia gets scored and what the numbers actually mean for your business.',
    emoji: '🏘️',
  },
  {
    slug: 'gym-location-analysis',
    category: 'Gyms', date: 'Dec 18, 2025', readTime: '5 min read',
    title: 'Opening a gym in Australia? Here is what location data actually tells you',
    excerpt: 'The gym market is more competitive than ever. Before you commit to a lease, here is how to read the signals that separate viable locations from expensive mistakes.',
    emoji: '💪',
  },
]

export default function BlogPage() {
  const [featured, ...rest] = POSTS

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
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(15,118,110,0.15)', border: '1px solid rgba(15,118,110,0.3)', borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700, color: S.brandLight, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 16 }}>Blog</div>
          <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#F9FAFB', letterSpacing: '-0.5px', marginBottom: 12 }}>Location insights for Australian founders</h1>
          <p style={{ fontSize: 15, color: '#9CA3AF', maxWidth: 480, margin: '0 auto' }}>Guides, data explainers and strategy for business owners choosing their next location.</p>
        </div>

        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 24px 80px' }}>

          {/* Featured post */}
          <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 20, overflow: 'hidden', marginBottom: 40, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <div style={{ background: `linear-gradient(135deg,${S.brand},#0891B2)`, padding: '40px', display: 'flex', alignItems: 'center', gap: 24 }}>
              <span style={{ fontSize: 56 }}>{featured.emoji}</span>
              <div>
                <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                  <span style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>{featured.category}</span>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{featured.date} · {featured.readTime}</span>
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.3, marginBottom: 10 }}>{featured.title}</h2>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>{featured.excerpt}</p>
                <Link href={`/blog/${featured.slug}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 16, background: '#fff', color: S.brand, borderRadius: 9, padding: '9px 18px', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                  Read article →
                </Link>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {rest.map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 16, padding: '24px', height: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', transition: 'box-shadow 0.2s' }}>
                  <span style={{ fontSize: 32, display: 'block', marginBottom: 16 }}>{post.emoji}</span>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'center' }}>
                    <span style={{ background: S.brandFaded, color: S.brand, borderRadius: 20, padding: '2px 9px', fontSize: 10, fontWeight: 700 }}>{post.category}</span>
                    <span style={{ fontSize: 11, color: S.n400 }}>{post.readTime}</span>
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: S.n900, lineHeight: 1.4, marginBottom: 8 }}>{post.title}</h3>
                  <p style={{ fontSize: 13, color: S.n500, lineHeight: 1.65, marginBottom: 12 }}>{post.excerpt}</p>
                  <p style={{ fontSize: 11, color: S.n400 }}>{post.date}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div style={{ marginTop: 48, textAlign: 'center', padding: '32px', background: S.brandFaded, border: `1px solid ${S.brandBorder}`, borderRadius: 16 }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: S.n900, marginBottom: 8 }}>Ready to analyse your location?</p>
            <p style={{ fontSize: 14, color: S.n500, marginBottom: 20 }}>Stop reading about location strategy — start using data to make the decision.</p>
            <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: S.brand, color: '#fff', borderRadius: 10, padding: '11px 24px', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
              Analyse my first location free →
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}