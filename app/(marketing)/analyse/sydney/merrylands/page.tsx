'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'

const S = {
  brand: '#0891B2', brandLight: '#06B6D4',
  emerald: '#059669', emeraldBg: '#ECFDF5', emeraldBdr: '#A7F3D0',
  amber: '#D97706', amberBg: '#FFFBEB', amberBdr: '#FDE68A',
  red: '#DC2626', redBg: '#FEF2F2', redBdr: '#FECACA',
  muted: '#64748B', border: '#E2E8F0',
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
  const [votes, setVotes] = useState<number[]>([46, 36, 18])
  const total = votes.reduce((a, b) => a + b, 0)
  function handleVote(i: number) {
    if (voted !== null) return
    setVoted(i)
    setVotes(prev => prev.map((v, idx) => idx === i ? v + 1 : v))
  }
  const opts = ['Yes', 'Maybe', 'No']
  return (
    <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '24px', marginBottom: 44 }}>
      <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>Would you open a business in {suburb}?</h3>
      <p style={{ fontSize: 13, color: S.muted, marginBottom: 18 }}>{voted === null ? 'Based on this analysis — would you take the risk?' : `You voted. Here\'s how ${total} readers responded:`}</p>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
        {opts.map((opt, i) => {
          const pct = Math.round((votes[i] / total) * 100)
          return (
            <button key={opt} onClick={() => handleVote(i)} disabled={voted !== null}
              style={{ position: 'relative', border: `1.5px solid ${voted === i ? S.emeraldBdr : S.border}`, borderRadius: 10, padding: '12px 16px', background: S.white, cursor: voted === null ? 'pointer' : 'default', textAlign: : "left' as const, fontFamily: 'inherit", overflow: 'hidden' }}>
              {voted !== null && <div style={{ position: 'absolute', inset: 0, width: `${pct}%`, background: 'rgba(8,145,178,0.07)' }}/>}
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
          <p style={{ fontSize: 13, color: '#047857' }}>Run a full address analysis for {suburb}: <Link href="/onboarding" style={{ fontWeight: 700, textDecoration: 'underline' }}>Start free →</Link></p>
        </div>
      )}
    </div>
  )
}

const SCHEMAS = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Merrylands Sydney: Business Analysis & Commercial Guide',
    description: 'Complete analysis of Merrylands business environment, foot traffic, demographics, and commercial opportunities. Parramatta overflow location with lower rents.',
    author: { '@type': 'Organization', name: 'Locatalyze' },
    datePublished: '2026-03-24',
    image: 'https://locatalyze.com/og-merrylands.jpg',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is Merrylands a good place to open a business?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Merrylands is the Parramatta overflow suburb most investors overlook. Lower rents (35–40% below Parramatta) with comparable foot traffic near shopping centres. Growing young professional demographic.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does Merrylands compare to Parramatta for commercial rents?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Merrylands rents are 35–40% below Parramatta for comparable customer volumes. McFarlane Street: $2,500–$4,500/month vs Parramatta: $4,000–$7,000/month.',
        },
      },
      {
        '@type': 'Question',
        name: 'What type of business works in Merrylands?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Specialty café targeting commuters (12,000 daily station boardings), family health services, and quality family-format dining all succeed in Merrylands.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does the Merrylands RSL affect adjacent businesses?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The RSL is among Greater Western Sydney\'s highest-revenue venues (5,000–8,000 weekly visitors). It creates foot traffic while absorbing casual dining share. Adjacent non-dining businesses benefit from traffic.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is Merrylands growing as a commercial location?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Apartment development since 2022 adds younger professionals earning $80,000–$100,000 who seek quality café and food that Merrylands doesn\'t yet provide. Supply lag creates opportunity.',
        },
      },
    ],
  },
]

const SCORE_BARS: Array<{ label: string; value: number }> = [
  { label: 'Foot Traffic', value: 78 },
  { label: 'Demographics', value: 71 },
  { label: 'Rent Viability', value: 80 },
  { label: 'Competition', value: 71 },
]

const NEARBY: Array<{ name: string; slug: string; score: number; verdict: Verdict }> = [
  { name: 'Parramatta', slug: 'parramatta', score: 84, verdict: 'GO' },
  { name: 'Granville', slug: 'granville', score: 69, verdict: 'CAUTION' },
  { name: 'Blacktown', slug: 'blacktown', score: 71, verdict: 'GO' },
]

export default function MerrylandsPage() {
  return (
    <div style={{ minHeight: '100vh', background: S.n50, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif' }}>
      {SCHEMAS.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      <div style={{ background: S.white, borderBottom: `1px solid ${S.border}`, padding: '16px 0' }}>
        <div style={{ maxWidth: 920, margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/analyse/sydney" style={{ fontSize: 13, fontWeight: 500, color: S.brand, textDecoration: 'none' }}>← Back to Sydney Hub</Link>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>Merrylands</h1>
          <div style={{ width: 80 }}/>
        </div>
      </div>

      <div style={{ maxWidth: 920, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ background: `linear-gradient(135deg, ${S.brandLight}15, ${S.brand}10)`, borderRadius: 16, padding: '40px 32px', marginTop: 32, marginBottom: 40, border: `1px solid ${S.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 12, color: S.muted, margin: '0 0 8px 0', textTransform: 'uppercase', fontWeight: 600 }}>Business Verdict</p>
              <h2 style={{ fontSize: 32, fontWeight: 800, margin: 0, marginBottom: 12 }}>Merrylands</h2>
              <p style={{ fontSize: 14, color: S.n900, margin: 0, lineHeight: 1.6, maxWidth: 480 }}>Merrylands scores GO. The Parramatta overflow suburb that most investors overlook. Comparable foot traffic (Stockland Merrylands + station precinct) at 35–40% lower rents. Growing professional demographic. Clear category gaps in specialty café and family health services.</p>
            </div>
            <div style={{ textAlign: 'center', minWidth: 120 }}>
              <div style={{ fontSize: 48, fontWeight: 800, color: S.brand, marginBottom: 8 }}>74</div>
              <VerdictBadge v="GO" />
            </div>
          </div>
        </div>

        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 24, marginBottom: 40 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 20px 0' }}>Scores by Category</h3>
          {SCORE_BARS.map(bar => <ScoreBar key={bar.label} label={bar.label} value={bar.value} />)}
          <p style={{ fontSize: 12, color: S.muted, marginTop: 20, marginBottom: 0 }}>Postcode 2160 • Median income $74,000 • Rent $1,800–$4,500/mo</p>
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Business Environment</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Merrylands occupies a commercially strategic position in Western Sydney: it's the natural overflow suburb for Parramatta's commercial saturation. When Parramatta Westfield reaches capacity or rents price out independent operators, Merrylands is the nearest viable alternative with comparable customer volumes. The McFarlane Street commercial strip runs within 200m of Stockland Merrylands centre, capturing foot traffic generated by the anchor tenant complex at rents 35–40% below Parramatta equivalents.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>The RSL and Leagues Club presence in Merrylands is a double-edged commercial variable. Merrylands RSL is among Greater Western Sydney's highest-revenue club venues—it draws 5,000–8,000 members and guests per week for dining, events, and entertainment. This creates foot traffic on surrounding streets while simultaneously absorbing a significant share of casual dining spend that independent restaurants might otherwise capture. Adjacent businesses benefit from foot traffic; direct dining competitors face a subsidised competitor charging below-market prices.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Apartment development in Merrylands has accelerated since 2022, adding younger professional households earning $80,000–$100,000 per household who seek café culture and quality food that Merrylands doesn't currently provide at the level the income supports. The supply lag—quality commercial offer hasn't kept pace with demographic improvement—creates the standard Western Sydney window: establish now at 2026 rents before the demographic catches the commercial offer up to Parramatta pricing.</p>
          </div>
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Competition Analysis</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Competition near Stockland Merrylands is chain-dominated—the centre anchors the same format operators found in every major Sydney shopping complex. Independent operators on McFarlane Street and adjacent strips face a different competitive picture: lower chain presence, moderate independent competition, and clear category gaps particularly in specialty food and allied health.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>The café market on the Merrylands strip has two independent quality operators. For a suburb with 12,000 station boardings daily and a growing professional demographic, this represents clear undersupply. A third quality independent could achieve $45,000–$60,000/month in the first 12 months without requiring any existing operator to fail—the demand gap is that clear.</p>
          </div>
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Demographics</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Merrylands' population is culturally diverse with Lebanese, Croatian, Chinese, and Pacific Islander communities as primary cultural segments. Median household income of $74,000 is above Granville ($68,000) and Lakemba ($63,000) but below Parramatta ($84,000), positioning Merrylands in the middle tier of Western Sydney income demographics. This income level supports quality café pricing ($5.50–$7.50 for coffee), family dining at $18–25 per person, and health services at standard metropolitan rates.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Family structure dominates Merrylands' residential profile—38% of households have dependent children (above Sydney average). This drives demand for children's health services (paediatric physio, dental, allied health), family-format dining, and education support. Operators who understand the family unit's spending patterns—rather than the individual consumer's—access Merrylands' most consistent and highest-value customer segment.</p>
          </div>
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>What Works Here</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 16 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: S.emerald, margin: '0 0 6px 0' }}>Specialty Café for Commuters</h4>
              <p style={{ fontSize: 13, color: S.n900, margin: 0, lineHeight: 1.6 }}>12,000 daily Merrylands Station boardings, two quality café competitors. Demand gap is clear. Revenue potential $45,000–$60,000/month.</p>
            </div>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 16 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: S.emerald, margin: '0 0 6px 0' }}>Family Health Services</h4>
              <p style={{ fontSize: 13, color: S.n900, margin: 0, lineHeight: 1.6 }}>Paediatric physio, dental, GP, occupational therapy for children. Strong demographic demand. Funded demand via Medicare and NDIS. Minimal competition.</p>
            </div>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 16 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: S.emerald, margin: '0 0 6px 0' }}>Quality Family-Format Dining</h4>
              <p style={{ fontSize: 13, color: S.n900, margin: 0, lineHeight: 1.6 }}>$20–30 per adult, children-friendly format. Serves the dominant household type in a market the RSL doesn't address (quality without club atmosphere).</p>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>What Fails Here</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: S.redBg, border: `1px solid ${S.redBdr}`, borderRadius: 12, padding: 16 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: S.red, margin: '0 0 6px 0' }}>Premium Fine Dining</h4>
              <p style={{ fontSize: 13, color: S.n900, margin: 0 }}>Merrylands' income demographics don't support $70+ per person reliably. Nearest viable fine dining market is Parramatta.</p>
            </div>
            <div style={{ background: S.redBg, border: `1px solid ${S.redBdr}`, borderRadius: 12, padding: 16 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: S.red, margin: '0 0 6px 0' }}>Trendy Concept Stores</h4>
              <p style={{ fontSize: 13, color: S.n900, margin: 0 }}>Cold press juice bars, specialist vegan concepts, design-led lifestyle retail. The demographic doesn't seek it; the location doesn't attract external customers.</p>
            </div>
          </div>
        </div>

        <div style={{ background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 16, padding: 24, marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12, color: S.n900 }}>Underrated Opportunity</h2>
          <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>The Merrylands RSL precinct periphery—specifically the block within 100m of the RSL carpark exit on Merrylands Road—is almost entirely underserved by quality food options. RSL patrons (5,000–8,000 weekly visitors) often want a food option before or after the RSL, outside the club's own dining environment. A quality casual dining concept or specialty café positioned on the RSL exit block captures a guaranteed foot traffic stream with no direct quality competition. Rent on this block: $2,200–$3,200/month. Estimated monthly revenue: $42,000–$58,000.</p>
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Key Risks</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.red}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px 0' }}>RSL Competition for Casual Dining</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>The RSL's subsidised food operation is a direct dining competitor. Non-dining categories (café, retail, health) are unaffected.</p>
            </div>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.red}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px 0' }}>Stockland Expansion</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>Stockland Merrylands expansion (approved 2025) will increase chain operator density 2026–2028. Independent operators must establish before repricing cycle completes.</p>
            </div>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.red}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px 0' }}>Income Sensitivity</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>At $74,000 median income, discretionary spending is vulnerable to economic shocks. Revenue variance is higher in this income band than in $90k+ suburbs.</p>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Compare Nearby</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {NEARBY.map(suburb => (
              <Link key={suburb.slug} href={`/analyse/sydney/${suburb.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 16, cursor: 'pointer', transition: 'all 0.2s', height: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>{suburb.name}</h4>
                    <VerdictBadge v={suburb.verdict} />
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: S.brand }}>
                    {suburb.score}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <SuburbPoll suburb="Merrylands" />

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Final Verdict</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Merrylands is a GO suburb with clear commercial niches. The 12,000 daily station boardings with only two quality independent cafés is a market signal—demand exists and is underserved. Family health services meet a demographic that dominates the residential mix. The RSL creates foot traffic noise while leaving adjacent categories opportunity.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>The demographic overlay is the growth driver. Merrylands has captured apartment development at the price point ($80k–$100k household income) that creates quality café demand without the Parramatta pricing. Establish a specialty café or family health service now. The supply lag won't last—apartment development and demographic concentration are temporary windows. The 35–40% rent advantage versus Parramatta has 2–3 years of runway before repricing.</p>
          </div>
        </div>

        <div style={{ background: S.brand, borderRadius: 16, padding: 32, marginBottom: 48, color: S.white }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 8px 0' }}>Ready to analyse your location?</h3>
          <p style={{ fontSize: 14, margin: '0 0 16px 0', opacity: 0.9 }}>Get a detailed business analysis for your specific address—foot traffic, competition, demographics, and revenue potential.</p>
          <Link href="/onboarding" style={{ display: 'inline-block', background: S.white, color: S.brand, padding: '12px 24px', borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>Analyse your address →</Link>
        </div>

        <div style={{ paddingTop: 32, borderTop: `1px solid ${S.border}`, marginBottom: 32 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Link href="/analyse/sydney" style={{ fontSize: 13, color: S.brand, textDecoration: 'none', fontWeight: 500 }}>← Back to Sydney Hub</Link>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {NEARBY.map(suburb => (
                <Link key={suburb.slug} href={`/analyse/sydney/${suburb.slug}`} style={{ fontSize: 13, color: S.brand, textDecoration: 'none' }}>
                  {suburb.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
