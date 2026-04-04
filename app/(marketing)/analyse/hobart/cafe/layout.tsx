import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Best Suburbs to Open a Café in Hobart (2026) — Location Analysis',
  description: 'Hobart café location guide with rent benchmarks, foot traffic and competition density scored. Salamanca, North Hobart, Sandy Bay and Hobart CBD breakdown.',
  keywords: [
    'best suburb to open a cafe in Hobart',
    'Hobart café location 2026',
    'open a coffee shop Hobart',
    'Hobart cafe rent costs',
    'Salamanca cafe Hobart',
    'North Hobart coffee shop',
    'Hobart CBD cafe',
    'cafe feasibility Hobart Tasmania',
    'Hobart hospitality location',
    'open a food business Hobart',
  ],
  alternates: { canonical: 'https://www.locatalyze.com/analyse/hobart/cafe' },
  openGraph: {
    title: 'Best Suburbs to Open a Café in Hobart (2026)',
    description: 'Suburb-by-suburb analysis of Hobart\'s café market. Rent benchmarks, competition and tourist traffic scored.',
    type: 'article',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
