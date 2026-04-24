import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Port Macquarie Business Location Analysis — Cafe, Restaurant & Retail',
  description: 'Suburb-by-suburb business location analysis for Port Macquarie. Rent benchmarks, tourism foot traffic and competition density for cafes, restaurants and retail across Port Macquarie and the Hastings region.',
  keywords: [
    'Port Macquarie business location analysis',
    'open a business Port Macquarie',
    'Port Macquarie cafe location',
    'Port Macquarie restaurant suburb guide',
    'Port Macquarie commercial rent 2026',
    'best suburb to open a business Port Macquarie',
    'Settlement City CBD Westport Park business',
    'Port Macquarie food business feasibility',
    'Port Macquarie retail location',
    'open a cafe mid-North Coast NSW',
  ],
  alternates: { canonical: 'https://locatalyze.com/analyse/port-macquarie' },
  openGraph: {
    title: 'Port Macquarie Business Location Analysis — Cafe, Restaurant & Retail',
    description: 'Suburb-by-suburb business location analysis for Port Macquarie. Rent benchmarks, tourism traffic and competition scored.',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
