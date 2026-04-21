'use client'
// app/(marketing)/changelog/page.tsx
// Updated with v2.5 entries covering March 2026 work

import Link from 'next/link'
import { Logo } from '@/components/Logo'

const D = {
  bg: '#090E1C', surface: '#101720', border: 'rgba(255,255,255,0.07)',
  t1: '#EFF8F4', t2: 'rgba(200,230,220,0.55)', t3: 'rgba(140,200,185,0.28)',
  green: '#34D399', greenDim: 'rgba(52,211,153,0.08)', greenBorder: 'rgba(52,211,153,0.22)',
  teal: '#2DD4BF',
  amber: '#F59E0B', amberDim: 'rgba(245,158,11,0.08)', amberBorder: 'rgba(245,158,11,0.22)',
  blue: '#60A5FA', blueDim: 'rgba(96,165,250,0.08)', blueBorder: 'rgba(96,165,250,0.22)',
  font: "'DM Sans','Inter','Helvetica Neue',Arial,sans-serif",
}

const tagStyles: Record<string, { bg: string; border: string; color: string }> = {
  green: { bg: D.greenDim, border: D.greenBorder, color: D.green },
  amber: { bg: D.amberDim, border: D.amberBorder, color: D.amber },
  blue:  { bg: D.blueDim,  border: D.blueBorder,  color: D.blue  },
}

const releases = [
  {
    version: 'v2.5',
    date: 'March 2026',
    label: 'Latest',
    summary: 'SEO hub pages, blog upgrade, security headers, contact form, city redirects, and checklist fixes.',
    changes: [
      { tag: 'New',      tc: 'green', text: 'Programmatic SEO pages — Sydney hub linking all 6 business types (café, restaurant, gym, retail, bakery, salon). Perth hub with same structure. Each business type has a dedicated suburb guide with real financial modelling.' },
      { tag: 'New',      tc: 'green', text: 'Blog index upgraded — premium two-column featured article layout, colour-coded category pills, wired newsletter subscription.' },
      { tag: 'New',      tc: 'green', text: 'Blog post renderer upgraded — two-column layout with sticky sidebar, article meta, location guide links. All emojis removed sitewide.' },
      { tag: 'New',      tc: 'green', text: 'Contact page and API route — form with reason selector, Resend auto-reply to sender, notification email to team with one-click reply button.' },
      { tag: 'New',      tc: 'green', text: 'Help Centre upgraded — accurate pricing, what-if calculator documentation, share link and PDF export FAQs, quick-link navigation cards.' },
      { tag: 'New',      tc: 'green', text: 'City redirects — /sydney and /perth now redirect to /analyse/sydney and /analyse/perth respectively.' },
      { tag: 'Security', tc: 'blue',  text: 'Full Content Security Policy deployed — script-src, style-src, connect-src, frame-src, and frame-ancestors all locked down. X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, and HSTS headers added.' },
      { tag: 'Security', tc: 'blue',  text: 'Cloudflare Turnstile CAPTCHA active on signup form. Upstash Redis rate limiting confirmed active on /api/analyse.' },
      { tag: 'Security', tc: 'blue',  text: 'Email verification enforced — dashboard blocks report generation until email_confirmed_at is set. Verify-email gate page added.' },
      { tag: 'Fix',      tc: 'amber', text: 'Supabase SQL migration run — reports table now has status, progress_step, error_message, result_data, started_at, and completed_at columns. Async architecture fully operational.' },
      { tag: 'Fix',      tc: 'amber', text: 'Google Analytics tag (G-4GWEH0M5WE) added to layout.tsx. Vercel Analytics confirmed active.' },
      { tag: 'SEO',      tc: 'blue',  text: 'Google Search Console verified. Sitemap submitted. 475 crawl requests recorded. Canonical tags confirmed on all marketing pages.' },
      { tag: 'SEO',      tc: 'blue',  text: 'OG image route added at /opengraph-image. Twitter card meta added to layout.tsx.' },
      { tag: 'SEO',      tc: 'blue',  text: 'Blog section added to city hub pages — Sydney and Perth /analyse/ pages now surface related blog articles.' },
    ],
  },
  {
    version: 'v2.4',
    date: 'February 2026',
    label: undefined,
    summary: 'Async analysis engine, pricing overhaul, founder pages, and trust and security hardening.',
    changes: [
      { tag: 'New',      tc: 'green', text: 'Async analysis architecture — browser receives a report ID in under 200ms, analysis runs in the background, dashboard updates live via Supabase Realtime when complete. Eliminates timeout errors.' },
      { tag: 'New',      tc: 'green', text: 'Pricing overhaul — 1 free report, Single Report ($29), 3-Pack ($59), 10-Pack ($149). Pay-per-report model replaces subscriptions as primary offering.' },
      { tag: 'New',      tc: 'green', text: 'About page added — founder profiles with background and methodology context.' },
      { tag: 'New',      tc: 'green', text: 'Competitor data caching — results cached 48 hours per suburb, reducing API costs and speeding up repeat analyses.' },
      { tag: 'Fix',      tc: 'amber', text: 'Score ring display bug resolved — feasibility ring no longer shows 0/100 on page load.' },
      { tag: 'Fix',      tc: 'amber', text: 'Staging URLs removed from all public-facing pages.' },
      { tag: 'Security', tc: 'blue',  text: 'API keys removed from client bundle and moved to server-side environment variables.' },
      { tag: 'Security', tc: 'blue',  text: 'Prompt injection prevention added to analysis input validation.' },
      { tag: 'Security', tc: 'blue',  text: 'Rate limiting active on /api/analyse — Upstash sliding window, 5 requests per user per hour.' },
      { tag: 'SEO',      tc: 'blue',  text: 'JSON-LD structured data added — FAQPage and HowTo schemas on key pages.' },
      { tag: 'SEO',      tc: 'blue',  text: 'Canonical tags and meta descriptions added to all marketing pages.' },
      { tag: 'SEO',      tc: 'blue',  text: '35 blog articles published covering location strategy, city guides, and financial modelling.' },
    ],
  },
  {
    version: 'v2.3',
    date: 'January 2026',
    label: undefined,
    summary: 'Report improvements, financial model accuracy fixes, and scoring engine overhaul.',
    changes: [
      { tag: 'New',         tc: 'green', text: 'Score explainability tooltips on each breakdown bar — shows exactly why each dimension scored the way it did.' },
      { tag: 'New',         tc: 'green', text: 'Risk scenario section in all reports — best case (130%), base, and worst case (70%) with cash buffer estimates.' },
      { tag: 'Fix',         tc: 'amber', text: 'Financial model now uses demand-driven baseline customers. Revenue is independent of rent; rent affects score only.' },
      { tag: 'Fix',         tc: 'amber', text: 'Payback period no longer shows 999 months. Unprofitable locations now show "not achievable under current assumptions".' },
      { tag: 'Fix',         tc: 'amber', text: 'Three-year projection now accurately reflects whether years are profitable or loss-making.' },
      { tag: 'Fix',         tc: 'amber', text: 'SWOT strengths no longer claim profitability when net profit is negative.' },
      { tag: 'Improvement', tc: 'blue',  text: 'Demographics engine expanded to 400+ Australian suburbs across all major cities and regional towns.' },
      { tag: 'Improvement', tc: 'blue',  text: 'Scoring standardized on v2.1 — Rent Affordability 20%, Competition 25%, Market Demand 20%, Profitability 25%, Location Quality 10%.' },
    ],
  },
  {
    version: 'v2.2',
    date: 'November 2025',
    label: undefined,
    summary: 'Public share links, PDF export, and dashboard usability improvements.',
    changes: [
      { tag: 'New', tc: 'green', text: 'Public share links for reports — high-entropy URLs allow sharing with advisors without requiring account login.' },
      { tag: 'New', tc: 'green', text: 'PDF export added to all reports.' },
      { tag: 'New', tc: 'green', text: 'Dashboard report history — all past analyses saved and filterable by verdict, date, or business type.' },
      { tag: 'Fix', tc: 'amber', text: 'Mobile map tap-to-activate added to prevent scroll trap on the competitor map.' },
    ],
  },
  {
    version: 'v2.1',
    date: 'September 2025',
    label: undefined,
    summary: 'Self-contained analysis engine replacing the previous multi-service pipeline.',
    changes: [
      { tag: 'New',         tc: 'green', text: 'Self-contained analysis engine — all competitor, demographic, financial, and AI steps now run in a single coordinated workflow.' },
      { tag: 'New',         tc: 'green', text: 'Financial modelling layer — monthly P&L, break-even, payback period, and 3-year projection in every report.' },
      { tag: 'New',         tc: 'green', text: 'IDOR protection — users can only access their own reports.' },
      { tag: 'Improvement', tc: 'blue',  text: 'Competitor search standardised at 500m. Category taxonomy expanded for Australian OSM edge cases.' },
    ],
  },
  {
    version: 'v2.0',
    date: 'July 2025',
    label: undefined,
    summary: 'Full platform relaunch. Production SaaS with auth, billing, and structured reports.',
    changes: [
      { tag: 'New', tc: 'green', text: 'Authentication system — email/password signup, login, and password reset via Supabase Auth.' },
      { tag: 'New', tc: 'green', text: 'Stripe billing integration.' },
      { tag: 'New', tc: 'green', text: 'Structured report format — GO / CAUTION / NO verdict with score breakdown, competitors, demographics, and AI analysis.' },
      { tag: 'New', tc: 'green', text: 'Methodology page — full six-step pipeline explanation with data sources and scoring weights.' },
      { tag: 'New', tc: 'green', text: 'Blog and location insights hub launched.' },
      { tag: 'New', tc: 'green', text: 'Help Centre launched with onboarding guides and plan FAQ.' },
    ],
  },
  {
    version: 'v1.0',
    date: 'March 2025',
    label: undefined,
    summary: 'Initial private beta — address input, basic scoring, and AI narrative generation.',
    changes: [
      { tag: 'New', tc: 'green', text: 'Address-to-verdict pipeline — paste any Australian address, receive a GO / CAUTION / NO score.' },
      { tag: 'New', tc: 'green', text: 'Competitor proximity scoring within 500m radius.' },
      { tag: 'New', tc: 'green', text: 'Location narrative with competitor, rent, and demand summaries.' },
      { tag: 'New', tc: 'green', text: 'Private beta — 50 invites sent to Australian café, restaurant, and retail founders.' },
    ],
  },
]

export default function ChangelogPage() {
  return (
    <div style={{ background: D.bg, minHeight: '100vh', fontFamily: D.font }}>
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '80px 24px 120px' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <Link href="/" style={{ textDecoration: 'none', opacity: 0.92 }}>
            <Logo variant="dark" size="sm" />
          </Link>
          <span style={{ color: D.t3 }}>/</span>
          <span style={{ fontSize: 13, color: D.t2 }}>Changelog</span>
        </div>

        {/* Heading */}
        <div style={{ marginBottom: 64 }}>
          <h1 style={{
            fontSize: 36, fontWeight: 800, color: D.t1,
            margin: '0 0 12px', letterSpacing: '-0.03em',
          }}>
            Changelog
          </h1>
          <p style={{ fontSize: 16, color: D.t2, margin: 0, lineHeight: 1.6 }}>
            A running record of what has shipped, what has been fixed, and what has changed.
          </p>
        </div>

        {/* Releases */}
        {releases.map((release, i) => (
          <div key={release.version} style={{ display: 'flex', gap: 32, paddingBottom: 48, position: 'relative' }}>
            {i < releases.length - 1 && (
              <div style={{
                position: 'absolute', left: 55, top: 32, bottom: 0,
                width: 1, background: D.border,
              }} />
            )}

            {/* Version label */}
            <div style={{ width: 120, flexShrink: 0, paddingTop: 4, zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: D.t1 }}>{release.version}</span>
                {release.label && (
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '2px 7px',
                    background: D.greenDim, border: `1px solid ${D.greenBorder}`,
                    borderRadius: 4, color: D.green,
                  }}>
                    {release.label}
                  </span>
                )}
              </div>
              <span style={{ fontSize: 12, color: D.t3 }}>{release.date}</span>
            </div>

            {/* Changes */}
            <div style={{ flex: 1 }}>
              <div style={{
                background: D.surface, border: `1px solid ${D.border}`,
                borderRadius: 12, padding: '24px 28px',
              }}>
                <p style={{ fontSize: 14, color: D.t2, margin: '0 0 20px', lineHeight: 1.65 }}>
                  {release.summary}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                  {release.changes.map((c, j) => {
                    const ts = tagStyles[c.tc]
                    return (
                      <div key={j} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <span style={{
                          fontSize: 10, fontWeight: 700, padding: '3px 7px',
                          background: ts.bg, border: `1px solid ${ts.border}`,
                          borderRadius: 4, color: ts.color,
                          whiteSpace: 'nowrap', marginTop: 2,
                          letterSpacing: '0.05em', flexShrink: 0,
                        }}>
                          {c.tag.toUpperCase()}
                        </span>
                        <span style={{ fontSize: 13.5, color: D.t2, lineHeight: 1.65 }}>
                          {c.text}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Footer */}
        <div style={{
          borderTop: `1px solid ${D.border}`, paddingTop: 32,
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', flexWrap: 'wrap', gap: 12,
        }}>
          <span style={{ fontSize: 13, color: D.t3 }}>Found a bug or have feedback?</span>
          <Link href="/contact" style={{ fontSize: 13, color: D.teal, textDecoration: 'none', fontWeight: 600 }}>
            Contact us
          </Link>
        </div>
      </div>
    </div>
  )
}