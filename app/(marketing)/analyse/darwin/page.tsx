import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Best Suburbs to Open a Business in Darwin 2026 | Locatalyze',
  description: 'Discover the best and worst suburbs to open a business in Darwin. Real data on rent, competition, demographics and demand — before you sign a lease.',
  alternates: { canonical: 'https://www.locatalyze.com/analyse/darwin' },
}

const S = {
  brand: '#0F766E', brandLight: '#14B8A6', brandFaded: '#F0FDFA', brandBorder: '#99F6E4',
  n50: '#FAFAF9', n100: '#F5F5F4', n200: '#E7E5E4', n400: '#A8A29E',
  n500: '#78716C', n700: '#44403C', n800: '#292524', n900: '#1C1917',
  white: '#FFFFFF', emerald: '#059669', emeraldBg: '#ECFDF5', emeraldBdr: '#A7F3D0',
  amber: '#D97706', amberBg: '#FFFBEB', amberBdr: '#FDE68A',
  red: '#DC2626', redBg: '#FEF2F2', redBdr: '#FECACA',
  font: "'DM Sans','Helvetica Neue',Arial,sans-serif",
}

export default function DarwinAnalysePage() {
  return (
    <div style={{ fontFamily: S.font, background: S.n50, color: S.n900, minHeight: '100vh' }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        h1,h2,h3 { letter-spacing: -0.03em; line-height: 1.25; }
        p { line-height: 1.75; }
        @media (max-width: 768px) {
          .two-col { flex-direction: column !important; }
          .hide-mobile { display: none !important; }
          .full-mobile { width: 100% !important; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{ background: S.white, borderBottom: `1px solid ${S.n200}`, padding: '0 32px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <img src="/logo.svg" alt="Locatalyze" style={{ height: 26, width: 'auto' }} />
        </Link>
        <Link href="/auth/signup" style={{ background: S.brand, color: S.white, borderRadius: 9, padding: '8px 18px', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
          Analyse your location
        </Link>
      </nav>

      {/* HERO */}
      <div style={{ background: S.n900, padding: '64px 32px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(15,118,110,0.2)', border: '1px solid rgba(20,184,166,0.3)', borderRadius: 20, padding: '4px 14px', fontSize: 11, fontWeight: 700, color: S.brandLight, marginBottom: 20, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Darwin Location Intelligence
        </div>
        <h1 style={{ fontSize: 40, fontWeight: 900, color: '#0F172A', maxWidth: 700, margin: '0 auto 16px' }}>
          Best Suburbs to Open a Business in Darwin
        </h1>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', maxWidth: 560, margin: '0 auto 32px', lineHeight: 1.7 }}>
          Most location decisions in Darwin are made on gut feel. This guide uses competitor density, demographics, and rent benchmarks to show you where the real opportunities are — and where to avoid.
        </p>
        <Link href="/auth/signup" style={{ display: 'inline-block', background: S.brand, color: S.white, borderRadius: 12, padding: '14px 32px', fontSize: 15, fontWeight: 800, textDecoration: 'none', boxShadow: '0 4px 20px rgba(15,118,110,0.65)' }}>
          Analyse your Darwin location →
        </Link>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 12 }}>Free report · No credit card · Results in ~90 seconds</p>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* INTRO */}
        <section style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 16, color: S.n700, marginBottom: 16 }}>Darwin operates on a completely different commercial logic from every other Australian capital. The city's small permanent population, extreme seasonality, significant public sector and defence employment base, and unique cultural mix create a trading environment that requires local knowledge rather than general assumptions.</p>
          <p style={{ fontSize: 16, color: S.n700, marginBottom: 16 }}>The dry season (May–October) delivers significantly higher foot traffic and stronger revenue across most categories. The wet season (November–April) creates genuine operational challenges for businesses dependent on outdoor seating or walk-in foot traffic. Any business plan that treats Darwin's revenue as consistent across twelve months will encounter a difficult reality.</p>
          <p style={{ fontSize: 16, color: S.n700 }}>Despite these challenges, Darwin has genuine opportunity for well-planned operators. The permanent resident base has a high proportion of government and defence employees with stable above-average incomes, and certain categories are genuinely underserved relative to population size.</p>
        </section>

        {/* MAP PLACEHOLDER */}
        <div style={{ background: S.n100, border: `1px solid ${S.n200}`, borderRadius: 16, height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 48 }}>
          <div style={{ textAlign: 'center' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={S.n400} strokeWidth="1.5" style={{ marginBottom: 8 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <p style={{ fontSize: 13, color: S.n400 }}>Darwin suburb map</p>
          </div>
        </div>

        {/* BEST SUBURBS */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: S.n900, marginBottom: 8 }}>Best Suburbs in Darwin for New Businesses</h2>
          <p style={{ fontSize: 15, color: S.n500, marginBottom: 32 }}>These areas show the strongest combination of demand, manageable competition, and viable rent levels.</p>
          
          <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 16, padding: '24px 28px', marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Suburb 1</span>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: S.n900, marginTop: 4 }}>Darwin CBD</h3>
              </div>
              <span style={{ background: S.emeraldBg, color: S.emerald, border: `1px solid ${S.emeraldBdr}`, borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', marginLeft: 12 }}>Recommended</span>
            </div>
            <p style={{ fontSize: 14, color: S.n700, marginBottom: 12, lineHeight: 1.7 }}>Darwin's CBD is compact and walkable in a way that mainland capitals rarely are. The Mitchell Street and Smith Street strips carry the city's highest foot traffic and serve both residents and the significant tourism and visitor economy. Competition is present but the market is not as saturated as equivalent CBD strips in larger cities.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              <div style={{ background: S.n50, borderRadius: 8, padding: '8px 12px' }}>
                <p style={{ fontSize: 10, color: S.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Competition</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: S.n800 }}>Medium</p>
              </div>
              <div style={{ background: S.n50, borderRadius: 8, padding: '8px 12px' }}>
                <p style={{ fontSize: 10, color: S.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Rent Level</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: S.n800 }}>$70–$95/m²</p>
              </div>
              <div style={{ background: S.n50, borderRadius: 8, padding: '8px 12px' }}>
                <p style={{ fontSize: 10, color: S.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Demand</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: S.n800 }}>Seasonal</p>
              </div>
            </div>
          </div>
          <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 16, padding: '24px 28px', marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Suburb 2</span>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: S.n900, marginTop: 4 }}>Parap</h3>
              </div>
              <span style={{ background: S.emeraldBg, color: S.emerald, border: `1px solid ${S.emeraldBdr}`, borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', marginLeft: 12 }}>Recommended</span>
            </div>
            <p style={{ fontSize: 14, color: S.n700, marginBottom: 12, lineHeight: 1.7 }}>Parap Village is Darwin's most established neighbourhood commercial centre. The famous Saturday market brings significant foot traffic, the permanent resident base includes a high proportion of long-term Darwin residents with strong community identity, and the commercial rents are significantly lower than CBD equivalents.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              <div style={{ background: S.n50, borderRadius: 8, padding: '8px 12px' }}>
                <p style={{ fontSize: 10, color: S.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Competition</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: S.n800 }}>Low</p>
              </div>
              <div style={{ background: S.n50, borderRadius: 8, padding: '8px 12px' }}>
                <p style={{ fontSize: 10, color: S.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Rent Level</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: S.n800 }}>$50–$65/m²</p>
              </div>
              <div style={{ background: S.n50, borderRadius: 8, padding: '8px 12px' }}>
                <p style={{ fontSize: 10, color: S.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Demand</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: S.n800 }}>Strong</p>
              </div>
            </div>
          </div>
          <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 16, padding: '24px 28px', marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Suburb 3</span>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: S.n900, marginTop: 4 }}>Fannie Bay</h3>
              </div>
              <span style={{ background: S.emeraldBg, color: S.emerald, border: `1px solid ${S.emeraldBdr}`, borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', marginLeft: 12 }}>Recommended</span>
            </div>
            <p style={{ fontSize: 14, color: S.n700, marginBottom: 12, lineHeight: 1.7 }}>Fannie Bay has a high-income resident demographic, proximity to both the CBD and key government employment, and a commercial strip that has historically underperformed the quality of the surrounding residential area. For operators targeting the professional and government employee demographic, the fundamentals are consistently strong.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              <div style={{ background: S.n50, borderRadius: 8, padding: '8px 12px' }}>
                <p style={{ fontSize: 10, color: S.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Competition</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: S.n800 }}>Low</p>
              </div>
              <div style={{ background: S.n50, borderRadius: 8, padding: '8px 12px' }}>
                <p style={{ fontSize: 10, color: S.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Rent Level</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: S.n800 }}>$55–$70/m²</p>
              </div>
              <div style={{ background: S.n50, borderRadius: 8, padding: '8px 12px' }}>
                <p style={{ fontSize: 10, color: S.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Demand</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: S.n800 }}>Good</p>
              </div>
            </div>
          </div>
          <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 16, padding: '24px 28px', marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Suburb 4</span>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: S.n900, marginTop: 4 }}>Nightcliff</h3>
              </div>
              <span style={{ background: S.emeraldBg, color: S.emerald, border: `1px solid ${S.emeraldBdr}`, borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', marginLeft: 12 }}>Recommended</span>
            </div>
            <p style={{ fontSize: 14, color: S.n700, marginBottom: 12, lineHeight: 1.7 }}>Nightcliff's foreshore location and strong community identity create a loyal local customer base that is unusually engaged with its neighbourhood businesses. The market and community events generate foot traffic that supplements the resident base, and the commercial rents remain accessible for operators building toward profitability.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              <div style={{ background: S.n50, borderRadius: 8, padding: '8px 12px' }}>
                <p style={{ fontSize: 10, color: S.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Competition</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: S.n800 }}>Low</p>
              </div>
              <div style={{ background: S.n50, borderRadius: 8, padding: '8px 12px' }}>
                <p style={{ fontSize: 10, color: S.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Rent Level</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: S.n800 }}>$45–$60/m²</p>
              </div>
              <div style={{ background: S.n50, borderRadius: 8, padding: '8px 12px' }}>
                <p style={{ fontSize: 10, color: S.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Demand</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: S.n800 }}>Community-driven</p>
              </div>
            </div>
          </div>
        </section>

        {/* MID CTA */}
        <div style={{ background: `linear-gradient(135deg,${S.brand},${S.brandLight})`, borderRadius: 16, padding: '32px', marginBottom: 56, textAlign: 'center' }}>
          <h3 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>Not sure which suburb is right for you?</h3>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 20 }}>Enter your exact address and get a full GO / CAUTION / NO verdict in about 90 seconds.</p>
          <Link href="/auth/signup" style={{ display: 'inline-block', background: S.white, color: S.brand, borderRadius: 10, padding: '12px 28px', fontSize: 14, fontWeight: 800, textDecoration: 'none' }}>
            Run a free location analysis →
          </Link>
        </div>

        {/* HIDDEN GEMS */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: S.n900, marginBottom: 8 }}>Underrated Areas Most Business Owners Overlook</h2>
          <p style={{ fontSize: 15, color: S.n500, marginBottom: 24 }}>These suburbs rarely appear in "best of" lists, but the numbers often tell a different story.</p>
          
          <div style={{ borderLeft: `3px solid ${S.brand}`, paddingLeft: 20, marginBottom: 24 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: S.n900, marginBottom: 6 }}>Stuart Park</h3>
            <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7 }}>Stuart Park sits between the CBD and the Fannie Bay commercial strip and is consistently undervalued in operator conversations. The residential density is solid, the demographic is professional and government-employee heavy, and there is genuine demand for quality food and service options that is not currently being met by the limited commercial offerings in the area.</p>
          </div>
          <div style={{ borderLeft: `3px solid ${S.brand}`, paddingLeft: 20, marginBottom: 24 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: S.n900, marginBottom: 6 }}>Woolner</h3>
            <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7 }}>Woolner's industrial-to-mixed-use transition is creating commercial opportunities that were not available three years ago. Early operators in evolving precincts in Darwin have historically built strong community loyalty that translates into business durability once the area's character is established.</p>
          </div>
        </section>

        {/* COMPARISON TABLE */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: S.n900, marginBottom: 24 }}>Suburb Comparison at a Glance</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: S.n900 }}>
                  {['Suburb','Rent','Competition','Demand','Risk'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: 'rgba(255,255,255,0.7)', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr style={{ background: S.white, borderBottom: `1px solid ${S.n100}` }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: S.n900 }}>Parap</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>$50–65/m²</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>Low</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>Strong</td>
                  <td style={{ padding: '12px 16px' }}><span style={{ background: S.emeraldBg, color: S.emerald, border: `1px solid ${S.emeraldBdr}`, borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>Low</span></td>
                </tr><tr style={{ background: S.n50, borderBottom: `1px solid ${S.n100}` }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: S.n900 }}>Fannie Bay</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>$55–70/m²</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>Low</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>Good</td>
                  <td style={{ padding: '12px 16px' }}><span style={{ background: S.emeraldBg, color: S.emerald, border: `1px solid ${S.emeraldBdr}`, borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>Low</span></td>
                </tr><tr style={{ background: S.white, borderBottom: `1px solid ${S.n100}` }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: S.n900 }}>Nightcliff</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>$45–60/m²</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>Low</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>Community</td>
                  <td style={{ padding: '12px 16px' }}><span style={{ background: S.emeraldBg, color: S.emerald, border: `1px solid ${S.emeraldBdr}`, borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>Low</span></td>
                </tr><tr style={{ background: S.n50, borderBottom: `1px solid ${S.n100}` }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: S.n900 }}>Darwin CBD</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>$70–95/m²</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>Medium</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>Seasonal</td>
                  <td style={{ padding: '12px 16px' }}><span style={{ background: S.amberBg, color: S.amber, border: `1px solid ${S.amberBdr}`, borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>Medium</span></td>
                </tr><tr style={{ background: S.white, borderBottom: `1px solid ${S.n100}` }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: S.n900 }}>Mitchell St</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>$80–100/m²</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>High</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>Tourist</td>
                  <td style={{ padding: '12px 16px' }}><span style={{ background: S.amberBg, color: S.amber, border: `1px solid ${S.amberBdr}`, borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>Medium</span></td>
                </tr><tr style={{ background: S.n50, borderBottom: `1px solid ${S.n100}` }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: S.n900 }}>Casuarina</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>$65–85/m²</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>High</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>Variable</td>
                  <td style={{ padding: '12px 16px' }}><span style={{ background: S.redBg, color: S.red, border: `1px solid ${S.redBdr}`, borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>High</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* HIGH RISK AREAS */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: S.n900, marginBottom: 8 }}>Areas to Approach with Caution</h2>
          <p style={{ fontSize: 15, color: S.n500, marginBottom: 24 }}>These are not necessarily bad suburbs — but the conditions make it harder to build a viable business from day one.</p>
          
          <div style={{ background: S.redBg, border: `1px solid ${S.redBdr}`, borderRadius: 12, padding: '16px 20px', marginBottom: 12 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: S.red, marginBottom: 4 }}>Casuarina</h3>
            <p style={{ fontSize: 13, color: '#7f1d1d', lineHeight: 1.7 }}>Casuarina's shopping centre anchors have created a commercial environment that is challenging for independent operators. The mall culture draws spending away from neighbourhood strips, rents can be high relative to achievable turnover, and the car-dependent geography reduces incidental foot traffic for businesses not within the centre itself.</p>
          </div>
          <div style={{ background: S.redBg, border: `1px solid ${S.redBdr}`, borderRadius: 12, padding: '16px 20px', marginBottom: 12 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: S.red, marginBottom: 4 }}>Mitchell Street late-night strip</h3>
            <p style={{ fontSize: 13, color: '#7f1d1d', lineHeight: 1.7 }}>The Mitchell Street entertainment corridor has high tourism-driven foot traffic but is heavily concentrated in evening and late-night trading. The daytime conditions are significantly different from the evening conditions, and businesses that need to trade through the day to cover costs can find the revenue profile difficult to sustain.</p>
          </div>
        </section>

        {/* CASE STUDY */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: S.n900, marginBottom: 8 }}>Real Scenario: Two Locations, Very Different Outcomes</h2>
          <p style={{ fontSize: 15, color: S.n500, marginBottom: 24 }}>Same business type, same budget — but the suburb makes all the difference.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="two-col">
            <div style={{ background: S.emeraldBg, border: `1.5px solid ${S.emeraldBdr}`, borderRadius: 14, padding: '20px 22px' }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: S.emerald, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Location A — Stronger position</span>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#065f46', margin: '8px 0 10px' }}>Parap Village</h3>
              <p style={{ fontSize: 13, color: '#064e3b', lineHeight: 1.7 }}>Monthly rent $3,800 for 60m². Saturday market creates weekly foot traffic surge that supplements regular trading. Competitor count within 500m: 3. Strong community loyalty — businesses that become embedded in Parap's community identity build unusually durable customer bases. Break-even at 22 customers per day.</p>
            </div>
            <div style={{ background: S.redBg, border: `1.5px solid ${S.redBdr}`, borderRadius: 14, padding: '20px 22px' }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: S.red, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Location B — Higher risk</span>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#7f1d1d', margin: '8px 0 10px' }}>Mitchell Street CBD</h3>
              <p style={{ fontSize: 13, color: '#7f1d1d', lineHeight: 1.7 }}>Monthly rent $6,400 for similar 60m². High dry-season foot traffic from tourism, but wet-season trading is dramatically lower. Competitor count within 500m: 14. Revenue model is tourism-dependent, which creates cash flow variability. Break-even of 39 customers per day requires strong dry-season performance to cover wet-season shortfall.</p>
            </div>
          </div>
        </section>

        {/* TIPS */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: S.n900, marginBottom: 24 }}>What to Check Before You Sign a Lease in Darwin</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: S.brandFaded, border: `1px solid ${S.brandBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12, fontWeight: 800, color: S.brand }}>1</div>
              <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7, paddingTop: 4 }}>Model your revenue across dry and wet season separately. A Darwin business plan that uses annual averages will significantly overestimate wet-season performance and underestimate cash flow pressure.</p>
            </div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: S.brandFaded, border: `1px solid ${S.brandBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12, fontWeight: 800, color: S.brand }}>2</div>
              <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7, paddingTop: 4 }}>Air conditioning costs in Darwin are a genuine operational overhead that mainland cost benchmarks do not account for. Factor this into your monthly cost structure.</p>
            </div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: S.brandFaded, border: `1px solid ${S.brandBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12, fontWeight: 800, color: S.brand }}>3</div>
              <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7, paddingTop: 4 }}>The defence community in Darwin creates a reliable customer segment with stable income but specific trading patterns — notably, significant purchasing around pay cycles and before deployments.</p>
            </div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: S.brandFaded, border: `1px solid ${S.brandBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12, fontWeight: 800, color: S.brand }}>4</div>
              <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7, paddingTop: 4 }}>Darwin's remote location means supply chain costs and lead times are higher than mainland equivalents. This affects both initial fit-out costs and ongoing operating costs for stock-dependent businesses.</p>
            </div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: S.brandFaded, border: `1px solid ${S.brandBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12, fontWeight: 800, color: S.brand }}>5</div>
              <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7, paddingTop: 4 }}>Community events and the dry-season tourism calendar are genuinely significant for Darwin businesses. Align your marketing and staffing plans with these events rather than treating them as windfalls.</p>
            </div>
          </div>
        </section>

        {/* POLL */}
        <section style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 16, padding: '28px', marginBottom: 56 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: S.n900, marginBottom: 6 }}>Where would you open your business in Darwin?</h3>
          <p style={{ fontSize: 13, color: S.n400, marginBottom: 20 }}>Community poll — results update in real time</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            
            <div style={{ background: S.n50, border: `1px solid ${S.n200}`, borderRadius: 10, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, color: S.n800, fontWeight: 500 }}>Parap</span>
              <span style={{ fontSize: 12, color: S.n400 }}>36%</span>
            </div>
            <div style={{ background: S.n50, border: `1px solid ${S.n200}`, borderRadius: 10, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, color: S.n800, fontWeight: 500 }}>Fannie Bay</span>
              <span style={{ fontSize: 12, color: S.n400 }}>26%</span>
            </div>
            <div style={{ background: S.n50, border: `1px solid ${S.n200}`, borderRadius: 10, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, color: S.n800, fontWeight: 500 }}>Darwin CBD</span>
              <span style={{ fontSize: 12, color: S.n400 }}>20%</span>
            </div>
            <div style={{ background: S.n50, border: `1px solid ${S.n200}`, borderRadius: 10, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, color: S.n800, fontWeight: 500 }}>Nightcliff</span>
              <span style={{ fontSize: 12, color: S.n400 }}>12%</span>
            </div>
            <div style={{ background: S.n50, border: `1px solid ${S.n200}`, borderRadius: 10, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, color: S.n800, fontWeight: 500 }}>Other suburb</span>
              <span style={{ fontSize: 12, color: S.n400 }}>6%</span>
            </div>
          </div>
          <p style={{ fontSize: 11, color: S.n400, marginTop: 12 }}>Data is illustrative. Run a free analysis to get real numbers for your location.</p>
        </section>

        {/* FAQ */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: S.n900, marginBottom: 24 }}>Frequently Asked Questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            
            <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 12, padding: '18px 22px' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: S.n900, marginBottom: 6 }}>Is Darwin a viable city to open a small business?</h3>
              <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7 }}>Darwin suits operators who understand its seasonal dynamics, relatively small permanent population, and the specific advantages of its demographic mix — including stable government and defence employment. Businesses that can serve both the resident and visitor economy tend to perform best.</p>
            </div>
            <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 12, padding: '18px 22px' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: S.n900, marginBottom: 6 }}>What is average commercial rent in Darwin?</h3>
              <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7 }}>Darwin commercial rents range from $45–$65/m² in suburban locations like Nightcliff and Parap, to $75–$100/m² in CBD and premium tourist-oriented locations. These figures are broadly comparable to Adelaide but below Sydney and Melbourne equivalents.</p>
            </div>
            <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 12, padding: '18px 22px' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: S.n900, marginBottom: 6 }}>How does the wet season affect Darwin businesses?</h3>
              <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7 }}>The wet season (November–April) typically reduces foot traffic and revenue by 25–40% for hospitality and retail businesses compared to dry-season peaks. Operators need sufficient capital reserves to bridge this seasonal trough, particularly in the first year of operation.</p>
            </div>
            <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 12, padding: '18px 22px' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: S.n900, marginBottom: 6 }}>Which Darwin suburb is best for a café?</h3>
              <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7 }}>Parap consistently performs well for café operators due to the Saturday market traffic, strong community identity, and accessible rents. Fannie Bay is worth considering for operators targeting the professional demographic, with lower competition than the CBD corridors.</p>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section style={{ background: S.n900, borderRadius: 20, padding: '48px 32px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: '#0F172A', marginBottom: 12 }}>Ready to analyse your exact Darwin location?</h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', marginBottom: 28, maxWidth: 480, margin: '0 auto 28px' }}>
            Stop guessing. Get a full GO / CAUTION / NO verdict with competitor data, demographics, and a 3-year financial model — in about 90 seconds.
          </p>
          <Link href="/auth/signup" style={{ display: 'inline-block', background: S.brand, color: S.white, borderRadius: 12, padding: '14px 36px', fontSize: 15, fontWeight: 800, textDecoration: 'none', boxShadow: '0 4px 20px rgba(15,118,110,0.4)' }}>
            Analyse your location free →
          </Link>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginTop: 12 }}>No credit card · Takes ~90 seconds · Full financial model included</p>
        </section>

      </div>
    </div>
  )
}
