import Link from 'next/link'

const S = {
  brand: '#0F766E', brandLight: '#14B8A6', brandFaded: '#F0FDFA', brandBorder: '#99F6E4',
  n50: '#FAFAF9', n100: '#F5F5F4', n200: '#E7E5E4', n400: '#A8A29E', n500: '#78716C',
  n700: '#44403C', n800: '#292524', n900: '#1C1917', white: '#FFFFFF',
  headerBg: '#0C1F1C', font: "'DM Sans', sans-serif",
  emerald: '#059669', emeraldBg: '#ECFDF5', emeraldBdr: '#A7F3D0',
  amber: '#D97706', amberBg: '#FFFBEB', amberBdr: '#FDE68A',
  red: '#DC2626', redBg: '#FEF2F2',
}

type Section =
  | { type: 'h2'; text: string }
  | { type: 'p'; text: string }
  | { type: 'img'; src: string; caption: string }
  | { type: 'pullquote'; text: string }
  | { type: 'stat'; value: string; label: string; context: string }
  | { type: 'list'; heading?: string; items: string[] }
  | { type: 'callout'; icon: string; title: string; body: string; color: string; bg: string }
  | { type: 'stats-row'; items: { value: string; label: string }[] }

const POSTS: Record<string, {
  category: string; date: string; readTime: string
  title: string; heroImg: string; intro: string
  sections: Section[]
}> = {
  'cafe-location-guide-australia': {
    category: 'Cafes', date: 'February 28, 2026', readTime: '8 min read',
    heroImg: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=1200&q=85',
    title: 'How to choose the perfect café location in Australia (2026 guide)',
    intro: 'Before you spend $80,000 on an espresso machine and fit-out, spend a week on this. The difference between a café that queues out the door and one that closes in 18 months almost always comes down to a single decision made before the doors open: location.',
    sections: [
      { type: 'stats-row', items: [{ value: '18 months', label: 'Average time before an undercapitalised café closes' }, { value: '12%', label: 'Maximum healthy rent-to-revenue ratio for cafes' }, { value: '7–9am', label: 'Window where 40–60% of café revenue is typically made' }] },
      { type: 'h2', text: 'Why location matters more than almost anything else' },
      { type: 'p', text: 'A café with mediocre coffee in a great location will survive. A café with extraordinary coffee in the wrong location will struggle. That sounds brutal, but it is what the data shows. Walk-past traffic, proximity to morning commuters, and the rent-to-revenue ratio are the three variables that most reliably predict whether an independent café will still be trading in three years.' },
      { type: 'p', text: 'Location is also, critically, the one decision you cannot easily undo once made. You can change your menu, your staff, your prices, your marketing. You cannot change the fact that 200 people walk past your door per day when you need 600.' },
      { type: 'img', src: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=900&q=80', caption: 'Morning foot traffic is the lifeblood of any café — it needs to be measured, not assumed.' },
      { type: 'h2', text: 'The 7am test: the most important thing you can do before signing' },
      { type: 'p', text: 'Before any data analysis, before any financial modelling, do this: visit the location at 7am on a Tuesday morning and count how many people walk past in 10 minutes. Multiply by 6 to get an hourly rate.' },
      { type: 'callout', icon: '⏱️', title: 'The 7am foot traffic benchmark', body: 'Under 30 people/hour: Very difficult for a café unless rent is very low. 30–60 people/hour: Viable if positioned correctly. 60–120/hour: Solid opportunity. 120+/hour: Strong location — focus on competition next.', color: S.brand, bg: S.brandFaded },
      { type: 'p', text: 'This test tells you something no data source can replicate: the actual character of foot traffic at the time that matters most. Are these people rushing to a train station? Walking a dog? Dressed for an office? Each answer changes your revenue model.' },
      { type: 'h2', text: 'Understanding the rent-to-revenue ratio' },
      { type: 'p', text: 'Rent is your largest fixed cost and the one that will break you faster than anything else. The industry rule of thumb is that rent should sit between 8–12% of your monthly revenue. Above 15% is dangerous. Above 20% is statistically very difficult to survive.' },
      { type: 'p', text: 'Here is how to run the test. Take the monthly rent the landlord is asking. Divide it by 0.10 (10%). That is the monthly revenue you need to keep rent at a manageable level. Divide that by your estimated average transaction value (probably $8–$12 for a café). Divide that by 26 trading days per month. That is your required daily transaction count.' },
      { type: 'pullquote', text: 'A $5,000/month rent at a $10 average spend means you need 50 transactions per day just to keep rent under 10%. Is that achievable at this location?' },
      { type: 'h2', text: 'Competition: how many is too many?' },
      { type: 'p', text: 'Two or three cafés nearby is often a good sign — it means customers have already developed the habit of buying coffee in that area. A street with zero cafés might mean opportunity, or it might mean there is no demand. The question is which.' },
      { type: 'img', src: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900&q=80', caption: 'Competition context matters. Multiple cafés on a street signals proven demand — as long as there is room for another one.' },
      { type: 'list', heading: 'Competition thresholds for cafes (within 200m)', items: ['0–1 competitors: Low competition. Verify demand exists before assuming opportunity.', '2–3 competitors: Healthy. Market exists. Focus on differentiation.', '4–5 competitors: Tight. You need a clear advantage — quality, speed, niche.', '6+ competitors: Avoid unless foot traffic is genuinely exceptional (>200/hour).'] },
      { type: 'h2', text: 'Demographics: who is actually walking past?' },
      { type: 'p', text: 'Not all foot traffic is equal. 300 retirees per hour spending time in a park nearby will not buy $6 flat whites. 150 office workers rushing to a train station will. The demographic profile of the suburb tells you whether the people walking past are likely to be your customers.' },
      { type: 'p', text: 'The ABS Census data, available by suburb, shows you median household income, age breakdown, and employment type. A suburb with high proportions of professionals aged 25–45, above-median income, and proximity to office precincts is café territory. A suburb that is predominantly retirees or young families with single incomes is not.' },
      { type: 'callout', icon: '📊', title: 'The demographic profile of a strong café suburb', body: 'Median household income above $95,000/year. Age profile skewed 25–45. High proportion of full-time employed residents. Walking distance to office precincts, train stations or gyms. High density of dwellings (apartments, townhouses) within 500m.', color: S.emerald, bg: S.emeraldBg },
      { type: 'h2', text: 'The physical site: what to look for inside the four walls' },
      { type: 'p', text: 'Once the location economics stack up, the physical site itself matters. Corner positions with two street frontages get more visibility. Ground floor with large windows beats basement or first floor for impulse visits. Outdoor seating potential in Australian climate significantly increases covers. Kitchen infrastructure (extraction, plumbing, power) already in place can save $30,000–$80,000 in fit-out costs.' },
      { type: 'list', heading: 'Physical site checklist', items: ['Corner or end-of-terrace position for visibility from two directions', 'Existing commercial kitchen infrastructure (extraction, plumbing, 3-phase power)', 'Outdoor seating potential (north or east facing for morning light in Australia)', 'On-street parking or public transport within 200m', 'Wide footpath for queue formation during peak periods', 'Rear lane access for deliveries without disrupting service'] },
      { type: 'h2', text: 'How to use data to shortlist before you visit' },
      { type: 'p', text: 'Visiting locations is time-consuming. Before you spend days driving around, use data to shortlist. Run a Locatalyze analysis on any Australian address to get competition counts, demographic scoring, estimated daily customer volume, and a full financial model in 30 seconds. This tells you which sites are worth visiting — and which ones to skip.' },
      { type: 'p', text: 'The analysis will not replace a site visit. But it will ensure that when you do visit, you are visiting sites where the numbers have at least a chance of working.' },
      { type: 'callout', icon: '🎯', title: 'The site selection process', body: 'Step 1: Identify 8–12 candidate locations using suburb research and agent listings. Step 2: Run a data analysis on each. Step 3: Shortlist to 3–4 where numbers are viable. Step 4: Visit each at multiple times of day. Step 5: Talk to neighbouring business owners. Step 6: Negotiate the lease with a commercial solicitor.', color: S.amber, bg: S.amberBg },
    ],
  },
  'restaurant-lease-mistakes': {
    category: 'Restaurants', date: 'February 14, 2026', readTime: '6 min read',
    heroImg: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=85',
    title: '7 commercial lease mistakes Australian restaurant owners make — and how to avoid them',
    intro: 'A commercial lease is often the biggest financial commitment a restaurant owner ever makes. Yet most people sign one without fully understanding what they are agreeing to, or whether the site can actually support a profitable business.',
    sections: [
      { type: 'stats-row', items: [{ value: '60%', label: 'Of restaurants that close cite lease terms as a contributing factor' }, { value: '$150K', label: 'Average fit-out cost for a new restaurant site' }, { value: '5 years', label: 'Typical minimum lease term for commercial restaurant space' }] },
      { type: 'h2', text: 'Mistake 1: Signing without doing a proper market study' },
      { type: 'p', text: 'Most restaurant owners visit a location once, feel excited about the space, and sign. A proper market study takes 5–7 days — competitor mapping, foot traffic counts at multiple times and days, demographic analysis, talking to neighbouring business owners, checking council development applications for upcoming changes.' },
      { type: 'p', text: 'The market study should answer one question: can this location support a restaurant doing the revenue I need to be profitable? If you cannot answer that question before signing, you are guessing.' },
      { type: 'img', src: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&q=80', caption: 'A restaurant site needs to be evaluated at its busiest and quietest times before you commit.' },
      { type: 'h2', text: 'Mistake 2: Ignoring the rent-to-revenue ratio' },
      { type: 'p', text: 'Restaurant rent above 15% of monthly revenue is a serious warning sign. Above 20% is, in most cases, fatal. This is the most important number in your location analysis and the one most founders underweight because they are focused on the excitement of the opportunity.' },
      { type: 'callout', icon: '⚠️', title: 'The calculation most founders skip', body: 'Take your monthly rent. Divide by 0.12 to get the monthly revenue needed to stay at a 12% ratio. Divide that by your average spend per cover. Divide by 26 trading days. Is the resulting daily cover count achievable at this location? If not, the rent is too high — regardless of how much you love the space.', color: S.amber, bg: S.amberBg },
      { type: 'h2', text: 'Mistake 3: Not accounting for fit-out costs in the total commitment' },
      { type: 'p', text: 'A site without existing commercial kitchen infrastructure — extraction, 3-phase power, industrial plumbing — can add $80,000 to $150,000 in fit-out costs. This is a capital outlay that must be recouped over the life of the lease. When comparing two sites, the one with lower rent but higher fit-out cost may be more expensive overall.' },
      { type: 'h2', text: 'Mistake 4: Not testing evening trade separately' },
      { type: 'p', text: 'A street that appears busy at lunch can be dead at dinner — and restaurants are almost entirely dependent on dinner trade for profitability. Visit at 7:30pm on a Friday night. Walk the street. Are other restaurants busy? Are there people looking for somewhere to eat? Are groups walking around making decisions? A 15-minute observation tells you more than any data source about evening viability.' },
      { type: 'img', src: 'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=900&q=80', caption: 'The Friday night test: visit at 7:30pm and observe whether the street has genuine dinner trade.' },
      { type: 'h2', text: 'Mistake 5: Underestimating seasonal risk' },
      { type: 'p', text: 'Some locations trade brilliantly for eight months and struggle for four. Tourist areas, beach suburbs, and event precincts are highly seasonal. If your financial model assumes consistent monthly revenue, you will be caught underprepared when a quiet stretch hits. Seasonal locations require more working capital and a revenue model that accounts for low periods.' },
      { type: 'h2', text: 'Mistake 6: Ignoring car parking' },
      { type: 'p', text: 'Dinner diners drive. A restaurant with no easy parking within 400 metres will lose a meaningful percentage of potential customers — particularly families and people over 40. Public transport access helps for the lunch trade and younger demographics. But for dinner, parking proximity is a direct driver of covers.' },
      { type: 'h2', text: 'Mistake 7: Signing without a commercial solicitor reviewing the lease' },
      { type: 'p', text: 'Commercial leases are complex legal documents. Rent review clauses (particularly CPI or market review), make-good obligations, exclusivity provisions, permitted use definitions, and personal guarantee requirements can cost you tens of thousands of dollars if you do not understand them. A commercial tenancy solicitor charges $500–$1,500 to review a lease. Given what is at stake, this is not optional.' },
      { type: 'callout', icon: '✅', title: 'The lease review checklist', body: 'Get a lawyer to review: rent review mechanism (CPI vs market), make-good clause (what condition must you leave the site in?), permitted use definition (does it cover your full menu?), personal guarantee scope, option to renew terms, assignment rights (can you sell the business with the lease?).', color: S.emerald, bg: S.emeraldBg },
    ],
  },
  'foot-traffic-vs-demographics': {
    category: 'Strategy', date: 'January 30, 2026', readTime: '7 min read',
    heroImg: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=85',
    title: 'Foot traffic vs demographics: which matters more for your business?',
    intro: 'A busy street does not guarantee a profitable business. And a quiet suburb is not necessarily a bad one. The question of whether foot traffic or demographics is the more important location signal depends entirely on your business model. Here is the framework.',
    sections: [
      { type: 'h2', text: 'The fundamental distinction: impulse vs destination' },
      { type: 'p', text: 'The key question is whether your customer will walk past and decide to stop (impulse), or whether they will specifically seek out your business and travel to it (destination). This single distinction determines whether foot traffic or demographics is your primary signal.' },
      { type: 'img', src: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=900&q=80', caption: 'Impulse businesses live and die by who passes the door. Destination businesses can thrive almost anywhere their customers live.' },
      { type: 'callout', icon: '⚡', title: 'Impulse vs destination: which are you?', body: 'Impulse businesses (foot traffic dominant): cafes, takeaway, convenience retail, newsagencies, fast casual dining. Destination businesses (demographics dominant): gyms, specialist medical, boutique fitness, professional services, specialty retail. Hybrid businesses (both matter): restaurants, hair salons, boutique retail.', color: S.brand, bg: S.brandFaded },
      { type: 'h2', text: 'When foot traffic is the dominant signal' },
      { type: 'p', text: 'For a café, the customer who walks past and smells coffee and decides to stop in is your business model. You are not marketing to them. You are capturing them through proximity and sensory appeal. That only works if enough people walk past. Demographics tell you about purchasing power and category interest — but they cannot compensate for insufficient volume.' },
      { type: 'p', text: 'For impulse businesses, use foot traffic as your primary screening metric and demographics as a modifier. A location with 150 people per hour passing and above-average household income is better than one with 150 per hour and below-average income. But 150 with average income beats 50 with high income almost every time.' },
      { type: 'h2', text: 'When demographics are the dominant signal' },
      { type: 'p', text: 'A gym does not need high foot traffic past its door. Members make a deliberate decision to join and travel to your facility multiple times per week. What matters is whether enough of the right people live within a reasonable distance. A 3km residential catchment with 12,000 households in the 25–45 age range is the soil you need. Whether the specific street is busy or quiet is secondary.' },
      { type: 'stats-row', items: [{ value: '3km', label: 'Radius within which most gym members will travel' }, { value: '500m', label: 'Radius that matters most for impulse businesses' }, { value: '1km', label: 'Sweet spot for most hybrid businesses (restaurants, salons)' }] },
      { type: 'h2', text: 'The hybrid model: when both matter' },
      { type: 'p', text: 'Restaurants and hair salons are the clearest examples of businesses where both signals matter. A restaurant needs some walk-in trade — being in a dining precinct with foot traffic brings diners who are in the area looking for somewhere to eat. But it also needs the right demographic profile within a 1–2km catchment for its regular, repeat customer base.' },
      { type: 'h2', text: 'How to weight them in practice' },
      { type: 'p', text: 'Run a simple thought experiment: if you removed all passing foot traffic but kept the demographics constant, would your business still survive? If yes — it is a destination business and demographics dominate. If no — it is an impulse or hybrid business and foot traffic matters more.' },
      { type: 'callout', icon: '🔢', title: 'The Locatalyze weighting model', body: 'Our scoring algorithm weights foot traffic and demographics differently based on your business type. For a café, foot traffic (proxied by daytime population density and commuter flow) accounts for roughly 35% of the location score. For a gym, residential catchment demographics account for closer to 50%. This is why the same location scores differently for different business types.', color: S.amber, bg: S.amberBg },
    ],
  },
  'retail-competition-scoring': {
    category: 'Retail', date: 'January 16, 2026', readTime: '5 min read',
    heroImg: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=85',
    title: 'Understanding competition scoring: what 500m really means for retail',
    intro: 'The 500m radius is not arbitrary. It is based on a consistent finding in pedestrian behaviour research: for street-level retail, 500m is approximately the distance within which a competitor becomes a daily alternative in the customer\'s decision set.',
    sections: [
      { type: 'h2', text: 'Why 500m is the critical radius' },
      { type: 'p', text: 'A competitor 600m away requires a deliberate detour. A competitor 200m away is passed every time your potential customer walks to the train station. Pedestrian behaviour studies consistently show that within 500m, competing businesses with similar offerings draw from the same customer pool. Beyond that, most customers have already made a category decision before they encounter the second option.' },
      { type: 'img', src: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=900&q=80', caption: 'Within 500m, competitors actively compete for the same foot traffic. Beyond that, they begin drawing from different customer pools.' },
      { type: 'h2', text: 'What gets counted in the competition score' },
      { type: 'p', text: 'The competition score is not a simple count. We pull business data from OpenStreetMap and classify businesses by category. For a café, we count all cafes, bakeries and takeaway operations. For a gym, we count all fitness businesses including yoga, pilates and CrossFit boxes. For clothing retail, we count all fashion retail.' },
      { type: 'p', text: 'We then apply a weight based on business type similarity. A direct category competitor scores higher impact than a near-category competitor. A second café directly across the street from you is more impactful than a third one 400m down the road.' },
      { type: 'h2', text: 'High competition is not always a bad sign' },
      { type: 'p', text: 'This is one of the most counterintuitive things about location analysis. A high competition score in a high-foot-traffic area can still produce a GO verdict. Why? Because high competition signals proven demand. If 8 cafés are operating within 500m and appearing to trade, there is clearly sufficient demand in the area to support multiple operators.' },
      { type: 'p', text: 'The question our model asks is not just "how many competitors are there" but "does the demand exceed the supply?" A low-competition location with low demand is not necessarily better than a high-competition location with high demand.' },
      { type: 'callout', icon: '📊', title: 'How we score competition', body: 'We look at competitor count, competitor proximity, competitor category overlap, and estimated foot traffic. A precinct with 6 cafes and 200 people per hour passing gets a different score than a street with 6 cafes and 40 people per hour. Demand context is everything.', color: S.brand, bg: S.brandFaded },
      { type: 'h2', text: 'When to worry about competition' },
      { type: 'p', text: 'Competition becomes a serious concern when: (1) the number of competitors exceeds the demand the foot traffic can support; (2) the existing operators appear to be established and well-reviewed; (3) you cannot articulate a meaningful point of difference from existing options.' },
      { type: 'list', heading: 'Red flags in competition analysis', items: ['6+ direct competitors within 200m with strong Google ratings', 'Established national or franchise operators dominating the category', 'Visible vacancy or for-lease signs among existing competitors (signals over-supply)', 'Recent closures in the same category nearby', 'No foot traffic anchor to explain why competitors are there'] },
    ],
  },
  'suburb-data-australia': {
    category: 'Data', date: 'January 3, 2026', readTime: '6 min read',
    heroImg: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=85',
    title: 'How ABS census data scores Australian suburbs for business viability',
    intro: 'The 2021 Australian Census collected data from every household in the country. When it comes to choosing a business location, it is one of the most powerful and underused datasets available to founders.',
    sections: [
      { type: 'h2', text: 'What the ABS Census actually tells you' },
      { type: 'p', text: 'The Census collects data across hundreds of variables at the suburb level (Statistical Area Level 2). For business location analysis, the variables that matter most are: median household income, age distribution, household type (singles, couples, families), employment type (full-time, part-time, unemployed), and population density.' },
      { type: 'img', src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80', caption: 'Demographic data by suburb reveals customer profiles that change dramatically within just a few kilometres.' },
      { type: 'h2', text: 'Median household income: the most important single variable' },
      { type: 'p', text: 'Median household income is the variable that most reliably predicts discretionary spend in a suburb. For cafes, specialty retail, gyms and restaurants, above-average household income means customers with the means to spend regularly at your price point.' },
      { type: 'stats-row', items: [{ value: '$95K', label: 'Australian median household income (ABS 2021)' }, { value: '$140K+', label: 'Income in premium suburbs (Mosman, Toorak, Cottesloe)' }, { value: '$68K', label: 'Income in lower-income outer suburbs' }] },
      { type: 'p', text: 'This does not mean low-income suburbs cannot support businesses. It means you need to adjust your business model and price point accordingly. A $6 flat white works in Mosman. A $3.50 batch brew might be the viable model in Campbelltown.' },
      { type: 'h2', text: 'Age distribution and what it predicts' },
      { type: 'p', text: 'The age profile of a suburb tells you what types of businesses will thrive. A suburb skewed 25–40 (young professionals, early families) predicts strong demand for cafes, casual dining, gyms, childcare, and convenience retail. A suburb skewed 60+ predicts demand for health services, lower-price dining, and service businesses — not boutique coffee or spin studios.' },
      { type: 'callout', icon: '👥', title: 'Demographic profiles by business type', body: 'Cafes & specialty coffee: best in 25–45 professional demographics. Gyms & boutique fitness: 22–42, higher income, high apartment density. Family restaurants: 30–45, family households, suburban areas. Premium retail: 30–55, above-median income, owner-occupier households. Quick service / takeaway: works across most demographics when positioned correctly.', color: S.emerald, bg: S.emeraldBg },
      { type: 'h2', text: 'Population density and catchment size' },
      { type: 'p', text: 'Raw population within your catchment matters. A suburb with 6,000 residents within 500m gives you a much larger potential customer base than one with 1,500 — even if the demographics are identical. High-density residential areas (apartment precincts) are particularly valuable for destination businesses where members or regular customers come from within walking or short driving distance.' },
      { type: 'h2', text: 'How we combine these variables into a suburb score' },
      { type: 'p', text: 'Each suburb gets a demand score based on a weighted combination of: median household income (relative to national median), age profile match for the business type, household density within 1km, and employment concentration within 500m. This score is one of four components in the overall location rating, combined with competition, rent affordability and projected profitability.' },
    ],
  },
  'gym-location-analysis': {
    category: 'Gyms', date: 'December 18, 2025', readTime: '6 min read',
    heroImg: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=85',
    title: 'Opening a gym in Australia? Here is what location data actually tells you',
    intro: 'Australia has one of the highest gym densities per capita in the world. 24/7 chains have blanketed suburban retail strips. Before you commit to 300 square metres and a 5-year lease, here is how to read the data that separates a viable gym location from an expensive mistake.',
    sections: [
      { type: 'stats-row', items: [{ value: '3,500+', label: 'Gyms and fitness studios currently operating in Australia' }, { value: '$2.4B', label: 'Annual revenue of the Australian gym industry' }, { value: '3km', label: 'Maximum distance most members will travel to a gym regularly' }] },
      { type: 'h2', text: 'The saturation problem you cannot ignore' },
      { type: 'p', text: 'In 2015, finding a suburb without a gym was easy. In 2026, finding one is the challenge. Anytime Fitness, Snap Fitness, Plus Fitness and Jetts have opened several hundred locations each across Australia. Before analysing anything else, map every gym, yoga studio, pilates studio and CrossFit box within 2km of your target location.' },
      { type: 'img', src: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=900&q=80', caption: 'The boutique fitness market is growing, but so is competition. Positioning and location both need to be right.' },
      { type: 'p', text: 'Note: for gyms, the critical radius is 2km — not 500m. A gym 800m away is a direct competitor because members will choose between them. Run the competition analysis at a wider radius than you would for a café or retail business.' },
      { type: 'h2', text: 'Residential density: the variable that matters most' },
      { type: 'p', text: 'Unlike cafes, gyms are destination businesses. Customers do not join on impulse — they research, try a class, and commit. What matters is whether enough of the right people live within a distance they will travel. For most gym members, that distance is 2–3km by car or 1–1.5km on foot.' },
      { type: 'callout', icon: '🏘️', title: 'Minimum residential catchment for a viable gym', body: 'General fitness gym (>250sqm): 8,000+ households within 3km in the 22–50 age range. Boutique fitness studio (yoga, pilates, CrossFit, <150sqm): 5,000+ households within 2km, higher income skew. 24/7 gym competing with chain operators: needs a gap — look for suburbs without existing 24/7 operators nearby.', color: S.brand, bg: S.brandFaded },
      { type: 'h2', text: 'The floor plate and rent problem' },
      { type: 'p', text: 'Gyms require larger floor plates than most retail businesses — typically 200–500sqm minimum for a viable offering. This means higher absolute rent, even if the rate per square metre is similar to smaller spaces. The maths needs to work at a much larger scale.' },
      { type: 'p', text: 'A 300sqm gym at $80/sqm/year costs $24,000/year ($2,000/month) for rent alone. At a $60/week membership fee, you need 33 members just to cover rent — before staff, equipment, insurance, utilities or marketing. At 150 active members (a modest but functional gym), rent sits at about 22% of revenue — dangerously high. You need 200+ members for rent to approach a healthy 12–15%.' },
      { type: 'h2', text: 'Access, parking and physical requirements' },
      { type: 'p', text: 'Peak gym hours are 5:30–8:30am and 5:00–7:30pm on weekdays. During these windows, members arrive by car. Adequate parking in the immediate vicinity is a meaningful driver of membership retention and growth. A gym with poor parking will lose members to competitors who are marginally further away but easier to access.' },
      { type: 'list', heading: 'Physical site requirements for gyms', items: ['200–500sqm minimum clear floor space with 4m+ ceiling height', 'Ground floor or first floor with easy lift/stair access', 'Adequate car parking within 150m during peak hours (6–8am, 5–7pm)', '3-phase power for commercial gym equipment', 'Change rooms and bathroom infrastructure (or budget for fit-out)', 'Accessible loading/unloading for equipment delivery'] },
      { type: 'h2', text: 'How to use data to find the gap in your market' },
      { type: 'p', text: 'The gym market has gaps — but they are increasingly specific. The gaps that still exist in 2026 are typically: group training studios in suburbs where only 24/7 gyms exist; premium boutique offerings (reformer pilates, functional training) in high-income suburbs still served only by budget chains; martial arts and sport-specific training in residential growth corridors.' },
      { type: 'callout', icon: '🔍', title: 'Finding the gap: the 3-question test', body: '1. Is there a 24/7 gym within 500m? If yes, a competing 24/7 gym is almost certainly not viable. 2. Is there a boutique fitness offering (pilates, yoga, CrossFit) within 1km? If not, and demographics support it, there may be an opportunity. 3. Are there 8,000+ households within 3km in the 25–45 age bracket? If yes, you have the catchment for a viable specialist offering.', color: S.amber, bg: S.amberBg },
    ],
  },
}

function renderSection(section: Section, idx: number) {
  switch (section.type) {
    case 'h2':
      return <h2 key={idx} style={{ fontSize: 'clamp(20px, 3vw, 24px)', fontWeight: 800, color: S.n900, letterSpacing: '-0.02em', marginBottom: 14, marginTop: 40, lineHeight: 1.3 }}>{section.text}</h2>
    case 'p':
      return <p key={idx} style={{ fontSize: 16, color: '#57534E', lineHeight: 1.85, marginBottom: 18 }}>{section.text}</p>
    case 'img':
      return (
        <div key={idx} style={{ margin: '32px 0' }}>
          <img src={section.src} alt={section.caption} style={{ width: '100%', borderRadius: 14, display: 'block', maxHeight: 400, objectFit: 'cover' }} />
          <p style={{ fontSize: 12, color: S.n400, textAlign: 'center', marginTop: 8, fontStyle: 'italic' }}>{section.caption}</p>
        </div>
      )
    case 'pullquote':
      return (
        <div key={idx} style={{ borderLeft: `4px solid ${S.brand}`, padding: '16px 24px', margin: '32px 0', background: S.brandFaded, borderRadius: '0 12px 12px 0' }}>
          <p style={{ fontSize: 18, fontWeight: 700, color: S.n800, lineHeight: 1.6, fontStyle: 'italic' }}>"{section.text}"</p>
        </div>
      )
    case 'callout':
      return (
        <div key={idx} style={{ background: section.bg, border: `1px solid ${section.color}30`, borderRadius: 14, padding: '20px 22px', margin: '28px 0' }}>
          <p style={{ fontSize: 13, fontWeight: 800, color: section.color, marginBottom: 8 }}>{section.icon} {section.title}</p>
          <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.75, whiteSpace: 'pre-line' }}>{section.body}</p>
        </div>
      )
    case 'list':
      return (
        <div key={idx} style={{ margin: '24px 0' }}>
          {section.heading && <p style={{ fontSize: 13, fontWeight: 700, color: S.n800, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{section.heading}</p>}
          <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 12, overflow: 'hidden' }}>
            {section.items.map((item, i) => (
              <div key={i} style={{ padding: '12px 16px', borderBottom: i < section.items.length - 1 ? `1px solid ${S.n100}` : 'none', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ color: S.brand, fontWeight: 800, flexShrink: 0, marginTop: 1 }}>→</span>
                <p style={{ fontSize: 14, color: S.n700, lineHeight: 1.6 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      )
    case 'stats-row':
      return (
        <div key={idx} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, margin: '28px 0' }}>
          {section.items.map(stat => (
            <div key={stat.label} style={{ background: S.n50, border: `1px solid ${S.n200}`, borderRadius: 12, padding: '18px 16px', textAlign: 'center' }}>
              <p style={{ fontSize: 28, fontWeight: 900, color: S.brand, letterSpacing: '-0.04em', lineHeight: 1 }}>{stat.value}</p>
              <p style={{ fontSize: 12, color: S.n500, marginTop: 6, lineHeight: 1.4 }}>{stat.label}</p>
            </div>
          ))}
        </div>
      )
    default:
      return null
  }
}

const RELATED = [
  { slug: 'foot-traffic-vs-demographics', title: 'Foot traffic vs demographics: which matters more?', category: 'Strategy' },
  { slug: 'retail-competition-scoring', title: 'Understanding competition scoring: what 500m means', category: 'Retail' },
  { slug: 'suburb-data-australia', title: 'How ABS census data scores Australian suburbs', category: 'Data' },
]

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = POSTS[slug]

  if (!post) {
    return (
      <>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <div style={{ minHeight: '100vh', background: S.n50, fontFamily: S.font, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', textAlign: 'center', padding: 40 }}>
          <span style={{ fontSize: 48, marginBottom: 16 }}>📭</span>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: S.n900, marginBottom: 8 }}>Article not found</h1>
          <p style={{ fontSize: 15, color: S.n500, marginBottom: 24 }}>This article may have moved or been updated.</p>
          <Link href="/blog" style={{ background: S.brand, color: '#fff', borderRadius: 10, padding: '11px 24px', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>← Back to blog</Link>
        </div>
      </>
    )
  }

  const related = RELATED.filter(r => r.slug !== slug).slice(0, 2)

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <div style={{ minHeight: '100vh', background: S.n50, fontFamily: S.font }}>

        {/* Nav */}
        <div style={{ background: S.headerBg, padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: `linear-gradient(135deg,${S.brand},${S.brandLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 12 }}>L</div>
            <span style={{ fontWeight: 800, fontSize: 14, color: '#F9FAFB', letterSpacing: '-0.02em' }}>Locatalyze</span>
          </Link>
          <span style={{ color: '#374151', fontSize: 14 }}>/</span>
          <Link href="/blog" style={{ fontSize: 13, color: '#9CA3AF', textDecoration: 'none' }}>Blog</Link>
          <span style={{ color: '#374151', fontSize: 14 }}>/</span>
          <span style={{ fontSize: 13, color: '#6B7280' }}>{post.category}</span>
        </div>

        {/* Hero image */}
        <div style={{ position: 'relative', height: 380, overflow: 'hidden' }}>
          <img src={post.heroImg} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.5))' }} />
          <div style={{ position: 'absolute', bottom: 32, left: 24, right: 24, maxWidth: 720, margin: '0 auto' }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
              <span style={{ background: S.brand, color: '#fff', borderRadius: 20, padding: '3px 12px', fontSize: 11, fontWeight: 700 }}>{post.category}</span>
              <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12 }}>{post.date} · {post.readTime}</span>
            </div>
            <h1 style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.25, textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>{post.title}</h1>
          </div>
        </div>

        {/* Article layout */}
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 20px 80px' }}>

          {/* Intro */}
          <p style={{ fontSize: 18, color: S.n700, lineHeight: 1.8, marginBottom: 40, fontWeight: 500, borderLeft: `3px solid ${S.brand}`, paddingLeft: 20 }}>{post.intro}</p>

          {/* Sections */}
          {post.sections.map((section, i) => renderSection(section, i))}

          {/* CTA */}
          <div style={{ background: `linear-gradient(135deg,${S.brand},#0891B2)`, borderRadius: 18, padding: '36px', textAlign: 'center', marginTop: 56 }}>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 10 }}>Analyse your location now</h3>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 22 }}>Paste any Australian address and get a full feasibility report with GO/CAUTION/NO verdict. Free to start — no credit card needed.</p>
            <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fff', color: S.brand, borderRadius: 10, padding: '12px 26px', fontSize: 14, fontWeight: 800, textDecoration: 'none' }}>
              Run my free analysis →
            </Link>
          </div>

          {/* Related articles */}
          {related.length > 0 && (
            <div style={{ marginTop: 56 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: S.n900, marginBottom: 20 }}>Related articles</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {related.map(r => (
                  <Link key={r.slug} href={`/blog/${r.slug}`} style={{ textDecoration: 'none' }}>
                    <div style={{ background: S.white, border: `1px solid ${S.n200}`, borderRadius: 14, padding: '20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <span style={{ background: S.brandFaded, color: S.brand, borderRadius: 20, padding: '2px 9px', fontSize: 10, fontWeight: 700, width: 'fit-content' }}>{r.category}</span>
                      <p style={{ fontSize: 14, fontWeight: 700, color: S.n900, lineHeight: 1.4 }}>{r.title}</p>
                      <span style={{ fontSize: 13, color: S.brand, fontWeight: 600 }}>Read →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: 36, textAlign: 'center' }}>
            <Link href="/blog" style={{ fontSize: 14, color: S.brand, fontWeight: 700, textDecoration: 'none' }}>← Back to all articles</Link>
          </div>
        </div>
      </div>
    </>
  )
}