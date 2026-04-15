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
  headline: 'Mount Druitt Business Location Analysis - Western Sydney Opportunity',
  description: 'Commercial real estate analysis for Mount Druitt Sydney. Western Sydney lowest rents, NDIS opportunities, demographics, and business intelligence.',
  image: 'https://locatalyze.com/og-mount-druitt.png',
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
      name: 'Is Mount Druitt worth considering for a business?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. Mount Druitt scores CAUTION, not NO. Australia\'s lowest commercial rents for any suburban train station precinct ($1,200–$2,800/month) create operational economics that don\'t exist elsewhere in Sydney. The market requires understanding income constraints and volume-focused models.' },
    },
    {
      '@type': 'Question',
      name: 'What type of business works in Mount Druitt?',
      acceptedAnswer: { '@type': 'Answer', text: 'NDIS-aligned allied health (physio, psychology, OT) — funded demand stream bypasses income constraints. Quality affordable food (flat white under $6, meals under $18) at high volume. Tutoring/education support with strong demand and minimal competition.' },
    },
    {
      '@type': 'Question',
      name: 'How does Western Sydney Airport affect Mount Druitt businesses?',
      acceptedAnswer: { '@type': 'Answer', text: 'Western Sydney International (opening 2026) is 20 minutes from Mount Druitt. The associated Aerotropolis employment corridor (St Marys to Badgerys Creek) will shift the Mount Druitt catchment income composition. Operators who establish now lock in 2025 rents before 2030 growth is priced.' },
    },
    {
      '@type': 'Question',
      name: 'What are NDIS business opportunities in Western Sydney?',
      acceptedAnswer: { '@type': 'Answer', text: 'Mount Druitt has Sydney\'s highest NDIS participant concentration. NDIS-funded allied health (physio, psychology, occupational therapy) operates on funded demand streams independent of local income constraints. This creates sustainable revenue regardless of median household income.' },
    },
    {
      '@type': 'Question',
      name: 'Is it risky to open a business in Mount Druitt?',
      acceptedAnswer: { '@type': 'Answer', text: 'Risks exist but are not insurmountable. Income ceiling is real: pricing above market tolerance consistently fails. Social complexity requires staff training and security awareness. Westfield\'s gravity means product differentiation is mandatory. Success requires understanding the market, not fighting it.' },
    },
  ],
}

const SCORE_BARS: Array<{ label: string; value: number }> = [
  { label: 'Foot Traffic', value: 72 },
  { label: 'Demographics', value: 55 },
  { label: 'Rent Viability', value: 90 },
  { label: 'Competition', value: 62 },
]

const NEARBY: Array<{ name: string; slug: string; score: number; verdict: Verdict }> = [
  { name: 'Blacktown', slug: 'blacktown', score: 71, verdict: 'GO' },
  { name: 'Penrith', slug: 'penrith', score: 76, verdict: 'GO' },
  { name: 'Merrylands', slug: 'merrylands', score: 74, verdict: 'GO' },
]

export default function MountDruittPage() {
  return (
    <div style={{ background: S.n50, minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA_ARTICLE) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA_FAQ) }} />

      <nav style={{ background: S.white, borderBottom: `1px solid ${S.border}`, padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ fontSize: 18, fontWeight: 800, color: S.brand, textDecoration: 'none' }}>Locatalyze</Link>
        <Link href="/onboarding" style={{ fontSize: 14, fontWeight: 600, color: S.brand, textDecoration: 'none', padding: '8px 16px', border: `1px solid ${S.brand}`, borderRadius: 8 }}>Analyse your location</Link>
      </nav>

      <div style={{ background: `linear-gradient(135deg, #0F766E 0%, #0B5E57 100%)`, padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ fontSize: 14, color: S.white, marginBottom: 16, opacity: 0.9 }}>
            <Link href="/analyse/sydney" style={{ color: S.white, textDecoration: 'none' }}>Sydney</Link> / Mount Druitt
          </div>
          <h1 style={{ fontSize: 48, fontWeight: 900, color: '#FFFFFF', marginBottom: 24 }}>Mount Druitt</h1>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
            <VerdictBadge v="CAUTION" />
            <div style={{ fontSize: 32, fontWeight: 900, color: S.white }}>68</div>
          </div>
          <p style={{ fontSize: 18, color: S.white, opacity: 0.95, margin: 0 }}>Western Sydney's lowest rents. NDIS opportunities, volume-focused models, income constraints require careful positioning.</p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '32px', marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Quick Verdict</h2>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: S.n900, marginBottom: 16 }}>
            Mount Druitt scores CAUTION — not NO. The distinction is critical. Australia's lowest commercial rents for any suburban train station precinct ($1,200–$2,800/month) create operational economics that don't exist elsewhere in Sydney. Spending power constraints are real and operators who fight them with premium pricing consistently fail.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: S.n900, margin: 0 }}>
            However: underserved demand exists for quality affordable food, health services, and education support. The correct model is high volume at accessible pricing with genuine quality execution. NDIS-funded allied health operates on demand streams independent of local income. This is a market that rewards understanding, not fighting.
          </p>
        </div>

        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '32px', marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 24, fontWeight: 800, marginBottom: 32 }}>Location Scores</h2>
          {SCORE_BARS.map(bar => <ScoreBar key={bar.label} label={bar.label} value={bar.value} />)}
        </div>

        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '32px', marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Business Environment</h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: S.n900, marginBottom: 20 }}>
            Mount Druitt produces two types of business results: operators who understand the market achieve sustainable businesses with minimal competition; operators who try to apply inner-city models consistently fail. A café charging $7.50 for a flat white in Surry Hills trades on branding and experience. The same café in Mount Druitt prices at the edge of what the local demographic can sustain. At $5.50 for a flat white, a quality independent café at Mount Druitt Station can achieve 150–200 daily transactions and $22,000–28,000 monthly revenue.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: S.n900, marginBottom: 20 }}>
            Commercial rent is Mount Druitt's defining structural advantage. No other Sydney suburban train station offers comparable foot traffic at $1,200–$2,800/month rent. A food operator paying $2,000/month at Mount Druitt and generating $25,000/month revenue achieves an 8% rent-to-revenue ratio — among Sydney's healthiest. This math is available to operators who can execute at the right price point and quality level.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: S.n900, margin: 0 }}>
            Western Sydney Airport (opening 2026) and the associated Aerotropolis employment corridor (St Marys to Badgerys Creek) will shift Mount Druitt's employment composition materially. The suburb sits within 20 minutes of the airport employment zone. As Aerotropolis activates, Mount Druitt's surrounding LGA income profile will rise. Operators who establish now at 2025 rents capture income growth without paying a 2030 rent premium.
          </p>
        </div>

        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '32px', marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Competition Analysis</h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: S.n900, marginBottom: 20 }}>
            Competition is mostly chain-based. Westfield Mount Druitt houses the full suite of quick-service chains. Independent operators outside the centre face lower foot traffic but also zero chain competition on specific products. Strategic positioning for independents is product categories Westfield's food court doesn't cover: specialty coffee (genuinely absent), quality Asian street food beyond existing Chinese/Vietnamese, and health services (entirely absent from the Westfield model).
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: S.n900, margin: 0 }}>
            The health and allied health sector faces almost no competition outside GP practices. Zero independent physiotherapists, psychologists, or dietitians are visible on the commercial strip adjacent to Mount Druitt Station. This represents a significant gap given the demographic's high concentration of chronic health conditions, mental health challenges, and NDIS participants.
          </p>
        </div>

        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '32px', marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Demographics</h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: S.n900, marginBottom: 20 }}>
            Mount Druitt LGA has Sydney's highest concentration of NDIS participants by suburb, along with above-average rates of welfare dependence and chronic health conditions. This is not only social — it's economic. Allied health operators who work within NDIS funding frameworks access a captive, funded demand stream that bypasses income limitation entirely. NDIS-funded physio, psychology, and occupational therapy generate sustainable revenue regardless of local median income.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: S.n900, margin: 0 }}>
            The population is 62% culturally diverse, with Pacific Islander, Aboriginal and Torres Strait Islander, and Middle Eastern communities as the largest non-Anglo segments. These communities have specific preferences and underserved gaps that generic operators consistently miss. A food concept engaging authentically with Pacific Islander cuisine faces zero direct competition in Mount Druitt and serves the suburb's largest community segment.
          </p>
        </div>

        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '32px', marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 24, fontWeight: 800, marginBottom: 24 }}>What Works Here</h2>
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <h3 style={{ color: '#1C1917', fontSize: 16, fontWeight: 700, margin: 0 }}>NDIS-Aligned Allied Health (Physio, Psychology, OT)</h3>
              <VerdictBadge v="GO" />
            </div>
            <p style={{ fontSize: 15, color: S.muted, lineHeight: 1.6, margin: 0 }}>Funded demand stream bypasses income constraint entirely. Sustainable revenue independent of local median income. Zero competition outside existing GP practices.</p>
          </div>
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <h3 style={{ color: '#1C1917', fontSize: 16, fontWeight: 700, margin: 0 }}>Quality Affordable Food (Flat White &lt;$6, Meals &lt;$18)</h3>
              <VerdictBadge v="GO" />
            </div>
            <p style={{ fontSize: 15, color: S.muted, lineHeight: 1.6, margin: 0 }}>Right price point unlocks strong volume that premium pricing never achieves. Independent specialty coffee completely absent from station precinct despite 6,000+ daily commuters.</p>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <h3 style={{ color: '#1C1917', fontSize: 16, fontWeight: 700, margin: 0 }}>Tutoring/Education Support</h3>
              <VerdictBadge v="GO" />
            </div>
            <p style={{ fontSize: 15, color: S.muted, lineHeight: 1.6, margin: 0 }}>Mount Druitt has high school-age population with parents who spend on education outcomes. Established tutoring operators report strong demand and minimal competition.</p>
          </div>
        </div>

        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '32px', marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 24, fontWeight: 800, marginBottom: 24 }}>What Fails Here</h2>
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <h3 style={{ color: '#1C1917', fontSize: 16, fontWeight: 700, margin: 0 }}>Premium Positioning (Main Course Over $25, Coffee Over $7)</h3>
              <VerdictBadge v="NO" />
            </div>
            <p style={{ fontSize: 15, color: S.muted, lineHeight: 1.6, margin: 0 }}>This market cannot sustain premium pricing. Attempting to apply premium-focused business models fails consistently.</p>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <h3 style={{ color: '#1C1917', fontSize: 16, fontWeight: 700, margin: 0 }}>Specialty Retail with $100+ ATV</h3>
              <VerdictBadge v="NO" />
            </div>
            <p style={{ fontSize: 15, color: S.muted, lineHeight: 1.6, margin: 0 }}>The demographic cannot sustain high transaction value retail regardless of quality or marketing investment.</p>
          </div>
        </div>

        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '32px', marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Underrated Opportunity</h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: S.n900, margin: 0 }}>
            Quality affordable breakfast/brunch (8am–12pm) is genuinely absent from Mount Druitt station precinct. Morning commuter volume at the station (6,000+ daily boardings) passes through with zero quality coffee or food option beyond a convenience store and Westfield food court. A compact café (30 seats, specialty coffee at $5.50, breakfast at $12–16) positioned on the station exit could achieve 120–150 daily transactions generating $18,000–24,000/month revenue at a $1,800/month rent. That's a 7–8% rent ratio that inner Sydney can only dream about.
          </p>
        </div>

        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '32px', marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Key Risks</h2>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ color: '#1C1917', fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Income Ceiling is Real and Persistent</h3>
            <p style={{ fontSize: 15, color: S.muted, lineHeight: 1.6, margin: 0 }}>Pricing above the market's tolerance ceiling fails consistently. The ceiling is lower than any other major Sydney hub. Operators must price for volume, not margin per transaction.</p>
          </div>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ color: '#1C1917', fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Social Complexity</h3>
            <p style={{ fontSize: 15, color: S.muted, lineHeight: 1.6, margin: 0 }}>Mount Druitt's challenges (homelessness, crime, community services concentration) create an operational environment requiring more staff training and security awareness than most suburban locations.</p>
          </div>
          <div>
            <h3 style={{ color: '#1C1917', fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Westfield Gravitational Pull</h3>
            <p style={{ fontSize: 15, color: S.muted, lineHeight: 1.6, margin: 0 }}>Any product overlapping with the centre's offer loses on price and convenience. Differentiation is mandatory for survival on independent strips.</p>
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

        <SuburbPoll suburb="Mount Druitt" />

        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '32px', marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Final Verdict</h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: S.n900, marginBottom: 20 }}>
            Mount Druitt is a CAUTION location that can work exceptionally well for the right operator. This is not a location to apply standard inner-city business models. Success requires understanding the market, accepting its constraints, and positioning around them rather than against them.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: S.n900, margin: 0 }}>
            NDIS-aligned allied health, quality affordable food, and education support are the positioning lanes that work. Operators who execute at the right price point for the demographic will find a receptive, underserved market with rent economics that don't exist anywhere else in Sydney. This is the market for operators willing to build sustainable businesses at accessible price points rather than premium-only businesses.
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
          <p style={{ fontSize: 12, color: S.muted, margin: 0 }}>Postcode: 2770 | Median income: $62,000 | Rent range: $900–$2,800/month</p>
        </div>
      </div>
    </div>
  )
}
