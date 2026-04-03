// app/(app)/admin/newsletter/page.tsx
// Protected admin page — only accessible if profile.plan = 'admin'
// Sends newsletter broadcasts to your entire Resend audience with one click

import NewsletterAdminClient from './client'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function NewsletterAdminPage() {
 const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single()

  if (profile?.plan !== 'admin') redirect('/dashboard')

  return <NewsletterAdminClient />
}