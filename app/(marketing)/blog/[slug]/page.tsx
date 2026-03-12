export const dynamic = 'force-dynamic'
export const dynamicParams = true
// 🔑 KEY CHANGE: force-dynamic prevents ALL static pre-rendering at build time

import Link from 'next/link'
// lazy-loaded below

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
  teal:  { color: S.brand,   bg: S.brandFaded, border: S.brandBorder },
  amber: { color: S.amber,   bg: S.amberBg,    border: S.amberBdr },
  green: { color: S.emerald, bg: S.emeraldBg,  border: S.emeraldBdr },
  red:   { color: S.red,     bg: S.redBg,      border: S.redBdr },
}

function renderSection(section: Section, idx: number) {
  const bodyStyle: React.CSSProperties = { fontSize: 16, color: '#57534E', lineHeight: 1.85, marginBottom: 18 }
  switch (section.type) {
    case 'h2':
      return <h2 key={idx} style={{ fontSize: 'clamp(19px,3vw,23px)', fontWeight: 800, color: S.n900, letterSpacing: '-0.02em', marginBottom: 12, marginTop: 36, lineHeight: 1.3 }}>{section.text}</h2>
    case 'h3':
      return <h3 key={idx} style={{ fontSize: 16, fontWeight: 700, color: S.n800, marginBottom: 10, marginTop: 24 }}>{section.text}</h3>
    case 'p':
      return <p key={idx} style={bodyStyle}>{section.text}</p>
    case 'img':
      return (
        <div key={idx} style={{ margin: '28px 0' }}>
          <img src={section.src} alt={section.caption} style={{ width: '100%', borderRadius: 12, display: 'block', maxHeight: 380, objectFit: 'cover' }} />
          <p style={{ fontSize: 12, color: S.n400, textAlign: 'center', marginTop: 7, fontStyle: 'italic' }}>{section.caption}</p>
        </div>
      )
    case 'pullquote':
      return (
        <blockquote key={idx} style={{ borderLeft: `4px solid ${S.brand}`, padding: '14px 22px', margin: '28px 0', background: S.brandFaded, borderRadius: '0 12px 12px 0' }}>
          <p style={{ fontSize: 17, fontWeight: 700, color: S.n800, lineHeight: 1.65, fontStyle: 'italic', margin: 0 }}>"{section.text}"</p>
        </blockquote>
      )
    case 'callout': {
      const v = VARIANT_COLORS[section.variant]
      return (
        <div key={idx} style={{ background: v.bg, border: `1px solid ${v.border}`, borderRadius: 12, padding: '18px 20px', margin: '24px 0' }}>
          <p style={{ fontSize: 13, fontWeight: 800, color: v.color, marginBottom: 8 }}>{section.icon} {section.title}</p>
          <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.8, whiteSpace: 'pre-line' }}>{section.body}</p>
        </div>
      )
    }
    case 'list':
      return (
        <div key={idx} style={{ margin: '20px 0' }}>
          {section.heading && <p style={{ fontSize: 12, fontWeight: 800, color: S.n700, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{section.heading}</p>}
          <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 12, overflow: 'hidden' }}>
            {section.items.map((item, i) => (
              <div key={i} style={{ padding: '11px 16px', borderBottom: i < section.items.length - 1 ? `1px solid ${S.n100}` : 'none', display: 'flex', gap: 10 }}>
                <span style={{ color: S.brand, fontWeight: 800, flexShrink: 0 }}>→</span>
                <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.65 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      )
    case 'numbered':
      return (
        <div key={idx} style={{ margin: '20px 0' }}>
          {section.heading && <p style={{ fontSize: 12, fontWeight: 800, color: S.n700, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{section.heading}</p>}
          <ol style={{ paddingLeft: 0, listStyle: 'none', margin: 0 }}>
            {section.items.map((item, i) => (
              <li key={i} style={{ display: 'flex', gap: 14, padding: '11px 0', borderBottom: i < section.items.length - 1 ? `1px solid ${S.n100}` : 'none' }}>
                <span style={{ width: 24, height: 24, borderRadius: 8, background: S.brand, color: '#fff', fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
                <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.65 }}>{item}</p>
              </li>
            ))}
          </ol>
        </div>
      )
    case 'stats':
      return (
        <div key={idx} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 12, margin: '24px 0' }}>
          {section.items.map(stat => (
            <div key={stat.label} style={{ background: S.n50, border: `1px solid ${S.n200}`, borderRadius: 12, padding: '16px', textAlign: 'center' }}>
              <p style={{ fontSize: 26, fontWeight: 900, color: S.brand, letterSpacing: '-0.03em', lineHeight: 1 }}>{stat.value}</p>
              <p style={{ fontSize: 11, color: S.n500, marginTop: 5, lineHeight: 1.4 }}>{stat.label}</p>
            </div>
          ))}
        </div>
      )
    case 'table':
      return (
        <div key={idx} style={{ margin: '24px 0', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: S.white, border: `1px solid ${S.n200}`, borderRadius: 12, overflow: 'hidden', fontSize: 13 }}>
            <thead>
              <tr style={{ background: S.n50 }}>
                {section.headers.map(h => <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: S.n700, borderBottom: `1px solid ${S.n200}`, whiteSpace: 'nowrap' }}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {section.rows.map((row, ri) => (
                <tr key={ri} style={{ borderBottom: ri < section.rows.length - 1 ? `1px solid ${S.n100}` : 'none' }}>
                  {row.map((cell, ci) => <td key={ci} style={{ padding: '10px 14px', color: ci === 0 ? S.n900 : S.n500, fontWeight: ci === 0 ? 700 : 400 }}>{cell}</td>)}
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

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = POSTS[slug]

  if (!post) {
    return (
      <>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <div style={{ minHeight: '100vh', background: S.n50, fontFamily: S.font, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: 40, textAlign: 'center' }}>
          <span style={{ fontSize: 48, marginBottom: 16 }}>📭</span>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: S.n900, marginBottom: 8 }}>Article not found</h1>
          <p style={{ fontSize: 15, color: S.n500, marginBottom: 24 }}>This article may have moved or been updated.</p>
          <Link href="/blog" style={{ background: S.brand, color: '#fff', borderRadius: 10, padding: '11px 24px', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>← Back to blog</Link>
        </div>
      </>
    )
  }

  const related = POST_LIST.filter(p => p.slug !== slug && p.category === post.category).slice(0, 2)
  const fallbackRelated = POST_LIST.filter(p => p.slug !== slug).slice(0, 2)

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <div style={{ minHeight: '100vh', background: S.n50, fontFamily: S.font }}>

        {/* Nav */}
        <div style={{ background: S.headerBg, padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: 'linear-gradient(135deg,#0F766E,#14B8A6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 12 }}>L</div>
            <span style={{ fontWeight: 800, fontSize: 14, color: '#F9FAFB', letterSpacing: '-0.02em' }}>Locatalyze</span>
          </Link>
          <span style={{ color: '#374151' }}>/</span>
          <Link href="/blog" style={{ fontSize: 13, color: '#9CA3AF', textDecoration: 'none' }}>Blog</Link>
          <span style={{ color: '#374151' }}>/</span>
          <span style={{ fontSize: 13, color: '#6B7280' }}>{post.category}</span>
        </div>

        {/* Hero image */}
        <div style={{ position: 'relative', height: 360, overflow: 'hidden' }}>
          <img src={post.heroImg} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,rgba(0,0,0,0.1),rgba(0,0,0,0.55))' }} />
          <div style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 760, padding: '0 24px' }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
              <span style={{ background: S.brand, color: '#fff', borderRadius: 20, padding: '3px 12px', fontSize: 11, fontWeight: 700 }}>{post.category}</span>
              <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12 }}>{post.date} · {post.readTime}</span>
            </div>
            <h1 style={{ fontSize: 'clamp(20px,4vw,30px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.25, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>{post.title}</h1>
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '44px 20px 80px' }}>
          <p style={{ fontSize: 17, color: S.n700, lineHeight: 1.85, marginBottom: 36, fontWeight: 500, borderLeft: `3px solid ${S.brand}`, paddingLeft: 18 }}>{post.intro}</p>
          <div style={{ display: 'flex', gap: 8, marginBottom: 36, flexWrap: 'wrap' }}>
            {post.tags.map(tag => (
              <span key={tag} style={{ background: S.n50, color: S.n500, border: `1px solid ${S.n200}`, borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 600 }}>{tag}</span>
            ))}
          </div>

          {post.sections.map((section, i) => renderSection(section, i))}

          {/* CTA */}
          <div style={{ background: `linear-gradient(135deg,${S.brand},#0891B2)`, borderRadius: 16, padding: '32px', textAlign: 'center', marginTop: 48, marginBottom: 12 }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Analyse your location now — free</h3>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 20 }}>Paste any Australian address. Get competition counts, demographic scoring and a full financial model in 30 seconds.</p>
            <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fff', color: S.brand, borderRadius: 10, padding: '11px 24px', fontSize: 14, fontWeight: 800, textDecoration: 'none' }}>
              Run my free analysis →
            </Link>
          </div>

          {/* Related articles */}
          {(related.length > 0 || fallbackRelated.length > 0) && (
            <div style={{ marginTop: 48 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: S.n900, marginBottom: 16 }}>Related articles</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 14 }}>
                {(related.length > 0 ? related : fallbackRelated).map(r => (
                  <Link key={r.slug} href={`/blog/${r.slug}`} style={{ textDecoration: 'none' }}>
                    <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 12, overflow: 'hidden' }}>
                      <img src={r.heroImg} alt={r.title} style={{ width: '100%', height: 120, objectFit: 'cover', display: 'block' }} />
                      <div style={{ padding: '14px' }}>
                        <span style={{ background: S.brandFaded, color: S.brand, borderRadius: 20, padding: '2px 9px', fontSize: 10, fontWeight: 700 }}>{r.category}</span>
                        <p style={{ fontSize: 13, fontWeight: 700, color: S.n900, lineHeight: 1.4, marginTop: 8, marginBottom: 6 }}>{r.title}</p>
                        <span style={{ fontSize: 12, color: S.brand, fontWeight: 600 }}>Read →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: 32, textAlign: 'center' }}>
            <Link href="/blog" style={{ fontSize: 14, color: S.brand, fontWeight: 700, textDecoration: 'none' }}>← Back to all articles</Link>
          </div>
        </div>
      </div>
    </>
  )
}
