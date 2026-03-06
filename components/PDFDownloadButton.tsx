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
}

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

function fmt(n: number | null | undefined) {
  if (n == null) return '—'
  return '$' + Number(n).toLocaleString('en-AU', { maximumFractionDigits: 0 })
}

function parseSwot(raw: string | null) {
  if (!raw) return {}
  const keys = ['STRENGTHS', 'WEAKNESSES', 'OPPORTUNITIES', 'THREATS']
  const result: Record<string, string[]> = {}
  keys.forEach((key, idx) => {
    const next = keys[idx + 1]
    const pattern = next ? `${key}:\\s*(.*?)(?=${next}:)` : `${key}:\\s*(.*?)$`
    const match = raw.match(new RegExp(pattern, 'is'))
    if (match) {
      result[key] = match[1].split(/[,.]/).map(s => s.trim()).filter(s => s.length > 5).slice(0, 3)
    }
  })
  return result
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: C.n200 },
  logoBox: { width: 28, height: 28, backgroundColor: C.brand, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  logoText: { color: C.white, fontSize: 14, fontFamily: 'Helvetica-Bold' },
  brandName: { fontSize: 13, fontFamily: 'Helvetica-Bold', color: C.n900, marginLeft: 6 },
  headerMeta: { fontSize: 7.5, color: C.n400, textAlign: 'right' },

  // Hero card
  heroCard: { backgroundColor: C.n50, borderRadius: 10, padding: '14 16', marginBottom: 12, borderWidth: 1, borderColor: C.n200, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  locationLabel: { fontSize: 7.5, color: C.n400, marginBottom: 3 },
  bizName: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: C.n900, marginBottom: 4 },
  verdictPill: { borderRadius: 100, paddingVertical: 3, paddingHorizontal: 10, marginBottom: 6, alignSelf: 'flex-start' },
  verdictText: { fontSize: 8, fontFamily: 'Helvetica-Bold' },
  scoreNumber: { fontSize: 32, fontFamily: 'Helvetica-Bold' },
  scoreDenom: { fontSize: 9, color: C.n400 },

  // Recommendation
  recBox: { borderRadius: 8, padding: '10 12', marginBottom: 12, borderWidth: 1 },
  recText: { fontSize: 8.5, lineHeight: 1.6 },

  // Metrics strip
  metricsRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  metricCard: { flex: 1, backgroundColor: C.n50, borderRadius: 8, padding: '10 10', borderWidth: 1, borderColor: C.n200 },
  metricLabel: { fontSize: 6.5, color: C.n400, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4, fontFamily: 'Helvetica-Bold' },
  metricValue: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: C.n800 },
  metricSub: { fontSize: 6.5, color: C.n400, marginTop: 2 },

  // Section
  sectionTitle: { fontSize: 7, fontFamily: 'Helvetica-Bold', color: C.brand, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 },
  card: { backgroundColor: C.white, borderRadius: 8, padding: '12 14', marginBottom: 10, borderWidth: 1, borderColor: C.n200 },
  cardTitle: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: C.n800, marginBottom: 8 },

  // Score bars
  scoreRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 7 },
  scoreLabel: { width: 110, fontSize: 8, color: C.n700 },
  scoreWeight: { width: 28, fontSize: 7, color: C.n400, textAlign: 'right' },
  scoreBarBg: { flex: 1, height: 5, backgroundColor: C.n100, borderRadius: 100, marginHorizontal: 6, overflow: 'hidden' },
  scoreBarFill: { height: 5, borderRadius: 100 },
  scoreVal: { width: 20, fontSize: 8, fontFamily: 'Helvetica-Bold', textAlign: 'right' },

  // SWOT
  swotGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  swotCell: { width: '48.5%', borderRadius: 7, padding: '9 10', borderWidth: 1 },
  swotTitle: { fontSize: 7.5, fontFamily: 'Helvetica-Bold', marginBottom: 5 },
  swotItem: { fontSize: 7.5, lineHeight: 1.55, marginBottom: 2 },

  // Analysis text
  analysisText: { fontSize: 8.5, color: C.n500 as any, lineHeight: 1.65 },

  // P&L
  plRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: C.n100 },
  plLabel: { fontSize: 8.5, color: C.n500 as any },
  plValue: { fontSize: 8.5, fontFamily: 'Helvetica-Bold' },

  // Footer
  footer: { position: 'absolute', bottom: 24, left: 36, right: 36, flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: C.n200, paddingTop: 8 },
  footerText: { fontSize: 7, color: C.n400 },

  // Two col layout
  twoCol: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  colLeft: { flex: 1 },
  colRight: { flex: 1 },

  // Risk scenarios
  scenarioRow: { flexDirection: 'row', gap: 6, marginBottom: 10 },
  scenarioCard: { flex: 1, borderRadius: 7, padding: '9 10', borderWidth: 1 },
  scenarioLabel: { fontSize: 7, fontFamily: 'Helvetica-Bold', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.4 },
  scenarioVal: { fontSize: 11, fontFamily: 'Helvetica-Bold', marginBottom: 2 },
  scenarioSub: { fontSize: 7, color: C.n400 },
})

// ─── PDF Document ─────────────────────────────────────────────────────────────
function ReportPDF({ report }: { report: any }) {
  const vc = verdictColors(report.verdict)
  const fin = report.result_data?.financials || {}
  const riskScenarios = fin.riskScenarios || {}
  const projections = fin.projections || {}
  const swot = parseSwot(report.swot_analysis)
  const generatedDate = new Date(report.created_at || Date.now()).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })

  const scoreFields = [
    { label: 'Rent Affordability', key: 'score_rent',         weight: '30%' },
    { label: 'Profitability',      key: 'score_profitability', weight: '25%' },
    { label: 'Competition',        key: 'score_competition',   weight: '25%' },
    { label: 'Demographics',       key: 'score_demand',        weight: '20%' },
  ]

  const swotConfig: Record<string, { bg: string; border: string; text: string }> = {
    STRENGTHS:     { bg: C.emeraldBg, border: C.emeraldBdr, text: '#065F46' },
    WEAKNESSES:    { bg: C.amberBg,   border: C.amberBdr,   text: '#92400E' },
    OPPORTUNITIES: { bg: '#EFF6FF',   border: '#BFDBFE',    text: '#1D4ED8' },
    THREATS:       { bg: C.redBg,     border: C.redBdr,     text: '#991B1B' },
  }

  return (
    <Document title={`Locatalyze — ${report.business_type} · ${report.location_name}`} author="Locatalyze">

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
            <Text style={styles.locationLabel}>📍 {report.location_name || '—'}</Text>
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

        {/* Metrics */}
        <View style={styles.metricsRow}>
          {[
            { l: 'Monthly Revenue',    v: fmt(fin.monthlyRevenue),    s: 'demand estimate'  },
            { l: 'Monthly Net Profit', v: fmt(fin.monthlyNetProfit),   s: fin.profitMargin ? `${fin.profitMargin}% margin` : '' },
            { l: 'Break-even / Day',   v: report.breakeven_daily ? `${report.breakeven_daily} cust.` : '—', s: 'customers needed' },
            { l: 'Payback Period',     v: report.breakeven_months === 999 || !report.breakeven_months ? 'Not viable' : `${report.breakeven_months} months`, s: '' },
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
          <Text style={styles.footerText}>Locatalyze · locatalyze.vercel.app</Text>
          <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>

      {/* ── PAGE 2: Financials & Analysis ── */}
      <Page size="A4" style={styles.page}>

        <View style={styles.header} fixed>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.logoBox}><Text style={styles.logoText}>L</Text></View>
            <Text style={styles.brandName}>Locatalyze</Text>
          </View>
          <Text style={styles.headerMeta}>{report.business_type} · {report.location_name}</Text>
        </View>

        {/* P&L */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Monthly P&L Summary</Text>
          {[
            { l: 'Monthly Revenue',       v: fmt(fin.monthlyRevenue),      c: C.emerald  },
            { l: 'Cost of Goods (est.)',   v: `−${fmt(fin.cogs)}`,           c: C.red     },
            { l: 'Labour (est.)',          v: `−${fmt(fin.labour)}`,         c: C.red     },
            { l: 'Monthly Rent',           v: `−${fmt(report.monthly_rent)}`, c: C.red     },
            { l: 'Other Overheads (est.)', v: `−${fmt(fin.otherOverheads)}`,  c: C.red     },
          ].map(r => (
            <View key={r.l} style={styles.plRow}>
              <Text style={styles.plLabel}>{r.l}</Text>
              <Text style={[styles.plValue, { color: r.c }]}>{r.v}</Text>
            </View>
          ))}
          <View style={[styles.plRow, { borderBottomWidth: 0, paddingTop: 8 }]}>
            <Text style={[styles.plLabel, { fontFamily: 'Helvetica-Bold', color: C.n900 }]}>Net Profit</Text>
            <Text style={[styles.plValue, { fontSize: 11, color: (fin.monthlyNetProfit ?? 0) >= 0 ? C.emerald : C.red }]}>{fmt(fin.monthlyNetProfit)}</Text>
          </View>
        </View>

        {/* Risk scenarios */}
        {riskScenarios.base && (
          <View style={[styles.card, { marginBottom: 10 }]}>
            <Text style={styles.sectionTitle}>Risk Scenarios</Text>
            <View style={styles.scenarioRow}>
              {[
                { key: 'worst', label: 'Worst Case', pct: '70% demand',  bg: C.redBg,     border: C.redBdr,     text: C.red     },
                { key: 'base',  label: 'Base Case',  pct: '100% demand', bg: '#EFF6FF',   border: '#BFDBFE',    text: '#1D4ED8' },
                { key: 'best',  label: 'Best Case',  pct: '130% demand', bg: C.emeraldBg, border: C.emeraldBdr, text: C.emerald },
              ].map(s => {
                const sc = riskScenarios[s.key] || {}
                return (
                  <View key={s.key} style={[styles.scenarioCard, { backgroundColor: s.bg, borderColor: s.border }]}>
                    <Text style={[styles.scenarioLabel, { color: s.text }]}>{s.label}</Text>
                    <Text style={[styles.scenarioVal, { color: s.text }]}>{fmt(sc.monthlyRevenue)}</Text>
                    <Text style={styles.scenarioSub}>Revenue</Text>
                    <Text style={[styles.scenarioVal, { color: s.text, marginTop: 4, fontSize: 9 }]}>{fmt(sc.monthlyNet)}</Text>
                    <Text style={styles.scenarioSub}>Net Profit</Text>
                  </View>
                )
              })}
            </View>
          </View>
        )}

        {/* 3-year projection */}
        {projections.year1 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>3-Year Projection</Text>
            <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: C.n200, paddingBottom: 5, marginBottom: 6 }}>
              {['', 'Year 1', 'Year 2', 'Year 3'].map((h, i) => (
                <Text key={i} style={{ flex: i === 0 ? 1.2 : 1, fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: C.n500, textAlign: i === 0 ? 'left' : 'right' }}>{h}</Text>
              ))}
            </View>
            {[
              { label: 'Revenue',    key: 'revenue',   color: C.n800   },
              { label: 'Net Profit', key: 'netProfit', color: C.emerald },
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

        {/* Analysis sections */}
        <View style={styles.twoCol}>
          <View style={styles.colLeft}>
            {report.competitor_analysis && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>🏪 Competition Analysis</Text>
                <Text style={styles.analysisText}>{report.competitor_analysis}</Text>
              </View>
            )}
            {report.rent_analysis && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>🏠 Rent Analysis</Text>
                <Text style={styles.analysisText}>{report.rent_analysis}</Text>
              </View>
            )}
          </View>
          <View style={styles.colRight}>
            {report.market_demand && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>📈 Market Demand</Text>
                <Text style={styles.analysisText}>{report.market_demand}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Report ID: {report.id} · Locatalyze · locatalyze.vercel.app</Text>
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
      a.download = `locatalyze-${report.business_type?.toLowerCase().replace(/\s+/g, '-') || 'report'}-${report.location_name?.toLowerCase().replace(/\s+/g, '-') || 'report'}.pdf`
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
      <span>{loading ? '⏳' : '⬇️'}</span>
      {loading ? 'Generating PDF...' : 'Download PDF'}
    </button>
  )
}