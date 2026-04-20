'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { onboardingRef } from '@/lib/funnel-links'
import { Logo } from '@/components/Logo'

/** Centre links — premium SaaS density */
const CENTER_NAV = [
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'Methodology', href: '/methodology' },
  { label: 'Sample report', href: '/sample-report' },
] as const

const linkRest = {
  textDecoration: 'none' as const,
  color: '#64748b',
  fontSize: 14,
  fontWeight: 600,
  padding: '10px 12px',
  borderRadius: 10,
  transition: 'color 0.15s ease, background 0.15s ease',
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const ctaHref = onboardingRef('navbar_primary')

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 60,
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.95)',
        boxShadow: '0 1px 0 rgba(15, 23, 42, 0.04)',
      }}
    >
      <div
        style={{
          maxWidth: 1160,
          margin: '0 auto',
          minHeight: 64,
          padding: '0 20px',
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto',
          alignItems: 'center',
          gap: 12,
        }}
      >
        {/* Left — logo */}
        <Link
          href="/"
          style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}
          aria-label="Locatalyze home"
        >
          <Logo variant="light" size="md" />
        </Link>

        {/* Centre — desktop only */}
        <nav
          aria-label="Primary"
          className="hidden md:flex"
          style={{
            justifySelf: 'center',
            alignItems: 'center',
            display: 'flex',
            gap: 2,
            minWidth: 0,
          }}
        >
          {CENTER_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={linkRest}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f8fafc'
                e.currentTarget.style.color = '#0f172a'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = '#64748b'
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right — sign in + primary CTA + mobile menu */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 10,
            flexShrink: 0,
            minWidth: 0,
          }}
        >
          <Link
            href="/auth/login"
            className="hidden sm:inline-flex"
            style={{
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 600,
              color: '#94a3b8',
              padding: '8px 6px',
              borderRadius: 8,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#475569'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#94a3b8'
            }}
          >
            Sign in
          </Link>
          <Link
            href={ctaHref}
            style={{
              textDecoration: 'none',
              background: '#0f766e',
              color: '#ffffff',
              fontSize: 14,
              fontWeight: 700,
              padding: '10px 16px',
              borderRadius: 10,
              boxShadow: '0 10px 24px -12px rgba(15, 118, 110, 0.55)',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = 'brightness(1.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = 'none'
            }}
          >
            Check location
          </Link>
          <button
            type="button"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((v) => !v)}
            className="md:hidden"
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              border: '1px solid #e2e8f0',
              background: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#334155',
            }}
          >
            {isOpen ? <X size={20} strokeWidth={2} /> : <Menu size={20} strokeWidth={2} />}
          </button>
        </div>
      </div>

      {isOpen ? (
        <div
          className="md:hidden"
          style={{
            borderTop: '1px solid #e2e8f0',
            background: '#ffffff',
            padding: '12px 20px 16px',
          }}
        >
          <nav aria-label="Mobile" style={{ display: 'grid', gap: 4 }}>
            {CENTER_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  textDecoration: 'none',
                  color: '#334155',
                  fontSize: 15,
                  fontWeight: 600,
                  padding: '12px 10px',
                  borderRadius: 10,
                }}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/auth/login"
              style={{
                textDecoration: 'none',
                color: '#64748b',
                fontSize: 15,
                fontWeight: 600,
                padding: '12px 10px',
                borderRadius: 10,
              }}
            >
              Sign in
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
