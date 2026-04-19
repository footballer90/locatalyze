import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Best Suburbs to Open a Business on the Gold Coast — 2026 Location Analysis',
  description:
    'Gold Coast business location guide 2026. 20 suburbs scored for cafés, restaurants and retail. Honest rent benchmarks, seasonality risk, foot traffic signals, and GO/CAUTION/NO verdicts for every major Gold Coast suburb.',
  keywords: [
    'best suburb to open a café Gold Coast',
    'Gold Coast business location 2026',
    'open a restaurant Gold Coast',
    'Gold Coast café rent benchmarks',
    'Burleigh Heads business location',
    'Broadbeach café rent',
    'Surfers Paradise business risk',
    'where to open a café Gold Coast',
    'Gold Coast hospitality location analysis',
    'best areas for small business Gold Coast Queensland',
  ],
  alternates: { canonical: 'https://www.locatalyze.com/analyse/gold-coast' },
  openGraph: {
    title: 'Best Suburbs to Open a Business on the Gold Coast — 2026 Location Guide',
    description:
      '20 Gold Coast suburbs ranked for cafés, restaurants and retail. Rent tiers, foot traffic, seasonality risk, and suburb-level verdicts.',
    url: 'https://www.locatalyze.com/analyse/gold-coast',
    type: 'article',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
