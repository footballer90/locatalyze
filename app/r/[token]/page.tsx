import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Logo } from '@/components/Logo'
import type { ComputedResult } from '@/types/computed'

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

function normalizeVerdict(v: string | null | undefined): 'GO' | 'CAUTION' | 'NO' {
  const raw = (v ?? '').toLowerCase().trim()
  if (raw === 'go' || raw === 'strong go' || raw === 'conditional go') return 'GO'
  if (raw === 'caution') return 'CAUTION'
  return 'NO'
}

function verdictStyle(v: string | null | undefined) {
  const n = normalizeVerdict(v)
 if (n === 'GO')   return { label: 'GO', bg: S.emeraldBg, text: S.emerald,  border: S.emeraldBorder, dot: S.emerald,  desc: 'LOW RISK' }
 if (n === 'CAUTION') return { label: 'CAUTION', bg: S.amberBg,  text: S.amber,    border: S.amberBorder,   dot: S.amber,    desc: 'MEDIUM RISK' }
  return { label: 'NO', bg: S.redBg, text: S.red, border: S.redBorder, dot: S.red, desc: 'HIGH RISK' }
}

function heroVerdictLine(v: string | null | undefined, rentRatioPct: number | null): string {
  const n = normalizeVerdict(v)
  if (n === 'NO') return 'NOT VIABLE - economics are currently too weak'
  if (n === 'CAUTION') return 'VIABLE - but condition-sensitive'
  if (rentRatioPct != null && rentRatioPct >= 15) return 'VIABLE - but margin-sensitive'
  return 'VIABLE - economics are workable'
}

function buildRealityCheck(args: {
  rentRatioPct: number | null
  validCompetitorCount: number | null
  businessType: string | null | undefined
}): string | null {
  const bt = (args.businessType ?? 'business').toLowerCase()
  if (args.rentRatioPct != null && args.rentRatioPct >= 20) {
    return `Reality check: At ~${Math.round(args.rentRatioPct)}% rent-to-revenue, many comparable ${bt}s struggle to hold healthy margins without premium pricing.`
  }
  if (args.rentRatioPct != null && args.rentRatioPct >= 15) {
    return `Reality check: At ~${Math.round(args.rentRatioPct)}% rent-to-revenue, this site can work, but margin buffer is thin if revenue underperforms.`
  }
  if (args.validCompetitorCount != null && args.validCompetitorCount >= 10) {
    return `Reality check: Competition is dense (${args.validCompetitorCount} operators in range), so winning requires clear differentiation, not average execution.`
  }
  return null
}

function safeParse<T = any>(v: unknown): T | null {
  if (v == null) return null
  if (typeof v === 'object') return v as T
  if (typeof v === 'string') {
    try { return JSON.parse(v) as T } catch { return null }
  }
  return null
}

function fmtCurrency(n: number | null | undefined) {
  if (n == null || !Number.isFinite(n)) return '—'
 return '$' + n.toLocaleString('en-AU', { maximumFractionDigits: 0 })
}

function fmtMoneyK(n: number | null | undefined) {
  if (n == null || !Number.isFinite(n)) return '—'
  if (Math.abs(n) >= 1000000) return `$${(n / 1000000).toFixed(1)}M`
  return `$${Math.round(n / 1000)}K`
}

function firstSentence(text: string | null | undefined): string | null {
  if (!text) return null
  const trimmed = text.trim()
  if (!trimmed) return null
  const idx = trimmed.indexOf('. ')
  return idx === -1 ? trimmed : trimmed.slice(0, idx + 1)
}

function scoreColor(score: number | null | undefined) {
  const s = Number(score ?? 0)
  if (s >= 70) return S.emerald
  if (s >= 45) return S.amber
 return S.red
}

function ScoreBar({ label, score, weight }: { label: string; score: number; weight: string }) {
 const color = scoreColor(score)
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
    <span style={{ fontSize: 13, color: S.n700, fontWeight: 500 }}>{label} <span style={{ color: S.n400, fontSize: 11 }}>{weight}</span></span>
        <span style={{ fontSize: 13, fontWeight: 700, color }}>{score}</span>
      </div>
      <div style={{ height: 6, background: S.n100, borderRadius: 100, overflow: 'hidden' }}>
    <div style={{ height: '100%', width: `${Math.max(0, Math.min(100, score))}%`, background: color, borderRadius: 100 }} />
   </div>
    </div>
  )
}

export default async function PublicReportPage({ params }: { params: { token: string } }) {
const supabase = await createClient()
  const rawToken = params.token
  const tokenParts = rawToken.split('.')
  const tokenHasExpiry = tokenParts.length === 2 && /^\d+$/.test(tokenParts[1] || '')
  if (tokenHasExpiry) {
    const expiresAtMs = Number(tokenParts[1]) * 1000
    if (Date.now() > expiresAtMs) notFound()
  }

 const { data: report, error } = await supabase
    .from('reports')
  .select('*')
  .eq('public_token', rawToken)
  .eq('is_public', true)
  .single()

  if (error || !report) notFound()

  const computed = safeParse<ComputedResult>(report.computed_result)
  const rd = safeParse<any>(report.result_data) ?? {}
  const vs = verdictStyle(computed?.verdict ?? report.verdict)
  const overallScore = computed?.scores?.overall ?? report.overall_score ?? 0
  const revenueRange = computed?.revenueRange ?? null
  const benchmarkContext = computed?.benchmarkContext ?? null
  const monthlyRevenue = computed?.revenue ?? rd?.financials?.monthlyRevenue ?? null
  const monthlyNetProfit = computed?.netProfit ?? rd?.financials?.monthlyNetProfit ?? null
  const breakEvenDaily = computed?.breakEvenDaily ?? report.breakeven_daily ?? null
  const breakEvenMonths = computed?.breakEvenMonths ?? report.breakeven_months ?? null
  const dataCompleteness = computed?.dataCompleteness ?? null
  const confidence = computed?.modelConfidence ?? null
  const decisionReasons = computed?.verdictReasons ?? []
  const decisionRisks = computed?.verdictFailureModes ?? []
  const decisionConditions = computed?.verdictConditions ?? []

  const rawA7 = rd?.a7?.outputs || rd?.a7 || rd?.a7_data?.outputs || rd?.a7_data || null
  const rawA8 = rd?.a8?.outputs || rd?.a8 || rd?.a8_data?.outputs || rd?.a8_data || null
  const rentBurdenPct = rawA7?.rent_burden_pct
    ?? (computed?.revenue && computed?.costBreakdown?.rent ? Math.round((computed.costBreakdown.rent / computed.revenue) * 1000) / 10 : null)
  const rentBurdenLabel = rawA7?.rent_burden_label
    ?? (rentBurdenPct == null ? 'N/A' : rentBurdenPct <= 12 ? 'Healthy' : rentBurdenPct <= 20 ? 'Watch' : 'Risky')
  const growthSignal = rawA8?.economic_verdict ?? computed?.marketSignals?.demandTrend ?? rd?.market?.demandTrend ?? 'N/A'
  const timingSignal = rd?.market?.bestEntryTiming ?? rawA8?.timing_signal ?? 'N/A'
  const oneLineWhy = firstSentence(benchmarkContext?.benchmarkNarrative)
    ?? decisionReasons[0]
    ?? report.recommendation
    ?? null
  const verdictHeadline = heroVerdictLine(computed?.verdict ?? report.verdict, rentBurdenPct ?? benchmarkContext?.benchmarkRentRatio ?? null)
  const confidencePct = dataCompleteness != null ? Math.round(dataCompleteness) : null
  const confidenceLabel = confidence ? String(confidence).charAt(0).toUpperCase() + String(confidence).slice(1) : 'Unknown'
  const realityCheck = buildRealityCheck({
    rentRatioPct: rentBurdenPct ?? benchmarkContext?.benchmarkRentRatio ?? null,
    validCompetitorCount: computed?.validCompetitorCount ?? null,
    businessType: report.business_type,
  })

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
  const swotConfig: Record<string, { bg: string; border: string; text: string }> = {
    STRENGTHS:     { bg: S.emeraldBg, border: S.emeraldBorder, text: '#065F46' },
    WEAKNESSES:    { bg: S.amberBg,  border: S.amberBorder,   text: '#92400E' },
    OPPORTUNITIES: { bg: '#EFF6FF',  border: '#BFDBFE',    text: '#1D4ED8' },
    THREATS:       { bg: S.redBg,   border: S.redBorder,     text: '#991B1B' },
  }

 const scoreFields = [
    { label: 'Rent Affordability', key: 'score_rent',    weight: '30%' },
  { label: 'Profitability',   key: 'score_profitability', weight: '25%' },
  { label: 'Competition',    key: 'score_competition', weight: '25%' },
  { label: 'Demographics + Demand', key: 'score_demand',    weight: '20%' },
 ].map((f) => ({
    ...f,
    score: computed?.scores
      ? (f.key === 'score_rent' ? computed.scores.rent
        : f.key === 'score_profitability' ? computed.scores.profitability
        : f.key === 'score_competition' ? computed.scores.competition
        : computed.scores.demand ?? 0)
      : (report[f.key as keyof typeof report] as number | null) ?? 0,
  }))

  return (
    <div style={{ fontFamily: S.font, background: S.n50, minHeight: '100vh', color: S.n900 }}>
   <style>{`*{box-sizing:border-box;margin:0;padding:0;} a{text-decoration:none;color:inherit;}`}</style>

      {/* Nav */}
      <nav style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(16px)', borderBottom: `1px solid ${S.n100}`, padding: '0 24px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
     <Logo variant="light" size="sm" />
    </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
     <span style={{ fontSize: 11, color: S.n500, background: S.n100, border: `1px solid ${S.n200}`, borderRadius: 100, padding: '3px 10px', fontWeight: 600 }}>SHARED REPORT</span>
     <span style={{ fontSize: 11, color: S.n500, background: S.n100, border: `1px solid ${S.n200}`, borderRadius: 100, padding: '3px 10px', fontWeight: 600 }}>SCORING v2.1</span>
     <Link href="/onboarding" style={{ fontSize: 12, background: S.brand, color: S.white, borderRadius: 9, padding: '7px 14px', fontWeight: 700 }}>Get your free analysis →</Link>
    </div>
      </nav>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '24px 20px 60px' }}>

    {/* Hero card */}
        <div style={card({ marginBottom: 14 })}>
          <div style={{ padding: '24px 24px 20px', borderBottom: `1px solid ${S.n100}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
       <div>
                <p style={{ fontSize: 12, color: S.n400, marginBottom: 4 }}> {report.location_name || 'Location'}</p>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: S.n900, letterSpacing: '-0.03em' }}>{report.business_type || 'Business'}</h1>
       </div>
              <div style={{ textAlign: 'right' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: vs.bg, color: vs.text, border: `1.5px solid ${vs.border}`, borderRadius: 100, padding: '5px 14px', fontSize: 12, fontWeight: 700 }}>
         <span style={{ width: 7, height: 7, borderRadius: '50%', background: vs.dot, display: 'inline-block' }} />
         {vs.label} · {vs.desc}
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: 3, marginTop: 6 }}>
         <span style={{ fontSize: 38, fontWeight: 900, color: vs.text, lineHeight: 1, letterSpacing: '-0.04em' }}>{overallScore}</span>
         <span style={{ fontSize: 13, color: S.n400 }}>/100</span>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 14, padding: '14px 16px', borderRadius: 12, border: `1px solid ${vs.border}`, background: vs.bg }}>
              <p style={{ fontSize: 23, fontWeight: 900, color: vs.text, letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: 10 }}>
                {normalizeVerdict(computed?.verdict ?? report.verdict) === 'GO' ? 'GO: ' : normalizeVerdict(computed?.verdict ?? report.verdict) === 'CAUTION' ? 'CAUTION: ' : 'NO-GO: '}
                {verdictHeadline}
              </p>
              <p style={{ fontSize: 27, fontWeight: 900, color: S.n900, lineHeight: 1, letterSpacing: '-0.02em' }}>
                {revenueRange ? `${fmtMoneyK(revenueRange.low)} - ${fmtMoneyK(revenueRange.high)}` : (monthlyRevenue ? fmtMoneyK(monthlyRevenue) : '—')}
              </p>
              <p style={{ fontSize: 12, color: S.n500, marginTop: 5 }}>
                {revenueRange ? `Most likely: ${fmtMoneyK(revenueRange.mid)}` : 'Revenue range currently unavailable'}
              </p>
              <p style={{ fontSize: 12, color: S.n700, marginTop: 8, fontWeight: 700 }}>
                Confidence: {confidenceLabel}{confidencePct != null ? ` (${confidencePct}%)` : ''}
              </p>
            </div>
            {report.recommendation && (
              <div style={{ marginTop: 14, padding: '13px 16px', background: vs.bg, borderRadius: 12, border: `1px solid ${vs.border}` }}>
        <p style={{ fontSize: 13, color: vs.text, lineHeight: 1.65 }}>{report.recommendation}</p>
              </div>
            )}
            {oneLineWhy && (
              <div style={{ marginTop: 10, padding: '12px 14px', background: '#FFFFFF', borderRadius: 10, border: `1px solid ${S.n200}` }}>
                <p style={{ fontSize: 13, color: S.n800, lineHeight: 1.65, fontWeight: 600 }}>{oneLineWhy}</p>
              </div>
            )}
            {realityCheck && (
              <div style={{ marginTop: 10, padding: '11px 13px', background: '#F8FAFC', borderRadius: 10, border: `1px solid ${S.n200}` }}>
                <p style={{ fontSize: 12, color: S.n700, lineHeight: 1.6, fontWeight: 600 }}>{realityCheck}</p>
              </div>
            )}
          </div>

          {/* Metrics strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
      {[
              {
                l: 'Revenue Range',
                v: revenueRange ? `${fmtMoneyK(revenueRange.low)} – ${fmtMoneyK(revenueRange.high)}` : (monthlyRevenue ? `~${fmtCurrency(monthlyRevenue)}` : '—'),
                sub: revenueRange ? `Most likely: ${fmtMoneyK(revenueRange.mid)}` : 'single estimate',
              },
       { l: 'Monthly Net Profit', v: monthlyNetProfit != null ? `~${fmtCurrency(monthlyNetProfit)}` : '—', sub: 'excludes owner salary' },
       { l: 'Break-even / Day',  v: breakEvenDaily ? `${breakEvenDaily} customers` : '—' },
       { l: 'Payback Period',   v: breakEvenMonths ? `${breakEvenMonths} months` : '—', sub: dataCompleteness != null ? `${dataCompleteness}% data · ${confidence ?? 'confidence n/a'}` : undefined },
      ].map((m, i) => (
              <div key={m.l} style={{ padding: '14px 10px', textAlign: 'center', borderRight: i < 3 ? `1px solid ${S.n100}` : 'none', borderTop: `1px solid ${S.n100}` }}>
        <p style={{ fontSize: 10, color: S.n400, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>{m.l}</p>
        <p style={{ fontSize: 14, fontWeight: 800, color: S.n800, letterSpacing: '-0.01em' }}>{m.v}</p>
        {'sub' in m && m.sub ? <p style={{ fontSize: 9, color: S.n400, marginTop: 4 }}>{m.sub}</p> : null}
       </div>
            ))}
          </div>
        </div>

        {/* Score breakdown */}
        <div style={card({ padding: '22px 24px', marginBottom: 14 })}>
     <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Score Breakdown</p>
     {scoreFields.map(f => (
            <ScoreBar key={f.label} label={f.label} score={f.score || 0} weight={f.weight} />
          ))}
        </div>

        {(decisionReasons.length > 0 || decisionRisks.length > 0 || decisionConditions.length > 0) && (
          <div style={card({ padding: '22px 24px', marginBottom: 14 })}>
            <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Decision Logic</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
              <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBorder}`, borderRadius: 12, padding: '12px 14px', minHeight: 146 }}>
                <p style={{ fontSize: 12, fontWeight: 800, color: S.emerald, marginBottom: 8 }}>Why this works</p>
                <p style={{ fontSize: 10, color: S.emerald, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 8 }}>Checklist</p>
                {(decisionReasons.slice(0, 3)).map((t, i) => <p key={i} style={{ fontSize: 12, color: '#065F46', lineHeight: 1.55, marginBottom: 6 }}>✔ {t}</p>)}
              </div>
              <div style={{ background: S.redBg, border: `1px solid ${S.redBorder}`, borderRadius: 12, padding: '12px 14px', minHeight: 146 }}>
                <p style={{ fontSize: 12, fontWeight: 800, color: S.red, marginBottom: 8 }}>What could go wrong</p>
                <p style={{ fontSize: 10, color: S.red, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 8 }}>Risk Triggers</p>
                {(decisionRisks.slice(0, 3)).map((t, i) => <p key={i} style={{ fontSize: 12, color: '#991B1B', lineHeight: 1.55, marginBottom: 6 }}>⚠ {t}</p>)}
              </div>
              <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 12, padding: '12px 14px', minHeight: 146 }}>
                <p style={{ fontSize: 12, fontWeight: 800, color: '#1D4ED8', marginBottom: 8 }}>What must be true</p>
                <p style={{ fontSize: 10, color: '#1D4ED8', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 8 }}>Non-Negotiables</p>
                {(decisionConditions.slice(0, 3)).map((t, i) => <p key={i} style={{ fontSize: 12, color: '#1E3A8A', lineHeight: 1.55, marginBottom: 6 }}>📌 {t}</p>)}
              </div>
            </div>
          </div>
        )}

        {(rawA7 || rawA8 || computed) && (
          <div style={card({ padding: '22px 24px', marginBottom: 14 })}>
            <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Industry Benchmark & Market Conditions</p>
            {benchmarkContext?.benchmarkNarrative && (
              <p style={{ fontSize: 13, color: S.n800, lineHeight: 1.6, marginBottom: 12 }}>{benchmarkContext.benchmarkNarrative}</p>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
              <div style={{ border: `1px solid ${S.n200}`, borderRadius: 12, padding: '12px 14px' }}>
                <p style={{ fontSize: 10, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Rent vs Industry</p>
                <p style={{ fontSize: 18, fontWeight: 900, color: S.n900 }}>{rentBurdenLabel}</p>
                <p style={{ fontSize: 12, color: S.n500, marginTop: 4 }}>
                  {rentBurdenPct != null
                    ? `${rentBurdenPct}% of revenue`
                    : (benchmarkContext?.benchmarkRentRatio != null ? `${Math.round(benchmarkContext.benchmarkRentRatio)}% of revenue` : 'Industry rent ratio unavailable')}
                </p>
              </div>
              <div style={{ border: `1px solid ${S.n200}`, borderRadius: 12, padding: '12px 14px' }}>
                <p style={{ fontSize: 10, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Suburb Direction</p>
                <p style={{ fontSize: 18, fontWeight: 900, color: S.n900 }}>{String(growthSignal ?? (benchmarkContext?.marketSentiment ?? 'N/A'))}</p>
                <p style={{ fontSize: 12, color: S.n500, marginTop: 4 }}>
                  {rawA8?.consumer_sentiment_label ? `Consumer sentiment: ${rawA8.consumer_sentiment_label}` : benchmarkContext?.marketSentiment ? `Sentiment: ${benchmarkContext.marketSentiment}` : 'Driven by market trend signal'}
                </p>
              </div>
              <div style={{ border: `1px solid ${S.n200}`, borderRadius: 12, padding: '12px 14px' }}>
                <p style={{ fontSize: 10, color: S.n400, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Timing</p>
                <p style={{ fontSize: 18, fontWeight: 900, color: S.n900 }}>{String(timingSignal ?? (benchmarkContext?.timingScore != null ? `${benchmarkContext.timingScore}/100` : 'N/A'))}</p>
                <p style={{ fontSize: 12, color: S.n500, marginTop: 4 }}>
                  {rawA8?.food_cpi_yoy_pct != null ? `Food CPI YoY: ${rawA8.food_cpi_yoy_pct}%` : rawA8?.wage_growth_pct != null ? `Wage growth: ${rawA8.wage_growth_pct}%` : benchmarkContext?.timingScore != null ? `Timing score: ${benchmarkContext.timingScore}/100` : 'Timing data is directional'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SWOT */}
        {Object.keys(swot).length > 0 && (
          <div style={card({ padding: '22px 24px', marginBottom: 14 })}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase', letterSpacing: '0.1em' }}>SWOT Analysis</p>
        <span style={{ fontSize: 9, fontWeight: 700, color: S.n500, background: S.n100, border: `1px solid ${S.n200}`, borderRadius: 999, padding: '2px 8px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>AI-generated</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
       {Object.entries(swot).map(([key, items]) => {
                const cfg = swotConfig[key]
                if (!cfg || !items.length) return null
                return (
                  <div key={key} style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 14, padding: '14px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}><div style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.text }} /><p style={{ fontSize: 11, fontWeight: 800, color: cfg.text }}>{key}</p></div>
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
          { title: ' Competition Analysis', content: report.competitor_analysis },
     { title: ' Market Demand',     content: report.market_demand },
          { title: ' Rent Analysis',     content: report.rent_analysis },
        ].filter(s => s.content).map(s => (
          <div key={s.title} style={card({ padding: '22px 24px', marginBottom: 14 })}>
      <p style={{ fontSize: 14, fontWeight: 700, color: S.n800, marginBottom: 10, letterSpacing: '-0.01em' }}>{s.title}</p>
      <p style={{ fontSize: 13, color: S.n500, lineHeight: 1.75 }}>{s.content}</p>
          </div>
        ))}
        <p style={{ fontSize: 11, color: S.n400, marginBottom: 10, padding: '0 2px' }}>
          Competitor data may be cached for up to 48 hours from the latest fetch.
        </p>

        {/* CTA */}
        <div style={{ background: `linear-gradient(135deg,${S.brand} 0%,#0891B2 100%)`, borderRadius: 24, padding: '36px 32px', textAlign: 'center', marginTop: 24, boxShadow: '0 12px 40px rgba(15,118,110,0.2)' }}>
     <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', marginBottom: 10 }}>
      Want to analyse your own location?
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', marginBottom: 24, lineHeight: 1.6 }}>
      Get a full report like this one in about 90 seconds.<br />Free for your first location — no credit card required.
          </p>
          <Link href="/onboarding" style={{ display: 'inline-block', background: S.white, color: S.brand, borderRadius: 12, padding: '13px 28px', fontWeight: 700, fontSize: 14 }}>
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