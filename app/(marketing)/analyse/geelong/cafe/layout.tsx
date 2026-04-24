import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Best Suburbs to Open a Café in Geelong (2026) — Location Analysis',
  description: 'Geelong café location guide with rent benchmarks, foot traffic signals and competition density. Newtown, Geelong CBD, Belmont and Pakington Street area scored and compared.',
  keywords: [
    'best suburb to open a cafe in Geelong',
    'Geelong café location 2026',
    'open a coffee shop Geelong',
    'Geelong cafe rent costs',
    'Pakington Street cafe Geelong',
    'Newtown Geelong coffee',
    'Geelong CBD cafe',
    'cafe feasibility Geelong Victoria',
    'Geelong hospitality location',
    'open a business Geelong',
  ],
  alternates: { canonical: 'https://locatalyze.com/analyse/geelong/cafe' },
  openGraph: {
    title: 'Best Suburbs to Open a Café in Geelong (2026)',
    description: 'Suburb-by-suburb analysis of Geelong\'s café market. Rent benchmarks, competition and demographic data scored.',
    type: 'article',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
