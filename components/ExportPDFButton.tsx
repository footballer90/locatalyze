'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'

// ─── Types ────────────────────────────────────────────────────────────────────
interface ReportData {
  business_type?: string | null
  location_name?: string | null
  verdict?: string | null
  overall_score?: number | null
  recommendation?: string | null
  score_rent?: number | null
  score_competition?: number | null
  score_demand?: number | null
  score_profitability?: number | null
  competitor_analysis?: string | null
  rent_analysis?: string | null
  market_demand?: string | null
  swot_analysis?: string | null
  breakeven_daily?: number | null
  breakeven_months?: number | null
  monthly_rent?: number | null
  created_at?: string
  result_data?: any
}

// ─── Lazy-load the PDF generator (client-only, heavy bundle) ─────────────────
const PDFDownloadButton = dynamic(() => import('./PDFDownloadButton'), {
  ssr: false,
  loading: () => (
    <button
      disabled
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '9px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600,
        background: '#F5F5F4', color: '#A8A29E', border: '1.5px solid #E7E5E4',
        cursor: 'wait', fontFamily: 'inherit',
      }}
    >
      <span>⏳</span> Loading PDF...
    </button>
  ),
})

export default function ExportPDFButton({ report }: { report: ReportData }) {
  return <PDFDownloadButton report={report} />
}