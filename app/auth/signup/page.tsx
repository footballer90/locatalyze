'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSignup() {
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: window.location.origin + '/auth/callback' },
    })
    if (error) { setError(error.message); setLoading(false) }
    else setSent(true)
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">📬</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Check your inbox</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Confirmation link sent to <span className="text-white font-medium">{email}</span>
          </p>
          <p className="text-slate-500 text-xs mt-4">Click the link then sign in to continue.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">L</span>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">Locatalyze</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Start for free</h1>
          <p className="text-slate-400 text-sm">Analyse your first location in under 60 seconds</p>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: '📍', label: 'Real competitor data' },
            { icon: '📊', label: 'Break-even calculator' },
            { icon: '🎯', label: 'GO / CAUTION / NO score' },
          ].map(({ icon, label }) => (
            <div key={label} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 text-center">
              <div className="text-lg mb-1">{icon}</div>
              <div className="text-slate-400 text-xs leading-tight">{label}</div>
            </div>
          ))}
        </div>
        <div className="bg-slate-800/60 backdrop-blur border border-slate-700/60 rounded-2xl p-8">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Email address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSignup()}
                placeholder="you@example.com"
                className="w-full bg-slate-900/80 border border-slate-600/60 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSignup()}
                placeholder="Min 6 characters"
                className="w-full bg-slate-900/80 border border-slate-600/60 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all" />
            </div>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <p className="text-red-400 text-xs">{error}</p>
              </div>
            )}
            <button onClick={handleSignup} disabled={loading || !email || !password}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 disabled:text-slate-500 text-white disabled:cursor-not-allowed rounded-xl py-3 text-sm font-semibold transition-all mt-2">
              {loading ? 'Creating account...' : 'Create free account →'}
            </button>
          </div>
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-700/60" />
            <span className="text-slate-500 text-xs">Already have an account?</span>
            <div className="flex-1 h-px bg-slate-700/60" />
          </div>
          <Link href="/auth/login" className="block w-full text-center border border-slate-600/60 hover:border-slate-500 text-slate-300 hover:text-white rounded-xl py-3 text-sm font-medium transition-all">
            Sign in
          </Link>
        </div>
        <p className="text-center text-slate-600 text-xs mt-6">No credit card required · Free plan includes 1 full report</p>
      </div>
    </div>
  )
}
