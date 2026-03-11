// app/(marketing)/about/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Locatalyze — Built by Australian Founders, for Australian Founders',
  description:
    'Locatalyze was built after watching too many great Australian businesses fail because they chose the wrong location. Meet the team behind the product.',
}

const S = {
  page:    { fontFamily: "'DM Sans','Helvetica Neue',Arial,sans-serif", background: '#F8FAFC', minHeight: '100vh', color: '#0F172A' },
  hero:    { background: 'linear-gradient(135deg,#0F766E 0%,#0891B2 100%)', padding: '80px 24px 72px', textAlign: 'center' as const },
  heroEye: { display: 'inline-block', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase' as const, marginBottom: 16 },
  heroH1:  { fontSize: 'clamp(28px,5vw,48px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.15, margin: '0 auto 20px', maxWidth: 700 },
  heroSub: { fontSize: 18, color: 'rgba(255,255,255,0.7)', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 },
  inner:   { maxWidth: 780, margin: '0 auto', padding: '0 24px' },
  section: { padding: '64px 24px' },
  h2:      { fontSize: 28, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.025em', marginBottom: 16, lineHeight: 1.25 },
  body:    { fontSize: 16, color: '#475569', lineHeight: 1.8, marginBottom: 16 },
  card:    { background: '#fff', border: '1px solid #E2E8F0', borderRadius: 20, padding: '36px 32px', marginBottom: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
  storyQuote: {
    borderLeft: '3px solid #0F766E', paddingLeft: 20, margin: '28px 0',
    fontSize: 18, fontStyle: 'italic', color: '#334155', lineHeight: 1.7,
  },
  statGrid:  { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 20, margin: '32px 0' },
  statCard:  { background: '#fff', border: '1px solid #E2E8F0', borderRadius: 16, padding: '24px 20px', textAlign: 'center' as const },
  statNum:   { fontSize: 36, fontWeight: 900, color: '#0F766E', letterSpacing: '-0.03em', display: 'block' },
  statLabel: { fontSize: 13, color: '#64748B', marginTop: 4, lineHeight: 1.4 },
  valGrid:   { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 20, marginTop: 28 },
  valCard:   { background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 14, padding: '24px 20px' },
  valTitle:  { fontSize: 15, fontWeight: 700, color: '#065F46', marginBottom: 8 },
  valBody:   { fontSize: 13, color: '#6B7280', lineHeight: 1.6 },
  divider:   { borderTop: '1px solid #E2E8F0', margin: '0 24px' },
  cta:       { background: 'linear-gradient(135deg,#0F766E,#0891B2)', borderRadius: 20, padding: '48px 32px', textAlign: 'center' as const, margin: '0 24px 64px' },
  ctaTitle:  { fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: '-0.025em', marginBottom: 12 },
  ctaSub:    { fontSize: 16, color: 'rgba(255,255,255,0.7)', marginBottom: 28, lineHeight: 1.6 },
  ctaBtn:    {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: '#fff', color: '#0F766E', borderRadius: 12, padding: '14px 28px',
    fontWeight: 800, fontSize: 15, textDecoration: 'none',
  },
  teamCard:  { background: '#fff', border: '1px solid #E2E8F0', borderRadius: 16, padding: '28px 24px', display: 'flex', gap: 20, alignItems: 'flex-start' },
  avatar:    { width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,#0F766E,#0891B2)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, color: '#fff' },
  teamName:  { fontSize: 17, fontWeight: 700, color: '#0F172A', marginBottom: 2 },
  teamRole:  { fontSize: 13, color: '#0F766E', fontWeight: 600, marginBottom: 10 },
  teamBio:   { fontSize: 14, color: '#64748B', lineHeight: 1.65 },
  press:     { display: 'flex', gap: 12, flexWrap: 'wrap' as const, marginTop: 20 },
  pressTag:  { background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: 8, padding: '6px 12px', fontSize: 12, color: '#475569', fontWeight: 600 },
}

export default function AboutPage() {
  return (
    <div style={S.page}>

      {/* Hero */}
      <div style={S.hero}>
        <span style={S.heroEye}>About Locatalyze</span>
        <h1 style={S.heroH1}>
          Built by founders who have seen what happens when you pick the wrong location
        </h1>
        <p style={S.heroSub}>
          Locatalyze exists because a $200,000+ commercial lease decision should not depend on gut feel and a Google Maps scroll.
        </p>
      </div>

      {/* Origin story */}
      <section style={S.section}>
        <div style={S.inner}>
          <h2 style={S.h2}>Why we built this</h2>
          <p style={S.body}>
            In 2022, a close friend signed a 5-year lease on a cafe in what looked like a great street. The foot traffic was strong on weekends. The suburb felt up-and-coming. Within 14 months, the business had closed — the demographics didn&apos;t support midweek trade, two larger competitors were already dominant within 400 metres, and the rent-to-revenue ratio was never viable.
          </p>
          <p style={S.body}>
            The painful part: every one of those problems was knowable in advance. The data existed. No accessible tool pulled it together into a clear verdict before the lease was signed.
          </p>
          <blockquote style={S.storyQuote}>
            &ldquo;The data to make a better decision existed. It just wasn&apos;t accessible to someone signing a lease — only to someone with a data team and six weeks to spare.&rdquo;
          </blockquote>
          <p style={S.body}>
            Locatalyze was built to close that gap. We pull together competitor density, demographic spending patterns, commercial rent benchmarks, foot traffic signals and AI-modelled financials — and distill them into a single verdict: GO, CAUTION, or NO. In 30 seconds.
          </p>
        </div>
      </section>

      <div style={S.divider} />

      {/* Stats */}
      <section style={S.section}>
        <div style={S.inner}>
          <h2 style={S.h2}>The product so far</h2>
          <div style={S.statGrid}>
            {[
              { num: '180+', label: 'Location analyses run' },
              { num: '94%',  label: 'User-verified accuracy on GO verdicts' },
              { num: '6',    label: 'Australian capital cities covered' },
              { num: '30s',  label: 'Average report generation time' },
            ].map(s => (
              <div key={s.num} style={S.statCard}>
                <span style={S.statNum}>{s.num}</span>
                <span style={S.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
          <p style={S.body}>
            Every analysis is backed by live data from Google Places, 2021 ABS Census population and income figures, and commercial lease benchmarks aggregated from Australian property listings. The AI narrative layer synthesises this data into readable projections — it does not hallucinate the underlying numbers.
          </p>
        </div>
      </section>

      <div style={S.divider} />

      {/* Values */}
      <section style={S.section}>
        <div style={S.inner}>
          <div style={S.card}>
            <h2 style={{ ...S.h2, marginBottom: 8 }}>What we stand for</h2>
            <p style={S.body}>
              Locatalyze is an Australian product built for the Australian market. We care about three things above everything else.
            </p>
            <div style={S.valGrid}>
              {[
                {
                  title: 'Transparent methodology',
                  body: 'Every score is explained. Every data source is documented. We publish our weighting model on our Methodology page. We do not want our product to be a black box.',
                },
                {
                  title: 'Honest limitations',
                  body: 'Our reports clearly state what the data cannot tell you. No tool replaces a site visit, a conversation with a local agent, or professional legal and financial advice. We say this on every report.',
                },
                {
                  title: 'Built for the decision-maker',
                  body: 'Our users are signing leases, not reading research papers. Every design decision is made for the founder on the ground — not for the analyst with a spreadsheet.',
                },
              ].map(v => (
                <div key={v.title} style={S.valCard}>
                  <div style={S.valTitle}>{v.title}</div>
                  <div style={S.valBody}>{v.body}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div style={S.divider} />

      {/* Team */}
      <section style={S.section}>
        <div style={S.inner}>
          <h2 style={S.h2}>The team</h2>
          <p style={{ ...S.body, marginBottom: 32 }}>
            Locatalyze is an early-stage product built and operated by a small team based in Perth and Melbourne, Australia.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              {
                initials: 'F',
                name:     'Founder',
                role:     'Product & Engineering',
                bio:      'Background in software engineering and commercial property. Built Locatalyze after personally experiencing the cost of a poorly-located business venture. Focused on making sophisticated location data accessible to every Australian SMB founder.',
              },
            ].map(p => (
              <div key={p.name} style={S.teamCard}>
                <div style={S.avatar}>{p.initials}</div>
                <div>
                  <div style={S.teamName}>{p.name}</div>
                  <div style={S.teamRole}>{p.role}</div>
                  <div style={S.teamBio}>{p.bio}</div>
                  <div style={S.press}>
                    <span style={S.pressTag}>Perth, WA</span>
                    <span style={S.pressTag}>Australian-built</span>
                    <a href="https://linkedin.com/company/locatalyze" target="_blank" rel="noopener noreferrer"
                      style={{ ...S.pressTag, textDecoration: 'none', color: '#0F766E', borderColor: '#99F6E4' }}>
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p style={{ ...S.body, marginTop: 24, fontSize: 14, color: '#94A3B8' }}>
            We are a small team. If you are an experienced commercial property analyst, data engineer, or growth marketer with an interest in joining — reach out via our{' '}
            <Link href="/contact" style={{ color: '#0F766E', fontWeight: 600 }}>contact page</Link>.
          </p>
        </div>
      </section>

      <div style={S.divider} />

      {/* Press / contact */}
      <section style={S.section}>
        <div style={S.inner}>
          <h2 style={S.h2}>Press and partnerships</h2>
          <p style={S.body}>
            For media enquiries, partnership discussions, or API access for commercial property platforms, please contact us via our{' '}
            <Link href="/contact" style={{ color: '#0F766E', fontWeight: 600 }}>contact page</Link>.
            We respond to all serious enquiries within 2 business days.
          </p>
          <p style={S.body}>
            If you are a franchise network, commercial real estate agent, or property platform interested in integrating location feasibility data into your workflow, we would like to speak with you.
          </p>
        </div>
      </section>

      {/* CTA */}
      <div style={S.cta}>
        <div style={S.ctaTitle}>See the product for yourself</div>
        <p style={S.ctaSub}>
          Run a free location analysis on any Australian address. No credit card required.
        </p>
        <Link href="/auth/signup" style={S.ctaBtn}>
          Try Locatalyze free
        </Link>
      </div>

    </div>
  )
}