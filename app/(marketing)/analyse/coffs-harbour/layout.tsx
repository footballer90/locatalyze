import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Coffs Harbour Business Location Analysis — Cafe, Restaurant & Retail',
  description: 'Suburb-by-suburb business location analysis for Coffs Harbour. Rent benchmarks, tourism foot traffic and competition density for cafes, restaurants and retail across Coffs Harbour and the mid-North Coast.',
  keywords: [
    'Coffs Harbour business location analysis',
    'open a business Coffs Harbour',
    'Coffs Harbour cafe location',
    'Coffs Harbour restaurant suburb guide',
    'Coffs Harbour commercial rent 2026',
    'best suburb to open a business Coffs Harbour',
    'Jetty Sawtell Toormina Park Beach business',
    'Coffs Harbour food business feasibility',
    'Coffs Harbour retail location',
    'open a cafe mid-North Coast NSW',
  ],
  alternates: { canonical: 'https://www.locatalyze.com/analyse/coffs-harbour' },
  openGraph: {
    title: 'Coffs Harbour Business Location Analysis — Cafe, Restaurant & Retail',
    description: 'Suburb-by-suburb business location analysis for Coffs Harbour. Rent benchmarks, tourism traffic and competition scored.',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
