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
          <Step n="01" title="Address geocoding">
      We convert your address into precise latitude/longitude coordinates using the Google Maps Geocoding API. This gives us the exact location to anchor all subsequent analysis.
          </Step>
          <Step n="02" title="Competitor mapping">
      We query Google Places API for all businesses matching your category within a 500m radius. We count them, assess their ratings and review volume, and calculate a competition intensity score from LOW to HIGH.
          </Step>
          <Step n="03" title="Demographic analysis">
      We pull ABS-aligned demographic estimates for the suburb — median household income, age distribution, population density, and consumer affordability index. These are cross-referenced against your business type to assess market fit.
          </Step>
          <Step n="04" title="Rent benchmarking">
      Your submitted monthly rent is compared against estimated commercial rental benchmarks for the suburb and business category. We calculate rent as a percentage of projected revenue and rate it EXCELLENT / GOOD / MARGINAL / POOR.
          </Step>
          <Step n="05" title="Financial modelling">
      Using your inputs (rent, setup budget, average order value) combined with industry benchmarks for your business type, we build a full P&L model: monthly revenue estimate, cost structure, gross and net profit, break-even customers per day, and payback period on your setup investment.
          </Step>
          <Step n="06" title="AI analysis & verdict">
      All data is passed to our AI model which synthesises the quantitative scores with qualitative analysis — generating the SWOT, recommendation text, risk scenarios and 3-year projections. The final GO / CAUTION / NO verdict is determined by the weighted location score.
          </Step>
        </section>

        {/* ── Data sources ── */}
        <section style={{ marginBottom: 64 }}>
          <div style={{ marginBottom: 32 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>Data sources</p>
      <h2 style={{ fontSize: 28, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em' }}>Where the data comes from</h2>
     </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
      <DataCard icon="" title="Google Maps Platform" badge="Live API" desc="Real-time competitor locations, business types, ratings, review counts and operating hours within your analysis radius." />
      <DataCard icon="" title="ABS Census Estimates" badge="2021–2026" desc="Population demographics, median income, household size and age distribution aligned to Australian Bureau of Statistics data." />
      <DataCard icon="" title="Commercial Rent Database" badge="Benchmarks" desc="Suburb-level commercial rent benchmarks calibrated from publicly available commercial property listings and market reports." />
      <DataCard icon="" title="Industry Benchmarks" badge="By category" desc="Revenue per square metre, labour cost ratios, COGS percentages and average ticket size benchmarks segmented by business type." />
      <DataCard icon="" title="AI Financial Model" badge="AI Analysis" desc="Our AI synthesises all inputs to produce the narrative analysis, risk scenarios, SWOT assessment and 3-year projection model." />
      <DataCard icon="" title="Market Demand Signals" badge="Composite" desc="Category search trend proxies, foot traffic signals and business category growth data used to assess demand in your area." />
     </div>
        </section>

        {/* ── Scoring methodology ── */}
        <section style={{ marginBottom: 64 }}>
          <div style={{ marginBottom: 32 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>Scoring system</p>
      <h2 style={{ fontSize: 28, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em', marginBottom: 12 }}>How your Location Score is calculated</h2>
      <p style={{ fontSize: 15, color: S.n500, lineHeight: 1.75 }}>
              The Location Score (0–100) is a weighted composite of five dimensions. Each dimension is scored independently then combined into a final score that determines your GO / CAUTION / NO verdict.
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
              { label: 'Monthly Revenue', formula: 'Estimated daily customers × Average order value × Operating days', note: 'Daily customer estimate is derived from foot traffic signals, competitor count and demographic density for your category and location.' },
       { label: 'COGS (Cost of Goods)', formula: '28–35% of revenue', note: 'Benchmark varies by category: cafes ~30%, restaurants ~32%, retail ~40%. Based on industry average gross margins.' },
       { label: 'Labour Costs', formula: '25–35% of revenue', note: 'Estimated from minimum award rates, typical staffing ratios per business type, and operating hours. Does not include owner salary.' },
       { label: 'Fixed Costs', formula: 'Rent + utilities + insurance + POS/software', note: 'Your submitted rent plus estimated utilities (~$800–1,500/mo), insurance (~$200–400/mo) and operational software.' },
       { label: 'Break-even Customers', formula: 'Total monthly fixed costs ÷ (Average order value × contribution margin)', note: 'The minimum daily customers needed to cover all costs. Compared against your projected demand to determine viability.' },
       { label: 'Payback Period', formula: 'Setup cost ÷ Monthly net profit', note: 'Months to recover your initial investment. Under 12 months is excellent. Over 24 months carries significant risk.' },
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
      Get a full data-driven report in under 30 seconds. Free for your first 3 locations.
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