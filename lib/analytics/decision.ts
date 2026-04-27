export const DECISION_EVENTS = {
  reportViewed: 'report_viewed',
  verdictViewed: 'verdict_viewed',
  decisionSummaryExported: 'decision_summary_exported',
  locationCompareUsed: 'location_compare_used',
} as const

export type DecisionEventBase = {
  report_id: string
  business_type: string | null
  verdict: string | null
  data_mode?: 'BENCHMARK' | 'HYBRID' | 'DATA_DRIVEN' | null
  confidence_score?: number | null
}

