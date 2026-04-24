import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Orange NSW Business Location Analysis — Cafe, Restaurant & Retail',
  description:
    'Suburb-by-suburb business location analysis for Orange NSW. Rent benchmarks, food tourism foot traffic and competition density for cafes, restaurants and retail across the Central Tablelands.',
  keywords: [
    'Orange NSW business location analysis',
    'open a business Orange NSW',
    'Orange NSW cafe location',
    'Orange NSW restaurant suburb guide',
    'Orange NSW commercial rent 2026',
    'best suburb to open a business Orange',
    'Summer Street CBD business',
    'Orange NSW food business feasibility',
    'Orange NSW retail location',
    'open a cafe Central Tablelands NSW',
  ],
  alternates: { canonical: 'https://locatalyze.com/analyse/orange' },
  openGraph: {
    title: 'Orange NSW Business Location Analysis — Cafe, Restaurant & Retail',
    description:
      'Suburb-by-suburb business location analysis for Orange NSW. Rent benchmarks, food tourism traffic and competition scored.',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
