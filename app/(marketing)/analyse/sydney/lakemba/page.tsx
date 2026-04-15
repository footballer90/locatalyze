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
  const [votes, setVotes] = useState<number[]>([32, 41, 27])
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
    headline: 'Lakemba Sydney: Business Analysis & Commercial Guide',
    description: 'Complete analysis of Lakemba business environment, Lebanese community, Haldon Street, Ramadan trading, and commercial opportunities.',
    author: { '@type': 'Organization', name: 'Locatalyze' },
    datePublished: '2026-03-24',
    image: 'https://locatalyze.com/og-lakemba.jpg',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is Lakemba a good place to open a business?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Lakemba offers specific opportunities in halal food, Islamic lifestyle retail, and bilingual healthcare. Generic Western retail fails. Success requires community trust and understanding of Ramadan/Eid cycles.',
        },
      },
      {
        '@type': 'Question',
        name: 'What type of business works in Lakemba?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Authentic Arab food with halal certification, halal-certified Muslim lifestyle retail, and bilingual healthcare (Arabic-speaking GP, physio, psychology) all succeed in Lakemba.',
        },
      },
      {
        '@type': 'Question',
        name: 'How important is Ramadan for Lakemba businesses?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ramadan (30 days) and two Eid celebrations create revenue spikes that can generate 300–500% of normal daily revenue. A food operator positioned for Ramadan/Eid accesses a commercial cycle with no equivalent in any other Sydney suburb.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is Haldon Street Lakemba\'s commercial character?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Haldon Street serves the day-to-day needs of Lebanese, Palestinian, Iraqi, and wider Arab community. It functions as a community commercial precinct rather than a general consumer high street.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the demographic of Lakemba Sydney?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Lakemba is predominantly Lebanese-Australian and Arab-Muslim with median income $63,000. Spending is concentrated rather than uniformly low—the community spends generously on food, children\'s education, and community-endorsed services.',
        },
      },
    ],
  },
]

const SCORE_BARS: Array<{ label: string; value: number }> = [
  { label: 'Foot Traffic', value: 68 },
  { label: 'Demographics', value: 58 },
  { label: 'Rent Viability', value: 90 },
  { label: 'Competition', value: 58 },
]

const NEARBY: Array<{ name: string; slug: string; score: number; verdict: Verdict }> = [
  { name: 'Bankstown', slug: 'bankstown', score: 70, verdict: 'GO' },
  { name: 'Auburn', slug: 'auburn', score: 71, verdict: 'GO' },
  { name: 'Granville', slug: 'granville', score: 69, verdict: 'CAUTION' },
]

export default function LakembaPage() {
  return (
    <div style={{ minHeight: '100vh', background: S.n50, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif' }}>
      {SCHEMAS.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      <div style={{ background: S.white, borderBottom: `1px solid ${S.border}`, padding: '16px 0' }}>
        <div style={{ maxWidth: 920, margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/analyse/sydney" style={{ fontSize: 13, fontWeight: 500, color: S.brand, textDecoration: 'none' }}>← Back to Sydney Hub</Link>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>Lakemba</h1>
          <div style={{ width: 80 }}/>
        </div>
      </div>

      <div style={{ maxWidth: 920, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ background: `linear-gradient(135deg, ${S.brandLight}15, ${S.brand}10)`, borderRadius: 16, padding: '40px 32px', marginTop: 32, marginBottom: 40, border: `1px solid ${S.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 12, color: S.muted, margin: '0 0 8px 0', textTransform: 'uppercase', fontWeight: 600 }}>Business Verdict</p>
              <h2 style={{ color: '#1C1917', fontSize: 32, fontWeight: 800, margin: 0, marginBottom: 12 }}>Lakemba</h2>
              <p style={{ fontSize: 14, color: S.n900, margin: 0, lineHeight: 1.6, maxWidth: 480 }}>Lakemba scores CAUTION. Specific business models work well; generic ones fail quickly. Haldon Street is one of Sydney's most culturally specific commercial precincts. Ramadan and Eid periods create extraordinary trading windows. Community trust and halal certification are binary requirements.</p>
            </div>
            <div style={{ textAlign: 'center', minWidth: 120 }}>
              <div style={{ fontSize: 48, fontWeight: 800, color: S.brand, marginBottom: 8 }}>65</div>
              <VerdictBadge v="CAUTION" />
            </div>
          </div>
        </div>

        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 24, marginBottom: 40 }}>
          <h3 style={{ color: '#1C1917', fontSize: 16, fontWeight: 700, margin: '0 0 20px 0' }}>Scores by Category</h3>
          {SCORE_BARS.map(bar => <ScoreBar key={bar.label} label={bar.label} value={bar.value} />)}
          <p style={{ fontSize: 12, color: S.muted, marginTop: 20, marginBottom: 0 }}>Postcode 2195 • Median income $63,000 • Rent $800–$2,500/mo</p>
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Business Environment</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Haldon Street, Lakemba is one of Sydney's most culturally specific and commercially misunderstood streets. It functions primarily as a community commercial precinct—serving day-to-day needs of Lebanese, Palestinian, Iraqi, Syrian, and wider Arab community—rather than a general consumer high street. Operators who try inserting generic Western commercial concepts into this environment consistently fail not because quality is wrong but because positioning doesn't match the street's commercial identity or customer expectations.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>What Haldon Street does well, it does exceptionally. Lebanese pastry shops selling baklava and knafeh at $3–6 per piece generate extraordinary volume during Eid and Ramadan periods. Food operators who align with the community's religious calendar—operating extended hours during Ramadan, stock depth for Eid preparation, culturally resonant menus—access peak trading windows that the suburb's income profile doesn't suggest possible. Lakemba's annual Eid market day draws 50,000+ visitors from across Western and South-West Sydney.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>The healthcare sector in Lakemba is genuinely underdeveloped relative to population's needs. South-West Sydney has above-average rates of Type 2 diabetes, cardiovascular disease, maternal health complexity, and mental health conditions—all generating sustained healthcare demand. GPs, psychologists, and allied health practitioners with Arabic language capability are in short supply across the entire South-West Sydney corridor. Government bulk-billing and Medicare funding make this sector independent of the income constraint.</p>
          </div>
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Competition Analysis</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Competition in Haldon Street's food sector is intense within established categories. Lebanese bakeries, kebab operators, and sweets shops compete with well-established operators holding 10–20 years of community loyalty. New entrants compete not on product quality alone but on community trust—something that takes years to build or requires pre-existing community relationships. The market doesn't reward generic quality; it rewards community connection.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Healthcare competition is the commercial opportunity with the most favourable competitive environment in Lakemba. Bulk-billing GP clinics run at overcapacity with wait times of 2–4 weeks for new patients. Allied health (physio, psychology, dietitian, dental) is barely represented on the commercial strip despite the demographic's significant health needs. An operator with genuine Arabic and Lebanese language capability faces near-zero competition for large, underserved demand.</p>
          </div>
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Demographics</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Lakemba's demographic is predominantly Lebanese-Australian and Arab-Muslim with significant Palestinian, Iraqi, and Syrian communities. Income median of $63,000 reflects working-class and welfare-dependent demographic mix, but spending pattern is concentrated rather than uniformly low. The community spends generously on food (especially for family gatherings and religious occasions), children's education, and community-endorsed services. An operator who accesses community endorsement—through the local mosque network, community organisations, or word-of-mouth from respected community members—can generate strong revenue regardless of mainstream marketing.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>The religious calendar is the most important commercial variable in Lakemba that non-community operators consistently fail to account for. Ramadan (30 days of evening breaking of fast, iftar meals) and two Eid celebrations create revenue spikes that can generate 300–500% of normal daily revenue. A food operator who understands this calendar and positions for it—extended evening Ramadan trading, Eid product ranges, community iftar packages—accesses a commercial cycle with no equivalent in any other Sydney suburb.</p>
          </div>
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 22, fontWeight: 800, marginBottom: 16 }}>What Works Here</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 16 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: S.emerald, margin: '0 0 6px 0' }}>Authentic Arab Food with Halal Certification</h4>
              <p style={{ fontSize: 13, color: S.n900, margin: 0, lineHeight: 1.6 }}>Lebanese, Palestinian, Iraqi with community credibility. Highest-performing category in Lakemba. Established operators achieve $30,000–$50,000/month. Non-halal operators fail regardless of quality.</p>
            </div>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 16 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: S.emerald, margin: '0 0 6px 0' }}>Halal Muslim Lifestyle Retail</h4>
              <p style={{ fontSize: 13, color: S.n900, margin: 0, lineHeight: 1.6 }}>Modest fashion, prayer items, Islamic books, Ramadan supplies. Community demand is consistent. Eid periods generate extraordinary spikes.</p>
            </div>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 16 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: S.emerald, margin: '0 0 6px 0' }}>Bilingual Healthcare</h4>
              <p style={{ fontSize: 13, color: S.n900, margin: 0, lineHeight: 1.6 }}>Arabic-speaking GP, physio, psychology. Funded demand via Medicare and NDIS. Virtually no competition for language-competent practitioners.</p>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 22, fontWeight: 800, marginBottom: 16 }}>What Fails Here</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: S.redBg, border: `1px solid ${S.redBdr}`, borderRadius: 12, padding: 16 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: S.red, margin: '0 0 6px 0' }}>Non-Halal Food Operators</h4>
              <p style={{ fontSize: 13, color: S.n900, margin: 0 }}>Lakemba's community will not patronise non-halal operators regardless of quality or marketing. This is a binary commercial constraint.</p>
            </div>
            <div style={{ background: S.redBg, border: `1px solid ${S.redBdr}`, borderRadius: 12, padding: 16 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: S.red, margin: '0 0 6px 0' }}>Generic Western Retail</h4>
              <p style={{ fontSize: 13, color: S.n900, margin: 0 }}>Clothing stores, lifestyle products, and non-aligned services are consistently below-viable in Lakemba's commercial mix.</p>
            </div>
          </div>
        </div>

        <div style={{ background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 16, padding: 24, marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12, color: S.n900 }}>Underrated Opportunity</h2>
          <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Islamic finance and mortgage broking services are entirely absent from Haldon Street despite Lakemba having Sydney's highest concentration of Muslim households actively seeking halal financial products. The Islamic finance sector has grown 40% in Australia since 2020. A qualified mortgage broker or financial adviser with halal product offerings and Arabic language capability could serve a completely uncontested market. This is white-collar service business viable at $1,200/month rent with no direct competition.</p>
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Key Risks</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.red}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#1C1917', margin: '0 0 4px 0' }}>Community Trust Barrier</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>Operators without community connection face structural disadvantage. High and slow to build—operators with no endorsement fail regardless of quality.</p>
            </div>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.red}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#1C1917', margin: '0 0 4px 0' }}>Income Volatility</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>The demographic is disproportionately affected by economic downturns and employment shocks. Revenue can drop materially during broader economic stress.</p>
            </div>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.red}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#1C1917', margin: '0 0 4px 0' }}>Ramadan Lumpiness</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>Non-Ramadan periods can be quieter. Eid and Ramadan spikes create lumpiness requiring careful budget planning.</p>
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

        <SuburbPoll suburb="Lakemba" />

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Final Verdict</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Lakemba is CAUTION, not a generic recommendation. Success is conditional on specific positioning: authentic halal Arab food with community endorsement, halal-certified lifestyle retail, or Arabic-speaking healthcare. The religious calendar is not a side variable—it's the structural foundation of the commercial environment.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Haldon Street is among Sydney's lowest commercial rents ($800–$1,200 primary positions). For operators with the right model—one that understands and aligns with community needs and religious calendar—the economics are compelling. For operators without community connection or halal positioning, Lakemba is one of Sydney's highest-risk commercial locations. The difference is structural, not marginal.</p>
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
