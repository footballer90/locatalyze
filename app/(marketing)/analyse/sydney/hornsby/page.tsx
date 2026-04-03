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
      <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Would you open a business in {suburb}?</h3>
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
  headline: 'Hornsby Business Location Analysis - Upper North Shore Hub',
  description: 'Commercial real estate analysis for Hornsby Sydney. Upper North Shore location intelligence, rents, demographics, and business opportunities.',
  image: 'https://locatalyze.com/og-hornsby.png',
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
      name: 'Is Hornsby a good suburb for a small business?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. Hornsby anchors the Upper North Shore with a 180,000+ person catchment. Rents are 20-25% below Chatswood despite comparable demographics, creating a favorable rent-to-catchment ratio.' },
    },
    {
      '@type': 'Question',
      name: 'How much does commercial space cost in Hornsby?',
      acceptedAnswer: { '@type': 'Answer', text: 'George Street / Florence Street main strips: $3,500–$6,500/month. Secondary locations: $2,500–$4,200/month. Significantly below North Shore equivalents.' },
    },
    {
      '@type': 'Question',
      name: 'What businesses work on the Hornsby strip?',
      acceptedAnswer: { '@type': 'Answer', text: 'Allied health (physio, dental, psychology), specialty grocery/deli, and family-format cafés with strong brunch positioning succeed. Businesses that position around Westfield rather than against it outperform.' },
    },
    {
      '@type': 'Question',
      name: 'What is the Hornsby Upper North Shore catchment like?',
      acceptedAnswer: { '@type': 'Answer', text: 'Hornsby serves 180,000+ residents from Turramurra, Pymble, Gordon, and Wahroonga — some of Sydney\'s highest-income suburbs. Median household income: $92,000. Primary customer is 35-55, family-oriented, quality-focused.' },
    },
    {
      '@type': 'Question',
      name: 'Is Hornsby competitive for cafés?',
      acceptedAnswer: { '@type': 'Answer', text: 'Moderately. Four independent quality operators and two chains create demonstrable room for one or two additional positions. Differentiation through table service and proper lunch menus accesses a different customer lane.' },
    },
  ],
}

const SCORE_BARS: Array<{ label: string; value: number }> = [
  { label: 'Foot Traffic', value: 77 },
  { label: 'Demographics', value: 76 },
  { label: 'Rent Viability', value: 74 },
  { label: 'Competition', value: 70 },
]

const NEARBY: Array<{ name: string; slug: string; score: number; verdict: Verdict }> = [
  { name: 'Chatswood', slug: 'chatswood', score: 82, verdict: 'GO' },
  { name: 'Ryde', slug: 'ryde', score: 77, verdict: 'GO' },
  { name: 'North Sydney', slug: 'north-sydney', score: 76, verdict: 'GO' },
]

export default function HornsbyPage() {
  return (
    <div style={{ background: S.n50, minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA_ARTICLE) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA_FAQ) }} />

      <nav style={{ background: S.white, borderBottom: `1px solid ${S.border}`, padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ fontSize: 18, fontWeight: 800, color: S.brand, textDecoration: 'none' }}>Locatalyze</Link>
        <Link href="/onboarding" style={{ fontSize: 14, fontWeight: 600, color: S.brand, textDecoration: 'none', padding: '8px 16px', border: `1px solid ${S.brand}`, borderRadius: 8 }}>Analyse your location</Link>
      </nav>

      <div style={{ background: `linear-gradient(135deg, ${S.brand} 0%, ${S.brandLight} 100%)`, padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ fontSize: 14, color: S.white, marginBottom: 16, opacity: 0.9 }}>
            <Link href="/analyse/sydney" style={{ color: S.white, textDecoration: 'none' }}>Sydney</Link> / Hornsby
          </div>
          <h1 style={{ fontSize: 48, fontWeight: 900, color: S.white, marginBottom: 24 }}>Hornsby</h1>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
            <VerdictBadge v="GO" />
            <div style={{ fontSize: 32, fontWeight: 900, color: S.white }}>72</div>
          </div>
          <p style={{ fontSize: 18, color: S.white, opacity: 0.95, margin: 0 }}>Upper North Shore's best-value hub. Strong demographics, moderate competition, family-oriented market.</p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '32px', marginBottom: 48 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Quick Verdict</h2>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: S.n900, marginBottom: 16 }}>
            Hornsby anchors the Upper North Shore catchment of 180,000+ residents at 20–25% lower rents than Chatswood despite comparable demographics. This gap creates an unusual window for businesses that can draw the Upper North Shore demographic without paying premium positioning costs.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: S.n900, margin: 0 }}>
            Westfield Hornsby defines the competitive dynamic. Independent operators who succeed position around the centre rather than against it, occupying secondary strips with product categories the centre doesn't serve well. Reliability and quality execution reward you more than concept innovation in this market.
          </p>
        </div>

        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '32px', marginBottom: 48 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 32 }}>Location Scores</h2>
          {SCORE_BARS.map(bar => <ScoreBar key={bar.label} label={bar.label} value={bar.value} />)}
        </div>

        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '32px', marginBottom: 48 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Business Environment</h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: S.n900, marginBottom: 20 }}>
            Hornsby's commercial environment is North Shore's best-kept rent secret. The suburb anchors the Upper North Shore catchment of 180,000+ residents, yet commercial rents are 20–25% below Chatswood despite comparable demographic incomes. This gap creates an unusual window for businesses that can draw the Upper North Shore demographic without paying for proximity to the more obvious Chatswood or North Sydney addresses.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: S.n900, marginBottom: 20 }}>
            Westfield Hornsby defines the competitive dynamic. The centre occupies the primary retail position; independent operators who try to compete directly consistently underperform. Successful independent operators position around Westfield rather than against it, occupying secondary strips on George Street and Florence Street. Product category differentiation is critical: specialty food, niche retail, allied health — categories the centre doesn't serve well — are where independent positioning succeeds.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: S.n900, margin: 0 }}>
            The Upper North Shore demographic (median 41 years, $92k income) values reliability, quality, and service over novelty. Trend-driven concepts that work in Surry Hills face more resistance here; consistent quality execution rewards you more than concept innovation. This is a market for sustainable, well-executed positioning rather than experimental concepts.
          </p>
        </div>

        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '32px', marginBottom: 48 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Competition Analysis</h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: S.n900, marginBottom: 20 }}>
            Competition is moderate by Sydney standards. The café market has four independent quality operators and two strong chain presences. This leaves demonstrable room for one or two additional quality café positions without immediate saturation. Key differentiation available is format: a café with strong table service and a proper lunch menu competes in a different lane from the Westfield food court.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: S.n900, margin: 0 }}>
            The restaurant market skews toward family dining — Italian, Chinese, and Thai at accessible price points ($20–35 per person). Premium dining above $60/pp has a thin customer base. A restaurant positioned at the $35–50/pp range (quality without fine dining formality) occupies optimal positioning for the demographic.
          </p>
        </div>

        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '32px', marginBottom: 48 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Demographics</h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: S.n900, marginBottom: 20 }}>
            The Upper North Shore catchment that Hornsby anchors includes some of Sydney's highest-income postcodes — Turramurra, Pymble, Gordon, Wahroonga. These residents shop and dine in Hornsby as their closest major centre. While residential median income of $92,000 is representative, Hornsby's actual spending power as a trading area draws from a much higher income distribution than its own residential data suggests.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: S.n900, margin: 0 }}>
            Families with school-age children dominate the demographic. Weekend lunch and Saturday morning trade are driven by family groups who combine shopping (Westfield) with hospitality. A café or restaurant positioned for family groups — accessible seating, children's menu, family-friendly ambiance — accesses Hornsby's highest-frequency customer segment.
          </p>
        </div>

        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '32px', marginBottom: 48 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>What Works Here</h2>
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Allied Health (Physio, Dental, Psychology, Women's Health)</h3>
              <VerdictBadge v="GO" />
            </div>
            <p style={{ fontSize: 15, color: S.muted, lineHeight: 1.6, margin: 0 }}>The 41-year median age, $92k income, and family structure create consistent demand. This sector is Hornsby's most durable and recession-resistant business type with strong growth runway.</p>
          </div>
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Specialty Grocery/Deli</h3>
              <VerdictBadge v="GO" />
            </div>
            <p style={{ fontSize: 15, color: S.muted, lineHeight: 1.6, margin: 0 }}>The demographic spends above average on quality ingredients. An independent deli or specialty grocer with strong artisanal product curation fills a gap that Westfield's supermarkets cannot serve.</p>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Family-Format Café with Brunch Emphasis</h3>
              <VerdictBadge v="GO" />
            </div>
            <p style={{ fontSize: 15, color: S.muted, lineHeight: 1.6, margin: 0 }}>Saturday and Sunday brunch is Hornsby's most reliable revenue window. A café that consistently seats 60–80 covers for weekend brunch generates $25,000–35,000/month in weekend trade alone.</p>
          </div>
        </div>

        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '32px', marginBottom: 48 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>What Fails Here</h2>
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Trendy Concept Bars or Late-Night Hospitality</h3>
              <VerdictBadge v="NO" />
            </div>
            <p style={{ fontSize: 15, color: S.muted, lineHeight: 1.6, margin: 0 }}>Hornsby empties after 8pm Monday–Thursday. The demographic is not a nightlife market. Operators needing evening revenue to survive will be disappointed by thin trade.</p>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>High-Fashion Boutique Retail</h3>
              <VerdictBadge v="NO" />
            </div>
            <p style={{ fontSize: 15, color: S.muted, lineHeight: 1.6, margin: 0 }}>Hornsby's demographic is quality-oriented but not fashion-forward. Designer boutiques that work in Double Bay or Paddington lack the critical mass here.</p>
          </div>
        </div>

        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '32px', marginBottom: 48 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Underrated Opportunity</h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: S.n900, margin: 0 }}>
            Hornsby's 180,000-person Upper North Shore catchment has zero quality specialty coffee roasters with on-site roasting. The demographic (educated, $90k+ income, craft-focused) is the exact customer for a roastery-café concept. Rent economics ($3,500–4,500/month on George Street) make the margin case easily. This format exists in Newtown, Surry Hills, and the Inner West — the Upper North Shore is conspicuously absent from the specialty roastery map, creating a genuine white-space opportunity.
          </p>
        </div>

        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '32px', marginBottom: 48 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Key Risks</h2>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Westfield Dependency</h3>
            <p style={{ fontSize: 15, color: S.muted, lineHeight: 1.6, margin: 0 }}>Foot traffic is Westfield-driven, but competing with Westfield on product is a losing strategy. Navigation requires careful positioning around rather than against the centre.</p>
          </div>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Sunday Trading is Thin</h3>
            <p style={{ fontSize: 15, color: S.muted, lineHeight: 1.6, margin: 0 }}>Businesses that need strong Sunday revenue will find Hornsby's quieter-than-expected Sunday trade a recurring disappointment. Revenue modeling should account for the Sunday dip.</p>
          </div>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Rent Growth Trajectory</h3>
            <p style={{ fontSize: 15, color: S.muted, lineHeight: 1.6, margin: 0 }}>Westfield's 2025 expansion increased the centre's gravitational pull. Surrounding commercial rents typically lift over a 12–24 month lag. Current rents may not reflect 2027 reality.</p>
          </div>
        </div>

        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '32px', marginBottom: 48 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Compare Nearby</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
            {NEARBY.map(suburb => (
              <Link key={suburb.slug} href={`/analyse/sydney/${suburb.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: S.n50, border: `1px solid ${S.border}`, borderRadius: 12, padding: '20px', cursor: 'pointer', transition: 'border-color 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.borderColor = S.brand)} onMouseLeave={(e) => (e.currentTarget.style.borderColor = S.border)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{suburb.name}</h3>
                    <VerdictBadge v={suburb.verdict} />
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: S.brand }}>{suburb.score}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <SuburbPoll suburb="Hornsby" />

        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '32px', marginBottom: 48 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Final Verdict</h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: S.n900, marginBottom: 20 }}>
            Hornsby is a GO location. The combination of strong Upper North Shore catchment demographics, accessible rents relative to Chatswood, and moderate independent competition creates a favorable entry environment for operators who can position around (not against) Westfield's retail gravity.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: S.n900, margin: 0 }}>
            Success requires understanding that this is a reliability and quality market, not an innovation market. Allied health, specialty retail, and family-format hospitality are the positioning lanes that succeed. This is North Shore's best-value major hub for the capital investment required.
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
          <p style={{ fontSize: 12, color: S.muted, margin: 0 }}>Postcode: 2077 | Median income: $92,000 | Rent range: $2,500–$6,500/month</p>
        </div>
      </div>
    </div>
  )
}
