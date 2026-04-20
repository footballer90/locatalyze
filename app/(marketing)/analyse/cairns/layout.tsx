import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cairns Business Location Analysis — Café, Restaurant & Retail',
  description: 'Suburb-by-suburb business location analysis for Cairns. Rent benchmarks, tourist foot traffic and competition density for cafés, restaurants and retail across Greater Cairns and Far North Queensland.',
  keywords: [
    'Cairns business location analysis',
    'open a business Cairns',
    'Cairns cafe location',
    'Cairns restaurant suburb guide',
    'Cairns commercial rent 2026',
    'best suburb to open a business Cairns',
    'Palm Cove Port Douglas Edge Hill business',
    'Cairns food business feasibility',
    'Cairns retail location',
    'open a cafe Far North Queensland',
  ],
  alternates: { canonical: 'https://www.locatalyze.com/analyse/cairns' },
  openGraph: {
    title: 'Cairns Business Location Analysis — Café, Restaurant & Retail',
    description: 'Suburb-by-suburb business location analysis for Cairns. Rent benchmarks, tourist traffic and competition scored.',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
