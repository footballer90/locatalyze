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
  muted: '#64748B',
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
          Get Newtown-specific data
        </h2>
        <p style={{ fontSize: '14px', color: C.emerald, marginBottom: '16px', lineHeight: '1.6' }}>
          Analyse your specific Newtown location to see foot traffic density, demographic breakdown, and comparative rents on King Street and Enmore Road.
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
    question: 'Is Newtown good for a cafe or restaurant?',
    answer: 'Yes, Newtown is a strong GO (score 81). King Street has 70+ cafes for 12,000 residents but demand is genuine from USyd students, inner-west residents, and destination dining visitors. Niche concepts thrive, but generic cafes struggle. Natural wine, vegan, and specialty retail are particularly strong. Enmore Road is the emerging alternative with lower rents and growing foot traffic.',
  },
  {
    question: 'What makes Newtown different from other Sydney suburbs?',
    answer: 'Newtown has stronger indie/community culture than most Sydney suburbs. The community actively rejects chains. Vegan/plant-based market is proportionally the strongest of any Sydney suburb. Median income ($68K) is lower than Surry Hills, creating price sensitivity for mass-market positioning but willingness to pay premium for niche/ethical concepts. Weekday trade depends heavily on business type; weekend trade is exceptional.',
  },
  {
    question: 'What businesses thrive on King Street?',
    answer: 'Vegan/plant-based concepts, natural wine bars, specialty retail, and niche restaurants all thrive. Coffee/generic cafes are saturated. Businesses must have genuine differentiation. The community actively supports ethical/sustainable positioning. Premium pricing is viable for concepts aligned with Newtown values (ethical sourcing, plant-based, environmentally conscious).',
  },
  {
    question: 'Is Enmore Road worth considering?',
    answer: 'Yes. Enmore Road is the emerging alternative to King Street saturation, with lower rents ($4,000-$6,500/mo) and growing foot traffic. It lacks the density of King Street but rents are 30-40% lower and competition is less intense. Best for concepts that do not need peak density - specialty retail, small restaurants, niche services.',
  },
  {
    question: 'Why do chains fail in Newtown?',
    answer: 'Community actively rejects chains in favor of independent operators. Newtown residents actively seek locally-owned, ethical, and specialized concepts. Chain concepts are perceived as inauthentic and directly lose customers to independent alternatives. This is not just preference - it is active resistance. Only exceptional chains with strong positioning survive.',
  },
  {
    question: 'How does Newtown compare to Marrickville?',
    answer: 'Newtown scores 81 (GO), Marrickville scores 80 (GO). Newtown has higher foot traffic on King Street and stronger destination appeal. Marrickville has emerging cache and lower rents. Both have strong indie/community culture. Newtown favors vegan/natural wine/student-facing concepts; Marrickville favors emerging retail/arts/mixed-use concepts.',
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
  title: 'Newtown Business Analysis: Score 81, GO Verdict | Locatalyze',
  description: 'Deep analysis of Newtown for cafe, restaurant, and retail. Score 81 (GO). King Street saturation but niche concepts thrive. Vegan/natural wine strong. $68K median income.',
  alternates: {
    canonical: 'https://locatalyze.com/analyse/sydney/newtown',
  },
  openGraph: {
    title: 'Newtown Business Analysis: Score 81, GO',
    description: 'King Street saturation (70+ cafes) but demand genuine from students and destination visitors. Niche concepts thrive. Vegan market strongest of any Sydney suburb.',
    type: 'article',
    url: 'https://locatalyze.com/analyse/sydney/newtown',
  },
}

export default function NewtownPage() {
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
          {' > Newtown'}
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
            Location Guides &gt; Sydney &gt; Newtown
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <h1 style={{ fontSize: '36px', fontWeight: '700', margin: 0 }}>Newtown</h1>
            <span style={{ fontSize: '48px', fontWeight: '700' }}>81</span>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <RiskBadge risk="GO" />
          </div>
          <p style={{ fontSize: '16px', lineHeight: '1.6', opacity: 0.95, margin: 0, marginBottom: '8px' }}>
            King Street is one of Sydney's most saturated hospitality strips with 70+ cafes, but demand is genuine from USyd students, inner-west residents, and destination visitors. Independent culture is strong - community actively rejects chains. Vegan/plant-based market is the strongest proportionally of any Sydney suburb. Niche concepts thrive.
          </p>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>
            Postcode: NSW 2042
          </div>
        </div>
      </section>

      <section style={{ padding: '32px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: C.muted, marginBottom: '4px' }}>Median HH Income</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: C.n900 }}>$68,000</div>
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: C.muted, marginBottom: '4px' }}>Population</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: C.n900 }}>12,000</div>
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: C.muted, marginBottom: '4px' }}>Competition</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: C.n900 }}>Very High</div>
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: C.muted, marginBottom: '4px' }}>Trading Hours</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: C.n900 }}>8am-10pm daily</div>
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
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: C.brand, marginBottom: '8px', margin: 0 }}>King St Prime</h3>
              <p style={{ fontSize: '16px', fontWeight: '700', color: C.n900, margin: 0 }}>$6,000-$9,500/mo</p>
              <p style={{ fontSize: '12px', color: C.muted, margin: 0, marginTop: '4px' }}>Ground floor, peak density</p>
            </div>
            <div style={{ padding: '16px', backgroundColor: C.white, borderRadius: '8px', border: `1px solid ${C.border}` }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: C.brand, marginBottom: '8px', margin: 0 }}>King St Secondary</h3>
              <p style={{ fontSize: '16px', fontWeight: '700', color: C.n900, margin: 0 }}>$4,500-$7,000/mo</p>
              <p style={{ fontSize: '12px', color: C.muted, margin: 0, marginTop: '4px' }}>Above ground, side streets</p>
            </div>
            <div style={{ padding: '16px', backgroundColor: C.white, borderRadius: '8px', border: `1px solid ${C.border}` }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: C.brand, marginBottom: '8px', margin: 0 }}>Enmore Road</h3>
              <p style={{ fontSize: '16px', fontWeight: '700', color: C.n900, margin: 0 }}>$4,000-$6,500/mo</p>
              <p style={{ fontSize: '12px', color: C.muted, margin: 0, marginTop: '4px' }}>Emerging alternative strip</p>
            </div>
            <div style={{ padding: '16px', backgroundColor: C.white, borderRadius: '8px', border: `1px solid ${C.border}` }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: C.brand, marginBottom: '8px', margin: 0 }}>Off-Strip/Above Ground</h3>
              <p style={{ fontSize: '16px', fontWeight: '700', color: C.n900, margin: 0 }}>$2,500-$4,500/mo</p>
              <p style={{ fontSize: '12px', color: C.muted, margin: 0, marginTop: '4px' }}>Lower foot traffic</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: C.n900 }}>
            Business Scores
          </h2>
          <ScoreBar label="Foot Traffic" value={84} />
          <ScoreBar label="Area Demographics" value={72} />
          <ScoreBar label="Rent Viability" value={78} />
          <ScoreBar label="Competition Gap" value={58} />
          <ScoreBar label="Accessibility" value={86} />
        </div>
      </section>

      <section style={{ padding: '48px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: C.n900 }}>
            Market Fundamentals
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', fontSize: '16px', lineHeight: '1.7', color: C.n900 }}>
            <p>
              King Street is one of Sydney's most saturated hospitality strips with 70+ cafes serving 12,000 residents. This saturation level appears prohibitive but demand is genuine and proportionate. Customer base includes USyd students (foot traffic driver), inner-west residents (high dining-out frequency), and destination visitors (specialty/indie appeal draws from across Sydney). Unlike pure saturation, Newtown has structural demand drivers that justify the venue density. The key is that generic concepts fail but niche concepts thrive in this environment.
            </p>
            <p>
              Newtown's resident demographic is younger (median age 28, median household income $68,000) than Surry Hills and more price-sensitive for mass-market positioning. However, the community actively seeks and supports ethical, independent, and specialized concepts. This creates a paradox: low median income but willingness to pay premium prices for vegan, natural wine, or specialty retail concepts aligned with community values. Price sensitivity applies to generic/chain positioning but not to niche/ethical concepts. Community rejects chains actively - chain operators report losing customers to independent alternatives.
            </p>
            <p>
              King Street saturation is real and specific to coffee and generic cafe concepts. Natural wine, vegan/plant-based, and specialty retail remain underserved relative to demand. Vegan/plant-based market is proportionally the strongest of any Sydney suburb - residents actively seek vegan dining options. A vegan restaurant on King Street can sustain premium pricing ($16-22 per cover) with the right execution. This niche is not saturated; general cafes are. Independent culture means community actively supports vegan, sustainability-focused, and locally-owned concepts.
            </p>
            <p>
              Weekend trade is exceptional - Saturday and Sunday foot traffic is as strong as weekday during peak term. Weekday trade depends heavily on business type. Coffee cafes are strong Monday-Friday (student traffic). Restaurants and retail depend on dinner/evening and weekend shopping. No business calendar dependency like some suburbs - Newtown has consistent foot traffic across full year including university holidays (community residents + tourists sustain traffic). Evening trade is strong Thursday-Saturday at restaurants and bars.
            </p>
            <p>
              Enmore Road is the emerging alternative to King Street saturation. While King Street has 70+ cafes, Enmore Road has stronger growth, lower rents ($4,000-$6,500/mo vs $6,000-$9,500/mo), and less competitor density. Foot traffic is lower than King Street but still substantial. Best for concepts that do not require peak foot traffic density - specialty retail, small restaurants, niche services benefit from lower rent and lower competition intensity. Community actively supports emerging strips that feel authentic.
            </p>
            <p>
              Rent viability score of 78 is strong - Newtown rents are sustainable for most food/retail concepts if foot traffic converts. Median income of $68K requires price discipline for restaurant concepts. Mass-market positioning targeting $80+ covers fails; niche positioning at $16-22 covers succeeds. Business model fundamentals matter more than location - a vegan cafe at $6,500/mo rent needs 120-150 covers/day at $12-16 spend to break even, which King Street supplies. A generic cafe at same location and rent needs 180+ covers/day - achievable but harder and requires differentiation.
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
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.n900, marginBottom: '8px' }}>Vegan/Plant-Based Restaurant</h3>
              <div style={{ marginBottom: '12px' }}>
                <RiskBadge risk="GO" />
              </div>
              <div style={{ fontSize: '13px', color: C.muted, lineHeight: '1.6', marginBottom: '8px' }}>
                <div style={{ marginBottom: '4px' }}>Rent: $6,000-$9,500/mo</div>
                <div style={{ marginBottom: '4px' }}>Revenue: $28,000-$48,000/mo</div>
                <div style={{ marginBottom: '4px' }}>Break-even: 6-9 months</div>
              </div>
              <p style={{ fontSize: '12px', color: C.muted, margin: 0 }}>Strongest niche proportionally in Newtown. Community actively supports plant-based concepts. Premium pricing viable.</p>
            </div>
            <div style={{ padding: '16px', backgroundColor: C.white, borderRadius: '8px', border: `1px solid ${C.border}` }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.n900, marginBottom: '8px' }}>Natural Wine Bar</h3>
              <div style={{ marginBottom: '12px' }}>
                <RiskBadge risk="GO" />
              </div>
              <div style={{ fontSize: '13px', color: C.muted, lineHeight: '1.6', marginBottom: '8px' }}>
                <div style={{ marginBottom: '4px' }}>Rent: $4,500-$7,000/mo</div>
                <div style={{ marginBottom: '4px' }}>Revenue: $25,000-$40,000/mo</div>
                <div style={{ marginBottom: '4px' }}>Break-even: 5-8 months</div>
              </div>
              <p style={{ fontSize: '12px', color: C.muted, margin: 0 }}>Underserved relative to community appetite. Independent/ethical positioning aligns with Newtown values.</p>
            </div>
            <div style={{ padding: '16px', backgroundColor: C.white, borderRadius: '8px', border: `1px solid ${C.border}` }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.n900, marginBottom: '8px' }}>Specialty/Niche Retail</h3>
              <div style={{ marginBottom: '12px' }}>
                <RiskBadge risk="GO" />
              </div>
              <div style={{ fontSize: '13px', color: C.muted, lineHeight: '1.6', marginBottom: '8px' }}>
                <div style={{ marginBottom: '4px' }}>Rent: $4,000-$6,500/mo</div>
                <div style={{ marginBottom: '4px' }}>Revenue: $15,000-$28,000/mo</div>
                <div style={{ marginBottom: '4px' }}>Break-even: 4-7 months</div>
              </div>
              <p style={{ fontSize: '12px', color: C.muted, margin: 0 }}>Bookstores, vintage, specialty goods. Community actively seeks independent retail aligned with values.</p>
            </div>
            <div style={{ padding: '16px', backgroundColor: C.white, borderRadius: '8px', border: `1px solid ${C.border}` }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.n900, marginBottom: '8px' }}>Allied Health/Psychology Practice</h3>
              <div style={{ marginBottom: '12px' }}>
                <RiskBadge risk="GO" />
              </div>
              <div style={{ fontSize: '13px', color: C.muted, lineHeight: '1.6', marginBottom: '8px' }}>
                <div style={{ marginBottom: '4px' }}>Rent: $3,000-$5,500/mo</div>
                <div style={{ marginBottom: '4px' }}>Revenue: $18,000-$35,000/mo</div>
                <div style={{ marginBottom: '4px' }}>Break-even: 3-5 months</div>
              </div>
              <p style={{ fontSize: '12px', color: C.muted, margin: 0 }}>Young demographic seeks wellness services. Newtown has high health-consciousness aligned with values.</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: C.n900 }}>
            Who Should NOT Open Here
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '16px', backgroundColor: C.white, borderRadius: '8px', border: `3px solid ${C.red}`, borderTop: `4px solid ${C.red}` }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.red, marginBottom: '8px', margin: 0 }}>Generic Cafe Without Differentiation</h3>
              <p style={{ fontSize: '13px', color: C.muted, margin: 0 }}>King Street has 70+ cafes. Generic positioning will lose customers to niche alternatives.</p>
            </div>
            <div style={{ padding: '16px', backgroundColor: C.white, borderRadius: '8px', border: `3px solid ${C.red}`, borderTop: `4px solid ${C.red}` }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.red, marginBottom: '8px', margin: 0 }}>Mass-Market Chains</h3>
              <p style={{ fontSize: '13px', color: C.muted, margin: 0 }}>Community actively rejects chains. Newtown residents choose independent alternatives intentionally.</p>
            </div>
            <div style={{ padding: '16px', backgroundColor: C.white, borderRadius: '8px', border: `3px solid ${C.red}`, borderTop: `4px solid ${C.red}` }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.red, marginBottom: '8px', margin: 0 }}>Premium Dining with $80+ Covers</h3>
              <p style={{ fontSize: '13px', color: C.muted, margin: 0 }}>Median income $68K. Premium fine dining targets wrong income level.</p>
            </div>
            <div style={{ padding: '16px', backgroundColor: C.white, borderRadius: '8px', border: `3px solid ${C.red}`, borderTop: `4px solid ${C.red}` }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.red, marginBottom: '8px', margin: 0 }}>Parking-Dependent Businesses</h3>
              <p style={{ fontSize: '13px', color: C.muted, margin: 0 }}>Newtown has almost no parking. Parking-dependent models fail.</p>
            </div>
            <div style={{ padding: '16px', backgroundColor: C.white, borderRadius: '8px', border: `3px solid ${C.red}`, borderTop: `4px solid ${C.red}` }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.red, marginBottom: '8px', margin: 0 }}>Unethical/Unsustainable Models</h3>
              <p style={{ fontSize: '13px', color: C.muted, margin: 0 }}>Community actively supports ethical positioning. Unsustainable models lose customers to alternatives.</p>
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
              Vegan Fast-Casual Concept, King Street
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '600', color: C.muted, marginBottom: '4px' }}>Setup</div>
                <div style={{ fontSize: '14px', color: C.n900 }}>Counter-service, quick casual</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '600', color: C.muted, marginBottom: '4px' }}>Average Spend</div>
                <div style={{ fontSize: '14px', color: C.n900 }}>$16</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '600', color: C.muted, marginBottom: '4px' }}>Monthly Rent</div>
                <div style={{ fontSize: '14px', color: C.n900 }}>$7,500</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '600', color: C.muted, marginBottom: '4px' }}>Covers Needed/Day</div>
                <div style={{ fontSize: '14px', color: C.n900 }}>180</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '600', color: C.muted, marginBottom: '4px' }}>Monthly Revenue Target</div>
                <div style={{ fontSize: '14px', color: C.n900 }}>$82,000</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '600', color: C.muted, marginBottom: '4px' }}>Break-Even</div>
                <div style={{ fontSize: '14px', color: C.n900 }}>5-7 months</div>
              </div>
            </div>
          </div>
          <p style={{ fontSize: '14px', color: C.muted, lineHeight: '1.6', margin: 0 }}>
            180 covers per day requires strong execution and community buzz. However, vegan positioning on King Street has genuine community support. Premium pricing ($16+ per cover) is viable for ethical positioning. Requires excellent product and community-aligned values. Generic vegan fast-casual fails; concept-led vegan fast-casual succeeds.
          </p>
        </div>
      </section>

      <section style={{ padding: '48px 24px', backgroundColor: C.n900, color: C.white }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '12px' }}>
            Ready to open in Newtown?
          </h2>
          <p style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '24px', opacity: 0.95 }}>
            Get foot traffic data, demographic breakdown, and competitor mapping for King Street, Enmore Road, or secondary locations.
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
              href="/analyse/sydney/surry-hills"
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
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: C.n900, margin: 0 }}>Surry Hills</h3>
                <span style={{ fontSize: '18px', fontWeight: '700', color: C.brand }}>87</span>
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
              href="/analyse/sydney/enmore"
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
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: C.n900, margin: 0 }}>Enmore</h3>
                <span style={{ fontSize: '18px', fontWeight: '700', color: C.brand }}>76</span>
              </div>
              <div>
                <RiskBadge risk="GO" />
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
          <Link href="/analyse/sydney/surry-hills" style={{ color: C.brand, textDecoration: 'none', fontWeight: '600' }}>
            Surry Hills Analysis
          </Link>
          <Link href="/analyse/sydney/marrickville" style={{ color: C.brand, textDecoration: 'none', fontWeight: '600' }}>
            Marrickville Analysis
          </Link>
        </div>
      </section>
    </>
  )
}
