import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bendigo Business Location Analysis — Café, Restaurant & Retail',
  description: 'Suburb-by-suburb business location analysis for Bendigo. Rent benchmarks, competition density and demographics for cafés, restaurants and retail operators.',
  keywords: [
    'Bendigo business location analysis',
    'open a business Bendigo',
    'Bendigo cafe location',
    'Bendigo restaurant suburb guide',
    'Bendigo commercial rent 2026',
    'best suburb to open a business Bendigo',
    'Bendigo food business feasibility',
    'Bendigo retail location',
  ],
  alternates: { canonical: 'https://locatalyze.com/analyse/bendigo' },
  openGraph: {
    title: 'Bendigo Business Location Analysis — Café, Restaurant & Retail',
    description: 'Suburb-by-suburb business location analysis for Bendigo. Rent benchmarks, competition and demographics scored.',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
