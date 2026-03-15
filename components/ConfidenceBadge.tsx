// components/ConfidenceBadge.tsx
// Usage: <ConfidenceBadge level="live" label="Updated today" />
// Drop this next to any section heading in your report page.

type ConfidenceLevel = 'live' | 'high' | 'medium' | 'estimated'

interface Props {
  level: ConfidenceLevel
  label?: string
}

const CONFIG: Record<ConfidenceLevel, { text: string; color: string; bg: string; border: string; dot: string }> = {
  live:      { text: 'Live data',      color: '#34D399', bg: 'rgba(52,211,153,0.08)',  border: 'rgba(52,211,153,0.22)',  dot: '#34D399' },
  high:      { text: 'High confidence',color: '#34D399', bg: 'rgba(52,211,153,0.06)',  border: 'rgba(52,211,153,0.18)',  dot: '#34D399' },
  medium:    { text: 'Est. confidence',color: '#F59E0B', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.22)',  dot: '#F59E0B' },
  estimated: { text: 'Benchmark est.', color: '#9CA3AF', bg: 'rgba(156,163,175,0.06)', border: 'rgba(156,163,175,0.18)', dot: '#9CA3AF' },
}

export function ConfidenceBadge({ level, label }: Props) {
  const c = CONFIG[level]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 9px', borderRadius: 20,
      background: c.bg, border: `1px solid ${c.border}`,
      fontSize: 11, fontWeight: 600, color: c.color,
      fontFamily: "'DM Sans','Inter',sans-serif",
      letterSpacing: '0.01em',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: c.dot, flexShrink: 0 }} />
      {label ?? c.text}
    </span>
  )
}

// ─── Helper: derive confidence from n8n dataQuality fields ───────────────────
// Call this in your report page to auto-pick the right level.
//
// Example:
//   const compConf = getCompetitorConfidence(report.dataQuality?.competitors)
//   const demConf  = getDemographicsConfidence(report.dataQuality?.demographics)
//   const rentConf = 'estimated'  // always benchmark-based
//   const finConf  = getFinancialConfidence(report.dataQuality?.competitors, report.dataQuality?.demographics)

export function getCompetitorConfidence(dq?: string): ConfidenceLevel {
  if (!dq) return 'estimated'
  if (dq === 'geoapify_live') return 'live'
  if (dq === 'estimated_fallback') return 'medium'
  return 'estimated'
}

export function getDemographicsConfidence(dq?: string): ConfidenceLevel {
  if (!dq) return 'estimated'
  if (dq.startsWith('abs_suburb:')) return 'high'
  if (dq.startsWith('abs_regional:')) return 'medium'
  return 'estimated'
}

export function getFinancialConfidence(compDq?: string, demDq?: string): ConfidenceLevel {
  const comp = getCompetitorConfidence(compDq)
  const dem  = getDemographicsConfidence(demDq)
  if (comp === 'live' && dem === 'high') return 'high'
  if (comp === 'live' || dem !== 'estimated') return 'medium'
  return 'estimated'
}