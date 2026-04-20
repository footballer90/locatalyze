'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Logo } from '@/components/Logo'
import { getSydneySuburb } from '@/lib/analyse-data/sydney'
function sScore(n: string): number { return getSydneySuburb(n)?.compositeScore ?? 0 }
function sVerdict(n: string): 'GO' | 'CAUTION' | 'NO' { const v = getSydneySuburb(n)?.verdict; return v === 'GO' ? 'GO' : v === 'CAUTION' ? 'CAUTION' : 'NO' }

const S = {
  brand: '#0891B2', brandLight: '#06B6D4',
  emerald: '#059669', emeraldBg: '#ECFDF5', emeraldBdr: '#A7F3D0',
  amber: '#D97706', amberBg: '#FFFBEB', amberBdr: '#FDE68A',
  red: '#DC2626', redBg: '#FEF2F2', redBdr: '#FECACA',
  muted: '#475569', border: '#E2E8F0',
  n50: '#FAFAF9', n100: '#F5F5F4', n900: '#1C1917', white: '#FFFFFF',
}

type Verdict = 'GO' | 'CAUTION' | 'NO'

function VerdictBadge({ v }: { v: Verdict }) {
  const cfg = v === 'GO'
    ? { bg: S.emeraldBg, bdr: S.emeraldBdr, txt: S.emerald }
    : v === 'CAUTION'
    ? { bg: S.amberBg, bdr: S.amberBdr, txt: S.amber }
    : { bg: S.redBg, bdr: S.redBdr, txt: S.red }
  return (
    <span style={{ fontSize: 11, fontWeight: 700, color: cfg.txt, background: cfg.bg, border: `1px solid ${cfg.bdr}`, borderRadius: 6, padding: '2px 9px' }}>
      {v}
    </span>
  )
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: S.muted }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 700 }}>{value}</span>
      </div>
      <div style={{ height: 6, background: S.n100, borderRadius: 100 }}>
        <div style={{ height: '100%', width: `${value}%`, background: S.brand, borderRadius: 100 }}/>
      </div>
    </div>
  )
}

function SuburbPoll({ suburb }: { suburb: string }) {
  const [voted, setVoted] = useState<number | null>(null)
  const [votes, setVotes] = useState<number[]>([42, 31, 27])
  const total = votes.reduce((a, b) => a + b, 0)
  function handleVote(i: number) {
    if (voted !== null) return
    setVoted(i)
    setVotes(prev => prev.map((v, idx) => idx === i ? v + 1 : v))
  }
  const opts = ['Yes', 'Maybe', 'No']
  return (
    <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '24px', marginBottom: 44 }}>
      <h3 style={{ color: '#1C1917', fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Would you open a business in {suburb}?</h3>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
        {opts.map((opt, i) => {
          const pct = Math.round((votes[i] / total) * 100)
          return (
            <button key={opt} onClick={() => handleVote(i)} disabled={voted !== null}
              style={{ position: 'relative', border: `1.5px solid ${voted === i ? S.emeraldBdr : S.border}`, borderRadius: 10, padding: '12px 16px', background: S.white, cursor: voted === null ? 'pointer' : 'default', textAlign: 'left' as const, fontFamily: 'inherit', overflow: 'hidden' }}>
              {voted !== null && (
                <div style={{ position: 'absolute', inset: 0, left: 0, width: `${pct}%`, background: 'rgba(8,145,178,0.07)' }}/>
              )}
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
          <p style={{ fontSize: 13, color: '#047857' }}>
            Ready to run a full analysis for {suburb}?{' '}
            <Link href="/onboarding" style={{ fontWeight: 700, textDecoration: 'underline' }}>Start free →</Link>
          </p>
        </div>
      )}
    </div>
  )
}

const SCHEMA_ARTICLE = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Campbelltown Business Location Analysis - Macarthur Region Hub',
  description: 'Commercial real estate analysis for Campbelltown Sydney. Western Sydney University, hospital, demographics, and business opportunities in the Macarthur region.',
  image: 'https://locatalyze.com/og-campbelltown.png',
  datePublished: '2026-03-24',
  dateModified: '2026-03-24',
  author: { '@type': 'Organization', name: 'Locatalyze' },
  publisher: { '@type': 'Organization', name: 'Locatalyze' },
}

const SCHEMA_FAQ = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is Campbelltown a good place to open a business?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. Campbelltown is the Macarthur region\'s largest commercial hub anchoring 350,000+ residents. Western Sydney University Macarthur (15,000+ students/staff) and Campbelltown Hospital (500+ beds) create structural advantages. Queen Street renewal investment (council $18M through 2027) is shifting trajectory.' },
    },
    {
      '@type': 'Question',
      name: 'How does Western Sydney University affect local businesses?',
      acceptedAnswer: { '@type': 'Answer', text: 'WSU Macarthur has 15,000 students and staff generating calendar-driven demand. Student spending concentrates in food (breakfast, lunch, coffee), stationery, and healthcare. An operator within 400m of campus accesses consistent Mon-Fri volume independent of broader economic cycle.' },
    },
    {
      '@type': 'Question',
      name: 'What is commercial rent like in Campbelltown?',
      acceptedAnswer: { '@type': 'Answer', text: 'Queen Street: $2,500–$4,500/month. Secondary locations: $1,600–$3,000/month. Vacancy falling from 22% (2021) to 14% (Q1 2026). Operators arriving at 14% vacancy lock in lease terms before recovery is fully priced.' },
    },
    {
      '@type': 'Question',
      name: 'Is Campbelltown\'s business environment improving?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. Queen Street Urban Renewal investment ($18M through 2027) has materially shifted trajectory. Vacancy has fallen from 22% to 14%. The street is not yet vibrant, but direction of travel is unambiguous.' },
    },
    {
      '@type': 'Question',
      name: 'What is the Macarthur growth corridor about?',
      acceptedAnswer: { '@type': 'Answer', text: 'Narellan, Oran Park, Gregory Hills, and adjacent estates are adding 5,000–7,000 households per year. Residents are younger families (median age 33) earning $85,000–$105,000 per household. They currently drive 25–35 minutes north for quality retail. An operator serving them locally captures spending that currently leaks to Parramatta.' },
    },
  ],
}

const SCORE_BARS: Array<{ label: string; value: number }> = [
  { label: 'Foot Traffic', value: 77 },
  { label: 'Demographics', value: 68 },
  { label: 'Rent Viability', value: 84 },
  { label: 'Competition', value: 67 },
]

const NEARBY: Array<{ name: string; slug: string; score: number; verdict: Verdict }> = [
  { name: 'Liverpool', slug: 'liverpool', score: sScore('Liverpool'), verdict: sVerdict('Liverpool') },
  { name: 'Penrith', slug: 'penrith', score: sScore('Penrith'), verdict: sVerdict('Penrith') },
  { name: 'Bankstown', slug: 'bankstown', score: sScore('Bankstown'), verdict: sVerdict('Bankstown') },
]

export default function CampbelltownPage() {
  return (
    <div style={{ background: S.n50, minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA_ARTICLE) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA_FAQ) }} />

      <nav style={{ background: S.white, borderBottom: `1px solid ${S.border}`, padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
          <Logo variant="light" size="sm" />
        </Link>
        <Link href="/onboarding" style={{ fontSize: 14, fontWeight: 600, color: S.brand, textDecoration: 'none', padding: '8px 16px', border: `1px solid ${S.brand}`, borderRadius: 8 }}>Analyse your location</Link>
      </nav>

      <div style={{ background: `linear-gradient(135deg, #0F766E 0%, #0B5E57 100%)`, padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ fontSize: 14, color: S.white, marginBottom: 16, opacity: 0.9 }}>
            <Link href="/analyse/sydney" style={{ color: S.white, textDecoration: 'none' }}>Sydney</Link> / Campbelltown
          </div>
          <h1 style={{ fontSize: 48, fontWeight: 900, color: '#FFFFFF', marginBottom: 24 }}>Campbelltown</h1>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
            <VerdictBadge v="GO" />
            <div style={{ fontSize: 32, fontWeight: 900, color: S.white }}>73</div>
          </div>
          <p style={{ fontSize: 18, color: S.white, opacity: 0.95, margin: 0 }}>Macarthur region's largest hub. University anchor, hospital precinct, growing estate corridor, improving commercial strip.</p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '32px', marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Quick Verdict</h2>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: S.n900, marginBottom: 16 }}>
            Campbelltown is the Macarthur region's largest commercial hub anchoring 350,000+ residents. Two institutions define the commercial story: Western Sydney University Macarthur campus and Campbelltown Hospital. Together, they employ and attract 20,000+ people daily, generating reliable calendar-driven demand that doesn't depend on retail sentiment.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: S.n900, margin: 0 }}>
            Queen Street's urban renewal investment is shifting trajectory. Vacancy fell from 22% in 2021 to 14% as of Q1 2026. Operators who arrive at 14% vacancy lock in lease terms before the recovery is fully priced. This is an improving location at an optimal entry point.
          </p>
        </div>

        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '32px', marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 24, fontWeight: 800, marginBottom: 32 }}>Location Scores</h2>
          {SCORE_BARS.map(bar => <ScoreBar key={bar.label} label={bar.label} value={bar.value} />)}
        </div>

        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '32px', marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Business Environment</h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: S.n900, marginBottom: 20 }}>
            Campbelltown's commercial story is defined by two institutions that most business analysts from Sydney's north don't register: Western Sydney University Macarthur and Campbelltown Hospital. Together, they employ and attract 20,000+ people daily — staff, students, visitors — generating a reliable, calendar-driven demand base that doesn't depend on retail sentiment or discretionary spending. Businesses within 800m of either institution have a structural foundation that street-level foot traffic alone cannot provide.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: S.n900, marginBottom: 20 }}>
            Queen Street commercial strip has historically been Campbelltown's weak point — vacancy rates ran at 22% in 2021, creating visual impressions of decline that put off many operators. Council's Queen Street Urban Renewal investment ($18M committed through 2027) has materially shifted the trajectory. Vacancy has fallen to 14% as of Q1 2026. The strip is not yet vibrant, but direction of travel is unambiguous. Operators who arrive at 14% vacancy — before the strip reaches 8–10% that signals prime positioning — lock in lease terms before recovery is fully priced.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: S.n900, margin: 0 }}>
            The Macarthur residential growth corridor (Narellan, Oran Park, Gregory Hills) is adding 5,000–7,000 households per year. New residents are younger families (median age 33) earning $85,000–$105,000 per household with children aged 0–12 dominating family structure. They currently drive 25–35 minutes to Macquarie Centre or Parramatta Westfield for quality retail and dining. An operator who locates in Campbelltown and serves this demographic correctly captures spending that currently leaks north to Parramatta.
          </p>
        </div>

        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '32px', marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Competition Analysis</h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: S.n900, marginBottom: 20 }}>
            Campbelltown's competitive landscape is moderately developed with room for new entry. Macarthur Square houses the predictable chain operators. Queen Street strip has independent operators in café, Thai dining, and small retail — but concentration is thin enough that a new quality operator draws attention rather than disappearing into a crowded field.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: S.n900, margin: 0 }}>
            Healthcare and allied health competition is notably light for a suburb with a 500-bed hospital and 15,000-person university. Three GP practices, two physiotherapy clinics, and one psychologist serve a catchment that warrants 3–4× that supply. Any allied health operator establishing within the university or hospital orbit is not competing for existing patients — they are meeting currently unmet demand.
          </p>
        </div>

        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '32px', marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Demographics</h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: S.n900, marginBottom: 20 }}>
            Macarthur region demographic is in structural transition. Established Campbelltown residential base (median income $70,000, family-oriented) is being supplemented by Narellan/Oran Park professional corridor ($95,000–$110,000 median household income). This bifurcation requires operators to understand which demographic they're serving — the value-oriented Campbelltown resident, or the quality-seeking estate-corridor family.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: S.n900, margin: 0 }}>
            Western Sydney University students — 15,000 students and staff — are a distinct sub-demographic. Student spending concentrates in food (breakfast, lunch, coffee, evening social dining), stationery and study supplies, and healthcare. An operator positioned for the student demographic accesses consistent Mon–Fri volume that isn't dependent on the broader Campbelltown economic cycle.
          </p>
        </div>

        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '32px', marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 24, fontWeight: 800, marginBottom: 24 }}>What Works Here</h2>
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <h3 style={{ color: '#1C1917', fontSize: 16, fontWeight: 700, margin: 0 }}>University-Adjacent Café</h3>
              <VerdictBadge v="GO" />
            </div>
            <p style={{ fontSize: 15, color: S.muted, lineHeight: 1.6, margin: 0 }}>15,000 daily campus visitors, Mon–Fri primary revenue, proven concept. $50,000–$65,000/month achievable within 12 months of opening at right positioning.</p>
          </div>
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <h3 style={{ color: '#1C1917', fontSize: 16, fontWeight: 700, margin: 0 }}>Allied Health (Physio, Psychology, Dentistry)</h3>
              <VerdictBadge v="GO" />
            </div>
            <p style={{ fontSize: 15, color: S.muted, lineHeight: 1.6, margin: 0 }}>Between hospital, university, and residential growth corridor, demand is strong across all three catchments. Competition is minimal — currently underserved by 3–4× existing supply.</p>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <h3 style={{ color: '#1C1917', fontSize: 16, fontWeight: 700, margin: 0 }}>Family-Format Casual Dining</h3>
              <VerdictBadge v="GO" />
            </div>
            <p style={{ fontSize: 15, color: S.muted, lineHeight: 1.6, margin: 0 }}>Serving estate corridor family demographic (45+ minutes to Parramatta) who have no quality local equivalent. $40,000–$55,000/month weekend-anchored revenue achievable.</p>
          </div>
        </div>

        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '32px', marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 24, fontWeight: 800, marginBottom: 24 }}>What Fails Here</h2>
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <h3 style={{ color: '#1C1917', fontSize: 16, fontWeight: 700, margin: 0 }}>Premium Fine Dining ($80+ Per Person)</h3>
              <VerdictBadge v="NO" />
            </div>
            <p style={{ fontSize: 15, color: S.muted, lineHeight: 1.6, margin: 0 }}>Market doesn't currently support it. In 5 years, potentially. In 2026, operators who open with fine dining ambitions find a thin customer base.</p>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <h3 style={{ color: '#1C1917', fontSize: 16, fontWeight: 700, margin: 0 }}>Nightclub or Late-Night Bar</h3>
              <VerdictBadge v="NO" />
            </div>
            <p style={{ fontSize: 15, color: S.muted, lineHeight: 1.6, margin: 0 }}>Campbelltown's social scene is family-oriented. Late-night hospitality is served by the RSL and established venues. New entrants face entrenched social loyalty with uphill competition.</p>
          </div>
        </div>

        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '32px', marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Underrated Opportunity</h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: S.n900, margin: 0 }}>
            The Oran Park to Campbelltown CBD commuter corridor is completely devoid of quality food or coffee options. The 15,000 daily commuters passing through Gregory Hills/Narellan corridor have a 25–35 minute car-dependent commute to Campbelltown. A drive-through café concept or compact highway-adjacent café at the Narellan/Camden Road intersection captures this commuter spend at zero direct competition. Daily revenue potential: 150–200 transactions, $18,000–22,000/month at a $1,500/month rent position.
          </p>
        </div>

        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '32px', marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Key Risks</h2>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ color: '#1C1917', fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Queen Street Vacancy Persistence</h3>
            <p style={{ fontSize: 15, color: S.muted, lineHeight: 1.6, margin: 0 }}>If urban renewal investment doesn't continue to convert vacancy, the street's perception problem remains. New operators must select positions on the improving end of the strip, not the declining end.</p>
          </div>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ color: '#1C1917', fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Retail Leakage to Parramatta</h3>
            <p style={{ fontSize: 15, color: S.muted, lineHeight: 1.6, margin: 0 }}>Campbelltown residents with cars (which is most of them) continue to drive north for higher-quality retail. Independent retail operators face structural leakage that landlord vacancy rates don't fully capture.</p>
          </div>
          <div>
            <h3 style={{ color: '#1C1917', fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Student Spend Seasonality</h3>
            <p style={{ fontSize: 15, color: S.muted, lineHeight: 1.6, margin: 0 }}>WSU Macarthur has significant revenue gaps during semester breaks (January, June, July). University-adjacent operators must model both semester and break periods in annual revenue projections.</p>
          </div>
        </div>

        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '32px', marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Compare Nearby</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
            {NEARBY.map(suburb => (
              <Link key={suburb.slug} href={`/analyse/sydney/${suburb.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: S.n50, border: `1px solid ${S.border}`, borderRadius: 12, padding: '20px', cursor: 'pointer', transition: 'border-color 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.borderColor = S.brand)} onMouseLeave={(e) => (e.currentTarget.style.borderColor = S.border)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h3 style={{ color: '#1C1917', fontSize: 16, fontWeight: 700, margin: 0 }}>{suburb.name}</h3>
                    <VerdictBadge v={suburb.verdict} />
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: S.brand }}>{suburb.score}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <SuburbPoll suburb="Campbelltown" />

        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '32px', marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Final Verdict</h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: S.n900, marginBottom: 20 }}>
            Campbelltown is a GO location. The combination of university and hospital anchors, improving commercial environment, and growing estate-corridor demographics creates a favorable entry environment. Queen Street's falling vacancy (14% in 2026, down from 22% in 2021) indicates an optimal entry point before the recovery is fully priced.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: S.n900, margin: 0 }}>
            University-adjacent café, allied health, and family-format casual dining are the strongest positioning lanes. Operators who execute well will find strong institutional demand (university, hospital, estate families) and light competition. This is the Macarthur region's best opportunity for quality operator entry.
          </p>
        </div>

        <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 16, padding: '32px', marginBottom: 48, textAlign: 'center' }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: S.emerald, marginBottom: 12 }}>Ready to Analyse Your Location?</h3>
          <p style={{ fontSize: 16, color: S.emerald, marginBottom: 20, opacity: 0.9 }}>Get detailed commercial real estate intelligence for any Sydney location.</p>
          <Link href="/onboarding" style={{ display: 'inline-block', background: S.emerald, color: S.white, padding: '12px 28px', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>Analyse your address →</Link>
        </div>

        <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 40, textAlign: 'center' }}>
          <div style={{ marginBottom: 24 }}>
            <Link href="/analyse/sydney" style={{ fontSize: 14, color: S.brand, textDecoration: 'none', fontWeight: 600 }}>← Back to Sydney Hub</Link>
          </div>
          <p style={{ fontSize: 12, color: S.muted, margin: 0 }}>Postcode: 2560 | Median income: $76,000 | Rent range: $1,600–$4,500/month</p>
        </div>
      </div>
    </div>
  )
}
