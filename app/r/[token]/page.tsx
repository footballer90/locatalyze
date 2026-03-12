export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const S = {
  font: "'DM Sans','Helvetica Neue',Arial,sans-serif",
  brand: '#0F766E', brandLight: '#14B8A6', brandFaded: '#F0FDFA', brandBorder: '#99F6E4',
  n50: '#FAFAF9', n100: '#F5F5F4', n200: '#E7E5E4',
  n400: '#A8A29E', n500: '#78716C', n700: '#44403C', n800: '#292524', n900: '#1C1917',
  white: '#FFFFFF',
  emerald: '#059669', emeraldBg: '#ECFDF5', emeraldBorder: '#A7F3D0',
  amber: '#D97706', amberBg: '#FFFBEB', amberBorder: '#FDE68A',
  red: '#DC2626', redBg: '#FEF2F2', redBorder: '#FECACA',
}

const card = (extra = {}) => ({
  background: S.white, borderRadius: 18,
  border: `1px solid ${S.n200}`,
  boxShadow: '0 1px 3px rgba(0,0,0,0.04),0 4px 12px rgba(0,0,0,0.04)',
  overflow: 'hidden', ...extra,
})

function verdictStyle(v: string) {
  if (v === 'GO')      return { bg: S.emeraldBg, text: S.emerald,  border: S.emeraldBorder, dot: S.emerald,  desc: 'LOW RISK' }
  if (v === 'CAUTION') return { bg: S.amberBg,   text: S.amber,    border: S.amberBorder,   dot: S.amber,    desc: 'MEDIUM RISK' }
  return                      { bg: S.redBg,     text: S.red,      border: S.redBorder,     dot: S.red,      desc: 'HIGH RISK' }
}

function ScoreBar({ label, score, weight }: { label: string; score: number; weight: string }) {
  const color = score >= 70 ? S.emerald : score >= 45 ? S.amber : S.red
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: S.n700, fontWeight: 500 }}>{label} <span style={{ color: S.n400, fontSize: 11 }}>{weight}</span></span>
        <span style={{ fontSize: 13, fontWeight: 700, color }}>{score}</span>
      </div>
      <div style={{ height: 6, background: S.n100, borderRadius: 100, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${score}%`, background: color, borderRadius: 100 }} />
      </div>
    </div>
  )
}

function fmtCurrency(n: number | null) {
  if (!n) return '—'
  return '$' + n.toLocaleString('en-AU', { maximumFractionDigits: 0 })
}

export default async function PublicReportPage({ params }: { params: { token: string } }) {
const supabase = await createClient()

  const { data: report, error } = await supabase
    .from('reports')
    .select('*')
    .eq('public_token', params.token)
    .eq('is_public', true)
    .single()

  if (error || !report) notFound()

  const vs = verdictStyle(report.verdict || 'CAUTION')
  const rd = report.result_data || {}

  // Parse SWOT safely
  function parseSwot(raw: string | null) {
    if (!raw) return {}
    const sections: Record<string, string[]> = {}
    const keys = ['STRENGTHS', 'WEAKNESSES', 'OPPORTUNITIES', 'THREATS']
    keys.forEach((key, idx) => {
      const next = keys[idx + 1]
      const pattern = next ? `${key}:\\s*(.*?)(?=${next}:)` : `${key}:\\s*(.*?)$`
      const match = raw.match(new RegExp(pattern, 'is'))
      if (match) {
        sections[key] = match[1].split(/[,.]/).map(s => s.trim()).filter(s => s.length > 5)
      }
    })
    return sections
  }

  const swot = parseSwot(report.swot_analysis)
  const swotConfig: Record<string, { icon: string; bg: string; border: string; text: string }> = {
    STRENGTHS:     { icon: '💪', bg: S.emeraldBg, border: S.emeraldBorder, text: '#065F46' },
    WEAKNESSES:    { icon: '⚠️', bg: S.amberBg,   border: S.amberBorder,   text: '#92400E' },
    OPPORTUNITIES: { icon: '🚀', bg: '#EFF6FF',   border: '#BFDBFE',       text: '#1D4ED8' },
    THREATS:       { icon: '🔴', bg: S.redBg,     border: S.redBorder,     text: '#991B1B' },
  }

  const scoreFields = [
    { label: 'Rent Affordability', key: 'score_rent',        weight: '30%' },
    { label: 'Profitability',      key: 'score_profitability', weight: '25%' },
    { label: 'Competition',        key: 'score_competition',  weight: '25%' },
    { label: 'Demographics',       key: 'score_demand',       weight: '20%' },
  ]

  return (
    <div style={{ fontFamily: S.font, background: S.n50, minHeight: '100vh', color: S.n900 }}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0;} a{text-decoration:none;color:inherit;}`}</style>

      {/* Nav */}
      <nav style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(16px)', borderBottom: `1px solid ${S.n100}`, padding: '0 24px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 9, background: `linear-gradient(135deg,${S.brand},${S.brandLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: S.white, fontWeight: 800, fontSize: 13 }}>L</div>
          <span style={{ fontWeight: 800, fontSize: 15, color: S.n900, letterSpacing: '-0.02em' }}>Locatalyze</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: S.n500, background: S.n100, border: `1px solid ${S.n200}`, borderRadius: 100, padding: '3px 10px', fontWeight: 600 }}>SHARED REPORT</span>
          <Link href="/auth/signup" style={{ fontSize: 12, background: S.brand, color: S.white, borderRadius: 9, padding: '7px 14px', fontWeight: 700 }}>Get your free analysis →</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '24px 20px 60px' }}>

        {/* Hero card */}
        <div style={card({ marginBottom: 14 })}>
          <div style={{ padding: '24px 24px 20px', borderBottom: `1px solid ${S.n100}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: 12, color: S.n400, marginBottom: 4 }}>📍 {report.location_name || 'Location'}</p>
                <h1 style={{ fontSize: 22, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em' }}>{report.business_type || 'Business'}</h1>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: vs.bg, color: vs.text, border: `1.5px solid ${vs.border}`, borderRadius: 100, padding: '5px 14px', fontSize: 12, fontWeight: 700 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: vs.dot, display: 'inline-block' }} />
                  {report.verdict} · {vs.desc}
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: 3, marginTop: 6 }}>
                  <span style={{ fontSize: 38, fontWeight: 900, color: vs.text, lineHeight: 1, letterSpacing: '-0.04em' }}>{report.overall_score}</span>
                  <span style={{ fontSize: 13, color: S.n400 }}>/100</span>
                </div>
              </div>
            </div>
            {report.recommendation && (
              <div style={{ marginTop: 14, padding: '13px 16px', background: vs.bg, borderRadius: 12, border: `1px solid ${vs.border}` }}>
                <p style={{ fontSize: 13, color: vs.text, lineHeight: 1.65 }}>{report.recommendation}</p>
              </div>
            )}
          </div>

          {/* Metrics strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
            {[
              { l: 'Monthly Revenue',    v: rd.financials?.monthlyRevenue   ? fmtCurrency(rd.financials.monthlyRevenue)  : '—' },
              { l: 'Monthly Net Profit', v: rd.financials?.monthlyNetProfit ? fmtCurrency(rd.financials.monthlyNetProfit) : '—' },
              { l: 'Break-even / Day',   v: report.breakeven_daily ? `${report.breakeven_daily} customers` : '—' },
              { l: 'Payback Period',     v: report.breakeven_months ? `${report.breakeven_months} months` : '—' },
            ].map((m, i) => (
              <div key={m.l} style={{ padding: '14px 10px', textAlign: 'center', borderRight: i < 3 ? `1px solid ${S.n100}` : 'none', borderTop: `1px solid ${S.n100}` }}>
                <p style={{ fontSize: 10, color: S.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>{m.l}</p>
                <p style={{ fontSize: 14, fontWeight: 800, color: S.n800, letterSpacing: '-0.01em' }}>{m.v}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Score breakdown */}
        <div style={card({ padding: '22px 24px', marginBottom: 14 })}>
          <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Score Breakdown</p>
          {scoreFields.map(f => (
            <ScoreBar key={f.label} label={f.label} score={report[f.key as keyof typeof report] as number || 0} weight={f.weight} />
          ))}
        </div>

        {/* SWOT */}
        {Object.keys(swot).length > 0 && (
          <div style={card({ padding: '22px 24px', marginBottom: 14 })}>
            <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>SWOT Analysis</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {Object.entries(swot).map(([key, items]) => {
                const cfg = swotConfig[key]
                if (!cfg || !items.length) return null
                return (
                  <div key={key} style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 14, padding: '14px 16px' }}>
                    <p style={{ fontSize: 11, fontWeight: 800, color: cfg.text, marginBottom: 10 }}>{cfg.icon} {key}</p>
                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 5 }}>
                      {items.slice(0, 2).map((item, i) => (
                        <li key={i} style={{ fontSize: 11, color: cfg.text, opacity: 0.85, lineHeight: 1.5 }}>· {item}</li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Analysis sections */}
        {[
          { title: '🏪 Competition Analysis', content: report.competitor_analysis },
          { title: '📈 Market Demand',         content: report.market_demand },
          { title: '🏠 Rent Analysis',          content: report.rent_analysis },
        ].filter(s => s.content).map(s => (
          <div key={s.title} style={card({ padding: '22px 24px', marginBottom: 14 })}>
            <p style={{ fontSize: 14, fontWeight: 700, color: S.n800, marginBottom: 10, letterSpacing: '-0.01em' }}>{s.title}</p>
            <p style={{ fontSize: 13, color: S.n500, lineHeight: 1.75 }}>{s.content}</p>
          </div>
        ))}

        {/* CTA */}
        <div style={{ background: `linear-gradient(135deg,${S.brand} 0%,#0891B2 100%)`, borderRadius: 24, padding: '36px 32px', textAlign: 'center', marginTop: 24, boxShadow: '0 12px 40px rgba(15,118,110,0.2)' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: S.white, letterSpacing: '-0.03em', marginBottom: 10 }}>
            Want to analyse your own location?
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', marginBottom: 24, lineHeight: 1.6 }}>
            Get a full report like this one in 30 seconds.<br />Free for your first location — no credit card required.
          </p>
          <Link href="/auth/signup" style={{ display: 'inline-block', background: S.white, color: S.brand, borderRadius: 12, padding: '13px 28px', fontWeight: 700, fontSize: 14 }}>
            Get your free analysis →
          </Link>
        </div>

        {/* Footer */}
        <p style={{ textAlign: 'center', fontSize: 12, color: S.n400, marginTop: 28 }}>
          Report generated by{' '}
          <Link href="/" style={{ color: S.brand, fontWeight: 600 }}>Locatalyze</Link>
          {' '}· {new Date(report.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>
    </div>
  )
}