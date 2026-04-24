import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Geraldton Business Location Analysis — Cafe, Restaurant & Retail',
  description: 'Suburb-by-suburb business location analysis for Geraldton, WA. Rent benchmarks, Abrolhos Islands tourism foot traffic and competition density for cafes, restaurants and retail across Geraldton and the Mid West.',
  keywords: [
    'Geraldton business location analysis',
    'open a business Geraldton',
    'Geraldton cafe location',
    'Geraldton restaurant suburb guide',
    'Geraldton commercial rent 2026',
    'best suburb to open a business Geraldton',
    'Marine Terrace Beresford business',
    'Geraldton food business feasibility',
    'Geraldton retail location',
    'open a cafe Mid West WA',
  ],
  alternates: { canonical: 'https://locatalyze.com/analyse/geraldton' },
  openGraph: {
    title: 'Geraldton Business Location Analysis — Cafe, Restaurant & Retail',
    description: 'Suburb-by-suburb business location analysis for Geraldton. Rent benchmarks, Abrolhos Islands tourism traffic and competition scored.',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
