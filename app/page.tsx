'use client'

import Link from 'next/link'
import { useState } from 'react'

const SAMPLE_REPORT = {
  business: 'Cafe',
  location: 'Surry Hills, Sydney NSW 2010',
  score: 74,
  verdict: 'CAUTION',
  revenue: '$64,800',
  profit: '$27,851',
  breakeven: '37 customers/day',
  payback: '7 months',
  scores: [
    { label: 'Rent Affordability', score: 70, weight: '30%' },
    { label: 'Profitability', score: 90, weight: '25%' },
    { label: 'Competition', score: 40, weight: '25%' },
    { label: 'Demographics', score: 97, weight: '20%' },
  ],
}

function VerdictBadge({ verdict }: { verdict: string }) {
  const styles: Record<string, string> = {
    GO:      'bg-emerald-50 text-emerald-700 border border-emerald-200',
    CAUTION: 'bg-amber-50 text-amber-700 border border-amber-200',
    NO:      'bg-red-50 text-red-700 border border-red-200',
  }
  const icons: Record<string, string> = { GO: '✓', CAUTION: '⚠', NO: '✕' }
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${styles[verdict] || styles.CAUTION}`}>
      <span>{icons[verdict]}</span> {verdict}
    </span>
  )
}

const STEPS = [
  { icon: '📝', title: 'Enter your details', desc: 'Business type, address, rent budget, setup cost, and average order value. Takes under 2 minutes.' },
  { icon: '🤖', title: 'AI analyses the location', desc: 'We check demographics, competition density, foot traffic patterns, and run your full financial model.' },
  { icon: '📊', title: 'Get your verdict', desc: 'A clear GO / CAUTION / NO score with full financials, risk scenarios, and plain-English reasoning.' },
]

const FAQS = [
  { q: 'Where does the data come from?', a: 'We combine OpenStreetMap geocoding, demographic data from national census sources, competition density estimates, and GPT-4o to synthesise your financial projections. All financial modelling is based on your actual inputs.' },
  { q: 'How accurate is the analysis?', a: 'The financial model is deterministic — it uses your exact rent, setup cost, and ticket size. Market data (competition, demographics) is estimated and clearly labelled. Think of it as a smart financial advisor, not a crystal ball.' },
  { q: 'Is my business data private?', a: 'Yes. Your data is used solely to generate your report and is never sold, shared with real estate agents, or used for advertising. You can delete your account and data at any time.' },
  { q: 'What businesses does this work for?', a: 'Any retail or hospitality business with a physical lease: cafes, restaurants, gyms, salons, pharmacies, fashion retailers, specialty stores, and more.' },
]

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1C1917]" style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}>

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white text-sm font-bold">L</div>
            <span className="font-bold text-lg text-stone-900">Locatalyze</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm text-stone-500 hover:text-stone-800 transition-colors px-3 py-2">
              Sign in
            </Link>
            <Link href="/auth/signup" className="text-sm bg-teal-600 hover:bg-teal-700 text-white font-medium px-4 py-2 rounded-lg transition-colors">
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 border border-teal-100 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
          <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse" />
          AI-powered location analysis
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-stone-900 leading-tight mb-6 max-w-4xl mx-auto">
          Know if this location will
          <span className="text-teal-600"> make you money</span>
          <br />before you sign the lease
        </h1>

        <p className="text-lg sm:text-xl text-stone-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Enter your business details and get a complete financial feasibility report in under 30 seconds.
          Break-even analysis, 3-year projections, competitor density, and a clear GO / CAUTION / NO verdict.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
          <Link href="/auth/signup" className="w-full sm:w-auto px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-all text-base shadow-sm shadow-teal-200">
            Analyse your first location free →
          </Link>
          <a href="#sample" className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-stone-50 text-stone-700 font-medium rounded-xl border border-stone-200 transition-all text-base">
            See a sample report
          </a>
        </div>
        <p className="text-sm text-stone-400">Free for your first location · No credit card required</p>
      </section>

      {/* ── Sample Report ── */}
      <section id="sample" className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-3">Here's what you get</h2>
          <p className="text-stone-500">A real sample report — Cafe at Surry Hills, Sydney</p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden max-w-3xl mx-auto">
          {/* Report header */}
          <div className="p-6 border-b border-stone-100">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm text-stone-400 mb-1">📍 {SAMPLE_REPORT.location}</p>
                <h3 className="text-xl font-bold text-stone-900">{SAMPLE_REPORT.business}</h3>
              </div>
              <div className="flex items-center gap-3">
                <VerdictBadge verdict={SAMPLE_REPORT.verdict} />
                <div className="text-right">
                  <p className="text-3xl font-black text-amber-600">{SAMPLE_REPORT.score}</p>
                  <p className="text-xs text-stone-400">/ 100</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-stone-500 mt-3">
              This location scores {SAMPLE_REPORT.score}/100 — CAUTION. Rent at 13.1% of revenue leaves a limited buffer.
              High competition density (7 within 500m) suppresses demand.
            </p>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-stone-100 border-b border-stone-100">
            {[
              { label: 'Monthly Revenue', value: SAMPLE_REPORT.revenue },
              { label: 'Monthly Profit', value: SAMPLE_REPORT.profit },
              { label: 'Break-even', value: SAMPLE_REPORT.breakeven },
              { label: 'Payback Period', value: SAMPLE_REPORT.payback },
            ].map(m => (
              <div key={m.label} className="p-4 text-center">
                <p className="text-xs text-stone-400 mb-1">{m.label}</p>
                <p className="text-base font-bold text-stone-800">{m.value}</p>
              </div>
            ))}
          </div>

          {/* Score bars */}
          <div className="p-6">
            <p className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-4">Score Breakdown</p>
            <div className="space-y-3">
              {SAMPLE_REPORT.scores.map(s => (
                <div key={s.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-stone-600">{s.label} <span className="text-stone-400 text-xs">{s.weight}</span></span>
                    <span className="font-semibold text-stone-800">{s.score}</span>
                  </div>
                  <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${s.score >= 70 ? 'bg-emerald-400' : s.score >= 45 ? 'bg-amber-400' : 'bg-red-400'}`}
                      style={{ width: `${s.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-stone-400 mt-4 text-center">
              Full reports include financial projections, SWOT analysis, risk scenarios, and AI commentary
            </p>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="bg-white border-y border-stone-100 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-3">How it works</h2>
            <p className="text-stone-500">From address to verdict in under 30 seconds</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {STEPS.map((step, i) => (
              <div key={i} className="relative p-6 rounded-2xl bg-stone-50 border border-stone-100">
                <div className="w-8 h-8 rounded-full bg-teal-600 text-white text-sm font-bold flex items-center justify-center mb-4">
                  {i + 1}
                </div>
                <div className="text-2xl mb-3">{step.icon}</div>
                <h3 className="font-semibold text-stone-900 mb-2">{step.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Data sources ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-3">Where the data comes from</h2>
          <p className="text-stone-500 max-w-xl mx-auto">We're transparent about our sources — not a black box</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: '🗺️', title: 'OpenStreetMap', desc: 'Geocoding & address resolution' },
            { icon: '👥', title: 'Census Data', desc: 'Median income by postcode' },
            { icon: '🏪', title: 'Business Density', desc: 'Competitor estimates by type' },
            { icon: '🤖', title: 'GPT-4o', desc: 'AI synthesis & plain-English analysis' },
          ].map(d => (
            <div key={d.title} className="bg-white border border-stone-200 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">{d.icon}</div>
              <p className="text-sm font-semibold text-stone-800 mb-1">{d.title}</p>
              <p className="text-xs text-stone-400">{d.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-white border-y border-stone-100 py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 text-center mb-10">Common questions</h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="border border-stone-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-stone-50 transition-colors"
                >
                  <span className="font-medium text-stone-800 text-sm">{faq.q}</span>
                  <span className={`text-stone-400 transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm text-stone-500 leading-relaxed border-t border-stone-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="bg-teal-600 rounded-3xl p-10 sm:p-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to analyse your location?
          </h2>
          <p className="text-teal-100 text-lg mb-8 max-w-lg mx-auto">
            Your first report is completely free. No credit card needed.
          </p>
          <Link href="/auth/signup" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-teal-700 font-semibold rounded-xl hover:bg-teal-50 transition-colors text-base">
            Get your free report →
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-stone-100 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-teal-600 flex items-center justify-center text-white text-xs font-bold">L</div>
            <span className="text-sm font-medium text-stone-600">Locatalyze</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-stone-400">
            <span>AI-powered location intelligence for SMBs</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-stone-400">
            <Link href="/auth/login" className="hover:text-stone-600 transition-colors">Sign in</Link>
            <Link href="/auth/signup" className="hover:text-stone-600 transition-colors">Sign up</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}