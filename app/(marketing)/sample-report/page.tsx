// app/(marketing)/sample-report/page.tsx
// Server component — exports metadata, delegates rendering to SampleReportClient

import type { Metadata } from 'next'
import SampleReportClient from './SampleReportClient'

export const metadata: Metadata = {
  title: 'Sample Location Report — Locatalyze',
  description: 'See exactly what a Locatalyze location report looks like. Full GO/CAUTION/NO verdict, competitor map, financial model, SWOT analysis and 3-year projection for a real Australian address.',
  alternates: { canonical: 'https://www.locatalyze.com/sample-report' },
}

export default function SampleReportPage() {
  return <SampleReportClient />
}
