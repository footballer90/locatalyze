'use client'


export default function PrivacyPageClient() {
  const EFFECTIVE_DATE = '20 April 2026'
  const EMAIL = 'privacy@locatalyze.com.au'

  const S = {
    page: {
      minHeight: '100vh',
      background: '#F9FAFB',
      fontFamily: "'DM Sans', sans-serif",
    },
    hero: {
      background: '#0C1F1C',
      borderBottom: '1px solid #1F2937',
      padding: '60px 0 48px',
    },
    heroInner: {
      maxWidth: '760px',
      margin: '0 auto',
      padding: '0 24px',
    },
    badge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      background: 'rgba(15,118,110,0.15)',
      border: '1px solid rgba(15,118,110,0.3)',
      borderRadius: '20px',
      padding: '4px 12px',
      fontSize: '11px',
      fontWeight: '700',
      color: '#14B8A6',
      letterSpacing: '1px',
      textTransform: 'uppercase' as const,
      marginBottom: '20px',
    },
    heroTitle: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#F9FAFB',
      letterSpacing: '-0.5px',
      marginBottom: '12px',
    },
    heroMeta: {
      fontSize: '14px',
      color: '#6B7280',
    },
    infoBox: {
      background: 'rgba(15,118,110,0.1)',
      border: '1px solid rgba(15,118,110,0.25)',
      borderRadius: '10px',
      padding: '20px 24px',
      marginTop: '28px',
    },
    infoText: {
      fontSize: '14px',
      color: '#99F6E4',
      lineHeight: 1.65,
      margin: 0,
    },
    body: {
      maxWidth: '760px',
      margin: '0 auto',
      padding: '48px 24px 80px',
    },
    section: {
      marginBottom: '40px',
    },
    h2: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#111827',
      marginBottom: '12px',
      paddingBottom: '10px',
      borderBottom: '1px solid #E5E7EB',
    },
    h3: {
      fontSize: '15px',
      fontWeight: '600',
      color: '#1F2937',
      marginBottom: '8px',
      marginTop: '20px',
    },
    p: {
      fontSize: '14.5px',
      color: '#374151',
      lineHeight: 1.75,
      marginBottom: '14px',
    },
    ul: {
      paddingLeft: '20px',
      marginBottom: '14px',
    },
    li: {
      fontSize: '14.5px',
      color: '#374151',
      lineHeight: 1.75,
      marginBottom: '6px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse' as const,
      marginBottom: '20px',
      fontSize: '14px',
    },
    th: {
      background: '#F3F4F6',
      padding: '10px 14px',
      textAlign: 'left' as const,
      fontWeight: '600',
      color: '#374151',
      borderBottom: '2px solid #E5E7EB',
      fontSize: '12px',
      letterSpacing: '0.5px',
      textTransform: 'uppercase' as const,
    },
    td: {
      padding: '10px 14px',
      color: '#374151',
      borderBottom: '1px solid #F3F4F6',
      verticalAlign: 'top' as const,
    },
    highlightBox: {
      background: '#EFF6FF',
      border: '1px solid #BFDBFE',
      borderRadius: '10px',
      padding: '20px 24px',
      margin: '20px 0',
    },
    highlightText: {
      fontSize: '14px',
      color: '#1E40AF',
      lineHeight: 1.65,
      margin: 0,
    },
    contactBox: {
      background: '#F0FDFA',
      border: '1px solid #99F6E4',
      borderRadius: '10px',
      padding: '24px',
      marginTop: '40px',
    },
    contactTitle: {
      fontSize: '15px',
      fontWeight: '600',
      color: '#0F766E',
      marginBottom: '8px',
    },
    contactText: {
      fontSize: '14px',
      color: '#374151',
      lineHeight: 1.65,
    },
    emailLink: {
      color: '#0F766E',
      fontWeight: '600',
    },
    toc: {
      background: '#F3F4F6',
      borderRadius: '10px',
      padding: '20px 24px',
      marginBottom: '40px',
    },
    tocTitle: {
      fontSize: '12px',
      fontWeight: '700',
      color: '#6B7280',
      letterSpacing: '1px',
      textTransform: 'uppercase' as const,
      marginBottom: '12px',
    },
    tocLinks: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '6px',
    },
    tocLink: {
      fontSize: '13.5px',
      color: '#0F766E',
      textDecoration: 'none',
    },
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
            <p style={S.heroMeta}>
              Effective date: {EFFECTIVE_DATE} · Complies with the Privacy Act 1988 (Cth) and the Australian Privacy Principles
            </p>
            <div style={S.infoBox}>
              <p style={S.infoText}>
                We collect minimal data, never sell it, and give you full control. This policy explains what we collect, why, and how to request deletion.
              </p>
            </div>
          </div>
        </div>

        <div style={S.body}>

          {/* TOC */}
          <div style={S.toc}>
            <p style={S.tocTitle}>Contents</p>
            <div style={S.tocLinks}>
              {[
                ['#who', '1. Who We Are'],
                ['#collection', '2. What Information We Collect'],
                ['#why', '3. Why We Collect It'],
                ['#thirdparty', '4. Third-Party Services'],
                ['#storage', '5. Data Storage and Security'],
                ['#retention', '6. Data Retention'],
                ['#disclosure', '7. Disclosure of Personal Information'],
                ['#rights', '8. Your Rights Under Australian Privacy Law'],
                ['#cookies', '9. Cookies and Analytics'],
                ['#children', '10. Children\'s Privacy'],
                ['#overseas', '11. Overseas Disclosure'],
                ['#complaints', '12. Complaints and Contact'],
              ].map(([href, label]) => (
                <a key={href} href={href} style={S.tocLink}>{label as string}</a>
              ))}
            </div>
          </div>

          {/* Section 1 */}
          <div id="who" style={S.section}>
            <h2 style={S.h2}>1. Who We Are</h2>
            <p style={S.p}>
              Locatalyze ("<strong>we</strong>", "<strong>us</strong>", "<strong>our</strong>") operates the location feasibility analysis platform at locatalyze.com. We are an Australian-based software company.
            </p>
            <p style={S.p}>
              We are committed to protecting your personal information in accordance with the <em>Privacy Act 1988</em> (Cth) and the 13 Australian Privacy Principles (APPs) contained therein.
            </p>
          </div>

          {/* Section 2 */}
          <div id="collection" style={S.section}>
            <h2 style={S.h2}>2. What Information We Collect</h2>

            <h3 style={S.h3}>Information you provide</h3>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>Data</th>
                  <th style={S.th}>When collected</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Email address', 'When you create an account'],
                  ['Password (hashed — never stored in plain text)', 'Account creation'],
                  ['Business type, address, rent, setup budget, ticket size', 'When you run an analysis'],
                  ['Name (optional)', 'Profile settings'],
                  ['Payment details', 'Processed by Stripe — we never see your card number'],
                ].map(([data, when]) => (
                  <tr key={data as string}>
                    <td style={S.td}>{data as string}</td>
                    <td style={S.td}>{when as string}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3 style={S.h3}>Information collected automatically</h3>
            <ul style={S.ul}>
              <li style={S.li}>IP address and approximate location (city/region level)</li>
              <li style={S.li}>Browser type, device type, and operating system</li>
              <li style={S.li}>Pages visited and features used (via anonymised analytics)</li>
              <li style={S.li}>Error logs for debugging purposes</li>
            </ul>

            <h3 style={S.h3}>What we do NOT collect</h3>
            <ul style={S.ul}>
              <li style={S.li}>Government identifiers (TFN, ABN, driver's licence)</li>
              <li style={S.li}>Health or sensitive information</li>
              <li style={S.li}>Information about children under 18</li>
              <li style={S.li}>Biometric data</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div id="why" style={S.section}>
            <h2 style={S.h2}>3. Why We Collect It</h2>
            <p style={S.p}>We collect personal information only for the following purposes:</p>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>Purpose</th>
                  <th style={S.th}>Lawful basis</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['To create and manage your account', 'Contract performance'],
                  ['To generate your location analysis reports', 'Contract performance'],
                  ['To process payments', 'Contract performance'],
                  ['To send transactional emails (report ready, account alerts)', 'Contract performance'],
                  ['To respond to support queries', 'Legitimate interest'],
                  ['To improve the Platform and fix bugs', 'Legitimate interest'],
                  ['To send product updates (opt-out available)', 'Consent'],
                  ['To comply with legal obligations', 'Legal obligation'],
                ].map(([purpose, basis]) => (
                  <tr key={purpose as string}>
                    <td style={S.td}>{purpose as string}</td>
                    <td style={S.td}>{basis as string}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={S.p}>
              <strong>We will never sell your personal information to third parties. Ever.</strong>
            </p>
          </div>

          {/* Section 4 */}
          <div id="thirdparty" style={S.section}>
            <h2 style={S.h2}>4. Third-Party Services</h2>
            <p style={S.p}>We use the following third-party services. Each has its own privacy policy:</p>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>Service</th>
                  <th style={S.th}>Purpose</th>
                  <th style={S.th}>Data shared</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Supabase', 'Database and authentication', 'Email, hashed password, report data'],
                  ['Vercel', 'Hosting and server infrastructure', 'IP address, server logs'],
                  ['Stripe', 'Payment processing', 'Payment details (we never see card numbers)'],
                  ['OpenAI', 'AI-generated analysis text', 'Business type, address, financial inputs for the report'],
                  ['Geoapify', 'Competitor proximity data', 'Latitude/longitude of the analysed address'],
                  ['Nominatim/OpenStreetMap', 'Address geocoding', 'The address you submit for analysis'],
                ].map(([service, purpose, data]) => (
                  <tr key={service as string}>
                    <td style={{ ...S.td, fontWeight: '500' }}>{service as string}</td>
                    <td style={S.td}>{purpose as string}</td>
                    <td style={S.td}>{data as string}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={S.highlightBox}>
              <p style={S.highlightText}>
                <strong>OpenAI data note:</strong> When you run an analysis, your submitted address, business type, and financial inputs are sent to OpenAI's API to generate the analysis text. OpenAI may retain this data for up to 30 days for abuse monitoring purposes per their API data usage policy. We do not send your name, email, or account details to OpenAI.
              </p>
            </div>
          </div>

          {/* Section 5 */}
          <div id="storage" style={S.section}>
            <h2 style={S.h2}>5. Data Storage and Security</h2>
            <p style={S.p}>
              Your data is stored in Supabase's managed database infrastructure. Supabase uses industry-standard encryption at rest and in transit (TLS 1.2+). Our application is hosted on Vercel's cloud infrastructure.
            </p>
            <p style={S.p}>
              We implement reasonable technical and organisational measures to protect your personal information against unauthorised access, disclosure, alteration, or destruction. However, no internet transmission is completely secure and we cannot guarantee the absolute security of your data.
            </p>
            <p style={S.p}>
              If we become aware of a data breach that is likely to result in serious harm, we will notify the Office of the Australian Information Commissioner (OAIC) and affected individuals in accordance with the Notifiable Data Breaches scheme under the Privacy Act 1988.
            </p>
          </div>

          {/* Section 6 */}
          <div id="retention" style={S.section}>
            <h2 style={S.h2}>6. Data Retention</h2>
            <ul style={S.ul}>
              <li style={S.li}><strong>Account data</strong> — retained while your account is active and for 90 days after deletion</li>
              <li style={S.li}><strong>Report data</strong> — retained while your account is active; deleted when you delete a report or close your account</li>
              <li style={S.li}><strong>Payment records</strong> — retained for 7 years as required by Australian taxation law</li>
              <li style={S.li}><strong>Server logs</strong> — retained for 30 days for security and debugging purposes</li>
            </ul>
          </div>

          {/* Section 7 */}
          <div id="disclosure" style={S.section}>
            <h2 style={S.h2}>7. Disclosure of Personal Information</h2>
            <p style={S.p}>We will only disclose your personal information to third parties:</p>
            <ul style={S.ul}>
              <li style={S.li}>To the third-party service providers listed in Section 4, as required to operate the Platform</li>
              <li style={S.li}>Where required or authorised by Australian law (e.g. in response to a court order or request from the Australian Taxation Office)</li>
              <li style={S.li}>To protect the rights, property, or safety of Locatalyze, our users, or the public</li>
              <li style={S.li}>In connection with a sale or merger of the business, where the acquirer agrees to be bound by this Privacy Policy</li>
            </ul>
            <p style={S.p}>
              <strong>We will never sell, rent, or trade your personal information to any third party for marketing purposes.</strong>
            </p>
          </div>

          {/* Section 8 */}
          <div id="rights" style={S.section}>
            <h2 style={S.h2}>8. Your Rights Under Australian Privacy Law</h2>
            <p style={S.p}>Under the Privacy Act 1988 and the Australian Privacy Principles, you have the right to:</p>
            <ul style={S.ul}>
              <li style={S.li}><strong>Access</strong> — request a copy of the personal information we hold about you</li>
              <li style={S.li}><strong>Correction</strong> — request that we correct inaccurate, incomplete, or outdated personal information</li>
              <li style={S.li}><strong>Deletion</strong> — request deletion of your account and associated personal information (subject to our legal retention obligations)</li>
              <li style={S.li}><strong>Opt-out</strong> — unsubscribe from marketing communications at any time</li>
              <li style={S.li}><strong>Complaint</strong> — lodge a complaint with us or directly with the OAIC if you believe we have breached your privacy rights</li>
            </ul>
            <p style={S.p}>
              To exercise any of these rights, contact us at <a href={`mailto:${EMAIL}`} style={S.emailLink}>{EMAIL}</a>. We will respond within 30 days.
            </p>
          </div>

          {/* Section 9 */}
          <div id="cookies" style={S.section}>
            <h2 style={S.h2}>9. Cookies and Analytics</h2>
            <p style={S.p}>
              We use strictly necessary cookies to maintain your login session. We do not use advertising cookies or third-party tracking cookies.
            </p>
            <p style={S.p}>
              We may use privacy-respecting analytics tools to understand how the Platform is used in aggregate (e.g. page views, feature usage). These tools are configured to anonymise IP addresses and not to collect personally identifiable information.
            </p>
          </div>

          {/* Section 10 */}
          <div id="children" style={S.section}>
            <h2 style={S.h2}>10. Children's Privacy</h2>
            <p style={S.p}>
              The Platform is not directed to individuals under 18 years of age. We do not knowingly collect personal information from children. If we become aware that we have collected personal information from a person under 18, we will take steps to delete it promptly.
            </p>
          </div>

          {/* Section 11 */}
          <div id="overseas" style={S.section}>
            <h2 style={S.h2}>11. Overseas Disclosure</h2>
            <p style={S.p}>
              Some of our third-party service providers (including Vercel, OpenAI, and Stripe) are based in the United States. By using the Platform, you consent to the transfer of your personal information to these providers for the purposes described in this policy.
            </p>
            <p style={S.p}>
              Before disclosing personal information to an overseas recipient, we take reasonable steps to ensure that the recipient does not breach the Australian Privacy Principles in relation to that information, as required by APP 8.
            </p>
          </div>

          {/* Section 12 */}
          <div id="complaints" style={S.section}>
            <h2 style={S.h2}>12. Complaints and Contact</h2>
            <p style={S.p}>
              If you have a complaint about how we handle your personal information, please contact our Privacy Officer first. We aim to resolve all privacy complaints within 30 days.
            </p>
            <div style={S.contactBox}>
              <p style={S.contactTitle}>Privacy Officer — Locatalyze</p>
              <p style={{ ...S.contactText, margin: 0 }}>
                Email: <a href={`mailto:${EMAIL}`} style={S.emailLink}>{EMAIL}</a><br />
                Australia<br /><br />
                If you are not satisfied with our response, you may lodge a complaint with the Office of the Australian Information Commissioner (OAIC):<br />
                <strong>oaic.gov.au/privacy/privacy-complaints</strong><br />
                Phone: 1300 363 992
              </p>
            </div>
          </div>

          {/* Updates note */}
          <p style={{ ...S.p, color: '#9CA3AF', fontSize: '12.5px', marginTop: '40px' }}>
            This Privacy Policy was last updated on {EFFECTIVE_DATE}. We will notify you of material changes by email or via a notice on the Platform. Previous versions are available on request.
          </p>

        </div>
      </div>
    </>
  )
}