import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Open a Business in Sydney — Location Guides by Business Type',
  description: 'Complete location intelligence for Sydney businesses. Cafés, restaurants, gyms, retail, bakeries and salons — suburb scores, rent benchmarks and financial models.',
  alternates: { canonical: 'https://www.locatalyze.com/analyse/sydney' },
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}