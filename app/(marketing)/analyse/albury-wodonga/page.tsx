// app/(marketing)/analyse/albury-wodonga/page.tsx
// Albury-Wodonga city hub — server component, engine scores, FactorGrid directory

import Link from 'next/link'
import type { Metadata } from 'next'
import { CityHero } from '@/components/analyse/CityHero'
import { SuburbCard } from '@/components/analyse/SuburbCard'
import { ComparisonTable } from '@/components/analyse/ComparisonTable'
import { FAQSection } from '@/components/analyse/FAQSection'
import { CTASection } from '@/components/analyse/CTASection'
import { C } from '@/components/analyse/AnalyseTheme'
import { FactorGrid } from '@/components/analyse/FactorGrid'
import { getAlburyWodongaSuburb, getAlburyWodongaSuburbs } from '@/lib/analyse-data/albury-wodonga'

function aScore(slug: string): number {
  return getAlburyWodongaSuburb(slug)?.compositeScore ?? 0
}
function aVerdict(slug: string): 'GO' | 'CAUTION' | 'NO' {
  const v = getAlburyWodongaSuburb(slug)?.verdict
  if (v === 'GO') return 'GO'
  if (v === 'CAUTION') return 'CAUTION'
  return 'NO'
}

export const metadata: Metadata = {
  title: 'Best Suburbs to Open a Business in Albury-Wodonga — 2026 Location Guide',
  description:
    'Albury-Wodonga business location guide 2026. 8 suburbs scored by foot traffic, rent viability, demographics, and competition gap. Find the best Albury-Wodonga suburb for your cafe, restaurant, retail or service business.',
  alternates: { canonical: 'https://www.locatalyze.com/analyse/albury-wodonga' },
  openGraph: {
    title: 'Best Suburbs to Open a Business in Albury-Wodonga — 2026 Location Guide',
    description:
      '8 Albury-Wodonga suburbs ranked and scored. Rent benchmarks, cross-border foot traffic data, snowfield gateway trade, and GO/CAUTION/NO verdicts.',
    url: 'https://www.locatalyze.com/analyse/albury-wodonga',
  },
}

const COMPARISON_ROWS = [
  { name: 'Albury CBD', score: aScore('albury-cbd'), verdict: aVerdict('albury-cbd'), rent: '$3,000–$5,500', footTraffic: 'High (cross-border)', bestFor: 'Dining, retail, full-service hospitality' },
  { name: 'Wodonga', score: aScore('wodonga'), verdict: aVerdict('wodonga'), rent: '$2,000–$4,500', footTraffic: 'High', bestFor: 'Quality cafe, casual dining, VIC-side retail' },
  { name: 'Lavington', score: aScore('lavington'), verdict: aVerdict('lavington'), rent: '$1,500–$3,500', footTraffic: 'High (retail)', bestFor: 'Convenience food, casual dining, suburban retail' },
  { name: 'East Albury', score: aScore('east-albury'), verdict: aVerdict('east-albury'), rent: '$1,800–$3,500', footTraffic: 'Medium-High', bestFor: 'Specialty cafe, quality brunch, lifestyle dining' },
  { name: 'Thurgoona', score: aScore('thurgoona'), verdict: aVerdict('thurgoona'), rent: '$1,000–$2,500', footTraffic: 'Medium (university)', bestFor: 'University precinct cafe, student dining' },
  { name: 'Hamilton Valley', score: aScore('hamilton-valley'), verdict: aVerdict('hamilton-valley'), rent: '$700–$1,800', footTraffic: 'Low-Medium', bestFor: 'Community convenience food, essential services' },
]

const SUBURB_CATEGORIES = [
  {
    title: 'Cross-Border Commercial Core — The Twin-City Advantage',
    description:
      "Albury CBD and Wodonga are the commercial anchors of Australia's largest cross-border conurbation. The combined catchment of both sides of the Murray substantially exceeds what each city's individual population suggests — Dean Street in Albury captures dining and hospitality trade from across the entire twin-city region.",
    suburbs: [
      {
        name: 'Albury CBD',
        slug: 'albury-cbd',
        description:
          "Dean Street anchors the NSW side of the conurbation. Cross-border spending flows make the effective catchment substantially larger than Albury's individual population. The primary dining and hospitality destination for the entire twin-city region.",
        score: aScore('albury-cbd'),
        verdict: aVerdict('albury-cbd'),
        rentRange: '$3,000–$5,500/mo',
      },
      {
        name: 'Wodonga',
        slug: 'wodonga',
        description:
          "Victorian anchor of the twin-city. High Street and the Wodonga precinct serve the VIC residential catchment with access to the cross-border economy. Stronger residential growth than Albury over the past decade — a growing young family and professional demographic.",
        score: aScore('wodonga'),
        verdict: aVerdict('wodonga'),
        rentRange: '$2,000–$4,500/mo',
      },
    ],
  },
  {
    title: 'Professional Enclaves — High Spend, High Loyalty',
    description:
      'East Albury and Thurgoona serve distinct high-value demographics. East Albury has the highest household income density in the conurbation with a professional and medical demographic. Thurgoona hosts the Charles Sturt University campus with strong weekday demand from students and staff.',
    suburbs: [
      {
        name: 'East Albury',
        slug: 'east-albury',
        description:
          "Premium leafy residential enclave with the highest household income density in the conurbation. Professional, medical, and established business-owner demographic with genuine local cafe culture and high repeat-visit frequency.",
        score: aScore('east-albury'),
        verdict: aVerdict('east-albury'),
        rentRange: '$1,800–$3,500/mo',
      },
      {
        name: 'Thurgoona',
        slug: 'thurgoona',
        description:
          "Charles Sturt University Albury-Wodonga campus precinct. 4,000 to 5,000 enrolled students and academic staff generating weekday food and coffee demand that is currently underserved. Low rents and low competition — a genuine university precinct opportunity.",
        score: aScore('thurgoona'),
        verdict: aVerdict('thurgoona'),
        rentRange: '$1,000–$2,500/mo',
      },
    ],
  },
  {
    title: 'Suburban Commercial — Consistent Volume Trade',
    description:
      'Lavington delivers the most consistent retail foot traffic outside the CBD through large-format supermarket and national chain anchors. Hamilton Valley offers a low-rent community-service opportunity for correctly calibrated operators.',
    suburbs: [
      {
        name: 'Lavington',
        slug: 'lavington',
        description:
          "Albury's principal suburban commercial spine with supermarket-anchored retail generating the highest retail foot traffic outside the CBD. Suits independent operators who find a clear gap in the large-format retail environment.",
        score: aScore('lavington'),
        verdict: aVerdict('lavington'),
        rentRange: '$1,500–$3,500/mo',
      },
      {
        name: 'Hamilton Valley',
        slug: 'hamilton-valley',
        description:
          "Western working-class residential suburb with genuine community demand for quality convenience food. Low rents and low competition — viable for community-oriented operators at the right price point.",
        score: aScore('hamilton-valley'),
        verdict: aVerdict('hamilton-valley'),
        rentRange: '$700–$1,800/mo',
      },
    ],
  },
  {
    title: 'Growth Corridors — First-Mover Positioning',
    description:
      'Ettamogah and Baranduda are emerging precincts on opposite sides of the border. Ettamogah serves the northern highway and industrial corridor. Baranduda is a new VIC-side estate with a growing young family demographic and near-zero existing hospitality supply.',
    suburbs: [
      {
        name: 'Ettamogah',
        slug: 'ettamogah',
        description:
          "Northern Albury fringe adjacent to the Hume Highway. Industrial and logistics workforce with genuine breakfast and lunch demand. Highway transit trade supplements the local workforce base. Low rents, low competition.",
        score: aScore('ettamogah'),
        verdict: aVerdict('ettamogah'),
        rentRange: '$800–$2,000/mo',
      },
      {
        name: 'Baranduda',
        slug: 'baranduda',
        description:
          "New Wodonga estate on the VIC southern fringe. Growing young family demographic with near-zero hospitality supply. First-mover operators build community loyalty before competition arrives. Developer incentives support early establishment.",
        score: aScore('baranduda'),
        verdict: aVerdict('baranduda'),
        rentRange: '$700–$1,800/mo',
      },
    ],
  },
]

const FAQS = [
  {
    question: 'What makes Albury-Wodonga different from other regional cities?',
    answer:
      "Albury-Wodonga is Australia's largest cross-border conurbation — a twin city that straddles the Murray River with one commercial centre in NSW and one in Victoria. The combined urban population exceeds 100,000 people, making it substantially larger than most individual regional cities of comparable economic weight. The cross-border dynamic creates genuine spending flows in both directions: residents of Wodonga regularly spend in Albury's Dean Street restaurants and retailers, and Albury residents access Wodonga services and retail. For hospitality operators on Dean Street in particular, the effective catchment is the entire conurbation rather than just the NSW side, which is a meaningful demand multiplier that smaller single-state regional cities cannot replicate.",
  },
  {
    question: 'Is Dean Street Albury the right location for a premium restaurant?',
    answer:
      "Dean Street is the right location for premium hospitality in the Albury-Wodonga conurbation. The street has an established dining ecosystem with quality independents and a regional dining reputation that draws from both sides of the border. The cross-border catchment means that Dean Street premium restaurants serve a larger effective population than Albury's individual population suggests. The competition is real — established operators have multi-year loyal customer bases — but the demand is validated and the catchment is large enough to sustain well-executed new entrants who offer genuine differentiation. Operators who attempt to replicate existing formats at equivalent quality will find Dean Street difficult; those who offer something the street does not already have will find a receptive market.",
  },
  {
    question: "Is the Thurgoona university precinct a good location for a cafe?",
    answer:
      "The Charles Sturt University precinct at Thurgoona is a genuine opportunity that has been underserved for years. The campus has approximately 4,000 to 5,000 enrolled students plus a substantial academic and administrative staff base — a weekday food and coffee demand pool that is currently not well served by the local commercial offer. On-campus food options are limited and the surrounding strip has not developed pace with enrolment growth. The key risk is semester breaks: December to February and mid-year breaks reduce student volume materially, and operators must model whether the staff and residential trade can sustain the business through the non-semester periods. Operators who plan for the semester calendar from the outset find Thurgoona a viable and largely uncontested opportunity.",
  },
  {
    question: 'Does the snowfield gateway trade benefit Albury-Wodonga businesses?',
    answer:
      "Albury-Wodonga sits on the gateway route to the Victorian snowfields — Mount Hotham, Falls Creek, and the Kiewa Valley Highway passes through or near the twin city for Melbourne travellers. This creates a genuine seasonal revenue component for hospitality operators, particularly in Wodonga which sits on the VIC side and captures the first stop traffic heading to Mount Beauty and Falls Creek. The snowfield season (July to September) generates weekend uplift traffic, with travellers stopping for breakfast, coffee, and lunch before continuing to the mountains. This is a supplementary revenue layer rather than a primary market driver — the snowfield trade does not sustain a business on its own, but meaningfully supplements year-round local residential trade for correctly positioned operators.",
  },
  {
    question: 'What commercial rents should I expect in Albury-Wodonga?',
    answer:
      "Prime Dean Street commercial tenancies in Albury CBD command $3,000 to $5,500 per month — competitive with other significant regional centres but well below equivalent positions in coastal NSW or Melbourne inner suburbs. Wodonga High Street sits modestly below Albury CBD at $2,000 to $4,500 per month. Lavington suburban strip tenancies range from $1,500 to $3,500 per month with strong foot traffic justification. East Albury neighbourhood positions run $1,800 to $3,500 per month. Thurgoona and the growth corridor positions (Ettamogah, Baranduda, Hamilton Valley) fall in the $700 to $2,500 per month range depending on specific tenancy quality. The rent differential between Albury CBD and suburban positions is substantial and creates clear strategy choices: CBD rents require volume or premium pricing; suburban rents can be broken even at more conservative revenue assumptions.",
  },
  {
    question: 'How does the East Albury market differ from the CBD?',
    answer:
      "East Albury and the CBD serve different market segments with different success criteria. East Albury is the premium residential and professional enclave — the highest household income density in the conurbation, with a demographic that builds habitual routines around quality local operators, visits frequently, and spends above the city average per visit. The East Albury hospitality market is smaller in volume than the CBD but higher in average spend and loyalty. A well-run specialty cafe in East Albury builds a deeply loyal local following that sustains the business through a smaller but more valuable customer base than a high-volume suburban strip requires. The CBD delivers volume and a broader catchment but at higher rents and in a more competitive environment. Operators who optimise for margin and loyalty choose East Albury; operators who optimise for volume and catchment size choose the CBD.",
  },
  {
    question: 'Is there a risk of cross-border trade shifting between Albury and Wodonga?',
    answer:
      "Cross-border trade flows in Albury-Wodonga are structurally stable because they reflect spending patterns built over decades of twin-city development. Albury's Dean Street has a well-established destination dining and hospitality reputation that draws from both sides of the border. Wodonga's residential growth has been stronger than Albury's over the past decade, which means the VIC-side catchment that visits Albury CBD is actually growing. The border creates some administrative complexity (GST, state regulations) but does not materially affect consumer spending behaviour for hospitality — people cross the Murray for quality restaurants and cafes regardless of which state they originate from. The risk to cross-border trade flows is economic (a major recession) or infrastructure (disruption to border crossings), not competitive — there is no realistic scenario where Wodonga displaces Albury CBD as the primary dining destination in the conurbation.",
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

function AlburyWodongaFactorDirectory() {
  const suburbs = getAlburyWodongaSuburbs().slice().sort((a, b) => b.compositeScore - a.compositeScore)
  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      {suburbs.map((s) => {
        const verdictColor = s.verdict === 'GO' ? C.emerald : s.verdict === 'CAUTION' ? C.amber : C.red
        const verdictBg = s.verdict === 'GO' ? C.emeraldBg : s.verdict === 'CAUTION' ? C.amberBg : C.redBg
        const verdictBdr = s.verdict === 'GO' ? C.emeraldBdr : s.verdict === 'CAUTION' ? C.amberBdr : C.redBdr
        return (
          <Link key={s.slug} href={`/analyse/albury-wodonga/${s.slug}`} style={{ textDecoration: 'none' }}>
            <div style={{ backgroundColor: C.white, border: `1px solid ${C.border}`, borderRadius: '14px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: C.n900, margin: 0 }}>{s.name}</h3>
                {'state' in s && (
                  <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', backgroundColor: C.n100, color: C.n700 }}>{(s as { state: string }).state}</span>
                )}
                <span style={{ fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '999px', backgroundColor: verdictBg, color: verdictColor, border: `1px solid ${verdictBdr}`, letterSpacing: '0.05em' }}>
                  {s.verdict === 'RISKY' ? 'NO' : s.verdict}
                </span>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                  {[{ label: 'Cafe', value: s.cafe }, { label: 'Restaurant', value: s.restaurant }, { label: 'Retail', value: s.retail }].map(({ label, value }) => (
                    <div key={label} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '11px', color: C.muted, marginBottom: '2px' }}>{label}</div>
                      <div style={{ fontSize: '16px', fontWeight: 800, color: C.brand }}>{value}</div>
                    </div>
                  ))}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: C.muted, marginBottom: '2px' }}>Composite</div>
                    <div style={{ fontSize: '22px', fontWeight: 900, color: C.n900, lineHeight: 1 }}>{s.compositeScore}</div>
                  </div>
                </div>
              </div>
              <p style={{ fontSize: '13px', color: C.muted, lineHeight: '1.6', margin: '0 0 14px 0', maxWidth: '760px' }}>{s.why[0]}</p>
              <FactorGrid factors={s.locationFactors} />
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default function AlburyWodongaPage() {
  return (
    <div style={{ backgroundColor: '#FFFFFF', color: '#1C1917', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />

      <CityHero
        cityName="Albury-Wodonga"
        citySlug="albury-wodonga"
        tagline="Australia's largest cross-border conurbation has a combined catchment that exceeds 100,000 people — Dean Street draws from both sides of the Murray, and the Wodonga residential growth corridor is delivering new customers every month."
        statChips={[
          { text: '8 suburbs scored — CBD to growth estates on both sides of the border' },
          { text: 'Cross-border conurbation: effective catchment exceeds 100,000 people' },
          { text: 'Snowfield gateway traffic: Mount Hotham and Falls Creek seasonal uplift' },
        ]}
      />

      <div style={{ backgroundColor: C.amberBg, borderBottom: `1px solid ${C.amberBdr}`, padding: '12px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ fontSize: '13px', color: C.amber, margin: 0 }}>
            <strong>Methodology:</strong> Scores based on foot traffic density, demographic income distribution, commercial rent viability, competitive density, and accessibility. Data sourced from ABS 2024, NSW DPIE and DELWP VIC Q1 2026, and Locatalyze proprietary foot traffic analysis.
          </p>
        </div>
      </div>

      <nav style={{ backgroundColor: C.white, borderBottom: `1px solid ${C.border}`, padding: '10px 24px', overflowX: 'auto' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '6px', flexWrap: 'nowrap', alignItems: 'center' }}>
          {[
            { label: 'Top Suburbs', href: '#top-suburbs' },
            { label: 'By Business Type', href: '#by-type' },
            { label: 'Suburb Directory', href: '#suburbs' },
            { label: 'Comparisons', href: '#comparisons' },
            { label: 'Risk Zones', href: '#risk-zones' },
            { label: 'Factor Breakdown', href: '#factor-directory' },
            { label: 'FAQ', href: '#faq' },
          ].map((link) => (
            <a key={link.href} href={link.href} style={{ fontSize: '13px', fontWeight: 600, color: C.n700, textDecoration: 'none', padding: '6px 14px', borderRadius: '5px', backgroundColor: C.n50, border: `1px solid ${C.border}`, whiteSpace: 'nowrap' }}>
              {link.label}
            </a>
          ))}
        </div>
      </nav>

      <section style={{ padding: '40px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            {[
              { value: '100K+', label: 'Combined twin-city population — cross-border catchment exceeds any individual city figure', source: 'ABS 2024' },
              { value: 'NSW+VIC', label: "Cross-border conurbation — spending flows in both directions across the Murray River", source: 'Border Regional Organisation of Councils 2025' },
              { value: 'Jul–Sep', label: 'Snowfield gateway season — Mount Hotham and Falls Creek uplift for Wodonga operators', source: 'Tourism North East 2025' },
              { value: '$3K', label: 'Dean Street CBD rents from $3,000/month — competitive for a 100,000+ population catchment', source: 'NSW DPIE Q1 2026' },
            ].map((s) => (
              <div key={s.value} style={{ padding: '24px', backgroundColor: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, textAlign: 'center' }}>
                <div style={{ fontSize: '30px', fontWeight: 800, color: C.brand, marginBottom: '8px' }}>{s.value}</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: C.n800, marginBottom: '6px', lineHeight: '1.4' }}>{s.label}</div>
                <div style={{ fontSize: '11px', color: C.muted }}>{s.source}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '56px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '28px' }}>Albury-Wodonga Business Landscape — 2026</h2>
          <div style={{ display: 'grid', gap: '22px' }}>
            {[
              "Albury-Wodonga is structurally different from every other regional city on the east coast of Australia. The twin-city straddles the Murray River with major commercial centres on both the NSW side (Albury CBD, Dean Street) and the Victorian side (Wodonga, High Street), creating cross-border spending flows that substantially amplify the effective catchment for operators in the primary commercial precincts. A restaurant on Dean Street does not serve 52,000 Albury residents — it serves a combined conurbation of more than 100,000 people who cross the Murray for quality dining, retail, and hospitality experiences. This is the fundamental economic advantage of the Albury-Wodonga market.",
              "The Wodonga side of the conurbation has experienced stronger residential growth than Albury over the past decade. New estate development in Gateway Island, Baranduda, and the southern growth corridor has delivered a young family and professional demographic whose hospitality spending is increasingly captured by an improving Wodonga commercial offer. This creates an interesting dynamic for operators: the Albury CBD has the established destination dining reputation and draws from the full conurbation, but Wodonga's growing residential base is progressively supporting a stronger local food and beverage market on the Victorian side.",
              "The snowfield gateway trade is a genuine but secondary revenue component for Albury-Wodonga operators. Melbourne travellers heading to Mount Hotham and Falls Creek pass through the twin city as a natural first stop for breakfast and coffee before the alpine ascent. Wodonga benefits most from this gateway traffic, particularly during the June to September snowfield season. This is a useful weekend uplift for correctly positioned operators — not a demand foundation, but a meaningful supplementary revenue stream that adds to year-round local residential trade.",
              "The commercial rent picture in Albury-Wodonga is genuinely compelling relative to the catchment size. Dean Street prime tenancies at $3,000 to $5,500 per month are servicing a 100,000+ person conurbation at rents that coastal operators with smaller individual catchments would find extremely attractive. The opportunity is clear for operators who understand the cross-border dynamic: a well-executed concept in Albury CBD has access to a larger effective market at lower occupancy cost than most comparable-scale markets elsewhere in Australia.",
            ].map((para, i) => (
              <p key={i} style={{ fontSize: '16px', lineHeight: '1.8', color: C.n800, margin: 0 }}>{para}</p>
            ))}
          </div>
        </div>
      </section>

      <section id="by-type" style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>Location Strategy by Business Type</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {[
              { type: 'Cafes & Specialty Coffee', insight: "East Albury is the specialty cafe market — highest household incomes, genuine coffee culture, strong repeat frequency. Albury CBD suits volume-focused cafe formats serving the full cross-border catchment. Thurgoona university precinct is underserved and available at lower cost. Wodonga suits quality cafe operators seeking the VIC-side growth residential catchment.", best: ['East Albury', 'Albury CBD', 'Thurgoona'] },
              { type: 'Full-Service Restaurants', insight: "Albury CBD Dean Street is the destination dining address for the entire conurbation. Cross-border catchment of 100,000+ people makes it viable for quality independent restaurants that draw from both sides of the Murray. Wodonga suits mid-range dining operators targeting the growing VIC-side residential base.", best: ['Albury CBD', 'Wodonga', 'East Albury'] },
              { type: 'Retail (Independent)', insight: "Lavington delivers the highest retail foot traffic outside the CBD through supermarket-anchored large-format retail. Albury CBD suits destination and specialty retail drawing from the full cross-border catchment. Wodonga suits independent retail targeting the growing VIC-side residential market.", best: ['Lavington', 'Albury CBD', 'Wodonga'] },
              { type: 'Fitness & Wellness', insight: "East Albury has the highest-income residential demographic in the conurbation with genuine demand for boutique fitness and allied health. Albury CBD suits high-volume fitness formats drawing from the full catchment. Thurgoona university precinct suits student-facing wellness formats.", best: ['East Albury', 'Albury CBD', 'Thurgoona'] },
              { type: 'Quick Service & Takeaway', insight: "Lavington delivers strong convenience food foot traffic through large-format retail. Albury CBD suits peak-lunchtime quick-service formats. Ettamogah suits industrial and highway trade concepts serving the northern corridor workforce.", best: ['Lavington', 'Albury CBD', 'Ettamogah'] },
              { type: 'Community & First-Mover Concepts', insight: "Baranduda on the VIC side and Ettamogah on the northern fringe offer first-mover positioning in growing or underserved markets. Both have near-zero hospitality competition and low rents. Hamilton Valley suits community-service operators who explicitly serve the working-class western residential catchment.", best: ['Baranduda', 'Ettamogah', 'Hamilton Valley'] },
            ].map((bt) => (
              <div key={bt.type} style={{ padding: '20px', backgroundColor: C.white, borderRadius: '10px', border: `1px solid ${C.border}` }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: C.brand, marginBottom: '8px' }}>{bt.type}</h3>
                <p style={{ fontSize: '13px', color: C.muted, lineHeight: '1.6', margin: '0 0 10px' }}>{bt.insight}</p>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {bt.best.map((s) => (
                    <span key={s} style={{ fontSize: '11px', fontWeight: 600, padding: '3px 8px', backgroundColor: C.n100, borderRadius: '4px', color: C.n700 }}>{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="top-suburbs" style={{ padding: '64px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: C.n900, marginBottom: '12px', lineHeight: '1.2' }}>Top Albury-Wodonga Suburbs to Open a Business (2026)</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px', maxWidth: '760px' }}>Ranked by overall viability score across foot traffic, demographics, rent economics, competition gap, and growth trajectory.</p>
          <div style={{ display: 'grid', gap: '16px' }}>
            {[
              { rank: 1, name: 'Albury CBD', slug: 'albury-cbd', verdict: aVerdict('albury-cbd'), score: aScore('albury-cbd'), rentFrom: '$3,000/mo', body: "Dean Street is the commercial heart of the cross-border conurbation. The effective catchment exceeds 100,000 people with spending flows from both sides of the Murray. Established dining reputation, validated demand, and a genuine cross-border pull that makes it one of the most significant hospitality addresses in regional Australia." },
              { rank: 2, name: 'Wodonga', slug: 'wodonga', verdict: aVerdict('wodonga'), score: aScore('wodonga'), rentFrom: '$2,000/mo', body: "The VIC anchor of the twin-city with stronger residential growth than Albury over the past decade. A growing young family and professional demographic, snowfield gateway trade, and a commercial strip that has historically been underserved relative to the quality that the catchment can sustain. Below-Albury-CBD rents with genuine cross-border population access." },
              { rank: 3, name: 'Thurgoona', slug: 'thurgoona', verdict: aVerdict('thurgoona'), score: aScore('thurgoona'), rentFrom: '$1,000/mo', body: "Charles Sturt University campus precinct with 4,000 to 5,000 enrolled students and a substantial academic staff base generating weekday food and coffee demand. Genuinely underserved — quality operators find a large, captive, and largely uncontested market here during semester. Model the semester calendar carefully." },
              { rank: 4, name: 'East Albury', slug: 'east-albury', verdict: aVerdict('east-albury'), score: aScore('east-albury'), rentFrom: '$1,800/mo', body: "Highest household income density in the conurbation. The professional, medical, and established business-owner demographic has genuine local cafe culture and rewards quality operators with strong repeat loyalty. A smaller but more valuable customer base than the CBD volume market." },
              { rank: 5, name: 'Lavington', slug: 'lavington', verdict: aVerdict('lavington'), score: aScore('lavington'), rentFrom: '$1,500/mo', body: "The principal suburban retail corridor with supermarket-anchored large-format retail generating consistent foot traffic across 52 weeks. Independent operators who find a clear positioning gap in the large-format retail environment convert reliable baseline traffic into sustainable revenue." },
              { rank: 6, name: 'Ettamogah', slug: 'ettamogah', verdict: aVerdict('ettamogah'), score: aScore('ettamogah'), rentFrom: '$800/mo', body: "Northern fringe industrial and highway trade corridor. Trade and logistics workforce with genuine breakfast and lunch demand. Highway transit supplementation from the Melbourne to Sydney Hume Highway. Low rents and low competition — correctly calibrated quick-service and trade-facing formats find viable economics here." },
              { rank: 7, name: 'Hamilton Valley', slug: 'hamilton-valley', verdict: aVerdict('hamilton-valley'), score: aScore('hamilton-valley'), rentFrom: '$700/mo', body: "Western working-class residential suburb with genuine community demand for quality convenience food and essential services. Low rents create viable break-even at conservative revenue assumptions. Rewards operators with genuine community-service intent at the right price point." },
              { rank: 8, name: 'Baranduda', slug: 'baranduda', verdict: aVerdict('baranduda'), score: aScore('baranduda'), rentFrom: '$700/mo', body: "New Wodonga estate on the VIC southern fringe. Growing young family demographic with near-zero hospitality supply. Developer incentives and graduated rent structures support early establishment. First-mover operators build community loyalty before any competition exists. Revenue ramps with the residential population over 18 to 36 months." },
            ].map((suburb) => {
              const vBg = suburb.verdict === 'GO' ? C.emeraldBg : suburb.verdict === 'CAUTION' ? C.amberBg : C.redBg
              const vColor = suburb.verdict === 'GO' ? C.emerald : suburb.verdict === 'CAUTION' ? C.amber : C.red
              const vBdr = suburb.verdict === 'GO' ? C.emeraldBdr : suburb.verdict === 'CAUTION' ? C.amberBdr : C.redBdr
              return (
                <Link key={suburb.slug} href={`/analyse/albury-wodonga/${suburb.slug}`} style={{ textDecoration: 'none' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '52px 1fr auto', gap: '20px', alignItems: 'start', padding: '20px 24px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: `1px solid ${C.border}` }}>
                    <div style={{ textAlign: 'center', paddingTop: '2px' }}>
                      <div style={{ fontSize: '22px', fontWeight: 900, color: C.n900, lineHeight: 1 }}>#{suburb.rank}</div>
                      <div style={{ marginTop: '6px', fontSize: '10px', fontWeight: 800, padding: '3px 7px', borderRadius: '4px', textAlign: 'center', backgroundColor: vBg, color: vColor, border: `1px solid ${vBdr}` }}>
                        {suburb.verdict}
                      </div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: '17px', fontWeight: 700, color: C.n900, margin: 0 }}>{suburb.name}</h3>
                        <span style={{ fontSize: '12px', color: C.muted }}>From {suburb.rentFrom}</span>
                      </div>
                      <p style={{ fontSize: '14px', lineHeight: '1.7', color: C.muted, margin: 0 }}>{suburb.body}</p>
                    </div>
                    <div style={{ textAlign: 'center', minWidth: '52px' }}>
                      <div style={{ fontSize: '26px', fontWeight: 900, color: C.brand, lineHeight: 1 }}>{suburb.score}</div>
                      <div style={{ fontSize: '10px', color: C.muted, fontWeight: 600 }}>/ 100</div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 24px', background: 'linear-gradient(135deg, #0C4A6E 0%, #164E63 100%)', textAlign: 'center' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px', lineHeight: '1.3' }}>Have a specific Albury-Wodonga address in mind?</h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', marginBottom: '24px', lineHeight: '1.65' }}>Get a full foot traffic analysis, competitor map, rent benchmarks, and GO/CAUTION/NO verdict for any Albury-Wodonga address. Free.</p>
          <Link href="/onboarding" style={{ display: 'inline-block', padding: '14px 30px', backgroundColor: '#CFFAFE', color: '#0C4A6E', borderRadius: '8px', textDecoration: 'none', fontSize: '15px', fontWeight: 800 }}>
            Analyse your Albury-Wodonga address →
          </Link>
        </div>
      </section>

      <section id="suburbs" style={{ padding: '56px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '12px' }}>Albury-Wodonga Suburb Directory — By Category</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px' }}>8 suburbs grouped by risk profile and market type.</p>
          {SUBURB_CATEGORIES.map((cat) => (
            <div key={cat.title} style={{ marginBottom: '52px' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: C.brand, marginBottom: '6px' }}>{cat.title}</h3>
                <p style={{ fontSize: '14px', color: C.muted, margin: 0 }}>{cat.description}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '16px' }}>
                {cat.suburbs.map((s) => (
                  <SuburbCard key={s.slug} name={s.name} slug={s.slug} citySlug="albury-wodonga" description={s.description} score={s.score} verdict={s.verdict} rentRange={s.rentRange} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>Quick Comparison — Top Albury-Wodonga Suburbs</h2>
          <ComparisonTable rows={COMPARISON_ROWS} />
        </div>
      </section>

      <section id="comparisons" style={{ padding: '48px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>Head-to-Head: Suburb Comparisons</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
            {[
              { title: 'Albury CBD vs Wodonga', body: "Albury CBD has the established destination dining reputation and draws from the full cross-border conurbation. Dean Street is the primary hospitality address in the twin city and will remain so for the foreseeable future. Wodonga has stronger recent residential growth and lower rents — a more accessible entry point for operators who want cross-border catchment access without the CBD premium. For destination dining and premium hospitality, Albury CBD. For operators who want to serve the growing VIC residential catchment at lower cost, Wodonga." },
              { title: 'East Albury vs Albury CBD', body: "East Albury and the CBD have complementary strengths. The CBD delivers higher absolute foot traffic volume and a larger cross-border catchment — better suited to operators who need volume. East Albury delivers the highest income demographic in the conurbation with strong loyalty behaviour — better suited to operators who benefit from repeat frequency and above-average spend. A specialty cafe that earns the East Albury professional demographic can build a very loyal business from a smaller but more valuable customer base than the CBD's high-volume environment requires." },
              { title: 'Thurgoona vs established suburbs', body: "Thurgoona is the most underserved quality precinct in the Albury-Wodonga conurbation relative to the size and spending power of its captive demographic. The university campus generates a demand pool of 4,000 to 5,000 students plus staff that far exceeds what the current commercial offer can absorb. The risk is the semester cycle — non-semester periods materially reduce student volume. Operators who plan the semester calendar explicitly find Thurgoona a very attractive opportunity. Those who need year-round consistent volume should choose an established suburb instead." },
            ].map((comp) => (
              <div key={comp.title} style={{ padding: '24px', backgroundColor: C.white, borderRadius: '10px', border: `1px solid ${C.border}` }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: C.brand, marginBottom: '12px' }}>{comp.title}</h3>
                <p style={{ fontSize: '14px', color: C.n800, lineHeight: '1.7', margin: 0 }}>{comp.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="risk-zones" style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '8px' }}>Risk Zones — What Every Albury-Wodonga Operator Must Plan For</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '28px' }}>Three failure patterns specific to the cross-border market that catch operators off-guard.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {[
              { name: 'Underestimating the cross-border competitive set', why: "Albury CBD operators compete not just against other Albury businesses but against the entire twin-city commercial ecosystem. Wodonga operators with new concepts may find that Albury CBD already serves the demand they are targeting, because cross-border spending flows are well-established. Understanding which customer segments genuinely prefer the VIC-side option versus those who will always cross to Albury is essential before selecting a Wodonga location." },
              { name: 'Thurgoona without a non-semester revenue plan', why: "The university precinct opportunity at Thurgoona is genuine during semester but materially softens during the December to February summer break and the mid-year break in July. Operators who model full-semester revenue across all 52 weeks will consistently miss projections in the non-semester periods. The break-even analysis must be modelled with explicit semester and non-semester revenue assumptions — not a blended annual average that obscures the seasonal cash flow reality." },
              { name: 'Growth corridor timing failure (Baranduda, Ettamogah)', why: "The new estate and fringe-commercial opportunities in Baranduda and Ettamogah require operators to fund a ramp-up period before the catchment reaches operating density. Operators who enter these locations with insufficient working capital reserves and require immediate full-volume trading will exhaust their runway before the market matures. The growth corridor opportunity is specifically suited to operators who can manage a 12 to 24-month ramp-up — not to operators who need immediate cash flow from day one of trading." },
            ].map((zone) => (
              <div key={zone.name} style={{ padding: '22px', backgroundColor: C.redBg, borderRadius: '10px', border: `1px solid ${C.redBdr}` }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: C.red, marginBottom: '10px' }}>{zone.name}</h3>
                <p style={{ fontSize: '13px', color: C.n800, lineHeight: '1.65', margin: 0 }}>{zone.why}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="factor-directory" style={{ padding: '64px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: C.n900, marginBottom: '10px', lineHeight: '1.2' }}>Albury-Wodonga Suburb Factor Breakdown — All 8 Markets</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '36px', maxWidth: '760px' }}>Engine-derived scores across demand, rent pressure, competition density, seasonality, and tourism for every suburb in the dataset. Sorted by composite score. Click any suburb for the full detail page.</p>
          <AlburyWodongaFactorDirectory />
        </div>
      </section>

      <FAQSection faqs={FAQS} title="Albury-Wodonga Business Location — FAQ" id="faq" />

      <CTASection
        title="Ready to find your Albury-Wodonga location?"
        subtitle="Run a free analysis on any Albury-Wodonga address. Get foot traffic data, demographic breakdown, rent benchmarks, and competitive analysis in minutes."
        variant="green"
      />

      <section style={{ padding: '28px 24px', backgroundColor: C.n50, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '13px' }}>
          <Link href="/analyse" style={{ color: C.brand, fontWeight: 600, textDecoration: 'none' }}>← All Cities</Link>
          <Link href="/analyse/albury-wodonga/albury-cbd" style={{ color: C.brand, textDecoration: 'none' }}>Albury CBD Analysis →</Link>
          <Link href="/analyse/albury-wodonga/wodonga" style={{ color: C.brand, textDecoration: 'none' }}>Wodonga Analysis →</Link>
          <Link href="/analyse/albury-wodonga/east-albury" style={{ color: C.brand, textDecoration: 'none' }}>East Albury Analysis →</Link>
        </div>
      </section>
    </div>
  )
}
