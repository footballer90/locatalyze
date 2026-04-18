// app/(marketing)/analyse/sydney/ultimo/page.tsx
// Ultimo suburb deep-dive page — unique content, no filler

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
  title: 'Opening a Business in Ultimo Sydney — Location Analysis 2026',
  description:
    'Ultimo business location analysis 2026. Score 68/100 — CAUTION. 45,000+ UTS students, only 6 independent cafés in the catchment, Harris Street rents from $4,500/month. Full rent guide, best business models, revenue ranges, and break-even analysis for Ultimo NSW 2007.',
  alternates: { canonical: 'https://www.locatalyze.com/analyse/sydney/ultimo' },
  openGraph: {
    title: 'Opening a Business in Ultimo Sydney — 2026 Location Analysis',
    description: 'Ultimo scores 68/100 — CAUTION. 45,000 UTS students, 6 cafés for the entire catchment, and Harris Street rents 45% below Surry Hills. Full analysis inside.',
    url: 'https://www.locatalyze.com/analyse/sydney/ultimo',
  },
}

const FAQS = [
  {
    question: 'Is Ultimo a good place to open a café?',
    answer: "Yes, for specific concepts. A value-positioned, fast-service café targeting the UTS student market can perform well in Ultimo — the competition gap is real (only 6 independent cafés for 45,000+ students). A premium brunch café with $22 plates will struggle. The score of 68 reflects market constraints (semester breaks, price-sensitive demographics) not the absence of opportunity. Operators who understand the UTS calendar and model accordingly succeed here consistently.",
  },
  {
    question: 'What are the best streets in Ultimo for a business?',
    answer: "Harris Street is the primary commercial artery with highest foot traffic — essential for food and beverage. The Broadway junction near UTS campus provides the most consistent student foot traffic. Secondary streets (Jones Street, Thomas Street) work for services businesses that don't rely on walk-in traffic. Above-ground tenancies are viable for tutoring, allied health, and professional services.",
  },
  {
    question: 'How does Ultimo compare to Surry Hills for a new business?',
    answer: "Surry Hills scores 87 vs Ultimo's 68. The gap reflects higher foot traffic diversity, better evening trade, and stronger demographics in Surry Hills. Rents are also 40–60% higher in Surry Hills. Surry Hills provides more consistent 7-day revenue; Ultimo provides better economics for daytime-focused concepts with lean cost structures.",
  },
  {
    question: 'What happens to Ultimo businesses during university semester breaks?',
    answer: "Revenue typically drops 40–50% during December/January and June/July semester breaks when the UTS population departs. Experienced Ultimo operators plan for this explicitly: reduce staffing during breaks, increase delivery platform revenue, and use break periods for maintenance and preparation. Businesses that don't model this gap are consistently caught off-guard.",
  },
  {
    question: 'What is the commercial rent in Ultimo?',
    answer: "Harris Street prime positions: $4,500–$7,000/month. Broadway junction: $5,000–$7,500/month. Secondary streets: $2,800–$4,500/month. First-floor above-ground: $2,000–$3,200/month. These rents are 40–50% below comparable Surry Hills positions. The value proposition exists — the question is whether your business model can generate sufficient revenue from the student/daytime demographic.",
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

export default function UltimoPage() {
  return (
    <div style={{ backgroundColor: '#FFFFFF', color: '#1C1917', minHeight: '100vh' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
{/* Hero */}
      <section style={{ padding: '56px 24px', backgroundColor: C.white, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '13px', color: C.muted, marginBottom: '8px' }}>NSW 2007</div>
              <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: C.n900, margin: 0, lineHeight: '1.15' }}>
                Ultimo
              </h1>
            </div>
            <RiskBadge verdict="CAUTION" />
          </div>
          <p style={{ fontSize: '17px', lineHeight: '1.75', color: C.muted, maxWidth: '860px', marginBottom: '36px' }}>
            Ultimo is misread as a secondary market. It's not — it's a <strong>specialist market</strong>. The UTS student population of 45,000+ and TAFE NSW proximity create a daytime demand engine that rewards budget-conscious, high-frequency business models. The mistake operators make is applying an inner-city premium model to what is fundamentally a value-driven, habitual customer base. Rent is moderate by inner-Sydney standards, competition is thin, and the competition gap score of 74 reflects genuine underservice relative to demand.
          </p>
          {/* Score Panel */}
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '32px', backgroundColor: C.n50, borderRadius: '14px', padding: '28px 32px', border: `1px solid ${C.border}`, alignItems: 'start' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '64px', fontWeight: 900, color: C.brand, lineHeight: 1, marginBottom: '4px' }}>68</div>
              <div style={{ fontSize: '12px', color: C.muted, fontWeight: 600 }}>/ 100</div>
              <div style={{ marginTop: '10px' }}><VerdictBadge verdict="CAUTION" size="md" /></div>
            </div>
            <div style={{ minWidth: 0 }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: C.n700, marginBottom: '16px' }}>Score Breakdown</h3>
              <ScoreBar label="Foot Traffic" value={72} />
              <ScoreBar label="Area Demographics" value={58} />
              <ScoreBar label="Rent Viability" value={65} />
              <ScoreBar label="Competition Gap" value={74} />
              <ScoreBar label="Accessibility" value={81} />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section style={{ padding: '28px 24px', backgroundColor: C.n50, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px' }}>
            {[
              { label: 'Median Income', value: '$62,000' },
              { label: 'Student Population', value: '45,000+' },
              { label: 'Competition', value: 'Low' },
              { label: 'Best Hours', value: '8am – 5pm' },
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
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: C.n900, marginBottom: '20px' }}>Commercial Rent Guide — Ultimo</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
            {[
              { label: 'Harris Street (Prime)', range: '$4,500–$7,000/mo', note: 'Main street frontage, highest foot traffic. Required for food/beverage.' },
              { label: 'Broadway Junction', range: '$5,000–$7,500/mo', note: 'High-volume pedestrian connection to UTS. Best for quick-service.' },
              { label: 'Secondary Streets', range: '$2,800–$4,500/mo', note: 'Jones, Thomas, Ultimo Road. Works for services and non-foot-traffic businesses.' },
              { label: 'First Floor / Above Ground', range: '$2,000–$3,200/mo', note: 'Viable for professional services, tutoring, allied health.' },
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
                heading: 'The UTS Effect: Asset and Liability',
                body: "UTS is Ultimo's primary commercial driver — and its most significant constraint. 45,000 students generate consistent daytime foot traffic Monday to Friday, 8am–5pm. The asset: high frequency, habitual visiting patterns, strong lunchtime demand. The liability: students spend cautiously ($8–$15 per visit), prefer value pricing over quality positioning, and completely evacuate during exam periods and semester breaks. A business modelled on the UTS calendar can maintain 80%+ occupancy 37 weeks per year; a business that doesn't account for the 15-week low-traffic periods will experience alarming revenue gaps.",
              },
              {
                heading: "The Competition Gap — Ultimo's Clearest Opportunity Signal",
                body: "Ultimo has a competition gap score of 74 — meaning demand materially exceeds supply for several business categories. There are only 6 independent cafés in the core Ultimo precinct serving a 45,000-student catchment. By comparison, Newtown has 70+ cafés for a resident population of 12,000. The ratio in Ultimo is extraordinarily favourable. Operators who have understood this have built sustainable businesses here; the market has not been fully discovered by the hospitality sector.",
              },
              {
                heading: 'What Works in Ultimo — And Why',
                body: "Budget-conscious daily-use concepts with fast service and low average transaction values consistently outperform premium concepts in Ultimo. The model: 120+ covers per day, $12–$16 average transaction, high repeat visitation, lean cost structure. This means a well-run casual café, a lunch bowl concept, a dumpling bar, or a healthy fast-casual format can achieve break-even at $6,000/month rent within 4–6 months. The counter-model — a $22 brunch plate with flat whites at $5.50 — will spend 18 months trying to convert students to premium consumer behaviour and fail.",
              },
              {
                heading: 'Rent vs Revenue Reality Check',
                body: "At $5,500/month for a Harris Street position, the break-even revenue requirement is approximately $22,000/month for a café (40% food cost, 35% labour, 25% rent+overhead). This requires 110 covers per day at $14 average spend — achievable on the UTS calendar but not guaranteed during semester breaks. Operators who supplement with delivery (Uber Eats, DoorDash) report 25–30% additional revenue, materially improving semester-break periods when dine-in drops.",
              },
              {
                heading: 'Evening and Weekend: A Different Market',
                body: "Evening Ultimo is a fundamentally different proposition to daytime Ultimo. Students return to residential areas; the resident population of 7,200 is a relatively thin base for dinner trade. Evening foot traffic drops by 60%+ compared to lunch peak. Businesses that attempt a dual daytime/evening model often underperform on both. The strongest Ultimo operators deliberately close by 5–6pm or pivot to delivery-only evenings — reducing labour costs and focusing capital on the profitable daytime window.",
              },
              {
                heading: 'Infrastructure and Access',
                body: "Ultimo scores 81 on accessibility — one of its clearest advantages. Haymarket light rail, Central Station (10-minute walk), and multiple bus routes create exceptional public transport access. This is critical for a student market that skews heavily toward non-car transport. Car parking is practically non-existent and should not factor into business models. Delivery vehicles have limited access to Harris Street during peak hours — factor this into operations planning if delivery is part of the model.",
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
                  'Low competition relative to demand — student catchment dramatically underserved',
                  'Captive repeat customer base (UTS 5 days/week, 37 weeks/year)',
                  'Excellent public transport access (light rail, Central Station)',
                  'Lower rents vs comparable inner-Sydney positions (40–50% below Surry Hills)',
                  'Growing tech workforce from Pyrmont/Haymarket adds higher-income daytime visits',
                  'Proximity to CBD without CBD rent premium',
                ].map((a) => (
                  <li key={a} style={{ fontSize: '14px', color: C.n800, lineHeight: '1.6' }}>{a}</li>
                ))}
              </ul>
            </div>
            <div style={{ backgroundColor: C.amberBg, border: `1px solid ${C.amberBdr}`, borderRadius: '12px', padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: C.amber, marginBottom: '16px' }}>Disadvantages</h3>
              <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  'Semester break revenue gaps (up to 15 weeks/year of significantly reduced trade)',
                  'Price-sensitive customer base limits menu pricing and margins',
                  'Evening trade is very weak — daytime-only revenue model required',
                  'Parking virtually non-existent — limits older demographic attraction',
                  'Weekend foot traffic drops 50–60% without student population',
                  'Limited aspirational dining demand — premium concepts underperform',
                ].map((d) => (
                  <li key={d} style={{ fontSize: '14px', color: C.n800, lineHeight: '1.6' }}>{d}</li>
                ))}
              </ul>
            </div>
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
                Casual lunch and coffee concept — 'study-friendly' format with communal seating, fast service, $12–$16 average spend
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '24px', padding: '20px', backgroundColor: C.n50, borderRadius: '10px' }}>
              {[
                { label: 'Monthly Rent', value: '$5,500' },
                { label: 'Daily Covers Needed', value: '115' },
                { label: 'Avg Spend', value: '$14' },
                { label: 'Break-even', value: '4–6 months' },
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
                  'Open Monday–Friday, 7am–5pm. Closed weekends to reduce labour cost',
                  'Delivery via Uber Eats/DoorDash supplements semester-break periods (target 25% of revenue)',
                  'Menu priced at $10–$17 range with coffee at $5',
                  'Lean 4-person team structure, with casual staff during peak periods',
                  '37 operating weeks at full capacity, 15 weeks at 50–60% during semester breaks',
                ].map((a) => (
                  <li key={a} style={{ fontSize: '13px', color: C.muted, lineHeight: '1.6' }}>{a}</li>
                ))}
              </ul>
            </div>
            <div style={{ padding: '16px', backgroundColor: C.amberBg, border: `1px solid ${C.amberBdr}`, borderRadius: '8px' }}>
              <p style={{ fontSize: '14px', color: C.n800, lineHeight: '1.7', margin: 0 }}>
                <strong>Verdict:</strong> This concept works in Ultimo. The risk is not the market — it's operators who misjudge the pricing ceiling or ignore semester-break planning. With the right format and cost structure, Ultimo's competition gap and captive student base make this a genuinely viable 68-score location.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── GOOD VS BAD POSITIONING ── */}
      <section style={{ padding: '48px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: C.n900, marginBottom: '24px', lineHeight: '1.3' }}>
            Good vs Bad: Ultimo Business Positioning
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div style={{ padding: '24px', backgroundColor: C.emeraldBg, border: `1px solid ${C.emeraldBdr}`, borderRadius: '12px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: C.emerald, marginBottom: '14px' }}>What Works in Ultimo</h3>
              <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  'Daily-use concept priced at $10–$16 average spend',
                  'Open Monday–Friday only, closed weekends (reduces fixed costs)',
                  'Study-friendly format (communal seating, free WiFi, quiet zones)',
                  'Delivery supplement during semester breaks (target 25% of revenue)',
                  'Quick-service model with 3-minute average service time',
                  'Menu built around bowls, wraps, and budget-friendly hot food',
                ].map((item) => (
                  <li key={item} style={{ fontSize: '13px', color: '#047857', lineHeight: '1.6' }}>{item}</li>
                ))}
              </ul>
            </div>
            <div style={{ padding: '24px', backgroundColor: C.redBg, border: `1px solid ${C.redBdr}`, borderRadius: '12px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: C.red, marginBottom: '14px' }}>What to Avoid in Ultimo</h3>
              <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  'Premium brunch concept with $22+ plates — students won\'t pay',
                  'Evening dining — foot traffic drops 60%+ after 5pm',
                  'Weekend-only or weekend-heavy revenue model',
                  'Aspirational positioning (rose gold, specialty single-origin focus)',
                  'High labour cost model with 6+ staff — margin gets destroyed',
                  'Businesses relying on organic discovery without delivery presence',
                ].map((item) => (
                  <li key={item} style={{ fontSize: '13px', color: '#991B1B', lineHeight: '1.6' }}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPARISON: ULTIMO VS SURRY HILLS ── */}
      <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: C.n900, marginBottom: '8px', lineHeight: '1.3' }}>
            Ultimo vs Surry Hills: What the Numbers Say
          </h2>
          <p style={{ fontSize: '14px', color: C.muted, marginBottom: '24px' }}>
            Two markets that look similar on foot traffic but operate completely differently.
          </p>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: `1px solid ${C.border}`, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', backgroundColor: C.n50, padding: '14px 20px', borderBottom: `1px solid ${C.border}` }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: C.n700 }}>Factor</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: C.brand, textAlign: 'center' }}>Ultimo</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#7C3AED', textAlign: 'center' }}>Surry Hills</div>
            </div>
            {[
              { factor: 'Prime rent', a: '$5,000–$7,000/mo', b: '$9,000–$14,000/mo' },
              { factor: 'Avg customer spend', a: '$12–$16', b: '$25–$45' },
              { factor: 'Daily foot traffic', a: '3,000–5,000 (weekday)', b: '8,000–14,000' },
              { factor: 'Evening trade', a: 'Very weak', b: 'Strong (Fri/Sat)' },
              { factor: 'Weekend trade', a: '40–50% of weekday', b: 'Strongest trading day' },
              { factor: 'Semester break risk', a: '40–50% revenue drop', b: 'None' },
              { factor: 'Competition level', a: 'Low', b: 'Very High' },
              { factor: 'Break-even covers', a: '~115/day', b: '~280/day' },
            ].map((row, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '12px 20px', borderBottom: `1px solid ${C.border}` }}>
                <div style={{ fontSize: '13px', color: C.n800, fontWeight: 500 }}>{row.factor}</div>
                <div style={{ fontSize: '13px', color: C.brand, textAlign: 'center', fontWeight: 600 }}>{row.a}</div>
                <div style={{ fontSize: '13px', color: '#7C3AED', textAlign: 'center', fontWeight: 600 }}>{row.b}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '16px', padding: '16px 20px', backgroundColor: C.amberBg, border: `1px solid ${C.amberBdr}`, borderRadius: '10px' }}>
            <p style={{ fontSize: '14px', color: C.n800, margin: 0, lineHeight: '1.7' }}>
              <strong>Key insight:</strong> Ultimo is not a worse version of Surry Hills — it's a completely different market. Operators who treat them as interchangeable fail in Ultimo. Operators who design their concept for the Ultimo customer (student, value-conscious, habitual weekday visitor) outperform their unit economics.
            </p>
          </div>
        </div>
      </section>

      {/* Poll */}
      <PollSection suburbName="Ultimo" initialVotes={[38, 35, 27]} />

      {/* Nearby Suburbs */}
      <section style={{ padding: '48px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: C.n900, marginBottom: '20px' }}>Compare Nearby Suburbs</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <SuburbCard name="Surry Hills" slug="surry-hills" citySlug="sydney" description="Premium hospitality. Much higher rent but proven market." score={87} verdict="GO" />
            <SuburbCard name="Pyrmont" slug="pyrmont" citySlug="sydney" description="Tech workers and growing residential base." score={73} verdict="GO" />
            <SuburbCard name="Haymarket" slug="haymarket" citySlug="sydney" description="High-density foot traffic. Diverse demographics." score={74} verdict="GO" />
          </div>
        </div>
      </section>

      {/* Best Business Models */}
      <section style={{ padding: '56px 24px', backgroundColor: C.white }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 800, color: C.n900, marginBottom: '10px', lineHeight: '1.2' }}>
            Best Business Models for Ultimo — Revenue & Break-even
          </h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '32px', maxWidth: '720px' }}>
            Ultimo rewards specific formats. These four models have the strongest track record for this market — with realistic revenue ranges based on current rent and demographic conditions.
          </p>
          <div style={{ display: 'grid', gap: '16px' }}>
            {[
              {
                model: 'Budget Café — Daily Use',
                verdict: 'Strong',
                verdictColor: C.emerald,
                rent: '$5,000–$6,500/mo',
                covers: '110–140/day',
                avgSpend: '$12–$15',
                monthlyRevenue: '$17,000–$23,000',
                breakEven: '4–6 months',
                note: 'The dominant Ultimo format. Study-friendly atmosphere, fast service, $5 coffee. Lean 3–4 person team, closed weekends. Delivery adds 20–25% revenue during semester breaks. Proven by the 6 operators currently succeeding here.',
              },
              {
                model: 'Fast Casual / Lunch Bowl',
                verdict: 'Strong',
                verdictColor: C.emerald,
                rent: '$4,500–$6,000/mo',
                covers: '95–120/day',
                avgSpend: '$14–$16',
                monthlyRevenue: '$16,000–$22,000',
                breakEven: '3–5 months',
                note: 'Dumpling bars, rice bowl concepts, and healthy fast casual all perform well. Monday–Friday lunch window is the primary revenue source. Flat week but the operational model is forgiving — lower labour and food cost than full-service.',
              },
              {
                model: 'Allied Health / Tutoring (Above Ground)',
                verdict: 'Strong',
                verdictColor: C.emerald,
                rent: '$2,200–$3,200/mo',
                covers: '25–40 sessions/week',
                avgSpend: '$75–$120/session',
                monthlyRevenue: '$8,000–$18,000',
                breakEven: '2–3 months',
                note: 'First-floor and above-ground tenancies are significantly cheaper in Ultimo and ideal for service businesses. Tutoring, allied health (physio, psychology, speech), and legal aid services all have strong student demand. Semester break revenue dips but fixed-cost structure is lower.',
              },
              {
                model: 'Co-working / Study Space',
                verdict: 'Emerging',
                verdictColor: C.amber,
                rent: '$4,000–$5,500/mo',
                covers: '40–80 members',
                avgSpend: '$80–$150/month',
                monthlyRevenue: '$6,000–$12,000',
                breakEven: '6–9 months',
                note: 'Higher risk, longer runway, but sticky once established. 45,000 students and a growing Pyrmont tech workforce create genuine co-working demand. Revenue predictability after the membership base is established is strong. Not recommended without 12 months of operating capital.',
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
          <p style={{ fontSize: '13px', color: C.mutedLight, marginTop: '20px', lineHeight: '1.6' }}>
            Revenue ranges assume 37 full trading weeks and 15 reduced weeks (semester breaks). Delivery revenue included where applicable. See the <Link href="/analyse/sydney" style={{ color: C.brand, textDecoration: 'none' }}>Sydney suburb comparison</Link> for how Ultimo compares across the metro area.
          </p>
        </div>
      </section>

      {/* Who Should NOT Open in Ultimo */}
      <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 800, color: C.n900, marginBottom: '10px', lineHeight: '1.2' }}>
            Who Should Not Open in Ultimo
          </h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '28px', maxWidth: '720px' }}>
            Ultimo's 68 score reflects a market with genuine constraints. These operator profiles consistently underperform here — not because the suburb is bad, but because it does not match their business model.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {[
              {
                type: 'Premium dining operators',
                reason: 'A $22 brunch plate in a market where the customer ceiling is $15 is a permanent tension between positioning and reality. Surry Hills, Newtown, and Bondi have the income demographics for premium hospitality. Ultimo does not.',
              },
              {
                type: 'Evening and weekend concepts',
                reason: 'The dinner and weekend market in Ultimo is the resident population of 7,200 — thin for a full-service restaurant or bar. Foot traffic drops 60%+ after 5pm Monday–Friday and by 50–60% on weekends when students leave.',
              },
              {
                type: 'Operators without semester-break modelling',
                reason: 'Revenue drops 40–50% for 15 weeks per year during December/January and June/July. If your break-even analysis assumes 52 weeks of consistent trade, your projections are wrong. This single factor accounts for the majority of Ultimo business failures.',
              },
              {
                type: 'High-income dependent retail',
                reason: 'Household median income in Ultimo is $62,000 — significantly below inner Sydney averages. Luxury retail, premium wellness, and aspirational lifestyle concepts need a different demographic to sustain their pricing.',
              },
              {
                type: 'Volume-independent businesses',
                reason: 'Businesses that succeed in Ultimo are high-frequency, low-average-spend. A concept that needs a small number of high-value transactions — bespoke design, consultancy, high-end services — finds the student catchment too price-sensitive to sustain.',
              },
              {
                type: 'Operators needing car parking',
                reason: 'There is essentially no car parking in Ultimo. If your customer model depends on people driving to you, the catchment shrinks dramatically. Every successful Ultimo business is built around the public transport-reliant student.',
              },
            ].map((item) => (
              <div key={item.type} style={{ padding: '20px', backgroundColor: C.white, borderRadius: '10px', border: `1px solid ${C.border}` }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: C.n900, marginBottom: '8px' }}>{item.type}</h3>
                <p style={{ fontSize: '13px', color: C.muted, lineHeight: '1.65', margin: 0 }}>{item.reason}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '24px', padding: '18px 22px', backgroundColor: C.amberBg, border: `1px solid ${C.amberBdr}`, borderRadius: '10px' }}>
            <p style={{ fontSize: '14px', color: C.n800, margin: 0, lineHeight: '1.7' }}>
              <strong>The pattern:</strong> Most Ultimo failures are not caused by a bad location — they are caused by operators applying an inner-city premium model to a value-market student catchment. The location itself is viable for the right concept. <Link href="/onboarding" style={{ color: C.brand, textDecoration: 'none', fontWeight: 600 }}>Run your specific concept against Ultimo data</Link> before committing to a lease.
            </p>
          </div>
        </div>
      </section>

      {/* Mid-page CTA */}
      <section style={{ padding: '48px 24px', backgroundColor: C.n900 }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: C.brandLight, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
            Before You Sign a Lease
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', marginBottom: '12px', lineHeight: '1.3' }}>
            Check your specific Ultimo address
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', marginBottom: '24px', lineHeight: '1.65' }}>
            Foot traffic varies significantly between Harris Street, Broadway junction, and secondary streets. Get address-level data — competitor count, hourly foot traffic, and a GO/CAUTION/NO verdict — before you negotiate.
          </p>
          <Link
            href="/onboarding"
            style={{
              display: 'inline-block',
              padding: '13px 28px',
              backgroundColor: C.brand,
              color: '#FFFFFF',
              borderRadius: '7px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 700,
            }}
          >
            Analyse your Ultimo address →
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection faqs={FAQS} title="Ultimo Business FAQs" />

      {/* CTA */}
      <CTASection
        title="Ready to analyse an Ultimo address?"
        subtitle="Get a full data-driven analysis for any Ultimo address — foot traffic by hour, rent benchmarks, competitive mapping, and a GO/CAUTION/NO verdict."
        variant="teal"
      />

      {/* Footer Nav */}
      <section style={{ padding: '24px', backgroundColor: C.n50, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '13px' }}>
          <Link href="/analyse/sydney" style={{ color: C.brand, fontWeight: 600, textDecoration: 'none' }}>← Back to Sydney</Link>
          <Link href="/analyse/sydney/parramatta" style={{ color: C.brand, textDecoration: 'none' }}>Parramatta →</Link>
          <Link href="/analyse/sydney/surry-hills" style={{ color: C.brand, textDecoration: 'none' }}>Surry Hills →</Link>
          <Link href="/onboarding" style={{ color: C.emerald, fontWeight: 700, textDecoration: 'none' }}>Analyse free →</Link>
        </div>
      </section>
    </div>
  )
}
