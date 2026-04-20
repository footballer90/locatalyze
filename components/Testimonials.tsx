/**
 * components/Testimonials.tsx
 *
 * Homepage social-proof section. Renders `null` while there are no
 * real testimonials in `lib/marketing/testimonials.ts`.
 *
 * Intentional design choices:
 *   - The section does NOT self-include on the page unless there is at
 *     least one real quote. This avoids the anti-pattern of shipping an
 *     empty "Loved by 2,000+ operators" heading above zero quotes.
 *   - No photos. Stock headshots are a trust-destroyer. If a real photo
 *     is available, the `sourceUrl` link carries the face.
 *   - No carousel. Carousels hide content; 1–3 quotes fit on one row.
 *   - Attribution is styled stronger than the quote body, because the
 *     credibility lift comes from the name/role, not the words.
 */

import Link from 'next/link'
import { TESTIMONIALS, type Testimonial } from '@/lib/marketing/testimonials'

const L = {
  white: '#FFFFFF',
  mint: '#F0FDF4',
  emerald: '#10B981',
  emeraldDk: '#059669',
  emeraldLt: '#D1FAE5',
  emeraldXlt: '#ECFDF5',
  slate: '#0F172A',
  muted: '#64748B',
  border: '#E2E8F0',
} as const

function formatCapturedAt(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-AU', { month: 'short', year: 'numeric' })
}

function Quote({ t }: { t: Testimonial }) {
  const date = t.capturedAt ? formatCapturedAt(t.capturedAt) : ''
  return (
    <figure
      style={{
        background: L.white,
        border: `1px solid ${L.border}`,
        borderRadius: 16,
        padding: '24px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        boxShadow: '0 1px 2px rgba(15,23,42,.03)',
      }}
    >
      <span
        aria-hidden
        style={{
          fontSize: 34,
          lineHeight: 1,
          color: L.emerald,
          fontWeight: 900,
          fontFamily: 'Georgia, serif',
          marginBottom: -6,
        }}
      >
        &ldquo;
      </span>
      <blockquote
        style={{
          fontSize: 15,
          lineHeight: 1.55,
          color: L.slate,
          fontWeight: 500,
          margin: 0,
          letterSpacing: '-0.005em',
        }}
      >
        {t.quote}
      </blockquote>
      <figcaption
        style={{
          marginTop: 'auto',
          paddingTop: 4,
          borderTop: `1px solid ${L.border}`,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, marginTop: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: L.slate }}>
            {t.sourceUrl ? (
              <Link
                href={t.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: L.slate, textDecoration: 'underline', textDecorationColor: L.border, textUnderlineOffset: 3 }}
              >
                {t.attribution}
              </Link>
            ) : (
              t.attribution
            )}
          </span>
          {date ? (
            <span style={{ fontSize: 11, color: L.muted, fontWeight: 600, whiteSpace: 'nowrap' }}>{date}</span>
          ) : null}
        </div>
        {t.outcome ? (
          <span
            style={{
              display: 'inline-flex',
              alignSelf: 'flex-start',
              background: L.emeraldXlt,
              color: L.emeraldDk,
              border: `1px solid ${L.emeraldLt}`,
              borderRadius: 6,
              padding: '2px 8px',
              fontSize: 11,
              fontWeight: 700,
              marginTop: 2,
            }}
          >
            {t.outcome}
          </span>
        ) : null}
      </figcaption>
    </figure>
  )
}

export default function Testimonials({ isMobile = false }: { isMobile?: boolean }) {
  if (TESTIMONIALS.length === 0) return null

  const visible = TESTIMONIALS.slice(0, 3)
  const cols = isMobile ? '1fr' : visible.length === 1 ? 'minmax(0, 520px)' : visible.length === 2 ? '1fr 1fr' : 'repeat(3, 1fr)'

  return (
    <section
      id="customers"
      aria-label="What operators tell us"
      style={{
        padding: isMobile ? '56px 20px' : '80px 24px',
        background: L.mint,
        contentVisibility: 'auto',
        containIntrinsicSize: '600px',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: isMobile ? 28 : 40 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: L.emeraldXlt,
              border: `1px solid ${L.emeraldLt}`,
              borderRadius: 20,
              padding: '5px 14px',
              fontSize: 11,
              fontWeight: 700,
              color: L.emeraldDk,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 14,
            }}
          >
            From operators
          </div>
          <h2
            style={{
              fontSize: isMobile ? 26 : 36,
              fontWeight: 900,
              color: L.slate,
              letterSpacing: '-0.04em',
              lineHeight: 1.15,
              marginBottom: 8,
            }}
          >
            What they do with the report
          </h2>
          <p style={{ fontSize: 14, color: L.muted, maxWidth: 560, margin: '0 auto' }}>
            A location report is useful if it changes what you do at the lease table. Here&apos;s what it changed for recent operators.
          </p>
        </header>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: cols,
            gap: 16,
            justifyContent: visible.length === 1 ? 'center' : 'stretch',
          }}
        >
          {visible.map((t, i) => (
            <Quote key={i} t={t} />
          ))}
        </div>
      </div>
    </section>
  )
}
