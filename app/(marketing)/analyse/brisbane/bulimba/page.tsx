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
            style={{ position: 'relative', border: `1.5px solid ${voted === i ? S.emeraldBdr : S.border}`, borderRadius: 10, padding: '12px 16px', background: S.white, cursor: voted === null ? 'pointer' : 'default', textAlign: : "left' as const, fontFamily: 'inherit", overflow: 'hidden' }}>
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
  { '@context': 'https://schema.org', '@type': 'Article', headline: 'Bulimba Business Location Analysis 2026 — Locatalyze', description: "Brisbane's most underrated commercial strip. Oxford Street has a residential demographic comparable to Paddington — affluent, professional, community-oriented — but without the operator attention or rent inflation that has followed Paddington's reputation. The window is still open.", datePublished: '2026-04-01', dateModified: '2026-04-12', author: { '@type': 'Organization', name: 'Locatalyze', url: 'https://locatalyze.com' } },
  { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
    {
      '@type': 'Question',
      name: 'Why is Bulimba underrated as a commercial location?',
      acceptedAnswer: { '@type': 'Answer', text: 'Bulimba has historically been overshadowed by the stronger reputations of West End and Paddington in operator conversations. Its riverside location (accessible primarily by ferry or car from inner Brisbane) and its compact strip have kept it below the radar of operators seeking inner-city profile. The demographic quality is as good as Paddington; the operator attention has been much less.' },
    },
    {
      '@type': 'Question',
      name: 'What is the commercial rent in Bulimba?',
      acceptedAnswer: { '@type': 'Answer', text: 'Oxford Street prime positions: $3,500–$5,500/month. Secondary Hawthorne Road positions: $2,200–$3,800/month. Bulimba rents are materially below Paddington equivalents at comparable demographic quality — this is the value gap.' },
    },
    {
      '@type': 'Question',
      name: 'How does Bulimba compare to Paddington?',
      acceptedAnswer: { '@type': 'Answer', text: 'Demographic income profiles are comparable — both sit around $92,000–$105,000 median household income. Community loyalty to independent operators is comparable. The differences: Paddington has higher foot traffic density and more established operator culture; Bulimba has lower rents and less operator competition. Paddington is the more proven market; Bulimba is the more accessible entry point.' },
    },
  ] },
]
export default function BulimbaPage() {
  return (
    <div style={{ minHeight: '100vh', background: S.n50, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {SCHEMAS.map((s, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />)}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: S.white, borderBottom: `1px solid ${S.border}`, padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/analyse/brisbane" style={{ fontSize: 13, fontWeight: 600, color: S.brand, textDecoration: 'none' }}>← Brisbane</Link>
        <Link href="/onboarding" style={{ fontSize: 13, fontWeight: 700, color: S.white, background: S.brand, padding: '8px 18px', borderRadius: 7, textDecoration: 'none' }}>Analyse free →</Link>
      </div>
      <div style={{ background: `linear-gradient(135deg, #0891B2 0%, #0369A1 100%)`, padding: '56px 24px 48px', color: S.white }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 16, textTransform: : "uppercase' as const, letterSpacing: '0.08em" }}>
            <Link href="/analyse" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Analyse</Link>{' / '}<Link href="/analyse/brisbane" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Brisbane</Link>{' / '}Bulimba
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 900, margin: '0 0 12px 0', lineHeight: 1.15 }}>Bulimba</h1>
          <p style={{ fontSize: 16, lineHeight: 1.7, opacity: 0.9, margin: '0 0 28px 0', maxWidth: 620 }}>Brisbane's most underrated commercial strip. Oxford Street has a residential demographic comparable to Paddington — affluent, professional, community-oriented — but without the operator attention or rent inflation that has followed Paddington's reputation. The window is still open.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' as const }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '16px 24px', textAlign: 'center' as const }}>
              <div style={{ fontSize: 36, fontWeight: 900, lineHeight: 1 }}>78</div>
              <div style={{ fontSize: 11, opacity: 0.8, marginTop: 4 }}>Overall Score</div>
            </div>
            <div><VerdictBadge v="GO" /><div style={{ fontSize: 12, opacity: 0.75, marginTop: 8 }}>QLD 4171 • Revenue potential $35K–$70K/mo</div></div>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginTop: 32, marginBottom: 40 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 24px 0' }}>Location Scores</h2>
          <ScoreBar label='Foot Traffic' value={75} />
          <ScoreBar label='Demographics' value={83} />
          <ScoreBar label='Rent Viability' value={81} />
          <ScoreBar label='Competition Gap' value={76} />
        </div>
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 20px 0' }}>Business Environment</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>The operators who have discovered Bulimba speak about Oxford Street the way Fitzroy operators spoke about Smith Street 20 years ago: a residential strip with exceptional demographics, loyal community customers, and rents that haven't caught up to the quality of the catchment. Oxford Street from Morningside Road to Wynnum Road is compact — about 400 metres of active commercial strip — but what it delivers in those 400 metres is disproportionate to its geographic scale. The families and professionals who live in Bulimba and adjacent Hawthorne shop local, eat local, and actively support independent operators by habit.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Median household income in Bulimba approaches $95,000 — placing it comfortably above Brisbane average and comparable to Paddington by income profile. The demographic composition is primarily owner-occupier families and professional couples aged 30–50 who bought into Bulimba before prices reflected its quality and have no incentive to leave. These residents generate consistent, seasonal-resistant spending that doesn't disappear when tourism softens or when major events are not scheduled. The customer base is structural — it derives from residential loyalty, not from discretionary destination visits.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Oxford Street's ferry terminal access (CityCat stops at Bulimba and adjacent Hawthorne) adds a leisure and commuter layer to the foot traffic that strip retail alone doesn't explain. On weekends, cyclists from the riverside path, CityCat leisure users, and ferry commuters add to resident foot traffic in ways that make Saturday morning on Oxford Street busier than the resident population alone would imply. The ferry-to-café pattern — arriving by water, spending on coffee and breakfast, departing on foot — is a genuine commercial driver unique to Brisbane's riverside suburbs.</p>
          </div>
        </div>
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 16px 0' }}>Competition Analysis</h2>
          <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Oxford Street competition is established in café and casual dining but not overwhelming. There are quality operators who have been trading for years and have community loyalty that new entrants must work around. The gap is in categories the current strip does not fully serve: quality evening dining (Oxford Street is lunch-and-café dominant; evenings are underserved), premium wellness, and boutique lifestyle retail. Healthcare demand is also structurally underserved for the demographic quality.</p>
        </div>
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 20px 0' }}>What Works Here</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Premium Café (Weekend Brunch-Focused)</h3>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, margin: 0 }}>Bulimba's residential demographic generates consistent weekend brunch demand. Oxford Street Saturday morning foot traffic from residents, ferry users, and cyclists supports a quality café with strong weekend trade. Revenue $45,000–$70,000/month for a well-positioned 40-seat operator.</p>
            </div>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Quality Evening Dining (Neighbourhood Restaurant)</h3>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, margin: 0 }}>Oxford Street's evening offering is weaker than its lunch and café strength. A 35–40 seat neighbourhood restaurant at $55–$75 per head with Thursday–Sunday evening focus fills a gap that Bulimba residents currently leave the suburb to satisfy. Revenue $40,000–$65,000/month.</p>
            </div>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Boutique Lifestyle Retail</h3>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, margin: 0 }}>The Bulimba demographic actively shops local for lifestyle products — homewares, fashion, gifts. A well-curated boutique with a clear concept finds loyal support from residents who choose independent over online as a community act. Revenue $35,000–$55,000/month.</p>
            </div>
          </div>
        </div>
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 20px 0' }}>Key Risks</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 20 }}>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.amber}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px 0' }}>Compact Strip Limits Availability</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>Oxford Street's active commercial zone is short. Quality positions are limited and turnover is low — established operators tend to stay. Be prepared to wait for the right position or consider secondary Hawthorne Road positions.</p>
            </div>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.amber}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px 0' }}>Car Parking Constraints</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>Oxford Street parking is limited, which constrains the catchment radius for drive-in customers. The commercial strength is residential walk-in and ferry-access customers — not drive-from-outer-suburbs destination visits.</p>
            </div>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.amber}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px 0' }}>Ferry Service Reliability</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>CityCat service disruptions (flood events, maintenance) periodically reduce the ferry-access foot traffic layer. Businesses dependent on ferry customers should model their base revenue from residents alone and treat ferry trade as upside.</p>
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
                <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>3km west, growth zone</div>
              </div>
            </Link>
            <Link href="/analyse/brisbane/kangaroo-point" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 16, cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = S.brand)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = S.border)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Kangaroo Point</h4>
                  <VerdictBadge v="GO" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: S.brand }}>76</div>
                <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>3km west, riverside</div>
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
                <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>3km west, hospital district</div>
              </div>
            </Link>
          </div>
        </div>
        <SuburbPoll suburb=Bulimba votes={[55, 33, 12]} />
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 20px 0' }}>Final Verdict</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Bulimba scores 78 and is one of Brisbane's strongest under-the-radar commercial opportunities. The demographic is genuinely premium, the community loyalty is established, and the rents ($3,000–$5,500/month) have not yet reflected the quality of the catchment. An operator who positions correctly — quality product, community presence, aligned to the family-professional residential demographic — finds a loyal customer base that does not require constant marketing to maintain.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>The clock is running on the Bulimba value window. As more operators discover Oxford Street and rents begin to reflect the true demographic quality, the entry conditions will be less attractive than they are in 2026. This is not a speculative call based on future development — the demographic is there now, the community spending habit is established now, and the rents are still accessible. Operators who move in the next 12–24 months capture this window.</p>
          </div>
        </div>
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px 0' }}>Frequently Asked Questions</h2>
          <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 20, marginTop: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 8px 0' }}>Why is Bulimba underrated as a commercial location?</h3>
            <p style={{ fontSize: 13, color: S.n900, lineHeight: 1.7, margin: 0 }}>Bulimba has historically been overshadowed by the stronger reputations of West End and Paddington in operator conversations. Its riverside location (accessible primarily by ferry or car from inner Brisbane) and its compact strip have kept it below the radar of operators seeking inner-city profile. The demographic quality is as good as Paddington; the operator attention has been much less.</p>
          </div>
          <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 20, marginTop: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 8px 0' }}>What is the commercial rent in Bulimba?</h3>
            <p style={{ fontSize: 13, color: S.n900, lineHeight: 1.7, margin: 0 }}>Oxford Street prime positions: $3,500–$5,500/month. Secondary Hawthorne Road positions: $2,200–$3,800/month. Bulimba rents are materially below Paddington equivalents at comparable demographic quality — this is the value gap.</p>
          </div>
          <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 20, marginTop: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 8px 0' }}>How does Bulimba compare to Paddington?</h3>
            <p style={{ fontSize: 13, color: S.n900, lineHeight: 1.7, margin: 0 }}>Demographic income profiles are comparable — both sit around $92,000–$105,000 median household income. Community loyalty to independent operators is comparable. The differences: Paddington has higher foot traffic density and more established operator culture; Bulimba has lower rents and less operator competition. Paddington is the more proven market; Bulimba is the more accessible entry point.</p>
          </div>
        </div>
        <div style={{ background: `linear-gradient(135deg, #059669 0%, #047857 100%)`, borderRadius: 16, padding: '40px 32px', marginBottom: 48, textAlign: 'center' as const }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: S.white, margin: '0 0 10px 0' }}>Ready to analyse your Bulimba location?</h3>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', margin: '0 0 24px 0' }}>Get foot traffic, competition, demographics, and a GO/CAUTION/NO verdict for your specific address.</p>
          <Link href="/onboarding" style={{ display: 'inline-block', background: S.white, color: '#059669', padding: '13px 28px', borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>Analyse your address →</Link>
        </div>
        <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 32, paddingBottom: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' as const, gap: 12 }}>
          <Link href="/analyse/brisbane" style={{ fontSize: 13, fontWeight: 600, color: S.brand, textDecoration: 'none' }}>← Back to Brisbane</Link>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' as const }}>
            <Link href="/analyse/brisbane/woolloongabba" style={{ fontSize: 13, color: S.brand, textDecoration: 'none' }}>Woolloongabba</Link> <Link href="/analyse/brisbane/kangaroo-point" style={{ fontSize: 13, color: S.brand, textDecoration: 'none' }}>Kangaroo Point</Link> <Link href="/analyse/brisbane/greenslopes" style={{ fontSize: 13, color: S.brand, textDecoration: 'none' }}>Greenslopes</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
