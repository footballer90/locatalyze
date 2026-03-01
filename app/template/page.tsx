'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Template {
  id: string
  name: string
  description: string
  icon: string
  category: string
  default_values: Record<string, string | number>
}

const TIERS = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    color: 'rgba(255,255,255,0.08)',
    border: 'rgba(255,255,255,0.1)',
    accent: '#fff',
    features: ['Overall score (0-100)', 'GO / CAUTION / NO verdict', 'Competition overview', 'Basic recommendation'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$29',
    color: 'rgba(99,102,241,0.1)',
    border: 'rgba(99,102,241,0.35)',
    accent: '#818cf8',
    badge: '⭐ Most Popular',
    features: ['Everything in Free', 'Full 5-category breakdown', 'P&L summary', 'Break-even analysis', 'PDF download', 'Shareable link'],
  },
  {
    id: 'investor',
    name: 'Investor Pack',
    price: '$79',
    color: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.35)',
    accent: '#fbbf24',
    badge: '💎 Best Value',
    features: ['Everything in Pro', '3-year financial projection', 'Sensitivity analysis', 'Full SWOT analysis', 'Investor-ready PDF', 'Priority processing'],
  },
]

export default function TemplatesPage() {
  const router = useRouter()
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedTier, setSelectedTier] = useState('free')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL!.replace(/\/$/, '')
    fetch(`${base}/rest/v1/templates?select=*&order=name`, {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
      }
    })
      .then(r => r.json())
      .then(d => { setTemplates(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const start = (template?: Template) => {
    const params = new URLSearchParams({ tier: selectedTier })
    if (template) params.set('template', template.id)
    router.push(`/?${params.toString()}`)
  }

  return (
    <div style={S.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      {/* Header */}
      <div style={S.header}>
        <div style={S.logo}>📍 Locatalyze</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>AI Location Intelligence</div>
      </div>

      <div style={S.wrap}>
        {/* Hero */}
        <div style={{ textAlign: 'center', animation: 'fadeUp 0.5s ease both', paddingTop: 32, paddingBottom: 56 }}>
          <div style={S.heroBadge}>🚀 AI-Powered Location Analysis</div>
          <h1 style={S.heroH1}>Stop Guessing. Start Knowing.</h1>
          <p style={S.heroP}>Our AI analyses competition, rent, demand and profitability in 90 seconds — so you open in the right location, not the wrong one.</p>
        </div>

        {/* Tier selector */}
        <div style={{ marginBottom: 56, animation: 'fadeUp 0.5s ease 0.1s both' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={S.sectionLabel}>Choose Your Plan</div>
          </div>
          <div style={S.tierRow}>
            {TIERS.map(t => (
              <div
                key={t.id}
                onClick={() => setSelectedTier(t.id)}
                style={{
                  ...S.tierCard,
                  background: t.color,
                  border: `2px solid ${selectedTier === t.id ? t.border : 'rgba(255,255,255,0.07)'}`,
                  transform: selectedTier === t.id ? 'translateY(-4px)' : 'none',
                  cursor: 'pointer',
                }}
              >
                {t.badge && (
                  <div style={{ fontSize: 11, fontWeight: 700, color: t.accent, marginBottom: 10, letterSpacing: '0.05em' }}>{t.badge}</div>
                )}
                <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 4 }}>{t.name}</div>
                <div style={{ fontSize: 32, fontWeight: 900, color: t.accent, marginBottom: 16, letterSpacing: '-0.03em' }}>
                  {t.price}<span style={{ fontSize: 14, fontWeight: 400, color: 'rgba(255,255,255,0.4)' }}>/report</span>
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 16 }}>
                  {t.features.map(f => (
                    <div key={f} style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', padding: '4px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: t.accent }}>✓</span> {f}
                    </div>
                  ))}
                </div>
                {selectedTier === t.id && (
                  <div style={{ marginTop: 16, fontSize: 12, fontWeight: 700, color: t.accent, textAlign: 'center' as const }}>✓ Selected</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Templates */}
        <div style={{ animation: 'fadeUp 0.5s ease 0.2s both' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={S.sectionLabel}>Pick a Template to Get Started</div>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', margin: '8px 0 0' }}>Pre-filled with industry benchmarks — or start from scratch</p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: 40 }}>Loading templates...</div>
          ) : (
            <div style={S.templateGrid}>
              {/* Custom / blank option */}
              <div onClick={() => start()} style={S.templateCard}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>✏️</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 6 }}>Custom Analysis</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>Start from scratch with your own inputs</div>
                <div style={S.startBtn}>Start →</div>
              </div>

              {templates.map(t => (
                <div key={t.id} onClick={() => start(t)} style={S.templateCard}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>{t.icon}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{t.name}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>{t.description}</div>
                  <div style={S.startBtn}>Use Template →</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* How it works */}
        <div style={{ animation: 'fadeUp 0.5s ease 0.3s both', marginTop: 72 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={S.sectionLabel}>How It Works</div>
          </div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' as const, justifyContent: 'center' }}>
            {[
              { step: '01', icon: '📝', title: 'Fill the Form', desc: '19 questions about your business, location and budget. Takes 3 minutes.' },
              { step: '02', icon: '🤖', title: 'AI Analyses', desc: '6 AI agents score competition, rent, demand, costs and profitability.' },
              { step: '03', icon: '📊', title: 'Get Your Report', desc: 'Full breakdown with scores, verdict and actionable recommendations in 90 seconds.' },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} style={S.howCard}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(99,102,241,0.7)', letterSpacing: '0.1em', marginBottom: 10 }}>STEP {step}</div>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{title}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center' as const, padding: '60px 0 20px', fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>
          Locatalyze · AI Business Location Intelligence
        </div>
      </div>
    </div>
  )
}

const S: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#07090f',
    backgroundImage: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(79,70,229,0.1) 0%, transparent 60%)',
    fontFamily: '"DM Sans", system-ui, sans-serif',
    color: '#fff',
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '18px 40px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  logo: { fontSize: 18, fontWeight: 800, fontFamily: '"Syne", sans-serif', letterSpacing: '-0.02em' },
  wrap: { maxWidth: 1100, margin: '0 auto', padding: '0 28px' },
  heroBadge: {
    display: 'inline-block',
    background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)',
    color: '#818cf8', borderRadius: 100, padding: '6px 16px',
    fontSize: 13, fontWeight: 600, marginBottom: 20,
  },
  heroH1: {
    fontSize: 56, fontWeight: 800, fontFamily: '"Syne", sans-serif',
    letterSpacing: '-0.03em', margin: '0 0 16px', lineHeight: 1.1,
  },
  heroP: { fontSize: 18, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, maxWidth: 540, margin: '0 auto' },
  sectionLabel: { fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.25)' },
  tierRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 },
  tierCard: {
    borderRadius: 20, padding: '28px 24px',
    transition: 'all 0.25s ease',
  },
  templateGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: 16,
  },
  templateCard: {
    background: 'rgba(255,255,255,0.025)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 18, padding: '28px 22px',
    cursor: 'pointer', transition: 'all 0.2s ease',
    display: 'flex', flexDirection: 'column' as const,
  },
  startBtn: {
    marginTop: 'auto' as const, paddingTop: 16,
    fontSize: 13, fontWeight: 700, color: '#6366f1',
  },
  howCard: {
    background: 'rgba(255,255,255,0.025)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 18, padding: '28px 24px',
    flex: 1, minWidth: 240, maxWidth: 300,
  },
}