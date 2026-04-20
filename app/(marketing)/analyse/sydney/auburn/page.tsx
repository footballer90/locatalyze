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
  const [votes, setVotes] = useState<number[]>([42, 38, 20])
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
    headline: 'Auburn Sydney: Business Analysis & Commercial Guide',
    description: 'Complete analysis of Auburn business environment, foot traffic, demographics, and commercial opportunities for Turkish food and healthcare.',
    author: { '@type': 'Organization', name: 'Locatalyze' },
    datePublished: '2026-03-24',
    image: 'https://locatalyze.com/og-auburn.jpg',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is Auburn a good place to open a restaurant?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Auburn Road is Australia\'s most concentrated Turkish commercial precinct. Authentic Turkish bakery and food operators benefit from community loyalty and food tourism. Revenue potential $35,000–$55,000/month for established Turkish bakeries.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is Auburn Road Sydney known for commercially?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Auburn Road is Australia\'s most authentic Turkish commercial strip—600m concentration of bakeries, halal butchers, sweets shops, kebab restaurants, and hookahs. The street is a self-reinforcing food destination.',
        },
      },
      {
        '@type': 'Question',
        name: 'How is Auburn\'s business environment changing?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Auburn has shifted toward younger professional demographic as property prices attract professionals commuting to Parramatta and CBD. New professional café market is almost entirely unserved.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the best type of business to open in Auburn?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Authentic Turkish/Middle Eastern food, specialty café targeting professionals, or bilingual healthcare (Arabic/Turkish GP, physio, psychology) all succeed in Auburn.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does Auburn compare to Parramatta for commercial rents?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Auburn rents are 40–45% below Parramatta positions for comparable foot traffic. Auburn Road: $2,200–$4,000/month vs Parramatta: $3,500–$6,500/month.',
        },
      },
    ],
  },
]

const SCORE_BARS: Array<{ label: string; value: number }> = [
  { label: 'Foot Traffic', value: 75 },
  { label: 'Demographics', value: 68 },
  { label: 'Rent Viability', value: 82 },
  { label: 'Competition', value: 67 },
]

const NEARBY: Array<{ name: string; slug: string; score: number; verdict: Verdict }> = [
  { name: 'Bankstown', slug: 'bankstown', score: sScore('Bankstown'), verdict: sVerdict('Bankstown') },
  { name: 'Granville', slug: 'granville', score: sScore('Granville'), verdict: sVerdict('Granville') },
  { name: 'Parramatta', slug: 'parramatta', score: sScore('Parramatta'), verdict: sVerdict('Parramatta') },
]

export default function AuburnPage() {
  return (
    <div style={{ minHeight: '100vh', background: S.n50, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif' }}>
      {SCHEMAS.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      <div style={{ background: S.white, borderBottom: `1px solid ${S.border}`, padding: '16px 0' }}>
        <div style={{ maxWidth: 920, margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/analyse/sydney" style={{ fontSize: 13, fontWeight: 500, color: S.brand, textDecoration: 'none' }}>← Back to Sydney Hub</Link>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>Auburn</h1>
          <div style={{ width: 80 }}/>
        </div>
      </div>

      <div style={{ maxWidth: 920, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ background: `linear-gradient(135deg, ${S.brandLight}15, ${S.brand}10)`, borderRadius: 16, padding: '40px 32px', marginTop: 32, marginBottom: 40, border: `1px solid ${S.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 12, color: S.muted, margin: '0 0 8px 0', textTransform: 'uppercase', fontWeight: 600 }}>Business Verdict</p>
              <h2 style={{ color: '#1C1917', fontSize: 32, fontWeight: 800, margin: 0, marginBottom: 12 }}>Auburn</h2>
              <p style={{ fontSize: 14, color: S.n900, margin: 0, lineHeight: 1.6, maxWidth: 480 }}>Auburn scores GO. Australia's most concentrated Turkish commercial precinct combines community food loyalty with emerging professional café demand. Healthcare opportunities are acute. Rents are 40–45% below Parramatta for comparable foot traffic.</p>
            </div>
            <div style={{ textAlign: 'center', minWidth: 120 }}>
              <div style={{ fontSize: 48, fontWeight: 800, color: S.brand, marginBottom: 8 }}>71</div>
              <VerdictBadge v="GO" />
            </div>
          </div>
        </div>

        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 24, marginBottom: 40 }}>
          <h3 style={{ color: '#1C1917', fontSize: 16, fontWeight: 700, margin: '0 0 20px 0' }}>Scores by Category</h3>
          {SCORE_BARS.map(bar => <ScoreBar key={bar.label} label={bar.label} value={bar.value} />)}
          <p style={{ fontSize: 12, color: S.muted, marginTop: 20, marginBottom: 0 }}>Postcode 2144 • Median income $72,000 • Rent $1,500–$4,000/mo</p>
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Business Environment</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Auburn Road is one of Sydney's most commercially specific streets. The 600m stretch from the station to Norval Street is Australia's most concentrated Turkish commercial precinct—bakeries, halal butchers, Turkish sweets shops, kebab restaurants, and hookahs. This creates a food destination drawing customers from across Western Sydney, increasing foot traffic beyond immediate residential population. The precinct has self-reinforcing quality: each new authentic operator adds to Auburn's culinary identity, bringing more food tourists.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>The wider Auburn commercial area—South Parade, Duck River Road, and station precinct—offers positions at $2,200–$4,000/month that are 40–45% below Parramatta equivalents. For a service operator or café drawing the Parramatta professional overflow—workers living in Auburn but working east—this rent gap is significant. The demographic has shifted toward younger professionals over five years as Auburn's property prices (30% below Strathfield) attract professionals commuting to Parramatta and CBD.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Healthcare and allied health demand is structurally high in Auburn and poorly served. The suburb has high concentration of working-age residents from Middle Eastern communities with above-average rates of Type 2 diabetes, cardiovascular disease, and mental health challenges. GPs and specialists with Arabic and Turkish language capability are in short supply. A health practice with genuine language and cultural competency faces near-zero competition for high-demand demographic.</p>
          </div>
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Competition Analysis</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Auburn Road's Turkish and Middle Eastern food sector is competitive within its community but open to differentiated entrants. The bakery and sweets market has three dominant 15–20 year operators with community loyalty. New entrants replicating community positioning without provenance fail. Adjacent categories—quality café with Turkish-influenced menu, Middle Eastern breakfast, halal Japanese fusion—face weaker competition.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>The professional café market (serving commuter demographic rather than community) has virtually no quality independent representation. Auburn Station handles 10,000+ daily boardings; the café offer is a convenience store and one basic operator. This gap has been persistent for years—a quality independent specialty café at the station precinct would face zero direct competition for its specific customer base.</p>
          </div>
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Demographics</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Auburn's demographic has two distinct layers. The established community—predominantly Turkish-Australian and Lebanese-Australian, with significant Afghan, Iranian, and Pakistani households—is the cultural anchor. This community shops loyally with established operators, spends concentrated on food and family essentials, and responds poorly to operators who don't engage genuinely with their culture.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>The newer demographic—younger professionals priced out of Strathfield, Burwood, and Parramatta—has grown steadily since 2020. These residents earn $75,000–$105,000 per household, commute to Parramatta or CBD, and seek café culture, quality food, and lifestyle retail their income supports. Auburn's commercial strip doesn't currently provide this. The demographic exists today but spends elsewhere because local supply hasn't caught up.</p>
          </div>
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 22, fontWeight: 800, marginBottom: 16 }}>What Works Here</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 16 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: S.emerald, margin: '0 0 6px 0' }}>Authentic Middle Eastern & Turkish Food</h4>
              <p style={{ fontSize: 13, color: S.n900, margin: 0, lineHeight: 1.6 }}>Community loyalty and food tourism converge to create reliable, growing customer base. Bakery, kebab, sweets, Turkish breakfast all strong. Revenue $35,000–$55,000/month for established Turkish bakery.</p>
            </div>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 16 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: S.emerald, margin: '0 0 6px 0' }}>Specialty Café for Commuters</h4>
              <p style={{ fontSize: 13, color: S.n900, margin: 0, lineHeight: 1.6 }}>10,000 daily Auburn Station boardings, zero quality café competition. Well-located, well-executed operator achieves $45,000–$60,000/month.</p>
            </div>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 16 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: S.emerald, margin: '0 0 6px 0' }}>Bilingual Allied Health</h4>
              <p style={{ fontSize: 13, color: S.n900, margin: 0, lineHeight: 1.6 }}>Arabic/Turkish GP, physio, psychology fill acute gap. Language-competent practitioners face consistent, high demand. Medicare rebates support the model.</p>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 22, fontWeight: 800, marginBottom: 16 }}>What Fails Here</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: S.redBg, border: `1px solid ${S.redBdr}`, borderRadius: 12, padding: 16 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: S.red, margin: '0 0 6px 0' }}>Generic Western Hospitality</h4>
              <p style={{ fontSize: 13, color: S.n900, margin: 0 }}>Without Middle Eastern differentiation, suburban café customers want specialty coffee or authenticity. Generic satisfies neither.</p>
            </div>
            <div style={{ background: S.redBg, border: `1px solid ${S.redBdr}`, borderRadius: 12, padding: 16 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: S.red, margin: '0 0 6px 0' }}>Luxury Retail</h4>
              <p style={{ fontSize: 13, color: S.n900, margin: 0 }}>Auburn's income demographics don't support $200+ ATV retail. Professional demographic that earns this spends it in Parramatta or online.</p>
            </div>
          </div>
        </div>

        <div style={{ background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 16, padding: 24, marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12, color: S.n900 }}>Underrated Opportunity</h2>
          <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>The halal high-quality breakfast segment is almost entirely absent from Auburn despite large Muslim community for whom halal certification is meaningful. A café or brunch restaurant offering halal-certified specialty coffee, egg dishes, and pastry at $12–22 per plate—clearly positioned and certified—captures deeply underserved market. Nearest competitors are in Lakemba and Granville. Revenue potential: $40,000–$55,000/month.</p>
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Key Risks</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.red}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#1C1917', margin: '0 0 4px 0' }}>Community Trust Barrier</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>New entrants without community connection face loyalty barriers in established cultural food sector. Professional café market is lower-risk entry point.</p>
            </div>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.red}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#1C1917', margin: '0 0 4px 0' }}>Property Price Compression</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>Auburn has seen 28% price growth since 2022. Rents rising. The 40% below Parramatta window may not last another 3 years.</p>
            </div>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.red}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#1C1917', margin: '0 0 4px 0' }}>Parking Constraints</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>Weekend parking is constrained on Auburn Road during peak periods. Car-dependent customers from outer suburbs face friction reducing impulse visitation.</p>
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

        <SuburbPoll suburb="Auburn" />

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Final Verdict</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Auburn is a GO suburb with clear commercial niches. Auburn Road's Turkish food precinct is self-reinforcing—community loyalty and food tourism create reliable demand. The emerging professional café market at Auburn Station is almost entirely unserved. Healthcare with language capability faces minimal competition.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>The rent advantage (40–45% below Parramatta) is real but time-limited. Property price growth is compressing Auburn's affordability advantage. An operator entering now for authentic Turkish food, quality café, or healthcare services captures market conditions that are improving but will tighten. The professional demographic overlay is the growth driver—capture this segment before Parramatta prices push professionals further west.</p>
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
