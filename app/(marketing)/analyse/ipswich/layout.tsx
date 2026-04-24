import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ipswich Business Location Analysis — Café, Restaurant & Retail',
  description: 'Suburb-by-suburb business location analysis for Ipswich. Rent benchmarks, competition density and demographics for cafés, restaurants and retail operators.',
  keywords: [
    'Ipswich business location analysis',
    'open a business Ipswich',
    'Ipswich cafe location',
    'Ipswich restaurant suburb guide',
    'Ipswich commercial rent 2026',
    'best suburb to open a business Ipswich',
    'Ipswich food business feasibility',
    'Ipswich retail location',
  ],
  alternates: { canonical: 'https://locatalyze.com/analyse/ipswich' },
  openGraph: {
    title: 'Ipswich Business Location Analysis — Café, Restaurant & Retail',
    description: 'Suburb-by-suburb business location analysis for Ipswich. Rent benchmarks, competition and demographics scored.',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
