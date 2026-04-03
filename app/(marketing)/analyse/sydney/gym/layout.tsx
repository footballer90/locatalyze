import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Best Suburbs to Open a Gym in Sydney (2026)',
  description: 'Data-driven suburb guide for Sydney gyms...',
  alternates: { canonical: 'https://www.locatalyze.com/analyse/sydney/gym' },
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}