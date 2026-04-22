'use client'

import Link from 'next/link'
import { useState } from 'react'
import { sydneyForStaticPage } from '@/lib/analyse-data/sydney-hub-scores'

const BONDI = sydneyForStaticPage('bondi')

const S = {
  brand: '#0891B2',
  brandLight: '#06B6D4',
  emerald: '#059669',
  emeraldBg: '#ECFDF5',
  emeraldBdr: '#A7F3D0',
  amber: '#D97706',
  amberBg: '#FFFBEB',
  amberBdr: '#FDE68A',
  red: '#DC2626',
  redBg: '#FEF2F2',
  redBdr: '#FECACA',
  muted: '#475569',
  border: '#E2E8F0',
  n50: '#FAFAF9',
  n100: '#F5F5F4',
  n900: '#1C1917',
  white: '#FFFFFF',
}

type Verdict = 'GO' | 'CAUTION' | 'NO'

function VerdictBadge({ v }: { v: Verdict }) {
  const styles: Record<Verdict, { bg: string; color: string; text: string }> = {
    GO: { bg: S.emeraldBg, color: S.emerald, text: 'GO' },
    CAUTION: { bg: S.amberBg, color: S.amber, text: 'CAUTION' },
    NO: { bg: S.redBg, color: S.red, text: 'NO' },
  }
  const style = styles[v]
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: '600',
        backgroundColor: style.bg,
        color: style.color,
        border: `1px solid ${style.color}`,
      }}
    >
      {style.text}
    </span>
  )
}

interface ScoreBarProps {
  label: string
  value: number
}

function ScoreBar({ label, value }: ScoreBarProps) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontSize: '14px', fontWeight: '600', color: S.n900 }}>{label}</span>
        <span style={{ fontSize: '14px', fontWeight: '700', color: S.brand }}>{value}/100</span>
      </div>
      <div style={{ width: '100%', height: '8px', backgroundColor: S.border, borderRadius: '4px', overflow: 'hidden' }}>
        <div
          style={{
            width: `${value}%`,
            height: '100%',
            backgroundColor: S.brand,
          }}
        />
      </div>
    </div>
  )
}

interface SuburbCardProps {
  name: string
  slug: string
  score: number
  verdict: Verdict
}

function SuburbCard({ name, slug, score, verdict }: SuburbCardProps) {
  return (
    <Link
      href={`/analyse/sydney/${slug}`}
      style={{
        display: 'block',
        padding: '16px',
        backgroundColor: S.white,
        borderRadius: '8px',
        border: `1px solid ${S.border}`,
        textDecoration: 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = S.brand
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(8, 145, 178, 0.1)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = S.border
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h4 style={{ fontSize: '14px', fontWeight: '600', color: S.n900, margin: 0 }}>{name}</h4>
        <span style={{ fontSize: '18px', fontWeight: '700', color: S.brand }}>{score}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <VerdictBadge v={verdict} />
        <span style={{ fontSize: '11px', color: S.brand, fontWeight: '600' }}>Compare →</span>
      </div>
    </Link>
  )
}

interface SuburbPollProps {
  suburb: string
}

function SuburbPoll({ suburb }: SuburbPollProps) {
  const [voted, setVoted] = useState<number | null>(null)
  const [votes, setVotes] = useState<number[]>([54, 32, 14])

  const handleVote = (index: number): void => {
    if (voted === null) {
      const newVotes = [...votes]
      newVotes[index]++
      setVotes(newVotes)
      setVoted(index)
    }
  }

  const total = votes.reduce((a, b) => a + b, 0)
  const options = ['Yes', 'Maybe', 'No']

  return (
    <div style={{ padding: '24px', backgroundColor: S.n50, borderRadius: '8px', border: `1px solid ${S.border}` }}>
      <h3 style={{ fontSize: '16px', fontWeight: '600', color: S.n900, marginBottom: '16px' }}>
        Would you open a business in {suburb}?
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
        {options.map((option, i) => (
          <div
            key={option}
            onClick={() => handleVote(i)}
            style={{
              padding: '12px',
              backgroundColor: S.white,
              borderRadius: '6px',
              border: voted === i ? `2px solid ${S.brand}` : `1px solid ${S.border}`,
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              if (voted === null) {
                e.currentTarget.style.borderColor = S.brand
              }
            }}
            onMouseLeave={(e) => {
              if (voted === null) {
                e.currentTarget.style.borderColor = S.border
              }
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '14px', fontWeight: '600', color: S.n900 }}>{option}</span>
              <span style={{ fontSize: '12px', color: S.muted }}>
                {total > 0 ? `${Math.round((votes[i] / total) * 100)}%` : '0%'}
              </span>
            </div>
            <div style={{ width: '100%', height: '6px', backgroundColor: S.border, borderRadius: '3px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${total > 0 ? (votes[i] / total) * 100 : 0}%`,
                  height: '100%',
                  backgroundColor: i === 0 ? S.emerald : i === 1 ? S.amber : S.red,
                }}
              /></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function BondiPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': ['Article', 'FAQPage'],
    headline: 'Bondi Beach Business Analysis: Summer Peak & Winter Reality',
    description: 'Deep analysis of Bondi for business location decisions. Seasonal economics, tourism impact, wellness sector strength, and realistic year-round models.',
    author: { '@type': 'Organization', name: 'Locatalyze' },
    datePublished: '2025-03-01',
    dateModified: '2026-03-24',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <section
        style={{
          background: `linear-gradient(135deg, #0E7490 0%, ${S.brand} 50%, ${S.brandLight} 100%)`,
          color: S.white,
          padding: '48px 24px',
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px', opacity: 0.9 }}>
            Location Guides &gt; Sydney &gt; Bondi
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <h1 style={{ fontSize: '36px', fontWeight: '700', margin: 0 }}>Bondi</h1>
            <span style={{ fontSize: '32px', fontWeight: '700' }}>{BONDI.compositeScore}</span>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <VerdictBadge v={BONDI.verdict === 'RISKY' ? 'NO' : BONDI.verdict} />
          </div>
          <p style={{ fontSize: '16px', lineHeight: '1.6', opacity: 0.95, margin: 0 }}>
            Beach culture with dual seasonal personality. Summer (October–April) delivers spectacular foot traffic. Winter reveals true local resident demographic. Operators who ignore seasonality fail; those who model both seasons properly thrive.
          </p>
        </div>
      </section>

      <section style={{ padding: '32px 24px', backgroundColor: S.n50 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ padding: '20px', borderRadius: '8px', border: `1px solid ${S.emerald}`, backgroundColor: S.emeraldBg }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: S.emerald, marginBottom: '8px', margin: 0 }}>
              Quick Verdict
            </h3>
            <p style={{ fontSize: '14px', color: S.n900, lineHeight: '1.6', margin: 0 }}>
              Bondi is a GO with understanding of seasonal economics. Summer foot traffic is exceptional (25,000+ daily Campbell Parade). Winter traffic drops 35–40%. Rents are high ($6,000–14,000 monthly premium locations) but justified by summer volume for hospitality and tourism retail. Health and wellness is the year-round opportunity — physio, sports massage, reformer pilates perform strongly regardless of season. Most operators fail because they plan for summer fantasy and can't sustain winter reality. Build your model around winter baseline and summer is bonus.
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px', color: S.n900 }}>
            Model scores (same engine as the Sydney hub)
          </h2>
          <p style={{ fontSize: '13px', color: S.muted, margin: '0 0 20px 0', lineHeight: 1.6, maxWidth: 720 }}>
            The headline number is one composite; below are the café, restaurant, and retail model scores (0–100 each) from the same five factors.
          </p>
          <ScoreBar label="Café" value={BONDI.cafe} />
          <ScoreBar label="Restaurant" value={BONDI.restaurant} />
          <ScoreBar label="Retail" value={BONDI.retail} />
        </div>
      </section>

      <section style={{ padding: '48px 24px', backgroundColor: S.n50 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: S.n900 }}>
            Business Environment
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', fontSize: '16px', lineHeight: '1.7', color: S.n900 }}>
            <p>
              Bondi's business environment has a critical dual personality. October–April is summer: spectacular foot traffic from tourists (domestic and international) and local residents. Campbell Parade and Hall Street generate 20,000–25,000 daily foot traffic. May–August is winter: foot traffic drops 35–40% as tourists depart and local residents stay home. The operators who fail open for the summer vision and can't sustain winter. Operators who succeed model both seasons honestly and build sustainable cost structures around winter baseline.
            </p>
            <p>
              Tourism is a double-edged sword. Summer tourists create foot traffic; they also create economic friction. A tourist will spend $10 on a coffee; a local resident will spend $10 on a coffee. A tourist won't spend $40 on a t-shirt; a local resident will. Summer tourism sustains quick-service hospitality; it destroys specialty retail economics. Concepts built on tourism (summer-peaking ice cream, souvenir retail) generate brilliant summer numbers and crash in winter.
            </p>
            <p>
              Local permanent resident demographic is the true long-term value. Median age 33, median income $88k, health-conscious and above-average gym/wellness spending. This demographic sustains physio, sports massage, reformer pilates year-round regardless of tourism. Most operators overlook the wellness sector because it doesn't feel prestigious, but it's the only category immune to seasonal collapse. A physio with summer tourism spike and strong winter local base builds sustainable profitability.
            </p>
            <p>
              Rent is high because of summer vision. A Campbell Parade ground-floor space costs $12,000–14,000 monthly. Secondary streets (Hall, Gould, Roscoe) cost $6,000–8,000. These rents assume summer economics will justify them. Winter, rents become crushing. Operators with summer tourism concepts break even or lose money in winter. Strategic positioning: either target year-round resident demographic (wellness, local retail) or accept summer profitability subsidizes winter losses.
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: S.n900 }}>
            Competition Analysis
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', fontSize: '16px', lineHeight: '1.7', color: S.n900 }}>
            <p>
              Competition is consolidated and brand-driven. Established hospitality groups own the premium positions (high-end cafés, restaurants). Independent operators struggle to compete in hospitality. Wellness and allied health are less consolidated — independent physios and trainers thrive. Retail is mixed: some areas are dominated by chains; some have independent retail gaps.
            </p>
            <p>
              Seasonal competition is less intense than year-round markets because most competitors are fighting for summer revenue, leaving winter underserved. A concept that thrives in winter (wellness, locals-focused hospitality) faces less competition than a summer-dependent concept. This is actually an advantage for operators willing to embrace winter economics instead of fighting them.
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 24px', backgroundColor: S.n50 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: S.n900 }}>
            Demographics & Spending Power
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', fontSize: '16px', lineHeight: '1.7', color: S.n900 }}>
            <p>
              Bondi's local permanent resident demographic (median age 33, median income $88k) is health-conscious and active. Gym membership, wellness spending, and healthy food spending are above-average. This demographic is fundamentally different from the summer tourist demographic, which is more casual and price-sensitive. Year-round operators must understand they're serving locals, not tourists.
            </p>
            <p>
              Foot traffic is heavily weighted to weekends and summer weekdays. Peak times are 10am–1pm (brunch/coffee for tourists and locals) and 4–6pm (beach crowd post-swim). Weekday lunch and dinner are materially softer. Operators depending on weekday lunch trade (like CBD locations) will be disappointed in Bondi. Build models around weekend brunch and summer dinner, not weekday lunch.
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: S.n900 }}>
            What Works Here
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
            <div style={{ padding: '20px', backgroundColor: S.white, borderRadius: '8px', border: `1px solid ${S.border}` }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: S.brand, marginBottom: '8px' }}>Health & Wellness</h3>
              <p style={{ fontSize: '14px', color: S.muted, lineHeight: '1.6', margin: 0 }}>
                Physio, sports massage, reformer pilates, personal training. Year-round local client base sustains profitability regardless of tourism. Local resident demographic spends liberally on wellness.
              </p>
            </div>
            <div style={{ padding: '20px', backgroundColor: S.white, borderRadius: '8px', border: `1px solid ${S.border}` }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: S.brand, marginBottom: '8px' }}>Beach-Adjacent Hospitality</h3>
              <p style={{ fontSize: '14px', color: S.muted, lineHeight: '1.6', margin: 0 }}>
                Summer-peaking café/restaurant works if you build profitability around summer peak and accept winter is lower. Quick-service converts better than fine dining.
              </p>
            </div>
            <div style={{ padding: '20px', backgroundColor: S.white, borderRadius: '8px', border: `1px solid ${S.border}` }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: S.brand, marginBottom: '8px' }}>Tourism & Summer Retail</h3>
              <p style={{ fontSize: '14px', color: S.muted, lineHeight: '1.6', margin: 0 }}>
                Souvenir retail, ice cream, beach retail thrive in summer. Requires managing winter decline or accepting seasonal model.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 24px', backgroundColor: S.n50 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: S.n900 }}>
            What Fails Here
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
            <div style={{ padding: '20px', backgroundColor: S.white, borderRadius: '8px', border: `1px solid ${S.border}` }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: S.red, marginBottom: '8px' }}>Winter-Only Concepts</h3>
              <p style={{ fontSize: '14px', color: S.muted, lineHeight: '1.6', margin: 0 }}>
                Concepts dependent on summer tourism fail in winter (May–August). 35–40% foot traffic drop is severe. Rent multiples assume 12-month economics; winter collapse kills margins.
              </p>
            </div>
            <div style={{ padding: '20px', backgroundColor: S.white, borderRadius: '8px', border: `1px solid ${S.border}` }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: S.red, marginBottom: '8px' }}>Premium Retail Competing with Tourism</h3>
              <p style={{ fontSize: '14px', color: S.muted, lineHeight: '1.6', margin: 0 }}>
                Boutique retail underperforms because tourists are price-sensitive. Local residents are insufficient to sustain premium retail rents.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: S.n900 }}>
            Underrated Opportunities
          </h2>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: S.n900, marginBottom: '16px' }}>
            Wellness and allied health sectors are genuinely underserved relative to local resident demand. The local permanent demographic (median age 33, health-conscious, above-average gym spending) sustains strong allied health markets year-round. Physio, sports massage, reformer pilates, personal training — all perform well in both summer and winter. Most new operators ignore these sectors because they're less visible than hospitality. But the economics are better: lower rent requirements, higher margins, more stable year-round demand.
          </p>
        </div>
      </section>

      <section style={{ padding: '48px 24px', backgroundColor: S.n50 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: S.n900 }}>
            Key Risks
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
            <div style={{ padding: '16px', backgroundColor: S.white, borderRadius: '8px', border: `1px solid ${S.border}` }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: S.red, marginBottom: '6px' }}>Summer-Winter Revenue Cliff</h3>
              <p style={{ fontSize: '14px', color: S.muted, margin: 0 }}>
                35–40% revenue drop from peak (December) to trough (July) is severe. Most operators underestimate this impact. Summer-dependent concepts fail during winter.
              </p>
            </div>
            <div style={{ padding: '16px', backgroundColor: S.white, borderRadius: '8px', border: `1px solid ${S.border}` }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: S.red, marginBottom: '6px' }}>Tourism Price Pressure</h3>
              <p style={{ fontSize: '14px', color: S.muted, margin: 0 }}>
                Tourists are price-sensitive. Summer foot traffic creates downward pressure on premium positioning. Margins compress despite higher volumes.
              </p>
            </div>
            <div style={{ padding: '16px', backgroundColor: S.white, borderRadius: '8px', border: `1px solid ${S.border}` }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: S.red, marginBottom: '6px' }}>Brand Inflation</h3>
              <p style={{ fontSize: '14px', color: S.muted, margin: 0 }}>
                Bondi's brand encourages above-market rents that don't reflect winter economics. Landlords are pricing for summer fantasy; winter reality is 40% lower.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: S.n900 }}>
            Compare with Nearby Suburbs
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            <SuburbCard name="Surry Hills" slug="surry-hills" score={87} verdict="GO" />
            <SuburbCard name="North Sydney" slug="north-sydney" score={76} verdict="GO" />
            <SuburbCard name="Chatswood" slug="chatswood" score={82} verdict="GO" />
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 24px', backgroundColor: S.n50 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <SuburbPoll suburb="Bondi" />
        </div>
      </section>

      <section style={{ padding: '48px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: S.n900 }}>
            Final Verdict
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', fontSize: '16px', lineHeight: '1.7', color: S.n900 }}>
            <p>
              Bondi is a GO for operators who understand and embrace seasonal economics. Summer foot traffic is genuinely exceptional. But 35–40% winter decline is unavoidable and must be planned for honestly. The operators who fail are those who plan for summer fantasy and can't bridge winter. The operators who succeed are those who center their model on winter reality (local resident base) and treat summer as bonus revenue.
            </p>
            <p>
              If opening in Bondi, position yourself for the year-round local resident demographic, not the summer tourist demographic. Health and wellness are the safest year-round bets. Build your financial model around winter baseline (May–August) and accept summer carries you through. Negotiate rent based on 12-month economics, not summer peak. Understand that Campbell Parade premium rents only make sense if you're capturing significant summer tourism; secondary streets are better value for year-round residents. Bondi can deliver 20–25% margins for well-disciplined wellness operators; it's expensive and painful for summer-dependent hospitality.
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 24px', backgroundColor: S.emeraldBg }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px', color: S.emerald }}>
            Get Bondi-specific data
          </h2>
          <p style={{ fontSize: '14px', color: S.emerald, marginBottom: '16px', lineHeight: '1.6' }}>
            Analyse your specific Bondi location to see seasonal foot traffic patterns, local demographic breakdown, and realistic 12-month revenue modeling.
          </p>
          <Link
            href="/onboarding"
            style={{
              display: 'inline-block',
              padding: '12px 28px',
              backgroundColor: S.emerald,
              color: S.white,
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '600',
            }}
          >
            Analyse free →
          </Link>
        </div>
      </section>

      <section style={{ padding: '32px 24px', backgroundColor: S.n50, borderTop: `1px solid ${S.border}` }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', fontSize: '13px', color: S.muted, display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Link href="/analyse/sydney" style={{ color: S.brand, textDecoration: 'none', fontWeight: '600' }}>
            Back to Sydney Hub
          </Link>
          <Link href="/analyse/sydney/surry-hills" style={{ color: S.brand, textDecoration: 'none', fontWeight: '600' }}>
            Surry Hills Analysis →
          </Link>
          <Link href="/analyse/sydney/chatswood" style={{ color: S.brand, textDecoration: 'none', fontWeight: '600' }}>
            Chatswood Analysis →
          </Link>
        </div>
      </section>
    </>
  )
}
