'use client'
import Link from 'next/link'
import NewsletterForm from '@/components/NewsletterForm'

// ── Inline SVG logo (dark variant — white text + teal accent) ──
function Logo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 40" width="160" height="36">
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0F766E"/>
          <stop offset="100%" stopColor="#14B8A6"/>
        </linearGradient>
      </defs>
      {/* Icon — location pin style */}
      <rect x="2" y="2" width="32" height="32" rx="8" fill="url(#logoGrad)"/>
      <text x="10" y="24" fontFamily="serif" fontSize="18" fontWeight="900" fill="white">L</text>
      {/* Wordmark */}
      <text x="44" y="27" fontFamily="DM Sans, Helvetica Neue, Arial, sans-serif" fontSize="19" fontWeight="800" letterSpacing="-0.04em">
        <tspan fill="#FFFFFF">Loca</tspan><tspan fill="#14B8A6">talyze</tspan>
      </text>
    </svg>
  )
}

// ── Social icons ──────────────────────────────────────────────
function TwitterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )
}
function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}

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

    // ── Newsletter strip ──────────────────────────────────────
    newsletter: {
      borderBottom: '1px solid #1A2E2B',
      padding: '32px 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '24px',
      flexWrap: 'wrap' as const,
    },
    newsletterLeft: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '4px',
    },
    newsletterTitle: {
      fontSize: '15px',
      fontWeight: '700',
      color: '#F9FAFB',
    },
    newsletterSub: {
      fontSize: '13px',
      color: '#6B7280',
    },
    newsletterForm: {
      display: 'flex',
      gap: '8px',
    },
    newsletterInput: {
      padding: '10px 16px',
      background: '#111827',
      border: '1px solid #1F2937',
      borderRadius: '8px',
      fontSize: '13px',
      color: '#F9FAFB',
      fontFamily: "'DM Sans', sans-serif",
      width: '220px',
      outline: 'none',
    },
    newsletterBtn: {
      padding: '10px 18px',
      background: '#0F766E',
      border: 'none',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: '700',
      color: '#fff',
      cursor: 'pointer',
      fontFamily: "'DM Sans', sans-serif",
      whiteSpace: 'nowrap' as const,
    },

    // ── Main grid ─────────────────────────────────────────────
    top: {
      padding: '48px 0 40px',
      display: 'grid',
      gridTemplateColumns: '240px 1fr',
      gap: '64px',
    },
    brand: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '14px',
    },
    tagline: {
      fontSize: '13px',
      color: '#6B7280',
      lineHeight: '1.65',
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
    },
    statusDot: {
      width: '7px',
      height: '7px',
      borderRadius: '50%',
      background: '#059669',
      boxShadow: '0 0 6px rgba(5,150,105,0.6)',
    },
    socialRow: {
      display: 'flex',
      gap: '8px',
      marginTop: '4px',
    },
    socialBtn: {
      width: '32px',
      height: '32px',
      borderRadius: '8px',
      background: '#111827',
      border: '1px solid #1F2937',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#6B7280',
      cursor: 'pointer',
      transition: 'all 0.12s',
      textDecoration: 'none',
    },

    // ── Link columns ──────────────────────────────────────────
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
      transition: 'color 0.12s',
    },
    newBadge: {
      fontSize: '10px',
      fontWeight: '700',
      color: '#14B8A6',
      background: 'rgba(20,184,166,0.1)',
      border: '1px solid rgba(20,184,166,0.2)',
      borderRadius: '4px',
      padding: '1px 5px',
      marginLeft: '5px',
    },

    // ── Trust strip ───────────────────────────────────────────
    trustStrip: {
      borderTop: '1px solid #1A2E2B',
      padding: '20px 0',
      display: 'flex',
      alignItems: 'center',
      gap: '24px',
      flexWrap: 'wrap' as const,
    },
    trustItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '12px',
      color: '#4B5563',
    },

    // ── Bottom bar ────────────────────────────────────────────
    bottom: {
      borderTop: '1px solid #1A2E2B',
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
      gap: '0px',
    },
    bottomLink: {
      fontSize: '12.5px',
      color: '#4B5563',
      textDecoration: 'none',
      padding: '0 12px',
      borderRight: '1px solid #374151',
      transition: 'color 0.12s',
    },
    bottomLinkLast: {
      fontSize: '12.5px',
      color: '#4B5563',
      textDecoration: 'none',
      padding: '0 12px',
      transition: 'color 0.12s',
    },

    // ── Disclaimer ────────────────────────────────────────────
    disclaimer: {
      borderTop: '1px solid #1A2E2B',
      padding: '16px 0 24px',
    },
    disclaimerText: {
      fontSize: '11.5px',
      color: '#374151',
      lineHeight: '1.6',
      maxWidth: '900px',
    },
  }

  const columns = [
    {
      title: 'Product',
      links: [
        { label: 'How it works',      href: '/methodology' },
        { label: 'Run an analysis',   href: '/onboarding', badge: 'New' },
        { label: 'Dashboard',         href: '/dashboard' },
        { label: 'Pricing',           href: '/upgrade' },
        { label: 'Changelog',         href: '/changelog' },
      ],
    },
    {
      title: 'Use Cases',
      links: [
        { label: 'Cafes & Coffee',    href: '/use-case/cafes' },
        { label: 'Restaurants',       href: '/use-case/restaurants' },
        { label: 'Retail Stores',     href: '/use-case/retail' },
        { label: 'Gyms & Fitness',    href: '/use-case/gyms' },
        { label: 'Takeaway',          href: '/use-case/takeaway' },
        { label: 'All business types',href: '/use-case/all' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Methodology',       href: '/methodology' },
        { label: 'Location insights', href: '/analyse' },
        { label: 'Blog',              href: '/blog' },
        { label: 'Help Centre',       href: '/help' },
        { label: 'Contact',           href: '/contact' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Terms of Service',  href: '/terms' },
        { label: 'Privacy Policy',    href: '/privacy' },
        { label: 'Disclaimer',        href: '/terms#disclaimer' },
        { label: 'Refund Policy',     href: '/terms#refunds' },
      ],
    },
  ]

  const hoverLink = (e: React.MouseEvent<HTMLAnchorElement>, enter: boolean) => {
    e.currentTarget.style.color = enter ? '#F9FAFB' : '#9CA3AF'
  }
  const hoverBottom = (e: React.MouseEvent<HTMLAnchorElement>, enter: boolean) => {
    e.currentTarget.style.color = enter ? '#9CA3AF' : '#4B5563'
  }
  const hoverSocial = (e: React.MouseEvent<HTMLAnchorElement>, enter: boolean) => {
    e.currentTarget.style.color = enter ? '#F9FAFB' : '#6B7280'
    e.currentTarget.style.borderColor = enter ? '#374151' : '#1F2937'
  }

  return (
    <footer style={S.footer}>
      <div style={S.inner}>

        {/* ── Newsletter strip ── */}
        <div style={S.newsletter}>
          <div style={S.newsletterLeft}>
            <span style={S.newsletterTitle}>📍 Get weekly location insights</span>
            <span style={S.newsletterSub}>Where Australian businesses are opening, failing, and thriving.</span>
          </div>
          <NewsletterForm />
        </div>

        {/* ── Main grid ── */}
        <div style={S.top}>

          {/* Brand column */}
          <div style={S.brand}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Logo />
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
            {/* Social links */}
            <div style={S.socialRow}>
              <a href="https://twitter.com/locatalyze" target="_blank" rel="noopener noreferrer"
                aria-label="Locatalyze on Twitter"
                style={S.socialBtn}
                onMouseEnter={e => hoverSocial(e, true)}
                onMouseLeave={e => hoverSocial(e, false)}>
                <TwitterIcon />
              </a>
              <a href="https://linkedin.com/company/locatalyze" target="_blank" rel="noopener noreferrer"
                aria-label="Locatalyze on LinkedIn"
                style={S.socialBtn}
                onMouseEnter={e => hoverSocial(e, true)}
                onMouseLeave={e => hoverSocial(e, false)}>
                <LinkedInIcon />
              </a>
            </div>
          </div>

          {/* Link columns */}
          <div style={S.cols}>
            {columns.map(col => (
              <div key={col.title}>
                <p style={S.colTitle}>{col.title}</p>
                <div style={S.links}>
                  {col.links.map(l => (
                    <Link key={l.label} href={l.href} style={S.link}
                      onMouseEnter={e => hoverLink(e, true)}
                      onMouseLeave={e => hoverLink(e, false)}>
                      {l.label}
                      {'badge' in l && l.badge && <span style={S.newBadge}>{l.badge}</span>}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Trust strip ── */}
        <div style={S.trustStrip}>
          {[
            { icon: '🇦🇺', text: 'Built in Australia' },
            { icon: '📊', text: 'ABS Census data' },
            { icon: '🔒', text: 'Bank-grade encryption' },
            { icon: '🛡', text: 'SOC 2 aligned infrastructure' },
            { icon: '🗺', text: 'Live location data' },
          ].map(item => (
            <div key={item.text} style={S.trustItem}>
              <span>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>

        {/* ── Bottom bar ── */}
        <div style={S.bottom}>
          <span style={S.bottomLeft}>
            © {new Date().getFullYear()} Locatalyze. Made in Australia 🇦🇺
          </span>
          <div style={S.bottomRight}>
            {[
              { label: 'Terms', href: '/terms' },
              { label: 'Privacy', href: '/privacy' },
              { label: 'Disclaimer', href: '/terms#disclaimer' },
              { label: 'Contact', href: '/contact' },
            ].map((item, i, arr) => (
              <Link key={item.label} href={item.href}
                style={i === arr.length - 1 ? S.bottomLinkLast : S.bottomLink}
                onMouseEnter={e => hoverBottom(e, true)}
                onMouseLeave={e => hoverBottom(e, false)}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* ── Legal disclaimer strip ── */}
        <div style={S.disclaimer}>
          <p style={S.disclaimerText}>
            Locatalyze provides indicative feasibility analysis for informational purposes only. It does not constitute financial advice, investment advice, or a recommendation to enter into any lease or business arrangement. Results are estimates based on publicly available data and may not reflect actual market conditions. Always seek independent professional advice before making commercial property decisions.
          </p>
        </div>

      </div>
    </footer>
  )
}