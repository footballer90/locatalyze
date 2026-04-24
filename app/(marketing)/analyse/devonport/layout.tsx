import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Devonport Business Location Analysis — Cafe, Restaurant & Retail',
  description: 'Suburb-by-suburb business location analysis for Devonport, TAS. Rent benchmarks, Spirit of Tasmania ferry foot traffic and competition density for cafes, restaurants and retail across northwest Tasmania.',
  keywords: [
    'Devonport business location analysis',
    'open a business Devonport',
    'Devonport cafe location',
    'Devonport restaurant suburb guide',
    'Devonport commercial rent 2026',
    'best suburb to open a business Devonport',
    'Devonport CBD East Devonport business',
    'Devonport food business feasibility',
    'Devonport retail location',
    'open a cafe northwest Tasmania',
  ],
  alternates: { canonical: 'https://locatalyze.com/analyse/devonport' },
  openGraph: {
    title: 'Devonport Business Location Analysis — Cafe, Restaurant & Retail',
    description: 'Suburb-by-suburb business location analysis for Devonport. Spirit of Tasmania ferry traffic, rent benchmarks and competition scored.',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
