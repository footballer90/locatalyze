import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Melbourne Business Location Analysis — Café, Restaurant & Retail',
  description: 'Suburb-by-suburb business location analysis for Melbourne. Rent benchmarks, competition density and demographics for cafés, restaurants, retail stores and gyms across Greater Melbourne.',
  keywords: [
    'Melbourne business location analysis',
    'open a business Melbourne',
    'Melbourne cafe location',
    'Melbourne restaurant suburb guide',
    'Melbourne commercial rent 2026',
    'best suburb to open a business Melbourne',
    'Melbourne inner north hospitality',
    'Melbourne retail location',
    'Melbourne food business feasibility',
    'Fitzroy Brunswick Collingwood business',
  ],
  alternates: { canonical: 'https://www.locatalyze.com/analyse/melbourne' },
  openGraph: {
    title: 'Melbourne Business Location Analysis — Café, Restaurant & Retail',
    description: 'Suburb-by-suburb business location analysis for Melbourne. Rent benchmarks, competition and demographics scored.',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
