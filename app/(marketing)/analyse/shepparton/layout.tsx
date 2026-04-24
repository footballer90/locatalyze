import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shepparton Business Location Analysis — Cafe, Restaurant & Retail',
  description: 'Suburb-by-suburb business location analysis for Shepparton. Rent benchmarks, foot traffic, and competition density for cafes, restaurants and retail across the Goulburn Valley.',
  keywords: [
    'Shepparton business location analysis',
    'open a business Shepparton',
    'Shepparton cafe location',
    'Shepparton restaurant suburb guide',
    'Shepparton commercial rent 2026',
    'best suburb to open a business Shepparton',
    'Kialla Mooroopna Nagambie business',
    'Shepparton food business feasibility',
    'Shepparton retail location',
    'open a cafe Goulburn Valley',
  ],
  alternates: { canonical: 'https://locatalyze.com/analyse/shepparton' },
  openGraph: {
    title: 'Shepparton Business Location Analysis — Cafe, Restaurant & Retail',
    description: 'Suburb-by-suburb business location analysis for Shepparton. Rent benchmarks, foot traffic and competition scored.',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
