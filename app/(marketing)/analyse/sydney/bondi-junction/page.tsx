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

function RiskBadge() {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: '600',
        backgroundColor: C.emeraldBg,
        color: C.emerald,
        border: `1px solid ${C.emerald}`,
      }}
    >
      HIGH FOOT TRAFFIC
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

function FAQSection({ faqs }: { faqs: Array<{ q: string; a: string }> }) {
  return (
    <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h2 id="faq" style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: C.n900 }}>
          Frequently Asked Questions
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
          {faqs.map((item, idx) => (
            <div key={idx} style={{ padding: '16px', backgroundColor: C.white, borderRadius: '8px', border: `1px solid ${C.border}` }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.n900, marginBottom: '8px' }}>{item.q}</h3>
              <p style={{ fontSize: '14px', color: C.muted, lineHeight: '1.6', margin: 0 }}>{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export const metadata: Metadata = {
  title: 'Bondi Junction Business Analysis: Eastern Suburbs Transport Hub',
  description: 'Deep analysis of Bondi Junction for health, wellness, and premium retail. Foot traffic analysis, rent economics, demographics, and market opportunities for eastern suburbs.',
  alternates: {
    canonical: 'https://locatalyze.com/analyse/sydney/bondi-junction',
  },
  openGraph: {
    title: 'Bondi Junction Business Analysis',
    description: 'Eastern suburbs transport mega-hub with premium demographics and high foot traffic.',
    type: 'article',
  },
}

const FAQS = [
  {
    q: 'Is Bondi Junction good for a business?',
    a: 'Bondi Junction scores 83 and is rated GO for the right concepts. It is Sydney\'s eastern suburbs transport mega-hub with 15,000+ daily foot traffic from the train station and Westfield. Premium demographics ($88K median income), health-conscious, brand-aware customers dominate. The main challenge is rent — Westfield-adjacent Oxford Street positions command $15,000-$18,000/month. Non-Westfield positions on Grafton/Spring streets offer more viable economics at $6,000-$9,000/month. Success depends heavily on location within the suburb.',
  },
  {
    q: 'How does Westfield affect nearby businesses?',
    a: 'Westfield Bondi Junction ($600M annual turnover) is a double-edged sword. It generates massive foot traffic spillover that benefits surrounding streets, especially Oxford Street between the station and the mall. However, it also cannibalizes retail and food court revenue from nearby competitors. Businesses directly competing with Westfield food court or retail anchors fail. Businesses positioned as destination concepts that justify a trip (premium health studios, specialty salons, allied health) thrive on the spillover traffic.',
  },
  {
    q: 'What are the best streets in Bondi Junction?',
    a: 'Oxford Street between Bondi Junction Station and Westfield is the highest foot traffic strip — expect 18,000+ daily pedestrians but $15,000-$18,000/month rent. Grafton Street and Spring Street offer the rent-to-foot-traffic sweet spot: 8,000+ daily pedestrians, $6,000-$9,000/month rent, and healthier unit economics for health, wellness, and beauty concepts. First-floor and above-ground positions drop 40-50% in foot traffic but rent at $4,000-$7,000/month.',
  },
  {
    q: 'What health and wellness opportunities exist in Bondi Junction?',
    a: 'Bondi Junction\'s proximity to Bondi Beach combined with high income demographics creates exceptional demand for health/wellness. Premium pilates, yoga, and fitness studios perform exceptionally well at $30K-$55K/month revenue. Physiotherapy and allied health clinics capture the fitness demographic and charge premium rates. Beauty/skincare salons targeting the health-conscious demographic also excel. These are the only business categories that justify $12K+/month rent on premium streets.',
  },
  {
    q: 'How do Bondi Junction rents compare to Sydney CBD?',
    a: 'Bondi Junction Oxford Street premium positions ($15K-$18K/month) are 15-20% cheaper than Sydney CBD ($18K-$22K/month) despite comparable foot traffic numbers. However, rents remain significantly higher than western suburbs. Grafton/Spring street positions ($6K-$9K/month) are 50-60% cheaper than CBD while maintaining 60-70% of CBD foot traffic, making them excellent value for health/wellness concepts.',
  },
  {
    q: 'What business types thrive vs struggle in Bondi Junction?',
    a: 'Thrive: Premium health/wellness (pilates, yoga, gym), specialty beauty (hair, skincare), premium café (destination concept, not convenience), allied health (physio, therapy). Struggle: Convenience food competing with Westfield food court, budget retail competing with Westfield anchors, generic concepts without digital presence. The suburb rewards differentiation and punishes commoditization. Operators must offer something compelling enough to justify the rent or choose lower-rent secondary streets.',
  },
]

const schema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  })),
}

export default function BondiJunctionPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600', color: C.muted }}>
          <Link href="/analyse" style={{ color: C.brand, textDecoration: 'none', fontWeight: '600' }}>
            Analyse
          </Link>
          <span style={{ color: C.border }}>&gt;</span>
          <Link href="/analyse/sydney" style={{ color: C.brand, textDecoration: 'none', fontWeight: '600' }}>
            Sydney
          </Link>
          <span style={{ color: C.border }}>&gt;</span>
          <span style={{ color: C.n900 }}>Bondi Junction</span>
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
            Location Guides &gt; Sydney &gt; Bondi Junction
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '16px' }}>
            <div>
              <h1 style={{ fontSize: '48px', fontWeight: '700', margin: 0, lineHeight: 1 }}>Bondi Junction</h1>
              <p style={{ fontSize: '16px', marginTop: '8px', opacity: 0.95, margin: 0 }}>NSW 2022</p>
            </div>
            <div style={{ textAlign: 'center', padding: '16px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
              <div style={{ fontSize: '56px', fontWeight: '700', lineHeight: 1 }}>83</div>
              <div style={{ fontSize: '12px', marginTop: '8px', opacity: 0.9 }}>Business Score</div>
            </div>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <VerdictBadge v="GO" />
          </div>
          <p style={{ fontSize: '16px', lineHeight: '1.6', opacity: 0.95, margin: 0, maxWidth: '700px' }}>
            Bondi Junction is Sydney's eastern suburbs transport mega-hub with exceptional foot traffic from the train station and Westfield. Premium demographics, health-conscious customers, and brand-aware spending make this a prime location for wellness and premium retail. The primary challenge is rent volatility depending on proximity to Westfield. Non-Westfield positions on secondary streets offer compelling economics for the right concepts. Premium health studios, specialty beauty salons, and destination cafés thrive here. This is not a location for convenience concepts — it's a location for premium positioning and differentiation.
          </p>
        </div>
      </section>

      <section style={{ padding: '32px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ padding: '20px', borderRadius: '8px', border: `1px solid ${C.emerald}`, backgroundColor: C.emeraldBg }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: C.emerald, marginBottom: '8px', margin: 0 }}>
              Quick Verdict
            </h3>
            <p style={{ fontSize: '14px', color: C.n900, lineHeight: '1.6', margin: 0 }}>
              Bondi Junction is a GO for premium health, wellness, and beauty concepts targeting affluent, health-conscious demographics. Oxford Street positions command $12,000-$18,000/month but generate 18,000+ daily foot traffic. Grafton and Spring streets offer $6,000-$9,000/month rent with 8,000+ daily pedestrians and superior unit economics for health/wellness. This is a location where premium positioning justifies rent and where convenience concepts fail. The eastern suburbs fitness culture and Bondi Beach proximity create natural demand for pilates, yoga, physiotherapy, and wellness studios.
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: C.n900 }}>
            Business Scores
          </h2>
          <ScoreBar label="Foot Traffic" value={86} />
          <ScoreBar label="Area Demographics" value={87} />
          <ScoreBar label="Rent Viability" value={65} />
          <ScoreBar label="Competition Gap" value={68} />
          <ScoreBar label="Accessibility" value={91} />
        </div>
      </section>

      <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: C.n900 }}>
            Rent Tiers by Location
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '16px', backgroundColor: C.white, borderRadius: '8px', border: `1px solid ${C.border}` }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: C.n900, marginBottom: '8px' }}>Oxford St / Westfield Proximity</h3>
              <p style={{ fontSize: '20px', fontWeight: '700', color: C.brand, margin: 0 }}>$12K - $18K/mo</p>
              <p style={{ fontSize: '12px', color: C.muted, marginTop: '4px', margin: 0 }}>Premium foot traffic, highest market rent</p>
            </div>
            <div style={{ padding: '16px', backgroundColor: C.white, borderRadius: '8px', border: `1px solid ${C.border}` }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: C.n900, marginBottom: '8px' }}>Oxford St Secondary</h3>
              <p style={{ fontSize: '20px', fontWeight: '700', color: C.brand, margin: 0 }}>$8K - $12K/mo</p>
              <p style={{ fontSize: '12px', color: C.muted, marginTop: '4px', margin: 0 }}>Strong foot traffic, moderate rent</p>
            </div>
            <div style={{ padding: '16px', backgroundColor: C.white, borderRadius: '8px', border: `1px solid ${C.border}` }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: C.n900, marginBottom: '8px' }}>Grafton St / Spring St</h3>
              <p style={{ fontSize: '20px', fontWeight: '700', color: C.brand, margin: 0 }}>$6K - $9K/mo</p>
              <p style={{ fontSize: '12px', color: C.muted, marginTop: '4px', margin: 0 }}>Sweet spot for wellness concepts</p>
            </div>
            <div style={{ padding: '16px', backgroundColor: C.white, borderRadius: '8px', border: `1px solid ${C.border}` }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: C.n900, marginBottom: '8px' }}>First Floor / Above-Ground</h3>
              <p style={{ fontSize: '20px', fontWeight: '700', color: C.brand, margin: 0 }}>$4K - $7K/mo</p>
              <p style={{ fontSize: '12px', color: C.muted, marginTop: '4px', margin: 0 }}>Lower foot traffic, budget-friendly</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: C.n900 }}>
            Transport and Foot Traffic
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', fontSize: '16px', lineHeight: '1.7', color: C.n900 }}>
            <p>
              Bondi Junction Station is the eastern suburbs transport mega-hub. The train network services the entire eastern suburbs corridor from Bondi Beach to Manly to Coogee, creating exceptional daily commuter and leisure footfall. Oxford Street between the station and Westfield is one of Sydney's highest pedestrian count strips — expect 18,000+ daily pedestrians during trading hours. This foot traffic is genuine and measurable, not aspirational. The station generates consistent baseline traffic across all hours of operation. Westfield Bondi Junction ($600M annual turnover) is one of Sydney's largest shopping centres and drives significant retail intensity across the surrounding precinct.
            </p>
            <p>
              However, proximity to Westfield is a double-edged sword. Direct adjacency to the mall (Oxford Street positions) generates spillover traffic but also cannibalizes retail and food court revenue. Businesses positioned as convenience food competitors to the Westfield food court fail consistently. Businesses positioned as destination concepts that justify a separate journey thrive on the spillover. The foot traffic advantage is substantial, but only if your concept differentiates from what Westfield already offers. Secondary streets (Grafton, Spring) capture 60-70% of Oxford Street foot traffic numbers with significantly lower rent.
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: C.n900 }}>
            Demographics and Spending Power
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', fontSize: '16px', lineHeight: '1.7', color: C.n900 }}>
            <p>
              Bondi Junction's working population has a median household income of $88,000 with a population of 11,500. The demographic profile is affluent, health-conscious, brand-aware, and strongly oriented toward wellness and fitness. The proximity to Bondi Beach means the customer base is disproportionately interested in fitness, yoga, pilates, and health. This demographic trades 7 days a week from 8am to 9pm, with strong Sunday trade. Weekend foot traffic often exceeds weekday volumes due to leisure travel to Bondi Beach and local shopping. The demographic is quality-sensitive and willing to pay premium prices for exceptional products and experiences.
            </p>
            <p>
              Consumer spending here is skewed toward experiences and premium services rather than budget retail. Health and wellness spending is above-average. Beauty and personal care spending is above-average. Food spending is concentrated in premium and specialty categories, not convenience. Generic, budget-oriented concepts underperform significantly because the demographic has higher disposable income and expects quality. Conversely, premium positioning, superior execution, and authentic expertise command significant pricing power. The customer base is digitally savvy and discovers businesses through Instagram, Google, and referral rather than foot traffic alone.
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: C.n900 }}>
            Competition Dynamics
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', fontSize: '16px', lineHeight: '1.7', color: C.n900 }}>
            <p>
              Competition in Bondi Junction is high across all categories but segmented by location and positioning. Westfield dominates retail and food court, but direct street-level competition is manageable for concepts that don't overlap with mall offerings. Health and wellness studios are concentrated on Grafton and Spring streets with 4-6 major competitors per category (pilates, yoga, gym). However, the demographic is large enough to support multiple high-quality competitors. The key insight: competition is fierce for convenience and generic positioning, but protected markets exist for specialized concepts. A premium pilates studio positions against 3-4 other pilates studios. A generic boutique gym competes with 20+ gyms across the eastern suburbs.
            </p>
            <p>
              The eastern suburbs fitness culture creates genuine demand exceeding local supply for specialized wellness categories. New pilates studios, yoga studios focused on specific populations (prenatal, post-natal, older adults), and allied health clinics continue to open and succeed. The competition gap is highest in specialized health categories. The competition gap is lowest in convenience food and budget retail. Operators who can own a specific demographic niche (women's fitness, prenatal wellness, premium beauty) capture protected market positions. Operators who are trying to be everything to everyone compete in an overcrowded market.
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: C.n900 }}>
            Health and Wellness Positioning
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', fontSize: '16px', lineHeight: '1.7', color: C.n900 }}>
            <p>
              Bondi Junction's proximity to Bondi Beach combined with affluent, health-conscious demographics makes this Sydney's premier location for health and wellness concepts. The fitness culture is deeply embedded in the local identity. Premium pilates, yoga, and fitness studios command $32-$55/class pricing and achieve 90%+ capacity utilization. Physiotherapy and allied health clinics generate $22K-$38K/month revenue with premium pricing power due to the health-conscious demographic. Beauty and skincare salons targeting wellness positioning (organic, holistic, premium) thrive at $25K-$42K/month revenue.
            </p>
            <p>
              The demographic actively seeks wellness expertise and is willing to pay premium pricing for differentiation and quality. A specialized pilates studio (women's fitness, post-natal recovery, athletic performance) succeeds where a generic gym struggles. An allied health clinic positioned toward sports injury recovery and prevention captures the athletic demographic. A beauty salon positioned toward natural skincare and holistic wellness attracts the health-conscious customer. The eastern suburbs fitness culture rewards specialization and expertise. Generic health and wellness concepts underperform; specialized positioning wins market share.
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: C.n900 }}>
            Best Business Models for Bondi Junction
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '16px', backgroundColor: C.white, borderRadius: '8px', border: `1px solid ${C.border}` }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.n900, marginBottom: '8px' }}>Premium Health/Wellness Studio</h3>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', color: C.muted, marginBottom: '4px' }}>Verdict</div>
                <VerdictBadge v="GO" />
              </div>
              <div style={{ fontSize: '13px', color: C.muted, lineHeight: '1.5' }}>
                <div style={{ marginBottom: '6px' }}><strong>Monthly Revenue:</strong> $30K - $55K</div>
                <div style={{ marginBottom: '6px' }}><strong>Break-even:</strong> 6-9 months</div>
                <div><strong>Location:</strong> Spring St, Grafton St</div>
              </div>
            </div>
            <div style={{ padding: '16px', backgroundColor: C.white, borderRadius: '8px', border: `1px solid ${C.border}` }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.n900, marginBottom: '8px' }}>Specialty Beauty/Hair Salon</h3>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', color: C.muted, marginBottom: '4px' }}>Verdict</div>
                <VerdictBadge v="GO" />
              </div>
              <div style={{ fontSize: '13px', color: C.muted, lineHeight: '1.5' }}>
                <div style={{ marginBottom: '6px' }}><strong>Monthly Revenue:</strong> $25K - $42K</div>
                <div style={{ marginBottom: '6px' }}><strong>Break-even:</strong> 6-9 months</div>
                <div><strong>Location:</strong> Secondary Oxford St, Grafton St</div>
              </div>
            </div>
            <div style={{ padding: '16px', backgroundColor: C.white, borderRadius: '8px', border: `1px solid ${C.border}` }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.n900, marginBottom: '8px' }}>Destination Café</h3>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', color: C.muted, marginBottom: '4px' }}>Verdict</div>
                <VerdictBadge v="GO" />
              </div>
              <div style={{ fontSize: '13px', color: C.muted, lineHeight: '1.5' }}>
                <div style={{ marginBottom: '6px' }}><strong>Monthly Revenue:</strong> $28K - $45K</div>
                <div style={{ marginBottom: '6px' }}><strong>Break-even:</strong> 8-12 months</div>
                <div><strong>Location:</strong> Non-Westfield, specialty positioning</div>
              </div>
            </div>
            <div style={{ padding: '16px', backgroundColor: C.white, borderRadius: '8px', border: `1px solid ${C.border}` }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.n900, marginBottom: '8px' }}>Allied Health/Physiotherapy</h3>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', color: C.muted, marginBottom: '4px' }}>Verdict</div>
                <VerdictBadge v="GO" />
              </div>
              <div style={{ fontSize: '13px', color: C.muted, lineHeight: '1.5' }}>
                <div style={{ marginBottom: '6px' }}><strong>Monthly Revenue:</strong> $22K - $38K</div>
                <div style={{ marginBottom: '6px' }}><strong>Break-even:</strong> 6-8 months</div>
                <div><strong>Location:</strong> Spring St, secondary streets</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: C.n900 }}>
            Who Should NOT Open in Bondi Junction
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
            <div style={{ padding: '16px', backgroundColor: C.white, borderRadius: '8px', border: `2px solid ${C.red}`, borderTopWidth: '4px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.red, marginBottom: '6px' }}>Convenience Food Competing with Westfield</h3>
              <p style={{ fontSize: '14px', color: C.muted, margin: 0 }}>
                The Westfield food court is dominant. Generic pizza, burger, or sandwich concepts fail consistently against established mall operators and delivery aggregators.
              </p>
            </div>
            <div style={{ padding: '16px', backgroundColor: C.white, borderRadius: '8px', border: `2px solid ${C.red}`, borderTopWidth: '4px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.red, marginBottom: '6px' }}>Budget Retail Competing with Westfield Anchors</h3>
              <p style={{ fontSize: '14px', color: C.muted, margin: 0 }}>
                Westfield anchors (Kmart, Target, Mecca, specialty retail) dominate. Street-level budget retail is unwinnable.
              </p>
            </div>
            <div style={{ padding: '16px', backgroundColor: C.white, borderRadius: '8px', border: `2px solid ${C.red}`, borderTopWidth: '4px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.red, marginBottom: '6px' }}>Businesses Without Strong Digital Presence</h3>
              <p style={{ fontSize: '14px', color: C.muted, margin: 0 }}>
                This demographic discovers businesses online. No Instagram, weak Google presence, no online booking — you're invisible to the local customer.
              </p>
            </div>
            <div style={{ padding: '16px', backgroundColor: C.white, borderRadius: '8px', border: `2px solid ${C.red}`, borderTopWidth: '4px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.red, marginBottom: '6px' }}>Operators Who Cannot Afford $12K+ Rent</h3>
              <p style={{ fontSize: '14px', color: C.muted, margin: 0 }}>
                Oxford Street premium positions demand $12K-$18K/month rent. Unit economics must support this. If your model can't, choose Grafton/Spring streets or different suburbs.
              </p>
            </div>
            <div style={{ padding: '16px', backgroundColor: C.white, borderRadius: '8px', border: `2px solid ${C.red}`, borderTopWidth: '4px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.red, marginBottom: '6px' }}>Generic, Undifferentiated Concepts</h3>
              <p style={{ fontSize: '14px', color: C.muted, margin: 0 }}>
                The demographic is quality-sensitive and has high expectations. Generic or below-standard products fail faster here than in less discerning markets.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: C.n900 }}>
            Case Scenario: Premium Pilates/Yoga Studio
          </h2>
          <div style={{ padding: '24px', backgroundColor: C.emeraldBg, borderRadius: '8px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: C.emerald, marginBottom: '16px' }}>Concept Overview</h3>
            <p style={{ fontSize: '14px', color: C.n900, lineHeight: '1.6', margin: 0 }}>
              Premium pilates and yoga studio targeting women (18-50 years old) in the eastern suburbs health and fitness demographic. Spring Street position, 900 sqft, 12 reformer machines + mat area, class-based revenue model.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div style={{ padding: '16px', backgroundColor: C.n50, borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', color: C.muted, marginBottom: '4px' }}>Monthly Rent</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: C.brand }}>$8,500</div>
              <div style={{ fontSize: '12px', color: C.muted, marginTop: '4px' }}>Spring St position</div>
            </div>
            <div style={{ padding: '16px', backgroundColor: C.n50, borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', color: C.muted, marginBottom: '4px' }}>Avg Class Price</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: C.brand }}>$32</div>
              <div style={{ fontSize: '12px', color: C.muted, marginTop: '4px' }}>12-class monthly pack</div>
            </div>
            <div style={{ padding: '16px', backgroundColor: C.n50, borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', color: C.muted, marginBottom: '4px' }}>Classes Per Day</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: C.brand }}>12</div>
              <div style={{ fontSize: '12px', color: C.muted, marginTop: '4px' }}>6am-9pm schedule</div>
            </div>
            <div style={{ padding: '16px', backgroundColor: C.n50, borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', color: C.muted, marginBottom: '4px' }}>Break-even</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: C.emerald }}>6-9 months</div>
              <div style={{ fontSize: '12px', color: C.muted, marginTop: '4px' }}>At 60% capacity</div>
            </div>
          </div>
          <div style={{ backgroundColor: C.white, padding: '16px', borderRadius: '8px', border: `1px solid ${C.border}` }}>
            <h4 style={{ fontSize: '14px', fontWeight: '600', color: C.n900, marginBottom: '12px' }}>Key Assumptions</h4>
            <ul style={{ fontSize: '14px', color: C.muted, lineHeight: '1.7', margin: 0, paddingLeft: '20px' }}>
              <li>Average class size: 10-12 participants at 60% capacity utilization</li>
              <li>Revenue mix: 40% membership, 60% class pack and drop-in pricing</li>
              <li>Operating costs: Instructor wages ($4,500/month), retail support ($1,500/month), supplies/equipment ($800/month)</li>
              <li>Payback timeline assumes 6-9 month ramp to 60% capacity utilization</li>
              <li>Location advantage: Spring Street captures 70% of Oxford Street foot traffic at 40% of rent cost</li>
            </ul>
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 24px', backgroundColor: C.n900, color: C.white }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '12px', color: C.white }}>
            Analyse Your Bondi Junction Location
          </h2>
          <p style={{ fontSize: '16px', marginBottom: '24px', lineHeight: '1.6', opacity: 0.95 }}>
            Get suburb-specific demographic breakdown, foot traffic analysis, and rent benchmarks for your exact address. Understand your location's foot traffic patterns and competitive positioning.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
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
            <Link
              href="/analyse/sydney"
              style={{
                display: 'inline-block',
                padding: '12px 28px',
                backgroundColor: 'transparent',
                color: C.white,
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '600',
                border: `1px solid ${C.white}`,
              }}
            >
              Back to Sydney
            </Link>
          </div>
        </div>
      </section>

      <FAQSection faqs={FAQS} />

      <section style={{ padding: '48px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: C.n900 }}>
            Nearby Suburbs to Compare
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
            <Link
              href="/analyse/sydney/surry-hills"
              style={{
                padding: '16px',
                backgroundColor: C.white,
                borderRadius: '8px',
                border: `1px solid ${C.border}`,
                textDecoration: 'none',
                color: C.brand,
                fontWeight: '600',
                fontSize: '14px',
                textAlign: 'center',
              }}
            >
              Surry Hills (87 GO)
            </Link>
            <Link
              href="/analyse/sydney/marrickville"
              style={{
                padding: '16px',
                backgroundColor: C.white,
                borderRadius: '8px',
                border: `1px solid ${C.border}`,
                textDecoration: 'none',
                color: C.brand,
                fontWeight: '600',
                fontSize: '14px',
                textAlign: 'center',
              }}
            >
              Marrickville (80 GO)
            </Link>
            <Link
              href="/analyse/sydney/alexandria"
              style={{
                padding: '16px',
                backgroundColor: C.white,
                borderRadius: '8px',
                border: `1px solid ${C.border}`,
                textDecoration: 'none',
                color: C.brand,
                fontWeight: '600',
                fontSize: '14px',
                textAlign: 'center',
              }}
            >
              Alexandria (78 GO)
            </Link>
            <Link
              href="/analyse/sydney/ultimo"
              style={{
                padding: '16px',
                backgroundColor: C.white,
                borderRadius: '8px',
                border: `1px solid ${C.border}`,
                textDecoration: 'none',
                color: C.brand,
                fontWeight: '600',
                fontSize: '14px',
                textAlign: 'center',
              }}
            >
              Ultimo (68 CAUTION)
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
