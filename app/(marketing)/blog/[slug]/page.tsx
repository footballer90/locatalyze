// app/(marketing)/blog/[slug]/page.tsx
// Upgraded renderer — no emojis, premium typography, improved layout

import Link from 'next/link'
import { renderMarketingSection } from '@/components/content/MarketingContentSections'
import { POSTS, POST_LIST, type Section } from '@/lib/blog-posts'
import { onboardingRef, toolsHubRef } from '@/lib/funnel-links'
import { BLOG_CATEGORY_COLORS, BLOG_THEME } from '@/lib/blog-theme'

const S = {
  brand: BLOG_THEME.color.primary,
  brandLight: BLOG_THEME.color.accent,
  brandFaded: BLOG_THEME.color.primarySoft,
  brandBorder: BLOG_THEME.color.primaryBorder,
  n50: BLOG_THEME.color.bg,
  n100: BLOG_THEME.color.surfaceAlt,
  n200: BLOG_THEME.color.border,
  n400: BLOG_THEME.color.textFaint,
  n500: BLOG_THEME.color.textSubtle,
  n700: BLOG_THEME.color.textMuted,
  n800: BLOG_THEME.color.textStrong,
  n900: BLOG_THEME.color.text,
  white: BLOG_THEME.color.surface,
  headerBg: BLOG_THEME.color.headerBg,
  headerText: BLOG_THEME.color.headerText,
  headerMuted: BLOG_THEME.color.headerMuted,
  font: BLOG_THEME.font.sans,
  emerald: BLOG_THEME.color.success,
  emeraldBg: '#ECFDF5',
  emeraldBdr: '#A7F3D0',
  amber: BLOG_THEME.color.warning,
  amberBg: '#FFFBEB',
  amberBdr: '#FDE68A',
  red: BLOG_THEME.color.danger,
  redBg: '#FEF2F2',
  redBdr: '#FECACA',
}

export async function generateStaticParams() {
  return Object.keys(POSTS).map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = POST_LIST.find((p: { slug: string }) => p.slug === slug)
  return {
    title: post ? `${post.title} — Locatalyze` : 'Blog — Locatalyze',
    description: post?.metaDescription ?? 'Business location strategy for Australian entrepreneurs.',
    keywords: (post as any)?.secondaryKeywords?.join(', ') ?? '',
    alternates: { canonical: `https://www.locatalyze.com/blog/${slug}` },
    openGraph: {
      title: post?.title ?? 'Locatalyze Blog',
      description: post?.metaDescription ?? '',
      type: 'article',
      url: `https://www.locatalyze.com/blog/${slug}`,
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = POSTS[slug]

  if (!post) {
    return (
      <>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <div style={{
          minHeight: '100vh', background: S.n50, fontFamily: S.font,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', padding: 40, textAlign: 'center',
        }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: S.n900, marginBottom: 8 }}>
            Article not found
          </h1>
          <p style={{ fontSize: 15, color: S.n500, marginBottom: 24 }}>
            This article may have moved or been updated.
          </p>
          <Link href="/blog" style={{
            background: S.brand, color: '#fff', borderRadius: 10,
            padding: '11px 24px', fontSize: 14, fontWeight: 700, textDecoration: 'none',
          }}>
            Back to blog
          </Link>
        </div>
      </>
    )
  }

  const related = POST_LIST
    .filter(p => p.slug !== slug && p.category === post.category)
    .slice(0, 3)
  const fallbackRelated = POST_LIST
    .filter(p => p.slug !== slug)
    .slice(0, 3)
  const showRelated = related.length > 0 ? related : fallbackRelated

  // Category pill colour
  const CAT_COLOR = BLOG_CATEGORY_COLORS
  const catColor = CAT_COLOR[post.category] || S.brand

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; }
        .blog-link:focus-visible { outline: 2px solid ${S.brand}; outline-offset: 2px; }
        .blog-link:hover { color: ${S.brandLight}; }
      `}</style>

      <div style={{ minHeight: '100vh', background: S.white, fontFamily: S.font }}>

        <div
          style={{
            background: S.n50,
            borderBottom: `1px solid ${S.n200}`,
            padding: '12px 24px',
          }}
        >
          <div style={{ maxWidth: 1040, margin: '0 auto' }}>
            <nav aria-label="Breadcrumb" style={{ fontSize: 12, fontWeight: 600, color: S.n500, marginBottom: 8 }}>
              <Link href="/" className="blog-link" style={{ color: S.n500 }}>
                Home
              </Link>
              <span style={{ opacity: 0.35, margin: '0 8px' }}>/</span>
              <Link href="/blog" className="blog-link" style={{ color: S.n500 }}>
                Blog
              </Link>
              <span style={{ opacity: 0.35, margin: '0 8px' }}>/</span>
              <span style={{ color: S.n700 }}>{post.category}</span>
            </nav>
            <p style={{ fontSize: 12, color: S.n500, margin: 0, lineHeight: 1.5 }}>
              <Link href={toolsHubRef('blog_nav')} className="blog-link" style={{ color: S.brand, fontWeight: 600 }}>
                Free tools
              </Link>
              <span style={{ opacity: 0.35, margin: '0 8px' }}>·</span>
              <Link href={onboardingRef('blog_nav')} className="blog-link" style={{ color: S.brand, fontWeight: 600 }}>
                Run full address analysis →
              </Link>
            </p>
          </div>
        </div>

        {/* Hero */}
        <div style={{ position: 'relative', height: 400, overflow: 'hidden', background: S.n900 }}>
          <img
            src={post.heroImg}
            alt={post.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: 0.65 }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.7) 100%)',
          }} />
          <div style={{
            position: 'absolute', bottom: 32,
            left: '50%', transform: 'translateX(-50%)',
            width: '100%', maxWidth: 760, padding: '0 24px',
          }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{
                fontSize: 10, fontWeight: 700,
                color: '#FFFFFF', textTransform: 'uppercase',
                letterSpacing: '0.07em',
                background: 'rgba(255,255,255,0.18)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: 4, padding: '3px 9px',
              }}>
                {post.category}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
                {post.date} · {post.readTime}
              </span>
            </div>
              <h1 style={{
              fontSize: BLOG_THEME.type.h1, fontWeight: 800,
              color: '#FFFFFF', letterSpacing: '-0.03em', lineHeight: 1.2,
            }}>
              {post.title}
            </h1>
            {post.author && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(20,184,166,0.35)', border: '1.5px solid rgba(20,184,166,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                  {post.author.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{post.author}</p>
                  {post.authorRole && <p style={{ fontSize: 11, color: S.headerMuted }}>{post.authorRole}</p>}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Two-column layout */}
        <div style={{ maxWidth: 1040, margin: '0 auto', padding: '0 24px', display: 'flex', gap: 48, alignItems: 'flex-start' }}>

          {/* Main content */}
          <div style={{ flex: 1, minWidth: 0, maxWidth: 720, padding: '44px 0 80px' }}>

            {/* Intro */}
            <p style={{
              fontSize: 17, color: S.n700, lineHeight: 1.85,
              marginBottom: 32, fontWeight: 500,
              borderLeft: `3px solid ${S.brand}`,
              paddingLeft: 18,
            }}>
              {post.intro}
            </p>

            {/* Tags */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 36, flexWrap: 'wrap' }}>
              {post.tags.map((tag: string) => (
                <span key={tag} style={{
                  background: S.n50, color: S.n500,
                  border: `1px solid ${S.n200}`,
                  borderRadius: 4, padding: '3px 10px',
                  fontSize: 11, fontWeight: 600,
                }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Sections */}
            {post.sections.map((section: Section, i: number) => renderMarketingSection(section, i))}

            {/* Author bio — shown when authorBio is present */}
            {post.author && post.authorBio && (
              <div style={{
                marginTop: 48, padding: '24px 28px',
                background: S.n50, border: `1px solid ${S.n200}`,
                borderRadius: 14, display: 'flex', gap: 20, alignItems: 'flex-start',
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
                  background: `linear-gradient(135deg, ${S.brand}, #0891B2)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, fontWeight: 900, color: '#fff',
                }}>
                  {post.author.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>About the author</p>
                  <p style={{ fontSize: 15, fontWeight: 800, color: S.n900, marginBottom: 2 }}>{post.author}</p>
                  {post.authorRole && <p style={{ fontSize: 12, fontWeight: 600, color: S.brand, marginBottom: 10 }}>{post.authorRole}</p>}
                  <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.75 }}>{post.authorBio}</p>
                </div>
              </div>
            )}

            {/* CTA */}
            <div style={{
              background: `linear-gradient(135deg, ${S.brand}, #0891B2)`,
              borderRadius: 14, padding: '32px',
              textAlign: 'center', marginTop: 52, marginBottom: 16,
            }}>
              <h3 style={{ fontSize: 19, fontWeight: 800, color: '#FFFFFF', marginBottom: 8 }}>
                Tools first — then a full report for your address
              </h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', marginBottom: 6, lineHeight: 1.6 }}>
                Free rent, viability, and break-even checks. Upgrade when you are ready for competitors, map, and numbers for a specific site.
              </p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginBottom: 20 }}>No signup required for tools</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', alignItems: 'center' }}>
                <Link href={toolsHubRef('blog_article_cta')} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: '#fff', color: S.brand,
                  borderRadius: 10, padding: '11px 24px',
                  fontSize: 14, fontWeight: 800,
                }}>
                  Open free tools hub →
                </Link>
                <Link href={onboardingRef('blog_article_cta')} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: 'transparent', color: '#FFFFFF',
                  borderRadius: 10, padding: '11px 24px',
                  fontSize: 14, fontWeight: 700,
                  border: '2px solid rgba(255,255,255,0.45)',
                }}>
                  Run full analysis
                </Link>
              </div>
            </div>

            {/* Related articles */}
            {showRelated.length > 0 && (
              <div style={{ marginTop: 48 }}>
                <h3 style={{
                  fontSize: 11, fontWeight: 700, color: S.n400,
                  marginBottom: 16, textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}>
                  Related articles
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))',
                  gap: 12,
                }}>
                  {showRelated.map((r: any) => (
                    <Link key={r.slug} href={`/blog/${r.slug}`}>
                      <div style={{
                        background: S.white, border: `1px solid ${S.n200}`,
                        borderRadius: 10, overflow: 'hidden',
                      }}>
                        <img
                          src={r.heroImg} alt={r.title}
                          style={{ width: '100%', height: 110, objectFit: 'cover', display: 'block' }}
                        />
                        <div style={{ padding: '12px 14px' }}>
                          <p style={{
                            fontSize: 10, fontWeight: 700, color: catColor,
                            textTransform: 'uppercase', letterSpacing: '0.05em',
                            marginBottom: 6,
                          }}>
                            {r.category}
                          </p>
                          <p style={{
                            fontSize: 13, fontWeight: 700, color: S.n900,
                            lineHeight: 1.4, marginBottom: 6,
                          }}>
                            {r.title}
                          </p>
                          <span style={{ fontSize: 12, color: S.brand, fontWeight: 600 }}>
                            Read
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginTop: 32, paddingTop: 24, borderTop: `1px solid ${S.n100}` }}>
              <Link href="/blog" style={{ fontSize: 14, color: S.brand, fontWeight: 700 }}>
                All articles
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <aside style={{
            width: 240, flexShrink: 0,
            position: 'sticky', top: 24,
            padding: '44px 0 80px',
            display: 'flex', flexDirection: 'column', gap: 16,
          }}>

            {/* Article meta */}
            <div style={{
              background: S.n50, border: `1px solid ${S.n200}`,
              borderRadius: 12, padding: '16px',
            }}>
              <p style={{
                fontSize: 10, fontWeight: 700, color: S.n400,
                textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12,
              }}>
                Article details
              </p>
              {[
                { label: 'Category', value: post.category },
                { label: 'Read time', value: post.readTime },
                { label: 'Published', value: post.date },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '7px 0',
                  borderBottom: `1px solid ${S.n100}`,
                }}>
                  <span style={{ fontSize: 12, color: S.n400 }}>{label}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: S.n700 }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Sidebar CTA */}
            <div style={{
              background: S.headerBg, borderRadius: 12, padding: '18px',
            }}>
              <p style={{
                fontSize: 13, fontWeight: 700, color: '#F9FAFB',
                marginBottom: 8, lineHeight: 1.4,
              }}>
                Free tools — then full report
              </p>
              <p style={{ fontSize: 12, color: '#CBD5E1', marginBottom: 6, lineHeight: 1.6 }}>
                Run viability, rent, and break-even checks first.
              </p>
              <p style={{ fontSize: 11, color: '#94A3B8', marginBottom: 14 }}>No signup required for tools</p>
              <Link href={toolsHubRef('blog_sidebar')} style={{
                display: 'block', textAlign: 'center',
                background: '#fff', color: S.brand,
                borderRadius: 8, padding: '10px',
                fontSize: 13, fontWeight: 700,
                marginBottom: 8,
              }}>
                Open free tools hub →
              </Link>
              <Link href={onboardingRef('blog_sidebar')} style={{
                display: 'block', textAlign: 'center',
                background: S.brand, color: '#fff',
                borderRadius: 8, padding: '10px',
                fontSize: 13, fontWeight: 700,
              }}>
                Full location report →
              </Link>
            </div>

            {/* Location guides */}
            <div style={{
              background: S.n50, border: `1px solid ${S.n200}`,
              borderRadius: 12, padding: '16px',
            }}>
              <p style={{
                fontSize: 10, fontWeight: 700, color: S.n400,
                textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12,
              }}>
                Location guides
              </p>
              {[
                { href: '/analyse/sydney', label: 'Sydney' },
                { href: '/analyse/melbourne', label: 'Melbourne' },
                { href: '/analyse/brisbane', label: 'Brisbane' },
                { href: '/analyse/perth', label: 'Perth' },
                { href: '/analyse/gold-coast', label: 'Gold Coast' },
                { href: '/analyse/newcastle', label: 'Best suburbs in Newcastle' },
                { href: '/analyse/melbourne/cafe', label: 'Melbourne cafes' },
                { href: '/analyse/perth/cafe', label: 'Perth cafes' },
                { href: '/analyse/sydney/cafe', label: 'Sydney cafes' },
                { href: '/analyse/sydney/restaurant', label: 'Sydney restaurants' },
              ].map(({ href, label }) => (
                <Link key={href} href={href} style={{
                  display: 'block', fontSize: 13, color: S.brand,
                  fontWeight: 600, padding: '5px 0',
                  borderBottom: `1px solid ${S.n100}`,
                }}>
                  {label} →
                </Link>
              ))}
            </div>

          </aside>
        </div>
      </div>
    </>
  )
}