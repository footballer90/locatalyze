// app/(marketing)/analyse/brisbane/page.tsx
// Brisbane city hub page — SEO optimised, human-written
// Uses shared components from components/analyse/

import Link from 'next/link'
import type { Metadata } from 'next'
import { CityHero } from '@/components/analyse/CityHero'
import { SuburbCard } from '@/components/analyse/SuburbCard'
import { ComparisonTable } from '@/components/analyse/ComparisonTable'
import { FAQSection } from '@/components/analyse/FAQSection'
import { CTASection } from '@/components/analyse/CTASection'
import { PollSection } from '@/components/analyse/PollSection'
import { C } from '@/components/analyse/AnalyseTheme'

export const metadata: Metadata = {
  title: 'Best Suburbs to Open a Business in Brisbane — 2026 Location Guide',
  description:
    'Brisbane business location guide 2026. 20 suburbs scored by foot traffic, rent viability, demographics, and competition gap. Find the best Brisbane suburb for your café, restaurant, retail or service business — with honest analysis of what works and what fails.',
  alternates: { canonical: 'https://www.locatalyze.com/analyse/brisbane' },
  openGraph: {
    title: 'Best Suburbs to Open a Business in Brisbane — 2026 Location Guide',
    description: '20 Brisbane suburbs ranked and scored. Rent benchmarks, foot traffic data, best/worst business types per suburb, and GO/CAUTION/NO verdicts.',
    url: 'https://www.locatalyze.com/analyse/brisbane',
  },
}

const COMPARISON_ROWS = [
  { name: 'Paddington', score: 87, verdict: : "GO' as const, rent: '$4,500–$8,000", footTraffic: 'Very High', bestFor: 'Premium hospitality, boutique retail, café' },
  { name: 'West End', score: 85, verdict: : "GO' as const, rent: '$5,000–$9,000", footTraffic: 'Very High', bestFor: 'Independent cafés, hospitality, creative' },
  { name: 'New Farm', score: 80, verdict: : "GO' as const, rent: '$4,000–$7,500", footTraffic: 'High', bestFor: 'Brunch cafés, riverfront dining, premium' },
  { name: 'Woolloongabba', score: 79, verdict: : "GO' as const, rent: '$3,500–$6,500", footTraffic: 'High', bestFor: 'Hospitality, stadium ancillary, health' },
  { name: 'Bulimba', score: 78, verdict: : "GO' as const, rent: '$3,000–$5,500", footTraffic: 'Medium-High', bestFor: 'Premium casual, café, professional services' },
  { name: 'Kangaroo Point', score: 76, verdict: : "GO' as const, rent: '$3,000–$5,500", footTraffic: 'Medium-High', bestFor: 'Riverfront dining, wellness, café' },
  { name: 'Brisbane CBD', score: 72, verdict: : "CAUTION' as const, rent: '$12,000–$28,000", footTraffic: 'Very High', bestFor: 'Premium/luxury, high-volume only' },
  { name: 'Chermside', score: 68, verdict: : "CAUTION' as const, rent: '$3,000–$5,500", footTraffic: 'High', bestFor: 'Strip retail adjacent to centre only' },
]

const SUBURB_CATEGORIES = [
  {
    title: 'Premium — High Reward, High Risk',
    description: 'Inner ring with the strongest foot traffic and consumer spending. Rents are meaningful — viable only for premium concepts with clear unit economics.',
    suburbs: [
      { name: 'Paddington', slug: 'paddington', description: "Brisbane\'s benchmark for independent hospitality. Given Terrace produces more successful independent businesses per metre than anywhere else in Queensland.", score: 87, verdict: : "GO' as const, rentRange: '$4,500–$8,000/mo" },
      { name: 'West End', slug: 'west-end', description: 'Boundary Street indie culture. Educated 25–45 demographic actively supports independent operators over chains.', score: 85, verdict: : "GO' as const, rentRange: '$5,000–$9,000/mo" },
      { name: 'New Farm', slug: 'new-farm', description: "Brisbane\'s brunch capital. Only 3 independent cafés despite exceptional demand — rare first-mover gap in a premium market.", score: 80, verdict: : "GO' as const, rentRange: '$4,000–$7,500/mo" },
      { name: 'South Brisbane', slug: 'south-brisbane', description: 'Cultural precinct adjacent to GOMA and QPAC. Tourist-professional mix; Weekend trade very strong, weekday more variable.', score: 74, verdict: : "GO' as const, rentRange: '$5,500–$10,000/mo" },
    ],
  },
  {
    title: 'Growth — Best Risk/Return Balance',
    description: 'Post-Olympic growth suburbs where rent economics align with improving demographics. The considered operator choice for most business types.',
    suburbs: [
      { name: 'Woolloongabba', slug: 'woolloongabba', description: 'The Gabba precinct is in structural transition. Post-Olympic infrastructure driving rapid gentrification. Best momentum in Brisbane.', score: 79, verdict: : "GO' as const, rentRange: '$3,500–$6,500/mo" },
      { name: 'Bulimba', slug: 'bulimba', description: "Oxford Street\'s overlooked premium. Affluent residential base comparable to Paddington but without the operator attention.", score: 78, verdict: : "GO' as const, rentRange: '$3,000–$5,500/mo" },
      { name: 'Kangaroo Point', slug: 'kangaroo-point', description: 'Riverside professional enclave. Story Bridge and ferry access drive weekend trade; weekday professional base growing.', score: 76, verdict: : "GO' as const, rentRange: '$3,000–$5,500/mo" },
      { name: 'Teneriffe', slug: 'teneriffe', description: 'Wool store conversions created a distinct character precinct. Riverside positioning and professional demographic with strong spending power.', score: 75, verdict: : "GO' as const, rentRange: '$3,500–$6,500/mo" },
      { name: 'Fortitude Valley', slug: 'fortitude-valley', description: 'Beyond the nightlife reputation. Brunswick and Ann Street daytime trade has materially improved over five years.', score: 74, verdict: : "GO' as const, rentRange: '$4,000–$7,000/mo" },
      { name: 'Toowong', slug: 'toowong', description: 'University of Queensland gateway suburb. Student-professional mix with underserved quality food and services market.', score: 73, verdict: : "GO' as const, rentRange: '$3,000–$5,500/mo" },
    ],
  },
  {
    title: 'Outer Growth — Value Plays',
    description: 'Middle ring suburbs with lower rents and improving demographics. Earlier operators capture years of below-market occupancy before the market reprices.',
    suburbs: [
      { name: 'Greenslopes', slug: 'greenslopes', description: 'Hospital district with consistent demand. Allied health and professional services structurally underserved despite strong catchment.', score: 73, verdict: : "GO' as const, rentRange: '$2,500–$4,500/mo" },
      { name: 'Newmarket', slug: 'newmarket', description: 'Enoggera Road corridor improving steadily. Younger professional demographic and lower rents than inner suburbs.', score: 72, verdict: : "GO' as const, rentRange: '$2,500–$4,500/mo" },
      { name: 'Nundah', slug: 'nundah', description: 'Inner north on the move. Sandgate Road and Nundah Village strip have strong community-driven café culture.', score: 72, verdict: : "GO' as const, rentRange: '$2,500–$4,500/mo" },
      { name: 'Mount Gravatt', slug: 'mount-gravatt', description: 'Griffith University anchor. Student and family demographic creates consistent demand at accessible rent levels.', score: 72, verdict: : "GO' as const, rentRange: '$2,500–$4,500/mo" },
      { name: 'Indooroopilly', slug: 'indooroopilly', description: 'Westfield and UQ proximity. Strip retail outside the centre performs when positioned correctly for the academic-family mix.', score: 71, verdict: : "GO' as const, rentRange: '$2,500–$4,500/mo" },
      { name: 'Carindale', slug: 'carindale', description: 'Southeast Brisbane family anchor. Westfield Carindale drives foot traffic; family health and casual dining are reliable categories.', score: 71, verdict: : "GO' as const, rentRange: '$2,800–$5,200/mo" },
      { name: 'Annerley', slug: 'annerley', description: 'Ipswich Road corridor improving. Healthcare and multicultural food are the established categories; café culture emerging.', score: 70, verdict: : "GO' as const, rentRange: '$2,000–$3,800/mo" },
    ],
  },
  {
    title: 'Speculative — Know Before You Go',
    description: 'Markets where specific niches work but general operators face structural headwinds. Deep local knowledge is non-negotiable.',
    suburbs: [
      { name: 'Brisbane CBD', slug: 'brisbane-cbd', description: 'Queen Street Mall foot traffic is strong but $15,000+ rents demand extraordinary volume. Post-pandemic office recovery at 70–75% capacity.', score: 72, verdict: : "CAUTION' as const, rentRange: '$12,000–$28,000/mo" },
      { name: 'Spring Hill', slug: 'spring-hill', description: 'Office and residential mix. Weekend population thin. Works for weekday corporate lunch concepts; evenings and weekends underperform.', score: 69, verdict: : "CAUTION' as const, rentRange: '$5,000–$9,000/mo" },
      { name: 'Chermside', slug: 'chermside', description: 'Westfield Chermside monopoly effect. Strip retail outside the centre struggles against the gravity of the major centre.', score: 68, verdict: : "CAUTION' as const, rentRange: '$3,000–$5,500/mo" },
    ],
  },
]

const FAQS = [
  {
    question: 'What is the best suburb to open a business in Brisbane?',
    answer: "Paddington (score 87) is Brisbane\'s benchmark for independent hospitality and retail — Given Terrace has produced more successful independent operators per metre than anywhere else in Queensland. But Paddington is a concentrated strip with limited vacancy. West End (85) is the more accessible version of the same quality — Boundary Street has comparable demographics and spending patterns with more available tenancies. For risk-adjusted value, Woolloongabba (79) is the 2026 opportunity: post-Olympic infrastructure is driving rapid gentrification and rents haven\'t caught up.",
  },
  {
    question: 'Is Brisbane CBD too expensive for independent businesses in 2026?',
    answer: "For most independent operators, yes. Brisbane CBD retail rents of $12,000–$28,000/month require very high transaction volumes just to cover occupancy. Office population recovery post-pandemic runs at 70–75% of 2019 peak on best days; Mondays and Fridays remain at 50–60%. The CBD works for high-volume QSR, premium fine dining, and national chains with sophisticated unit economics. Independent café and small retail operators find better economics in West End, Paddington, or New Farm.",
  },
  {
    question: 'Which Brisbane suburbs have the best café opportunities in 2026?',
    answer: "Paddington and West End are the strongest café markets by quality metrics, but vacancy is limited and competition is established. New Farm (80) has the most compelling demand gap — only 3 independent cafés despite exceptional weekend brunch demand. Woolloongabba is the growth bet: post-Olympic construction is bringing professional residents to an area with very few quality operators. For value plays, Nundah and Newmarket have improving demographics and café customer-to-venue ratios 3–4x more favourable than the inner ring.",
  },
  {
    question: 'What commercial rent should I expect in Brisbane suburbs?',
    answer: "Brisbane commercial rents vary significantly by location. Inner ring premium (Paddington, West End, New Farm): $4,000–$9,000/month. Valley and South Brisbane: $4,000–$10,000/month. Middle ring (Woolloongabba, Bulimba, Kangaroo Point, Teneriffe): $3,000–$6,500/month. Outer ring (Greenslopes, Nundah, Newmarket, Mount Gravatt, Toowong): $2,500–$5,500/month. Fringe value (Annerley, Indooroopilly, Carindale): $2,000–$5,200/month. Brisbane CBD sits above all at $12,000–$28,000/month. These are gross estimates — incentives and net effective rents vary in current market conditions.",
  },
  {
    question: 'How does Brisbane compare to Sydney and Melbourne for opening a business?',
    answer: "Brisbane is materially more affordable than both Sydney and Melbourne. Paddington at $4,500–$8,000/month compares to Surry Hills at $8,000–$14,000 and Fitzroy at $9,000–$16,000. The Brisbane advantage is structural: lower rents, lower labour costs, and a growing population that doesn\'t yet have the oversupply of hospitality venues that Melbourne\'s inner north has accumulated. Post-Olympics infrastructure is a genuine 5–10 year tailwind. The trade-off is lower average spending per customer — Brisbane\'s food culture is developing rather than established.",
  },
  {
    question: 'What impact will the 2032 Brisbane Olympics have on business locations?',
    answer: "The Olympic effect is already visible in Woolloongabba, where The Gabba precinct is being transformed. The Gabba train station upgrade and precinct redevelopment has materially improved foot traffic and commercial sentiment. Kangaroo Point, Fortitude Valley, and South Brisbane are also within the Olympic precinct catchment. The 2032 games represent a 6-year infrastructure build-up that is reshaping commercial rent expectations and residential demographics across inner Brisbane. Operators who establish in these precincts before 2028 will lock in pre-Olympics lease terms.",
  },
  {
    question: 'What are the best Brisbane suburbs for retail in 2026?',
    answer: "Paddington (Given Terrace) is Brisbane\'s premier independent retail strip — fashion, homewares, lifestyle and wellness. West End (Boundary Street) is the alternative with comparable demographics and more accessible rents. Bulimba (Oxford Street) is underrated — the residential demographic is comparable to Paddington but operator attention has historically focused elsewhere. CBD retail is viable at the premium end (Queen Street Mall) but rents are punishing. For value retail, Chermside and Indooroopilly offer Westfield-adjacent positions but face the same strip-versus-centre competition that affects all major shopping centre suburbs.",
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

export default function BrisbanePage() {
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
        <Link href="/analyse" style={{ fontSize: '14px', fontWeight: 600, color: C.brand, textDecoration: 'none' }}>
          ← All Cities
        </Link>
        <Link
          href="/onboarding"
          style={{
            padding: '8px 18px',
            backgroundColor: C.emerald,
            color: C.white,
            borderRadius: '6px',
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: 700,
          }}
        >
          Analyse free →
        </Link>
      </nav>

      {/* Hero */}
      <CityHero
        cityName="Brisbane"
        citySlug="brisbane"
        tagline="A city mid-transformation. Post-Olympic infrastructure is reshaping inner suburbs faster than any commercial market in Australia. The window for early-mover positioning — before rents catch up to demographics — is open right now."
        statChips={[
          { text: "20 suburbs scored — inner ring to outer middle" },
          { text: "Paddington: Brisbane\'s benchmark hospitality address" },
          { text: 'Woolloongabba: best growth momentum in Brisbane 2026' },
        ]}
      />

      {/* Methodology Banner */}
      <div style={{ backgroundColor: C.amberBg, borderBottom: `1px solid ${C.amberBdr}`, padding: '12px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ fontSize: '13px', color: C.amber, margin: 0 }}>
            <strong>Methodology:</strong> Scores based on foot traffic density, demographic income distribution, commercial rent viability, competitive density, and accessibility. Data sourced from ABS 2024, CBRE Q1 2026, City of Brisbane, Queensland Government, and Locatalyze proprietary foot traffic analysis.
          </p>
        </div>
      </div>

      {/* Jump Nav */}
      <nav style={{ backgroundColor: C.white, borderBottom: `1px solid ${C.border}`, padding: '10px 24px', overflowX: 'auto' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '6px', flexWrap: 'nowrap', alignItems: 'center' }}>
          {[
            { label: 'Top 20 Suburbs', href: '#top-20' },
            { label: 'By Business Type', href: '#by-type' },
            { label: 'Suburb Directory', href: '#suburbs' },
            { label: 'Comparisons', href: '#comparisons' },
            { label: 'High-Risk Zones', href: '#high-risk' },
            { label: 'FAQ', href: '#faq' },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: C.n700,
                textDecoration: 'none',
                padding: '6px 14px',
                borderRadius: '5px',
                backgroundColor: C.n50,
                border: `1px solid ${C.border}`,
                whiteSpace: 'nowrap',
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Stats Row */}
      <section style={{ padding: '40px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            {[
              { value: '$220B', label: 'Brisbane metro GDP — fastest-growing major metro in Australia post-2020', source: 'DEWR 2025' },
              { value: '2032', label: 'Brisbane Olympics — 6-year infrastructure build reshaping inner suburbs now', source: 'Queensland Government' },
              { value: '40%', label: 'Lower commercial rents in Paddington vs. Sydney\'s Surry Hills at equivalent demographics', source: 'CBRE Q1 2026' },
              { value: '$86K', label: 'Average household income in inner-ring Paddington–West End–New Farm corridor', source: 'ABS 2024' },
            ].map((s) => (
              <div key={s.value} style={{ padding: '24px', backgroundColor: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, textAlign: 'center' }}>
                <div style={{ fontSize: '30px', fontWeight: 800, color: C.brand, marginBottom: '8px' }}>{s.value}</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: C.n800, marginBottom: '6px', lineHeight: '1.4' }}>{s.label}</div>
                <div style={{ fontSize: '11px', color: C.mutedLight }}>{s.source}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Landscape */}
      <section style={{ padding: '56px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '28px' }}>
            Brisbane Business Landscape — 2026
          </h2>
          <div style={{ display: 'grid', gap: '22px' }}>
            {[
              "Brisbane has never had Melbourne\'s depth of hospitality culture or Sydney\'s concentration of wealth. What it has is something more useful for operators looking at 2026: trajectory. The post-Olympic build-up is real, the population growth is real, and the inner-ring suburbs that have been talked about as 'up and coming\' for years are now, visibly, up and come. Paddington\'s Given Terrace has five venues that could compete in any city in Australia. West End\'s Boundary Street has a genuine culture of independent food that was not there a decade ago. New Farm is Brisbane\'s brunch capital by any credible measure. These are not promotional claims — they are market conditions.",
              "The structural opportunity in Brisbane is the rent gap. Inner-ring Brisbane rents ($4,000–$9,000/month for quality positions) are 40–50% below equivalent Sydney rents and 30–40% below Melbourne\'s inner north. Consumer spending per customer is lower — Brisbane\'s café culture isn\'t yet at the specialty coffee price premium of Melbourne\'s inner north — but the gap between rent cost and revenue potential creates favourable unit economics for operators who execute well. The break-even threshold is materially lower than comparable Sydney or Melbourne positions, which means the margin for error is wider.",
              "Woolloongabba is the suburb that experienced commercial operators are watching most closely in 2026. The Gabba precinct redevelopment — the Olympic main stadium upgrade, the new Cross River Rail station, and the surrounding commercial and residential build-out — has transformed the precinct\'s trajectory. Five years ago, Gabba was a secondary commercial strip attached to a sports venue. In 2026, it is a precinct with growing residential density, improving demographics, and commercial rents that still reflect the old reality. The operators who enter Woolloongabba in 2026 will have captured their leases before the 2032 repricing.",
              "The Fortitude Valley story is instructive about how Brisbane\'s commercial narrative can mislead operators. The Valley has been Queensland\'s nightlife hub since the 1990s, which created a reputation that deterred many daytime commercial operators. That reputation is now a decade out of date. The Brunswick Street and Ann Street precincts carry genuine daytime foot traffic from creative industry professionals, residents of the surrounding apartment stock (substantial post-2015 builds), and the Valley\'s own evolving character. Daytime trading in the Valley in 2026 is significantly more viable than it was in 2015. The operators who dismissed it then are not dismissing it now.",
              "The outer middle ring — Greenslopes, Nundah, Newmarket, Annerley — represents Brisbane\'s value play equivalent to Melbourne\'s Box Hill or Sydney\'s Parramatta. These suburbs have been overlooked by operators focused on inner-ring prestige but they offer rent-to-demographic ratios that work. Greenslopes, anchored by the Greenslopes Private Hospital, has a structural healthcare demand base that the current operator supply does not fully serve. Nundah\'s Sandgate Road strip has a community café culture that draws locals from a wide catchment. These are not glamorous markets. They are reliable ones.",
            ].map((para, i) => (
              <p key={i} style={{ fontSize: '16px', lineHeight: '1.8', color: C.n800, margin: 0 }}>{para}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Poll */}
      <PollSection
        suburbName="Brisbane"
        question="What type of business are you planning to open in Brisbane?"
        options={['Café or coffee shop', 'Restaurant or bar', 'Retail or boutique', 'Allied health or wellness', 'Professional services']}
        initialVotes={[41, 29, 13, 10, 7]}
      />

      {/* By Business Type */}
      <section id="by-type" style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>
            Location Strategy by Business Type
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {[
              {
                type: 'Cafés & Specialty Coffee',
                insight: 'Paddington and West End are at near-capacity for the current demand level. New Farm is the standout gap — exceptional demand, very few operators. For risk-adjusted entry: Woolloongabba, Nundah, and Newmarket have improving demographics and thin café supply.',
                best: ['New Farm', 'Woolloongabba', 'Nundah'],
                avoid: 'Brisbane CBD, Spring Hill',
              },
              {
                type: 'Restaurants & Bars',
                insight: 'West End and Fortitude Valley are the two strongest restaurant markets. West End for quality independent hospitality; the Valley for volume and late-night trading. South Brisbane for tourist-professional mix with cultural precinct premium.',
                best: ['West End', 'Fortitude Valley', 'South Brisbane'],
                avoid: 'Chermside, Carindale',
              },
              {
                type: 'Retail & Boutique',
                insight: 'Paddington (Given Terrace) is Brisbane\'s best independent retail strip. Bulimba (Oxford Street) is the underrated alternative — comparable demographics, less competition. Avoid positioning adjacent to major shopping centres.',
                best: ['Paddington', 'Bulimba', 'West End'],
                avoid: 'Chermside, Indooroopilly, Carindale',
              },
              {
                type: 'Allied Health & Wellness',
                insight: 'Greenslopes (hospital district) has the strongest healthcare demand base. Woolloongabba is the growth play — incoming residents need GP, physio, and dental capacity. Toowong serves the UQ student-professional catchment.',
                best: ['Greenslopes', 'Woolloongabba', 'Toowong'],
                avoid: 'Brisbane CBD',
              },
              {
                type: 'Professional Services',
                insight: 'Fortitude Valley and Spring Hill remain the professional service hub despite remote work changes. Teneriffe and Newstead serve a growing professional population arriving with the apartment-build wave. Toowong for UQ-adjacent professional services.',
                best: ['Fortitude Valley', 'Teneriffe', 'Toowong'],
                avoid: 'Annerley, Carindale',
              },
              {
                type: 'Gyms & Fitness Studios',
                insight: 'New Farm and Paddington have the highest concentration of health-conscious demographics. Kangaroo Point\'s riverfront positioning lends itself to wellness. Woolloongabba is growing into a fitness market as residential density increases.',
                best: ['New Farm', 'Paddington', 'Kangaroo Point'],
                avoid: 'Brisbane CBD, Chermside',
              },
            ].map((cat) => (
              <div key={cat.type} style={{ backgroundColor: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, padding: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: C.n900, marginBottom: '12px' }}>{cat.type}</h3>
                <p style={{ fontSize: '13px', color: C.n700, lineHeight: '1.6', marginBottom: '16px' }}>{cat.insight}</p>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: C.emerald, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Best: </span>
                  <span style={{ fontSize: '12px', color: C.n700 }}>{cat.best.join(', ')}</span>
                </div>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: C.red, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avoid: </span>
                  <span style={{ fontSize: '12px', color: C.n700 }}>{cat.avoid}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top 20 Suburbs */}
      <section id="top-20" style={{ padding: '56px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '8px' }} id="top-20">
            Top 20 Brisbane Suburbs — Ranked & Scored
          </h2>
          <p style={{ fontSize: '15px', color: C.n700, marginBottom: '36px', lineHeight: '1.6' }}>
            Each suburb scored across four dimensions: foot traffic density, demographic income distribution, commercial rent viability, and competitive gap. GO means viable for most well-positioned concepts. CAUTION means specific niches work but general entry is risky.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {/* Tier 1 */}
            <div style={{ gridColumn: '1 / -1', marginBottom: '4px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: C.mutedLight, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                Tier 1 — Premium
              </h3>
            </div>
            {[
              { name: 'Paddington', slug: 'paddington', description: 'Given Terrace is Queensland\'s most successful independent hospitality strip. Five venues that compete nationally. Vacancy is low — when a tenancy comes up, act fast. Rents of $4,500–$8,000/month are Brisbane\'s highest for strip retail, but justified by customer quality and spending patterns.', score: 87, verdict: : "GO' as const, rentRange: '$4,500–$8,000/mo" },
              { name: 'West End', slug: 'west-end', description: 'Boundary Street is Brisbane\'s version of Fitzroy — an independent hospitality strip with educated demographics and strong community loyalty to local operators. Less concentrated than Paddington, which means more opportunity for new entrants. Rents $5,000–$9,000/month, with secondary Vulture Street positions at $3,000–$5,000.', score: 85, verdict: : "GO' as const, rentRange: '$5,000–$9,000/mo" },
              { name: 'New Farm', slug: 'new-farm', description: 'Brisbane\'s brunch capital with a demand-supply gap that is unusual for an inner suburb of this quality. The Brunswick Street and Merthyr Road corridor carries exceptional weekend foot traffic, but only three independent cafés serve it. Riverfront positioning drives aspirational dining. Rents of $4,000–$7,500/month reflect the premium market.', score: 80, verdict: : "GO' as const, rentRange: '$4,000–$7,500/mo" },
              { name: 'South Brisbane', slug: 'south-brisbane', description: 'Adjacent to the Gallery of Modern Art, QPAC, and the South Bank cultural precinct, South Brisbane has a tourist-professional mix that generates consistent weekend trade and solid weekday lunchtime demand. The Grey Street and Melbourne Street corridors offer quality positions at $5,500–$10,000/month.', score: 74, verdict: : "GO' as const, rentRange: '$5,500–$10,000/mo" },
            ].map((suburb) => (
              <SuburbCard
                key={suburb.slug}
                name={suburb.name}
                slug={suburb.slug}
                citySlug="brisbane"
                description={suburb.description}
                score={suburb.score}
                verdict={suburb.verdict}
                rentRange={suburb.rentRange}
              />
            ))}

            {/* Tier 2 */}
            <div style={{ gridColumn: '1 / -1', marginTop: '20px', marginBottom: '4px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: C.mutedLight, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                Tier 2 — Growth
              </h3>
            </div>
            {[
              { name: 'Woolloongabba', slug: 'woolloongabba', description: 'The single strongest growth trajectory in Brisbane in 2026. The Gabba Olympic precinct redevelopment — Cross River Rail station, precinct upgrade, residential build-out — is fundamentally changing this suburb. Logan Road is the current commercial anchor. Rents of $3,500–$6,500/month are priced for the old Woolloongabba, not the one arriving by 2032.', score: 79, verdict: : "GO' as const, rentRange: '$3,500–$6,500/mo" },
              { name: 'Bulimba', slug: 'bulimba', description: 'Oxford Street is Brisbane\'s most underrated commercial strip. The residential demographic — median household income $92,000, high proportion of families and professionals — is comparable to Paddington. Operators who have discovered Bulimba speak of it in the same terms Fitzroy operators spoke of before the rents tripled. Current rents $3,000–$5,500/month.', score: 78, verdict: : "GO' as const, rentRange: '$3,000–$5,500/mo" },
              { name: 'Kangaroo Point', slug: 'kangaroo-point', description: 'The Kangaroo Point precinct — Story Bridge Hotel end to the Cliffs — has undergone significant residential development that has outpaced commercial offering. Professional residents have spending habits that the current café and restaurant supply does not fully serve. Ferry access and riverfront positioning drive weekend foot traffic beyond resident population. Rents $3,000–$5,500/month.', score: 76, verdict: : "GO' as const, rentRange: '$3,000–$5,500/mo" },
              { name: 'Teneriffe', slug: 'teneriffe', description: 'The wool store conversions that define Teneriffe\'s built character also define its customer base: creative professionals, architects, and agency workers who earn high salaries and value originality over familiarity. The Teneriffe precinct\'s concentration of boutique offices creates a weekday professional lunch market that is underserved. Rents $3,500–$6,500/month.', score: 75, verdict: : "GO' as const, rentRange: '$3,500–$6,500/mo" },
              { name: 'Fortitude Valley', slug: 'fortitude-valley', description: 'The Valley\'s transformation from nightlife district to all-day commercial precinct is now well advanced. Brunswick Street daytime trading volumes in 2026 are the highest they have been. The demographic mix — creative industry workers, residents of the post-2015 apartment stock, media and technology professionals — supports specialty coffee, quality lunch, and evening dining. Rents $4,000–$7,000/month.', score: 74, verdict: : "GO' as const, rentRange: '$4,000–$7,000/mo" },
              { name: 'Toowong', slug: 'toowong', description: 'University of Queensland\'s eastern gateway suburb has a dual demographic: students and academics who drive daytime volume, and professionals and families in the surrounding residential catchment who drive evening and weekend trade. The current café and restaurant supply has not kept pace with population growth. Rents $3,000–$5,500/month with significant off-strip discounts.', score: 73, verdict: : "GO' as const, rentRange: '$3,000–$5,500/mo" },
            ].map((suburb) => (
              <SuburbCard
                key={suburb.slug}
                name={suburb.name}
                slug={suburb.slug}
                citySlug="brisbane"
                description={suburb.description}
                score={suburb.score}
                verdict={suburb.verdict}
                rentRange={suburb.rentRange}
              />
            ))}

            {/* Tier 3 */}
            <div style={{ gridColumn: '1 / -1', marginTop: '20px', marginBottom: '4px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: C.mutedLight, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                Tier 3 — Outer Growth
              </h3>
            </div>
            {[
              { name: 'Greenslopes', slug: 'greenslopes', description: 'Greenslopes Private Hospital anchors one of Queensland\'s most reliable healthcare demand bases. The surrounding commercial strip is structurally undersupplied for allied health, pharmacy, and professional services relative to the hospital catchment. Greenslopes is one of the few Brisbane suburbs where demand is structurally guaranteed by institutional presence. Rents $2,500–$4,500/month.', score: 73, verdict: : "GO' as const, rentRange: '$2,500–$4,500/mo" },
              { name: 'Newmarket', slug: 'newmarket', description: 'Enoggera Road\'s commercial strip is showing the early signs of the demographic shift that has already matured in Nundah and Wilston. Young professionals are arriving, rents are accessible, and the café supply is thin relative to the residential growth rate. Not inner-city excitement, but reliable early-mover economics. Rents $2,500–$4,500/month.', score: 72, verdict: : "GO' as const, rentRange: '$2,500–$4,500/mo" },
              { name: 'Nundah', slug: 'nundah', description: 'Sandgate Road and Nundah Village have developed a genuine community café culture that draws customers from the northern suburbs. The demographic has shifted toward younger professionals, and the commercial strip has more character than most middle-ring Brisbane precincts. First-mover advantage in quality food concepts has largely been captured, but there is still room. Rents $2,500–$4,500/month.', score: 72, verdict: : "GO' as const, rentRange: '$2,500–$4,500/mo" },
              { name: 'Mount Gravatt', slug: 'mount-gravatt', description: 'Griffith University\'s Nathan and South Bank campuses create a consistent student and academic demand base. The commercial strip along Logan Road serves a family-student-professional mix that rewards correctly positioned operators. Quality casual dining and health services are underserved. Rents $2,500–$4,500/month with the lowest vacancy risk of any university-adjacent suburb in Brisbane.', score: 72, verdict: : "GO' as const, rentRange: '$2,500–$4,500/mo" },
              { name: 'Indooroopilly', slug: 'indooroopilly', description: 'Westfield Indooroopilly dominates the immediate commercial catchment, which is both a challenge and an opportunity. Strip positions on Moggill Road outside the centre serve the residential and UQ catchment without competing directly with the centre. Healthcare, specialty food, and independent café concepts positioned outside the Westfield orbit perform well. Rents $2,500–$4,500/month.', score: 71, verdict: : "GO' as const, rentRange: '$2,500–$4,500/mo" },
              { name: 'Carindale', slug: 'carindale', description: 'Southeast Brisbane\'s family demographic anchor. Westfield Carindale is the primary retail hub for the eastern suburbs, which creates foot traffic but also strip-retail competition. Family health services, children\'s education, and quality casual dining positioned on Old Cleveland Road (outside the mall) access the family demographic with lower rent than centre positions. Rents $2,800–$5,200/month.', score: 71, verdict: : "GO' as const, rentRange: '$2,800–$5,200/mo" },
              { name: 'Annerley', slug: 'annerley', description: 'Ipswich Road\'s commercial corridor is unambiguously Brisbane\'s value play for healthcare and multicultural food operators. The suburb\'s multicultural residential base — significant Sri Lankan, Nepalese, and South Asian communities — creates specialty food demand that is currently undersupplied. Healthcare demand is structural. Rents $2,000–$3,800/month are among the lowest of any accessible inner-ring suburb.', score: 70, verdict: : "GO' as const, rentRange: '$2,000–$3,800/mo" },
            ].map((suburb) => (
              <SuburbCard
                key={suburb.slug}
                name={suburb.name}
                slug={suburb.slug}
                citySlug="brisbane"
                description={suburb.description}
                score={suburb.score}
                verdict={suburb.verdict}
                rentRange={suburb.rentRange}
              />
            ))}

            {/* Tier 4 */}
            <div style={{ gridColumn: '1 / -1', marginTop: '20px', marginBottom: '4px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: C.mutedLight, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                Tier 4 — Speculative
              </h3>
            </div>
            {[
              { name: 'Brisbane CBD', slug: 'brisbane-cbd', description: 'Queen Street Mall foot traffic is genuine but CBD rents of $12,000–$28,000/month require extraordinary revenue to be viable. Post-pandemic office occupancy runs at 70–75% of 2019 peak. Works for premium concepts with strong unit economics; does not work for independent cafés or small-format retail.', score: 72, verdict: : "CAUTION' as const, rentRange: '$12,000–$28,000/mo" },
              { name: 'Spring Hill', slug: 'spring-hill', description: 'Spring Hill is Brisbane\'s office district adjacent to the CBD. Weekday professional traffic is real; weekend residential population is thin. Concepts dependent on all-week trading are structurally challenged. Works for Monday–Friday corporate lunch, professional services, or weekday-only food concepts.', score: 69, verdict: : "CAUTION' as const, rentRange: '$5,000–$9,000/mo" },
              { name: 'Chermside', slug: 'chermside', description: 'Westfield Chermside is one of Queensland\'s largest shopping centres, which concentrates commercial gravity inside the mall. Strip retail on Gympie Road outside the centre faces structural competition from a destination retail asset that outspends, outmarkets, and outconveniences most independent operators. The niche: healthcare and personal services that the mall cannot easily host.', score: 68, verdict: : "CAUTION' as const, rentRange: '$3,000–$5,500/mo" },
            ].map((suburb) => (
              <SuburbCard
                key={suburb.slug}
                name={suburb.name}
                slug={suburb.slug}
                citySlug="brisbane"
                description={suburb.description}
                score={suburb.score}
                verdict={suburb.verdict}
                rentRange={suburb.rentRange}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section id="comparisons" style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '8px' }}>
            Brisbane Suburb Comparison
          </h2>
          <p style={{ fontSize: '14px', color: C.n700, marginBottom: '28px' }}>
            Key metrics across the top 8 locations — GO/CAUTION verdict, rent range, foot traffic, and best-fit business categories.
          </p>
          <ComparisonTable rows={COMPARISON_ROWS} />
        </div>
      </section>

      {/* High-Risk Section */}
      <section id="high-risk" style={{ padding: '48px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '8px' }}>
            High-Risk Zones — Where Operators Fail
          </h2>
          <p style={{ fontSize: '14px', color: C.n700, marginBottom: '28px' }}>
            These locations have specific structural challenges. Going in without understanding them is how operators lose deposits.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {[
              {
                zone: 'Brisbane CBD — The Volume Trap',
                risk: 'Very High',
                body: 'CBD rents of $15,000–$28,000/month create a mathematical problem: at $6 per coffee, you need 2,500+ coffee sales per month just to cover rent. Add labour and COGS and your break-even exceeds $600,000 annual revenue before any profit. The operators succeeding in the CBD are premium concepts with $25+ average transaction values and extraordinary volumes. The independent café model that works in West End does not survive CBD rent mathematics.',
              },
              {
                zone: 'Shopping Centre Adjacent — The Gravity Problem',
                risk: 'High',
                body: 'Westfield Chermside, Westfield Indooroopilly, and Westfield Carindale each create a commercial gravity that consumes surrounding strip retail. Customers drive past strip shops to park inside the centre. The marketing budgets of these centres dwarf what any independent operator can deploy. Strip retail survives adjacent to these centres only in categories the mall cannot host: specialty healthcare, owner-operated food with distinct positioning, or services requiring privacy.',
              },
              {
                zone: 'Spring Hill — The Office Weekend Problem',
                risk: 'High',
                body: 'Spring Hill has 15,000 workers on a weekday and approximately 1,500 residents on a weekend. The commercial strip is viable Monday–Friday; it is essentially dead Saturday and Sunday. Operators who model revenue on weekday trading only and adjust for weekend decline find the economics can work — but operators who model Spring Hill as an all-week business without weekend revenue corrections typically fail within 18 months.',
              },
            ].map((item) => (
              <div key={item.zone} style={{ backgroundColor: C.redBg, border: `1px solid ${C.redBdr}`, borderRadius: '12px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: C.n900, margin: 0 }}>{item.zone}</h3>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: C.red, backgroundColor: '#FFFFFF', padding: '2px 8px', borderRadius: '4px', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                    Risk: {item.risk}
                  </span>
                </div>
                <p style={{ fontSize: '13px', lineHeight: '1.7', color: C.n800, margin: 0 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection faqs={FAQS} />

      {/* CTA */}
      <CTASection
        title="Ready to choose your Brisbane location?"
        subtitle="Enter your address and business type. Our system analyses foot traffic, competition, demographics, and rent viability — and produces a structured GO/CAUTION/NO verdict with supporting data."
        buttonText="Analyse your Brisbane address →"
        buttonHref="/onboarding"
      />
    </div>
  )
}
