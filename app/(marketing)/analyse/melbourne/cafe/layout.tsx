import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Best Suburbs to Open a Café in Melbourne (2026) — Location Analysis',
  description: 'Data-driven suburb guide for Melbourne coffee shops. Rent benchmarks, competition density, demographics and financial viability scored. Inner-north vs inner-east breakdown.',
  keywords: [
    'best suburb to open a cafe in Melbourne',
    'Melbourne café location 2026',
    'open a coffee shop Melbourne',
    'best Melbourne suburbs for hospitality',
    'Fitzroy cafe location',
    'Brunswick coffee shop',
    'Melbourne cafe rent costs',
    'café feasibility Melbourne',
    'hospitality location Melbourne inner north',
    'Melbourne coffee shop competition',
  ],
  alternates: { canonical: 'https://locatalyze.com/analyse/melbourne/cafe' },
  openGraph: {
    title: 'Best Suburbs to Open a Café in Melbourne (2026)',
    description: 'Suburb-by-suburb analysis of Melbourne\'s café market. Rent benchmarks, competition and income data scored.',
    type: 'article',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
