import type { Metadata } from 'next'
import RentChecker from './RentChecker'

export const metadata: Metadata = {
  title: 'Is This Rent Overpriced? — Free Rent Check for Australian Businesses | Locatalyze',
  description:
    'Is your quoted rent above market for this suburb and business type? Enter your city, area, business type and monthly rent — get an instant verdict: below / within / above typical range, plus the rent-to-revenue ratio and your maximum viable rent.',
  keywords: [
    'rent overpriced checker Australia',
    'commercial rent too high Australia',
    'is my lease rent fair',
    'café rent benchmark Australia',
    'restaurant rent check',
    'retail rent above market Australia',
    'rent to revenue ratio calculator',
  ],
  alternates: { canonical: 'https://www.locatalyze.com/tools/rent-overpriced-checker' },
  openGraph: {
    title: 'Is This Rent Overpriced? | Locatalyze',
    description:
      'Free tool. Enter your city, business type and quoted monthly rent to see if you are being charged above market — with rent-to-revenue ratio and negotiation guidance.',
    type: 'website',
    url: 'https://www.locatalyze.com/tools/rent-overpriced-checker',
  },
}

const JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Is This Rent Overpriced? — Rent Check for Australian Businesses',
  url: 'https://www.locatalyze.com/tools/rent-overpriced-checker',
  description:
    'Free tool that checks whether a quoted monthly rent is above, within, or below the typical range for a given Australian city, suburb zone, and business type.',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'AUD' },
  provider: { '@type': 'Organization', name: 'Locatalyze', url: 'https://www.locatalyze.com' },
}

export default function RentOverpricedPage() {
  return (
    <main style={{
      fontFamily: "'DM Sans', 'Geist', Inter, -apple-system, sans-serif",
      minHeight: '100vh',
      background: '#F8FAFC',
      color: '#0F172A',
    }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }}
      />

      {/* ── Hero ── */}
      <section style={{
        background: '#ffffff',
        borderBottom: '1px solid #E2E8F0',
        padding: '72px 24px 52px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 60% 60% at 70% -10%, rgba(217,119,6,0.06) 0%, transparent 70%)',
        }} />
        <div style={{ maxWidth: 760, margin: '0 auto', position: 'relative' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: '#FFFBEB', border: '1px solid #FDE68A',
            borderRadius: 999, padding: '4px 14px',
            fontSize: 11, fontWeight: 700, color: '#92400E',
            letterSpacing: '0.08em', textTransform: 'uppercase',
            marginBottom: 22,
          }}>
            Free tool · No signup
          </div>

          <h1 style={{
            fontSize: 'clamp(30px, 5vw, 52px)', fontWeight: 800,
            letterSpacing: '-0.03em', lineHeight: 1.08,
            marginBottom: 20, color: '#0F172A',
          }}>
            Is this rent{' '}
            <span style={{ color: '#D97706' }}>overpriced?</span>
          </h1>

          <p style={{
            fontSize: 'clamp(15px, 2vw, 17px)', color: '#475569',
            lineHeight: 1.7, maxWidth: 580, marginBottom: 28,
          }}>
            Enter your city, area, business type, and the monthly rent you have been quoted.
            Get an instant signal: below market, within range, or above — plus the rent-to-revenue ratio
            and the maximum rent that keeps this location viable.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 20px' }}>
            {['5 cities covered', 'Café, restaurant, retail, gym, salon', 'Rent-to-revenue ratio included', '100% free'].map(t => (
              <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748B' }}>
                <span style={{ color: '#059669', fontWeight: 700 }}>✓</span>
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tool ── */}
      <section style={{ padding: '48px 24px 64px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <RentChecker />
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ background: '#fff', borderTop: '1px solid #E2E8F0', padding: '64px 24px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
            How it works
          </p>
          <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 36px)', fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.12, marginBottom: 14, color: '#0F172A' }}>
            Two signals. One decision.
          </h2>
          <p style={{ fontSize: 16, color: '#475569', lineHeight: 1.7, maxWidth: 620, marginBottom: 40 }}>
            The checker runs two independent tests: (1) is the dollar figure above market for comparable tenancies, and (2) does it pass the rent-to-revenue ratio test for your business type.
            A rent can be within typical range but still fail the ratio test — or look expensive but pass it because your category commands high revenue.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {[
              { n: '1', title: 'Market comparison', body: 'Checks your quoted rent against typical asking rents for comparable tenancies (city + suburb zone + business type). Benchmarks are based on commercial listing data and CBRE/Colliers industry reports.' },
              { n: '2', title: 'Rent-to-revenue ratio', body: 'Divides your rent by the typical monthly revenue benchmark for your business type in that zone. Under 10% is ideal. 10–12% is healthy. 12–15% is CAUTION. Over 15% is NO — rent will dominate your P&L.' },
              { n: '3', title: 'Maximum viable rent', body: 'Calculates the ceiling rent that keeps your ratio at 10% of the revenue benchmark. This is your hard walkaway number in negotiation — below it is GO, above it starts costing you margin every month.' },
              { n: '4', title: 'Negotiation guidance', body: 'If the rent fails the ratio test, the tool tells you exactly how much you need to negotiate down and which lease clauses (rent-free period, CPI cap) reduce your effective cost without changing face rent.' },
            ].map(s => (
              <div key={s.n} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 16, padding: 24 }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: '#FFFBEB', color: '#92400E', fontSize: 13, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  {s.n}
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.7, margin: 0 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Important note on benchmarks ── */}
      <section style={{ padding: '0 24px 64px', background: '#fff' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 14, padding: '18px 22px' }}>
            <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.75, margin: 0 }}>
              <strong style={{ color: '#0F172A' }}>About the benchmarks.</strong>{' '}
              These are indicative ranges based on industry data, not live listings. They reflect typical asking rents for a standard 80–120 sqm tenancy, not specific addresses, sizes, or fit-out conditions.
              A premium corner with 12m frontage will always be above range; a second-floor space with no signage rights will be below.
              Verify with 2–3 comparable live listings from REA or commercial agents before using this as a negotiation anchor.
              For a full address-level verdict — including competitor density, foot traffic, and whether the location can generate the revenue the rent requires — run a{' '}
              <a href="/onboarding" style={{ color: '#059669', fontWeight: 600, textDecoration: 'underline' }}>Locatalyze report</a>.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: '#0B1512', borderTop: '1px solid rgba(167,243,208,0.1)', padding: '72px 24px' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-0.03em', color: '#F8FAFC', marginBottom: 14, lineHeight: 1.1 }}>
            Rent checks out. Now verify the address.
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, marginBottom: 32 }}>
            A fair rent is a necessary condition — not a sufficient one. The full Locatalyze report shows competitor density, foot traffic, and demographics for your exact address, so you know whether the location can generate the revenue the rent requires.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#059669', color: '#fff', borderRadius: 12, padding: '13px 26px', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
              Analyse my address — free
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <a href="/tools" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.35)', fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
              See all free tools →
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
