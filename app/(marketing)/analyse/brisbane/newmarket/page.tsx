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
  { '@context': 'https://schema.org', '@type': 'Article', headline: 'Newmarket Business Location Analysis 2026 — Locatalyze', description: 'Enoggera Road corridor showing the early signs of the demographic shift that has matured in nearby Wilston and Alderley. Young professionals arriving, rents accessible, café supply thin relative to residential growth. Early-mover advantage still available.', datePublished: '2026-04-01', dateModified: '2026-04-12', author: { '@type': 'Organization', name: 'Locatalyze', url: 'https://locatalyze.com' } },
  { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
    {
      '@type': 'Question',
      name: 'Is Newmarket Brisbane a good suburb for business?',
      acceptedAnswer: { '@type': 'Answer', text: 'For early-mover operators targeting the arriving professional demographic, yes. For operators requiring an immediately established customer base, Paddington or West End are safer. Newmarket rewards patience and community investment; it does not reward operators who need immediate high-volume trading from an established customer base.' },
    },
    {
      '@type': 'Question',
      name: 'What is the commercial rent in Newmarket?',
      acceptedAnswer: { '@type': 'Answer', text: 'Enoggera Road prime positions: $3,000–$4,500/month. Secondary positions: $1,800–$3,000/month. Newmarket rents are among the most accessible of any Brisbane inner-northern suburb — appropriate for the current commercial development level.' },
    },
    {
      '@type': 'Question',
      name: 'How does Newmarket compare to Nundah?',
      acceptedAnswer: { '@type': 'Answer', text: 'Both are middle-ring Brisbane suburbs at a similar stage of demographic transition. Nundah (Sandgate Road) has a more established café culture and community strip character, making it slightly more proven as an entry market. Newmarket has lower rents and less existing competition, making it the better early-mover value play for patient operators.' },
    },
  ] },
]
export default function NewmarketPage() {
  return (
    <div style={{ minHeight: '100vh', background: S.n50, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {SCHEMAS.map((s, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />)}
<div style={{ background: `linear-gradient(135deg, #0369A1 0%, #024F80 100%)`, padding: '56px 24px 48px', color: S.white }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 16, textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>
            <Link href="/analyse" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Analyse</Link>{' / '}<Link href="/analyse/brisbane" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Brisbane</Link>{' / '}Newmarket
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 900, margin: '0 0 12px 0', lineHeight: 1.15 }}>Newmarket</h1>
          <p style={{ fontSize: 16, lineHeight: 1.7, opacity: 0.9, margin: '0 0 28px 0', maxWidth: 620 }}>Enoggera Road corridor showing the early signs of the demographic shift that has matured in nearby Wilston and Alderley. Young professionals arriving, rents accessible, café supply thin relative to residential growth. Early-mover advantage still available.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' as const }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '16px 24px', textAlign: 'center' as const }}>
              <div style={{ fontSize: 36, fontWeight: 900, lineHeight: 1 }}>72</div>
              <div style={{ fontSize: 11, opacity: 0.8, marginTop: 4 }}>Overall Score</div>
            </div>
            <div><VerdictBadge v="GO" /><div style={{ fontSize: 12, opacity: 0.75, marginTop: 8 }}>QLD 4051 • Revenue potential $25K–$50K/mo</div></div>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginTop: 32, marginBottom: 40 }}>
          <h2 style={{ color: '#1C1917', fontSize: 16, fontWeight: 700, margin: '0 0 24px 0' }}>Location Scores</h2>
          <ScoreBar label='Foot Traffic' value={70} />
          <ScoreBar label='Demographics' value={73} />
          <ScoreBar label='Rent Viability' value={79} />
          <ScoreBar label='Competition Gap' value={69} />
        </div>
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1C1917', margin: '0 0 20px 0' }}>Business Environment</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Newmarket is at the stage of commercial development that Nundah was at five years ago: a suburb whose demographic is improving faster than its commercial offering has responded to. The residential story is clear — younger professionals have been pricing out of Windsor, Paddington, and Kelvin Grove and finding Newmarket a 4–5km inner-city alternative with house and unit stock at 15–20% below those suburbs. The resulting demographic shift is visible in café culture: there is appetite for quality food and specialty coffee that the current strip on Enoggera Road does not fully serve.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Newmarket's Enoggera Road commercial strip runs from Ashgrove Avenue to Newmarket Road — approximately 800 metres of active retail. The current operator mix reflects the older demographic and commercial character: a mix of convenience retail, established takeaway operators, and a handful of independent cafés that serve quality but not specialty positioning. The gap between incoming demographic expectation (specialty coffee, quality brunch, fresh food) and current supply is the commercial opportunity that the early-mover operator can capture before the strip reprices.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>The suburb's proximity to the Newmarket and Wilston train stations makes it accessible to both the CBD professional commuter market and the inner-northern suburb catchment. Commuter foot traffic in the morning and evening peak adds to resident and student trade (Queensland University of Technology's Kelvin Grove campus is 2km east). This transit connection is a structural foot traffic advantage that many outer-ring suburbs without station access cannot replicate.</p>
          </div>
        </div>
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 18, fontWeight: 700, margin: '0 0 16px 0' }}>Competition Analysis</h2>
          <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Newmarket's commercial competition is moderate and not yet high-quality. The strip has established operators but few specialty operators targeting the arriving professional demographic. The competitive gap is real — a quality specialty café or quality lunch operator entering Newmarket in 2026 will not be fighting incumbent quality competition; they will be establishing the quality benchmark for a strip that doesn't yet have one.</p>
        </div>
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1C1917', margin: '0 0 20px 0' }}>What Works Here</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1C1917', margin: 0 }}>Specialty Café (Professional and Community Positioning)</h3>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, margin: 0 }}>The arriving professional demographic in Newmarket is the same cohort who would patronise a Paddington or West End café if they lived closer. They are seeking quality and are currently compromising on it in Newmarket. A specialty café with strong breakfast and brunch trade achieves community loyalty quickly. Revenue $30,000–$50,000/month within 12 months.</p>
            </div>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1C1917', margin: 0 }}>Fresh and Healthy Lunch (Takeaway-Forward)</h3>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, margin: 0 }}>Commuter foot traffic at Newmarket station creates a weekday takeaway lunch opportunity for a quality healthy food concept. QUT Kelvin Grove and professional residents add to the daily volume. Revenue $25,000–$40,000/month from a well-positioned takeaway operation.</p>
            </div>
            <div style={{ background: S.amberBg, border: `1px solid ${S.amberBdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1C1917', margin: 0 }}>Premium Dining (Full Service)</h3>
                <VerdictBadge v="CAUTION" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, margin: 0 }}>Newmarket's demographic is improving but not yet at Paddington or Bulimba levels for premium evening dining. A mid-price casual restaurant ($40–$55 per head) is viable; a premium concept ($70–$90 per head) requires additional time for the demographic to mature and develop evening dining habits locally.</p>
            </div>
          </div>
        </div>
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 18, fontWeight: 700, margin: '0 0 20px 0' }}>Key Risks</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 20 }}>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.amber}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#1C1917', margin: '0 0 4px 0' }}>Demographic Transition Still in Progress</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>Newmarket's professional demographic shift is real but not yet complete. Revenue in the first 12 months may underperform models built on the demographic endpoint rather than the current midpoint. Budget for an 18-month establishment curve.</p>
            </div>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.amber}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#1C1917', margin: '0 0 4px 0' }}>Strip Character Improvement Required</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>Enoggera Road's current mix of convenience retail and older food operators is not yet the character strip that attracts destination-shopping from across the northern suburbs. Early operators are building the strip's character as much as serving existing demand.</p>
            </div>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.amber}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#1C1917', margin: '0 0 4px 0' }}>Moderate Foot Traffic Base</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>Newmarket's foot traffic score (70/100) reflects real but not exceptional foot traffic. Operators who rely on passive walk-in customer acquisition alone will find customer acquisition slower than in Paddington or West End. Active community marketing required.</p>
            </div>
          </div>
        </div>
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1C1917', margin: '0 0 20px 0' }}>Compare Nearby Suburbs</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <Link href="/analyse/brisbane/paddington" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 16, cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = S.brand)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = S.border)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h4 style={{ color: '#1C1917', fontSize: 14, fontWeight: 700, margin: 0 }}>Paddington</h4>
                  <VerdictBadge v="GO" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: S.brand }}>87</div>
                <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>4km south, premier strip</div>
              </div>
            </Link>
            <Link href="/analyse/brisbane/toowong" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 16, cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = S.brand)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = S.border)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h4 style={{ color: '#1C1917', fontSize: 14, fontWeight: 700, margin: 0 }}>Toowong</h4>
                  <VerdictBadge v="GO" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: S.brand }}>73</div>
                <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>4km south, university gateway</div>
              </div>
            </Link>
            <Link href="/analyse/brisbane/nundah" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 16, cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = S.brand)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = S.border)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h4 style={{ color: '#1C1917', fontSize: 14, fontWeight: 700, margin: 0 }}>Nundah</h4>
                  <VerdictBadge v="GO" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: S.brand }}>72</div>
                <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>6km east, comparable stage</div>
              </div>
            </Link>
          </div>
        </div>
        <SuburbPoll suburb="Newmarket" votes={[44, 36, 20]} />
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 18, fontWeight: 700, margin: '0 0 20px 0' }}>Final Verdict</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Newmarket is a GO for patient operators who understand that the suburb is mid-transition, not post-transition. The demographic is arriving, the demand for quality is forming, and the rents ($2,500–$4,500/month) remain accessible. An operator who enters now and establishes quality ahead of the demographic completing its transition builds the loyalty that later entrants will find harder to displace.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>The Newmarket opportunity is most compelling for café and food operators willing to be community builders, not just product sellers. The suburb's commercial culture is forming — the operator who becomes part of that formation builds a position that is structurally advantaged relative to those who arrive after the strip has developed its character.</p>
          </div>
        </div>
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 18, fontWeight: 700, margin: '0 0 4px 0' }}>Frequently Asked Questions</h2>
          <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 20, marginTop: 20 }}>
            <h3 style={{ color: '#1C1917', fontSize: 15, fontWeight: 700, margin: '0 0 8px 0' }}>Is Newmarket Brisbane a good suburb for business?</h3>
            <p style={{ fontSize: 13, color: S.n900, lineHeight: 1.7, margin: 0 }}>For early-mover operators targeting the arriving professional demographic, yes. For operators requiring an immediately established customer base, Paddington or West End are safer. Newmarket rewards patience and community investment; it does not reward operators who need immediate high-volume trading from an established customer base.</p>
          </div>
          <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 20, marginTop: 20 }}>
            <h3 style={{ color: '#1C1917', fontSize: 15, fontWeight: 700, margin: '0 0 8px 0' }}>What is the commercial rent in Newmarket?</h3>
            <p style={{ fontSize: 13, color: S.n900, lineHeight: 1.7, margin: 0 }}>Enoggera Road prime positions: $3,000–$4,500/month. Secondary positions: $1,800–$3,000/month. Newmarket rents are among the most accessible of any Brisbane inner-northern suburb — appropriate for the current commercial development level.</p>
          </div>
          <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 20, marginTop: 20 }}>
            <h3 style={{ color: '#1C1917', fontSize: 15, fontWeight: 700, margin: '0 0 8px 0' }}>How does Newmarket compare to Nundah?</h3>
            <p style={{ fontSize: 13, color: S.n900, lineHeight: 1.7, margin: 0 }}>Both are middle-ring Brisbane suburbs at a similar stage of demographic transition. Nundah (Sandgate Road) has a more established café culture and community strip character, making it slightly more proven as an entry market. Newmarket has lower rents and less existing competition, making it the better early-mover value play for patient operators.</p>
          </div>
        </div>
        <div style={{ background: `linear-gradient(135deg, #059669 0%, #047857 100%)`, borderRadius: 16, padding: '40px 32px', marginBottom: 48, textAlign: 'center' as const }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: '#FFFFFF', margin: '0 0 10px 0' }}>Ready to analyse your Newmarket location?</h3>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', margin: '0 0 24px 0' }}>Get foot traffic, competition, demographics, and a GO/CAUTION/NO verdict for your specific address.</p>
          <Link href="/onboarding" style={{ display: 'inline-block', background: S.white, color: '#059669', padding: '13px 28px', borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>Analyse your address →</Link>
        </div>
        <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 32, paddingBottom: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' as const, gap: 12 }}>
          <Link href="/analyse/brisbane" style={{ fontSize: 13, fontWeight: 600, color: S.brand, textDecoration: 'none' }}>← Back to Brisbane</Link>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' as const }}>
            <Link href="/analyse/brisbane/paddington" style={{ fontSize: 13, color: S.brand, textDecoration: 'none' }}>Paddington</Link> <Link href="/analyse/brisbane/toowong" style={{ fontSize: 13, color: S.brand, textDecoration: 'none' }}>Toowong</Link> <Link href="/analyse/brisbane/nundah" style={{ fontSize: 13, color: S.brand, textDecoration: 'none' }}>Nundah</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
