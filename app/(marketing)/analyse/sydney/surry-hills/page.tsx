import Link from 'next/link'
import { Metadata } from 'next'

const C = {
  brand: '#0891B2',
  brandLight: '#06B6D4',
  emerald: '#059669',
  emeraldBg: '#ECFDF5',
  emeraldBdr: '#A7F3D0',
  amber: '#D97706',
  amberBg: '#FFFBEB',
  amberBdr: '#FDE68A',
  red: '#DC2626',
  redBg: '#FEF2F2',
  redBdr: '#FECACA',
  muted: '#475569',
  border: '#E2E8F0',
  n50: '#FAFAF9',
  n100: '#F5F5F4',
  n900: '#1C1917',
  white: '#FFFFFF',
}

type Verdict = 'GO' | 'CAUTION' | 'NO'

function VerdictBadge({ v }: { v: Verdict }) {
  const styles: Record<Verdict, { bg: string; color: string; text: string }> = {
    GO: { bg: C.emeraldBg, color: C.emerald, text: 'GO' },
    CAUTION: { bg: C.amberBg, color: C.amber, text: 'CAUTION' },
    NO: { bg: C.redBg, color: C.red, text: 'NO' },
  }
  const style = styles[v]
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: '600',
        backgroundColor: style.bg,
        color: style.color,
        border: `1px solid ${style.color}`,
      }}
    >
      {style.text}
    </span>
  )
}

function RiskBadge({ risk }: { risk: 'GO' | 'CAUTION' | 'NO' }) {
  const styles: Record<string, { bg: string; color: string; text: string }> = {
    GO: { bg: C.emeraldBg, color: C.emerald, text: 'GO' },
    CAUTION: { bg: C.amberBg, color: C.amber, text: 'CAUTION' },
    NO: { bg: C.redBg, color: C.red, text: 'NO' },
  }
  const style = styles[risk]
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: '600',
        backgroundColor: style.bg,
        color: style.color,
        border: `1px solid ${style.color}`,
      }}
    >
      {style.text}
    </span>
  )
}

interface ScoreBarProps {
  label: string
  value: number
}

function ScoreBar({ label, value }: ScoreBarProps) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontSize: '14px', fontWeight: '600', color: C.n900 }}>{label}</span>
        <span style={{ fontSize: '14px', fontWeight: '700', color: C.brand }}>{value}/100</span>
      </div>
      <div style={{ width: '100%', height: '8px', backgroundColor: C.border, borderRadius: '4px', overflow: 'hidden' }}>
        <div
          style={{
            width: `${value}%`,
            height: '100%',
            backgroundColor: C.brand,
          }}
        />
      </div>
    </div>
  )
}

function FAQSection({ faqs, id }: { faqs: Array<{ question: string; answer: string }>; id: string }) {
  return (
    <section style={{ padding: '48px 24px', backgroundColor: C.n50 }} id={id}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: C.n900 }}>
          Frequently Asked Questions
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              style={{
                padding: '16px',
                backgroundColor: C.white,
                borderRadius: '8px',
                border: `1px solid ${C.border}`,
              }}
            >
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.n900, marginBottom: '8px', margin: 0 }}>
                {faq.question}
              </h3>
              <p style={{ fontSize: '14px', color: C.muted, lineHeight: '1.6', margin: 0 }}>
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section style={{ padding: '48px 24px', backgroundColor: C.emeraldBg }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px', color: C.emerald }}>
          Get Surry Hills-specific data
        </h2>
        <p style={{ fontSize: '14px', color: C.emerald, marginBottom: '16px', lineHeight: '1.6' }}>
          Analyse your specific Surry Hills location to see foot traffic density, demographic breakdown, and comparative rents.
        </p>
        <Link
          href="/onboarding"
          style={{
            display: 'inline-block',
            padding: '12px 28px',
            backgroundColor: C.emerald,
            color: C.white,
            borderRadius: '6px',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '600',
          }}
        >
          Analyse free
        </Link>
      </div>
    </section>
  )
}

const FAQS = [
  {
    question: 'Is Surry Hills good for a cafe or restaurant?',
    answer: 'Yes. Surry Hills is Sydney\'s premier café and restaurant suburb. Foot traffic is exceptional (18,000+ daily on Crown Street), the demographic is young professionals with high dining frequency, and the market is mature enough to support multiple operators. However, rents are the highest in Sydney ($10,000-$14,000/month for Crown Street). Success requires exceptional product and strong operational discipline.',
  },
  {
    question: 'What is commercial rent in Surry Hills?',
    answer: 'Crown Street prime retail: $10,000-$14,000/month for 800-1,000 sqft. Bourke/Cleveland Street: $7,500-$11,000/month. Oxford Street: $8,000-$12,000/month. Laneway locations: $5,000-$8,000/month. These are Australia\'s highest retail rents but justified by foot traffic density and demographic quality.',
  },
  {
    question: 'How competitive is Surry Hills?',
    answer: 'Competition is intense. There are 7-9 specialty cafes per 500m, multiple natural wine bars, and numerous independent restaurants. However, the foot traffic is so large that multiple successful operators coexist. The key is genuine differentiation - mediocre concepts fail, exceptional ones thrive.',
  },
  {
    question: 'Which streets are best for business in Surry Hills?',
    answer: 'Crown Street is premium real estate with the highest foot traffic and rents ($10,000-$14,000/month). Cleveland and Bourke Streets are strong secondary options ($7,500-$11,000/month) with reliable foot traffic. Laneway locations offer lower rents ($5,000-$8,000/month) and emerging opportunities for niche concepts.',
  },
  {
    question: 'What kinds of businesses fail in Surry Hills?',
    answer: 'Budget fast-food concepts, generic cafes, dated/trendy designs, and low-margin models all fail. The demographic is quality-driven and trend-sensitive. Rent precludes low-margin business models. Chain operators struggle unless they are exceptional in execution.',
  },
  {
    question: 'How does Surry Hills compare to Newtown?',
    answer: 'Surry Hills scores 87 (GO), Newtown scores 81 (GO). Surry Hills has higher foot traffic, higher-income demographics, and higher rents. Newtown has more niche/indie culture, lower rents, and a student population. Surry Hills favors premium hospitality; Newtown favors independent/vegan/natural wine concepts.',
  },
]

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
}

export const metadata: Metadata = {
  title: 'Surry Hills Business Analysis: Score 87, GO Verdict | Locatalyze',
  description: 'Deep analysis of Surry Hills for cafe, restaurant, and retail. Score 87 (GO). Foot traffic 88, Demographics 91, Rent Viability 71. Crown Street premium real estate, $92K median income.',
  alternates: {
    canonical: 'https://locatalyze.com/analyse/sydney/surry-hills',
  },
  openGraph: {
    title: 'Surry Hills Business Analysis: Score 87, GO',
    description: 'Sydney\'s premier hospitality suburb. Foot traffic 88/100, Demographics 91/100. $10K-$14K/mo Crown Street rent.',
    type: 'article',
    url: 'https://locatalyze.com/analyse/sydney/surry-hills',
  },
}

export default function SurryHillsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />

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
        <div style={{ fontSize: '13px', color: C.muted, fontWeight: '600' }}>
          <Link href="/analyse" style={{ color: C.brand, textDecoration: 'none' }}>
            Analyse
          </Link>
          {' > '}
          <Link href="/analyse/sydney" style={{ color: C.brand, textDecoration: 'none' }}>
            Sydney
          </Link>
          {' > Surry Hills'}
        </div>
        <Link
          href="/onboarding"
          style={{
            padding: '8px 16px',
            backgroundColor: C.emerald,
            color: C.white,
            borderRadius: '6px',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '600',
          }}
        >
          Analyse free
        </Link>
      </nav>

      <section
        style={{
          background: `linear-gradient(135deg, #0E7490 0%, ${C.brand} 50%, ${C.brandLight} 100%)`,
          color: C.white,
          padding: '48px 24px',
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px', opacity: 0.9 }}>
            Location Guides &gt; Sydney &gt; Surry Hills
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <h1 style={{ fontSize: '36px', fontWeight: '700', margin: 0 }}>Surry Hills</h1>
            <span style={{ fontSize: '48px', fontWeight: '700' }}>87</span>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <RiskBadge risk="GO" />
          </div>
          <p style={{ fontSize: '16px', lineHeight: '1.6', opacity: 0.95, margin: 0, marginBottom: '8px' }}>
            Sydney's premier inner-city hospitality market. Crown Street generates 18,000+ daily foot traffic. Young professional demographic (median income $92,000) is Australia's highest café-spending cohort. Competition is intense but foot traffic is proportionate. This is a GO for strong hospitality operators.
          </p>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>
            Postcode: NSW 2010
          </div>
        </div>
      </section>

      <section style={{ padding: '32px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: C.muted, marginBottom: '4px' }}>Median HH Income</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: C.n900 }}>$92,000</div>
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: C.muted, marginBottom: '4px' }}>Population</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: C.n900 }}>14,000</div>
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: C.muted, marginBottom: '4px' }}>Competition</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: C.n900 }}>Very High</div>
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: C.muted, marginBottom: '4px' }}>Trading Hours</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: C.n900 }}>7am-11pm daily</div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: C.n900 }}>
            Rent Ranges by Location
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '16px', backgroundColor: C.white, borderRadius: '8px', border: `1px solid ${C.border}` }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: C.brand, marginBottom: '8px', margin: 0 }}>Crown St Prime</h3>
              <p style={{ fontSize: '16px', fontWeight: '700', color: C.n900, margin: 0 }}>$10,000-$14,000/mo</p>
              <p style={{ fontSize: '12px', color: C.muted, margin: 0, marginTop: '4px' }}>Ground floor, high traffic</p>
            </div>
            <div style={{ padding: '16px', backgroundColor: C.white, borderRadius: '8px', border: `1px solid ${C.border}` }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: C.brand, marginBottom: '8px', margin: 0 }}>Bourke/Cleveland St</h3>
              <p style={{ fontSize: '16px', fontWeight: '700', color: C.n900, margin: 0 }}>$7,500-$11,000/mo</p>
              <p style={{ fontSize: '12px', color: C.muted, margin: 0, marginTop: '4px' }}>Secondary streets</p>
            </div>
            <div style={{ padding: '16px', backgroundColor: C.white, borderRadius: '8px', border: `1px solid ${C.border}` }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: C.brand, marginBottom: '8px', margin: 0 }}>Oxford St</h3>
              <p style={{ fontSize: '16px', fontWeight: '700', color: C.n900, margin: 0 }}>$8,000-$12,000/mo</p>
              <p style={{ fontSize: '12px', color: C.muted, margin: 0, marginTop: '4px' }}>Variable foot traffic</p>
            </div>
            <div style={{ padding: '16px', backgroundColor: C.white, borderRadius: '8px', border: `1px solid ${C.border}` }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: C.brand, marginBottom: '8px', margin: 0 }}>Laneways</h3>
              <p style={{ fontSize: '16px', fontWeight: '700', color: C.n900, margin: 0 }}>$5,000-$8,000/mo</p>
              <p style={{ fontSize: '12px', color: C.muted, margin: 0, marginTop: '4px' }}>Emerging destinations</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: C.n900 }}>
            Business Scores
          </h2>
          <ScoreBar label="Foot Traffic" value={88} />
          <ScoreBar label="Area Demographics" value={91} />
          <ScoreBar label="Rent Viability" value={71} />
          <ScoreBar label="Competition Gap" value={62} />
          <ScoreBar label="Accessibility" value={85} />
        </div>
      </section>

      <section style={{ padding: '48px 24px', backgroundColor: C.white }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: C.n900 }}>
            Market Fundamentals
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', fontSize: '16px', lineHeight: '1.7', color: C.muted }}>
            <p>
              Surry Hills has been Sydney's premier inner-city hospitality market for over 15 years. Crown Street generates 18,000+ daily foot traffic (20,000+ on weekends), with concentrated pedestrian movement between venues. This is not random foot traffic - it is deliberate destination shopping. Customers come specifically for dining and hospitality experiences. Conversion rates are higher than any other Sydney location. The market is proven, mature, and defensible.
            </p>
            <p>
              The resident demographic is young professional: median age 32, median household income $92,000. This cohort visits cafes 4-5 times weekly, spends $15-25 per visit, and is quality-sensitive. They will abandon an average cafe for a better one. They tolerate higher prices for demonstrable quality. They become loyal repeat customers to exceptional products. This demographic represents Australia's highest cafe-spending frequency and ticket size. Evening trade is genuine Thursday-Saturday, not dependent on workplace culture. No student-calendar dependency unlike some Sydney suburbs.
            </p>
            <p>
              Rent has risen sharply since 2019. Crown Street prime retail costs $10,000-$14,000 monthly for 800-1,000 sqft. Secondary streets (Cleveland, Bourke, Devonshire) cost $7,500-$11,000. These rents are extraordinary by Australian standards but sustainable for strong concepts. The fundamental question is whether you can generate sufficient margin to absorb these rents with the exceptional foot traffic available. For most specialty hospitality concepts, yes. For weak or generic concepts, rents will kill the business.
            </p>
            <p>
              Generic concepts fail consistently. Chain operators struggle unless they are exceptional in execution. Independent culture is not as strong as Newtown, but concept-led businesses thrive while generic operators fail. The demographic actively seeks differentiated, specialized experiences. A "good cafe on Crown Street" will lose customers to a "specific niche cafe." Successful operators have clear positioning: specialty coffee roastery, premium modern Australian, natural wine bar, or high-end hair salon. Generic positioning is insufficient.
            </p>
            <p>
              Competition intensity is real but proportionate to market size. Within 500m of Crown Street, there are 7-9 specialty cafes, 4-6 independent restaurants, and numerous hospitality concepts. Every niche has 2-3 competitors. But the market is large and diverse enough that multiple successful operators coexist. The 400+ venues in the broader market reflects market size, not oversaturation. Success requires genuine differentiation and operational excellence, not luck.
            </p>
            <p>
              Lease negotiations are critical. Rent growth has outpaced revenue growth since 2023. Any landlord who does not cap CPI increases will create financial stress during the lease term. Operators with older leases (2019-2021) signed before the spike have dramatically lower cost bases than new entrants. This creates a two-tier market: established operators with favorable terms thriving, new entrants struggling with higher rent-to-revenue ratios. Negotiate strictly on CPI caps and lock in favorable terms if possible.
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: C.n900 }}>
            Best Business Models
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '16px', backgroundColor: C.white, borderRadius: '8px', border: `1px solid ${C.border}` }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.n900, marginBottom: '8px' }}>Specialty Restaurant (60-80 seats)</h3>
              <div style={{ marginBottom: '12px' }}>
                <RiskBadge risk="GO" />
              </div>
              <div style={{ fontSize: '13px', color: C.muted, lineHeight: '1.6', marginBottom: '8px' }}>
                <div style={{ marginBottom: '4px' }}>Rent: $8,000-$12,000/mo</div>
                <div style={{ marginBottom: '4px' }}>Revenue: $55,000-$90,000/mo</div>
                <div style={{ marginBottom: '4px' }}>Break-even: 7-10 months</div>
              </div>
              <p style={{ fontSize: '12px', color: C.muted, margin: 0 }}>Modern Australian, Mediterranean, or specialized cuisine thrives. Concept-led positioning essential.</p>
            </div>
            <div style={{ padding: '16px', backgroundColor: C.white, borderRadius: '8px', border: `1px solid ${C.border}` }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.n900, marginBottom: '8px' }}>Specialty Coffee/Roastery</h3>
              <div style={{ marginBottom: '12px' }}>
                <RiskBadge risk="GO" />
              </div>
              <div style={{ fontSize: '13px', color: C.muted, lineHeight: '1.6', marginBottom: '8px' }}>
                <div style={{ marginBottom: '4px' }}>Rent: $5,000-$8,000/mo</div>
                <div style={{ marginBottom: '4px' }}>Revenue: $35,000-$55,000/mo</div>
                <div style={{ marginBottom: '4px' }}>Break-even: 5-8 months</div>
              </div>
              <p style={{ fontSize: '12px', color: C.muted, margin: 0 }}>Single-origin, notable roasters. Quality and brand matter significantly.</p>
            </div>
            <div style={{ padding: '16px', backgroundColor: C.white, borderRadius: '8px', border: `1px solid ${C.border}` }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.n900, marginBottom: '8px' }}>Wine Bar/Natural Wine</h3>
              <div style={{ marginBottom: '12px' }}>
                <RiskBadge risk="GO" />
              </div>
              <div style={{ fontSize: '13px', color: C.muted, lineHeight: '1.6', marginBottom: '8px' }}>
                <div style={{ marginBottom: '4px' }}>Rent: $4,500-$7,500/mo</div>
                <div style={{ marginBottom: '4px' }}>Revenue: $40,000-$65,000/mo</div>
                <div style={{ marginBottom: '4px' }}>Break-even: 6-9 months</div>
              </div>
              <p style={{ fontSize: '12px', color: C.muted, margin: 0 }}>Natural wine, specialty cheese/deli. Underrepresented relative to demand.</p>
            </div>
            <div style={{ padding: '16px', backgroundColor: C.white, borderRadius: '8px', border: `1px solid ${C.border}` }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.n900, marginBottom: '8px' }}>Premium Hair/Beauty Studio</h3>
              <div style={{ marginBottom: '12px' }}>
                <RiskBadge risk="GO" />
              </div>
              <div style={{ fontSize: '13px', color: C.muted, lineHeight: '1.6', marginBottom: '8px' }}>
                <div style={{ marginBottom: '4px' }}>Rent: $3,500-$6,000/mo</div>
                <div style={{ marginBottom: '4px' }}>Revenue: $25,000-$45,000/mo</div>
                <div style={{ marginBottom: '4px' }}>Break-even: 4-6 months</div>
              </div>
              <p style={{ fontSize: '12px', color: C.muted, margin: 0 }}>Health-conscious demographic sustains premium pricing and high retention.</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 24px', backgroundColor: C.white }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: C.n900 }}>
            Who Should NOT Open Here
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '16px', backgroundColor: C.white, borderRadius: '8px', border: `3px solid ${C.red}`, borderTop: `4px solid ${C.red}` }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.red, marginBottom: '8px', margin: 0 }}>Chain Operators</h3>
              <p style={{ fontSize: '13px', color: C.muted, margin: 0 }}>Corporate chains and franchises struggle in Surry Hills. Market prefers independent, concept-led operators.</p>
            </div>
            <div style={{ padding: '16px', backgroundColor: C.white, borderRadius: '8px', border: `3px solid ${C.red}`, borderTop: `4px solid ${C.red}` }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.red, marginBottom: '8px', margin: 0 }}>Generic Cafe Operators</h3>
              <p style={{ fontSize: '13px', color: C.muted, margin: 0 }}>A "good cafe" is insufficient. Demographic actively rejects generic positioning.</p>
            </div>
            <div style={{ padding: '16px', backgroundColor: C.white, borderRadius: '8px', border: `3px solid ${C.red}`, borderTop: `4px solid ${C.red}` }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.red, marginBottom: '8px', margin: 0 }}>Under-Capitalized Launches</h3>
              <p style={{ fontSize: '13px', color: C.muted, margin: 0 }}>Rent is high. Under-capitalized businesses cannot weather ramp-up periods.</p>
            </div>
            <div style={{ padding: '16px', backgroundColor: C.white, borderRadius: '8px', border: `3px solid ${C.red}`, borderTop: `4px solid ${C.red}` }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.red, marginBottom: '8px', margin: 0 }}>Budget/Low-Margin Models</h3>
              <p style={{ fontSize: '13px', color: C.muted, margin: 0 }}>Rent precludes budget fast-food and discount retail models.</p>
            </div>
            <div style={{ padding: '16px', backgroundColor: C.white, borderRadius: '8px', border: `3px solid ${C.red}`, borderTop: `4px solid ${C.red}` }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.red, marginBottom: '8px', margin: 0 }}>Businesses Needing Cheap Rent</h3>
              <p style={{ fontSize: '13px', color: C.muted, margin: 0 }}>If your model requires sub-$4,000/mo rent, Surry Hills is not viable.</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: C.n900 }}>
            Case Scenario
          </h2>
          <div style={{ padding: '20px', backgroundColor: C.white, borderRadius: '8px', border: `1px solid ${C.border}`, marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: C.brand, marginBottom: '12px', margin: 0 }}>
              Modern Australian Restaurant, Crown Street
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '600', color: C.muted, marginBottom: '4px' }}>Setup</div>
                <div style={{ fontSize: '14px', color: C.n900 }}>40 seats, dine-in focused</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '600', color: C.muted, marginBottom: '4px' }}>Average Cover</div>
                <div style={{ fontSize: '14px', color: C.n900 }}>$72</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '600', color: C.muted, marginBottom: '4px' }}>Monthly Rent</div>
                <div style={{ fontSize: '14px', color: C.n900 }}>$12,500</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '600', color: C.muted, marginBottom: '4px' }}>Covers Needed/Week</div>
                <div style={{ fontSize: '14px', color: C.n900 }}>420</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '600', color: C.muted, marginBottom: '4px' }}>Monthly Revenue Target</div>
                <div style={{ fontSize: '14px', color: C.n900 }}>$72,000</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '600', color: C.muted, marginBottom: '4px' }}>Break-Even</div>
                <div style={{ fontSize: '14px', color: C.n900 }}>7-10 months</div>
              </div>
            </div>
          </div>
          <p style={{ fontSize: '14px', color: C.muted, lineHeight: '1.6', margin: 0 }}>
            This scenario requires 60-70 covers per day (6 days trading, closed Monday). Crown Street foot traffic can support this at correct price and positioning. However, execution must be excellent - ramp-up delays compound quickly at this rent level.
          </p>
        </div>
      </section>

      <section style={{ padding: '48px 24px', backgroundColor: C.n900, color: C.white }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '12px' }}>
            Ready to open in Surry Hills?
          </h2>
          <p style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '24px', opacity: 0.95 }}>
            Get foot traffic data, demographic breakdown, and competitor mapping for your exact location on Crown Street or secondary streets.
          </p>
          <Link
            href="/onboarding"
            style={{
              display: 'inline-block',
              padding: '12px 28px',
              backgroundColor: C.emerald,
              color: C.white,
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '600',
            }}
          >
            Analyse free
          </Link>
        </div>
      </section>

      <FAQSection faqs={FAQS} id="faq" />

      <section style={{ padding: '48px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: C.n900 }}>
            Nearby Suburbs
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <Link
              href="/analyse/sydney/newtown"
              style={{
                padding: '16px',
                backgroundColor: C.white,
                borderRadius: '8px',
                border: `1px solid ${C.border}`,
                textDecoration: 'none',
                display: 'block',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: C.n900, margin: 0 }}>Newtown</h3>
                <span style={{ fontSize: '18px', fontWeight: '700', color: C.brand }}>81</span>
              </div>
              <div>
                <RiskBadge risk="GO" />
              </div>
            </Link>
            <Link
              href="/analyse/sydney/alexandria"
              style={{
                padding: '16px',
                backgroundColor: C.white,
                borderRadius: '8px',
                border: `1px solid ${C.border}`,
                textDecoration: 'none',
                display: 'block',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: C.n900, margin: 0 }}>Alexandria</h3>
                <span style={{ fontSize: '18px', fontWeight: '700', color: C.brand }}>78</span>
              </div>
              <div>
                <RiskBadge risk="GO" />
              </div>
            </Link>
            <Link
              href="/analyse/sydney/marrickville"
              style={{
                padding: '16px',
                backgroundColor: C.white,
                borderRadius: '8px',
                border: `1px solid ${C.border}`,
                textDecoration: 'none',
                display: 'block',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: C.n900, margin: 0 }}>Marrickville</h3>
                <span style={{ fontSize: '18px', fontWeight: '700', color: C.brand }}>80</span>
              </div>
              <div>
                <RiskBadge risk="GO" />
              </div>
            </Link>
            <Link
              href="/analyse/sydney/ultimo"
              style={{
                padding: '16px',
                backgroundColor: C.white,
                borderRadius: '8px',
                border: `1px solid ${C.border}`,
                textDecoration: 'none',
                display: 'block',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: C.n900, margin: 0 }}>Ultimo</h3>
                <span style={{ fontSize: '18px', fontWeight: '700', color: C.brand }}>68</span>
              </div>
              <div>
                <RiskBadge risk="CAUTION" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      <CTASection />

      <section style={{ padding: '32px 24px', backgroundColor: C.n50, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', fontSize: '13px', color: C.muted, display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Link href="/analyse/sydney" style={{ color: C.brand, textDecoration: 'none', fontWeight: '600' }}>
            Back to Sydney Hub
          </Link>
          <Link href="/analyse/sydney/newtown" style={{ color: C.brand, textDecoration: 'none', fontWeight: '600' }}>
            Newtown Analysis
          </Link>
          <Link href="/analyse/sydney/marrickville" style={{ color: C.brand, textDecoration: 'none', fontWeight: '600' }}>
            Marrickville Analysis
          </Link>
        </div>
      </section>
    </>
  )
}
