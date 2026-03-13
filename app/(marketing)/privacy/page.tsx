import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Privacy Policy — Locatalyze',
  description: 'How Locatalyze collects, uses, and protects your data. We never sell your information.',
  alternates: { canonical: 'https://www.locatalyze.com/privacy' },
}

import PrivacyPageClient from './PageClient'

export default function PrivacyPage() {
  return <PrivacyPageClient />
}
