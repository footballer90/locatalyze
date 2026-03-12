'use client'
export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { useState } from 'react'
import { POST_LIST } from '@/lib/blog-posts'

const S = {
  brand: '#0F766E', brandLight: '#14B8A6', brandFaded: '#F0FDFA', brandBorder: '#99F6E4',
  n50: '#FAFAF9', n100: '#F5F5F4', n200: '#E7E5E4', n400: '#A8A29E', n500: '#78716C',
  n700: '#44403C', n900: '#1C1917', white: '#FFFFFF',
  headerBg: '#0C1F1C', font: "'DM Sans', sans-serif",
}

const CATS = ['All', 'Cafes', 'Restaurants', 'Gyms', 'Retail', 'Finance', 'Strategy', 'Data', 'Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Tools']

export default function BlogPage() {
  const [cat, setCat] = useState('All')
  const filtered = cat === 'All' ? POST_LIST : POST_LIST.filter(p => p.category === cat)
  const [featured, ...rest] = POST_LIST

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <div style={{ minHeight: '100vh', background: S.n50, fontFamily: S.font }}>

        {/* Header */}
        <div style={{ background: S.headerBg, padding: '60px 24px 48px' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 32 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#0F766E,#14B8A6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 13 }}>L</div>
              <span style={{ fontWeight: 800, fontSize: 15, color: '#F9FAFB', letterSpacing: '-0.02em' }}>Locatalyze</span>
            </Link>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(15,118,110,0.15)', border: '1px solid rgba(15,118,110,0.3)', borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700, color: S.brandLight, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 14 }}>Location intelligence blog</div>
            <h1 style={{ fontSize: 'clamp(26px,5vw,40px)', fontWeight: 800, color: '#F9FAFB', letterSpacing: '-0.04em', lineHeight: 1.2, marginBottom: 10 }}>Guides, data and insights for<br />Australian founders</h1>
            <p style={{ fontSize: 14, color: '#6B7280' }}>{POST_LIST.length} articles covering location strategy, market analysis and business planning.</p>
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 20px 80px' }}>

          {/* Featured */}
          <Link href={`/blog/${featured.slug}`} style={{ textDecoration: 'none', display: 'block', marginBottom: 48 }}>
            <div style={{ background: S.white, borderRadius: 20, overflow: 'hidden', border: `1px solid ${S.n200}`, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
              <img src={featured.heroImg} alt={featured.title} style={{ width: '100%', height: 300, objectFit: 'cover', display: 'block' }} />
              <div style={{ padding: '28px 32px' }}>
                <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ background: S.brandFaded, color: S.brand, borderRadius: 20, padding: '3px 12px', fontSize: 11, fontWeight: 700, border: `1px solid ${S.brandBorder}` }}>Featured · {featured.category}</span>
                  <span style={{ fontSize: 12, color: S.n400 }}>{featured.date} · {featured.readTime}</span>
                </div>
                <h2 style={{ fontSize: 'clamp(19px,3vw,25px)', fontWeight: 800, color: S.n900, letterSpacing: '-0.03em', marginBottom: 10, lineHeight: 1.3 }}>{featured.title}</h2>
                <p style={{ fontSize: 14, color: S.n500, lineHeight: 1.75, marginBottom: 16 }}>{featured.intro.slice(0, 180)}...</p>
                <span style={{ fontSize: 13, color: S.brand, fontWeight: 700 }}>Read article →</span>
              </div>
            </div>
          </Link>

          {/* Category Filter */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)}
                style={{ padding: '6px 14px', borderRadius: 20, border: `1.5px solid ${cat === c ? S.brand : S.n200}`, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: S.font, background: cat === c ? S.brand : S.white, color: cat === c ? '#fff' : S.n500, transition: 'all 0.15s' }}>
                {c}
              </button>
            ))}
          </div>
          <p style={{ fontSize: 12, color: S.n400, marginBottom: 20 }}>{filtered.length} articles</p>

          {/* Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(288px,1fr))', gap: 18, marginBottom: 56 }}>
            {filtered.map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <img src={post.heroImg} alt={post.title} style={{ width: '100%', height: 170, objectFit: 'cover', display: 'block' }} />
                  <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 9, alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ background: S.brandFaded, color: S.brand, borderRadius: 20, padding: '2px 9px', fontSize: 10, fontWeight: 700 }}>{post.category}</span>
                      <span style={{ fontSize: 11, color: S.n400 }}>{post.readTime}</span>
                    </div>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: S.n900, lineHeight: 1.45, marginBottom: 8, flex: 1 }}>{post.title}</h3>
                    <p style={{ fontSize: 12, color: S.n500, lineHeight: 1.65, marginBottom: 12 }}>{post.intro.slice(0, 100)}...</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: S.n400 }}>{post.date}</span>
                      <span style={{ fontSize: 12, color: S.brand, fontWeight: 700 }}>Read →</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Newsletter */}
          <div style={{ background: S.n900, borderRadius: 20, padding: '40px', textAlign: 'center' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: S.brandLight, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Weekly insights</p>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: '#F9FAFB', letterSpacing: '-0.03em', marginBottom: 10 }}>Location intelligence in your inbox</h3>
            <p style={{ fontSize: 14, color: '#9CA3AF', marginBottom: 24 }}>One email per week. Suburb analysis, market trends and business location strategy for Australian founders.</p>
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