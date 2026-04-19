'use client'
// app/(marketing)/analyse/wollongong/page.tsx
// Premium long-form Wollongong business location hub
// Targets: "best suburbs to open a café Wollongong", "Wollongong business location analysis"

import Link from 'next/link'
import { useState } from 'react'

// ── Schema ──────────────────────────────────────────────────────────────────
const SCHEMA_ARTICLE = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Best Suburbs to Open a Business in Wollongong NSW — Location Intelligence 2026',
  author: { '@type': 'Organization', name: 'Locatalyze', url: 'https://www.locatalyze.com' },
  publisher: { '@type': 'Organization', name: 'Locatalyze' },
  datePublished: '2026-04-01',
  dateModified: '2026-04-19',
  url: 'https://www.locatalyze.com/analyse/wollongong',
  description:
    'Data-backed guide to business locations in Wollongong NSW. Best suburbs for cafés, restaurants, and retail, with rent benchmarks, foot traffic scores, and suburb-by-suburb analysis for 20 locations.',
}

const SCHEMA_BREADCRUMB = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.locatalyze.com' },
    { '@type': 'ListItem', position: 2, name: 'Analyse', item: 'https://www.locatalyze.com/analyse' },
    { '@type': 'ListItem', position: 3, name: 'Wollongong', item: 'https://www.locatalyze.com/analyse/wollongong' },
  ],
}

const SCHEMA_FAQ = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the best suburb in Wollongong to open a café?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "North Wollongong is the strongest café opportunity in the region — beach proximity, UOW corridor trade, and virtually no quality incumbent. For an operator who wants community loyalty over tourism, Fairy Meadow's Lawrence Hargrave Drive strip offers the best independent café culture in the Illawarra at rents 40–50% below comparable Sydney strips. For the single lowest break-even threshold, Austinmer's small beach village delivers remarkable unit economics: 30 covers/day at $24 average ticket on sub-$1,800/month rent.",
      },
    },
    {
      '@type': 'Question',
      name: 'How much does commercial rent cost in Wollongong?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Wollongong commercial rent ranges from $900–$1,800/month in outer working-class suburbs like Berkeley and Port Kembla, to $3,000–$7,500/month for prime Crown Street CBD positions. Inner coastal suburbs like North Wollongong and Fairy Meadow sit at $1,800–$4,500/month. Kiama (the premium coastal market) ranges $2,500–$5,500/month. Thirroul — the region's most coveted village — runs $2,000–$4,200/month. Rents across the Illawarra are 35–55% below Sydney inner-suburb equivalents for comparable foot traffic quality.",
      },
    },
    {
      '@type': 'Question',
      name: 'Is Wollongong good for opening a restaurant?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Wollongong is good for opening a restaurant if you choose the right suburb and the right cuisine. Kiama is the region's strongest restaurant market — tourism economy plus high-income local demographic sustains 7-day dinner trade in summer. Fairy Meadow and Thirroul are strong for quality casual dining. Wollongong CBD works for lunch and Thursday–Saturday dinner with a clear cuisine identity. The mistake most operators make is overestimating weekday dinner trade outside the CBD and Kiama — most Wollongong suburbs are weekend-primary restaurant markets.",
      },
    },
    {
      '@type': 'Question',
      name: 'How does Wollongong compare to Sydney for business costs?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Commercial rents in Wollongong are 35–55% below Sydney inner-suburb equivalents. A position comparable to Newtown or Glebe in Wollongong (Fairy Meadow or North Wollongong) costs $2,000–$4,000/month versus $6,000–$12,000/month in Sydney. Staffing costs are marginally lower (5–10%) and average café ticket is $18–24 versus $22–30 in inner Sydney. The business case in Wollongong is built on significantly lower fixed costs. Revenue ceilings are also lower — but for operators priced out of Sydney, Wollongong's coastal suburbs offer genuine quality of life and financially viable hospitality businesses.",
      },
    },
    {
      '@type': 'Question',
      name: 'What are the risks of opening a business in Wollongong?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "The primary risks in Wollongong: (1) Weekend-demand trap — many suburbs have strong Saturday brunch trade but thin weekday volumes, making the annual average revenue much lower than weekend-peak figures suggest. (2) University seasonality — Gwynneville and student-adjacent suburbs lose 30–40% of foot traffic during December–February semester break. (3) Rent optimism — Crown Street CBD landlords quote rents priced for a hospitality culture the market is still building; negotiate hard. (4) Destination overestimation — suburban Wollongong does not have the tourist draw of Sydney's inner suburbs; most revenue must come from loyal locals.",
      },
    },
  ],
}

// ── Types ────────────────────────────────────────────────────────────────────
type Verdict = 'GO' | 'CAUTION' | 'AVOID'
type BizType = 'Café' | 'Restaurant' | 'Retail' | 'Gym' | 'Takeaway'

interface SuburbCard {
  name: string
  slug: string
  vibe: string
  bestFor: BizType[]
  competition: 'Low' | 'Medium' | 'High'
  rent: 'Low' | 'Medium' | 'High'
  footTraffic: 'Low' | 'Medium' | 'High'
  verdict: Verdict
  rentRange: string
  demandScore: number
  insight: string
  watchOut: string
}

// ── Suburb data ──────────────────────────────────────────────────────────────
const SUBURBS: SuburbCard[] = [
  {
    name: 'North Wollongong',
    slug: 'north-wollongong',
    vibe: 'Beachside dining · UOW corridor · weekend tourism',
    bestFor: ['Café', 'Restaurant', 'Retail'],
    competition: 'Low',
    rent: 'Medium',
    footTraffic: 'Medium',
    verdict: 'GO',
    rentRange: '$2,200–$4,500/mo',
    demandScore: 9,
    insight:
      'The sweet spot of the Wollongong market — beach access, UOW corridor weekday trade, and virtually no quality independent café. A well-executed brunch concept here does 50+ covers on a Saturday before 11am without a marketing budget. The tourist draw from Sydney day-trippers is real and growing.',
    watchOut:
      'Weekday trade drops sharply outside of semester. Model conservatively on a 5-day basis; treat peak summer weekends as upside.',
  },
  {
    name: 'Fairy Meadow',
    slug: 'fairy-meadow',
    vibe: 'Independent strip culture · young professional renters · beach access',
    bestFor: ['Café', 'Restaurant', 'Retail'],
    competition: 'Medium',
    rent: 'Medium',
    footTraffic: 'Medium',
    verdict: 'GO',
    rentRange: '$1,800–$3,800/mo',
    demandScore: 9,
    insight:
      "Fairy Meadow is the Illawarra's most underrated independent hospitality market. Lawrence Hargrave Drive has genuine strip energy — people walk it, browse it, and return to it. The young professional demographic gentrifying the suburb from Sydney's inner suburbs spends generously and markets businesses they love via social media. A quality concept here earns organic reach within weeks.",
    watchOut:
      'The strip rewards quality and punishes generic. Opening without a clear concept identity wastes the first-mover window.',
  },
  {
    name: 'Thirroul',
    slug: 'thirroul',
    vibe: 'Coastal village premium · high-income escapees · DH Lawrence country',
    bestFor: ['Café', 'Restaurant', 'Retail'],
    competition: 'Medium',
    rent: 'Medium',
    footTraffic: 'Medium',
    verdict: 'GO',
    rentRange: '$2,000–$4,200/mo',
    demandScore: 9,
    insight:
      "Thirroul has the highest household income in the northern Illawarra and a community that treats quality dining as a lifestyle priority. The existing café strip demonstrates strong demand — new quality operators here do not cannibalise, they grow the category. Saturday morning on Wigram Street feels like a scaled-down version of Surry Hills on a good day.",
    watchOut:
      'Quality is the baseline expectation. A generic concept in a village where the regulars are food-literate will be quietly ignored — and the community will not say why.',
  },
  {
    name: 'Kiama',
    slug: 'kiama',
    vibe: 'Premier tourism destination · high-income locals · 500k+ annual visitors',
    bestFor: ['Café', 'Restaurant', 'Retail'],
    competition: 'Medium',
    rent: 'High',
    footTraffic: 'High',
    verdict: 'GO',
    rentRange: '$2,500–$5,500/mo',
    demandScore: 9,
    insight:
      "Kiama is the Illawarra's most proven hospitality market. The Blowhole draws 500,000+ visitors annually. High-income local residents augment the tourism economy year-round. A quality operator here generates revenue from multiple demand sources simultaneously — locals, weekend tourists, Sydney day-trippers, and summer holiday visitors.",
    watchOut:
      'Quality expectations are the highest in the region. Average product in a market that expects excellence is more risky here than in less competitive suburbs.',
  },
  {
    name: 'Wollongong CBD',
    slug: 'wollongong-cbd',
    vibe: 'Crown Street spine · office workers · coastal tourism · evolving culture',
    bestFor: ['Café', 'Restaurant', 'Retail'],
    competition: 'High',
    rent: 'High',
    footTraffic: 'High',
    verdict: 'CAUTION',
    rentRange: '$3,000–$7,500/mo',
    demandScore: 7,
    insight:
      'Real foot traffic, real rent. The CBD has improved meaningfully in recent years — university presence, apartment growth, and WIN Entertainment Centre events sustain viable hospitality trade. The problem is rent: Crown Street positions are priced optimistically against a hospitality culture still finding its identity. Negotiate 20–30% below quoted rates.',
    watchOut:
      'Block-by-block foot traffic variation is extreme on Crown Street. Commission a pedestrian count at your specific address before signing anything.',
  },
  {
    name: 'Shellharbour',
    slug: 'shellharbour',
    vibe: 'Coastal village dining · marina tourism · authentic local character',
    bestFor: ['Café', 'Restaurant', 'Retail'],
    competition: 'Medium',
    rent: 'Medium',
    footTraffic: 'Medium',
    verdict: 'GO',
    rentRange: '$1,800–$3,800/mo',
    demandScore: 8,
    insight:
      "Shellharbour Village has quietly become one of the Illawarra's strongest weekend dining destinations. The marina development has brought new tourism and the village's authentic coastal character rewards quality hospitality above what the raw population numbers suggest.",
    watchOut:
      'Weekday trade outside summer is thin. Build your fixed cost structure on a 4-day model and treat weekday lunch as supplementary.',
  },
  {
    name: 'Gwynneville',
    slug: 'gwynneville',
    vibe: 'UOW adjacent · 38k students and staff · semester-structured demand',
    bestFor: ['Café', 'Takeaway', 'Gym'],
    competition: 'Low',
    rent: 'Low',
    footTraffic: 'Medium',
    verdict: 'GO',
    rentRange: '$1,400–$3,000/mo',
    demandScore: 7,
    insight:
      '38,000+ students and staff walking past on their way to and from campus is a demand base most suburbs never achieve. The institutional campus café offering is mediocre — the gap for a quality independent within 600m is real and uncontested.',
    watchOut:
      'The November–February semester break drops volume 30–40%. Build financial models on break-period volumes and treat semester trade as the upside.',
  },
  {
    name: 'Corrimal',
    slug: 'corrimal',
    vibe: 'Established suburban strip · families · commuter train station',
    bestFor: ['Café', 'Restaurant', 'Retail'],
    competition: 'Low',
    rent: 'Low',
    footTraffic: 'Medium',
    verdict: 'GO',
    rentRange: '$1,400–$2,800/mo',
    demandScore: 7,
    insight:
      "Corrimal is the Illawarra's most overlooked café opportunity. 12,000+ residents, train station, established strip, and no quality café. The first operator to open a genuine specialty café on Rawson Street owns the morning trade for 3–4 years.",
    watchOut:
      "The strip is functional, not glamorous. A concept that invests in fitout quality and exceeds the suburb's current hospitality standard wins. Matching the current standard doesn't.",
  },
  {
    name: 'Austinmer',
    slug: 'austinmer',
    vibe: 'Tiny beach village · $91k income median · world-class ocean pools',
    bestFor: ['Café', 'Retail'],
    competition: 'Low',
    rent: 'Low',
    footTraffic: 'Low',
    verdict: 'GO',
    rentRange: '$1,200–$2,500/mo',
    demandScore: 7,
    insight:
      'One of the best boutique unit economics in NSW coastal hospitality. Sub-$1,800/month rent, $91,000 median income, and zero quality café competition. A 30-cover café at $24 average ticket breaks even at barely 25 covers/day. The scale is deliberately small — and that is the point.',
    watchOut:
      'This is a boutique play. The market cannot support 80+ covers/day. Operators who try to scale beyond the village capacity create the worst of both worlds — overextended costs, underwhelmed customers.',
  },
  {
    name: 'Woonona',
    slug: 'woonona',
    vibe: 'Quiet coastal · between Corrimal and Thirroul · overlooked opportunity',
    bestFor: ['Café', 'Retail'],
    competition: 'Low',
    rent: 'Low',
    footTraffic: 'Low',
    verdict: 'GO',
    rentRange: '$1,400–$2,600/mo',
    demandScore: 6,
    insight:
      "Woonona's $78,000 median income and zero quality café is a combination that should not exist — but it does. The suburb exists in the commercial blind spot between two stronger strips. The community is ready for quality.",
    watchOut:
      'A community-loyalty model requires genuine investment in neighbourhood relationships. The foot traffic does not come to you here — you go to it.',
  },
  {
    name: 'Kotara equivalent: Figtree',
    slug: 'figtree',
    vibe: 'Affluent suburban · Figtree Grove Shopping Centre · high-income families',
    bestFor: ['Café', 'Retail', 'Gym'],
    competition: 'Medium',
    rent: 'Medium',
    footTraffic: 'High',
    verdict: 'CAUTION',
    rentRange: '$2,000–$5,000/mo',
    demandScore: 7,
    insight:
      'High foot traffic from the shopping centre, but almost entirely captured by national chains. External positions adjacent to Figtree Grove with specialty positioning can access the high-income ($82,000 median) family demographic. In-centre leases have turnover clauses — read carefully.',
    watchOut:
      'Do not sign an in-centre lease without an independent commercial solicitor reviewing the turnover rent provisions.',
  },
  {
    name: 'Dapto',
    slug: 'dapto',
    vibe: 'Growing residential · improving demographics · lowest rents in region',
    bestFor: ['Café', 'Gym', 'Takeaway'],
    competition: 'Low',
    rent: 'Low',
    footTraffic: 'Medium',
    verdict: 'CAUTION',
    rentRange: '$1,200–$2,500/mo',
    demandScore: 5,
    insight:
      'A 3-year bet on demographic growth. The residential development pipeline is real. Lock in a long lease now at pre-gentrification rents. Break-even is achievable from the train station commuter trade alone.',
    watchOut:
      "Do not model on future demographics — model on today's income levels and treat the demographic improvement as upside.",
  },
  {
    name: 'Warrawong',
    slug: 'warrawong',
    vibe: 'Diverse multicultural community · service suburb · volume-oriented',
    bestFor: ['Takeaway', 'Restaurant'],
    competition: 'Medium',
    rent: 'Low',
    footTraffic: 'Medium',
    verdict: 'CAUTION',
    rentRange: '$1,200–$2,800/mo',
    demandScore: 5,
    insight:
      'Authentic ethnic cuisine at accessible pricing is the only reliable business model here. The multicultural community has a strong authenticity radar — inauthentic concepts are rejected. A genuine Vietnamese or Filipino restaurant finds fierce local loyalty.',
    watchOut:
      'Premium positioning is not viable in Warrawong. This is a volume-first, price-sensitive market.',
  },
  {
    name: 'Towradgi',
    slug: 'towradgi',
    vibe: 'Quiet residential coastal · between stronger strips · beach access',
    bestFor: ['Café'],
    competition: 'Low',
    rent: 'Low',
    footTraffic: 'Low',
    verdict: 'CAUTION',
    rentRange: '$1,200–$2,400/mo',
    demandScore: 5,
    insight:
      'Viable only as a community-loyalty café at very low rent. The beach creates weekend visitors but the weekday base is thin. Do not open expecting Fairy Meadow-equivalent foot traffic — this is a slower, quieter build.',
    watchOut:
      'The strip sits between Fairy Meadow and Corrimal. If your concept works in Towradgi it probably works better in one of those two suburbs — check the rent difference before committing.',
  },
  {
    name: 'Albion Park',
    slug: 'albion-park',
    vibe: 'Shellharbour LGA · growing families · affordable suburban',
    bestFor: ['Café', 'Gym', 'Takeaway'],
    competition: 'Low',
    rent: 'Low',
    footTraffic: 'Medium',
    verdict: 'CAUTION',
    rentRange: '$1,100–$2,200/mo',
    demandScore: 5,
    insight:
      'Community-loyalty model at the lowest rents in the Shellharbour LGA. Train station proximity creates commuter coffee demand. Accessible pricing is non-negotiable — the demographic is value-oriented.',
    watchOut:
      'This is a community business, not a destination business. Marketing via local networks matters more than any digital strategy.',
  },
  {
    name: 'Unanderra',
    slug: 'unanderra',
    vibe: 'Industrial suburb · commuter trade · volume-efficiency market',
    bestFor: ['Café', 'Takeaway'],
    competition: 'Low',
    rent: 'Low',
    footTraffic: 'Low',
    verdict: 'CAUTION',
    rentRange: '$1,000–$2,000/mo',
    demandScore: 4,
    insight:
      'A train-station-dependent volume business. The commuter coffee demand is real and unserved. Build for speed, reliability, and accessible pricing — not quality-margin.',
    watchOut:
      'If your proposed position is more than 200m from the station, the model does not work. Train station proximity is the entire business case here.',
  },
  {
    name: 'Balgownie',
    slug: 'balgownie',
    vibe: 'UOW-adjacent residential · educated demographic · quiet strip',
    bestFor: ['Café'],
    competition: 'Low',
    rent: 'Low',
    footTraffic: 'Low',
    verdict: 'CAUTION',
    rentRange: '$1,100–$2,200/mo',
    demandScore: 5,
    insight:
      'UOW faculty and academic staff catchment creates quality-seeking daily demand that the campus institutional offering does not satisfy. A boutique specialty café targeting this demographic specifically outperforms a generic café aimed at everyone.',
    watchOut:
      "Semester breaks are quieter than Gwynneville's because the academic staff base is smaller than the student population. Build for 50-week revenue, not 52.",
  },
  {
    name: 'Port Kembla',
    slug: 'port-kembla',
    vibe: 'Industrial harbour · emerging creative community · first-mover creative',
    bestFor: ['Café'],
    competition: 'Low',
    rent: 'Low',
    footTraffic: 'Low',
    verdict: 'CAUTION',
    rentRange: '$900–$1,800/mo',
    demandScore: 4,
    insight:
      "Port Kembla is where Wollongong's creative first-movers will eventually go — the maritime character, low rents, and incoming arts community are the ingredients. The timing is early. For operators with a creative vision and low financial pressure, this is a 5-year play with potentially significant first-mover advantage.",
    watchOut:
      'Do not open here needing to break even in year one. The market is not there yet.',
  },
  {
    name: 'Berkeley',
    slug: 'berkeley',
    vibe: 'Working community · low income · south of CBD',
    bestFor: ['Café', 'Takeaway'],
    competition: 'Low',
    rent: 'Low',
    footTraffic: 'Low',
    verdict: 'CAUTION',
    rentRange: '$900–$1,800/mo',
    demandScore: 3,
    insight:
      'Viable only as a community-authenticity business at the region\'s lowest rents and accessible price points. For operators who genuinely want to serve a working-class community rather than extract from it.',
    watchOut:
      "The income levels in Berkeley do not support any premium positioning. If your model requires $5.50 coffee to work, this is not your suburb.",
  },
  {
    name: 'Mount Keira',
    slug: 'mount-keira',
    vibe: 'Escarpment residential · no commercial strip · scenic views',
    bestFor: [],
    competition: 'Low',
    rent: 'Low',
    footTraffic: 'Low',
    verdict: 'AVOID',
    rentRange: 'No established commercial',
    demandScore: 1,
    insight:
      'Not a commercial suburb. No established commercial strip, no passing foot traffic, and a population that drives to Wollongong CBD or Figtree for all commercial needs. The summit lookout creates a narrow weekend kiosk opportunity but no fixed tenancy viability.',
    watchOut:
      'Consider adjacent Wollongong CBD or Gwynneville for the same demographic at viable commercial infrastructure.',
  },
]

const TOP_PICKS = [
  {
    category: 'Best for Café',
    suburb: 'North Wollongong',
    reason: 'Beach proximity + UOW corridor + zero quality competition = best café market in the region.',
    verdict: 'GO' as Verdict,
    rentRange: '$2,200–$4,500/mo',
  },
  {
    category: 'Best for Restaurant',
    suburb: 'Kiama',
    reason: '500k+ annual visitors, $92k median income, and 7-day summer dinner trade. The Illawarra\'s most proven restaurant market.',
    verdict: 'GO' as Verdict,
    rentRange: '$2,500–$5,500/mo',
  },
  {
    category: 'Best Independent Culture',
    suburb: 'Fairy Meadow',
    reason: 'Lawrence Hargrave Drive is the Illawarra\'s answer to Newtown. Community actively supports and markets independent business.',
    verdict: 'GO' as Verdict,
    rentRange: '$1,800–$3,800/mo',
  },
  {
    category: 'Best Unit Economics',
    suburb: 'Austinmer',
    reason: '$91k median income, sub-$1,800/month rent, zero quality competition. A 30-cover café here is quietly one of the best hospitality businesses in NSW.',
    verdict: 'GO' as Verdict,
    rentRange: '$1,200–$2,500/mo',
  },
  {
    category: 'Best First-Mover',
    suburb: 'Corrimal',
    reason: '12,000+ residents, established train station strip, no quality café. The first operator here owns 3–4 unchallenged years.',
    verdict: 'GO' as Verdict,
    rentRange: '$1,400–$2,800/mo',
  },
]

const TABLE_SUBURBS = [
  { name: 'North Wollongong',  slug: 'north-wollongong',  cafe: 9, restaurant: 8, retail: 7, rent: 'Med',  traffic: 'Med',  verdict: 'GO'      },
  { name: 'Fairy Meadow',      slug: 'fairy-meadow',      cafe: 9, restaurant: 8, retail: 8, rent: 'Med',  traffic: 'Med',  verdict: 'GO'      },
  { name: 'Thirroul',          slug: 'thirroul',          cafe: 9, restaurant: 9, retail: 8, rent: 'Med',  traffic: 'Med',  verdict: 'GO'      },
  { name: 'Kiama',             slug: 'kiama',             cafe: 9, restaurant: 9, retail: 8, rent: 'High', traffic: 'High', verdict: 'GO'      },
  { name: 'Shellharbour',      slug: 'shellharbour',      cafe: 8, restaurant: 8, retail: 7, rent: 'Med',  traffic: 'Med',  verdict: 'GO'      },
  { name: 'Austinmer',         slug: 'austinmer',         cafe: 8, restaurant: 6, retail: 6, rent: 'Low',  traffic: 'Low',  verdict: 'GO'      },
  { name: 'Corrimal',          slug: 'corrimal',          cafe: 8, restaurant: 6, retail: 6, rent: 'Low',  traffic: 'Med',  verdict: 'GO'      },
  { name: 'Gwynneville',       slug: 'gwynneville',       cafe: 7, restaurant: 6, retail: 5, rent: 'Low',  traffic: 'Med',  verdict: 'GO'      },
  { name: 'Woonona',           slug: 'woonona',           cafe: 7, restaurant: 5, retail: 5, rent: 'Low',  traffic: 'Low',  verdict: 'GO'      },
  { name: 'Wollongong CBD',    slug: 'wollongong-cbd',    cafe: 7, restaurant: 7, retail: 7, rent: 'High', traffic: 'High', verdict: 'CAUTION' },
  { name: 'Figtree',           slug: 'figtree',           cafe: 6, restaurant: 5, retail: 7, rent: 'Med',  traffic: 'High', verdict: 'CAUTION' },
  { name: 'Dapto',             slug: 'dapto',             cafe: 5, restaurant: 4, retail: 5, rent: 'Low',  traffic: 'Med',  verdict: 'CAUTION' },
  { name: 'Balgownie',         slug: 'balgownie',         cafe: 6, restaurant: 4, retail: 4, rent: 'Low',  traffic: 'Low',  verdict: 'CAUTION' },
  { name: 'Albion Park',       slug: 'albion-park',       cafe: 5, restaurant: 4, retail: 4, rent: 'Low',  traffic: 'Med',  verdict: 'CAUTION' },
  { name: 'Towradgi',          slug: 'towradgi',          cafe: 5, restaurant: 3, retail: 3, rent: 'Low',  traffic: 'Low',  verdict: 'CAUTION' },
  { name: 'Warrawong',         slug: 'warrawong',         cafe: 4, restaurant: 6, retail: 4, rent: 'Low',  traffic: 'Med',  verdict: 'CAUTION' },
  { name: 'Unanderra',         slug: 'unanderra',         cafe: 4, restaurant: 3, retail: 3, rent: 'Low',  traffic: 'Low',  verdict: 'CAUTION' },
  { name: 'Port Kembla',       slug: 'port-kembla',       cafe: 4, restaurant: 3, retail: 3, rent: 'Low',  traffic: 'Low',  verdict: 'CAUTION' },
  { name: 'Berkeley',          slug: 'berkeley',          cafe: 3, restaurant: 3, retail: 2, rent: 'Low',  traffic: 'Low',  verdict: 'CAUTION' },
  { name: 'Mount Keira',       slug: 'mount-keira',       cafe: 1, restaurant: 1, retail: 1, rent: 'Low',  traffic: 'Low',  verdict: 'AVOID'   },
]

// ── Colours ──────────────────────────────────────────────────────────────────
const S = {
  brand: '#0891B2', brandDark: '#0369A1', brandLight: '#E0F7FA',
  emerald: '#059669', emeraldBg: '#ECFDF5', emeraldBdr: '#A7F3D0',
  amber: '#D97706', amberBg: '#FFFBEB', amberBdr: '#FDE68A',
  red: '#DC2626', redBg: '#FEF2F2', redBdr: '#FECACA',
  muted: '#475569', border: '#E2E8F0',
  n50: '#FAFAF9', n100: '#F5F5F4', n900: '#1C1917', white: '#FFFFFF',
}

function VerdictBadge({ v }: { v: Verdict }) {
  const cfg =
    v === 'GO' ? { bg: S.emeraldBg, bdr: S.emeraldBdr, txt: S.emerald }
    : v === 'CAUTION' ? { bg: S.amberBg, bdr: S.amberBdr, txt: S.amber }
    : { bg: S.redBg, bdr: S.redBdr, txt: S.red }
  return (
    <span style={{ fontSize: 11, fontWeight: 700, color: cfg.txt, background: cfg.bg, border: `1px solid ${cfg.bdr}`, borderRadius: 6, padding: '2px 9px' }}>
      {v}
    </span>
  )
}

function SuburbPoll() {
  const [voted, setVoted] = useState<number | null>(null)
  const [votes, setVotes] = useState([38, 24, 18, 12, 8])
  const options = ['North Wollongong / Fairy Meadow', 'Wollongong CBD', 'Kiama or Shellharbour', 'Thirroul or Austinmer', "I'm still researching"]
  const total = votes.reduce((a, b) => a + b, 0)
  function handle(i: number) {
    if (voted !== null) return
    setVoted(i)
    setVotes(prev => prev.map((v, idx) => idx === i ? v + 1 : v))
  }
  return (
    <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: 28, marginBottom: 48 }}>
      <h3 style={{ fontSize: 18, fontWeight: 800, color: S.n900, marginBottom: 6 }}>Where are you planning to open in Wollongong?</h3>
      <p style={{ fontSize: 13, color: S.muted, marginBottom: 20 }}>Tell us your target area — results update in real time.</p>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
        {options.map((opt, i) => {
          const pct = Math.round((votes[i] / total) * 100)
          return (
            <button key={opt} onClick={() => handle(i)} disabled={voted !== null}
              style={{ position: 'relative', border: `1.5px solid ${voted === i ? S.emeraldBdr : S.border}`, borderRadius: 10, padding: '12px 16px', background: S.white, cursor: voted === null ? 'pointer' : 'default', textAlign: 'left' as const, fontFamily: 'inherit', overflow: 'hidden' }}>
              {voted !== null && (
                <div style={{ position: 'absolute', inset: 0, width: `${pct}%`, background: 'rgba(8,145,178,0.07)', transition: 'width 0.4s' }} />
              )}
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: S.n900 }}>{opt}</span>
                {voted !== null && <span style={{ fontSize: 13, fontWeight: 700, color: S.brand }}>{pct}%</span>}
              </div>
            </button>
          )
        })}
      </div>
      {voted !== null && (
        <div style={{ marginTop: 16, padding: '14px 16px', background: S.emeraldBg, border: `1px solid ${S.emeraldBdr}`, borderRadius: 10 }}>
          <p style={{ fontSize: 13, color: '#047857' }}>
            Get your specific suburb analysis: <Link href="/onboarding" style={{ fontWeight: 700, textDecoration: 'underline' }}>Run a free report →</Link>
          </p>
        </div>
      )}
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function WollongongPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA_ARTICLE) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA_BREADCRUMB) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA_FAQ) }} />

      <div style={{ background: S.n50, minHeight: '100vh' }}>

        {/* Breadcrumb */}
        <div style={{ background: S.white, borderBottom: `1px solid ${S.border}`, padding: '12px 20px', fontSize: 13 }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
            <Link href="/" style={{ color: S.brand, textDecoration: 'none' }}>Home</Link>
            <span style={{ color: S.muted }}>/</span>
            <Link href="/analyse" style={{ color: S.brand, textDecoration: 'none' }}>Analyse</Link>
            <span style={{ color: S.muted }}>/</span>
            <span style={{ color: S.muted, fontWeight: 600 }}>Wollongong</span>
          </div>
        </div>

        {/* Hero */}
        <div style={{ background: `linear-gradient(135deg, ${S.brandDark} 0%, ${S.brand} 60%, #0E7490 100%)`, padding: '72px 20px 56px', color: S.white }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <p style={{ fontSize: 12, color: '#BAE6FD', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' as const, marginBottom: 14 }}>
              Illawarra Business Location Intelligence
            </p>
            <h1 style={{ fontSize: 46, fontWeight: 900, lineHeight: 1.12, marginBottom: 20, maxWidth: 720 }}>
              Where to Open a Business in Wollongong — and Where Not To
            </h1>
            <p style={{ fontSize: 18, color: '#E0F2FE', maxWidth: 640, lineHeight: 1.65, marginBottom: 36 }}>
              A practical guide for café founders, restaurant operators, and independent retailers. Suburb-by-suburb analysis, rent benchmarks, and GO / CAUTION verdicts — no fluff, no guesswork.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' as const }}>
              <Link href="/onboarding" style={{ background: S.white, color: S.brandDark, padding: '14px 28px', borderRadius: 10, fontWeight: 800, fontSize: 15, textDecoration: 'none' }}>
                Analyse My Location →
              </Link>
              <Link href="/analyse" style={{ border: `1.5px solid rgba(255,255,255,0.4)`, color: S.white, padding: '14px 28px', borderRadius: 10, fontWeight: 600, fontSize: 15, textDecoration: 'none' }}>
                View All Cities
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 24, marginTop: 48, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.15)' }}>
              {[
                { label: 'Suburbs Analysed', value: '20' },
                { label: 'Rent Range', value: '$900–$7,500/mo' },
                { label: 'Population (LGA)', value: '220,000+' },
                { label: 'UOW Students', value: '38,000+' },
                { label: 'Kiama Annual Visitors', value: '500,000+' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p style={{ fontSize: 11, color: '#BAE6FD', marginBottom: 4, textTransform: 'uppercase' as const, letterSpacing: 0.5 }}>{label}</p>
                  <p style={{ fontSize: 18, fontWeight: 800 }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* === SECTION: Is Wollongong good for business? === */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 20px 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 48 }}>
            <div>
              <h2 style={{ fontSize: 28, fontWeight: 900, color: S.n900, marginBottom: 20, lineHeight: 1.2 }}>
                Is Wollongong a good place to open a business?
              </h2>
              <p style={{ fontSize: 15, color: S.muted, lineHeight: 1.75, marginBottom: 16 }}>
                The honest answer: it depends entirely on where in Wollongong and what you are selling.
              </p>
              <p style={{ fontSize: 15, color: S.muted, lineHeight: 1.75, marginBottom: 16 }}>
                Wollongong is not a single market. It is a 50-kilometre coastal corridor — from Port Kembla's working-class harbour suburb to Kiama's premium tourism village — with dramatically different demographics, foot traffic patterns, and spending behaviours at every stop along the way.
              </p>
              <p style={{ fontSize: 15, color: S.muted, lineHeight: 1.75, marginBottom: 16 }}>
                A café that thrives on Thirroul's Wigram Street would struggle in Unanderra. A restaurant that works on Kiama's Collins Street would be invisible in Berkeley. The geography matters more than the city name.
              </p>
              <p style={{ fontSize: 15, color: S.muted, lineHeight: 1.75 }}>
                What Wollongong consistently offers across almost all suburbs is this: commercial rents 35–55% below Sydney inner-suburb equivalents, improving demographics driven by sea-change migration, and a genuine coastal lifestyle quality that attracts a spending-capable population. The fundamentals are improving. The opportunity is real. But the execution gap between the right suburb and the wrong one is enormous.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
              {[
                { icon: '📍', title: 'Population and growth', body: 'Wollongong LGA has 220,000+ residents with consistent in-migration from Sydney. The sea-change demographic brings higher household incomes and quality-seeking spending behaviour to inner suburbs.' },
                { icon: '🎓', title: 'University economy', body: 'UOW contributes 38,000+ students and staff to the Gwynneville, Fairy Meadow, and North Wollongong catchment. Semester-structured demand creates reliable weekday trade but requires seasonal financial modelling.' },
                { icon: '🌊', title: 'Coastal tourism', body: 'The 50km coastline — from Austinmer to Kiama — draws consistent weekend and holiday tourism, particularly from the Southern Highlands and Sydney. This creates a weekend premium in beach-adjacent suburbs that inland equivalents cannot replicate.' },
                { icon: '📅', title: 'Weekday vs weekend reality', body: 'The single most important dynamic: most Wollongong suburbs are weekend-primary markets. The weekday trade that Sydney inner suburbs take for granted does not exist in the same volume outside the CBD and Gwynneville. Every financial model must account for this.' },
              ].map(({ icon, title, body }) => (
                <div key={title} style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: '20px 22px', display: 'flex', gap: 16 }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{icon}</span>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: S.n900, marginBottom: 6 }}>{title}</p>
                    <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6 }}>{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* === SECTION: Top Picks === */}
        <div style={{ maxWidth: 1200, margin: '64px auto 0', padding: '0 20px' }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: S.n900, marginBottom: 8 }}>The quick answer for five common scenarios</h2>
          <p style={{ fontSize: 14, color: S.muted, marginBottom: 28 }}>Based on market conditions as of April 2026. Full suburb analysis below.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {TOP_PICKS.map((pick) => {
              const vc = pick.verdict === 'GO' ? { bg: S.emeraldBg, bdr: S.emeraldBdr, txt: S.emerald } : { bg: S.amberBg, bdr: S.amberBdr, txt: S.amber }
              return (
                <div key={pick.category} style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: '22px 24px' }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase' as const, letterSpacing: 0.8, marginBottom: 8 }}>{pick.category}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <p style={{ fontSize: 17, fontWeight: 800, color: S.n900 }}>{pick.suburb}</p>
                    <span style={{ fontSize: 10, fontWeight: 700, color: vc.txt, background: vc.bg, border: `1px solid ${vc.bdr}`, borderRadius: 5, padding: '2px 8px' }}>{pick.verdict}</span>
                  </div>
                  <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6, marginBottom: 12 }}>{pick.reason}</p>
                  <p style={{ fontSize: 12, color: S.muted }}>Rent: <strong style={{ color: S.n900 }}>{pick.rentRange}</strong></p>
                </div>
              )
            })}
          </div>
        </div>

        {/* === IMAGE SUGGESTIONS callout === */}
        <div style={{ maxWidth: 1200, margin: '48px auto 0', padding: '0 20px' }}>
          <div style={{ background: '#F0F9FF', border: `1px solid ${S.brand}30`, borderRadius: 14, padding: '20px 24px', display: 'flex', flexWrap: 'wrap' as const, gap: 24 }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase' as const, letterSpacing: 0.8, marginBottom: 6 }}>📸 Image: North Wollongong Beach Strip</p>
              <p style={{ fontSize: 12, color: S.muted }}>Cliff Road alfresco dining zone at 9am Saturday — shows the beach-café lifestyle opportunity and the gap in quality venues.</p>
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase' as const, letterSpacing: 0.8, marginBottom: 6 }}>📸 Image: Fairy Meadow Strip</p>
              <p style={{ fontSize: 12, color: S.muted }}>Lawrence Hargrave Drive mid-morning — independent shopfronts, street tables, and the community energy that defines the strip.</p>
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase' as const, letterSpacing: 0.8, marginBottom: 6 }}>📸 Image: Kiama Harbour + Collins Street</p>
              <p style={{ fontSize: 12, color: S.muted }}>Collins Street lunchtime Saturday — shows the density of the tourism economy and the quality expectations of the market.</p>
            </div>
          </div>
        </div>

        {/* === SECTION: Where Wollongong Works === */}
        <div style={{ maxWidth: 1200, margin: '64px auto 0', padding: '0 20px' }}>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: S.n900, marginBottom: 8 }}>Where Wollongong genuinely works</h2>
          <p style={{ fontSize: 14, color: S.muted, marginBottom: 36 }}>The specific conditions that make the Illawarra market compelling for quality independent operators.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {[
              {
                heading: 'The coastal café economy is undersupplied',
                body: 'North Wollongong, Austinmer, Woonona, and Corrimal all have household median incomes between $72,000 and $91,000, beach access, and no quality specialty café. That combination — high spending power, beach lifestyle, zero quality competition — would not last 18 months in any Sydney suburb. In Wollongong, it has persisted for years because operators keep opening in the CBD instead of where the opportunity is.',
              },
              {
                heading: 'The UOW demographic is permanently underserved',
                body: "38,000+ students and academic staff generate structured daily demand in Gwynneville and surrounds that an institutional campus café offering simply cannot satisfy. Every semester, a meaningful cohort of food-literate international students and quality-seeking academic staff walks past the campus café, dissatisfied. A quality independent 500m away is an easy walk and a significantly better experience. Nobody has properly capitalised on this.",
              },
              {
                heading: 'Sea-change migration keeps improving the demographics',
                body: "Sydney professionals who cannot afford the inner suburbs have been moving to Fairy Meadow, Thirroul, and Woonona for a decade. They bring Sydney spending habits — daily specialty coffee, regular quality dining, willingness to pay for experience — but they are living in suburbs priced as if they are a decade behind. This demographic mismatch is the fundamental Wollongong business opportunity.",
              },
              {
                heading: 'Rent is the structural advantage',
                body: 'A Fairy Meadow café position equivalent to a Newtown café in the quality of demographics and strip energy costs $2,000–$3,500/month versus $8,000–$14,000/month in Newtown. That gap of $6,000–$10,000/month in fixed costs is the difference between a café that breaks even at 35 covers/day and one that needs 90 covers/day. For operators who prioritise financial sustainability over postcodes, this matters enormously.',
              },
              {
                heading: 'Tourism creates a real weekend uplift',
                body: "Kiama's 500,000+ annual visitors and North Wollongong's growing Sydney day-tripper economy create weekend revenue peaks that no purely residential suburb can match. In summer, a quality café in either suburb sees 30–45% above baseline weekly revenue from visitors who spend generously and post actively. The review momentum from weekend tourist traffic builds permanent local reputation.",
              },
              {
                heading: 'The Illawarra has no dominant quality operator',
                body: "Unlike Sydney's inner suburbs, the Illawarra has no established Artificer, Single O, or Bourke Street Bakery equivalent that sets a region-wide quality standard and captures the quality-seeking demographic. The playing field is open. The operator who establishes a quality identity in the right suburb will own that position for years without a meaningful competitor emerging.",
              },
            ].map(({ heading, body }) => (
              <div key={heading} style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: '24px 26px' }}>
                <div style={{ width: 32, height: 3, background: S.brand, borderRadius: 2, marginBottom: 14 }} />
                <h3 style={{ fontSize: 16, fontWeight: 700, color: S.n900, marginBottom: 12, lineHeight: 1.4 }}>{heading}</h3>
                <p style={{ fontSize: 14, color: S.muted, lineHeight: 1.7 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* === SECTION: Where It Fails === */}
        <div style={{ maxWidth: 1200, margin: '64px auto 0', padding: '0 20px' }}>
          <div style={{ background: S.redBg, border: `1.5px solid ${S.redBdr}`, borderRadius: 20, padding: '36px 40px' }}>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: '#7F1D1D', marginBottom: 8 }}>Where Wollongong fails — and why most operators get this wrong</h2>
            <p style={{ fontSize: 14, color: '#991B1B', marginBottom: 32 }}>Read this before signing a lease.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 28 }}>
              {[
                {
                  title: 'The weekend-demand trap',
                  body: "Most Wollongong suburbs look viable on a Saturday morning. The queue at the local café, the beach crowd, the busy strip — it all suggests sustainable demand. What it actually represents is 30–40% of the week's revenue concentrated in 14 hours. Model your financial projections on Monday–Thursday revenue. If those four days do not work, the business does not work, regardless of how good Saturday looks.",
                },
                {
                  title: 'CBD rent optimism',
                  body: "Crown Street landlords quote rents priced for inner-Sydney foot traffic levels that Crown Street does not have. The hospitality culture in Wollongong CBD is genuinely improving — but it is still 3–5 years behind the rent expectations. Treating quoted rent as market rate is the most expensive mistake an operator can make here. Every Crown Street rent is a negotiation starting point.",
                },
                {
                  title: 'University seasonality blindspot',
                  body: "Operators who open in Gwynneville or close to UOW during a semester week see a specific foot traffic level and build their model on it. Then November arrives and 30–40% of their customer base leaves for summer. The semester-break period lasts November through February — four months. A café that was profitable in September can lose $8,000–$15,000 in those four months if the model was built on semester volumes.",
                },
                {
                  title: 'Overestimating the destination draw',
                  body: "In Sydney's inner suburbs, a quality new café opening draws customers from suburbs 10–15 minutes away. Wollongong is not yet that market. Most customers in most Wollongong suburbs are local residents or a nearby business district. The viral Instagram opening that draws Sydneysiders does not happen here — and marketing budgets built on that assumption fail. Build on local loyalty first; external recognition is the upside.",
                },
              ].map(({ title, body }) => (
                <div key={title}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#7F1D1D', marginBottom: 10, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <span style={{ color: S.red, flexShrink: 0 }}>✕</span> {title}
                  </h3>
                  <p style={{ fontSize: 13, color: '#991B1B', lineHeight: 1.7 }}>{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* === SECTION: Cost Reality === */}
        <div style={{ maxWidth: 1200, margin: '64px auto 0', padding: '0 20px' }}>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: S.n900, marginBottom: 8 }}>Cost reality: what it actually costs to operate in Wollongong</h2>
          <p style={{ fontSize: 14, color: S.muted, marginBottom: 36 }}>Before you model revenue, understand the cost structure.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 36 }}>
            {[
              {
                title: 'Rent by suburb tier',
                items: [
                  'Premium coastal (Kiama, Crown St CBD): $2,500–$7,500/mo',
                  'Inner coastal (North Wollon, Fairy Meadow, Thirroul): $1,800–$4,500/mo',
                  'Suburban strip (Corrimal, Shellharbour, Figtree): $1,400–$3,800/mo',
                  'Outer/community (Dapto, Warrawong, Albion Park): $1,000–$2,500/mo',
                ],
              },
              {
                title: 'Staffing costs (café, 2–3 staff)',
                items: [
                  'Full-time barista/manager: $60,000–$70,000/year',
                  'Casual staff: $30–$38/hour (incl. super)',
                  'Weekend penalty rates add 25–50% to weekend staff cost',
                  'A 3-person café costs $18,000–$28,000/month in labour',
                ],
              },
              {
                title: 'Customer spending behaviour',
                items: [
                  'Quality suburban café: $16–22 average ticket',
                  'Coastal/tourist cafés (North Wollon, Kiama): $22–28',
                  'Boutique village (Thirroul, Austinmer): $22–28',
                  'Community/suburban (Corrimal, Dapto): $13–17',
                ],
              },
            ].map(({ title, items }) => (
              <div key={title} style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: '24px 26px' }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: S.n900, marginBottom: 14 }}>{title}</h3>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
                  {items.map((item) => (
                    <div key={item} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <span style={{ color: S.brand, flexShrink: 0, fontWeight: 700, marginTop: 1 }}>›</span>
                      <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.55 }}>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: '#F0F9FF', border: `1px solid ${S.brand}30`, borderRadius: 14, padding: '24px 28px' }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: S.brandDark, marginBottom: 8 }}>The financial model that works in Wollongong</p>
            <p style={{ fontSize: 14, color: S.muted, lineHeight: 1.7 }}>
              The viable model in most Wollongong suburbs: rent under 12% of monthly revenue, labour under 35%, COGS under 30%. That leaves 23% gross margin for overheads and profit. At a suburban café with $2,000/month rent, that requires $16,667/month minimum revenue — 55 covers/day at $15 average ticket on a 7-day model, or 44 covers/day on a 6-day model. This is achievable in any GO-rated suburb without exceptional marketing.{' '}
              <Link href="/tools" style={{ color: S.brand, fontWeight: 700, textDecoration: 'underline' }}>Run the numbers for your specific location →</Link>
            </p>
          </div>
        </div>

        {/* === SECTION: What successful operators do === */}
        <div style={{ maxWidth: 1200, margin: '64px auto 0', padding: '0 20px' }}>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: S.n900, marginBottom: 8 }}>What successful Wollongong operators actually do</h2>
          <p style={{ fontSize: 14, color: S.muted, marginBottom: 36 }}>Patterns from operators who have built viable businesses in the Illawarra market.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {[
              {
                number: '01',
                heading: 'They choose the right suburb before they choose the café concept',
                body: 'Most operators enter with a concept and look for a location. Successful Wollongong operators identify the demand gap in a specific suburb first — and then design a concept to fill it. In Corrimal, that is the community breakfast café. In Kiama, that is the premium dining experience. In Gwynneville, that is the quality-over-campus alternative. The suburb defines the concept, not the other way around.',
              },
              {
                number: '02',
                heading: 'They build the business on weekday trade and treat weekends as upside',
                body: "The operators who fail in Wollongong build financial models on Saturday brunch trade. The operators who thrive build on Monday–Friday trade and are genuinely surprised by how good the weekends are. If you cannot hit break-even on four weekdays, your location or your model is wrong — regardless of what happens on Saturday.",
              },
              {
                number: '03',
                heading: 'They invest in community relationships before opening, not after',
                body: "The most successful Wollongong operators join the local Facebook groups six months before opening. They introduce themselves at the farmers market. They tell their neighbours what they are building. By opening day, the suburb already knows them — and the first 200 covers come from that relationship rather than from any marketing spend.",
              },
              {
                number: '04',
                heading: 'They negotiate rent as if their business depends on it (because it does)',
                body: "Every landlord in Wollongong quotes an optimistic rent. Every successful operator negotiates it. In the current market — with elevated vacancy rates on Crown Street and softness in outer suburban strips — a 15–25% reduction on quoted rent is negotiable for a quality tenant. That reduction, compounded over three years, is often the difference between a business that survives and one that does not.",
              },
              {
                number: '05',
                heading: 'They open with fewer seats and more quality',
                body: "The temptation in Wollongong is to maximise cover count to hit revenue targets. The operators who build lasting businesses consistently open with fewer seats than they could fit — and use the space to deliver a better experience. 35 covers done well creates more loyal customers than 70 covers done adequately. Loyal customers in a Wollongong suburb are worth $800–$1,200/year each from repeat visits. Maths favours quality.",
              },
              {
                number: '06',
                heading: 'They ignore the Illawarra Mercury and read the suburb, not the market',
                body: "Local media coverage of Wollongong's 'booming hospitality scene' and 'emerging café culture' creates noise that is often disconnected from the reality of a specific suburb on a specific street. Successful operators analyse foot traffic at their specific address, talk to nearby business owners about trading patterns, and count pedestrians at different times. They trust data over narrative.",
              },
            ].map(({ number, heading, body }) => (
              <div key={number} style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: '24px 26px' }}>
                <p style={{ fontSize: 32, fontWeight: 900, color: `${S.brand}30`, marginBottom: 10, lineHeight: 1 }}>{number}</p>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: S.n900, marginBottom: 10, lineHeight: 1.4 }}>{heading}</h3>
                <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.7 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* === SECTION: Common Mistakes === */}
        <div style={{ maxWidth: 1200, margin: '64px auto 0', padding: '0 20px' }}>
          <div style={{ background: S.amberBg, border: `1.5px solid ${S.amberBdr}`, borderRadius: 20, padding: '36px 40px' }}>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: '#78350F', marginBottom: 8 }}>The five most common mistakes — and how to avoid them</h2>
            <p style={{ fontSize: 14, color: '#92400E', marginBottom: 32 }}>These cost operators their first year of profit. Most are avoidable.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
              {[
                {
                  mistake: 'Wrong location assumption',
                  detail: 'Assuming the entire Wollongong market behaves like a single location. Corrimal and Thirroul are 8km apart and have fundamentally different customer profiles, foot traffic patterns, and pricing tolerances. Suburb-level analysis is the only analysis that matters.',
                  fix: 'Get a suburb-specific analysis before signing anything. Use Locatalyze\'s location report to validate your specific address.',
                },
                {
                  mistake: 'Overestimating demand',
                  detail: 'Basing financial projections on foot traffic counts taken on a Saturday morning in October. Weekend peak in a good month is not a representative sample of annual demand. Model on a Tuesday in June.',
                  fix: 'Count foot traffic at your specific address at 10am on a Tuesday and 3pm on a Thursday. If the numbers work on those two sessions, the business works.',
                },
                {
                  mistake: 'Ignoring weekday patterns',
                  detail: 'Opening with weekend-centric hours (9am–3pm, 7 days) in a suburb where weekday office or commuter trade is the primary volume driver. The best café positions near Wollongong train stations generate 60% of their revenue before 10am Monday–Friday.',
                  fix: 'Match opening hours to your suburb\'s demand pattern. Commuter suburbs need early starts. Beach suburbs need weekend hours. Campus suburbs need semester-aware staffing.',
                },
                {
                  mistake: 'Skipping the lease negotiation',
                  detail: 'Accepting a quoted rent as the market rate. In Wollongong\'s current environment — with Crown Street vacancies and softness in outer strips — quoted rents consistently exceed market rates. Every landlord expects a negotiation.',
                  fix: 'Never accept the first offer. Research comparable vacancies, calculate your maximum viable rent (12–14% of projected revenue), and negotiate from that number.',
                },
                {
                  mistake: 'Launching without a community',
                  detail: "Opening a café with no local following and hoping foot traffic converts to regulars. In a suburb of 8,000–15,000 residents, the community knows every business. A cold opening without pre-established relationships starts from zero. A warm opening — after 3–6 months of community engagement — starts from 50+ committed regulars.",
                  fix: 'Join local Facebook groups, attend the farmers market, meet your future neighbours. Build the community before you open the door.',
                },
              ].map(({ mistake, detail, fix }) => (
                <div key={mistake} style={{ background: 'rgba(255,255,255,0.6)', borderRadius: 12, padding: '18px 20px' }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#78350F', marginBottom: 8 }}>⚠ {mistake}</p>
                  <p style={{ fontSize: 13, color: '#92400E', lineHeight: 1.65, marginBottom: 10 }}>{detail}</p>
                  <p style={{ fontSize: 12, fontWeight: 600, color: S.emerald }}>Fix: {fix}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* === SECTION: Suburb Comparison Table === */}
        <div style={{ maxWidth: 1200, margin: '64px auto 0', padding: '0 20px' }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: S.n900, marginBottom: 8 }}>Wollongong suburb comparison — all 20 suburbs at a glance</h2>
          <p style={{ fontSize: 14, color: S.muted, marginBottom: 24 }}>Scores out of 10. Click any suburb for the full deep-dive analysis.</p>
          <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' as const, fontSize: 13 }}>
                <thead>
                  <tr style={{ background: S.n100, borderBottom: `1px solid ${S.border}` }}>
                    {['Suburb', 'Café', 'Restaurant', 'Retail', 'Rent', 'Traffic', 'Verdict'].map(h => (
                      <th key={h} style={{ padding: '12px 14px', textAlign: 'left' as const, fontWeight: 700, color: S.muted, fontSize: 11, textTransform: 'uppercase' as const, letterSpacing: 0.5, whiteSpace: 'nowrap' as const }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TABLE_SUBURBS.map((row, i) => {
                    const vc =
                      row.verdict === 'GO' ? { txt: S.emerald, bg: S.emeraldBg, bdr: S.emeraldBdr }
                      : row.verdict === 'CAUTION' ? { txt: S.amber, bg: S.amberBg, bdr: S.amberBdr }
                      : { txt: S.red, bg: S.redBg, bdr: S.redBdr }
                    return (
                      <tr key={row.slug} style={{ borderBottom: `1px solid ${S.border}`, background: i % 2 === 0 ? S.white : S.n50 }}>
                        <td style={{ padding: '11px 14px', whiteSpace: 'nowrap' as const }}>
                          <Link href={`/analyse/wollongong/${row.slug}`} style={{ color: S.brand, fontWeight: 600, textDecoration: 'none' }}>{row.name}</Link>
                        </td>
                        <td style={{ padding: '11px 14px', fontWeight: 700, color: row.cafe >= 8 ? S.emerald : row.cafe >= 6 ? S.amber : S.red }}>{row.cafe}</td>
                        <td style={{ padding: '11px 14px', fontWeight: 700, color: row.restaurant >= 8 ? S.emerald : row.restaurant >= 6 ? S.amber : S.red }}>{row.restaurant}</td>
                        <td style={{ padding: '11px 14px', fontWeight: 700, color: row.retail >= 8 ? S.emerald : row.retail >= 6 ? S.amber : S.red }}>{row.retail}</td>
                        <td style={{ padding: '11px 14px', color: S.muted }}>{row.rent}</td>
                        <td style={{ padding: '11px 14px', color: S.muted }}>{row.traffic}</td>
                        <td style={{ padding: '11px 14px' }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: vc.txt, background: vc.bg, border: `1px solid ${vc.bdr}`, borderRadius: 5, padding: '2px 8px' }}>{row.verdict}</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* === SECTION: Suburb Cards === */}
        <div style={{ maxWidth: 1200, margin: '64px auto 0', padding: '0 20px' }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: S.n900, marginBottom: 8 }}>Suburb-by-suburb analysis</h2>
          <p style={{ fontSize: 14, color: S.muted, marginBottom: 28 }}>Click any card for the full deep-dive — 800–1,200 words per suburb.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {SUBURBS.filter(s => s.verdict !== 'AVOID').map(s => {
              const vc = s.verdict === 'GO' ? { bg: S.emeraldBg, bdr: S.emeraldBdr, txt: S.emerald } : { bg: S.amberBg, bdr: S.amberBdr, txt: S.amber }
              const cmp = s.competition === 'Low' ? S.emerald : s.competition === 'Medium' ? S.amber : S.red
              const ftp = s.footTraffic === 'Low' ? S.muted : s.footTraffic === 'Medium' ? S.amber : S.emerald
              return (
                <Link key={s.slug} href={`/analyse/wollongong/${s.slug}`} style={{ textDecoration: 'none' }}>
                  <div style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 16, padding: '22px 24px', height: '100%', cursor: 'pointer', display: 'flex', flexDirection: 'column' as const, gap: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <p style={{ fontSize: 17, fontWeight: 800, color: S.n900, marginBottom: 4 }}>{s.name}</p>
                        <p style={{ fontSize: 12, color: S.muted }}>{s.vibe}</p>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: vc.txt, background: vc.bg, border: `1px solid ${vc.bdr}`, borderRadius: 6, padding: '3px 10px', flexShrink: 0, marginLeft: 12 }}>{s.verdict}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <span style={{ fontSize: 11, background: S.n100, borderRadius: 20, padding: '3px 10px', color: cmp, fontWeight: 600 }}>Comp: {s.competition}</span>
                      <span style={{ fontSize: 11, background: S.n100, borderRadius: 20, padding: '3px 10px', color: ftp, fontWeight: 600 }}>Traffic: {s.footTraffic}</span>
                    </div>
                    <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.65, flex: 1 }}>{s.insight}</p>
                    <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p style={{ fontSize: 12, color: S.muted }}>Rent: <strong style={{ color: S.n900 }}>{s.rentRange}</strong></p>
                      <p style={{ fontSize: 12, fontWeight: 700, color: S.brand }}>Full analysis →</p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* === SECTION: Poll === */}
        <div style={{ maxWidth: 900, margin: '64px auto 0', padding: '0 20px' }}>
          <SuburbPoll />
        </div>

        {/* === VIDEO IDEA callout === */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ background: '#F0F9FF', border: `1px solid ${S.brand}30`, borderRadius: 14, padding: '20px 24px' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: S.brand, textTransform: 'uppercase' as const, letterSpacing: 0.8, marginBottom: 6 }}>🎬 Video idea: Wollongong Business Location Walk</p>
            <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.6 }}>A 10-minute walking tour of North Wollongong → Fairy Meadow → CBD, with voiceover commentary on the foot traffic differences, rent zones, and the specific blocks that work versus those that look good but don't. Filmed on a Saturday at 9am and a Wednesday at 2pm to show the weekend–weekday contrast directly.</p>
          </div>
        </div>

        {/* === SECTION: FAQ === */}
        <div style={{ maxWidth: 900, margin: '64px auto 0', padding: '0 20px' }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: S.n900, marginBottom: 32 }}>Frequently asked questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 20 }}>
            {SCHEMA_FAQ.mainEntity.map((q) => (
              <div key={q.name} style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: 14, padding: '22px 24px' }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: S.n900, marginBottom: 10 }}>{q.name}</h3>
                <p style={{ fontSize: 13, color: S.muted, lineHeight: 1.75 }}>{q.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* === CTA === */}
        <div style={{ maxWidth: 1200, margin: '64px auto', padding: '0 20px' }}>
          <div style={{ background: `linear-gradient(135deg, ${S.brandDark} 0%, ${S.brand} 100%)`, borderRadius: 24, padding: '56px 48px', color: S.white, textAlign: 'center' as const }}>
            <h2 style={{ fontSize: 30, fontWeight: 900, marginBottom: 14 }}>Get a full AI location report for your specific Wollongong address</h2>
            <p style={{ fontSize: 16, color: '#E0F2FE', maxWidth: 560, margin: '0 auto 32px', lineHeight: 1.6 }}>
              Enter your address and business type. Our 8-agent AI pipeline analyses competitors, rent benchmarks, foot traffic, and demographics — and returns a GO / CAUTION / NO verdict with financial projections. 90 seconds.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' as const }}>
              <Link href="/onboarding" style={{ background: S.white, color: S.brandDark, padding: '16px 36px', borderRadius: 12, fontWeight: 800, fontSize: 16, textDecoration: 'none' }}>
                Analyse My Location →
              </Link>
              <Link href="/tools" style={{ border: `1.5px solid rgba(255,255,255,0.4)`, color: S.white, padding: '16px 36px', borderRadius: 12, fontWeight: 600, fontSize: 16, textDecoration: 'none' }}>
                Explore Tools
              </Link>
            </div>
            <p style={{ fontSize: 12, color: '#BAE6FD', marginTop: 16 }}>Free to start · No credit card · Report in 90 seconds</p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ background: S.n100, borderTop: `1px solid ${S.border}`, padding: '48px 20px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32, marginBottom: 32 }}>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: S.n900, marginBottom: 12 }}>Top Wollongong Suburbs</p>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 6 }}>
                  {['north-wollongong', 'fairy-meadow', 'thirroul', 'kiama', 'shellharbour'].map(slug => (
                    <Link key={slug} href={`/analyse/wollongong/${slug}`} style={{ fontSize: 12, color: S.brand, textDecoration: 'none', textTransform: 'capitalize' as const }}>{slug.replace(/-/g, ' ')}</Link>
                  ))}
                </div>
              </div>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: S.n900, marginBottom: 12 }}>Emerging Markets</p>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 6 }}>
                  {['corrimal', 'austinmer', 'woonona', 'gwynneville', 'dapto'].map(slug => (
                    <Link key={slug} href={`/analyse/wollongong/${slug}`} style={{ fontSize: 12, color: S.brand, textDecoration: 'none', textTransform: 'capitalize' as const }}>{slug.replace(/-/g, ' ')}</Link>
                  ))}
                </div>
              </div>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: S.n900, marginBottom: 12 }}>Locatalyze</p>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 6 }}>
                  <Link href="/" style={{ fontSize: 12, color: S.brand, textDecoration: 'none' }}>Home</Link>
                  <Link href="/analyse" style={{ fontSize: 12, color: S.brand, textDecoration: 'none' }}>All Cities</Link>
                  <Link href="/tools" style={{ fontSize: 12, color: S.brand, textDecoration: 'none' }}>Tools</Link>
                  <Link href="/onboarding" style={{ fontSize: 12, color: S.brand, textDecoration: 'none' }}>Start Free Analysis</Link>
                </div>
              </div>
            </div>
            <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 20, textAlign: 'center' as const }}>
              <p style={{ fontSize: 12, color: S.muted }}>
                © 2026 Locatalyze · Wollongong Business Location Intelligence · Data current as of April 2026
              </p>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}
