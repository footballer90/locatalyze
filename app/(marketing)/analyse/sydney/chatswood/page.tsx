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
  title: 'Chatswood Business Analysis: North Shore Asian-Australian Hub',
  description: 'Deep analysis of Chatswood for restaurants, retail, and wellness businesses. East Asian demographic focus, food market competition, rent economics, and commercial opportunities.',
  alternates: {
    canonical: 'https://locatalyze.com/analyse/sydney/chatswood',
  },
  openGraph: {
    title: 'Chatswood Business Analysis',
    description: 'North Shore professional hub with exceptional demographics and Asian-Australian market concentration.',
    type: 'article',
  },
}

const FAQS = [
  {
    q: 'Is Chatswood good for an Asian restaurant?',
    a: 'Chatswood is an exceptional location for authentic Asian restaurants (ramen, hot pot, Korean BBQ, dumpling formats) but a graveyard for generic Western food. The demographic is 70%+ Asian-Australian professionals with precise culinary expectations and above-average spending. Authentic ramen restaurants achieve $35K-$65K/month revenue with premium pricing. Hot pot and Korean BBQ concepts exceed $40K/month. The barrier to entry is high: quality and authenticity are non-negotiable. Below-standard execution fails rapidly. Restaurants that serve the demographic excellently thrive; restaurants that try to be everything to everyone fail.',
  },
  {
    q: 'How saturated is the food market in Chatswood?',
    a: 'The food market is concentrated, not saturated. Major categories (ramen, hot pot, Korean BBQ, dumpling houses, dessert cafés) have 2-5 dominant players each. However, the demographic base is large (16,000 population, $96K median income) and food spending is above-average. New concepts enter regularly. The key insight: competition is category-specific. You compete with 3 other ramen restaurants, not with 30 restaurants. Categories like Korean-style dessert café, Japanese convenience food, and premium Korean skincare are completely underserved relative to demographic demand. The market is not saturated; it is concentrated around proven categories.',
  },
  {
    q: 'What is commercial rent in Chatswood?',
    a: 'Victoria Avenue (prime retail spine) rents $9,000-$14,000/month for 1,000-1,200 sqft. The Concourse shopping centre area is $8,000-$12,000/month. Anderson Street and Help Street (secondary streets) range $6,000-$9,000/month. First-floor and above-ground positions rent $4,000-$6,500/month. These rents are 30-40% below comparable Surry Hills locations but support comparable foot traffic due to demographic quality. A 1,200 sqft Victoria Avenue position at $10,500/month must generate $28+/cover average or $35K+/month minimum revenue. A secondary street position at $7,000/month is more achievable for food concepts.',
  },
  {
    q: 'Does Chatswood trade 7 days a week?',
    a: 'Yes, Chatswood is genuinely 7-day trading, which is rare for North Shore suburbs. Sunday trade is strong, not marginal. Foot traffic is driven by the Asian-Australian demographic, which treats Sunday as a major shopping and dining day. Weekday lunch rush is 12-1pm. Weekend foot traffic often exceeds weekday volumes. This makes Chatswood viable for weekend-focused concepts (yum cha, family dining, dessert cafés). Weeknight dining is lighter than inner-city suburbs but still strong Friday-Saturday.',
  },
  {
    q: 'How do I compete in Chatswood food market?',
    a: 'First, commit to the demographic. Your menu, service style, and marketing must be authentically aligned with Asian-Australian culinary standards, not Westernized approximations. Second, own a specific category rather than being generic. Third, build a strong social media presence in both English and Chinese-language platforms. Fourth, price for quality: premium pricing is accepted if product delivers. Fifth, invest in front-of-house staff who understand the culture. Sixth, be prepared for rapid feedback and adaptation. The demographic is discerning and will reward excellence and punish mediocrity immediately.',
  },
  {
    q: 'What non-food businesses work in Chatswood?',
    a: 'Premium beauty and skincare studios ($30K-$55K/month revenue), allied health clinics ($28K-$50K/month), and professional services (accounting, legal, medical) thrive. The demographic has high incomes and high healthcare/beauty spending. Non-food retail struggles unless it is specialty or category-focused. Mid-market retail chains belong in Chatswood Chase or The Concourse, not street level. Professional services positioning toward the Asian-Australian community (bilingual providers, cultural expertise) command premium positioning and pricing.',
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

export default function ChatswoodPage() {
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
          <span style={{ color: C.n900 }}>Chatswood</span>
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
            Location Guides &gt; Sydney &gt; Chatswood
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '16px' }}>
            <div>
              <h1 style={{ fontSize: '48px', fontWeight: '700', margin: 0, lineHeight: 1 }}>Chatswood</h1>
              <p style={{ fontSize: '16px', marginTop: '8px', opacity: 0.95, margin: 0 }}>NSW 2067</p>
            </div>
            <div style={{ textAlign: 'center', padding: '16px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
              <div style={{ fontSize: '56px', fontWeight: '700', lineHeight: 1 }}>86</div>
              <div style={{ fontSize: '12px', marginTop: '8px', opacity: 0.9 }}>Business Score</div>
            </div>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <VerdictBadge v="GO" />
          </div>
          <p style={{ fontSize: '16px', lineHeight: '1.6', opacity: 0.95, margin: 0, maxWidth: '700px' }}>
            Chatswood is Sydney's most commercially dominant Asian-Australian hub with exceptional demographics ($96K median income) and a quality-sensitive market. The suburb is world-class for authentic Asian restaurants and premium food retail. The barrier to entry is not competition; it is the demographic's high culinary standards. Operators who understand and target the East Asian demographic thrive; operators who treat Chatswood like a generic suburb fail. This is a location for specialized concepts aligned to a specific market, not for generic Western positioning.
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
              Chatswood is a GO if your concept aligns with the East Asian demographic. Authentic ramen, hot pot, and Korean BBQ achieve $35K-$65K/month. Premium beauty and wellness studios achieve $28K-$55K/month. Generic Western food fails consistently. Rent ranges $6,000-$14,000/month depending on location. The demographic trades 7 days and has above-average spending power. This is Sydney's most demographically specialized business environment — demographic alignment is non-negotiable for success.
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: C.n900 }}>
            Business Scores
          </h2>
          <ScoreBar label="Foot Traffic" value={87} />
          <ScoreBar label="Area Demographics" value={93} />
          <ScoreBar label="Rent Viability" value={73} />
          <ScoreBar label="Competition Gap" value={66} />
          <ScoreBar label="Accessibility" value={92} />
        </div>
      </section>

      <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: C.n900 }}>
            Rent Tiers by Location
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '16px', backgroundColor: C.white, borderRadius: '8px', border: `1px solid ${C.border}` }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: C.n900, marginBottom: '8px' }}>Victoria Ave (Prime)</h3>
              <p style={{ fontSize: '20px', fontWeight: '700', color: C.brand, margin: 0 }}>$9K - $14K/mo</p>
              <p style={{ fontSize: '12px', color: C.muted, marginTop: '4px', margin: 0 }}>Prime retail spine, premium positioning</p>
            </div>
            <div style={{ padding: '16px', backgroundColor: C.white, borderRadius: '8px', border: `1px solid ${C.border}` }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: C.n900, marginBottom: '8px' }}>The Concourse Area</h3>
              <p style={{ fontSize: '20px', fontWeight: '700', color: C.brand, margin: 0 }}>$8K - $12K/mo</p>
              <p style={{ fontSize: '12px', color: C.muted, marginTop: '4px', margin: 0 }}>Shopping centre proximity, strong foot traffic</p>
            </div>
            <div style={{ padding: '16px', backgroundColor: C.white, borderRadius: '8px', border: `1px solid ${C.border}` }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: C.n900, marginBottom: '8px' }}>Anderson St / Help St</h3>
              <p style={{ fontSize: '20px', fontWeight: '700', color: C.brand, margin: 0 }}>$6K - $9K/mo</p>
              <p style={{ fontSize: '12px', color: C.muted, marginTop: '4px', margin: 0 }}>Secondary streets, reasonable traffic</p>
            </div>
            <div style={{ padding: '16px', backgroundColor: C.white, borderRadius: '8px', border: `1px solid ${C.border}` }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: C.n900, marginBottom: '8px' }}>First Floor</h3>
              <p style={{ fontSize: '20px', fontWeight: '700', color: C.brand, margin: 0 }}>$4K - $6.5K/mo</p>
              <p style={{ fontSize: '12px', color: C.muted, marginTop: '4px', margin: 0 }}>Lower foot traffic, cost-effective</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: C.n900 }}>
            The Asian-Australian Demographic Advantage
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', fontSize: '16px', lineHeight: '1.7', color: C.n900 }}>
            <p>
              Chatswood is Sydney's most ethnically concentrated business environment: 70%+ of the working population and customer base is Asian-Australian (Chinese, Korean, Japanese, Vietnamese). This is not diversity — this is market concentration. This concentration is both a tremendous advantage and a formidable barrier. A restaurant operator must ask: does my concept serve this specific demographic? If yes, you operate in a protected market with above-average loyalty. If no, your foot traffic numbers are meaningless. A Korean-Australian customer prefers an authentic Korean restaurant from an Australian Korean operator over a Western concept every single time. This preference is based on authenticity, cultural understanding, and culinary standards, not on foot traffic or visibility.
            </p>
            <p>
              The demographic is overwhelmingly professional: corporate workers, healthcare professionals, educators, engineers. Median household income is $96,000 — the highest of any Sydney suburb in our model. This demographic has above-average disposable income, above-average education, and above-average quality expectations. They spend heavily on food (particularly restaurant dining and specialty food retail), healthcare and wellness, and premium personal care. They are less price-sensitive than general Sydney but extraordinarily quality-sensitive. A premium ramen bowl at $28 sells out daily. A mediocre ramen bowl at $15 fails regardless of location.
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: C.n900 }}>
            The Asian Food Market: World-Class Competition
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', fontSize: '16px', lineHeight: '1.7', color: C.n900 }}>
            <p>
              Chatswood's Asian food market is world-class by any measure. Ramen formats achieve restaurant-quality at every level: tonkotsu, miso, shoyu, and specialty broths are made in-house. Hot pot houses operate at table-restaurant scale. Korean BBQ includes premium meat selection and table-side preparation. Dumpling houses make fresh dim sum multiple times daily. This is not casual food — this is culinary expertise as table stakes for entry. A new ramen operator must offer something genuinely differentiated to enter a market with 4-6 established ramen restaurants. Generic ramen fails. Authenticity combined with a specific angle (tonkotsu specialist, rare pork bone broth, premium toppings) succeeds.
            </p>
            <p>
              The competitive standard for Asian food is extraordinarily high, which creates a barrier to entry and a protection for quality operators. A below-standard ramen restaurant fails within 90 days. A premium ramen restaurant succeeds and builds a waitlist. This is unlike most suburbs where an average product is viable. Chatswood punishes below-standard execution and rewards excellence. This makes Chatswood dangerous for operators gambling on substandard product hoping foot traffic will compensate. It makes Chatswood exceptional for operators confident in product quality.
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: C.n900 }}>
            Western Food Concepts in Chatswood
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', fontSize: '16px', lineHeight: '1.7', color: C.n900 }}>
            <p>
              Western food concepts can succeed in Chatswood but only as category alternatives with clear differentiation. Specialty coffee (third-wave, specialty single-origin) performs well because the demographic values quality and discovery. A premium European pastry and coffee concept succeeds by positioning as an alternative to Asian breakfast. A quality burger concept succeeds by positioning as premium (hormone-free beef, hand-cut fries, artisan approach) rather than convenience food. Generic Western casual dining (pizza, burgers, sandwiches without positioning) fails consistently because the demographic prefers authentic Asian food when choosing casual dining.
            </p>
            <p>
              The key insight: Chatswood's demographic will choose genuine alternatives to Asian food, but not approximations or generic Western concepts. A café positioning as "Australian specialty coffee roaster" with direct-trade sourcing succeeds. A café positioning as "coffee shop" fails. A burger joint positioning as "Japanese-style burger with wagyu and miso mayo" (hybrid positioning) succeeds. A generic burger joint fails. Western operators must either own an authentic category alternative (specialty coffee, European pastry) or position as a hybrid that leverages Asian culinary traditions.
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: C.n900 }}>
            Trading Hours and Customer Behavior
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', fontSize: '16px', lineHeight: '1.7', color: C.n900 }}>
            <p>
              Chatswood is genuinely 7-day trading, which is rare for North Shore suburbs. The train station services the upper north shore and connects to CBD, creating genuine commuter volume. Weekend foot traffic is strong — Sunday trade is robust, not marginal. The demographic treats Sunday as a major shopping and dining day. Yum cha houses, family dining, dessert cafés, and specialty food retail are packed on weekends. This makes Chatswood viable for weekend-focused concepts and family-oriented businesses. Weeknight dining is lighter than inner-city suburbs (Surry Hills crowds exceed Chatswood on weeknights) but still strong Friday-Saturday.
            </p>
            <p>
              Foot traffic patterns: Lunch rush is 12-1pm (corporate professionals). Afternoon coffee surge is 2-4pm. Evening dining is 6-9pm with Friday-Saturday stronger than weeknights. Breakfast trade is moderate (many professionals eat at home before commuting). Shopping foot traffic spikes Friday evening and all day Saturday-Sunday. The demographic is family-oriented — many customers are traveling with children or family members, not solo diners. This favors casual dining, group experiences, and family-friendly concepts over solo-diner or date-night positioning.
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: C.n900 }}>
            Best Business Models for Chatswood
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '16px', backgroundColor: C.white, borderRadius: '8px', border: `1px solid ${C.border}` }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.n900, marginBottom: '8px' }}>Premium Asian Restaurant</h3>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', color: C.muted, marginBottom: '4px' }}>Verdict</div>
                <VerdictBadge v="GO" />
              </div>
              <div style={{ fontSize: '13px', color: C.muted, lineHeight: '1.5' }}>
                <div style={{ marginBottom: '6px' }}><strong>Monthly Revenue:</strong> $35K - $65K</div>
                <div style={{ marginBottom: '6px' }}><strong>Break-even:</strong> 6-9 months</div>
                <div><strong>Format:</strong> Ramen, hot pot, Korean BBQ</div>
              </div>
            </div>
            <div style={{ padding: '16px', backgroundColor: C.white, borderRadius: '8px', border: `1px solid ${C.border}` }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.n900, marginBottom: '8px' }}>Specialty Coffee / European</h3>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', color: C.muted, marginBottom: '4px' }}>Verdict</div>
                <VerdictBadge v="GO" />
              </div>
              <div style={{ fontSize: '13px', color: C.muted, lineHeight: '1.5' }}>
                <div style={{ marginBottom: '6px' }}><strong>Monthly Revenue:</strong> $28K - $48K</div>
                <div style={{ marginBottom: '6px' }}><strong>Break-even:</strong> 8-12 months</div>
                <div><strong>Positioning:</strong> Category alternative</div>
              </div>
            </div>
            <div style={{ padding: '16px', backgroundColor: C.white, borderRadius: '8px', border: `1px solid ${C.border}` }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.n900, marginBottom: '8px' }}>Premium Beauty/Skincare</h3>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', color: C.muted, marginBottom: '4px' }}>Verdict</div>
                <VerdictBadge v="GO" />
              </div>
              <div style={{ fontSize: '13px', color: C.muted, lineHeight: '1.5' }}>
                <div style={{ marginBottom: '6px' }}><strong>Monthly Revenue:</strong> $30K - $55K</div>
                <div style={{ marginBottom: '6px' }}><strong>Break-even:</strong> 6-8 months</div>
                <div><strong>Target:</strong> Asian-Australian women 25-50</div>
              </div>
            </div>
            <div style={{ padding: '16px', backgroundColor: C.white, borderRadius: '8px', border: `1px solid ${C.border}` }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.n900, marginBottom: '8px' }}>Allied Health Clinic</h3>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', color: C.muted, marginBottom: '4px' }}>Verdict</div>
                <VerdictBadge v="GO" />
              </div>
              <div style={{ fontSize: '13px', color: C.muted, lineHeight: '1.5' }}>
                <div style={{ marginBottom: '6px' }}><strong>Monthly Revenue:</strong> $28K - $50K</div>
                <div style={{ marginBottom: '6px' }}><strong>Break-even:</strong> 5-7 months</div>
                <div><strong>Services:</strong> Physio, acupuncture, massage</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: C.n900 }}>
            Who Should NOT Open in Chatswood
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
            <div style={{ padding: '16px', backgroundColor: C.white, borderRadius: '8px', border: `2px solid ${C.red}`, borderTopWidth: '4px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.red, marginBottom: '6px' }}>Generic Western Fast Food</h3>
              <p style={{ fontSize: '14px', color: C.muted, margin: 0 }}>
                Dominated by authentic Asian alternatives. Pizza, burgers, sandwiches without positioning fail. The demographic prefers Asian food for casual dining.
              </p>
            </div>
            <div style={{ padding: '16px', backgroundColor: C.white, borderRadius: '8px', border: `2px solid ${C.red}`, borderTopWidth: '4px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.red, marginBottom: '6px' }}>Mid-Market Western Café</h3>
              <p style={{ fontSize: '14px', color: C.muted, margin: 0 }}>
                Café without clear identity (not specialty coffee, not premium pastry) competes with 20+ other generic cafés. The demographic is quality-sensitive and chooses specialists.
              </p>
            </div>
            <div style={{ padding: '16px', backgroundColor: C.white, borderRadius: '8px', border: `2px solid ${C.red}`, borderTopWidth: '4px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.red, marginBottom: '6px' }}>Retail Competing with Chatswood Chase</h3>
              <p style={{ fontSize: '14px', color: C.muted, margin: 0 }}>
                Chatswood Chase and The Concourse anchor significant retail trade. Street-level mid-market retail is unwinnable against mall anchors.
              </p>
            </div>
            <div style={{ padding: '16px', backgroundColor: C.white, borderRadius: '8px', border: `2px solid ${C.red}`, borderTopWidth: '4px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.red, marginBottom: '6px' }}>Businesses Without Asian-Language Marketing</h3>
              <p style={{ fontSize: '14px', color: C.muted, margin: 0 }}>
                Large customer segment prefers Chinese-language discovery (WeChat, social media). No Chinese/Korean/Japanese language presence = invisible to this market segment.
              </p>
            </div>
            <div style={{ padding: '16px', backgroundColor: C.white, borderRadius: '8px', border: `2px solid ${C.red}`, borderTopWidth: '4px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: C.red, marginBottom: '6px' }}>Below-Standard Product Quality</h3>
              <p style={{ fontSize: '14px', color: C.muted, margin: 0 }}>
                This demographic punishes mediocre execution immediately. Quality and authenticity are non-negotiable. Operator experience and product expertise matter more than location here.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: C.n900 }}>
            Case Scenario: Premium Ramen Restaurant
          </h2>
          <div style={{ padding: '24px', backgroundColor: C.emeraldBg, borderRadius: '8px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: C.emerald, marginBottom: '16px' }}>Concept Overview</h3>
            <p style={{ fontSize: '14px', color: C.n900, lineHeight: '1.6', margin: 0 }}>
              40-seat premium tonkotsu ramen restaurant on Victoria Avenue. Authentic in-house pork bone broth preparation, imported noodles, premium protein selection, beer/sake positioning. Target audience: Japanese food enthusiasts and Asian-Australian professionals.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div style={{ padding: '16px', backgroundColor: C.n50, borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', color: C.muted, marginBottom: '4px' }}>Monthly Rent</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: C.brand }}>$10,500</div>
              <div style={{ fontSize: '12px', color: C.muted, marginTop: '4px' }}>Victoria Ave, 1,100 sqft</div>
            </div>
            <div style={{ padding: '16px', backgroundColor: C.n50, borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', color: C.muted, marginBottom: '4px' }}>Avg Spend Per Cover</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: C.brand }}>$28</div>
              <div style={{ fontSize: '12px', color: C.muted, marginTop: '4px' }}>Ramen + beverage + tax</div>
            </div>
            <div style={{ padding: '16px', backgroundColor: C.n50, borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', color: C.muted, marginBottom: '4px' }}>Daily Covers Target</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: C.brand }}>180</div>
              <div style={{ fontSize: '12px', color: C.muted, marginTop: '4px' }}>Lunch + dinner service</div>
            </div>
            <div style={{ padding: '16px', backgroundColor: C.n50, borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', color: C.muted, marginBottom: '4px' }}>Break-even Timeline</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: C.emerald }}>6-9 months</div>
              <div style={{ fontSize: '12px', color: C.muted, marginTop: '4px' }}>At full volume</div>
            </div>
          </div>
          <div style={{ backgroundColor: C.white, padding: '16px', borderRadius: '8px', border: `1px solid ${C.border}` }}>
            <h4 style={{ fontSize: '14px', fontWeight: '600', color: C.n900, marginBottom: '12px' }}>Key Assumptions</h4>
            <ul style={{ fontSize: '14px', color: C.muted, lineHeight: '1.7', margin: 0, paddingLeft: '20px' }}>
              <li>Daily covers ramp from 80 (month 1) to 180 (month 6)</li>
              <li>Average spend: $28 per cover (ramen $20 + beverage $6 + tax/tip $2)</li>
              <li>Monthly revenue at 180 covers: $152,000 (120 lunch + 60 dinner covers daily)</li>
              <li>Operating costs: Chef/kitchen ($3,500/month), front-of-house ($1,200/month), supplies/ingredients ($5,000/month), utilities ($900/month)</li>
              <li>Location advantage: Victoria Avenue foot traffic of 12,000+ daily pedestrians provides reliable customer acquisition</li>
              <li>Ramp timeline: Conservative 6-9 month timeline to full capacity. Authentic product quality enables word-of-mouth acceleration.</li>
            </ul>
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 24px', backgroundColor: C.n900, color: C.white }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '12px', color: C.white }}>
            Analyse Your Chatswood Location
          </h2>
          <p style={{ fontSize: '16px', marginBottom: '24px', lineHeight: '1.6', opacity: 0.95 }}>
            Get suburb-specific demographic breakdown, foot traffic analysis, and rent benchmarks for your exact address. Understand your location's competitive positioning in the East Asian professional market.
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
              href="/analyse/sydney/parramatta"
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
              Parramatta (89 GO)
            </Link>
            <Link
              href="/analyse/sydney/burwood"
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
              Burwood (77 CAUTION)
            </Link>
            <Link
              href="/analyse/sydney/strathfield"
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
              Strathfield (72 CAUTION)
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
