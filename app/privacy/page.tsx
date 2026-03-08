'use client'

export default function PrivacyPage() {
  const EFFECTIVE_DATE = '8 March 2025'
  const EMAIL = 'privacy@locatalyze.com.au'

  const S = {
    page: { minHeight: '100vh', background: '#F9FAFB', fontFamily: "'DM Sans', sans-serif" },
    hero: { background: '#0C1F1C', borderBottom: '1px solid #1F2937', padding: '60px 0 48px' },
    heroInner: { maxWidth: '760px', margin: '0 auto', padding: '0 24px' },
    badge: { display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(15,118,110,0.15)', border: '1px solid rgba(15,118,110,0.3)', borderRadius: '20px', padding: '4px 12px', fontSize: '11px', fontWeight: '700', color: '#14B8A6', letterSpacing: '1px', textTransform: 'uppercase' as const, marginBottom: '20px' },
    heroTitle: { fontSize: '32px', fontWeight: '700', color: '#F9FAFB', letterSpacing: '-0.5px', marginBottom: '12px' },
    heroMeta: { fontSize: '14px', color: '#6B7280' },
    greenBox: { background: 'rgba(15,118,110,0.1)', border: '1px solid rgba(15,118,110,0.25)', borderRadius: '10px', padding: '20px 24px', marginTop: '28px' },
    greenText: { fontSize: '14px', color: '#99F6E4', lineHeight: '1.65', margin: 0 },
    body: { maxWidth: '760px', margin: '0 auto', padding: '48px 24px 80px' },
    section: { marginBottom: '40px' },
    h2: { fontSize: '18px', fontWeight: '700', color: '#111827', marginBottom: '12px', paddingBottom: '10px', borderBottom: '1px solid #E5E7EB' },
    h3: { fontSize: '15px', fontWeight: '600', color: '#1F2937', marginBottom: '8px', marginTop: '20px' },
    p: { fontSize: '14.5px', color: '#374151', lineHeight: '1.75', marginBottom: '14px' },
    ul: { paddingLeft: '20px', marginBottom: '14px' },
    li: { fontSize: '14.5px', color: '#374151', lineHeight: '1.75', marginBottom: '6px' },
    table: { width: '100%', borderCollapse: 'collapse' as const, marginBottom: '20px', fontSize: '14px' },
    th: { background: '#F3F4F6', padding: '10px 14px', textAlign: 'left' as const, fontWeight: '600', color: '#374151', borderBottom: '2px solid #E5E7EB', fontSize: '12px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' },
    td: { padding: '10px 14px', color: '#374151', borderBottom: '1px solid #F3F4F6', verticalAlign: 'top' as const },
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
            <h1 style={S.heroTitle}>Privacy Policy</h1>
            <p style={S.heroMeta}>Effective: {EFFECTIVE_DATE} · Complies with the Privacy Act 1988 (Cth) and Australian Privacy Principles</p>
            <div style={S.greenBox}>
              <p style={S.greenText}>We collect minimal data, never sell it, and give you full control. This policy explains what we collect, why, and how to request deletion.</p>
            </div>
          </div>
        </div>

        <div style={S.body}>

          {/* TOC */}
          <div style={S.toc}>
            <p style={S.tocTitle}>Contents</p>
            {[
              ['#who',        '1. Who We Are'],
              ['#collection', '2. What We Collect'],
              ['#why',        '3. Why We Collect It'],
              ['#thirdparty', '4. Third-Party Services'],
              ['#storage',    '5. Data Storage & Security'],
              ['#retention',  '6. Data Retention'],
              ['#disclosure', '7. Disclosure'],
              ['#rights',     '8. Your Rights'],
              ['#cookies',    '9. Cookies & Analytics'],
              ['#children',   '10. Children\'s Privacy'],
              ['#overseas',   '11. Overseas Disclosure'],
              ['#complaints', '12. Complaints & Contact'],
            ].map(([href, label]) => (
              <a key={href} href={href} style={S.tocLink}>{label}</a>
            ))}
          </div>

          {/* 1 */}
          <div id="who" style={S.section}>
            <h2 style={S.h2}>1. Who We Are</h2>
            <p style={S.p}>Locatalyze operates the location feasibility analysis platform at locatalyze.vercel.app. We are an Australian-based software company committed to protecting your personal information in accordance with the Privacy Act 1988 (Cth) and the 13 Australian Privacy Principles (APPs).</p>
          </div>

          {/* 2 */}
          <div id="collection" style={S.section}>
            <h2 style={S.h2}>2. What We Collect</h2>
            <h3 style={S.h3}>Information you provide</h3>
            <table style={S.table}>
              <thead><tr><th style={S.th}>Data</th><th style={S.th}>When collected</th></tr></thead>
              <tbody>
                {[
                  ['Email address', 'Account creation'],
                  ['Password (hashed — never stored in plain text)', 'Account creation'],
                  ['Business type, address, rent, budget, ticket size', 'When you run an analysis'],
                  ['Name (optional)', 'Profile settings'],
                  ['Payment details', 'Processed by Stripe — we never see your card number'],
                ].map(([data, when]) => (
                  <tr key={data}><td style={S.td}>{data}</td><td style={S.td}>{when}</td></tr>
                ))}
              </tbody>
            </table>
            <h3 style={S.h3}>Collected automatically</h3>
            <ul style={S.ul}>
              <li style={S.li}>IP address and approximate location (city/region level)</li>
              <li style={S.li}>Browser type, device type, and operating system</li>
              <li style={S.li}>Pages visited and features used (anonymised analytics)</li>
              <li style={S.li}>Error logs for debugging</li>
            </ul>
            <h3 style={S.h3}>What we do NOT collect</h3>
            <ul style={S.ul}>
              <li style={S.li}>Government identifiers (TFN, ABN, driver's licence)</li>
              <li style={S.li}>Health or sensitive information</li>
              <li style={S.li}>Information about children under 18</li>
              <li style={S.li}>Biometric data</li>
            </ul>
          </div>

          {/* 3 */}
          <div id="why" style={S.section}>
            <h2 style={S.h2}>3. Why We Collect It</h2>
            <table style={S.table}>
              <thead><tr><th style={S.th}>Purpose</th><th style={S.th}>Lawful basis</th></tr></thead>
              <tbody>
                {[
                  ['Create and manage your account', 'Contract performance'],
                  ['Generate your location analysis reports', 'Contract performance'],
                  ['Process payments', 'Contract performance'],
                  ['Send transactional emails', 'Contract performance'],
                  ['Respond to support queries', 'Legitimate interest'],
                  ['Improve the platform and fix bugs', 'Legitimate interest'],
                  ['Send product updates (opt-out available)', 'Consent'],
                  ['Comply with legal obligations', 'Legal obligation'],
                ].map(([purpose, basis]) => (
                  <tr key={purpose}><td style={S.td}>{purpose}</td><td style={S.td}>{basis}</td></tr>
                ))}
              </tbody>
            </table>
            <p style={{ ...S.p, fontWeight: '600' }}>We will never sell your personal information to third parties. Ever.</p>
          </div>

          {/* 4 */}
          <div id="thirdparty" style={S.section}>
            <h2 style={S.h2}>4. Third-Party Services</h2>
            <table style={S.table}>
              <thead><tr><th style={S.th}>Service</th><th style={S.th}>Purpose</th><th style={S.th}>Data shared</th></tr></thead>
              <tbody>
                {[
                  ['Supabase',             'Database & authentication',    'Email, hashed password, report data'],
                  ['Vercel',               'Hosting & infrastructure',     'IP address, server logs'],
                  ['Stripe',               'Payment processing',           'Payment details (we never see card numbers)'],
                  ['OpenAI',               'AI-generated analysis text',   'Business type, address, financial inputs'],
                  ['Geoapify',             'Competitor proximity data',    'Latitude/longitude of analysed address'],
                  ['Nominatim/OpenStreetMap','Address geocoding',          'Address submitted for analysis'],
                ].map(([service, purpose, data]) => (
                  <tr key={service}><td style={{ ...S.td, fontWeight: '500' }}>{service}</td><td style={S.td}>{purpose}</td><td style={S.td}>{data}</td></tr>
                ))}
              </tbody>
            </table>
            <div style={S.blueBox}>
              <p style={S.blueText}><strong>OpenAI note:</strong> When you run an analysis, your address, business type, and financial inputs are sent to OpenAI's API. OpenAI may retain this for up to 30 days for abuse monitoring. We do not send your name, email, or account details to OpenAI.</p>
            </div>
          </div>

          {/* 5 */}
          <div id="storage" style={S.section}>
            <h2 style={S.h2}>5. Data Storage and Security</h2>
            <p style={S.p}>Your data is stored in Supabase's managed database infrastructure using industry-standard encryption at rest and in transit (TLS 1.2+). If we become aware of a data breach likely to cause serious harm, we will notify the Office of the Australian Information Commissioner (OAIC) and affected individuals under the Notifiable Data Breaches scheme.</p>
          </div>

          {/* 6 */}
          <div id="retention" style={S.section}>
            <h2 style={S.h2}>6. Data Retention</h2>
            <ul style={S.ul}>
              <li style={S.li}><strong>Account data</strong> — retained while active and 90 days after deletion</li>
              <li style={S.li}><strong>Report data</strong> — deleted when you delete a report or close your account</li>
              <li style={S.li}><strong>Payment records</strong> — 7 years as required by Australian taxation law</li>
              <li style={S.li}><strong>Server logs</strong> — 30 days for security and debugging</li>
            </ul>
          </div>

          {/* 7 */}
          <div id="disclosure" style={S.section}>
            <h2 style={S.h2}>7. Disclosure of Personal Information</h2>
            <p style={S.p}>We only disclose your personal information to third-party service providers as listed above, where required by Australian law, to protect the rights or safety of Locatalyze or others, or in connection with a business sale where the acquirer agrees to be bound by this policy.</p>
            <p style={{ ...S.p, fontWeight: '600' }}>We will never sell, rent, or trade your personal information for marketing purposes.</p>
          </div>

          {/* 8 */}
          <div id="rights" style={S.section}>
            <h2 style={S.h2}>8. Your Rights Under Australian Privacy Law</h2>
            <ul style={S.ul}>
              <li style={S.li}><strong>Access</strong> — request a copy of information we hold about you</li>
              <li style={S.li}><strong>Correction</strong> — request correction of inaccurate information</li>
              <li style={S.li}><strong>Deletion</strong> — request deletion of your account and personal information</li>
              <li style={S.li}><strong>Opt-out</strong> — unsubscribe from marketing at any time</li>
              <li style={S.li}><strong>Complaint</strong> — lodge a complaint with us or the OAIC</li>
            </ul>
            <p style={S.p}>Contact <a href={`mailto:${EMAIL}`} style={S.link}>{EMAIL}</a> to exercise any right. We respond within 30 days.</p>
          </div>

          {/* 9 */}
          <div id="cookies" style={S.section}>
            <h2 style={S.h2}>9. Cookies and Analytics</h2>
            <p style={S.p}>We use strictly necessary cookies to maintain your login session. We do not use advertising cookies or third-party tracking cookies. Any analytics tools are configured to anonymise IP addresses and not collect personally identifiable information.</p>
          </div>

          {/* 10 */}
          <div id="children" style={S.section}>
            <h2 style={S.h2}>10. Children's Privacy</h2>
            <p style={S.p}>The Platform is not directed to individuals under 18. We do not knowingly collect personal information from children. If we become aware of such collection, we will delete it promptly.</p>
          </div>

          {/* 11 */}
          <div id="overseas" style={S.section}>
            <h2 style={S.h2}>11. Overseas Disclosure</h2>
            <p style={S.p}>Some third-party providers (including Vercel, OpenAI, and Stripe) are based in the United States. By using the Platform, you consent to this transfer. Before disclosing to overseas recipients, we take reasonable steps to ensure compliance with the Australian Privacy Principles as required by APP 8.</p>
          </div>

          {/* 12 */}
          <div id="complaints" style={S.section}>
            <h2 style={S.h2}>12. Complaints and Contact</h2>
            <p style={S.p}>If you have a complaint about how we handle your personal information, please contact our Privacy Officer first. We aim to resolve all complaints within 30 days.</p>
            <div style={S.contactBox}>
              <p style={S.contactTitle}>Privacy Officer — Locatalyze</p>
              <p style={S.contactText}>
                Email: <a href={`mailto:${EMAIL}`} style={S.link}>{EMAIL}</a><br />
                Australia<br /><br />
                If unsatisfied with our response, you may lodge a complaint with the OAIC:<br />
                <strong>oaic.gov.au/privacy/privacy-complaints</strong><br />
                Phone: 1300 363 992
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