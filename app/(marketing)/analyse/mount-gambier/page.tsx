// app/(marketing)/analyse/mount-gambier/page.tsx
// Mount Gambier city hub — server component, engine scores, FactorGrid directory

import Link from 'next/link'
import type { Metadata } from 'next'
import { CityHero } from '@/components/analyse/CityHero'
import { SuburbCard } from '@/components/analyse/SuburbCard'
import { ComparisonTable } from '@/components/analyse/ComparisonTable'
import { FAQSection } from '@/components/analyse/FAQSection'
import { CTASection } from '@/components/analyse/CTASection'
import { C } from '@/components/analyse/AnalyseTheme'
import { FactorGrid } from '@/components/analyse/FactorGrid'
import { getMountGambierSuburb, getMountGambierSuburbs } from '@/lib/analyse-data/mount-gambier'

function mgScore(slug: string): number {
  return getMountGambierSuburb(slug)?.compositeScore ?? 0
}
function mgVerdict(slug: string): 'GO' | 'CAUTION' | 'NO' {
  const v = getMountGambierSuburb(slug)?.verdict
  if (v === 'GO') return 'GO'
  if (v === 'CAUTION') return 'CAUTION'
  return 'NO'
}

export const metadata: Metadata = {
  title: 'Best Suburbs to Open a Business in Mount Gambier — 2026 Location Guide',
  description:
    'Mount Gambier business location guide 2026. 7 suburbs scored by foot traffic, rent viability, demographics, and competition gap. Find the best Mount Gambier suburb for your cafe, restaurant, retail or service business.',
  alternates: { canonical: 'https://locatalyze.com/analyse/mount-gambier' },
  openGraph: {
    title: 'Best Suburbs to Open a Business in Mount Gambier — 2026 Location Guide',
    description:
      '7 Mount Gambier suburbs ranked and scored. Lowest commercial rents in SA, Blue Lake tourism, timber industry workforce, and GO/CAUTION/NO verdicts.',
    url: 'https://locatalyze.com/analyse/mount-gambier',
  },
}

const COMPARISON_ROWS = [
  { name: 'Mount Gambier CBD', score: mgScore('mount-gambier-cbd'), verdict: mgVerdict('mount-gambier-cbd'), rent: '$1,200–$3,000', footTraffic: 'High', bestFor: 'Dining, retail, professional services' },
  { name: 'Moorak', score: mgScore('moorak'), verdict: mgVerdict('moorak'), rent: '$900–$2,000', footTraffic: 'Medium', bestFor: 'Family cafe, convenience food' },
  { name: 'Suttontown', score: mgScore('suttontown'), verdict: mgVerdict('suttontown'), rent: '$800–$1,800', footTraffic: 'Low-Medium', bestFor: 'Essential services, tradie breakfast and lunch' },
  { name: 'Mount Gambier South', score: mgScore('mount-gambier-south'), verdict: mgVerdict('mount-gambier-south'), rent: '$900–$2,000', footTraffic: 'Medium', bestFor: 'Residential cafe, quality dining' },
  { name: 'Mil Lel', score: mgScore('mil-lel'), verdict: mgVerdict('mil-lel'), rent: '$600–$1,500', footTraffic: 'Low', bestFor: 'Community services, rural essentials' },
  { name: 'Millicent', score: mgScore('millicent'), verdict: mgVerdict('millicent'), rent: '$700–$1,800', footTraffic: 'Low-Medium', bestFor: 'Satellite town services, highway trade' },
  { name: 'Carpenter Rocks', score: mgScore('carpenter-rocks'), verdict: mgVerdict('carpenter-rocks'), rent: '$500–$1,200', footTraffic: 'Low (seasonal)', bestFor: 'Coastal tourism, seasonal takeaway' },
]

const SUBURB_CATEGORIES = [
  {
    title: 'City Centre — Commercial Spine',
    description:
      'Mount Gambier CBD anchors the Commercial Street precinct — the dominant service and dining centre for a regional catchment that spans south-east SA and cross-border communities from south-west VIC. The lowest commercial rents of any SA regional city of equivalent scale make this one of the most financially accessible CBD entry points in the country.',
    suburbs: [
      {
        name: 'Mount Gambier CBD',
        slug: 'mount-gambier-cbd',
        description:
          'Commercial Street is the primary retail and dining strip, anchoring a catchment of approximately 32,000 urban residents plus rural and cross-border trade from south-west VIC. Blue Lake tourism (220,000 annual visitors) creates genuine visitor foot traffic. Lowest commercial rents of any SA regional city makes entry economics highly attractive.',
        score: mgScore('mount-gambier-cbd'),
        verdict: mgVerdict('mount-gambier-cbd'),
        rentRange: '$1,200–$3,000/mo',
      },
    ],
  },
  {
    title: 'Residential Growth — Family Demographics',
    description:
      'Moorak and Mount Gambier South serve growing and established residential communities with moderate to higher household incomes. Both are underserved by quality hospitality relative to their catchment size, creating first-mover and differentiation opportunities for quality operators who build genuine community loyalty.',
    suburbs: [
      {
        name: 'Moorak',
        slug: 'moorak',
        description:
          'Southern residential growth corridor where new family housing development is creating an emerging catchment. Families relocating from Adelaide bring food culture expectations to a market with very low competition. First-mover operators who establish a family-focused cafe or casual dining concept capture the growing community before competition follows.',
        score: mgScore('moorak'),
        verdict: mgVerdict('moorak'),
        rentRange: '$900–$2,000/mo',
      },
      {
        name: 'Mount Gambier South',
        slug: 'mount-gambier-south',
        description:
          'Established residential suburb with above-average household incomes and proximity to the Blue Lake southern approach. Limited existing hospitality supply relative to the income profile creates room for quality independent operators. Reliable community trade with modest tourism adjacency from Blue Lake visitors.',
        score: mgScore('mount-gambier-south'),
        verdict: mgVerdict('mount-gambier-south'),
        rentRange: '$900–$2,000/mo',
      },
    ],
  },
  {
    title: 'Industrial and Service Fringe',
    description:
      'Suttontown and Mil Lel serve working populations at the industrial and rural fringe of Mount Gambier. Very low rents and limited competition create accessible entry economics, but revenue ceilings are real and require honest modelling. Tradie and essential-service concepts with lean cost structures find the most viable path.',
    suburbs: [
      {
        name: 'Suttontown',
        slug: 'suttontown',
        description:
          'Northern industrial and residential fringe with a blue-collar and tradie workforce that creates genuine breakfast and lunch demand. Almost no direct hospitality competition. Very low rents make a lean daytime-trade concept financially viable at modest revenue volumes. Revenue is concentrated into two daily windows — operators must model this honestly.',
        score: mgScore('suttontown'),
        verdict: mgVerdict('suttontown'),
        rentRange: '$800–$1,800/mo',
      },
      {
        name: 'Mil Lel',
        slug: 'mil-lel',
        description:
          'Rural fringe area 10km north with a small farming and hobby-farm community. Very low rents and essentially no commercial hospitality. The revenue ceiling is real and modest — the catchment is small and residents access the CBD for most commercial needs. Viable only for very lean essential-service concepts calibrated to the genuine scale of the market.',
        score: mgScore('mil-lel'),
        verdict: mgVerdict('mil-lel'),
        rentRange: '$600–$1,500/mo',
      },
    ],
  },
  {
    title: 'Satellite Markets — Millicent and Carpenter Rocks',
    description:
      'Millicent is a genuine satellite town with its own commercial catchment and Princes Highway passing trade. Carpenter Rocks is a highly seasonal coastal village suited only to lean seasonal operations. Both reward operators who honestly model the available market scale rather than projecting growth-stage economics.',
    suburbs: [
      {
        name: 'Millicent',
        slug: 'millicent',
        description:
          'Self-contained satellite town 45km north with a population of approximately 5,000. Agricultural, forestry, and highway passing trade create a multi-source hospitality demand. Very low rents make the economics of a quality small-town concept workable. Operators who serve locals, industry workers, and highway travellers build the most resilient revenue base.',
        score: mgScore('millicent'),
        verdict: mgVerdict('millicent'),
        rentRange: '$700–$1,800/mo',
      },
      {
        name: 'Carpenter Rocks',
        slug: 'carpenter-rocks',
        description:
          'Small coastal village 30km south with rock lobster fishing heritage and highly seasonal holiday-maker trade. Revenue concentrates into December-January summer peak and Easter shoulder. Very low rents make a lean seasonal operation financially viable. Outside the peaks, the village population drops sharply — the business model must be built around very low fixed costs.',
        score: mgScore('carpenter-rocks'),
        verdict: mgVerdict('carpenter-rocks'),
        rentRange: '$500–$1,200/mo',
      },
    ],
  },
]

const FAQS = [
  {
    question: 'How does Blue Lake tourism affect Mount Gambier businesses?',
    answer:
      'The Blue Lake draws approximately 220,000 visitors annually to Mount Gambier, making it one of South Australia\'s most visited natural attractions. The lake\'s famous colour change from grey to brilliant blue occurs in September and maintains through to March, creating a seasonally concentrated but genuine visitor interest across the warmer months. For CBD businesses on Commercial Street, this translates to real visitor foot traffic that supplements the local commercial trade from September to March. The Umpherston Sinkhole and Cave Garden operate year-round and provide additional visitor draw outside the blue-lake season. The important framing is that Blue Lake tourism is a meaningful supplementary revenue layer for well-positioned CBD operators — not the primary market driver. The stable agricultural, forestry, and local commercial catchment is what sustains year-round trade.',
  },
  {
    question: 'Does the timber and forestry industry affect local hospitality demand?',
    answer:
      'Yes, significantly. The plantation forestry and timber processing industry around Mount Gambier employs a substantial workforce that includes mill workers, foresters, logistics operators, and tradespersons who create consistent daily demand for breakfast and lunch hospitality. This workforce component is one of the key factors that gives Mount Gambier a more stable commercial catchment than its population size alone would suggest — the industry workforce effectively extends the commercial demand base beyond the resident consumer population. For operators in the CBD and in fringe locations like Suttontown, the forestry and trades workforce is a genuine and reliable customer segment that operates on predictable daily patterns largely independent of tourism or seasonal cycles.',
  },
  {
    question: 'How does the SA-VIC border catchment work for Mount Gambier businesses?',
    answer:
      'Mount Gambier sits approximately 15km from the SA-VIC border, and the broader commercial catchment includes communities in south-west Victoria such as Portland, Heywood, and Casterton. Residents of south-west VIC regularly travel to Mount Gambier for commercial, health, and retail services because it is their nearest major regional centre, regardless of the state border. This cross-border retail flow is a structural feature of the Mount Gambier market that extends the effective catchment beyond what the SA population data alone would indicate. For retail operators, this means that the active catchment is materially larger than the 32,000-person Mount Gambier urban population. For hospitality operators, it means occasional visits from cross-border communities add to the local trade base on weekends and during major events.',
  },
  {
    question: 'Is Commercial Street a strong opportunity for a new cafe or restaurant?',
    answer:
      'Commercial Street is the strongest commercial dining address in Mount Gambier, and the financial argument is compelling: it offers the active foot traffic of a functioning regional commercial hub at the lowest commercial rents of any SA regional city of comparable scale. A quality CBD position in Mount Gambier costs $1,200 to $3,000 per month — far below what an equivalent position costs in regional SA, VIC, or NSW cities of similar catchment size. The competitive landscape has room to improve: existing hospitality on Commercial Street is functional rather than premium in most categories. A quality cafe or restaurant that lifts the standard above the existing supply finds a receptive market from both locals who want better options and visitors who expect quality. The combination of low rents and a below-average existing quality bar is an unusual structural advantage for new operators.',
  },
  {
    question: 'What is the opportunity in Moorak and the southern growth corridor?',
    answer:
      'Moorak is experiencing residential growth driven by families and couples relocating from Adelaide and from rural SA who are seeking lifestyle change and lower housing costs. This demographic brings metropolitan food culture expectations to a regional market — they have experienced quality independent cafes and casual dining in Adelaide, and they look for equivalent quality near their new home. The commercial activation of Moorak has lagged the residential development, which means the food culture demand exists without adequate supply to meet it. A first-mover operator who establishes a genuine community cafe or family-focused casual dining concept in Moorak captures this growing catchment before competition follows. The key risk is the early-stage nature of the market — trade builds gradually as the residential population grows and the community develops, which requires operators to model a ramp-up period rather than immediate mature revenues.',
  },
  {
    question: 'How does seasonality affect Mount Gambier compared to other regional markets?',
    answer:
      'Mount Gambier has lower structural seasonality than most comparable regional cities with tourism elements, which is one of its commercial strengths. The agricultural and forestry industry workforce provides a stable year-round commercial catchment that does not collapse outside the tourist season. Blue Lake tourism peaks September to March but the underlying local economy continues independently. Carpenter Rocks is the one high-seasonality location in the dataset — the coastal holiday trade is almost entirely concentrated into December-January and Easter, with the village effectively empty outside those windows. For operators considering the CBD or residential suburbs, seasonality is a manageable factor rather than a structural risk. The honest assessment is that Mount Gambier\'s non-seasonal commercial stability is a genuine advantage over more tourism-dependent regional markets.',
  },
  {
    question: 'Is Millicent worth considering, or is the Mount Gambier CBD always the better choice?',
    answer:
      'Millicent is worth serious consideration for operators who want to be a dominant market participant in a self-contained community rather than competing in the more developed Mount Gambier CBD. The Millicent commercial market has its own logic: 5,000 local residents, an agricultural and forestry industry workforce, and Princes Highway passing trade from the Adelaide-to-Mount Gambier route create a multi-source demand that supports a quality small-town hospitality concept at very low fixed costs. An operator who builds genuine market leadership in Millicent faces almost no quality competition from established independents. The trade-off is market scale — Millicent has a real revenue ceiling that is substantially lower than the CBD. The choice depends on what you are building: if you want to run the best cafe in a small town where you become a community institution, Millicent is viable. If you are building for growth and scale, the CBD catchment is the only appropriate starting point.',
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

function MountGambierFactorDirectory() {
  const suburbs = getMountGambierSuburbs().slice().sort((a, b) => b.compositeScore - a.compositeScore)
  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      {suburbs.map((s) => {
        const verdictColor = s.verdict === 'GO' ? C.emerald : s.verdict === 'CAUTION' ? C.amber : C.red
        const verdictBg = s.verdict === 'GO' ? C.emeraldBg : s.verdict === 'CAUTION' ? C.amberBg : C.redBg
        const verdictBdr = s.verdict === 'GO' ? C.emeraldBdr : s.verdict === 'CAUTION' ? C.amberBdr : C.redBdr
        return (
          <Link key={s.slug} href={`/analyse/mount-gambier/${s.slug}`} style={{ textDecoration: 'none' }}>
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

export default function MountGambierPage() {
  return (
    <div style={{ backgroundColor: '#FFFFFF', color: '#1C1917', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />

      <CityHero
        cityName="Mount Gambier"
        citySlug="mount-gambier"
        tagline="South Australia's second-largest regional city has the lowest commercial rents of any SA regional centre, a stable forestry and agricultural workforce, and a Blue Lake tourism market that supplements a year-round commercial economy."
        statChips={[
          { text: '7 suburbs scored — Commercial Street to coastal Carpenter Rocks' },
          { text: 'Blue Lake: 220,000 annual visitors — real CBD foot traffic uplift September to March' },
          { text: 'SA-VIC border catchment: south-west Victoria communities add to the effective trade area' },
        ]}
      />

      <div style={{ backgroundColor: C.amberBg, borderBottom: `1px solid ${C.amberBdr}`, padding: '12px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ fontSize: '13px', color: C.amber, margin: 0 }}>
            <strong>Methodology:</strong> Scores based on foot traffic density, demographic income distribution, commercial rent viability, competitive density, and accessibility. Data sourced from ABS 2024, SA Government Regional Data 2026, and Locatalyze proprietary foot traffic analysis.
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
            { label: 'Seasonality', href: '#seasonality' },
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
              { value: '32K', label: "Mount Gambier urban population — SA's largest regional city outside Adelaide", source: 'ABS 2024' },
              { value: '220K', label: 'Blue Lake annual visitors — one of SA\'s most visited natural attractions, colour change September to March', source: 'Tourism SA 2025' },
              { value: 'SA+VIC', label: 'Cross-border catchment — south-west VIC communities trade to Mount Gambier as their nearest major centre', source: 'ABS Regional Data 2024' },
              { value: '$1.2K', label: 'CBD commercial rents from $1,200/month — lowest of any SA regional city at this scale', source: 'REISA Q1 2026' },
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
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '28px' }}>Mount Gambier Business Landscape — 2026</h2>
          <div style={{ display: 'grid', gap: '22px' }}>
            {[
              "Mount Gambier is South Australia's largest regional city outside Adelaide and the dominant commercial centre for the Limestone Coast — a region of plantation forestry, dairy farming, and viticulture that generates a substantial and stable economic base largely independent of tourism cycles. Commercial Street is the primary retail and dining spine, serving a 32,000-person urban catchment plus rural and cross-border trade from south-west Victoria. The Blue Lake, Umpherston Sinkhole, and Cave Garden add genuine tourism volume to what is fundamentally a functioning commercial economy.",
              "The defining financial characteristic of Mount Gambier is its rent structure. Commercial rents on Commercial Street — $1,200 to $3,000 per month for a quality CBD position — are the lowest of any SA regional city of comparable scale. Equivalent positions in Victor Harbor, Whyalla, or Port Augusta cost materially more for a smaller catchment. This is not a sign of market weakness — it is a structural financial advantage that allows operators to reach break-even at lower revenue thresholds and to invest more in quality rather than rent.",
              "The cross-border catchment dynamic is often underestimated by operators who read only the SA population data. South-west Victorian communities — Portland, Heywood, Hamilton, Casterton — use Mount Gambier as their commercial hub because it is closer than any major Victorian centre. This cross-border retail and service flow extends the effective catchment beyond what the 32,000-person urban figure implies. For retail concepts, this adds real volume. For hospitality, it adds weekend and occasion trade from communities that travel to Mount Gambier for their commercial needs.",
              "The honest assessment of the competitive landscape is that the existing hospitality offer in Mount Gambier has room to improve. Commercial Street has functional operators across cafes, casual dining, and retail — but the quality ceiling has not been pushed by the competitive intensity that larger markets create. An operator with strong execution and a genuine commitment to quality has the opportunity to become the market-leading option in their category at rents that remove the financial pressure that equivalent ambitions would create in larger markets.",
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
              { type: 'Cafes & Specialty Coffee', insight: 'Commercial Street CBD is the strongest cafe market — active foot traffic from locals, industry workers, and Blue Lake visitors who are looking for quality coffee and food. Moorak is the first-mover community cafe opportunity in the southern growth corridor. Mount Gambier South suits quality independent cafes targeting the established residential demographic with above-average incomes.', best: ['Mount Gambier CBD', 'Moorak', 'Mount Gambier South'] },
              { type: 'Full-Service Restaurants', insight: "Commercial Street is the destination dining address for the city. The Blue Lake visitor market provides genuine dinner trade during the tourism season, and the local commercial catchment sustains year-round restaurant demand. Mount Gambier's low rents make a quality restaurant financially viable at a lower revenue threshold than equivalent regional positions in VIC or NSW.", best: ['Mount Gambier CBD', 'Mount Gambier South'] },
              { type: 'Retail (Independent)', insight: "Commercial Street has the highest retail foot traffic in the city with a cross-border catchment that substantially exceeds the urban population. The existing retail quality has room for improvement in most categories — specialty independents who bring something genuinely new to the Commercial Street mix find receptive audiences at very low occupancy costs.", best: ['Mount Gambier CBD', 'Moorak'] },
              { type: 'Fitness & Wellness', insight: "The CBD and southern residential suburbs have genuine demand for quality fitness and wellness services from the professional, forestry industry, and residential demographics. Mount Gambier South suits boutique wellness and allied health targeting the above-average income residential catchment. The CBD suits high-volume fitness formats with the broadest accessible catchment.", best: ['Mount Gambier CBD', 'Mount Gambier South', 'Moorak'] },
              { type: 'Trade and Industrial Services', insight: "Suttontown serves the northern industrial corridor where tradie and logistics businesses create consistent breakfast and lunch demand in a completely unmet market. The industrial fringe workforce is predictable, loyal when a quality operator establishes themselves, and the very low Suttontown rents make the financial model workable for a lean daytime-only concept.", best: ['Suttontown'] },
              { type: 'Community and Convenience', insight: "Moorak and Millicent are the clearest community and convenience opportunities. Moorak has growing residential demand from Adelaide migrants who expect quality near home. Millicent provides a self-contained satellite town market with 5,000 residents and highway trade. Both reward operators who build genuine community loyalty at very low fixed costs.", best: ['Moorak', 'Millicent', 'Mount Gambier South'] },
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
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: C.n900, marginBottom: '12px', lineHeight: '1.2' }}>Top Mount Gambier Suburbs to Open a Business (2026)</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px', maxWidth: '760px' }}>Ranked by overall viability score across foot traffic, demographics, rent economics, competition gap, and growth trajectory.</p>
          <div style={{ display: 'grid', gap: '16px' }}>
            {[
              { rank: 1, name: 'Mount Gambier CBD', slug: 'mount-gambier-cbd', verdict: mgVerdict('mount-gambier-cbd'), score: mgScore('mount-gambier-cbd'), rentFrom: '$1,200/mo', body: "Commercial Street is the dominant commercial and dining address for the Limestone Coast. Lowest commercial rents of any SA regional city at this scale, genuine Blue Lake tourism foot traffic September to March, and a cross-border catchment that extends into south-west VIC. Existing quality bar is below what a committed independent operator can deliver — significant room to lead the market." },
              { rank: 2, name: 'Moorak', slug: 'moorak', verdict: mgVerdict('moorak'), score: mgScore('moorak'), rentFrom: '$900/mo', body: "Southern residential growth corridor with growing family demographic and very low hospitality competition. Adelaide migrants bring food culture expectations to an underserved market. First-mover operators who establish genuine community positioning capture the growing catchment before competition follows. Pure residential trade — no seasonal complexity." },
              { rank: 3, name: 'Mount Gambier South', slug: 'mount-gambier-south', verdict: mgVerdict('mount-gambier-south'), score: mgScore('mount-gambier-south'), rentFrom: '$900/mo', body: "Established residential suburb with above-average household incomes and proximity to Blue Lake southern approach. Limited hospitality supply relative to the income profile. Quality cafe and restaurant concepts find a receptive audience among long-term Mount Gambier residents with genuine spending capacity and food culture expectations." },
              { rank: 4, name: 'Suttontown', slug: 'suttontown', verdict: mgVerdict('suttontown'), score: mgScore('suttontown'), rentFrom: '$800/mo', body: "Northern industrial fringe with a tradie and logistics workforce that creates concentrated breakfast and lunch demand in a completely unmet market. Very low rents make break-even achievable at modest revenue volumes. Revenue is concentrated into two daily windows — the model works only for operators who correctly calibrate opening hours and cost structure to match the demand pattern." },
              { rank: 5, name: 'Millicent', slug: 'millicent', verdict: mgVerdict('millicent'), score: mgScore('millicent'), rentFrom: '$700/mo', body: "Satellite town 45km north with its own commercial catchment of 5,000 residents plus agricultural and highway trade. Quality independents face limited competition from quality operators. Very low rents create workable economics for a well-positioned small-town concept. Revenue ceiling is real — not a growth market, but a viable community market for correctly calibrated operators." },
              { rank: 6, name: 'Mil Lel', slug: 'mil-lel', verdict: mgVerdict('mil-lel'), score: mgScore('mil-lel'), rentFrom: '$600/mo', body: "Rural fringe area with small farming community and very limited commercial activity. Lowest rents in the dataset. Revenue ceiling is modest — the catchment is small and most commercial needs are met by the Mount Gambier CBD. Viable only for very lean essential-service concepts that honestly model the available market scale." },
              { rank: 7, name: 'Carpenter Rocks', slug: 'carpenter-rocks', verdict: mgVerdict('carpenter-rocks'), score: mgScore('carpenter-rocks'), rentFrom: '$500/mo', body: "Coastal holiday village 30km south with highly seasonal summer and Easter trade. Revenue concentrates into a very short window — the village population drops sharply outside December-January and Easter. Very low rents and zero competition during peak season. The financial model must be built on very low fixed costs and maximum capture during the seasonal windows." },
            ].map((suburb) => {
              const vBg = suburb.verdict === 'GO' ? C.emeraldBg : suburb.verdict === 'CAUTION' ? C.amberBg : C.redBg
              const vColor = suburb.verdict === 'GO' ? C.emerald : suburb.verdict === 'CAUTION' ? C.amber : C.red
              const vBdr = suburb.verdict === 'GO' ? C.emeraldBdr : suburb.verdict === 'CAUTION' ? C.amberBdr : C.redBdr
              return (
                <Link key={suburb.slug} href={`/analyse/mount-gambier/${suburb.slug}`} style={{ textDecoration: 'none' }}>
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

      <section style={{ padding: '48px 24px', background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)', textAlign: 'center' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px', lineHeight: '1.3' }}>Have a specific Mount Gambier address in mind?</h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', marginBottom: '24px', lineHeight: '1.65' }}>Get a full foot traffic analysis, competitor map, rent benchmarks, and GO/CAUTION/NO verdict for any Mount Gambier or Limestone Coast address. Free.</p>
          <Link href="/onboarding" style={{ display: 'inline-block', padding: '14px 30px', backgroundColor: '#DBEAFE', color: '#1E3A8A', borderRadius: '8px', textDecoration: 'none', fontSize: '15px', fontWeight: 800 }}>
            Analyse your Mount Gambier address →
          </Link>
        </div>
      </section>

      <section id="suburbs" style={{ padding: '56px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '12px' }}>Mount Gambier Suburb Directory — By Category</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '40px' }}>7 suburbs grouped by risk profile and market type.</p>
          {SUBURB_CATEGORIES.map((cat) => (
            <div key={cat.title} style={{ marginBottom: '52px' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: C.brand, marginBottom: '6px' }}>{cat.title}</h3>
                <p style={{ fontSize: '14px', color: C.muted, margin: 0 }}>{cat.description}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '16px' }}>
                {cat.suburbs.map((s) => (
                  <SuburbCard key={s.slug} name={s.name} slug={s.slug} citySlug="mount-gambier" description={s.description} score={s.score} verdict={s.verdict} rentRange={s.rentRange} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>Quick Comparison — Mount Gambier Suburbs</h2>
          <ComparisonTable rows={COMPARISON_ROWS} />
        </div>
      </section>

      <section id="comparisons" style={{ padding: '48px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '24px' }}>Head-to-Head: Suburb Comparisons</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
            {[
              { title: 'CBD vs Moorak for a new cafe', body: "The CBD offers established foot traffic, the Blue Lake tourism overlay, and a proven commercial catchment — but you are competing in an active hospitality market where the quality bar is set by existing operators. Moorak offers almost no direct competition and a growing residential demographic with strong food culture expectations — but you are building trade from scratch in an emerging precinct. An operator who is genuinely confident in their product and can execute a quality community cafe concept has a clearer path to a loyal customer base in Moorak. An operator who needs established foot traffic to prove their model should start in the CBD." },
              { title: 'Mount Gambier CBD vs Millicent', body: "Choosing between the CBD and Millicent is a question of scale ambition versus market dominance. The CBD has a 32,000-person urban catchment, cross-border trade, and Blue Lake tourism — a genuine multi-source demand that allows growth-oriented operators to build scale over time. Millicent has a 5,000-person town and a highway passing trade — a more modest but very accessible market where you can be the dominant quality player from day one. For operators who want community leadership in a self-contained small town at the lowest possible financial risk, Millicent is a serious option. For operators building toward something larger, the CBD is the only starting point." },
              { title: 'Suttontown vs CBD for a breakfast-and-lunch concept', body: "A correctly positioned breakfast-and-lunch concept targeted at tradies and industrial workers would find virtually no competition in Suttontown at very low rents, versus meaningful competition in the CBD at higher occupancy costs. Suttontown demands a very specific execution: early open, lean menu, fast service, value pricing, and a format built entirely around the tradie demand pattern. Operators who try to run a full-service concept or conventional cafe hours in Suttontown will find that the demand does not support it. Operators who build precisely for the breakfast-and-lunch trade window find a loyal and consistent customer base at the lowest break-even threshold in the dataset." },
            ].map((comp) => (
              <div key={comp.title} style={{ padding: '24px', backgroundColor: C.white, borderRadius: '10px', border: `1px solid ${C.border}` }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: C.brand, marginBottom: '12px' }}>{comp.title}</h3>
                <p style={{ fontSize: '14px', color: C.n800, lineHeight: '1.7', margin: 0 }}>{comp.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="seasonality" style={{ padding: '48px 24px', backgroundColor: C.n50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: C.n900, marginBottom: '8px' }}>Seasonality in Mount Gambier — Lower Risk Than Most Tourism Markets</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '28px' }}>Three patterns that define the seasonal structure of the Mount Gambier market — and how to position against them.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {[
              { name: 'Carpenter Rocks seasonal cliff', why: "Carpenter Rocks is the most seasonal location in the dataset and the only one where seasonality is a genuine structural risk rather than a manageable factor. The coastal holiday trade concentrates almost entirely into December-January and Easter. Outside these windows, the village population drops sharply and commercial hospitality demand effectively disappears. The financial model for a Carpenter Rocks operation must be built on very low fixed costs and maximum revenue capture during the two peak windows. Operators who attempt year-round commercial operations without very low fixed costs will face losses for most of the calendar year." },
              { name: 'Over-indexing on Blue Lake season', why: "The Blue Lake tourism season (September to March) is a genuine and significant revenue uplift for CBD operators. The failure mode is operators who model Blue Lake season revenue as representative of the full year and then discover that April to August is materially softer on the tourism component. Mount Gambier\'s forestry, agricultural, and commercial catchment sustains a solid year-round base — the Blue Lake season is an addition to this, not a replacement for it. Build the financial model on the year-round local commercial demand, and treat the September-to-March tourism uplift as the bonus." },
              { name: 'Millicent shoulder period', why: "Millicent\'s multi-source demand structure — locals, industry workers, and highway passing trade — creates a more balanced seasonal profile than single-source markets. The winter months are quieter on highway passing trade as fewer tourists traverse the Adelaide-to-Mount Gambier Princes Highway route. The local and industry demand remains relatively stable year-round. Operators who build the Millicent model on the local and industry foundation, and treat the highway trade as a seasonal supplement, find the most resilient annual revenue profile for a small-town satellite market." },
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
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: C.n900, marginBottom: '10px', lineHeight: '1.2' }}>Mount Gambier Suburb Factor Breakdown — All 7 Markets</h2>
          <p style={{ fontSize: '15px', color: C.muted, marginBottom: '36px', maxWidth: '760px' }}>Engine-derived scores across demand, rent pressure, competition density, seasonality, and tourism for every suburb in the dataset. Sorted by composite score. Click any suburb for the full detail page.</p>
          <MountGambierFactorDirectory />
        </div>
      </section>

      <FAQSection faqs={FAQS} title="Mount Gambier Business Location — FAQ" id="faq" />

      <CTASection
        title="Ready to find your Mount Gambier location?"
        subtitle="Run a free analysis on any Mount Gambier or Limestone Coast address. Get foot traffic data, demographic breakdown, rent benchmarks, and competitive analysis in minutes."
        variant="green"
      />

      <section style={{ padding: '28px 24px', backgroundColor: C.n50, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '13px' }}>
          <Link href="/analyse" style={{ color: C.brand, fontWeight: 600, textDecoration: 'none' }}>← All Cities</Link>
          <Link href="/analyse/mount-gambier/mount-gambier-cbd" style={{ color: C.brand, textDecoration: 'none' }}>Mount Gambier CBD Analysis →</Link>
          <Link href="/analyse/mount-gambier/moorak" style={{ color: C.brand, textDecoration: 'none' }}>Moorak Analysis →</Link>
          <Link href="/analyse/mount-gambier/millicent" style={{ color: C.brand, textDecoration: 'none' }}>Millicent Analysis →</Link>
        </div>
      </section>
    </div>
  )
}
