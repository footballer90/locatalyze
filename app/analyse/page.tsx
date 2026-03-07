import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Business Location Analysis Australia | Locatalyze',
  description: 'AI-powered business location analysis for cafes, restaurants, gyms, retail and more across Sydney, Melbourne, Brisbane, Perth and all major Australian cities.',
}

const CITIES = [
  { slug: 'sydney',     name: 'Sydney',     state: 'NSW', emoji: '🌉' },
  { slug: 'melbourne',  name: 'Melbourne',  state: 'VIC', emoji: '🏙️' },
  { slug: 'brisbane',   name: 'Brisbane',   state: 'QLD', emoji: '☀️' },
  { slug: 'perth',      name: 'Perth',      state: 'WA',  emoji: '🌊' },
  { slug: 'adelaide',   name: 'Adelaide',   state: 'SA',  emoji: '🍷' },
  { slug: 'gold_coast', name: 'Gold Coast', state: 'QLD', emoji: '🏄' },
  { slug: 'canberra',   name: 'Canberra',   state: 'ACT', emoji: '🏛️' },
  { slug: 'hobart',     name: 'Hobart',     state: 'TAS', emoji: '🏔️' },
]

const BIZ_TYPES = [
  { slug: 'cafe',       name: 'Cafe',                icon: '☕' },
  { slug: 'restaurant', name: 'Restaurant',          icon: '🍽️' },
  { slug: 'gym',        name: 'Gym & Fitness',       icon: '💪' },
  { slug: 'retail',     name: 'Retail Store',        icon: '🛍️' },
  { slug: 'bakery',     name: 'Bakery',              icon: '🥐' },
  { slug: 'salon',      name: 'Hair & Beauty Salon', icon: '💈' },
]

const S = {
  brand: '#0F766E', brandLight: '#14B8A6', brandFaded: '#F0FDFA', brandBorder: '#99F6E4',
  n50: '#FAFAF9', n100: '#F5F5F4', n200: '#E7E5E4', n400: '#A8A29E',
  n500: '#78716C', n700: '#44403C', n900: '#1C1917', white: '#FFFFFF',
}

export default function AnalyseIndexPage() {
  return (
    <div style={{ minHeight: '100vh', background: S.white, fontFamily: "'DM Sans','Helvetica Neue',Arial,sans-serif" }}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0;} a{text-decoration:none;color:inherit;} @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');`}</style>

      {/* Nav */}
      <nav style={{ background: S.white, borderBottom: `1px solid ${S.n100}`, padding: '0 24px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 9, background: `linear-gradient(135deg,${S.brand},${S.brandLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: S.white, fontWeight: 800, fontSize: 13 }}>L</div>
          <span style={{ fontWeight: 800, fontSize: 15, letterSpacing: '-0.02em', color: S.n900 }}>Locatalyze</span>
        </Link>
        <Link href="/auth/signup" style={{ fontSize: 13, background: S.brand, color: S.white, borderRadius: 9, padding: '8px 16px', fontWeight: 700 }}>
          Analyse my location free →
        </Link>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: S.brandFaded, border: `1px solid ${S.brandBorder}`, borderRadius: 100, padding: '5px 14px', fontSize: 12, fontWeight: 700, color: S.brand, marginBottom: 16 }}>
            📍 48 location guides across Australia
          </div>
          <h1 style={{ fontSize: 38, fontWeight: 900, color: S.n900, letterSpacing: '-0.04em', lineHeight: 1.15, marginBottom: 14 }}>
            Business Location Analysis<br />Across Australia
          </h1>
          <p style={{ fontSize: 16, color: S.n500, lineHeight: 1.75, maxWidth: 520, margin: '0 auto' }}>
            Find the best location for your business. AI analysis of competition, foot traffic, demographics and profitability for every major Australian city.
          </p>
        </div>

        {/* By business type */}
        <h2 style={{ fontSize: 20, fontWeight: 800, color: S.n900, letterSpacing: '-0.02em', marginBottom: 16 }}>By Business Type</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 52 }}>
          {BIZ_TYPES.map(b => (
            <div key={b.slug} style={{ background: S.n50, border: `1px solid ${S.n200}`, borderRadius: 14, padding: '18px' }}>
              <p style={{ fontSize: 24, marginBottom: 8 }}>{b.icon}</p>
              <p style={{ fontSize: 14, fontWeight: 800, color: S.n900, marginBottom: 10 }}>{b.name}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {CITIES.slice(0, 5).map(c => (
                  <Link key={c.slug} href={`/analyse/${b.slug}/${c.slug}`} style={{ fontSize: 12, color: S.brand, fontWeight: 600 }}>
                    → {b.name} in {c.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* By city */}
        <h2 style={{ fontSize: 20, fontWeight: 800, color: S.n900, letterSpacing: '-0.02em', marginBottom: 16 }}>By City</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 52 }}>
          {CITIES.map(c => (
            <div key={c.slug} style={{ background: S.n50, border: `1px solid ${S.n200}`, borderRadius: 14, padding: '18px' }}>
              <p style={{ fontSize: 22, marginBottom: 6 }}>{c.emoji}</p>
              <p style={{ fontSize: 14, fontWeight: 800, color: S.n900, marginBottom: 10 }}>{c.name} <span style={{ fontSize: 11, color: S.n400, fontWeight: 500 }}>{c.state}</span></p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {BIZ_TYPES.map(b => (
                  <Link key={b.slug} href={`/analyse/${b.slug}/${c.slug}`} style={{ fontSize: 12, color: S.brand, fontWeight: 600 }}>
                    → {b.icon} {b.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ background: `linear-gradient(135deg,${S.brand} 0%,#0891B2 100%)`, borderRadius: 20, padding: '36px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: S.white, letterSpacing: '-0.03em', marginBottom: 10 }}>
            Ready to analyse your specific address?
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 22 }}>Enter your exact address for a real analysis — not estimates.</p>
          <Link href="/auth/signup" style={{ display: 'inline-flex', background: S.white, color: S.brand, borderRadius: 12, padding: '13px 28px', fontWeight: 800, fontSize: 15 }}>
            Analyse my location free →
          </Link>
        </div>
      </div>
    </div>
  )
}