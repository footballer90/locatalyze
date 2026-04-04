import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Best Suburbs to Open a Gym on the Gold Coast (2026) — Location Analysis',
  description: 'Gold Coast gym location guide with rent benchmarks, membership demand signals and competition density scored. Surfers Paradise, Broadbeach, Southport and Robina breakdown.',
  keywords: [
    'best suburb to open a gym Gold Coast',
    'Gold Coast gym location 2026',
    'open a gym Gold Coast',
    'Gold Coast fitness studio rent',
    'Surfers Paradise gym',
    'Broadbeach fitness location',
    'Southport gym business',
    'gym feasibility Gold Coast',
    'Gold Coast health business',
    'open a fitness studio Queensland',
  ],
  alternates: { canonical: 'https://www.locatalyze.com/analyse/gold-coast/gym' },
  openGraph: {
    title: 'Best Suburbs to Open a Gym on the Gold Coast (2026)',
    description: 'Suburb-by-suburb analysis of Gold Coast\'s gym and fitness market. Rent benchmarks, competition and demand scored.',
    type: 'article',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
