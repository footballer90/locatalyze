import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Launceston Business Location Analysis — Café, Restaurant & Retail',
  description: 'Suburb-by-suburb business location analysis for Launceston. Rent benchmarks, competition density and demographics for cafés, restaurants and retail operators.',
  keywords: [
    'Launceston business location analysis',
    'open a business Launceston',
    'Launceston cafe location',
    'Launceston restaurant suburb guide',
    'Launceston commercial rent 2026',
    'best suburb to open a business Launceston',
    'Launceston food business feasibility',
    'Launceston retail location',
  ],
  alternates: { canonical: 'https://locatalyze.com/analyse/launceston' },
  openGraph: {
    title: 'Launceston Business Location Analysis — Café, Restaurant & Retail',
    description: 'Suburb-by-suburb business location analysis for Launceston. Rent benchmarks, competition and demographics scored.',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
