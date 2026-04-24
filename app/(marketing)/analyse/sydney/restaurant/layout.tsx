import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Best Suburbs to Open a Restaurant in Sydney (2026)',
  description: 'Data-driven suburb guide for Sydney restaurants...',
  alternates: { canonical: 'https://locatalyze.com/analyse/sydney/restaurant' },
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}