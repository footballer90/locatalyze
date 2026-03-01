'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useSearchParams } from 'next/navigation'

// ─── TYPES ────────────────────────────────────────────────────
interface Report {
  id: string
  submission_id: string
  overall_score: number
  verdict: 'GO' | 'CAUTION' | 'NO'
  score_competition: number
  score_rent: number
  score_demand: number
  score_cost: number
  score_profitability: number
  recommendation: string
  competitor_analysis: string
  rent_analysis: string
  market_demand: string
  cost_analysis: string
  profitability: string
  breakeven_monthly: number
  breakeven_daily: number
  breakeven_months: number
  pl_summary: string
  three_year_projection: string
  sensitivity_analysis: string
  swot_analysis: string
  full_report_markdown: string
  share_token: string
  created_at: string
}

// ─── SCORE CIRCLE ─────────────────────────────────────────────
function ScoreCircle({ score, size = 140, stroke = 10, color, label }: {
  score: number, size?: number, stroke?: number, color: string, label?: string
}) {
  const [val, setVal] = useState(0)
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = ((100 - val) / 100) * circ

  useEffect(() => {
    let start = 0
    const go = (ts: number) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / 1000, 1)
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * score))
      if (p < 1) requestAnimationFrame(go)
    }
    const t = setTimeout(() => requestAnimationFrame(go), 400)
    return () => clearTimeout(t)
  }, [score])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={stroke} />
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.03s' }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: size > 100 ? 32 : 18, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{val}</span>
          <span style={{ fontSize: size > 100 ? 11 : 9, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>/100</span>
        </div>
      </div>
      {label && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }}>{label}</span>}
    </div>
  )
}

// ─── PROGRESS BAR SCORE ───────────────────────────────────────
function ScoreBar({ label, score, color, icon }: { label: string, score: number, color: string, icon: string }) {
  const [width, setWidth] = useState(0)
  useEffect(() => { const t = setTimeout(() => setWidth(score), 600); return () => clearTimeout(t) }, [score])
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>{icon}</span>{label}
        </span>
        <span style={{ fontSize: 13, fontWeight: 700, color }}>{score}/100</span>
      </div>
      <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 100, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${width}%`, background: color,
          borderRadius: 100, transition: 'width 1s cubic-bezier(0.4,0,0.2,1)'
        }} />
      </div>
    </div>
  )
}

// ─── TIER GATE ────────────────────────────────────────────────
function TierGate({ tier, requiredTier, children }: { tier: string, requiredTier: 'pro' | 'investor', children: React.ReactNode }) {
  const tiers = ['free', 'pro', 'investor']
  const hasAccess = tiers.indexOf(tier) >= tiers.indexOf(requiredTier)
  if (hasAccess) return <>{children}</>

  const label = requiredTier === 'pro' ? '⭐ Pro' : '💎 Investor Pack'
  const desc = requiredTier === 'pro'
    ? 'Unlock P&L summary, full breakdown and PDF download'
    : 'Unlock 3-year projections, sensitivity analysis, SWOT and investor-ready PDF'

  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px dashed rgba(255,255,255,0.12)',
      borderRadius: 16, padding: '32px',
      textAlign: 'center', marginBottom: 24,
    }}>
      <div style={{ fontSize: 28, marginBottom: 10 }}>🔒</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{label} Feature</div>
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 20 }}>{desc}</div>
      <button style={{
        background: requiredTier === 'pro' ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'linear-gradient(135deg, #f59e0b, #ef4444)',
        color: '#fff', border: 'none', borderRadius: 10,
        padding: '10px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer'
      }}>
        Upgrade to {label}
      </button>
    </div>
  )
}

// ─── SECTION CARD ─────────────────────────────────────────────
function Card({ icon, title, children, accent }: { icon: string, title: string, children: React.ReactNode, accent?: string }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.025)',
      border: `1px solid ${accent ? accent + '33' : 'rgba(255,255,255,0.07)'}`,
      borderRadius: 18, padding: '24px 28px', marginBottom: 20,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: 0 }}>{title}</h3>
      </div>
      {children}
    </div>
  )
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────
export default function DashboardPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const submissionId = params.id as string
  const tier = searchParams.get('tier') || 'free'

  const [report, setReport] = useState<Report | null>(null)
  const [status, setStatus] = useState<'waiting' | 'ready' | 'error' | 'db_error'>('waiting')
  const [pollCount, setPollCount] = useState(0)
  const [dbError, setDbError] = useState('')
  const [copied, setCopied] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!submissionId || submissionId === 'undefined') {
      setStatus('db_error')
      setDbError('No submission ID found. Please go back and submit the form again.')
      return
    }
    let attempts = 0
    const poll = async () => {
      attempts++
      setPollCount(attempts)
      try {
        const base = process.env.NEXT_PUBLIC_SUPABASE_URL!.replace(/\/$/, '')
        const res = await fetch(
          `${base}/rest/v1/reports?select=*&submission_id=eq.${submissionId}&limit=1`,
          {
            headers: {
              apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
              Accept: 'application/json',
            },
          }
        )
        if (res.status === 406) {
          setDbError('Database table missing or RLS blocking reads. Run the SQL setup.')
          setStatus('db_error')
          if (intervalRef.current) clearInterval(intervalRef.current)
          return
        }
        if (!res.ok) { setDbError(`HTTP ${res.status}`); return }
        const data: Report[] = await res.json()
        if (data && data.length > 0) {
          setReport(data[0])
          setStatus('ready')
          if (intervalRef.current) clearInterval(intervalRef.current)
          return
        }
        if (attempts >= 72) { // 6 minutes
          setStatus('error')
          if (intervalRef.current) clearInterval(intervalRef.current)
        }
      } catch (e) { console.error(e) }
    }
    poll()
    intervalRef.current = setInterval(poll, 5000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [submissionId])

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const printPDF = () => window.print()

  const vc = {
    GO:      { color: '#22c55e', bg: 'rgba(34,197,94,0.1)',  border: 'rgba(34,197,94,0.25)',  emoji: '✅', label: 'Strong Opportunity' },
    CAUTION: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)', emoji: '⚠️', label: 'Proceed Carefully' },
    NO:      { color: '#ef4444', bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.25)',  emoji: '❌', label: 'High Risk — Do Not Proceed' },
  }
  const sc = (s: number) => s >= 70 ? '#22c55e' : s >= 50 ? '#f59e0b' : '#ef4444'

  // ── LOADING ──────────────────────────────────────────────────
  if (status === 'waiting') {
    const agents = ['🔍 Scanning Competition', '🏠 Benchmarking Rent', '📈 Measuring Demand', '💰 Computing Costs', '📊 Projecting Profit', '🧠 Generating Report']
    const activeAgent = Math.min(Math.floor(pollCount / 3), agents.length - 1)
    return (
      <div style={S.page}>
        <div style={S.loadWrap}>
          <div style={S.loadCard}>
            <div style={{ fontSize: 48, marginBottom: 24 }}>📍</div>
            <h1 style={S.loadH1}>Analysing Your Location</h1>
            <p style={S.loadP}>AI agents are running your full feasibility report</p>

            <div style={{ margin: '28px 0' }}>
              {agents.map((a, i) => (
                <div key={a} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 0',
                  opacity: i <= activeAgent ? 1 : 0.3,
                  transition: 'opacity 0.4s',
                }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%',
                    background: i < activeAgent ? '#22c55e' : i === activeAgent ? '#6366f1' : 'rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, flexShrink: 0,
                    transition: 'background 0.3s',
                  }}>
                    {i < activeAgent ? '✓' : i === activeAgent ? '●' : ''}
                  </div>
                  <span style={{ fontSize: 13, color: i <= activeAgent ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.3)' }}>{a}</span>
                </div>
              ))}
            </div>

            <div style={S.progWrap}>
              <div style={{ ...S.progFill, width: `${Math.min((pollCount / 72) * 100, 95)}%` }} />
            </div>
            <p style={S.loadMeta}>Usually ready in 60–90 seconds · Check {pollCount}</p>
          </div>
        </div>
      </div>
    )
  }

  // ── ERROR STATES ─────────────────────────────────────────────
  if (status === 'db_error') return (
    <div style={S.page}>
      <div style={S.loadWrap}>
        <div style={S.loadCard}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
          <h1 style={{ ...S.loadH1, color: '#ef4444' }}>Setup Required</h1>
          <p style={{ ...S.loadP, color: 'rgba(255,255,255,0.5)' }}>{dbError}</p>
          <button onClick={() => window.location.reload()} style={S.btn}>🔄 Refresh</button>
        </div>
      </div>
    </div>
  )

  if (status === 'error') return (
    <div style={S.page}>
      <div style={S.loadWrap}>
        <div style={S.loadCard}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>⏱️</div>
          <h1 style={{ ...S.loadH1, color: '#f59e0b' }}>Still Processing</h1>
          <p style={S.loadP}>n8n may still be running. Check that your workflow is Active.</p>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: '12px 0' }}>{submissionId}</p>
          <button onClick={() => { setPollCount(0); setStatus('waiting') }} style={S.btn}>🔄 Keep Waiting</button>
        </div>
      </div>
    </div>
  )

  if (!report) return null
  const v = vc[report.verdict] || vc['CAUTION']

  // ── FULL REPORT ───────────────────────────────────────────────
  return (
    <div style={S.page}>
      {/* Print styles injected via style tag */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ── HEADER ── */}
      <div style={S.header} className="no-print">
        <div style={S.logo}>📍 Locatalyze</div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{
            background: tier === 'investor' ? 'linear-gradient(135deg,#f59e0b,#ef4444)' : tier === 'pro' ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'rgba(255,255,255,0.08)',
            color: '#fff', borderRadius: 8, padding: '4px 12px', fontSize: 12, fontWeight: 700,
          }}>
            {tier === 'investor' ? '💎 Investor' : tier === 'pro' ? '⭐ Pro' : '🆓 Free'}
          </div>
          <button onClick={copyShareLink} style={{ ...S.iconBtn }} className="no-print">
            {copied ? '✅ Copied!' : '🔗 Share'}
          </button>
          <button onClick={printPDF} style={{ ...S.iconBtn, background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)' }} className="no-print">
            📄 Download PDF
          </button>
        </div>
      </div>

      <div style={S.wrap}>

        {/* ── HERO ── */}
        <div style={{ animation: 'fadeUp 0.6s ease both' }}>
          <div style={{ ...S.verdictBadge, background: v.bg, border: `1px solid ${v.border}`, color: v.color }}>
            {v.emoji} {report.verdict} — {v.label}
          </div>
          <div style={S.heroRow}>
            <div style={{ flex: 1, minWidth: 280 }}>
              <h1 style={S.heroTitle}>Location Analysis<br />Report</h1>
              <p style={S.heroSub}>{report.recommendation}</p>

              {/* Tier label */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const, marginTop: 16 }}>
                {['Free', 'Pro', 'Investor Pack'].map((t, i) => {
                  const tiers = ['free', 'pro', 'investor']
                  const active = tiers[i] === tier
                  const unlocked = tiers.indexOf(tier) >= i
                  return (
                    <div key={t} style={{
                      padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                      background: active ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
                      border: active ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(255,255,255,0.08)',
                      color: unlocked ? '#fff' : 'rgba(255,255,255,0.3)',
                    }}>
                      {unlocked ? '' : '🔒 '}{t}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Big score */}
            <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 8 }}>
              <ScoreCircle score={report.overall_score} size={180} stroke={13} color={v.color} />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Overall Score</span>
            </div>
          </div>
        </div>

        {/* ── BREAK-EVEN STATS ── */}
        <div style={{ ...S.statRow, animation: 'fadeUp 0.6s ease 0.1s both' }}>
          {[
            { label: 'Monthly Break-even', val: `$${(report.breakeven_monthly || 0).toLocaleString()}`, icon: '💰' },
            { label: 'Customers/Day Needed', val: String(report.breakeven_daily || '—'), icon: '👥' },
            { label: 'Months to Profit', val: `${report.breakeven_months || '—'} mo`, icon: '📅' },
          ].map(({ label, val, icon }) => (
            <div key={label} style={S.statBox}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>{val}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 4, textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* ── SCORE BREAKDOWN ── */}
        <div style={{ ...S.twoCol, animation: 'fadeUp 0.6s ease 0.2s both' }}>
          {/* Progress bars */}
          <Card icon="📊" title="Score Breakdown">
            <ScoreBar label="Competition" score={report.score_competition || 0} color={sc(report.score_competition || 0)} icon="🏪" />
            <ScoreBar label="Rent Value"  score={report.score_rent || 0}         color={sc(report.score_rent || 0)}         icon="🏠" />
            <ScoreBar label="Market Demand" score={report.score_demand || 0}     color={sc(report.score_demand || 0)}       icon="📈" />
            <ScoreBar label="Cost Efficiency" score={report.score_cost || 0}     color={sc(report.score_cost || 0)}         icon="💰" />
            <ScoreBar label="Profitability" score={report.score_profitability||0} color={sc(report.score_profitability||0)}  icon="📊" />
          </Card>

          {/* Mini score circles */}
          <Card icon="🎯" title="Sub-Scores">
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 16, justifyContent: 'center', padding: '8px 0' }}>
              {[
                { label: 'Competition', score: report.score_competition },
                { label: 'Rent', score: report.score_rent },
                { label: 'Demand', score: report.score_demand },
                { label: 'Costs', score: report.score_cost },
                { label: 'Profit', score: report.score_profitability },
              ].map(({ label, score }) => (
                <ScoreCircle key={label} score={score || 0} size={88} stroke={7} color={sc(score || 0)} label={label} />
              ))}
            </div>
          </Card>
        </div>

        {/* ── ANALYSIS SECTIONS (FREE) ── */}
        <div style={{ animation: 'fadeUp 0.6s ease 0.3s both' }}>
          <div style={S.sectionLabel}>Detailed Analysis</div>
          <div style={S.twoCol}>
            <Card icon="🏪" title="Competition Analysis" accent={sc(report.score_competition || 0)}>
              <p style={S.cardText}>{report.competitor_analysis}</p>
            </Card>
            <Card icon="🏠" title="Rent & Location" accent={sc(report.score_rent || 0)}>
              <p style={S.cardText}>{report.rent_analysis}</p>
            </Card>
            <Card icon="📈" title="Market Demand" accent={sc(report.score_demand || 0)}>
              <p style={S.cardText}>{report.market_demand}</p>
            </Card>
            <Card icon="💰" title="Cost Analysis" accent={sc(report.score_cost || 0)}>
              <p style={S.cardText}>{report.cost_analysis}</p>
            </Card>
          </div>
          <Card icon="📊" title="Profitability" accent={sc(report.score_profitability || 0)}>
            <p style={S.cardText}>{report.profitability}</p>
          </Card>
        </div>

        {/* ── PRO FEATURES ── */}
        <div style={{ animation: 'fadeUp 0.6s ease 0.4s both' }}>
          <div style={S.sectionLabel}>⭐ Pro Analysis</div>
          <TierGate tier={tier} requiredTier="pro">
            <Card icon="💹" title="P&L Summary">
              <p style={S.cardText}>{report.pl_summary}</p>
            </Card>
          </TierGate>
        </div>

        {/* ── INVESTOR FEATURES ── */}
        <div style={{ animation: 'fadeUp 0.6s ease 0.5s both' }}>
          <div style={S.sectionLabel}>💎 Investor Pack</div>
          <TierGate tier={tier} requiredTier="investor">
            <Card icon="📅" title="3-Year Financial Projection">
              <p style={S.cardText}>{report.three_year_projection}</p>
            </Card>
            <Card icon="⚡" title="Sensitivity Analysis">
              <p style={S.cardText}>{report.sensitivity_analysis}</p>
            </Card>
            <Card icon="🔲" title="SWOT Analysis">
              <pre style={{ ...S.cardText, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{report.swot_analysis}</pre>
            </Card>
          </TierGate>
        </div>

        {/* ── FULL REPORT ── */}
        <div style={{ animation: 'fadeUp 0.6s ease 0.6s both' }}>
          <div style={S.sectionLabel}>Full Report</div>
          <Card icon="📄" title="Complete Analysis">
            <pre style={{ fontSize: 13, lineHeight: 1.8, color: 'rgba(255,255,255,0.65)', whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: 0 }}>
              {report.full_report_markdown}
            </pre>
          </Card>
        </div>

        <div style={{ textAlign: 'center' as const, fontSize: 12, color: 'rgba(255,255,255,0.2)', marginTop: 48, paddingBottom: 40 }}>
          Generated by Locatalyze AI · {new Date(report.created_at).toLocaleString('en-AU')}
          {report.share_token && <> · Share token: {report.share_token}</>}
        </div>
      </div>
    </div>
  )
}

// ─── STYLES ───────────────────────────────────────────────────
const S: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#07090f',
    backgroundImage: 'radial-gradient(ellipse 100% 40% at 50% 0%, rgba(79,70,229,0.12) 0%, transparent 70%)',
    fontFamily: '"DM Sans", "Segoe UI", system-ui, sans-serif',
    color: '#fff',
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '18px 40px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    background: 'rgba(7,9,15,0.85)',
    backdropFilter: 'blur(16px)',
    position: 'sticky' as const, top: 0, zIndex: 50,
  },
  logo: { fontSize: 18, fontWeight: 800, fontFamily: '"Syne", sans-serif', letterSpacing: '-0.02em' },
  iconBtn: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff', borderRadius: 8, padding: '7px 14px',
    fontSize: 13, fontWeight: 600, cursor: 'pointer',
  },
  wrap: { maxWidth: 1080, margin: '0 auto', padding: '48px 28px 80px' },
  verdictBadge: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '8px 18px', borderRadius: 100,
    fontSize: 14, fontWeight: 700, letterSpacing: '0.02em',
    marginBottom: 24,
  },
  heroRow: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 40, flexWrap: 'wrap' as const, marginBottom: 40 },
  heroTitle: { fontSize: 44, fontWeight: 800, fontFamily: '"Syne", sans-serif', letterSpacing: '-0.03em', margin: '0 0 14px', lineHeight: 1.1 },
  heroSub: { fontSize: 16, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, maxWidth: 480, margin: 0 },
  statRow: { display: 'flex', gap: 16, marginBottom: 40, flexWrap: 'wrap' as const },
  statBox: {
    flex: 1, minWidth: 160,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 16, padding: '20px 22px',
  },
  twoCol: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16, marginBottom: 16 },
  sectionLabel: { fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.25)', marginBottom: 16, marginTop: 16 },
  cardText: { fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, margin: 0 },
  btn: { background: '#6366f1', color: '#fff', border: 'none', borderRadius: 10, padding: '11px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 20 },
  loadWrap: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 24 },
  loadCard: {
    maxWidth: 460, width: '100%',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 24, padding: '48px 40px', textAlign: 'center' as const,
  },
  loadH1: { fontSize: 26, fontWeight: 800, fontFamily: '"Syne", sans-serif', margin: '0 0 10px', color: '#fff' },
  loadP: { fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, margin: '0 0 24px' },
  loadMeta: { fontSize: 12, color: 'rgba(255,255,255,0.25)', margin: '12px 0 0' },
  progWrap: { height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 100, overflow: 'hidden' },
  progFill: { height: '100%', background: 'linear-gradient(90deg, #6366f1, #a855f7)', borderRadius: 100, transition: 'width 0.5s ease' },
}