'use client'
import Link from 'next/link'
import { useState } from 'react'
const S = {
  brand: '#0891B2', brandLight: '#06B6D4',
  emerald: '#059669', emeraldBg: '#ECFDF5', emeraldBdr: '#A7F3D0',
  amber: '#D97706', amberBg: '#FFFBEB', amberBdr: '#FDE68A',
  red: '#DC2626', redBg: '#FEF2F2', redBdr: '#FECACA',
  muted: '#475569', mutedLight: '#94A3B8', border: '#E2E8F0',
  n50: '#FAFAF9', n100: '#F5F5F4', n800: '#292524', n900: '#1C1917', white: '#FFFFFF',
}
type Verdict = 'GO' | 'CAUTION' | 'NO'
function VerdictBadge({ v }: { v: Verdict }) {
  const cfg: Record<Verdict, { bg: string; bdr: string; txt: string; label: string }> = {
    GO: { bg: S.emeraldBg, bdr: S.emeraldBdr, txt: S.emerald, label: 'GO' },
    CAUTION: { bg: S.amberBg, bdr: S.amberBdr, txt: S.amber, label: 'CAUTION' },
    NO: { bg: S.redBg, bdr: S.redBdr, txt: S.red, label: 'NO' },
  }
  const c = cfg[v]
  return <span style={{ fontSize: 11, fontWeight: 700, color: c.txt, background: c.bg, border: `1px solid ${c.bdr}`, borderRadius: 6, padding: '3px 10px', letterSpacing: '0.04em' }}>{c.label}</span>
}
function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: S.n900 }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: S.brand }}>{value}/100</span>
      </div>
      <div style={{ height: 7, background: S.border, borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${value}%`, background: S.brand, borderRadius: 4 }} />
      </div>
    </div>
  )
}
function SuburbPoll({ suburb, votes: initVotes }: { suburb: string; votes: number[] }) {
  const [voted, setVoted] = useState<number | null>(null)
  const [votes, setVotes] = useState(initVotes)
  const total = votes.reduce((a, b) => a + b, 0)
  function cast(i: number) { if (voted !== null) return; setVoted(i); setVotes(prev => prev.map((v, idx) => idx === i ? v + 1 : v)) }
  const opts = ['Yes — I would open here', 'Maybe — needs more research', 'No — wrong market for me']
  return (
    <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
      <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 6, color: S.n900 }}>Would you open a business in {suburb}?</h3>
      <p style={{ fontSize: 13, color: S.muted, margin: '0 0 20px 0' }}>Based on what you've read above.</p>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
        {opts.map((opt, i) => { const pct = Math.round((votes[i] / total) * 100); return (
          <button key={i} onClick={() => cast(i)} disabled={voted !== null}
            style={{ position: 'relative', border: `1.5px solid ${voted === i ? S.emeraldBdr : S.border}`, borderRadius: 10, padding: '12px 16px', background: S.white, cursor: voted === null ? 'pointer' : 'default', textAlign: 'left' as const, fontFamily: 'inherit', overflow: 'hidden' }}>
            {voted !== null && <div style={{ position: 'absolute', inset: 0, width: `${pct}%`, background: 'rgba(8,145,178,0.07)', transition: 'width 0.4s ease' }} />}
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: S.n900 }}>{opt}</span>
              {voted !== null && <span style={{ fontSize: 12, color: S.brand, fontWeight: 700 }}>{pct}%</span>}
            </div>
          </button>
          ) })}
      </div>
      {voted !== null && <div style={{ marginTop: 16, padding: '12px 16px', background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 10 }}><p style={{ fontSize: 13, color: '#047857', margin: 0 }}>Ready to run a full analysis for {suburb}?{' '}<Link href="/onboarding" style={{ fontWeight: 700, textDecoration: 'underline', color: '#047857' }}>Analyse free →</Link></p></div>}
    </div>
  )
}
const SCHEMAS = [
  { '@context': 'https://schema.org', '@type': 'Article', headline: 'Indooroopilly Business Location Analysis 2026 — Locatalyze', description: "Westfield Indooroopilly is both the suburb's commercial anchor and its main competitive challenge. Strip positions on Moggill Road and Station Road outside the centre serve the residential and UQ catchment without competing directly with the mall. Healthcare and specialty food perform well outside the Westfield orbit.", datePublished: '2026-04-01', dateModified: '2026-04-12', author: { '@type': 'Organization', name: 'Locatalyze', url: 'https://locatalyze.com' } },
  { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
    {
      '@type': 'Question',
      name: 'Does Westfield Indooroopilly hurt strip retail?',
      acceptedAnswer: { '@type': 'Answer', text: "Yes, materially. The centre captures the mainstream retail spending that would otherwise distribute across strip operators. The key for strip retailers is to serve needs the Westfield doesn't efficiently host: specialty food, independent café culture, healthcare and allied health, and personal services requiring privacy or community relationship." },
    },
    {
      '@type': 'Question',
      name: 'What is the commercial rent near Indooroopilly Westfield?',
      acceptedAnswer: { '@type': 'Answer', text: 'Moggill Road and Station Road strip positions: $2,500–$4,500/month. Positions immediately adjacent to the Westfield entry: $3,500–$5,500/month (benefiting from centre foot traffic). Off-strip residential positions: $1,500–$2,800/month.' },
    },
    {
      '@type': 'Question',
      name: 'Is Indooroopilly a good suburb for a café?',
      acceptedAnswer: { '@type': 'Answer', text: "For a transit-positioned café serving the UQ commuter and student catchment, yes. For a café competing directly in the Westfield food court neighbourhood, no. The differentiator is positioning: outside the centre's orbit, serving the transit and residential market rather than the mall shopper." },
    },
  ] },
]
export default function IndooroopillyPage() {
  return (
    <div style={{ minHeight: '100vh', background: S.n50, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {SCHEMAS.map((s, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />)}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: S.white, borderBottom: `1px solid ${S.border}`, padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/analyse/brisbane" style={{ fontSize: 13, fontWeight: 600, color: S.brand, textDecoration: 'none' }}>← Brisbane</Link>
        <Link href="/onboarding" style={{ fontSize: 13, fontWeight: 700, color: S.white, background: S.brand, padding: '8px 18px', borderRadius: 7, textDecoration: 'none' }}>Analyse free →</Link>
      </div>
      <div style={{ background: `linear-gradient(135deg, #0891B2 0%, #0369A1 100%)`, padding: '56px 24px 48px', color: S.white }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 16, textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>
            <Link href="/analyse" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Analyse</Link>{' / '}<Link href="/analyse/brisbane" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Brisbane</Link>{' / '}Indooroopilly
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 900, margin: '0 0 12px 0', lineHeight: 1.15 }}>Indooroopilly</h1>
          <p style={{ fontSize: 16, lineHeight: 1.7, opacity: 0.9, margin: '0 0 28px 0', maxWidth: 620 }}>Westfield Indooroopilly is both the suburb's commercial anchor and its main competitive challenge. Strip positions on Moggill Road and Station Road outside the centre serve the residential and UQ catchment without competing directly with the mall. Healthcare and specialty food perform well outside the Westfield orbit.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' as const }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '16px 24px', textAlign: 'center' as const }}>
              <div style={{ fontSize: 36, fontWeight: 900, lineHeight: 1 }}>71</div>
              <div style={{ fontSize: 11, opacity: 0.8, marginTop: 4 }}>Overall Score</div>
            </div>
            <div><VerdictBadge v="GO" /><div style={{ fontSize: 12, opacity: 0.75, marginTop: 8 }}>QLD 4068 • Revenue potential $25K–$55K/mo</div></div>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginTop: 32, marginBottom: 40 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 24px 0' }}>Location Scores</h2>
          <ScoreBar label='Foot Traffic' value={72} />
          <ScoreBar label='Demographics' value={75} />
          <ScoreBar label='Rent Viability' value={74} />
          <ScoreBar label='Competition Gap' value={66} />
        </div>
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1C1917', margin: '0 0 20px 0' }}>Business Environment</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Indooroopilly's commercial landscape is defined by a central tension: Westfield Indooroopilly is one of Queensland's top-performing shopping centres, drawing 12+ million visits per year and concentrating significant retail spending inside its walls. Strip retail operators on Moggill Road and Station Road exist in the gravitational field of a retail asset that outmarketed and outspends them every day of the year. This is not unique to Indooroopilly — it is the same dynamic as Chermside and Carindale — but Indooroopilly's residential demographics and UQ proximity add commercial context that makes the challenge navigable for correctly positioned operators.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>University of Queensland St Lucia campus is 2km from Indooroopilly station by bus, and the Indooroopilly ferry terminal provides direct CityCat access to UQ and the broader university catchment. This creates a student and academic population who pass through Indooroopilly daily and who are the natural customer base for a café or food operator positioned at their transit point. The student cohort spending habits — coffee, quick meals, occasional sit-down study sessions — are predictable and consistent during semester. This is a different customer profile than the Westfield shopper, and it is one that the mall itself does not serve well.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>The Indooroopilly residential demographic — primarily families with children in the $85,000–$105,000 household income range — uses the suburb primarily for proximity to UQ (for university-age children) and school catchments (quality state and private schools in the area). This family demographic has healthcare, children's education, and quality food needs that the Westfield cannot efficiently supply. A physiotherapy practice, children's tutoring service, or family café positioned outside the Westfield orbit serves a demographic that the centre is structurally unsuited to serve.</p>
          </div>
        </div>
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 16px 0' }}>Competition Analysis</h2>
          <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Inside the Westfield, chain competition is dominant and not worth entering. Outside the Westfield on Moggill Road and Station Road, the competition for quality food and specialty services is thin. The student and academic transit customer is underserved. The family healthcare market is underserved. Any operator who positions clearly outside the Westfield orbit — specialty services, healthcare, independent café — finds less direct competition than the suburb's overall density would suggest.</p>
        </div>
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1C1917', margin: '0 0 20px 0' }}>What Works Here</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1C1917', margin: 0 }}>University-Adjacent Café (Transit Position)</h3>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, margin: 0 }}>The CityCat ferry terminal and bus connection to UQ St Lucia creates a student-academic morning transit pattern through Indooroopilly. A café positioned at or near the transit point serves this captive morning market efficiently. Revenue $30,000–$50,000/month from weekday student-academic and weekend family trade.</p>
            </div>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1C1917', margin: 0 }}>Family Allied Health (Outside Westfield Orbit)</h3>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, margin: 0 }}>Indooroopilly's family demographic (children, private health, quality-seeking) has allied health needs that the Westfield's internal health services don't fully serve. A family physiotherapy or children's dentistry practice on Moggill Road finds consistent demand from the family catchment. Revenue $40,000–$65,000/month.</p>
            </div>
            <div style={{ background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1C1917', margin: 0 }}>Independent Retail (Non-Competing with Westfield)</h3>
                <VerdictBadge v="CAUTION" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, margin: 0 }}>Retail that directly competes with Westfield category tenants (fashion, electronics, homewares) will struggle. Specialty retail — local artisan products, specialty food, niche lifestyle goods — finds a different customer and avoids the centre's competitive pressure.</p>
            </div>
          </div>
        </div>
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 20px 0' }}>Key Risks</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 20 }}>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.amber}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#1C1917', margin: '0 0 4px 0' }}>Westfield Gravity is Structural</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>Operators who underestimate Westfield's customer capture effect will be disappointed by lower walk-in foot traffic than suburb demographics imply. The mall captures the mainstream commercial spending; strip retail captures the residual. Position for the residual deliberately, not incidentally.</p>
            </div>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.amber}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#1C1917', margin: '0 0 4px 0' }}>Student Seasonality</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>UQ semester structure creates January and June–July revenue gaps for operators primarily serving the student market. Annual revenue modelling must reflect the semester calendar.</p>
            </div>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.amber}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#1C1917', margin: '0 0 4px 0' }}>Parking Competition from Westfield</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>Westfield's free parking draws customers who drive to the centre rather than park on strip. Strip operators need to either be walkable from the station or positioned for the residential walk-in market rather than the car-dependent shopper.</p>
            </div>
          </div>
        </div>
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1C1917', margin: '0 0 20px 0' }}>Compare Nearby Suburbs</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <Link href="/analyse/brisbane/toowong" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 16, cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = S.brand)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = S.border)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Toowong</h4>
                  <VerdictBadge v="GO" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: S.brand }}>73</div>
                <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>2km east, UQ gateway</div>
              </div>
            </Link>
            <Link href="/analyse/brisbane/greenslopes" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 16, cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = S.brand)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = S.border)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Greenslopes</h4>
                  <VerdictBadge v="GO" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: S.brand }}>73</div>
                <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>6km east, hospital district</div>
              </div>
            </Link>
            <Link href="/analyse/brisbane/mount-gravatt" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 16, cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = S.brand)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = S.border)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Mount Gravatt</h4>
                  <VerdictBadge v="GO" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: S.brand }}>72</div>
                <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>7km east, university anchor</div>
              </div>
            </Link>
          </div>
        </div>
        <SuburbPoll suburb="Indooroopilly" votes={[42, 37, 21]} />
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 20px 0' }}>Final Verdict</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Indooroopilly is a GO for operators who position correctly relative to the Westfield. The error in Indooroopilly is not entering the market — it is entering without understanding that the Westfield captures the mainstream commercial spending and strip positions must serve different or complementary customer needs. Operators who position for the UQ student transit market, the family healthcare market, or specialty services the mall doesn't provide find Indooroopilly viable.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>The rent story is reasonable: $2,500–$4,500/month for strip positions outside the Westfield is defensible against the residential and student catchment. Operators who enter with realistic expectations about the volume that the strip (not the centre) generates, and who position for the specific customer segments not captured by Westfield, will find the economics work.</p>
          </div>
        </div>
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px 0' }}>Frequently Asked Questions</h2>
          <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 20, marginTop: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 8px 0' }}>Does Westfield Indooroopilly hurt strip retail?</h3>
            <p style={{ fontSize: 13, color: S.n900, lineHeight: 1.7, margin: 0 }}>Yes, materially. The centre captures the mainstream retail spending that would otherwise distribute across strip operators. The key for strip retailers is to serve needs the Westfield doesn't efficiently host: specialty food, independent café culture, healthcare and allied health, and personal services requiring privacy or community relationship.</p>
          </div>
          <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 20, marginTop: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 8px 0' }}>What is the commercial rent near Indooroopilly Westfield?</h3>
            <p style={{ fontSize: 13, color: S.n900, lineHeight: 1.7, margin: 0 }}>Moggill Road and Station Road strip positions: $2,500–$4,500/month. Positions immediately adjacent to the Westfield entry: $3,500–$5,500/month (benefiting from centre foot traffic). Off-strip residential positions: $1,500–$2,800/month.</p>
          </div>
          <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 20, marginTop: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 8px 0' }}>Is Indooroopilly a good suburb for a café?</h3>
            <p style={{ fontSize: 13, color: S.n900, lineHeight: 1.7, margin: 0 }}>For a transit-positioned café serving the UQ commuter and student catchment, yes. For a café competing directly in the Westfield food court neighbourhood, no. The differentiator is positioning: outside the centre's orbit, serving the transit and residential market rather than the mall shopper.</p>
          </div>
        </div>
        <div style={{ background: `linear-gradient(135deg, #059669 0%, #047857 100%)`, borderRadius: 16, padding: '40px 32px', marginBottom: 48, textAlign: 'center' as const }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', margin: '0 0 10px 0' }}>Ready to analyse your Indooroopilly location?</h3>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', margin: '0 0 24px 0' }}>Get foot traffic, competition, demographics, and a GO/CAUTION/NO verdict for your specific address.</p>
          <Link href="/onboarding" style={{ display: 'inline-block', background: S.white, color: '#059669', padding: '13px 28px', borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>Analyse your address →</Link>
        </div>
        <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 32, paddingBottom: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' as const, gap: 12 }}>
          <Link href="/analyse/brisbane" style={{ fontSize: 13, fontWeight: 600, color: S.brand, textDecoration: 'none' }}>← Back to Brisbane</Link>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' as const }}>
            <Link href="/analyse/brisbane/toowong" style={{ fontSize: 13, color: S.brand, textDecoration: 'none' }}>Toowong</Link> <Link href="/analyse/brisbane/greenslopes" style={{ fontSize: 13, color: S.brand, textDecoration: 'none' }}>Greenslopes</Link> <Link href="/analyse/brisbane/mount-gravatt" style={{ fontSize: 13, color: S.brand, textDecoration: 'none' }}>Mount Gravatt</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
