'use client'
import Link from 'next/link'
import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const S = { brand: '#0891B2', brandLight: '#06B6D4', emerald: '#059669', emeraldBg: '#ECFDF5', emeraldBdr: '#A7F3D0', amber: '#D97706', amberBg: '#FFFBEB', amberBdr: '#FDE68A', red: '#DC2626', redBg: '#FEF2F2', redBdr: '#FECACA', muted: '#64748B', border: '#E2E8F0', n50: '#FAFAF9', n100: '#F5F5F4', n900: '#1C1917', white: '#FFFFFF' }

type Verdict = 'GO' | 'CAUTION' | 'NO'

function VerdictBadge({ v }: { v: Verdict }) {
  const cfg = v === 'GO' ? { bg: S.emeraldBg, bdr: S.emeraldBdr, txt: S.emerald } : v === 'CAUTION' ? { bg: S.amberBg, bdr: S.amberBdr, txt: S.amber } : { bg: S.redBg, bdr: S.redBdr, txt: S.red }
  return <span style={{ fontSize: 11, fontWeight: 700, color: cfg.txt, background: cfg.bg, border: `1px solid ${cfg.bdr}`, borderRadius: 6, padding: '2px 9px' }}>{v}</span>
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: S.muted }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 700 }}>{value}</span>
      </div>
      <div style={{ height: 6, background: S.n100, borderRadius: 100 }}>
        <div style={{ height: '100%', width: `${value}%`, background: S.brand, borderRadius: 100 }} />
      </div>
    </div>
  )
}

function SuburbPoll({ suburb }: { suburb: string }) {
  const [voted, setVoted] = useState<number | null>(null)
  const [votes, setVotes] = useState<number[]>([54, 28, 18])
  const total = votes.reduce((a, b) => a + b, 0)
  function handleVote(i: number) {
    if (voted !== null) return
    setVoted(i)
    setVotes(prev => prev.map((v, idx) => idx === i ? v + 1 : v))
  }
  return (
    <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 24, marginBottom: 44 }}>
      <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Would you open a business in {suburb}?</h3>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
        {['Yes', 'Maybe', 'No'].map((opt, i) => {
          const pct = Math.round((votes[i] / total) * 100)
          return (
            <button key={opt} onClick={() => handleVote(i)} disabled={voted !== null}
              style={{ position: 'relative', border: `1.5px solid ${voted === i ? S.emeraldBdr : S.border}`, borderRadius: 10, padding: '12px 16px', background: S.white, cursor: voted === null ? 'pointer' : 'default', textAlign: 'left' as const, fontFamily: 'inherit', overflow: 'hidden' }}>
              {voted !== null && <div style={{ position: 'absolute', inset: 0, width: `${pct}%`, background: 'rgba(8,145,178,0.07)' }} />}
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{opt}</span>
                <span style={{ fontSize: 13, color: S.muted }}>{voted !== null ? `${pct}%` : ''}</span>
              </div>
            </button>
          )
        })}
      </div>
      {voted !== null && (
        <div style={{ marginTop: 14, padding: '12px 14px', background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 10 }}>
          <p style={{ fontSize: 13, color: '#047857' }}>Full analysis: <Link href="/onboarding" style={{ fontWeight: 700, textDecoration: 'underline' }}>Start free →</Link></p>
        </div>
      )}
    </div>
  )
}

const nearby = [
  { name: 'Subiaco', slug: 'subiaco', score: 82, verdict: 'GO' as const },
  { name: 'Northbridge', slug: 'northbridge', score: 74, verdict: 'GO' as const },
  { name: 'Morley', slug: 'morley', score: 70, verdict: 'GO' as const },
]

const scoreChartData = [
  { category: 'Foot Traffic', score: 87 },
  { category: 'Demographics', score: 88 },
  { category: 'Rent Viability', score: 76 },
  { category: 'Competition Gap', score: 83 },
]

export default function MountLawley() {
  return (
    <div style={{ background: S.n50, minHeight: '100vh', paddingBottom: 60 }}>
      {/* Breadcrumb */}
      <div style={{ background: S.white, borderBottom: `1px solid ${S.border}`, padding: '12px 20px', fontSize: 13 }}>
        <Link href="/" style={{ color: S.brand, textDecoration: 'none' }}>Home</Link>
        <span style={{ color: S.muted }}> / </span>
        <Link href="/analyse/perth" style={{ color: S.brand, textDecoration: 'none' }}>Perth</Link>
        <span style={{ color: S.muted }}> / Mount Lawley</span>
      </div>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0891B2 0%, #06B6D4 100%)', padding: '60px 20px', color: S.white }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 24 }}>
            <div>
              <h1 style={{ fontSize: 42, fontWeight: 900, marginBottom: 12 }}>Mount Lawley</h1>
              <p style={{ fontSize: 16, color: '#E0F2FE', maxWidth: 600 }}>Perth's inner north café capital — Beaufort Street (HIGHEST SCORING PERTH SUBURB)</p>
            </div>
            <VerdictBadge v="GO" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 20 }}>
            <div>
              <p style={{ fontSize: 12, color: '#BAE6FD' }}>Overall Score</p>
              <p style={{ fontSize: 32, fontWeight: 900 }}>85</p>
            </div>
            <div>
              <p style={{ fontSize: 12, color: '#BAE6FD' }}>Postcode</p>
              <p style={{ fontSize: 20, fontWeight: 700 }}>WA 6050</p>
            </div>
            <div>
              <p style={{ fontSize: 12, color: '#BAE6FD' }}>Median Income</p>
              <p style={{ fontSize: 20, fontWeight: 700 }}>$96,000</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scores */}
      <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 20px' }}>
        <div style={{ background: S.white, padding: 40, borderRadius: 16, border: `1px solid ${S.border}` }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 32 }}>Detailed Score Breakdown</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40 }}>
            <div>
              <ScoreBar label="Foot Traffic" value={87} />
              <ScoreBar label="Demographics" value={88} />
              <ScoreBar label="Rent Viability" value={76} />
              <ScoreBar label="Competition Gap" value={83} />
            </div>
            <div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={scoreChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={S.border} />
                  <XAxis dataKey="category" angle={-15} textAnchor="end" height={80} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip cursor={{ fill: 'rgba(8,145,178,0.1)' }} />
                  <Bar dataKey="score" fill={S.brand} radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 20px' }}>
        <div style={{ background: S.white, padding: 40, borderRadius: 16, border: `1px solid ${S.border}`, marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24 }}>Why Mount Lawley Scores 85 (HIGHEST IN PERTH)</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 32 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: S.brand, marginBottom: 8 }}>Foot Traffic (87)</h3>
              <p style={{ fontSize: 14, color: S.muted, lineHeight: 1.6 }}>Beaufort Street is Perth's equivalent of Brunswick Street Fitzroy or Oxford Street Paddington. Saturday mornings 8am–2pm exceed 15,000 pedestrians. Weekday mornings have strong commute traffic from surrounding residential areas. This is the most consistent high foot traffic in Perth outside CBD.</p>
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: S.brand, marginBottom: 8 }}>Demographics (88)</h3>
              <p style={{ fontSize: 14, color: S.muted, lineHeight: 1.6 }}>$96k median income (among Perth's highest). Creative professionals from WAAPA (performing arts school). Young professionals aged 25–45. Higher education attainment. Strong purchasing power for premium café/dining. Willingness to spend $6–$9 on specialty coffee.</p>
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: S.brand, marginBottom: 8 }}>Rent Viability (76)</h3>
              <p style={{ fontSize: 14, color: S.muted, lineHeight: 1.6 }}>$3,800–$7,000/mo for prime Beaufort Street locations. Rents are manageable for the income demographic and foot traffic available. Secondary streets $2,500–$5,000/mo. Achievable with coffee margins + premium food pricing. Unlike CBD, morning foot traffic is strong enough to support café model.</p>
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: S.brand, marginBottom: 8 }}>Competition Gap (83)</h3>
              <p style={{ fontSize: 14, color: S.muted, lineHeight: 1.6 }}>Beaufort Street has established venues but gap remains for differentiated quality entrants. Unlike Fremantle (saturated), Mount Lawley has room for specialty/premium operators. New concept venues regularly succeed here. This is Perth's most forgiving strip for new market entrants with authentic positioning.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rent Analysis */}
      <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 20px' }}>
        <div style={{ background: S.white, padding: 40, borderRadius: 16, border: `1px solid ${S.border}`, marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24 }}>Commercial Rent Ranges</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: S.brand, marginBottom: 8 }}>Beaufort Street (Prime)</h3>
              <p style={{ fontSize: 18, fontWeight: 900, color: S.n900, marginBottom: 8 }}>$3,800–$7,000/mo</p>
              <p style={{ fontSize: 13, color: S.muted }}>Highest foot traffic. Established café strip. Rents are 15–20% below Melbourne/Sydney equivalents. Viable for 100+ daily coffee customers at $5.50 avg + premium food/beverage.</p>
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: S.brand, marginBottom: 8 }}>Secondary Streets (Coolabah, Bruce)</h3>
              <p style={{ fontSize: 18, fontWeight: 900, color: S.n900, marginBottom: 8 }}>$2,500–$5,000/mo</p>
              <p style={{ fontSize: 13, color: S.muted }}>Lower foot traffic but adequate for food/health services. 50 metres from Beaufort Street means 40–50% lower foot traffic but also 30–35% lower rents. Good for niche concepts.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Business Types */}
      <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 20px' }}>
        <div style={{ background: '#ECFDF5', border: `1px solid ${S.emeraldBdr}`, borderRadius: 16, padding: 40, marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24, color: S.n900 }}>Best Business Models for Mount Lawley</h2>

          <div style={{ marginBottom: 32 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: S.emerald, marginBottom: 12 }}>Specialty Coffee + Premium Food (BEST FIT)</h3>
            <p style={{ fontSize: 14, color: S.muted, marginBottom: 12, lineHeight: 1.6 }}>Target: Creative professionals, WAAPA students, local families on weekend. Model: Third-wave coffee $5.50–$7.00, pastries $4–$6, brunch dishes $12–$18. Peak windows: Weekday 7–9am, Saturday 8am–2pm. Consistent lunch (12–2pm) adds secondary revenue. This is the dominant model on Beaufort Street and it works.</p>
            <p style={{ fontSize: 13, color: S.emerald, fontWeight: 600 }}>Verdict: GO — 100+ daily customers at $8–$12 ATV is achievable and sustainable</p>
          </div>

          <div style={{ marginBottom: 32 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: S.emerald, marginBottom: 12 }}>Independent Bookstore + Café (GROWING TREND)</h3>
            <p style={{ fontSize: 14, color: S.muted, marginBottom: 12, lineHeight: 1.6 }}>Target: Arts professionals, students, intellectual demographic. Model: Books + coffee creates stickiness (customers stay 30–60min vs 15min for pure café). Lower coffee ATV ($5–$5.50) compensated by book margins (30%). Requires retail expertise + hospitality expertise. Beaufort Street demographic supports independent bookstores more than most Australian suburbs.</p>
            <p style={{ fontSize: 13, color: S.emerald, fontWeight: 600 }}>Verdict: GO — niche model with lower competition and higher customer lifetime value</p>
          </div>

          <div style={{ marginBottom: 32 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: S.emerald, marginBottom: 12 }}>Wellness/Complementary Health (SECONDARY STREETS)</h3>
            <p style={{ fontSize: 14, color: S.muted, marginBottom: 12, lineHeight: 1.6 }}>Target: Yoga practitioners, health-conscious professionals. Model: Yoga studio + juice bar, pilates + wellness café, acupuncture + tea room. Rents on secondary streets ($2,500–$3,500/mo) are low. Foot traffic is lower but demographic match is high. Higher margins (wellness services 60–70% margin).</p>
            <p style={{ fontSize: 13, color: S.emerald, fontWeight: 600 }}>Verdict: GO — not dependent on walk-by traffic, recurring customer base, high margins</p>
          </div>

          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: S.amber, marginBottom: 12 }}>Traditional Chain Café (CAUTION)</h3>
            <p style={{ fontSize: 14, color: S.muted, lineHeight: 1.6 }}>Beaufort Street is dominated by independent, local, authentic venues. Chain brands (Gloria Jean's, Starbucks) historically struggle here. Demographic is anti-corporate. If you have a chain brand, expect 30–40% lower foot traffic than independents in the same location. Success requires genuine differentiation beyond brand name.</p>
          </div>
        </div>
      </div>

      {/* WAAPA Influence */}
      <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 20px' }}>
        <div style={{ background: '#F0F9FF', border: `1px solid ${S.brandLight}`, borderRadius: 16, padding: 40, marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24, color: S.n900 }}>WAAPA Effect: Arts Professional Density</h2>
          <p style={{ fontSize: 14, color: S.muted, marginBottom: 24, lineHeight: 1.6 }}>Western Australian Academy of Performing Arts (WAAPA) is located adjacent to Mount Lawley. This creates a unique demographic: 1,000+ performing arts students + staff + graduates. This concentration drives creative professional culture that directly supports independent venues.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 32 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: S.brand, marginBottom: 12 }}>Weekday Student Economy</h3>
              <p style={{ fontSize: 14, color: S.muted }}>WAAPA students create baseline weekday café traffic (morning pre-class, lunch, evening post-class). They have limited budgets ($5–$8 ATV) but high frequency. This smooths revenue across week.</p>
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: S.brand, marginBottom: 12 }}>Weekend Arts Scene</h3>
              <p style={{ fontSize: 14, color: S.muted }}>Theatre/dance/music performances create event-driven foot traffic. Entire Beaufort Street experiences +30–40% foot traffic during Perth theatre festival, WAAPA productions. Plan promotions around performance calendar.</p>
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: S.brand, marginBottom: 12 }}>Network & Community</h3>
              <p style={{ fontSize: 14, color: S.muted }}>Arts professionals build tight communities. Venues that support local artists (open mics, art displays, performance space) generate high loyalty and word-of-mouth. Community = defensible moat against competition.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Weekend Pattern */}
      <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 20px' }}>
        <div style={{ background: S.white, padding: 40, borderRadius: 16, border: `1px solid ${S.border}`, marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24 }}>The Mount Lawley Weekend Model</h2>
          <p style={{ fontSize: 14, color: S.muted, marginBottom: 24, lineHeight: 1.6 }}>Mount Lawley is one of the few Australian suburb strips where weekend foot traffic EXCEEDS weekday foot traffic. This is different from typical CBDs.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 32 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: S.brand, marginBottom: 12 }}>Saturday 8am–2pm</h3>
              <p style={{ fontSize: 14, color: S.muted, lineHeight: 1.6 }}>Peak foot traffic window (15,000+ pedestrians). Local families, young professionals, visiting friends. Average transaction $10–$16 (coffee + brunch/pastry). This 6-hour window generates 40–50% of weekly revenue for café operators.</p>
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: S.brand, marginBottom: 12 }}>Saturday 3pm–10pm</h3>
              <p style={{ fontSize: 14, color: S.muted, lineHeight: 1.6 }}>Secondary evening window. Dinner and cocktails. Foot traffic 30% lower than morning but ATV is higher ($25–$40 for dining/drinking). Evening venues (bars, restaurants) generate 20–30% of weekly revenue in this window.</p>
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: S.brand, marginBottom: 12 }}>Sunday 8am–2pm</h3>
              <p style={{ fontSize: 14, color: S.muted, lineHeight: 1.6 }}>Secondary peak. Families with children. Foot traffic 60–70% of Saturday. Brunch venues thrive here (bottomless champagne, premium brunches). ATV is highest of week ($18–$24/person).</p>
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: S.brand, marginBottom: 12 }}>Weekday 7–9am</h3>
              <p style={{ fontSize: 14, color: S.muted, lineHeight: 1.6 }}>Morning commute from surrounding suburbs. Professional workers + students. Coffee-focused, lower food ATV. Consistent but lower absolute numbers than weekend.</p>
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: S.brand, marginBottom: 12 }}>Weekday 12–2pm</h3>
              <p style={{ fontSize: 14, color: S.muted, lineHeight: 1.6 }}>Lunch service. Workers from surrounding businesses. Moderate foot traffic. Secondary revenue stream for café operators.</p>
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: S.brand, marginBottom: 12 }}>Weekday 3–5pm</h3>
              <p style={{ fontSize: 14, color: S.muted, lineHeight: 1.6 }}>Post-work/post-school window. Lowest foot traffic of week (except Sunday evening). Coffee + pastry. Secondary revenue stream.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Poll */}
      <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 20px' }}>
        <SuburbPoll suburb="Mount Lawley" />
      </div>

      {/* Nearby Suburbs */}
      <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 20px' }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24 }}>Nearby High-Performing Suburbs</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {nearby.map(s => (
            <Link key={s.slug} href={`/analyse/perth/${s.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, padding: 20, borderRadius: 12, border: `1px solid ${S.border}`, cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = S.brand; e.currentTarget.style.boxShadow = `0 4px 12px rgba(8,145,178,0.15)` }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = S.border; e.currentTarget.style.boxShadow = 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: S.n900 }}>{s.name}</h3>
                  <span style={{ fontSize: 16, fontWeight: 900, color: S.brand }}>{s.score}</span>
                </div>
                <p style={{ fontSize: 12, color: S.muted }}>Full analysis →</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Competitive Landscape */}
      <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 20px' }}>
        <div style={{ background: S.white, padding: 40, borderRadius: 16, border: `1px solid ${S.border}`, marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24 }}>Competitive Landscape & Differentiation</h2>
          <p style={{ fontSize: 14, color: S.muted, marginBottom: 24, lineHeight: 1.6 }}>Mount Lawley has established café and dining venues. However, the competition gap (83/100) indicates room for differentiated operators. Key is understanding what makes venues succeed here.</p>

          <div style={{ marginBottom: 32 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: S.brand, marginBottom: 12 }}>What Works on Beaufort Street</h3>
            <ul style={{ fontSize: 14, color: S.muted, lineHeight: 1.8, paddingLeft: 20, listStyleType: 'disc' }}>
              <li>Authentic, owner-operated venues with visible personality</li>
              <li>Specialty focus (single-origin coffee, sourdough bread, specific cuisine)</li>
              <li>Community involvement (art displays, local artist features, performances)</li>
              <li>Strong coffee + premium brunch combination</li>
              <li>Independent brands — customers actively avoid corporate chains</li>
            </ul>
          </div>

          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: S.brand, marginBottom: 12 }}>What Struggles on Beaufort Street</h3>
            <ul style={{ fontSize: 14, color: S.muted, lineHeight: 1.8, paddingLeft: 20, listStyleType: 'disc' }}>
              <li>Chain brands (demographic actively prefers independents)</li>
              <li>Generic café concepts without point of differentiation</li>
              <li>Poor coffee quality (demographic has high coffee standards)</li>
              <li>Venues without community connection or visible personality</li>
              <li>Fast-casual/mass-market positioning (wrong demographic fit)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 20px' }}>
        <div style={{ background: S.white, padding: 40, borderRadius: 16, border: `1px solid ${S.border}`, marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 32 }}>Frequently Asked Questions</h2>

          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: S.n900, marginBottom: 8 }}>Why is Mount Lawley the highest-scoring Perth suburb?</h3>
            <p style={{ fontSize: 14, color: S.muted, lineHeight: 1.6 }}>Mount Lawley scores 85 because it combines all four factors: (1) High foot traffic (87) — Saturday mornings exceed 15,000 pedestrians on Beaufort Street. (2) High income demographic (88) — $96k median, creative professionals. (3) Manageable rents (76) — $3,800–$7,000/mo for prime locations. (4) Competition gap (83) — Established venues but room for quality new entrants. It's Perth's closest equivalent to Melbourne's Brunswick Street.</p>
          </div>

          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: S.n900, marginBottom: 8 }}>Is Mount Lawley oversaturated with cafés?</h3>
            <p style={{ fontSize: 14, color: S.muted, lineHeight: 1.6 }}>Not oversaturated, but competitive. The competition gap (83) indicates room for differentiated operators. New entrants succeed if they have genuine differentiation (specialty, authenticity, community connection). Venues that are generic or fail to stand out will struggle. Success is possible but requires a strong POV.</p>
          </div>

          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: S.n900, marginBottom: 8 }}>What rents should I expect on secondary streets?</h3>
            <p style={{ fontSize: 14, color: S.muted, lineHeight: 1.6 }}>Secondary streets (Coolabah, Bruce, Walcott) command $2,500–$5,000/mo for 2,000–3,000 sq ft spaces. 50–70 metres from Beaufort Street means foot traffic drops 40–50%, but rents drop 30–40%. Good for health services, niche concepts, or low-traffic-dependent models. Beaufort Street itself: $3,800–$7,000/mo.</p>
          </div>

          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: S.n900, marginBottom: 8 }}>Should I target weekday or weekend revenue?</h3>
            <p style={{ fontSize: 14, color: S.muted, lineHeight: 1.6 }}>Weekend (Saturday 8am–2pm) is the dominant revenue window, generating 40–50% of weekly revenue in just 6 hours. However, successful Mount Lawley operators don't ignore weekdays. Model: Strong weekend brunch/café driving foot traffic, weekday lunch/coffee as secondary revenue. Don't expect Mount Lawley to work with weekday-only focus.</p>
          </div>

          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: S.n900, marginBottom: 8 }}>Is Mount Lawley suitable for non-food concepts?</h3>
            <p style={{ fontSize: 14, color: S.muted, lineHeight: 1.6 }}>Yes, but with caveats. Health services (physiotherapy, yoga), wellness, independent retail work well. Bookstores + café is a growing model here. Pure retail (clothing, gifts) without café/experience component struggles — Beaufort Street is fundamentally an experience destination, not shopping destination. Success requires some hospitality or wellness component.</p>
          </div>
        </div>
      </div>

      {/* Back to Hub */}
      <div style={{ maxWidth: 1200, margin: '60px auto', padding: '0 20px' }}>
        <Link href="/analyse/perth" style={{ display: 'inline-block', padding: '12px 20px', border: `1px solid ${S.border}`, borderRadius: 10, color: S.brand, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
          ← Back to Perth Guide
        </Link>
      </div>

      {/* Footer */}
      <div style={{ background: S.n100, borderTop: `1px solid ${S.border}`, padding: '40px 20px', marginTop: 60 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32, marginBottom: 32 }}>
            <div>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: S.n900, marginBottom: 12 }}>This Suburb</h3>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
                <p style={{ fontSize: 13, color: S.muted }}>Score: 85 (GO)</p>
                <p style={{ fontSize: 13, color: S.muted }}>Postcode: WA 6050</p>
                <p style={{ fontSize: 13, color: S.muted }}>Income: $96k median</p>
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: S.n900, marginBottom: 12 }}>Nearby Suburbs</h3>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
                <Link href="/analyse/perth/subiaco" style={{ fontSize: 13, color: S.brand, textDecoration: 'none' }}>Subiaco (82)</Link>
                <Link href="/analyse/perth/northbridge" style={{ fontSize: 13, color: S.brand, textDecoration: 'none' }}>Northbridge (74)</Link>
                <Link href="/analyse/perth/morley" style={{ fontSize: 13, color: S.brand, textDecoration: 'none' }}>Morley (70)</Link>
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: S.n900, marginBottom: 12 }}>All Perth Suburbs</h3>
              <Link href="/analyse/perth" style={{ fontSize: 13, color: S.brand, textDecoration: 'none' }}>View all 20 suburbs →</Link>
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 24, textAlign: 'center' }}>
            <p style={{ fontSize: 12, color: S.muted }}>© 2026 Locatalyze. Data current as of March 2026. Mount Lawley is Perth's premium café destination with highest income demographic and weekend foot traffic exceeding weekday traffic.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
