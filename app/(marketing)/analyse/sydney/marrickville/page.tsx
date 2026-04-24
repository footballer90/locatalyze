// app/(marketing)/analyse/sydney/marrickville/page.tsx
// Marrickville suburb deep-dive page

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
  title: 'Opening a Business in Marrickville Sydney — Location Analysis 2026',
  description:
    'Marrickville business location analysis 2026. Score 80/100 — GO. Inner west gentrification opportunity, $78,000 median income, Illawarra Road rents from $4,500/month. Full rent guide, best business models, revenue ranges, and break-even analysis for Marrickville NSW 2204.',
  alternates: { canonical: 'https://locatalyze.com/analyse/sydney/marrickville' },
  openGraph: {
    title: 'Opening a Business in Marrickville Sydney — 2026 Location Analysis',
    description: 'Marrickville scores 80/100 — GO. Mid-gentrification, independent food culture, 76 competition gap, rents 40-50% below Surry Hills, Wed-Sun strong. Full analysis inside.',
    url: 'https://locatalyze.com/analyse/sydney/marrickville',
  },
}

const FAQS = [
  {
    question: 'Is Marrickville good for a café business?',
    answer: 'Yes, strongly. Marrickville has developed genuine independent food culture with specialty coffee, sourdough bakeries, and brunch venues. The competition gap of 76 is one of the most favourable in the inner west. A resident population of 16,500 (rapidly growing) is materially underserved by quality hospitality relative to Surry Hills or Newtown, despite comparable (and increasing) spending capacity. Quality specialty cafés achieve $25,000-$35,000/month revenue with 5-7 month break-even.',
  },
  {
    question: 'How does gentrification affect business viability in Marrickville?',
    answer: 'Marrickville is mid-gentrification. The suburb has shifted from working-class Greek and Vietnamese community to increasingly mixed demographics including young professionals, creatives, and families priced out of Newtown and Surry Hills. Rent is 40-50% below Surry Hills while customer demographic increasingly approaches Surry Hills spending habits. This creates useful commercial dynamic: operators can prove concepts with better unit economics, then scale to premium locations. First-mover advantage in Marrickville typically outperforms.',
  },
  {
    question: 'What commercial rents apply in Marrickville?',
    answer: 'Illawarra Road (prime): $4,500-$7,500/month. Marrickville Road: $3,800-$6,500/month. Enmore Road (Marrickville end): $4,000-$6,000/month. Secondary/industrial strip: $2,500-$4,500/month. Rents are 40-50% below Surry Hills for comparable location quality, providing structural advantage for building profitable unit economics.',
  },
  {
    question: 'What is the best trading schedule in Marrickville?',
    answer: 'Wed-Sun strong; Mon-Tue notably softer. Successful Marrickville operators model Wed-Sun or Tue-Sat operating schedules rather than 7-day operations. Closing Mon-Tue reduces fixed costs during the weak period and improves unit economics. Saturday morning market and café trade is particularly strong. Thursday evening through Sunday is the consistent revenue window.',
  },
  {
    question: 'How does Marrickville compare to Newtown for a business?',
    answer: 'Newtown scores 81 vs Marrickville\'s 80 — nearly equivalent. Both are inner west, mid-gentrification locations with independent food culture. Newtown has stronger weekend trade and more established hospitality ecosystem. Marrickville has lower rents (40-50% below) and less saturated competition. Newtown is better for proven concepts; Marrickville is better for building unit economics. Both work for quality independent operators.',
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

export default function MarrickvillePage() {
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
              <div style={{ fontSize: '13px', color: C.muted, marginBottom: '8px' }}>NSW 2204</div>
              <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: C.n900, margin: 0, lineHeight: '1.15' }}>
                Marrickville
              </h1>
            </div>
            <RiskBadge verdict="GO" />
          </div>
          <p style={{ fontSize: '17px', lineHeight: '1.75', color: C.muted, maxWidth: '860px', marginBottom: '36px' }}>
            Marrickville is mid-gentrification with the most favourable supply-demand balance of any inner-west suburb. The resident population of 16,500 is rapidly growing and increasingly approaches Surry Hills spending habits, while rents remain 40-50% below. Specialty coffee, natural wine bars, and destination brunch venues have established loyal followings on Illawarra Road and Marrickville Road. The competition gap of 76 represents genuine underservice relative to demand. This is where operators build profitable concepts before scaling to premium locations.
          </p>
          {/* Score Panel */}
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '32px', backgroundColor: C.n50, borderRadius: '14px', padding: '28px 32px', border: `1px solid ${C.border}`, alignItems: 'start' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '64px', fontWeight: 900, color: C.brand, lineHeight: 1, marginBottom: '4px' }}>80</div>
              <div style={{ fontSize: '12px', color: C.muted, fontWeight: 600 }}>/ 100</div>
              <div style={{ marginTop: '10px' }}><VerdictBadge verdict="GO" size="md" /></div>
            </div>
            <div style={{ minWidth: 0 }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: C.n700, marginBottom: '16px' }}>Score Breakdown</h3>
              <ScoreBar label="Foot Traffic" value={79} />
              <ScoreBar label="Area Demographics" value={80} />
              <ScoreBar label="Rent Viability" value={84} />
              <ScoreBar label="Competition Gap" value={76} />
              <ScoreBar label="Accessibility" value={78} />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section style={{ padding: '28px 24px', backgroundColor: C.n50, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px' }}>
            {[
              { label: 'Median Income', value: '$78,000' },
              { label: 'Population', value: '16,500' },
              { label: 'Competition', value: 'Medium' },
              { label: 'Best Hours', value: 'Wed-Sun 8am-10pm' },
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
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: C.n900, marginBottom: '20px' }}>Commercial Rent Guide — Marrickville</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
            {[
              { label: 'Illawarra Rd (Prime)', range: '$4,500–$7,500/mo', note: 'Primary commercial strip, highest foot traffic and destination appeal.' },
              { label: 'Marrickville Rd', range: '$3,800–$6,500/mo', note: 'Secondary strip with growing café and wine bar clusters.' },
              { label: 'Enmore Rd (Marrickville end)', range: '$4,000–$6,000/mo', note: 'Extension of Marrickville precinct with emerging food scene.' },
              { label: 'Secondary / Industrial Strip', range: '$2,500–$4,500/mo', note: 'Off-strip positions and industrial conversions. Suitable for independent producers.' },
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
                heading: 'Inner West Gentrification — The Marrickville Story',
                body: 'Marrickville is mid-gentrification. The suburb has shifted from predominantly working-class Greek and Vietnamese community to increasingly mixed demographic including young professionals, creatives, and families priced out of Newtown and Surry Hills. This creates a useful commercial dynamic: rent is 40-50% below Surry Hills, but customer demographic is increasingly approaching Surry Hills spending habits. Operators can prove concepts with stronger unit economics in Marrickville, then scale to premium locations. Household median income of $78,000 reflects existing population; growing influx of higher-income younger professionals suggests demographic trend toward $85,000+ median within 3-5 years.',
              },
              {
                heading: 'Independent Food Culture',
                body: 'Marrickville has developed a genuine independent food culture over the past 4 years. Specialty coffee roasteries, sourdough bakeries, natural wine bars, and destination brunch venues have established themselves on Illawarra Road and Marrickville Road with loyal local followings. This is not chain-driven or aspirational trend-chasing — it is community-validated demand for authentic independent operators. The independent food culture creates network effects: each new quality operator adds to destination appeal rather than diluting it. A specialty café on Illawarra Road benefits from cluster positioning with natural wine bar neighbour and bakery nearby. Customers seek the precinct because of the collective offering.',
              },
              {
                heading: 'Competition Gap — The Underserved Opportunity',
                body: 'At 76 on competition gap, Marrickville has the most favourable supply-demand balance of any inner-west suburb in the analysis. The resident population of 16,500 (and rapidly growing) is materially underserved by quality hospitality relative to Surry Hills or Newtown, despite comparable (and increasing) spending capacity. There are 6-8 quality independent cafés in Marrickville for a 16,500 population; Newtown has 70+ cafés for 12,000 residents. The ratio gap is extraordinary. This reflects market discovery rather than market saturation — operators who identify the gap early and execute at the right quality level build sustainable businesses.',
              },
              {
                heading: 'Rent Viability — The Core Argument for Marrickville',
                body: 'The suburb scores 84 on rent viability — one of the highest scores in the analysis. A $5,500/month Illawarra Road position generating $28,000/month revenue is a materially better business than the same concept in Surry Hills at $13,000/month for the same revenue. Operators who prove their concept in Marrickville with strong unit economics often outperform inner-city peers even at lower revenue levels. A café break-even requires 110 covers/day at $14 average spend at $5,500 rent; the same café at $11,000 Surry Hills rent requires 210 covers/day. The margin is enormous. This is why experienced operators choose Marrickville.',
              },
              {
                heading: 'Greek and Vietnamese Community Anchors',
                body: 'The existing Greek and Vietnamese community creates a food culture baseline that has shaped the suburb\'s palate and customer expectations. Quality Vietnamese is taken as a given by locals. Greek-adjacent food concepts (mezze, wood-fired, Mediterranean) connect well with long-standing community identity. New operators benefit from this foundation — the neighbourhood has existing appreciation for quality independent food. This is different from gentrifying suburbs with no food culture baseline. Marrickville customers are primed for good food because the Greek and Vietnamese legacy established that standard.',
              },
              {
                heading: 'Weekend Peak vs Weekday Softness',
                body: 'Marrickville\'s trading profile differs from CBD-adjacent suburbs. Wednesday-Sunday is strong, particularly Saturday morning market and café trade. Monday and Tuesday are noticeably softer. A business model assuming 7-day equal trading underperforms; a 5-day operating model (Tue-Sat or Wed-Sun) often outperforms 7-day on unit economics. Closing Mon-Tue reduces fixed costs during the weak period. Saturday morning peak (8am-12pm) is one of the strongest windows in inner Sydney — comparable to Newtown Saturday peak. Success in Marrickville requires building the business model around Wed-Sun strength rather than fighting the Mon-Tue weakness.',
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
            Best Business Models for Marrickville — Revenue & Break-even
          </h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '32px', maxWidth: '720px' }}>
            Marrickville rewards independent concepts with genuine food positioning. These four models have the strongest track record and clearest path to profitability.
          </p>
          <div style={{ display: 'grid', gap: '16px' }}>
            {[
              {
                model: 'Specialty Café / Roastery',
                verdict: 'Strong',
                verdictColor: C.emerald,
                rent: '$5,000–$6,500/mo',
                covers: '140–180/day',
                avgSpend: '$18–$28',
                monthlyRevenue: '$28,000–$40,000',
                breakEven: '5–7 months',
                note: 'Specialty coffee with food focus (sourdough, pastry, light dishes). Saturday morning peak (8am-12pm) is strong. Closed Mon-Tue reduces labour costs. Community loyalty to quality roasteries is high. Independent roasters outperform chains in Marrickville.',
              },
              {
                model: 'Natural Wine Bar / Small Bar',
                verdict: 'Strong',
                verdictColor: C.emerald,
                rent: '$4,500–$6,000/mo',
                covers: '100–140/day',
                avgSpend: '$32–$50',
                monthlyRevenue: '$28,000–$38,000',
                breakEven: '5–8 months',
                note: 'Natural wine, small plates, destination positioning. Wed-Sat strong evening trade. Community appreciation for independent operators. Marrickville demographic is receptive to wine culture. Alcohol margins improve unit economics.',
              },
              {
                model: 'Destination Restaurant — Vietnamese/Greek/Modern Australian',
                verdict: 'Strong',
                verdictColor: C.emerald,
                rent: '$4,800–$7,000/mo',
                covers: '120–160/day',
                avgSpend: '$35–$55',
                monthlyRevenue: '$35,000–$50,000',
                breakEven: '6–9 months',
                note: 'Vietnamese, Greek, or modern Australian with distinctive positioning. Leverages existing community food culture. Closed Mon-Tue or Mon-Sun with lean staffing on off-days. Wed-Sun focus essential. Destination concept benefits from cluster positioning on precinct.',
              },
              {
                model: 'Specialty Food Retail / Deli',
                verdict: 'Strong',
                verdictColor: C.emerald,
                rent: '$3,500–$5,000/mo',
                covers: 'N/A retail',
                avgSpend: '$18–$30',
                monthlyRevenue: '$20,000–$28,000',
                breakEven: '6–9 months',
                note: 'Artisanal food retail, sourdough producer-retailer, specialist deli. Lower rent than hospitality. Repeat customer base from neighbourhood. Producer economics work in Marrickville rents. Tuesday-Sat focused model viable.',
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

      {/* Who Should NOT Open in Marrickville */}
      <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 800, color: C.n900, marginBottom: '10px', lineHeight: '1.2' }}>
            Who Should Not Open in Marrickville
          </h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '28px', maxWidth: '720px' }}>
            Marrickville's 80 score reflects a strong market, but specific operator profiles underperform here due to positioning mismatch or operational model constraints.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {[
              {
                type: 'Generic Cafés Without Identity',
                reason: 'Marrickville residents explicitly reject generic chain concepts and favour distinctive independent operators. A café without positioning (specialty coffee, sourdough, cultural identity) struggles. Marrickville customers choose the precinct because of independent clustering — generic concepts fail.',
              },
              {
                type: 'Chain / Franchise Concepts',
                reason: 'Active community rejection of franchise models. The Marrickville market is built on independent operator positioning. A franchise concept competes at immediate disadvantage with community cultural preference for independent ownership. Chains underperform relative to independent positioning.',
              },
              {
                type: 'Premium Fine Dining with $80+ Covers',
                reason: 'Median income of $78,000 with growing demographic approaching $85,000+ can support premium positioning, but currently the market supports $35-$55 average spend better than $80+ aspirational pricing. Market not yet at Surry Hills premium positioning level.',
              },
              {
                type: 'Parking-Dependent Businesses',
                reason: 'Street parking in Marrickville is very limited. Car-dependent customer models fail because the suburb is pedestrian and public-transport focused. Operators building models around car access underperform relative to walk-in/public-transit-based concepts.',
              },
              {
                type: '7-Day Operations Without Weekday Differentiation',
                reason: 'Monday and Tuesday are weak days. Attempting 7-day equal trading destroys unit economics. Successful models deliberately optimize for Wed-Sun, closing Mon-Tue or operating lean service models on weak days.',
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
                30-seat specialty café and wine bar hybrid, Illawarra Road location, $5,200/month rent, Wed-Mon trading focus
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '24px', padding: '20px', backgroundColor: C.n50, borderRadius: '10px' }}>
              {[
                { label: 'Monthly Rent', value: '$5,200' },
                { label: 'Daily Covers Target', value: '120' },
                { label: 'Avg Spend', value: '$26' },
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
                  'Open Wed-Mon 8am-9pm, closed Tuesdays (weak day closure reduces fixed costs)',
                  'Daytime café service (8am-5pm): specialty coffee, pastry, light food',
                  'Evening wine bar service (5pm-9pm): natural wine, small plates, dessert',
                  'Hybrid model captures Saturday morning peak + evening wine crowd',
                  'Monday soft day with 80 covers vs Wed-Sat 140-160 covers average',
                  'Saturday peak at 180+ covers driven by neighbourhood foot traffic',
                ].map((a) => (
                  <li key={a} style={{ fontSize: '13px', color: C.muted, lineHeight: '1.6' }}>{a}</li>
                ))}
              </ul>
            </div>
            <div style={{ padding: '16px', backgroundColor: C.emeraldBg, border: `1px solid ${C.emeraldBdr}`, borderRadius: '8px' }}>
              <p style={{ fontSize: '14px', color: C.emerald, lineHeight: '1.7', margin: 0 }}>
                <strong>Verdict:</strong> This concept works strongly in Marrickville. The hybrid positioning captures daytime café + evening wine bar demand. Closed Tuesday maximizes profitability. Wed-Sun focus aligns with market strength. This business model outperforms equivalent 7-day operations due to lean cost structure and demand alignment.
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
            Check your specific Marrickville address
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', marginBottom: '24px', lineHeight: '1.65' }}>
            Illawarra Road foot traffic is materially higher than secondary strips. Saturday morning foot traffic is peak window. Get address-level data — competitor count, hourly foot traffic, and a GO/CAUTION/NO verdict — before you negotiate.
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
            Analyse your Marrickville address →
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection faqs={FAQS} title="Marrickville Business Location — FAQ" id="faq" />

      {/* Nearby Suburbs */}
      <section style={{ padding: '48px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: C.n900, marginBottom: '20px' }}>Compare Nearby Suburbs</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <SuburbCard name="Newtown" slug="newtown" citySlug="sydney" description="Higher foot traffic, more established precinct, stronger weekend trade." score={81} verdict="GO" />
            <SuburbCard name="Surry Hills" slug="surry-hills" citySlug="sydney" description="Premium positioning, higher income, higher rents, established market." score={87} verdict="GO" />
            <SuburbCard name="Alexandria" slug="alexandria" citySlug="sydney" description="Workforce-focused, industrial heritage, weekday strong, weekend quiet." score={78} verdict="GO" />
          </div>
        </div>
      </section>

      {/* Poll */}
      <PollSection suburbName="Marrickville" initialVotes={[52, 28, 20]} />

      {/* CTA */}
      <CTASection
        title="Ready to analyse a Marrickville address?"
        subtitle="Get a full data-driven analysis for any Marrickville address — foot traffic by hour, rent benchmarks, competitive mapping, and a GO/CAUTION/NO verdict."
        variant="teal"
      />

      {/* Footer Nav */}
      <section style={{ padding: '24px', backgroundColor: C.n50, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '13px' }}>
          <Link href="/analyse/sydney" style={{ color: C.brand, fontWeight: 600, textDecoration: 'none' }}>← Back to Sydney</Link>
          <Link href="/analyse/sydney/newtown" style={{ color: C.brand, textDecoration: 'none' }}>Newtown →</Link>
          <Link href="/analyse/sydney/surry-hills" style={{ color: C.brand, textDecoration: 'none' }}>Surry Hills →</Link>
          <Link href="/onboarding" style={{ color: C.emerald, fontWeight: 700, textDecoration: 'none' }}>Analyse free →</Link>
        </div>
      </section>
    </div>
  )
}
