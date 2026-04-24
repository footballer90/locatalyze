import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Canberra Business Location Analysis — Café, Restaurant & Retail',
  description: 'Suburb-by-suburb business location analysis for Canberra. Rent benchmarks, competition density and public sector demographics for cafés, retail stores and restaurants across the ACT.',
  keywords: [
    'Canberra business location analysis',
    'open a business Canberra',
    'Canberra cafe location',
    'Canberra retail suburb guide',
    'Canberra commercial rent 2026',
    'best suburb to open a business ACT',
    'Braddon Kingston Manuka business',
    'Canberra food business feasibility',
    'Canberra retail location',
    'open a cafe ACT',
  ],
  alternates: { canonical: 'https://locatalyze.com/analyse/canberra' },
  openGraph: {
    title: 'Canberra Business Location Analysis — Café, Restaurant & Retail',
    description: 'Suburb-by-suburb business location analysis for Canberra. Rent benchmarks, competition and ACT demographics scored.',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
