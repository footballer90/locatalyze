'use client'

import Link from 'next/link'
import { useState } from 'react'
import { getSydneySuburb } from '@/lib/analyse-data/sydney'
function sScore(n: string): number { return getSydneySuburb(n)?.compositeScore ?? 0 }
function sVerdict(n: string): 'GO' | 'CAUTION' | 'NO' { const v = getSydneySuburb(n)?.verdict; return v === 'GO' ? 'GO' : v === 'CAUTION' ? 'CAUTION' : 'NO' }
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'

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
  const [votes, setVotes] = useState<number[]>([36, 39, 25])
  const total = votes.reduce((a, b) => a + b, 0)
  function handleVote(i: number) {
    if (voted !== null) return
    setVoted(i)
    setVotes(prev => prev.map((v, idx) => idx === i ? v + 1 : v))
  }
  const opts = ['Yes', 'Maybe', 'No']
  return (
    <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '24px', marginBottom: 44 }}>
      <h3 style={{ color: '#1C1917', fontSize: 18, fontWeight: 800, marginBottom: 6 }}>Would you open a business in {suburb}?</h3>
      <p style={{ fontSize: 13, color: S.muted, marginBottom: 18 }}>{voted === null ? 'Based on this analysis — would you take the risk?' : `You voted. Here\'s how ${total} readers responded:`}</p>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
        {opts.map((opt, i) => {
          const pct = Math.round((votes[i] / total) * 100)
          return (
            <button key={opt} onClick={() => handleVote(i)} disabled={voted !== null}
              style={{ position: 'relative', border: `1.5px solid ${voted === i ? S.emeraldBdr : S.border}`, borderRadius: 10, padding: '12px 16px', background: S.white, cursor: voted === null ? 'pointer' : 'default', textAlign: 'left' as const, fontFamily: 'inherit', overflow: 'hidden' }}>
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
    headline: 'Granville Sydney: Business Analysis & Commercial Guide',
    description: 'Complete analysis of Granville business environment, Bengali food scene, foot traffic, demographics, and commercial opportunities.',
    author: { '@type': 'Organization', name: 'Locatalyze' },
    datePublished: '2026-03-24',
    image: 'https://locatalyze.com/og-granville.jpg',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is Granville a good location for a café?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Granville Station has 8,500 daily boardings with no quality independent café option. A specialty café targeting commuter demographic faces zero direct competition.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the Granville commercial strip like?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'South Street has developed Australia\'s most concentrated Bengali restaurant precinct outside Harris Park. Competition is thin to moderate in most categories. Retail is low-vacancy but low-quality.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does Granville compare to Parramatta for business?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Granville rents are 55–60% below Parramatta but foot traffic is genuinely lower. The case works for operators who can draw Parramatta professional overflow or serve the student demographic.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the Bengali food scene in Granville?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Granville has Australia\'s most concentrated Bengali restaurant precinct outside Harris Park with 4–5 quality operators drawing food tourists. Zero food media coverage despite quality.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is Granville growing as a business destination?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The commuter component is growing as property prices attract younger households. Western Sydney Uni Parramatta and TAFE NSW create student anchors. Commercial supply hasn\'t caught up to demographic improvement yet.',
        },
      },
    ],
  },
]

const SCORE_BARS: Array<{ label: string; value: number }> = [
  { label: 'Foot Traffic', value: 70 },
  { label: 'Demographics', value: 63 },
  { label: 'Rent Viability', value: 88 },
  { label: 'Competition', value: 60 },
]

const NEARBY: Array<{ name: string; slug: string; score: number; verdict: Verdict }> = [
  { name: 'Parramatta', slug: 'parramatta', score: sScore('Parramatta'), verdict: sVerdict('Parramatta') },
  { name: 'Auburn', slug: 'auburn', score: sScore('Auburn'), verdict: sVerdict('Auburn') },
  { name: 'Merrylands', slug: 'merrylands', score: sScore('Merrylands'), verdict: sVerdict('Merrylands') },
]

export default function GranvillePage() {
  return (
    <div style={{ minHeight: '100vh', background: S.n50, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif' }}>
      {SCHEMAS.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      <div style={{ background: S.white, borderBottom: `1px solid ${S.border}`, padding: '16px 0' }}>
        <div style={{ maxWidth: 920, margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/analyse/sydney" style={{ fontSize: 13, fontWeight: 500, color: S.brand, textDecoration: 'none' }}>← Back to Sydney Hub</Link>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>Granville</h1>
          <div style={{ width: 80 }}/>
        </div>
      </div>

      <div style={{ maxWidth: 920, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ background: `linear-gradient(135deg, ${S.brandLight}15, ${S.brand}10)`, borderRadius: 16, padding: '40px 32px', marginTop: 32, marginBottom: 40, border: `1px solid ${S.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 12, color: S.muted, margin: '0 0 8px 0', textTransform: 'uppercase', fontWeight: 600 }}>Business Verdict</p>
              <h2 style={{ color: '#1C1917', fontSize: 32, fontWeight: 800, margin: 0, marginBottom: 12 }}>Granville</h2>
              <p style={{ fontSize: 14, color: S.n900, margin: 0, lineHeight: 1.6, maxWidth: 480 }}>Granville scores CAUTION. The economics can work with the right model. Sits strategically between Parramatta (3km) and Merrylands (1.5km). Rents are 55–60% below Parramatta, but foot traffic is lower to match. The Bengali food scene is genuine and underappreciated.</p>
            </div>
            <div style={{ textAlign: 'center', minWidth: 120 }}>
              <div style={{ fontSize: 48, fontWeight: 800, color: S.brand, marginBottom: 8 }}>69</div>
              <VerdictBadge v="CAUTION" />
            </div>
          </div>
        </div>

        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 24, marginBottom: 40 }}>
          <h3 style={{ color: '#1C1917', fontSize: 16, fontWeight: 700, margin: '0 0 20px 0' }}>Scores by Category</h3>
          {SCORE_BARS.map(bar => <ScoreBar key={bar.label} label={bar.label} value={bar.value} />)}
          <p style={{ fontSize: 12, color: S.muted, marginTop: 20, marginBottom: 0 }}>Postcode 2142 • Median income $68,000 • Rent $1,400–$3,000/mo</p>
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Business Environment</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Granville's commercial case is primarily a rent argument. At $1,400–$3,000/month, Granville offers commercial positions that are 55–60% below Parramatta Westfield pricing and 40% below Auburn Road equivalents. For an operator who draws the Parramatta professional overflow—workers living in Granville but working east—or the Merrylands residential overflow, this rent advantage creates compelling unit economics. The challenge is that foot traffic itself is genuinely lower than either Parramatta or Merrylands; the rent discount reflects a real difference, not perception alone.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>The Bengali and Bangladeshi food culture of Granville is the suburb's most commercially significant and least externally recognised asset. South Street has developed Australia's most concentrated Bengali restaurant precinct outside Harris Park. These operators—established 10–15 years with loyal community and increasingly food-tourist customer bases—demonstrate that Granville can sustain quality food businesses at accessible price points. Any new food operator entering Granville should study these businesses carefully; they represent the market that actually works here.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>TAFE NSW Granville and Western Sydney University Parramatta overflow create a student demographic anchoring budget food operators on South Street. A café or quick-service operator pricing under $15 per meal with quality above fast food and convenient campus proximity can achieve 80–120 daily transactions with minimal marketing. Students are habitual and loyal once a favourite is established.</p>
          </div>
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Competition Analysis</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Competition is thin to moderate on main commercial strips. The Bengali food sector has established operators with community loyalty, but other categories—specialty café, Asian fusion, quick-service healthy food—have minimal quality representation. A specialty café targeting the professional commuter demographic at Granville Station (8,500 daily boardings, no quality café option) would face no direct competition for its specific customer.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>The retail competition landscape is characterised by low vacancy but also low quality. Several convenience and variety stores serve the residential demographic; independent specialty retail faces no direct competition but also a limited customer base for premium products. The retail case in Granville is weaker than the food and services case.</p>
          </div>
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Demographics</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Granville's demographic is predominantly South Asian and Middle Eastern working-class families with median household income of $68,000. The Bangladeshi and Bengali-Australian community has particularly strong commercial presence relative to population size—culturally, this community has strong food entrepreneurship tradition and significant spending on cultural food. The demographic is not high-income but it is food-loyal.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>The commuter component of Granville's population—residents who work in Parramatta and CBD—is growing as more affordable property prices draw younger households. These households earn $75,000–$95,000 and would be quality café customers on their commute. Currently, they stop at Parramatta Station because no quality option exists locally. This is the market available for capture.</p>
          </div>
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 22, fontWeight: 800, marginBottom: 16 }}>What Works Here</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 16 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: S.emerald, margin: '0 0 6px 0' }}>Authentic Bengali/South Asian Cuisine</h4>
              <p style={{ fontSize: 13, color: S.n900, margin: 0, lineHeight: 1.6 }}>Strong community loyalty with food tourism upside for quality operators. Revenue $20,000–$35,000/month.</p>
            </div>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 16 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: S.emerald, margin: '0 0 6px 0' }}>Commuter Specialty Café</h4>
              <p style={{ fontSize: 13, color: S.n900, margin: 0, lineHeight: 1.6 }}>8,500 daily Granville Station boardings, no quality competitor. Revenue potential $28,000–$38,000/month.</p>
            </div>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 16 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: S.emerald, margin: '0 0 6px 0' }}>NDIS & Allied Health</h4>
              <p style={{ fontSize: 13, color: S.n900, margin: 0, lineHeight: 1.6 }}>Granville LGA has high NDIS participant concentration. Funded healthcare bypasses income constraint entirely.</p>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 22, fontWeight: 800, marginBottom: 16 }}>What Fails Here</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: S.redBg, border: `1px solid ${S.redBdr}`, borderRadius: 12, padding: 16 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: S.red, margin: '0 0 6px 0' }}>Premium Dining</h4>
              <p style={{ fontSize: 13, color: S.n900, margin: 0 }}>Demographic doesn't support $50+ per person pricing. No evidence of a market.</p>
            </div>
            <div style={{ background: S.redBg, border: `1px solid ${S.redBdr}`, borderRadius: 12, padding: 16 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: S.red, margin: '0 0 6px 0' }}>Generic Western Cafés</h4>
              <p style={{ fontSize: 13, color: S.n900, margin: 0 }}>Price-sensitive demographic won't pay $6.50 for generic flat white. Specialty at $5–5.50 with genuine quality can succeed.</p>
            </div>
          </div>
        </div>

        <div style={{ background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 16, padding: 24, marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12, color: S.n900 }}>Underrated Opportunity</h2>
          <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>A halal Korean-fusion or Japanese-adjacent concept (halal ramen, halal fried chicken, Korean-inspired rice dishes) in Granville would face zero competition for the Muslim-majority demographic actively seeking halal Asian food. Granville Station block is the right location—$1,800/month rent, station foot traffic, no quality competition. Revenue estimate: $25,000–$32,000/month.</p>
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Key Risks</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.red}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#1C1917', margin: '0 0 4px 0' }}>Foot Traffic Ceiling</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>8,500 daily station boardings is solid but not exceptional. A food operator needs 100+ daily transactions; achievable but requires execution precision.</p>
            </div>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.red}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#1C1917', margin: '0 0 4px 0' }}>Parramatta Leakage</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>Residents with options drive or train 3km to Parramatta for better choices. Granville operators fight this leakage constantly.</p>
            </div>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.red}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#1C1917', margin: '0 0 4px 0' }}>Commercial Strip Condition</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>Some sections of South Street have vacancy and physical decline affecting perception. Location selection within Granville matters more than in Parramatta.</p>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Compare Nearby</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {NEARBY.map(suburb => (
              <Link key={suburb.slug} href={`/analyse/sydney/${suburb.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 16, cursor: 'pointer', transition: 'all 0.2s', height: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <h4 style={{ color: '#1C1917', fontSize: 14, fontWeight: 700, margin: 0 }}>{suburb.name}</h4>
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

        <SuburbPoll suburb="Granville" />

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Final Verdict</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Granville is CAUTION, not a universal recommendation. Success requires clear positioning: either Bengali food with community connection, specialty café targeting the commuter demographic, or NDIS-funded allied health. Generic positioning fails. The rent advantage (55–60% below Parramatta) only works if you can capture customers at the lower foot traffic volume.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>The commuter demographic is the growth opportunity. As Granville's property prices remain 30–40% below Strathfield and Parramatta, younger professionals are accumulating here. They currently leakage to Parramatta for café culture and quality food. An operator who establishes a quality specialty café now captures a demographic that will only grow. The Bengali food scene is also underappreciated—study these operators before dismissing Granville's food potential.</p>
          </div>
        </div>

        <div style={{ background: S.brand, borderRadius: 16, padding: 32, marginBottom: 48, color: S.white }}>
          <h3 style={{ color: '#1C1917', fontSize: 18, fontWeight: 800, margin: '0 0 8px 0' }}>Ready to analyse your location?</h3>
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
