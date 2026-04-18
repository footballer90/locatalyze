import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Best Suburbs in Newcastle to Open a Business (2026) — Location Intelligence Guide',
  description:
    'Data-backed guide to the best Newcastle suburbs for cafés, restaurants, and retail. Rent benchmarks, foot traffic scores, competition levels, and suburb-by-suburb analysis for 20 Newcastle locations.',
  keywords: [
    'best suburbs Newcastle business',
    'open a café Newcastle',
    'Newcastle commercial rent',
    'Newcastle foot traffic',
    'business location Newcastle',
    'Newcastle restaurant location',
    'open a business Newcastle NSW',
    'Newcastle suburb analysis',
    'best suburb café Newcastle 2026',
    'Newcastle retail location',
  ],
  alternates: { canonical: 'https://www.locatalyze.com/analyse/newcastle/best-suburbs' },
  openGraph: {
    title: 'Best Suburbs in Newcastle to Open a Café, Restaurant or Retail Business (2026)',
    description:
      'Suburb-by-suburb location intelligence for Newcastle. Rent ranges, foot traffic, competition levels, and real insights for 20 suburbs — before you sign a lease.',
    type: 'article',
    url: 'https://www.locatalyze.com/analyse/newcastle/best-suburbs',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
