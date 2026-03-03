import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, email')
    .eq('id', user.id)
    .single()

  const plan = profile?.plan ?? 'free'

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-slate-200 flex flex-col">
        <div className="px-5 py-5 border-b border-slate-100">
          <span className="font-mono font-bold text-slate-900 text-sm tracking-tight">
            Locatalyze
          </span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <span>📊</span> Dashboard
          </Link>
          <Link
            href="/onboarding"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <span>➕</span> New analysis
          </Link>
        </nav>
        <div className="px-4 py-4 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-3">
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                plan === 'pro'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {plan.toUpperCase()}
            </span>
            <span className="text-xs text-slate-400 truncate">{profile?.email}</span>
          </div>
          <form action="/auth/signout" method="post">
            <button className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
