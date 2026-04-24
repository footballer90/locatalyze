import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mount Gambier Business Location Analysis — Cafe, Restaurant & Retail',
  description:
    'Suburb-by-suburb business location analysis for Mount Gambier, SA. Blue Lake tourism, timber industry workforce, SA-VIC border catchment and Commercial Street dining scored for cafes, restaurants and retail.',
  keywords: [
    'Mount Gambier business location analysis',
    'open a business Mount Gambier',
    'Mount Gambier cafe location',
    'Mount Gambier restaurant suburb guide',
    'Mount Gambier commercial rent 2026',
    'best suburb to open a business Mount Gambier',
    'Commercial Street dining Blue Lake tourism',
    'Mount Gambier food business feasibility',
    'Mount Gambier retail location',
    'open a cafe Limestone Coast SA',
  ],
  alternates: { canonical: 'https://locatalyze.com/analyse/mount-gambier' },
  openGraph: {
    title: 'Mount Gambier Business Location Analysis — Cafe, Restaurant & Retail',
    description:
      'Suburb-by-suburb business location analysis for Mount Gambier, SA. Blue Lake tourism, timber industry workforce and SA-VIC border catchment scored.',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
