'use client'
// app/(marketing)/analyse/newcastle/best-suburbs/page.tsx
// Newcastle location intelligence guide — 20 suburbs, SaaS-style layout, conversion-focused

import Link from 'next/link'
import { useState } from 'react'

// ── Schema ─────────────────────────────────────────────────────────────────────
const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Best Suburbs in Newcastle to Open a Café, Restaurant or Retail Business (2026)',
  author: { '@type': 'Organization', name: 'Locatalyze', url: 'https://www.locatalyze.com' },
  publisher: { '@type': 'Organization', name: 'Locatalyze' },
  datePublished: '2026-04-01',
  dateModified: '2026-04-18',
  url: 'https://www.locatalyze.com/analyse/newcastle/best-suburbs',
  description:
    'Data-backed guide to the best Newcastle suburbs for cafés, restaurants, and retail. Rent benchmarks, foot traffic, competition levels, and suburb-by-suburb analysis for 20 Newcastle locations.',
}

// ── Types ──────────────────────────────────────────────────────────────────────
type Level   = 'Low' | 'Medium' | 'High'
type Verdict = 'GO' | 'CAUTION' | 'AVOID'
type BizType = 'Café' | 'Restaurant' | 'Retail' | 'Gym' | 'Takeaway'

interface SuburbCard {
  name        : string
  slug        : string
  vibe        : string
  bestFor     : BizType[]
  competition : Level
  rent        : Level
  footTraffic : Level
  verdict     : Verdict
  rentRange   : string
  demandScore : number   // /10
  insight     : string
  watchOut    : string
}

// ── Data ───────────────────────────────────────────────────────────────────────
const SUBURBS: SuburbCard[] = [
  {
    name: 'Newcastle CBD',
    slug: 'newcastle-cbd',
    vibe: 'Coastal urban revamp · office workers · tourism',
    bestFor: ['Café', 'Restaurant', 'Retail'],
    competition: 'High',
    rent: 'High',
    footTraffic: 'High',
    verdict: 'CAUTION',
    rentRange: '$3,500–$8,000/mo',
    demandScore: 8,
    insight:
      'The CBD is mid-transformation — the light rail, Hunter Street Mall redevelopment, and growing apartment population have pushed weekday foot traffic meaningfully higher since 2022. The challenge is rent: marquee Hunter Street positions price optimistically against a market that is still building its post-industrial hospitality culture. A well-positioned café with office tower proximity breaks even at 55–65 customers/day. A restaurant needs a clear dinner draw — weekend foot traffic drops significantly after 6pm outside events.',
    watchOut:
      'Vacancy rates on Hunter Street remain elevated. Treat every quoted rent as a negotiation starting point, not a market rate.',
  },
  {
    name: 'Merewether',
    slug: 'merewether',
    vibe: 'Affluent beach lifestyle · young families · high discretionary spend',
    bestFor: ['Café', 'Retail'],
    competition: 'Medium',
    rent: 'Medium',
    footTraffic: 'Medium',
    verdict: 'GO',
    rentRange: '$2,200–$4,200/mo',
    demandScore: 9,
    insight:
      'Merewether is Newcastle\'s strongest café market by unit economics. Household incomes sit at $96,000+ median — the suburb\'s beach-lifestyle demographic spends generously on quality coffee, brunch, and lifestyle retail. There is no strong incumbent specialty café; the gap is real. A quality operator here breaks even at 38–45 customers/day and builds a loyal suburban base within 4 months. The beach surge in summer (October–March) adds 25–35% above baseline revenue. The risk: a poor winter if you\'re too beach-dependent in your model.',
    watchOut:
      'Charlestown Road strip positions have inconsistent foot traffic. Bather\'s Way / beach-facing positions are structurally stronger.',
  },
  {
    name: 'Hamilton',
    slug: 'hamilton',
    vibe: 'Inner-suburb cool · independent businesses · young professional renters',
    bestFor: ['Café', 'Restaurant', 'Retail'],
    competition: 'Medium',
    rent: 'Medium',
    footTraffic: 'Medium',
    verdict: 'GO',
    rentRange: '$2,000–$4,500/mo',
    demandScore: 8,
    insight:
      'Hamilton is Newcastle\'s most underrated suburb for independent hospitality. Beaumont Street — Newcastle\'s longest and most diverse strip — hosts a genuine mix of ethnic restaurants, independent cafés, and boutique retail at rents that are 40–50% below inner-Sydney equivalents. The suburb has established multi-cultural dining culture: Lebanese, Vietnamese, Italian and modern Australian all coexist and perform. A restaurant entering an underrepresented cuisine category has the fastest path to local loyalty. Café operators benefit from the consistent commuter flow to Hamilton train station.',
    watchOut:
      'Weekend evening trade requires a compelling dinner concept — Beaumont Street has many choices and undifferentiated restaurants go dark after Thursday.',
  },
  {
    name: 'Cooks Hill',
    slug: 'cooks-hill',
    vibe: 'Darby Street culture · creative class · café-literate locals',
    bestFor: ['Café', 'Restaurant'],
    competition: 'High',
    rent: 'Medium',
    footTraffic: 'High',
    verdict: 'GO',
    rentRange: '$2,500–$5,000/mo',
    demandScore: 9,
    insight:
      'Darby Street is the spine of Cooks Hill and one of the strongest independent hospitality strips in regional NSW. The strip has genuine street life, a food-literate demographic, and a culture that actively supports independent operators. Competition is real — there are 15+ cafés within 800m — but the market rewards quality and point of difference. Average café ticket sits at $18–22, significantly above Newcastle average, making the economics work despite medium-high rents. A specialty coffee program or a brunch menu with genuine differentiation can build a loyal 80–100 person morning regular base within 6 months.',
    watchOut:
      'Darby Street has no cheap positions. Expect to negotiate hard for anything under $3,500/month — and verify foot traffic at your specific block, as there is meaningful variation across the strip.',
  },
  {
    name: 'The Junction',
    slug: 'junction',
    vibe: 'Suburban village feel · families · local loyalists',
    bestFor: ['Café', 'Retail'],
    competition: 'Low',
    rent: 'Low',
    footTraffic: 'Medium',
    verdict: 'GO',
    rentRange: '$1,800–$3,500/mo',
    demandScore: 7,
    insight:
      'The Junction is a compact residential suburb with a small but loyal commercial strip on Glebe Road. The suburb\'s family-oriented demographic generates consistent weekday morning café trade and weekend brunch demand. Competition is low — there is no strong quality café incumbent and the suburb\'s residents currently drive to Cooks Hill or Merewether for their preferred coffee. An operator who installs quality here at below-market rent has a clear path to becoming the suburb\'s default café. Revenue ceiling is lower than Darby Street, but so is the risk.',
    watchOut:
      'The Junction has limited foot traffic from outside the immediate residential catchment. Your business is built on residents, not visitors — community integration is non-negotiable.',
  },
  {
    name: 'Adamstown',
    slug: 'adamstown',
    vibe: 'Established working families · community-oriented · underserved',
    bestFor: ['Café', 'Takeaway'],
    competition: 'Low',
    rent: 'Low',
    footTraffic: 'Medium',
    verdict: 'GO',
    rentRange: '$1,500–$3,000/mo',
    demandScore: 7,
    insight:
      'Adamstown is Newcastle\'s clearest emerging café opportunity. The suburb has 12,000+ residents, a genuine local commercial strip on Brunker Road, and almost no quality café offering. Residents with professional incomes who moved to Adamstown for value are driving northward quality expectations. Rents are among Newcastle\'s lowest for an established suburb. A quality flat white program and a tight weekend brunch menu here achieves break-even at 32–38 customers/day — one of the lowest targets in Newcastle metro.',
    watchOut:
      'Average income is slightly below inner suburbs. Price positioning should be accessible ($4.50–$5.50 coffee) rather than specialty-premium ($6.50+) until the demographic base is established.',
  },
  {
    name: 'Kotara',
    slug: 'kotara',
    vibe: 'Shopping centre-anchored · families · car-dependent suburban',
    bestFor: ['Retail', 'Café', 'Takeaway'],
    competition: 'Medium',
    rent: 'Medium',
    footTraffic: 'High',
    verdict: 'CAUTION',
    rentRange: '$2,500–$6,000/mo',
    demandScore: 7,
    insight:
      'Westfield Kotara dominates the suburb\'s commercial landscape — and adjacent retail either benefits from or struggles against its gravitational pull. Inside the centre: exceptional foot traffic at national-chain prices. Outside the centre: moderate foot traffic at better rent. The opportunity for an independent is in categories Westfield under-serves: specialty food, artisan product, and experience-led retail. A café on Park Avenue adjacent to the centre gets the overflow foot traffic without paying centre rent. A generic café inside will compete directly with major chains at a structural disadvantage.',
    watchOut:
      'Westfield lease terms inside the centre typically require turnover rent clauses. Read the fine print before committing to any in-centre position.',
  },
  {
    name: 'Charlestown',
    slug: 'charlestown',
    vibe: 'Big-box retail · families · volume shoppers',
    bestFor: ['Takeaway', 'Retail'],
    competition: 'High',
    rent: 'Medium',
    footTraffic: 'High',
    verdict: 'CAUTION',
    rentRange: '$2,500–$5,500/mo',
    demandScore: 6,
    insight:
      'Charlestown Square is one of Newcastle\'s largest shopping centres — high foot traffic, but almost entirely national-chain hospitality. An independent café or restaurant adjacent to Charlestown Square competes for the same customers as Muffin Break, Bakers Delight, and Gloria Jean\'s. Without a genuine differentiation reason to walk past these options, independent operators here struggle. The exception: a specialty café with a quality differential significant enough to pull customers deliberately — strong Google Reviews and social media presence before opening are essential.',
    watchOut:
      'The area around Charlestown Square has high restaurant churn — the foot traffic looks attractive but the economics of non-chain hospitality are difficult. Verify competitor longevity before signing.',
  },
  {
    name: 'Mayfield',
    slug: 'mayfield',
    vibe: 'Industrial grit meets gentrification · young renters · emerging',
    bestFor: ['Café', 'Restaurant'],
    competition: 'Low',
    rent: 'Low',
    footTraffic: 'Low',
    verdict: 'GO',
    rentRange: '$1,200–$2,800/mo',
    demandScore: 6,
    insight:
      'Mayfield is where Newcastle\'s next wave of independent hospitality is taking root. The suburb has the DNA of an early-stage gentrifying suburb: cheaper rents, industrial-conversion spaces, an influx of young renters and artists, and a growing appetite for quality local food. The first quality independent café to open on Maitland Road will own the morning for 3–4 years before competition arrives. The challenge is low starting foot traffic — you are building a destination, not capturing existing flow. Budget for 3 months of below-break-even trading to build the regular base.',
    watchOut:
      'Mayfield is a 5-year play, not an immediate-return suburb. Operators who need to break even in month two will struggle. Those who can withstand a 90-day ramp will find loyal, local support.',
  },
  {
    name: 'Wallsend',
    slug: 'wallsend',
    vibe: 'Mining heritage · working families · community-proud',
    bestFor: ['Café', 'Takeaway'],
    competition: 'Low',
    rent: 'Low',
    footTraffic: 'Medium',
    verdict: 'CAUTION',
    rentRange: '$1,200–$2,500/mo',
    demandScore: 5,
    insight:
      'Wallsend has a loyal local community and very low commercial rents — the lowest barrier to entry in inner Newcastle. However, the suburb\'s median household income ($62,000) and café spending culture are below inner-suburb equivalents. A café that pitches quality product at accessible pricing ($4–$5 coffee, $12–$16 food) can build a viable local business. A specialty-premium concept would face price resistance. The Wallsend market rewards community authenticity — an operator who is from or invests in the suburb builds loyalty that chain alternatives cannot replicate.',
    watchOut:
      'Avoid expecting a quick ramp to profitability. Wallsend is a slow-burn, community-loyalty market. Plan for a 4–6 month build period.',
  },
  {
    name: 'Jesmond',
    slug: 'jesmond',
    vibe: 'University student belt · transient · price-sensitive',
    bestFor: ['Takeaway', 'Café'],
    competition: 'Medium',
    rent: 'Low',
    footTraffic: 'Medium',
    verdict: 'CAUTION',
    rentRange: '$1,500–$3,000/mo',
    demandScore: 6,
    insight:
      'Jesmond is defined by its proximity to the University of Newcastle — a double-edged sword. Semester time (March–May and July–October) delivers strong 7-day foot traffic and a volume-hungry student market. Outside semester — especially January and July — foot traffic can drop 35–45% as students leave. A café built on the student market must plan for this trough with a lean cost structure. High-volume, accessible pricing (sub-$5 coffee, $10–$14 food) works here. A specialty premium concept at $6+ coffee will face resistance from a demographic on HECS repayments.',
    watchOut:
      'Never model Jesmond revenue on semester-peak performance. Build your financial model on semester break volumes and treat semester peaks as the upside.',
  },
  {
    name: 'Waratah',
    slug: 'waratah',
    vibe: 'Hospital workers · blue-collar mix · community local',
    bestFor: ['Café', 'Takeaway'],
    competition: 'Low',
    rent: 'Low',
    footTraffic: 'Medium',
    verdict: 'GO',
    rentRange: '$1,300–$2,800/mo',
    demandScore: 6,
    insight:
      'Waratah\'s proximity to John Hunter Hospital — one of NSW\'s largest regional hospitals with 5,000+ staff — creates a reliable weekday medical-professional café demand that most operators overlook. The hospital generates predictable 7–9am and 12:30–1:30pm coffee demand from shift workers who want quality and speed. A café positioned on Turton Road within 400m of the hospital entrance, with fast service and quality coffee, could achieve 80+ covers per day by month three purely from hospital staff. The broader suburb\'s demographic is more price-sensitive but the hospital segment is not.',
    watchOut:
      'Weekend trade in Waratah is thin without the hospital worker base — a Monday-to-Friday model with reduced Saturday hours reflects the economic reality.',
  },
  {
    name: 'Lambton',
    slug: 'lambton',
    vibe: 'Quiet suburban · established families · local loyalists',
    bestFor: ['Café', 'Retail'],
    competition: 'Low',
    rent: 'Low',
    footTraffic: 'Low',
    verdict: 'GO',
    rentRange: '$1,400–$2,800/mo',
    demandScore: 6,
    insight:
      'Lambton is a quiet, established suburb with a small strip of independent businesses on Elder Street. The demographic — owner-occupier families, retirees, and professionals — is stable, income-decent ($78,000 median), and underserved for quality café options. The suburb is the kind of market where being the best local café generates a regular customer base of 60–80 people who visit 4–5 times per week. Revenue ceiling is modest but so is the floor — the fixed cost base at sub-$2,500/month rent means break-even is achievable on a small loyal customer pool.',
    watchOut:
      'This is a community market, not a destination. Marketing must be neighbourhood-first: local Facebook groups, school networks, sporting clubs. Digital marketing has limited reach in this demographic.',
  },
  {
    name: 'Broadmeadow',
    slug: 'broadmeadow',
    vibe: 'Stadium precinct · event-driven · industrial-to-residential shift',
    bestFor: ['Café', 'Takeaway', 'Restaurant'],
    competition: 'Low',
    rent: 'Low',
    footTraffic: 'Low',
    verdict: 'CAUTION',
    rentRange: '$1,200–$2,500/mo',
    demandScore: 6,
    insight:
      'Broadmeadow is Newcastle\'s stadium suburb — McDonald Jones Stadium (35,000 capacity) generates 15–20 high-foot-traffic event days per year that can produce single-day revenue equivalent to a slow month for an adjacent café. However, between events, Broadmeadow has thin weekday foot traffic and an industrial character that doesn\'t generate the organic café patronage of Cooks Hill or Hamilton. A business here needs to be event-day-ready (queuing system, extended hours, pre-made grab items) and built on a lean cost structure for the other 340 days.',
    watchOut:
      'Do not sign a lease in Broadmeadow without an event-day activation strategy. The stadium is the business case — without it, the location economics don\'t work.',
  },
  {
    name: 'Wickham',
    slug: 'wickham',
    vibe: 'Urban industrial · gentrifying · creative workers',
    bestFor: ['Café', 'Restaurant'],
    competition: 'Low',
    rent: 'Low',
    footTraffic: 'Low',
    verdict: 'GO',
    rentRange: '$1,200–$2,800/mo',
    demandScore: 7,
    insight:
      'Wickham is Newcastle\'s most interesting emerging suburb — a former industrial precinct being converted into apartments, creative studios, and office space on the back of the light rail corridor and urban renewal investment. The suburb\'s incoming population skews young, creative, and café-literate. First-mover advantage is real: the suburb has virtually no independent hospitality and the demographic arriving expects it. A café that opens now at $1,500–$2,000/month rent and builds a loyal base over 18 months will be the established incumbent when competition inevitably follows.',
    watchOut:
      'Development timelines in urban renewal precincts slip. Validate that the apartment and office projects near your proposed site are actually under construction, not just approved.',
  },
  {
    name: 'Carrington',
    slug: 'carrington',
    vibe: 'Harbour heritage · boutique · creative community',
    bestFor: ['Café', 'Retail'],
    competition: 'Low',
    rent: 'Low',
    footTraffic: 'Low',
    verdict: 'GO',
    rentRange: '$1,200–$2,500/mo',
    demandScore: 6,
    insight:
      'Carrington is Newcastle\'s most characterful suburb — a compact, heritage-listed harbour community that attracts creative workers, artists, and heritage-home owners who value the suburb\'s distinctiveness. The commercial strip on Cowper Street is small but developing. Tourism from the heritage precinct and water views adds a modest weekend visitor component. The business that succeeds in Carrington must feel genuinely local and place-specific — not a franchise concept dropped into a heritage suburb. A specialty café or artisan retail concept with real connection to the maritime heritage character performs best.',
    watchOut:
      'The market is small. A business in Carrington is building on community loyalty, not volume. Keep costs low and community investment high.',
  },
  {
    name: 'Stockton',
    slug: 'stockton',
    vibe: 'Ferry-linked coastal · quiet community · weekend visitor draw',
    bestFor: ['Café', 'Retail'],
    competition: 'Low',
    rent: 'Low',
    footTraffic: 'Low',
    verdict: 'CAUTION',
    rentRange: '$1,000–$2,200/mo',
    demandScore: 5,
    insight:
      'Stockton is physically separated from Newcastle by the Hunter River, accessible only by ferry (15 min) or a 30-minute road detour. This isolation suppresses weekday foot traffic but creates an unusual tourism dynamic: the ferry ride to Stockton is itself a Newcastle experience, and the suburb receives weekend visitors who come specifically for the beach and quiet character. A café positioned for the ferry terminus — weekend morning tourists, local surfers, and beach families — can generate viable revenue on 5 days per week while keeping a very low rent base.',
    watchOut:
      'Weekday trading in Stockton without a local community anchor is thin. An operator who can\'t survive Monday–Wednesday on resident trade alone will find Stockton structurally challenging.',
  },
  {
    name: 'Belmont',
    slug: 'belmont',
    vibe: 'Lake Macquarie gateway · families · suburban convenience',
    bestFor: ['Café', 'Takeaway', 'Retail'],
    competition: 'Medium',
    rent: 'Low',
    footTraffic: 'Medium',
    verdict: 'CAUTION',
    rentRange: '$1,500–$3,200/mo',
    demandScore: 6,
    insight:
      'Belmont sits on the Lake Macquarie foreshore — technically within Newcastle\'s broader urban area but with a distinctly suburban, car-dependent character. The commercial strip on Pacific Highway has consistent local patronage but limited destination appeal. A café here is primarily a convenience business for local residents and lake-foreshore visitors on weekends. The economics can work at sub-$2,500/month rent with a focused weekday coffee-and-lunch offering. A premium brunch destination will struggle without the foot traffic density that model requires.',
    watchOut:
      'Belmont is a convenience market. Price competitively and offer speed of service. This demographic will not pay Darby Street prices for a Belmont location.',
  },
  {
    name: 'Glendale',
    slug: 'glendale',
    vibe: 'Suburban industrial · big-box retail · commuter families',
    bestFor: ['Café', 'Takeaway', 'Retail'],
    competition: 'Medium',
    rent: 'Low',
    footTraffic: 'Medium',
    verdict: 'CAUTION',
    rentRange: '$1,500–$3,500/mo',
    demandScore: 5,
    insight:
      'Glendale is home to one of the Hunter Region\'s major retail parks — a cluster of big-box stores that generate significant car-dependent foot traffic on weekends. The opportunity for an independent is specific: a takeaway or café that captures the trade-day crowd (tradespeople, parents on school runs, workers heading to nearby industrial estates) rather than trying to compete as a destination. A quality coffee van or small café near the Bunnings or trade-facing strip would outperform a full-service café in this suburb.',
    watchOut:
      'Glendale is not a premium hospitality market. Margin comes from volume and efficiency, not high average ticket. An operator who tries to run a specialty café model here will fight the location economics.',
  },
  {
    name: 'Elermore Vale',
    slug: 'elermore-vale',
    vibe: 'Low-density residential · quiet suburban · young families',
    bestFor: ['Café', 'Takeaway'],
    competition: 'Low',
    rent: 'Low',
    footTraffic: 'Low',
    verdict: 'CAUTION',
    rentRange: '$1,000–$2,000/mo',
    demandScore: 4,
    insight:
      'Elermore Vale is a quiet, low-density residential suburb with limited commercial activity. The suburb has no established café culture and the residential catchment is modest in size. An operator here would be creating a market rather than serving an existing one. The very low rent ($1,000–$1,500/month) makes the economics technically possible if you can build a loyal local base quickly, but the lack of passing foot traffic makes discovery very difficult. Only consider if you have existing community relationships in the suburb that guarantee a starter customer base.',
    watchOut:
      'Elermore Vale should not be a first-choice market. If you are committed to this suburb, begin with a 3-day-per-week operation and scale only once you\'ve validated local demand.',
  },
]

// ── Top picks ──────────────────────────────────────────────────────────────────
const TOP_PICKS = [
  {
    category: 'Best for Café',
    emoji: '',
    suburb: 'Merewether',
    reason: 'Highest income demographic, low competition, beach lifestyle drives brunch trade year-round.',
    verdict: 'GO' as Verdict,
    rentRange: '$2,200–$4,200/mo',
  },
  {
    category: 'Best for Restaurant',
    emoji: '',
    suburb: 'Hamilton',
    reason: 'Beaumont Street has genuine multicultural dining culture, medium competition, and rents 40% below inner-Sydney.',
    verdict: 'GO' as Verdict,
    rentRange: '$2,000–$4,500/mo',
  },
  {
    category: 'Best for Retail',
    emoji: '',
    suburb: 'Cooks Hill (Darby St)',
    reason: 'High-income, food-literate street with genuine browsing culture and strong weekend foot traffic.',
    verdict: 'GO' as Verdict,
    rentRange: '$2,500–$5,000/mo',
  },
  {
    category: 'Best Value Entry',
    emoji: '',
    suburb: 'Wickham',
    reason: 'Lowest rents in inner Newcastle, first-mover advantage as gentrification accelerates.',
    verdict: 'GO' as Verdict,
    rentRange: '$1,200–$2,800/mo',
  },
]

// ── Comparison table data ──────────────────────────────────────────────────────
const TABLE_SUBURBS = [
  { name: 'Merewether',     cafe: 9, restaurant: 6, retail: 7, rent: 'Med',  traffic: 'Med',  verdict: 'GO'      },
  { name: 'Cooks Hill',     cafe: 9, restaurant: 8, retail: 8, rent: 'Med',  traffic: 'High', verdict: 'GO'      },
  { name: 'Hamilton',       cafe: 8, restaurant: 9, retail: 7, rent: 'Med',  traffic: 'Med',  verdict: 'GO'      },
  { name: 'Wickham',        cafe: 7, restaurant: 6, retail: 5, rent: 'Low',  traffic: 'Low',  verdict: 'GO'      },
  { name: 'The Junction',   cafe: 7, restaurant: 5, retail: 6, rent: 'Low',  traffic: 'Med',  verdict: 'GO'      },
  { name: 'Adamstown',      cafe: 7, restaurant: 5, retail: 5, rent: 'Low',  traffic: 'Med',  verdict: 'GO'      },
  { name: 'Waratah',        cafe: 7, restaurant: 5, retail: 4, rent: 'Low',  traffic: 'Med',  verdict: 'GO'      },
  { name: 'Newcastle CBD',  cafe: 7, restaurant: 7, retail: 8, rent: 'High', traffic: 'High', verdict: 'CAUTION' },
  { name: 'Kotara',         cafe: 6, restaurant: 5, retail: 8, rent: 'Med',  traffic: 'High', verdict: 'CAUTION' },
  { name: 'Jesmond',        cafe: 6, restaurant: 5, retail: 4, rent: 'Low',  traffic: 'Med',  verdict: 'CAUTION' },
  { name: 'Charlestown',    cafe: 5, restaurant: 5, retail: 6, rent: 'Med',  traffic: 'High', verdict: 'CAUTION' },
  { name: 'Mayfield',       cafe: 6, restaurant: 6, retail: 4, rent: 'Low',  traffic: 'Low',  verdict: 'GO'      },
  { name: 'Carrington',     cafe: 6, restaurant: 4, retail: 6, rent: 'Low',  traffic: 'Low',  verdict: 'GO'      },
  { name: 'Broadmeadow',    cafe: 5, restaurant: 6, retail: 4, rent: 'Low',  traffic: 'Low',  verdict: 'CAUTION' },
  { name: 'Wallsend',       cafe: 5, restaurant: 4, retail: 4, rent: 'Low',  traffic: 'Med',  verdict: 'CAUTION' },
  { name: 'Stockton',       cafe: 5, restaurant: 4, retail: 4, rent: 'Low',  traffic: 'Low',  verdict: 'CAUTION' },
  { name: 'Belmont',        cafe: 5, restaurant: 4, retail: 5, rent: 'Low',  traffic: 'Med',  verdict: 'CAUTION' },
  { name: 'Elermore Vale',  cafe: 4, restaurant: 3, retail: 3, rent: 'Low',  traffic: 'Low',  verdict: 'CAUTION' },
  { name: 'Glendale',       cafe: 4, restaurant: 3, retail: 5, rent: 'Low',  traffic: 'Med',  verdict: 'CAUTION' },
  { name: 'Lambton',        cafe: 6, restaurant: 4, retail: 5, rent: 'Low',  traffic: 'Low',  verdict: 'GO'      },
]

// ── Style tokens ───────────────────────────────────────────────────────────────
const FONT = '"DM Sans","Inter","Helvetica Neue",Arial,sans-serif'
const C = {
  text:    '#0F172A',
  sub:     '#475569',
  faint:   '#94A3B8',
  border:  '#E2E8F0',
  bg:      '#F8FAFC',
  white:   '#FFFFFF',
  green:   '#059669',
  greenBg: '#ECFDF5',
  greenBd: '#A7F3D0',
  amber:   '#D97706',
  amberBg: '#FFFBEB',
  amberBd: '#FDE68A',
  red:     '#DC2626',
  redBg:   '#FEF2F2',
  redBd:   '#FECACA',
  blue:    '#1D4ED8',
  blueBg:  '#EFF6FF',
  blueBd:  '#BFDBFE',
}

// ── Helper components ──────────────────────────────────────────────────────────

function VerdictBadge({ v }: { v: Verdict }) {
  const map = {
    GO:      { bg: C.greenBg, color: C.green, border: C.greenBd },
    CAUTION: { bg: C.amberBg, color: C.amber, border: C.amberBd },
    AVOID:   { bg: C.redBg,   color: C.red,   border: C.redBd   },
  }
  const s = map[v]
  return (
    <span style={{
      display:'inline-block', fontSize:11, fontWeight:700, letterSpacing:'0.06em',
      textTransform:'uppercase', background:s.bg, color:s.color,
      border:`1px solid ${s.border}`, borderRadius:999, padding:'3px 10px',
    }}>{v}</span>
  )
}

function LevelBadge({ level, type }: { level: Level; type: 'competition'|'rent'|'traffic' }) {
  const color = level === 'Low'
    ? (type === 'competition' ? C.green : type === 'rent' ? C.green : C.amber)
    : level === 'Medium' ? C.amber : C.red
  const bg = level === 'Low'
    ? (type === 'competition' ? C.greenBg : type === 'rent' ? C.greenBg : C.amberBg)
    : level === 'Medium' ? C.amberBg : C.redBg
  return (
    <span style={{
      display:'inline-block', fontSize:11, fontWeight:700,
      background:bg, color, borderRadius:6, padding:'2px 8px',
    }}>{level}</span>
  )
}

function ScoreBar({ value, max=10 }: { value:number; max?:number }) {
  const pct = (value / max) * 100
  const color = pct >= 80 ? C.green : pct >= 60 ? C.amber : C.red
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
      <div style={{ flex:1, height:6, borderRadius:4, background:C.border, overflow:'hidden' }}>
        <div style={{ width:`${pct}%`, height:'100%', background:color, borderRadius:4 }} />
      </div>
      <span style={{ fontSize:12, fontWeight:700, color, width:24, textAlign:'right' }}>{value}</span>
    </div>
  )
}

// ── Filter logic ───────────────────────────────────────────────────────────────

type FilterType = 'All' | BizType
const FILTERS: FilterType[] = ['All', 'Café', 'Restaurant', 'Retail', 'Gym', 'Takeaway']

// ── Main component ─────────────────────────────────────────────────────────────
export default function NewcastleBestSuburbsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('All')
  const [showAll, setShowAll] = useState(false)

  const filtered = SUBURBS.filter(s =>
    activeFilter === 'All' || s.bestFor.includes(activeFilter as BizType)
  )
  const displayed = showAll ? filtered : filtered.slice(0, 12)

  return (
    <main style={{ fontFamily:FONT, color:C.text, background:C.bg, minHeight:'100vh' }}>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section style={{
        background:'linear-gradient(160deg,#FFFFFF 0%,#F0FDF4 60%,#ECFDF5 100%)',
        borderBottom:`1px solid ${C.border}`, padding:'80px 24px 64px',
      }}>
        <div style={{ maxWidth:860, margin:'0 auto' }}>

          <nav style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, color:C.faint, marginBottom:20, flexWrap:'wrap' }}>
            <Link href="/" style={{ color:C.green, textDecoration:'none', fontWeight:600 }}>Home</Link>
            <span>›</span>
            <Link href="/analyse" style={{ color:C.green, textDecoration:'none', fontWeight:600 }}>Analyse</Link>
            <span>›</span>
            <Link href="/analyse/newcastle" style={{ color:C.green, textDecoration:'none', fontWeight:600 }}>Newcastle</Link>
            <span>›</span>
            <span>Best suburbs</span>
          </nav>

          <span style={{
            display:'inline-block', fontSize:11, fontWeight:700, letterSpacing:'0.07em',
            textTransform:'uppercase', color:C.green, background:C.greenBg,
            border:`1px solid ${C.greenBd}`, borderRadius:999, padding:'4px 12px', marginBottom:16,
          }}>
            NSW · Newcastle · Location Intelligence Guide
          </span>

          <h1 style={{
            fontSize:'clamp(28px,4.5vw,52px)', fontWeight:800, lineHeight:1.1,
            letterSpacing:'-0.025em', margin:'0 0 18px', color:C.text,
          }}>
            Best Suburbs in Newcastle to Open a{' '}
            <span style={{ color:C.green }}>Café, Restaurant or Retail Business</span>
            <br />2026 Guide
          </h1>

          <p style={{ fontSize:18, color:C.sub, lineHeight:1.7, maxWidth:680, margin:'0 0 14px' }}>
            Newcastle is mid-transformation. The light rail, harbour renewal, and a decade of
            population growth have reshaped which suburbs work for which businesses — and which
            look attractive but will break you. This guide scores 20 suburbs so you don't have
            to guess.
          </p>

          <p style={{ fontSize:14, color:C.faint, margin:'0 0 32px' }}>
            Based on commercial lease data, ABS demographic benchmarks, and Newcastle Hunter Valley
            hospitality industry metrics. Updated April 2026.
          </p>

          <div style={{ display:'flex', gap:14, flexWrap:'wrap', alignItems:'center' }}>
            <Link href="/onboarding?ref=newcastle-guide" style={{
              display:'inline-flex', alignItems:'center', gap:8,
              background:C.green, color:C.white, fontWeight:700, fontSize:15,
              padding:'13px 26px', borderRadius:12, textDecoration:'none',
            }}>
              Run Full Location Analysis →
            </Link>
            <Link href="#suburbs" style={{
              color:C.green, fontWeight:600, fontSize:14, textDecoration:'none',
            }}>
              See all 20 suburbs ↓
            </Link>
          </div>
        </div>
      </section>

      {/* ── QUICK STATS ─────────────────────────────────────────────────────── */}
      <section style={{ background:C.white, borderBottom:`1px solid ${C.border}`, padding:'32px 24px' }}>
        <div style={{
          maxWidth:860, margin:'0 auto',
          display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:0,
        }}>
          {[
            { value:'20', label:'Suburbs Analysed' },
            { value:'8',  label:'GO Verdicts' },
            { value:'$1k–$8k', label:'Monthly Rent Range' },
            { value:'8/10',  label:'Top Demand Score' },
            { value:'2026', label:'Data Currency' },
          ].map((s, i) => (
            <div key={i} style={{
              textAlign:'center', padding:'16px 12px',
              borderRight: i < 4 ? `1px solid ${C.border}` : 'none',
            }}>
              <div style={{ fontSize:26, fontWeight:800, color:C.green, lineHeight:1 }}>{s.value}</div>
              <div style={{ fontSize:12, color:C.sub, marginTop:4, fontWeight:600 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TOP PICKS ───────────────────────────────────────────────────────── */}
      <section style={{ padding:'64px 24px' }}>
        <div style={{ maxWidth:860, margin:'0 auto' }}>
          <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.07em', textTransform:'uppercase', color:C.green, marginBottom:8 }}>
            Quick picks
          </p>
          <h2 style={{ fontSize:'clamp(22px,3vw,34px)', fontWeight:800, letterSpacing:'-0.02em', margin:'0 0 10px' }}>
            Top suburbs by business type
          </h2>
          <p style={{ fontSize:15, color:C.sub, margin:'0 0 36px', maxWidth:560 }}>
            If you need a fast answer before diving into the full suburb breakdown.
          </p>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:16 }}>
            {TOP_PICKS.map(p => (
              <div key={p.suburb} style={{
                background:C.white, border:`1px solid ${C.border}`, borderRadius:16,
                padding:'22px 24px', position:'relative' as const,
              }}>
                <span style={{
                  fontSize:10, fontWeight:700, letterSpacing:'0.07em', textTransform:'uppercase',
                  color:C.blue, background:C.blueBg, border:`1px solid ${C.blueBd}`,
                  borderRadius:999, padding:'3px 10px', display:'inline-block', marginBottom:12,
                }}>{p.category}</span>
                <div style={{ fontSize:22, fontWeight:800, color:C.text, marginBottom:6 }}>{p.suburb}</div>
                <div style={{ fontSize:13, color:C.sub, lineHeight:1.6, marginBottom:14 }}>{p.reason}</div>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <VerdictBadge v={p.verdict} />
                  <span style={{ fontSize:12, color:C.faint, fontWeight:600 }}>{p.rentRange}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ height:1, background:C.border }} />

      {/* ── SUBURB CARDS ────────────────────────────────────────────────────── */}
      <section id="suburbs" style={{ padding:'64px 24px', background:C.white }}>
        <div style={{ maxWidth:1000, margin:'0 auto' }}>
          <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.07em', textTransform:'uppercase', color:C.green, marginBottom:8 }}>
            Suburb by suburb
          </p>
          <h2 style={{ fontSize:'clamp(22px,3vw,34px)', fontWeight:800, letterSpacing:'-0.02em', margin:'0 0 10px' }}>
            20 Newcastle suburbs — full breakdown
          </h2>
          <p style={{ fontSize:15, color:C.sub, margin:'0 0 28px', maxWidth:580 }}>
            Every suburb scored on demand, competition, rent, and business-type fit.
            Filter by the business type you're planning.
          </p>

          {/* Filter pills */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:32 }}>
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => { setActiveFilter(f); setShowAll(false) }}
                style={{
                  fontSize:13, fontWeight:600, padding:'7px 16px', borderRadius:999,
                  border:`1px solid ${activeFilter === f ? C.green : C.border}`,
                  background: activeFilter === f ? C.green : C.white,
                  color: activeFilter === f ? C.white : C.sub,
                  cursor:'pointer',
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Cards grid */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:16 }}>
            {displayed.map(s => (
              <div key={s.name} style={{
                background:C.bg, border:`1px solid ${C.border}`, borderRadius:18,
                padding:'22px 24px', display:'flex', flexDirection:'column', gap:0,
              }}>
                {/* Header */}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
                  <div>
                    <div style={{ fontSize:18, fontWeight:800, color:C.text, marginBottom:4 }}>{s.name}</div>
                    <div style={{ fontSize:12, color:C.faint, fontStyle:'italic' }}>{s.vibe}</div>
                  </div>
                  <VerdictBadge v={s.verdict} />
                </div>

                {/* Best for pills */}
                <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:14 }}>
                  {s.bestFor.map(b => (
                    <span key={b} style={{
                      fontSize:11, fontWeight:700, background:C.greenBg,
                      color:C.green, borderRadius:6, padding:'2px 8px',
                    }}>{b}</span>
                  ))}
                </div>

                {/* Metrics row */}
                <div style={{
                  display:'grid', gridTemplateColumns:'1fr 1fr 1fr',
                  gap:8, marginBottom:14, background:C.white,
                  border:`1px solid ${C.border}`, borderRadius:10, padding:'10px 12px',
                }}>
                  {[
                    { label:'Competition', value:s.competition, type:'competition' as const },
                    { label:'Rent',        value:s.rent,        type:'rent' as const        },
                    { label:'Foot Traffic',value:s.footTraffic, type:'traffic' as const     },
                  ].map(m => (
                    <div key={m.label} style={{ textAlign:'center' }}>
                      <div style={{ fontSize:10, color:C.faint, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:4 }}>{m.label}</div>
                      <LevelBadge level={m.value} type={m.type} />
                    </div>
                  ))}
                </div>

                {/* Score + rent */}
                <div style={{ marginBottom:12 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:5 }}>
                    <span style={{ fontSize:12, fontWeight:600, color:C.sub }}>Demand Score</span>
                    <span style={{ fontSize:12, color:C.faint }}>{s.rentRange}</span>
                  </div>
                  <ScoreBar value={s.demandScore} />
                </div>

                {/* Insight */}
                <div style={{
                  background:C.white, border:`1px solid ${C.border}`, borderRadius:10,
                  padding:'12px 14px', marginBottom:10,
                }}>
                  <p style={{ fontSize:13, lineHeight:1.7, color:C.sub, margin:0 }}>{s.insight}</p>
                </div>

                {/* Watch out */}
                <div style={{
                  background:C.amberBg, border:`1px solid ${C.amberBd}`,
                  borderRadius:10, padding:'10px 14px',
                }}>
                  <span style={{ fontSize:11, fontWeight:700, color:C.amber, textTransform:'uppercase', letterSpacing:'0.05em' }}>
                    Watch out:{' '}
                  </span>
                  <span style={{ fontSize:13, color:'#92400E', lineHeight:1.6 }}>{s.watchOut}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Show more */}
          {filtered.length > 12 && !showAll && (
            <div style={{ textAlign:'center', marginTop:32 }}>
              <button
                onClick={() => setShowAll(true)}
                style={{
                  fontSize:14, fontWeight:700, color:C.green, background:C.greenBg,
                  border:`1px solid ${C.greenBd}`, borderRadius:12,
                  padding:'12px 28px', cursor:'pointer',
                }}
              >
                Show remaining {filtered.length - 12} suburbs →
              </button>
            </div>
          )}
        </div>
      </section>

      <div style={{ height:1, background:C.border }} />

      {/* ── COMPARISON TABLE ─────────────────────────────────────────────────── */}
      <section style={{ padding:'64px 24px' }}>
        <div style={{ maxWidth:1000, margin:'0 auto' }}>
          <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.07em', textTransform:'uppercase', color:C.green, marginBottom:8 }}>
            Side-by-side comparison
          </p>
          <h2 style={{ fontSize:'clamp(22px,3vw,34px)', fontWeight:800, letterSpacing:'-0.02em', margin:'0 0 10px' }}>
            Newcastle suburbs at a glance
          </h2>
          <p style={{ fontSize:15, color:C.sub, margin:'0 0 32px', maxWidth:560 }}>
            Demand scores by business type (1–10), rent level, and foot traffic. Sorted by café score.
          </p>

          <div style={{ overflowX:'auto' }}>
            <table style={{
              width:'100%', borderCollapse:'collapse', fontSize:13,
              background:C.white, borderRadius:16, overflow:'hidden',
              border:`1px solid ${C.border}`,
            }}>
              <thead>
                <tr style={{ background:C.bg, borderBottom:`2px solid ${C.border}` }}>
                  {['Suburb', 'Café', 'Restaurant', 'Retail', 'Rent', 'Foot Traffic', 'Verdict'].map(h => (
                    <th key={h} style={{
                      padding:'12px 16px', textAlign:'left', fontSize:11,
                      fontWeight:700, color:C.sub, letterSpacing:'0.06em',
                      textTransform:'uppercase', whiteSpace:'nowrap',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TABLE_SUBURBS.sort((a, b) => b.cafe - a.cafe).map((row, i) => (
                  <tr key={row.name} style={{
                    borderBottom:`1px solid ${C.border}`,
                    background: i % 2 === 0 ? C.white : C.bg,
                  }}>
                    <td style={{ padding:'11px 16px', fontWeight:700, color:C.text, whiteSpace:'nowrap' }}>{row.name}</td>
                    <td style={{ padding:'11px 16px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                        <div style={{ width:32, height:6, borderRadius:3, background:C.border, overflow:'hidden' }}>
                          <div style={{ width:`${row.cafe*10}%`, height:'100%', background: row.cafe>=8?C.green:row.cafe>=6?C.amber:C.red }} />
                        </div>
                        <span style={{ fontSize:12, fontWeight:700, color:row.cafe>=8?C.green:row.cafe>=6?C.amber:C.red }}>{row.cafe}</span>
                      </div>
                    </td>
                    <td style={{ padding:'11px 16px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                        <div style={{ width:32, height:6, borderRadius:3, background:C.border, overflow:'hidden' }}>
                          <div style={{ width:`${row.restaurant*10}%`, height:'100%', background: row.restaurant>=8?C.green:row.restaurant>=6?C.amber:C.red }} />
                        </div>
                        <span style={{ fontSize:12, fontWeight:700, color:row.restaurant>=8?C.green:row.restaurant>=6?C.amber:C.red }}>{row.restaurant}</span>
                      </div>
                    </td>
                    <td style={{ padding:'11px 16px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                        <div style={{ width:32, height:6, borderRadius:3, background:C.border, overflow:'hidden' }}>
                          <div style={{ width:`${row.retail*10}%`, height:'100%', background: row.retail>=8?C.green:row.retail>=6?C.amber:C.red }} />
                        </div>
                        <span style={{ fontSize:12, fontWeight:700, color:row.retail>=8?C.green:row.retail>=6?C.amber:C.red }}>{row.retail}</span>
                      </div>
                    </td>
                    <td style={{ padding:'11px 16px' }}>
                      <LevelBadge level={row.rent as Level} type="rent" />
                    </td>
                    <td style={{ padding:'11px 16px' }}>
                      <LevelBadge level={row.traffic as Level} type="traffic" />
                    </td>
                    <td style={{ padding:'11px 16px' }}>
                      <VerdictBadge v={row.verdict as Verdict} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <div style={{ height:1, background:C.border }} />

      {/* ── DEMAND VS COMPETITION GRID ───────────────────────────────────────── */}
      <section style={{ padding:'64px 24px', background:C.white }}>
        <div style={{ maxWidth:860, margin:'0 auto' }}>
          <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.07em', textTransform:'uppercase', color:C.green, marginBottom:8 }}>
            Strategic positioning map
          </p>
          <h2 style={{ fontSize:'clamp(22px,3vw,34px)', fontWeight:800, letterSpacing:'-0.02em', margin:'0 0 10px' }}>
            Demand vs. competition: where to focus
          </h2>
          <p style={{ fontSize:15, color:C.sub, margin:'0 0 32px', maxWidth:580 }}>
            The ideal target is a suburb with high demand and low competition.
            High demand + high competition requires genuine differentiation to survive.
          </p>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {[
              {
                title: 'High Demand · Low Competition',
                subtitle: 'Best opportunity',
                color: C.green, bg: C.greenBg, border: C.greenBd,
                suburbs: ['Merewether (café/retail)', 'Waratah (café — hospital precinct)', 'Wickham (café — first mover)', 'Adamstown (café — emerging)'],
              },
              {
                title: 'High Demand · High Competition',
                subtitle: 'Requires strong differentiation',
                color: C.amber, bg: C.amberBg, border: C.amberBd,
                suburbs: ['Cooks Hill / Darby Street (café)', 'Newcastle CBD (restaurant/retail)', 'Charlestown (retail)', 'Kotara (retail near Westfield)'],
              },
              {
                title: 'Low Demand · Low Competition',
                subtitle: 'Niche community play — low risk, low ceiling',
                color: C.blue, bg: C.blueBg, border: C.blueBd,
                suburbs: ['Lambton (café)', 'Carrington (café/boutique retail)', 'Elermore Vale (takeaway only)', 'Stockton (weekend café)'],
              },
              {
                title: 'Low Demand · High Competition',
                subtitle: 'Avoid — poor risk/reward',
                color: C.red, bg: C.redBg, border: C.redBd,
                suburbs: ['Glendale (independent café vs big-box)', 'Wallsend (chains dominate price point)', 'Jesmond (semester-only demand)'],
              },
            ].map(q => (
              <div key={q.title} style={{
                background: q.bg, border:`1px solid ${q.border}`,
                borderRadius:16, padding:'22px 24px',
              }}>
                <div style={{ fontSize:13, fontWeight:800, color:q.color, marginBottom:4 }}>{q.title}</div>
                <div style={{ fontSize:11, color:q.color, opacity:0.75, marginBottom:14, fontWeight:600 }}>{q.subtitle}</div>
                <ul style={{ margin:0, padding:'0 0 0 16px' }}>
                  {q.suburbs.map(s => (
                    <li key={s} style={{ fontSize:13, color:C.sub, marginBottom:5, lineHeight:1.5 }}>{s}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ height:1, background:C.border }} />

      {/* ── HOW TO CHOOSE ────────────────────────────────────────────────────── */}
      <section style={{ padding:'64px 24px' }}>
        <div style={{ maxWidth:860, margin:'0 auto' }}>
          <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.07em', textTransform:'uppercase', color:C.green, marginBottom:8 }}>
            Decision framework
          </p>
          <h2 style={{ fontSize:'clamp(22px,3vw,34px)', fontWeight:800, letterSpacing:'-0.02em', margin:'0 0 10px' }}>
            How to choose the right Newcastle suburb
          </h2>
          <p style={{ fontSize:15, color:C.sub, margin:'0 0 40px', maxWidth:560 }}>
            Four variables determine whether a location will make money. Get all four right and
            you have a structurally sound business. Get one wrong and you'll spend 18 months
            finding out the hard way.
          </p>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:16 }}>
            {[
              {
                num: '01',
                title: 'Rent vs. Revenue Balance',
                body: 'Newcastle commercial rent should sit at 8–12% of your projected monthly revenue. At a $19 average café ticket, $4,000/month rent requires 56 transactions per day just to maintain a healthy rent ratio — before a dollar of profit. Run the maths before you fall in love with a space. Inner-suburb Newcastle rents ($2,500–$5,000/month) are structurally more viable than Sydney equivalents, but the revenue ceiling per suburb also matters.',
                accent: C.green,
              },
              {
                num: '02',
                title: 'Foot Traffic Quality',
                body: 'In Newcastle, foot traffic is not just volume — it\'s type. Darby Street has walkers with leisure time and spending intent. The CBD has workers with 7 minutes between meetings. Wallsend has residents who mainly drive. Each demands a different service format, menu, and price point. Do the 7am test: stand at your proposed site and count passing pedestrians for 10 minutes. Multiply by 6 for hourly flow. Under 30/hour is very thin for a walk-in model.',
                accent: C.blue,
              },
              {
                num: '03',
                title: 'Competition Saturation',
                body: 'Newcastle\'s competitive landscape is more nuanced than the number of cafés per street. Darby Street has 15+ cafés within 800m — but it also validates that demand exists. Adamstown has almost zero competition but also less established café demand. The question is not how many competitors exist but whether you have a clear reason for customers to choose you over what already exists. If you cannot articulate that in one sentence, the location is already wrong.',
                accent: C.amber,
              },
              {
                num: '04',
                title: 'Demographics — Spending Power',
                body: 'Merewether\'s $96,000 median household income supports $26 brunch plates and $6 specialty coffee without friction. Wallsend\'s $62,000 median income treats those same prices as a special-occasion spend. Both markets are viable — but only if your concept is correctly calibrated. A premium concept in a value-income suburb will slowly starve. A value-concept in a premium suburb leaves money on the table. Match your price point to the demographic before you match your aesthetic to your preferences.',
                accent: C.red,
              },
            ].map(item => (
              <div key={item.num} style={{
                background:C.white, border:`1px solid ${C.border}`, borderRadius:16, padding:'24px 26px',
              }}>
                <div style={{
                  fontSize:28, fontWeight:900, color:item.accent,
                  opacity:0.25, lineHeight:1, marginBottom:12,
                }}>{item.num}</div>
                <div style={{ fontSize:16, fontWeight:800, color:C.text, marginBottom:10 }}>{item.title}</div>
                <p style={{ fontSize:14, color:C.sub, lineHeight:1.75, margin:0 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ height:1, background:C.border }} />

      {/* ── COMMON MISTAKES ──────────────────────────────────────────────────── */}
      <section style={{ padding:'64px 24px', background:C.white }}>
        <div style={{ maxWidth:860, margin:'0 auto' }}>
          <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.07em', textTransform:'uppercase', color:C.red, marginBottom:8 }}>
            Avoid these
          </p>
          <h2 style={{ fontSize:'clamp(22px,3vw,34px)', fontWeight:800, letterSpacing:'-0.02em', margin:'0 0 10px' }}>
            Common mistakes Newcastle operators make
          </h2>
          <p style={{ fontSize:15, color:C.sub, margin:'0 0 36px', maxWidth:560 }}>
            Most Newcastle café and restaurant failures are not product failures. They're location and lease failures. These are the patterns that repeat.
          </p>

          <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
            {[
              {
                title: 'Paying Darby Street rent for a non-Darby Street concept',
                body: 'Darby Street commands a premium because it delivers foot traffic and spending intent. A concept that would succeed in Adamstown at $1,800/month will break at Darby Street at $4,500/month — not because the product is wrong, but because the cost base requires volume the concept cannot achieve. Match concept ambition to suburb economics, not to suburb prestige.',
              },
              {
                title: 'Modelling revenue on peak days',
                body: 'Jesmond in semester week looks like a gold mine. Jesmond in January looks like a ghost town. Charlestown in December looks strong. Charlestown on a rainy Tuesday in June does not. Always model your financial case on a conservative baseline — your average non-event, mid-week, non-peak trading day. If that number works, the business is viable. If you need every day to be a good day, the margin is too thin.',
              },
              {
                title: 'Ignoring what "low competition" actually means',
                body: 'Low competition can mean two things: an untapped market, or a market that doesn\'t exist. Elermore Vale has low competition because demand for a specialty café there has never been validated. Wickham has low competition because it\'s new and the demographic is incoming. These are structurally different. Validate that the demand exists before interpreting low competition as an opportunity.',
              },
              {
                title: 'Signing 5-year leases without break clauses in Newcastle\'s changing suburbs',
                body: 'Newcastle\'s inner suburbs are genuinely mid-transformation. The light rail, harbour renewal, and Hunter Street redevelopment are not complete — they will continue reshaping foot traffic patterns for 3–4 more years. A 5-year fixed lease in a suburb whose foot traffic profile is expected to change significantly is a bet on a future that hasn\'t arrived yet. Negotiate 3-year initial terms with options, and include break clauses tied to development milestones where possible.',
              },
              {
                title: 'Underestimating how long it takes to build a regular base in Newcastle',
                body: 'Sydney suburbs develop café loyal customer bases in 6–8 weeks because the density and transient population is high. Newcastle\'s inner suburbs — outside Darby Street — build loyalty more slowly because the resident-to-visitor ratio is higher. Budget 90 days before expecting consistent revenue in any Newcastle suburb. In community-oriented suburbs (Lambton, The Junction, Carrington), budget 150 days.',
              },
            ].map((m, i) => (
              <div key={i} style={{
                display:'flex', gap:16, padding:'22px 0',
                borderBottom: i < 4 ? `1px solid ${C.border}` : 'none',
                alignItems:'flex-start',
              }}>
                <div style={{
                  width:28, height:28, borderRadius:999, background:C.redBg,
                  color:C.red, fontWeight:800, fontSize:14,
                  display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:2,
                }}>✕</div>
                <div>
                  <div style={{ fontSize:16, fontWeight:700, color:C.text, marginBottom:6 }}>{m.title}</div>
                  <p style={{ fontSize:14, color:C.sub, lineHeight:1.75, margin:0 }}>{m.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ height:1, background:C.border }} />

      {/* ── INTERNAL LINKS ───────────────────────────────────────────────────── */}
      <section style={{ padding:'48px 24px' }}>
        <div style={{ maxWidth:860, margin:'0 auto' }}>
          <p style={{ fontSize:13, fontWeight:700, color:C.sub, marginBottom:20 }}>More Newcastle resources</p>
          <div style={{ display:'flex', flexWrap:'wrap', gap:12 }}>
            {[
              { label: 'Newcastle Bakery Location Analysis', href: '/analyse/newcastle/bakery' },
              { label: 'Break-Even Foot Traffic Calculator', href: '/tools/break-even-foot-traffic' },
              { label: 'Is Your Rent Overpriced?', href: '/tools/rent-overpriced-checker' },
              { label: 'Business Viability Checker', href: '/tools/business-viability-checker' },
              { label: 'Suburb Intelligence — Hamilton', href: '/restaurant/newcastle/hamilton-nsw' },
              { label: 'Suburb Intelligence — Darby Street', href: '/cafe/newcastle/darby-street' },
            ].map(l => (
              <Link key={l.href} href={l.href} style={{
                fontSize:13, fontWeight:600, color:C.green,
                background:C.greenBg, border:`1px solid ${C.greenBd}`,
                borderRadius:999, padding:'8px 16px', textDecoration:'none',
              }}>
                {l.label} →
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div style={{ height:1, background:C.border }} />

      {/* ── FINAL CTA ────────────────────────────────────────────────────────── */}
      <section style={{
        background:'linear-gradient(135deg,#059669 0%,#0F766E 100%)',
        padding:'80px 24px', textAlign:'center',
      }}>
        <div style={{ maxWidth:640, margin:'0 auto' }}>
          <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'#A7F3D0', marginBottom:14 }}>
            Ready for your address?
          </p>
          <h2 style={{
            fontSize:'clamp(24px,3.5vw,40px)', fontWeight:800, color:C.white,
            margin:'0 0 14px', letterSpacing:'-0.02em',
          }}>
            Run a full Locatalyze report for your Newcastle location
          </h2>
          <p style={{ fontSize:17, color:'#A7F3D0', margin:'0 0 14px', lineHeight:1.65 }}>
            This guide gives you the suburb overview. A full Locatalyze report gives you
            address-level intelligence — your specific block, not the suburb average.
          </p>

          <div style={{
            display:'flex', justifyContent:'center', flexWrap:'wrap', gap:20, margin:'28px 0 40px',
          }}>
            {[
              'Competitor names + Google ratings within 500m',
              'Real foot traffic estimates for your block',
              'Commercial rent benchmarks for your street',
              'Demographic catchment breakdown',
              'GO / CAUTION / NO verdict with specific conditions',
            ].map(item => (
              <div key={item} style={{
                fontSize:13, color:'#D1FAE5',
                display:'flex', alignItems:'center', gap:6,
              }}>
                <span style={{ color:'#34D399', fontWeight:700 }}>✓</span> {item}
              </div>
            ))}
          </div>

          <Link href="/onboarding?ref=newcastle-best-suburbs-cta" style={{
            display:'inline-block', background:C.white, color:C.green,
            fontWeight:800, fontSize:16, padding:'17px 44px',
            borderRadius:100, textDecoration:'none',
          }}>
            Run My Newcastle Analysis →
          </Link>
          <p style={{ fontSize:13, color:'#6EE7B7', marginTop:14 }}>
            Takes 90 seconds. No credit card required to start.
          </p>
        </div>
      </section>

      {/* ── FOOTER NOTE ──────────────────────────────────────────────────────── */}
      <section style={{ padding:'32px 24px', background:C.bg, borderTop:`1px solid ${C.border}` }}>
        <div style={{ maxWidth:860, margin:'0 auto' }}>
          <p style={{ fontSize:12, color:C.faint, lineHeight:1.7, margin:0 }}>
            <strong>Data note:</strong> Suburb scores are derived from ABS 2021 Census demographic data,
            Newcastle City Council commercial vacancy data, publicly listed commercial lease ranges
            on RealCommercial and CBRE Newcastle (Q1 2026), and Locatalyze industry benchmarks
            for NSW regional hospitality. Scores represent relative market opportunity, not a
            guarantee of business performance. For address-specific analysis, run a full Locatalyze
            report.{' '}
            <Link href="/methodology" style={{ color:C.green }}>Read our methodology →</Link>
          </p>
        </div>
      </section>

    </main>
  )
}
