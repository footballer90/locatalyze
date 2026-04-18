import type { Metadata } from 'next'
import BreakEvenCalculator from './BreakEvenCalculator'

export const metadata: Metadata = {
  title: 'How Many Customers Do You Need to Survive? | Break-Even Calculator',
  description:
    'Calculate the exact number of daily customers you need to break even. Enter your rent, staff costs, and average ticket to get your survival number instantly — free.',
  alternates: { canonical: 'https://www.locatalyze.com/tools/break-even-foot-traffic' },
  openGraph: {
    title: 'Break-Even Foot Traffic Calculator | Locatalyze',
    description:
      'How many customers do you need every day to survive? Find out instantly with this free tool for Australian café, retail, restaurant, gym, and salon operators.',
    type: 'website',
    url: 'https://www.locatalyze.com/tools/break-even-foot-traffic',
  },
}

const PAGE_CSS = `
.bet-page {
  font-family: "DM Sans", "Geist", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
  background: #f8fafc !important;
  color: #0f172a !important;
}
.bet-page * { box-sizing: border-box; }
.bet-page h1, .bet-page h2, .bet-page h3, .bet-page h4,
.bet-page p, .bet-page a, .bet-page span, .bet-page li,
.bet-page label, .bet-page button, .bet-page select, .bet-page input {
  font-family: "DM Sans", "Geist", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
  text-transform: none !important;
  letter-spacing: normal !important;
}

/* ── inputs & selects: force white/light theme ── */
.bet-page input, .bet-page select {
  background: #ffffff !important;
  color: #0f172a !important;
  border: 1.5px solid #e2e8f0 !important;
  border-radius: 10px !important;
}
.bet-page input:focus, .bet-page select:focus {
  background: #ffffff !important;
  color: #0f172a !important;
}
.bet-page option {
  background: #ffffff !important;
  color: #0f172a !important;
}

/* ── grid ── */
.be-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  align-items: start;
}
@media (min-width: 1024px) {
  .be-grid {
    grid-template-columns: 400px 1fr;
  }
  .be-form-sticky {
    position: sticky;
    top: 24px;
  }
}

/* ── spinner ── */
@keyframes be-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
.be-spin { animation: be-spin 0.7s linear infinite; }

/* ── shell ── */
.bet-shell {
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 24px;
}
@media (max-width: 768px) {
  .bet-shell { padding: 0 16px; }
}

/* ── hero ── */
.bet-hero {
  padding: 72px 0 36px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%) !important;
  border-bottom: 1px solid #e2e8f0;
}
@media (max-width: 768px) {
  .bet-hero { padding: 48px 0 24px; }
}
.bet-eyebrow {
  display: inline-flex !important;
  align-items: center !important;
  gap: 6px !important;
  font-size: 11px !important;
  font-weight: 700 !important;
  letter-spacing: 0.09em !important;
  text-transform: uppercase !important;
  color: #0f766e !important;
  border: 1px solid #99f6e4 !important;
  background: #f0fdf4 !important;
  border-radius: 999px !important;
  padding: 4px 12px !important;
  margin-bottom: 16px !important;
}
.bet-h1 {
  font-size: clamp(28px, 5vw, 52px) !important;
  font-weight: 800 !important;
  letter-spacing: -0.03em !important;
  line-height: 1.08 !important;
  margin-bottom: 16px !important;
  color: #0f172a !important;
}
.bet-hero-sub {
  font-size: 17px !important;
  line-height: 1.7 !important;
  color: #64748b !important;
  max-width: 660px !important;
  margin-bottom: 24px !important;
}
.bet-trust-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding-top: 4px;
}
.bet-trust-item {
  display: flex !important;
  align-items: center !important;
  gap: 7px !important;
  font-size: 13px !important;
  font-weight: 600 !important;
  color: #64748b !important;
}

/* ── tool section ── */
.bet-tool-section {
  padding: 48px 0 48px;
}
@media (max-width: 768px) {
  .bet-tool-section { padding: 32px 0; }
}

/* ── content sections ── */
.bet-section {
  padding: 64px 0;
  border-top: 1px solid #e2e8f0;
}
.bet-section--white {
  padding: 64px 0;
  border-top: 1px solid #e2e8f0;
  background: #ffffff !important;
}
@media (max-width: 768px) {
  .bet-section, .bet-section--white { padding: 44px 0; }
}
.bet-section-eyebrow {
  font-size: 11px !important;
  font-weight: 700 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.09em !important;
  color: #2563eb !important;
  margin-bottom: 10px !important;
}
.bet-section-h2 {
  font-size: clamp(22px, 3.5vw, 36px) !important;
  font-weight: 800 !important;
  letter-spacing: -0.025em !important;
  line-height: 1.15 !important;
  margin-bottom: 14px !important;
  color: #0f172a !important;
}
.bet-section-lead {
  font-size: 16px !important;
  line-height: 1.7 !important;
  color: #64748b !important;
  max-width: 680px !important;
  margin-bottom: 0 !important;
}

/* ── how it works steps ── */
.bet-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 36px;
}
.bet-step {
  background: #ffffff !important;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 22px;
  box-shadow: 0 1px 3px rgba(15,23,42,0.05);
}
.bet-step-num {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #0f172a !important;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px !important;
  font-weight: 800 !important;
  color: #ffffff !important;
  margin-bottom: 14px;
}
.bet-step h3 {
  font-size: 16px !important;
  font-weight: 700 !important;
  color: #0f172a !important;
  margin-bottom: 6px !important;
  letter-spacing: -0.01em !important;
}
.bet-step p {
  font-size: 13px !important;
  color: #64748b !important;
  line-height: 1.65 !important;
}

/* ── formula box ── */
.bet-formula {
  background: #0f172a !important;
  color: #ffffff !important;
  border-radius: 16px;
  padding: 24px 28px;
  margin-top: 32px;
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr;
}
@media (min-width: 640px) {
  .bet-formula { grid-template-columns: repeat(3, 1fr); gap: 0; }
}
.bet-formula-block {
  text-align: center;
  padding: 12px;
}
.bet-formula-label {
  font-size: 10px !important;
  font-weight: 700 !important;
  letter-spacing: 0.1em !important;
  text-transform: uppercase !important;
  color: rgba(255,255,255,0.45) !important;
  margin-bottom: 6px !important;
}
.bet-formula-val {
  font-size: 14px !important;
  font-weight: 700 !important;
  color: #ffffff !important;
  line-height: 1.3 !important;
}
.bet-formula-op {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px !important;
  font-weight: 700 !important;
  color: rgba(255,255,255,0.35) !important;
}

/* ── why matters ── */
.bet-why-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-top: 36px;
}
.bet-why-card {
  background: #f8fafc !important;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 22px;
}
.bet-why-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #eff6ff !important;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  margin-bottom: 14px;
}
.bet-why-card h3 {
  font-size: 15px !important;
  font-weight: 700 !important;
  color: #0f172a !important;
  margin-bottom: 6px !important;
}
.bet-why-card p {
  font-size: 13px !important;
  color: #64748b !important;
  line-height: 1.65 !important;
}

/* ── internal link strip ── */
.bet-link-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 32px;
}
.bet-link-pill {
  display: inline-flex !important;
  align-items: center !important;
  gap: 7px !important;
  border: 1px solid #e2e8f0 !important;
  background: #ffffff !important;
  border-radius: 999px !important;
  padding: 8px 16px !important;
  font-size: 13px !important;
  font-weight: 600 !important;
  color: #0f172a !important;
  text-decoration: none !important;
  box-shadow: 0 1px 3px rgba(15,23,42,0.06) !important;
  transition: box-shadow 0.15s !important;
}
.bet-link-pill:hover {
  box-shadow: 0 4px 12px rgba(15,23,42,0.10) !important;
  border-color: #cbd5e1 !important;
}

/* ── FAQ ── */
.bet-faq {
  display: grid;
  gap: 12px;
  margin-top: 36px;
  max-width: 760px;
}
.bet-faq-item {
  background: #ffffff !important;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 20px 22px;
}
.bet-faq-item h3 {
  font-size: 15px !important;
  font-weight: 700 !important;
  color: #0f172a !important;
  margin-bottom: 8px !important;
}
.bet-faq-item p {
  font-size: 14px !important;
  color: #64748b !important;
  line-height: 1.7 !important;
}

/* ── final CTA ── */
.bet-cta {
  padding: 80px 0;
  background: #0f172a !important;
  border-top: 1px solid #1e293b;
}
@media (max-width: 768px) {
  .bet-cta { padding: 56px 0; }
}
.bet-cta-inner {
  max-width: 680px;
}
.bet-cta h2 {
  font-size: clamp(24px, 4vw, 40px) !important;
  font-weight: 800 !important;
  letter-spacing: -0.025em !important;
  color: #ffffff !important;
  margin-bottom: 14px !important;
  line-height: 1.12 !important;
}
.bet-cta p {
  font-size: 16px !important;
  color: rgba(255,255,255,0.55) !important;
  line-height: 1.7 !important;
  margin-bottom: 28px !important;
}
.bet-cta-btn {
  display: inline-flex !important;
  align-items: center !important;
  gap: 8px !important;
  background: #ffffff !important;
  color: #0f172a !important;
  border-radius: 14px !important;
  padding: 14px 26px !important;
  font-size: 15px !important;
  font-weight: 700 !important;
  text-decoration: none !important;
  letter-spacing: -0.01em !important;
}
.bet-cta-btn:hover {
  background: #f1f5f9 !important;
}
.bet-cta-secondary {
  display: inline-flex !important;
  align-items: center !important;
  gap: 6px !important;
  color: rgba(255,255,255,0.45) !important;
  font-size: 13px !important;
  font-weight: 500 !important;
  text-decoration: underline !important;
  text-underline-offset: 3px !important;
  margin-left: 20px !important;
}
`

const JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Break-Even Foot Traffic Calculator',
  url: 'https://www.locatalyze.com/tools/break-even-foot-traffic',
  description:
    'Free calculator to find how many customers you need per day to break even. Covers café, restaurant, retail, gym and salon in Australia.',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'AUD' },
  provider: { '@type': 'Organization', name: 'Locatalyze', url: 'https://www.locatalyze.com' },
}

export default function BreakEvenPage() {
  return (
    <main className="bet-page">
      <style dangerouslySetInnerHTML={{ __html: PAGE_CSS }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }}
      />

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section className="bet-hero">
        <div className="bet-shell">
          <span className="bet-eyebrow">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/>
            </svg>
            Break-even intelligence
          </span>
          <h1 className="bet-h1">
            How many customers do you<br />need to survive?
          </h1>
          <p className="bet-hero-sub">
            Enter your rent, staff costs, and average ticket size. Get your exact daily break-even
            number — and a clear risk rating — in seconds. Free, no sign-up required.
          </p>
          <div className="bet-trust-row">
            {[
              { icon: '✓', text: 'Real cost benchmarks' },
              { icon: '✓', text: '5 business types' },
              { icon: '✓', text: 'Risk-rated output' },
              { icon: '✓', text: '100% free' },
            ].map(t => (
              <span key={t.text} className="bet-trust-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {t.text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOOL ───────────────────────────────────────────────────────────── */}
      <section className="bet-tool-section">
        <div className="bet-shell">
          <BreakEvenCalculator />
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────────────── */}
      <section className="bet-section--white">
        <div className="bet-shell">
          <p className="bet-section-eyebrow">How it works</p>
          <h2 className="bet-section-h2">The maths behind your survival number</h2>
          <p className="bet-section-lead">
            The calculator uses real Australian cost benchmarks for rent, staffing, and overheads,
            then works backwards from your fixed costs to find the minimum daily customers you need
            to cover them.
          </p>

          <div className="bet-steps">
            {[
              {
                n: '1',
                title: 'Enter your fixed costs',
                desc: 'Monthly rent is entered directly. Staff costs are estimated from real payroll benchmarks for your setup. Overheads cover utilities, insurance and misc — typical for each business type.',
              },
              {
                n: '2',
                title: 'Calculate contribution margin',
                desc: 'Every sale contributes a slice toward your fixed costs. The contribution margin is your average ticket minus the COGS percentage — the actual dollars each customer puts toward survival.',
              },
              {
                n: '3',
                title: 'Find your break-even',
                desc: 'Divide total fixed monthly costs by contribution margin per customer. Divide again by 26 trading days. That\'s the exact number of customers you need through the door every single day.',
              },
              {
                n: '4',
                title: 'Risk-rate the result',
                desc: 'We compare your break-even against real foot traffic benchmarks. Under 30/day is achievable anywhere. Over 100/day means you need a high-traffic inner-city location — or a different model.',
              },
            ].map(s => (
              <div key={s.n} className="bet-step">
                <div className="bet-step-num">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Formula visual */}
          <div className="bet-formula">
            <div className="bet-formula-block">
              <div className="bet-formula-label">Fixed costs / month</div>
              <div className="bet-formula-val">Rent + Staff + Overheads</div>
            </div>
            <div className="bet-formula-op">÷</div>
            <div className="bet-formula-block">
              <div className="bet-formula-label">Contribution margin</div>
              <div className="bet-formula-val">Ticket × (1 − COGS%)</div>
            </div>
            <div className="bet-formula-op">÷</div>
            <div className="bet-formula-block">
              <div className="bet-formula-label">Trading days</div>
              <div className="bet-formula-val">26 days / month</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY THIS MATTERS ───────────────────────────────────────────────── */}
      <section className="bet-section">
        <div className="bet-shell">
          <p className="bet-section-eyebrow">Why this matters</p>
          <h2 className="bet-section-h2">Most operators sign leases without knowing their number</h2>
          <p className="bet-section-lead">
            Rent looks affordable until you do the maths. A $5,000/month lease can require 90+ customers
            per day to break even once you add staff and overheads. This tool shows you that number
            before you sign.
          </p>

          <div className="bet-why-grid">
            {[
              {
                icon: '📍',
                title: 'Rent is just the start',
                desc: 'Staff costs often exceed rent. Two full-time staff at a café can cost $9,500/month — nearly doubling your fixed cost burden before a single coffee is sold.',
              },
              {
                icon: '📉',
                title: 'Low tickets are dangerous',
                desc: 'A $5 average ticket leaves only ~$3 of margin per customer at 40% COGS. You need three times as many customers as a business with a $15 average ticket.',
              },
              {
                icon: '🎯',
                title: 'Know your target first',
                desc: 'Once you know your daily break-even number, you can evaluate any location with a clear question: can this street, at this time of year, actually deliver those customers?',
              },
              {
                icon: '⚠️',
                title: 'Buffer matters as much as break-even',
                desc: 'Breaking even at 95% of typical volume for your format leaves no room for slow weeks, illness, or seasonality. A good location gives you headroom above break-even.',
              },
            ].map(c => (
              <div key={c.title} className="bet-why-card">
                <div className="bet-why-icon">{c.icon}</div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </div>
            ))}
          </div>

          {/* Internal link strip */}
          <div className="bet-link-strip">
            <a href="/tools/business-viability-checker" className="bet-link-pill">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
              Business Viability Checker
            </a>
            <a href="/tools/rent-overpriced-checker" className="bet-link-pill">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
              Is This Rent Overpriced?
            </a>
            <a href="/onboarding" className="bet-link-pill">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
              Full location report
            </a>
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────────── */}
      <section className="bet-section--white">
        <div className="bet-shell">
          <p className="bet-section-eyebrow">Common questions</p>
          <h2 className="bet-section-h2">Frequently asked questions</h2>

          <div className="bet-faq">
            {[
              {
                q: 'What does "break-even" actually mean here?',
                a: 'Break-even is the point where your revenue exactly covers all fixed costs — rent, staff, and overheads. Below this number you are losing money every day. Above it, you are building profit. This tool gives you the minimum daily customer count to reach that line.',
              },
              {
                q: 'Why 26 trading days instead of 30?',
                a: 'Most small businesses in Australia trade 6 days a week, which gives approximately 26 trading days per month. If your business trades 7 days, your real break-even per day is slightly lower than shown — meaning the tool is conservative by design.',
              },
              {
                q: 'Are the staff cost estimates accurate?',
                a: 'The estimates are based on real Australian payroll benchmarks including superannuation and typical casual loadings. A solo operator working their own floor costs less than an employee — so the 1 staff option reflects a lower solo-operator rate. These are estimates, not a substitute for your actual payroll quote.',
              },
              {
                q: 'What is COGS and how do I estimate mine?',
                a: 'COGS (Cost of Goods Sold) is the direct cost of producing each item you sell. For a café, that is coffee beans, milk, and food ingredients — typically 30–35%. For a gym or beauty salon, it is much lower (10–20%) because the product is a service. Use the dropdown suggestions as a starting point.',
              },
              {
                q: 'My break-even looks very high. What should I do?',
                a: 'A high break-even number usually points to one of three levers: reduce rent (negotiate hard or find a different site), reduce staff costs (consider a smaller team or solo model), or increase your average ticket (premium menu, service bundling, memberships). The Locatalyze full report shows whether your target address can actually deliver the foot traffic you need.',
              },
              {
                q: 'How is this different from the Business Viability Checker?',
                a: 'The Viability Checker evaluates a suburb — demand signals, competition density, market fit — and gives a GO / CAUTION / NO signal. This Break-Even Calculator is about your own cost structure. Use both: first check if your numbers are viable, then check if your suburb can support them.',
              },
            ].map(faq => (
              <div key={faq.q} className="bet-faq-item">
                <h3>{faq.q}</h3>
                <p>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────────────────────── */}
      <section className="bet-cta">
        <div className="bet-shell">
          <div className="bet-cta-inner">
            <h2>Know your number. Now check if your suburb can hit it.</h2>
            <p>
              The Locatalyze report tells you the estimated daily foot traffic for your exact address,
              how many direct competitors are splitting that pool, and whether the location can realistically
              deliver your break-even number — before you sign.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
              <a href="/onboarding" className="bet-cta-btn">
                Analyse my location
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
              <a href="/tools" className="bet-cta-secondary">
                See all free tools →
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
