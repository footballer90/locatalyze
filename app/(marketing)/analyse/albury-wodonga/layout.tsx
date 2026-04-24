import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Albury-Wodonga Business Location Analysis — Cafe, Restaurant & Retail',
  description:
    'Suburb-by-suburb business location analysis for Albury-Wodonga. Rent benchmarks, cross-border foot traffic and competition density for cafes, restaurants and retail across the twin-city region.',
  keywords: [
    'Albury Wodonga business location analysis',
    'open a business Albury',
    'Albury cafe location',
    'Albury Wodonga restaurant suburb guide',
    'Albury Wodonga commercial rent 2026',
    'best suburb to open a business Albury',
    'Dean Street CBD business',
    'Albury Wodonga food business feasibility',
    'Albury Wodonga retail location',
    'open a cafe Albury NSW',
  ],
  alternates: { canonical: 'https://locatalyze.com/analyse/albury-wodonga' },
  openGraph: {
    title: 'Albury-Wodonga Business Location Analysis — Cafe, Restaurant & Retail',
    description:
      'Suburb-by-suburb business location analysis for Albury-Wodonga. Rent benchmarks, cross-border foot traffic and competition scored.',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
