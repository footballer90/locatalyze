'use client'
export const dynamic = 'force-dynamic'
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
    icon: '🚀',
    items: [
      { q: 'How do I run my first analysis?', a: 'Go to the Dashboard and click "New Analysis". Enter any Australian street address, select your business type, fill in your monthly rent and budget, then click Run Analysis. Your report is ready in 20–40 seconds.' },
      { q: 'Do I need a credit card to sign up?', a: 'No. The free plan gives you 3 full reports with no credit card required. You only need to add a payment method when you upgrade to Pro.' },
      { q: 'What does the free plan include?', a: 'The free plan includes 3 complete location analyses, each with a full financial model, GO/CAUTION/NO verdict, SWOT analysis, competitor data, and 3-year projection.' },
      { q: 'How accurate are the reports?', a: 'Reports are indicative estimates based on real data — competitor locations from OpenStreetMap, ABS demographics, and market rent benchmarks. They are a starting point for your research, not a guarantee. Always verify with local professionals before signing a lease.' },
    ],
  },
  {
    category: 'Understanding your report',
    icon: '📊',
    items: [
      { q: 'What does the location score mean?', a: 'The score (0–100) is a weighted composite of four factors: demand/demographics (30%), rent affordability (25%), competition intensity (25%), and projected profitability (20%). Scores above 70 are generally GO territory.' },
      { q: 'What is the GO / CAUTION / NO verdict?', a: 'GO means the location looks viable under your inputs. CAUTION means proceed carefully — there are risk factors worth addressing. NO means the numbers do not stack up at the current rent or competition level.' },
      { q: 'Why is my rent-to-revenue ratio important?', a: 'Rent should ideally be under 12% of monthly revenue. Above 15% is a warning. Above 20% is a serious risk — very few businesses survive with rent that high relative to revenue.' },
      { q: 'What does the break-even calculation show?', a: 'It shows how many customers per day you need to cover all costs. Your actual daily customer count (from the demographics model) is compared against this number to show whether you are above or below break-even.' },
      { q: 'How is the competitor data collected?', a: 'We use the Geoapify Places API to find businesses within 500m of your address that match your business category. The data comes from OpenStreetMap and is updated regularly.' },
    ],
  },
  {
    category: 'Account & billing',
    icon: '💳',
    items: [
      { q: 'How do I upgrade to Pro?', a: 'Go to Dashboard → click "Upgrade" or visit the Pricing page. You can choose monthly ($19/month) or lifetime ($49 one-time). Payment is processed securely by Stripe.' },
      { q: 'Can I cancel my subscription?', a: 'Yes, you can cancel anytime from your Profile page. You keep Pro access until the end of your billing period. No questions asked.' },
      { q: 'Do deleted reports restore my quota?', a: 'No. The free plan quota counts analyses run, not reports stored. Deleting a report does not restore your quota. This prevents quota gaming.' },
      { q: 'What is the lifetime plan?', a: 'A one-time payment of $49 AUD that gives you unlimited reports forever. No recurring charges, no subscription to cancel.' },
      { q: 'Can I get a refund?', a: 'We offer refunds within 7 days of purchase if no reports have been generated. For issues with specific reports, contact us at hello@locatalyze.com.au and we will work to resolve it.' },
    ],
  },
  {
    category: 'Technical',
    icon: '⚙️',
    items: [
      { q: 'Why is my report taking a long time?', a: 'Reports normally take 20–40 seconds. If it takes longer, the AI analysis step may be slow. Wait up to 90 seconds before refreshing. If it fails, try again — the second attempt almost always succeeds.' },
      { q: 'Can I analyse locations outside Australia?', a: 'Currently Locatalyze is built specifically for Australian locations. The demographics data, rent benchmarks, and competitor categories are all calibrated for the Australian market.' },
      { q: 'Can I download my report?', a: 'PDF download is available on all plans. Click the Download button on any report page. The PDF includes all sections: financials, scores, SWOT, and 3-year projection.' },
      { q: 'Is my data private?', a: 'Yes. Your reports are private to your account by default. You can optionally share a report via a public link. We never sell your data. See our Privacy Policy for full details.' },
    ],
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: `1px solid ${S.n100}` }}>
      <button onClick={() => setOpen(!open)}
        style={{ width: '100%', padding: '16px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', fontFamily: S.font, textAlign: 'left', gap: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: S.n800, lineHeight: 1.5 }}>{q}</span>
        <span style={{ color: S.brand, fontSize: 18, fontWeight: 700, flexShrink: 0, transform: open ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s', display: 'inline-block' }}>+</span>
      </button>
      {open && (
        <div style={{ paddingBottom: 16, fontSize: 14, color: S.n500, lineHeight: 1.75 }}>{a}</div>
      )}
    </div>
  )
}

export default function HelpPage() {
  const [search, setSearch] = useState('')

  const filtered = FAQS.map(cat => ({
    ...cat,
    items: cat.items.filter(item =>
      !search || item.q.toLowerCase().includes(search.toLowerCase()) || item.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(cat => cat.items.length > 0)

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <div style={{ minHeight: '100vh', background: S.n50, fontFamily: S.font }}>

        {/* Hero */}
        <div style={{ background: S.headerBg, padding: '60px 24px 48px', textAlign: 'center' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 32 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg,${S.brand},${S.brandLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 13 }}>L</div>
            <span style={{ fontWeight: 800, fontSize: 15, color: '#F9FAFB', letterSpacing: '-0.02em' }}>Locatalyze</span>
          </Link>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(15,118,110,0.15)', border: '1px solid rgba(15,118,110,0.3)', borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700, color: S.brandLight, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 16 }}>Help Centre</div>
          <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#F9FAFB', letterSpacing: '-0.5px', marginBottom: 20 }}>How can we help?</h1>
          {/* Search */}
          <div style={{ maxWidth: 480, margin: '0 auto', position: 'relative' }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search questions..."
              style={{ width: '100%', padding: '13px 14px 13px 40px', borderRadius: 12, border: 'none', fontSize: 14, fontFamily: S.font, outline: 'none', color: S.n900, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }} />
          </div>
        </div>

        <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 80px' }}>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p style={{ fontSize: 32, marginBottom: 12 }}>🤔</p>
              <p style={{ fontSize: 16, color: S.n500 }}>No results for "{search}"</p>
              <Link href="/contact" style={{ display: 'inline-block', marginTop: 16, fontSize: 14, color: S.brand, fontWeight: 700 }}>Ask us directly →</Link>
            </div>
          )}

          {filtered.map(cat => (
            <div key={cat.category} style={{ marginBottom: 48 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <span style={{ fontSize: 22 }}>{cat.icon}</span>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: S.n900 }}>{cat.category}</h2>
              </div>
              <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 14, padding: '0 24px' }}>
                {cat.items.map(item => <FAQItem key={item.q} q={item.q} a={item.a} />)}
              </div>
            </div>
          ))}

          {/* CTA */}
          <div style={{ background: S.brandFaded, border: `1px solid ${S.brandBorder}`, borderRadius: 14, padding: '28px 32px', textAlign: 'center', marginTop: 20 }}>
            <p style={{ fontSize: 18, fontWeight: 700, color: S.n900, marginBottom: 8 }}>Still have questions?</p>
            <p style={{ fontSize: 14, color: S.n500, marginBottom: 20 }}>Our team responds within 24 hours on business days.</p>
            <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: S.brand, color: '#fff', borderRadius: 10, padding: '11px 24px', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
              Contact us →
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}