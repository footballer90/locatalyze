export const dynamic = 'force-dynamic'
// app/(marketing)/layout.tsx
// This is a SERVER component — do NOT add 'use client' here.
// All interactive children (Footer, newsletter form) handle their own client boundary.

import Footer from '@/components/Footer'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Footer />
    </>
  )
}