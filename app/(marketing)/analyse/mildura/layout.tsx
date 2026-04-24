import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mildura Business Location Analysis — Cafe, Restaurant & Retail',
  description: 'Suburb-by-suburb business location analysis for Mildura. Rent benchmarks, Murray River tourism, and competition density for cafes, restaurants and retail across the Sunraysia region.',
  keywords: [
    'Mildura business location analysis',
    'open a business Mildura',
    'Mildura cafe location',
    'Mildura restaurant suburb guide',
    'Mildura commercial rent 2026',
    'best suburb to open a business Mildura',
    'Irymple Red Cliffs Nichols Point business',
    'Mildura food business feasibility',
    'Mildura retail location',
    'open a cafe Sunraysia',
  ],
  alternates: { canonical: 'https://locatalyze.com/analyse/mildura' },
  openGraph: {
    title: 'Mildura Business Location Analysis — Cafe, Restaurant & Retail',
    description: 'Suburb-by-suburb business location analysis for Mildura. Rent benchmarks, Murray River tourism and competition scored.',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
