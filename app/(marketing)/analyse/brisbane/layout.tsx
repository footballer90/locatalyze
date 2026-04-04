import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Brisbane Business Location Analysis — Café, Restaurant & Retail',
  description: 'Suburb-by-suburb business location analysis for Brisbane. Rent benchmarks, competition density and demographics for cafés, restaurants, retail stores and gyms across Greater Brisbane.',
  keywords: [
    'Brisbane business location analysis',
    'open a business Brisbane',
    'Brisbane cafe location',
    'Brisbane restaurant suburb guide',
    'Brisbane commercial rent 2026',
    'best suburb to open a business Brisbane',
    'Brisbane hospitality location',
    'Brisbane retail location',
    'Brisbane food business feasibility',
    'West End Fortitude Valley New Farm business',
  ],
  alternates: { canonical: 'https://www.locatalyze.com/analyse/brisbane' },
  openGraph: {
    title: 'Brisbane Business Location Analysis — Café, Restaurant & Retail',
    description: 'Suburb-by-suburb business location analysis for Brisbane. Rent benchmarks, competition and demographics scored.',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
