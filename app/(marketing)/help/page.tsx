'use client'
// app/(marketing)/help/page.tsx
// Upgraded: no emojis, fixed pricing, accurate product details

import { useState } from 'react'
import Link from 'next/link'

const S = {
  brand: '#0F766E', brandLight: '#14B8A6', brandFaded: '#F0FDFA', brandBorder: '#99F6E4',
  n50: '#FAFAF9', n100: '#F5F5F4', n200: '#E7E5E4', n400: '#A8A29E', n500: '#78716C',
  n700: '#44403C', n800: '#292524', n900: '#1C1917', white: '#FFFFFF',
  headerBg: '#0C1F1C', font: "'DM Sans', sans-serif",
}

const FAQS = [
  {
    category: 'Getting started',
    items: [
      {
        q: 'How do I run my first analysis?',
        a: 'Go to the Dashboard and click "New Analysis". Enter any Australian street address, select your business type, fill in your monthly rent and setup budget, then submit. Your report is ready in 20–40 seconds and includes a GO/CAUTION/NO verdict, financial model, competitor map, and 3-year projection.',
      },
      {
        q: 'Do I need a credit card to sign up?',
        a: 'No. The free plan gives you 3 complete reports with no credit card required. You only need payment details when you upgrade to Pro or Business.',
      },
      {
        q: 'What does the free plan include?',
        a: 'Three complete location analyses, each with a full financial model, GO/CAUTION/NO verdict, SWOT analysis, competitor data within 500m, demographic scoring, and a 3-year projection. No features are restricted on the free plan — you get the full report.',
      },
      {
        q: 'How accurate are the reports?',
        a: 'Reports use real data — competitor locations from OpenStreetMap via Geoapify, ABS 2021 Census demographics, and market rent benchmarks. They are indicative estimates, not guarantees. Treat them as a rigorous starting point, then verify with a commercial agent and solicitor before signing a lease.',
      },
      {
        q: 'What Australian locations are supported?',
        a: 'All Australian addresses are supported. Demographics coverage is strongest in major cities (Sydney, Melbourne, Brisbane, Perth, Adelaide) and inner suburbs. Regional coverage uses state-level benchmarks where suburb-level ABS data is unavailable — the report will flag this when it applies.',
      },
    ],
  },
  {
    category: 'Understanding your report',
    items: [
      {
        q: 'What does the location score mean?',
        a: 'The score (0–100) is a weighted composite: Rent affordability 30%, Profitability 25%, Competition intensity 25%, Area demographics 20%. Scores above 70 are GO territory. 45–70 is CAUTION. Below 45 is NO. The weighting reflects that rent and profitability are the leading causes of business failure.',
      },
      {
        q: 'What does GO / CAUTION / NO mean exactly?',
        a: 'GO means the location looks financially viable under your inputs. CAUTION means there are real risk factors — high rent, strong competition, or below-average demographics — that need addressing before you commit. NO means the numbers do not work at the current rent or competition level. Changing your inputs (lower rent, different business type) may shift the verdict.',
      },
      {
        q: 'Why is the rent-to-revenue ratio the most important number?',
        a: 'Rent is your largest fixed cost and the one you cannot reduce once you sign. Industry data shows rent above 12% of monthly revenue is a warning sign. Above 20% is the leading predictor of hospitality business failure within 3 years. The report shows you this ratio and benchmarks it against industry standards.',
      },
      {
        q: 'What does the break-even calculation show?',
        a: 'It shows how many customers per day you need to cover all costs — rent, labour, COGS, and overheads. Your modelled daily customer count (derived from foot traffic and demographics) is compared against this break-even number. If you are above it, the location is viable. If below, the report shows you by how much.',
      },
      {
        q: 'How is the competitor data collected?',
        a: 'We use the Geoapify Places API to find businesses within 500m of your address matching your business category. The underlying data comes from OpenStreetMap. In some suburbs OSM coverage is incomplete — if our system detects this, it flags the competitor count as potentially understated and recommends a manual check.',
      },
      {
        q: 'Can I adjust the inputs and see a different result?',
        a: 'Yes. Every report has a "What-if calculator" with sliders for monthly rent, average ticket size, and daily customers. Drag any slider and the verdict, score, and financials update in real time in your browser. This lets you model negotiated rent, different price points, or conservative demand assumptions without running a new report.',
      },
    ],
  },
  {
    category: 'Account and billing',
    items: [
      {
        q: 'What plans are available?',
        a: 'Free (3 reports, no card required), Pro ($59/month, unlimited reports, PDF export, comparison tool), Annual ($490/year — equivalent to $41/month), and Business ($119/month, for teams and franchise operators with priority support). All paid plans can be cancelled anytime.',
      },
      {
        q: 'How do I upgrade?',
        a: 'Go to your Dashboard and click "Upgrade" in the sidebar, or visit the Pricing page. Payment is processed by Stripe. You will have immediate access to Pro features once payment is confirmed.',
      },
      {
        q: 'Can I cancel my subscription?',
        a: 'Yes, cancel anytime from your Profile page. You keep access until the end of your current billing period. There are no cancellation fees and no questions asked.',
      },
      {
        q: 'Do deleted reports restore my free quota?',
        a: 'No. The free quota counts analyses run, not reports stored. Deleting a report does not restore your quota.',
      },
      {
        q: 'Can I get a refund?',
        a: 'We offer refunds within 7 days of purchase if you have not generated any paid reports. Contact hello@locatalyze.com with your account email and we will process it promptly.',
      },
    ],
  },
  {
    category: 'Technical',
    items: [
      {
        q: 'Why is my report taking longer than expected?',
        a: 'Reports usually complete in 20–40 seconds. The analysis runs in the background — you can close the tab and return to your dashboard to find it ready. If a report shows "failed" after 90 seconds, try resubmitting. The second attempt almost always succeeds.',
      },
      {
        q: 'Can I download my report as a PDF?',
        a: 'Yes, PDF export is available on all plans. Click the Download button on any report page. The PDF includes all sections: verdict, score breakdown, financial model, competitor analysis, SWOT, and 3-year projection.',
      },
      {
        q: 'Can I share a report with someone who does not have an account?',
        a: 'Yes. Every report has a Share button that generates a public link. Anyone with the link can view the full report without logging in. You can revoke the link at any time from the report page.',
      },
      {
        q: 'Is my data private?',
        a: 'Yes. Reports are private to your account by default. Public links are opt-in. We do not sell your data or share it with third parties. Full details are in our Privacy Policy.',
      },
      {
        q: 'Can I analyse locations outside Australia?',
        a: 'Not currently. Locatalyze is built specifically for the Australian market — the demographics data, rent benchmarks, and competitor categories are calibrated for Australian conditions. International support is on the roadmap.',
      },
    ],
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: `1px solid ${S.n100}` }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', padding: '16px 0',
          display: 'flex', alignItems: 'flex-start',
          justifyContent: 'space-between',
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: S.font, textAlign: 'left', gap: 16,
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 600, color: S.n800, lineHeight: 1.5 }}>{q}</span>
        <span style={{
          color: S.brand, fontSize: 18, fontWeight: 300,
          flexShrink: 0, transform: open ? 'rotate(45deg)' : 'none',
          transition: 'transform 0.2s', display: 'inline-block',
          lineHeight: 1, marginTop: 2,
        }}>
          +
        </span>
      </button>
      {open && (
        <div style={{ paddingBottom: 18, fontSize: 14, color: S.n500, lineHeight: 1.8 }}>
          {a}
        </div>
      )}
    </div>
  )
}

const CAT_ICONS: Record<string, string> = {
  'Getting started':          '→',
  'Understanding your report': '→',
  'Account and billing':      '→',
  'Technical':                '→',
}

export default function HelpPage() {
  const [search, setSearch] = useState('')

  const filtered = FAQS.map(cat => ({
    ...cat,
    items: cat.items.filter(item =>
      !search ||
      item.q.toLowerCase().includes(search.toLowerCase()) ||
      item.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(cat => cat.items.length > 0)

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <div style={{ minHeight: '100vh', background: S.n50, fontFamily: S.font }}>

        {/* Header */}
        <div style={{ background: S.headerBg, padding: '52px 24px 44px', textAlign: 'center' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 28 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: `linear-gradient(135deg,${S.brand},${S.brandLight})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 900, fontSize: 13,
            }}>L</div>
            <span style={{ fontWeight: 800, fontSize: 15, color: '#F9FAFB', letterSpacing: '-0.02em' }}>Locatalyze</span>
          </Link>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(15,118,110,0.15)', border: '1px solid rgba(15,118,110,0.3)',
            borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700,
            color: S.brandLight, letterSpacing: '0.08em', textTransform: 'uppercase',
            marginBottom: 14,
          }}>
            Help Centre
          </div>
          <h1 style={{ fontSize: 34, fontWeight: 800, color: '#F9FAFB', letterSpacing: '-0.03em', marginBottom: 20 }}>
            How can we help?
          </h1>

          {/* Search */}
          <div style={{ maxWidth: 480, margin: '0 auto', position: 'relative' }}>
            <div style={{
              position: 'absolute', left: 14, top: '50%',
              transform: 'translateY(-50%)',
              width: 14, height: 14,
              border: `2px solid ${S.n400}`, borderRadius: '50%',
            }} />
            <div style={{
              position: 'absolute', left: 24, top: '50%',
              transform: 'translateY(0px) rotate(45deg)',
              width: 5, height: 2, background: S.n400,
              borderRadius: 1,
            }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search questions..."
              style={{
                width: '100%', padding: '13px 14px 13px 38px',
                borderRadius: 10, border: 'none', fontSize: 14,
                fontFamily: S.font, outline: 'none', color: S.n900,
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              }}
            />
          </div>
        </div>

        <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 80px' }}>

          {/* Quick links */}
          {!search && (
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: 10, marginBottom: 44,
            }}>
              {FAQS.map(cat => (
                <a
                  key={cat.category}
                  href={`#${cat.category.toLowerCase().replace(/\s+/g, '-')}`}
                  style={{
                    background: S.white, border: `1px solid ${S.n200}`,
                    borderRadius: 10, padding: '14px 16px',
                    textDecoration: 'none', display: 'block',
                  }}
                >
                  <p style={{ fontSize: 13, fontWeight: 700, color: S.n900, marginBottom: 2 }}>{cat.category}</p>
                  <p style={{ fontSize: 11, color: S.n400 }}>{cat.items.length} questions</p>
                </a>
              ))}
            </div>
          )}

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p style={{ fontSize: 16, color: S.n500, marginBottom: 16 }}>
                No results for "{search}"
              </p>
              <Link href="/contact" style={{
                display: 'inline-block', fontSize: 14,
                color: S.brand, fontWeight: 700, textDecoration: 'none',
              }}>
                Ask us directly →
              </Link>
            </div>
          )}

          {filtered.map(cat => (
            <div
              key={cat.category}
              id={cat.category.toLowerCase().replace(/\s+/g, '-')}
              style={{ marginBottom: 44 }}
            >
              <h2 style={{
                fontSize: 16, fontWeight: 800, color: S.n900,
                marginBottom: 16, letterSpacing: '-0.01em',
                paddingBottom: 10, borderBottom: `1px solid ${S.n200}`,
              }}>
                {cat.category}
              </h2>
              <div style={{
                background: S.white, border: `1px solid ${S.n200}`,
                borderRadius: 12, padding: '0 22px',
              }}>
                {cat.items.map(item => (
                  <FAQItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}

          {/* CTA */}
          <div style={{
            background: S.brandFaded, border: `1px solid ${S.brandBorder}`,
            borderRadius: 14, padding: '28px 32px', textAlign: 'center', marginTop: 12,
          }}>
            <p style={{ fontSize: 17, fontWeight: 700, color: S.n900, marginBottom: 6 }}>
              Still have questions?
            </p>
            <p style={{ fontSize: 14, color: S.n500, marginBottom: 20, lineHeight: 1.7 }}>
              We respond within one business day. Perth, WA based — GMT+8.
            </p>
            <Link href="/contact" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: S.brand, color: '#fff', borderRadius: 10,
              padding: '11px 24px', fontSize: 14, fontWeight: 700, textDecoration: 'none',
            }}>
              Contact us →
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}