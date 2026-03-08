import Link from 'next/link'

const S = {
  brand: '#0F766E', brandLight: '#14B8A6', brandFaded: '#F0FDFA', brandBorder: '#99F6E4',
  n50: '#FAFAF9', n100: '#F5F5F4', n200: '#E7E5E4', n400: '#A8A29E', n500: '#78716C',
  n700: '#44403C', n800: '#292524', n900: '#1C1917', white: '#FFFFFF',
  headerBg: '#0C1F1C', font: "'DM Sans', sans-serif",
}

const CITIES = [
  { name: 'Sydney', state: 'NSW', suburbs: ['Newtown', 'Surry Hills', 'Bondi', 'Parramatta', 'Chatswood'] },
  { name: 'Melbourne', state: 'VIC', suburbs: ['Fitzroy', 'Richmond', 'St Kilda', 'Brunswick', 'Collingwood'] },
  { name: 'Brisbane', state: 'QLD', suburbs: ['Fortitude Valley', 'West End', 'Paddington', 'Newstead', 'Ascot'] },
  { name: 'Perth', state: 'WA', suburbs: ['Subiaco', 'Fremantle', 'Leederville', 'Mount Lawley', 'Northbridge'] },
  { name: 'Adelaide', state: 'SA', suburbs: ['Rundle Mall', 'Unley', 'Norwood', 'Glenelg', 'Prospect'] },
  { name: 'Canberra', state: 'ACT', suburbs: ['Braddon', 'Kingston', 'Manuka', 'New Acton', 'Dickson'] },
]

const TYPES = [
  { icon: '☕', label: 'Cafes & Coffee',   href: '/use-cases/cafes',       desc: 'Find high-demand café locations' },
  { icon: '🍽️', label: 'Restaurants',      href: '/use-cases/restaurants', desc: 'Analyse dining location viability' },
  { icon: '👗', label: 'Retail Stores',    href: '/use-cases/retail',       desc: 'Score foot traffic for retail' },
  { icon: '💪', label: 'Gyms & Fitness',   href: '/use-cases/gyms',         desc: 'Assess gym market saturation' },
  { icon: '🥐', label: 'Bakeries',         href: '/use-cases/bakeries',     desc: 'Bakery location demand signals' },
  { icon: '🏪', label: 'All business types', href: '/use-cases/all',        desc: 'Any retail or service business' },
]

export default function LocationInsightsPage() {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <div style={{ minHeight: '100vh', background: S.n50, fontFamily: S.font }}>

        <div style={{ background: S.headerBg, padding: '60px 24px 48px', textAlign: 'center' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 32 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg,${S.brand},${S.brandLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 13 }}>L</div>
            <span style={{ fontWeight: 800, fontSize: 15, color: '#F9FAFB', letterSpacing: '-0.02em' }}>Locatalyze</span>
          </Link>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(15,118,110,0.15)', border: '1px solid rgba(15,118,110,0.3)', borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700, color: S.brandLight, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 16 }}>Location Insights</div>
          <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#F9FAFB', letterSpacing: '-0.5px', marginBottom: 12 }}>Australian location intelligence hub</h1>
          <p style={{ fontSize: 15, color: '#9CA3AF', maxWidth: 520, margin: '0 auto' }}>Browse location insights by city, suburb and business type — or run your own custom analysis in 30 seconds.</p>
        </div>

        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 24px 80px' }}>

          {/* By business type */}
          <div style={{ marginBottom: 56 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: S.n900, marginBottom: 6 }}>Browse by business type</h2>
            <p style={{ fontSize: 14, color: S.n500, marginBottom: 24 }}>Each guide explains what to look for when analysing locations for that business type.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
              {TYPES.map(t => (
                <Link key={t.href} href={t.href} style={{ textDecoration: 'none' }}>
                  <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 14, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
                    <span style={{ fontSize: 28 }}>{t.icon}</span>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: S.n900, marginBottom: 2 }}>{t.label}</p>
                      <p style={{ fontSize: 12, color: S.n500 }}>{t.desc}</p>
                    </div>
                    <span style={{ marginLeft: 'auto', color: S.brand, fontSize: 16 }}>→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* By city */}
          <div style={{ marginBottom: 56 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: S.n900, marginBottom: 6 }}>Browse by city</h2>
            <p style={{ fontSize: 14, color: S.n500, marginBottom: 24 }}>Suburb-level location insights for Australia's major cities.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
              {CITIES.map(city => (
                <div key={city.name} style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 14, padding: '20px 22px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: S.brandFaded, border: `1px solid ${S.brandBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🏙️</div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: S.n900 }}>{city.name}</p>
                      <p style={{ fontSize: 11, color: S.n400 }}>{city.state}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {city.suburbs.map(s => (
                      <Link key={s} href={`/analyse/${city.name.toLowerCase()}-${s.toLowerCase().replace(/\s+/g, '-')}`}
                        style={{ fontSize: 12, color: S.brand, background: S.brandFaded, border: `1px solid ${S.brandBorder}`, borderRadius: 20, padding: '3px 10px', textDecoration: 'none', fontWeight: 600 }}>
                        {s}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ background: `linear-gradient(135deg,${S.brand},#0891B2)`, borderRadius: 20, padding: '40px', textAlign: 'center' }}>
            <h3 style={{ fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: 10 }}>Analyse any Australian address</h3>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', marginBottom: 24 }}>Type in any street address and get a full feasibility report in 30 seconds. Free to start.</p>
            <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fff', color: S.brand, borderRadius: 10, padding: '12px 24px', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
              Run my free analysis →
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}