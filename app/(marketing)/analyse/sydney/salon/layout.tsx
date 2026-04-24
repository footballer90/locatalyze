import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Best Suburbs to Open a Salon in Sydney (2026)',
  description: 'Data-driven suburb guide for Sydney salons...',
  alternates: { canonical: 'https://locatalyze.com/analyse/sydney/salon' },
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}