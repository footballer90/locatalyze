// components/CityBlogSection.tsx
// Reusable blog section for city hub pages (/analyse/sydney, /analyse/perth etc)
// Pull posts matching city tag from POST_LIST

import Link from 'next/link'
import { POST_LIST } from '@/lib/blog-posts'

const S = {
  brand: '#0F766E', brandLight: '#14B8A6',
  brandFaded: '#F0FDFA', brandBorder: '#99F6E4',
  n50: '#FAFAF9', n100: '#F5F5F4', n200: '#E7E5E4',
  n400: '#A8A29E', n500: '#78716C', n900: '#1C1917',
  white: '#FFFFFF',
}

interface Props {
  city: string        // e.g. 'Sydney', 'Perth'
  citySlug: string    // e.g. 'sydney', 'perth'
  max?: number
}

export default function CityBlogSection({ city, citySlug, max = 4 }: Props) {
  // Match posts by category (city name) or by tags/title containing the city
  const cityPosts = POST_LIST.filter(p =>
    p.category === city ||
    p.tags?.some((t: string) => t.toLowerCase().includes(citySlug)) ||
    p.title.toLowerCase().includes(citySlug)
  ).slice(0, max)

  // Fallback: grab strategy posts if no city-specific ones
  const fallback = POST_LIST.filter(p =>
    ['Strategy', 'Finance', 'Data'].includes(p.category)
  ).slice(0, max)

  const posts = cityPosts.length >= 2 ? cityPosts : fallback

  if (posts.length === 0) return null

  return (
    <section style={{ marginBottom: 52 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
        <div>
          <h2 style={{
            fontSize: 22, fontWeight: 900, color: S.n900,
            letterSpacing: '-0.03em', marginBottom: 4,
          }}>
            From the blog
          </h2>
          <p style={{ fontSize: 14, color: S.n500 }}>
            Location guides and market analysis for {city}
          </p>
        </div>
        <Link
          href="/blog"
          style={{
            fontSize: 13, fontWeight: 700, color: S.brand,
            textDecoration: 'none',
          }}
        >
          All articles →
        </Link>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 14,
      }}>
        {posts.map(post => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            style={{ textDecoration: 'none' }}
          >
            <div style={{
              background: S.white,
              border: `1px solid ${S.n200}`,
              borderRadius: 12,
              overflow: 'hidden',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'border-color 0.15s',
            }}>
              <img
                src={post.heroImg}
                alt={post.title}
                style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }}
              />
              <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 8 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700,
                    color: S.brand, textTransform: 'uppercase' as const,
                    letterSpacing: '0.05em',
                    background: S.brandFaded,
                    border: `1px solid ${S.brandBorder}`,
                    borderRadius: 4, padding: '2px 7px',
                  }}>
                    {post.category}
                  </span>
                  <span style={{ fontSize: 11, color: S.n400 }}>{post.readTime}</span>
                </div>
                <p style={{
                  fontSize: 13, fontWeight: 700, color: S.n900,
                  lineHeight: 1.45, marginBottom: 8, flex: 1,
                  letterSpacing: '-0.01em',
                }}>
                  {post.title}
                </p>
                <span style={{ fontSize: 12, fontWeight: 700, color: S.brand }}>
                  Read →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}