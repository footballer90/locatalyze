import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bundaberg Business Location Analysis — Café, Restaurant & Retail',
  description: 'Suburb-by-suburb business location analysis for Bundaberg. Rent benchmarks, competition density and demographics for cafés, restaurants and retail operators.',
  keywords: [
    'Bundaberg business location analysis',
    'open a business Bundaberg',
    'Bundaberg cafe location',
    'Bundaberg restaurant suburb guide',
    'Bundaberg commercial rent 2026',
    'best suburb to open a business Bundaberg',
    'Bundaberg food business feasibility',
    'Bundaberg retail location',
  ],
  alternates: { canonical: 'https://locatalyze.com/analyse/bundaberg' },
  openGraph: {
    title: 'Bundaberg Business Location Analysis — Café, Restaurant & Retail',
    description: 'Suburb-by-suburb business location analysis for Bundaberg. Rent benchmarks, competition and demographics scored.',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
