import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Best Suburbs to Open a Business in Brisbane 2026 | Locatalyze',
  description: 'Discover the best and worst suburbs to open a business in Brisbane. Real data on rent, competition, demographics and demand — before you sign a lease.',
  alternates: { canonical: 'https://www.locatalyze.com/analyse/brisbane' },
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

export default function BrisbaneAnalysePage() {
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
          Brisbane Location Intelligence
        </div>
        <h1 style={{ fontSize: 40, fontWeight: 900, color: S.white, maxWidth: 700, margin: '0 auto 16px' }}>
          Best Suburbs to Open a Business in Brisbane
        </h1>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', maxWidth: 560, margin: '0 auto 32px', lineHeight: 1.7 }}>
          Most location decisions in Brisbane are made on gut feel. This guide uses competitor density, demographics, and rent benchmarks to show you where the real opportunities are — and where to avoid.
        </p>
        <Link href="/auth/signup" style={{ display: 'inline-block', background: S.brand, color: S.white, borderRadius: 12, padding: '14px 32px', fontSize: 15, fontWeight: 800, textDecoration: 'none', boxShadow: '0 4px 20px rgba(15,118,110,0.65)' }}>
          Analyse your Brisbane location →
        </Link>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 12 }}>Free report · No credit card · Results in ~90 seconds</p>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* INTRO */}
        <section style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 16, color: S.n700, marginBottom: 16 }}>Brisbane's commercial landscape shifted significantly after the 2032 Olympic announcement. Rents in certain corridors moved faster than revenue growth could justify, and a number of operators who locked in leases in 2023 and 2024 are now finding the numbers tighter than they expected.</p>
          <p style={{ fontSize: 16, color: S.n700, marginBottom: 16 }}>The city's geography plays a significant role in location decisions. The river creates natural dividing lines, and the difference between a well-positioned inner-south suburb and an overlooked inner-north strip can be the difference between a business that thrives and one that merely survives.</p>
          <p style={{ fontSize: 16, color: S.n700 }}>Brisbane also has a distinctly different trading pattern from Melbourne and Sydney. The outdoor lifestyle, earlier evenings, and strong weekend culture mean that foot traffic and revenue concentration vary in ways that are not always obvious from standard demographic data.</p>
        </section>

        {/* MAP PLACEHOLDER */}
        <div style={{ background: S.n100, border: `1px solid ${S.n200}`, borderRadius: 16, height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 48 }}>
          <div style={{ textAlign: 'center' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={S.n400} strokeWidth="1.5" style={{ marginBottom: 8 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <p style={{ fontSize: 13, color: S.n400 }}>Brisbane suburb map</p>
          </div>
        </div>

        {/* BEST SUBURBS */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: S.n900, marginBottom: 8 }}>Best Suburbs in Brisbane for New Businesses</h2>
          <p style={{ fontSize: 15, color: S.n500, marginBottom: 32 }}>These areas show the strongest combination of demand, manageable competition, and viable rent levels.</p>
          
          <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 16, padding: '24px 28px', marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Suburb 1</span>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: S.n900, marginTop: 4 }}>West End</h3>
              </div>
              <span style={{ background: S.emeraldBg, color: S.emerald, border: `1px solid ${S.emeraldBdr}`, borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', marginLeft: 12 }}>Recommended</span>
            </div>
            <p style={{ fontSize: 14, color: S.n700, marginBottom: 12, lineHeight: 1.7 }}>West End remains one of Brisbane's most reliable commercial strips. The demographic is educated, 25–45, high discretionary spend, and deliberately supportive of independent businesses. Boundary Street has strong foot traffic without the extreme rental pressure of inner-CBD locations, and the suburb continues to attract new residents from surrounding areas.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              <div style={{ background: S.n50, borderRadius: 8, padding: '8px 12px' }}>
                <p style={{ fontSize: 10, color: S.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Competition</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: S.n800 }}>Medium</p>
              </div>
              <div style={{ background: S.n50, borderRadius: 8, padding: '8px 12px' }}>
                <p style={{ fontSize: 10, color: S.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Rent Level</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: S.n800 }}>$65–$85/m²</p>
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
                <h3 style={{ fontSize: 20, fontWeight: 800, color: S.n900, marginTop: 4 }}>Fortitude Valley</h3>
              </div>
              <span style={{ background: S.emeraldBg, color: S.emerald, border: `1px solid ${S.emeraldBdr}`, borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', marginLeft: 12 }}>Recommended</span>
            </div>
            <p style={{ fontSize: 14, color: S.n700, marginBottom: 12, lineHeight: 1.7 }}>The Valley has evolved well beyond its nightlife reputation. During daylight hours, the Brunswick Street and Ann Street corridors carry consistent foot traffic from a mix of office workers, creative industry professionals, and residents of the rapidly growing apartment stock. Daytime trading conditions are significantly better than they were five years ago.</p>
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
                <p style={{ fontSize: 13, fontWeight: 700, color: S.n800 }}>Strong</p>
              </div>
            </div>
          </div>
          <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 16, padding: '24px 28px', marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Suburb 3</span>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: S.n900, marginTop: 4 }}>Paddington</h3>
              </div>
              <span style={{ background: S.emeraldBg, color: S.emerald, border: `1px solid ${S.emeraldBdr}`, borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', marginLeft: 12 }}>Recommended</span>
            </div>
            <p style={{ fontSize: 14, color: S.n700, marginBottom: 12, lineHeight: 1.7 }}>Paddington's Given Terrace is compact but consistent. The demographic is affluent, the spending patterns are strong, and the competition is present but not crushing. The challenge is limited space — when a tenancy becomes available it tends to move quickly, and landlords understand that demand exists.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              <div style={{ background: S.n50, borderRadius: 8, padding: '8px 12px' }}>
                <p style={{ fontSize: 10, color: S.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Competition</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: S.n800 }}>Medium</p>
              </div>
              <div style={{ background: S.n50, borderRadius: 8, padding: '8px 12px' }}>
                <p style={{ fontSize: 10, color: S.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Rent Level</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: S.n800 }}>$75–$95/m²</p>
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
                <h3 style={{ fontSize: 20, fontWeight: 800, color: S.n900, marginTop: 4 }}>Woolloongabba</h3>
              </div>
              <span style={{ background: S.emeraldBg, color: S.emerald, border: `1px solid ${S.emeraldBdr}`, borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', marginLeft: 12 }}>Recommended</span>
            </div>
            <p style={{ fontSize: 14, color: S.n700, marginBottom: 12, lineHeight: 1.7 }}>Woolloongabba is at a genuine transition point. The Cross River Rail investment and ongoing development are drawing in a younger, higher-income demographic faster than the commercial rent has adjusted. For operators willing to commit before the area fully matures, the window of opportunity is real and measurable.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              <div style={{ background: S.n50, borderRadius: 8, padding: '8px 12px' }}>
                <p style={{ fontSize: 10, color: S.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Competition</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: S.n800 }}>Low</p>
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
            <h3 style={{ fontSize: 17, fontWeight: 700, color: S.n900, marginBottom: 6 }}>Bulimba</h3>
            <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7 }}>Oxford Street in Bulimba gets significantly less attention than West End or Paddington, but the resident demographic is comparable — and in some income brackets, stronger. The suburb is underrepresented in operator conversations given the quality of the local customer base. Parking availability makes it more accessible than riverside alternatives.</p>
          </div>
          <div style={{ borderLeft: `3px solid ${S.brand}`, paddingLeft: 20, marginBottom: 24 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: S.n900, marginBottom: 6 }}>Newmarket</h3>
            <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7 }}>Newmarket sits in the inner north with solid residential density and a neighbourhood commercial strip that has historically underperformed its demographic potential. Rents are reasonable, competition is limited, and the surrounding suburb is seeing consistent population growth from families priced out of further-inner suburbs.</p>
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
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: S.n900 }}>West End</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>$65–85/m²</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>Medium</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>High</td>
                  <td style={{ padding: '12px 16px' }}><span style={{ background: S.emeraldBg, color: S.emerald, border: `1px solid ${S.emeraldBdr}`, borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>Low</span></td>
                </tr><tr style={{ background: S.n50, borderBottom: `1px solid ${S.n100}` }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: S.n900 }}>Woolloongabba</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>$55–75/m²</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>Low</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>Rising</td>
                  <td style={{ padding: '12px 16px' }}><span style={{ background: S.emeraldBg, color: S.emerald, border: `1px solid ${S.emeraldBdr}`, borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>Low</span></td>
                </tr><tr style={{ background: S.white, borderBottom: `1px solid ${S.n100}` }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: S.n900 }}>Paddington</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>$75–95/m²</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>Medium</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>Strong</td>
                  <td style={{ padding: '12px 16px' }}><span style={{ background: S.emeraldBg, color: S.emerald, border: `1px solid ${S.emeraldBdr}`, borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>Low</span></td>
                </tr><tr style={{ background: S.n50, borderBottom: `1px solid ${S.n100}` }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: S.n900 }}>Fortitude Valley</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>$70–95/m²</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>Medium</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>Strong</td>
                  <td style={{ padding: '12px 16px' }}><span style={{ background: S.amberBg, color: S.amber, border: `1px solid ${S.amberBdr}`, borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>Medium</span></td>
                </tr><tr style={{ background: S.white, borderBottom: `1px solid ${S.n100}` }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: S.n900 }}>South Bank</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>$90–120/m²</td>
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
            <h3 style={{ fontSize: 15, fontWeight: 700, color: S.red, marginBottom: 4 }}>Queen Street Mall and surrounds</h3>
            <p style={{ fontSize: 13, color: '#7f1d1d', lineHeight: 1.7 }}>The CBD retail core remains challenging for independent operators. Rents are structured for large national tenants, foot traffic is high in volume but low in conversion for independent concepts, and the lease terms typically require financial backing that most new businesses cannot reasonably provide.</p>
          </div>
          <div style={{ background: S.redBg, border: `1px solid ${S.redBdr}`, borderRadius: 12, padding: '16px 20px', marginBottom: 12 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: S.red, marginBottom: 4 }}>South Bank</h3>
            <p style={{ fontSize: 13, color: '#7f1d1d', lineHeight: 1.7 }}>South Bank benefits from tourism and event traffic, but trading patterns are heavily event-dependent. Operators who build their financial model on peak-weekend numbers frequently find mid-week revenue falls well short of covering fixed costs. The tourist demographic also tends toward lower average spend than the resident demographics of inner suburbs.</p>
          </div>
        </section>

        {/* CASE STUDY */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: S.n900, marginBottom: 8 }}>Real Scenario: Two Locations, Very Different Outcomes</h2>
          <p style={{ fontSize: 15, color: S.n500, marginBottom: 24 }}>Same business type, same budget — but the suburb makes all the difference.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="two-col">
            <div style={{ background: S.emeraldBg, border: `1.5px solid ${S.emeraldBdr}`, borderRadius: 14, padding: '20px 22px' }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: S.emerald, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Location A — Stronger position</span>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#065f46', margin: '8px 0 10px' }}>Woolloongabba — Stanley Street</h3>
              <p style={{ fontSize: 13, color: '#064e3b', lineHeight: 1.7 }}>Monthly rent $5,800 for 80m². Competitor count within 500m: 4. Demographic transition underway — median household income rising. Estimated break-even at 32 customers per day, achievable within a realistic ramp-up period. The Olympic infrastructure investment provides a credible long-term tailwind.</p>
            </div>
            <div style={{ background: S.redBg, border: `1.5px solid ${S.redBdr}`, borderRadius: 14, padding: '20px 22px' }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: S.red, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Location B — Higher risk</span>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#7f1d1d', margin: '8px 0 10px' }}>South Bank — Grey Street</h3>
              <p style={{ fontSize: 13, color: '#7f1d1d', lineHeight: 1.7 }}>Monthly rent $9,500 for similar 80m². Foot traffic appears strong on weekends but thins dramatically mid-week. Competitor count within 500m: 18. Break-even requires 61 customers per day. Revenue is event-dependent, which creates cash flow volatility that is difficult to manage in the first year of operation.</p>
            </div>
          </div>
        </section>

        {/* TIPS */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: S.n900, marginBottom: 24 }}>What to Check Before You Sign a Lease in Brisbane</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: S.brandFaded, border: `1px solid ${S.brandBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12, fontWeight: 800, color: S.brand }}>1</div>
              <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7, paddingTop: 4 }}>Brisbane's heat significantly affects trading patterns. Businesses that depend on outdoor seating or walk-in foot traffic need to model summer versus winter revenue separately.</p>
            </div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: S.brandFaded, border: `1px solid ${S.brandBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12, fontWeight: 800, color: S.brand }}>2</div>
              <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7, paddingTop: 4 }}>Check whether the street has shade infrastructure. This sounds minor but has a measurable impact on daytime foot traffic during Queensland's longer summer period.</p>
            </div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: S.brandFaded, border: `1px solid ${S.brandBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12, fontWeight: 800, color: S.brand }}>3</div>
              <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7, paddingTop: 4 }}>Cross River Rail construction has affected multiple inner-city corridors. Verify current access conditions for any location near the rail corridor.</p>
            </div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: S.brandFaded, border: `1px solid ${S.brandBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12, fontWeight: 800, color: S.brand }}>4</div>
              <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7, paddingTop: 4 }}>Brisbane trades earlier than Melbourne and Sydney. If your revenue model depends on dinner service, understand the actual evening culture of the specific suburb, not the city average.</p>
            </div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: S.brandFaded, border: `1px solid ${S.brandBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12, fontWeight: 800, color: S.brand }}>5</div>
              <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7, paddingTop: 4 }}>Olympic-related development announcements can create rental speculation ahead of actual demand. Price increases in some corridors are not yet justified by current trading conditions.</p>
            </div>
          </div>
        </section>

        {/* POLL */}
        <section style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 16, padding: '28px', marginBottom: 56 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: S.n900, marginBottom: 6 }}>Where would you open your business in Brisbane?</h3>
          <p style={{ fontSize: 13, color: S.n400, marginBottom: 20 }}>Community poll — results update in real time</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            
            <div style={{ background: S.n50, border: `1px solid ${S.n200}`, borderRadius: 10, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, color: S.n800, fontWeight: 500 }}>West End</span>
              <span style={{ fontSize: 12, color: S.n400 }}>35%</span>
            </div>
            <div style={{ background: S.n50, border: `1px solid ${S.n200}`, borderRadius: 10, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, color: S.n800, fontWeight: 500 }}>Woolloongabba</span>
              <span style={{ fontSize: 12, color: S.n400 }}>22%</span>
            </div>
            <div style={{ background: S.n50, border: `1px solid ${S.n200}`, borderRadius: 10, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, color: S.n800, fontWeight: 500 }}>Fortitude Valley</span>
              <span style={{ fontSize: 12, color: S.n400 }}>20%</span>
            </div>
            <div style={{ background: S.n50, border: `1px solid ${S.n200}`, borderRadius: 10, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, color: S.n800, fontWeight: 500 }}>Paddington</span>
              <span style={{ fontSize: 12, color: S.n400 }}>14%</span>
            </div>
            <div style={{ background: S.n50, border: `1px solid ${S.n200}`, borderRadius: 10, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, color: S.n800, fontWeight: 500 }}>Other suburb</span>
              <span style={{ fontSize: 12, color: S.n400 }}>9%</span>
            </div>
          </div>
          <p style={{ fontSize: 11, color: S.n400, marginTop: 12 }}>Data is illustrative. Run a free analysis to get real numbers for your location.</p>
        </section>

        {/* FAQ */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: S.n900, marginBottom: 24 }}>Frequently Asked Questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            
            <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 12, padding: '18px 22px' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: S.n900, marginBottom: 6 }}>What is average commercial rent in Brisbane?</h3>
              <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7 }}>Brisbane commercial rents currently range from approximately $55–$75/m² in transitioning inner suburbs like Woolloongabba and Newmarket, to $80–$110/m² in established strips like West End and Paddington. CBD retail is significantly higher and generally not viable for new independent operators.</p>
            </div>
            <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 12, padding: '18px 22px' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: S.n900, marginBottom: 6 }}>Is Brisbane a good city to open a small business in 2026?</h3>
              <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7 }}>Brisbane's population growth, rising median incomes, and infrastructure investment create genuine opportunity. The risk is that some rental markets have moved ahead of actual revenue potential. Careful location selection is more important in Brisbane now than it was three years ago.</p>
            </div>
            <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 12, padding: '18px 22px' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: S.n900, marginBottom: 6 }}>Which suburbs in Brisbane have the lowest commercial rent?</h3>
              <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7 }}>Newmarket, Woolloongabba, and several inner-north suburbs currently offer the best combination of reasonable rent and genuine demand potential. Outer suburbs have lower rents but the customer density often does not support specialist independent businesses.</p>
            </div>
            <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 12, padding: '18px 22px' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: S.n900, marginBottom: 6 }}>How long does a Locatalyze analysis take?</h3>
              <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7 }}>A full location report takes about 90 seconds. It includes competitor density data within 500m, ABS census demographics, a financial model with your submitted inputs, and a GO / CAUTION / NO verdict with score breakdown.</p>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section style={{ background: S.n900, borderRadius: 20, padding: '48px 32px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: S.white, marginBottom: 12 }}>Ready to analyse your exact Brisbane location?</h2>
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
