import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Terms of Service — Locatalyze',
  description: 'Read the Locatalyze terms of service covering usage, payments, data, and liability.',
  alternates: { canonical: 'https://www.locatalyze.com/terms' },
}

import TermsPageClient from './PageClient'

export default function TermsPage() {
  return <TermsPageClient />
}
