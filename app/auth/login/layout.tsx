import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In — Locatalyze',
  description: 'Sign in to your Locatalyze account to access your location reports.',
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children
}
