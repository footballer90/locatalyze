// app/(marketing)/analyse/wollongong/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Wollongong Business Location Intelligence | Locatalyze',
    template: '%s | Locatalyze Wollongong',
  },
  description:
    'Data-backed analysis of the best suburbs to open a café, restaurant, or retail business in Wollongong NSW. Rent benchmarks, foot traffic, competition levels, and GO / CAUTION / NO verdicts for 20 suburbs.',
  alternates: {
    canonical: 'https://locatalyze.com/analyse/wollongong',
  },
}

export default function WollongongLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
