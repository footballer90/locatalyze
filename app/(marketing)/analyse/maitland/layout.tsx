import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Maitland Business Location Analysis — Cafe, Restaurant & Retail',
  description: 'Suburb-by-suburb business location analysis for Maitland. Rent benchmarks, foot traffic and competition density for cafes, restaurants and retail across Maitland and the Hunter Valley inland region.',
  keywords: [
    'Maitland business location analysis',
    'open a business Maitland NSW',
    'Maitland cafe location',
    'Maitland restaurant suburb guide',
    'Maitland commercial rent 2026',
    'best suburb to open a business Maitland',
    'Rutherford Cessnock Morpeth business',
    'Maitland food business feasibility',
    'Maitland retail location',
    'open a cafe Hunter Valley inland',
  ],
  alternates: { canonical: 'https://locatalyze.com/analyse/maitland' },
  openGraph: {
    title: 'Maitland Business Location Analysis — Cafe, Restaurant & Retail',
    description: 'Suburb-by-suburb business location analysis for Maitland. Rent benchmarks, foot traffic and competition scored across the Hunter Valley inland region.',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
