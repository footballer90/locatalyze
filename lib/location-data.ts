// lib/location-data.ts
// Programmatic SEO data for Australian city + business type pages

export const CITY_SLUGS = [
  'perth','sydney','melbourne','brisbane','adelaide',
 'canberra','hobart','darwin','gold-coast','newcastle',
 'geelong','wollongong'
] as const

export const TYPE_SLUGS = [
 'cafes','restaurants','retail','gyms','takeaway'
] as const

export type CitySlug = typeof CITY_SLUGS[number]
export type TypeSlug = typeof TYPE_SLUGS[number]

export interface CityArea {
 name: string
  vibe: string
  rentRange: string
  footTraffic: 'Very High' | 'High' | 'Moderate' | 'Low'
}

export interface CityData {
 slug: CitySlug
  name: string
  state: string
  population: string
  tagline: string
  description: string
  economy: string
  avgIncome: string
  businessClimate: string
  topAreas: CityArea[]
  strengths: string[]
  challenges: string[]
  demandScore: number // overall market demand 0-100
}

export interface TypeData {
  slug: TypeSlug
  name: string
  emoji: string
  description: string
  avgStartupCost: string
  avgMonthlyRevenue: string
  keySuccessFactors: string[]
}

export interface CityTypeInsight {
  demandScore: number
  competitionScore: number // higher = more competition
  opportunityScore: number
  avgRent: string
  topSuburbs: string[]
  swot: {
    strengths: string[]
    weaknesses: string[]
    opportunities: string[]
    threats: string[]
  }
  insight: string
  verdict: 'High Opportunity' | 'Moderate Opportunity' | 'Saturated' | 'Emerging'
}

// ─── CITIES ──────────────────────────────────────────────────────────────────

export const CITIES: CityData[] = [
 {
    slug: 'perth',
  name: 'Perth',
  state: 'WA',
  population: '2.2M',
  tagline: 'Australia\'s Fastest-Growing Capital',
  description: 'Perth is experiencing a remarkable growth surge driven by mining, technology, and population migration from eastern states. Its isolation creates strong local loyalty and limited interstate competition.',
  economy: 'Mining, Construction, Healthcare, Technology',
  avgIncome: '$72,000',
  businessClimate: 'Strong',
  topAreas: [
      { name: 'Perth CBD', vibe: 'Corporate & Lunch Trade', rentRange: '$4,000–$12,000/mo', footTraffic: 'High' },
   { name: 'Northbridge', vibe: 'Nightlife & Dining Precinct', rentRange: '$3,000–$8,000/mo', footTraffic: 'High' },
   { name: 'Fremantle', vibe: 'Tourism & Heritage', rentRange: '$2,500–$6,000/mo', footTraffic: 'Moderate' },
   { name: 'Subiaco', vibe: 'Affluent Residential', rentRange: '$3,500–$7,000/mo', footTraffic: 'Moderate' },
   { name: 'Mount Lawley', vibe: 'Café Culture & Hip', rentRange: '$2,000–$5,000/mo', footTraffic: 'Moderate' },
  ],
    strengths: ['Strong disposable income', 'Growing population', 'Local business loyalty', 'Underserved market gaps'],
  challenges: ['Geographic isolation', 'High commercial rents in CBD', 'Smaller market than east coast'],
  demandScore: 74,
  },
  {
    slug: 'sydney',
  name: 'Sydney',
  state: 'NSW',
  population: '5.3M',
  tagline: 'Australia\'s Business Capital',
  description: 'Sydney is Australia\'s largest city and financial hub, offering enormous market size but also intense competition and extremely high rents. Success here requires strong differentiation.',
  economy: 'Finance, Tourism, Technology, Professional Services',
  avgIncome: '$82,000',
  businessClimate: 'Very Strong',
  topAreas: [
      { name: 'CBD & Circular Quay', vibe: 'Corporate & Tourist', rentRange: '$8,000–$25,000/mo', footTraffic: 'Very High' },
   { name: 'Surry Hills', vibe: 'Trendy & Creative', rentRange: '$5,000–$12,000/mo', footTraffic: 'High' },
   { name: 'Newtown', vibe: 'Alternative & Students', rentRange: '$3,500–$8,000/mo', footTraffic: 'High' },
   { name: 'Bondi', vibe: 'Beach Lifestyle & Tourism', rentRange: '$5,000–$15,000/mo', footTraffic: 'Very High' },
   { name: 'Parramatta', vibe: 'Western Suburbs Hub', rentRange: '$3,000–$7,000/mo', footTraffic: 'High' },
  ],
    strengths: ['Massive market size', 'High tourist numbers', 'Affluent demographics', 'Strong CBD foot traffic'],
  challenges: ['Extremely high rent', 'Intense competition', 'High labour costs', 'Difficult to stand out'],
  demandScore: 88,
  },
  {
    slug: 'melbourne',
  name: 'Melbourne',
  state: 'VIC',
  population: '5.2M',
  tagline: 'Australia\'s Culture & Coffee Capital',
  description: 'Melbourne has the most sophisticated food and coffee culture in Australia. Consumers are discerning and trend-conscious, rewarding quality and authenticity above all.',
  economy: 'Finance, Education, Arts, Manufacturing, Healthcare',
  avgIncome: '$76,000',
  businessClimate: 'Very Strong',
  topAreas: [
      { name: 'CBD Laneways', vibe: 'Iconic Coffee Culture', rentRange: '$6,000–$20,000/mo', footTraffic: 'Very High' },
   { name: 'Fitzroy', vibe: 'Hipster & Artisan', rentRange: '$4,000–$9,000/mo', footTraffic: 'High' },
   { name: 'South Yarra', vibe: 'Affluent & Fashion', rentRange: '$5,000–$12,000/mo', footTraffic: 'High' },
   { name: 'Brunswick', vibe: 'Alternative & Students', rentRange: '$2,500–$6,000/mo', footTraffic: 'Moderate' },
   { name: 'St Kilda', vibe: 'Beach & Tourism', rentRange: '$3,500–$8,000/mo', footTraffic: 'High' },
  ],
    strengths: ['World-class food culture', 'Large student population', 'High repeat visitation', 'Strong arts community'],
  challenges: ['Very high competition', 'Discerning customers', 'High rent in key precincts', 'Post-COVID recovery'],
  demandScore: 91,
  },
  {
    slug: 'brisbane',
  name: 'Brisbane',
  state: 'QLD',
  population: '2.5M',
  tagline: 'Australia\'s Sunshine City on the Rise',
  description: 'Brisbane is experiencing rapid growth fuelled by interstate migration and the upcoming 2032 Olympics. The market is less saturated than Sydney or Melbourne, creating significant opportunity.',
  economy: 'Construction, Tourism, Finance, Technology',
  avgIncome: '$70,000',
  businessClimate: 'Strong',
  topAreas: [
      { name: 'Fortitude Valley', vibe: 'Nightlife & Entertainment', rentRange: '$3,500–$9,000/mo', footTraffic: 'High' },
   { name: 'South Bank', vibe: 'Cultural & Tourist', rentRange: '$4,000–$10,000/mo', footTraffic: 'Very High' },
   { name: 'New Farm', vibe: 'Affluent & Café Culture', rentRange: '$3,000–$7,000/mo', footTraffic: 'Moderate' },
   { name: 'West End', vibe: 'Multicultural & Hip', rentRange: '$2,500–$6,000/mo', footTraffic: 'Moderate' },
   { name: 'CBD', vibe: 'Corporate & Lunch', rentRange: '$5,000–$14,000/mo', footTraffic: 'High' },
  ],
    strengths: ['Fast population growth', 'Olympics investment boost', 'Lower rents than Sydney/Melbourne', 'Strong tourism'],
  challenges: ['Less mature market', 'Weather (extreme heat impact on foot traffic)', 'Smaller corporate sector'],
  demandScore: 79,
  },
  {
    slug: 'adelaide',
  name: 'Adelaide',
  state: 'SA',
  population: '1.4M',
  tagline: 'The City of Churches & Culinary Gems',
  description: 'Adelaide is often overlooked but punches above its weight for food and hospitality. Rents are dramatically lower than east coast capitals and the population is fiercely loyal to local businesses.',
  economy: 'Defence, Wine Industry, Healthcare, Education',
  avgIncome: '$65,000',
  businessClimate: 'Moderate',
  topAreas: [
      { name: 'Rundle Street', vibe: 'Shopping & Dining', rentRange: '$2,500–$6,000/mo', footTraffic: 'High' },
   { name: 'Gouger Street', vibe: 'Restaurant Row', rentRange: '$2,000–$5,000/mo', footTraffic: 'Moderate' },
   { name: 'North Adelaide', vibe: 'Affluent & Heritage', rentRange: '$2,000–$5,000/mo', footTraffic: 'Moderate' },
   { name: 'Norwood', vibe: 'Village Feel & Foodie', rentRange: '$1,800–$4,500/mo', footTraffic: 'Moderate' },
   { name: 'Glenelg', vibe: 'Beach & Tourism', rentRange: '$2,000–$5,000/mo', footTraffic: 'Moderate' },
  ],
    strengths: ['Affordable rents', 'Strong local loyalty', 'Major events (Fringe, SALA)', 'Growing tourism'],
  challenges: ['Smaller population', 'Lower average spend', 'Brain drain to east coast', 'Quieter evenings in off-peak'],
  demandScore: 62,
  },
  {
    slug: 'canberra',
  name: 'Canberra',
  state: 'ACT',
  population: '460K',
  tagline: 'High Income, Captive Audience',
  description: 'Canberra has the highest average income in Australia and a stable public sector workforce. The market is smaller but customers spend freely and are loyal to quality businesses.',
  economy: 'Government, Education, Defence, Technology',
  avgIncome: '$92,000',
  businessClimate: 'Strong',
  topAreas: [
      { name: 'Civic (City Centre)', vibe: 'Government Workers & Retail', rentRange: '$3,000–$8,000/mo', footTraffic: 'High' },
   { name: 'Braddon', vibe: 'Trendy & Café Strip', rentRange: '$2,500–$6,000/mo', footTraffic: 'High' },
   { name: 'Kingston', vibe: 'Affluent & Waterfront', rentRange: '$3,000–$7,000/mo', footTraffic: 'Moderate' },
   { name: 'Manuka', vibe: 'Upmarket Dining', rentRange: '$3,500–$8,000/mo', footTraffic: 'Moderate' },
   { name: 'Belconnen', vibe: 'Suburban Hub & University', rentRange: '$2,000–$4,500/mo', footTraffic: 'Moderate' },
  ],
    strengths: ['Highest income per capita in Australia', 'Stable workforce', 'Low crime', 'Strong lunch trade'],
  challenges: ['Small population ceiling', 'Government budget-dependent economy', 'Limited tourist trade', 'Parking-dependent'],
  demandScore: 68,
  },
  {
    slug: 'hobart',
  name: 'Hobart',
  state: 'TAS',
  population: '240K',
  tagline: 'Tasmania\'s Rising Star',
  description: 'Hobart has transformed from a sleepy capital into a must-visit food and arts destination, driven by MONA and growing tourism. Competition is low but the market is still small.',
  economy: 'Tourism, Aquaculture, Education, Arts',
  avgIncome: '$60,000',
  businessClimate: 'Emerging',
  topAreas: [
      { name: 'Salamanca', vibe: 'Tourism & Markets', rentRange: '$2,000–$5,500/mo', footTraffic: 'High' },
   { name: 'CBD', vibe: 'Commercial & Lunch', rentRange: '$2,500–$6,000/mo', footTraffic: 'Moderate' },
   { name: 'Battery Point', vibe: 'Heritage & Tourism', rentRange: '$1,800–$4,500/mo', footTraffic: 'Moderate' },
   { name: 'North Hobart', vibe: 'Local Dining Strip', rentRange: '$1,500–$3,500/mo', footTraffic: 'Moderate' },
   { name: 'Sandy Bay', vibe: 'University & Residential', rentRange: '$1,500–$3,500/mo', footTraffic: 'Low' },
  ],
    strengths: ['Low competition', 'Strong tourism growth', 'MONA-driven arts culture', 'Affordable rents'],
  challenges: ['Very small population', 'Seasonal tourist fluctuation', 'Lower average income', 'Limited late-night trade'],
  demandScore: 55,
  },
  {
    slug: 'darwin',
  name: 'Darwin',
  state: 'NT',
  population: '150K',
  tagline: 'Gateway to Australia\'s Top End',
  description: 'Darwin is a unique market with a mix of government workers, Defence personnel, and tourists. The climate creates strong seasonal patterns and outdoor dining is central to lifestyle.',
  economy: 'Defence, Government, Tourism, Mining, Energy',
  avgIncome: '$78,000',
  businessClimate: 'Niche',
  topAreas: [
      { name: 'Darwin CBD', vibe: 'Corporate & Government', rentRange: '$2,500–$6,500/mo', footTraffic: 'Moderate' },
   { name: 'Fannie Bay', vibe: 'Beachside & Lifestyle', rentRange: '$2,000–$4,500/mo', footTraffic: 'Moderate' },
   { name: 'Parap', vibe: 'Local Market & Village', rentRange: '$1,500–$3,500/mo', footTraffic: 'Low' },
   { name: 'Nightcliff', vibe: 'Coastal & Community', rentRange: '$1,500–$3,500/mo', footTraffic: 'Low' },
   { name: 'Casuarina', vibe: 'Suburban Shopping Hub', rentRange: '$2,000–$5,000/mo', footTraffic: 'Moderate' },
  ],
    strengths: ['High disposable income', 'Defence & government base', 'Outdoor dining culture', 'Low existing competition'],
  challenges: ['Very small market', 'Extreme wet season slowdown', 'High staff turnover', 'Remote supply chain costs'],
  demandScore: 48,
  },
  {
    slug: 'gold-coast',
  name: 'Gold Coast',
  state: 'QLD',
  population: '750K',
  tagline: 'Tourism Powerhouse & Lifestyle Hub',
  description: 'The Gold Coast\'s beach lifestyle and massive tourist volume creates strong demand for hospitality. However, the market is highly seasonal and tourist-dependent.',
  economy: 'Tourism, Construction, Retail, Healthcare',
  avgIncome: '$65,000',
  businessClimate: 'Moderate',
  topAreas: [
      { name: 'Surfers Paradise', vibe: 'Tourist & Nightlife', rentRange: '$3,500–$10,000/mo', footTraffic: 'Very High' },
   { name: 'Broadbeach', vibe: 'Dining & Entertainment', rentRange: '$3,000–$8,000/mo', footTraffic: 'High' },
   { name: 'Burleigh Heads', vibe: 'Surf Culture & Lifestyle', rentRange: '$2,500–$6,000/mo', footTraffic: 'High' },
   { name: 'Southport', vibe: 'Commercial Hub', rentRange: '$2,000–$5,000/mo', footTraffic: 'Moderate' },
   { name: 'Coolangatta', vibe: 'Relaxed Beach Town', rentRange: '$1,800–$4,500/mo', footTraffic: 'Moderate' },
  ],
    strengths: ['Huge tourist volume', 'Strong beach culture', 'Growing permanent population', 'Event calendar'],
  challenges: ['Seasonal fluctuations', 'Tourist vs local split tricky to navigate', 'High staff turnover', 'Price-sensitive tourists'],
  demandScore: 72,
  },
  {
    slug: 'newcastle',
  name: 'Newcastle',
  state: 'NSW',
  population: '500K',
  tagline: 'NSW\'s Second City, Rising Fast',
  description: 'Newcastle has reinvented itself from a steel town into a vibrant coastal city. The local market is price-conscious but deeply supportive of local businesses, and rents are a fraction of Sydney.',
  economy: 'Healthcare, Education, Construction, Tourism',
  avgIncome: '$67,000',
  businessClimate: 'Moderate',
  topAreas: [
      { name: 'Hunter Street', vibe: 'Urban Revival & Dining', rentRange: '$1,800–$4,500/mo', footTraffic: 'Moderate' },
   { name: 'Darby Street', vibe: 'Café Culture & Boutiques', rentRange: '$1,500–$3,500/mo', footTraffic: 'Moderate' },
   { name: 'Honeysuckle', vibe: 'Waterfront & Entertainment', rentRange: '$2,500–$6,000/mo', footTraffic: 'High' },
   { name: 'Merewether', vibe: 'Beach Suburb', rentRange: '$1,500–$3,500/mo', footTraffic: 'Moderate' },
   { name: 'Hamilton', vibe: 'Local Hub & Restaurants', rentRange: '$1,500–$3,500/mo', footTraffic: 'Moderate' },
  ],
    strengths: ['Affordable rents', 'Strong local support', 'Growing city', 'University population'],
  challenges: ['Lower average incomes', 'Sydney comparison pressure', 'Limited evening trade in some areas'],
  demandScore: 61,
  },
  {
    slug: 'geelong',
  name: 'Geelong',
  state: 'VIC',
  population: '270K',
  tagline: 'Melbourne\'s Neighbour, Its Own Identity',
  description: 'Geelong is growing rapidly as Melbourne\'s affordable neighbour. Remote work migration has brought higher-income residents, creating new demand for quality hospitality.',
  economy: 'Healthcare, Education, Construction, Manufacturing',
  avgIncome: '$65,000',
  businessClimate: 'Emerging',
  topAreas: [
      { name: 'CBD & Waterfront', vibe: 'Dining & Tourism', rentRange: '$2,000–$5,500/mo', footTraffic: 'Moderate' },
   { name: 'Pakington Street', vibe: 'Boutique & Café Strip', rentRange: '$1,800–$4,500/mo', footTraffic: 'Moderate' },
   { name: 'Newtown', vibe: 'Leafy & Affluent', rentRange: '$1,500–$3,500/mo', footTraffic: 'Low' },
   { name: 'Torquay Road Corridor', vibe: 'Surf Coast Gateway', rentRange: '$1,500–$3,500/mo', footTraffic: 'Low' },
  ],
    strengths: ['Rapid population growth', 'Lower rents', 'Proximity to Melbourne', 'Remote worker influx'],
  challenges: ['Less established dining culture', 'Lower population density', 'Melbourne\'s shadow'],
  demandScore: 59,
  },
  {
    slug: 'wollongong',
  name: 'Wollongong',
  state: 'NSW',
  population: '330K',
  tagline: 'Sydney\'s Coastal Escape',
  description: 'Wollongong sits between the mountains and the sea, with a large university population and growing commuter base. The market is price-sensitive but loyal and expanding.',
  economy: 'Healthcare, Education, Steel, Construction',
  avgIncome: '$64,000',
  businessClimate: 'Emerging',
  topAreas: [
      { name: 'Crown Street', vibe: 'Dining & Café Strip', rentRange: '$1,500–$4,000/mo', footTraffic: 'Moderate' },
   { name: 'Wollongong CBD', vibe: 'Commercial & Students', rentRange: '$1,500–$4,000/mo', footTraffic: 'Moderate' },
   { name: 'Thirroul', vibe: 'Village & Artisan', rentRange: '$1,200–$3,000/mo', footTraffic: 'Low' },
   { name: 'Fairy Meadow', vibe: 'University Adjacent', rentRange: '$1,200–$2,800/mo', footTraffic: 'Low' },
  ],
    strengths: ['Large student population', 'Low rents', 'Commuter growth', 'Proximity to Sydney market'],
  challenges: ['Price-sensitive customers', 'High student turnover', 'Competition from Sydney'],
  demandScore: 56,
  },
]

// ─── BUSINESS TYPES ───────────────────────────────────────────────────────────

export const BUSINESS_TYPES: TypeData[] = [
  {
    slug: 'cafes',
  name: 'Cafes',
  emoji: '',
  description: 'Coffee shops and café-style venues',
  avgStartupCost: '$80,000–$200,000',
  avgMonthlyRevenue: '$25,000–$80,000',
  keySuccessFactors: ['Morning foot traffic', 'Office proximity', 'Coffee quality differentiation', 'Dwell time space'],
 },
  {
    slug: 'restaurants',
  name: 'Restaurants',
  emoji: '',
  description: 'Full-service dining restaurants',
  avgStartupCost: '$150,000–$500,000',
  avgMonthlyRevenue: '$60,000–$250,000',
  keySuccessFactors: ['Evening foot traffic', 'Parking availability', 'Liquor licence', 'Cuisine differentiation'],
 },
  {
    slug: 'retail',
  name: 'Retail',
  emoji: '',
  description: 'Physical retail stores and boutiques',
  avgStartupCost: '$50,000–$300,000',
  avgMonthlyRevenue: '$30,000–$150,000',
  keySuccessFactors: ['Pedestrian flow', 'Anchor store proximity', 'Parking access', 'Street visibility'],
 },
  {
    slug: 'gyms',
  name: 'Gyms',
  emoji: '',
  description: 'Fitness centres and gyms',
  avgStartupCost: '$100,000–$600,000',
  avgMonthlyRevenue: '$30,000–$120,000',
  keySuccessFactors: ['Ground floor or easy access', 'Large floor space', 'Residential density', 'Car parking'],
 },
  {
    slug: 'takeaway',
  name: 'Takeaway',
  emoji: '',
  description: 'Takeaway and quick service food',
  avgStartupCost: '$40,000–$150,000',
  avgMonthlyRevenue: '$20,000–$70,000',
  keySuccessFactors: ['Lunchtime foot traffic', 'Office worker proximity', 'Delivery zone coverage', 'Speed of service'],
 },
]

// ─── CITY + TYPE SPECIFIC INSIGHTS ───────────────────────────────────────────

type CityTypeKey = `${CitySlug}-${TypeSlug}`

const CITY_TYPE_OVERRIDES: Partial<Record<CityTypeKey, Partial<CityTypeInsight>>> = {
  'melbourne-cafes': {
  demandScore: 95,
    competitionScore: 90,
    opportunityScore: 72,
    topSuburbs: ['Fitzroy', 'CBD Laneways', 'Brunswick', 'South Yarra', 'Collingwood'],
  insight: 'Melbourne\'s café culture is world-renowned. Entry requires exceptional coffee quality and strong point of difference — generic offerings will not survive here.',
  verdict: 'Saturated',
 },
  'sydney-restaurants': {
  demandScore: 93,
    competitionScore: 88,
    opportunityScore: 70,
    topSuburbs: ['Surry Hills', 'Newtown', 'CBD', 'Bondi', 'Pyrmont'],
  insight: 'Sydney diners are food-savvy and spend freely, but competition is fierce. Success requires a clear cuisine niche and strong social media presence.',
  verdict: 'High Opportunity',
 },
  'perth-cafes': {
  demandScore: 82,
    competitionScore: 60,
    opportunityScore: 85,
    topSuburbs: ['Mount Lawley', 'Subiaco', 'Leederville', 'Fremantle', 'Victoria Park'],
  insight: 'Perth\'s café culture is maturing rapidly and demand outpaces supply in many suburbs. Strong opportunity for quality operators.',
  verdict: 'High Opportunity',
 },
  'brisbane-cafes': {
  demandScore: 80,
    competitionScore: 58,
    opportunityScore: 84,
    topSuburbs: ['New Farm', 'West End', 'Paddington', 'Teneriffe', 'CBD'],
  insight: 'Brisbane\'s café scene is growing faster than new openings. Olympic-driven population growth adds long-term tailwind.',
  verdict: 'High Opportunity',
 },
  'gold-coast-takeaway': {
  demandScore: 85,
    competitionScore: 70,
    opportunityScore: 80,
    topSuburbs: ['Surfers Paradise', 'Broadbeach', 'Southport', 'Burleigh', 'Robina'],
  insight: 'Tourist volume creates massive takeaway demand, particularly around surf beaches and entertainment precincts.',
  verdict: 'High Opportunity',
 },
  'canberra-restaurants': {
  demandScore: 78,
    competitionScore: 50,
    opportunityScore: 88,
    topSuburbs: ['Manuka', 'Kingston', 'Braddon', 'Civic', 'Barton'],
  insight: 'Canberra\'s high income and government expense accounts create strong restaurant spending with lower competition than east coast capitals.',
  verdict: 'High Opportunity',
 },
  'adelaide-restaurants': {
  demandScore: 72,
    competitionScore: 55,
    opportunityScore: 82,
    topSuburbs: ['Gouger Street', 'Rundle Street', 'Henley Beach', 'North Adelaide', 'Unley'],
  insight: 'Adelaide\'s food scene is acclaimed nationally but rents are low. Restaurant operators find strong returns here compared to Sydney or Melbourne.',
  verdict: 'High Opportunity',
 },
}

// ─── GENERATED INSIGHTS ──────────────────────────────────────────────────────

function generateVerdict(opportunity: number): CityTypeInsight['verdict'] {
 if (opportunity >= 85) return 'High Opportunity'
 if (opportunity >= 70) return 'Moderate Opportunity'
 if (opportunity >= 50) return 'Emerging'
 return 'Saturated'
}

export function getCityTypeInsight(citySlug: CitySlug, typeSlug: TypeSlug): CityTypeInsight {
 const key: CityTypeKey = `${citySlug}-${typeSlug}`
  const city = CITIES.find(c => c.slug === citySlug)!
  const type = BUSINESS_TYPES.find(t => t.slug === typeSlug)!
  const override = CITY_TYPE_OVERRIDES[key] || {}

  const baseDemand = city.demandScore
  const typeMultipliers: Record<TypeSlug, number> = {
    cafes: 1.05, restaurants: 1.0, retail: 0.9, gyms: 0.85, takeaway: 0.95,
  }

  const demand = override.demandScore ?? Math.min(99, Math.round(baseDemand * typeMultipliers[typeSlug]))
  const competition = override.competitionScore ?? Math.min(95, Math.round(demand * 0.72))
  const opportunity = override.opportunityScore ?? Math.min(99, Math.round(demand - competition * 0.3 + 30))

  const defaultSuburbs = city.topAreas.slice(0, 4).map(a => a.name)
  const topSuburbs = override.topSuburbs ?? defaultSuburbs

  const rentArea = city.topAreas[1] || city.topAreas[0]
  const avgRent = override.avgRent ?? rentArea.rentRange

  const defaultInsight = `${city.name} presents a ${generateVerdict(opportunity).toLowerCase()} for ${type.name.toLowerCase()}. With a population of ${city.population} and an average income of ${city.avgIncome}, the fundamentals are ${demand >= 75 ? 'strong' : 'moderate'}. Key success factors include ${type.keySuccessFactors[0].toLowerCase()} and ${type.keySuccessFactors[1].toLowerCase()}.`

 return {
    demandScore: demand,
    competitionScore: competition,
    opportunityScore: opportunity,
    avgRent,
    topSuburbs,
    swot: {
      strengths: [city.strengths[0], `${type.name} demand in ${city.name} is ${demand >= 75 ? 'strong' : 'growing'}`, 'Established local customer base'],
   weaknesses: [city.challenges[0], `${type.name} market has ${competition >= 70 ? 'high' : 'moderate'} competition`, 'Staff recruitment can be challenging'],
   opportunities: [`Growing ${city.name} population`, `${type.keySuccessFactors[2]}`, 'Delivery platform expansion'],
   threats: ['Rising commercial rent', 'Changing consumer preferences', 'New market entrants'],
  },
    insight: override.insight ?? defaultInsight,
    verdict: override.verdict ?? generateVerdict(opportunity),
  }
}

export function getCity(slug: string): CityData | undefined {
  return CITIES.find(c => c.slug === slug)
}

export function getType(slug: string): TypeData | undefined {
  return BUSINESS_TYPES.find(t => t.slug === slug)
}

export function getScoreColor(score: number): string {
  if (score >= 80) return '#059669'
 if (score >= 65) return '#D97706'
 return '#DC2626'
}

export function getVerdictColor(verdict: CityTypeInsight['verdict']): string {
 switch (verdict) {
    case 'High Opportunity': return '#059669'
  case 'Moderate Opportunity': return '#D97706'
  case 'Emerging': return '#0891B2'
  case 'Saturated': return '#DC2626'
 }
}