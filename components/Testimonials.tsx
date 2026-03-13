'use client'
// Save to: components/Testimonials.tsx
// Usage: import Testimonials from '@/components/Testimonials'
// Add <Testimonials /> in app/page.tsx (after demo section, before pricing)

const testimonials = [
  {
    initials: 'SB',
    name: 'Steven B.',
    role: 'VacDirect Australia · Fairymeadow, NSW',
    outcome: 'New store validated',
    quote:
      "I was sitting on the fence about a second location for months. Ran the analysis in under a minute — the feasibility score and competitor map made the decision obvious. We opened, and revenue is tracking above forecast.",
    color: 'teal' as const,
  },
  {
    initials: 'HC',
    name: 'Hetsav C.',
    role: 'Pizza Hut Franchisee · NSW',
    outcome: 'Franchise site locked in',
    quote:
      "Finding the right suburb for a Pizza Hut franchise is high stakes. You need demographics, competition density, foot traffic patterns. Locatalyze gave me a full picture in one report. Saved weeks of research.",
    color: 'blue' as const,
  },
  {
    initials: 'AW',
    name: 'Andrew W.',
    role: 'Restaurant owner · Perth, WA',
    outcome: 'Restaurant acquisition validated',
    quote:
      "Before I signed on a restaurant I was buying, I ran the location through Locatalyze. The demographic breakdown and competitor analysis gave me a proper understanding of what I was walking into. Went in with total confidence.",
    color: 'amber' as const,
  },
]

const AVATAR_COLORS = {
  teal:  { bg: '#0F766E', border: '#0FDECE' },
  blue:  { bg: '#185FA5', border: '#378ADD' },
  amber: { bg: '#854F0B', border: '#EF9F27' },
}

function StarRating() {
  return (
    <div style={{ display: 'flex', gap: 3, marginBottom: 12 }}>
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  )
}

export default function Testimonials() {
  return (
    <section style={{
      padding: '5rem 1.5rem',
      maxWidth: 960,
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <span style={{
        fontSize: 11, fontWeight: 700, letterSpacing: '.1em',
        textTransform: 'uppercase' as const, color: '#0FDECE',
        display: 'block', marginBottom: 10,
      }}>
        Real customers. Real results.
      </span>
      <h2 style={{
        fontSize: 32, fontWeight: 800, color: '#0F172A',
        margin: '0 0 10px', lineHeight: 1.2,
      }}>
        Businesses that made better<br />location decisions
      </h2>
      <p style={{
        fontSize: 16, color: '#475569', lineHeight: 1.65,
        marginBottom: '2.5rem', maxWidth: 520,
      }}>
        From franchise owners to first-time buyers — here&apos;s what they found.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 16,
      }}>
        {testimonials.map((t) => {
          const av = AVATAR_COLORS[t.color]
          return (
            <div
              key={t.name}
              style={{
                background: '#fff',
                border: '1px solid #E2E8F0',
                borderRadius: 16,
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column' as const,
              }}
            >
              <StarRating />

              {/* Outcome badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                fontSize: 11, fontWeight: 600, color: '#085041',
                background: '#E1F5EE', padding: '4px 10px',
                borderRadius: 6, marginBottom: 14, width: 'fit-content',
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: '#0FDECE', flexShrink: 0, display: 'inline-block',
                }}/>
                {t.outcome}
              </div>

              {/* Quote */}
              <p style={{
                fontSize: 15, color: '#1E293B', lineHeight: 1.75,
                marginBottom: '1.25rem', flex: 1, fontStyle: 'italic',
              }}>
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Divider */}
              <div style={{ height: 1, background: '#F1F5F9', marginBottom: '1rem' }} />

              {/* Author */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                  background: av.bg, border: `2px solid ${av.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, color: 'white',
                }}>
                  {t.initials}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: '#64748B', marginTop: 1 }}>{t.role}</div>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    fontSize: 10, fontWeight: 700, color: '#085041',
                    background: '#E1F5EE', padding: '2px 7px',
                    borderRadius: 20, marginTop: 5,
                  }}>
                    <span style={{
                      width: 5, height: 5, borderRadius: '50%',
                      background: '#0FDECE', display: 'inline-block',
                    }}/>
                    Verified customer
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
