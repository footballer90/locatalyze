// app/(marketing)/tools/business-viability-checker/page.tsx
// Free SEO tool — suburb-level viability preview.
// Server component: owns metadata + the content that ranks.

import type { Metadata } from 'next'
import Link from 'next/link'
import ViabilityChecker from './ViabilityChecker'

export const metadata: Metadata = {
  title: 'Business Viability Checker — Will Your Café, Restaurant or Shop Work in This Suburb?',
  description:
    'Free Australian business viability checker. Enter your business type, suburb, rent and budget and get an instant GO / CAUTION / NO verdict with estimated monthly revenue, profit and break-even — before you sign a lease.',
  alternates: { canonical: 'https://www.locatalyze.com.au/tools/business-viability-checker' },
  openGraph: {
    title: 'Business Viability Checker — Locatalyze',
    description:
      'Free tool. Will your café, restaurant, gym or retail shop actually work in that suburb? Get a 10-second verdict with revenue, profit and break-even estimates.',
    type: 'website',
    url: 'https://www.locatalyze.com.au/tools/business-viability-checker',
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
    a: 'The free checker is a suburb-level preview. It uses Locatalyze\'s demand scores, rent ranges, parking signals and suburb fit data — the same base layer that powers our paid reports. It\'s designed to tell you whether a format works in a suburb at all. It can\'t see your exact address, your specific competitors or live foot traffic — that\'s what the full address-level report unlocks.',
  },
  {
    q: 'What does the GO / CAUTION / NO verdict actually mean?',
    a: 'GO (score 72+): the inputs clear the viability line comfortably — demand, rent-to-revenue ratio, suburb fit and capital are all on your side. CAUTION (52–71): it can work, but only if specific conditions hold — we list them. NO (under 52): at least one of demand, rent, budget or suburb fit is under the line and needs fixing before a lease is signed.',
  },
  {
    q: 'Where do the revenue and profit numbers come from?',
    a: 'Revenue is modelled as customers/day × average ticket × 30, scaled by the suburb\'s demand score for your business type. Costs combine staffing (calibrated to business type and size), rent you entered, COGS as a % of revenue, and a utilities/insurance overhead. We show worst, base and best cases, not a single false-precision number.',
  },
  {
    q: 'Is this financial advice?',
    a: 'No. It\'s a decision-support preview. Numbers are indicative, based on suburb demand models and typical operating ratios for each business type. Before signing a lease or spending capital, run the full address-level report and review it with your accountant.',
  },
  {
    q: 'Which suburbs and cities are covered?',
    a: 'Perth, Sydney, Melbourne, Brisbane, Adelaide, Gold Coast, Canberra and Newcastle — with the highest-demand inner suburbs in each. If the suburb you want isn\'t in the list, the full Locatalyze report can still analyse any address in Australia.',
  },
  {
    q: 'Why do I need the paid report if this is free?',
    a: 'The free tool uses suburb averages. But most leases fail or succeed on variables an average can\'t see: the specific competitors within 500m, hour-by-hour foot traffic on your block, the exact demographic mix of your 500m catchment, and whether the rent you\'ve been quoted is above or below real comparable listings. The paid report resolves all of that for your exact address.',
  },
]

export default function Page() {
  return (
    <>
      {/* ── HERO ────────────────────────────────────────────────────── */}
      <section className="border-b border-gray-100 bg-gradient-to-b from-white to-gray-50/60">
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-10 md:pt-24 md:pb-14">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 font-semibold text-[12px] tracking-wide px-3 py-1 rounded-full w-fit mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
            Free tool · No signup
          </div>
          <h1 className="text-[40px] md:text-[56px] font-bold leading-[1.05] tracking-[-0.02em] text-gray-900 max-w-4xl mb-5">
            Will your business <span className="text-blue-600">actually work</span> in that suburb?
          </h1>
          <p className="text-[17px] md:text-[18px] text-gray-600 leading-[1.6] max-w-2xl">
            Check the viability of a café, restaurant, gym, takeaway or retail shop in any major
            Australian suburb in 10 seconds. Get a GO / CAUTION / NO verdict, estimated monthly
            revenue, net profit, break-even, and the specific conditions that have to hold for it to
            work — before you sign a lease.
          </p>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-gray-500">
            <span>✓ Covers Perth, Sydney, Melbourne, Brisbane, Adelaide, Gold Coast</span>
            <span>✓ Revenue + profit estimates</span>
            <span>✓ Break-even timeline</span>
          </div>
        </div>
      </section>

      {/* ── TOOL ────────────────────────────────────────────────────── */}
      <section className="bg-gray-50/60 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
          <ViabilityChecker />
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
          <div className="max-w-2xl mb-12">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-600 mb-3">How it works</div>
            <h2 className="text-[32px] md:text-[40px] font-bold tracking-[-0.02em] text-gray-900 leading-[1.15]">
              Four variables decide whether a location works.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Step n={1} title="Demand fit for your format">
              Every suburb has a different demand profile. Fitzroy over-indexes for cafés and indie
              retail; Chatswood over-indexes for restaurants and service retail; Subiaco for
              health-conscious formats. We score the suburb against your specific business type.
            </Step>
            <Step n={2} title="Rent-to-revenue ratio">
              Rent above 10% of revenue is the #1 silent killer of hospitality and retail. We
              compare the rent you entered against the suburb median so you can see whether your
              lease is already eating your margin before day one.
            </Step>
            <Step n={3} title="Capital adequacy">
              Under-capitalised openings are the second most common failure driver. Each business
              type has a minimum setup threshold — if your budget is below it, we flag it and show
              you the failure mode before you commit.
            </Step>
            <Step n={4} title="Suburb-type match">
              Some suburbs are great for cafés and terrible for gyms. Some are excellent for
              restaurants but poor for takeaway. We use on-the-ground suburb profiles (demographics,
              vibe, anchors, parking, foot traffic) to score the match.
            </Step>
          </div>
        </div>
      </section>

      {/* ── WHY THIS MATTERS ────────────────────────────────────────── */}
      <section className="bg-gray-50/60 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-600 mb-3">Why this matters</div>
              <h2 className="text-[30px] md:text-[36px] font-bold tracking-[-0.02em] text-gray-900 leading-[1.15] mb-5">
                Most failed locations were predictable.
              </h2>
              <p className="text-[16px] text-gray-600 leading-[1.7] mb-4">
                Operators don't fail because they're bad operators — most fail because the location
                maths never worked in the first place. Rent was 3% too high, demand was 15% below
                what they assumed, a direct competitor opened 150 metres away, or the catchment had
                the wrong demographics for their format.
              </p>
              <p className="text-[16px] text-gray-600 leading-[1.7]">
                This checker exists to catch those signals before you sign a 5-year lease. The free
                suburb-level preview gets you 60% of the way there. The full Locatalyze report
                resolves the rest at your exact address.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-7">
              <h3 className="text-[18px] font-bold text-gray-900 mb-4">The checker is good at:</h3>
              <Good>Telling you whether the <strong>format fits the suburb</strong> at all.</Good>
              <Good>Showing whether your <strong>rent is sane</strong> vs suburb benchmarks.</Good>
              <Good>Flagging <strong>under-capitalisation</strong> before you spend money.</Good>
              <Good>Giving you a <strong>defensible first estimate</strong> of revenue and profit.</Good>

              <h3 className="text-[18px] font-bold text-gray-900 mt-6 mb-4">What only the paid report sees:</h3>
              <Bad>The <strong>specific competitors</strong> within 500m of your door.</Bad>
              <Bad><strong>Hour-by-hour foot traffic</strong> for your exact block.</Bad>
              <Bad>The <strong>demographic mix</strong> of your 500m catchment.</Bad>
              <Bad>Whether the rent you've been quoted is <strong>above comparable listings</strong>.</Bad>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
          <h2 className="text-[28px] md:text-[34px] font-bold text-gray-900 tracking-[-0.02em] mb-10">
            Questions operators ask before they trust the number
          </h2>
          <div className="space-y-5">
            {FAQ.map((f, i) => (
              <details key={i} className="group border border-gray-200 rounded-xl p-5 open:border-blue-200 open:bg-blue-50/30 transition">
                <summary className="list-none cursor-pointer flex items-start justify-between gap-4">
                  <span className="text-[16px] font-semibold text-gray-900 leading-snug">{f.q}</span>
                  <span className="text-gray-400 text-lg group-open:rotate-45 transition-transform leading-none mt-0.5">+</span>
                </summary>
                <p className="mt-4 text-[15px] text-gray-600 leading-[1.7]">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────────────── */}
      <section className="bg-gray-50/60">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 text-center">
          <h2 className="text-[30px] md:text-[44px] font-bold tracking-[-0.02em] text-gray-900 leading-[1.1] mb-5 max-w-3xl mx-auto">
            The suburb looks good. Now check the <span className="text-blue-600">exact address</span>.
          </h2>
          <p className="text-[17px] text-gray-600 leading-[1.6] max-w-2xl mx-auto mb-8">
            Run a full Locatalyze report with live competitor data, foot traffic, demographics and a
            12-month financial model. Delivered in under 5 minutes.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/onboarding" className="bg-gray-900 hover:bg-gray-800 text-white font-semibold text-[15px] px-5 py-3 rounded-xl inline-flex items-center gap-2 transition">
              Run full analysis — from $49
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link href="/sample-report" className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 font-semibold text-[15px] px-5 py-3 rounded-xl inline-flex items-center transition">See a sample report</Link>
          </div>
        </div>
      </section>

      {/* ── JSON-LD structured data ─────────────────────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'WebApplication',
                name: 'Locatalyze Business Viability Checker',
                url: 'https://www.locatalyze.com.au/tools/business-viability-checker',
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
    </>
  )
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
      <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center text-[14px] font-bold mb-4">{n}</div>
      <h3 className="text-[17px] font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-[14.5px] text-gray-600 leading-[1.65]">{children}</p>
    </div>
  )
}

function Good({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2.5 text-[14px] text-gray-700 mb-2.5 leading-[1.55]">
      <span className="text-emerald-600 mt-0.5">✓</span><span>{children}</span>
    </div>
  )
}

function Bad({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2.5 text-[14px] text-gray-700 mb-2.5 leading-[1.55]">
      <span className="text-gray-400 mt-0.5">◯</span><span>{children}</span>
    </div>
  )
}
