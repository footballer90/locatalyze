import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Toowoomba Business Location Analysis — Café, Restaurant & Retail',
  description: 'Suburb-by-suburb business location analysis for Toowoomba. Rent benchmarks, competition density and demographics for cafés, restaurants and retail operators.',
  keywords: [
    'Toowoomba business location analysis',
    'open a business Toowoomba',
    'Toowoomba cafe location',
    'Toowoomba restaurant suburb guide',
    'Toowoomba commercial rent 2026',
    'best suburb to open a business Toowoomba',
    'Toowoomba food business feasibility',
    'Toowoomba retail location',
  ],
  alternates: { canonical: 'https://locatalyze.com/analyse/toowoomba' },
  openGraph: {
    title: 'Toowoomba Business Location Analysis — Café, Restaurant & Retail',
    description: 'Suburb-by-suburb business location analysis for Toowoomba. Rent benchmarks, competition and demographics scored.',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
