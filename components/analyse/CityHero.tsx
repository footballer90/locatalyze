import Link from 'next/link'
import { C } from './AnalyseTheme'

interface StatChip {
  text: string
}

interface Props {
  cityName: string
  citySlug: string
  tagline: string
  statChips?: StatChip[]
}

export function CityHero({ cityName, citySlug, tagline, statChips = [] }: Props) {
  return (
    <section
      style={{
        background: `linear-gradient(135deg, ${C.brandDark} 0%, ${C.brand} 55%, ${C.brandLight} 100%)`,
        color: C.white,
        padding: '64px 24px',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <nav
          style={{
            fontSize: '13px',
            marginBottom: '20px',
            opacity: 0.85,
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            alignItems: 'center',
          }}
        >
          <Link href="/analyse" style={{ color: C.white, textDecoration: 'none' }}>
            Location Guides
          </Link>
          <span>›</span>
          <span style={{ fontWeight: 600 }}>{cityName}</span>
        </nav>
        <h1
          style={{
            fontSize: 'clamp(28px, 5vw, 44px)',
            fontWeight: 800,
            marginBottom: '16px',
            lineHeight: '1.2',
          }}
        >
          Best Suburbs to Start a Business in {cityName}{' '}
          <span style={{ opacity: 0.85 }}>(2026)</span>
        </h1>
        <p
          style={{
            fontSize: '18px',
            marginBottom: '36px',
            lineHeight: '1.65',
            opacity: 0.95,
            maxWidth: '680px',
            margin: '0 auto 36px',
          }}
        >
          {tagline}
        </p>
        {statChips.length > 0 && (
          <div
            style={{
              display: 'flex',
              gap: '10px',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '36px',
            }}
          >
            {statChips.map((chip) => (
              <div
                key={chip.text}
                style={{
                  padding: '9px 15px',
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: C.white,
                  border: '1px solid rgba(255,255,255,0.25)',
                }}
              >
                {chip.text}
              </div>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/onboarding"
            style={{
              padding: '13px 26px',
              backgroundColor: C.emerald,
              color: C.white,
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 700,
            }}
          >
            Analyse your address free →
          </Link>
          <a
            href="#suburbs"
            style={{
              padding: '13px 26px',
              backgroundColor: 'transparent',
              color: C.white,
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 600,
              border: `2px solid rgba(255,255,255,0.6)`,
            }}
          >
            See suburb scores ↓
          </a>
        </div>
      </div>
    </section>
  )
}
