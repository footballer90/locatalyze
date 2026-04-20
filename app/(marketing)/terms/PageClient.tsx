'use client'


export default function TermsPageClient() {
 const EFFECTIVE_DATE = '8 March 2025'
 const COMPANY = 'Locatalyze'
 const EMAIL = 'legal@locatalyze.com.au'
 const JURISDICTION = 'New South Wales, Australia'

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
    // Warning box
    warningBox: {
      background: 'rgba(217,119,6,0.08)',
   border: '1px solid rgba(217,119,6,0.3)',
   borderRadius: '10px',
   padding: '20px 24px',
   margin: '32px 0',
  },
    warningTitle: {
      fontSize: '14px',
   fontWeight: '700',
   color: '#D97706',
   marginBottom: '8px',
   display: 'flex',
   alignItems: 'center',
   gap: '8px',
  },
    warningText: {
      fontSize: '14px',
   color: '#92400E',
   lineHeight: 1.6,
    },
    // Body
    body: {
      maxWidth: '760px',
   margin: '0 auto',
   padding: '48px 24px 80px',
  },
    // Sections
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
    // Critical disclaimer box
    disclaimerBox: {
      background: '#FEF2F2',
   border: '2px solid #FCA5A5',
   borderRadius: '10px',
   padding: '24px',
   margin: '32px 0',
  },
    disclaimerTitle: {
      fontSize: '15px',
   fontWeight: '700',
   color: '#DC2626',
   marginBottom: '12px',
   display: 'flex',
   alignItems: 'center',
   gap: '8px',
  },
    disclaimerText: {
      fontSize: '14px',
   color: '#7F1D1D',
   lineHeight: 1.7,
    },
    // Info box
    infoBox: {
      background: '#EFF6FF',
   border: '1px solid #BFDBFE',
   borderRadius: '10px',
   padding: '20px 24px',
   margin: '20px 0',
  },
    infoText: {
      fontSize: '14px',
   color: '#1E40AF',
   lineHeight: 1.65,
    },
    // Contact box
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
    // TOC
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
            <h1 style={S.heroTitle}>Terms of Service</h1>
            <p style={S.heroMeta}>
              Effective date: {EFFECTIVE_DATE} · Governed by the laws of {JURISDICTION}
            </p>

            <div style={S.warningBox}>
              <div style={S.warningTitle}> Read before using Locatalyze</div>
              <p style={{ ...S.warningText, margin: 0 }}>
                Locatalyze provides <strong>indicative estimates only</strong>. It is not financial advice, business advice, or a guarantee of any business outcome. You must seek independent professional advice before signing any lease or making any commercial property decision.
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={S.body}>

          {/* Table of contents */}
          <div style={S.toc}>
            <p style={S.tocTitle}>Contents</p>
            <div style={S.tocLinks}>
              {[
                ['#disclaimer', '1. Critical Disclaimer — Read First'],
        ['#service', '2. About the Service'],
        ['#acceptance', '3. Acceptance of Terms'],
        ['#eligibility', '4. Eligibility'],
        ['#account', '5. Account Responsibilities'],
        ['#payments', '6. Payments and Refunds'],
        ['#ip', '7. Intellectual Property'],
        ['#liability', '8. Limitation of Liability'],
        ['#acl', '9. Australian Consumer Law'],
        ['#privacy', '10. Privacy'],
        ['#termination', '11. Termination'],
        ['#governing', '12. Governing Law'],
        ['#contact', '13. Contact Us'],
       ].map(([href, label]) => (
                <a key={href} href={href} style={S.tocLink}>{label as string}</a>
              ))}
            </div>
          </div>

          {/* Section 1 — Critical Disclaimer */}
          <div id="disclaimer" style={S.section}>
      <h2 style={S.h2}>1. Critical Disclaimer — Read This First</h2>

            <div style={S.disclaimerBox}>
              <div style={S.disclaimerTitle}> Not Financial or Business Advice</div>
              <p style={{ ...S.disclaimerText, margin: 0 }}>
                Locatalyze is an <strong>informational tool only</strong>. The reports, scores, verdicts, financial projections, competitor data, demographic estimates, and all other outputs produced by Locatalyze:
              </p>
            </div>

            <ul style={S.ul}>
              <li style={S.li}>Are <strong>indicative estimates only</strong> and may not reflect actual market conditions</li>
              <li style={S.li}>Are <strong>not financial advice</strong> as defined under the Corporations Act 2001 (Cth)</li>
              <li style={S.li}>Are <strong>not a recommendation</strong> to enter into any lease, business purchase, or commercial arrangement</li>
              <li style={S.li}>Are <strong>not a guarantee</strong> of business success, profitability, or viability</li>
              <li style={S.li}>Are based on <strong>publicly available data, algorithmic models, and AI-generated text</strong> that may contain errors or inaccuracies</li>
              <li style={S.li}><strong>Cannot replace</strong> advice from a qualified accountant, business broker, commercial solicitor, or financial planner</li>
              <li style={S.li}>May not account for <strong>local market conditions, zoning laws, licensing requirements, or competition</strong> specific to your situation</li>
            </ul>

            <p style={S.p}>
              <strong>By using Locatalyze, you acknowledge that you have read this disclaimer, understand its contents, and agree that any commercial decision you make is entirely your own responsibility.</strong> Locatalyze, its directors, employees, contractors, and affiliates accept no liability for any loss, damage, or harm arising from your use of or reliance on the outputs of this service.
            </p>

            <div style={S.infoBox}>
              <p style={{ ...S.infoText, margin: 0 }}>
                <strong>We strongly recommend</strong> that before signing any lease or committing to a business location, you consult a qualified accountant, a commercial solicitor, and a business adviser who can assess your specific circumstances.
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div id="service" style={S.section}>
      <h2 style={S.h2}>2. About the Service</h2>
            <p style={S.p}>
              Locatalyze ("<strong>we</strong>", "<strong>us</strong>", "<strong>our</strong>") operates an online location feasibility analysis platform accessible at locatalyze.com and associated domains (the "<strong>Platform</strong>").
      </p>
            <p style={S.p}>
              The Platform uses publicly available geographic data, algorithmic financial modelling, and artificial intelligence (AI) to generate indicative feasibility reports for commercial locations in Australia. These reports are provided as a starting point for user research only.
            </p>
            <p style={S.p}>
              The data sources used by Locatalyze include Google Maps Platform (competitor discovery and ratings), Geoapify (secondary place-of-interest coverage), Mapbox (address geocoding and coordinate pinning), Australian Bureau of Statistics (demographic estimates), and OpenAI (AI-generated narrative analysis text — including the GPT-4 family of models). These sources may be incomplete, outdated, or inaccurate.
            </p>
          </div>

          {/* Section 3 */}
          <div id="acceptance" style={S.section}>
      <h2 style={S.h2}>3. Acceptance of Terms</h2>
            <p style={S.p}>
              By creating an account, accessing, or using the Platform, you agree to be bound by these Terms of Service ("<strong>Terms</strong>") and our Privacy Policy. If you do not agree to these Terms, you must not use the Platform.
      </p>
            <p style={S.p}>
              We may update these Terms from time to time. We will notify you of material changes by email or by displaying a notice on the Platform. Your continued use of the Platform after changes are posted constitutes your acceptance of the updated Terms.
            </p>
          </div>

          {/* Section 4 */}
          <div id="eligibility" style={S.section}>
      <h2 style={S.h2}>4. Eligibility</h2>
            <p style={S.p}>To use Locatalyze, you must:</p>
            <ul style={S.ul}>
              <li style={S.li}>Be at least 18 years of age</li>
              <li style={S.li}>Be located in Australia, or be seeking to evaluate an Australian business location</li>
              <li style={S.li}>Have the legal capacity to enter into a binding agreement</li>
              <li style={S.li}>Not be prohibited from using the service under any applicable law</li>
            </ul>
          </div>

          {/* Section 5 */}
          <div id="account" style={S.section}>
      <h2 style={S.h2}>5. Account Responsibilities</h2>
            <p style={S.p}>You are responsible for:</p>
            <ul style={S.ul}>
              <li style={S.li}>Maintaining the confidentiality of your account credentials</li>
              <li style={S.li}>All activity that occurs under your account</li>
              <li style={S.li}>Providing accurate information when creating reports</li>
              <li style={S.li}>Using the Platform only for lawful purposes</li>
            </ul>
            <p style={S.p}>
              You must not use the Platform to generate reports for fraudulent purposes, to mislead third parties, or in any manner that violates applicable law.
            </p>
          </div>

          {/* Section 6 */}
          <div id="payments" style={S.section}>
      <h2 style={S.h2}>6. Payments and Refunds</h2>

            <h3 style={S.h3}>Free tier</h3>
            <p style={S.p}>
              Free accounts receive a limited number of analyses as stated on the pricing page. Free tier limits are non-transferable and do not reset upon report deletion.
            </p>

            <h3 style={S.h3}>Paid plans</h3>
            <p style={S.p}>
              Paid plans are sold as one-off report packs (for example, a single report, 3-report pack, or 10-report pack) priced in Australian Dollars (AUD) inclusive of GST where applicable. Report credits do not expire while your account remains active. Payments are processed securely by Stripe. We do not store your payment card details.
            </p>

            <h3 id="refunds" style={S.h3}>Refund policy</h3>
      <p style={S.p}>
              Due to the digital nature of our service, all sales are generally final once a report has been generated. However, we comply with our obligations under the Australian Consumer Law (ACL). If the service has a major failure as defined under the ACL, you are entitled to a remedy including a refund.
            </p>
            <p style={S.p}>
              If you are dissatisfied with a report, please contact us at <a href={`mailto:${EMAIL}`} style={S.emailLink}>{EMAIL}</a> and we will work to resolve your concern. Refund requests made within 7 days of purchase for unused report credits (where no report has been generated against the credit) will be considered on a case-by-case basis.
            </p>
          </div>

          {/* Section 7 */}
          <div id="ip" style={S.section}>
      <h2 style={S.h2}>7. Intellectual Property</h2>
            <p style={S.p}>
              The Platform, including its software, algorithms, design, methodology, and branding, is owned by Locatalyze and protected by Australian copyright law. You must not reproduce, distribute, or create derivative works from any part of the Platform without our written consent.
            </p>
            <p style={S.p}>
              Reports generated for your account are licensed to you for personal and internal business use only. You may not resell, sublicense, or publicly distribute report outputs without our written permission.
            </p>
          </div>

          {/* Section 8 — Limitation of Liability */}
          <div id="liability" style={S.section}>
      <h2 style={S.h2}>8. Limitation of Liability</h2>

            <div style={S.disclaimerBox}>
              <div style={S.disclaimerTitle}> Important — Please Read Carefully</div>
              <p style={{ ...S.disclaimerText, margin: 0 }}>
                To the maximum extent permitted by law, Locatalyze and its directors, employees, agents, and affiliates will not be liable to you for any loss of profits, loss of revenue, loss of business opportunity, loss of data, indirect loss, consequential loss, or any other loss arising from your use of or reliance on the Platform or any report generated by it.
              </p>
            </div>

            <p style={S.p}>
              Our total aggregate liability to you for any claim arising out of or in connection with these Terms or your use of the Platform will not exceed the total amount you paid to us in the 12 months preceding the claim.
            </p>
            <p style={S.p}>
              In particular, we are not liable for:
            </p>
            <ul style={S.ul}>
              <li style={S.li}>Any commercial decisions you make based on a Locatalyze report</li>
              <li style={S.li}>Business failure, financial loss, or lease commitments entered into following use of the Platform</li>
              <li style={S.li}>Inaccuracies in competitor data, demographic estimates, or financial projections</li>
              <li style={S.li}>Errors in AI-generated analysis text</li>
              <li style={S.li}>Loss arising from reliance on the Platform in place of professional advice</li>
              <li style={S.li}>Interruptions to service, data loss, or technical errors</li>
            </ul>
            <p style={S.p}>
              These limitations apply regardless of the legal theory under which the claim is brought (contract, tort, negligence, statute, or otherwise) and even if we have been advised of the possibility of such loss.
            </p>
          </div>

          {/* Section 9 — ACL */}
          <div id="acl" style={S.section}>
      <h2 style={S.h2}>9. Australian Consumer Law</h2>
            <p style={S.p}>
              Nothing in these Terms excludes, restricts, or modifies any right or remedy, or any guarantee, warranty, or other term or condition, that cannot lawfully be excluded or limited under the Australian Consumer Law (Schedule 2 to the Competition and Consumer Act 2010 (Cth)) or any other applicable legislation.
            </p>
            <p style={S.p}>
              Under the Australian Consumer Law, consumers are entitled to certain automatic guarantees including that services will be rendered with due care and skill, fit for the purpose for which they are supplied, and provided within a reasonable time. Where these guarantees apply and are not met, you may be entitled to a remedy.
            </p>
            <p style={S.p}>
              To the extent our services are not acquired as a consumer (i.e. acquired for business purposes and the amount paid exceeds $100,000), we limit our liability for failure to comply with a guarantee to re-supplying the service or paying the cost of having the service re-supplied.
            </p>
          </div>

          {/* Section 10 */}
          <div id="privacy" style={S.section}>
      <h2 style={S.h2}>10. Privacy</h2>
            <p style={S.p}>
              Your use of the Platform is also governed by our <a href="/privacy" style={S.emailLink}>Privacy Policy</a>, which is incorporated into these Terms by reference. By using the Platform, you consent to the collection and use of your information as described in our Privacy Policy.
      </p>
          </div>

          {/* Section 11 */}
          <div id="termination" style={S.section}>
      <h2 style={S.h2}>11. Termination</h2>
            <p style={S.p}>
              We may suspend or terminate your account at any time if you breach these Terms, engage in fraudulent or unlawful activity, or for any other reason at our sole discretion with reasonable notice.
            </p>
            <p style={S.p}>
              You may close your account at any time by contacting us at <a href={`mailto:${EMAIL}`} style={S.emailLink}>{EMAIL}</a>. Upon closure, your reports will be deleted in accordance with our Privacy Policy.
            </p>
          </div>

          {/* Section 12 */}
          <div id="governing" style={S.section}>
      <h2 style={S.h2}>12. Governing Law and Dispute Resolution</h2>
            <p style={S.p}>
              These Terms are governed by the laws of {JURISDICTION}. You agree to submit to the non-exclusive jurisdiction of the courts of New South Wales for any dispute arising under these Terms.
            </p>
            <p style={S.p}>
              Before commencing legal proceedings, you agree to contact us at <a href={`mailto:${EMAIL}`} style={S.emailLink}>{EMAIL}</a> to attempt to resolve any dispute informally within 30 days.
            </p>
          </div>

          {/* Section 13 — Contact */}
          <div id="contact" style={S.section}>
      <h2 style={S.h2}>13. Contact Us</h2>
            <p style={S.p}>
              For questions, concerns, or legal notices regarding these Terms, please contact:
            </p>
            <div style={S.contactBox}>
              <p style={S.contactTitle}>{COMPANY}</p>
              <p style={{ ...S.contactText, margin: 0 }}>
                Email: <a href={`mailto:${EMAIL}`} style={S.emailLink}>{EMAIL}</a><br />
                Australia<br />
                Governing jurisdiction: {JURISDICTION}
              </p>
            </div>
          </div>

          <p style={{ ...S.p, color: '#9CA3AF', fontSize: '12.5px', marginTop: '40px' }}>
      These Terms were last updated on {EFFECTIVE_DATE}. Previous versions are available on request.
          </p>
        </div>
      </div>
    </>
  )
}