'use client'
import Link from 'next/link'
import { useState } from 'react'
const S = {
  brand: '#0891B2', brandLight: '#06B6D4',
  emerald: '#059669', emeraldBg: '#ECFDF5', emeraldBdr: '#A7F3D0',
  amber: '#D97706', amberBg: '#FFFBEB', amberBdr: '#FDE68A',
  red: '#DC2626', redBg: '#FEF2F2', redBdr: '#FECACA',
  muted: '#64748B', mutedLight: '#94A3B8', border: '#E2E8F0',
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
        )}  })}
      </div>
      {voted !== null && <div style={{ marginTop: 16, padding: '12px 16px', background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 10 }}><p style={{ fontSize: 13, color: '#047857', margin: 0 }}>Ready to run a full analysis for {suburb}?{' '}<Link href="/onboarding" style={{ fontWeight: 700, textDecoration: 'underline', color: '#047857' }}>Analyse free →</Link></p></div>}
    </div>
  )
}
const SCHEMAS = [
  { '@context': 'https://schema.org', '@type': 'Article', headline: 'Annerley Business Location Analysis 2026 — Locatalyze', description: "Ipswich Road corridor with one of Brisbane's most underrated healthcare and multicultural food opportunities. Significant Sri Lankan, Nepalese, South Asian, and Pacific Islander communities create specialty food demand that is currently undersupplied. Rents are among the lowest of any accessible inner-ring suburb.", datePublished: '2026-04-01', dateModified: '2026-04-12', author: { '@type': 'Organization', name: 'Locatalyze', url: 'https://locatalyze.com' } },
  { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
    {
      '@type': 'Question',
      name: 'What makes Annerley a good location for a multicultural food business?',
      acceptedAnswer: { '@type': 'Answer', text: "The Sri Lankan, Nepalese, South Asian, and Pacific Islander communities in and around Annerley create specialty food demand that draws customers from across Brisbane's multicultural population. Authentic food operators with genuine community connection find loyal customers who treat the restaurant as a cultural destination rather than a convenience choice. This loyalty pattern sustains businesses through economic cycles that affect discretionary dining more broadly." },
    },
    {
      '@type': 'Question',
      name: 'What is the commercial rent in Annerley?',
      acceptedAnswer: { '@type': 'Answer', text: 'Ipswich Road prime positions: $2,500–$3,800/month. Secondary positions: $1,500–$2,500/month. Annerley has among the lowest accessible rents of any Brisbane inner-ring suburb — materially below Woolloongabba and Greenslopes equivalents.' },
    },
    {
      '@type': 'Question',
      name: 'How does Annerley compare to Woolloongabba for business?',
      acceptedAnswer: { '@type': 'Answer', text: 'Woolloongabba has stronger overall demographics, better foot traffic, and the Olympic infrastructure catalyst. Annerley has lower rents, a specific multicultural commercial opportunity, and the potential for gentrification overspill as Woolloongabba prices out its earlier-stage operators. Woolloongabba is the stronger general market; Annerley is the better value entry for culturally-specific and healthcare operators.' },
    },
  ] },
]
export default function AnnerleyPage() {
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
            <Link href="/analyse" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Analyse</Link>{' / '}<Link href="/analyse/brisbane" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Brisbane</Link>{' / '}Annerley
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 900, margin: '0 0 12px 0', lineHeight: 1.15 }}>Annerley</h1>
          <p style={{ fontSize: 16, lineHeight: 1.7, opacity: 0.9, margin: '0 0 28px 0', maxWidth: 620 }}>Ipswich Road corridor with one of Brisbane's most underrated healthcare and multicultural food opportunities. Significant Sri Lankan, Nepalese, South Asian, and Pacific Islander communities create specialty food demand that is currently undersupplied. Rents are among the lowest of any accessible inner-ring suburb.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' as const }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '16px 24px', textAlign: 'center' as const }}>
              <div style={{ fontSize: 36, fontWeight: 900, lineHeight: 1 }}>70</div>
              <div style={{ fontSize: 11, opacity: 0.8, marginTop: 4 }}>Overall Score</div>
            </div>
            <div><VerdictBadge v="GO" /><div style={{ fontSize: 12, opacity: 0.75, marginTop: 8 }}>QLD 4103 • Revenue potential $20K–$45K/mo</div></div>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginTop: 32, marginBottom: 40 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 24px 0' }}>Location Scores</h2>
          <ScoreBar label='Foot Traffic' value={68} />
          <ScoreBar label='Demographics' value={68} />
          <ScoreBar label='Rent Viability' value={82} />
          <ScoreBar label='Competition Gap' value={70} />
        </div>
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 20px 0' }}>Business Environment</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Annerley sits 5km south of the CBD on the Ipswich Road corridor, caught between the commercial gravity of Woolloongabba to the north and the residential spread of Yeronga and Moorooka to the south and west. The suburb has historically been overlooked by operators seeking inner-city profile — it lacks the café culture reputation of West End, the family premium of Bulimba, and the university anchor of Toowong. What it has instead is a demographic that rewards culturally-aligned operators with a loyalty depth that community-specific markets create: the Sri Lankan, Nepalese, South Asian, and Pacific Islander communities who live in and around Annerley shop and eat within their cultural market by strong preference.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>The multicultural residential composition of Annerley is its most commercially distinctive characteristic. Census data places the suburb among Brisbane's more diverse inner-ring areas by cultural background — a significant proportion of the population is first-generation or second-generation migrant, with above-average community retail loyalty patterns. Authentic Sri Lankan, Nepalese, and South Asian food operators find loyal customers not just from Annerley but from the broader Brisbane multicultural community who travel specifically for authentic cuisine. This is the same dynamic that makes Footscray's Vietnamese food scene and Melbourne's Springvale Cambodian precinct commercially viable beyond their immediate residential populations.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Ipswich Road commercial positions between Annerley Road and Stephens Road offer some of Brisbane's lowest rents for an inner-ring suburb — $2,000–$3,800/month for positions that are 5km from the CBD and on a major arterial route. For healthcare operators — particularly those offering bulk-billing or culturally-competent services in Arabic, Nepalese, or South Asian languages — the cost structure at Annerley rents is materially more favourable than at Woolloongabba or Greenslopes. Government-funded healthcare revenue removes income sensitivity from the equation: Medicare and NDIS funding reaches the low-income communities of Annerley equally with high-income suburbs.</p>
          </div>
        </div>
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 16px 0' }}>Competition Analysis</h2>
          <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Annerley's multicultural food market has some established community operators but is far from saturated. Sri Lankan and Nepalese food is represented by a small number of operators; South Asian cuisine has limited authentic representation. Healthcare is structurally underserved — bulk-billing GP with language competency in South Asian or Pacific Islander languages would face near-zero direct competition. The café market is general-purpose and below the specialty coffee standard that the nearby Woolloongabba and West End residential overspill increasingly expects.</p>
        </div>
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 20px 0' }}>What Works Here</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Authentic South Asian or Sri Lankan Restaurant</h3>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, margin: 0 }}>Sri Lankan, Nepalese, and South Asian cuisine is significantly underrepresented in Annerley despite strong community demand. An authentic operator with community connection finds loyal customers from across Brisbane's multicultural community who treat the restaurant as a cultural destination. Revenue $25,000–$40,000/month for a well-positioned authentic operator.</p>
            </div>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Bulk-Billing Healthcare (Language-Competent)</h3>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, margin: 0 }}>The multicultural community demographic has above-average healthcare demand and strong preference for culturally-competent services. A bulk-billing GP or allied health practice with Nepalese, Sri Lankan, or Pacific Islander language capability faces minimal quality competition and accesses Medicare-funded revenue regardless of community income. Revenue $35,000–$55,000/month.</p>
            </div>
            <div style={{ background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Quality Café (Woolloongabba Overspill)</h3>
                <VerdictBadge v="CAUTION" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, margin: 0 }}>The Woolloongabba gentrification wave is beginning to reach Annerley as professionals price out of the Gabba precinct. A quality café on Ipswich Road captures this arriving demographic, but the volume is not yet at Woolloongabba or West End levels. Viable with patient establishment expectations. Revenue $20,000–$35,000/month.</p>
            </div>
          </div>
        </div>
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 20px 0' }}>Key Risks</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 20 }}>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.amber}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px 0' }}>Lower Income Demographics Constrain Premium Pricing</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>Annerley's multicultural community has below-Brisbane-average household income. Premium pricing strategies that work in Paddington or New Farm find a smaller market here. Value positioning works better — authentic quality at accessible prices rather than premium lifestyle pricing.</p>
            </div>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.amber}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px 0' }}>Cultural Trust Barrier for Non-Community Operators</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>Multicultural community markets reward operators with genuine cultural connection. An operator without community relationship who attempts to serve the Sri Lankan or Nepalese market faces a trust barrier that marketing cannot easily overcome. Cultural authenticity and community presence are entry requirements, not differentiators.</p>
            </div>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.amber}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px 0' }}>Ipswich Road Vehicle Traffic, Limited Foot Traffic</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>Ipswich Road is a major arterial with high vehicle throughput but limited pedestrian foot traffic. Walk-in discovery is restricted. Marketing must drive deliberate visits from the cultural community and emerging professional overspill.</p>
            </div>
          </div>
        </div>
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 20px 0' }}>Compare Nearby Suburbs</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <Link href="/analyse/brisbane/woolloongabba" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 16, cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = S.brand)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = S.border)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Woolloongabba</h4>
                  <VerdictBadge v="GO" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: S.brand }}>79</div>
                <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>3km north, growth zone</div>
              </div>
            </Link>
            <Link href="/analyse/brisbane/west-end" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 16, cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = S.brand)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = S.border)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>West End</h4>
                  <VerdictBadge v="GO" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: S.brand }}>85</div>
                <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>3km north, best culture</div>
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
                <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>3km east, hospital district</div>
              </div>
            </Link>
          </div>
        </div>
        <SuburbPoll suburb=Annerley votes={[40, 38, 22]} />
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 20px 0' }}>Final Verdict</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Annerley is a GO for operators who understand its specific commercial character: a community-specific multicultural market with strong loyalty patterns, structural healthcare demand, and the lowest accessible rents of any inner-ring Brisbane suburb. The opportunity is narrow in category — authentic multicultural food and culturally-competent healthcare — but very strong within those categories because the community loyalty depth creates customers who travel specifically to patronise operators who serve them well.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>The Woolloongabba gentrification wave will eventually reach Annerley and reprice the suburb's commercial positions. Operators who enter before this repricing — at $2,000–$3,800/month rents — and build community loyalty during the establishment phase will find their position materially stronger as the demographic continues to improve. This is the same early-mover opportunity that Woolloongabba represents, at a 3–5 year earlier stage.</p>
          </div>
        </div>
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px 0' }}>Frequently Asked Questions</h2>
          <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 20, marginTop: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 8px 0' }}>What makes Annerley a good location for a multicultural food business?</h3>
            <p style={{ fontSize: 13, color: S.n900, lineHeight: 1.7, margin: 0 }}>The Sri Lankan, Nepalese, South Asian, and Pacific Islander communities in and around Annerley create specialty food demand that draws customers from across Brisbane's multicultural population. Authentic food operators with genuine community connection find loyal customers who treat the restaurant as a cultural destination rather than a convenience choice. This loyalty pattern sustains businesses through economic cycles that affect discretionary dining more broadly.</p>
          </div>
          <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 20, marginTop: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 8px 0' }}>What is the commercial rent in Annerley?</h3>
            <p style={{ fontSize: 13, color: S.n900, lineHeight: 1.7, margin: 0 }}>Ipswich Road prime positions: $2,500–$3,800/month. Secondary positions: $1,500–$2,500/month. Annerley has among the lowest accessible rents of any Brisbane inner-ring suburb — materially below Woolloongabba and Greenslopes equivalents.</p>
          </div>
          <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 20, marginTop: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 8px 0' }}>How does Annerley compare to Woolloongabba for business?</h3>
            <p style={{ fontSize: 13, color: S.n900, lineHeight: 1.7, margin: 0 }}>Woolloongabba has stronger overall demographics, better foot traffic, and the Olympic infrastructure catalyst. Annerley has lower rents, a specific multicultural commercial opportunity, and the potential for gentrification overspill as Woolloongabba prices out its earlier-stage operators. Woolloongabba is the stronger general market; Annerley is the better value entry for culturally-specific and healthcare operators.</p>
          </div>
        </div>
        <div style={{ background: `linear-gradient(135deg, #059669 0%, #047857 100%)`, borderRadius: 16, padding: '40px 32px', marginBottom: 48, textAlign: 'center' as const }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: S.white, margin: '0 0 10px 0' }}>Ready to analyse your Annerley location?</h3>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', margin: '0 0 24px 0' }}>Get foot traffic, competition, demographics, and a GO/CAUTION/NO verdict for your specific address.</p>
          <Link href="/onboarding" style={{ display: 'inline-block', background: S.white, color: '#059669', padding: '13px 28px', borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>Analyse your address →</Link>
        </div>
        <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 32, paddingBottom: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' as const, gap: 12 }}>
          <Link href="/analyse/brisbane" style={{ fontSize: 13, fontWeight: 600, color: S.brand, textDecoration: 'none' }}>← Back to Brisbane</Link>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' as const }}>
            <Link href="/analyse/brisbane/woolloongabba" style={{ fontSize: 13, color: S.brand, textDecoration: 'none' }}>Woolloongabba</Link> <Link href="/analyse/brisbane/west-end" style={{ fontSize: 13, color: S.brand, textDecoration: 'none' }}>West End</Link> <Link href="/analyse/brisbane/greenslopes" style={{ fontSize: 13, color: S.brand, textDecoration: 'none' }}>Greenslopes</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
