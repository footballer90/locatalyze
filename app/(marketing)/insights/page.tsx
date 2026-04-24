import type { Metadata } from 'next'
import Link from 'next/link'
import { INSIGHT_LIST } from '@/lib/insights-posts'
import { BLOG_CATEGORY_COLORS, BLOG_THEME } from '@/lib/blog-theme'
import { onboardingRef, toolsHubRef } from '@/lib/funnel-links'

const S = {
  brand: BLOG_THEME.color.primary,
  brandLight: BLOG_THEME.color.accent,
  n50: BLOG_THEME.color.bg,
  n100: BLOG_THEME.color.surfaceAlt,
  n200: BLOG_THEME.color.border,
  n400: BLOG_THEME.color.textFaint,
  n500: BLOG_THEME.color.textSubtle,
  n700: BLOG_THEME.color.textMuted,
  n900: BLOG_THEME.color.text,
  white: BLOG_THEME.color.surface,
  headerBg: BLOG_THEME.color.headerBg,
  headerText: BLOG_THEME.color.headerText,
  headerMuted: BLOG_THEME.color.headerMuted,
  font: BLOG_THEME.font.sans,
}

const BASE = 'https://locatalyze.com'

export const metadata: Metadata = {
  title: 'Insights — data stories on Australian location & rent benchmarks',
  description:
    'Short research notes and benchmark explainers: Census-backed context, hospitality rent bands, and how to test an address with Locatalyze tools before you sign.',
  alternates: { canonical: `${BASE}/insights` },
}

const CAT = BLOG_CATEGORY_COLORS

export default function InsightsIndexPage() {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <div style={{ minHeight: '100vh', background: S.n50, fontFamily: S.font }}>
        <div
          style={{
            background: S.headerBg,
            borderBottom: '1px solid rgba(26, 46, 43, 0.5)',
            padding: '32px 24px 40px',
          }}
        >
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <nav
              aria-label="Breadcrumb"
              style={{ fontSize: 12, fontWeight: 600, color: S.headerMuted, marginBottom: 12 }}
            >
              <Link href="/" style={{ color: S.headerMuted }}>
                Home
              </Link>
              <span style={{ opacity: 0.4, margin: '0 8px' }}>/</span>
              <span style={{ color: S.headerText }}>Insights</span>
            </nav>
            <p
              style={{
                fontSize: 10,
                fontWeight: 800,
                color: S.brandLight,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: 8,
              }}
            >
              Data stories
            </p>
            <h1
              style={{
                fontSize: BLOG_THEME.type.h1,
                fontWeight: 800,
                color: S.headerText,
                letterSpacing: '-0.03em',
                lineHeight: 1.2,
                marginBottom: 12,
              }}
            >
              Research notes & benchmarks
            </h1>
            <p
              style={{
                fontSize: 16,
                color: S.headerMuted,
                lineHeight: 1.6,
                maxWidth: 560,
                marginBottom: 16,
              }}
            >
              Original short-form data pieces: how we use ABS Census and competition context, and how to
              line up public rent bands with your own address.
            </p>
            <p style={{ fontSize: 13, color: S.headerMuted, margin: 0 }}>
              <Link href={toolsHubRef('insights_index')} style={{ color: S.brandLight, fontWeight: 600 }}>
                Free tools
              </Link>
              <span style={{ opacity: 0.35, margin: '0 8px' }}>·</span>
              <Link href={onboardingRef('insights_index')} style={{ color: S.brandLight, fontWeight: 600 }}>
                Full address report →
              </Link>
              <span style={{ opacity: 0.35, margin: '0 8px' }}>·</span>
              <Link href="/blog" style={{ color: S.headerMuted, fontWeight: 600 }}>
                Long-form blog
              </Link>
            </p>
          </div>
        </div>

        <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px 64px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 20,
            }}
          >
            {INSIGHT_LIST.map((post) => {
              const c = CAT[post.category] || S.brand
              return (
                <Link
                  key={post.slug}
                  href={`/insights/${post.slug}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <article
                    style={{
                      background: S.white,
                      border: `1px solid ${S.n200}`,
                      borderRadius: 14,
                      overflow: 'hidden',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'box-shadow 0.2s, transform 0.2s',
                    }}
                  >
                    <div style={{ position: 'relative', height: 160, background: S.n900 }}>
                      <img
                        src={post.heroImg}
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.88 }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          top: 12,
                          left: 12,
                          fontSize: 9,
                          fontWeight: 800,
                          color: '#fff',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          background: 'rgba(0,0,0,0.5)',
                          padding: '3px 8px',
                          borderRadius: 4,
                        }}
                      >
                        Data story
                      </div>
                    </div>
                    <div style={{ padding: '16px 18px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 800,
                          color: c,
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          marginBottom: 8,
                        }}
                      >
                        {post.category}
                      </span>
                      <h2
                        style={{
                          fontSize: 17,
                          fontWeight: 800,
                          color: S.n900,
                          lineHeight: 1.35,
                          marginBottom: 8,
                        }}
                      >
                        {post.title}
                      </h2>
                      <p style={{ fontSize: 13, color: S.n500, lineHeight: 1.55, marginBottom: 12, flex: 1 }}>
                        {post.dataHook}
                      </p>
                      <span style={{ fontSize: 12, color: S.brand, fontWeight: 700 }}>
                        Read →
                      </span>
                    </div>
                  </article>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
