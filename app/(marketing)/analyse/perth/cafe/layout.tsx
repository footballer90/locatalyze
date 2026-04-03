import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Best Suburbs to Open a Café in Perth (2026) — Location Analysis',
  description: 'Data-driven suburb guide for Perth coffee shops. Rent benchmarks, foot traffic, demographics and competition scored. Based on ABS and REIWA data.',
  alternates: { canonical: 'https://www.locatalyze.com/analyse/perth/cafe' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}