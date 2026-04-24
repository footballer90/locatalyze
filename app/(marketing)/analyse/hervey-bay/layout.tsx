import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hervey Bay Business Location Analysis — Café, Restaurant & Retail',
  description: 'Suburb-by-suburb business location analysis for Hervey Bay. Rent benchmarks, tourism foot traffic and competition density for cafés, restaurants and retail across Hervey Bay and the Fraser Coast.',
  keywords: [
    'Hervey Bay business location analysis',
    'open a business Hervey Bay',
    'Hervey Bay cafe location',
    'Hervey Bay restaurant suburb guide',
    'Hervey Bay commercial rent 2026',
    'best suburb to open a business Hervey Bay',
    'Torquay Urangan Pialba business',
    'Hervey Bay food business feasibility',
    'Hervey Bay retail location',
    'open a cafe Fraser Coast',
  ],
  alternates: { canonical: 'https://locatalyze.com/analyse/hervey-bay' },
  openGraph: {
    title: 'Hervey Bay Business Location Analysis — Café, Restaurant & Retail',
    description: 'Suburb-by-suburb business location analysis for Hervey Bay. Rent benchmarks, tourism traffic and competition scored.',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
