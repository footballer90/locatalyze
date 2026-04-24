import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Best Suburbs to Open a Café on the Sunshine Coast (2026) — Location Analysis',
  description: 'Sunshine Coast café location guide with rent benchmarks, tourist foot traffic and competition density scored. Noosa, Mooloolaba, Maroochydore and Caloundra breakdown.',
  keywords: [
    'best suburb to open a cafe Sunshine Coast',
    'Sunshine Coast cafe location 2026',
    'open a coffee shop Sunshine Coast',
    'Noosa cafe business',
    'Mooloolaba coffee shop',
    'Maroochydore cafe rent',
    'Caloundra hospitality',
    'cafe feasibility Sunshine Coast',
    'Sunshine Coast food business',
    'open a cafe Queensland',
  ],
  alternates: { canonical: 'https://locatalyze.com/analyse/sunshine-coast/cafe' },
  openGraph: {
    title: 'Best Suburbs to Open a Café on the Sunshine Coast (2026)',
    description: 'Suburb-by-suburb analysis of the Sunshine Coast café market. Rent, competition and tourist traffic scored.',
    type: 'article',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
