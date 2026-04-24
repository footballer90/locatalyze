import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Best Suburbs to Open a Bakery in Sydney (2026)',
  description: 'Data-driven suburb guide for Sydney bakeries...',
  alternates: { canonical: 'https://locatalyze.com/analyse/sydney/bakery' },
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}