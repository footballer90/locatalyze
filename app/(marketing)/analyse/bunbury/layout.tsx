import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bunbury Business Location Analysis — Cafe, Restaurant & Retail',
  description: 'Suburb-by-suburb business location analysis for Bunbury, WA. Rent benchmarks, South West gateway tourism foot traffic and competition density for cafes, restaurants and retail across Bunbury and the South West.',
  keywords: [
    'Bunbury business location analysis',
    'open a business Bunbury',
    'Bunbury cafe location',
    'Bunbury restaurant suburb guide',
    'Bunbury commercial rent 2026',
    'best suburb to open a business Bunbury',
    'Eaton Australind CBD business',
    'Bunbury food business feasibility',
    'Bunbury retail location',
    'open a cafe South West WA',
  ],
  alternates: { canonical: 'https://www.locatalyze.com/analyse/bunbury' },
  openGraph: {
    title: 'Bunbury Business Location Analysis — Cafe, Restaurant & Retail',
    description: 'Suburb-by-suburb business location analysis for Bunbury. Rent benchmarks, South West gateway tourism traffic and competition scored.',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
