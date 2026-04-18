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
  { '@context': 'https://schema.org', '@type': 'Article', headline: 'Chermside Business Location Analysis 2026 — Locatalyze', description: "Westfield Chermside is one of Queensland's largest shopping centres and it concentrates commercial gravity inside its walls. Strip retail on Gympie Road faces structural competition from a destination retail asset that outspends, outmarkets, and outconveniences most independent operators.", datePublished: '2026-04-01', dateModified: '2026-04-12', author: { '@type': 'Organization', name: 'Locatalyze', url: 'https://locatalyze.com' } },
  { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
    {
      '@type': 'Question',
      name: 'Is Chermside Brisbane a good place to open a café?',
      acceptedAnswer: { '@type': 'Answer', text: 'Only with a deliberate regular-customer strategy. Walk-in foot traffic on Gympie Road strip will not sustain a café. A Chermside café succeeds by building a loyal local base from the residential catchment within 1–2km through quality and community presence — not by relying on Westfield overflow traffic.' },
    },
    {
      '@type': 'Question',
      name: 'What is the commercial rent near Chermside?',
      acceptedAnswer: { '@type': 'Answer', text: 'Gympie Road strip positions near Westfield: $3,500–$5,500/month. Secondary Gympie Road positions: $2,200–$4,000/month. Off-strip residential positions: $1,500–$2,800/month. Rents reflect the vehicle-traffic visibility of Gympie Road rather than foot traffic quality.' },
    },
    {
      '@type': 'Question',
      name: 'How does Chermside compare to Nundah for business?',
      acceptedAnswer: { '@type': 'Answer', text: 'Nundah (Sandgate Road) has superior strip retail conditions — community foot traffic culture, improving demographics, and no major shopping centre gravity competing with strip operators. For most independent hospitality and retail categories, Nundah is a materially better market than Chermside strip retail.' },
    },
  ] },
]
export default function ChermsidePage() {
  return (
    <div style={{ minHeight: '100vh', background: S.n50, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {SCHEMAS.map((s, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />)}
<div style={{ background: `linear-gradient(135deg, #0369A1 0%, #024F80 100%)`, padding: '56px 24px 48px', color: S.white }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 16, textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>
            <Link href="/analyse" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Analyse</Link>{' / '}<Link href="/analyse/brisbane" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Brisbane</Link>{' / '}Chermside
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 900, margin: '0 0 12px 0', lineHeight: 1.15 }}>Chermside</h1>
          <p style={{ fontSize: 16, lineHeight: 1.7, opacity: 0.9, margin: '0 0 28px 0', maxWidth: 620 }}>Westfield Chermside is one of Queensland's largest shopping centres and it concentrates commercial gravity inside its walls. Strip retail on Gympie Road faces structural competition from a destination retail asset that outspends, outmarkets, and outconveniences most independent operators.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' as const }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '16px 24px', textAlign: 'center' as const }}>
              <div style={{ fontSize: 36, fontWeight: 900, lineHeight: 1 }}>68</div>
              <div style={{ fontSize: 11, opacity: 0.8, marginTop: 4 }}>Overall Score</div>
            </div>
            <div><VerdictBadge v="CAUTION" /><div style={{ fontSize: 12, opacity: 0.75, marginTop: 8 }}>QLD 4032 • Revenue potential $20K–$45K/mo for viable niches</div></div>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginTop: 32, marginBottom: 40 }}>
          <h2 style={{ color: '#1C1917', fontSize: 16, fontWeight: 700, margin: '0 0 24px 0' }}>Location Scores</h2>
          <ScoreBar label='Foot Traffic' value={74} />
          <ScoreBar label='Demographics' value={68} />
          <ScoreBar label='Rent Viability' value={65} />
          <ScoreBar label='Competition Gap' value={58} />
        </div>
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1C1917', margin: '0 0 20px 0' }}>Business Environment</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Westfield Chermside is Queensland's second-largest shopping centre by floor area — 180,000 square metres, 400+ tenancies, and 12+ million visitors annually. On any given Saturday, 25,000–30,000 people pass through its car parks. This sounds like a commercial opportunity, but it is not the opportunity that strip retail operators need: those 25,000 people are coming to the centre, not to Gympie Road. They park inside, they shop inside, they eat inside, and they leave from inside. The strip retailers on Gympie Road to the north and south of the centre see some overflow foot traffic — customers who park on the street to avoid the car park queues, or who are running errands to strip-specific businesses — but not the full benefit of the centre's visitor volume.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>The residential demographic around Chermside is middle-income family and working-professional — median household income approximately $74,000, below the Brisbane inner-ring average but not the lowest-income segment. These families use Westfield for their primary shopping but have needs that Westfield cannot serve: healthcare (particularly bulk-billing), neighbourhood café culture, specialty food, and personal services requiring a community relationship rather than a transactional commercial setting. These needs create niches where strip retail can succeed if positioned correctly.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Gympie Road itself has high vehicle traffic volume — a major northern arterial route — which creates visibility but not foot traffic. Driving past a business at 60km/h is not the same as walking past it at 3km/h. Strip operators on Gympie Road are largely dependent on deliberate-destination customers rather than walk-in traffic, which changes the marketing and customer acquisition model. Businesses that build loyalty through quality and relationship — healthcare, established café with regular customers, specialist retail — find Chermside viable. Businesses dependent on casual walk-in discovery find the economics difficult.</p>
          </div>
        </div>
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 18, fontWeight: 700, margin: '0 0 16px 0' }}>Competition Analysis</h2>
          <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Inside Westfield Chermside, chain competition is absolute and not worth contesting for independent operators. Outside the centre on Gympie Road, competition is moderate in the categories that the strip serves: fast food (strong chain presence), healthcare (thin quality competition despite strong demand), and neighbourhood café (moderate independent operator presence). The competitive gap for quality operators is in healthcare and specialty food — categories where the Westfield environment is structurally unsuited to serve well.</p>
        </div>
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1C1917', margin: '0 0 20px 0' }}>What Works Here</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1C1917', margin: 0 }}>Bulk-Billing Healthcare (GP, Allied Health)</h3>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, margin: 0 }}>Chermside's middle-income family demographic has strong demand for accessible, affordable healthcare. Bulk-billing GP and Medicare-funded allied health services build consistent patient bases from the suburban family catchment. Government funding removes income-sensitivity from the revenue model. Revenue $40,000–$65,000/month.</p>
            </div>
            <div style={{ background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1C1917', margin: 0 }}>Neighbourhood Café (Regular Customer Model)</h3>
                <VerdictBadge v="CAUTION" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, margin: 0 }}>Viable only with a deliberate regular-customer strategy. A café on Gympie Road will not generate sufficient walk-in foot traffic to sustain itself. It must build a loyal local base through quality, community presence, and deliberate marketing to the residential catchment within 1–2km.</p>
            </div>
            <div style={{ background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1C1917', margin: 0 }}>Specialty Service (Not Competing with Westfield)</h3>
                <VerdictBadge v="CAUTION" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, margin: 0 }}>Personal services (dog grooming, alterations, specialist repair), specialty health (physiotherapy, optical), and professional services build appointment-based revenue that doesn't depend on walk-in foot traffic. These categories succeed on reputation and relationship rather than passing trade.</p>
            </div>
          </div>
        </div>
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 18, fontWeight: 700, margin: '0 0 20px 0' }}>Key Risks</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 20 }}>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.amber}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#1C1917', margin: '0 0 4px 0' }}>Westfield Gravity — Structural and Permanent</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>Westfield Chermside's competitive advantage over strip retail is not cyclical — it is structural. The centre will always outmarket, outpark, and outconvenience strip operators for mainstream retail. Position for niches, not for volume.</p>
            </div>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.amber}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#1C1917', margin: '0 0 4px 0' }}>Gympie Road Vehicle Rather Than Foot Traffic</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>High vehicle throughput on Gympie Road creates visibility but not walk-in customers. Marketing must drive deliberate visits rather than relying on passing trade. Budget accordingly.</p>
            </div>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.amber}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#1C1917', margin: '0 0 4px 0' }}>Median Income Below Brisbane Average</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>The Chermside residential demographic ($74,000 median household income) is below the inner-ring Brisbane average. Premium pricing strategies have a smaller market here than in Paddington or New Farm. Value positioning works better than premium positioning.</p>
            </div>
          </div>
        </div>
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1C1917', margin: '0 0 20px 0' }}>Compare Nearby Suburbs</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <Link href="/analyse/brisbane/nundah" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 16, cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = S.brand)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = S.border)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h4 style={{ color: '#1C1917', fontSize: 14, fontWeight: 700, margin: 0 }}>Nundah</h4>
                  <VerdictBadge v="GO" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: S.brand }}>72</div>
                <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>4km east, better economics</div>
              </div>
            </Link>
            <Link href="/analyse/brisbane/newmarket" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 16, cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = S.brand)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = S.border)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h4 style={{ color: '#1C1917', fontSize: 14, fontWeight: 700, margin: 0 }}>Newmarket</h4>
                  <VerdictBadge v="GO" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: S.brand }}>72</div>
                <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>5km south, improving</div>
              </div>
            </Link>
            <Link href="/analyse/brisbane/mount-gravatt" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 16, cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = S.brand)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = S.border)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h4 style={{ color: '#1C1917', fontSize: 14, fontWeight: 700, margin: 0 }}>Mount Gravatt</h4>
                  <VerdictBadge v="GO" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: S.brand }}>72</div>
                <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>12km south, university anchor</div>
              </div>
            </Link>
          </div>
        </div>
        <SuburbPoll suburb="Chermside" votes={[29, 38, 33]} />
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 18, fontWeight: 700, margin: '0 0 20px 0' }}>Final Verdict</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Chermside is CAUTION because the Westfield gravity problem is structural and permanent. Strip retail adjacent to a major shopping centre of this scale cannot compete for mainstream commercial traffic — the centre wins on parking, convenience, range, and marketing budget every time. The CAUTION verdict is not a judgment that the suburb is a failure — it is a judgment that entry without understanding the structural competitive disadvantage leads to failure.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Operators who succeed in Chermside have positioned for the specific niches where Westfield is structurally weak: healthcare (Westfield's medical centre format doesn't build the relationship that a standalone practice does), neighbourhood café (the community character that a local café builds is not something Westfield can replicate), and personal services (appointment-based, relationship-driven businesses that don't compete on walk-in discovery). If your business model requires Westfield-scale foot traffic to be viable, Chermside is not your location.</p>
          </div>
        </div>
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 18, fontWeight: 700, margin: '0 0 4px 0' }}>Frequently Asked Questions</h2>
          <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 20, marginTop: 20 }}>
            <h3 style={{ color: '#1C1917', fontSize: 15, fontWeight: 700, margin: '0 0 8px 0' }}>Is Chermside Brisbane a good place to open a café?</h3>
            <p style={{ fontSize: 13, color: S.n900, lineHeight: 1.7, margin: 0 }}>Only with a deliberate regular-customer strategy. Walk-in foot traffic on Gympie Road strip will not sustain a café. A Chermside café succeeds by building a loyal local base from the residential catchment within 1–2km through quality and community presence — not by relying on Westfield overflow traffic.</p>
          </div>
          <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 20, marginTop: 20 }}>
            <h3 style={{ color: '#1C1917', fontSize: 15, fontWeight: 700, margin: '0 0 8px 0' }}>What is the commercial rent near Chermside?</h3>
            <p style={{ fontSize: 13, color: S.n900, lineHeight: 1.7, margin: 0 }}>Gympie Road strip positions near Westfield: $3,500–$5,500/month. Secondary Gympie Road positions: $2,200–$4,000/month. Off-strip residential positions: $1,500–$2,800/month. Rents reflect the vehicle-traffic visibility of Gympie Road rather than foot traffic quality.</p>
          </div>
          <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 20, marginTop: 20 }}>
            <h3 style={{ color: '#1C1917', fontSize: 15, fontWeight: 700, margin: '0 0 8px 0' }}>How does Chermside compare to Nundah for business?</h3>
            <p style={{ fontSize: 13, color: S.n900, lineHeight: 1.7, margin: 0 }}>Nundah (Sandgate Road) has superior strip retail conditions — community foot traffic culture, improving demographics, and no major shopping centre gravity competing with strip operators. For most independent hospitality and retail categories, Nundah is a materially better market than Chermside strip retail.</p>
          </div>
        </div>
        <div style={{ background: `linear-gradient(135deg, #059669 0%, #047857 100%)`, borderRadius: 16, padding: '40px 32px', marginBottom: 48, textAlign: 'center' as const }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: '#FFFFFF', margin: '0 0 10px 0' }}>Ready to analyse your Chermside location?</h3>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', margin: '0 0 24px 0' }}>Get foot traffic, competition, demographics, and a GO/CAUTION/NO verdict for your specific address.</p>
          <Link href="/onboarding" style={{ display: 'inline-block', background: S.white, color: '#059669', padding: '13px 28px', borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>Analyse your address →</Link>
        </div>
        <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 32, paddingBottom: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' as const, gap: 12 }}>
          <Link href="/analyse/brisbane" style={{ fontSize: 13, fontWeight: 600, color: S.brand, textDecoration: 'none' }}>← Back to Brisbane</Link>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' as const }}>
            <Link href="/analyse/brisbane/nundah" style={{ fontSize: 13, color: S.brand, textDecoration: 'none' }}>Nundah</Link> <Link href="/analyse/brisbane/newmarket" style={{ fontSize: 13, color: S.brand, textDecoration: 'none' }}>Newmarket</Link> <Link href="/analyse/brisbane/mount-gravatt" style={{ fontSize: 13, color: S.brand, textDecoration: 'none' }}>Mount Gravatt</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
