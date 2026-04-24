import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Adelaide Business Location Analysis — Café, Restaurant & Retail',
  description: 'Suburb-by-suburb business location analysis for Adelaide. Rent benchmarks, competition density and demographics for cafés, restaurants and retail stores across Greater Adelaide.',
  keywords: [
    'Adelaide business location analysis',
    'open a business Adelaide',
    'Adelaide cafe location',
    'Adelaide restaurant suburb guide',
    'Adelaide commercial rent 2026',
    'best suburb to open a business Adelaide',
    'Norwood Glenelg North Adelaide business',
    'Adelaide food business feasibility',
    'Adelaide retail location',
    'open a cafe South Australia',
  ],
  alternates: { canonical: 'https://locatalyze.com/analyse/adelaide' },
  openGraph: {
    title: 'Adelaide Business Location Analysis — Café, Restaurant & Retail',
    description: 'Suburb-by-suburb business location analysis for Adelaide. Rent benchmarks, competition and demographics scored.',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
