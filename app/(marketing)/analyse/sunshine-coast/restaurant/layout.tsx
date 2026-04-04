import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Best Suburbs to Open a Restaurant on the Sunshine Coast (2026) — Location Analysis',
  description: 'Sunshine Coast restaurant location guide with rent benchmarks, tourist traffic signals and competition density scored. Noosa, Mooloolaba, Maroochydore and surrounding areas compared.',
  keywords: [
    'best suburb to open a restaurant Sunshine Coast',
    'Sunshine Coast restaurant location 2026',
    'open a restaurant Sunshine Coast',
    'Noosa restaurant business',
    'Mooloolaba restaurant',
    'Maroochydore dining location',
    'restaurant feasibility Sunshine Coast',
    'Sunshine Coast hospitality business',
    'open a restaurant Queensland',
    'Sunshine Coast food business rent',
  ],
  alternates: { canonical: 'https://www.locatalyze.com/analyse/sunshine-coast/restaurant' },
  openGraph: {
    title: 'Best Suburbs to Open a Restaurant on the Sunshine Coast (2026)',
    description: 'Restaurant location analysis for the Sunshine Coast. Rent benchmarks, competition and tourist foot traffic scored.',
    type: 'article',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
