import Link from 'next/link'

const S = {
 brand: '#0F766E', brandLight: '#14B8A6', brandFaded: '#F0FDFA', brandBorder: '#99F6E4',
 n50: '#FAFAF9', n100: '#F5F5F4', n200: '#E7E5E4', n400: '#A8A29E', n500: '#78716C',
 n700: '#44403C', n800: '#292524', n900: '#1C1917', white: '#FFFFFF',
 emerald: '#059669', emeraldBg: '#ECFDF5', emeraldBdr: '#A7F3D0',
 headerBg: '#0C1F1C', font: "'DM Sans', sans-serif",
}

export default function RefundPage() {
 return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
   <div style={{ minHeight: '100vh', background: S.n50, fontFamily: S.font }}>

    <div style={{ background: S.headerBg, padding: '60px 24px 48px', textAlign: 'center' }}>
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
            <span style={{ color: '#F9FAFB' }}>Refund policy</span>
          </nav>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(15,118,110,0.15)', border: '1px solid rgba(15,118,110,0.3)', borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700, color: S.brandLight, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 16 }}>Legal</div>
     <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#F9FAFB', letterSpacing: '-0.5px', marginBottom: 12 }}>Refund Policy</h1>
     <p style={{ fontSize: 13, color: '#6B7280' }}>Last updated: 1 March 2026</p>
    </div>

        <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 80px' }}>

     {/* Summary cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 48 }}>
      {[
              { icon: '', title: '7-day refund', desc: 'Full refund within 7 days if no reports run' },
       { icon: '', title: 'Report issues', desc: 'Credit or refund for clearly broken reports' },
       { icon: '', title: 'No gaming', desc: 'Refunds not available after reports are generated' },
       { icon: '', title: 'Contact us', desc: 'hello@locatalyze.com.au for any billing issues' },
      ].map(c => (
              <div key={c.title} style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 12, padding: '20px', textAlign: 'center' }}>
        <span style={{ fontSize: 28, display: 'block', marginBottom: 8 }}>{c.icon}</span>
        <p style={{ fontSize: 13, fontWeight: 700, color: S.n900, marginBottom: 4 }}>{c.title}</p>
                <p style={{ fontSize: 12, color: S.n500, lineHeight: 1.5 }}>{c.desc}</p>
              </div>
            ))}
          </div>

          {[
            {
              title: '1. Our commitment',
       body: `We want you to be satisfied with Locatalyze. This Refund Policy explains when refunds are available and how to request one. It is designed to be fair to both users and to the platform.\n\nThis policy is in addition to, and does not limit, your rights under the Australian Consumer Law (ACL).`,
            },
            {
              title: '2. Pro Monthly — refund eligibility',
       body: `You may request a full refund of your most recent monthly charge if:\n\n• The refund request is made within 7 days of the charge, AND\n• You have not generated any reports during the billing period\n\nIf you have generated one or more reports, the charge is non-refundable as the service has been delivered.\n\nYou may cancel your subscription at any time. Cancellation stops future charges. It does not entitle you to a refund of the current period.`,
            },
            {
              title: '3. Report packs — refund eligibility',
       body: `You may request a full refund of a report pack purchase if:\n\n• The refund request is made within 7 days of purchase, AND\n• No reports have been generated against the pack\n\nOnce a report has been generated from a pack, that credit is consumed and non-refundable.`,
            },
            {
              title: '4. Report quality issues',
       body: `If a report you have generated is clearly broken — for example, it returned entirely blank results, failed to process your address, or contains obvious technical errors — contact us within 14 days and we will either:\n\n• Re-run the analysis at no cost, OR\n• Issue a partial or full credit to your account, OR\n• Issue a refund for that analysis\n\nWe do not offer refunds because you disagree with the GO/CAUTION/NO verdict, or because the financial projections differ from your expectations. Reports are estimates — not guarantees.`,
            },
            {
              title: '5. Australian Consumer Law',
       body: `Our services come with guarantees that cannot be excluded under the Australian Consumer Law. You are entitled to a replacement or refund for a major failure, and compensation for any other reasonably foreseeable loss or damage. You are also entitled to have the services remedied if they fail to be of acceptable quality.\n\nNothing in this policy excludes your statutory rights under the ACL.`,
            },
            {
              title: '6. How to request a refund',
       body: `Email hello@locatalyze.com.au with:\n\n• Your account email address\n• The date of your purchase or charge\n• A brief reason for your request\n\nWe aim to respond within 2 business days. Approved refunds are processed via the original payment method (Stripe) and typically appear within 5–10 business days.`,
            },
          ].map(section => (
            <div key={section.title} style={{ marginBottom: 36 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: S.n900, marginBottom: 10 }}>{section.title}</h2>
              <div style={{ fontSize: 14, color: S.n500, lineHeight: 1.85, whiteSpace: 'pre-line' }}>{section.body}</div>
      </div>
          ))}

          <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: '20px 24px', marginBottom: 32 }}>
      <p style={{ fontSize: 14, color: S.emerald, fontWeight: 700, marginBottom: 6 }}> Have a billing issue?</p>
            <p style={{ fontSize: 14, color: '#065F46', lineHeight: 1.65 }}>Email us at <a href="mailto:hello@locatalyze.com.au" style={{ color: S.emerald, fontWeight: 700 }}>hello@locatalyze.com.au</a>. We are a small team and we handle every request personally.</p>
     </div>

          <div style={{ borderTop: `1px solid ${S.n200}`, paddingTop: 28, display: 'flex', gap: 20, flexWrap: 'wrap' }}>
      <Link href="/terms"   style={{ fontSize: 13, color: S.brand, fontWeight: 600, textDecoration: 'none' }}>Terms of Service</Link>
      <Link href="/privacy"  style={{ fontSize: 13, color: S.brand, fontWeight: 600, textDecoration: 'none' }}>Privacy Policy</Link>
      <Link href="/disclaimer" style={{ fontSize: 13, color: S.brand, fontWeight: 600, textDecoration: 'none' }}>Disclaimer</Link>
      <Link href="/contact"  style={{ fontSize: 13, color: S.brand, fontWeight: 600, textDecoration: 'none' }}>Contact Us</Link>
     </div>
        </div>
      </div>
    </>
  )
}