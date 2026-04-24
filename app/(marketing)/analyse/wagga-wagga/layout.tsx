import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Wagga Wagga Business Location Analysis — Cafe, Restaurant & Retail',
  description:
    'Suburb-by-suburb business location analysis for Wagga Wagga. Rent benchmarks, foot traffic data and competition density for cafes, restaurants and retail across the Riverina region.',
  keywords: [
    'Wagga Wagga business location analysis',
    'open a business Wagga Wagga',
    'Wagga Wagga cafe location',
    'Wagga Wagga restaurant suburb guide',
    'Wagga Wagga commercial rent 2026',
    'best suburb to open a business Wagga Wagga',
    'Fitzmaurice Street CBD business',
    'Wagga Wagga food business feasibility',
    'Wagga Wagga retail location',
    'open a cafe Riverina NSW',
  ],
  alternates: { canonical: 'https://locatalyze.com/analyse/wagga-wagga' },
  openGraph: {
    title: 'Wagga Wagga Business Location Analysis — Cafe, Restaurant & Retail',
    description:
      'Suburb-by-suburb business location analysis for Wagga Wagga. Rent benchmarks, foot traffic and competition scored.',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
