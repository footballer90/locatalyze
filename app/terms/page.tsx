'use client'

export default function TermsPage() {
  const EFFECTIVE_DATE = '8 March 2025'
  const EMAIL = 'legal@locatalyze.com.au'

  const S = {
    page: { minHeight: '100vh', background: '#F9FAFB', fontFamily: "'DM Sans', sans-serif" },
    hero: { background: '#0C1F1C', borderBottom: '1px solid #1F2937', padding: '60px 0 48px' },
    heroInner: { maxWidth: '760px', margin: '0 auto', padding: '0 24px' },
    badge: { display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(15,118,110,0.15)', border: '1px solid rgba(15,118,110,0.3)', borderRadius: '20px', padding: '4px 12px', fontSize: '11px', fontWeight: '700', color: '#14B8A6', letterSpacing: '1px', textTransform: 'uppercase' as const, marginBottom: '20px' },
    heroTitle: { fontSize: '32px', fontWeight: '700', color: '#F9FAFB', letterSpacing: '-0.5px', marginBottom: '12px' },
    heroMeta: { fontSize: '14px', color: '#6B7280' },
    warningBox: { background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.3)', borderRadius: '10px', padding: '20px 24px', marginTop: '28px' },
    warningTitle: { fontSize: '14px', fontWeight: '700', color: '#D97706', marginBottom: '8px' },
    warningText: { fontSize: '14px', color: '#92400E', lineHeight: '1.6', margin: 0 },
    body: { maxWidth: '760px', margin: '0 auto', padding: '48px 24px 80px' },
    section: { marginBottom: '40px' },
    h2: { fontSize: '18px', fontWeight: '700', color: '#111827', marginBottom: '12px', paddingBottom: '10px', borderBottom: '1px solid #E5E7EB' },
    h3: { fontSize: '15px', fontWeight: '600', color: '#1F2937', marginBottom: '8px', marginTop: '20px' },
    p: { fontSize: '14.5px', color: '#374151', lineHeight: '1.75', marginBottom: '14px' },
    ul: { paddingLeft: '20px', marginBottom: '14px' },
    li: { fontSize: '14.5px', color: '#374151', lineHeight: '1.75', marginBottom: '6px' },
    redBox: { background: '#FEF2F2', border: '2px solid #FCA5A5', borderRadius: '10px', padding: '24px', margin: '24px 0' },
    redTitle: { fontSize: '15px', fontWeight: '700', color: '#DC2626', marginBottom: '12px' },
    redText: { fontSize: '14px', color: '#7F1D1D', lineHeight: '1.7', margin: 0 },
    blueBox: { background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '10px', padding: '20px 24px', margin: '20px 0' },
    blueText: { fontSize: '14px', color: '#1E40AF', lineHeight: '1.65', margin: 0 },
    contactBox: { background: '#F0FDFA', border: '1px solid #99F6E4', borderRadius: '10px', padding: '24px', marginTop: '32px' },
    contactTitle: { fontSize: '15px', fontWeight: '600', color: '#0F766E', marginBottom: '8px' },
    contactText: { fontSize: '14px', color: '#374151', lineHeight: '1.65', margin: 0 },
    link: { color: '#0F766E', fontWeight: '600' },
    toc: { background: '#F3F4F6', borderRadius: '10px', padding: '20px 24px', marginBottom: '40px' },
    tocTitle: { fontSize: '12px', fontWeight: '700', color: '#6B7280', letterSpacing: '1px', textTransform: 'uppercase' as const, marginBottom: '12px' },
    tocLink: { display: 'block', fontSize: '13.5px', color: '#0F766E', textDecoration: 'none', marginBottom: '6px' },
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={S.page}>

        {/* Hero */}
        <div style={S.hero}>
          <div style={S.heroInner}>
            <div style={S.badge}>Legal</div>
            <h1 style={S.heroTitle}>Terms of Service</h1>
            <p style={S.heroMeta}>Effective: {EFFECTIVE_DATE} · Governed by the laws of New South Wales, Australia</p>
            <div style={S.warningBox}>
              <div style={S.warningTitle}>⚠ Read before using Locatalyze</div>
              <p style={S.warningText}>
                Locatalyze provides <strong>indicative estimates only</strong>. It is not financial advice, business advice, or a guarantee of any business outcome. Always seek independent professional advice before signing any lease or making any commercial property decision.
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={S.body}>

          {/* TOC */}
          <div style={S.toc}>
            <p style={S.tocTitle}>Contents</p>
            {[
              ['#disclaimer', '1. Critical Disclaimer'],
              ['#service',    '2. About the Service'],
              ['#acceptance', '3. Acceptance of Terms'],
              ['#eligibility','4. Eligibility'],
              ['#account',    '5. Account Responsibilities'],
              ['#payments',   '6. Payments and Refunds'],
              ['#ip',         '7. Intellectual Property'],
              ['#liability',  '8. Limitation of Liability'],
              ['#acl',        '9. Australian Consumer Law'],
              ['#privacy',    '10. Privacy'],
              ['#termination','11. Termination'],
              ['#governing',  '12. Governing Law'],
              ['#contact',    '13. Contact Us'],
            ].map(([href, label]) => (
              <a key={href} href={href} style={S.tocLink}>{label}</a>
            ))}
          </div>

          {/* 1 */}
          <div id="disclaimer" style={S.section}>
            <h2 style={S.h2}>1. Critical Disclaimer — Read This First</h2>
            <div style={S.redBox}>
              <div style={S.redTitle}>⛔ Not Financial or Business Advice</div>
              <p style={S.redText}>All reports, scores, verdicts, financial projections, competitor data, and outputs produced by Locatalyze are indicative estimates only and do not constitute financial, investment, or business advice.</p>
            </div>
            <ul style={S.ul}>
              <li style={S.li}>Are <strong>not financial advice</strong> under the Corporations Act 2001 (Cth)</li>
              <li style={S.li}>Are <strong>not a recommendation</strong> to enter any lease or commercial arrangement</li>
              <li style={S.li}>Are <strong>not a guarantee</strong> of business success or profitability</li>
              <li style={S.li}>Are based on <strong>publicly available data and AI-generated text</strong> that may contain errors</li>
              <li style={S.li}><strong>Cannot replace</strong> advice from a qualified accountant, solicitor, or financial planner</li>
              <li style={S.li}>May not account for local zoning laws, licensing, or conditions specific to your situation</li>
            </ul>
            <p style={{ ...S.p, fontWeight: '600' }}>
              By using Locatalyze, you acknowledge that any commercial decision you make is entirely your own responsibility. Locatalyze accepts no liability for any loss arising from your reliance on its outputs.
            </p>
            <div style={S.blueBox}>
              <p style={S.blueText}><strong>We strongly recommend</strong> consulting a qualified accountant, commercial solicitor, and business adviser before signing any lease or committing to a business location.</p>
            </div>
          </div>

          {/* 2 */}
          <div id="service" style={S.section}>
            <h2 style={S.h2}>2. About the Service</h2>
            <p style={S.p}>Locatalyze operates an online location feasibility analysis platform. The platform uses publicly available geographic data, algorithmic financial modelling, and artificial intelligence to generate indicative feasibility reports for commercial locations in Australia.</p>
            <p style={S.p}>Data sources include Nominatim/OpenStreetMap (geocoding), Geoapify (competitor proximity), Australian Bureau of Statistics (demographic estimates), and OpenAI GPT-4o-mini (AI-generated analysis text). These sources may be incomplete, outdated, or inaccurate.</p>
          </div>

          {/* 3 */}
          <div id="acceptance" style={S.section}>
            <h2 style={S.h2}>3. Acceptance of Terms</h2>
            <p style={S.p}>By creating an account or using the Platform, you agree to these Terms and our Privacy Policy. We may update these Terms and will notify you of material changes by email or notice on the Platform.</p>
          </div>

          {/* 4 */}
          <div id="eligibility" style={S.section}>
            <h2 style={S.h2}>4. Eligibility</h2>
            <ul style={S.ul}>
              <li style={S.li}>Must be at least 18 years of age</li>
              <li style={S.li}>Must be located in Australia or evaluating an Australian business location</li>
              <li style={S.li}>Must have legal capacity to enter a binding agreement</li>
            </ul>
          </div>

          {/* 5 */}
          <div id="account" style={S.section}>
            <h2 style={S.h2}>5. Account Responsibilities</h2>
            <p style={S.p}>You are responsible for maintaining the confidentiality of your account credentials, all activity under your account, providing accurate information, and using the Platform only for lawful purposes. You must not use the Platform to generate reports for fraudulent purposes or to mislead third parties.</p>
          </div>

          {/* 6 */}
          <div id="payments" style={S.section}>
            <h2 style={S.h2}>6. Payments and Refunds</h2>
            <h3 style={S.h3}>Free tier</h3>
            <p style={S.p}>Free accounts receive a limited number of analyses. Free tier limits do not reset upon report deletion.</p>
            <h3 style={S.h3}>Paid plans</h3>
            <p style={S.p}>Paid subscriptions are billed in Australian Dollars (AUD) inclusive of GST. Payments are processed securely by Stripe. We do not store card details.</p>
            <h3 id="refunds" style={S.h3}>Refund policy</h3>
            <p style={S.p}>All sales are generally final once a report has been generated. We comply with the Australian Consumer Law (ACL). If the service has a major failure under the ACL, you are entitled to a remedy including a refund. Contact us at <a href={`mailto:${EMAIL}`} style={S.link}>{EMAIL}</a> within 7 days if you are unsatisfied. Lifetime plan purchases are non-refundable after 14 days except where required by law.</p>
          </div>

          {/* 7 */}
          <div id="ip" style={S.section}>
            <h2 style={S.h2}>7. Intellectual Property</h2>
            <p style={S.p}>The Platform, including its software, algorithms, design, methodology, and branding, is owned by Locatalyze and protected by Australian copyright law. Reports are licensed to you for personal and internal business use only. You may not resell or publicly distribute report outputs without written permission.</p>
          </div>

          {/* 8 */}
          <div id="liability" style={S.section}>
            <h2 style={S.h2}>8. Limitation of Liability</h2>
            <div style={S.redBox}>
              <div style={S.redTitle}>⛔ Important</div>
              <p style={S.redText}>To the maximum extent permitted by law, Locatalyze and its directors, employees, agents, and affiliates will not be liable for any loss of profits, revenue, business opportunity, data, or any indirect or consequential loss arising from your use of or reliance on the Platform or any report generated by it.</p>
            </div>
            <p style={S.p}>Our total aggregate liability will not exceed the total amount you paid us in the 12 months preceding the claim. We are not liable for business failure, financial loss, or lease commitments entered into following use of the Platform.</p>
          </div>

          {/* 9 */}
          <div id="acl" style={S.section}>
            <h2 style={S.h2}>9. Australian Consumer Law</h2>
            <p style={S.p}>Nothing in these Terms excludes, restricts, or modifies any right or remedy that cannot lawfully be excluded under the Australian Consumer Law (Schedule 2 to the Competition and Consumer Act 2010 (Cth)). Where ACL guarantees apply and are not met, you may be entitled to a remedy.</p>
          </div>

          {/* 10 */}
          <div id="privacy" style={S.section}>
            <h2 style={S.h2}>10. Privacy</h2>
            <p style={S.p}>Your use of the Platform is governed by our <a href="/privacy" style={S.link}>Privacy Policy</a>, incorporated into these Terms by reference.</p>
          </div>

          {/* 11 */}
          <div id="termination" style={S.section}>
            <h2 style={S.h2}>11. Termination</h2>
            <p style={S.p}>We may suspend or terminate your account if you breach these Terms or engage in unlawful activity. You may close your account at any time by contacting <a href={`mailto:${EMAIL}`} style={S.link}>{EMAIL}</a>.</p>
          </div>

          {/* 12 */}
          <div id="governing" style={S.section}>
            <h2 style={S.h2}>12. Governing Law</h2>
            <p style={S.p}>These Terms are governed by the laws of New South Wales, Australia. You agree to the non-exclusive jurisdiction of the courts of New South Wales. Before commencing legal proceedings, contact us to attempt informal resolution within 30 days.</p>
          </div>

          {/* 13 */}
          <div id="contact" style={S.section}>
            <h2 style={S.h2}>13. Contact Us</h2>
            <div style={S.contactBox}>
              <p style={S.contactTitle}>Locatalyze</p>
              <p style={S.contactText}>
                Email: <a href={`mailto:${EMAIL}`} style={S.link}>{EMAIL}</a><br />
                Australia · Governing jurisdiction: New South Wales
              </p>
            </div>
          </div>

          <p style={{ ...S.p, color: '#9CA3AF', fontSize: '12.5px', marginTop: '40px' }}>
            Last updated: {EFFECTIVE_DATE}. Previous versions available on request.
          </p>
        </div>
      </div>
    </>
  )
}