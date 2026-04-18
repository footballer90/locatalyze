import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sentry example page',
  description: 'Test Sentry for Locatalyze (Next.js).',
  robots: { index: false, follow: false },
}

export default function SentryExampleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
