import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Best Suburbs to Open a Café in Brisbane (2026) — Location Analysis',
  description: 'Data-driven suburb guide for Brisbane café owners. Foot traffic benchmarks, rent-to-revenue ratios, competition density and income demographics scored suburb by suburb. West End, New Farm, Fortitude Valley breakdown.',
  keywords: [
    'best suburb to open a cafe in Brisbane',
    'Brisbane café location 2026',
    'open a coffee shop Brisbane',
    'Brisbane cafe rent costs',
    'West End cafe Brisbane',
    'New Farm coffee shop',
    'Fortitude Valley cafe',
    'Brisbane hospitality location',
    'cafe feasibility Brisbane',
    'Brisbane coffee shop competition',
  ],
  alternates: { canonical: 'https://www.locatalyze.com/analyse/brisbane/cafe' },
  openGraph: {
    title: 'Best Suburbs to Open a Café in Brisbane (2026)',
    description: 'Suburb-by-suburb analysis of Brisbane\'s café market. Rent benchmarks, competition density and income data scored.',
    type: 'article',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
