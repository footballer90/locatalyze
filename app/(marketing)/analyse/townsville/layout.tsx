import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Townsville Business Location Analysis — Café, Restaurant & Retail',
  description: 'Suburb-by-suburb business location analysis for Townsville. Rent benchmarks, defence sector demand and competition density for cafés, restaurants and retail across Greater Townsville.',
  keywords: [
    'Townsville business location analysis',
    'open a business Townsville',
    'Townsville cafe location',
    'Townsville restaurant suburb guide',
    'Townsville commercial rent 2026',
    'best suburb to open a business Townsville',
    'North Ward Strand Kirwan Hyde Park business',
    'Townsville food business feasibility',
    'Townsville retail location',
    'open a cafe North Queensland',
  ],
  alternates: { canonical: 'https://www.locatalyze.com/analyse/townsville' },
  openGraph: {
    title: 'Townsville Business Location Analysis — Café, Restaurant & Retail',
    description: 'Suburb-by-suburb business location analysis for Townsville. Rent benchmarks, defence sector demand and competition scored.',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
