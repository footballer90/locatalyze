import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Darwin Business Location Analysis — Café, Restaurant & Retail',
  description: 'Suburb-by-suburb business location analysis for Darwin. Rent benchmarks, seasonal tourist patterns and competition density for cafés, restaurants and retail across the NT capital.',
  keywords: [
    'Darwin business location analysis',
    'open a business Darwin',
    'Darwin cafe location',
    'Darwin restaurant suburb guide',
    'Darwin commercial rent 2026',
    'best suburb to open a business Darwin NT',
    'Darwin CBD Parap Nightcliff business',
    'Darwin food business feasibility',
    'Darwin retail location',
    'open a cafe Northern Territory',
  ],
  alternates: { canonical: 'https://locatalyze.com/analyse/darwin' },
  openGraph: {
    title: 'Darwin Business Location Analysis — Café, Restaurant & Retail',
    description: 'Suburb-by-suburb business location analysis for Darwin. Rent benchmarks, seasonal demand and competition scored.',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
