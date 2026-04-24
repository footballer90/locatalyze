import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Best Suburbs to Open a Restaurant in Perth (2026) — Location Analysis',
  description: 'Suburb-by-suburb restaurant location guide for Perth. Mount Lawley, Subiaco, Fremantle, Leederville and Perth CBD scored on rent, foot traffic, income and competition density.',
  keywords: [
    'best suburb to open a restaurant in Perth',
    'Perth restaurant location 2026',
    'open a restaurant Perth',
    'Perth restaurant rent costs',
    'Mount Lawley restaurant location',
    'Subiaco dining precinct',
    'Fremantle restaurant business',
    'Leederville restaurant Perth',
    'Perth CBD restaurant',
    'restaurant feasibility Perth',
    'where to open a restaurant Perth',
    'Western Australia restaurant business',
  ],
  alternates: { canonical: 'https://locatalyze.com/analyse/perth/restaurant' },
  openGraph: {
    title: 'Best Suburbs to Open a Restaurant in Perth (2026)',
    description: 'Mount Lawley, Subiaco, Fremantle and Leederville scored for restaurant viability. Real rent numbers, competition data and break-even analysis.',
    type: 'article',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
