// app/(marketing)/analyse/sydney/parramatta/page.tsx
// Parramatta suburb deep-dive — unique content, production SEO

import Link from 'next/link'
import type { Metadata } from 'next'
import { ScoreBar } from '@/components/analyse/ScoreBar'
import { VerdictBadge } from '@/components/analyse/VerdictBadge'
import { RiskBadge } from '@/components/analyse/RiskBadge'
import { ComparisonTable } from '@/components/analyse/ComparisonTable'
import { FAQSection } from '@/components/analyse/FAQSection'
import { CTASection } from '@/components/analyse/CTASection'
import { PollSection } from '@/components/analyse/PollSection'
import { SuburbCard } from '@/components/analyse/SuburbCard'
import { C } from '@/components/analyse/AnalyseTheme'

export const metadata: Metadata = {
  title: 'Opening a Business in Parramatta Sydney — 2026 Location Analysis',
  description:
    'Parramatta scores 84/100 — best rent-to-foot-traffic ratio in Greater Sydney. Church Street rents, Parramatta Square demographic impact, best business models, revenue ranges, and who should not open here. Full 2026 analysis for NSW 2150.',
  alternates: { canonical: 'https://www.locatalyze.com/analyse/sydney/parramatta' },
  openGraph: {
    title: 'Opening a Business in Parramatta Sydney — 2026 Location Analysis',
    description: 'Parramatta scores 84/100. 40,000+ daily workers, 40% lower rents than inner Sydney. Full business location analysis with revenue ranges and break-even estimates.',
    url: 'https://www.locatalyze.com/analyse/sydney/parramatta',
  },
}

const FAQS = [
  {
    question: 'Is Parramatta good for a restaurant or café?',
    answer: "Parramatta scores 84/100 — the best risk-adjusted performer in Greater Sydney. For cafés, the Parramatta Square worker morning coffee market is substantially underserved by specialty coffee. For restaurants, quality casual and multicultural dining both have genuine market gaps. Avoid replicating a Surry Hills premium dining concept; instead, position for the worker lunch market and multicultural family dining.",
  },
  {
    question: 'How does Parramatta compare to Sydney CBD for business?',
    answer: "Parramatta captures 70–75% of CBD foot traffic at 40–45% of CBD rent. For independent operators in the $30–$70 transaction range, this is materially better unit economics. CBD is preferable for luxury positioning and international tourist-dependent concepts. Parramatta is better for everyday hospitality, multicultural food, retail, professional services, and any concept where rent coverage is the primary risk.",
  },
  {
    question: 'What is Parramatta Square and why does it matter for business?',
    answer: 'Parramatta Square is a $3B commercial development that added 20,000+ professional and government workers to the Parramatta CBD. NAB, KPMG, and multiple NSW government agencies occupy the towers. This workforce has household incomes averaging $105,000+ and creates consistent weekday demand for quality food, coffee, and services. It has permanently changed the demographic profile of the Church Street precinct.',
  },
  {
    question: 'What businesses succeed in Parramatta?',
    answer: "Consistently successful in Parramatta: multicultural food operators (Lebanese, Indian, Pakistani, Middle Eastern), specialty coffee (supply gap), professional services (legal, financial, allied health), value-to-mid retail (not luxury), health and wellness (growing professional catchment). Consistently underperforming: premium dining ($80+ per head), luxury retail, CBD-style volume fast food in secondary positions.",
  },
  {
    question: 'What are commercial rents in Parramatta?',
    answer: "Church Street Core (prime): $5,500–$8,500/month. Church Street North (Parramatta Square precinct): $4,000–$6,500/month. Macquarie Street/Government area: $3,500–$6,000/month. Secondary streets: $2,500–$4,500/month. Rents increased 15–18% since 2023 following Parramatta Square completion but remain 40% below comparable Surry Hills positions.",
  },
  {
    question: 'How does the multicultural community affect business in Parramatta?',
    answer: "Parramatta has the most diverse demographic profile of any major Sydney commercial centre. Lebanese, South Asian, Middle Eastern, East Asian, and Pacific Islander communities create specialty food markets with exceptional loyalty characteristics. Lebanese restaurants on Church Street have operated for 20+ years. For food operators targeting multicultural communities, Parramatta's catchment is genuinely unmatched in Greater Sydney.",
  },
]

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: { '@type': 'Answer', text: f.answer },
  })),
}

export default function ParramattaPage() {
  return (
    <div style={{ backgroundColor: '#FFFFFF', color: '#1C1917', minHeight: '100vh' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />

      {/* Sticky Nav */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          backgroundColor: C.white,
          borderBottom: `1px solid ${C.border}`,
          zIndex: 40,
          padding: '12px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', gap: '6px', fontSize: '13px', color: C.muted, alignItems: 'center' }}>
          <Link href="/analyse" style={{ color: C.brand, textDecoration: 'none' }}>Analyse</Link>
          <span>›</span>
          <Link href="/analyse/sydney" style={{ color: C.brand, textDecoration: 'none' }}>Sydney</Link>
          <span>›</span>
          <span style={{ fontWeight: 600, color: C.n900 }}>Parramatta</span>
        </div>
        <Link
          href="/onboarding"
          style={{ padding: '8px 18px', backgroundColor: C.emerald, color: C.white, borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: 700 }}
        >
          Analyse free →
        </Link>
      </nav>

      {/* Hero */}
      <section style={{ padding: '56px 24px', backgroundColor: C.white, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '13px', color: C.muted, marginBottom: '8px' }}>NSW 2150 · Western Sydney</div>
              <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: C.n900, margin: 0, lineHeight: '1.15' }}>
                Parramatta
              </h1>
            </div>
            <RiskBadge verdict="GO" />
          </div>
          <p style={{ fontSize: '17px', lineHeight: '1.75', color: C.muted, maxWidth: '860px', marginBottom: '36px' }}>
            Parramatta is not the second choice. For most business categories, it delivers <strong>the strongest unit economics in Greater Sydney</strong>: 15,000+ daily pedestrians on Church Street, a professional class of 40,000+ government and corporate workers from Parramatta Square, and commercial rents that are 40–50% below inner Sydney equivalents. The demographic upgrade from Parramatta Square — which brought KPMG, NAB, and 5,000+ government workers to a previously retail-dominated precinct — has permanently changed the spending profile of this market.
          </p>

          {/* Score Panel */}
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '32px', backgroundColor: C.n50, borderRadius: '14px', padding: '28px 32px', border: `1px solid ${C.border}`, alignItems: 'start' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '64px', fontWeight: 900, color: C.emerald, lineHeight: 1, marginBottom: '4px' }}>84</div>
              <div style={{ fontSize: '12px', color: C.muted, fontWeight: 600 }}>/ 100</div>
              <div style={{ marginTop: '10px' }}><VerdictBadge verdict="GO" size="md" /></div>
            </div>
            <div style={{ minWidth: 0 }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: C.n700, marginBottom: '16px' }}>Score Breakdown</h3>
              <ScoreBar label="Foot Traffic" value={86} />
              <ScoreBar label="Area Demographics" value={82} />
              <ScoreBar label="Rent Viability" value={88} />
              <ScoreBar label="Competition Gap" value={79} />
              <ScoreBar label="Accessibility" value={90} />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section style={{ padding: '28px 24px', backgroundColor: C.n50, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '14px' }}>
            {[
              { label: 'Median Income', value: '$78,000' },
              { label: 'Daily Workers', value: '40,000+' },
              { label: 'Competition', value: 'Medium' },
              { label: 'Verdict', value: 'GO' },
            ].map((s) => (
              <div key={s.label} style={{ backgroundColor: C.white, borderRadius: '8px', border: `1px solid ${C.border}`, padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: C.mutedLight, fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: s.value === 'GO' ? C.emerald : C.n900 }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rent Ranges */}
      <section style={{ padding: '48px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: C.n900, marginBottom: '20px' }}>Commercial Rent Guide — Parramatta</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
            {[
              { label: 'Church Street (Core)', range: '$5,500–$8,500/mo', note: 'Prime pedestrian strip, highest foot traffic, Westfield proximity.' },
              { label: 'Church Street (North)', range: '$4,000–$6,500/mo', note: 'Growing precinct north of Parramatta Square. Corporate worker catchment.' },
              { label: 'Macquarie Street Precinct', range: '$3,500–$6,000/mo', note: 'Government and legal professional strip. Strong weekday lunch trade.' },
              { label: 'Secondary Streets', range: '$2,500–$4,500/mo', note: 'George Street, Phillip Street. Accessible rents for services businesses.' },
            ].map((r) => (
              <div key={r.label} style={{ backgroundColor: C.white, borderRadius: '10px', border: `1px solid ${C.border}`, padding: '20px' }}>
                <div style={{ fontSize: '12px', color: C.muted, marginBottom: '8px', fontWeight: 600 }}>{r.label}</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: C.brand, marginBottom: '6px' }}>{r.range}</div>
                <div style={{ fontSize: '12px', color: C.muted, lineHeight: '1.5' }}>{r.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Analysis Sections */}
      <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gap: '40px' }}>
            {[
              {
                heading: 'Parramatta Square: The Demographic Accelerator',
                body: "Parramatta Square is the single most important commercial development in Western Sydney in two decades. The six-tower development — housing NAB, the Department of Communities, KPMG, and 20,000+ workers — transformed a precinct that was primarily retail-dominated into a genuine commercial CBD. The workers arriving in Parramatta Square have household incomes averaging $105,000+ — materially higher than the Parramatta suburb average of $78,000. This high-income layer now walks Church Street for lunch, coffee, and after-work hospitality. The demographic upgrade is permanent and its commercial effects are only partially priced into current rents.",
              },
              {
                heading: 'Church Street: The Economics Argument',
                body: "Church Street generates 15,000–18,000 daily pedestrians in its core zone, comparable to many inner-Sydney strips. Prime Church Street rent runs $5,500–$8,500/month versus $9,000–$14,000 for equivalent positions in Surry Hills. The math is stark: an operator in Parramatta pays 40% less in rent for 75–80% of the foot traffic. The revenue gap required to bridge this is modest; the rent savings are significant. For most business categories — café, restaurant, retail — Parramatta's unit economics outperform inner Sydney on a risk-adjusted basis. The exception: concepts requiring aspirational eastern suburbs positioning cannot replicate Surry Hills or Bondi demographics in Parramatta.",
              },
              {
                heading: "Multicultural Advantage — Parramatta's Hidden Strength",
                body: "Parramatta has the most diverse demographic profile of any major Sydney commercial centre. Lebanese, South Asian, Middle Eastern, East Asian, and Pacific Islander communities create specialty food markets with exceptional loyalty characteristics. Lebanese restaurants on Church Street have operated for 20+ years with consistent trade; Indian and Pakistani food operators command customer loyalty that inner-city operators rarely achieve. For food operators targeting multicultural communities, Parramatta's catchment is genuinely unmatched in Greater Sydney. This loyalty dynamic is structural, not transient — it reflects deep community roots, not trend-driven spending.",
              },
              {
                heading: 'Weekday vs Weekend: Two Economic Cycles',
                body: "Parramatta runs two distinct economic cycles. Weekdays (Monday–Friday) are driven by the 40,000+ professional and government workers concentrated in the Parramatta Square and Westfield precincts — strong lunch trade, good morning coffee, consistent afternoon retail. Weekends shift to family and community patterns — shopping centre dominance, multicultural dining, lower corporate spend. Operators who model only the weekday worker dynamic underestimate weekend family trade; those who model only family trade underestimate the weekday professional opportunity. Both revenue streams are real and complementary. The best-positioned businesses in Parramatta serve both.",
              },
              {
                heading: 'Competition Landscape: Growing But Gaps Remain',
                body: "Parramatta's medium competition score (79) reflects a market that is contested but not saturated. The rapid growth of the corporate worker population has created demand that the existing supply has not fully addressed. Specifically: specialty coffee (third-wave café culture is underrepresented on Church Street despite $105K+ average worker incomes), quality casual dining ($35–$60 range is underserved), and premium health/wellness. These gaps are not theoretical — Parramatta Square workers currently travel to Harris Park or Westfield for premium positioning that should be available on Church Street. First-movers into these gaps capture loyal repeat customers with limited alternatives.",
              },
              {
                heading: 'Infrastructure and Accessibility',
                body: "Parramatta scores 90 on accessibility — the highest of any Sydney suburb in our dataset. The Parramatta light rail, Parramatta Station (T1 and Sydney Trains), multiple bus routes, and the planned Western Sydney metro extension make Parramatta the most transport-accessible suburban commercial centre in NSW. This accessibility multiplies the catchment: operators in Parramatta draw customers from a 20km radius via public transport, not just local residents and workers. It also means Parramatta can support higher-density retail models than comparable outer suburbs with weaker transport connections.",
              },
            ].map((section) => (
              <div key={section.heading}>
                <h2 style={{ fontSize: '22px', fontWeight: 700, color: C.n900, marginBottom: '14px', lineHeight: '1.3' }}>{section.heading}</h2>
                <p style={{ fontSize: '15px', lineHeight: '1.8', color: C.n800, margin: 0 }}>{section.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages & Disadvantages */}
      <section style={{ padding: '48px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>Advantages & Disadvantages</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            <div style={{ backgroundColor: C.emeraldBg, border: `1px solid ${C.emeraldBdr}`, borderRadius: '12px', padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: C.emerald, marginBottom: '16px' }}>Advantages</h3>
              <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  "Best rent-to-foot-traffic ratio in Greater Sydney — 75% of CBD foot traffic at 40% of CBD rent",
                  'Parramatta Square corporate workforce creates guaranteed weekday demand at above-average incomes',
                  'Multicultural demographics drive loyalty patterns unavailable in inner Sydney',
                  'Highest accessibility score (90/100) — largest PT catchment radius of any suburban centre',
                  'Infrastructure investment pipeline (light rail, metro extension) permanently elevating profile',
                  'Lower competition relative to demand — premium segments materially underserved',
                  'Growing residential density via apartment development adding permanent resident base',
                ].map((a) => (
                  <li key={a} style={{ fontSize: '14px', color: C.n800, lineHeight: '1.6' }}>{a}</li>
                ))}
              </ul>
            </div>
            <div style={{ backgroundColor: C.amberBg, border: `1px solid ${C.amberBdr}`, borderRadius: '12px', padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: C.amber, marginBottom: '16px' }}>Disadvantages</h3>
              <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  'Westfield concentration risk: dominates retail spending and can undercut independents on price',
                  'Premium positioning is harder than inner Sydney — aspirational dining demand is lower',
                  'Traffic congestion during peak periods affects delivery and customer parking',
                  'Church Street construction disruption from light rail has ongoing impact (clearing late 2026)',
                  'Some demographic segments are price-sensitive — $70+/head dinner is harder to sustain',
                  'Evening economy still developing — weeknight dinner weaker than inner Sydney',
                ].map((d) => (
                  <li key={d} style={{ fontSize: '14px', color: C.n800, lineHeight: '1.6' }}>{d}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>Parramatta vs Comparable Sydney Suburbs</h2>
          <ComparisonTable
            rows={[
              { name: 'Parramatta', score: 84, verdict: 'GO', rent: '$3,500–$8,500', footTraffic: 'High', bestFor: 'Most categories, multicultural food' },
              { name: 'Surry Hills', score: 87, verdict: 'GO', rent: '$8,000–$14,000', footTraffic: 'Very High', bestFor: 'Premium hospitality, specialty retail' },
              { name: 'Chatswood', score: 82, verdict: 'GO', rent: '$6,000–$10,000', footTraffic: 'High', bestFor: 'Asian market, professional services' },
              { name: 'North Sydney', score: 76, verdict: 'GO', rent: '$5,500–$9,000', footTraffic: 'High (weekday)', bestFor: 'Corporate lunch, professional services' },
              { name: 'Blacktown', score: 71, verdict: 'GO', rent: '$1,800–$3,200', footTraffic: 'Medium', bestFor: 'Value retail, non-premium concepts' },
            ]}
          />
        </div>
      </section>

      {/* Case Scenario */}
      <section style={{ padding: '48px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: C.n900, marginBottom: '20px' }}>Mini Case Scenario</h2>
          <div style={{ backgroundColor: C.white, border: `1px solid ${C.border}`, borderRadius: '14px', padding: '28px' }}>
            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: C.brand, textTransform: 'uppercase', letterSpacing: '0.08em', backgroundColor: C.n100, padding: '4px 10px', borderRadius: '4px' }}>Concept</span>
              <p style={{ fontSize: '16px', fontWeight: 600, color: C.n900, margin: '10px 0 0', lineHeight: '1.5' }}>
                Quality casual restaurant — modern Australian/fusion, $45–$65 average spend, targeting Parramatta Square worker lunch and Friday dinner trade
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '24px', padding: '20px', backgroundColor: C.n50, borderRadius: '10px' }}>
              {[
                { label: 'Monthly Rent', value: '$7,000' },
                { label: 'Daily Covers Needed', value: '95' },
                { label: 'Avg Spend', value: '$52' },
                { label: 'Break-even', value: '5–7 months' },
              ].map((m) => (
                <div key={m.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: C.mutedLight, marginBottom: '4px', fontWeight: 600 }}>{m.label}</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: C.brand }}>{m.value}</div>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 700, color: C.n700, marginBottom: '10px' }}>Key Assumptions</h4>
              <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[
                  'Lunch service (12–2:30pm): 60 covers weekdays, 40 weekends',
                  'Dinner service (6–9:30pm): 35 covers Thursday–Saturday',
                  'BYO licence reduces beverage complexity while maintaining customer spend',
                  '4–6 person team with casual Thursday–Saturday dinner additions',
                  'Church Street Core position to capture Parramatta Square worker foot traffic',
                ].map((a) => (
                  <li key={a} style={{ fontSize: '13px', color: C.muted, lineHeight: '1.6' }}>{a}</li>
                ))}
              </ul>
            </div>
            <div style={{ padding: '16px', backgroundColor: C.emeraldBg, border: `1px solid ${C.emeraldBdr}`, borderRadius: '8px' }}>
              <p style={{ fontSize: '14px', color: C.n800, lineHeight: '1.7', margin: 0 }}>
                <strong>Verdict:</strong> Parramatta rewards operators who position correctly. The quality casual gap is real — there is no established quality-casual Australian restaurant on Church Street despite 40,000+ workers with above-average incomes. First-mover into this gap captures loyal repeat customers who currently have no equivalent option. Break-even is achievable within 6 months at these cover targets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Target Customer */}
      <section style={{ padding: '32px 24px', backgroundColor: C.n50, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ padding: '20px 24px', backgroundColor: C.white, borderRadius: '10px', border: `1px solid ${C.border}` }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: C.brand, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Target Customer Profile</span>
            <p style={{ fontSize: '15px', color: C.n800, margin: '8px 0 0', lineHeight: '1.6' }}>
              Government and corporate workers (35–50) from Parramatta Square, multicultural families across diverse communities (Lebanese, South Asian, Middle Eastern, East Asian, Pacific Islander), Western Sydney professionals, and visitors from the broader western corridor arriving via train and bus.
            </p>
          </div>
        </div>
      </section>

      {/* Poll */}
      <PollSection suburbName="Parramatta" initialVotes={[58, 28, 14]} />

      {/* Nearby Suburbs */}
      <section style={{ padding: '48px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: C.n900, marginBottom: '20px' }}>Compare Nearby Suburbs</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <SuburbCard name="Merrylands" slug="merrylands" citySlug="sydney" description="Multicultural hub at lower rent. 50% below Parramatta core." score={74} verdict="GO" />
            <SuburbCard name="Auburn" slug="auburn" citySlug="sydney" description="Turkish and Middle Eastern market. Inner west value." score={71} verdict="GO" />
            <SuburbCard name="Blacktown" slug="blacktown" citySlug="sydney" description="Outer west scale play. Lower rents, large catchment." score={71} verdict="GO" />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection faqs={FAQS} title="Parramatta Business FAQs" />

      {/* CTA */}
      {/* ── GOOD VS BAD POSITIONING ── */}
      <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: C.n900, marginBottom: '24px', lineHeight: '1.3' }}>
            Good vs Bad: Parramatta Business Positioning
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div style={{ padding: '24px', backgroundColor: C.emeraldBg, border: `1px solid ${C.emeraldBdr}`, borderRadius: '12px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: C.emerald, marginBottom: '14px' }}>What Works in Parramatta</h3>
              <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  'Quality casual dining at $40–$65 per head (huge supply gap)',
                  'Specialty coffee / third-wave café (severely underrepresented)',
                  'Multicultural food operators (Lebanese, South Asian, Middle Eastern)',
                  'Allied health practices (growing professional catchment)',
                  'Professional services (legal, accounting, financial)',
                  'Lunch-focused concepts on Church Street Core position',
                ].map((item) => (
                  <li key={item} style={{ fontSize: '13px', color: '#047857', lineHeight: '1.6' }}>{item}</li>
                ))}
              </ul>
            </div>
            <div style={{ padding: '24px', backgroundColor: C.redBg, border: `1px solid ${C.redBdr}`, borderRadius: '12px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: C.red, marginBottom: '14px' }}>What to Avoid in Parramatta</h3>
              <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  'Luxury / fine dining ($90+ per head) — demographic doesn\'t sustain it',
                  'Premium fashion retail — Westfield captures this category',
                  'Concepts requiring exclusively high-income Eastern Suburbs demographic',
                  'Evening-heavy concepts (weeknight dinner is weaker than inner Sydney)',
                  'Volume discount fast food near Westfield (oversaturated)',
                  'Anything that ignores the multicultural community opportunity',
                ].map((item) => (
                  <li key={item} style={{ fontSize: '13px', color: '#991B1B', lineHeight: '1.6' }}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── PARRAMATTA VS CBD ECONOMICS ── */}
      <section style={{ padding: '48px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: C.n900, marginBottom: '8px', lineHeight: '1.3' }}>
            Parramatta vs Sydney CBD: The Economics Case
          </h2>
          <p style={{ fontSize: '14px', color: C.muted, marginBottom: '24px' }}>
            The same business concept in two different locations — a stark comparison of unit economics.
          </p>
          <div style={{ backgroundColor: C.n50, borderRadius: '12px', border: `1px solid ${C.border}`, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', backgroundColor: C.n100, padding: '14px 20px', borderBottom: `1px solid ${C.border}` }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: C.n700 }}>Factor</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: C.emerald, textAlign: 'center' }}>Parramatta</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: C.amber, textAlign: 'center' }}>Sydney CBD</div>
            </div>
            {[
              { factor: 'Monthly rent (150sqm)', a: '$6,000–$8,500', b: '$18,000–$35,000' },
              { factor: 'Daily covers to cover rent', a: '85–110', b: '280–420' },
              { factor: 'Foot traffic', a: '15,000–18,000/day', b: '35,000–60,000/day' },
              { factor: 'Office occupancy (Mon–Fri)', a: '85–90% (govt workers)', b: '65–70% (hybrid)' },
              { factor: 'Multicultural food demand', a: 'Very high', b: 'Moderate' },
              { factor: 'Quality casual gap', a: 'Significant', b: 'Minimal (saturated)' },
              { factor: 'Competition (F&B)', a: 'Medium', b: 'Very High' },
              { factor: 'Weekend trade', a: 'Good (family/community)', b: 'Weak (office workers gone)' },
            ].map((row, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '12px 20px', borderBottom: `1px solid ${C.border}` }}>
                <div style={{ fontSize: '13px', color: C.n800, fontWeight: 500 }}>{row.factor}</div>
                <div style={{ fontSize: '13px', color: C.emerald, textAlign: 'center', fontWeight: 600 }}>{row.a}</div>
                <div style={{ fontSize: '13px', color: C.amber, textAlign: 'center', fontWeight: 600 }}>{row.b}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '16px', padding: '18px 22px', backgroundColor: C.emeraldBg, border: `1px solid ${C.emeraldBdr}`, borderRadius: '10px' }}>
            <p style={{ fontSize: '14px', color: C.n800, margin: 0, lineHeight: '1.7' }}>
              <strong>The takeaway:</strong> The CBD offers more absolute foot traffic, but Parramatta requires dramatically fewer covers to achieve profitability. For a quality casual restaurant needing 95 covers/day vs 350, the risk-adjusted outcome in Parramatta is materially superior. Only luxury or volume-chain concepts justify CBD economics.
            </p>
          </div>
        </div>
      </section>

      {/* ── GROWTH SIGNALS ── */}
      <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: C.n900, marginBottom: '20px', lineHeight: '1.3' }}>
            Parramatta Growth Signals — Why Now
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            {[
              { icon: 'Infrastructure', title: 'Parramatta Light Rail', body: 'Stage 1 operational 2023. Expanded catchment from Westmead to Carlingford. New customer flows to Church Street precinct.' },
              { icon: 'Commercial', title: 'Parramatta Square', body: '20,000+ professional workers in 6 towers — NAB, KPMG, NSW Government. Average income $105K+. Permanent demographic upgrade.' },
              { icon: 'Gateway', title: 'Western Sydney Airport', body: 'Badgerys Creek development lifting outer west commercial value. Parramatta positioned as gateway city for the entire western corridor.' },
              { icon: 'Residential', title: 'Residential Density Growth', body: '12,000+ new apartments approved for Parramatta CBD. Permanent resident base adding to worker catchment weekends and evenings.' },
            ].map((signal) => (
              <div key={signal.title} style={{ padding: '20px', backgroundColor: '#FFFFFF', borderRadius: '10px', border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: C.brand, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px', backgroundColor: C.n100, display: 'inline-block', padding: '3px 8px', borderRadius: '3px' }}>{signal.icon}</div>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: C.n900, marginBottom: '8px' }}>{signal.title}</h3>
                <p style={{ fontSize: '13px', color: C.muted, lineHeight: '1.6', margin: 0 }}>{signal.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Business Models */}
      <section style={{ padding: '56px 24px', backgroundColor: C.white }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 800, color: C.n900, marginBottom: '10px', lineHeight: '1.2' }}>
            Best Business Models for Parramatta — Revenue & Break-even
          </h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '32px', maxWidth: '720px' }}>
            Parramatta's 84 score reflects a market that rewards a range of formats. These models have the strongest risk-adjusted track record in the current Church Street and Parramatta Square environment.
          </p>
          <div style={{ display: 'grid', gap: '16px' }}>
            {[
              {
                model: 'Specialty Coffee / Third-Wave Café',
                verdict: 'Highest Opportunity',
                verdictColor: C.emerald,
                rent: '$5,500–$7,500/mo',
                covers: '150–200/day',
                avgSpend: '$8–$12',
                monthlyRevenue: '$22,000–$34,000',
                breakEven: '4–6 months',
                note: 'The single biggest supply gap in Parramatta. Third-wave coffee culture is severely underrepresented on Church Street despite 40,000+ workers with household incomes averaging $105K. The Parramatta Square precinct worker does not currently have a specialty coffee destination comparable to those in the CBD or North Sydney.',
              },
              {
                model: 'Quality Casual Restaurant ($40–$65 avg spend)',
                verdict: 'Strong',
                verdictColor: C.emerald,
                rent: '$6,000–$8,500/mo',
                covers: '80–110/day',
                avgSpend: '$48–$58',
                monthlyRevenue: '$28,000–$46,000',
                breakEven: '5–7 months',
                note: 'Quality casual dining in the $40–$65 range is the most underserved segment on Church Street. The government and corporate worker lunch market is substantial — Parramatta Square workers currently travel to Harris Park or Westfield for quality positioning that should be available within the Church Street core. First-mover captures loyal repeat trade.',
              },
              {
                model: 'Multicultural Food — Lebanese / South Asian / Middle Eastern',
                verdict: 'Strong',
                verdictColor: C.emerald,
                rent: '$4,000–$7,000/mo',
                covers: '120–180/day',
                avgSpend: '$18–$28',
                monthlyRevenue: '$24,000–$42,000',
                breakEven: '3–5 months',
                note: "Parramatta's strongest existing business category. Lebanese restaurants on Church Street have operated for 20+ years with consistent trade — driven by community loyalty that inner-city operators rarely achieve. For culturally-specific food concepts, the community catchment provides a structural revenue base that is more resilient than trend-driven suburban markets.",
              },
              {
                model: 'Allied Health — Physio / Psychology / Dental',
                verdict: 'Strong',
                verdictColor: C.emerald,
                rent: '$3,500–$6,000/mo',
                sessions: '100–160 sessions/week',
                avgSpend: '$90–$160/session',
                monthlyRevenue: '$35,000–$80,000',
                breakEven: '2–4 months',
                note: 'Professional and government worker concentration makes Parramatta one of the strongest allied health markets outside the CBD. Growing residential population from apartment development adds a permanent weekend patient base. Medicare bulk-billing creates consistent low-income demand; private fee-for-service meets the $105K+ professional cohort.',
              },
            ].map((m) => (
              <div
                key={m.model}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  gap: '24px',
                  padding: '24px',
                  backgroundColor: C.n50,
                  borderRadius: '12px',
                  border: `1px solid ${C.border}`,
                  alignItems: 'start',
                }}
              >
                <div style={{ textAlign: 'center', minWidth: '90px' }}>
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      color: m.verdictColor,
                      backgroundColor: C.emeraldBg,
                      border: `1px solid ${C.emeraldBdr}`,
                      padding: '4px 8px',
                      borderRadius: '4px',
                      lineHeight: '1.3',
                    }}
                  >
                    {m.verdict}
                  </div>
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: C.n900, marginBottom: '12px' }}>{m.model}</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', marginBottom: '14px' }}>
                    {[
                      { label: 'Rent', val: m.rent },
                      { label: 'Volume', val: m.covers || m.sessions },
                      { label: 'Avg Spend', val: m.avgSpend },
                      { label: 'Monthly Revenue', val: m.monthlyRevenue },
                      { label: 'Break-even', val: m.breakEven },
                    ].map((stat) => (
                      <div key={stat.label} style={{ backgroundColor: C.white, borderRadius: '6px', padding: '10px 12px', border: `1px solid ${C.border}` }}>
                        <div style={{ fontSize: '10px', color: C.mutedLight, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '3px' }}>{stat.label}</div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: C.n900 }}>{stat.val}</div>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: '13px', color: C.muted, lineHeight: '1.65', margin: 0 }}>{m.note}</p>
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '13px', color: C.mutedLight, marginTop: '20px', lineHeight: '1.6' }}>
            Revenue ranges based on current Church Street rent and foot traffic data (CBRE Q1 2026, Locatalyze analysis). Compare Parramatta against <Link href="/analyse/sydney/ultimo" style={{ color: C.brand, textDecoration: 'none' }}>Ultimo</Link> or <Link href="/analyse/sydney" style={{ color: C.brand, textDecoration: 'none' }}>all Sydney suburbs</Link>.
          </p>
        </div>
      </section>

      {/* Who Should NOT Open in Parramatta */}
      <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 800, color: C.n900, marginBottom: '10px', lineHeight: '1.2' }}>
            Who Should Not Open in Parramatta
          </h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '28px', maxWidth: '720px' }}>
            Parramatta's 84 score is the strongest in Western Sydney — but it is not a universal market. These operator profiles consistently underperform here.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {[
              {
                type: 'Fine dining operators ($90+ per head)',
                reason: 'The average Parramatta household income is $78,000. The Parramatta Square worker cohort averages $105K. Neither demographic sustains a $90+ per head dinner experience reliably. This positioning works in the Eastern Suburbs; it does not convert in Parramatta at sufficient volume.',
              },
              {
                type: 'Luxury retail and premium fashion',
                reason: 'Westfield Parramatta captures the aspirational retail spend in the precinct. Independent luxury retail competing against Westfield brands — without the foot traffic advantage of the centre — struggles structurally.',
              },
              {
                type: 'Operators who need Eastern Suburbs demographics',
                reason: 'Bondi, Surry Hills, and Paddington have specific demographic profiles — younger, higher disposable income, lifestyle-driven spending. If your concept requires that demographic, Parramatta is the wrong market. The customer base is professional, multicultural, family-oriented, and value-conscious.',
              },
              {
                type: 'Evening-heavy restaurant concepts',
                reason: 'Weeknight dinner trade in Parramatta is weaker than inner Sydney. The corporate worker returns to the suburbs after 5pm; the evening dining economy is developing but not yet comparable to inner-city strips. Lunch-focused or all-day concepts perform materially better.',
              },
              {
                type: 'High-density fast food near Westfield',
                reason: "McDonald's, KFC, and global QSR chains dominate the Westfield precinct. Independent operators attempting to compete on price and volume within 200m of Westfield are fighting on the wrong terrain. The opportunity for independents is differentiation — not volume competition.",
              },
              {
                type: 'Operators without multicultural positioning awareness',
                reason: "Parramatta's commercial culture is built on multicultural community loyalty. Concepts that ignore or are culturally tone-deaf to the Lebanese, South Asian, Middle Eastern, East Asian, and Pacific Islander communities that anchor the suburb's dining and retail economy miss what makes the market function.",
              },
            ].map((item) => (
              <div key={item.type} style={{ padding: '20px', backgroundColor: C.white, borderRadius: '10px', border: `1px solid ${C.border}` }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: C.n900, marginBottom: '8px' }}>{item.type}</h3>
                <p style={{ fontSize: '13px', color: C.muted, lineHeight: '1.65', margin: 0 }}>{item.reason}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mid-page CTA */}
      <section style={{ padding: '48px 24px', backgroundColor: C.n900 }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: C.brandLight, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
            Before You Sign
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', marginBottom: '12px', lineHeight: '1.3' }}>
            Church Street rents vary by 30–40% within 500 metres
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', marginBottom: '24px', lineHeight: '1.65' }}>
            A Church Street Core position versus a secondary street position in Parramatta is not the same decision. Get address-level foot traffic, competitor density, and a GO/CAUTION/NO verdict before you negotiate your lease.
          </p>
          <Link
            href="/onboarding"
            style={{
              display: 'inline-block',
              padding: '13px 28px',
              backgroundColor: C.emerald,
              color: '#FFFFFF',
              borderRadius: '7px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 700,
            }}
          >
            Analyse your Parramatta address →
          </Link>
        </div>
      </section>

      <CTASection
        title="Ready to analyse a Parramatta address?"
        subtitle="Get a full data-driven analysis for any Parramatta address — Church Street foot traffic, rent benchmarks, competitive mapping, and a GO/CAUTION/NO verdict."
        variant="teal"
      />

      {/* Footer Nav */}
      <section style={{ padding: '24px', backgroundColor: C.n50, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '13px' }}>
          <Link href="/analyse/sydney" style={{ color: C.brand, fontWeight: 600, textDecoration: 'none' }}>← Back to Sydney</Link>
          <Link href="/analyse/sydney/ultimo" style={{ color: C.brand, textDecoration: 'none' }}>Ultimo →</Link>
          <Link href="/analyse/sydney/surry-hills" style={{ color: C.brand, textDecoration: 'none' }}>Surry Hills →</Link>
          <Link href="/onboarding" style={{ color: C.emerald, fontWeight: 700, textDecoration: 'none' }}>Analyse free →</Link>
        </div>
      </section>
    </div>
  )
}
