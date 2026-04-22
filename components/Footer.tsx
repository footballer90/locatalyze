'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/Logo'

function TwitterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

type FooterLink = { label: string; href: string; badge?: string }

const PRODUCT_LINKS: FooterLink[] = [
  { label: 'How it works', href: '/methodology' },
  { label: 'Run an analysis', href: '/onboarding', badge: 'New' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Pricing', href: '/upgrade' },
  { label: 'Changelog', href: '/changelog' },
]

const USE_CASE_LINKS: FooterLink[] = [
  { label: 'Cafés & coffee', href: '/use-case/cafes' },
  { label: 'Restaurants', href: '/use-case/restaurants' },
  { label: 'Retail stores', href: '/use-case/retail' },
  { label: 'Gyms & fitness', href: '/use-case/gyms' },
  { label: 'Takeaway', href: '/use-case/takeaway' },
  { label: 'All business types', href: '/use-case/all' },
]

const RESOURCE_LINKS: FooterLink[] = [
  { label: 'Methodology', href: '/methodology' },
  { label: 'Location guides', href: '/analyse' },
  { label: 'Blog', href: '/blog' },
  { label: 'Insights', href: '/insights' },
  { label: 'Tools', href: '/tools' },
  { label: 'Help centre', href: '/help' },
  { label: 'Contact', href: '/contact' },
]

/** Top metro hubs only — full index at /analyse */
const CITY_LINKS: FooterLink[] = [
  { label: 'Sydney', href: '/analyse/sydney' },
  { label: 'Melbourne', href: '/analyse/melbourne' },
  { label: 'Brisbane', href: '/analyse/brisbane' },
  { label: 'Perth', href: '/analyse/perth' },
  { label: 'Adelaide', href: '/analyse/adelaide' },
]

const LEGAL_LINKS: FooterLink[] = [
  { label: 'Terms of service', href: '/terms' },
  { label: 'Privacy policy', href: '/privacy' },
  { label: 'Disclaimer', href: '/disclaimer' },
  { label: 'Refund policy', href: '/refund' },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subStatus, setSubStatus] = useState<'idle' | 'ok' | 'err'>('idle')

  const handleSubscribe = async () => {
    if (!email || !email.includes('@')) return
    try {
      const res = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'newsletter', email }),
      })
      setSubStatus(res.ok ? 'ok' : 'err')
    } catch {
      setSubStatus('err')
    }
  }

  const S = {
    footer: {
      background: '#080F0E',
      borderTop: '1px solid rgba(26, 46, 43, 0.85)',
      fontFamily: "'DM Sans', sans-serif",
    },
    inner: {
      maxWidth: '1080px',
      margin: '0 auto',
      padding: '0 clamp(20px, 4vw, 32px)',
    },
    newsletter: {
      borderBottom: '1px solid rgba(26, 46, 43, 0.85)',
      padding: 'clamp(28px, 4vw, 36px) 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '24px',
      flexWrap: 'wrap' as const,
    },
    newsletterLeft: { display: 'flex', flexDirection: 'column' as const, gap: '6px' },
    newsletterTitle: { fontSize: '15px', fontWeight: '700', color: '#F9FAFB', letterSpacing: '-0.02em' },
    newsletterSub: { fontSize: '13px', color: '#6B7280', lineHeight: 1.5 },
    newsletterForm: { display: 'flex', gap: '8px', flexWrap: 'wrap' as const },
    newsletterInput: {
      padding: '10px 16px',
      background: '#111827',
      border: '1px solid #1F2937',
      borderRadius: '8px',
      fontSize: '13px',
      color: '#F9FAFB',
      fontFamily: "'DM Sans', sans-serif",
      width: 'min(240px, 100%)',
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
    main: {
      padding: 'clamp(40px, 5vw, 56px) 0 0',
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: 'clamp(32px, 5vw, 48px)',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
    },
    brand: {
      flex: '1 1 220px',
      maxWidth: '280px',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '16px',
    },
    tagline: {
      fontSize: '13px',
      color: '#6B7280',
      lineHeight: 1.65,
      margin: 0,
    },
    statusLink: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 12,
      color: '#34D399',
      textDecoration: 'none',
      width: 'fit-content',
    },
    socialRow: { display: 'flex', gap: '8px' },
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
      textDecoration: 'none',
      transition: 'color 0.12s, border-color 0.12s',
    },
    /** Four peer columns: Product, Use cases, Resources, Cities — tight gaps, equal weight */
    navGrid: {
      flex: '2 1 360px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(118px, 1fr))',
      columnGap: 'clamp(14px, 2.2vw, 22px)',
      rowGap: 'clamp(22px, 3.5vw, 30px)',
      alignItems: 'start',
      minWidth: 0,
    },
    navCol: {
      minWidth: 0,
    },
    colTitle: {
      fontSize: '11px',
      fontWeight: '700',
      color: '#6B7280',
      letterSpacing: '0.08em',
      textTransform: 'uppercase' as const,
      margin: '0 0 14px',
    },
    links: { display: 'flex', flexDirection: 'column' as const, gap: '10px' },
    link: {
      fontSize: '13.5px',
      color: '#9CA3AF',
      textDecoration: 'none',
      transition: 'color 0.12s',
      lineHeight: 1.35,
    },
    newBadge: {
      fontSize: '10px',
      fontWeight: '700',
      color: '#14B8A6',
      background: 'rgba(20,184,166,0.1)',
      border: '1px solid rgba(20,184,166,0.2)',
      borderRadius: '4px',
      padding: '1px 5px',
      marginLeft: '6px',
      verticalAlign: 'middle' as const,
    },
    viewAllCities: { fontWeight: 600, color: '#14B8A6' },
    legalSection: {
      marginTop: 'clamp(40px, 5vw, 48px)',
      paddingTop: '28px',
      borderTop: '1px solid rgba(26, 46, 43, 0.85)',
    },
    legalInner: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px 24px',
    },
    legalLabel: {
      fontSize: '11px',
      fontWeight: '700',
      color: '#4B5563',
      letterSpacing: '0.08em',
      textTransform: 'uppercase' as const,
      margin: 0,
      flexShrink: 0,
    },
    legalLinks: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      alignItems: 'center',
      gap: '6px 0',
      justifyContent: 'flex-end',
      flex: '1 1 280px',
    },
    legalLink: {
      fontSize: '12.5px',
      fontWeight: '500',
      color: '#9CA3AF',
      textDecoration: 'none',
      transition: 'color 0.12s',
      padding: '4px 0',
    },
    legalSep: {
      color: '#374151',
      fontSize: '12px',
      userSelect: 'none' as const,
      padding: '0 14px',
      flexShrink: 0,
    },
    copyrightBlock: {
      marginTop: '24px',
      paddingTop: '20px',
      borderTop: '1px solid rgba(26, 46, 43, 0.65)',
      paddingBottom: '20px',
    },
    copyright: {
      fontSize: '11px',
      color: 'rgba(148, 163, 184, 0.65)',
      lineHeight: 1.65,
      margin: 0,
    },
    disclaimer: {
      paddingBottom: '28px',
    },
    disclaimerText: {
      fontSize: '11.5px',
      color: '#4B5563',
      lineHeight: 1.65,
      maxWidth: '820px',
      margin: 0,
    },
  }

  const hoverLink = (e: React.MouseEvent<HTMLAnchorElement>, enter: boolean) => {
    e.currentTarget.style.color = enter ? '#F9FAFB' : '#9CA3AF'
  }
  const hoverLegal = (e: React.MouseEvent<HTMLAnchorElement>, enter: boolean) => {
    e.currentTarget.style.color = enter ? '#E5E7EB' : '#9CA3AF'
  }
  const hoverSocial = (e: React.MouseEvent<HTMLAnchorElement>, enter: boolean) => {
    e.currentTarget.style.color = enter ? '#F9FAFB' : '#6B7280'
    e.currentTarget.style.borderColor = enter ? '#374151' : '#1F2937'
  }

  const renderColumn = (title: string, links: FooterLink[], opts?: { lastLinkClass?: boolean }) => (
    <div>
      <p style={S.colTitle}>{title}</p>
      <div style={S.links}>
        {links.map((l, i) => (
          <Link
            key={l.href + l.label}
            href={l.href}
            style={{
              ...S.link,
              ...(opts?.lastLinkClass && i === links.length - 1 ? S.viewAllCities : {}),
            }}
            onMouseEnter={e => hoverLink(e, true)}
            onMouseLeave={e => hoverLink(e, false)}
          >
            {l.label}
            {l.badge ? <span style={S.newBadge}>{l.badge}</span> : null}
          </Link>
        ))}
      </div>
    </div>
  )

  return (
    <footer style={S.footer}>
      <div style={S.inner}>
        <div style={S.newsletter}>
          <div style={S.newsletterLeft}>
            <span style={S.newsletterTitle}>Weekly location insights</span>
            <span style={S.newsletterSub}>Where Australian businesses are opening, failing, and thriving.</span>
          </div>
          <div style={S.newsletterForm}>
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{ position: 'absolute', left: '-9999px', width: 1, height: 1 }}
            />
            {subStatus === 'ok' ? (
              <span style={{ color: '#10B981', fontSize: 14, fontWeight: 600 }}>You&apos;re on the list!</span>
            ) : (
              <>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.currentTarget.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubscribe()}
                  style={S.newsletterInput}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = '#0F766E'
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor = '#1F2937'
                  }}
                />
                <button
                  type="button"
                  style={S.newsletterBtn}
                  onClick={handleSubscribe}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#0D6B63'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = '#0F766E'
                  }}
                >
                  Subscribe
                </button>
              </>
            )}
          </div>
        </div>

        <div style={S.main}>
          <div style={S.brand}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Logo variant="dark" size="lg" />
            </Link>
            <p style={S.tagline}>
              Feasibility analysis for Australian retail, hospitality, and service locations — before you sign the lease.
            </p>
            <a
              href="https://locatalyze.betteruptime.com"
              target="_blank"
              rel="noopener noreferrer"
              style={S.statusLink}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: '#34D399',
                  display: 'inline-block',
                }}
              />
              All systems operational
            </a>
            <div style={S.socialRow}>
              <a
                href="https://twitter.com/locatalyze"
                target="_blank"
                rel="noopener noreferrer"
                style={S.socialBtn}
                aria-label="Locatalyze on X"
                onMouseEnter={e => hoverSocial(e, true)}
                onMouseLeave={e => hoverSocial(e, false)}
              >
                <TwitterIcon />
              </a>
              <a
                href="https://linkedin.com/company/locatalyze"
                target="_blank"
                rel="noopener noreferrer"
                style={S.socialBtn}
                aria-label="Locatalyze on LinkedIn"
                onMouseEnter={e => hoverSocial(e, true)}
                onMouseLeave={e => hoverSocial(e, false)}
              >
                <LinkedInIcon />
              </a>
            </div>
          </div>

          <nav style={S.navGrid} aria-label="Footer">
            <div key="product" style={S.navCol}>
              {renderColumn('Product', PRODUCT_LINKS)}
            </div>
            <div key="use-cases" style={S.navCol}>
              {renderColumn('Use cases', USE_CASE_LINKS)}
            </div>
            <div key="resources" style={S.navCol}>
              {renderColumn('Resources', RESOURCE_LINKS)}
            </div>
            <div key="cities" style={S.navCol}>
              {renderColumn('Cities', [...CITY_LINKS, { label: 'View all cities →', href: '/analyse' }], {
                lastLinkClass: true,
              })}
            </div>
          </nav>
        </div>

        <div style={S.legalSection}>
          <div style={S.legalInner}>
            <p style={S.legalLabel}>Legal</p>
            <div style={S.legalLinks}>
              {LEGAL_LINKS.map((l, i) => (
                <span key={l.href} style={{ display: 'inline-flex', alignItems: 'center' }}>
                  {i > 0 ? <span style={S.legalSep} aria-hidden>·</span> : null}
                  <Link
                    href={l.href}
                    style={S.legalLink}
                    onMouseEnter={e => hoverLegal(e, true)}
                    onMouseLeave={e => hoverLegal(e, false)}
                  >
                    {l.label}
                  </Link>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div style={S.copyrightBlock}>
          <p style={S.copyright}>
            © 2026 VSG Group Australia Pty Ltd · ABN 47 683 197 819 · Perth, Western Australia · Directional insights only — not
            financial or legal advice
          </p>
        </div>

        <div style={S.disclaimer}>
          <p style={S.disclaimerText}>
            Locatalyze is decision-support for location research. Reports are not financial advice — see our{' '}
            <Link href="/disclaimer" style={{ color: '#6B7280', textDecoration: 'underline' }}>
              disclaimer
            </Link>{' '}
            and{' '}
            <Link href="/terms" style={{ color: '#6B7280', textDecoration: 'underline' }}>
              terms
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  )
}
