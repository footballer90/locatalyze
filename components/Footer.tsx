import Link from 'next/link'

export default function Footer() {
  const S = {
    footer: {
      background: '#080F0E',
      borderTop: '1px solid #1A2E2B',
      fontFamily: "'DM Sans', sans-serif",
    },
    inner: {
      maxWidth: '1120px',
      margin: '0 auto',
      padding: '0 32px',
    },
    // ── Top section ──────────────────────────────────────────────
    top: {
      padding: '56px 0 48px',
      display: 'grid',
      gridTemplateColumns: '220px 1fr',
      gap: '80px',
    },
    brand: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '16px',
    },
    logoRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '9px',
      textDecoration: 'none',
    },
    logoIcon: {
      width: '30px',
      height: '30px',
      background: 'linear-gradient(135deg, #0F766E, #14B8A6)',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '15px',
      fontWeight: '800',
      color: '#fff',
      letterSpacing: '-1px',
      flexShrink: 0,
    },
    logoText: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#F9FAFB',
      letterSpacing: '-0.3px',
    },
    tagline: {
      fontSize: '13.5px',
      color: '#6B7280',
      lineHeight: 1.65,
    },
    statusBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '7px',
      width: 'fit-content',
      background: 'rgba(5,150,105,0.1)',
      border: '1px solid rgba(5,150,105,0.25)',
      borderRadius: '20px',
      padding: '5px 12px',
      fontSize: '12px',
      fontWeight: '600',
      color: '#059669',
      letterSpacing: '0.3px',
    },
    statusDot: {
      width: '7px',
      height: '7px',
      borderRadius: '50%',
      background: '#059669',
      boxShadow: '0 0 6px rgba(5,150,105,0.6)',
    },
    // ── Columns ───────────────────────────────────────────────────
    cols: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '24px',
    },
    colTitle: {
      fontSize: '11px',
      fontWeight: '700',
      color: '#4B5563',
      letterSpacing: '1.2px',
      textTransform: 'uppercase' as const,
      marginBottom: '14px',
    },
    links: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '9px',
    },
    link: {
      fontSize: '13.5px',
      color: '#9CA3AF',
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      transition: 'color 0.12s',
    },
    newBadge: {
      fontSize: '10px',
      fontWeight: '700',
      color: '#14B8A6',
      background: 'rgba(20,184,166,0.1)',
      border: '1px solid rgba(20,184,166,0.25)',
      borderRadius: '4px',
      padding: '1px 5px',
      letterSpacing: '0.5px',
    },
    // ── Divider ───────────────────────────────────────────────────
    divider: {
      borderTop: '1px solid #1A2E2B',
    },
    // ── Bottom bar ────────────────────────────────────────────────
    bottom: {
      padding: '20px 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap' as const,
      gap: '12px',
    },
    bottomLeft: {
      fontSize: '12.5px',
      color: '#4B5563',
    },
    bottomRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
    bottomLink: {
      fontSize: '12.5px',
      color: '#4B5563',
      textDecoration: 'none',
      padding: '0 10px',
      borderRight: '1px solid #374151',
      transition: 'color 0.12s',
    },
    bottomLinkLast: {
      fontSize: '12.5px',
      color: '#4B5563',
      textDecoration: 'none',
      padding: '0 10px',
      transition: 'color 0.12s',
    },
    // ── Disclaimer strip ──────────────────────────────────────────
    disclaimer: {
      borderTop: '1px solid #1A2E2B',
      padding: '16px 0',
    },
    disclaimerText: {
      fontSize: '11.5px',
      color: '#374151',
      lineHeight: 1.6,
      maxWidth: '900px',
    },
  }

  const columns = [
    {
      title: 'Product',
      links: [
        { label: 'How it works', href: '/methodology' },
        { label: 'Run an analysis', href: '/onboarding', badge: 'New' },
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Pricing', href: '/upgrade' },
        { label: 'Methodology', href: '/methodology' },
      ],
    },
    {
      title: 'Use Cases',
      links: [
        { label: 'Cafes & Coffee', href: '/analyse/cafe' },
        { label: 'Restaurants', href: '/analyse/restaurant' },
        { label: 'Retail Stores', href: '/analyse/retail' },
        { label: 'Gyms & Fitness', href: '/analyse/gym' },
        { label: 'All business types', href: '/analyse' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Methodology', href: '/methodology' },
        { label: 'Help Centre', href: '/help' },
        { label: 'Location insights', href: '/analyse' },
        { label: 'Contact', href: '/contact' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Disclaimer', href: '/terms#disclaimer' },
        { label: 'Refund Policy', href: '/terms#refunds' },
      ],
    },
  ]

  const hover = (e: React.MouseEvent<HTMLAnchorElement>, enter: boolean) => {
    e.currentTarget.style.color = enter ? '#F9FAFB' : '#9CA3AF'
  }
  const hoverBottom = (e: React.MouseEvent<HTMLAnchorElement>, enter: boolean) => {
    e.currentTarget.style.color = enter ? '#9CA3AF' : '#4B5563'
  }

  return (
    <footer style={S.footer}>
      <div style={S.inner}>
        <div style={S.top}>
          {/* Brand */}
          <div style={S.brand}>
            <Link href="/" style={S.logoRow}>
              <div style={S.logoIcon}>L</div>
              <span style={S.logoText}>Locatalyze</span>
            </Link>
            <p style={S.tagline}>
              Before you sign the lease.<br />
              AI-powered location feasibility<br />
              for Australian businesses.
            </p>
            <span style={S.statusBadge}>
              <span style={S.statusDot} />
              All systems operational
            </span>
          </div>

          {/* Link columns */}
          <div style={S.cols}>
            {columns.map(col => (
              <div key={col.title}>
                <p style={S.colTitle}>{col.title}</p>
                <div style={S.links}>
                  {col.links.map(l => (
                    <Link
                      key={l.label}
                      href={l.href}
                      style={S.link}
                      onMouseEnter={e => hover(e, true)}
                      onMouseLeave={e => hover(e, false)}
                    >
                      {l.label}
                      {'badge' in l && l.badge && <span style={S.newBadge}>{l.badge}</span>}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={S.divider} />

        {/* Bottom bar */}
        <div style={S.bottom}>
          <span style={S.bottomLeft}>
            © {new Date().getFullYear()} Locatalyze. ABN pending. Made in Australia.
          </span>
          <div style={S.bottomRight}>
            <Link href="/terms" style={S.bottomLink}
              onMouseEnter={e => hoverBottom(e, true)} onMouseLeave={e => hoverBottom(e, false)}>
              Terms
            </Link>
            <Link href="/privacy" style={S.bottomLink}
              onMouseEnter={e => hoverBottom(e, true)} onMouseLeave={e => hoverBottom(e, false)}>
              Privacy
            </Link>
            <Link href="/terms#disclaimer" style={S.bottomLinkLast}
              onMouseEnter={e => hoverBottom(e, true)} onMouseLeave={e => hoverBottom(e, false)}>
              Disclaimer
            </Link>
          </div>
        </div>

        {/* Legal disclaimer strip */}
        <div style={S.disclaimer}>
          <p style={S.disclaimerText}>
            Locatalyze provides indicative feasibility analysis for informational purposes only. 
            It does not constitute financial advice, investment advice, or a recommendation to enter into any lease or business arrangement. 
            Always seek independent professional advice before making commercial property decisions.
            Results are estimates based on publicly available data and may not reflect actual market conditions.
          </p>
        </div>
      </div>
    </footer>
  )
}