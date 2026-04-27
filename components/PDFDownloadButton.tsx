'use client'
import { useState } from 'react'
import { Document, Page, Text, View, StyleSheet, pdf, Image } from '@react-pdf/renderer'

const C = {
  brand: '#0F766E',
  white: '#FFFFFF',
  n50: '#FAFAF9',
  n100: '#F5F5F4',
  n200: '#E7E5E4',
  n400: '#A8A29E',
  n500: '#78716C',
  n700: '#44403C',
  n800: '#292524',
  n900: '#1C1917',
  emerald: '#059669',
  emeraldBg: '#ECFDF5',
  emeraldBdr: '#A7F3D0',
  amber: '#D97706',
  amberBg: '#FFFBEB',
  amberBdr: '#FDE68A',
  red: '#DC2626',
  redBg: '#FEF2F2',
  redBdr: '#FECACA',
  blue: '#2563EB',
  blueBg: '#EFF6FF',
  blueBdr: '#BFDBFE',
}

function parseMoney(v: any): number | null {
  if (v == null) return null
  if (typeof v === 'number') return Number.isFinite(v) ? v : null
  const n = parseFloat(String(v).replace(/[^0-9.-]/g, ''))
  return Number.isFinite(n) ? n : null
}

function safeResultData(rd: any): any {
  if (!rd) return {}
  if (typeof rd === 'string') {
    try {
      return JSON.parse(rd)
    } catch {
      return {}
    }
  }
  return rd
}

function normalizeVerdict(v: string | null | undefined): 'GO' | 'CAUTION' | 'NO GO' {
  const x = String(v || '').toUpperCase()
  if (x.includes('NO')) return 'NO GO'
  if (x.includes('CAUTION') || x.includes('CONDITIONAL')) return 'CAUTION'
  return 'GO'
}

function verdictColors(v: 'GO' | 'CAUTION' | 'NO GO') {
  if (v === 'GO') return { bg: C.emeraldBg, text: C.emerald, border: C.emeraldBdr }
  if (v === 'CAUTION') return { bg: C.amberBg, text: C.amber, border: C.amberBdr }
  return { bg: C.redBg, text: C.red, border: C.redBdr }
}

function fmtMoney(n: number | null | undefined) {
  if (n == null) return 'N/A'
  const abs = Math.abs(Math.round(n))
  const text = '$' + abs.toLocaleString('en-AU')
  return n < 0 ? `-${text}` : text
}

function fmtPct(n: number | null | undefined) {
  if (n == null || !Number.isFinite(n)) return 'N/A'
  return `${n.toFixed(1)}%`
}

function toLines(input: any, limit = 4): string[] {
  if (!input) return []
  if (Array.isArray(input)) {
    return input
      .map((v) => String(v || '').trim())
      .filter(Boolean)
      .slice(0, limit)
  }
  return String(input)
    .split(/\n|[•·]/)
    .map((v) => v.replace(/^\s*[-–]\s*/, '').trim())
    .filter((v) => v.length > 4)
    .slice(0, limit)
}

function parseSwot(raw: string | null): Record<string, string[]> {
  if (!raw) return {}
  const keys = ['STRENGTHS', 'WEAKNESSES', 'OPPORTUNITIES', 'THREATS']
  const result: Record<string, string[]> = {}
  keys.forEach((key, i) => {
    const next = keys[i + 1]
    const pattern = next ? `${key}:\\s*(.*?)(?=${next}:)` : `${key}:\\s*(.*?)$`
    const match = raw.match(new RegExp(pattern, 'is'))
    if (!match) return
    result[key] = match[1]
      .split(/[\n,.•·]/)
      .map((s) => s.replace(/\*+/g, '').replace(/^\s*[-–]\s*/, '').trim())
      .filter((s) => s.length > 4)
      .slice(0, 4)
  })
  return result
}

function paragraph(input: any, fallback: string) {
  const text = String(input || '').replace(/\s+/g, ' ').trim()
  return text || fallback
}

const styles = StyleSheet.create({
  page: { backgroundColor: C.white, paddingTop: 30, paddingBottom: 56, paddingHorizontal: 34, fontFamily: 'Helvetica', fontSize: 9, color: C.n800 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: C.n200 },
  brandLockup: { flexDirection: 'row', alignItems: 'center' },
  logoImage: { width: 92, height: 20, marginRight: 8, objectFit: 'contain' },
  logoBox: { width: 18, height: 18, borderRadius: 4, backgroundColor: C.brand, alignItems: 'center', justifyContent: 'center', marginRight: 6 },
  logoChar: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: C.white, marginTop: -0.5 },
  brand: { fontSize: 13, fontFamily: 'Helvetica-Bold', color: C.n900 },
  meta: { fontSize: 7.5, color: C.n500, textAlign: 'right' },
  coverStripe: { borderRadius: 10, backgroundColor: C.brand, paddingVertical: 8, paddingHorizontal: 12, marginBottom: 8 },
  coverStripeText: { fontSize: 7.8, color: C.white, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 0.7 },
  hero: { borderWidth: 1, borderColor: C.n200, backgroundColor: C.n50, borderRadius: 10, padding: 16, marginBottom: 12 },
  row: { flexDirection: 'row' },
  grow: { flex: 1 },
  label: { fontSize: 7, color: C.n400, textTransform: 'uppercase', marginBottom: 3 },
  business: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: C.n900, marginBottom: 2 },
  address: { fontSize: 9, color: C.n700, lineHeight: 1.4 },
  verdictBadge: { borderRadius: 100, paddingVertical: 4, paddingHorizontal: 12, borderWidth: 1, alignSelf: 'flex-start', marginTop: 8 },
  verdictText: { fontSize: 8, fontFamily: 'Helvetica-Bold' },
  score: { fontSize: 32, fontFamily: 'Helvetica-Bold' },
  scoreSub: { fontSize: 8, color: C.n400, textAlign: 'right' },
  section: { marginBottom: 12 },
  sectionDivider: { height: 1, backgroundColor: C.n100, marginBottom: 10 },
  sectionTitle: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: C.brand, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 },
  card: { borderWidth: 1, borderColor: C.n200, borderRadius: 8, padding: 11, marginBottom: 8, backgroundColor: C.white },
  cardTitle: { fontSize: 9.4, fontFamily: 'Helvetica-Bold', color: C.n800, marginBottom: 5 },
  body: { fontSize: 8.8, color: C.n700, lineHeight: 1.56 },
  bullet: { fontSize: 8.5, color: C.n700, lineHeight: 1.5, marginBottom: 3 },
  metricsWrap: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -4 },
  metric: { width: '50%', paddingHorizontal: 4, marginBottom: 8 },
  metricCard: { borderWidth: 1, borderColor: C.n200, borderRadius: 8, backgroundColor: C.n50, padding: 8 },
  metricLabel: { fontSize: 6.8, color: C.n400, textTransform: 'uppercase', marginBottom: 3, letterSpacing: 0.4 },
  metricValue: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: C.n900 },
  metricSub: { fontSize: 7, color: C.n500, marginTop: 2 },
  split: { flexDirection: 'row', marginHorizontal: -4 },
  col: { width: '50%', paddingHorizontal: 4 },
  warning: { borderRadius: 8, borderWidth: 1.2, padding: 10, marginBottom: 8 },
  warningTitle: { fontSize: 8.2, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', marginBottom: 4 },
  tableHead: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: C.n200, paddingBottom: 5, marginBottom: 4 },
  tableHeadTxt: { fontSize: 7.2, color: C.n500, fontFamily: 'Helvetica-Bold' },
  tableRow: { flexDirection: 'row', paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: C.n100 },
  tableRowMuted: { backgroundColor: C.n50 },
  tableTxt: { fontSize: 8, color: C.n700 },
  footer: { position: 'absolute', left: 34, right: 34, bottom: 22, flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: C.n200, paddingTop: 8 },
  footerText: { fontSize: 7, color: C.n400 },
  watermark: { position: 'absolute', right: 34, bottom: 36, fontSize: 28, color: '#F5F5F4', fontFamily: 'Helvetica-Bold' },
})

function ReportPDF({ report }: { report: any }) {
  const rd = safeResultData(report.result_data)
  const computed = report.computed_result ?? null
  const a3 = rd?.a3?.outputs || rd?.a3 || {}
  const a4 = rd?.a4?.outputs || rd?.a4 || {}
  const a5 = rd?.a5?.outputs || rd?.a5 || {}
  const a6 = rd?.a6?.outputs || rd?.a6 || {}
  const verdict = normalizeVerdict(computed?.verdict ?? report.verdict)
  const vc = verdictColors(verdict)
  const generatedDate = new Date(report.created_at || Date.now()).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
  const address = report.address || report.input_data?.address || report.location_name || 'Address not provided'
  const businessType = report.business_type || 'Business'
  const score = computed?.scores?.overall ?? report.overall_score ?? null

  const revenue = computed?.revenue ?? parseMoney(a5.monthly_revenue ?? a5.projected_monthly_revenue) ?? null
  const netProfit = computed?.netProfit ?? parseMoney(a5.net_profit ?? a5.monthly_profit ?? a5.monthly_net_profit) ?? null
  const rent = parseMoney(computed?.costBreakdown?.rent ?? report.monthly_rent ?? a4.monthly_rent ?? a4.rent) ?? null
  const breakEvenDaily = computed?.breakEvenDaily ?? report.breakeven_daily ?? parseMoney(a5.break_even_daily_customers) ?? null
  const rentToRevenue = rent && revenue ? (rent / revenue) * 100 : null
  const conservativeProfit = parseMoney(computed?.scenarios?.worst?.monthly_profit ?? computed?.scenarios?.worst?.netProfit ?? a5?.sensitivity_analysis?.worst_case?.monthly_profit_loss)
  const baseProfit = parseMoney(computed?.scenarios?.base?.monthly_profit ?? computed?.scenarios?.base?.netProfit ?? a5?.sensitivity_analysis?.base_case?.monthly_profit_loss) ?? netProfit
  const optimisticProfit = parseMoney(computed?.scenarios?.best?.monthly_profit ?? computed?.scenarios?.best?.netProfit ?? a5?.sensitivity_analysis?.best_case?.monthly_profit_loss)
  const competitors = computed?.competitors ?? []
  const competitorCount = computed?.validCompetitorCount ?? competitors.length ?? parseMoney(a3.total_competitors_found) ?? 0
  const demandTrend = computed?.marketSignals?.demandTrend ?? a3.demand_trend ?? 'Not available'
  const demandScore = computed?.marketSignals?.demandScore ?? a3.demand_score ?? null
  const marketFit = computed?.marketIntelligence?.opportunityLevel ?? a3.overall_market_verdict ?? 'Unclear'
  const incomeInsight = paragraph(a6?.income_insight ?? a6?.income_summary ?? a6?.summary, 'Income insight was not returned by the demand pipeline for this report.')

  const verdictSummary = paragraph(
    computed?.decisionExplanation?.summary ?? report.recommendation,
    verdict === 'GO'
      ? 'This location appears viable under current assumptions and model constraints.'
      : verdict === 'CAUTION'
        ? 'This location can work only with strict execution and threshold discipline.'
        : 'This location is currently not viable under the validated assumptions.'
  )

  const keySignals = [
    rentToRevenue != null ? `Rent burden is ${fmtPct(rentToRevenue)} of projected monthly revenue.` : 'Rent burden could not be calculated from current data.',
    `${competitorCount} competitors were detected within the modeled radius, indicating ${competitorCount >= 10 ? 'high' : competitorCount >= 6 ? 'moderate' : 'low to moderate'} competitive pressure.`,
    `Demand trend is ${String(demandTrend).toLowerCase()}${demandScore != null ? ` with a demand score of ${Math.round(Number(demandScore))}/100` : ''}.`,
  ]

  const reasons = (computed?.verdictReasons ?? []).slice(0, 4)
  const risks = (computed?.verdictFailureModes ?? []).slice(0, 4)
  const conditions = (computed?.verdictConditions ?? []).slice(0, 4)
  const swot = parseSwot(report.swot_analysis)
  const strengths = swot.STRENGTHS?.length ? swot.STRENGTHS.slice(0, 4) : toLines(computed?.marketIntelligence?.marketGapNote, 3)

  const killSwitch = paragraph(
    computed?.decisionExplanation?.killSwitch,
    computed?.verdictGateTriggered ? `Kill switch triggered: ${computed.verdictGateTriggered}` : ''
  )
  const showKillSwitch = Boolean(killSwitch)

  const topCompetitors = competitors.slice(0, 5)

  const cogs = parseMoney(computed?.costBreakdown?.cogs ?? a4.cogs ?? a4.monthly_cogs)
  const staff = parseMoney(computed?.costBreakdown?.staff ?? a4.monthly_staff_cost ?? a4.monthly_labour)
  const otherCosts = parseMoney(computed?.costBreakdown?.other)
  const totalCosts = parseMoney(computed?.totalCosts ?? a4.total_monthly_costs ?? a4.monthly_total)

  const financialDriverText = paragraph(
    computed?.decisionExplanation?.rentLogic?.summary,
    'Profit is driven by the spread between daily customer throughput x average ticket and fixed monthly cost load (rent + staff + operating costs).'
  )
  const dependencyText = paragraph(
    computed?.decisionExplanation?.rentLogic?.criticalDependency,
    'The model is most sensitive to conversion into paying customers during the first operating months.'
  )

  const goIf = toLines(computed?.decisionContract?.goIf, 5)
  const noGoIf = toLines(computed?.decisionContract?.noGoIf, 5)
  const rerunIf = toLines(computed?.decisionContract?.rerunIf, 5)
  const logoSrc = typeof window !== 'undefined'
    ? `${window.location.origin}/locatalyze-without-BG.svg`
    : '/locatalyze-without-BG.svg'

  return (
    <Document title={`Locatalyze Decision Report — ${businessType}`} author="Locatalyze">
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <View>
            <View style={styles.brandLockup}>
              <Image src={logoSrc} style={styles.logoImage} />
              <View style={styles.logoBox}><Text style={styles.logoChar}>L</Text></View>
              <Text style={styles.brand}>Locatalyze Decision Report</Text>
            </View>
            <Text style={styles.meta}>Decision-grade export</Text>
          </View>
          <View>
            <Text style={styles.meta}>Generated: {generatedDate}</Text>
            <Text style={styles.meta}>Report ID: {report.report_id ?? report.id ?? 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.coverStripe}>
          <Text style={styles.coverStripeText}>Prepared for business decision and stakeholder review</Text>
        </View>

        <View style={styles.hero} wrap={false}>
          <View style={styles.row}>
            <View style={styles.grow}>
              <Text style={styles.label}>Business Type</Text>
              <Text style={styles.business}>{businessType}</Text>
              <Text style={styles.address}>{address}</Text>
              <View style={[styles.verdictBadge, { backgroundColor: vc.bg, borderColor: vc.border }]}>
                <Text style={[styles.verdictText, { color: vc.text }]}>{verdict}</Text>
              </View>
            </View>
            <View>
              <Text style={[styles.score, { color: vc.text }]}>{score != null ? Math.round(Number(score)) : 'N/A'}</Text>
              <Text style={styles.scoreSub}>overall score</Text>
            </View>
          </View>
        </View>
        <View style={styles.sectionDivider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Executive Summary</Text>
          <View style={styles.card} wrap={false}>
            <Text style={[styles.body, { fontFamily: 'Helvetica-Bold', color: vc.text, marginBottom: 6 }]}>
              Final verdict: {verdict}. {verdictSummary}
            </Text>
            {keySignals.map((x, i) => (
              <Text key={i} style={styles.bullet}>- {x}</Text>
            ))}
          </View>
          {showKillSwitch && (
            <View style={[styles.warning, { borderColor: C.redBdr, backgroundColor: C.redBg }]} wrap={false}>
              <Text style={[styles.warningTitle, { color: C.red }]}>Kill Switch Warning</Text>
              <Text style={[styles.body, { color: '#991B1B', fontFamily: 'Helvetica-Bold' }]}>{killSwitch}</Text>
            </View>
          )}
        </View>
        <View style={styles.sectionDivider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Core Metrics</Text>
          <View style={styles.metricsWrap} wrap={false}>
            <View style={styles.metric}><View style={styles.metricCard}><Text style={styles.metricLabel}>Rent to Revenue Ratio</Text><Text style={styles.metricValue}>{fmtPct(rentToRevenue)}</Text><Text style={styles.metricSub}>Monthly rent as % of projected revenue</Text></View></View>
            <View style={styles.metric}><View style={styles.metricCard}><Text style={styles.metricLabel}>Break-even Customers / Day</Text><Text style={styles.metricValue}>{breakEvenDaily != null ? Math.round(Number(breakEvenDaily)).toString() : 'N/A'}</Text><Text style={styles.metricSub}>Minimum daily throughput needed</Text></View></View>
            <View style={styles.metric}><View style={styles.metricCard}><Text style={styles.metricLabel}>Estimated Monthly Revenue</Text><Text style={styles.metricValue}>{fmtMoney(revenue)}</Text><Text style={styles.metricSub}>Engine-calculated monthly estimate</Text></View></View>
            <View style={styles.metric}><View style={styles.metricCard}><Text style={styles.metricLabel}>Profit Range</Text><Text style={styles.metricValue}>{`${fmtMoney(conservativeProfit)} / ${fmtMoney(baseProfit)} / ${fmtMoney(optimisticProfit)}`}</Text><Text style={styles.metricSub}>Conservative / Base / Optimistic</Text></View></View>
          </View>
        </View>
        <View style={styles.sectionDivider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Decision Explanation</Text>
          <View style={styles.split}>
            <View style={styles.col}>
              <View style={styles.card} wrap={false}>
                <Text style={styles.cardTitle}>Why this {verdict}</Text>
                {(reasons.length ? reasons : [verdictSummary]).map((x: string, i: number) => <Text key={i} style={styles.bullet}>- {x}</Text>)}
              </View>
              <View style={styles.card} wrap={false}>
                <Text style={styles.cardTitle}>Key Advantages</Text>
                {(strengths.length ? strengths : ['No specific advantage signals were returned by the upstream model.']).map((x: string, i: number) => <Text key={i} style={styles.bullet}>- {x}</Text>)}
              </View>
            </View>
            <View style={styles.col}>
              <View style={styles.card} wrap={false}>
                <Text style={styles.cardTitle}>Key Risks</Text>
                {(risks.length ? risks : ['No explicit failure modes were returned for this report.']).map((x: string, i: number) => <Text key={i} style={styles.bullet}>- {x}</Text>)}
              </View>
              <View style={styles.card} wrap={false}>
                <Text style={styles.cardTitle}>What Must Be True</Text>
                {(conditions.length ? conditions : ['Critical conditions were not returned by the engine. Re-run may be required.']).map((x: string, i: number) => <Text key={i} style={styles.bullet}>- {x}</Text>)}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Locatalyze · locatalyze.com</Text>
          <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
        <Text style={styles.watermark}>LOCATALYZE</Text>
      </Page>

      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <View>
            <View style={styles.brandLockup}>
              <Image src={logoSrc} style={styles.logoImage} />
              <View style={styles.logoBox}><Text style={styles.logoChar}>L</Text></View>
              <Text style={styles.brand}>Competition and Demand</Text>
            </View>
            <Text style={styles.meta}>{businessType}</Text>
          </View>
          <Text style={styles.meta}>{address}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Competition Analysis</Text>
          <View style={styles.card} wrap={false}>
            <Text style={styles.body}>
              {competitorCount} competitors identified within the modeled area.
              {' '}This indicates {competitorCount >= 10 ? 'high saturation and margin pressure.' : competitorCount >= 6 ? 'moderate saturation where differentiation decides outcomes.' : 'limited direct saturation, which can be opportunity or weaker demand.'}
            </Text>
            {report.competitor_analysis ? <Text style={[styles.body, { marginTop: 7 }]}>{paragraph(report.competitor_analysis, '')}</Text> : null}
          </View>
          <View style={styles.card} wrap={false}>
            <Text style={styles.cardTitle}>Strength Indicators (Ratings and Proximity)</Text>
            {topCompetitors.length ? (
              <>
                <View style={styles.tableHead}>
                  <Text style={[styles.tableHeadTxt, { width: '54%' }]}>Competitor</Text>
                  <Text style={[styles.tableHeadTxt, { width: '20%' }]}>Rating</Text>
                  <Text style={[styles.tableHeadTxt, { width: '26%', textAlign: 'right' }]}>Distance</Text>
                </View>
                {topCompetitors.map((c: any, i: number) => (
                  <View key={i} style={[styles.tableRow, ...(i % 2 === 1 ? [styles.tableRowMuted] : [])]}>
                    <Text style={[styles.tableTxt, { width: '54%' }]}>{c.name ?? 'Unnamed competitor'}</Text>
                    <Text style={[styles.tableTxt, { width: '20%' }]}>{c.rating ?? 'N/A'}</Text>
                    <Text style={[styles.tableTxt, { width: '26%', textAlign: 'right' }]}>{c.distance != null ? `${Math.round(Number(c.distance))}m` : 'N/A'}</Text>
                  </View>
                ))}
              </>
            ) : (
              <Text style={styles.body}>Named competitor records were not returned by this pipeline run.</Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Demographics and Demand</Text>
          <View style={styles.card} wrap={false}>
            <Text style={styles.cardTitle}>Income Insights</Text>
            <Text style={styles.body}>{incomeInsight}</Text>
          </View>
          <View style={styles.card} wrap={false}>
            <Text style={styles.cardTitle}>Local Demand and Business-Type Fit</Text>
            <Text style={styles.body}>
              Demand trend: {String(demandTrend)}. Market fit level: {String(marketFit)}.
              {' '}For a {String(businessType).toLowerCase()} concept, this means execution quality must align with local customer behavior and spending pattern, not just headline rent.
            </Text>
            <Text style={[styles.body, { marginTop: 6 }]}>
              {paragraph(report.market_demand, 'No dedicated market demand narrative was returned by this run.')}
            </Text>
          </View>
        </View>
        <View style={styles.sectionDivider} />

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Report ID: {report.report_id ?? report.id ?? 'N/A'} · Locatalyze</Text>
          <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
        <Text style={styles.watermark}>LOCATALYZE</Text>
      </Page>

      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <View>
            <View style={styles.brandLockup}>
              <Image src={logoSrc} style={styles.logoImage} />
              <View style={styles.logoBox}><Text style={styles.logoChar}>L</Text></View>
              <Text style={styles.brand}>Financial Model and Decision Contract</Text>
            </View>
            <Text style={styles.meta}>{businessType}</Text>
          </View>
          <Text style={styles.meta}>Decision checklist aligned to engine output</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Financial Model Breakdown</Text>
          <View style={styles.card} wrap={false}>
            <View style={styles.tableHead}>
              <Text style={[styles.tableHeadTxt, { width: '60%' }]}>Line Item</Text>
              <Text style={[styles.tableHeadTxt, { width: '40%', textAlign: 'right' }]}>Monthly Value</Text>
            </View>
            {[
              ['Revenue', revenue],
              ['Rent', rent],
              ['Staff', staff],
              ['COGS', cogs],
              ['Other operating costs', otherCosts],
              ['Total costs', totalCosts],
              ['Net profit', netProfit],
            ].map((row, i) => (
              <View key={i} style={[styles.tableRow, ...(i % 2 === 1 ? [styles.tableRowMuted] : [])]}>
                <Text style={[styles.tableTxt, { width: '60%' }]}>{row[0]}</Text>
                <Text style={[styles.tableTxt, { width: '40%', textAlign: 'right', fontFamily: 'Helvetica-Bold' }]}>{fmtMoney(row[1] as number | null)}</Text>
              </View>
            ))}
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>What Drives Profit and Loss</Text>
            <Text style={styles.body}>{financialDriverText}</Text>
            <Text style={[styles.body, { marginTop: 6, color: '#92400E', fontFamily: 'Helvetica-Bold' }]}>
              Critical dependency: {dependencyText}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kill Switch</Text>
          <View style={[styles.warning, { borderColor: showKillSwitch ? C.redBdr : C.amberBdr, backgroundColor: showKillSwitch ? C.redBg : C.amberBg }]} wrap={false}>
            <Text style={[styles.warningTitle, { color: showKillSwitch ? C.red : C.amber }]}>
              {showKillSwitch ? 'Serious Stop Condition' : 'No Active Hard Stop Returned'}
            </Text>
            <Text style={[styles.body, { color: showKillSwitch ? '#991B1B' : '#92400E', fontFamily: 'Helvetica-Bold' }]}>
              {showKillSwitch ? killSwitch : 'No explicit kill-switch trigger was returned. Continue only if all decision-contract checks are validated on-site.'}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Decision Contract</Text>
          <View style={styles.split} wrap={false}>
            <View style={styles.col}>
              <View style={[styles.card, { backgroundColor: C.emeraldBg, borderColor: C.emeraldBdr }]} wrap={false}>
                <Text style={[styles.cardTitle, { color: C.emerald }]}>GO If</Text>
                {(goIf.length ? goIf : ['No GO rules returned by engine.']).map((x: string, i: number) => <Text key={i} style={styles.bullet}>- {x}</Text>)}
              </View>
            </View>
            <View style={styles.col}>
              <View style={[styles.card, { backgroundColor: C.redBg, borderColor: C.redBdr }]} wrap={false}>
                <Text style={[styles.cardTitle, { color: C.red }]}>NO GO If</Text>
                {(noGoIf.length ? noGoIf : ['No NO-GO rules returned by engine.']).map((x: string, i: number) => <Text key={i} style={styles.bullet}>- {x}</Text>)}
              </View>
            </View>
          </View>
          <View style={[styles.card, { backgroundColor: C.amberBg, borderColor: C.amberBdr }]} wrap={false}>
            <Text style={[styles.cardTitle, { color: C.amber }]}>Re-run Required If</Text>
            {(rerunIf.length ? rerunIf : ['No re-run conditions returned by engine.']).map((x: string, i: number) => <Text key={i} style={styles.bullet}>- {x}</Text>)}
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Locatalyze · Decision-grade report export</Text>
          <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
        <Text style={styles.watermark}>LOCATALYZE</Text>
      </Page>
    </Document>
  )
}

export default function PDFDownloadButton({ report, onExport }: { report: any; onExport?: () => void }) {
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
      onExport?.()
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
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '9px 16px',
        borderRadius: 10,
        fontSize: 13,
        fontWeight: 600,
        background: loading ? '#F5F5F4' : '#FFFFFF',
        color: loading ? '#A8A29E' : '#44403C',
        border: '1.5px solid #E7E5E4',
        cursor: loading ? 'wait' : 'pointer',
        fontFamily: 'inherit',
        transition: 'all 0.15s',
      }}
    >
      <span>{loading ? '' : '⬇'}</span>
      {loading ? 'Generating report PDF...' : 'Export report PDF'}
    </button>
  )
}
