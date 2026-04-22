// Shared section renderer for long-form marketing content (blog, insights, etc.)
import type { CSSProperties } from 'react'
import type { Section } from '@/lib/blog-posts'
import { BLOG_THEME } from '@/lib/blog-theme'

const S = {
  brand: BLOG_THEME.color.primary,
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

const VARIANT_COLORS = {
  teal:  { color: S.brand,   bg: S.brandFaded,  border: S.brandBorder },
  amber: { color: S.amber,   bg: S.amberBg,     border: S.amberBdr },
  green: { color: S.emerald, bg: S.emeraldBg,   border: S.emeraldBdr },
  red:   { color: S.red,     bg: S.redBg,       border: S.redBdr },
}

function stripEmojis(str: string): string {
  return str.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '').replace(/\s{2,}/g, ' ').trim()
}

export function renderMarketingSection(section: Section, idx: number) {
  const body: CSSProperties = {
    fontSize: BLOG_THEME.type.body,
    color: S.n700,
    lineHeight: 1.85,
    marginBottom: 20,
  }
  switch (section.type) {

    case 'h2':
      return (
        <h2 key={idx} style={{
          fontSize: BLOG_THEME.type.h2, fontWeight: 800,
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
          fontSize: 20, fontWeight: 700, color: S.n800,
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

    case 'inline-cta':
      return (
        <div key={idx} style={{
          margin: '36px 0',
          padding: '20px 24px',
          background: S.headerBg,
          borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 20, flexWrap: 'wrap' as const,
          border: '1px solid rgba(20,184,166,0.2)',
        }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#E5E7EB', lineHeight: 1.55, flex: 1, minWidth: 200, margin: 0 }}>
            {section.hook}
          </p>
          <a href={section.href} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: S.brand, color: '#fff',
            borderRadius: 8, padding: '10px 20px',
            fontSize: 13, fontWeight: 800, textDecoration: 'none',
            whiteSpace: 'nowrap' as const, flexShrink: 0,
          }}>
            {section.label} →
          </a>
        </div>
      )

    default:
      return null
  }
}
