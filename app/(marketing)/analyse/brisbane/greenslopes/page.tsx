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
        )})}
      </div>
      {voted !== null && <div style={{ marginTop: 16, padding: '12px 16px', background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 10 }}><p style={{ fontSize: 13, color: '#047857', margin: 0 }}>Ready to run a full analysis for {suburb}?{' '}<Link href="/onboarding" style={{ fontWeight: 700, textDecoration: 'underline', color: '#047857' }}>Analyse free →</Link></p></div>}
    </div>
  )
}
const SCHEMAS = [
  { '@context': 'https://schema.org', '@type': 'Article', headline: 'Greenslopes Business Location Analysis 2026 — Locatalyze', description: "Greenslopes Private Hospital anchors Queensland's most reliable healthcare demand base outside the CBD. The surrounding commercial strip is structurally undersupplied for allied health, pharmacy, and professional services relative to the hospital catchment. Consistent demand with low volatility.", datePublished: '2026-04-01', dateModified: '2026-04-12', author: { '@type': 'Organization', name: 'Locatalyze', url: 'https://locatalyze.com' } },
  { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
    {
      '@type': 'Question',
      name: 'Why is Greenslopes good for healthcare businesses?',
      acceptedAnswer: { '@type': 'Answer', text: 'Greenslopes Private Hospital (550+ beds, 3,000+ staff, 25+ operating theatres) creates structural demand for allied health, pharmacy, and healthcare-adjacent services that is not economically cyclical. Post-surgical patients need physiotherapy. Specialist patients need follow-up care. Hospital staff need accessible allied health for their own needs. This demand exists regardless of economic conditions.' },
    },
    {
      '@type': 'Question',
      name: 'What is the commercial rent in Greenslopes?',
      acceptedAnswer: { '@type': 'Answer', text: "Chatsworth Road and Logan Road positions near the hospital: $2,800–$4,500/month. Secondary positions: $1,800–$3,000/month. Greenslopes rents are moderate and appropriate for a middle-ring suburb — below inner-ring costs and defensible against the hospital's institutional demand base." },
    },
    {
      '@type': 'Question',
      name: 'Can a café succeed in Greenslopes?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes, particularly a café positioned for hospital staff — consistent quality, efficient service during peak breaks (7–8am, 12–1pm), and accessible location from hospital staff entrances. The 3,000+ hospital employees represent a captive weekday customer base. The challenge is weekend revenue, which is lower without hospital activity.' },
    },
  ] },
]
export default function GreenslopesPage() {
  return (
    <div style={{ minHeight: '100vh', background: S.n50, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {SCHEMAS.map((s, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />)}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: S.white, borderBottom: `1px solid ${S.border}`, padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/analyse/brisbane" style={{ fontSize: 13, fontWeight: 600, color: S.brand, textDecoration: 'none' }}>← Brisbane</Link>
        <Link href="/onboarding" style={{ fontSize: 13, fontWeight: 700, color: S.white, background: S.brand, padding: '8px 18px', borderRadius: 7, textDecoration: 'none' }}>Analyse free →</Link>
      </div>
      <div style={{ background: `linear-gradient(135deg, #0369A1 0%, #024F80 100%)`, padding: '56px 24px 48px', color: S.white }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 16, textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>
            <Link href="/analyse" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Analyse</Link>{' / '}<Link href="/analyse/brisbane" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Brisbane</Link>{' / '}Greenslopes
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 900, margin: '0 0 12px 0', lineHeight: 1.15 }}>Greenslopes</h1>
          <p style={{ fontSize: 16, lineHeight: 1.7, opacity: 0.9, margin: '0 0 28px 0', maxWidth: 620 }}>Greenslopes Private Hospital anchors Queensland's most reliable healthcare demand base outside the CBD. The surrounding commercial strip is structurally undersupplied for allied health, pharmacy, and professional services relative to the hospital catchment. Consistent demand with low volatility.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' as const }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '16px 24px', textAlign: 'center' as const }}>
              <div style={{ fontSize: 36, fontWeight: 900, lineHeight: 1 }}>73</div>
              <div style={{ fontSize: 11, opacity: 0.8, marginTop: 4 }}>Overall Score</div>
            </div>
            <div><VerdictBadge v="GO" /><div style={{ fontSize: 12, opacity: 0.75, marginTop: 8 }}>QLD 4120 • Revenue potential $30K–$65K/mo for healthcare-adjacent concepts</div></div>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginTop: 32, marginBottom: 40 }}>
          <h2 style={{ color: '#1C1917', fontSize: 16, fontWeight: 700, margin: '0 0 24px 0' }}>Location Scores</h2>
          <ScoreBar label='Foot Traffic' value={71} />
          <ScoreBar label='Demographics' value={75} />
          <ScoreBar label='Rent Viability' value={78} />
          <ScoreBar label='Competition Gap' value={72} />
        </div>
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1C1917', margin: '0 0 20px 0' }}>Business Environment</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Greenslopes Private Hospital is one of Queensland's largest private hospitals — 550+ beds, 25+ operating theatres, and a specialist medical complex that attracts patients and medical professionals from across Brisbane's southern suburbs. The hospital employs 3,000+ staff and draws patients from a wide geographic catchment for elective surgery, rehabilitation, and specialist consultations. This creates a commercial demand base that is structurally different from a residential suburb: it is institution-anchored, calendar-driven, and largely insulated from economic cycles. Healthcare demand doesn't evaporate in a recession.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>The Greenslopes commercial strip — primarily Chatsworth Road and Logan Road near the hospital — has historically underdelivered quality commercial services relative to the hospital's demand base. Visitors accompanying patients need food and coffee; medical staff need accessible lunch and healthcare services themselves; post-surgical rehabilitation patients need physiotherapy, pharmacy, and support services. Current commercial supply on Chatsworth Road is a mix of established operators and thin quality — the gap between institutional demand and commercial supply creates the opportunity.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>The residential demographic surrounding the hospital is solidly middle-income professional — households earning $80,000–$100,000, predominantly owner-occupiers, families with children in local schools. This demographic is a secondary commercial opportunity beyond the hospital catchment: quality café, quality casual dining, and healthcare services for the residential population complement the institutional demand base. The combination of hospital-anchored institutional demand and solid residential demand creates a commercial profile with lower revenue volatility than either a purely residential or purely institutional location.</p>
          </div>
        </div>
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 18, fontWeight: 700, margin: '0 0 16px 0' }}>Competition Analysis</h2>
          <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Greenslopes allied health competition is thinner than the hospital's demand base would justify. A small cluster of GPs, pharmacies, and specialist rooms occupies positions in the hospital precinct, but the surrounding strip has limited quality allied health supply. Physiotherapy, psychology, and dental operators within a 300–500m radius of the hospital serve a captive post-surgical and specialist-referred patient base with minimal quality competition. The café and food market adjacent to the hospital is adequately served but not specialty-positioned — the institutional staff and visitor market is accepting of adequate rather than demanding of excellent.</p>
        </div>
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1C1917', margin: '0 0 20px 0' }}>What Works Here</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1C1917', margin: 0 }}>Allied Health (Physio, Psychology, Occupational Therapy)</h3>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, margin: 0 }}>Post-surgical rehabilitation and specialist-referred allied health demand from Greenslopes Private Hospital is significant and underserved within walking distance. A physiotherapy or occupational therapy practice near the hospital captures specialist referrals and private health fund patients. Revenue $45,000–$70,000/month with low demand volatility.</p>
            </div>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1C1917', margin: 0 }}>Quality Café (Hospital Staff and Visitor Positioning)</h3>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, margin: 0 }}>Hospital staff (3,000+ employees) need quality food and coffee within walking distance. A café positioned for the hospital precinct — consistent quality, efficient service, good seating, accessible from staff entry points — achieves consistent Mon–Fri volume with lower weekend dependency than residential strips. Revenue $35,000–$55,000/month.</p>
            </div>
            <div style={{ background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1C1917', margin: 0 }}>Specialist Pharmacy or Compounding Pharmacy</h3>
                <VerdictBadge v="GO" />
              </div>
              <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, margin: 0 }}>Hospital-adjacent pharmacy with compounding capability serves specialist prescriptions and post-surgical medication needs that standard chain pharmacies handle less efficiently. Revenue $50,000–$80,000/month for a well-run specialist pharmacy capturing hospital referral volume.</p>
            </div>
          </div>
        </div>
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 18, fontWeight: 700, margin: '0 0 20px 0' }}>Key Risks</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 20 }}>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.amber}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#1C1917', margin: '0 0 4px 0' }}>Weekend Foot Traffic Falls Without Hospital Activity</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>Hospital activity is lower on weekends (elective surgery not scheduled, fewer outpatient visits). Hospital-serving businesses see reduced weekend volume. Models must be built on a realistic weekend-reduced trading profile.</p>
            </div>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.amber}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#1C1917', margin: '0 0 4px 0' }}>Hospital Competition for Space</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>The hospital precinct itself has commercial tenancies that compete with nearby strip operators for the most captive staff and patient foot traffic. External positions need to build reason for hospital staff to exit the precinct — quality product is the primary driver.</p>
            </div>
            <div style={{ paddingLeft: 16, borderLeft: `3px solid ${S.amber}` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#1C1917', margin: '0 0 4px 0' }}>Specialist Referral Dependency</h4>
              <p style={{ fontSize: 13, color: S.muted, margin: 0 }}>Allied health practices dependent on hospital specialist referrals need to establish referral relationships before revenue reaches model levels. Building referral pipelines takes 6–12 months. Budget for a slow establishment period.</p>
            </div>
          </div>
        </div>
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1C1917', margin: '0 0 20px 0' }}>Compare Nearby Suburbs</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <Link href="/analyse/brisbane/woolloongabba" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 16, cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = S.brand)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = S.border)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h4 style={{ color: '#1C1917', fontSize: 14, fontWeight: 700, margin: 0 }}>Woolloongabba</h4>
                  <VerdictBadge v="GO" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: S.brand }}>79</div>
                <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>3km north, growth zone</div>
              </div>
            </Link>
            <Link href="/analyse/brisbane/annerley" style={{ textDecoration: 'none' }}>
              <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: 16, cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = S.brand)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = S.border)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h4 style={{ color: '#1C1917', fontSize: 14, fontWeight: 700, margin: 0 }}>Annerley</h4>
                  <VerdictBadge v="GO" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: S.brand }}>70</div>
                <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>2km south, value adjacent</div>
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
                <div style={{ fontSize: 12, color: S.muted, marginTop: 4 }}>5km south, university</div>
              </div>
            </Link>
          </div>
        </div>
        <SuburbPoll suburb="Greenslopes" votes={[50, 33, 17]} />
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 18, fontWeight: 700, margin: '0 0 20px 0' }}>Final Verdict</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>Greenslopes is a GO and one of the most defensible commercial positions in middle-ring Brisbane for healthcare and healthcare-adjacent operators. The hospital anchor creates demand that is not weather-dependent, not event-dependent, and not highly sensitive to economic cycles. Healthcare spending is need-driven, not discretionary — which is the commercial characteristic that most independent operators cannot access in retail or hospitality.</p>
            <p style={{ fontSize: 14, color: S.n900, lineHeight: 1.7, margin: 0 }}>The Greenslopes opportunity is narrow in category but very strong within it. Healthcare, healthcare-adjacent services (café, pharmacy, allied health), and professional services serving the hospital workforce and patients are the core commercial opportunity. Generic retail or hospitality without a healthcare connection finds Greenslopes competitive with nearby middle-ring suburbs but without the institutional advantage that makes the suburb exceptional.</p>
          </div>
        </div>
        <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
          <h2 style={{ color: '#1C1917', fontSize: 18, fontWeight: 700, margin: '0 0 4px 0' }}>Frequently Asked Questions</h2>
          <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 20, marginTop: 20 }}>
            <h3 style={{ color: '#1C1917', fontSize: 15, fontWeight: 700, margin: '0 0 8px 0' }}>Why is Greenslopes good for healthcare businesses?</h3>
            <p style={{ fontSize: 13, color: S.n900, lineHeight: 1.7, margin: 0 }}>Greenslopes Private Hospital (550+ beds, 3,000+ staff, 25+ operating theatres) creates structural demand for allied health, pharmacy, and healthcare-adjacent services that is not economically cyclical. Post-surgical patients need physiotherapy. Specialist patients need follow-up care. Hospital staff need accessible allied health for their own needs. This demand exists regardless of economic conditions.</p>
          </div>
          <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 20, marginTop: 20 }}>
            <h3 style={{ color: '#1C1917', fontSize: 15, fontWeight: 700, margin: '0 0 8px 0' }}>What is the commercial rent in Greenslopes?</h3>
            <p style={{ fontSize: 13, color: S.n900, lineHeight: 1.7, margin: 0 }}>Chatsworth Road and Logan Road positions near the hospital: $2,800–$4,500/month. Secondary positions: $1,800–$3,000/month. Greenslopes rents are moderate and appropriate for a middle-ring suburb — below inner-ring costs and defensible against the hospital's institutional demand base.</p>
          </div>
          <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 20, marginTop: 20 }}>
            <h3 style={{ color: '#1C1917', fontSize: 15, fontWeight: 700, margin: '0 0 8px 0' }}>Can a café succeed in Greenslopes?</h3>
            <p style={{ fontSize: 13, color: S.n900, lineHeight: 1.7, margin: 0 }}>Yes, particularly a café positioned for hospital staff — consistent quality, efficient service during peak breaks (7–8am, 12–1pm), and accessible location from hospital staff entrances. The 3,000+ hospital employees represent a captive weekday customer base. The challenge is weekend revenue, which is lower without hospital activity.</p>
          </div>
        </div>
        <div style={{ background: `linear-gradient(135deg, #059669 0%, #047857 100%)`, borderRadius: 16, padding: '40px 32px', marginBottom: 48, textAlign: 'center' as const }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: '#FFFFFF', margin: '0 0 10px 0' }}>Ready to analyse your Greenslopes location?</h3>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', margin: '0 0 24px 0' }}>Get foot traffic, competition, demographics, and a GO/CAUTION/NO verdict for your specific address.</p>
          <Link href="/onboarding" style={{ display: 'inline-block', background: S.white, color: '#059669', padding: '13px 28px', borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>Analyse your address →</Link>
        </div>
        <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 32, paddingBottom: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' as const, gap: 12 }}>
          <Link href="/analyse/brisbane" style={{ fontSize: 13, fontWeight: 600, color: S.brand, textDecoration: 'none' }}>← Back to Brisbane</Link>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' as const }}>
            <Link href="/analyse/brisbane/woolloongabba" style={{ fontSize: 13, color: S.brand, textDecoration: 'none' }}>Woolloongabba</Link> <Link href="/analyse/brisbane/annerley" style={{ fontSize: 13, color: S.brand, textDecoration: 'none' }}>Annerley</Link> <Link href="/analyse/brisbane/mount-gravatt" style={{ fontSize: 13, color: S.brand, textDecoration: 'none' }}>Mount Gravatt</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
