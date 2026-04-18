'use client'
// app/(marketing)/blog/PageClient.tsx
// Upgraded blog index — premium publication style, no emojis, wired newsletter

import Link from 'next/link'
import { useState } from 'react'
import { POST_LIST } from '@/lib/blog-posts'
import { onboardingRef, toolsHubRef } from '@/lib/funnel-links'
import { BLOG_CATEGORY_COLORS, BLOG_THEME } from '@/lib/blog-theme'

const S = {
 brand: BLOG_THEME.color.primary,
 brandHover: BLOG_THEME.color.primaryHover,
 brandLight: BLOG_THEME.color.accent,
 brandFaded: BLOG_THEME.color.primarySoft,
 brandBorder: BLOG_THEME.color.primaryBorder,
 n50: BLOG_THEME.color.bg,
 n100: BLOG_THEME.color.surfaceAlt,
 n200: BLOG_THEME.color.border,
 n400: BLOG_THEME.color.textFaint,
 n500: BLOG_THEME.color.textSubtle,
 n700: BLOG_THEME.color.textMuted,
 n900: BLOG_THEME.color.text,
 white: BLOG_THEME.color.surface,
 headerBg: BLOG_THEME.color.headerBg,
 headerBdr: 'rgba(255,255,255,0.09)',
 headerText: BLOG_THEME.color.headerText,
 headerMuted: BLOG_THEME.color.headerMuted,
 font: BLOG_THEME.font.sans,
}

const CATS = [
 'All', 'Cafes', 'Restaurants', 'Gyms', 'Retail',
 'Finance', 'Strategy', 'Data', 'Sydney', 'Melbourne',
 'Brisbane', 'Perth', 'Tools',
]

// Category → muted accent color for the pill
const CAT_COLOR = BLOG_CATEGORY_COLORS

function CategoryPill({ label }: { label: string }) {
 const color = CAT_COLOR[label] || S.brand
  return (
    <span style={{
      display: 'inline-block',
   fontSize: 10, fontWeight: 700,
      color, letterSpacing: '0.05em',
   textTransform: 'uppercase' as const,
   padding: '2px 8px',
   background: `${color}12`,
      borderRadius: 4,
      border: `1px solid ${color}30`,
    }}>
      {label}
    </span>
  )
}

function NewsletterBlock() {
  const [email, setEmail] = useState('')
 const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  async function subscribe() {
    if (!email.includes('@')) return
  setLoading(true)
    try {
      await fetch('/api/newsletter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim().toLowerCase() }),
      })
    } catch {}
    setDone(true)
    setLoading(false)
  }

  return (
    <div style={{
      background: S.headerBg,
      borderRadius: 20,
      padding: '44px 40px',
   textAlign: 'center',
  }}>
      <p style={{
        fontSize: 10, fontWeight: 700, color: S.brandLight,
        textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12,
   }}>
        Weekly briefing
      </p>
      <h3 style={{
        fontSize: BLOG_THEME.type.h2, fontWeight: 800, color: S.headerText,
    letterSpacing: '-0.03em', marginBottom: 10, lineHeight: 1.3,
   }}>
        Location intelligence in your inbox
      </h3>
      <p style={{ fontSize: 14, color: S.headerMuted, marginBottom: 28, maxWidth: 420, margin: '0 auto 28px' }}>
    One email per week. Suburb analysis, rent benchmarks and location strategy for Australian founders.
      </p>

      {done ? (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
     background: S.brandFaded, border: `1px solid ${S.brandBorder}`,
          borderRadius: 12, padding: '12px 24px',
    }}>
          <div style={{ width: 18, height: 18, borderRadius: '50%', background: S.brand, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: '#fff', fontSize: 10, fontWeight: 900 }}></span>
     </div>
          <span style={{ fontSize: 14, fontWeight: 600, color: S.brand }}>You're subscribed. Check your inbox.</span>
    </div>
      ) : (
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' as const }}>
     <input
            className="blog-input"
            type="email"
      placeholder="your@email.com"
      value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && subscribe()}
      style={{
              padding: '12px 16px', borderRadius: 10, border: 'none',
       fontSize: 14, fontFamily: S.font, outline: 'none',
       minWidth: 240, color: S.n900, background: '#FFFFFF',
            }}
          />
          <button
            className="blog-button"
            onClick={subscribe}
            disabled={loading || !email.includes('@')}
      style={{
              padding: '12px 22px',
       background: !email.includes('@') || loading ? '#374151' : S.brand,
       color: '#fff', border: 'none', borderRadius: 10,
       fontSize: 14, fontWeight: 700, cursor: email.includes('@') ? 'pointer' : 'not-allowed',
       fontFamily: S.font, transition: 'background 0.15s',
      }}
          >
            {loading ? 'Subscribing…' : 'Subscribe'}
     </button>
        </div>
      )}
      <p style={{ fontSize: 11, color: S.headerMuted, marginTop: 12 }}>
    No spam. Unsubscribe any time.
      </p>
    </div>
  )
}

export default function BlogPageClient() {
  const [cat, setCat] = useState('All')

 const filtered = cat === 'All'
  ? POST_LIST
    : POST_LIST.filter(p => p.category === cat)

  const [featured, ...rest] = POST_LIST

  // Split grid: first 2 posts large, rest standard
  const topTwo = filtered.slice(0, 2)
  const remaining = filtered.slice(2)

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap"
    rel="stylesheet"
   />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .article-card { transition: border-color .18s ease, box-shadow .18s ease, transform .18s ease; }
        .article-card:hover { border-color: ${S.brand} !important; box-shadow: 0 10px 24px rgba(15,118,110,.08); transform: translateY(-1px); }
        .article-card:hover .read-link { color: ${S.brand} !important; }
        .cat-btn { transition: all 0.15s; }
        .cat-btn:hover { border-color: ${S.brand} !important; color: ${S.brand} !important; }
        .blog-link:focus-visible, .cat-btn:focus-visible, .blog-input:focus-visible, .blog-button:focus-visible {
          outline: 2px solid ${S.brand};
          outline-offset: 2px;
        }
        @media (max-width: 640px) {
          .featured-grid { grid-template-columns: 1fr !important; }
          .featured-img { min-height: 200px !important; max-height: 220px; }
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: S.n50, fontFamily: S.font, color: S.n900 }}>

    {/* Header */}
        <div style={{ background: S.headerBg, borderBottom: `1px solid ${S.headerBdr}` }}>
          <div style={{ maxWidth: 1040, margin: '0 auto', padding: '32px 24px 48px' }}>

      {/* Nav */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48 }}>
       <Link href="/" className="blog-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
        <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: 'linear-gradient(135deg,#0F766E,#14B8A6)',
         display: 'flex', alignItems: 'center', justifyContent: 'center',
         color: '#fff', fontWeight: 900, fontSize: 13,
        }}><img src="/logo-mark.svg" alt="" style={{ width: '13px', height: '13px' }} /></div>
                <span style={{ fontWeight: 800, fontSize: 15, color: S.headerText, letterSpacing: '-0.02em' }}>
         Locatalyze
                </span>
              </Link>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                <Link
                  href={toolsHubRef('blog_index_nav')}
                  className="blog-link"
                  style={{
                    fontSize: 13, fontWeight: 700, color: S.headerText,
                    textDecoration: 'none', border: '1px solid rgba(255,255,255,0.35)',
                    borderRadius: 8, padding: '7px 16px',
                    background: 'rgba(255,255,255,0.08)',
                  }}
                >
                  Free tools
                </Link>
                <Link
                  href={onboardingRef('blog_index_nav')}
                  className="blog-link"
                  style={{
                    fontSize: 13, fontWeight: 700, color: S.brandLight,
                    textDecoration: 'none', border: `1px solid ${S.brand}40`,
                    borderRadius: 8, padding: '7px 16px',
                    background: `${S.brand}15`,
                  }}
                >
                  Full report
                </Link>
              </div>
            </div>

            {/* Page heading */}
            <div style={{ maxWidth: 640 }}>
              <p style={{
                fontSize: 10, fontWeight: 700, color: S.brandLight,
                textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 14,
       }}>
                Location intelligence blog
              </p>
              <h1 style={{
                fontSize: BLOG_THEME.type.h1, fontWeight: 800,
        color: S.headerText, letterSpacing: '-0.04em', lineHeight: 1.15, marginBottom: 12,
       }}>
                Guides, data and insights for<br />Australian founders
              </h1>
              <p style={{ fontSize: 14, color: S.headerMuted, lineHeight: 1.7 }}>
        {POST_LIST.length} articles covering location strategy, market analysis and business planning.
              </p>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1040, margin: '0 auto', padding: '48px 24px 80px' }}>

     {/* Featured article */}
          <Link href={`/blog/${featured.slug}`} style={{ textDecoration: 'none', display: 'block', marginBottom: 52 }}>
      <div style={{
              background: S.white,
              borderRadius: 16,
              border: `1px solid ${S.n200}`,
              overflow: 'hidden',
       display: 'grid',
       gridTemplateColumns: '1fr 1fr',
       minHeight: 320,
              boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
       transition: 'border-color 0.15s',
      }}
              className="article-card featured-grid"
      >
              <div style={{ position: 'relative', overflow: 'hidden' }}>
        <img
                  src={featured.heroImg}
                  alt={featured.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', minHeight: 320 }}
        />
                <div style={{
                  position: 'absolute', inset: 0,
         background: 'linear-gradient(to right, transparent 60%, rgba(255,255,255,0.08))',
        }} />
              </div>
              <div style={{ padding: '36px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
         <span style={{
                    fontSize: 10, fontWeight: 700, color: S.brand,
                    textTransform: 'uppercase', letterSpacing: '0.08em',
          background: S.brandFaded, border: `1px solid ${S.brandBorder}`,
                    borderRadius: 4, padding: '2px 8px',
         }}>
                    Featured
                  </span>
                  <CategoryPill label={featured.category} />
                  <span style={{ fontSize: 12, color: S.n400 }}>{featured.readTime}</span>
                </div>
            <h2 style={{
                  fontSize: BLOG_THEME.type.h3, fontWeight: 800,
         color: S.n900, letterSpacing: '-0.03em', lineHeight: 1.3, marginBottom: 12,
        }}>
                  {featured.title}
                </h2>
                <p style={{ fontSize: 14, color: S.n500, lineHeight: 1.75, marginBottom: 20 }}>
                  {featured.intro.slice(0, 180)}…
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <span style={{ fontSize: 12, color: S.n400 }}>{featured.date}</span>
                  <span
                    className="read-link"
          style={{ fontSize: 13, fontWeight: 700, color: S.n700, transition: 'color 0.15s' }}
         >
                    Read article →
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Category filter */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
       {CATS.map(c => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className="cat-btn"
         style={{
                    padding: '6px 14px',
          borderRadius: 6,
                    border: `1px solid ${cat === c ? S.brand : S.n200}`,
                    fontSize: 12, fontWeight: cat === c ? 700 : 500,
                    cursor: 'pointer',
          fontFamily: S.font,
                    background: cat === c ? S.brand : S.white,
                    color: cat === c ? '#fff' : S.n500,
         }}
                >
                  {c}
                </button>
              ))}
            </div>
            <p style={{ fontSize: 12, color: S.n400 }}>
              {filtered.length} article{filtered.length !== 1 ? 's' : ''}
       {cat !== 'All' ? ` in ${cat}` : ''}
      </p>
          </div>

          {/* Top two — wider cards */}
          {topTwo.length > 0 && (
            <div style={{
              display: 'grid',
       gridTemplateColumns: 'repeat(auto-fill, minmax(440px, 1fr))',
       gap: 16,
              marginBottom: 16,
            }}>
              {topTwo.map(post => (
                <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
         <div
                    className="article-card"
          style={{
                      background: S.white,
                      border: `1px solid ${S.n200}`,
                      borderRadius: 14,
                      overflow: 'hidden',
           display: 'flex',
           flexDirection: 'column',
           transition: 'border-color 0.15s',
          }}
                  >
                    <img
                      src={post.heroImg}
                      alt={post.title}
                      style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }}
          />
                    <div style={{ padding: '20px 22px' }}>
           <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10, flexWrap: 'wrap' }}>
            <CategoryPill label={post.category} />
                        <span style={{ fontSize: 11, color: S.n400 }}>{post.readTime}</span>
                      </div>
                      <h3 style={{
                        fontSize: 18, fontWeight: 700, color: S.n900,
                        lineHeight: 1.4, marginBottom: 8, letterSpacing: '-0.01em',
           }}>
                        {post.title}
                      </h3>
                      <p style={{ fontSize: 13, color: S.n500, lineHeight: 1.7, marginBottom: 16 }}>
                        {post.intro.slice(0, 120)}…
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          {post.author && (
                            <div style={{ width: 20, height: 20, borderRadius: '50%', background: S.brand, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                              {post.author.split(' ').map((n: string) => n[0]).join('')}
                            </div>
                          )}
                          <span style={{ fontSize: 11, color: S.n400 }}>{post.author ?? post.date}</span>
                        </div>
                        <span
                          className="read-link"
             style={{ fontSize: 12, fontWeight: 700, color: S.n700, transition: 'color 0.15s' }}
            >
                          Read →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Remaining articles — tighter grid */}
          {remaining.length > 0 && (
            <div style={{
              display: 'grid',
       gridTemplateColumns: 'repeat(auto-fill, minmax(288px, 1fr))',
       gap: 14,
              marginBottom: 56,
            }}>
              {remaining.map(post => (
                <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
         <div
                    className="article-card"
          style={{
                      background: S.white,
                      border: `1px solid ${S.n200}`,
                      borderRadius: 12,
                      overflow: 'hidden',
           display: 'flex',
           flexDirection: 'column',
           height: '100%',
           transition: 'border-color 0.15s',
          }}
                  >
                    <img
                      src={post.heroImg}
                      alt={post.title}
                      style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }}
          />
                    <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
           <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 9, flexWrap: 'wrap' }}>
            <CategoryPill label={post.category} />
                        <span style={{ fontSize: 11, color: S.n400 }}>{post.readTime}</span>
                      </div>
                      <h3 style={{
                        fontSize: 16, fontWeight: 700, color: S.n900,
                        lineHeight: 1.45, marginBottom: 8, flex: 1,
                        letterSpacing: '-0.01em',
           }}>
                        {post.title}
                      </h3>
                      <p style={{ fontSize: 12, color: S.n500, lineHeight: 1.65, marginBottom: 14 }}>
                        {post.intro.slice(0, 95)}…
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          {post.author && (
                            <div style={{ width: 18, height: 18, borderRadius: '50%', background: S.brand, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 7, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                              {post.author.split(' ').map((n: string) => n[0]).join('')}
                            </div>
                          )}
                          <span style={{ fontSize: 11, color: S.n400 }}>{post.author ?? post.date}</span>
                        </div>
                        <span
                          className="read-link"
             style={{ fontSize: 12, fontWeight: 700, color: S.n700, transition: 'color 0.15s' }}
            >
                          Read →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
       <p style={{ fontSize: 15, color: S.n400 }}>No articles in this category yet.</p>
            </div>
          )}

          {/* Location guide links */}
          <div style={{
            background: S.white,
            border: `1px solid ${S.n200}`,
            borderRadius: 16,
            padding: '28px 32px',
      marginBottom: 24,
          }}>
            <p style={{
              fontSize: 10, fontWeight: 700, color: S.n400,
              textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16,
      }}>
              Location guides by city
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
       {[
                { href: '/analyse/perth', label: 'Perth' },
        { href: '/analyse/sydney', label: 'Sydney' },
        { href: '/analyse/melbourne', label: 'Melbourne' },
        { href: '/analyse/brisbane', label: 'Brisbane' },
        { href: '/analyse/perth/cafe', label: 'Perth Cafes' },
        { href: '/analyse/sydney/cafe', label: 'Sydney Cafes' },
        { href: '/analyse/sydney/restaurant', label: 'Sydney Restaurants' },
       ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  style={{
                    fontSize: 13, fontWeight: 600, color: S.brand,
                    background: S.brandFaded, border: `1px solid ${S.brandBorder}`,
                    borderRadius: 6, padding: '6px 14px', textDecoration: 'none',
         }}
                >
                  {label} →
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <NewsletterBlock />
        </div>
      </div>
    </>
  )
}