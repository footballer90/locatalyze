// app/(marketing)/insights/[slug]/page.tsx
import Link from 'next/link'
import { renderMarketingSection } from '@/components/content/MarketingContentSections'
import { INSIGHTS, INSIGHT_LIST, type InsightPost } from '@/lib/insights-posts'
import type { Section } from '@/lib/blog-posts'
import { onboardingRef, toolsHubRef } from '@/lib/funnel-links'
import { BLOG_CATEGORY_COLORS, BLOG_THEME } from '@/lib/blog-theme'

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.locatalyze.com'

const S = {
  brand: BLOG_THEME.color.primary,
  brandLight: BLOG_THEME.color.accent,
  brandFaded: BLOG_THEME.color.primarySoft,
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
}

function articleJsonLd(post: InsightPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.dateIso,
    dateModified: post.dateIso,
    image: [post.heroImg],
    author: post.author
      ? { '@type': 'Person', name: post.author }
      : { '@type': 'Organization', name: 'Locatalyze' },
    publisher: { '@type': 'Organization', name: 'Locatalyze' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE}/insights/${post.slug}` },
  }
}

function breadcrumbJsonLd(post: InsightPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/` },
      { '@type': 'ListItem', position: 2, name: 'Insights', item: `${BASE}/insights` },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `${BASE}/insights/${post.slug}`,
      },
    ],
  }
}

function faqJsonLd(post: InsightPost) {
  if (!post.faqs?.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: post.faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }
}

export async function generateStaticParams() {
  return Object.keys(INSIGHTS).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = INSIGHT_LIST.find((p) => p.slug === slug)
  return {
    title: post ? `${post.seoTitle}` : 'Insights — Locatalyze',
    description: post?.metaDescription ?? 'Data stories on Australian location intelligence.',
    keywords: post?.secondaryKeywords?.join(', ') ?? '',
    alternates: { canonical: `${BASE}/insights/${slug}` },
    openGraph: {
      title: post?.title ?? 'Locatalyze Insights',
      description: post?.metaDescription ?? '',
      type: 'article',
      url: `${BASE}/insights/${slug}`,
    },
  }
}

export default async function InsightPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = INSIGHTS[slug]

  const jsonLd: object[] = []
  if (post) {
    jsonLd.push(articleJsonLd(post), breadcrumbJsonLd(post))
    const faq = faqJsonLd(post)
    if (faq) jsonLd.push(faq)
  }

  if (!post) {
    return (
      <>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <div
          style={{
            minHeight: '100vh',
            background: S.n50,
            fontFamily: S.font,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            padding: 40,
            textAlign: 'center',
          }}
        >
          <h1 style={{ fontSize: 24, fontWeight: 800, color: S.n900, marginBottom: 8 }}>Not found</h1>
          <p style={{ fontSize: 15, color: S.n500, marginBottom: 24 }}>This insight may have moved.</p>
          <Link
            href="/insights"
            style={{
              background: S.brand,
              color: '#fff',
              borderRadius: 10,
              padding: '11px 24px',
              fontSize: 14,
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            All insights
          </Link>
        </div>
      </>
    )
  }

  const related = INSIGHT_LIST.filter((p) => p.slug !== slug).slice(0, 3)
  const CAT_COLOR = BLOG_CATEGORY_COLORS

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; }
        .insights-link:focus-visible { outline: 2px solid ${S.brand}; outline-offset: 2px; }
        .insights-link:hover { color: ${S.brandLight}; }
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
            <nav
              aria-label="Breadcrumb"
              style={{ fontSize: 12, fontWeight: 600, color: S.n500, marginBottom: 8 }}
            >
              <Link href="/" className="insights-link" style={{ color: S.n500 }}>
                Home
              </Link>
              <span style={{ opacity: 0.35, margin: '0 8px' }}>/</span>
              <Link href="/insights" className="insights-link" style={{ color: S.n500 }}>
                Insights
              </Link>
              <span style={{ opacity: 0.35, margin: '0 8px' }}>/</span>
              <span style={{ color: S.n700 }}>{post.category}</span>
            </nav>
            <p style={{ fontSize: 12, color: S.n500, margin: 0, lineHeight: 1.5 }}>
              <Link href={toolsHubRef('insights_nav')} className="insights-link" style={{ color: S.brand, fontWeight: 600 }}>
                Free tools
              </Link>
              <span style={{ opacity: 0.35, margin: '0 8px' }}>·</span>
              <Link
                href={onboardingRef('insights_nav')}
                className="insights-link"
                style={{ color: S.brand, fontWeight: 600 }}
              >
                Run full address analysis →
              </Link>
            </p>
          </div>
        </div>

        <div style={{ position: 'relative', height: 400, overflow: 'hidden', background: S.n900 }}>
          <img
            src={post.heroImg}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: 0.65 }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.7) 100%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 32,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '100%',
              maxWidth: 760,
              padding: '0 24px',
            }}
          >
            <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: '#FFFFFF',
                  textTransform: 'uppercase',
                  letterSpacing: '0.07em',
                  background: 'rgba(255,255,255,0.18)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: 4,
                  padding: '3px 9px',
                }}
              >
                Data story
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.85)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                {post.category}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
                {post.date} · {post.readTime}
              </span>
            </div>
            <p
              style={{
                fontSize: 14,
                color: 'rgba(255,255,255,0.88)',
                lineHeight: 1.5,
                marginBottom: 12,
                maxWidth: 640,
                fontWeight: 500,
              }}
            >
              {post.dataHook}
            </p>
            <h1
              style={{
                fontSize: BLOG_THEME.type.h1,
                fontWeight: 800,
                color: '#FFFFFF',
                letterSpacing: '-0.03em',
                lineHeight: 1.2,
              }}
            >
              {post.title}
            </h1>
            {post.author && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: 'rgba(20,184,166,0.35)',
                    border: '1.5px solid rgba(20,184,166,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 800,
                    color: '#fff',
                    flexShrink: 0,
                  }}
                >
                  {post.author
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{post.author}</p>
                  {post.authorRole && <p style={{ fontSize: 11, color: S.headerMuted }}>{post.authorRole}</p>}
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            maxWidth: 1040,
            margin: '0 auto',
            padding: '0 24px',
            display: 'flex',
            gap: 48,
            alignItems: 'flex-start',
          }}
        >
          <div style={{ flex: 1, minWidth: 0, maxWidth: 720, padding: '44px 0 80px' }}>
            <p
              style={{
                fontSize: 17,
                color: S.n700,
                lineHeight: 1.85,
                marginBottom: 32,
                fontWeight: 500,
                borderLeft: `3px solid ${S.brand}`,
                paddingLeft: 18,
              }}
            >
              {post.intro}
            </p>

            <div style={{ display: 'flex', gap: 8, marginBottom: 36, flexWrap: 'wrap' }}>
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  style={{
                    background: S.n50,
                    color: S.n500,
                    border: `1px solid ${S.n200}`,
                    borderRadius: 4,
                    padding: '3px 10px',
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {post.sections.map((section: Section, i: number) => renderMarketingSection(section, i))}

            {post.faqs && post.faqs.length > 0 && (
              <section style={{ marginTop: 40 }} aria-label="Frequently asked questions">
                <h2
                  style={{
                    fontSize: BLOG_THEME.type.h2,
                    fontWeight: 800,
                    color: S.n900,
                    letterSpacing: '-0.02em',
                    marginBottom: 20,
                    paddingTop: 8,
                    borderTop: `1px solid ${S.n100}`,
                  }}
                >
                  Common questions
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  {post.faqs.map((f) => (
                    <div key={f.question}>
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: S.n800, marginBottom: 8, lineHeight: 1.4 }}>
                        {f.question}
                      </h3>
                      <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.75, margin: 0 }}>{f.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {post.author && post.authorBio && (
              <div
                style={{
                  marginTop: 48,
                  padding: '24px 28px',
                  background: S.n50,
                  border: `1px solid ${S.n200}`,
                  borderRadius: 14,
                  display: 'flex',
                  gap: 20,
                  alignItems: 'flex-start',
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    flexShrink: 0,
                    background: `linear-gradient(135deg, ${S.brand}, #0891B2)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                    fontWeight: 900,
                    color: '#fff',
                  }}
                >
                  {post.author
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div>
                  <p
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: S.n400,
                      textTransform: 'uppercase',
                      letterSpacing: '0.07em',
                      marginBottom: 4,
                    }}
                  >
                    About the author
                  </p>
                  <p style={{ fontSize: 15, fontWeight: 800, color: S.n900, marginBottom: 2 }}>{post.author}</p>
                  {post.authorRole && (
                    <p style={{ fontSize: 12, fontWeight: 600, color: S.brand, marginBottom: 10 }}>
                      {post.authorRole}
                    </p>
                  )}
                  <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.75 }}>{post.authorBio}</p>
                </div>
              </div>
            )}

            <div
              style={{
                background: `linear-gradient(135deg, ${S.brand}, #0891B2)`,
                borderRadius: 14,
                padding: '32px',
                textAlign: 'center',
                marginTop: 52,
                marginBottom: 16,
              }}
            >
              <h2 style={{ fontSize: 19, fontWeight: 800, color: '#FFFFFF', marginBottom: 8 }}>
                Tools first — then a full report for your address
              </h2>
              <p
                style={{
                  fontSize: 14,
                  color: 'rgba(255,255,255,0.85)',
                  marginBottom: 6,
                  lineHeight: 1.6,
                }}
              >
                Free rent, viability, and break-even checks. Upgrade when you need a verdict, map, and
                site-specific numbers.
              </p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginBottom: 20 }}>No signup for tools</p>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Link
                  href={toolsHubRef('insights_article_cta')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    background: '#fff',
                    color: S.brand,
                    borderRadius: 10,
                    padding: '11px 24px',
                    fontSize: 14,
                    fontWeight: 800,
                  }}
                >
                  Open free tools hub →
                </Link>
                <Link
                  href={onboardingRef('insights_article_cta')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    background: 'transparent',
                    color: '#FFFFFF',
                    borderRadius: 10,
                    padding: '11px 24px',
                    fontSize: 14,
                    fontWeight: 700,
                    border: '2px solid rgba(255,255,255,0.45)',
                  }}
                >
                  Run full analysis
                </Link>
              </div>
            </div>

            {related.length > 0 && (
              <div style={{ marginTop: 48 }}>
                <h3
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: S.n400,
                    marginBottom: 16,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  More insights
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))',
                    gap: 12,
                  }}
                >
                  {related.map((r) => {
                    const rc = CAT_COLOR[r.category] || S.brand
                    return (
                    <Link key={r.slug} href={`/insights/${r.slug}`}>
                      <div
                        style={{
                          background: S.white,
                          border: `1px solid ${S.n200}`,
                          borderRadius: 10,
                          overflow: 'hidden',
                        }}
                      >
                        <img
                          src={r.heroImg}
                          alt=""
                          style={{ width: '100%', height: 110, objectFit: 'cover', display: 'block' }}
                        />
                        <div style={{ padding: '12px 14px' }}>
                          <p
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              color: rc,
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                              marginBottom: 6,
                            }}
                          >
                            {r.category}
                          </p>
                          <p
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: S.n900,
                              lineHeight: 1.4,
                              marginBottom: 6,
                            }}
                          >
                            {r.title}
                          </p>
                          <span style={{ fontSize: 12, color: S.brand, fontWeight: 600 }}>Read</span>
                        </div>
                      </div>
                    </Link>
                    )
                  })}
                </div>
              </div>
            )}

            <div style={{ marginTop: 32, paddingTop: 24, borderTop: `1px solid ${S.n100}` }}>
              <Link href="/insights" style={{ fontSize: 14, color: S.brand, fontWeight: 700 }}>
                All insights
              </Link>
            </div>
          </div>

          <aside
            style={{
              width: 240,
              flexShrink: 0,
              position: 'sticky',
              top: 24,
              padding: '44px 0 80px',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <div
              style={{
                background: S.n50,
                border: `1px solid ${S.n200}`,
                borderRadius: 12,
                padding: '16px',
              }}
            >
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: S.n400,
                  textTransform: 'uppercase',
                  letterSpacing: '0.07em',
                  marginBottom: 12,
                }}
              >
                This piece
              </p>
              {[
                { label: 'Topic', value: post.category },
                { label: 'Read time', value: post.readTime },
                { label: 'Published', value: post.date },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '7px 0',
                    borderBottom: `1px solid ${S.n100}`,
                  }}
                >
                  <span style={{ fontSize: 12, color: S.n400 }}>{label}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: S.n700 }}>{value}</span>
                </div>
              ))}
            </div>

            <div style={{ background: S.headerBg, borderRadius: 12, padding: '18px' }}>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#F9FAFB',
                  marginBottom: 8,
                  lineHeight: 1.4,
                }}
              >
                Free tools — then full report
              </p>
              <p style={{ fontSize: 12, color: '#CBD5E1', marginBottom: 6, lineHeight: 1.6 }}>
                Run viability, rent, and break-even checks first.
              </p>
              <p style={{ fontSize: 11, color: '#94A3B8', marginBottom: 14 }}>No signup for tools</p>
              <Link
                href={toolsHubRef('insights_sidebar')}
                style={{
                  display: 'block',
                  textAlign: 'center',
                  background: '#fff',
                  color: S.brand,
                  borderRadius: 8,
                  padding: '10px',
                  fontSize: 13,
                  fontWeight: 700,
                  marginBottom: 8,
                }}
              >
                Open free tools hub →
              </Link>
              <Link
                href={onboardingRef('insights_sidebar')}
                style={{
                  display: 'block',
                  textAlign: 'center',
                  background: S.brand,
                  color: '#fff',
                  borderRadius: 8,
                  padding: '10px',
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                Full location report →
              </Link>
            </div>

            <div
              style={{
                background: S.n50,
                border: `1px solid ${S.n200}`,
                borderRadius: 12,
                padding: '16px',
              }}
            >
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: S.n400,
                  textTransform: 'uppercase',
                  letterSpacing: '0.07em',
                  marginBottom: 12,
                }}
              >
                Long-form guides
              </p>
              <Link
                href="/blog"
                style={{
                  display: 'block',
                  fontSize: 13,
                  color: S.brand,
                  fontWeight: 600,
                  padding: '5px 0',
                }}
                className="insights-link"
              >
                Locatalyze blog →
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
