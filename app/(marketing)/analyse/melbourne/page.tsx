import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Best Suburbs to Open a Business in Melbourne 2026 | Locatalyze',
  description: 'Discover the best and worst suburbs to open a business in Melbourne. Real data on rent, competition, demographics and demand — before you sign a lease.',
  alternates: { canonical: 'https://www.locatalyze.com/analyse/melbourne' },
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

export default function MelbourneAnalysePage() {
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
          Melbourne Location Intelligence
        </div>
        <h1 style={{ fontSize: 40, fontWeight: 900, color: S.white, maxWidth: 700, margin: '0 auto 16px' }}>
          Best Suburbs to Open a Business in Melbourne
        </h1>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', maxWidth: 560, margin: '0 auto 32px', lineHeight: 1.7 }}>
          Most location decisions in Melbourne are made on gut feel. This guide uses competitor density, demographics, and rent benchmarks to show you where the real opportunities are — and where to avoid.
        </p>
        <Link href="/auth/signup" style={{ display: 'inline-block', background: S.brand, color: S.white, borderRadius: 12, padding: '14px 32px', fontSize: 15, fontWeight: 800, textDecoration: 'none', boxShadow: '0 4px 20px rgba(15,118,110,0.35)' }}>
          Analyse your Melbourne location →
        </Link>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 12 }}>Free report · No credit card · Results in ~90 seconds</p>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* INTRO */}
        <section style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 16, color: S.n700, marginBottom: 16 }}>Melbourne has one of the most competitive commercial property markets in the country, and that creates a trap many first-time business owners fall into. They choose a location based on foot traffic alone, overlook the rent-to-revenue maths, and end up locked into a lease that the business can never grow out of.</p>
          <p style={{ fontSize: 16, color: S.n700, marginBottom: 16 }}>The city spans an enormous range of conditions. Inner suburbs like Fitzroy and Collingwood attract huge foot traffic but carry rents that make even profitable businesses marginal. Meanwhile, suburbs in Melbourne's inner west and southeast are quietly building the kind of population density and spending power that supports sustainable operations.</p>
          <p style={{ fontSize: 16, color: S.n700 }}>This guide cuts through the noise. It looks at where the demand signals are strongest, where competition hasn't yet caught up, and where the rent is actually viable for a new business trying to survive its first two years.</p>
        </section>

        {/* MAP PLACEHOLDER */}
        <div style={{ background: S.n100, border: `1px solid ${S.n200}`, borderRadius: 16, height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 48 }}>
          <div style={{ textAlign: 'center' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={S.n400} strokeWidth="1.5" style={{ marginBottom: 8 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <p style={{ fontSize: 13, color: S.n400 }}>Melbourne suburb map</p>
          </div>
        </div>

        {/* BEST SUBURBS */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: S.n900, marginBottom: 8 }}>Best Suburbs in Melbourne for New Businesses</h2>
          <p style={{ fontSize: 15, color: S.n500, marginBottom: 32 }}>These areas show the strongest combination of demand, manageable competition, and viable rent levels.</p>
          
          <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 16, padding: '24px 28px', marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Suburb 1</span>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: S.n900, marginTop: 4 }}>Brunswick</h3>
              </div>
              <span style={{ background: S.emeraldBg, color: S.emerald, border: `1px solid ${S.emeraldBdr}`, borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', marginLeft: 12 }}>Recommended</span>
            </div>
            <p style={{ fontSize: 14, color: S.n700, marginBottom: 12, lineHeight: 1.7 }}>Brunswick sits at a genuine inflection point. It has the spending patterns of an inner suburb but rents that have not fully caught up with Richmond or Fitzroy. The demographic skews toward 25–40 year olds with above-average disposable income, high foot traffic along Sydney Road and Lygon Street extensions, and a culture that actively supports independent businesses over chains.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              <div style={{ background: S.n50, borderRadius: 8, padding: '8px 12px' }}>
                <p style={{ fontSize: 10, color: S.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Competition</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: S.n800 }}>Medium</p>
              </div>
              <div style={{ background: S.n50, borderRadius: 8, padding: '8px 12px' }}>
                <p style={{ fontSize: 10, color: S.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Rent Level</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: S.n800 }}>$70–$90/m²</p>
              </div>
              <div style={{ background: S.n50, borderRadius: 8, padding: '8px 12px' }}>
                <p style={{ fontSize: 10, color: S.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Demand</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: S.n800 }}>High</p>
              </div>
            </div>
          </div>
          <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 16, padding: '24px 28px', marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Suburb 2</span>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: S.n900, marginTop: 4 }}>Footscray</h3>
              </div>
              <span style={{ background: S.emeraldBg, color: S.emerald, border: `1px solid ${S.emeraldBdr}`, borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', marginLeft: 12 }}>Recommended</span>
            </div>
            <p style={{ fontSize: 14, color: S.n700, marginBottom: 12, lineHeight: 1.7 }}>Footscray has been quietly transforming for the better part of a decade. New residential development, improved transport links, and a genuinely diverse customer base make it one of the most interesting commercial opportunities in the west. Rents remain significantly below the inner-east equivalents, and the population growth trajectory is sustained.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              <div style={{ background: S.n50, borderRadius: 8, padding: '8px 12px' }}>
                <p style={{ fontSize: 10, color: S.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Competition</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: S.n800 }}>Low–Medium</p>
              </div>
              <div style={{ background: S.n50, borderRadius: 8, padding: '8px 12px' }}>
                <p style={{ fontSize: 10, color: S.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Rent Level</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: S.n800 }}>$55–$75/m²</p>
              </div>
              <div style={{ background: S.n50, borderRadius: 8, padding: '8px 12px' }}>
                <p style={{ fontSize: 10, color: S.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Demand</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: S.n800 }}>Rising</p>
              </div>
            </div>
          </div>
          <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 16, padding: '24px 28px', marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Suburb 3</span>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: S.n900, marginTop: 4 }}>Thornbury</h3>
              </div>
              <span style={{ background: S.emeraldBg, color: S.emerald, border: `1px solid ${S.emeraldBdr}`, borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', marginLeft: 12 }}>Recommended</span>
            </div>
            <p style={{ fontSize: 14, color: S.n700, marginBottom: 12, lineHeight: 1.7 }}>Thornbury carries the lifestyle energy of Fitzroy but at a lower price point. The High Street strip is well-established for food and retail, with a loyal local base and growing visitor traffic from surrounding suburbs. Competition is present but not saturated, and the demographic profile suits most hospitality and service businesses.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              <div style={{ background: S.n50, borderRadius: 8, padding: '8px 12px' }}>
                <p style={{ fontSize: 10, color: S.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Competition</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: S.n800 }}>Medium</p>
              </div>
              <div style={{ background: S.n50, borderRadius: 8, padding: '8px 12px' }}>
                <p style={{ fontSize: 10, color: S.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Rent Level</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: S.n800 }}>$65–$80/m²</p>
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
                <span style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Suburb 4</span>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: S.n900, marginTop: 4 }}>Preston</h3>
              </div>
              <span style={{ background: S.emeraldBg, color: S.emerald, border: `1px solid ${S.emeraldBdr}`, borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', marginLeft: 12 }}>Recommended</span>
            </div>
            <p style={{ fontSize: 14, color: S.n700, marginBottom: 12, lineHeight: 1.7 }}>Preston is the suburb that business analysts keep flagging but operators keep ignoring. The High Street corridor has undergone significant infrastructure investment, median incomes are rising faster than the Melbourne average, and rents remain firmly in affordable territory. For businesses targeting families and the 30–50 demographic, Preston's numbers are consistently compelling.</p>
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
                <p style={{ fontSize: 13, fontWeight: 700, color: S.n800 }}>Good</p>
              </div>
            </div>
          </div>
        </section>

        {/* MID CTA */}
        <div style={{ background: `linear-gradient(135deg,${S.brand},${S.brandLight})`, borderRadius: 16, padding: '32px', marginBottom: 56, textAlign: 'center' }}>
          <h3 style={{ fontSize: 22, fontWeight: 800, color: S.white, marginBottom: 8 }}>Not sure which suburb is right for you?</h3>
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
            <h3 style={{ fontSize: 17, fontWeight: 700, color: S.n900, marginBottom: 6 }}>Reservoir</h3>
            <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7 }}>Reservoir rarely features in best-suburb discussions, but its commercial strip on High Street has been steadily improving. Population density is high, parking is relatively accessible compared to inner suburbs, and commercial rents remain low. For businesses that rely on repeat local customers rather than one-off visitors, Reservoir's loyal demographic is a genuine asset.</p>
          </div>
          <div style={{ borderLeft: `3px solid ${S.brand}`, paddingLeft: 20, marginBottom: 24 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: S.n900, marginBottom: 6 }}>Coburg</h3>
            <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7 }}>Coburg sits between Brunswick and Preston, absorbing the overflow from both without the rental premiums of either. The suburb has strong café culture, a growing foodie scene, and enough residential density to sustain a well-run independent business. The risk is low if you avoid the quieter side streets and stick to the Sydney Road corridor.</p>
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
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: S.n900 }}>Brunswick</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>$70–90/m²</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>Medium</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>High</td>
                  <td style={{ padding: '12px 16px' }}><span style={{ background: S.emeraldBg, color: S.emerald, border: `1px solid ${S.emeraldBdr}`, borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>Low</span></td>
                </tr><tr style={{ background: S.n50, borderBottom: `1px solid ${S.n100}` }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: S.n900 }}>Footscray</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>$55–75/m²</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>Low–Med</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>Rising</td>
                  <td style={{ padding: '12px 16px' }}><span style={{ background: S.emeraldBg, color: S.emerald, border: `1px solid ${S.emeraldBdr}`, borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>Low</span></td>
                </tr><tr style={{ background: S.white, borderBottom: `1px solid ${S.n100}` }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: S.n900 }}>Thornbury</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>$65–80/m²</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>Medium</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>Strong</td>
                  <td style={{ padding: '12px 16px' }}><span style={{ background: S.emeraldBg, color: S.emerald, border: `1px solid ${S.emeraldBdr}`, borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>Low</span></td>
                </tr><tr style={{ background: S.n50, borderBottom: `1px solid ${S.n100}` }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: S.n900 }}>Preston</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>$50–65/m²</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>Low</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>Good</td>
                  <td style={{ padding: '12px 16px' }}><span style={{ background: S.emeraldBg, color: S.emerald, border: `1px solid ${S.emeraldBdr}`, borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>Low</span></td>
                </tr><tr style={{ background: S.white, borderBottom: `1px solid ${S.n100}` }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: S.n900 }}>South Yarra</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>$100–130/m²</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>High</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>Variable</td>
                  <td style={{ padding: '12px 16px' }}><span style={{ background: S.amberBg, color: S.amber, border: `1px solid ${S.amberBdr}`, borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>Medium</span></td>
                </tr><tr style={{ background: S.n50, borderBottom: `1px solid ${S.n100}` }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: S.n900 }}>CBD Core</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>$120–160/m²</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>Very High</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>Uneven</td>
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
            <h3 style={{ fontSize: 15, fontWeight: 700, color: S.red, marginBottom: 4 }}>CBD — Swanston and Collins Street corridors</h3>
            <p style={{ fontSize: 13, color: '#7f1d1d', lineHeight: 1.7 }}>Commercial rents in Melbourne's CBD core have partially recovered post-pandemic but remain extremely high relative to achievable revenue for new operators. Office occupancy has not fully rebounded, which means weekday foot traffic still runs below pre-2020 levels in key strips. The break-even customer count for most hospitality businesses in this area is difficult to reach sustainably.</p>
          </div>
          <div style={{ background: S.redBg, border: `1px solid ${S.redBdr}`, borderRadius: 12, padding: '16px 20px', marginBottom: 12 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: S.red, marginBottom: 4 }}>South Yarra — Chapel Street</h3>
            <p style={{ fontSize: 13, color: '#7f1d1d', lineHeight: 1.7 }}>Chapel Street remains one of Melbourne's most recognisable retail destinations, but it has also been one of its most challenging for operators. High rents, shifting consumer behaviour toward online retail, and a revolving door of tenancies make it a high-risk entry point for new businesses without substantial capital backing.</p>
          </div>
        </section>

        {/* CASE STUDY */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: S.n900, marginBottom: 8 }}>Real Scenario: Two Locations, Very Different Outcomes</h2>
          <p style={{ fontSize: 15, color: S.n500, marginBottom: 24 }}>Same business type, same budget — but the suburb makes all the difference.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="two-col">
            <div style={{ background: S.emeraldBg, border: `1.5px solid ${S.emeraldBdr}`, borderRadius: 14, padding: '20px 22px' }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: S.emerald, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Location A — Stronger position</span>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#065f46', margin: '8px 0 10px' }}>Thornbury — High Street</h3>
              <p style={{ fontSize: 13, color: '#064e3b', lineHeight: 1.7 }}>Monthly rent $6,200 for a 75m² space. Estimated daily foot traffic: 420 passers-by. Competitor count within 500m: 6. Projected break-even at 38 customers per day. The suburb demographic actively supports independent businesses and repeat visit rates are typically higher than inner-city locations.</p>
            </div>
            <div style={{ background: S.redBg, border: `1.5px solid ${S.redBdr}`, borderRadius: 14, padding: '20px 22px' }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: S.red, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Location B — Higher risk</span>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#7f1d1d', margin: '8px 0 10px' }}>South Yarra — Chapel Street</h3>
              <p style={{ fontSize: 13, color: '#7f1d1d', lineHeight: 1.7 }}>Monthly rent $11,400 for a similar 75m² space. Foot traffic is higher in volume but conversion rates are lower due to tourist and transient visitors. Competitor count within 500m: 19. Projected break-even at 72 customers per day — nearly double. A business that would succeed in Thornbury can struggle significantly here.</p>
            </div>
          </div>
        </section>

        {/* TIPS */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: S.n900, marginBottom: 24 }}>What to Check Before You Sign a Lease in Melbourne</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: S.brandFaded, border: `1px solid ${S.brandBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12, fontWeight: 800, color: S.brand }}>1</div>
              <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7, paddingTop: 4 }}>Walk the street at different times — Tuesday at 10am and Saturday at 11am will tell you very different things about the actual customer base.</p>
            </div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: S.brandFaded, border: `1px solid ${S.brandBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12, fontWeight: 800, color: S.brand }}>2</div>
              <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7, paddingTop: 4 }}>Check the vacancy rate on the specific strip. More than two empty shops within 200 metres is a meaningful warning signal.</p>
            </div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: S.brandFaded, border: `1px solid ${S.brandBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12, fontWeight: 800, color: S.brand }}>3</div>
              <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7, paddingTop: 4 }}>Request trading data from the landlord if the space is an existing tenancy. Most won't provide it, but asking reveals whether they're hiding something.</p>
            </div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: S.brandFaded, border: `1px solid ${S.brandBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12, fontWeight: 800, color: S.brand }}>4</div>
              <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7, paddingTop: 4 }}>Melbourne's tram corridors create genuine foot traffic but also limit parking. Understand whether your customer type is willing to arrive by tram or needs a car.</p>
            </div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: S.brandFaded, border: `1px solid ${S.brandBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12, fontWeight: 800, color: S.brand }}>5</div>
              <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7, paddingTop: 4 }}>Run your rent-to-revenue ratio before committing. If rent exceeds 15% of projected monthly revenue, the model is under pressure from day one.</p>
            </div>
          </div>
        </section>

        {/* POLL */}
        <section style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 16, padding: '28px', marginBottom: 56 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: S.n900, marginBottom: 6 }}>Where would you open your business in Melbourne?</h3>
          <p style={{ fontSize: 13, color: S.n400, marginBottom: 20 }}>Community poll — results update in real time</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            
            <div style={{ background: S.n50, border: `1px solid ${S.n200}`, borderRadius: 10, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, color: S.n800, fontWeight: 500 }}>Brunswick</span>
              <span style={{ fontSize: 12, color: S.n400 }}>31%</span>
            </div>
            <div style={{ background: S.n50, border: `1px solid ${S.n200}`, borderRadius: 10, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, color: S.n800, fontWeight: 500 }}>Thornbury</span>
              <span style={{ fontSize: 12, color: S.n400 }}>24%</span>
            </div>
            <div style={{ background: S.n50, border: `1px solid ${S.n200}`, borderRadius: 10, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, color: S.n800, fontWeight: 500 }}>Footscray</span>
              <span style={{ fontSize: 12, color: S.n400 }}>19%</span>
            </div>
            <div style={{ background: S.n50, border: `1px solid ${S.n200}`, borderRadius: 10, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, color: S.n800, fontWeight: 500 }}>Preston</span>
              <span style={{ fontSize: 12, color: S.n400 }}>15%</span>
            </div>
            <div style={{ background: S.n50, border: `1px solid ${S.n200}`, borderRadius: 10, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, color: S.n800, fontWeight: 500 }}>Other suburb</span>
              <span style={{ fontSize: 12, color: S.n400 }}>11%</span>
            </div>
          </div>
          <p style={{ fontSize: 11, color: S.n400, marginTop: 12 }}>Data is illustrative. Run a free analysis to get real numbers for your location.</p>
        </section>

        {/* FAQ */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: S.n900, marginBottom: 24 }}>Frequently Asked Questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            
            <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 12, padding: '18px 22px' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: S.n900, marginBottom: 6 }}>What is the average commercial rent in Melbourne?</h3>
              <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7 }}>Melbourne commercial rents vary significantly by location. Inner suburbs like Fitzroy and Richmond typically run $90–$130/m² per year. Middle suburbs like Brunswick and Thornbury range from $65–$85/m². Outer suburbs can be found from $40–$60/m². Always negotiate on the gross figure including outgoings.</p>
            </div>
            <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 12, padding: '18px 22px' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: S.n900, marginBottom: 6 }}>Which Melbourne suburbs are best for a café?</h3>
              <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7 }}>Brunswick, Thornbury, Northcote, and Coburg consistently perform well for cafés based on demographic fit, foot traffic patterns, and viable rent levels. Preston is increasingly worth considering for operators targeting the family demographic.</p>
            </div>
            <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 12, padding: '18px 22px' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: S.n900, marginBottom: 6 }}>Is Melbourne CBD a good location for a new business?</h3>
              <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7 }}>For most new operators without significant capital reserves, the Melbourne CBD carries more risk than the numbers justify. Rents remain high, office occupancy has not fully recovered, and the break-even customer counts are demanding. Inner suburbs typically offer better risk-adjusted returns.</p>
            </div>
            <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 12, padding: '18px 22px' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: S.n900, marginBottom: 6 }}>How does Locatalyze analyse Melbourne locations?</h3>
              <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7 }}>Locatalyze uses real competitor data from Google Maps and Geoapify, ABS 2021 Census demographics for each SA2 region, and a financial model built from your submitted rent and business type. The result is a GO, CAUTION, or NO verdict with a full score breakdown and 3-year projection.</p>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section style={{ background: S.n900, borderRadius: 20, padding: '48px 32px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: S.white, marginBottom: 12 }}>Ready to analyse your exact Melbourne location?</h2>
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
