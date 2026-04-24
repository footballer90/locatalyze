import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Best Suburbs to Open a Retail Store in Sydney (2026) — Location Analysis',
  description: 'Data-driven suburb guide for Sydney retail stores. Rent benchmarks, foot traffic, competition and income demographics scored. Based on ABS and CBRE data.',
  alternates: { canonical: 'https://locatalyze.com/analyse/sydney/retail' },
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}