'use client'

interface Props {
  children: React.ReactNode
  isPro: boolean
  featureName?: string
}

export default function ProGate({ children, isPro, featureName = 'This feature' }: Props) {
  if (isPro) return <>{children}</>

  async function handleUpgrade() {
    const res = await fetch('/api/stripe/checkout', { method: 'POST' })
    const { url } = await res.json()
    if (url) window.location.href = url
  }

  return (
    <div className="relative">
      <div className="opacity-30 pointer-events-none select-none">{children}</div>
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center">
        <div className="text-2xl mb-2">🔒</div>
        <div className="text-sm font-medium text-slate-900 mb-1">Pro feature</div>
        <div className="text-xs text-slate-500 text-center mb-4 max-w-[200px]">
          {featureName} requires a Pro plan
        </div>
        <button
          onClick={handleUpgrade}
          className="bg-slate-900 text-white text-xs px-4 py-2 rounded-md hover:bg-slate-700 transition-colors"
        >
          Upgrade to Pro — $79/mo
        </button>
      </div>
    </div>
  )
}
