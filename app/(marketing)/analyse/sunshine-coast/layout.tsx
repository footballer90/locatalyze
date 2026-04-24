import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sunshine Coast Business Location Analysis — Café, Restaurant & Retail',
  description: 'Suburb-by-suburb business location analysis for the Sunshine Coast. Rent benchmarks, tourism seasonality and competition density for cafés, restaurants and retail across Noosa, Maroochydore, Mooloolaba and beyond.',
  keywords: [
    'Sunshine Coast business location analysis',
    'open a business Sunshine Coast',
    'Sunshine Coast cafe location',
    'Sunshine Coast restaurant suburb guide',
    'Sunshine Coast commercial rent 2026',
    'best suburb to open a business Sunshine Coast',
    'Noosa Mooloolaba Maroochydore business',
    'Sunshine Coast food business feasibility',
    'Sunshine Coast retail location',
    'open a cafe Noosa',
  ],
  alternates: { canonical: 'https://locatalyze.com/analyse/sunshine-coast' },
  openGraph: {
    title: 'Sunshine Coast Business Location Analysis — Café, Restaurant & Retail',
    description: 'Suburb-by-suburb business location analysis for the Sunshine Coast. Tourism seasonality, rent benchmarks and competition scored.',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
