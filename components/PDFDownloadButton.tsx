'use client'
import { useState } from 'react'
import {
  Document, Page, Text, View, StyleSheet, pdf, Font
} from '@react-pdf/renderer'

// ─── Colours ──────────────────────────────────────────────────────────────────
const C = {
  brand:       '#0F766E',
  brandLight:  '#14B8A6',
  white:       '#FFFFFF',
  n50:         '#FAFAF9',
  n100:        '#F5F5F4',
  n200:        '#E7E5E4',
  n400:        '#A8A29E',
  n500:        '#78716C',
  n700:        '#44403C',
  n800:        '#292524',
  n900:        '#1C1917',
  emerald:     '#059669',
  emeraldBg:   '#ECFDF5',
  emeraldBdr:  '#A7F3D0',
  amber:       '#D97706',
  amberBg:     '#FFFBEB',
  amberBdr:    '#FDE68A',
  red:         '#DC2626',
  redBg:       '#FEF2F2',
  redBdr:      '#FECACA',
  blue:        '#2563EB',
  blueBg:      '#EFF6FF',
  blueBdr:     '#BFDBFE',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function verdictColors(v: string | null) {
  if (v === 'GO')      return { bg: C.emeraldBg, text: C.emerald, border: C.emeraldBdr }
  if (v === 'CAUTION') return { bg: C.amberBg,   text: C.amber,   border: C.amberBdr   }
  return                      { bg: C.redBg,     text: C.red,     border: C.redBdr     }
}

function scoreColor(s: number) {
  if (s >= 70) return C.emerald
  if (s >= 45) return C.amber
  return C.red
}

// Parse money strings like "A$60,000", "AUD46,068", "-A$14,400" → number
function parseMoney(v: any): number | null {
  if (v == null) return null
  if (typeof v === 'number') return v
  const n = parseFloat(String(v).replace(/[^0-9.-]/g, ''))
  return isNaN(n) ? null : n
}

function fmt(n: number | null | undefined) {
  if (n == null) return '—'
  const abs = Math.abs(n)
  const str = '$' + abs.toLocaleString('en-AU', { maximumFractionDigits: 0 })
  return n < 0 ? `−${str}` : str
}

// Parse SWOT from the swot_analysis string, stripping ** markdown markers
function parseSwot(raw: string | null): Record<string, string[]> {
  if (!raw) return {}
  const keys = ['STRENGTHS', 'WEAKNESSES', 'OPPORTUNITIES', 'THREATS']
  const result: Record<string, string[]> = {}
  keys.forEach((key, idx) => {
    const next = keys[idx + 1]
    const pattern = next ? `${key}:\\s*(.*?)(?=${next}:)` : `${key}:\\s*(.*?)$`
    const match = raw.match(new RegExp(pattern, 'is'))
    if (match) {
      result[key] = match[1]
        .split(/[,.\n·]/)
        .map(s => s.replace(/\*+/g, '').replace(/^\s*[-–]\s*/, '').trim())
        .filter(s => s.length > 5)
        .slice(0, 3)
    }
  })
  return result
}

// Normalise result_data from n8n a1-a8 format into a unified financials object
function safeResultData(rd: any): any {
  if (!rd) return {}
  let parsed: any = rd
  if (typeof rd === 'string') {
    try { parsed = JSON.parse(rd) } catch { return {} }
  }

  // Already has 'financials' key (old format) — pass through
  if (parsed.financials || parsed.score) return parsed

  // n8n multi-agent format: keys a1…a8
  if (parsed.a1 !== undefined || parsed.agent_statuses !== undefined) {
    const a1out = (parsed.a1?.outputs || parsed.a1) ?? {}
    const a2out = (parsed.a2?.outputs || parsed.a2) ?? {}
    const a3out = (parsed.a3?.outputs || parsed.a3) ?? {}
    const a4out = (parsed.a4?.outputs || parsed.a4) ?? {}
    const a5out = (parsed.a5?.outputs || parsed.a5) ?? {}
    const a6out = (parsed.a6?.outputs || parsed.a6) ?? {}

    const monthlyRevenue   = parseMoney(a5out.monthly_revenue ?? a5out.projected_monthly_revenue
      ?? a5out.revenue_range?.monthly_base) || null
    const monthlyNetProfit = parseMoney(a5out.net_profit ?? a5out.monthly_profit ?? a5out.monthly_net_profit
      ?? a5out.sensitivity_analysis?.base_case?.monthly_profit_loss) || null
    const totalCosts       = parseMoney(a4out.total_monthly_costs ?? a4out.monthly_total
      ?? a4out.monthly_operating_cost?.total_monthly) || null
    const labour           = parseMoney(a4out.monthly_labour ?? a4out.monthly_staff_cost
      ?? a4out.monthly_operating_cost?.staff_salaries?.amount) || null
    const cogs             = parseMoney(a4out.cogs ?? a4out.monthly_cogs
      ?? a4out.monthly_operating_cost?.consumables_inventory?.amount) || null
    const utilities        = parseMoney(a4out.monthly_operating_cost?.utilities?.amount) || null

    // Sensitivity scenarios from A5
    const sens = a5out.sensitivity_analysis ?? {}
    const riskScenarios = {
      best:  { monthlyRevenue: parseMoney(sens.best_case?.monthly_revenue),  monthlyNet: parseMoney(sens.best_case?.monthly_profit_loss)  },
      base:  { monthlyRevenue: parseMoney(sens.base_case?.monthly_revenue),  monthlyNet: parseMoney(sens.base_case?.monthly_profit_loss)  },
      worst: { monthlyRevenue: parseMoney(sens.worst_case?.monthly_revenue), monthlyNet: parseMoney(sens.worst_case?.monthly_profit_loss) },
    }

    // Year ramp from A5 (months 1, 6, 12 as proxies for Y1)
    const ramp = a5out.year1_monthly_ramp ?? []
    const y1rev = parseMoney(ramp[11]?.revenue) || parseMoney(a5out.revenue_range?.monthly_base)
    const projections = {
      year1: y1rev ? { revenue: y1rev, netProfit: monthlyNetProfit } : null,
      year2: y1rev ? { revenue: Math.round((y1rev || 0) * 1.05), netProfit: monthlyNetProfit ? Math.round(monthlyNetProfit * 1.1) : null } : null,
      year3: y1rev ? { revenue: Math.round((y1rev || 0) * 1.05 * 1.05), netProfit: monthlyNetProfit ? Math.round(monthlyNetProfit * 1.21) : null } : null,
    }

    // Revenue channels from A5
    const revenueChannels: Array<{ channel: string; monthly_revenue: string; revenue_split_pct: number }> =
      a5out.revenue_channels ?? []

    // Recommended pricing strategy from A5
    const recommendedPricing = (a5out.pricing_strategies ?? []).find((s: any) => s.recommended) ?? null

    // Competitor profiles from A1 (from competitor_businesses on A3 if A1 is empty)
    const competitorBiz = (parsed.a3?.competitor_businesses ?? []).slice(0, 5)

    // Opportunity gaps from A1
    const opportunityGaps: string[] = a1out.opportunity_gaps ?? []
    const diffSuggestions: string[] = a1out.differentiation_suggestions ?? []

    // Setup cost from A4
    const setupCostRec = parseMoney(a4out.setup_cost_estimate?.recommended) || null
    const setupCostMin = parseMoney(a4out.setup_cost_estimate?.total_min) || null
    const setupCostMax = parseMoney(a4out.setup_cost_estimate?.total_max) || null
    const breakEvenMonthsA5 = Number(a5out.break_even_months ?? 0) || null

    // Regulatory flags from A3
    const regulatoryFlags: Array<{ license_name: string; estimated_cost: string; processing_time: string }> =
      a3out.regulatory_flags ?? []

    // Market demand from A3
    const demandTrend = a3out.demand_trend ?? null
    const marketVerdict = a3out.overall_market_verdict ?? null
    const topOpportunities: string[] = a3out.top_opportunities ?? []

    return {
      ...parsed,
      competitors: {
        count:            Number(a1out.competitors_within_500m ?? a1out.total_competitors_found ?? 0),
        saturationLevel:  (a1out.saturation_level ?? 'unknown').toLowerCase(),
        nearbyBusinesses: competitorBiz,
        opportunity_gaps: opportunityGaps,
        differentiation_suggestions: diffSuggestions,
        threat_summary:   a1out.threat_summary ?? null,
        locality_context: a1out.locality_context ?? null,
      },
      financials: {
        monthlyRevenue,
        totalMonthlyCosts: totalCosts,
        monthlyNetProfit,
        labour,
        cogs,
        utilities,
        avgTicketSize:     parseMoney(a5out.avg_ticket_size ?? a5out.avg_ticket_validation?.market_benchmark) || null,
        baselineCustomers: Number(a5out.daily_customers ?? a5out.baseline_customers ?? a5out.customer_volume?.daily_customers_base ?? 0) || null,
        rent: { amount: Number(a2out.median_rent?.monthly ?? 0) || null },
        projections,
        riskScenarios,
        revenueChannels,
        recommendedPricing,
        setupCostRec,
        setupCostMin,
        setupCostMax,
        breakEvenMonthsA5,
        regulatoryFlags,
        demandTrend,
        marketVerdict,
        topOpportunities,
      },
    }
  }

  return parsed
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    backgroundColor: C.white,
    padding: '32 36',
    fontSize: 9,
    color: C.n800,
  },

  // Header
  header:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: C.n200 },
  logoBox:     { width: 28, height: 28, backgroundColor: C.brand, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  logoText:    { color: C.white, fontSize: 14, fontFamily: 'Helvetica-Bold' },
  brandName:   { fontSize: 13, fontFamily: 'Helvetica-Bold', color: C.n900, marginLeft: 6 },
  headerMeta:  { fontSize: 7.5, color: C.n400, textAlign: 'right' },

  // Hero card
  heroCard:      { backgroundColor: C.n50, borderRadius: 10, padding: '14 16', marginBottom: 12, borderWidth: 1, borderColor: C.n200, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  locationLabel: { fontSize: 7.5, color: C.n400, marginBottom: 3 },
  bizName:       { fontSize: 16, fontFamily: 'Helvetica-Bold', color: C.n900, marginBottom: 4 },
  verdictPill:   { borderRadius: 100, paddingVertical: 3, paddingHorizontal: 10, marginBottom: 6, alignSelf: 'flex-start' },
  verdictText:   { fontSize: 8, fontFamily: 'Helvetica-Bold' },
  scoreNumber:   { fontSize: 32, fontFamily: 'Helvetica-Bold' },
  scoreDenom:    { fontSize: 9, color: C.n400 },

  // Recommendation
  recBox:  { borderRadius: 8, padding: '10 12', marginBottom: 12, borderWidth: 1 },
  recText: { fontSize: 8.5, lineHeight: 1.6 },

  // Metrics strip
  metricsRow:   { flexDirection: 'row', gap: 8, marginBottom: 12 },
  metricCard:   { flex: 1, backgroundColor: C.n50, borderRadius: 8, padding: '10 10', borderWidth: 1, borderColor: C.n200 },
  metricLabel:  { fontSize: 6.5, color: C.n400, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4, fontFamily: 'Helvetica-Bold' },
  metricValue:  { fontSize: 12, fontFamily: 'Helvetica-Bold', color: C.n800 },
  metricSub:    { fontSize: 6.5, color: C.n400, marginTop: 2 },

  // Section
  sectionTitle: { fontSize: 7, fontFamily: 'Helvetica-Bold', color: C.brand, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 },
  card:         { backgroundColor: C.white, borderRadius: 8, padding: '12 14', marginBottom: 10, borderWidth: 1, borderColor: C.n200 },
  cardTitle:    { fontSize: 9, fontFamily: 'Helvetica-Bold', color: C.n800, marginBottom: 8 },

  // Score bars
  scoreRow:    { flexDirection: 'row', alignItems: 'center', marginBottom: 7 },
  scoreLabel:  { width: 110, fontSize: 8, color: C.n700 },
  scoreWeight: { width: 28, fontSize: 7, color: C.n400, textAlign: 'right' },
  scoreBarBg:  { flex: 1, height: 5, backgroundColor: C.n100, borderRadius: 100, marginHorizontal: 6, overflow: 'hidden' },
  scoreBarFill: { height: 5, borderRadius: 100 },
  scoreVal:    { width: 20, fontSize: 8, fontFamily: 'Helvetica-Bold', textAlign: 'right' },

  // SWOT
  swotGrid:  { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  swotCell:  { width: '48.5%', borderRadius: 7, padding: '9 10', borderWidth: 1 },
  swotTitle: { fontSize: 7.5, fontFamily: 'Helvetica-Bold', marginBottom: 5 },
  swotItem:  { fontSize: 7.5, lineHeight: 1.55, marginBottom: 2 },

  // Analysis text
  analysisText: { fontSize: 8.5, color: C.n500 as any, lineHeight: 1.65 },

  // P&L
  plRow:   { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: C.n100 },
  plLabel: { fontSize: 8.5, color: C.n500 as any },
  plValue: { fontSize: 8.5, fontFamily: 'Helvetica-Bold' },

  // Footer
  footer:     { position: 'absolute', bottom: 24, left: 36, right: 36, flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: C.n200, paddingTop: 8 },
  footerText: { fontSize: 7, color: C.n400 },

  // Two col layout
  twoCol:   { flexDirection: 'row', gap: 10, marginBottom: 10 },
  colLeft:  { flex: 1 },
  colRight: { flex: 1 },

  // Risk scenarios
  scenarioRow:   { flexDirection: 'row', gap: 6, marginBottom: 10 },
  scenarioCard:  { flex: 1, borderRadius: 7, padding: '9 10', borderWidth: 1 },
  scenarioLabel: { fontSize: 7, fontFamily: 'Helvetica-Bold', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.4 },
  scenarioVal:   { fontSize: 11, fontFamily: 'Helvetica-Bold', marginBottom: 2 },
  scenarioSub:   { fontSize: 7, color: C.n400 },

  // Revenue channels
  channelRow:   { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  channelBar:   { height: 6, borderRadius: 3, marginRight: 8 },
  channelLabel: { fontSize: 7.5, color: C.n700, flex: 1 },
  channelPct:   { fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: C.brand, width: 30, textAlign: 'right' },
  channelAmt:   { fontSize: 7.5, color: C.n500, width: 55, textAlign: 'right' },

  // Bullet list
  bulletItem: { fontSize: 8, color: C.n500, lineHeight: 1.5, marginBottom: 2 },

  // Competitor row
  compRow:    { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: C.n100 },
  compName:   { fontSize: 8, color: C.n800, flex: 1 },
  compRating: { fontSize: 7.5, color: C.amber, width: 36, textAlign: 'right' },
  compAddr:   { fontSize: 7, color: C.n400, marginTop: 1 },

  // Setup cost bar
  setupRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 3 },
  setupLabel: { fontSize: 8, color: C.n700, flex: 1 },
  setupVal:   { fontSize: 8, fontFamily: 'Helvetica-Bold', color: C.n800 },

  // Tag pill
  tagPill:  { borderRadius: 20, paddingVertical: 2, paddingHorizontal: 7, borderWidth: 1, marginRight: 4, marginBottom: 3 },
  tagText:  { fontSize: 7, fontFamily: 'Helvetica-Bold' },
})

// ─── PDF Document ─────────────────────────────────────────────────────────────
function ReportPDF({ report }: { report: any }) {
  const vc = verdictColors(report.verdict)

  // ── ENGINE V2: prefer computed_result (sealed, deterministic) ────────────
  const CR = report.computed_result ?? null

  // Legacy fallback — only used for old reports without computed_result
  const rd  = safeResultData(report.result_data)
  const fin = rd.financials || {}

  // Financial figures — V2 takes precedence
  const displayRevenue    = CR?.revenue    ?? fin.monthlyRevenue    ?? null
  const displayNetProfit  = CR?.netProfit  ?? fin.monthlyNetProfit  ?? null
  const breakEvenMonths   = CR?.breakEvenMonths ?? fin.breakEvenMonthsA5 ?? report.breakeven_months ?? null

  // Scenario rows — V2 structure is { worst, base, best } each with revenue/netProfit/label
  const riskScenarios = CR ? {
    worst: { monthlyRevenue: CR.scenarios?.worst?.revenue, monthlyNet: CR.scenarios?.worst?.netProfit },
    base:  { monthlyRevenue: CR.scenarios?.base?.revenue,  monthlyNet: CR.scenarios?.base?.netProfit  },
    best:  { monthlyRevenue: CR.scenarios?.best?.revenue,  monthlyNet: CR.scenarios?.best?.netProfit  },
  } : (fin.riskScenarios || {})

  // Projections — V2 stores annual revenue directly
  const projections = CR ? {
    year1: CR.projection?.year1 ? { revenue: CR.projection.year1, netProfit: CR.netProfit } : null,
    year2: CR.projection?.year2 ? { revenue: CR.projection.year2, netProfit: Math.round((CR.netProfit ?? 0) * 1.1) } : null,
    year3: CR.projection?.year3 ? { revenue: CR.projection.year3, netProfit: Math.round((CR.netProfit ?? 0) * 1.21) } : null,
  } : (fin.projections || {})

  const swot = parseSwot(report.swot_analysis)
  const generatedDate = new Date(report.created_at || Date.now()).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })

  // Best display address
  const displayAddress = report.address || report.input_data?.address || report.location_name || '—'

  const scoreFields = [
    { label: 'Rent Affordability', key: 'score_rent',          weight: '30%' },
    { label: 'Profitability',      key: 'score_profitability', weight: '25%' },
    { label: 'Competition',        key: 'score_competition',   weight: '25%' },
    { label: 'Demographics',       key: 'score_demand',        weight: '20%' },
  ]

  const swotConfig: Record<string, { bg: string; border: string; text: string }> = {
    STRENGTHS:     { bg: C.emeraldBg, border: C.emeraldBdr, text: '#065F46' },
    WEAKNESSES:    { bg: C.amberBg,   border: C.amberBdr,   text: '#92400E' },
    OPPORTUNITIES: { bg: C.blueBg,    border: C.blueBdr,    text: '#1D4ED8' },
    THREATS:       { bg: C.redBg,     border: C.redBdr,     text: '#991B1B' },
  }

  return (
    <Document title={`Locatalyze — ${report.business_type} · ${displayAddress}`} author="Locatalyze">

      {/* ── PAGE 1: Overview ── */}
      <Page size="A4" style={styles.page}>

        {/* Header */}
        <View style={styles.header} fixed>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.logoBox}><Text style={styles.logoText}>L</Text></View>
            <Text style={styles.brandName}>Locatalyze</Text>
          </View>
          <View>
            <Text style={styles.headerMeta}>Location Feasibility Report</Text>
            <Text style={styles.headerMeta}>{generatedDate}</Text>
          </View>
        </View>

        {/* Hero */}
        <View style={styles.heroCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.locationLabel}>{displayAddress}</Text>
            <Text style={styles.bizName}>{report.business_type || '—'}</Text>
            <View style={[styles.verdictPill, { backgroundColor: vc.bg, borderWidth: 1, borderColor: vc.border }]}>
              <Text style={[styles.verdictText, { color: vc.text }]}>{report.verdict || '—'}</Text>
            </View>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={[styles.scoreNumber, { color: vc.text }]}>{report.overall_score ?? '—'}</Text>
            <Text style={styles.scoreDenom}>/100</Text>
          </View>
        </View>

        {/* Recommendation */}
        {report.recommendation && (
          <View style={[styles.recBox, { backgroundColor: vc.bg, borderColor: vc.border }]}>
            <Text style={[styles.recText, { color: vc.text }]}>{report.recommendation}</Text>
          </View>
        )}

        {/* Key Metrics */}
        <View style={styles.metricsRow}>
          {[
            { l: 'Monthly Revenue',    v: displayRevenue ? fmt(displayRevenue) : '—',       s: 'A5 agent estimate' },
            { l: 'Monthly Net Profit', v: displayNetProfit ? fmt(displayNetProfit) : '—',   s: displayRevenue && report.monthly_rent ? `${Math.round((report.monthly_rent / displayRevenue) * 100)}% rent ratio` : '' },
            { l: 'Break-even / Day',   v: report.breakeven_daily ? `${report.breakeven_daily} cust.` : '—', s: 'customers needed' },
            { l: 'Payback Period',     v: !breakEvenMonths || breakEvenMonths === 999 || breakEvenMonths === 0 ? 'Not viable' : `${breakEvenMonths} mo`, s: 'from setup cost' },
          ].map(m => (
            <View key={m.l} style={styles.metricCard}>
              <Text style={styles.metricLabel}>{m.l}</Text>
              <Text style={styles.metricValue}>{m.v}</Text>
              {!!m.s && <Text style={styles.metricSub}>{m.s}</Text>}
            </View>
          ))}
        </View>

        {/* Score breakdown */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Score Breakdown</Text>
          {scoreFields.map(f => {
            const score = (report[f.key as keyof typeof report] as number) || 0
            const color = scoreColor(score)
            return (
              <View key={f.label} style={styles.scoreRow}>
                <Text style={styles.scoreLabel}>{f.label}</Text>
                <Text style={styles.scoreWeight}>{f.weight}</Text>
                <View style={styles.scoreBarBg}>
                  <View style={[styles.scoreBarFill, { width: `${score}%` as any, backgroundColor: color }]} />
                </View>
                <Text style={[styles.scoreVal, { color }]}>{score}</Text>
              </View>
            )
          })}
        </View>

        {/* SWOT */}
        {Object.keys(swot).length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>SWOT Analysis</Text>
            <View style={styles.swotGrid}>
              {Object.entries(swot).map(([key, items]) => {
                const cfg = swotConfig[key]
                if (!cfg || !items.length) return null
                return (
                  <View key={key} style={[styles.swotCell, { backgroundColor: cfg.bg, borderColor: cfg.border }]}>
                    <Text style={[styles.swotTitle, { color: cfg.text }]}>{key}</Text>
                    {items.map((item, i) => (
                      <Text key={i} style={[styles.swotItem, { color: cfg.text }]}>· {item}</Text>
                    ))}
                  </View>
                )
              })}
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Locatalyze · locatalyze.com</Text>
          <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>

      {/* ── PAGE 2: Financials ── */}
      <Page size="A4" style={styles.page}>

        <View style={styles.header} fixed>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.logoBox}><Text style={styles.logoText}>L</Text></View>
            <Text style={styles.brandName}>Locatalyze</Text>
          </View>
          <Text style={styles.headerMeta}>{report.business_type} · {displayAddress}</Text>
        </View>

        {/* P&L Summary */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Monthly P&L Summary</Text>
          {[
            { l: 'Monthly Revenue',        v: fmt(displayRevenue),             c: C.emerald,  neg: false },
            { l: 'Cost of Goods (est.)',   v: fin.cogs     ? `−${fmt(fin.cogs)}`     : '—', c: fin.cogs ? C.red : C.n400, neg: true },
            { l: 'Labour (est.)',          v: fin.labour   ? `−${fmt(fin.labour)}`   : '—', c: fin.labour ? C.red : C.n400, neg: true },
            { l: 'Monthly Rent',           v: report.monthly_rent ? `−${fmt(report.monthly_rent)}` : '—', c: report.monthly_rent ? C.red : C.n400, neg: true },
            { l: 'Utilities (est.)',       v: fin.utilities ? `−${fmt(fin.utilities)}` : '—', c: fin.utilities ? C.red : C.n400, neg: true },
          ].map(r => (
            <View key={r.l} style={styles.plRow}>
              <Text style={styles.plLabel}>{r.l}</Text>
              <Text style={[styles.plValue, { color: r.c }]}>{r.v}</Text>
            </View>
          ))}
          <View style={[styles.plRow, { borderBottomWidth: 0, paddingTop: 8 }]}>
            <Text style={[styles.plLabel, { fontFamily: 'Helvetica-Bold', color: C.n900 }]}>Net Profit</Text>
            <Text style={[styles.plValue, { fontSize: 11, color: (displayNetProfit ?? 0) >= 0 ? C.emerald : C.red }]}>{fmt(displayNetProfit)}</Text>
          </View>
        </View>

        {/* Revenue Channels (from A5) */}
        {fin.revenueChannels?.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Revenue Channels</Text>
            {fin.revenueChannels.map((ch: any, i: number) => (
              <View key={i} style={styles.channelRow}>
                <View style={[styles.channelBar, { width: `${(ch.revenue_split_pct ?? 0) * 0.4}%` as any, backgroundColor: C.brand }]} />
                <Text style={styles.channelLabel}>{ch.channel}</Text>
                <Text style={styles.channelPct}>{ch.revenue_split_pct ?? 0}%</Text>
                <Text style={styles.channelAmt}>{ch.monthly_revenue ?? ''}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Sensitivity Scenarios */}
        {riskScenarios.base && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Sensitivity Analysis</Text>
            <View style={styles.scenarioRow}>
              {[
                { key: 'worst', label: 'Worst Case', pct: '60% demand', bg: C.redBg,     border: C.redBdr,     text: C.red     },
                { key: 'base',  label: 'Base Case',  pct: '100% demand', bg: C.blueBg,   border: C.blueBdr,    text: C.blue    },
                { key: 'best',  label: 'Best Case',  pct: '140% demand', bg: C.emeraldBg, border: C.emeraldBdr, text: C.emerald },
              ].map(s => {
                const sc = riskScenarios[s.key] || {}
                return (
                  <View key={s.key} style={[styles.scenarioCard, { backgroundColor: s.bg, borderColor: s.border }]}>
                    <Text style={[styles.scenarioLabel, { color: s.text }]}>{s.label}</Text>
                    <Text style={[styles.scenarioVal, { color: s.text }]}>{fmt(sc.monthlyRevenue)}</Text>
                    <Text style={styles.scenarioSub}>Revenue / mo</Text>
                    <Text style={[styles.scenarioVal, { color: s.text, marginTop: 4, fontSize: 9 }]}>{fmt(sc.monthlyNet)}</Text>
                    <Text style={styles.scenarioSub}>Net Profit / mo</Text>
                  </View>
                )
              })}
            </View>
          </View>
        )}

        {/* 3-year projection */}
        {projections.year1 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>3-Year Projection (estimated)</Text>
            <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: C.n200, paddingBottom: 5, marginBottom: 6 }}>
              {['', 'Year 1', 'Year 2', 'Year 3'].map((h, i) => (
                <Text key={i} style={{ flex: i === 0 ? 1.2 : 1, fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: C.n500, textAlign: i === 0 ? 'left' : 'right' }}>{h}</Text>
              ))}
            </View>
            {[
              { label: 'Revenue',    key: 'revenue',    color: C.n800   },
              { label: 'Net Profit', key: 'netProfit',  color: C.emerald },
            ].map(row => (
              <View key={row.key} style={{ flexDirection: 'row', paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: C.n100 }}>
                <Text style={{ flex: 1.2, fontSize: 8, color: C.n500 as any }}>{row.label}</Text>
                {['year1', 'year2', 'year3'].map(y => (
                  <Text key={y} style={{ flex: 1, fontSize: 8, fontFamily: 'Helvetica-Bold', color: row.color, textAlign: 'right' }}>
                    {fmt(projections[y]?.[row.key])}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Report ID: {report.id} · Locatalyze · locatalyze.com</Text>
          <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>

      {/* ── PAGE 3: Competitive & Market Intelligence ── */}
      <Page size="A4" style={styles.page}>

        <View style={styles.header} fixed>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.logoBox}><Text style={styles.logoText}>L</Text></View>
            <Text style={styles.brandName}>Locatalyze</Text>
          </View>
          <Text style={styles.headerMeta}>{report.business_type} · Market Intelligence</Text>
        </View>

        <View style={styles.twoCol}>
          {/* Competition */}
          <View style={styles.colLeft}>
            {report.competitor_analysis && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Competition Analysis</Text>
                <Text style={styles.analysisText}>{report.competitor_analysis}</Text>
              </View>
            )}

            {/* Opportunity Gaps */}
            {rd.competitors?.opportunity_gaps?.length > 0 && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Opportunity Gaps</Text>
                {rd.competitors.opportunity_gaps.map((g: string, i: number) => (
                  <Text key={i} style={styles.bulletItem}>· {g}</Text>
                ))}
              </View>
            )}

            {/* Recommended Pricing */}
            {fin.recommendedPricing && (
              <View style={[styles.card, { backgroundColor: C.brandLight + '18', borderColor: C.brand }]}>
                <Text style={[styles.cardTitle, { color: C.brand }]}>Recommended Pricing Strategy</Text>
                <Text style={[styles.metricValue, { color: C.brand, marginBottom: 4 }]}>{fin.recommendedPricing.strategy} — {fin.recommendedPricing.avg_ticket}/visit</Text>
                <Text style={styles.analysisText}>{fin.recommendedPricing.pros}</Text>
                <View style={{ flexDirection: 'row', marginTop: 6, gap: 8 }}>
                  <View>
                    <Text style={{ fontSize: 6.5, color: C.n400, textTransform: 'uppercase' }}>Monthly Revenue</Text>
                    <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: C.n800 }}>{fin.recommendedPricing.monthly_revenue ?? '—'}</Text>
                  </View>
                  <View>
                    <Text style={{ fontSize: 6.5, color: C.n400, textTransform: 'uppercase' }}>Monthly Profit</Text>
                    <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: C.emerald }}>{fin.recommendedPricing.monthly_profit ?? '—'}</Text>
                  </View>
                  <View>
                    <Text style={{ fontSize: 6.5, color: C.n400, textTransform: 'uppercase' }}>Customers/day</Text>
                    <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: C.n800 }}>{fin.recommendedPricing.daily_customers_needed ?? '—'}</Text>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Market & Demand */}
          <View style={styles.colRight}>
            {report.market_demand && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Market Demand</Text>
                <Text style={styles.analysisText}>{report.market_demand}</Text>
                {fin.demandTrend && (
                  <View style={{ marginTop: 6, flexDirection: 'row', gap: 6 }}>
                    <View style={[styles.tagPill, { backgroundColor: fin.demandTrend === 'Rising' ? C.emeraldBg : C.amberBg, borderColor: fin.demandTrend === 'Rising' ? C.emeraldBdr : C.amberBdr }]}>
                      <Text style={[styles.tagText, { color: fin.demandTrend === 'Rising' ? C.emerald : C.amber }]}>Demand: {fin.demandTrend}</Text>
                    </View>
                    {fin.marketVerdict && (
                      <View style={[styles.tagPill, { backgroundColor: C.blueBg, borderColor: C.blueBdr }]}>
                        <Text style={[styles.tagText, { color: C.blue }]}>{fin.marketVerdict}</Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
            )}

            {/* Rent Analysis */}
            {report.rent_analysis && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Rent Analysis</Text>
                <Text style={styles.analysisText}>{report.rent_analysis}</Text>
              </View>
            )}

            {/* Regulatory flags */}
            {fin.regulatoryFlags?.length > 0 && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Regulatory Requirements</Text>
                {fin.regulatoryFlags.slice(0, 3).map((f: any, i: number) => (
                  <View key={i} style={{ marginBottom: 5 }}>
                    <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold', color: C.n800 }}>{f.license_name}</Text>
                    <Text style={{ fontSize: 7.5, color: C.n500 }}>Est. cost: {f.estimated_cost} · Processing: {f.processing_time}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Nearby Competitor Businesses */}
        {rd.competitors?.nearbyBusinesses?.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Nearby Competitor Businesses (Sample)</Text>
            <View style={{ flexDirection: 'row', paddingBottom: 5, marginBottom: 4, borderBottomWidth: 1, borderBottomColor: C.n200 }}>
              <Text style={{ flex: 1, fontSize: 7, fontFamily: 'Helvetica-Bold', color: C.n400 }}>Business</Text>
              <Text style={{ width: 80, fontSize: 7, fontFamily: 'Helvetica-Bold', color: C.n400 }}>Location</Text>
              <Text style={{ width: 40, fontSize: 7, fontFamily: 'Helvetica-Bold', color: C.n400, textAlign: 'right' }}>Rating</Text>
            </View>
            {rd.competitors.nearbyBusinesses.slice(0, 6).map((c: any, i: number) => (
              <View key={i} style={styles.compRow}>
                <Text style={styles.compName}>{c.name}</Text>
                <Text style={{ width: 80, fontSize: 7.5, color: C.n500 }}>{(c.address || '').split(',').slice(-2).join(',').trim()}</Text>
                <Text style={styles.compRating}> {c.rating ?? '—'}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Report ID: {report.id} · Locatalyze · locatalyze.com</Text>
          <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>
    </Document>
  )
}

// ─── Download Button ──────────────────────────────────────────────────────────
export default function PDFDownloadButton({ report }: { report: any }) {
  const [loading, setLoading] = useState(false)

  async function handleDownload() {
    setLoading(true)
    try {
      const blob = await pdf(<ReportPDF report={report} />).toBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `locatalyze-${report.business_type?.toLowerCase().replace(/\s+/g, '-') || 'report'}-${(report.address || report.location_name || 'report').toLowerCase().replace(/[\s,]+/g, '-').slice(0, 40)}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('PDF generation failed:', err)
      alert('PDF generation failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '9px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600,
        background: loading ? '#F5F5F4' : '#FFFFFF',
        color: loading ? '#A8A29E' : '#44403C',
        border: `1.5px solid ${loading ? '#E7E5E4' : '#E7E5E4'}`,
        cursor: loading ? 'wait' : 'pointer',
        fontFamily: 'inherit',
        transition: 'all 0.15s',
      }}
    >
      <span>{loading ? '' : '⬇'}</span>
      {loading ? 'Generating PDF...' : 'Download PDF'}
    </button>
  )
}
