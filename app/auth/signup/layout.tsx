import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Free Account — Locatalyze',
  description: 'Sign up free and analyse your first Australian business location in about 90 seconds. No credit card required.',
}

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children
}
