import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rockhampton Business Location Analysis — Café, Restaurant & Retail',
  description: 'Suburb-by-suburb business location analysis for Rockhampton. Rent benchmarks, foot traffic and competition density for cafés, restaurants and retail across Greater Rockhampton and the Capricorn Coast.',
  keywords: [
    'Rockhampton business location analysis',
    'open a business Rockhampton',
    'Rockhampton cafe location',
    'Rockhampton restaurant suburb guide',
    'Rockhampton commercial rent 2026',
    'best suburb to open a business Rockhampton',
    'The Range North Rockhampton CBD business',
    'Rockhampton food business feasibility',
    'Rockhampton retail location',
    'open a cafe Central Queensland',
  ],
  alternates: { canonical: 'https://www.locatalyze.com/analyse/rockhampton' },
  openGraph: {
    title: 'Rockhampton Business Location Analysis — Café, Restaurant & Retail',
    description: 'Suburb-by-suburb business location analysis for Rockhampton. Rent benchmarks, foot traffic and competition scored.',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
