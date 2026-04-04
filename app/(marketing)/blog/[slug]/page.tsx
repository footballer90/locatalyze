// app/(marketing)/blog/[slug]/page.tsx
// Upgraded renderer — no emojis, premium typography, improved layout

import Link from 'next/link'
import { POSTS, POST_LIST, type Section } from '@/lib/blog-posts'

const S = {
  brand: '#0F766E', brandLight: '#14B8A6', brandFaded: '#F0FDFA', brandBorder: '#99F6E4',
  n50: '#FAFAF9', n100: '#F5F5F4', n200: '#E7E5E4', n400: '#A8A29E', n500: '#78716C',
  n700: '#44403C', n800: '#292524', n900: '#1C1917', white: '#FFFFFF',
  headerBg: '#0C1F1C', font: "'DM Sans', sans-serif",
  emerald: '#059669', emeraldBg: '#ECFDF5', emeraldBdr: '#A7F3D0',
  amber: '#D97706', amberBg: '#FFFBEB', amberBdr: '#FDE68A',
  red: '#DC2626', redBg: '#FEF2F2', redBdr: '#FECACA',
}

const VARIANT_COLORS = {
  teal:  { color: S.brand,   bg: S.brandFaded,  border: S.brandBorder },
  amber: { color: S.amber,   bg: S.amberBg,     border: S.amberBdr },
  green: { color: S.emerald, bg: S.emeraldBg,   border: S.emeraldBdr },
  red:   { color: S.red,     bg: S.redBg,       border: S.redBdr },
}

// Strip emojis from any string
function stripEmojis(str: string): string {
  return str.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '').replace(/\s{2,}/g, ' ').trim()
}

function renderSection(section: Section, idx: number) {
  const body: React.CSSProperties = {
    fontSize: 16, color: '#57534E', lineHeight: 1.9, marginBottom: 20,
  }
  switch (section.type) {

    case 'h2':
      return (
        <h2 key={idx} style={{
          fontSize: 'clamp(18px,3vw,22px)', fontWeight: 800,
          color: S.n900, letterSpacing: '-0.02em',
          marginBottom: 14, marginTop: 44, lineHeight: 1.25,
          paddingTop: 8, borderTop: `1px solid ${S.n100}`,
        }}>
          {section.text}
        </h2>
      )

    case 'h3':
      return (
        <h3 key={idx} style={{
          fontSize: 16, fontWeight: 700, color: S.n800,
          marginBottom: 10, marginTop: 28, lineHeight: 1.35,
        }}>
          {section.text}
        </h3>
      )

    case 'p':
      return <p key={idx} style={body}>{section.text}</p>

    case 'img':
      return (
        <div key={idx} style={{ margin: '32px 0' }}>
          <img
            src={section.src}
            alt={section.caption}
            style={{ width: '100%', borderRadius: 10, display: 'block', maxHeight: 400, objectFit: 'cover' }}
          />
          {section.caption && (
            <p style={{ fontSize: 12, color: S.n400, textAlign: 'center', marginTop: 8, fontStyle: 'italic', lineHeight: 1.5 }}>
              {section.caption}
            </p>
          )}
        </div>
      )

    case 'pullquote':
      return (
        <blockquote key={idx} style={{
          borderLeft: `3px solid ${S.brand}`,
          padding: '16px 24px',
          margin: '32px 0',
          background: S.brandFaded,
          borderRadius: '0 10px 10px 0',
        }}>
          <p style={{
            fontSize: 18, fontWeight: 700, color: S.n800,
            lineHeight: 1.65, fontStyle: 'italic', margin: 0,
          }}>
            {section.text}
          </p>
        </blockquote>
      )

    case 'callout': {
      const v = VARIANT_COLORS[section.variant] || VARIANT_COLORS.teal
      return (
        <div key={idx} style={{
          background: v.bg, border: `1px solid ${v.border}`,
          borderRadius: 10, padding: '18px 20px', margin: '28px 0',
        }}>
          <p style={{
            fontSize: 12, fontWeight: 800, color: v.color,
            marginBottom: 10, textTransform: 'uppercase',
            letterSpacing: '0.07em',
          }}>
            {stripEmojis(section.title)}
          </p>
          <p style={{
            fontSize: 14, color: S.n700, lineHeight: 1.8,
            whiteSpace: 'pre-line', margin: 0,
          }}>
            {section.body}
          </p>
        </div>
      )
    }

    case 'list':
      return (
        <div key={idx} style={{ margin: '24px 0' }}>
          {section.heading && (
            <p style={{
              fontSize: 11, fontWeight: 800, color: S.n500,
              marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.07em',
            }}>
              {section.heading}
            </p>
          )}
          <div style={{
            background: S.white, border: `1px solid ${S.n200}`,
            borderRadius: 10, overflow: 'hidden',
          }}>
            {section.items.map((item, i) => (
              <div key={i} style={{
                padding: '12px 16px',
                borderBottom: i < section.items.length - 1 ? `1px solid ${S.n100}` : 'none',
                display: 'flex', gap: 12, alignItems: 'flex-start',
              }}>
                <div style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: S.brand, flexShrink: 0, marginTop: 7,
                }} />
                <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7, margin: 0 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      )

    case 'numbered':
      return (
        <div key={idx} style={{ margin: '24px 0' }}>
          {section.heading && (
            <p style={{
              fontSize: 11, fontWeight: 800, color: S.n500,
              marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.07em',
            }}>
              {section.heading}
            </p>
          )}
          <ol style={{ paddingLeft: 0, listStyle: 'none', margin: 0 }}>
            {section.items.map((item, i) => (
              <li key={i} style={{
                display: 'flex', gap: 14, padding: '12px 0',
                borderBottom: i < section.items.length - 1 ? `1px solid ${S.n100}` : 'none',
              }}>
                <span style={{
                  width: 24, height: 24, borderRadius: 7,
                  background: S.brand, color: '#fff',
                  fontSize: 11, fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, marginTop: 1,
                }}>
                  {i + 1}
                </span>
                <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7, margin: 0 }}>{item}</p>
              </li>
            ))}
          </ol>
        </div>
      )

    case 'stats':
      return (
        <div key={idx} style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))',
          gap: 12, margin: '28px 0',
        }}>
          {section.items.map(stat => (
            <div key={stat.label} style={{
              background: S.n50, border: `1px solid ${S.n200}`,
              borderRadius: 10, padding: '18px 16px', textAlign: 'center',
            }}>
              <p style={{
                fontSize: 26, fontWeight: 900, color: S.brand,
                letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 6,
              }}>
                {stat.value}
              </p>
              <p style={{ fontSize: 11, color: S.n500, lineHeight: 1.5, margin: 0 }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      )

    case 'table':
      return (
        <div key={idx} style={{ margin: '28px 0', overflowX: 'auto' }}>
          <table style={{
            width: '100%', borderCollapse: 'collapse',
            background: S.white, fontSize: 13,
            border: `1px solid ${S.n200}`, borderRadius: 10,
            overflow: 'hidden',
          }}>
            <thead>
              <tr style={{ background: S.n50, borderBottom: `1px solid ${S.n200}` }}>
                {section.headers.map(h => (
                  <th key={h} style={{
                    padding: '10px 14px', textAlign: 'left',
                    fontWeight: 700, color: S.n700,
                    fontSize: 11, textTransform: 'uppercase',
                    letterSpacing: '0.05em', whiteSpace: 'nowrap',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.rows.map((row, ri) => (
                <tr key={ri} style={{
                  borderBottom: ri < section.rows.length - 1 ? `1px solid ${S.n100}` : 'none',
                }}>
                  {row.map((cell, ci) => (
                    <td key={ci} style={{
                      padding: '10px 14px',
                      color: ci === 0 ? S.n900 : S.n500,
                      fontWeight: ci === 0 ? 600 : 400,
                    }}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )

    default:
      return null
  }
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
  const CAT_COLOR: Record<string, string> = {
    Cafes: '#0F766E', Restaurants: '#B45309', Gyms: '#0369A1',
    Retail: '#7C3AED', Finance: '#059669', Strategy: '#64748B',
    Data: '#0891B2', Sydney: '#1D4ED8', Melbourne: '#7C3AED',
    Brisbane: '#B45309', Perth: '#0F766E', Tools: '#6B7280',
  }
  const catColor = CAT_COLOR[post.category] || S.brand

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; }
      `}</style>

      <div style={{ minHeight: '100vh', background: S.white, fontFamily: S.font }}>

        {/* Nav */}
        <div style={{
          background: S.headerBg, padding: '0 24px', height: 52,
          display: 'flex', alignItems: 'center', gap: 10,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 26, height: 26, borderRadius: 7,
              background: 'linear-gradient(135deg,#0F766E,#14B8A6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 900, fontSize: 12,
            }}>
              L
            </div>
            <span style={{ fontWeight: 800, fontSize: 14, color: '#F9FAFB', letterSpacing: '-0.02em' }}>
              Locatalyze
            </span>
          </Link>
          <span style={{ color: '#374151', fontSize: 14 }}>/</span>
          <Link href="/blog" style={{ fontSize: 13, color: '#9CA3AF' }}>Blog</Link>
          <span style={{ color: '#374151', fontSize: 14 }}>/</span>
          <span style={{ fontSize: 13, color: '#6B7280' }}>{post.category}</span>
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
                color: catColor, textTransform: 'uppercase',
                letterSpacing: '0.07em',
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 4, padding: '3px 9px',
              }}>
                {post.category}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
                {post.date} · {post.readTime}
              </span>
            </div>
            <h1 style={{
              fontSize: 'clamp(20px,4vw,30px)', fontWeight: 800,
              color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.2,
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
                  {post.authorRole && <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{post.authorRole}</p>}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Two-column layout */}
        <div style={{ maxWidth: 1040, margin: '0 auto', padding: '0 24px', display: 'flex', gap: 48, alignItems: 'flex-start' }}>

          {/* Main content */}
          <div style={{ flex: 1, minWidth: 0, padding: '44px 0 80px' }}>

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
            {post.sections.map((section: Section, i: number) => renderSection(section, i))}

            {/* CTA */}
            <div style={{
              background: `linear-gradient(135deg, ${S.brand}, #0891B2)`,
              borderRadius: 14, padding: '32px',
              textAlign: 'center', marginTop: 52, marginBottom: 16,
            }}>
              <h3 style={{ fontSize: 19, fontWeight: 800, color: '#fff', marginBottom: 8 }}>
                Check if your location is worth it
              </h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 6, lineHeight: 1.6 }}>
                See competition, demand, and risk before committing to a lease.
              </p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 20 }}>No signup required to start</p>
              <Link href="/onboarding" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: '#fff', color: S.brand,
                borderRadius: 10, padding: '11px 24px',
                fontSize: 14, fontWeight: 800,
              }}>
                Check your location →
              </Link>
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
                Check your location
              </p>
              <p style={{ fontSize: 12, color: '#6B7280', marginBottom: 6, lineHeight: 1.6 }}>
                See competition and risk instantly.
              </p>
              <p style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 14 }}>No signup required to start</p>
              <Link href="/onboarding" style={{
                display: 'block', textAlign: 'center',
                background: S.brand, color: '#fff',
                borderRadius: 8, padding: '10px',
                fontSize: 13, fontWeight: 700,
              }}>
                Check your location →
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
                { href: '/analyse/perth', label: 'Perth' },
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