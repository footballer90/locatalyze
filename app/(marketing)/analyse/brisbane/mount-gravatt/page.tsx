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
  { '@context': 'https://schema.org', '@type': 'Article', headline: 'Mount Gravatt Business Location Analysis 2026 — Locatalyze', description: "Griffith University's Nathan and South Bank campuses create a consistent student and academic demand base. Logan Road's commercial strip serves a family-student-professional mix with quality food and health services structurally underserved. Good rent-to-catchment ratio.", datePublished: '2026-04-01', dateModified: '2026-04-12', author: { '@type': 'Organization', name: 'Locatalyze', url: 'https://locatalyze.com' } },
  { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
    {
      '@type': 'Question',
      name: 'Is Mount Gravatt good for a café?',
      acceptedAnswer: { '@type': 'Answer', text: 'For a specialty café positioned for the Griffith University academic market, yes. A quality café within walking distance of Nathan campus serves a consistent weekday demand. For a generic café competing on convenience against established strip operators, the competition from chains and existing independents makes differentiation essential.' },
    },
    {
      '@type': 'Question',
      name: 'What is the commercial rent in Mount Gravatt?',
      acceptedAnswer: { '@type': 'Answer', text: 'Logan Road prime positions: $3,000–$4,500/month. Secondary positions and off-strip: $1,800–$3,000/month. University-adjacent positions near Nathan campus: $2,500–$4,000/month. Mount Gravatt rents are among the most accessible of any suburb with a major university anchor.' },
    },
    {
      '@type': 'Question',
      name: 'How does Griffith University affect Mount Gravatt business?',
      acceptedAnswer: { '@type': 'Answer', text: 'Griffith Nathan campus has 25,000+ students and staff generating consistent weekday food and service demand during semester. The academic demographic spends on quality coffee and food at above-average rates. The key constraint is semester structure — January and June–July have significantly reduced campus population.' },
    },
  ] },
]
export default function MountGravattPage() {
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
            <Link href="/analyse" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Analyse</Link>{' / '}<Link href="/analyse/brisbane" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Brisbane</Link>{' / '}Mount Gravatt
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 900, margin: '0 0 12px 0', lineHeight: 1.15 }}>Mount Gravatt</h1>
          <p style={{ fontSize: 16, lineHeight: 1.7, opacity: 0.9, margin: '0 0 28px 0', maxWidth: 620 }}>Griffith University's Nathan and South Bank campuses create a consistent student and academic demand base. Logan Road's commercial strip serves a family-student-professional mix with quality food and health services structurally underserved. Good rent-to-catchment ratio.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' as const }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '16px 24px', textAlign: 'center' as const }}>
              <div style={{ fontSize: 36, fontWeight: 900, lineHeight: 1 }}>72</div>
              <div style={{ fontSize: 11, opacity: 0.8, marginTop: 4 }}>Overall Score</div>
            </div>
            <div><VerdictBadge v="GO" /><div style={{ fontSize: 12, opacity: 0.75, marginTop: 8 }}>QLD 4122 • Revenue potential $25K–$55K/mo</div></div>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginTop: 32, marginBottom: 40 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 24px 0' }}>Location Scores</h2>
          <ScoreBar label='Foot Traffic' value={71} />
          <ScoreBar label='Demographics' value={72} />
          <ScoreBar label='Rent Viability' value={77} />
          <ScoreBar label='Competition Gap' value={70} />
        </div>
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 20px 0' }}>Business Environment</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Mount Gravatt's commercial story is anchored by two Griffith University campuses — Nathan (the main campus, 25,000+ students and staff) and the South Bank campus — whose combined population generates a consistent weekday demand base that doesn't depend on the suburb's residential character alone. Logan Road between the Gateway Motorway and Kessels Road is the primary commercial spine, carrying both the university catchment and the broader residential population of Mount Gravatt, Upper Mount Gravatt, and surrounding suburbs in a major south-eastern corridor.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>The residential demographic around Mount Gravatt is a genuine mix: established family households with children in local schools, a significant Chinese-Australian and South Asian community, and university-adjacent professional and academic households. Median household income sits around $78,000 — below the inner-ring average but reflective of a cost-sensitive catchment that spends heavily on food, education, and healthcare relative to income. Asian grocery, Asian restaurant, and culturally-specific food operators who understand this demographic find loyalty patterns that sustain businesses through economic cycles.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Logan Road's commercial character reflects this diversity. Quality Asian restaurants, Asian grocery operators, and mixed-use retail serve the multicultural residential population alongside mainstream chain operators. The gap is in quality food that sits between the Asian specialty market and the chain fast food offer — quality café, quality casual dining with broad appeal, and healthcare services that serve both the university population and surrounding families.</p>
          </div>
        </div>
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 16px 0' }}>Competition Analysis</h2>
          <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Mount Gravatt competition is established in Asian food and chain fast food. The gap for new operators is in quality café (the university academic demographic spends on specialty coffee at above-average rates; current supply is thin on this), quality casual dining for families (the family demographic drives to Garden City or Westfield Mount Gravatt for quality family dining rather than finding it locally), and allied health services for both the university and residential population.</p>
        </div>
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 20px 0' }}>What Works Here</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Specialty Café (Academic and Student Positioning)</h3>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, margin: 0 }}>Griffith University's Nathan campus generates consistent weekday coffee and food demand. A specialty café positioned for the academic market — quality coffee, laptop-friendly, quality food — achieves Mon–Fri volume from campus traffic. Revenue $30,000–$50,000/month. Semester calendar must be factored into annual projections.</p>
            </div>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Family Casual Dining (Mid-Price)</h3>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, margin: 0 }}>The Mount Gravatt family demographic drives out of the suburb for quality casual dining. A well-positioned mid-price family restaurant ($35–$55 per head, family-friendly format) on Logan Road can capture this spending locally. Revenue $35,000–$55,000/month with strong weekend family trade.</p>
            </div>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Allied Health (University-Served)</h3>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, margin: 0 }}>Griffith University's student and staff population has healthcare needs served by a thin supply of quality allied health within walking distance. A physiotherapy, dental, or psychology practice near the Nathan campus captures both student (bulk-billing) and professional (private) revenue. Revenue $40,000–$60,000/month.</p>
            </div>
          </div>
        </div>
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 20px 0' }}>Key Risks</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 20 }}>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.amber}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px 0' }}>Semester-Break Revenue Gaps</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>University-serving businesses face January and June–July revenue gaps when the student population is absent. Annual revenue modelling must account for semester structure — typically 32–36 weeks of full revenue and 16–20 weeks of reduced revenue.</p>
            </div>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.amber}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px 0' }}>Logan Road Vehicle Traffic vs Foot Traffic</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>Logan Road is a major arterial with high vehicle throughput but moderate pedestrian foot traffic compared to inner-city strips. Walk-in discovery is limited; marketing and signage must drive deliberate visits.</p>
            </div>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.amber}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px 0' }}>Westfield Mount Gravatt Competition</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>Westfield Mount Gravatt (Garden City) draws significant retail spending from the catchment. Strip operators must serve categories the centre doesn't host well or serve a community relationship the mall cannot build.</p>
            </div>
          </div>
        </div>
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 20px 0' }}>Compare Nearby Suburbs</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <Link href="/analyse/brisbane/greenslopes" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 16, cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = S.brand)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = S.border)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Greenslopes</h4>
                  <VerdictBadge v="GO" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: S.brand }}>73</div>
                <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>5km north, hospital district</div>
              </div>
            </Link>
            <Link href="/analyse/brisbane/carindale" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 16, cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = S.brand)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = S.border)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Carindale</h4>
                  <VerdictBadge v="GO" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: S.brand }}>71</div>
                <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>5km east, family anchor</div>
              </div>
            </Link>
            <Link href="/analyse/brisbane/annerley" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 16, cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = S.brand)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = S.border)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Annerley</h4>
                  <VerdictBadge v="GO" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: S.brand }}>70</div>
                <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>5km north, value play</div>
              </div>
            </Link>
          </div>
        </div>
        <SuburbPoll suburb=Mount Gravatt votes={[45, 36, 19]} />
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 20px 0' }}>Final Verdict</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Mount Gravatt is a GO for operators who position for either the university catchment or the family-multicultural residential demographic. The Griffith University anchor creates a structural demand base that is not weather-dependent or event-dependent — it is calendar-driven and consistent across semester. The residential demographic is diverse and loyalty-pattern-driven in ways that reward culturally-aligned operators.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>The risk is generic positioning. Mount Gravatt's strongest commercial performers are specific — specialty café for the academic market, Asian food for the community market, family dining for the residential market. Generic positioning that attempts to serve all three finds the competition from chains and existing specialists too strong. Pick a lane, serve it well, and the university anchor provides a reliable demand floor.</p>
          </div>
        </div>
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px 0' }}>Frequently Asked Questions</h2>
          <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 20, marginTop: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 8px 0' }}>Is Mount Gravatt good for a café?</h3>
            <p style={{ fontSize: 13, color: S.n900, lineHeight: 1.7, margin: 0 }}>For a specialty café positioned for the Griffith University academic market, yes. A quality café within walking distance of Nathan campus serves a consistent weekday demand. For a generic café competing on convenience against established strip operators, the competition from chains and existing independents makes differentiation essential.</p>
          </div>
          <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 20, marginTop: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 8px 0' }}>What is the commercial rent in Mount Gravatt?</h3>
            <p style={{ fontSize: 13, color: S.n900, lineHeight: 1.7, margin: 0 }}>Logan Road prime positions: $3,000–$4,500/month. Secondary positions and off-strip: $1,800–$3,000/month. University-adjacent positions near Nathan campus: $2,500–$4,000/month. Mount Gravatt rents are among the most accessible of any suburb with a major university anchor.</p>
          </div>
          <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 20, marginTop: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 8px 0' }}>How does Griffith University affect Mount Gravatt business?</h3>
            <p style={{ fontSize: 13, color: S.n900, lineHeight: 1.7, margin: 0 }}>Griffith Nathan campus has 25,000+ students and staff generating consistent weekday food and service demand during semester. The academic demographic spends on quality coffee and food at above-average rates. The key constraint is semester structure — January and June–July have significantly reduced campus population.</p>
          </div>
        </div>
        <div style={{ background: `linear-gradient(135deg, #059669 0%, #047857 100%)`, borderRadius: 16, padding: '40px 32px', marginBottom: 48, textAlign: 'center' as const }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: S.white, margin: '0 0 10px 0' }}>Ready to analyse your Mount Gravatt location?</h3>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', margin: '0 0 24px 0' }}>Get foot traffic, competition, demographics, and a GO/CAUTION/NO verdict for your specific address.</p>
          <Link href="/onboarding" style={{ display: 'inline-block', background: S.white, color: '#059669', padding: '13px 28px', borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>Analyse your address →</Link>
        </div>
        <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 32, paddingBottom: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' as const, gap: 12 }}>
          <Link href="/analyse/brisbane" style={{ fontSize: 13, fontWeight: 600, color: S.brand, textDecoration: 'none' }}>← Back to Brisbane</Link>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' as const }}>
            <Link href="/analyse/brisbane/greenslopes" style={{ fontSize: 13, color: S.brand, textDecoration: 'none' }}>Greenslopes</Link> <Link href="/analyse/brisbane/carindale" style={{ fontSize: 13, color: S.brand, textDecoration: 'none' }}>Carindale</Link> <Link href="/analyse/brisbane/annerley" style={{ fontSize: 13, color: S.brand, textDecoration: 'none' }}>Annerley</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
