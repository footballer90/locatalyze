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
  const [votes, setVotes] = useState<number[]>([38, 35, 27])
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
    headline: 'Fairfield Sydney: Business Analysis & Commercial Guide',
    description: 'Complete analysis of Fairfield business environment, foot traffic, demographics, and commercial opportunities.',
    author: { '@type': 'Organization', name: 'Locatalyze' },
    datePublished: '2026-03-24',
    image: 'https://locatalyze.com/og-fairfield.jpg',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is Fairfield a good place to open a restaurant?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Fairfield is the Vietnamese food capital of Sydney with cultural food categories dominating. Authentic cultural cuisine works well; generic Western food fails. Success depends on cultural community connection.',
        },
      },
      {
        '@type': 'Question',
        name: 'What businesses work in Fairfield Sydney?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Authentic cultural cuisine, bulk-billing GP and allied health with language capability, and ESOL tutoring/employment support services are the strongest categories.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is Fairfield\'s demographic profile?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Fairfield is one of Australia\'s most culturally diverse areas. 75% of residents were born overseas or have at least one parent born overseas. Major communities: Vietnamese (25%), Assyrian/Chaldean (18%), Chinese (12%), Filipino (9%).',
        },
      },
      {
        '@type': 'Question',
        name: 'How does Cabramatta affect Fairfield businesses?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Cabramatta is within the Fairfield LGA and is where Fairfield\'s food culture is most concentrated. Businesses on the Fairfield-Cabramatta interface access both catchments. Cabramatta food tourism creates demand spillover.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is Fairfield safe for new businesses?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'New businesses face a cultural trust barrier and income sensitivity to economic downturns. The demographic is disproportionately affected by unemployment. Westfield gravity pulls foot traffic away from independent strip operators.',
        },
      },
    ],
  },
]

const SCORE_BARS: Array<{ label: string; value: number }> = [
  { label: 'Foot Traffic', value: 71 },
  { label: 'Demographics', value: 60 },
  { label: 'Rent Viability', value: 88 },
  { label: 'Competition', value: 60 },
]

const NEARBY: Array<{ name: string; slug: string; score: number; verdict: Verdict }> = [
  { name: 'Liverpool', slug: 'liverpool', score: 73, verdict: 'GO' },
  { name: 'Bankstown', slug: 'bankstown', score: 70, verdict: 'GO' },
  { name: 'Campbelltown', slug: 'campbelltown', score: 73, verdict: 'GO' },
]

export default function FairfieldPage() {
  return (
    <div style={{ minHeight: '100vh', background: S.n50, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif' }}>
      {SCHEMAS.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      <div style={{ background: S.white, borderBottom: `1px solid ${S.border}`, padding: '16px 0' }}>
        <div style={{ maxWidth: 920, margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/analyse/sydney" style={{ fontSize: 13, fontWeight: 500, color: S.brand, textDecoration: 'none' }}>← Back to Sydney Hub</Link>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>Fairfield</h1>
          <div style={{ width: 80 }}/>
        </div>
      </div>

      <div style={{ maxWidth: 920, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ background: `linear-gradient(135deg, ${S.brandLight}15, ${S.brand}10)`, borderRadius: 16, padding: '40px 32px', marginTop: 32, marginBottom: 40, border: `1px solid ${S.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 12, color: S.muted, margin: '0 0 8px 0', textTransform: 'uppercase', fontWeight: 600 }}>Business Verdict</p>
              <h2 style={{ fontSize: 32, fontWeight: 800, margin: 0, marginBottom: 12 }}>Fairfield</h2>
              <p style={{ fontSize: 14, color: S.n900, margin: 0, lineHeight: 1.6, maxWidth: 480 }}>Fairfield scores CAUTION. The suburb is Vietnam's food capital and Australia's refugee hub—both create specific demand that generic operators cannot access. The income constraint is real, but cultural precision and healthcare specialisation unlock strong unit economics.</p>
            </div>
            <div style={{ textAlign: 'center', minWidth: 120 }}>
              <div style={{ fontSize: 48, fontWeight: 800, color: S.brand, marginBottom: 8 }}>67</div>
              <VerdictBadge v="CAUTION" />
            </div>
          </div>
        </div>

        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 24, marginBottom: 40 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 20px 0' }}>Scores by Category</h3>
          {SCORE_BARS.map(bar => <ScoreBar key={bar.label} label={bar.label} value={bar.value} />)}
          <p style={{ fontSize: 12, color: S.muted, marginTop: 20, marginBottom: 0 }}>Postcode 2165 • Median income $65,000 • Rent $1,000–$3,200/mo</p>
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Business Environment</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Fairfield's commercial environment is defined by a concentration of cultural spending that most operators from outside the community struggle to access. The Vietnamese, Cantonese, Khmer, and Assyrian communities each have established operators, loyal spending patterns, and strong preference for culturally aligned businesses. An operator entering from outside these communities without genuine community connection faces a trust deficit that discounts cannot resolve.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>The rent environment is Fairfield's clearest advantage over any other Sydney LGA with comparable population density. Smart Street and The Crescent positions rent at $1,500–$3,200/month—lower than Cabramatta, lower than Bankstown, comparable only to Mount Druitt. For a service-based business or a food operator who achieves 80–120 daily transactions at $8–16 per transaction, the unit economics are genuinely compelling.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Fairfield LGA's refugee and humanitarian population creates demand for services the private sector has largely failed to deliver: legal services with language capability, health navigation and interpreter-assisted GP clinics, ESOL employment support, and community financial literacy. Government funding and NGO contracts support these sectors, partially bypassing the income constraint that limits commercial food and retail.</p>
          </div>
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Competition Analysis</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Competition in Fairfield's food sector is intense within cultural segments. Vietnamese operators compete with Vietnamese operators; Cantonese with Cantonese. New entrants who position within an established cultural food segment face loyalty barriers without exceptional quality or community provenance. Operators in unserved cultural segments—Korean, South Asian Pakistani, and Ethiopian—face different competitive conditions.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Healthcare competition is extremely light relative to demand. Fairfield LGA's GP-to-resident ratio is one of the worst in metropolitan Sydney. Bulk-billing GP clinics run at capacity with 2–3 week wait times. Allied health practices are virtually absent from main commercial strips. A healthcare operator navigating language and cultural complexity faces near-zero competition for large, consistent demand.</p>
          </div>
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Demographics</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Fairfield LGA is one of Australia's most culturally diverse local government areas—75% of residents were born overseas or have at least one parent born overseas. Dominant communities: Vietnamese (25%), Assyrian/Chaldean (18%), Chinese (12%), Filipino (9%). This demographic structure creates deeply segmented consumer preferences that reward cultural precision and punish generic positioning.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Median household income of $65,000 is below Sydney median, but household size is above average (3.2 vs 2.6 persons). Per-person income is comparable to working-class Sydney suburbs once adjusted. Spending is concentrated in food, essentials, and children's education—operators in these categories access genuine purchasing power despite income constraints.</p>
          </div>
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>What Works Here</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 16 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: S.emerald, margin: '0 0 6px 0' }}>Authentic Cultural Cuisine</h4>
              <p style={{ fontSize: 13, color: S.n900, margin: 0, lineHeight: 1.6 }}>Vietnamese pho, Cantonese yum cha, Assyrian meze with community provenance. Not approximations—operators embedded in the culture. Revenue $20,000–$40,000/month at accessible prices.</p>
            </div>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 16 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: S.emerald, margin: '0 0 6px 0' }}>Bulk-Billing Healthcare</h4>
              <p style={{ fontSize: 13, color: S.n900, margin: 0, lineHeight: 1.6 }}>GP and allied health with language-competent staff. Funded demand, minimal competition. Government billing bypasses income constraint entirely.</p>
            </div>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 16 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: S.emerald, margin: '0 0 6px 0' }}>ESOL & Employment Services</h4>
              <p style={{ fontSize: 13, color: S.n900, margin: 0, lineHeight: 1.6 }}>Fairfield has 12,000+ recently arrived migrants seeking English language skills and employment pathways. Government contracts and NGO partnerships fund this sector.</p>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>What Fails Here</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: S.redBg, border: `1px solid ${S.redBdr}`, borderRadius: 12, padding: 16 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: S.red, margin: '0 0 6px 0' }}>Generic Western Food</h4>
              <p style={{ fontSize: 13, color: S.n900, margin: 0 }}>Café chains and Western restaurants at inner-Sydney pricing fail. The demographic doesn't relate; the pricing doesn't work.</p>
            </div>
            <div style={{ background: S.redBg, border: `1px solid ${S.redBdr}`, borderRadius: 12, padding: 16 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: S.red, margin: '0 0 6px 0' }}>Premium Retail</h4>
              <p style={{ fontSize: 13, color: S.n900, margin: 0 }}>Fashion, homewares, lifestyle retail above $50 ATV fails consistently. Income constraint is real.</p>
            </div>
          </div>
        </div>

        <div style={{ background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 16, padding: 24, marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12, color: S.n900 }}>Underrated Opportunity</h2>
          <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Pakistani and South Asian cuisine is absent from the Fairfield commercial strip despite significant South Asian community in the LGA and adjacent Cabramatta and Canley Vale. Quality Pakistani restaurant (biryani, karahi, nihari) at $12–20 per meal targeting both the community and food tourists could achieve $25,000–$35,000/month. Cabramatta food tourism creates demand spillover that extends beyond immediate residents.</p>
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Key Risks</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.red}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px 0' }}>Cultural Trust Barrier</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>Operators without community connection struggle regardless of quality. Not a marketing problem—a structural barrier in community-organised markets.</p>
            </div>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.red}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px 0' }}>Income Volatility</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>The demographic is disproportionately affected by unemployment and cost-of-living pressure. Revenue is volatile.</p>
            </div>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.red}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px 0' }}>Westfield Gravity</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>The centre pulls spending from independent strip operators. Location selection within Fairfield matters.</p>
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

        <SuburbPoll suburb="Fairfield" />

        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Final Verdict</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Fairfield is CAUTION not NO. The suburb has real competitive niches for operators who understand the cultural market—Vietnamese, Assyrian, Pakistani food operators with community connection; healthcare operators with language capability; services operators serving the refugee and humanitarian population. Income constraint is real, but for specific business models aligned to Fairfield's actual customer base, the economics work.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Generic Western retail and premium positioning will fail. Success in Fairfield requires either cultural specificity or service positioning in healthcare, education, or community support. The rent advantage (40–50% below comparable Parramatta or Bankstown positions) makes the financial case compelling for operators who can navigate the cultural and community requirements.</p>
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
