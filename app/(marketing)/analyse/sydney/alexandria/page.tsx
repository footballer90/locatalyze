// app/(marketing)/analyse/sydney/alexandria/page.tsx
// Alexandria suburb deep-dive page

import Link from 'next/link'
import type { Metadata } from 'next'
import { ScoreBar } from '@/components/analyse/ScoreBar'
import { VerdictBadge } from '@/components/analyse/VerdictBadge'
import { RiskBadge } from '@/components/analyse/RiskBadge'
import { FAQSection } from '@/components/analyse/FAQSection'
import { CTASection } from '@/components/analyse/CTASection'
import { PollSection } from '@/components/analyse/PollSection'
import { SuburbCard } from '@/components/analyse/SuburbCard'
import { C } from '@/components/analyse/AnalyseTheme'

export const metadata: Metadata = {
  title: 'Opening a Business in Alexandria Sydney — Location Analysis 2026',
  description:
    'Alexandria business location analysis 2026. Score 78/100 — GO. Commercial gentrification, 25,000+ daytime workforce, $84,000 median income, Botany Road rents from $5,000/month. Full rent guide, best business models, revenue ranges, and break-even analysis for Alexandria NSW 2015.',
  alternates: { canonical: 'https://www.locatalyze.com/analyse/sydney/alexandria' },
  openGraph: {
    title: 'Opening a Business in Alexandria Sydney — 2026 Location Analysis',
    description: 'Alexandria scores 78/100 — GO. Most significant commercial gentrification story, 25,000+ daily workers, highest competition gap 78, warehouse economics, weekday strong. Full analysis inside.',
    url: 'https://www.locatalyze.com/analyse/sydney/alexandria',
  },
}

const FAQS = [
  {
    question: 'Is Alexandria good for a food business?',
    answer: 'Yes, strongly for workforce-focused models. Alexandria is not a traditional retail strip — it is an industrial-to-commercial transition zone with 25,000+ daily workers in creative and tech industries. The workforce is the target market, not the resident population. Specialty coffee roasteries targeting workforce achieve $25,000-$40,000/month. B2B catering and wholesale food businesses achieve strong margins. Traditional evening/weekend retail models fail because weekend traffic drops 60-70%.',
  },
  {
    question: 'What is the foot traffic like in Alexandria?',
    answer: 'Alexandria has bimodal foot traffic: strong weekday (8am-5pm) driven by 25,000+ daytime workforce; weak weekends driven only by 8,500 resident population. Daily weekday foot traffic is 5,000-8,000 in core areas. Weekend foot traffic drops to 1,500-2,500. The day/night split is more extreme than any other inner Sydney location. Businesses must be explicitly weekday-focused or have independent destination draw.',
  },
  {
    question: 'How do warehouse tenancies work commercially in Alexandria?',
    answer: 'Industrial and warehouse tenancies at $4,000-$6,500/month offer strong economics for businesses not requiring street frontage. A specialty coffee roastery, fitness studio, wholesale food operation, or B2B service operates profitably from warehouse space at costs impossible in traditional retail strips. Warehouse tenancy viability depends on not competing for foot traffic — your customers find you through positioning (online, wholesale relationships), not walk-in ambient traffic.',
  },
  {
    question: 'Does Alexandria trade well on weekends?',
    answer: 'No. Alexandria on weekends is significantly quieter than weekdays. The resident population of 8,500 is small; the daytime workforce is absent. Businesses targeting weekend trade need an independent destination draw (Saturday market, unique retail experience, fitness community) rather than relying on ambient foot traffic. Restaurants expecting Saturday/Sunday dinner trade fail in Alexandria.',
  },
  {
    question: 'What is the workforce demographic in Alexandria?',
    answer: 'The 25,000+ daily workforce skews heavily toward professional, creative, and tech industries (advertising, design, marketing, software, architecture). Median household income of $95,000+ for the workforce is significantly higher than the resident population ($84,000). Discretionary food spend is high — $15-$25 per lunch transaction typical. This is not a cost-conscious market; it is a quality/convenience-focused market. The workforce cares about coffee quality and food speed more than price.',
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

export default function AlexandriaPage() {
  return (
    <div style={{ backgroundColor: C.white, color: C.n900, minHeight: '100vh' }}>
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
          <span style={{ fontWeight: 600, color: C.n900 }}>Alexandria</span>
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
              <div style={{ fontSize: '13px', color: C.muted, marginBottom: '8px' }}>NSW 2015</div>
              <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: C.n900, margin: 0, lineHeight: '1.15' }}>
                Alexandria
              </h1>
            </div>
            <RiskBadge verdict="GO" />
          </div>
          <p style={{ fontSize: '17px', lineHeight: '1.75', color: C.muted, maxWidth: '860px', marginBottom: '36px' }}>
            Alexandria is Sydney's most significant commercial gentrification story. Former factory and warehouse buildings now house creative agencies, tech companies, architects, and design studios. The suburb has no King Street or Crown Street equivalent — business viability depends on understanding that customers come from the daytime workforce (25,000+ workers) rather than street foot traffic. The competition gap of 78 is exceptional: 25,000+ daytime workforce materially underserved by food and coffee options. Warehouse economics enable profitability impossible in traditional retail strips.
          </p>
          {/* Score Panel */}
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '32px', backgroundColor: C.n50, borderRadius: '14px', padding: '28px 32px', border: `1px solid ${C.border}`, alignItems: 'start' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '64px', fontWeight: 900, color: C.brand, lineHeight: 1, marginBottom: '4px' }}>78</div>
              <div style={{ fontSize: '12px', color: C.muted, fontWeight: 600 }}>/ 100</div>
              <div style={{ marginTop: '10px' }}><VerdictBadge verdict="GO" size="md" /></div>
            </div>
            <div style={{ minWidth: 0 }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: C.n700, marginBottom: '16px' }}>Score Breakdown</h3>
              <ScoreBar label="Foot Traffic" value={72} />
              <ScoreBar label="Area Demographics" value={84} />
              <ScoreBar label="Rent Viability" value={82} />
              <ScoreBar label="Competition Gap" value={78} />
              <ScoreBar label="Accessibility" value={74} />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section style={{ padding: '28px 24px', backgroundColor: C.n50, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px' }}>
            {[
              { label: 'Median Income', value: '$84,000' },
              { label: 'Daytime Workforce', value: '25,000+' },
              { label: 'Competition', value: 'Low-Medium' },
              { label: 'Best Hours', value: 'Mon-Fri 7am-7pm' },
            ].map((s) => (
              <div key={s.label} style={{ backgroundColor: C.white, borderRadius: '8px', border: `1px solid ${C.border}`, padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: C.mutedLight, fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: C.n900 }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rent Ranges */}
      <section style={{ padding: '48px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: C.n900, marginBottom: '20px' }}>Commercial Rent Guide — Alexandria</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
            {[
              { label: 'Botany Rd (Main Strip)', range: '$5,000–$8,500/mo', note: 'Primary street frontage. Essential for coffee and fast-casual food.' },
              { label: 'O\'Riordan St / Mitchell Rd', range: '$4,000–$7,000/mo', note: 'Secondary fronts and warehouse conversions with some street visibility.' },
              { label: 'Warehouse / Industrial Tenancy', range: '$3,500–$6,500/mo', note: 'No street frontage. Optimal for B2B, fitness, coffee roastery, producer businesses.' },
              { label: 'First Floor', range: '$2,500–$4,500/mo', note: 'Above-ground positions viable for professional services, studios, fitness.' },
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
                heading: 'Industrial-to-Commercial Transition',
                body: 'Alexandria is Sydney\'s most significant commercial gentrification story. Former factory and warehouse buildings now house creative agencies, tech companies, architects, and design studios. The suburb is not a traditional retail strip — it has no King Street or Crown Street equivalent. Business viability here depends on understanding that customers come from within the precinct (the daytime workforce) rather than from street foot traffic or residential walk-in trade. This fundamental difference changes every aspect of business model: location choice (warehouse vs street frontage), marketing strategy (workplace relationships vs ambient awareness), and operating hours (intense Mon-Fri 8am-5pm vs retail 7-day model).',
              },
              {
                heading: 'The Workforce Opportunity',
                body: 'The Alexandria workforce is the target market, not the residential population. The 8,500 residents are outnumbered by the 25,000+ daily workers in creative and tech industries. Median income of $84,000 in the resident population understates the spending power of the daily workforce, which skews toward $95,000+ professional incomes with high discretionary food spend. The workforce preferences are speed and quality, not price — a $7 specialty coffee and $16 lunch is accessible to this market. This creates a high-value customer base that is materially different from hourly-wage-dependent retail suburbs.',
              },
              {
                heading: 'Competition Gap — Best in Class',
                body: 'Alexandria scores 78 on competition gap — the highest of any suburb in this analysis. The 25,000+ daytime workforce is materially underserved by food and coffee options. The industrial nature of the suburb has historically limited hospitality development. This is changing rapidly but the gap remains significant. A single high-quality coffee operation in a warehouse can serve 200+ daily customers before reaching saturation. The supply-demand imbalance is exceptional. This is the fundamental reason why early-mover advantage in Alexandria outperforms equivalent entry into Surry Hills or Newtown.',
              },
              {
                heading: 'Rent Viability and Warehouse Economics',
                body: 'Industrial and warehouse tenancies at $4,000-$6,500/month offer genuinely strong economics for businesses not requiring street frontage. A specialty coffee roastery, fitness studio, wholesale food business, or B2B service operates profitably from warehouse space at costs impossible in traditional retail strips. The Alexandria advantage is not that rents are cheaper — they are comparable to Marrickville — the advantage is that warehouse spaces enable business models (B2B, production, fitness, wholesale) that cannot operate in street-frontage-dependent locations. The decision to pay $5,000/month for warehouse vs $5,500/month for street frontage changes profit structure entirely.',
              },
              {
                heading: 'Weekend — A Different Suburb',
                body: 'Alexandria on weekends is significantly quieter than weekdays. The 8,500-resident population is relatively small; the 25,000-worker daytime force is absent. Businesses targeting weekend trade need an independent reason for consumers to visit — a destination concept (farmers market, fitness community, gallery), retail experience that generates its own draw, or residential lifestyle service. Restaurants dependent on Saturday/Sunday dinner trade fail in Alexandria because the customer base departs each evening. This is the single most important misconception operators make: applying an all-week retail mindset to a weekday-dependent workforce market.',
              },
              {
                heading: 'Street Frontage vs Destination',
                body: 'The single most important decision for an Alexandria business is whether to pay for street frontage (Botany Road, $6,000+/month) or operate as a destination from warehouse space ($4,000-$5,000/month). For B2B, fitness, and professional services, destination is superior — customers find you through referral and positioning, not walk-in foot traffic. For coffee and fast-casual food, frontage on a well-trafficked route (Botany Road, O\'Riordan Street) is essential for capturing lunchtime workforce. The distinction is sharp and affects profitability: wrong choice kills the business.',
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

      {/* Best Business Models */}
      <section style={{ padding: '56px 24px', backgroundColor: C.white }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 800, color: C.n900, marginBottom: '10px', lineHeight: '1.2' }}>
            Best Business Models for Alexandria — Revenue & Break-even
          </h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '32px', maxWidth: '720px' }}>
            Alexandria works for workforce-focused models and B2B concepts. Retail and evening-dependent concepts fail. These four models capture the Alexandria market opportunity clearly.
          </p>
          <div style={{ display: 'grid', gap: '16px' }}>
            {[
              {
                model: 'Specialty Coffee — Workforce-Focused',
                verdict: 'Strong',
                verdictColor: C.emerald,
                rent: '$5,500–$7,000/mo',
                covers: '150–200/day',
                avgSpend: '$7–$12',
                monthlyRevenue: '$28,000–$42,000',
                breakEven: '4–6 months',
                note: 'Botany Road frontage with quick-service format. Targets morning + lunchtime workforce. High volume, fast transaction. Mon-Fri focus with Sat-Sun closed or minimal hours. Wholesale coffee bean sales add margin.',
              },
              {
                model: 'Fitness / Boxing / CrossFit Studio',
                verdict: 'Strong',
                verdictColor: C.emerald,
                rent: '$4,500–$6,500/mo',
                covers: '60–100 members',
                avgSpend: '$150–$220/month',
                monthlyRevenue: '$27,000–$40,000',
                breakEven: '4–7 months',
                note: 'Warehouse location optimal. Targets creative/tech workforce. Member acquisition from workplace communities. Weekend trade irrelevant — weekday evening peaks. Sticky revenue from membership base once established.',
              },
              {
                model: 'B2B Food / Catering Operation',
                verdict: 'Strong',
                verdictColor: C.emerald,
                rent: '$4,000–$5,500/mo',
                covers: 'N/A wholesale',
                avgSpend: '$1,200–$3,500/month',
                monthlyRevenue: '$32,000–$50,000',
                breakEven: '4–6 months',
                note: 'Wholesale food, catering, lunch delivery targeting local offices and creative agencies. Warehouse production facility optimal. B2B wholesale margins (35-45%) outperform retail. Weekend business minimal.',
              },
              {
                model: 'Professional Services / Creative Studio',
                verdict: 'Strong',
                verdictColor: C.emerald,
                rent: '$2,500–$4,500/mo',
                covers: 'N/A studio',
                avgSpend: '$150–$500/session',
                monthlyRevenue: '$15,000–$30,000',
                breakEven: '2–4 months',
                note: 'Design, photography, coaching, consulting targeting local creative community. Warehouse studio location. Low customer volume, high transaction value. Referral-driven acquisition. Rent-only model with high margins.',
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
                <div style={{ textAlign: 'center', minWidth: '80px' }}>
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      color: m.verdictColor,
                      backgroundColor: m.verdictColor === C.emerald ? C.emeraldBg : C.amberBg,
                      border: `1px solid ${m.verdictColor === C.emerald ? C.emeraldBdr : C.amberBdr}`,
                      padding: '4px 8px',
                      borderRadius: '4px',
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
                      { label: 'Volume', val: m.covers },
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
        </div>
      </section>

      {/* Who Should NOT Open in Alexandria */}
      <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 800, color: C.n900, marginBottom: '10px', lineHeight: '1.2' }}>
            Who Should Not Open in Alexandria
          </h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '28px', maxWidth: '720px' }}>
            Alexandria's 78 score reflects a strong but specialized market. These operator profiles consistently underperform here — not because the location is bad, but because their positioning does not align with Alexandria's fundamental dynamics.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {[
              {
                type: 'Traditional Retail Needing Weekend Foot Traffic',
                reason: 'Weekend foot traffic drops 60-70% when the workforce departs. Fashion retail, lifestyle goods, and furniture concepts dependent on weekend walk-in fail. The customer base is absent on Saturday and Sunday. Traditional retail models are structurally unviable.',
              },
              {
                type: 'Restaurants Dependent on Evening / Residential Trade',
                reason: 'Dinner service to a 8,500 resident population is thin. Evening foot traffic (5pm+) drops dramatically. Restaurants dependent on Friday/Saturday dinner revenue fail because the high-income workforce eats lunch at work and evening dining market is minimal.',
              },
              {
                type: 'Budget Concepts Requiring High Volume',
                reason: 'High-volume low-margin businesses (budget fast food, discount retail) depend on foot traffic density. Alexandria foot traffic is concentrated on specific streets and limited in overall volume. Volume-dependent models struggle because they cannot achieve sufficient transactions at low margins.',
              },
              {
                type: 'Car-Parking-Dependent Operators',
                reason: 'Limited parking near best tenancies (especially Botany Road and O\'Riordan Street). Car-dependent customer models underperform. The workforce uses public transport; residential customers are walkable. Operators building models around car access fail.',
              },
              {
                type: 'Businesses Without Explicit Weekday Optimization',
                reason: 'Any business model that assumes balanced daily/weekend trading fails. Alexandria is structurally weekday-dependent. A model that doesn\'t explicitly optimize for Mon-Fri intensity underperforms relative to purpose-built weekday concepts.',
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

      {/* Case Scenario */}
      <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: C.n900, marginBottom: '20px' }}>Mini Case Scenario</h2>
          <div style={{ backgroundColor: C.white, border: `1px solid ${C.border}`, borderRadius: '14px', padding: '28px' }}>
            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: C.brand, textTransform: 'uppercase', letterSpacing: '0.08em', backgroundColor: C.n100, padding: '4px 10px', borderRadius: '4px' }}>Concept</span>
              <p style={{ fontSize: '16px', fontWeight: 600, color: C.n900, margin: '10px 0 0', lineHeight: '1.5' }}>
                Specialty coffee roastery with front café, Mitchell Road warehouse tenancy, $5,000/month rent, workforce-focused model
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '24px', padding: '20px', backgroundColor: C.n50, borderRadius: '10px' }}>
              {[
                { label: 'Monthly Rent', value: '$5,000' },
                { label: 'Daily Workforce Covers', value: '150' },
                { label: 'Coffee Spend', value: '$7' },
                { label: 'Food Spend', value: '$14' },
                { label: 'Break-even Café', value: '4–6 months' },
              ].map((m) => (
                <div key={m.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: C.mutedLight, marginBottom: '4px', fontWeight: 600 }}>{m.label}</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: C.brand }}>{m.value}</div>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 700, color: C.n700, marginBottom: '10px' }}>Key Assumptions</h4>
              <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[
                  'Open Mon-Fri 7am-6pm, closed weekends (workforce hours focus)',
                  '150 daily covers from local workforce at $21 average transaction ($7 coffee + $14 food)',
                  'Wholesale coffee bean sales to local offices add $5,000-$8,000/month margin',
                  'Café captures 30-40% of lunch demand from immediate 500m radius offices',
                  'Minimal weekend revenue (<$500/week) — not relied upon for break-even',
                  'Space includes 8m x 8m production roastery + 20-seat café counter service',
                ].map((a) => (
                  <li key={a} style={{ fontSize: '13px', color: C.muted, lineHeight: '1.6' }}>{a}</li>
                ))}
              </ul>
            </div>
            <div style={{ padding: '16px', backgroundColor: C.emeraldBg, border: `1px solid ${C.emeraldBdr}`, borderRadius: '8px' }}>
              <p style={{ fontSize: '14px', color: C.emerald, lineHeight: '1.7', margin: 0 }}>
                <strong>Verdict:</strong> This concept works strongly in Alexandria. The hybrid café-roastery model captures daytime workforce spend with B2B wholesale margins. Warehouse location at $5,000/month enables profitability impossible at street-front pricing. Weekday focus aligns perfectly with market strength. Wholesale revenue separates this from retail café models.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mid-page CTA */}
      <section style={{ padding: '48px 24px', backgroundColor: C.n900 }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: C.brandLight, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
            Before You Sign a Lease
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: C.white, marginBottom: '12px', lineHeight: '1.3' }}>
            Check your specific Alexandria address
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', marginBottom: '24px', lineHeight: '1.65' }}>
            Street frontage (Botany Road, O'Riordan Street) foot traffic is materially higher than warehouse locations. Weekday foot traffic differs from weekend. Get address-level data — competitor count, hourly foot traffic, and a GO/CAUTION/NO verdict — before you negotiate.
          </p>
          <Link
            href="/onboarding"
            style={{
              display: 'inline-block',
              padding: '13px 28px',
              backgroundColor: C.brand,
              color: C.white,
              borderRadius: '7px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 700,
            }}
          >
            Analyse your Alexandria address →
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection faqs={FAQS} title="Alexandria Business Location — FAQ" id="faq" />

      {/* Nearby Suburbs */}
      <section style={{ padding: '48px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: C.n900, marginBottom: '20px' }}>Compare Nearby Suburbs</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <SuburbCard name="Surry Hills" slug="surry-hills" citySlug="sydney" description="Premium positioning, higher rent, established market, 7-day trading." score={87} verdict="GO" />
            <SuburbCard name="Marrickville" slug="marrickville" citySlug="sydney" description="Inner west alternative, gentrification arc, independent food culture." score={80} verdict="GO" />
            <SuburbCard name="Newtown" slug="newtown" citySlug="sydney" description="Stronger foot traffic, more established precinct, weekend-strong trade." score={81} verdict="GO" />
          </div>
        </div>
      </section>

      {/* Poll */}
      <PollSection suburbName="Alexandria" initialVotes={[48, 30, 22]} />

      {/* CTA */}
      <CTASection
        title="Ready to analyse an Alexandria address?"
        subtitle="Get a full data-driven analysis for any Alexandria address — foot traffic by hour, rent benchmarks, competitive mapping, and a GO/CAUTION/NO verdict."
        variant="teal"
      />

      {/* Footer Nav */}
      <section style={{ padding: '24px', backgroundColor: C.n50, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '13px' }}>
          <Link href="/analyse/sydney" style={{ color: C.brand, fontWeight: 600, textDecoration: 'none' }}>← Back to Sydney</Link>
          <Link href="/analyse/sydney/marrickville" style={{ color: C.brand, textDecoration: 'none' }}>Marrickville →</Link>
          <Link href="/analyse/sydney/surry-hills" style={{ color: C.brand, textDecoration: 'none' }}>Surry Hills →</Link>
          <Link href="/onboarding" style={{ color: C.emerald, fontWeight: 700, textDecoration: 'none' }}>Analyse free →</Link>
        </div>
      </section>
    </div>
  )
}
