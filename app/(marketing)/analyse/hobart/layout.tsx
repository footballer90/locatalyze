import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hobart Business Location Analysis — Café, Restaurant & Retail',
  description: 'Suburb-by-suburb business location analysis for Hobart. Rent benchmarks, tourist foot traffic and competition density for cafés, restaurants and retail across Greater Hobart and Tasmania.',
  keywords: [
    'Hobart business location analysis',
    'open a business Hobart',
    'Hobart cafe location',
    'Hobart restaurant suburb guide',
    'Hobart commercial rent 2026',
    'best suburb to open a business Hobart',
    'Salamanca North Hobart Sandy Bay business',
    'Hobart food business feasibility',
    'Hobart retail location',
    'open a cafe Tasmania',
  ],
  alternates: { canonical: 'https://www.locatalyze.com/analyse/hobart' },
  openGraph: {
    title: 'Hobart Business Location Analysis — Café, Restaurant & Retail',
    description: 'Suburb-by-suburb business location analysis for Hobart. Rent benchmarks, tourist traffic and competition scored.',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
