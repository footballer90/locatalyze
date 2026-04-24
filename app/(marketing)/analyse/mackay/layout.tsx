import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mackay Business Location Analysis — Café, Restaurant & Retail',
  description: 'Suburb-by-suburb business location analysis for Mackay. Rent benchmarks, foot traffic and competition density for cafés, restaurants and retail across Greater Mackay and the Northern Beaches.',
  keywords: [
    'Mackay business location analysis',
    'open a business Mackay',
    'Mackay cafe location',
    'Mackay restaurant suburb guide',
    'Mackay commercial rent 2026',
    'best suburb to open a business Mackay',
    'Mount Pleasant Mackay CBD business',
    'Mackay food business feasibility',
    'Mackay retail location',
    'open a cafe North Queensland',
  ],
  alternates: { canonical: 'https://locatalyze.com/analyse/mackay' },
  openGraph: {
    title: 'Mackay Business Location Analysis — Café, Restaurant & Retail',
    description: 'Suburb-by-suburb business location analysis for Mackay. Rent benchmarks, foot traffic and competition scored.',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
