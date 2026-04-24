import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Warrnambool Business Location Analysis — Cafe, Restaurant & Retail',
  description:
    'Suburb-by-suburb business location analysis for Warrnambool, VIC. Great Ocean Road tourism, whale watching season, Liebig Street dining scene, and Port Fairy festival economy scored for cafes, restaurants and retail.',
  keywords: [
    'Warrnambool business location analysis',
    'open a business Warrnambool',
    'Warrnambool cafe location',
    'Warrnambool restaurant suburb guide',
    'Warrnambool commercial rent 2026',
    'best suburb to open a business Warrnambool',
    'Liebig Street dining Port Fairy business',
    'Warrnambool food business feasibility',
    'Warrnambool retail location',
    'open a cafe south west Victoria',
  ],
  alternates: { canonical: 'https://locatalyze.com/analyse/warrnambool' },
  openGraph: {
    title: 'Warrnambool Business Location Analysis — Cafe, Restaurant & Retail',
    description:
      'Suburb-by-suburb business location analysis for Warrnambool, VIC. Great Ocean Road tourism, whale watching season and Liebig Street dining scene scored.',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
