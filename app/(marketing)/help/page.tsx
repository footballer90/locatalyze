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
        a: 'Go to the Dashboard and click "New Analysis". Enter any Australian street address, select your business type, and drop a pin on the map to confirm your exact location. Add your monthly rent if you know it, then submit. Your report is usually ready in about 90 seconds and includes a GO/CAUTION/NO verdict, full financial model, competitor map, SWOT analysis, and 3-year projection.',
      },
      {
        q: 'What is "Calibrate your model" and should I fill it in?',
        a: 'This section lets you give the financial model more accurate inputs specific to your business. You can enter your expected average order value (which overrides the industry benchmark), your operating hours, location access type (street frontage, transport hub, side street, etc.), and seating capacity. Each field you fill in raises the Model Accuracy score, which starts at 61% with just the address and can reach 98% with full calibration. It takes under a minute and meaningfully improves the revenue and break-even estimates.',
      },
      {
        q: 'Do I need a credit card to sign up?',
        a: 'No. Your first report is free — no credit card required. You only need payment details when you unlock a full report or purchase a report pack.',
      },
      {
        q: 'What does the free report include?',
        a: 'Your first report is free and includes: GO/CAUTION/NO verdict, competitor map, and top-level location score. To unlock the full financial model, break-even analysis, SWOT insights, revenue projections, and PDF export, you can purchase a single report for $29 or save with a multi-report pack.',
      },
      {
        q: 'How accurate are the reports?',
        a: 'Reports are built on real data — competitor locations from Google Maps, ABS-aligned demographic estimates, and commercial rent benchmarks sourced from publicly available property listings. Revenue and profit figures are model estimates, not guarantees. Accuracy improves significantly when you use the "Calibrate your model" section to enter your own average order value and operating hours. Always treat the report as a rigorous starting point and verify key figures with a commercial agent and accountant before signing a lease.',
      },
      {
        q: 'What Australian locations are supported?',
        a: 'All Australian addresses are supported. Demographics and rent coverage is strongest in major cities (Sydney, Melbourne, Brisbane, Perth, Adelaide) and inner suburbs. Regional addresses use state-level benchmarks where suburb-specific data is unavailable — the report flags this in the Data Quality section when it applies.',
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
        a: 'Rent is your largest fixed cost and the one you cannot reduce once you sign. Industry data shows rent above 12% of monthly revenue is a warning sign. Above 20% is the leading predictor of hospitality business failure within 3 years. The report shows you this ratio, rates it EXCELLENT / GOOD / MARGINAL / POOR, and benchmarks it against the suburb average for your category.',
      },
      {
        q: 'What does the break-even calculation show?',
        a: 'It shows the minimum number of customers per day needed to cover your fixed costs — rent and staffing. This is the contribution margin break-even (fixed costs only), not a gross margin calculation. Your projected daily customers are compared against this threshold. If you are comfortably above it, the location is viable. If below, the report shows you the gap and how sensitive it is to rent or ticket size changes.',
      },
      {
        q: 'How is the competitor data collected?',
        a: 'We use Google Maps to find businesses within 500m of your selected coordinates matching your business category. Each competitor is assessed by their rating and review volume to determine a competition intensity score. In some suburbs real-time data may lag — the report flags low-confidence competitor counts when detected.',
      },
      {
        q: 'What does the Executive Summary show at the top of the report?',
        a: 'The Executive Summary is a short narrative that explains why the verdict was reached — in plain language, not bullet points. It references your specific numbers: projected daily customers vs. break-even threshold, primary risk drivers, and any conditions under which the verdict would change. It is generated from the actual computed data, not generic AI text.',
      },
    ],
  },
  {
    category: 'Account and billing',
    items: [
      {
        q: 'What plans are available?',
        a: 'Your first report is free. Paid options: Single Report ($29 — one location, full analysis + PDF), 3-Pack ($59 — $19.67 each, save 32%, ideal for comparing locations), 10-Pack ($149 — $14.90 each, save 49%, for agencies and multi-site research). All three are one-time purchases — no subscription required. Monthly subscriptions exist for commercial agents and franchise operators who run 15+ reports a month, but most users never need one.',
      },
      {
        q: 'How do I unlock a full report?',
        a: 'Click "Unlock full report — $29" on any report page, or visit the Upgrade page to purchase a report pack. Payment is processed securely by Stripe. Your report unlocks instantly after payment.',
      },
      {
        q: 'Can I cancel a subscription if I have one?',
        a: 'Yes. Monthly subscriptions (available for high-volume commercial users) can be cancelled anytime from your Profile page. You keep access until the end of the current billing period. If you bought a report pack (Single, 3-Pack, or 10-Pack), there is nothing to cancel — your credits stay in your account and never expire.',
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
        a: 'Reports typically complete in about 90 seconds. The system runs 8 parallel analysis agents — competitor mapping, rent benchmarking, demographic analysis, financial modelling, and more — then compiles them into a single report. You can safely close the tab; the analysis continues in the background and your report will be waiting in the Dashboard when you return. If a report shows "failed" after 3 minutes, resubmit — the second attempt almost always succeeds.',
      },
      {
        q: 'Do I get an email when my report is ready?',
        a: 'Yes. Once the analysis completes, we send a summary email to your account address with the verdict, key financial figures, and a link back to the full report. This makes it easy to share with a business partner or revisit later.',
      },
      {
        q: 'Can I download my report as a PDF?',
        a: 'Yes. PDF export is included in all paid reports — Single Report ($29), 3-Pack, and 10-Pack. Click the Download button on any unlocked report page. The PDF includes all sections: verdict, score breakdown, executive narrative, financial model, competitor analysis, SWOT, and 3-year projection.',
      },
      {
        q: 'Can I compare multiple locations?',
        a: 'Yes. The Location Comparison tool is available to any user with two or more reports. Select up to 3 reports and view them side by side — verdict, location score, revenue estimate, profit, break-even, and score breakdown. The 3-Pack ($59) is the most popular way to unlock comparison for shortlisted sites.',
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
          <nav
            aria-label="Breadcrumb"
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: 'rgba(248,250,252,0.55)',
              marginBottom: 24,
            }}
          >
            <Link href="/" style={{ color: 'rgba(248,250,252,0.65)', textDecoration: 'none' }}>
              Home
            </Link>
            <span style={{ opacity: 0.35, margin: '0 8px' }}>/</span>
            <span style={{ color: '#F9FAFB' }}>Help</span>
          </nav>
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