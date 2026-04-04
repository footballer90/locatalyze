import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
 title: 'How It Works — Data Methodology',
 description: 'See exactly how Locatalyze scores locations. Six verified data layers: competitor mapping, ABS demographics, rent benchmarks, financial modelling and AI analysis.',
}

const S = {
 brand: '#0F766E', brandLight: '#14B8A6', brandFaded: '#F0FDFA', brandBorder: '#99F6E4',
 n50: '#FAFAF9', n100: '#F5F5F4', n200: '#E7E5E4', n400: '#A8A29E',
 n500: '#78716C', n700: '#44403C', n800: '#292524', n900: '#1C1917',
 white: '#FFFFFF',
 emerald: '#059669', emeraldBg: '#ECFDF5', emeraldBdr: '#A7F3D0',
 amber: '#D97706', amberBg: '#FFFBEB', amberBdr: '#FDE68A',
 blue: '#2563EB', blueBg: '#EFF6FF', blueBdr: '#BFDBFE',
}

function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
 return (
    <div style={{ display: 'flex', gap: 16, marginBottom: 28 }}>
   <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: 10, background: S.brandFaded, border: `1.5px solid ${S.brandBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, color: S.brand }}>
    {n}
      </div>
      <div>
        <p style={{ fontSize: 15, fontWeight: 700, color: S.n800, marginBottom: 6 }}>{title}</p>
        <div style={{ fontSize: 14, color: S.n500, lineHeight: 1.75 }}>{children}</div>
      </div>
    </div>
  )
}

function DataCard({ icon, title, desc, badge }: { icon: string; title: string; desc: string; badge?: string }) {
  return (
    <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 14, padding: '20px 18px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
    <span style={{ fontSize: 26 }}>{icon}</span>
        {badge && (
          <span style={{ fontSize: 10, fontWeight: 700, color: S.brand, background: S.brandFaded, border: `1px solid ${S.brandBorder}`, borderRadius: 100, padding: '2px 8px' }}>{badge}</span>
    )}
      </div>
      <p style={{ fontSize: 14, fontWeight: 700, color: S.n800, marginBottom: 6 }}>{title}</p>
      <p style={{ fontSize: 13, color: S.n500, lineHeight: 1.7 }}>{desc}</p>
    </div>
  )
}

function ScoreRow({ label, weight, desc, color }: { label: string; weight: string; desc: string; color: string }) {
  return (
    <div style={{ display: 'flex', gap: 16, padding: '16px 0', borderBottom: `1px solid ${S.n100}`, alignItems: 'flex-start' }}>
   <div style={{ flexShrink: 0, width: 48, height: 48, borderRadius: 12, background: S.n50, border: `1px solid ${S.n200}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
    <p style={{ fontSize: 13, fontWeight: 900, color, lineHeight: 1 }}>{weight}</p>
        <p style={{ fontSize: 9, color: S.n400, fontWeight: 600 }}>weight</p>
      </div>
      <div>
        <p style={{ fontSize: 14, fontWeight: 700, color: S.n800, marginBottom: 4 }}>{label}</p>
        <p style={{ fontSize: 13, color: S.n500, lineHeight: 1.65 }}>{desc}</p>
      </div>
    </div>
  )
}

export default function MethodologyPage() {
  return (
    <div style={{ minHeight: '100vh', background: S.white, fontFamily: "'DM Sans','Helvetica Neue',Arial,sans-serif", color: S.n900 }}>
   <style>{`*{box-sizing:border-box;margin:0;padding:0;} a{text-decoration:none;color:inherit;} @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');`}</style>

   {/* Nav */}
      <nav style={{ background: S.white, borderBottom: `1px solid ${S.n100}`, padding: '0 24px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
     <img src="/logo.svg" alt="Locatalyze" style={{ height: 26, width: 'auto', display: 'block' }} />
    </Link>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
     <Link href="/" style={{ fontSize: 13, color: S.n500, fontWeight: 500, padding: '6px 12px' }}>← Back to home</Link>
     <Link href="/onboarding" style={{ fontSize: 13, background: S.brand, color: S.white, borderRadius: 9, padding: '8px 16px', fontWeight: 700 }}>
      Try free →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: `linear-gradient(180deg,${S.brandFaded} 0%,${S.white} 100%)`, padding: '60px 24px 48px', textAlign: 'center' }}>
    <div style={{ maxWidth: 620, margin: '0 auto' }}>
     <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: S.white, border: `1px solid ${S.brandBorder}`, borderRadius: 100, padding: '5px 14px', fontSize: 12, fontWeight: 700, color: S.brand, marginBottom: 20 }}>
      🔬 Data & Methodology
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 900, color: S.n900, letterSpacing: '-0.04em', lineHeight: 1.15, marginBottom: 16 }}>
      How Locatalyze analyses<br />your location
          </h1>
          <p style={{ fontSize: 16, color: S.n500, lineHeight: 1.75 }}>
            Every Locatalyze report is built on real data — not guesses. Here's exactly what we analyse, where the data comes from, and how we calculate your score.
     </p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px 80px' }}>

    {/* ── How it works ── */}
        <section style={{ marginBottom: 64 }}>
          <div style={{ marginBottom: 32 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>The process</p>
      <h2 style={{ fontSize: 28, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em' }}>What happens when you submit an address</h2>
     </div>
          <Step n="01" title="Address + coordinate pinning">
      You drop a pin on an interactive map to confirm your exact location. We capture the precise latitude/longitude coordinates — not just a suburb name — so all subsequent analysis is anchored to your specific street and block, not a generic suburb average.
          </Step>
          <Step n="02" title="Competitor mapping">
      We query Google Maps for all businesses matching your category within a 500m radius of your pinned coordinates. Each competitor is assessed by their rating and review volume to produce a competition intensity score (LOW / MEDIUM / HIGH) and a Threat Score that accounts for quality, not just count.
          </Step>
          <Step n="03" title="Demographic analysis">
      We pull ABS-aligned demographic estimates for your suburb — median household income, age distribution, population density, and a consumer affordability index. These are cross-referenced against your business type to assess market fit.
          </Step>
          <Step n="04" title="Rent benchmarking">
      Your submitted monthly rent is compared against commercial rental benchmarks for the suburb and business category, sourced from publicly available property listings. We calculate rent as a percentage of projected revenue and rate it EXCELLENT / GOOD / MARGINAL / POOR.
          </Step>
          <Step n="05" title="Model calibration (optional but impactful)">
      If you fill in the "Calibrate your model" section, the financial engine replaces generic benchmarks with your actual inputs. Average order value overrides the industry benchmark for your category — changing revenue projections and break-even thresholds. Operating hours apply a demand multiplier (e.g. breakfast/lunch = 65% of an all-day operator's baseline; all-day = 135%). Location access type applies a footfall multiplier (transport hub = +10%; side street = −25%; arcade = −30%). Each field you provide raises the Model Accuracy score displayed on the report.
          </Step>
          <Step n="06" title="Deterministic financial model">
      A rules-based engine (not AI) builds the P&L from your calibrated inputs: monthly revenue, COGS, staffing, rent, fixed overheads, gross margin, net profit, contribution-margin break-even customers per day, and investment payback period. All formulas are documented below. If any critical input is missing, the relevant financial section is suppressed and a data gap is shown — no fake numbers.
          </Step>
          <Step n="07" title="AI narrative analysis & verdict">
      The quantitative scores from Steps 1–6 are passed to an AI model to generate the written analysis: SWOT, market demand narrative, competitive positioning, and 3-year projection. The GO / CAUTION / NO verdict is determined by the weighted location score (not by AI) — the AI explains the verdict, it does not decide it.
          </Step>
        </section>

        {/* ── Data sources ── */}
        <section style={{ marginBottom: 64 }}>
          <div style={{ marginBottom: 32 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>Data sources</p>
      <h2 style={{ fontSize: 28, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em' }}>Where the data comes from</h2>
     </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
      <DataCard icon="" title="Google Maps Platform" badge="Live API" desc="Competitor locations, ratings, review counts, and price levels queried live for your specific coordinates within a 500m radius." />
      <DataCard icon="" title="ABS Census Estimates" badge="2021–2026" desc="Population demographics, median income, household size and age distribution aligned to Australian Bureau of Statistics data." />
      <DataCard icon="" title="Commercial Rent Database" badge="Benchmarks" desc="Suburb-level commercial rent benchmarks built from publicly available property listings. Your submitted rent is validated against these." />
      <DataCard icon="" title="Industry Benchmarks" badge="By category" desc="Daily customers baseline, average ticket size, COGS %, gross margin, and staffing cost ratios segmented by business type. Used as the fallback when you do not provide your own figures." />
      <DataCard icon="" title="Deterministic Compute Engine" badge="Rules-based" desc="A rules-based financial model (not AI) that builds the P&L from your calibrated inputs. Formulas are deterministic and documented — no black box outputs." />
      <DataCard icon="" title="AI Narrative Layer" badge="AI Analysis" desc="AI generates the written analysis only — SWOT, market narrative, risk scenarios, and 3-year projection. Financial figures come from the compute engine, not AI." />
     </div>
        </section>

        {/* ── Scoring methodology ── */}
        <section style={{ marginBottom: 64 }}>
          <div style={{ marginBottom: 32 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>Scoring system</p>
      <h2 style={{ fontSize: 28, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 12 }}>How your Location Score is calculated</h2>
      <p style={{ fontSize: 15, color: S.n500, lineHeight: 1.75 }}>
              The Location Score (0–100) is a weighted composite of four dimensions. Each dimension is scored independently then combined into a final score that determines your GO / CAUTION / NO verdict. Every report also shows a separate Data Completeness % and Model Confidence label so you can see how much of the analysis relied on your own inputs versus fallback benchmarks.
            </p>
          </div>

          <div style={{ background: S.n50, border: `1px solid ${S.n200}`, borderRadius: 16, padding: '20px 24px', marginBottom: 24 }}>
      <ScoreRow label="Rent Affordability" weight="30%" color={S.brand} desc="Rent as a percentage of projected revenue. Below 12% = excellent. Above 25% = poor. This is the single biggest predictor of long-term viability." />
      <ScoreRow label="Profitability" weight="25%" color={S.emerald} desc="Net profit margin after all costs. Calculated from your revenue estimate minus rent, COGS, labour and fixed costs." />
      <ScoreRow label="Competition" weight="25%" color={S.amber} desc="Competitor density within 500m, weighted by their ratings and review volume. Fewer strong competitors = higher score." />
      <ScoreRow label="Area Demographics" weight="20%" color={S.blue} desc="Population density, median income and demographic fit for your business category. High-income, high-density areas score higher for premium categories." />
     </div>

          {/* Verdict thresholds */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
      {[
              { verdict: 'GO',   range: '70–100', desc: 'Strong fundamentals. Proceed with confidence and conduct final due diligence.', bg: S.emeraldBg, border: S.emeraldBdr, color: S.emerald },
       { verdict: 'CAUTION', range: '45–69', desc: 'Mixed signals. Viable with the right execution, but specific risks need mitigation.', bg: S.amberBg, border: S.amberBdr, color: S.amber },
       { verdict: 'NO',   range: '0–44',  desc: 'Significant concerns identified. The risk profile does not support proceeding at this time.', bg: '#FEF2F2', border: '#FECACA', color: '#DC2626' },
      ].map(v => (
              <div key={v.verdict} style={{ background: v.bg, border: `1px solid ${v.border}`, borderRadius: 14, padding: '18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
         <span style={{ fontSize: 16, fontWeight: 900, color: v.color }}>{v.verdict}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: v.color, opacity: 0.7 }}>{v.range} / 100</span>
                </div>
                <p style={{ fontSize: 13, color: v.color, lineHeight: 1.65, opacity: 0.85 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Financial model ── */}
        <section style={{ marginBottom: 64 }}>
          <div style={{ marginBottom: 32 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>Financial model</p>
      <h2 style={{ fontSize: 28, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 12 }}>How we estimate revenue and profit</h2>
      <p style={{ fontSize: 15, color: S.n500, lineHeight: 1.75 }}>
              Our financial model combines your inputs with industry benchmark data to build a realistic P&L. Here's the logic behind each number.
      </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {[
              { label: 'Benchmark Revenue (base)', formula: 'daily_customers_base × hours_multiplier × access_multiplier × avg_ticket × 30', note: 'The baseline revenue from which all scenarios are built. hours_multiplier ranges from 0.45× (weekends only) to 1.35× (all-day). access_multiplier ranges from 0.70× (arcade) to 1.10× (transport hub). avg_ticket uses your entered value if provided, otherwise the category benchmark.' },
       { label: 'COGS (Cost of Goods)', formula: '28–40% of revenue', note: 'Benchmark varies by category: cafes ~30%, restaurants ~32%, retail ~40%. Based on industry average gross margins for Australian operators.' },
       { label: 'Labour Costs', formula: 'Staffing tiers by business type and size', note: 'Calculated from typical staffing requirements: cafe (2 FT + 2 casual) = $25,000–35,000/mo; restaurant = $35,000–55,000/mo; retail = $15,000–25,000/mo. Does not include owner salary.' },
       { label: 'Fixed Costs (for break-even)', formula: 'Monthly rent + Estimated staffing costs', note: 'Only fixed costs are used in the break-even calculation — not COGS, which is variable. This is the contribution margin break-even formula, which avoids double-counting variable costs.' },
       { label: 'Break-even Customers / Day', formula: 'Fixed costs ÷ (avg_ticket × (gross_margin% − other_variable_costs%) × 30)', note: 'The minimum daily customers needed to cover rent and staffing only. Compared against your projected daily demand. If projected > break-even, the location is viable at current inputs.' },
       { label: 'Payback Period', formula: 'Setup cost ÷ Monthly net profit', note: 'Months to recover your initial investment. Only shown when monthly net profit is positive. Under 12 months is excellent. Over 24 months carries meaningful risk.' },
      ].map((row, i, arr) => (
              <div key={row.label} style={{ padding: '18px 0', borderBottom: i < arr.length - 1 ? `1px solid ${S.n100}` : 'none' }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: S.n800, marginBottom: 4 }}>{row.label}</p>
                <p style={{ fontSize: 13, fontFamily: 'monospace', background: S.n50, border: `1px solid ${S.n200}`, borderRadius: 8, padding: '6px 12px', color: S.brand, fontWeight: 600, marginBottom: 6, display: 'inline-block' }}>{row.formula}</p>
        <p style={{ fontSize: 13, color: S.n500, lineHeight: 1.65 }}>{row.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Accuracy disclaimer ── */}
        <section style={{ marginBottom: 64 }}>
          <div style={{ background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 16, padding: '24px 28px' }}>
      <p style={{ fontSize: 14, fontWeight: 800, color: S.amber, marginBottom: 12 }}> Important: Use as a decision-support tool</p>
            <p style={{ fontSize: 14, color: '#92400E', lineHeight: 1.75, marginBottom: 12 }}>
       Locatalyze reports are designed to help you make better-informed decisions — not to replace professional due diligence. Our revenue and profit estimates are based on statistical benchmarks and AI modelling, not guaranteed outcomes.
            </p>
            <p style={{ fontSize: 14, color: '#92400E', lineHeight: 1.75, marginBottom: 12 }}>
       Before signing a lease or committing capital, we recommend:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
       {[
                'Conducting your own foot traffic counts at different times and days',
        'Speaking to existing business owners in the area',
        'Getting independent advice from a commercial property lawyer',
        'Reviewing actual trading figures from comparable businesses',
        'Consulting a business accountant to validate the financial model',
       ].map(r => (
                <div key={r} style={{ display: 'flex', gap: 10, fontSize: 13, color: '#92400E' }}>
         <span style={{ flexShrink: 0 }}>→</span>
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ background: `linear-gradient(135deg,${S.brand} 0%,#0891B2 100%)`, borderRadius: 20, padding: '36px', textAlign: 'center' }}>
     <h2 style={{ fontSize: 26, fontWeight: 900, color: S.white, letterSpacing: '-0.03em', marginBottom: 10 }}>
      Ready to analyse your location?
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 24 }}>
      Get a full data-driven report in 60–120 seconds. Free for your first 3 locations.
          </p>
          <Link href="/onboarding" style={{ display: 'inline-flex', background: S.white, color: S.brand, borderRadius: 12, padding: '13px 28px', fontWeight: 800, fontSize: 15 }}>
      Analyse my location free →
          </Link>
        </section>

      </div>

      {/* Footer */}
      <footer style={{ background: S.n900, padding: '28px 24px' }}>
    <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
     <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <img src="/logo.svg" alt="Locatalyze" style={{ height: 26, width: 'auto', display: 'block' }} />
     </Link>
          <p style={{ fontSize: 12, color: S.n500 }}>© 2026 Locatalyze. Built for Australian business owners.</p>
          <div style={{ display: 'flex', gap: 20 }}>
      <Link href="/analyse" style={{ fontSize: 12, color: S.n500 }}>Location guides</Link>
      <Link href="/onboarding" style={{ fontSize: 12, color: S.brand, fontWeight: 700 }}>Try free →</Link>
     </div>
        </div>
      </footer>
    </div>
  )
}