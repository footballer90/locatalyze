// app/(marketing)/analyse/sydney/strathfield/page.tsx
// Strathfield suburb deep-dive page

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
  title: 'Opening a Business in Strathfield Sydney — Location Analysis 2026',
  description:
    'Strathfield business location analysis 2026. Score 72/100 — CAUTION. Sydney\'s Korea Town, $71,000 median income, The Boulevarde rents from $4,500/month. Full rent guide, best business models, revenue ranges, and break-even analysis for Strathfield NSW 2135.',
  alternates: { canonical: 'https://www.locatalyze.com/analyse/sydney/strathfield' },
  openGraph: {
    title: 'Opening a Business in Strathfield Sydney — 2026 Location Analysis',
    description: 'Strathfield scores 72/100 — CAUTION. Korea Town status, Korean-Australian concentration, best for Korean operators, excellent rent viability, Mon-Sat trading strong. Full analysis inside.',
    url: 'https://www.locatalyze.com/analyse/sydney/strathfield',
  },
}

const FAQS = [
  {
    question: 'Is Strathfield a good location for a Korean business?',
    answer: 'Yes, strongly for Korean operators. Strathfield is Sydney\'s recognised Korea Town with concentrated Korean-Australian community creating reliable demand. Korean restaurant/BBQ operators with community connections achieve $24,000-$42,000/month revenue. The advantage is community relationship; the barrier is non-Korean concepts struggle to integrate into this cultural precinct. Korean-Australian operators have significant advantage over non-Korean entrants.',
  },
  {
    question: 'What is commercial rent in Strathfield?',
    answer: 'The Boulevarde (prime): $4,500-$7,500/month. Strathfield Plaza adjacent: $5,000-$8,000/month. Albert Road/Cooper Road: $3,000-$5,500/month. First floor: $2,000-$3,500/month. The Boulevarde is premium positioning for Korea Town destination; secondary streets work for professional services and non-foot-traffic businesses.',
  },
  {
    question: 'How strong is Sunday trade in Strathfield?',
    answer: 'Sunday trade is moderate. Strathfield peaks Mon-Sat, particularly the afternoon/evening hours. Sunday trade is notably weaker than equivalent Burwood or Chatswood Sundays. Weekend trade overall is strong Thu-Sat but Sunday drops 30-40% compared to Saturday. Businesses must model Mon-Sat as primary revenue window without relying on Sunday peaks.',
  },
  {
    question: 'How does Strathfield compare to Burwood for a business?',
    answer: 'Burwood scores 77 vs Strathfield\'s 72. Both suburbs serve East Asian communities but with different positioning. Burwood is more mixed-demographic with better foot traffic (79 vs 70). Strathfield has stronger cultural clustering and higher community loyalty but more concentrated foot traffic. Burwood supports more diverse business models; Strathfield is optimised for Korean operators. Both have excellent rent viability (83 vs 83).',
  },
  {
    question: 'What non-Korean businesses work in Strathfield?',
    answer: 'Professional services targeting Korean-Australian clientele (accounting, legal, financial planning, immigration law) perform well. Allied health (acupuncture, traditional medicine) with Korean operators or targeting Korean communities succeed. Some non-Korean food concepts work (Japanese, Vietnamese, Chinese) but require exceptional quality and cannot be generic. Premium hairdressing and beauty targeting non-Korean clientele underperform. Non-Korean hospitality without cultural bridge struggles.',
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

export default function StrathfieldPage() {
  return (
    <div style={{ backgroundColor: C.white, color: C.n900, minHeight: '100vh' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
{/* Hero */}
      <section style={{ padding: '56px 24px', backgroundColor: C.white, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '13px', color: C.muted, marginBottom: '8px' }}>NSW 2135</div>
              <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: C.n900, margin: 0, lineHeight: '1.15' }}>
                Strathfield
              </h1>
            </div>
            <RiskBadge verdict="CAUTION" />
          </div>
          <p style={{ fontSize: '17px', lineHeight: '1.75', color: C.muted, maxWidth: '860px', marginBottom: '36px' }}>
            Strathfield is Sydney's recognised Korea Town. The concentration of Korean restaurants, BBQ venues, bakeries, karaoke bars, and Korean supermarkets on The Boulevarde creates a distinct cultural precinct that attracts Korean-Australian community from across Sydney. This is a market optimised for operators with Korean community positioning. Non-Korean concepts face structural barriers despite reasonable foot traffic. Monday-Saturday trading is strong; Sunday is notably softer. The score of 72 reflects concentrated demand with cultural barriers for non-Korean entrants.
          </p>
          {/* Score Panel */}
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '32px', backgroundColor: C.n50, borderRadius: '14px', padding: '28px 32px', border: `1px solid ${C.border}`, alignItems: 'start' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '64px', fontWeight: 900, color: C.brand, lineHeight: 1, marginBottom: '4px' }}>72</div>
              <div style={{ fontSize: '12px', color: C.muted, fontWeight: 600 }}>/ 100</div>
              <div style={{ marginTop: '10px' }}><VerdictBadge verdict="CAUTION" size="md" /></div>
            </div>
            <div style={{ minWidth: 0 }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: C.n700, marginBottom: '16px' }}>Score Breakdown</h3>
              <ScoreBar label="Foot Traffic" value={70} />
              <ScoreBar label="Area Demographics" value={74} />
              <ScoreBar label="Rent Viability" value={83} />
              <ScoreBar label="Competition Gap" value={73} />
              <ScoreBar label="Accessibility" value={80} />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section style={{ padding: '28px 24px', backgroundColor: C.n50, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px' }}>
            {[
              { label: 'Median Income', value: '$71,000' },
              { label: 'Population', value: '13,500' },
              { label: 'Competition', value: 'Medium' },
              { label: 'Best Hours', value: 'Mon-Sat 10am-8pm' },
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
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: C.n900, marginBottom: '20px' }}>Commercial Rent Guide — Strathfield</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
            {[
              { label: 'The Boulevarde (Prime)', range: '$4,500–$7,500/mo', note: 'Korea Town main strip. Essential for Korean hospitality concepts.' },
              { label: 'Strathfield Plaza Adjacent', range: '$5,000–$8,000/mo', note: 'Higher rent for Plaza adjacency. Foot traffic guarantee but premium pricing.' },
              { label: 'Albert Rd / Cooper Rd', range: '$3,000–$5,500/mo', note: 'Secondary strips. Suitable for professional services and support businesses.' },
              { label: 'First Floor', range: '$2,000–$3,500/mo', note: 'Above-ground positions viable for tutoring, services, allied health.' },
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
                heading: 'Korea Town Status',
                body: 'Strathfield is Sydney\'s recognised Korea Town. The concentration of Korean restaurants, BBQ venues, bakeries, karaoke bars, and Korean supermarkets on The Boulevarde creates a distinct cultural precinct that attracts Korean-Australian community from across Sydney — not just local foot traffic. This is both strength and boundary. Strength: the cultural clustering creates destination appeal that draws customers 15-20km away. Boundary: non-Korean concepts have struggled to integrate into this cultural identity. A new Japanese or Vietnamese concept requires exceptional quality to overcome the perception that Korean concepts are the primary market focus. Korean operators have a significant relationship advantage over non-Korean entrants.',
              },
              {
                heading: 'Plaza Anchor Dynamics',
                body: 'Strathfield Plaza provides essential foot traffic anchor. The Plaza houses major supermarkets and services that draw consistent daily visits from residents. However, Plaza-adjacent tenancies carry higher rent ($5,000-$8,000/month) without necessarily higher foot traffic than The Boulevarde ($4,500-$7,500/month). The premium for Plaza adjacency is not always justified by traffic patterns. Operators choosing Plaza locations pay for certainty of major retailer foot traffic; they often underperform relative to similar Boulevarde positions with lower rent.',
              },
              {
                heading: 'Demographics — Korean-Australian Concentration',
                body: 'The Korean-Australian community is economically active with above-average household spend on food (particularly restaurant dining), beauty (Korean beauty standards, skincare products), and entertainment. However, the community has strong in-group preference — Korean operators have a significant relationship advantage over non-Korean entrants. Family networks create repeat customer bases that non-Korean competitors cannot easily penetrate. Cultural trust in Korean-operated businesses is materially higher than equivalent non-Korean competitors. Median income of $71,000 reflects household level; actual spending power skews toward dual-income professional families.',
              },
              {
                heading: 'Foot Traffic Concentration and Gaps',
                body: 'Strathfield scores 70 on foot traffic — lower than comparable suburbs — because the foot traffic is highly concentrated on The Boulevarde during specific hours (afternoon/evening peak, Sat evening). Monday foot traffic is notably weaker than Burwood or Chatswood equivalents. The foot traffic concentration means strong performers on The Boulevarde and Plaza may be 100% higher than secondary street positions. Off-main-street locations require non-foot-traffic business models (professional services, beauty studios, support businesses). Monday represents a genuine demand gap that many Boulevarde businesses address through reduced staffing or Monday closure.',
              },
              {
                heading: 'Rent Opportunity',
                body: 'At 83 on rent viability, Strathfield offers some of the best rent-to-revenue ratios in the inner-west/south corridor. A The Boulevarde position at $5,500/month for a concept generating $28,000/month revenue is genuinely strong unit economics compared to Surry Hills ($13,000/month rent for same revenue) or Bondi ($14,000+/month). The rent-to-revenue advantage makes Strathfield attractive for Korean operators building business models. The barrier for non-Korean operators is that the demographic specialisation (Korean focus) means fewer operators can achieve sufficient revenue to justify even the lower rent.',
              },
              {
                heading: 'Who Strathfield Works For',
                body: 'Korean food operators with community connections. Korean beauty and skincare concepts targeting Korean-Australian demographic. Professional services targeting Korean community (accounting, legal, financial planning, immigration law). Allied health (acupuncture, traditional medicine, physiotherapy with Korean practitioners). Businesses operating Mon-Sat without Sunday dependence. Strathfield is optimised for Korean and Korean-focused operators. The foot traffic exists; the question is whether your business model can convert that traffic. Non-Korean hospitality without cultural bridge struggles because the traffic is community-driven rather than ambient walk-in.',
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
            Best Business Models for Strathfield — Revenue & Break-even
          </h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '32px', maxWidth: '720px' }}>
            Strathfield rewards Korean operators and Korean-focused concepts. These four models have the strongest track record. Non-Korean concepts face cultural barriers and require exceptional differentiation.
          </p>
          <div style={{ display: 'grid', gap: '16px' }}>
            {[
              {
                model: 'Korean Restaurant / BBQ',
                verdict: 'Strong',
                verdictColor: C.emerald,
                rent: '$5,000–$6,500/mo',
                covers: '140–180/day',
                avgSpend: '$24–$42',
                monthlyRevenue: '$30,000–$45,000',
                breakEven: '5–8 months',
                note: 'Korean BBQ, Korean fine dining, Korean hotpot. Requires community positioning or exceptional quality. Existing operators have 5-10 years of loyalty. Monday trade is weaker; Thu-Sat peaks. Community relationship advantage is material.',
              },
              {
                model: 'Korean Beauty / Skincare Studio',
                verdict: 'Strong',
                verdictColor: C.emerald,
                rent: '$4,000–$5,500/mo',
                covers: '15–25 treatments/day',
                avgSpend: '$85–$140',
                monthlyRevenue: '$20,000–$35,000',
                breakEven: '4–6 months',
                note: 'Korean beauty standards drive strong demand for facials, skincare treatments, hair services targeting Korean clientele. 8-12 treatment rooms optimal. Community targeting creates reliable repeat customer base. Mon-Sat heavy; Sunday minimal.',
              },
              {
                model: 'Professional Services (Korean-Focused)',
                verdict: 'Strong',
                verdictColor: C.emerald,
                rent: '$3,000–$4,500/mo',
                covers: '12–20 sessions/week',
                avgSpend: '$150–$250',
                monthlyRevenue: '$18,000–$32,000',
                breakEven: '3–5 months',
                note: 'Accounting, legal, financial planning, immigration law targeting Korean-Australian community. Secondary street locations viable. Higher margin, lower customer volume. Community referral networks are key growth driver.',
              },
              {
                model: 'Korean Bakery / Dessert Cafe',
                verdict: 'Caution',
                verdictColor: C.amber,
                rent: '$3,500–$5,000/mo',
                covers: '80–120/day',
                avgSpend: '$10–$18',
                monthlyRevenue: '$14,000–$22,000',
                breakEven: '6–9 months',
                note: 'Korean-style baked goods and desserts with coffee. High competition from established Korean bakeries. Requires differentiation (premium pastry, unique concepts). Longer runway to break-even. Saturated category in Strathfield.',
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

      {/* Who Should NOT Open in Strathfield */}
      <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 800, color: C.n900, marginBottom: '10px', lineHeight: '1.2' }}>
            Who Should Not Open in Strathfield
          </h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '28px', maxWidth: '720px' }}>
            Strathfield's 72 score reflects a market with specific cultural barriers. These operator profiles consistently underperform here — not because the suburb lacks customers, but because their positioning does not align with Korea Town identity.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {[
              {
                type: 'Non-Korean Food Concepts',
                reason: 'Western fine dining, Italian, Mediterranean, and generic Asian concepts face cultural barriers. The foot traffic is Korean-community-driven, not ambient walk-in. Without Korean cultural positioning or exceptional quality (Michelin-star equivalent), non-Korean food concepts cannot efficiently convert Strathfield traffic.',
              },
              {
                type: 'Premium Western Fine Dining',
                reason: 'Median income of $71,000 combined with Korean demographic preference for Korean restaurants means premium Western fine dining struggles. Burwood ($74K) and Chatswood ($96K) have demographics more receptive to premium Western positioning. Strathfield demand is concentrated in Korean categories.',
              },
              {
                type: 'Concepts Needing 7-Day Strong Trading',
                reason: 'Sunday trade is notably weaker than Mon-Sat in Strathfield. Foot traffic drops 30-40% on Sundays. Businesses requiring consistent 7-day peaks (premium brunch, weekend-heavy revenue models) underperform. Mon-Sat focused models work; weekend-dependent models struggle.',
              },
              {
                type: 'High-Volume Concepts Requiring CBD-Level Foot Traffic',
                reason: 'Strathfield foot traffic is concentrated on The Boulevarde during specific hours. A concept requiring 400+ daily covers or extremely high frequency cannot achieve sufficient transaction density. Off-main-street foot traffic is lower. Low-margin high-volume businesses struggle here.',
              },
              {
                type: 'Non-Korean Beauty / Wellness',
                reason: 'While Korean beauty is strong, non-Korean wellness concepts (Pilates, non-Korean yoga, Western-style spas) struggle. Korean-Australian consumers have strong preference for Korean practitioners and Korean beauty standards. Non-Korean positioning underperforms the market potential.',
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
                Korean-run beauty and skincare studio, 8 treatment rooms, The Boulevarde location, $5,000/month rent
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '24px', padding: '20px', backgroundColor: C.n50, borderRadius: '10px' }}>
              {[
                { label: 'Monthly Rent', value: '$5,000' },
                { label: 'Daily Treatments Target', value: '22' },
                { label: 'Avg Spend', value: '$185' },
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
                  'Open Mon-Sat 10am-8pm, closed Sundays (Korean demographic preference)',
                  'Facials, skincare treatments, hair services at $150-$200 per treatment',
                  'Korean-operated with cultural positioning targeting Korean-Australian community',
                  'Repeat customer base of 60-70% from community referrals',
                  ' 8 treatment rooms with 2-3 therapists per rotation',
                  'Saturday peaks at 30+ treatments; weekday average 18-20 treatments',
                ].map((a) => (
                  <li key={a} style={{ fontSize: '13px', color: C.muted, lineHeight: '1.6' }}>{a}</li>
                ))}
              </ul>
            </div>
            <div style={{ padding: '16px', backgroundColor: C.amberBg, border: `1px solid ${C.amberBdr}`, borderRadius: '8px' }}>
              <p style={{ fontSize: '14px', color: C.n800, lineHeight: '1.7', margin: 0 }}>
                <strong>Verdict:</strong> This concept works in Strathfield if operated by Korean or Korean-Australian practitioners. Community positioning is essential. The risk is overestimating Sunday trade or attempting a non-Korean approach — Korean beauty is community-specific demand.
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
            Check your specific Strathfield address
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', marginBottom: '24px', lineHeight: '1.65' }}>
            The Boulevarde foot traffic is materially higher than secondary streets or Plaza-adjacent positions. Get address-level data — competitor count, hourly foot traffic, and a GO/CAUTION/NO verdict — before you negotiate.
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
            Analyse your Strathfield address →
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection faqs={FAQS} title="Strathfield Business Location — FAQ" id="faq" />

      {/* Nearby Suburbs */}
      <section style={{ padding: '48px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: C.n900, marginBottom: '20px' }}>Compare Nearby Suburbs</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <SuburbCard name="Burwood" slug="burwood" citySlug="sydney" description="Higher foot traffic, more mixed demographics, strong weekend trade." score={77} verdict="CAUTION" />
            <SuburbCard name="Parramatta" slug="parramatta" citySlug="sydney" description="Larger market, higher scores, more diverse business opportunities." score={89} verdict="GO" />
            <SuburbCard name="Chatswood" slug="chatswood" citySlug="sydney" description="Premium positioning, higher income, stronger evening economy." score={86} verdict="GO" />
          </div>
        </div>
      </section>

      {/* Poll */}
      <PollSection suburbName="Strathfield" initialVotes={[38, 33, 29]} />

      {/* CTA */}
      <CTASection
        title="Ready to analyse a Strathfield address?"
        subtitle="Get a full data-driven analysis for any Strathfield address — foot traffic by hour, rent benchmarks, competitive mapping, and a GO/CAUTION/NO verdict."
        variant="teal"
      />

      {/* Footer Nav */}
      <section style={{ padding: '24px', backgroundColor: C.n50, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '13px' }}>
          <Link href="/analyse/sydney" style={{ color: C.brand, fontWeight: 600, textDecoration: 'none' }}>← Back to Sydney</Link>
          <Link href="/analyse/sydney/burwood" style={{ color: C.brand, textDecoration: 'none' }}>Burwood →</Link>
          <Link href="/analyse/sydney/parramatta" style={{ color: C.brand, textDecoration: 'none' }}>Parramatta →</Link>
          <Link href="/onboarding" style={{ color: C.emerald, fontWeight: 700, textDecoration: 'none' }}>Analyse free →</Link>
        </div>
      </section>
    </div>
  )
}
