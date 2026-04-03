import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Contact Us — Locatalyze',
  description: 'Get in touch with the Locatalyze team. Questions about pricing, partnerships, enterprise access or anything else — we respond within one business day.',
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}