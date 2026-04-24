// app/(marketing)/analyse/wagga-wagga/page.tsx
// Wagga Wagga city hub — server component, engine scores, FactorGrid directory

import Link from 'next/link'
import type { Metadata } from 'next'
import { CityHero } from '@/components/analyse/CityHero'
import { SuburbCard } from '@/components/analyse/SuburbCard'
import { ComparisonTable } from '@/components/analyse/ComparisonTable'
import { FAQSection } from '@/components/analyse/FAQSection'
import { CTASection } from '@/components/analyse/CTASection'
import { C } from '@/components/analyse/AnalyseTheme'
import { FactorGrid } from '@/components/analyse/FactorGrid'
import { getWaggaWaggaSuburb, getWaggaWaggaSuburbs } from '@/lib/analyse-data/wagga-wagga'

function wScore(slug: string): number {
  return getWaggaWaggaSuburb(slug)?.compositeScore ?? 0
}
function wVerdict(slug: string): 'GO' | 'CAUTION' | 'NO' {
  const v = getWaggaWaggaSuburb(slug)?.verdict
  if (v === 'GO') return 'GO'
  if (v === 'CAUTION') return 'CAUTION'
  return 'NO'
}

export const metadata: Metadata = {
  title: 'Best Suburbs to Open a Business in Wagga Wagga — 2026 Location Guide',
  description:
    'Wagga Wagga business location guide 2026. 8 suburbs scored by foot traffic, rent viability, demographics, and competition gap. Find the best Wagga Wagga suburb for your cafe, restaurant, retail or service business.',
  alternates: { canonical: 'https://locatalyze.com/analyse/wagga-wagga' },
  openGraph: {
    title: 'Best Suburbs to Open a Business in Wagga Wagga — 2026 Location Guide',
    description:
      '8 Wagga Wagga suburbs ranked and scored. Rent benchmarks, foot traffic data, Defence and university economy, and GO/CAUTION/NO verdicts.',
    url: 'https://locatalyze.com/analyse/wagga-wagga',
  },
}

const COMPARISON_ROWS = [
  { name: 'Wagga Wagga CBD', score: wScore('wagga-wagga-cbd'), verdict: wVerdict('wagga-wagga-cbd'), rent: '$3,000–$5,500', footTraffic: 'High', bestFor: 'Retail, casual dining, essential services at volume' },
  { name: 'Fitzmaurice Street', score: wScore('fitzmaurice-street'), verdict: wVerdict('fitzmaurice-street'), rent: '$2,000–$4,000', footTraffic: 'High (professional)', bestFor: 'Specialty cafe, quality dining, professional market' },
  { name: 'Turvey Park', score: wScore('turvey-park'), verdict: wVerdict('turvey-park'), rent: '$1,800–$3,500', footTraffic: 'Medium-High', bestFor: 'Hospital precinct cafe, quick-service lunch' },
  { name: 'Kooringal', score: wScore('kooringal'), verdict: wVerdict('kooringal'), rent: '$1,200–$2,800', footTraffic: 'Medium-High', bestFor: 'Family casual dining, convenience, suburban retail' },
  { name: 'Forest Hill', score: wScore('forest-hill'), verdict: wVerdict('forest-hill'), rent: '$800–$2,000', footTraffic: 'Medium (growing)', bestFor: 'First-mover family cafe, community casual dining' },
  { name: 'Estella', score: wScore('estella'), verdict: wVerdict('estella'), rent: '$800–$2,000', footTraffic: 'Medium (growing)', bestFor: 'Masterplan community cafe, first-mover positioning' },
]

const SUBURB_CATEGORIES = [
  {
    title: 'City Centre — Maximum Foot Traffic, Highest Competition',
    description:
      'The CBD and Fitzmaurice Street form the core commercial spine of Wagga Wagga. The highest foot traffic volumes in the Riverina region, the most established competition, and the clearest demand for differentiated operators who can stand apart from the incumbent base.',
    suburbs: [
      {
        name: 'Wagga Wagga CBD',
        slug: 'wagga-wagga-cbd',
        description:
          'Baylis and Fitzmaurice Streets form the primary retail and dining spine. Highest foot traffic in the Riverina — Defence, Health, and Charles Sturt University workforce drives year-round demand.',
        score: wScore('wagga-wagga-cbd'),
        verdict: wVerdict('wagga-wagga-cbd'),
        rentRange: '$3,000–$5,500/mo',
      },
      {
        name: 'Fitzmaurice Street',
        slug: 'fitzmaurice-street',
        description:
          "Wagga Wagga's premium dining and cafe corridor. Walkable strip with a professional and medical demographic. Strong loyal customer base once earned — the quality-hospitality market in the city.",
        score: wScore('fitzmaurice-street'),
        verdict: wVerdict('fitzmaurice-street'),
        rentRange: '$2,000–$4,000/mo',
      },
    ],
  },
  {
    title: 'Professional Precincts — Reliable Weekday Trade',
    description:
      'Turvey Park serves the Wagga Wagga Hospital precinct — one of the most reliable hospitality catchments in regional NSW. Medical and allied health professionals with above-average incomes and daily food and coffee needs.',
    suburbs: [
      {
        name: 'Turvey Park',
        slug: 'turvey-park',
        description:
          'Adjacent to the Wagga Wagga Hospital — the largest regional hospital in NSW. Medical and professional demographic with above-average spend and strong weekday trade frequency.',
        score: wScore('turvey-park'),
        verdict: wVerdict('turvey-park'),
        rentRange: '$1,800–$3,500/mo',
      },
    ],
  },
  {
    title: 'Established Suburbs — Consistent Community Trade',
    description:
      'Kooringal anchors the southern residential catchment with major supermarket foot traffic generating reliable baseline demand. Tolland offers a lower-cost community-service opportunity in the western suburbs.',
    suburbs: [
      {
        name: 'Kooringal',
        slug: 'kooringal',
        description:
          'Principal southern hub with supermarket-anchored foot traffic. Working and middle-income family demographic with consistent weekly spend on convenience food and casual dining.',
        score: wScore('kooringal'),
        verdict: wVerdict('kooringal'),
        rentRange: '$1,200–$2,800/mo',
      },
      {
        name: 'Tolland',
        slug: 'tolland',
        description:
          'Western working-class suburb with limited hospitality supply. Very low rents, genuine community need for quality convenience food — a first-mover opportunity for community-oriented operators.',
        score: wScore('tolland'),
        verdict: wVerdict('tolland'),
        rentRange: '$600–$1,500/mo',
      },
    ],
  },
  {
    title: 'Growth Corridors — First-Mover Opportunity',
    description:
      'Forest Hill, Estella, and Glenfield Park are Wagga Wagga\'s northern and western growth corridors. Near-zero competition, growing young family demographics, and low rents — but require patience through a ramp-up period before the catchment reaches full density.',
    suburbs: [
      {
        name: 'Forest Hill',
        slug: 'forest-hill',
        description:
          'Northern growth estate with young family demographic. Near-zero hospitality competition. First-mover window open for community cafe and casual dining concepts before the market matures.',
        score: wScore('forest-hill'),
        verdict: wVerdict('forest-hill'),
        rentRange: '$800–$2,000/mo',
      },
      {
        name: 'Estella',
        slug: 'estella',
        description:
          'Rapidly growing masterplan community in the northern corridor. Above-average household incomes, strong food culture expectations, and a genuine desire for a community hospitality hub.',
        score: wScore('estella'),
        verdict: wVerdict('estella'),
        rentRange: '$800–$2,000/mo',
      },
      {
        name: 'Glenfield Park',
        slug: 'glenfield-park',
        description:
          'Western fringe growth corridor at early-stage development. Lowest rents in Wagga Wagga — a patient-capital opportunity for operators who commit before the catchment reaches full density.',
        score: wScore('glenfield-park'),
        verdict: wVerdict('glenfield-park'),
        rentRange: '$600–$1,500/mo',
      },
    ],
  },
]

const FAQS = [
  {
    question: 'What drives demand for hospitality businesses in Wagga Wagga?',
    answer:
      "Wagga Wagga's demand base is built on three structural pillars that are unusual for a regional city of 68,000 people. The Defence workforce at RAAF Base Wagga — one of Australia's largest Air Force bases — contributes a well-paid, stable workforce with strong weekday hospitality spending. The health sector, anchored by the Wagga Wagga Rural Referral Hospital, generates constant medical and allied health professional traffic in the Turvey Park and Fitzmaurice Street precincts. Charles Sturt University delivers a student and academic workforce in the order of several thousand people. These three anchors produce year-round, recession-resistant demand that many comparable regional cities cannot match.",
  },
  {
    question: 'Is Fitzmaurice Street better than the CBD for a cafe or restaurant?',
    answer:
      "Fitzmaurice Street and the CBD serve different market segments and neither is universally superior. Fitzmaurice Street is the premium dining and specialty cafe corridor — the demographic that frequents this strip is the professional, medical, and quality-food-literate segment of Wagga Wagga's population. The repeat-visit frequency and average spend is higher, and the competition is established but not overwhelming. The CBD on Baylis Street delivers higher raw foot traffic volume and suits retail, casual dining, and volume-focused operators. The choice comes down to your concept: quality-focused hospitality with above-average ticket sizes belongs on Fitzmaurice Street; volume-driven formats with mid-range pricing belong in the CBD.",
  },
  {
    question: 'What are the commercial rents like in Wagga Wagga compared to coastal NSW?',
    answer:
      "Wagga Wagga commercial rents are materially lower than coastal NSW equivalents. Prime CBD tenancies on Baylis Street run $3,000 to $5,500 per month — significantly below comparable positions in Newcastle, Wollongong, or coastal Queensland regional centres. Fitzmaurice Street sits below this at $2,000 to $4,000 per month for quality floor space. Suburban positions like Kooringal and Turvey Park range from $1,200 to $2,800 per month. The lower occupancy cost is a genuine structural advantage for operators who understand the Wagga Wagga market and set revenue projections appropriate to its scale — the cost base makes viable businesses possible at lower revenue densities than coastal centres require.",
  },
  {
    question: 'Are the growth corridor suburbs (Forest Hill, Estella) worth the risk?',
    answer:
      "The growth corridors in Wagga Wagga's northern fringe are genuine first-mover opportunities — but they require a specific operator profile. The residential development pipeline for both Forest Hill and Estella has significant approved dwelling numbers, and the demographics of masterplan community residents tend toward higher household incomes and stronger food culture expectations than older established suburbs. The risk is timing: operators who enter before the catchment reaches critical density accept a ramp-up period of 12 to 18 months with lower initial revenues. The first-mover advantage — building community loyalty before any competition exists — is the structural return on that risk. Operators who need immediate trading volume should choose the CBD or Fitzmaurice Street. Operators who can manage a ramp-up period in exchange for first-mover positioning will find Estella and Forest Hill compelling.",
  },
  {
    question: 'How does the Defence workforce affect Wagga Wagga business viability?',
    answer:
      "RAAF Base Wagga Wagga is one of the largest Air Force bases in Australia and generates a Defence workforce of several thousand personnel and their families. This demographic has above-average household incomes, consistent spending patterns, and strong repeat-visit behaviour with quality local operators. Defence personnel and families contribute materially to the Wagga Wagga dining economy, particularly in the CBD and Fitzmaurice Street precincts. The structural advantage is that Defence workforce spending is largely counter-cyclical to broader economic conditions — RAAF employment is stable regardless of consumer confidence or property market cycles, providing a dependable demand floor beneath the hospitality market.",
  },
  {
    question: 'What types of businesses perform best in Wagga Wagga?',
    answer:
      "Quality specialty cafe and breakfast-brunch concepts perform strongly in Wagga Wagga, particularly on Fitzmaurice Street and in the Turvey Park hospital precinct, where the professional and medical demographic has genuine quality expectations and high repeat-visit frequency. The CBD and Kooringal suit volume-focused casual dining and convenience food formats that serve the full residential catchment. Growth corridor suburbs suit community-oriented cafe and casual dining concepts that build local loyalty before competition arrives. The common failure pattern in Wagga Wagga is operators who apply coastal city revenue assumptions to a regional market — the volume ceiling is real, and business cases must be calibrated to the catchment scale rather than aspirational comparisons to larger cities.",
  },
  {
    question: 'Is there seasonality risk in Wagga Wagga?',
    answer:
      "Wagga Wagga has very low seasonality risk compared to coastal tourism markets. The city's demand base is structural — Defence, health, and university employment — rather than tourist-driven, meaning trade is consistent across 52 weeks of the year with minimal seasonal variation. There are modest uplifts around major local events (RAAF Base open days, Charles Sturt University graduation weeks, regional agricultural shows) and modest softening during the December to January holiday period when some university and Defence activity reduces. Operators who project consistent revenue across all 12 months will find Wagga Wagga one of the most predictable hospitality markets in regional NSW.",
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

function WaggaWaggaFactorDirectory() {
  const suburbs = getWaggaWaggaSuburbs().slice().sort((a, b) => b.compositeScore - a.compositeScore)
  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      {suburbs.map((s) => {
        const verdictColor = s.verdict === 'GO' ? C.emerald : s.verdict === 'CAUTION' ? C.amber : C.red
        const verdictBg = s.verdict === 'GO' ? C.emeraldBg : s.verdict === 'CAUTION' ? C.amberBg : C.redBg
        const verdictBdr = s.verdict === 'GO' ? C.emeraldBdr : s.verdict === 'CAUTION' ? C.amberBdr : C.redBdr
        return (
          <Link key={s.slug} href={`/analyse/wagga-wagga/${s.slug}`} style={{ textDecoration: 'none' }}>
            <div style={{ backgroundColor: C.white, border: `1px solid ${C.border}`, borderRadius: '14px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: C.n900, margin: 0 }}>{s.name}</h3>
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

export default function WaggaWaggaPage() {
  return (
    <div style={{ backgroundColor: '#FFFFFF', color: '#1C1917', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />

      <CityHero
        cityName="Wagga Wagga"
        citySlug="wagga-wagga"
        tagline="The Riverina's largest city has a structural demand base that most regional markets cannot match — Defence, health, and university employment drive year-round trade independent of tourism or seasonal cycles."
        statChips={[
          { text: '8 suburbs scored — CBD to northern growth corridors' },
          { text: 'Defence, hospital, and university workforce: year-round demand anchors' },
          { text: 'Fitzmaurice Street: the premium dining corridor in inland NSW' },
        ]}
      />

      <div style={{ backgroundColor: C.amberBg, borderBottom: `1px solid ${C.amberBdr}`, padding: '12px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ fontSize: '13px', color: C.amber, margin: 0 }}>
            <strong>Methodology:</strong> Scores based on foot traffic density, demographic income distribution, commercial rent viability, competitive density, and accessibility. Data sourced from ABS 2024, NSW DPIE Q1 2026, and Locatalyze proprietary foot traffic analysis.
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
              { value: '68K', label: 'Wagga Wagga urban population — largest inland city in New South Wales', source: 'ABS 2024' },
              { value: 'RAAF', label: 'RAAF Base Wagga — Defence workforce driving above-average household incomes year-round', source: 'Defence Housing Australia 2025' },
              { value: 'CSU', label: 'Charles Sturt University campus — student and academic workforce generating weekday demand', source: 'CSU 2025' },
              { value: '$2K', label: 'Fitzmaurice Street rents from $2,000/month — quality dining corridor at regional pricing', source: 'NSW DPIE Q1 2026' },
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
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '28px' }}>Wagga Wagga Business Landscape — 2026</h2>
          <div style={{ display: 'grid', gap: '22px' }}>
            {[
              "Wagga Wagga is the largest inland city in New South Wales and the economic capital of the Riverina — a position that gives it a structural demand profile unlike most comparable regional cities. The city's hospitality market is built on three employment anchors: RAAF Base Wagga (one of Australia's largest Air Force bases), the Wagga Wagga Rural Referral Hospital (the principal referral hospital for much of inland NSW), and Charles Sturt University. These three institutions generate a year-round, largely recession-resistant demand base of well-paid professionals whose spending habits sustain the city's commercial precincts through seasonal and economic cycles.",
              "The premium dining corridor on Fitzmaurice Street has matured into one of the most credible independent hospitality strips in inland NSW. A decade of owner-operated cafes and restaurants have built a food culture that is above the expectations of a regional city of 68,000 people. The professional and medical demographic that anchors this strip has the income, the frequency, and the quality standards to sustain operators who execute well. This is the market to target for specialty hospitality concepts — not the easier volume-based CBD, but the more rewarding professional and lifestyle market on Fitzmaurice Street.",
              "The growth corridors in Wagga Wagga's northern fringe — Forest Hill, Estella, and Glenfield Park — represent a different type of opportunity. Significant residential development pipelines are delivering new households with above-average incomes and strong food culture expectations into precincts with near-zero existing hospitality supply. The first-mover advantage in these suburbs is genuine: operators who establish community loyalty before competition arrives build institutions that persist as the suburb grows around them. The requirement is patience — revenue ramps with the residential population over 12 to 24 months.",
              "Operators who enter Wagga Wagga with coastal city revenue assumptions will consistently underperform. The market is genuine, the demand is structural, and the rents are lower than coastal equivalents — but the revenue ceiling reflects a city of 68,000 people, not 200,000. The businesses that succeed in Wagga Wagga are those that correctly calibrate their cost structures and revenue projections to the regional market, build genuine community loyalty, and exploit the structural demand anchors of Defence, health, and university employment that make Wagga Wagga more stable than most regional hospitality markets.",
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
              { type: 'Cafes & Specialty Coffee', insight: "Fitzmaurice Street is the primary specialty cafe market — the professional and medical demographic expects quality and repeats frequently. Turvey Park hospital precinct has strong weekday breakfast and lunch demand. CBD suits volume-focused cafe formats. Growth corridors (Estella, Forest Hill) offer first-mover community cafe opportunities.", best: ['Fitzmaurice Street', 'Turvey Park', 'Wagga Wagga CBD'] },
              { type: 'Full-Service Restaurants', insight: "Fitzmaurice Street is the dining destination in Wagga Wagga — the street has built a city-wide reputation for quality dining that draws from the entire urban catchment. CBD suits casual dining formats at higher volume. Turvey Park suits quality lunch concepts serving the hospital precinct.", best: ['Fitzmaurice Street', 'Wagga Wagga CBD', 'Turvey Park'] },
              { type: 'Retail (Independent)', insight: "The CBD delivers the highest retail foot traffic in the Riverina. Kooringal suits suburban retail serving the southern residential catchment with supermarket-anchored foot traffic. Fitzmaurice Street suits specialty retail targeting the professional demographic.", best: ['Wagga Wagga CBD', 'Kooringal', 'Fitzmaurice Street'] },
              { type: 'Fitness & Wellness', insight: "The professional and medical demographic in Turvey Park and the Fitzmaurice Street precinct has strong demand for allied health, boutique fitness, and wellness services. CBD suits high-volume fitness formats. Growth corridors (Estella, Forest Hill) suit community-focused wellness concepts.", best: ['Turvey Park', 'Fitzmaurice Street', 'Wagga Wagga CBD'] },
              { type: 'Quick Service & Convenience', insight: "Kooringal delivers the highest convenience food foot traffic volume through supermarket-anchored retail. CBD suits quick-service formats at peak lunchtime. Tolland and working-class western suburbs offer low-rent opportunities for correctly priced value-focused concepts.", best: ['Kooringal', 'Wagga Wagga CBD', 'Tolland'] },
              { type: 'Community & First-Mover Concepts', insight: "Forest Hill, Estella, and Glenfield Park are growth corridors with near-zero hospitality supply. First operators establish community dining habits before competition arrives. Low rents reduce the cost of the ramp-up period. Requires 12 to 18 months before the catchment reaches operating density.", best: ['Estella', 'Forest Hill', 'Glenfield Park'] },
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
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: C.n900, marginBottom: '12px', lineHeight: '1.2' }}>Top Wagga Wagga Suburbs to Open a Business (2026)</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px', maxWidth: '760px' }}>Ranked by overall viability score across foot traffic, demographics, rent economics, competition gap, and growth trajectory.</p>
          <div style={{ display: 'grid', gap: '16px' }}>
            {[
              { rank: 1, name: 'Wagga Wagga CBD', slug: 'wagga-wagga-cbd', verdict: wVerdict('wagga-wagga-cbd'), score: wScore('wagga-wagga-cbd'), rentFrom: '$3,000/mo', body: "Baylis and Fitzmaurice Streets are the commercial heart of the Riverina. Defence, hospital, and university employment drives year-round demand that does not collapse with seasons or economic cycles. The CBD demands differentiation — the best operators earn loyal customers from the largest catchment in the region." },
              { rank: 2, name: 'Fitzmaurice Street', slug: 'fitzmaurice-street', verdict: wVerdict('fitzmaurice-street'), score: wScore('fitzmaurice-street'), rentFrom: '$2,000/mo', body: "Wagga Wagga's premium dining and cafe corridor. The professional and medical demographic here visits frequently and spends well — a loyal professional customer visiting four to five times per week generates more annual revenue than many dozen tourist interactions. Below-CBD rents with above-CBD average spend." },
              { rank: 3, name: 'Turvey Park', slug: 'turvey-park', verdict: wVerdict('turvey-park'), score: wScore('turvey-park'), rentFrom: '$1,800/mo', body: "Adjacent to the Wagga Wagga Rural Referral Hospital — one of the largest regional hospitals in NSW. Medical and allied health professionals with above-average incomes and daily food and coffee needs. The hospital precinct generates predictable, consistent weekday trade that is among the most recession-resistant demand bases in regional hospitality." },
              { rank: 4, name: 'Kooringal', slug: 'kooringal', verdict: wVerdict('kooringal'), score: wScore('kooringal'), rentFrom: '$1,200/mo', body: "The principal southern suburban hub. Major supermarket anchors guarantee baseline foot traffic across 52 weeks of the year. Working and middle-income family demographic with consistent spend on convenience food and casual dining. Lower rents than the CBD with genuine volume potential from the large southern residential catchment." },
              { rank: 5, name: 'Forest Hill', slug: 'forest-hill', verdict: wVerdict('forest-hill'), score: wScore('forest-hill'), rentFrom: '$800/mo', body: "New northern estate with a young family demographic and near-zero hospitality competition. The first quality operator to establish here builds community loyalty before any alternative exists. Low rents reduce the cost of the establishment phase. Requires a 12 to 18-month ramp-up as the residential catchment grows." },
              { rank: 6, name: 'Estella', slug: 'estella', verdict: wVerdict('estella'), score: wScore('estella'), rentFrom: '$800/mo', body: "Rapidly growing masterplan community with above-average household incomes and strong food culture expectations. Near-zero existing hospitality supply. Developer incentives and graduated rent structures support early-market operators through the ramp-up period. First-mover loyalty is the structural return on early entry." },
              { rank: 7, name: 'Tolland', slug: 'tolland', verdict: wVerdict('tolland'), score: wScore('tolland'), rentFrom: '$600/mo', body: "Western working-class suburb with limited hospitality supply relative to resident population. Very low rents create viable economics for community-oriented convenience food concepts at the right price point. Not a destination dining market — a community-service opportunity for operators who explicitly choose to serve this catchment." },
              { rank: 8, name: 'Glenfield Park', slug: 'glenfield-park', verdict: wVerdict('glenfield-park'), score: wScore('glenfield-park'), rentFrom: '$600/mo', body: "Western fringe growth corridor at early-stage development. The residential pipeline will deliver genuine hospitality demand over three to five years. Very low rents make the early-stage economics manageable. A patient-capital opportunity for operators who can commit before the catchment reaches maturity." },
            ].map((suburb) => {
              const vBg = suburb.verdict === 'GO' ? C.emeraldBg : suburb.verdict === 'CAUTION' ? C.amberBg : C.redBg
              const vColor = suburb.verdict === 'GO' ? C.emerald : suburb.verdict === 'CAUTION' ? C.amber : C.red
              const vBdr = suburb.verdict === 'GO' ? C.emeraldBdr : suburb.verdict === 'CAUTION' ? C.amberBdr : C.redBdr
              return (
                <Link key={suburb.slug} href={`/analyse/wagga-wagga/${suburb.slug}`} style={{ textDecoration: 'none' }}>
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

      <section style={{ padding: '48px 24px', background: 'linear-gradient(135deg, #422006 0%, #92400E 100%)', textAlign: 'center' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px', lineHeight: '1.3' }}>Have a specific Wagga Wagga address in mind?</h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', marginBottom: '24px', lineHeight: '1.65' }}>Get a full foot traffic analysis, competitor map, rent benchmarks, and GO/CAUTION/NO verdict for any Wagga Wagga address. Free.</p>
          <Link href="/onboarding" style={{ display: 'inline-block', padding: '14px 30px', backgroundColor: '#FEF3C7', color: '#422006', borderRadius: '8px', textDecoration: 'none', fontSize: '15px', fontWeight: 800 }}>
            Analyse your Wagga Wagga address →
          </Link>
        </div>
      </section>

      <section id="suburbs" style={{ padding: '56px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '12px' }}>Wagga Wagga Suburb Directory — By Category</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px' }}>8 suburbs grouped by risk profile and market type.</p>
          {SUBURB_CATEGORIES.map((cat) => (
            <div key={cat.title} style={{ marginBottom: '52px' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: C.brand, marginBottom: '6px' }}>{cat.title}</h3>
                <p style={{ fontSize: '14px', color: C.muted, margin: 0 }}>{cat.description}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '16px' }}>
                {cat.suburbs.map((s) => (
                  <SuburbCard key={s.slug} name={s.name} slug={s.slug} citySlug="wagga-wagga" description={s.description} score={s.score} verdict={s.verdict} rentRange={s.rentRange} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>Quick Comparison — Top Wagga Wagga Suburbs</h2>
          <ComparisonTable rows={COMPARISON_ROWS} />
        </div>
      </section>

      <section id="comparisons" style={{ padding: '48px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>Head-to-Head: Suburb Comparisons</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
            {[
              { title: 'Fitzmaurice Street vs CBD', body: "Fitzmaurice Street and the CBD serve fundamentally different market segments. The CBD on Baylis Street delivers the highest raw foot traffic volume in the Riverina — suited to volume-driven casual dining, retail, and convenience formats that convert high foot traffic into revenue. Fitzmaurice Street is the quality-hospitality corridor with a professional and medical demographic that spends more per visit, visits more frequently, and builds stronger loyalty with operators who execute well. The lower rent on Fitzmaurice Street relative to prime Baylis Street positions, combined with the higher average spend, can produce better margin economics for quality concepts than the CBD. The choice is volume (CBD) versus quality (Fitzmaurice Street)." },
              { title: 'Turvey Park vs Fitzmaurice Street', body: "Both serve professional and medical demographics and both have above-average spend characteristics, but the Turvey Park opportunity is more narrowly focused on the hospital precinct trade. Turvey Park is strongest for weekday breakfast, brunch, and lunch formats that serve the shift patterns of the hospital workforce — a highly predictable, consistent revenue base. Fitzmaurice Street is a more complete hospitality market with evening dining, specialty coffee, and a broader professional catchment extending beyond the hospital. Operators who want to focus on the hospital precinct should consider Turvey Park first; those who want the full professional dining market should choose Fitzmaurice Street." },
              { title: 'Growth corridors vs established suburbs', body: "The growth corridors (Estella, Forest Hill, Glenfield Park) offer near-zero competition, low rents, and first-mover positioning — but require a ramp-up period of 12 to 24 months before the residential catchment reaches operating density. Established suburbs (Kooringal, Turvey Park) have existing operator competition but immediate revenue potential from a full residential or professional catchment. The decision comes down to operator risk tolerance: growth corridors reward patience with first-mover loyalty; established suburbs reward execution with immediate volume. Both paths are viable in the Wagga Wagga market — the failure mode is applying a growth corridor strategy with an operator profile that requires immediate cash flow." },
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
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '8px' }}>Risk Zones — What Every Wagga Wagga Operator Must Plan For</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '28px' }}>Three failure patterns that account for most Wagga Wagga business underperformance.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {[
              { name: 'Coastal revenue assumptions in a regional market', why: "The most common failure pattern in Wagga Wagga is operators who project revenue densities based on coastal city comparators. A 68,000-person inland city cannot sustain the revenue volumes of a 150,000-person coastal centre, and operators who build business cases on Sydney or Gold Coast comparisons will consistently miss projections. The correct frame is: what does this specific catchment generate at realistic visit frequency and ticket values? Operators who model conservatively and calibrate to the regional market find Wagga Wagga sustainable. Those who borrow coastal revenue assumptions fail." },
              { name: 'Entering growth corridors without capital for the ramp-up', why: "Forest Hill, Estella, and Glenfield Park offer genuine first-mover opportunity but require operators to fund a ramp-up period where revenue builds with the residential population. Operators who enter these corridors with minimal working capital reserves and require immediate full-volume trading are structurally exposed. The growth corridor opportunity is best suited to operators with sufficient reserves to sustain 12 to 18 months of below-full-volume trading before the catchment matures." },
              { name: 'Generic concepts competing against established Fitzmaurice Street operators', why: "Fitzmaurice Street has genuine incumbents with years of community loyalty and established customer relationships. Generic hospitality concepts that do not offer a clear point of difference from the existing operator base will struggle to displace loyal customers or attract new ones. The market rewards operators who offer something the street does not already have — whether in cuisine, format, price point, or experience design. Replicate what is already there and compete for the same customers at a disadvantage." },
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
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: C.n900, marginBottom: '10px', lineHeight: '1.2' }}>Wagga Wagga Suburb Factor Breakdown — All 8 Markets</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '36px', maxWidth: '760px' }}>Engine-derived scores across demand, rent pressure, competition density, seasonality, and tourism for every suburb in the dataset. Sorted by composite score. Click any suburb for the full detail page.</p>
          <WaggaWaggaFactorDirectory />
        </div>
      </section>

      <FAQSection faqs={FAQS} title="Wagga Wagga Business Location — FAQ" id="faq" />

      <CTASection
        title="Ready to find your Wagga Wagga location?"
        subtitle="Run a free analysis on any Wagga Wagga address. Get foot traffic data, demographic breakdown, rent benchmarks, and competitive analysis in minutes."
        variant="green"
      />

      <section style={{ padding: '28px 24px', backgroundColor: C.n50, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '13px' }}>
          <Link href="/analyse" style={{ color: C.brand, fontWeight: 600, textDecoration: 'none' }}>← All Cities</Link>
          <Link href="/analyse/wagga-wagga/wagga-wagga-cbd" style={{ color: C.brand, textDecoration: 'none' }}>Wagga Wagga CBD Analysis →</Link>
          <Link href="/analyse/wagga-wagga/fitzmaurice-street" style={{ color: C.brand, textDecoration: 'none' }}>Fitzmaurice Street Analysis →</Link>
          <Link href="/analyse/wagga-wagga/turvey-park" style={{ color: C.brand, textDecoration: 'none' }}>Turvey Park Analysis →</Link>
        </div>
      </section>
    </div>
  )
}
