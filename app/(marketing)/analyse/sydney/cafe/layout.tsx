import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Best Suburbs to Open a Café in Sydney (2026) — Location Analysis',
  description: 'Data-driven suburb guide for Sydney coffee shops. Rent benchmarks, foot traffic, competition and income demographics scored. Based on ABS and CBRE data.',
  alternates: { canonical: 'https://www.locatalyze.com/analyse/sydney/cafe' },
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}