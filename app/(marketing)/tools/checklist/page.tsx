import type { Metadata } from 'next'
import ChecklistClient from './ChecklistClient'

const JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Before-You-Sign Location Checklist — Café & Restaurant Operators',
  url: 'https://locatalyze.com/tools/checklist',
  description:
    '12 checks across three phases (desk, site, lease table) for Australian café and restaurant operators. Includes interactive rent and AOV inputs to calculate GO / CAUTION / NO thresholds. Free and printable.',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'AUD' },
  provider: { '@type': 'Organization', name: 'Locatalyze', url: 'https://locatalyze.com' },
}

export const metadata: Metadata = {
  title: 'Before-You-Sign Location Checklist — Café & Restaurant Operators | Locatalyze',
  description:
    '12 checks across three phases: at your desk, at the site, and at the lease table. Fill in your rent and AOV to get your GO / CAUTION / NO threshold numbers. Free, printable, no signup.',
  keywords: [
    'commercial lease checklist Australia',
    'café location checklist',
    'before you sign a lease checklist',
    'restaurant location checklist',
    'café site visit checklist',
    'commercial tenancy checklist Australia',
    'rent affordability check Australia',
  ],
  alternates: { canonical: 'https://locatalyze.com/tools/checklist' },
  openGraph: {
    title: 'Before-You-Sign Location Checklist | Locatalyze',
    description:
      '12 checks · 3 phases · café & restaurant operators. Fill in your rent to get your GO / CAUTION / NO threshold numbers. Free and printable.',
    type: 'website',
    url: 'https://locatalyze.com/tools/checklist',
  },
}

export default function ChecklistPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }}
      />
      <ChecklistClient />
    </>
  )
}
