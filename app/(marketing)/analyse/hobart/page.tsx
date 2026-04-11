import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Best Suburbs to Open a Business in Hobart 2026 | Locatalyze',
  description: 'Discover the best and worst suburbs to open a business in Hobart. Real data on rent, competition, demographics and demand — before you sign a lease.',
  alternates: { canonical: 'https://www.locatalyze.com/analyse/hobart' },
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

export default function HobartAnalysePage() {
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
          Hobart Location Intelligence
        </div>
        <h1 style={{ fontSize: 40, fontWeight: 900, color: S.white, maxWidth: 700, margin: '0 auto 16px' }}>
          Best Suburbs to Open a Business in Hobart
        </h1>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', maxWidth: 560, margin: '0 auto 32px', lineHeight: 1.7 }}>
          Most location decisions in Hobart are made on gut feel. This guide uses competitor density, demographics, and rent benchmarks to show you where the real opportunities are — and where to avoid.
        </p>
        <Link href="/auth/signup" style={{ display: 'inline-block', background: S.brand, color: S.white, borderRadius: 12, padding: '14px 32px', fontSize: 15, fontWeight: 800, textDecoration: 'none', boxShadow: '0 4px 20px rgba(15,118,110,0.65)' }}>
          Analyse your Hobart location →
        </Link>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 12 }}>Free report · No credit card · Results in ~90 seconds</p>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* INTRO */}
        <section style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 16, color: S.n700, marginBottom: 16 }}>Hobart's commercial market has undergone a remarkable transformation over the past decade. The city that was once overlooked by operators from the mainland is now attracting genuine interest — but with that interest has come rental pressure in certain corridors that was simply not present five years ago.</p>
          <p style={{ fontSize: 16, color: S.n700, marginBottom: 16 }}>The city is small by national standards, which means the available customer pool is inherently limited. A business that would be viable in a comparable Sydney suburb needs to either capture a very high share of the local market or attract consistent visitor spending to supplement the resident base.</p>
          <p style={{ fontSize: 16, color: S.n700 }}>Understanding which streets and suburbs punch above their weight — and which are riding reputation without the trading fundamentals to back it up — is the difference between a business that builds something sustainable and one that spends its first year surprised by how hard it is.</p>
        </section>

        {/* MAP PLACEHOLDER */}
        <div style={{ background: S.n100, border: `1px solid ${S.n200}`, borderRadius: 16, height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 48 }}>
          <div style={{ textAlign: 'center' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={S.n400} strokeWidth="1.5" style={{ marginBottom: 8 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <p style={{ fontSize: 13, color: S.n400 }}>Hobart suburb map</p>
          </div>
        </div>

        {/* BEST SUBURBS */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: S.n900, marginBottom: 8 }}>Best Suburbs in Hobart for New Businesses</h2>
          <p style={{ fontSize: 15, color: S.n500, marginBottom: 32 }}>These areas show the strongest combination of demand, manageable competition, and viable rent levels.</p>
          
          <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 16, padding: '24px 28px', marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Suburb 1</span>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: S.n900, marginTop: 4 }}>North Hobart</h3>
              </div>
              <span style={{ background: S.emeraldBg, color: S.emerald, border: `1px solid ${S.emeraldBdr}`, borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', marginLeft: 12 }}>Recommended</span>
            </div>
            <p style={{ fontSize: 14, color: S.n700, marginBottom: 12, lineHeight: 1.7 }}>Elizabeth Street in North Hobart is widely considered Tasmania's best independent business strip, and for good reason. The demographic is educated, culturally engaged, and has a strong preference for independent operators over chains. The strip has maintained high occupancy through multiple economic cycles, which speaks to the underlying strength of the customer base.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              <div style={{ background: S.n50, borderRadius: 8, padding: '8px 12px' }}>
                <p style={{ fontSize: 10, color: S.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Competition</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: S.n800 }}>Medium</p>
              </div>
              <div style={{ background: S.n50, borderRadius: 8, padding: '8px 12px' }}>
                <p style={{ fontSize: 10, color: S.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Rent Level</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: S.n800 }}>$60–$80/m²</p>
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
                <h3 style={{ fontSize: 20, fontWeight: 800, color: S.n900, marginTop: 4 }}>Sandy Bay</h3>
              </div>
              <span style={{ background: S.emeraldBg, color: S.emerald, border: `1px solid ${S.emeraldBdr}`, borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', marginLeft: 12 }}>Recommended</span>
            </div>
            <p style={{ fontSize: 14, color: S.n700, marginBottom: 12, lineHeight: 1.7 }}>Sandy Bay carries Hobart's highest-income residential demographic and a commercial strip that has historically underperformed the quality of the customer base. For operators targeting the 35–60 affluent demographic, Sandy Bay offers access to customers who have the spending capacity without the rental premium of North Hobart.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              <div style={{ background: S.n50, borderRadius: 8, padding: '8px 12px' }}>
                <p style={{ fontSize: 10, color: S.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Competition</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: S.n800 }}>Low–Medium</p>
              </div>
              <div style={{ background: S.n50, borderRadius: 8, padding: '8px 12px' }}>
                <p style={{ fontSize: 10, color: S.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Rent Level</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: S.n800 }}>$55–$70/m²</p>
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
                <h3 style={{ fontSize: 20, fontWeight: 800, color: S.n900, marginTop: 4 }}>Salamanca</h3>
              </div>
              <span style={{ background: S.emeraldBg, color: S.emerald, border: `1px solid ${S.emeraldBdr}`, borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', marginLeft: 12 }}>Recommended</span>
            </div>
            <p style={{ fontSize: 14, color: S.n700, marginBottom: 12, lineHeight: 1.7 }}>Salamanca is Tasmania's most famous commercial precinct, but that fame comes with significant caveats. The tourist dependency is real, weekend trading is dramatically different from mid-week, and rents reflect the visitor economy rather than the resident one. For businesses that genuinely serve both audiences and can manage the seasonal revenue variation, it works. For those that cannot, it is a trap.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              <div style={{ background: S.n50, borderRadius: 8, padding: '8px 12px' }}>
                <p style={{ fontSize: 10, color: S.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Competition</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: S.n800 }}>High</p>
              </div>
              <div style={{ background: S.n50, borderRadius: 8, padding: '8px 12px' }}>
                <p style={{ fontSize: 10, color: S.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Rent Level</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: S.n800 }}>$80–$110/m²</p>
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
                <span style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Suburb 4</span>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: S.n900, marginTop: 4 }}>Battery Point</h3>
              </div>
              <span style={{ background: S.emeraldBg, color: S.emerald, border: `1px solid ${S.emeraldBdr}`, borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', marginLeft: 12 }}>Recommended</span>
            </div>
            <p style={{ fontSize: 14, color: S.n700, marginBottom: 12, lineHeight: 1.7 }}>Battery Point sits adjacent to Salamanca but trades quite differently. The residential character is strong, the visitor traffic is present but not overwhelming, and the commercial opportunities are limited by the heritage character of the area. When spaces become available, they tend to suit specialty operators who benefit from the premium positioning.</p>
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
                <p style={{ fontSize: 13, fontWeight: 700, color: S.n800 }}>Niche</p>
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
            <h3 style={{ fontSize: 17, fontWeight: 700, color: S.n900, marginBottom: 6 }}>New Town</h3>
            <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7 }}>New Town Road is one of Hobart's most overlooked commercial strips. The residential density is solid for a city of Hobart's size, the demographic is increasingly younger as property prices push buyers away from Sandy Bay and West Hobart, and commercial rents remain very accessible. For operators who do not need tourist-driven revenue, New Town is worth serious consideration.</p>
          </div>
          <div style={{ borderLeft: `3px solid ${S.brand}`, paddingLeft: 20, marginBottom: 24 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: S.n900, marginBottom: 6 }}>Moonah</h3>
            <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7 }}>Moonah has a large and genuinely loyal residential customer base that is consistently underserved by quality independent businesses. The suburb's cultural diversity creates demand for a broader range of offerings than the more homogeneous inner suburbs, and commercial rents are among the lowest of any accessible location in greater Hobart.</p>
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
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: S.n900 }}>North Hobart</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>$60–80/m²</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>Medium</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>High</td>
                  <td style={{ padding: '12px 16px' }}><span style={{ background: S.emeraldBg, color: S.emerald, border: `1px solid ${S.emeraldBdr}`, borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>Low</span></td>
                </tr><tr style={{ background: S.n50, borderBottom: `1px solid ${S.n100}` }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: S.n900 }}>Sandy Bay</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>$55–70/m²</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>Low–Med</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>Strong</td>
                  <td style={{ padding: '12px 16px' }}><span style={{ background: S.emeraldBg, color: S.emerald, border: `1px solid ${S.emeraldBdr}`, borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>Low</span></td>
                </tr><tr style={{ background: S.white, borderBottom: `1px solid ${S.n100}` }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: S.n900 }}>Battery Point</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>$55–75/m²</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>Low</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>Niche</td>
                  <td style={{ padding: '12px 16px' }}><span style={{ background: S.emeraldBg, color: S.emerald, border: `1px solid ${S.emeraldBdr}`, borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>Low</span></td>
                </tr><tr style={{ background: S.n50, borderBottom: `1px solid ${S.n100}` }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: S.n900 }}>Salamanca</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>$80–110/m²</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>High</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>Seasonal</td>
                  <td style={{ padding: '12px 16px' }}><span style={{ background: S.amberBg, color: S.amber, border: `1px solid ${S.amberBdr}`, borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>Medium</span></td>
                </tr><tr style={{ background: S.white, borderBottom: `1px solid ${S.n100}` }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: S.n900 }}>Waterfront</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>$95–120/m²</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>High</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>Tourist</td>
                  <td style={{ padding: '12px 16px' }}><span style={{ background: S.amberBg, color: S.amber, border: `1px solid ${S.amberBdr}`, borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>Medium</span></td>
                </tr><tr style={{ background: S.n50, borderBottom: `1px solid ${S.n100}` }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: S.n900 }}>CBD Mall</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>$85–110/m²</td>
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
            <h3 style={{ fontSize: 15, fontWeight: 700, color: S.red, marginBottom: 4 }}>Waterfront — Brooke Street Pier area</h3>
            <p style={{ fontSize: 13, color: '#7f1d1d', lineHeight: 1.7 }}>The Hobart waterfront is visually striking and attracts high tourist volumes, but the trading dynamics for independent operators are challenging. Rents reflect the premium location, visitor spending is concentrated on weekends and summer, and the structural costs of tourism-oriented tenancies are significant. Very few independent operators have built sustainable businesses here without an anchor in the resident market.</p>
          </div>
          <div style={{ background: S.redBg, border: `1px solid ${S.redBdr}`, borderRadius: 12, padding: '16px 20px', marginBottom: 12 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: S.red, marginBottom: 4 }}>Elizabeth Street Mall</h3>
            <p style={{ fontSize: 13, color: '#7f1d1d', lineHeight: 1.7 }}>The CBD mall carries the structural challenges of most Australian retail malls — rents that reflect national tenants, foot traffic that is highly time-dependent, and a competitive environment that disadvantages independent operators. In a city of Hobart's size, the mall's customer pool is also more limited than the foot traffic numbers suggest.</p>
          </div>
        </section>

        {/* CASE STUDY */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: S.n900, marginBottom: 8 }}>Real Scenario: Two Locations, Very Different Outcomes</h2>
          <p style={{ fontSize: 15, color: S.n500, marginBottom: 24 }}>Same business type, same budget — but the suburb makes all the difference.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="two-col">
            <div style={{ background: S.emeraldBg, border: `1.5px solid ${S.emeraldBdr}`, borderRadius: 14, padding: '20px 22px' }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: S.emerald, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Location A — Stronger position</span>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#065f46', margin: '8px 0 10px' }}>North Hobart — Elizabeth Street</h3>
              <p style={{ fontSize: 13, color: '#064e3b', lineHeight: 1.7 }}>Monthly rent $4,800 for 65m². Competitor count within 500m: 5. The resident demographic is culturally engaged and actively seeks quality independent operators. Break-even at 28 customers per day. The strip has a strong community identity that provides marketing leverage and repeat business at rates above the Hobart average.</p>
            </div>
            <div style={{ background: S.redBg, border: `1.5px solid ${S.redBdr}`, borderRadius: 14, padding: '20px 22px' }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: S.red, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Location B — Higher risk</span>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#7f1d1d', margin: '8px 0 10px' }}>Salamanca — Salamanca Place</h3>
              <p style={{ fontSize: 13, color: '#7f1d1d', lineHeight: 1.7 }}>Monthly rent $7,200 for similar 65m². Strong weekend and summer trading but significant mid-week and winter troughs. Competitor count within 500m: 16. Revenue model depends on tourist volumes that are weather and season dependent. Break-even of 44 customers per day is achievable in summer but difficult in a wet winter mid-week.</p>
            </div>
          </div>
        </section>

        {/* TIPS */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: S.n900, marginBottom: 24 }}>What to Check Before You Sign a Lease in Hobart</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: S.brandFaded, border: `1px solid ${S.brandBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12, fontWeight: 800, color: S.brand }}>1</div>
              <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7, paddingTop: 4 }}>Hobart's seasons are more pronounced than mainland capitals. A revenue model that does not account for the winter trading reduction will produce an optimistic picture that does not reflect the operational reality.</p>
            </div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: S.brandFaded, border: `1px solid ${S.brandBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12, fontWeight: 800, color: S.brand }}>2</div>
              <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7, paddingTop: 4 }}>MONA has created a significant visitor economy that benefits certain corridors, but this traffic does not distribute evenly across the city. Understand whether your specific location captures any of this visitor flow.</p>
            </div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: S.brandFaded, border: `1px solid ${S.brandBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12, fontWeight: 800, color: S.brand }}>3</div>
              <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7, paddingTop: 4 }}>Hobart's parking culture is stronger than most mainland cities. Locations with accessible parking genuinely outperform equivalents without it, particularly for businesses targeting the 40+ demographic.</p>
            </div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: S.brandFaded, border: `1px solid ${S.brandBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12, fontWeight: 800, color: S.brand }}>4</div>
              <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7, paddingTop: 4 }}>The festival economy — Dark Mofo, Taste of Tasmania — creates useful revenue spikes, but the timing can clash with operational planning. Factor these events into your annual cash flow model, not your weekly baseline.</p>
            </div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: S.brandFaded, border: `1px solid ${S.brandBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12, fontWeight: 800, color: S.brand }}>5</div>
              <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7, paddingTop: 4 }}>Tasmania's supply chain logistics are slower and more expensive than mainland equivalents. Build this into your cost model, particularly for any business dependent on fresh produce or time-sensitive stock.</p>
            </div>
          </div>
        </section>

        {/* POLL */}
        <section style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 16, padding: '28px', marginBottom: 56 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: S.n900, marginBottom: 6 }}>Where would you open your business in Hobart?</h3>
          <p style={{ fontSize: 13, color: S.n400, marginBottom: 20 }}>Community poll — results update in real time</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            
            <div style={{ background: S.n50, border: `1px solid ${S.n200}`, borderRadius: 10, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, color: S.n800, fontWeight: 500 }}>North Hobart</span>
              <span style={{ fontSize: 12, color: S.n400 }}>42%</span>
            </div>
            <div style={{ background: S.n50, border: `1px solid ${S.n200}`, borderRadius: 10, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, color: S.n800, fontWeight: 500 }}>Sandy Bay</span>
              <span style={{ fontSize: 12, color: S.n400 }}>24%</span>
            </div>
            <div style={{ background: S.n50, border: `1px solid ${S.n200}`, borderRadius: 10, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, color: S.n800, fontWeight: 500 }}>Salamanca</span>
              <span style={{ fontSize: 12, color: S.n400 }}>18%</span>
            </div>
            <div style={{ background: S.n50, border: `1px solid ${S.n200}`, borderRadius: 10, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, color: S.n800, fontWeight: 500 }}>Battery Point</span>
              <span style={{ fontSize: 12, color: S.n400 }}>10%</span>
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
              <h3 style={{ fontSize: 15, fontWeight: 700, color: S.n900, marginBottom: 6 }}>Is Hobart a good city to open a business?</h3>
              <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7 }}>Hobart suits operators who understand its scale and trading patterns. The customer base is loyal, rents are reasonable by mainland standards, and the city's growing visitor economy provides a supplement to resident spending. The risk is overestimating the available customer pool in a city of 250,000 people.</p>
            </div>
            <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 12, padding: '18px 22px' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: S.n900, marginBottom: 6 }}>What is average commercial rent in Hobart?</h3>
              <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7 }}>Hobart commercial rents range from approximately $45–$65/m² in suburban strips like New Town and Moonah, to $70–$95/m² in North Hobart and Salamanca. Waterfront and premium tourist-oriented locations can reach $100–$120/m² but carry corresponding trading risk.</p>
            </div>
            <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 12, padding: '18px 22px' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: S.n900, marginBottom: 6 }}>How does seasonal trading affect Hobart businesses?</h3>
              <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7 }}>The seasonal variation in Hobart is more pronounced than most mainland cities. Summer (November–March) typically delivers 30–45% higher revenue than winter for food and hospitality businesses. Any financial model for a Hobart business should explicitly account for this variation rather than using annual averages.</p>
            </div>
            <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 12, padding: '18px 22px' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: S.n900, marginBottom: 6 }}>Which Hobart suburb is best for a café?</h3>
              <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7 }}>North Hobart's Elizabeth Street is the most consistently recommended location based on demographic fit, resident loyalty, and sustainable rent levels. Sandy Bay is worth considering for operators targeting the higher-income segment, with lower competition than North Hobart.</p>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section style={{ background: S.n900, borderRadius: 20, padding: '48px 32px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: S.white, marginBottom: 12 }}>Ready to analyse your exact Hobart location?</h2>
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
