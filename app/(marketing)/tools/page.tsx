import type { Metadata } from 'next'
import type { ComponentType } from 'react'
import Link from 'next/link'
import { onboardingRef } from '@/lib/funnel-links'
import { ToolsHubCapture } from '@/components/analytics/FunnelCapture'

export const metadata: Metadata = {
  title: 'Free Break-Even Calculator, Rent Affordability Checker & Business Viability Tool — Australia | Locatalyze',
  description:
    'Three free tools for Australian operators: break-even foot-traffic calculator, rent-overpriced checker, and a business viability scoring tool. Use them to pressure-test a site before you sign a lease, then upgrade to a full GO / CAUTION / NO location report.',
  keywords: ['break even calculator café Australia', 'rent affordability calculator business', 'rent overpriced checker Australia', 'business viability calculator', 'foot traffic break even tool', 'commercial lease viability'],
  alternates: { canonical: 'https://locatalyze.com/tools' },
  openGraph: {
    title: 'Free Break-Even, Rent & Viability Tools for Australian Businesses — Locatalyze',
    description:
      'Pressure-test any Australian site before you sign a lease: break-even foot-traffic, rent affordability, and a viability score. Free, no signup.',
    type: 'website',
    url: 'https://locatalyze.com/tools',
  },
}

const TOOLS = [
  {
    id: 'viability',
    title: 'Business Viability Checker',
    short: 'GO / CAUTION / NO signal for your suburb and category — fast.',
    description:
      'Pressure-test demand fit, rough economics, and risk before you invest time in a lease.',
    href: '/tools/business-viability-checker',
    cta: 'Use tool',
  },
  {
    id: 'rent',
    title: 'Rent Overpriced Checker',
    short: 'See whether your quoted rent sits above typical benchmarks for the area.',
    description:
      'Compare what you have been quoted against suburb-level rent intelligence so you do not overpay.',
    href: '/tools/rent-overpriced-checker',
    cta: 'Use tool',
  },
  {
    id: 'breakeven',
    title: 'Break-even Foot Traffic Tool',
    short: 'Turn rent and margins into a daily customer target you can sanity-check.',
    description:
      'Calculate how many customers you need per day to cover costs — the number landlords never give you.',
    href: '/tools/break-even-foot-traffic',
    cta: 'Use tool',
  },
  {
    id: 'checklist',
    title: 'Before-You-Sign Checklist',
    short: '12 checks · 3 phases · printable. Enter your rent to get GO / CAUTION / NO numbers.',
    description:
      'At your desk, at the site, and at the lease table — the complete pre-signing checklist for café and restaurant operators. Fill in your rent to calculate your walkaway numbers.',
    href: '/tools/checklist',
    cta: 'Open checklist',
  },
  {
    id: 'lease',
    title: '3-Year vs 5-Year Lease Calculator',
    short: 'Total committed rent, fit-out payback, and Year 1 loss if the business closes.',
    description:
      'Compare 3, 4, and 5-year commercial lease terms by total rent obligation, break-even timeline, and maximum loss if trading assumptions prove wrong. The question landlords never answer for you.',
    href: '/tools/lease-term-calculator',
    cta: 'Compare lease terms',
  },
] as const

function IconViability(props: { className?: string }) {
  return (
    <svg className={props.className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 19V5M4 19h16M8 17v-4m4 4V9m4 8v-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconRent(props: { className?: string }) {
  return (
    <svg className={props.className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3v18M9 21h6M7 8l5-5 5 5M8 12h8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconBreakEven(props: { className?: string }) {
  return (
    <svg className={props.className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="15" cy="17" r="3" stroke="currentColor" strokeWidth="2" />
      <path d="M21 7a4 4 0 0 0-4-4M3 17a4 4 0 0 0 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function IconChecklist(props: { className?: string }) {
  return (
    <svg className={props.className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="2"/>
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 17h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function IconLease(props: { className?: string }) {
  return (
    <svg className={props.className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
      <path d="M8 2v4M16 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M8 14h4M8 17h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

const TOOL_ICONS: Record<
  (typeof TOOLS)[number]['id'],
  ComponentType<{ className?: string }>
> = {
  viability: IconViability,
  rent: IconRent,
  breakeven: IconBreakEven,
  checklist: IconChecklist,
  lease: IconLease,
}

const HUB_CSS = `
.lv-tools-hub {
  font-family: "DM Sans", "Geist", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
  background: #f8fafc !important;
  color: #0f172a !important;
  line-height: 1.5;
}
.lv-tools-hub * { box-sizing: border-box; }
.lv-tools-hub h1, .lv-tools-hub h2, .lv-tools-hub h3, .lv-tools-hub p, .lv-tools-hub a, .lv-tools-hub li, .lv-tools-hub span {
  font-family: inherit !important;
}
.lv-tools-hub .lth-shell {
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 24px;
}
.lv-tools-hub .lth-eyebrow {
  margin: 0 0 8px !important;
  font-size: 12px !important;
  font-weight: 700 !important;
  letter-spacing: 0.06em !important;
  text-transform: uppercase !important;
  color: #0f766e !important;
}
.lv-tools-hub .lth-hero {
  padding: 64px 0 48px;
  background: linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%) !important;
  border-bottom: 1px solid #e2e8f0;
}
.lv-tools-hub .lth-hero-grid {
  display: grid;
  gap: 32px;
  align-items: start;
}
@media (min-width: 900px) {
  .lv-tools-hub .lth-hero-grid { grid-template-columns: 1.15fr 0.85fr; gap: 48px; }
}
.lv-tools-hub .lth-hero h1 {
  margin: 0 0 16px !important;
  font-size: clamp(30px, 4.2vw, 48px) !important;
  font-weight: 800 !important;
  letter-spacing: -0.03em !important;
  line-height: 1.1 !important;
  color: #0f172a !important;
}
.lv-tools-hub .lth-lead {
  margin: 0 0 24px !important;
  font-size: 18px !important;
  line-height: 1.65 !important;
  color: #475569 !important;
  max-width: 640px;
}
.lv-tools-hub .lth-trust-list {
  margin: 0 0 28px !important;
  padding: 0 !important;
  list-style: none !important;
}
.lv-tools-hub .lth-trust-list li {
  position: relative;
  padding-left: 28px !important;
  margin-bottom: 12px !important;
  font-size: 15px !important;
  line-height: 1.55 !important;
  color: #334155 !important;
}
.lv-tools-hub .lth-trust-list li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 6px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #ccfbf1;
  box-shadow: inset 0 0 0 2px #0f766e;
}
.lv-tools-hub .lth-hero-ctas {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}
.lv-tools-hub .lth-btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0 24px !important;
  border-radius: 12px;
  background: linear-gradient(180deg, #0d9488 0%, #0f766e 100%) !important;
  color: #ffffff !important;
  font-size: 15px !important;
  font-weight: 700 !important;
  text-decoration: none !important;
  box-shadow: 0 4px 14px -4px rgba(15, 118, 110, 0.55), 0 2px 6px -2px rgba(15, 23, 42, 0.12);
  border: 1px solid rgba(255,255,255,0.12);
}
.lv-tools-hub .lth-btn-primary:hover {
  filter: brightness(1.05);
}
.lv-tools-hub .lth-btn-ghost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0 20px !important;
  border-radius: 12px;
  background: transparent !important;
  color: #0f172a !important;
  font-size: 14px !important;
  font-weight: 700 !important;
  text-decoration: none !important;
  border: 1px solid #cbd5e1;
}
.lv-tools-hub .lth-btn-ghost:hover {
  background: #f8fafc !important;
}
.lv-tools-hub .lth-hero-aside {
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  background: #ffffff !important;
  box-shadow: 0 12px 40px -28px rgba(15, 23, 42, 0.35);
}
.lv-tools-hub .lth-hero-aside-title {
  margin: 0 0 8px !important;
  font-size: 13px !important;
  font-weight: 800 !important;
  letter-spacing: 0.04em !important;
  text-transform: uppercase !important;
  color: #64748b !important;
}
.lv-tools-hub .lth-hero-aside p {
  margin: 0 !important;
  font-size: 14px !important;
  line-height: 1.65 !important;
  color: #475569 !important;
}
.lv-tools-hub .lth-section {
  padding: 56px 0;
}
.lv-tools-hub .lth-section--tight-top { padding-top: 40px; }
.lv-tools-hub .lth-section-head {
  margin-bottom: 32px;
  max-width: 720px;
}
.lv-tools-hub .lth-section-head h2 {
  margin: 0 0 8px !important;
  font-size: clamp(22px, 2.5vw, 30px) !important;
  font-weight: 800 !important;
  letter-spacing: -0.02em !important;
  color: #0f172a !important;
}
.lv-tools-hub .lth-section-head p {
  margin: 0 !important;
  font-size: 16px !important;
  line-height: 1.65 !important;
  color: #64748b !important;
}
.lv-tools-hub .lth-featured {
  border: 1px solid #cbd5e1;
  border-radius: 20px;
  padding: 32px;
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%) !important;
  box-shadow: 0 20px 50px -32px rgba(15, 23, 42, 0.45);
  display: grid;
  gap: 24px;
}
@media (min-width: 768px) {
  .lv-tools-hub .lth-featured { grid-template-columns: auto 1fr; gap: 32px; align-items: start; }
}
.lv-tools-hub .lth-featured-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 11px !important;
  font-weight: 800 !important;
  letter-spacing: 0.06em !important;
  text-transform: uppercase !important;
  color: #0f766e !important;
  background: #ecfdf5 !important;
  border: 1px solid #a7f3d0;
  border-radius: 999px;
  padding: 6px 12px;
  margin-bottom: 12px;
}
.lv-tools-hub .lth-featured-icon-wrap {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: linear-gradient(180deg, #f0fdfa 0%, #ccfbf1 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0f766e;
  flex-shrink: 0;
}
.lv-tools-hub .lth-featured-icon-wrap svg { width: 32px; height: 32px; }
.lv-tools-hub .lth-featured h3 {
  margin: 0 0 8px !important;
  font-size: clamp(22px, 2.2vw, 28px) !important;
  font-weight: 800 !important;
  letter-spacing: -0.02em !important;
}
.lv-tools-hub .lth-featured-lead {
  margin: 0 0 16px !important;
  font-size: 16px !important;
  line-height: 1.6 !important;
  color: #475569 !important;
}
.lv-tools-hub .lth-benefits {
  margin: 0 0 20px !important;
  padding: 0 !important;
  list-style: none !important;
}
.lv-tools-hub .lth-benefits li {
  padding: 8px 0 8px 0 !important;
  padding-left: 22px !important;
  position: relative;
  font-size: 14px !important;
  line-height: 1.55 !important;
  color: #334155 !important;
  border-bottom: 1px solid #f1f5f9;
}
.lv-tools-hub .lth-benefits li:last-child { border-bottom: none; }
.lv-tools-hub .lth-benefits li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #0f766e;
  font-weight: 800;
  font-size: 13px;
}
.lv-tools-hub .lth-btn-dark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0 22px !important;
  border-radius: 12px;
  background: #0f172a !important;
  color: #ffffff !important;
  font-size: 14px !important;
  font-weight: 700 !important;
  text-decoration: none !important;
}
.lv-tools-hub .lth-btn-dark:hover { background: #1e293b !important; }
.lv-tools-hub .lth-btn-outline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0 22px !important;
  border-radius: 12px;
  background: #ffffff !important;
  color: #0f172a !important;
  font-size: 14px !important;
  font-weight: 700 !important;
  text-decoration: none !important;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px -4px rgba(15, 23, 42, 0.12);
}
.lv-tools-hub .lth-btn-outline:hover {
  border-color: #cbd5e1;
  background: #f8fafc !important;
}
.lv-tools-hub .lth-tools-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}
@media (min-width: 640px) {
  .lv-tools-hub .lth-tools-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1000px) {
  .lv-tools-hub .lth-tools-grid { grid-template-columns: repeat(3, 1fr); }
}
.lv-tools-hub .lth-tool-card {
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  background: #ffffff !important;
  box-shadow: 0 8px 28px -20px rgba(15, 23, 42, 0.35);
  display: flex;
  flex-direction: column;
  min-height: 100%;
}
.lv-tools-hub .lth-tool-card-top {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  margin-bottom: 12px;
}
.lv-tools-hub .lth-tool-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0f172a;
  flex-shrink: 0;
}
.lv-tools-hub .lth-tool-icon svg { width: 22px; height: 22px; }
.lv-tools-hub .lth-tool-card h3 {
  margin: 0 0 6px !important;
  font-size: 17px !important;
  font-weight: 800 !important;
  letter-spacing: -0.01em !important;
  line-height: 1.25 !important;
}
.lv-tools-hub .lth-tool-card p {
  margin: 0 0 20px !important;
  flex: 1;
  font-size: 14px !important;
  line-height: 1.65 !important;
  color: #64748b !important;
}
.lv-tools-hub .lth-pill-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}
@media (min-width: 640px) {
  .lv-tools-hub .lth-pill-grid { grid-template-columns: repeat(2, 1fr); }
}
.lv-tools-hub .lth-pill {
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  padding: 16px 18px;
  background: #ffffff !important;
  box-shadow: 0 4px 16px -12px rgba(15, 23, 42, 0.25);
}
.lv-tools-hub .lth-pill strong {
  display: block;
  font-size: 14px !important;
  font-weight: 800 !important;
  color: #0f172a !important;
  margin-bottom: 4px !important;
}
.lv-tools-hub .lth-pill span {
  font-size: 13px !important;
  line-height: 1.55 !important;
  color: #64748b !important;
}
.lv-tools-hub .lth-steps {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  counter-reset: step;
}
@media (min-width: 768px) {
  .lv-tools-hub .lth-steps { grid-template-columns: repeat(3, 1fr); gap: 24px; }
}
.lv-tools-hub .lth-step {
  position: relative;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px 20px 24px 24px;
  background: #ffffff !important;
}
.lv-tools-hub .lth-step::before {
  counter-increment: step;
  content: counter(step);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: #0f766e;
  color: #fff;
  font-size: 14px !important;
  font-weight: 800 !important;
  margin-bottom: 14px;
}
.lv-tools-hub .lth-step h3 {
  margin: 0 0 6px !important;
  font-size: 16px !important;
  font-weight: 800 !important;
}
.lv-tools-hub .lth-step p {
  margin: 0 !important;
  font-size: 14px !important;
  line-height: 1.6 !important;
  color: #64748b !important;
}
.lv-tools-hub .lth-links-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}
@media (min-width: 640px) {
  .lv-tools-hub .lth-links-grid { grid-template-columns: repeat(3, 1fr); }
}
.lv-tools-hub .lth-link-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  padding: 20px;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  background: #ffffff !important;
  text-decoration: none !important;
  color: inherit !important;
  min-height: 48px;
  box-shadow: 0 4px 18px -14px rgba(15, 23, 42, 0.3);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.lv-tools-hub .lth-link-card:hover {
  border-color: #99f6e4;
  box-shadow: 0 8px 28px -18px rgba(15, 118, 110, 0.35);
}
.lv-tools-hub .lth-link-card span:first-child {
  font-size: 11px !important;
  font-weight: 800 !important;
  letter-spacing: 0.05em !important;
  text-transform: uppercase !important;
  color: #0f766e !important;
}
.lv-tools-hub .lth-link-card span:last-child {
  font-size: 15px !important;
  font-weight: 700 !important;
  color: #0f172a !important;
}
.lv-tools-hub .lth-cta-band {
  margin: 8px 0 64px;
  border-radius: 20px;
  padding: 40px 28px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f766e 120%) !important;
  color: #f8fafc !important;
  text-align: center;
  box-shadow: 0 24px 50px -28px rgba(15, 23, 42, 0.65);
}
.lv-tools-hub .lth-cta-band h2 {
  margin: 0 0 12px !important;
  font-size: clamp(22px, 3vw, 30px) !important;
  font-weight: 800 !important;
  letter-spacing: -0.02em !important;
  color: #ffffff !important;
}
.lv-tools-hub .lth-cta-band .lth-sub {
  margin: 0 auto 20px !important;
  max-width: 560px;
  font-size: 16px !important;
  line-height: 1.65 !important;
  color: #cbd5e1 !important;
}
.lv-tools-hub .lth-cta-benefits {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px 16px;
  margin-bottom: 24px !important;
  padding: 0 !important;
  list-style: none !important;
}
.lv-tools-hub .lth-cta-benefits li {
  font-size: 13px !important;
  color: #e2e8f0 !important;
}
.lv-tools-hub .lth-cta-benefits li::before {
  content: "· ";
  color: #5eead4;
  font-weight: 800;
}
.lv-tools-hub .lth-cta-band .lth-price-hint {
  margin: 0 0 20px !important;
  font-size: 14px !important;
  font-weight: 600 !important;
  color: #99f6e4 !important;
}
.lv-tools-hub .lth-cta-band .lth-btn-primary {
  box-shadow: 0 8px 24px -8px rgba(0,0,0,0.45);
}
@media (max-width: 768px) {
  .lv-tools-hub .lth-shell { padding: 0 16px; }
  .lv-tools-hub .lth-hero { padding: 48px 0 40px; }
  .lv-tools-hub .lth-section { padding: 40px 0; }
  .lv-tools-hub .lth-featured { padding: 24px; }
  .lv-tools-hub .lth-cta-band { padding: 32px 20px; margin-bottom: 48px; }
}
`

const viabilityTool = TOOLS[0]

export default function ToolsHubPage() {
  return (
    <main className="lv-tools-hub">
      <ToolsHubCapture />
      <style dangerouslySetInnerHTML={{ __html: HUB_CSS }} />

      <section className="lth-hero" aria-labelledby="tools-hero-heading">
        <div className="lth-shell">
          <div className="lth-hero-grid">
            <div>
              <p className="lth-eyebrow">Location intelligence · Australia</p>
              <h1 id="tools-hero-heading">Free Location Intelligence Tools for Smarter Business Decisions</h1>
              <p className="lth-lead">
                Validate your business idea, rent, and location before you sign a lease.
              </p>
              <ul className="lth-trust-list">
                <li>Grounded in suburb-level benchmarks and demand signals — not generic blog formulas.</li>
                <li>Same analytical lens we use in paid Locatalyze reports; free tools are the on-ramp.</li>
                <li>Built for operators who need a clear signal before lawyers and fit-out spend lock in.</li>
              </ul>
              <div className="lth-hero-ctas">
                <Link href={onboardingRef('tools_hub_hero')} className="lth-btn-primary">
                  Run a free analysis
                </Link>
                <a href="#all-tools" className="lth-btn-ghost">
                  Browse tools
                </a>
              </div>
            </div>
            <aside className="lth-hero-aside" aria-label="Why use these tools">
              <p className="lth-hero-aside-title">Why these exist</p>
              <p>
                Most lease mistakes are made in a hurry. These tools give you a fast, structured read on
                viability, rent, and foot traffic — so you only pay for a full site report when the
                opportunity is worth it.
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section className="lth-section lth-section--tight-top" aria-labelledby="featured-tool-heading">
        <div className="lth-shell">
          <div className="lth-section-head">
            <h2 id="featured-tool-heading">Featured tool</h2>
            <p>Start here for a single verdict-style read on whether your suburb and category make sense.</p>
          </div>

          <div className="lth-featured">
            <div className="lth-featured-icon-wrap" aria-hidden>
              <IconViability />
            </div>
            <div>
              <div className="lth-featured-badge">Most popular · Highest intent</div>
              <h3>{viabilityTool.title}</h3>
              <p className="lth-featured-lead">{viabilityTool.description}</p>
              <ul className="lth-benefits">
                <li>Fast GO / CAUTION / NO style signal for your chosen suburb and business type.</li>
                <li>Surfaces demand and risk context so you are not guessing from a listing alone.</li>
                <li>Natural step before a full address-level report with competitors and financials.</li>
              </ul>
              <Link href={viabilityTool.href} className="lth-btn-dark">
                {viabilityTool.cta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="all-tools" className="lth-section" aria-labelledby="all-tools-heading">
        <div className="lth-shell">
          <div className="lth-section-head">
            <h2 id="all-tools-heading">Tools hub</h2>
            <p>Each tool answers one high-stakes question. Use them in any order — they complement a full report.</p>
          </div>
          <div className="lth-tools-grid">
            {TOOLS.map((tool) => {
              const Icon = TOOL_ICONS[tool.id]
              return (
                <article key={tool.href} className="lth-tool-card">
                  <div className="lth-tool-card-top">
                    <div className="lth-tool-icon" aria-hidden>
                      <Icon />
                    </div>
                    <h3>{tool.title}</h3>
                  </div>
                  <p>{tool.short}</p>
                  <Link href={tool.href} className="lth-btn-outline">
                    {tool.cta}
                  </Link>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="lth-section" style={{ background: '#f1f5f9', margin: 0 }} aria-labelledby="what-tools-do-heading">
        <div className="lth-shell">
          <div className="lth-section-head">
            <h2 id="what-tools-do-heading">What these tools do</h2>
            <p>
              These are not basic calculators with made-up defaults. They are structured checks that mirror how
              we think about location risk — suburb intelligence, rent benchmarks, demand signals, and risk framing.
            </p>
          </div>
          <div className="lth-pill-grid">
            <div className="lth-pill">
              <strong>Suburb intelligence</strong>
              <span>Context for the area you are targeting — not a single national average.</span>
            </div>
            <div className="lth-pill">
              <strong>Rent benchmarks</strong>
              <span>Pressure-test whether a quote is in-range before you negotiate or walk away.</span>
            </div>
            <div className="lth-pill">
              <strong>Demand signals</strong>
              <span>A clearer read on whether the trade area can support your concept.</span>
            </div>
            <div className="lth-pill">
              <strong>Risk analysis</strong>
              <span>Explicit downside framing so optimism does not replace diligence.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="lth-section" aria-labelledby="how-it-works-heading">
        <div className="lth-shell">
          <div className="lth-section-head">
            <h2 id="how-it-works-heading">How it works</h2>
            <p>Three steps from curiosity to a decision you can defend to a landlord, partner, or bank.</p>
          </div>
          <div className="lth-steps">
            <div className="lth-step">
              <h3>Enter suburb + business type</h3>
              <p>Tell us where you are looking and what you want to run. No noise — just inputs that change the outcome.</p>
            </div>
            <div className="lth-step">
              <h3>Get instant viability insights</h3>
              <p>See benchmarks, signals, and trade-offs in minutes. Enough to know whether the site deserves deeper work.</p>
            </div>
            <div className="lth-step">
              <h3>Upgrade for a full report</h3>
              <p>
                When you have a real address, run a full Locatalyze analysis — competitors, map, and financial model —{' '}
                <Link href={onboardingRef('tools_hub_step3')} style={{ color: '#0f766e', fontWeight: 700 }}>
                  start free
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="lth-section" style={{ paddingTop: 0 }} aria-labelledby="explore-suburbs-heading">
        <div className="lth-shell">
          <div className="lth-section-head">
            <h2 id="explore-suburbs-heading">Explore suburb analysis</h2>
            <p>See how we write about real suburbs and categories — then use the tools above for your own search.</p>
          </div>
          <div className="lth-links-grid">
            <Link href="/cafe/perth/subiaco" className="lth-link-card">
              <span>Perth · Café</span>
              <span>Subiaco breakdown →</span>
            </Link>
            <Link href="/restaurant/perth/fremantle" className="lth-link-card">
              <span>Perth · Restaurant</span>
              <span>Fremantle breakdown →</span>
            </Link>
            <Link href="/cafe/sydney/newtown" className="lth-link-card">
              <span>Sydney · Café</span>
              <span>Newtown breakdown →</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="lth-section" style={{ paddingTop: 0 }}>
        <div className="lth-shell">
          <div className="lth-cta-band">
            <h2>Ready to make a confident location decision?</h2>
            <p className="lth-sub">
              Free tools help you filter bad ideas early. A full Locatalyze report is for when you are serious about a
              specific site — competitors, catchment, and numbers in one place.
            </p>
            <ul className="lth-cta-benefits">
              <li>Competitor and map context</li>
              <li>Financial model & scenarios</li>
              <li>Verdict you can take to stakeholders</li>
            </ul>
            <p className="lth-price-hint">Full reports from $29 · pay per report, no subscription required</p>
            <Link href={onboardingRef('tools_hub_footer')} className="lth-btn-primary">
              Run a free analysis
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
