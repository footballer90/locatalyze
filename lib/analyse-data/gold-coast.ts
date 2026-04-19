export type GoldCoastVerdict = 'GO' | 'CAUTION' | 'RISKY'

export interface GoldCoastSuburbFactors {
  demandStrength: number
  rentPressure: number
  competitionDensity: number
  seasonalityRisk: number
  tourismDependency: number
}

export interface GoldCoastSuburbBase {
  name: string
  slug: string
  vibe: string
  demand: string
  competition: string
  rent: string
  risk: string
  best: string
  insight: string
  why: string
  factors: GoldCoastSuburbFactors
  cafe: number
  restaurant: number
  retail: number
}

export interface GoldCoastSuburb extends GoldCoastSuburbBase {
  compositeScore: number
  verdict: GoldCoastVerdict
}

export const GOLD_COAST_SCORE_WEIGHTS = {
  cafe: { demand: 40, rent: 28, competition: 18, seasonality: 14 },
  restaurant: { demand: 32, rent: 22, competition: 18, seasonality: 14, tourism: 14 },
  retail: { demand: 28, rent: 22, tourism: 22, competition: 18, seasonality: 10 },
} as const

export const GOLD_COAST_VERDICT_THRESHOLDS = {
  go: 68.5,
  caution: 60.0,
} as const

export const GOLD_COAST_FACTOR_META: {
  key: keyof GoldCoastSuburbFactors
  label: string
  dir: 'high' | 'low' | 'ctx'
}[] = [
  { key: 'demandStrength', label: 'Demand', dir: 'high' },
  { key: 'rentPressure', label: 'Rent cost', dir: 'low' },
  { key: 'competitionDensity', label: 'Competition', dir: 'low' },
  { key: 'seasonalityRisk', label: 'Seasonality', dir: 'low' },
  { key: 'tourismDependency', label: 'Tourism dep', dir: 'ctx' },
]

const GOLD_COAST_SUBURBS: GoldCoastSuburbBase[] = [
  {
    name: 'Burleigh Heads',
    slug: 'burleigh-heads',
    vibe: "Health-conscious professionals, young families, surf culture. The Gold Coast's most established independent hospitality strip.",
    demand: 'Mixed — strong year-round resident base plus significant tourist overlay in peak periods',
    competition: 'Medium-high',
    rent: '$4,500–$9,000/mo (indicative)',
    risk: 'Site availability — vacancy is estimated below 2%',
    best: 'Specialty cafe, quality casual dining, wellness studio, lifestyle retail',
    insight: 'James Street commercial vacancy is estimated below 2% based on observed operator churn. The primary constraint is accessing a site, not generating demand once you have one.',
    why: 'Demand 9/10 is the primary driver — this suburb has the strongest year-round resident demand on the coast. Rent 7/10 and Competition 6/10 apply meaningful headwinds, partially offset by very low Seasonality Risk 3/10. Retail scores lower because the strip has limited street-level retail frontage relative to hospitality.',
    factors: { demandStrength: 9, rentPressure: 7, competitionDensity: 6, seasonalityRisk: 3, tourismDependency: 3 },
    cafe: 90,
    restaurant: 83,
    retail: 79,
  },
  {
    name: 'Broadbeach',
    slug: 'broadbeach',
    vibe: 'Upscale mixed: casino professionals, Pacific Fair shoppers, holiday apartment residents, long-term owner-occupiers.',
    demand: 'High year-round — casino and Pacific Fair create a demand floor that moderates tourist-season volatility',
    competition: 'High',
    rent: '$5,000–$12,000/mo (indicative)',
    risk: 'High entry rent requires strong unit economics',
    best: 'Premium casual dining, upscale cafe, cocktail bar, boutique retail',
    insight: 'The casino precinct is estimated to provide 30–40% of evening economy revenue in the surrounding area regardless of tourist season — a meaningful stabiliser for operators in shoulder months.',
    why: 'Restaurant 87/100 reflects Tourism Dependency 6/10 working in its favour — evening dining benefits from casino and Pacific Fair visitor flow. Cafe scores lower than restaurant because cafe trade here skews more transient. Rent Pressure 8/10 is the main risk — the model reflects that high fixed costs require consistent high-volume operation to achieve viability.',
    factors: { demandStrength: 8, rentPressure: 8, competitionDensity: 7, seasonalityRisk: 4, tourismDependency: 6 },
    cafe: 82,
    restaurant: 87,
    retail: 80,
  },
  {
    name: 'Mermaid Beach',
    slug: 'mermaid-beach',
    vibe: 'Established affluent residential. Owner-occupied beachside properties, older professional demographic, strong community identity.',
    demand: 'Resident-dominant. Estimated 80%+ of commercial spending from locals rather than tourists.',
    competition: 'Low-medium',
    rent: '$3,500–$6,500/mo (indicative)',
    risk: 'Small absolute catchment — revenue ceiling exists',
    best: 'Premium breakfast/brunch cafe, quality casual dining, boutique wellness',
    insight: 'Community loyalty in Mermaid Beach is structurally higher than in tourist-adjacent suburbs — established operators typically face lower new-entrant risk here than elsewhere on the coast.',
    why: "Demand 7/10 combined with very low Competition 3/10 and Seasonality Risk 2/10 creates favourable conditions for independent operators who don't need tourist volume. Retail scores lower because the suburb lacks the strip length and foot traffic density that walk-in retail requires. The GO verdict is conditional on concept-market fit — premium positioning is essential.",
    factors: { demandStrength: 7, rentPressure: 6, competitionDensity: 3, seasonalityRisk: 2, tourismDependency: 2 },
    cafe: 80,
    restaurant: 76,
    retail: 70,
  },
  {
    name: 'Palm Beach',
    slug: 'palm-beach',
    vibe: 'Improving coastal strip south of Burleigh. Younger demographic, surf culture, above-average population growth in the southern GC corridor.',
    demand: 'Mixed resident-tourist, trending upward. Population growth above GC average per observed development activity.',
    competition: 'Low-medium',
    rent: '$2,500–$4,500/mo (indicative)',
    risk: 'Longer establishment period than Burleigh — 12–18 month runway required',
    best: 'Cafe (early-mover positioning), casual dining, surf lifestyle retail',
    insight: 'Rent-to-demand ratio in Palm Beach is currently more favourable than Burleigh Heads. This gap has been narrowing — operators who establish now do so at lower rent before the market re-prices as the strip matures.',
    why: 'Demand 7/10 with Rent Pressure only 4/10 creates a favourable entry point — this is the best rent-adjusted opportunity on the coast right now. Low Competition 3/10 and Seasonality Risk 3/10 reduce execution risk. Scored below Burleigh because the strip is still establishing: foot traffic density is lower and brand-building takes longer. The opportunity requires patience, not a different concept.',
    factors: { demandStrength: 7, rentPressure: 4, competitionDensity: 3, seasonalityRisk: 3, tourismDependency: 3 },
    cafe: 78,
    restaurant: 73,
    retail: 70,
  },
  {
    name: 'Main Beach',
    slug: 'main-beach',
    vibe: 'Luxury residential, Marina Mirage precinct. High-income demographic, destination dining orientation, small permanent population.',
    demand: 'Low volume, high spend per customer. Destination-driven; relies on customers actively choosing to visit, not passing trade.',
    competition: 'Very low',
    rent: '$4,000–$8,000/mo (indicative)',
    risk: 'Catchment too small for most volume-dependent concepts',
    best: 'Premium dining destination, high-end specialty retail, marina-adjacent services',
    insight: 'Concept-market fit is more critical here than in any other GC suburb. A $90 per head breakfast is achievable; a $22 cafe concept is not — the local demographic will not support it regardless of execution quality.',
    why: 'Demand 6/10 reflects the small catchment size — this suburb has affluent residents but not many of them. Competition Density 2/10 is very low, which helps. Tourism Dependency 5/10 is neutral-positive for restaurants (destination diners travel here) but negative for cafes (transient tourism does not sustain a local cafe). GO verdict applies specifically to premium concepts where low volume and high spend per head make the unit economics work.',
    factors: { demandStrength: 6, rentPressure: 7, competitionDensity: 2, seasonalityRisk: 4, tourismDependency: 5 },
    cafe: 70,
    restaurant: 79,
    retail: 66,
  },
  {
    name: 'Surfers Paradise',
    slug: 'surfers-paradise',
    vibe: 'International tourist strip. Extremely high peak-season volume, high operator churn, limited community loyalty. Most challenging environment for quality independents.',
    demand: 'Seasonally volatile — school holidays and summer create strong peaks; mid-year winter trough is significant for tourist-dependent operators.',
    competition: 'Extreme',
    rent: '$8,000–$20,000/mo (indicative)',
    risk: 'Seasonal revenue gap + rent level creates structural pressure for most concepts',
    best: 'High-volume fast casual, tourist retail, nightlife-adjacent venues designed for high throughput',
    insight: 'At an estimated midpoint rent of $12,000–$14,000/month, a cafe concept would need to generate indicatively 280–350+ customer visits per day (at $28–$35 average spend) just to cover rent. In mid-year shoulder periods, many operators fall well short of this threshold.',
    why: 'CAUTION (not RISKY) because tourist retail and high-volume fast casual can and do succeed here — the market is real, it is just hostile to independents. Retail scores 79/100 because Tourism Dependency 9/10 is a positive for impulse retail. Cafe scores only 58/100 because Rent Pressure 10/10 combined with Competition Density 10/10 and Seasonality Risk 9/10 create structural headwinds that most independent cafe concepts cannot overcome without tourist-scale volumes.',
    factors: { demandStrength: 8, rentPressure: 10, competitionDensity: 10, seasonalityRisk: 9, tourismDependency: 9 },
    cafe: 58,
    restaurant: 70,
    retail: 79,
  },
  {
    name: 'Southport',
    slug: 'southport',
    vibe: "The Gold Coast's traditional commercial centre — government offices, medical precinct, light rail, legal and finance services.",
    demand: 'Weekday professional-dominant; weekend volume is thin. TAFE and Griffith students contribute weekday lunch.',
    competition: 'Medium',
    rent: '$3,000–$7,000/mo (indicative)',
    risk: 'Weekend revenue shortfall for 7-day cost models',
    best: 'Corporate lunch cafe, professional services, healthcare-allied, education',
    insight: "Southport's commercial performance is heavily front-loaded to weekday lunch trade. Friday is estimated to generate disproportionately high revenue compared to the rest of the week. Operating models that require strong weekend revenue will be structurally stressed.",
    why: "Demand 7/10 reflects strong weekday professional demand, which is a stable and predictable demand type. Seasonality Risk 2/10 is very low — this suburb doesn't depend on holidays or tourist seasons. Retail 72/100 scores above restaurant 66/100 because practical professional retail (stationery, health, services) suits the weekday-heavy trading pattern better than evening dining. GO verdict applies to weekday-focused concepts; weekend-dependent models would effectively be CAUTION here.",
    factors: { demandStrength: 7, rentPressure: 6, competitionDensity: 5, seasonalityRisk: 2, tourismDependency: 2 },
    cafe: 70,
    restaurant: 66,
    retail: 72,
  },
  {
    name: 'Coolangatta',
    slug: 'coolangatta',
    vibe: 'Southern border surf town. Airport proximity, NSW cross-border catchment, surf competition culture. Character distinct from the northern tourist strip.',
    demand: 'Mixed: established resident surf community, airport-corridor traffic, improving tourist overlay, day-trippers from NSW.',
    competition: 'Low-medium',
    rent: '$2,500–$4,500/mo (indicative)',
    risk: 'Establishment pace slower than northern strips',
    best: 'Surf-identity cafe, casual beachside dining, independent food and lifestyle retail',
    insight: 'Coolangatta has a structural advantage the northern tourist strips lack: a genuinely local identity that community-focused operators can build on. The airport-adjacent location creates consistent foot traffic that does not depend on school holiday peaks.',
    why: 'Demand 6/10 reflects a developing market — solid but not yet at the depth of Burleigh or Broadbeach. Rent Pressure 4/10 and Competition Density 3/10 create a favourable cost-to-opportunity ratio. Seasonality Risk 5/10 is moderate — airport and NSW cross-border traffic reduces (but does not eliminate) seasonal risk. Tourism Dependency 5/10 is relevant context: this tourism is surf and lifestyle-driven, which is more compatible with quality independents than the Surfers Paradise tourist profile.',
    factors: { demandStrength: 6, rentPressure: 4, competitionDensity: 3, seasonalityRisk: 5, tourismDependency: 5 },
    cafe: 74,
    restaurant: 69,
    retail: 65,
  },
  {
    name: 'Miami',
    slug: 'miami',
    vibe: 'Emerging creative district between Burleigh and Mermaid Beach. Art precinct establishing on Currumbin Creek Road, affluent residential catchment.',
    demand: 'Resident-dominant. Limited tourist draw currently, but growing destination appeal from the emerging art precinct.',
    competition: 'Low',
    rent: '$2,500–$4,500/mo (indicative)',
    risk: 'Strip cohesion still developing — limited passive foot traffic',
    best: 'Design-forward cafe, creative casual dining, art retail, boutique services with destination identity',
    insight: 'The Miami art precinct has shifted from obscure to editorially referenced in GC media over the past 3 years. Operators who build a concept coherent with the precinct identity benefit from media attention that would cost significant marketing spend elsewhere.',
    why: 'Demand 6/10 with Competition Density 2/10 creates a low-saturation entry environment. Rent Pressure 4/10 makes the unit economics attractive relative to comparable resident suburbs. Scored below Mermaid Beach because the strip is less established — Miami rewards operators who can generate their own foot traffic through concept and marketing, not those who rely on location passivity. Retail 67/100 is moderate because without strip cohesion, walk-in retail depends heavily on destination intent.',
    factors: { demandStrength: 6, rentPressure: 4, competitionDensity: 2, seasonalityRisk: 3, tourismDependency: 2 },
    cafe: 74,
    restaurant: 70,
    retail: 67,
  },
  {
    name: 'Robina',
    slug: 'robina',
    vibe: 'Master-planned family suburb. Robina Town Centre, Bond University, large residential catchment — consistent but conservative demand dynamics.',
    demand: 'Family-driven, consistent year-round. No tourist overlay. Bond University corridor adds student weekday volume.',
    competition: 'Medium',
    rent: '$2,500–$5,500/mo (indicative)',
    risk: 'Robina Town Centre exerts strong gravity over discretionary spending',
    best: 'Casual family dining, health food cafe, tutoring/education services, gym',
    insight: 'Strip retail positioned outside the Robina Town Centre footprint consistently underperforms relative to its demographic potential. Operators who position for the Bond University corridor — rather than competing with the centre — find a less contested market.',
    why: "CAUTION because Competition Density 5/10 understates the indirect competition from Robina Town Centre — the Westfield gravity effect captures discretionary spend that strip operators are effectively competing against. Demand 6/10 is present but channelled primarily into the centre. Retail scores highest (73/100) because practical services that the centre doesn't provide (gym, tutoring, specialist health) can succeed outside its shadow. Cafe and restaurant scores reflect the foot traffic deficit on strips that the centre passively cannibalises.",
    factors: { demandStrength: 6, rentPressure: 5, competitionDensity: 5, seasonalityRisk: 2, tourismDependency: 1 },
    cafe: 67,
    restaurant: 66,
    retail: 73,
  },
  {
    name: 'Varsity Lakes',
    slug: 'varsity-lakes',
    vibe: 'Bond University adjacent. Student-young professional mix, relatively new residential development, lower price-point expectations.',
    demand: 'Student-weekday driven; residential weekends. Consistent volume, price-sensitive demographic.',
    competition: 'Low',
    rent: '$2,000–$3,800/mo (indicative)',
    risk: 'Average spend per customer is below GC coastal median',
    best: 'Accessible cafe, student-friendly food, tutoring, fitness studio',
    insight: "Bond University's international student concentration creates referral dynamics that are unusually efficient — student cohorts recommend local businesses to each other at high rates. An operator who integrates into the student community early benefits from this network effect.",
    why: 'CAUTION driven primarily by the price sensitivity of the demographic — this is not a location where premium pricing is viable. Demand 6/10 and Competition Density 2/10 indicate volume is available and the path is clear; the constraint is revenue per customer. Cafe and restaurant score moderately because hospitality volume is available but margin is compressed. Practical services (fitness, tutoring) are the strongest opportunity because service-based pricing is less directly exposed to the student price ceiling.',
    factors: { demandStrength: 6, rentPressure: 3, competitionDensity: 2, seasonalityRisk: 2, tourismDependency: 1 },
    cafe: 70,
    restaurant: 63,
    retail: 66,
  },
  {
    name: 'Labrador',
    slug: 'labrador',
    vibe: 'Multicultural residential suburb on the Broadwater. Improving demographics along Brisbane Road, diverse established food culture.',
    demand: 'Local-dominant. Long-term residents, multicultural community, gradual professional influx.',
    competition: 'Low-medium',
    rent: '$1,800–$3,500/mo (indicative)',
    risk: 'Demographic transition is gradual — spending ceiling improving but not yet high',
    best: 'Multicultural dining, Broadwater-positioned cafe, allied health, practical services',
    insight: "Labrador's Broadwater foreshore positions offer a premium waterfront setting at prices well below beach-core strips. This gap exists because the suburb's demographic hasn't yet re-priced the market — operators who enter now access views that would cost significantly more in other GC waterfront locations.",
    why: 'Demand 5/10 reflects the transitional nature of the market — improving but not yet at the depth of more established suburbs. Rent Pressure 3/10 and Competition Density 3/10 both support viability despite the demand shortfall. CAUTION reflects the demographic transition lag — the opportunity is real but the current market underprices quality, meaning revenue ramps slowly. Best suited to operators comfortable with a 2–3 year establishment curve.',
    factors: { demandStrength: 5, rentPressure: 3, competitionDensity: 3, seasonalityRisk: 3, tourismDependency: 3 },
    cafe: 68,
    restaurant: 67,
    retail: 63,
  },
  {
    name: 'Runaway Bay',
    slug: 'runaway-bay',
    vibe: 'Quiet waterfront residential. Older established demographic, strong owner-occupier base, limited commercial infrastructure.',
    demand: 'Hyper-local. Catchment is the immediate residential area — minimal external visitor draw.',
    competition: 'Very low',
    rent: '$1,800–$3,200/mo (indicative)',
    risk: 'Catchment ceiling limits maximum achievable revenue',
    best: 'Waterfront breakfast cafe, family casual, allied health',
    insight: 'Runaway Bay suits operators who are explicitly building a community-scale business rather than a growth-stage one. The ceiling is real, but so is the loyalty — operators here typically achieve high repeat visitation from a stable customer base.',
    why: 'CAUTION because Demand 4/10 reflects the small, hyper-local catchment — this suburb cannot generate the customer volumes that most growth-oriented hospitality models require. Low Rent Pressure 3/10 and Competition Density 2/10 partially offset the demand shortfall. Cafe scores above restaurant (68 vs 61) because breakfast and coffee have higher repeat-visit frequency — residents are more likely to visit a cafe daily than a restaurant for dinner. Retail scores lowest because there is insufficient foot traffic for walk-in retail to operate viably.',
    factors: { demandStrength: 4, rentPressure: 3, competitionDensity: 2, seasonalityRisk: 2, tourismDependency: 2 },
    cafe: 68,
    restaurant: 61,
    retail: 58,
  },
  {
    name: 'Ashmore',
    slug: 'ashmore',
    vibe: 'Middle suburban family area. Ross Street commercial strip serves the surrounding residential catchment. Practical rather than aspirational commercial demand.',
    demand: 'Family-driven, consistent, price-sensitive. Medical and practical services demonstrably outperform hospitality here.',
    competition: 'Low',
    rent: '$1,800–$3,500/mo (indicative)',
    risk: 'Hospitality spending ceiling is below GC coastal median',
    best: 'Allied health, pharmacy, family casual dining, practical services',
    insight: 'Ashmore’s medical centre cluster creates reliable adjacent-visit foot traffic — businesses positioned within walking distance of medical visits benefit from a captive, health-focused customer base with consistent visit patterns.',
    why: 'Demand 5/10 with Rent Pressure 3/10 and Competition Density 3/10 describes a low-risk, low-ceiling environment. The demographic rewards practical value over experiential quality — this is reflected in the Cafe 65/100 and Restaurant 63/100 scores, which are pulled down by spending-ceiling constraints that no amount of quality execution can overcome. Retail 66/100 slightly exceeds hospitality because practical retail (health, pharmacy, convenience) aligns naturally with the medical-adjacent foot traffic pattern.',
    factors: { demandStrength: 5, rentPressure: 3, competitionDensity: 3, seasonalityRisk: 2, tourismDependency: 1 },
    cafe: 65,
    restaurant: 63,
    retail: 66,
  },
  {
    name: 'Currumbin',
    slug: 'currumbin',
    vibe: 'Tourist-resident hybrid. Currumbin Wildlife Sanctuary drives school-holiday tourist volume; surrounding residential areas have a surf-lifestyle, nature-oriented character.',
    demand: 'Seasonal tourist spike in school holidays; resident base provides modest year-round floor.',
    competition: 'Low',
    rent: '$2,000–$3,500/mo (indicative)',
    risk: 'Revenue is structurally seasonal — shoulder months are lean without a strong resident cushion',
    best: 'Sanctuary-adjacent cafe, casual family dining, surf/outdoor retail',
    insight: 'Proximity to the Wildlife Sanctuary entrance creates a localised foot traffic concentration — but only during sanctuary operating hours and peak seasons. An operator positioned here should model revenue across both peak-tourist and quiet-residential periods to stress-test the concept.',
    why: "Seasonality Risk 6/10 and Tourism Dependency 6/10 are the dominant risk factors — this suburb's revenue profile is structurally seasonal in a way that many resident suburbs are not. Cafe scores 70/100 because the tourist opportunity is real; the risk is consistency. Retail 57/100 is low because tourist retail here competes directly with sanctuary gift shops for the same customers. The GO case for this suburb requires a concept that works for locals off-season as well as tourists during peaks.",
    factors: { demandStrength: 5, rentPressure: 3, competitionDensity: 2, seasonalityRisk: 6, tourismDependency: 6 },
    cafe: 70,
    restaurant: 63,
    retail: 57,
  },
  {
    name: 'Burleigh Waters',
    slug: 'burleigh-waters',
    vibe: 'Inland residential behind Burleigh Heads. Family demographic, lower density, limited commercial strip infrastructure.',
    demand: 'Hyper-local residential. The Burleigh Heads tourist foot traffic does not extend meaningfully into this suburb.',
    competition: 'Very low',
    rent: '$1,800–$3,200/mo (indicative)',
    risk: 'Insufficient passive foot traffic for most hospitality concepts',
    best: 'Allied health, childcare services, family convenience food',
    insight: 'Operators sometimes select Burleigh Waters expecting to access Burleigh Heads demand. This assumption is incorrect — the demographics are similar, but the commercial mechanics differ fundamentally. This suburb rewards practical service businesses, not hospitality.',
    why: "Demand 4/10 is the critical constraint — despite being adjacent to Burleigh Heads, this suburb's inland position means it generates almost no passing trade. Low Rent Pressure 3/10 and Competition Density 2/10 are attractive on a cost basis but do not compensate for the foot traffic deficit. Cafe 62/100 and Restaurant 58/100 reflect the structural difficulty of running destination hospitality in a suburb without a destination identity. Retail 63/100 is slightly better only for convenience-oriented formats that serve the local residential catchment directly.",
    factors: { demandStrength: 4, rentPressure: 3, competitionDensity: 2, seasonalityRisk: 2, tourismDependency: 1 },
    cafe: 62,
    restaurant: 58,
    retail: 63,
  },
  {
    name: 'Helensvale',
    slug: 'helensvale',
    vibe: 'Northern Gold Coast family hub. Primary demand is residential family; theme park proximity creates tourist adjacency but limited commercial conversion.',
    demand: 'Family-dominant, consistent, price-sensitive. Light rail station has measurably improved morning commuter foot traffic since 2020.',
    competition: 'Low-medium',
    rent: '$2,000–$4,000/mo (indicative)',
    risk: 'Theme park proximity creates tourist expectation that rarely converts to strip trade',
    best: 'Family casual dining, gym and fitness, childcare, allied health',
    insight: 'The light rail station has created a morning commuter coffee window that is commercially meaningful — a well-positioned cafe on the commuter path can capture consistent daily repeat visits that did not exist before the rail connection.',
    why: 'Demand 5/10 with Competition Density 4/10 describes a moderate-density family market. Theme park proximity (Tourism Dependency 3/10) does not meaningfully benefit strip operators — theme park visitors transit through, they do not stop. The light rail commuter insight creates a specific GO sub-case within the suburb for commuter-positioned hospitality. Retail 65/100 scores above cafe and restaurant because practical family retail suits the demographic character better than experiential hospitality.',
    factors: { demandStrength: 5, rentPressure: 4, competitionDensity: 4, seasonalityRisk: 3, tourismDependency: 3 },
    cafe: 64,
    restaurant: 61,
    retail: 65,
  },
  {
    name: 'Tugun',
    slug: 'tugun',
    vibe: 'Quiet southern beach suburb, airport adjacent. Surf community, minimal commercial pressure, low rents.',
    demand: 'Hyper-local resident base. Airport proximity does not convert to meaningful strip trade — travellers transit through, they rarely stop.',
    competition: 'Very low',
    rent: '$1,600–$3,000/mo (indicative)',
    risk: 'Passive foot traffic is insufficient for most commercial formats without a loyalty-based model',
    best: 'Community cafe (loyalty-model), surf-adjacent food and retail, practical local services',
    insight: 'Tugun offers the lowest commercial rents on the GC coastal strip. For an operator running a community loyalty model — where the business is built on repeat local visits rather than new-customer acquisition — the economics here are among the most favourable on the coast.',
    why: 'Demand 4/10 and Seasonality Risk 4/10 define the challenge: limited local demand with some seasonal variation from the airport corridor and surf community. Rent Pressure 2/10 is the lowest of all 20 suburbs — this is where the model rewards a specific type of operator: one with a low fixed-cost base and a loyalty-driven revenue model. The CAUTION verdict is model- and operator-dependent, not a blanket assessment of the suburb. A community cafe here can be viable; a premium hospitality concept almost certainly is not.',
    factors: { demandStrength: 4, rentPressure: 2, competitionDensity: 2, seasonalityRisk: 4, tourismDependency: 4 },
    cafe: 64,
    restaurant: 59,
    retail: 56,
  },
  {
    name: 'Coomera',
    slug: 'coomera',
    vibe: "One of Queensland's fastest-growing residential corridors. Young families, new estates, infrastructure and commercial amenity still catching up to population growth.",
    demand: 'Resident-dominant, growing rapidly. Volume is building; spending sophistication is at an early stage.',
    competition: 'Low — genuinely underserved relative to population',
    rent: '$1,800–$3,500/mo (indicative)',
    risk: 'Early-market risk; premium concepts will underperform the current demographic',
    best: 'Family casual dining, childcare and family services, gym, practical retail',
    insight: "Population growth projections for the Coomera corridor are among the strongest in Queensland. An operator who establishes now and builds brand loyalty ahead of competition is positioned to own the market as the suburb matures — but this is a medium-term (3–5 year) investment thesis, not a short-term payoff.",
    why: "Demand 5/10 today underestimates the 3–5 year trajectory — but the model scores current conditions, not projected ones. Operators should model against today's demographic, not tomorrow's. Rent Pressure 3/10 and Competition Density 2/10 reflect the underserved, early-market character. Retail 65/100 slightly exceeds cafe and restaurant because practical family services (childcare, gym, convenience retail) are already in demand; hospitality quality expectations are still below GC coastal median. Cafe 63/100 reflects this constraint.",
    factors: { demandStrength: 5, rentPressure: 3, competitionDensity: 2, seasonalityRisk: 2, tourismDependency: 2 },
    cafe: 63,
    restaurant: 59,
    retail: 65,
  },
  {
    name: 'Nerang',
    slug: 'nerang',
    vibe: 'Hinterland gateway town. Older demographic, limited gentrification trajectory, functional commercial strip serving inland GC areas.',
    demand: 'Price-sensitive local residential. Hinterland day-tripper overlay is inconsistent and not commercially reliable.',
    competition: 'Very low',
    rent: '$1,500–$2,800/mo (indicative)',
    risk: 'Demographic stagnation limits spending ceiling; hospitality investment unlikely to achieve coastal returns',
    best: 'Allied health, trade services, practical food retail',
    insight: 'Nerang is a viable market for operators who need the lowest possible fixed-cost base and are comfortable building a business on community loyalty alone. It is the wrong location for a premium hospitality concept at any price point.',
    why: 'RISKY verdict driven by Demand 3/10 — this is the weakest commercial demand of all 20 suburbs in this analysis. Very low Rent Pressure 2/10 and Competition Density 2/10 reflect the limited commercial activity, not a hidden opportunity. Low rent is a market signal here, not just a cost advantage. All three scores (58/55/60) reflect that the business types this guide focuses on — cafes, restaurants, retail — face structural demand constraints in this location that cannot be resolved by operator quality or concept differentiation. The RISKY verdict is not a comment on the suburb as a community — it is a specific assessment of commercial viability for these business types under current market conditions.',
    factors: { demandStrength: 3, rentPressure: 2, competitionDensity: 2, seasonalityRisk: 4, tourismDependency: 2 },
    cafe: 58,
    restaurant: 55,
    retail: 60,
  },
]

function normalizeSuburbKey(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function getGoldCoastCompositeScore(cafe: number, restaurant: number, retail: number): number {
  return Math.round(cafe * 0.4 + restaurant * 0.35 + retail * 0.25)
}

export function deriveGoldCoastVerdict(
  cafe: number,
  restaurant: number,
  retail: number,
): GoldCoastVerdict {
  const composite = cafe * 0.4 + restaurant * 0.35 + retail * 0.25

  if (composite >= GOLD_COAST_VERDICT_THRESHOLDS.go) {
    return 'GO'
  }

  if (composite >= GOLD_COAST_VERDICT_THRESHOLDS.caution) {
    return 'CAUTION'
  }

  return 'RISKY'
}

const GOLD_COAST_SUBURBS_DERIVED: GoldCoastSuburb[] = GOLD_COAST_SUBURBS.map((suburb) => ({
  ...suburb,
  compositeScore: getGoldCoastCompositeScore(suburb.cafe, suburb.restaurant, suburb.retail),
  verdict: deriveGoldCoastVerdict(suburb.cafe, suburb.restaurant, suburb.retail),
}))

export function getGoldCoastSuburbs(): GoldCoastSuburb[] {
  return GOLD_COAST_SUBURBS_DERIVED
}

export function getGoldCoastSuburb(key: string): GoldCoastSuburb | undefined {
  const normalizedKey = normalizeSuburbKey(key)

  return GOLD_COAST_SUBURBS_DERIVED.find(
    (suburb) =>
      suburb.slug === normalizedKey || normalizeSuburbKey(suburb.name) === normalizedKey,
  )
}

export function getGoldCoastSuburbStaticParams() {
  return GOLD_COAST_SUBURBS_DERIVED.map((suburb) => ({ suburb: suburb.slug }))
}

export function getGoldCoastNearbySuburbs(currentSlug: string, limit = 3): GoldCoastSuburb[] {
  return GOLD_COAST_SUBURBS_DERIVED
    .filter((suburb) => suburb.slug !== currentSlug)
    .sort((a, b) => b.compositeScore - a.compositeScore)
    .slice(0, limit)
}
