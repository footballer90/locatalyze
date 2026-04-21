import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Alice Springs Business Location Analysis — Cafe, Restaurant & Retail',
  description: 'Suburb-by-suburb business location analysis for Alice Springs. Rent benchmarks, tourism foot traffic and competition density for cafes, restaurants and retail across the Red Centre.',
  keywords: [
    'Alice Springs business location analysis',
    'open a business Alice Springs',
    'Alice Springs cafe location',
    'Alice Springs restaurant suburb guide',
    'Alice Springs commercial rent 2026',
    'best suburb to open a business Alice Springs',
    'Alice Springs CBD Desert Springs business',
    'Alice Springs food business feasibility',
    'Alice Springs retail location',
    'open a cafe Red Centre NT',
  ],
  alternates: { canonical: 'https://www.locatalyze.com/analyse/alice-springs' },
  openGraph: {
    title: 'Alice Springs Business Location Analysis — Cafe, Restaurant & Retail',
    description: 'Suburb-by-suburb business location analysis for Alice Springs. Rent benchmarks, tourism traffic and competition scored.',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
