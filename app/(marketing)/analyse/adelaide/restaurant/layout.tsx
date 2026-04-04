import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Best Suburbs to Open a Restaurant in Adelaide (2026) — Location Analysis',
  description: 'Adelaide restaurant location guide with rent benchmarks, foot traffic analysis and competition density scored by suburb. Norwood, Glenelg, North Adelaide, Adelaide CBD breakdown.',
  keywords: [
    'best suburb to open a restaurant in Adelaide',
    'Adelaide restaurant location 2026',
    'open a restaurant Adelaide',
    'Adelaide restaurant rent costs',
    'Norwood restaurant Adelaide',
    'Glenelg cafe restaurant',
    'North Adelaide dining',
    'Adelaide CBD hospitality',
    'restaurant feasibility Adelaide',
    'Adelaide food business location',
  ],
  alternates: { canonical: 'https://www.locatalyze.com/analyse/adelaide/restaurant' },
  openGraph: {
    title: 'Best Suburbs to Open a Restaurant in Adelaide (2026)',
    description: 'Suburb-by-suburb analysis of Adelaide\'s restaurant market. Rent benchmarks, competition and income data scored.',
    type: 'article',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
