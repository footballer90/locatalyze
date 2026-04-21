import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ballarat Business Location Analysis — Café, Restaurant & Retail',
  description: 'Suburb-by-suburb business location analysis for Ballarat. Rent benchmarks, competition density and demographics for cafés, restaurants and retail operators.',
  keywords: [
    'Ballarat business location analysis',
    'open a business Ballarat',
    'Ballarat cafe location',
    'Ballarat restaurant suburb guide',
    'Ballarat commercial rent 2026',
    'best suburb to open a business Ballarat',
    'Ballarat food business feasibility',
    'Ballarat retail location',
  ],
  alternates: { canonical: 'https://www.locatalyze.com/analyse/ballarat' },
  openGraph: {
    title: 'Ballarat Business Location Analysis — Café, Restaurant & Retail',
    description: 'Suburb-by-suburb business location analysis for Ballarat. Rent benchmarks, competition and demographics scored.',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
