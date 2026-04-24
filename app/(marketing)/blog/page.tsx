import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Location Intelligence Blog — Locatalyze',
  description: 'Insights on where Australian businesses are opening, failing and thriving. Suburb guides, location strategy, and feasibility tips for founders.',
  alternates: { canonical: 'https://locatalyze.com/blog' },
}

import BlogPageClient from './PageClient'

export default function BlogPage() {
  return <BlogPageClient />
}
