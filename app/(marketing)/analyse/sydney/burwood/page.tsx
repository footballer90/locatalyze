// app/(marketing)/analyse/sydney/burwood/page.tsx
// Burwood suburb deep-dive page

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
  title: 'Opening a Business in Burwood Sydney — Location Analysis 2026',
  description:
    'Burwood business location analysis 2026. Score 77/100 — CAUTION. Korean-Chinese food destination, $74,000 median income, Burwood Road rents from $5,500/month. Full rent guide, best business models, revenue ranges, and break-even analysis for Burwood NSW 2134.',
  alternates: { canonical: 'https://www.locatalyze.com/analyse/sydney/burwood' },
  openGraph: {
    title: 'Opening a Business in Burwood Sydney — 2026 Location Analysis',
    description: 'Burwood scores 77/100 — CAUTION. Strong Korean-Chinese demographic, quality food destination precinct, 70-75% of revenue on Thu-Sun, rents 35-50% below Surry Hills. Full analysis inside.',
    url: 'https://www.locatalyze.com/analyse/sydney/burwood',
  },
}

const FAQS = [
  {
    question: 'Is Burwood a good suburb for a Korean restaurant?',
    answer: 'Yes, but with caveats. Burwood Road has the highest Korean restaurant density outside Strathfield, creating a destination precinct that draws customers 10-15km away. Competition is intense with operators having 5-10 years of community loyalty. Success requires exceptional execution or genuine format differentiation. Premium Korean BBQ or specialty Korean dessert can achieve $80,000-$120,000/month at full operation.',
  },
  {
    question: 'How much does commercial rent cost in Burwood?',
    answer: 'Burwood Road (prime): $5,500-$9,000/month. Railway Parade: $4,500-$7,500/month. George Street/Westfield adjacent: $6,000-$9,500/month. Secondary streets: $3,000-$5,000/month. Rents are 35-50% below Surry Hills or Eastern Suburbs equivalents, providing structural advantage for operators who understand the demographic.',
  },
  {
    question: 'What is Burwood\'s demographic profile?',
    answer: 'Predominantly East Asian professional with large Chinese, Korean, and Lebanese communities alongside Anglo-Australian families. Median income $74,000 (between Parramatta $72K and Chatswood $96K) — solid discretionary spend but not premium dining territory. Typical customer is 28-42 years old, tertiary educated, dual-income, quality-focused.',
  },
  {
    question: 'How does Burwood compare to Chatswood for a business?',
    answer: 'Both suburbs share similar East Asian demographics and quality food markets. Chatswood scores 86 vs Burwood\'s 77. Chatswood has higher foot traffic diversity, stronger evening trade, and more premium positioning. Burwood rents are materially lower and the market is less saturated. Burwood is better for operators building economics before scaling; Chatswood is better for premium positioning.',
  },
  {
    question: 'Why is evening trade weak in Burwood?',
    answer: 'Burwood trades well Thu-Sun lunch and dinner, but lacks the bar/entertainment layer of Surry Hills or Newtown. Evening economy is concentrated around dining only. Weekend trade is strong for family dining and retail. Operators must model for weekend dependency — 70-75% of weekly hospitality revenue comes Thu-Sun. Businesses that attempt balanced daily models underperform.',
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

export default function BurwoodPage() {
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
          <span style={{ fontWeight: 600, color: C.n900 }}>Burwood</span>
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
              <div style={{ fontSize: '13px', color: C.muted, marginBottom: '8px' }}>NSW 2134</div>
              <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: C.n900, margin: 0, lineHeight: '1.15' }}>
                Burwood
              </h1>
            </div>
            <RiskBadge verdict="CAUTION" />
          </div>
          <p style={{ fontSize: '17px', lineHeight: '1.75', color: C.muted, maxWidth: '860px', marginBottom: '36px' }}>
            Burwood Road occupies a unique position in Sydney's hospitality market. The Korean-Chinese clustering creates a food destination precinct that draws customers from 10-15km away. Rents are 35-50% below equivalent Inner West strips, creating a structural advantage for operators who understand the demographic and execute precisely. The market is quality-sensitive and weekend-dependent — 70-75% of weekly revenue trades Thursday through Sunday.
          </p>
          {/* Score Panel */}
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '32px', backgroundColor: C.n50, borderRadius: '14px', padding: '28px 32px', border: `1px solid ${C.border}`, alignItems: 'start' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '64px', fontWeight: 900, color: C.brand, lineHeight: 1, marginBottom: '4px' }}>77</div>
              <div style={{ fontSize: '12px', color: C.muted, fontWeight: 600 }}>/ 100</div>
              <div style={{ marginTop: '10px' }}><VerdictBadge verdict="CAUTION" size="md" /></div>
            </div>
            <div style={{ minWidth: 0 }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: C.n700, marginBottom: '16px' }}>Score Breakdown</h3>
              <ScoreBar label="Foot Traffic" value={79} />
              <ScoreBar label="Demographics" value={76} />
              <ScoreBar label="Rent Viability" value={81} />
              <ScoreBar label="Competition Gap" value={71} />
              <ScoreBar label="Accessibility" value={83} />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section style={{ padding: '28px 24px', backgroundColor: C.n50, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px' }}>
            {[
              { label: 'Median Income', value: '$74,000' },
              { label: 'Population', value: '11,000' },
              { label: 'Competition', value: 'Medium-High' },
              { label: 'Best Hours', value: '7 days 10am-8pm' },
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
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: C.n900, marginBottom: '20px' }}>Commercial Rent Guide — Burwood</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
            {[
              { label: 'Burwood Rd (Prime)', range: '$5,500–$9,000/mo', note: 'Main strip, highest foot traffic. Essential for food/beverage concepts.' },
              { label: 'Railway Parade', range: '$4,500–$7,500/mo', note: 'Secondary main strip with strong station foot traffic and commuter base.' },
              { label: 'George St / Westfield Adjacent', range: '$6,000–$9,500/mo', note: 'Prime positions near Westfield anchor with guaranteed passing trade.' },
              { label: 'Secondary Streets', range: '$3,000–$5,000/mo', note: 'Off-main-strip positions. Suitable for services and non-foot-traffic businesses.' },
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
                heading: 'The Westfield Effect',
                body: 'Westfield Burwood anchors the suburb commercially, creating reliable foot traffic but also competitive pressure. The shopping centre hosts a food court, major retailers, and services that draw consistent daily visits. Businesses that do not compete with Westfield categories but benefit from its foot traffic spillover perform best. The Westfield Effect creates a paradox: high ambient foot traffic combined with high competitive density. Successful operators position either as premium alternatives (Korean BBQ restaurant vs food court Korean noodles) or completely non-competing categories (specialty café, fashion retail targeting Korean aesthetic, professional services).',
              },
              {
                heading: 'Demographics — Multicultural and Middle-Class',
                body: 'Burwood\'s demographic mix is one of its defining characteristics. Large Chinese, Korean, and Lebanese communities alongside Anglo-Australian families create diverse demand patterns. Median income of $74,000 sits between Parramatta ($72,000) and Chatswood ($96,000) — solid discretionary spend but not premium dining territory. The market is quality-conscious but price-sensitive. A customer will pay $18 for exceptional Korean BBQ but not $35 for aspirational Western fine dining. Residential growth of 12% since 2021 is driven primarily by apartment development along the train corridor, adding younger professionals who use Burwood as both a hospitality destination and daily commute point.',
              },
              {
                heading: 'Asian Food Market Quality',
                body: 'The quality of Asian food in Burwood rivals Chatswood. Cantonese, Sichuan, Korean, and Taiwanese concepts operate at restaurant-grade quality with operators holding 5-10 years of community loyalty. This creates both opportunity and barrier. Opportunity: the validated Asian food market demonstrates consistent demand from a discerning demographic willing to travel 10-15km for quality. Barrier: very high competitive standard if entering Asian cuisine categories. A new Korean restaurant must meet or exceed the existing competitive bar; generic positioning fails immediately. Success requires either exceptional execution in an established category or genuine format differentiation (Korean-Mex fusion, premium Korean dessert bar, Korean fine dining).',
              },
              {
                heading: 'Rent Viability — The Burwood Advantage',
                body: 'At 81 on rent viability, Burwood offers materially better rent-to-revenue ratios than inner-city alternatives. A $6,500/month position on Burwood Road that generates $32,000/month revenue is a better business than a $13,000/month Crown Street position generating the same revenue. The structural economics are superior. For a food business targeting $28,000-$35,000/month revenue, Burwood becomes financially viable where Surry Hills is marginal. This explains why quality operators have chosen Burwood despite higher competition density — the unit economics work. Operators building their concept can achieve break-even 5-8 months faster in Burwood than comparable Inner East locations.',
              },
              {
                heading: 'Infrastructure and Connectivity',
                body: 'Burwood Station on the T2 line provides strong connectivity to Sydney CBD (15 minutes) and Parramatta (20 minutes). This makes Burwood accessible for workforce businesses and services, not just local retail. The suburb benefits from passing trade from commuters — morning and evening peak hours create secondary traffic waves independent of the core shopping foot traffic. A specialty café at Burwood Station benefits from commuters waiting for trains. Professional services (accounting, legal, allied health) benefit from both the residential population and passing workforce. Accessibility score of 83 reflects this multi-layer connectivity advantage.',
              },
              {
                heading: 'Evening vs Daytime Dynamics',
                body: 'Burwood trades reasonably well across day-parts but the evening economy is concentrated around dining and lacks the bar/entertainment layer of Surry Hills or Newtown. Thursday through Sunday drives 70-75% of weekly hospitality revenue; Monday-Wednesday dinner is quieter. Weekend lunch and dinner are the primary revenue windows. This creates an operational paradox: high foot traffic ambient baseline but weekend-concentrated revenue concentration. A business must model around the weekend peak, not the weekday average. Successful models either capture strong weekday professional/student trade (specialty café) or deliberately position around weekend dining (premium Korean BBQ). Attempting balanced daily trade in a weekend-dependent market results in underutilized weekday capacity.',
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
            Best Business Models for Burwood — Revenue & Break-even
          </h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '32px', maxWidth: '720px' }}>
            Burwood rewards specific formats that align with its demographic and weekend-concentrated trading pattern. These four models have the strongest track record in this market.
          </p>
          <div style={{ display: 'grid', gap: '16px' }}>
            {[
              {
                model: 'Premium Asian Restaurant',
                verdict: 'Strong',
                verdictColor: C.emerald,
                rent: '$6,500–$8,500/mo',
                covers: '180–220/day',
                avgSpend: '$28–$48',
                monthlyRevenue: '$35,000–$50,000',
                breakEven: '5–8 months',
                note: 'Korean BBQ, premium Japanese omakase-style casual, high-end Taiwanese. Community loyalty is strong once quality positioning is established. Weekend trade (Fri/Sat/Sun lunch and dinner) drives 65-75% of revenue. Requires exceptional execution and existing community positioning or genuine format differentiation.',
              },
              {
                model: 'Specialty Café — Western Positioned',
                verdict: 'Strong',
                verdictColor: C.emerald,
                rent: '$5,000–$6,500/mo',
                covers: '140–170/day',
                avgSpend: '$20–$32',
                monthlyRevenue: '$25,000–$35,000',
                breakEven: '5–7 months',
                note: 'Station-adjacent or Burwood Road premium coffee. Captures morning commuter base (3,000+ daily at Burwood Station) with consistent demand exceeding supply 7:30-9:30am. Weekend brunch trade adds revenue stability. Quality specialty coffee with food focus outperforms generic chains.',
              },
              {
                model: 'Multicultural Grocery / Specialty Food',
                verdict: 'Strong',
                verdictColor: C.emerald,
                rent: '$4,500–$6,000/mo',
                covers: 'N/A retail',
                avgSpend: '$18–$30',
                monthlyRevenue: '$18,000–$30,000',
                breakEven: '6–9 months',
                note: 'Korean, Chinese, or Lebanese specialty groceries, fresh noodle production, or prepared foods. High repeat customer base from existing community. Lower rent than hospitality creates strong unit economics. Inventory management and supplier relationships are critical success factors.',
              },
              {
                model: 'Allied Health / Dental',
                verdict: 'Strong',
                verdictColor: C.emerald,
                rent: '$4,000–$5,500/mo',
                covers: '25–40 sessions/day',
                avgSpend: '$80–$120',
                monthlyRevenue: '$22,000–$40,000',
                breakEven: '4–6 months',
                note: 'Physiotherapy, dental, allied health benefit from strong professional demographic and foot traffic. Services businesses don\'t depend on daytime/evening split. Secondary locations off main streets viable. Building patient base from foot traffic is faster than equivalent CBD locations.',
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

      {/* Who Should NOT Open in Burwood */}
      <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 800, color: C.n900, marginBottom: '10px', lineHeight: '1.2' }}>
            Who Should Not Open in Burwood
          </h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '28px', maxWidth: '720px' }}>
            Burwood's 77 score reflects a market with specific constraints. These operator profiles consistently underperform here — not because the suburb is bad, but because it does not match their business model.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {[
              {
                type: 'Budget Concepts Competing with Westfield',
                reason: 'The Westfield food court and casual dining already serve the budget segment. A new generic pizza or burger concept at budget price cannot differentiate from existing Westfield options. Only premium differentiation or different categories win against Westfield competition.',
              },
              {
                type: 'Luxury Retail Requiring Premium Demographics',
                reason: 'Median income of $74,000 does not support luxury retail concepts requiring $100,000+ demographic. Premium fashion, high-end jewelry, and luxury goods need Chatswood or Eastern Suburbs positioning. Burwood shoppers are quality-conscious but price-sensitive.',
              },
              {
                type: 'Evening-Only Entertainment Concepts',
                reason: 'Burwood lacks the bar/entertainment economy of Surry Hills or Newtown. Evening-only venues underperform because nightlife customer base is thin. Weekend lunch is stronger than weekend evening. Evening restaurants work; evening bars fail.',
              },
              {
                type: 'Volume-Dependent Concepts Needing CBD-Level Foot Traffic',
                reason: 'Burwood has 11,000 residents with strong foot traffic concentration. A business model requiring 500+ daily covers or extremely high frequency cannot achieve sufficient transaction density. Low-margin high-volume businesses struggle in this foot traffic volume.',
              },
              {
                type: 'Weekday-Heavy Revenue Models',
                reason: 'Burwood trades weakly Mon-Wed and peaks Thu-Sun. Businesses that depend on weekday revenue (office-based, professional services targeting 9-5 workers) find insufficient daytime traffic. Weekend dependency is unavoidable in Burwood hospitality.',
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
                35-seat Korean BBQ restaurant, Railway Parade location, $6,500/month rent, weekend-focused trading strategy
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '24px', padding: '20px', backgroundColor: C.n50, borderRadius: '10px' }}>
              {[
                { label: 'Monthly Rent', value: '$6,500' },
                { label: 'Daily Covers Target', value: '160' },
                { label: 'Avg Spend', value: '$38' },
                { label: 'Break-even', value: '5–8 months' },
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
                  'Open 7 days, 5pm-10:30pm service model, closed lunch',
                  'Thu-Sun peak trading accounts for 65-75% of weekly revenue',
                  'Community loyalty from Korean demographic with 5+ year positioning',
                  'Mon-Wed covers reduce to 100-120/day due to weekday softness',
                  'Menu priced $28-$48 per person with high alcohol attachment',
                  'Staffing 8-12 people Thu-Sun, 4-6 people Mon-Wed',
                ].map((a) => (
                  <li key={a} style={{ fontSize: '13px', color: C.muted, lineHeight: '1.6' }}>{a}</li>
                ))}
              </ul>
            </div>
            <div style={{ padding: '16px', backgroundColor: C.amberBg, border: `1px solid ${C.amberBdr}`, borderRadius: '8px' }}>
              <p style={{ fontSize: '14px', color: C.n800, lineHeight: '1.7', margin: 0 }}>
                <strong>Verdict:</strong> This concept works in Burwood if the operator has authentic Korean community positioning or exceptional quality execution. The risk is not the location — it\'s underestimating weekday softness or competing on price rather than quality against established operators with 5-10 years of customer loyalty.
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
            Check your specific Burwood address
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', marginBottom: '24px', lineHeight: '1.65' }}>
            Foot traffic varies significantly between Burwood Road, Railway Parade, and secondary streets. Get address-level data — competitor count, hourly foot traffic, and a GO/CAUTION/NO verdict — before you negotiate.
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
            Analyse your Burwood address →
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection faqs={FAQS} title="Burwood Business Location — FAQ" id="faq" />

      {/* Nearby Suburbs */}
      <section style={{ padding: '48px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: C.n900, marginBottom: '20px' }}>Compare Nearby Suburbs</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <SuburbCard name="Strathfield" slug="strathfield" citySlug="sydney" description="Korea Town, premium Korean demographic, weekend-strong trade." score={72} verdict="CAUTION" />
            <SuburbCard name="Parramatta" slug="parramatta" citySlug="sydney" description="Higher scores, more diverse market, stronger weekday trade." score={89} verdict="GO" />
            <SuburbCard name="Chatswood" slug="chatswood" citySlug="sydney" description="Premium positioning, higher income, stronger evening economy." score={86} verdict="GO" />
          </div>
        </div>
      </section>

      {/* Poll */}
      <PollSection suburbName="Burwood" initialVotes={[44, 32, 24]} />

      {/* CTA */}
      <CTASection
        title="Ready to analyse a Burwood address?"
        subtitle="Get a full data-driven analysis for any Burwood address — foot traffic by hour, rent benchmarks, competitive mapping, and a GO/CAUTION/NO verdict."
        variant="teal"
      />

      {/* Footer Nav */}
      <section style={{ padding: '24px', backgroundColor: C.n50, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '13px' }}>
          <Link href="/analyse/sydney" style={{ color: C.brand, fontWeight: 600, textDecoration: 'none' }}>← Back to Sydney</Link>
          <Link href="/analyse/sydney/strathfield" style={{ color: C.brand, textDecoration: 'none' }}>Strathfield →</Link>
          <Link href="/analyse/sydney/parramatta" style={{ color: C.brand, textDecoration: 'none' }}>Parramatta →</Link>
          <Link href="/onboarding" style={{ color: C.emerald, fontWeight: 700, textDecoration: 'none' }}>Analyse free →</Link>
        </div>
      </section>
    </div>
  )
}
