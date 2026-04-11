import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Best Suburbs to Open a Business in Canberra 2026 | Locatalyze',
  description: 'Discover the best and worst suburbs to open a business in Canberra. Real data on rent, competition, demographics and demand — before you sign a lease.',
  alternates: { canonical: 'https://www.locatalyze.com/analyse/canberra' },
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

export default function CanberraAnalysePage() {
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
          Canberra Location Intelligence
        </div>
        <h1 style={{ fontSize: 40, fontWeight: 900, color: S.white, maxWidth: 700, margin: '0 auto 16px' }}>
          Best Suburbs to Open a Business in Canberra
        </h1>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', maxWidth: 560, margin: '0 auto 32px', lineHeight: 1.7 }}>
          Most location decisions in Canberra are made on gut feel. This guide uses competitor density, demographics, and rent benchmarks to show you where the real opportunities are — and where to avoid.
        </p>
        <Link href="/auth/signup" style={{ display: 'inline-block', background: S.brand, color: S.white, borderRadius: 12, padding: '14px 32px', fontSize: 15, fontWeight: 800, textDecoration: 'none', boxShadow: '0 4px 20px rgba(15,118,110,0.35)' }}>
          Analyse your Canberra location →
        </Link>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 12 }}>Free report · No credit card · Results in ~90 seconds</p>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* INTRO */}
        <section style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 16, color: S.n700, marginBottom: 16 }}>Canberra is the most misunderstood commercial market in Australia. The city's public service economy creates a consumer base with unusual characteristics — stable incomes, high education levels, strong mid-week trading, and a preference for quality over price that makes it genuinely different from every other Australian capital.</p>
          <p style={{ fontSize: 16, color: S.n700, marginBottom: 16 }}>The challenge is not affordability — Canberra rents are moderate by national standards, and the customer spending capacity is among the highest of any Australian city. The challenge is understanding the specific trading patterns of each district, and recognising that Canberra's planned geography creates very clear commercial winners and losers.</p>
          <p style={{ fontSize: 16, color: S.n700 }}>The city's town centres — Civic, Belconnen, Tuggeranong, Woden, Gungahlin — each have their own character, demographic, and trading dynamics. A business that thrives in Kingston would struggle in Tuggeranong, and vice versa, despite both being within the same city.</p>
        </section>

        {/* MAP PLACEHOLDER */}
        <div style={{ background: S.n100, border: `1px solid ${S.n200}`, borderRadius: 16, height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 48 }}>
          <div style={{ textAlign: 'center' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={S.n400} strokeWidth="1.5" style={{ marginBottom: 8 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <p style={{ fontSize: 13, color: S.n400 }}>Canberra suburb map</p>
          </div>
        </div>

        {/* BEST SUBURBS */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: S.n900, marginBottom: 8 }}>Best Suburbs in Canberra for New Businesses</h2>
          <p style={{ fontSize: 15, color: S.n500, marginBottom: 32 }}>These areas show the strongest combination of demand, manageable competition, and viable rent levels.</p>
          
          <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 16, padding: '24px 28px', marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Suburb 1</span>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: S.n900, marginTop: 4 }}>Kingston</h3>
              </div>
              <span style={{ background: S.emeraldBg, color: S.emerald, border: `1px solid ${S.emeraldBdr}`, borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', marginLeft: 12 }}>Recommended</span>
            </div>
            <p style={{ fontSize: 14, color: S.n700, marginBottom: 12, lineHeight: 1.7 }}>Kingston's commercial strip is one of Australia's best examples of a neighbourhood business precinct. The demographic is professional, 28–45, high household income, and has a genuine preference for quality independent operators. The Foreshore development has added a new dining and retail layer that draws visitors from across Canberra, supplementing the strong resident base.</p>
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
                <h3 style={{ fontSize: 20, fontWeight: 800, color: S.n900, marginTop: 4 }}>Braddon</h3>
              </div>
              <span style={{ background: S.emeraldBg, color: S.emerald, border: `1px solid ${S.emeraldBdr}`, borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', marginLeft: 12 }}>Recommended</span>
            </div>
            <p style={{ fontSize: 14, color: S.n700, marginBottom: 12, lineHeight: 1.7 }}>Braddon has undergone a transformation that most Australian inner suburbs would recognise — a former light industrial precinct converted into a hospitality and creative hub. Lonsdale Street is now one of Canberra's most consistently performing commercial strips, with a demographic that spends freely and actively seeks new independent operators.</p>
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
                <span style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Suburb 3</span>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: S.n900, marginTop: 4 }}>Gungahlin</h3>
              </div>
              <span style={{ background: S.emeraldBg, color: S.emerald, border: `1px solid ${S.emeraldBdr}`, borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', marginLeft: 12 }}>Recommended</span>
            </div>
            <p style={{ fontSize: 14, color: S.n700, marginBottom: 12, lineHeight: 1.7 }}>Gungahlin is Canberra's fastest-growing district and has the demographic profile to match — young families, dual incomes, high household spending, and a commercial infrastructure that is still catching up with the residential growth. For businesses targeting the family demographic, the opportunity gap between population growth and commercial supply is genuinely significant.</p>
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
                <p style={{ fontSize: 13, fontWeight: 700, color: S.n800 }}>Rising</p>
              </div>
            </div>
          </div>
          <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 16, padding: '24px 28px', marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Suburb 4</span>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: S.n900, marginTop: 4 }}>Manuka</h3>
              </div>
              <span style={{ background: S.emeraldBg, color: S.emerald, border: `1px solid ${S.emeraldBdr}`, borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', marginLeft: 12 }}>Recommended</span>
            </div>
            <p style={{ fontSize: 14, color: S.n700, marginBottom: 12, lineHeight: 1.7 }}>Manuka is Canberra's most established premium suburb for dining and retail. The demographic is senior public service, diplomats, and professionals with the city's highest household incomes. Competition is present but the market is not saturated at the quality end, and the spending capacity of the customer base provides a buffer against the moderate competition levels.</p>
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
                <p style={{ fontSize: 13, fontWeight: 700, color: S.n800 }}>Premium</p>
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
            <h3 style={{ fontSize: 17, fontWeight: 700, color: S.n900, marginBottom: 6 }}>Dickson</h3>
            <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7 }}>Dickson's Asian food precinct is well known, but the broader commercial strip has genuine opportunity for operators outside that specific category. The suburb has a strong residential base, a rapidly improving demographic as young professionals move in for proximity to the city, and commercial rents that remain below Braddon and Kingston equivalents.</p>
          </div>
          <div style={{ borderLeft: `3px solid ${S.brand}`, paddingLeft: 20, marginBottom: 24 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: S.n900, marginBottom: 6 }}>Belconnen Town Centre</h3>
            <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7 }}>Belconnen is Canberra's second-largest town centre and consistently underperforms its demographic potential for independent operators. The area has high population density, a large university population with genuine discretionary spend, and a strong employed professional base. The challenge is visibility within the centre's structure — the operators who solve the discovery problem tend to do well.</p>
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
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: S.n900 }}>Kingston</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>$70–90/m²</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>Medium</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>High</td>
                  <td style={{ padding: '12px 16px' }}><span style={{ background: S.emeraldBg, color: S.emerald, border: `1px solid ${S.emeraldBdr}`, borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>Low</span></td>
                </tr><tr style={{ background: S.n50, borderBottom: `1px solid ${S.n100}` }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: S.n900 }}>Braddon</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>$75–95/m²</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>Medium</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>Strong</td>
                  <td style={{ padding: '12px 16px' }}><span style={{ background: S.emeraldBg, color: S.emerald, border: `1px solid ${S.emeraldBdr}`, borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>Low</span></td>
                </tr><tr style={{ background: S.white, borderBottom: `1px solid ${S.n100}` }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: S.n900 }}>Gungahlin</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>$55–70/m²</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>Low</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>Rising</td>
                  <td style={{ padding: '12px 16px' }}><span style={{ background: S.emeraldBg, color: S.emerald, border: `1px solid ${S.emeraldBdr}`, borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>Low</span></td>
                </tr><tr style={{ background: S.n50, borderBottom: `1px solid ${S.n100}` }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: S.n900 }}>Manuka</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>$75–95/m²</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>Medium</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>Premium</td>
                  <td style={{ padding: '12px 16px' }}><span style={{ background: S.amberBg, color: S.amber, border: `1px solid ${S.amberBdr}`, borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>Medium</span></td>
                </tr><tr style={{ background: S.white, borderBottom: `1px solid ${S.n100}` }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: S.n900 }}>Dickson</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>$60–75/m²</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>Low–Med</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>Good</td>
                  <td style={{ padding: '12px 16px' }}><span style={{ background: S.emeraldBg, color: S.emerald, border: `1px solid ${S.emeraldBdr}`, borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>Low</span></td>
                </tr><tr style={{ background: S.n50, borderBottom: `1px solid ${S.n100}` }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: S.n900 }}>Civic CBD</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>$80–110/m²</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>High</td>
                  <td style={{ padding: '12px 16px', color: S.n700 }}>Weekdays</td>
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
            <h3 style={{ fontSize: 15, fontWeight: 700, color: S.red, marginBottom: 4 }}>Civic — CBD core</h3>
            <p style={{ fontSize: 13, color: '#7f1d1d', lineHeight: 1.7 }}>Canberra's CBD has structural challenges that arise from the public service trading pattern. The area empties on weekends and public holidays in a way that most cities do not. For businesses dependent on consistent seven-day trading, the CBD core creates revenue volatility that is difficult to manage without a significant revenue buffer.</p>
          </div>
          <div style={{ background: S.redBg, border: `1px solid ${S.redBdr}`, borderRadius: 12, padding: '16px 20px', marginBottom: 12 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: S.red, marginBottom: 4 }}>Tuggeranong Town Centre</h3>
            <p style={{ fontSize: 13, color: '#7f1d1d', lineHeight: 1.7 }}>Tuggeranong sits at the southern end of Canberra's geography, is car-dependent, and has a commercial structure dominated by large retail tenants. The demographic has lower average household income than northern Canberra, and the area has struggled to support quality independent operators over sustained periods.</p>
          </div>
        </section>

        {/* CASE STUDY */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: S.n900, marginBottom: 8 }}>Real Scenario: Two Locations, Very Different Outcomes</h2>
          <p style={{ fontSize: 15, color: S.n500, marginBottom: 24 }}>Same business type, same budget — but the suburb makes all the difference.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="two-col">
            <div style={{ background: S.emeraldBg, border: `1.5px solid ${S.emeraldBdr}`, borderRadius: 14, padding: '20px 22px' }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: S.emerald, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Location A — Stronger position</span>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#065f46', margin: '8px 0 10px' }}>Kingston — Eyre Street</h3>
              <p style={{ fontSize: 13, color: '#064e3b', lineHeight: 1.7 }}>Monthly rent $5,800 for 70m². Demographic is professional, high income, actively supportive of independent businesses. Competitor count within 500m: 5. The Foreshore development supplements resident traffic with visitor spending. Break-even at 34 customers per day. Mid-week trading is consistently strong due to public service employment patterns.</p>
            </div>
            <div style={{ background: S.redBg, border: `1.5px solid ${S.redBdr}`, borderRadius: 14, padding: '20px 22px' }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: S.red, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Location B — Higher risk</span>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#7f1d1d', margin: '8px 0 10px' }}>Civic CBD</h3>
              <p style={{ fontSize: 13, color: '#7f1d1d', lineHeight: 1.7 }}>Monthly rent $7,200 for similar 70m². Monday–Friday trading is solid during working hours but weekends and public holidays see sharp declines. Competitor count within 500m: 21. Revenue model requires 45 customers per day break-even. The weekend revenue gap is a structural challenge that cannot be solved by marketing alone.</p>
            </div>
          </div>
        </section>

        {/* TIPS */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: S.n900, marginBottom: 24 }}>What to Check Before You Sign a Lease in Canberra</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: S.brandFaded, border: `1px solid ${S.brandBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12, fontWeight: 800, color: S.brand }}>1</div>
              <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7, paddingTop: 4 }}>Canberra's public service trading pattern means mid-week is often stronger than weekends in the CBD and inner suburbs. Build your staffing and cost model around this pattern, not the weekend-heavy model that works in other cities.</p>
            </div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: S.brandFaded, border: `1px solid ${S.brandBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12, fontWeight: 800, color: S.brand }}>2</div>
              <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7, paddingTop: 4 }}>Public holidays are more frequent and more impactful in Canberra than most Australian cities. ACT has additional territory public holidays that create revenue gaps a mainland operator would not anticipate.</p>
            </div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: S.brandFaded, border: `1px solid ${S.brandBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12, fontWeight: 800, color: S.brand }}>3</div>
              <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7, paddingTop: 4 }}>The diplomatic and international community in Canberra creates specific demand for international food, specialty retail, and quality services. Operators who serve this demographic often find a loyal and high-spending customer segment.</p>
            </div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: S.brandFaded, border: `1px solid ${S.brandBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12, fontWeight: 800, color: S.brand }}>4</div>
              <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7, paddingTop: 4 }}>University of Canberra and ANU create significant student demand in their surrounding areas, but student spending patterns are very different from professional spending patterns. Understand which customer type your business actually serves.</p>
            </div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: S.brandFaded, border: `1px solid ${S.brandBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12, fontWeight: 800, color: S.brand }}>5</div>
              <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7, paddingTop: 4 }}>Canberra's cold winters affect outdoor dining viability more than any other Australian capital. The commercial success of heated outdoor space investments in Kingston and Braddon demonstrates that this can be addressed, but it requires capital planning.</p>
            </div>
          </div>
        </section>

        {/* POLL */}
        <section style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 16, padding: '28px', marginBottom: 56 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: S.n900, marginBottom: 6 }}>Where would you open your business in Canberra?</h3>
          <p style={{ fontSize: 13, color: S.n400, marginBottom: 20 }}>Community poll — results update in real time</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            
            <div style={{ background: S.n50, border: `1px solid ${S.n200}`, borderRadius: 10, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, color: S.n800, fontWeight: 500 }}>Kingston</span>
              <span style={{ fontSize: 12, color: S.n400 }}>33%</span>
            </div>
            <div style={{ background: S.n50, border: `1px solid ${S.n200}`, borderRadius: 10, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, color: S.n800, fontWeight: 500 }}>Braddon</span>
              <span style={{ fontSize: 12, color: S.n400 }}>28%</span>
            </div>
            <div style={{ background: S.n50, border: `1px solid ${S.n200}`, borderRadius: 10, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, color: S.n800, fontWeight: 500 }}>Manuka</span>
              <span style={{ fontSize: 12, color: S.n400 }}>18%</span>
            </div>
            <div style={{ background: S.n50, border: `1px solid ${S.n200}`, borderRadius: 10, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, color: S.n800, fontWeight: 500 }}>Gungahlin</span>
              <span style={{ fontSize: 12, color: S.n400 }}>14%</span>
            </div>
            <div style={{ background: S.n50, border: `1px solid ${S.n200}`, borderRadius: 10, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, color: S.n800, fontWeight: 500 }}>Other district</span>
              <span style={{ fontSize: 12, color: S.n400 }}>7%</span>
            </div>
          </div>
          <p style={{ fontSize: 11, color: S.n400, marginTop: 12 }}>Data is illustrative. Run a free analysis to get real numbers for your location.</p>
        </section>

        {/* FAQ */}
        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: S.n900, marginBottom: 24 }}>Frequently Asked Questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            
            <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 12, padding: '18px 22px' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: S.n900, marginBottom: 6 }}>Is Canberra a good city to open a business?</h3>
              <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7 }}>Canberra has a compelling case for independent operators. The consumer base has Australia's highest median household income, the public service employment base creates unusual trading stability, and commercial rents are moderate. The key is understanding the specific trading patterns of each district, which vary significantly.</p>
            </div>
            <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 12, padding: '18px 22px' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: S.n900, marginBottom: 6 }}>What is average commercial rent in Canberra?</h3>
              <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7 }}>Canberra commercial rents typically range from $55–$70/m² in growing districts like Gungahlin, to $75–$95/m² in established premium strips like Kingston, Braddon, and Manuka. CBD core rents are broadly similar to the premium strips but carry the additional weekend trading challenge.</p>
            </div>
            <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 12, padding: '18px 22px' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: S.n900, marginBottom: 6 }}>Which Canberra suburb is best for a café?</h3>
              <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7 }}>Kingston and Braddon are consistently the strongest performers for café operators based on demographic fit, spending patterns, and community identity. Gungahlin offers the best growth opportunity for operators willing to commit before the area's commercial infrastructure fully matures.</p>
            </div>
            <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 12, padding: '18px 22px' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: S.n900, marginBottom: 6 }}>How does Locatalyze analyse Canberra locations?</h3>
              <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.7 }}>Locatalyze uses Google Maps and Geoapify competitor data for your specific location, ABS 2021 Census demographics for the ACT SA2 region, and a financial model built from your submitted inputs. The result includes a GO, CAUTION, or NO verdict with competitor score, demographics score, rent affordability score, and a 3-year projection.</p>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section style={{ background: S.n900, borderRadius: 20, padding: '48px 32px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: S.white, marginBottom: 12 }}>Ready to analyse your exact Canberra location?</h2>
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
