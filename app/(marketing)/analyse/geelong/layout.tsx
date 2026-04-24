import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Geelong Business Location Analysis — Café, Restaurant & Retail',
  description: 'Suburb-by-suburb business location analysis for Geelong, Victoria. Rent benchmarks, foot traffic, competition density, and GO/CAUTION/NO verdicts for cafés, restaurants and retail across Greater Geelong and the Surf Coast.',
  keywords: [
    'Geelong business location analysis',
    'open a business Geelong',
    'Geelong cafe location',
    'Geelong restaurant suburb guide',
    'Geelong commercial rent 2026',
    'best suburb to open a business Geelong',
    'Pakington Street business location',
    'Geelong food business feasibility',
    'Geelong retail location',
    'open a cafe Geelong Victoria',
  ],
  alternates: { canonical: 'https://locatalyze.com/analyse/geelong' },
  openGraph: {
    title: 'Geelong Business Location Analysis — Café, Restaurant & Retail',
    description: 'Suburb-by-suburb business location analysis for Geelong. Rent benchmarks, foot traffic and competition scored.',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
