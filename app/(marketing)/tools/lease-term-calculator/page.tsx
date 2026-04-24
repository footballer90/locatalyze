import type { Metadata } from 'next'
import LeaseCalculator from './LeaseCalculator'

export const metadata: Metadata = {
  title: '3-Year vs 5-Year Lease Calculator — Total Committed Exposure & Break-Even | Locatalyze',
  description:
    'Should you sign a 3-year or 5-year commercial lease? Enter your rent, net profit, and fit-out cost to see total committed exposure, break-even timeline, and maximum loss if the business closes in Year 1 or Year 2. Free, instant, no signup.',
  keywords: [
    '3 year vs 5 year commercial lease Australia',
    'commercial lease term calculator',
    'lease commitment calculator Australia',
    'café lease term comparison',
    'how long should I sign a commercial lease for',
    'lease break-even calculator',
    'commercial lease risk calculator Australia',
  ],
  alternates: { canonical: 'https://locatalyze.com/tools/lease-term-calculator' },
  openGraph: {
    title: '3-Year vs 5-Year Lease Calculator | Locatalyze',
    description:
      'Free tool. Compare 3, 4, and 5-year commercial lease terms by total committed rent, break-even timeline, and loss exposure if the business closes early.',
    type: 'website',
    url: 'https://locatalyze.com/tools/lease-term-calculator',
  },
}

const JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '3-Year vs 5-Year Commercial Lease Calculator',
  url: 'https://locatalyze.com/tools/lease-term-calculator',
  description:
    'Free tool for Australian business operators that compares 3, 4, and 5-year commercial lease terms by total rent commitment, fit-out payback period, full break-even timeline, and loss scenario if the business closes early.',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'AUD' },
  provider: { '@type': 'Organization', name: 'Locatalyze', url: 'https://locatalyze.com' },
}

export default function LeaseTermPage() {
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
          background: 'radial-gradient(ellipse 60% 60% at 60% -10%, rgba(37,99,235,0.06) 0%, transparent 70%)',
        }} />
        <div style={{ maxWidth: 760, margin: '0 auto', position: 'relative' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: '#EFF6FF', border: '1px solid #BFDBFE',
            borderRadius: 999, padding: '4px 14px',
            fontSize: 11, fontWeight: 700, color: '#1D4ED8',
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
            3-year or 5-year lease —{' '}
            <span style={{ color: '#2563EB' }}>what are you actually committing to?</span>
          </h1>

          <p style={{
            fontSize: 'clamp(15px, 2vw, 17px)', color: '#475569',
            lineHeight: 1.7, maxWidth: 620, marginBottom: 28,
          }}>
            Most operators focus on the monthly rent figure. The real decision is the total commitment.
            Enter your rent, net profit, and fit-out cost — get a side-by-side comparison of 3, 4, and 5-year terms
            including break-even timeline, and exactly how much you lose if the business closes in Year 1 or Year 2.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 20px' }}>
            {['3, 4 & 5-year comparison', 'Fit-out payback period', 'Year 1 & Year 2 loss scenarios', 'Break-clause explanation'].map(t => (
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
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <LeaseCalculator />
        </div>
      </section>

      {/* ── Why this matters ── */}
      <section style={{ background: '#fff', borderTop: '1px solid #E2E8F0', padding: '64px 24px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
            Why lease term matters
          </p>
          <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 36px)', fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.12, marginBottom: 14, color: '#0F172A' }}>
            The monthly rent is not the decision. The total commitment is.
          </h2>
          <p style={{ fontSize: 16, color: '#475569', lineHeight: 1.7, maxWidth: 620, marginBottom: 40 }}>
            At $7,600/month, a 3-year lease commits $273,600 in rent. A 5-year lease commits $456,000.
            That $182,400 difference is invisible until you sign. This tool makes it visible before you do.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {[
              {
                n: '1',
                title: 'Total committed rent',
                body: 'Monthly rent × lease months. This is your minimum financial obligation from day one, before you serve a single customer. A longer term locks in more obligation even if trading is poor.',
              },
              {
                n: '2',
                title: 'Fit-out payback',
                body: 'How many months of net profit it takes to recover your fit-out investment — before you start paying for the rent commitment. A heavy fit-out on a short term means you recover less value per dollar spent.',
              },
              {
                n: '3',
                title: 'Full break-even',
                body: 'The month at which cumulative net profit equals fit-out cost plus total rent paid. If this falls inside the lease term, the deal is structurally sound. If it falls outside, you never recover all committed capital in this term.',
              },
              {
                n: '4',
                title: 'Year 1 loss scenario',
                body: 'If trading is worse than modelled and the business closes at the 12-month mark, this is the net loss: sunk fit-out plus remaining lease obligation minus profit earned. The number most operators never calculate before signing.',
              },
            ].map(s => (
              <div key={s.n} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 16, padding: 24 }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: '#EFF6FF', color: '#1D4ED8', fontSize: 13, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  {s.n}
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.7, margin: 0 }}>{s.body}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 32, background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 14, padding: '18px 22px' }}>
            <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.75, margin: 0 }}>
              <strong style={{ color: '#0F172A' }}>Important.</strong>{' '}
              This tool uses linear profit projections. Real businesses have ramp-up periods, seasonal variation, and growth curves that this model does not capture.
              The loss scenarios assume no subletting income, no goodwill on sale of the business, and no landlord negotiation on early termination.
              These are intentionally conservative. Verify all figures with your accountant before signing any commercial lease.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: '#0B1512', borderTop: '1px solid rgba(167,243,208,0.1)', padding: '72px 24px' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-0.03em', color: '#F8FAFC', marginBottom: 14, lineHeight: 1.1 }}>
            Numbers look right. Now verify the address.
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, marginBottom: 32 }}>
            A lease term calculator tells you the cost of the commitment. A Locatalyze report tells you whether the address can generate the revenue to justify it — with competitor data, foot traffic signals, and a GO / CAUTION / NO verdict.
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
