import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Newcastle Business Location Guide — Best Suburbs, Rent & Foot Traffic (2026)',
  description:
    'Data-backed guide to business locations in Newcastle NSW. Best suburbs for cafés, restaurants, and retail, with rent benchmarks, foot traffic scores, competition levels, and suburb-by-suburb analysis for 20 Newcastle locations. Updated 2026.',
  keywords: [
    'Newcastle business location',
    'best suburbs Newcastle business',
    'open a café Newcastle',
    'Newcastle commercial rent',
    'Newcastle foot traffic',
    'open a business Newcastle NSW',
    'Newcastle restaurant location',
    'Newcastle suburb analysis',
    'best suburb café Newcastle 2026',
    'Newcastle retail location',
    'Newcastle business location guide',
    'Newcastle café competition',
  ],
  alternates: { canonical: 'https://locatalyze.com/analyse/newcastle' },
  openGraph: {
    title: 'Newcastle Business Location Guide — Best Suburbs, Rent & Foot Traffic (2026)',
    description:
      'Suburb-by-suburb location intelligence for Newcastle. Rent ranges, foot traffic, competition levels, and real insights for 20 suburbs — before you sign a lease.',
    type: 'article',
    url: 'https://locatalyze.com/analyse/newcastle',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
