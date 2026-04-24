import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Best Suburbs to Open a Restaurant in Melbourne (2026) — Location Analysis',
  description: 'Suburb-by-suburb restaurant location guide for Melbourne. Fitzroy, Collingwood, Richmond, Brunswick and South Yarra scored on rent, foot traffic, competition and income demographics.',
  keywords: [
    'best suburb to open a restaurant in Melbourne',
    'Melbourne restaurant location 2026',
    'open a restaurant Melbourne',
    'Melbourne restaurant rent costs',
    'Fitzroy restaurant location',
    'Collingwood restaurant business',
    'Richmond dining precinct',
    'Brunswick Street restaurant',
    'Melbourne restaurant feasibility',
    'where to open a restaurant Melbourne',
    'Melbourne inner suburb dining',
    'restaurant break-even Melbourne',
  ],
  alternates: { canonical: 'https://locatalyze.com/analyse/melbourne/restaurant' },
  openGraph: {
    title: 'Best Suburbs to Open a Restaurant in Melbourne (2026)',
    description: 'Fitzroy, Brunswick, Collingwood, Richmond and South Yarra scored for restaurant viability. Real rent numbers, competition data and break-even analysis.',
    type: 'article',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
