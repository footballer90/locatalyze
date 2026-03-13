import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Blog — Business location strategy for Australian entrepreneurs',
  description: 'Guides, data, and frameworks for choosing the right suburb, validating demand, and avoiding expensive location mistakes across Australia.',
  alternates: { canonical: 'https://www.locatalyze.com/blog' },
}

import BlogPageClient from './PageClient'

export default function BlogPage() {
  return <BlogPageClient />
}
