export const dynamic = 'force-dynamic'
// app/layout.tsx
import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'

const dm = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
  adjustFontFallback: true,
  variable: '--font-dm-sans',
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://locatalyze.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:  'Locatalyze — AI Location Feasibility for Australian Businesses',
    template: '%s | Locatalyze',
  },
  description:
    'Know if a location will make money before you sign the lease. AI-powered GO, CAUTION or NO verdict for any Australian address in 30 seconds. Free to try.',
  keywords: [
    'business location analysis australia',
    'cafe location feasibility',
    'restaurant location analysis',
    'commercial feasibility report',
    'retail location australia',
  ],
  authors: [{ name: 'Locatalyze', url: SITE_URL }],
  creator: 'Locatalyze',
  openGraph: {
    type:        'website',
    locale:      'en_AU',
    url:         SITE_URL,
    siteName:    'Locatalyze',
    title:       'Locatalyze — AI Location Feasibility for Australian Businesses',
    description: 'Know if a location will make money before you sign the lease. GO, CAUTION or NO verdict in 30 seconds.',
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: 'Locatalyze — AI Location Feasibility' }],
  },
  twitter: {
    card:        'summary_large_image',
    site:        '@locatalyze',
    title:       'Locatalyze — AI Location Feasibility',
    description: 'Know if a location will make money before you sign the lease.',
    images:      [`${SITE_URL}/og-image.png`],
  },
  robots: {
    index:     true,
    follow:    true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  alternates: { canonical: SITE_URL },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'Locatalyze',
      url: SITE_URL,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'AUD', description: '3 free reports, no credit card' },
      description: 'AI-powered location feasibility for Australian businesses. GO, CAUTION or NO verdict in 30 seconds.',
      aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '180', bestRating: '5' },
    },
    {
      '@type': 'Organization',
      name: 'Locatalyze',
      url: SITE_URL,
      logo: `${SITE_URL}/logo.svg`,
      sameAs: ['https://twitter.com/locatalyze', 'https://linkedin.com/company/locatalyze'],
      contactPoint: { '@type': 'ContactPoint', contactType: 'customer support', url: `${SITE_URL}/contact`, areaServed: 'AU' },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className={dm.className}>{children}</body>
    </html>
  )
}