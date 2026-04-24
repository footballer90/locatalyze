import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mandurah Business Location Analysis — Cafe, Restaurant & Retail',
  description: 'Suburb-by-suburb business location analysis for Mandurah, WA. Rent benchmarks, esplanade tourism foot traffic and competition density for cafes, restaurants and retail across Mandurah and the Peel region.',
  keywords: [
    'Mandurah business location analysis',
    'open a business Mandurah',
    'Mandurah cafe location',
    'Mandurah restaurant suburb guide',
    'Mandurah commercial rent 2026',
    'best suburb to open a business Mandurah',
    'Halls Head Rockingham Falcon business',
    'Mandurah food business feasibility',
    'Mandurah retail location',
    'open a cafe Peel region WA',
  ],
  alternates: { canonical: 'https://locatalyze.com/analyse/mandurah' },
  openGraph: {
    title: 'Mandurah Business Location Analysis — Cafe, Restaurant & Retail',
    description: 'Suburb-by-suburb business location analysis for Mandurah. Rent benchmarks, estuary tourism traffic and competition scored.',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
