import type { Metadata } from 'next'
import BreakEvenCalculator from './BreakEvenCalculator'
import { onboardingRef, toolsHubRef } from '@/lib/funnel-links'

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

/* inputs & selects */
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

/* grid */
.be-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  align-items: start;
}
@media (min-width: 1024px) {
  .be-grid { grid-template-columns: 400px 1fr; }
  .be-form-sticky { position: sticky; top: 24px; }
}

/* spinner */
@keyframes be-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
.be-spin { animation: be-spin 0.7s linear infinite; }

/* shell */
.bet-shell {
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 24px;
}
@media (max-width: 768px) { .bet-shell { padding: 0 16px; } }

/* ── HERO ── */
.bet-hero {
  padding: 80px 0 48px;
  background: #ffffff !important;
  border-bottom: 1px solid #e2e8f0;
  position: relative;
  overflow: hidden;
}
.bet-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 70% 60% at 60% -10%, rgba(37,99,235,0.06) 0%, transparent 70%),
              radial-gradient(ellipse 50% 40% at 100% 80%, rgba(5,150,105,0.04) 0%, transparent 60%);
  pointer-events: none;
}
@media (max-width: 768px) { .bet-hero { padding: 52px 0 32px; } }

.bet-badge {
  display: inline-flex !important;
  align-items: center !important;
  gap: 6px !important;
  font-size: 11px !important;
  font-weight: 700 !important;
  letter-spacing: 0.08em !important;
  text-transform: uppercase !important;
  color: #1d4ed8 !important;
  border: 1px solid #bfdbfe !important;
  background: #eff6ff !important;
  border-radius: 999px !important;
  padding: 5px 12px !important;
  margin-bottom: 20px !important;
}
.bet-h1 {
  font-size: clamp(30px, 5vw, 56px) !important;
  font-weight: 800 !important;
  letter-spacing: -0.035em !important;
  line-height: 1.06 !important;
  margin-bottom: 20px !important;
  color: #0f172a !important;
}
.bet-h1 em {
  font-style: normal !important;
  color: #2563eb !important;
}
.bet-hero-sub {
  font-size: 17px !important;
  line-height: 1.75 !important;
  color: #64748b !important;
  max-width: 580px !important;
  margin-bottom: 32px !important;
}
.bet-trust-row {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: center;
  padding-top: 4px;
}
.bet-trust-item {
  display: flex !important;
  align-items: center !important;
  gap: 7px !important;
  font-size: 13px !important;
  font-weight: 500 !important;
  color: #64748b !important;
}
.bet-trust-divider {
  width: 1px;
  height: 16px;
  background: #e2e8f0;
}
.bet-hero-stat {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 12px 16px;
  margin-top: 36px;
  max-width: fit-content;
}
.bet-hero-stat-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #059669;
  flex-shrink: 0;
  box-shadow: 0 0 0 3px rgba(5,150,105,0.15);
}
.bet-hero-stat-text {
  font-size: 13px !important;
  font-weight: 500 !important;
  color: #475569 !important;
}
.bet-hero-stat-text strong {
  color: #0f172a !important;
  font-weight: 700 !important;
}

/* ── tool section ── */
.bet-tool-section {
  padding: 52px 0;
}
@media (max-width: 768px) { .bet-tool-section { padding: 32px 0; } }

/* ── content sections ── */
.bet-section {
  padding: 72px 0;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc !important;
}
.bet-section--white {
  padding: 72px 0;
  border-top: 1px solid #e2e8f0;
  background: #ffffff !important;
}
@media (max-width: 768px) {
  .bet-section, .bet-section--white { padding: 48px 0; }
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
  font-size: clamp(22px, 3.5vw, 38px) !important;
  font-weight: 800 !important;
  letter-spacing: -0.028em !important;
  line-height: 1.12 !important;
  margin-bottom: 14px !important;
  color: #0f172a !important;
}
.bet-section-lead {
  font-size: 16px !important;
  line-height: 1.75 !important;
  color: #64748b !important;
  max-width: 640px !important;
}

/* ── steps ── */
.bet-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-top: 40px;
}
.bet-step {
  background: #ffffff !important;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(15,23,42,0.04), 0 4px 16px rgba(15,23,42,0.03);
  position: relative;
}
.bet-step-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: #0f172a !important;
  font-size: 13px !important;
  font-weight: 800 !important;
  color: #ffffff !important;
  margin-bottom: 16px;
  letter-spacing: -0.01em;
}
.bet-step h3 {
  font-size: 15px !important;
  font-weight: 700 !important;
  color: #0f172a !important;
  margin-bottom: 8px !important;
  letter-spacing: -0.015em !important;
  line-height: 1.3 !important;
}
.bet-step p {
  font-size: 13px !important;
  color: #64748b !important;
  line-height: 1.7 !important;
}

/* ── formula ── */
.bet-formula {
  margin-top: 36px;
  background: #0f172a !important;
  border-radius: 18px;
  padding: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0;
  border: 1px solid rgba(255,255,255,0.06);
}
.bet-formula-block {
  text-align: center;
  padding: 16px 24px;
  flex: 1;
  min-width: 160px;
}
.bet-formula-label {
  font-size: 10px !important;
  font-weight: 700 !important;
  letter-spacing: 0.1em !important;
  text-transform: uppercase !important;
  color: rgba(255,255,255,0.35) !important;
  margin-bottom: 8px !important;
}
.bet-formula-val {
  font-size: 15px !important;
  font-weight: 700 !important;
  color: #ffffff !important;
  line-height: 1.3 !important;
}
.bet-formula-val span {
  display: block;
  font-size: 11px !important;
  font-weight: 500 !important;
  color: rgba(255,255,255,0.4) !important;
  margin-top: 4px !important;
}
.bet-formula-op {
  font-size: 22px !important;
  font-weight: 300 !important;
  color: rgba(255,255,255,0.2) !important;
  padding: 0 8px;
  flex-shrink: 0;
}
.bet-formula-divider {
  width: 1px;
  height: 48px;
  background: rgba(255,255,255,0.08);
  flex-shrink: 0;
}

/* ── why cards ── */
.bet-why-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-top: 40px;
}
.bet-why-card {
  background: #ffffff !important;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(15,23,42,0.04);
  transition: box-shadow 0.2s, border-color 0.2s;
}
.bet-why-card:hover {
  box-shadow: 0 4px 20px rgba(15,23,42,0.08) !important;
  border-color: #cbd5e1 !important;
}
.bet-why-icon {
  width: 40px;
  height: 40px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  flex-shrink: 0;
}
.bet-why-card h3 {
  font-size: 15px !important;
  font-weight: 700 !important;
  color: #0f172a !important;
  margin-bottom: 8px !important;
  letter-spacing: -0.015em !important;
}
.bet-why-card p {
  font-size: 13px !important;
  color: #64748b !important;
  line-height: 1.7 !important;
}

/* ── link strip ── */
.bet-link-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 36px;
}
.bet-link-pill {
  display: inline-flex !important;
  align-items: center !important;
  gap: 6px !important;
  border: 1px solid #e2e8f0 !important;
  background: #ffffff !important;
  border-radius: 999px !important;
  padding: 8px 16px !important;
  font-size: 13px !important;
  font-weight: 600 !important;
  color: #0f172a !important;
  text-decoration: none !important;
  box-shadow: 0 1px 2px rgba(15,23,42,0.05) !important;
  transition: all 0.15s !important;
}
.bet-link-pill:hover {
  box-shadow: 0 4px 14px rgba(15,23,42,0.10) !important;
  border-color: #94a3b8 !important;
  color: #0f172a !important;
}

/* ── FAQ ── */
.bet-faq {
  display: grid;
  gap: 10px;
  margin-top: 40px;
  max-width: 740px;
}
.bet-faq-item {
  background: #f8fafc !important;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 22px 24px;
}
.bet-faq-item h3 {
  font-size: 14px !important;
  font-weight: 700 !important;
  color: #0f172a !important;
  margin-bottom: 8px !important;
  letter-spacing: -0.01em !important;
}
.bet-faq-item p {
  font-size: 14px !important;
  color: #64748b !important;
  line-height: 1.75 !important;
}

/* ── final CTA ── */
.bet-cta {
  padding: 96px 0;
  background: #0f172a !important;
  border-top: 1px solid #1e293b;
  position: relative;
  overflow: hidden;
}
.bet-cta::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 60% 80% at 80% 50%, rgba(37,99,235,0.12) 0%, transparent 60%);
  pointer-events: none;
}
@media (max-width: 768px) { .bet-cta { padding: 64px 0; } }
.bet-cta-inner { max-width: 640px; position: relative; }
.bet-cta h2 {
  font-size: clamp(26px, 4vw, 42px) !important;
  font-weight: 800 !important;
  letter-spacing: -0.03em !important;
  color: #ffffff !important;
  margin-bottom: 16px !important;
  line-height: 1.1 !important;
}
.bet-cta p {
  font-size: 16px !important;
  color: rgba(255,255,255,0.5) !important;
  line-height: 1.75 !important;
  margin-bottom: 32px !important;
}
.bet-cta-btn {
  display: inline-flex !important;
  align-items: center !important;
  gap: 8px !important;
  background: #ffffff !important;
  color: #0f172a !important;
  border-radius: 12px !important;
  padding: 13px 24px !important;
  font-size: 14px !important;
  font-weight: 700 !important;
  text-decoration: none !important;
  letter-spacing: -0.01em !important;
  transition: background 0.15s !important;
}
.bet-cta-btn:hover { background: #f1f5f9 !important; }
.bet-cta-secondary {
  display: inline-flex !important;
  align-items: center !important;
  gap: 5px !important;
  color: rgba(255,255,255,0.35) !important;
  font-size: 13px !important;
  font-weight: 500 !important;
  text-decoration: none !important;
  margin-left: 20px !important;
  transition: color 0.15s !important;
}
.bet-cta-secondary:hover { color: rgba(255,255,255,0.6) !important; }
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

// Inline SVG icons — no emoji, no external deps
const Icon = {
  barChart: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  ),
  trendDown: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/>
    </svg>
  ),
  target: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  shield: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  arrowRight: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  ),
  check: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  tool: (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/>
    </svg>
  ),
}

const WHY_CARDS = [
  {
    icon: Icon.barChart,
    iconBg: '#eff6ff',
    iconColor: '#2563eb',
    title: 'Rent is just the start',
    desc: 'Staff costs often exceed rent. Two full-time staff at a café cost $9,500/month — nearly doubling your fixed burden before a single coffee is sold.',
  },
  {
    icon: Icon.trendDown,
    iconBg: '#fef2f2',
    iconColor: '#dc2626',
    title: 'Low tickets are dangerous',
    desc: 'A $5 average ticket leaves only ~$3 of margin at 40% COGS. You need three times as many customers as a business running a $15 average ticket.',
  },
  {
    icon: Icon.target,
    iconBg: '#f0fdf4',
    iconColor: '#059669',
    title: 'Know your target first',
    desc: 'Once you have your daily break-even number, every location decision becomes a clear question: can this street actually deliver that customer volume?',
  },
  {
    icon: Icon.shield,
    iconBg: '#fffbeb',
    iconColor: '#d97706',
    title: 'Buffer matters as much as break-even',
    desc: 'Breaking even at 95% of typical volume leaves no room for slow weeks or seasonality. A good location gives you headroom above break-even.',
  },
]

export default function BreakEvenPage() {
  return (
    <main className="bet-page">
      <style dangerouslySetInnerHTML={{ __html: PAGE_CSS }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }}
      />

      {/* ── HERO ── */}
      <section className="bet-hero">
        <div className="bet-shell">
          <span className="bet-badge">
            {Icon.tool}
            Break-even intelligence
          </span>

          <h1 className="bet-h1">
            How many customers do<br />
            you need to <em>survive</em>?
          </h1>

          <p className="bet-hero-sub">
            Enter your rent, staff setup, and average ticket. Get your exact daily
            break-even number — with a risk rating — in seconds. Free, no account needed.
          </p>

          <div className="bet-trust-row">
            {['Real AU cost benchmarks', '5 business types', 'Risk-rated output', '100% free'].map((t, i) => (
              <span key={t} style={{ display: 'flex', alignItems: 'center', gap: i === 0 ? 0 : 24 }}>
                {i > 0 && <span className="bet-trust-divider" />}
                <span className="bet-trust-item">
                  {Icon.check}
                  {t}
                </span>
              </span>
            ))}
          </div>

          <div className="bet-hero-stat">
            <span className="bet-hero-stat-dot" />
            <span className="bet-hero-stat-text">
              A café paying <strong>$5,000/month rent</strong> with 2 staff typically needs{' '}
              <strong>47+ customers/day</strong> just to break even
            </span>
          </div>
        </div>
      </section>

      {/* ── TOOL ── */}
      <section className="bet-tool-section">
        <div className="bet-shell">
          <BreakEvenCalculator />
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="bet-section--white">
        <div className="bet-shell">
          <p className="bet-section-eyebrow">How it works</p>
          <h2 className="bet-section-h2">The maths behind your survival number</h2>
          <p className="bet-section-lead">
            The calculator uses real Australian cost benchmarks for staffing and overheads, then works
            backwards from your fixed costs to find the minimum daily customers you need to cover them.
          </p>

          <div className="bet-steps">
            {[
              {
                n: '1',
                title: 'Enter your fixed costs',
                desc: 'Monthly rent is entered directly. Staff costs come from real payroll benchmarks for your setup. Overheads cover utilities, insurance, and miscellaneous — calibrated per business type.',
              },
              {
                n: '2',
                title: 'Calculate contribution margin',
                desc: 'Every sale contributes a slice toward your fixed costs. Contribution margin is your average ticket minus the COGS percentage — the actual dollars each customer puts toward survival.',
              },
              {
                n: '3',
                title: 'Find your break-even',
                desc: "Divide total monthly fixed costs by contribution margin per customer. Divide again by 26 trading days. That's the exact daily number you need through the door.",
              },
              {
                n: '4',
                title: 'Risk-rate the result',
                desc: 'We compare your break-even against real foot traffic benchmarks. Under 30/day is achievable anywhere. Over 100/day requires a high-traffic inner-city location or a fundamentally different model.',
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
              <div className="bet-formula-val">
                Rent + Staff + Overheads
                <span>All recurring costs combined</span>
              </div>
            </div>
            <div className="bet-formula-op">÷</div>
            <div className="bet-formula-block">
              <div className="bet-formula-label">Contribution margin</div>
              <div className="bet-formula-val">
                Ticket × (1 − COGS%)
                <span>Revenue kept per customer</span>
              </div>
            </div>
            <div className="bet-formula-op">÷</div>
            <div className="bet-formula-block">
              <div className="bet-formula-label">Trading days</div>
              <div className="bet-formula-val">
                26 days
                <span>Typical 6-day trading month</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY THIS MATTERS ── */}
      <section className="bet-section">
        <div className="bet-shell">
          <p className="bet-section-eyebrow">Why this matters</p>
          <h2 className="bet-section-h2">Most operators sign leases without knowing their number</h2>
          <p className="bet-section-lead">
            Rent looks affordable until you run the numbers. A $5,000/month lease can require 90+ customers
            per day once staff and overheads are added. This tool shows you that number before you sign.
          </p>

          <div className="bet-why-grid">
            {WHY_CARDS.map(c => (
              <div key={c.title} className="bet-why-card">
                <div className="bet-why-icon" style={{ background: c.iconBg, color: c.iconColor }}>
                  {c.icon}
                </div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </div>
            ))}
          </div>

          <div className="bet-link-strip">
            {[
              { href: '/tools/business-viability-checker?ref=cross_breakeven', label: 'Business Viability Checker' },
              { href: '/tools/rent-overpriced-checker?ref=cross_breakeven', label: 'Is This Rent Overpriced?' },
              { href: onboardingRef('tool_breakeven_strip'), label: 'Full location report' },
            ].map(l => (
              <a key={l.href} href={l.href} className="bet-link-pill">
                {Icon.arrowRight}
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bet-section--white">
        <div className="bet-shell">
          <p className="bet-section-eyebrow">Common questions</p>
          <h2 className="bet-section-h2">Frequently asked questions</h2>

          <div className="bet-faq">
            {[
              {
                q: 'What does "break-even" actually mean here?',
                a: 'Break-even is the point where your revenue exactly covers all fixed costs — rent, staff, and overheads. Below this number you lose money every day. Above it, you build profit. This tool gives you the minimum daily customer count to reach that line.',
              },
              {
                q: 'Why 26 trading days instead of 30?',
                a: 'Most small businesses in Australia trade 6 days a week, giving approximately 26 trading days per month. If you trade 7 days, your real break-even per day is slightly lower — so the tool is conservative by design.',
              },
              {
                q: 'Are the staff cost estimates accurate?',
                a: 'The estimates are based on real Australian payroll benchmarks including superannuation and typical casual loadings. A solo operator working their own floor costs less than an employee, so the 1 staff option reflects a lower solo-operator rate. Treat these as estimates, not a substitute for your actual payroll quote.',
              },
              {
                q: 'What is COGS and how do I estimate mine?',
                a: 'COGS (Cost of Goods Sold) is the direct cost of producing each item you sell. For a café, that is coffee beans, milk, and food — typically 30–35%. For a gym or salon it is much lower (10–20%) because the product is a service. Use the dropdown suggestions as a starting point.',
              },
              {
                q: 'My break-even looks very high. What should I do?',
                a: 'A high break-even usually points to three levers: reduce rent (negotiate or find a different site), reduce staff costs (smaller team or solo model), or increase your average ticket (premium offering, bundled services, memberships). The Locatalyze full report shows whether your target address can actually deliver the foot traffic you need.',
              },
              {
                q: 'How is this different from the Business Viability Checker?',
                a: 'The Viability Checker evaluates a suburb — demand signals, competition density, market fit — and returns a GO / CAUTION / NO signal. This tool is about your own cost structure. Use both: first check if your numbers stack up, then check if your suburb can support them.',
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

      {/* ── FINAL CTA ── */}
      <section className="bet-cta">
        <div className="bet-shell">
          <div className="bet-cta-inner">
            <h2>Know your number.<br />Now check if your suburb can hit it.</h2>
            <p>
              The Locatalyze report gives you estimated daily foot traffic for your exact address,
              competitor density sharing that pool, and whether the location can realistically
              deliver your survival number — before you commit to a lease.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
              <a href={onboardingRef('tool_breakeven_footer')} className="bet-cta-btn">
                Analyse my location
                {Icon.arrowRight}
              </a>
              <a href={toolsHubRef('tool_breakeven_footer')} className="bet-cta-secondary">
                See all free tools
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
