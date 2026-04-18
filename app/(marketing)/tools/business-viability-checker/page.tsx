// app/(marketing)/tools/business-viability-checker/page.tsx
// Fully scoped under .lv-tool-container — zero Tailwind dependency for visuals.
// globals.css has unscoped element rules outside @layer that beat Tailwind
// layered utilities. All layout/colour/type here uses !important in scoped CSS.

import type { Metadata } from 'next'
import Link from 'next/link'
import ViabilityChecker from './ViabilityChecker'

export const metadata: Metadata = {
  title: 'Business Viability Checker — Will Your Café, Restaurant or Shop Work in This Suburb?',
  description:
    'Free Australian business viability checker. Enter your business type, suburb, rent and budget and get an instant GO / CAUTION / NO verdict with estimated monthly revenue, profit and break-even — before you sign a lease.',
  alternates: { canonical: 'https://www.locatalyze.com/tools/business-viability-checker' },
  openGraph: {
    title: 'Business Viability Checker — Locatalyze',
    description:
      'Free tool. Will your café, restaurant, gym or retail shop actually work in that suburb? Get a 10-second verdict with revenue, profit and break-even estimates.',
    type: 'website',
    url: 'https://www.locatalyze.com/tools/business-viability-checker',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Business Viability Checker — Locatalyze',
    description: 'Free viability preview for Australian retail, food & service locations.',
  },
}

const FAQ: { q: string; a: string }[] = [
  {
    q: 'How accurate is the free viability checker?',
    a: "The free checker is a suburb-level preview. It uses Locatalyze's demand scores, rent ranges, parking signals and suburb fit data — the same base layer that powers our paid reports. It's designed to tell you whether a format works in a suburb at all. It can't see your exact address, your specific competitors or live foot traffic — that's what the full address-level report unlocks.",
  },
  {
    q: 'What does the GO / CAUTION / NO verdict actually mean?',
    a: 'GO (score 72+): the inputs clear the viability line comfortably — demand, rent-to-revenue ratio, suburb fit and capital are all on your side. CAUTION (52–71): it can work, but only if specific conditions hold — we list them. NO (under 52): at least one of demand, rent, budget or suburb fit is under the line and needs fixing before a lease is signed.',
  },
  {
    q: 'Where do the revenue and profit numbers come from?',
    a: "Revenue is modelled as customers/day × average ticket × 30, scaled by the suburb's demand score for your business type. Costs combine staffing (calibrated to business type and size), rent you entered, COGS as a % of revenue, and a utilities/insurance overhead. We show worst, base and best cases, not a single false-precision number.",
  },
  {
    q: 'Is this financial advice?',
    a: "No. It's a decision-support preview. Numbers are indicative, based on suburb demand models and typical operating ratios for each business type. Before signing a lease or spending capital, run the full address-level report and review it with your accountant.",
  },
  {
    q: 'Which suburbs and cities are covered?',
    a: "Perth, Sydney, Melbourne, Brisbane, Adelaide, Gold Coast, Canberra and Newcastle — with the highest-demand inner suburbs in each. If the suburb you want isn't in the list, the full Locatalyze report can still analyse any address in Australia.",
  },
  {
    q: 'Why do I need the paid report if this is free?',
    a: "The free tool uses suburb averages. But most leases fail or succeed on variables an average can't see: the specific competitors within 500m, hour-by-hour foot traffic on your block, the exact demographic mix of your 500m catchment, and whether the rent you've been quoted is above or below real comparable listings. The paid report resolves all of that for your exact address.",
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Scoped CSS — everything under .lv-tool-container wins over globals.css dark theme.
// Rule: !important on colour/bg/font; NO !important on padding (would break
// ViabilityChecker's inline paddingLeft:28 on dollar-prefix inputs).
// ─────────────────────────────────────────────────────────────────────────────
const LV_CSS = `
/* ── RESET & FONT ─────────────────────────────────────────────────────────── */
.lv-tool-container {
  font-family: "DM Sans","Geist","Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif !important;
  color: #0F172A !important;
  background: #ffffff !important;
  -webkit-font-smoothing: antialiased;
}
.lv-tool-container * { box-sizing: border-box; }
.lv-tool-container h1,.lv-tool-container h2,.lv-tool-container h3,.lv-tool-container h4,
.lv-tool-container p,.lv-tool-container span,.lv-tool-container div,.lv-tool-container li,
.lv-tool-container a,.lv-tool-container summary,.lv-tool-container details {
  font-family: inherit !important;
  text-transform: none !important;
  letter-spacing: normal !important;
}
.lv-tool-container label {
  font-family: inherit !important;
  color: inherit !important;
  text-transform: none !important;
  letter-spacing: normal !important;
  margin: 0 !important;
}
.lv-tool-container button { font-family: inherit !important; text-transform: none !important; letter-spacing: normal !important; }

/* ── INPUT / SELECT — beat globals dark theme ─────────────────────────────── */
.lv-tool-container input[type="text"],.lv-tool-container input[type="number"],
.lv-tool-container input[type="email"],.lv-tool-container input[type="search"],
.lv-tool-container select,.lv-tool-container textarea {
  background: #ffffff !important;
  background-color: #ffffff !important;
  color: #0F172A !important;
  border: 1.5px solid #E2E8F0 !important;
  border-radius: 10px !important;
  font-family: inherit !important;
  font-size: 14px !important;
  line-height: 1.5 !important;
  -webkit-appearance: none !important;
  appearance: none !important;
  box-shadow: none !important;
  /* NO padding !important — ViabilityChecker inline paddingLeft:28 must win */
}
.lv-tool-container select { background-image: none !important; cursor: pointer !important; }
.lv-tool-container input:focus,.lv-tool-container select:focus,.lv-tool-container textarea:focus {
  border-color: #2563EB !important;
  box-shadow: 0 0 0 3px rgba(37,99,235,0.12) !important;
  outline: none !important;
}
.lv-tool-container input::placeholder,.lv-tool-container textarea::placeholder { color: #94A3B8 !important; }

/* ── LAYOUT SHELL ─────────────────────────────────────────────────────────── */
.lv-inner { max-width: 1152px; margin: 0 auto; padding: 0 24px; }

/* ── HERO ─────────────────────────────────────────────────────────────────── */
.lv-hero {
  background: linear-gradient(180deg,#ffffff 0%,#F8FAFC 100%) !important;
  border-bottom: 1px solid #E2E8F0;
  padding: 80px 0 56px;
}
.lv-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #EFF6FF !important;
  border: 1px solid #BFDBFE;
  border-radius: 999px;
  padding: 4px 14px;
  font-size: 11px;
  font-weight: 700;
  color: #1D4ED8 !important;
  letter-spacing: 0.07em;
  text-transform: uppercase !important;
  margin-bottom: 24px;
  width: fit-content;
}
.lv-badge-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #3B82F6 !important;
  display: inline-block;
  flex-shrink: 0;
}
.lv-h1 {
  font-size: clamp(34px, 5vw, 54px) !important;
  font-weight: 800 !important;
  line-height: 1.06 !important;
  letter-spacing: -0.025em !important;
  color: #0F172A !important;
  margin: 0 0 20px !important;
  max-width: 820px;
}
.lv-h1 em { font-style: normal !important; color: #2563EB !important; }
.lv-lead {
  font-size: clamp(15px, 2vw, 17px) !important;
  color: #475569 !important;
  line-height: 1.65 !important;
  max-width: 620px;
  margin: 0 0 24px !important;
}
.lv-trust { display: flex; flex-wrap: wrap; gap: 8px 20px; }
.lv-trust-item {
  font-size: 13px !important;
  color: #64748B !important;
  display: flex;
  align-items: center;
  gap: 6px;
}
.lv-trust-check { color: #059669 !important; font-weight: 700 !important; flex-shrink: 0; }

/* ── TOOL SECTION ─────────────────────────────────────────────────────────── */
.lv-tool-section {
  background: #F1F5F9 !important;
  border-bottom: 1px solid #E2E8F0;
  padding: 56px 0 64px;
}

/* ── VC GRID (form | result) — owned here, referenced by ViabilityChecker ── */
.vc-grid { display: grid; grid-template-columns: 1fr; gap: 24px; align-items: start; }
@media (min-width: 1024px) {
  .vc-grid { grid-template-columns: 400px 1fr; }
  .vc-form-card { position: sticky; top: 24px; }
}
@keyframes vc-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.vc-spin { animation: vc-spin 0.7s linear infinite; }

/* ── CONTENT SECTIONS ─────────────────────────────────────────────────────── */
.lv-section { padding: 72px 0; }
.lv-section--white { background: #ffffff !important; border-bottom: 1px solid #E2E8F0; }
.lv-section--gray  { background: #F8FAFC !important; border-top: 1px solid #E2E8F0; border-bottom: 1px solid #E2E8F0; }

.lv-overline {
  font-size: 11px !important;
  font-weight: 700 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.12em !important;
  color: #2563EB !important;
  margin-bottom: 12px;
}
.lv-h2 {
  font-size: clamp(26px, 4vw, 38px) !important;
  font-weight: 800 !important;
  line-height: 1.12 !important;
  letter-spacing: -0.02em !important;
  color: #0F172A !important;
  margin: 0 0 8px !important;
}
.lv-body-lg { font-size: 16px !important; color: #475569 !important; line-height: 1.7 !important; margin: 0 0 16px !important; }

/* ── STEP CARDS ───────────────────────────────────────────────────────────── */
.lv-steps { display: grid; grid-template-columns: 1fr; gap: 16px; margin-top: 40px; }
@media (min-width: 768px) { .lv-steps { grid-template-columns: 1fr 1fr; } }

.lv-step {
  background: #ffffff !important;
  border: 1px solid #E2E8F0;
  border-radius: 16px;
  padding: 24px 24px 26px;
  box-shadow: 0 1px 3px rgba(15,23,42,0.05);
}
.lv-step-num {
  width: 36px; height: 36px;
  border-radius: 10px;
  background: #EFF6FF !important;
  color: #1D4ED8 !important;
  font-size: 14px !important;
  font-weight: 800 !important;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
  flex-shrink: 0;
}
.lv-step h3 { font-size: 16px !important; font-weight: 700 !important; color: #0F172A !important; margin: 0 0 8px !important; }
.lv-step p  { font-size: 14px !important; color: #64748B !important; line-height: 1.65 !important; margin: 0 !important; }

/* ── 2-COL LAYOUT ─────────────────────────────────────────────────────────── */
.lv-2col { display: grid; grid-template-columns: 1fr; gap: 40px; align-items: start; }
@media (min-width: 1024px) { .lv-2col { grid-template-columns: 1fr 1fr; } }

.lv-check-card {
  background: #ffffff !important;
  border: 1px solid #E2E8F0;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 1px 3px rgba(15,23,42,0.05);
}
.lv-check-card h3 { font-size: 17px !important; font-weight: 700 !important; color: #0F172A !important; margin: 0 0 14px !important; }
.lv-check-divider { margin-top: 20px; }
.lv-check-row {
  display: flex; gap: 10px;
  font-size: 14px !important; color: #374151 !important;
  line-height: 1.55 !important;
  margin-bottom: 10px;
  align-items: flex-start;
}
.lv-ck-yes { color: #059669 !important; margin-top: 1px; flex-shrink: 0; font-weight: 700; }
.lv-ck-no  { color: #94A3B8 !important; margin-top: 1px; flex-shrink: 0; }

/* ── FAQ ──────────────────────────────────────────────────────────────────── */
.lv-faq-wrap { max-width: 720px; margin: 0 auto; }
.lv-faq details {
  border: 1px solid #E2E8F0;
  border-radius: 14px;
  padding: 20px 22px;
  margin-bottom: 10px;
  transition: border-color 0.15s, background 0.15s;
  background: #ffffff !important;
}
.lv-faq details[open] { border-color: #BFDBFE !important; background: rgba(239,246,255,0.5) !important; }
.lv-faq summary {
  list-style: none;
  cursor: pointer;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}
.lv-faq summary::-webkit-details-marker { display: none; }
.lv-faq-q { font-size: 15px !important; font-weight: 600 !important; color: #0F172A !important; line-height: 1.45 !important; }
.lv-faq-icon {
  font-size: 20px !important;
  color: #94A3B8 !important;
  line-height: 1;
  flex-shrink: 0;
  margin-top: 1px;
  transition: transform 0.2s;
  display: inline-block;
}
details[open] .lv-faq-icon { transform: rotate(45deg); }
.lv-faq p { margin: 14px 0 0 !important; font-size: 14px !important; color: #64748B !important; line-height: 1.7 !important; }

/* ── FINAL CTA ────────────────────────────────────────────────────────────── */
.lv-cta-section { background: #ffffff !important; padding: 80px 0 100px; }
.lv-cta-box { text-align: center; max-width: 660px; margin: 0 auto; }
.lv-cta-h2 {
  font-size: clamp(28px, 4vw, 44px) !important;
  font-weight: 800 !important;
  letter-spacing: -0.022em !important;
  color: #0F172A !important;
  line-height: 1.1 !important;
  margin: 0 0 16px !important;
}
.lv-cta-h2 em { font-style: normal !important; color: #2563EB !important; }
.lv-cta-p { font-size: 16px !important; color: #64748B !important; line-height: 1.65 !important; margin: 0 0 28px !important; }

.lv-btn-row { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; }
.lv-btn-primary {
  background: #0F172A !important;
  color: #ffffff !important;
  border-radius: 12px;
  padding: 13px 26px;
  font-size: 14px !important;
  font-weight: 700 !important;
  text-decoration: none !important;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  cursor: pointer;
  transition: background 0.15s;
}
.lv-btn-primary:hover { background: #1E293B !important; }
.lv-btn-secondary {
  background: #ffffff !important;
  color: #0F172A !important;
  border: 1.5px solid #E2E8F0 !important;
  border-radius: 12px;
  padding: 13px 26px;
  font-size: 14px !important;
  font-weight: 600 !important;
  text-decoration: none !important;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: background 0.15s;
}
.lv-btn-secondary:hover { background: #F8FAFC !important; }

/* ── MOBILE ───────────────────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .lv-hero         { padding: 52px 0 40px; }
  .lv-tool-section { padding: 40px 0; }
  .lv-section      { padding: 52px 0; }
  .lv-inner        { padding: 0 16px; }
  .lv-btn-primary,
  .lv-btn-secondary { width: 100%; justify-content: center; }
}
`

export default function Page() {
  return (
    <main className="lv-tool-container">
      <style dangerouslySetInnerHTML={{ __html: LV_CSS }} />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="lv-hero">
        <div className="lv-inner">
          <div className="lv-badge">
            <span className="lv-badge-dot" />
            Free tool · No signup
          </div>

          <h1 className="lv-h1">
            Will your business <em>actually work</em> in that suburb?
          </h1>

          <p className="lv-lead">
            Check the viability of a café, restaurant, gym, takeaway or retail shop in any major
            Australian suburb in 10 seconds. Get a GO / CAUTION / NO verdict, estimated monthly
            revenue, net profit, break-even, and the specific conditions that have to hold for it
            to work — before you sign a lease.
          </p>

          <div className="lv-trust">
            {[
              'Covers Perth, Sydney, Melbourne, Brisbane, Adelaide, Gold Coast',
              'Revenue + profit estimates',
              'Break-even timeline',
            ].map((t) => (
              <span key={t} className="lv-trust-item">
                <span className="lv-trust-check">✓</span>
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOOL ──────────────────────────────────────────────────────────── */}
      <section className="lv-tool-section">
        <div className="lv-inner">
          <ViabilityChecker />
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section className="lv-section lv-section--white">
        <div className="lv-inner">
          <div className="lv-overline">How it works</div>
          <h2 className="lv-h2">Four variables decide whether a location works.</h2>

          <div className="lv-steps">
            <LVStep n={1} title="Demand fit for your format">
              Every suburb has a different demand profile. Fitzroy over-indexes for cafés and indie
              retail; Chatswood over-indexes for restaurants and service retail; Subiaco for
              health-conscious formats. We score the suburb against your specific business type.
            </LVStep>
            <LVStep n={2} title="Rent-to-revenue ratio">
              Rent above 10% of revenue is the #1 silent killer of hospitality and retail. We
              compare the rent you entered against the suburb median so you can see whether your
              lease is already eating your margin before day one.
            </LVStep>
            <LVStep n={3} title="Capital adequacy">
              Under-capitalised openings are the second most common failure driver. Each business
              type has a minimum setup threshold — if your budget is below it, we flag it and show
              you the failure mode before you commit.
            </LVStep>
            <LVStep n={4} title="Suburb-type match">
              Some suburbs are great for cafés and terrible for gyms. Some are excellent for
              restaurants but poor for takeaway. We use on-the-ground suburb profiles (demographics,
              vibe, anchors, parking, foot traffic) to score the match.
            </LVStep>
          </div>
        </div>
      </section>

      {/* ── WHY THIS MATTERS ──────────────────────────────────────────────── */}
      <section className="lv-section lv-section--gray">
        <div className="lv-inner">
          <div className="lv-2col">
            <div>
              <div className="lv-overline">Why this matters</div>
              <h2 className="lv-h2">Most failed locations were predictable.</h2>
              <p className="lv-body-lg">
                Operators don't fail because they're bad operators — most fail because the location
                maths never worked in the first place. Rent was 3% too high, demand was 15% below
                what they assumed, a direct competitor opened 150 metres away, or the catchment had
                the wrong demographics for their format.
              </p>
              <p className="lv-body-lg">
                This checker exists to catch those signals before you sign a 5-year lease. The free
                suburb-level preview gets you 60% of the way there. The full Locatalyze report
                resolves the rest at your exact address.
              </p>
            </div>

            <div className="lv-check-card">
              <h3>The checker is good at:</h3>
              <LVCheckRow good>Telling you whether the <strong>format fits the suburb</strong> at all.</LVCheckRow>
              <LVCheckRow good>Showing whether your <strong>rent is sane</strong> vs suburb benchmarks.</LVCheckRow>
              <LVCheckRow good>Flagging <strong>under-capitalisation</strong> before you spend money.</LVCheckRow>
              <LVCheckRow good>Giving you a <strong>defensible first estimate</strong> of revenue and profit.</LVCheckRow>

              <h3 className="lv-check-divider">What only the paid report sees:</h3>
              <LVCheckRow>The <strong>specific competitors</strong> within 500m of your door.</LVCheckRow>
              <LVCheckRow><strong>Hour-by-hour foot traffic</strong> for your exact block.</LVCheckRow>
              <LVCheckRow>The <strong>demographic mix</strong> of your 500m catchment.</LVCheckRow>
              <LVCheckRow>Whether the rent you've been quoted is <strong>above comparable listings</strong>.</LVCheckRow>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="lv-section lv-section--white">
        <div className="lv-inner">
          <div className="lv-faq-wrap">
            <h2 className="lv-h2" style={{ marginBottom: 32 }}>
              Questions operators ask before they trust the number
            </h2>
            <div className="lv-faq">
              {FAQ.map((f, i) => (
                <details key={i}>
                  <summary>
                    <span className="lv-faq-q">{f.q}</span>
                    <span className="lv-faq-icon">+</span>
                  </summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
      <section className="lv-cta-section">
        <div className="lv-inner">
          <div className="lv-cta-box">
            <h2 className="lv-cta-h2">
              The suburb looks good. Now check the <em>exact address</em>.
            </h2>
            <p className="lv-cta-p">
              Run a full Locatalyze report with live competitor data, foot traffic, demographics
              and a 12-month financial model. Delivered in under 5 minutes.
            </p>
            <div className="lv-btn-row">
              <Link href="/onboarding" className="lv-btn-primary">
                Run full analysis — from $49
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <Link href="/sample-report" className="lv-btn-secondary">
                See a sample report
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── JSON-LD ───────────────────────────────────────────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'WebApplication',
                name: 'Locatalyze Business Viability Checker',
                url: 'https://www.locatalyze.com/tools/business-viability-checker',
                applicationCategory: 'BusinessApplication',
                operatingSystem: 'Any',
                offers: { '@type': 'Offer', price: '0', priceCurrency: 'AUD' },
                description:
                  'Free tool that predicts whether a café, restaurant, retail shop, gym, or takeaway will work in a given Australian suburb.',
              },
              {
                '@type': 'FAQPage',
                mainEntity: FAQ.map((f) => ({
                  '@type': 'Question',
                  name: f.q,
                  acceptedAnswer: { '@type': 'Answer', text: f.a },
                })),
              },
            ],
          }),
        }}
      />
    </main>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function LVStep({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="lv-step">
      <div className="lv-step-num">{n}</div>
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  )
}

function LVCheckRow({ good, children }: { good?: boolean; children: React.ReactNode }) {
  return (
    <div className="lv-check-row">
      <span className={good ? 'lv-ck-yes' : 'lv-ck-no'}>{good ? '✓' : '◯'}</span>
      <span>{children}</span>
    </div>
  )
}
