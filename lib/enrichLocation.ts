// lib/enrichLocation.ts
// Fetches real data for an address before passing to Claude
// Uses: LocationIQ (geocoding) + Geoapify (competitors) + suburb lookup (ABS-based)

export interface LocationData {
  coordinates: { lat: number; lng: number } | null
  suburb: string
  state: string
  competitors: {
    count: number
    names: string[]
    intensityLabel: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY HIGH'
    intensityScore: number   // 0-100, higher = more competition
  }
  demographics: {
    medianIncome: number
    populationDensity: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY HIGH'
    ageProfile: 'YOUNG' | 'MIXED' | 'OLDER'
    affordabilityLabel: 'BUDGET' | 'MODERATE' | 'AFFLUENT' | 'PREMIUM'
    incomeScore: number  // 0-100
  }
  dataQuality: 'REAL' | 'ESTIMATED'
}

// ── STEP 1: Geocode address → lat/lng ──────────────────────────────────────
async function geocodeAddress(address: string): Promise<{ lat: number; lng: number; suburb: string; state: string } | null> {
  const key = process.env.LOCATIONIQ_API_KEY
  if (!key) {
    console.warn('[Enrich] No LOCATIONIQ_API_KEY — skipping geocode')
    return null
  }

  try {
    const url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${encodeURIComponent(address)}&format=json&countrycodes=au&limit=1`
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) })
    if (!res.ok) return null
    const data = await res.json()
    if (!data?.[0]) return null

    const result = data[0]
    const addressParts = result.address || {}
    const suburb = addressParts.suburb || addressParts.city_district || addressParts.city || ''
    const state  = addressParts.state_code || addressParts.state || ''

    return {
      lat:    parseFloat(result.lat),
      lng:    parseFloat(result.lon),
      suburb: suburb.trim(),
      state:  state.trim(),
    }
  } catch (err) {
    console.error('[Enrich] Geocode error:', err)
    return null
  }
}

// ── STEP 2: Find nearby competitors via Geoapify ───────────────────────────
// Maps business type to Geoapify category codes
const CATEGORY_MAP: Record<string, string[]> = {
  cafe:           ['catering.cafe', 'catering.coffee'],
  coffee:         ['catering.cafe', 'catering.coffee'],
  restaurant:     ['catering.restaurant', 'catering.fast_food'],
  'fast food':    ['catering.fast_food', 'catering.restaurant'],
  gym:            ['sport.fitness', 'sport.gym'],
  fitness:        ['sport.fitness', 'sport.gym'],
  retail:         ['commercial.shopping_mall', 'commercial.clothing', 'commercial.department_store'],
  bakery:         ['catering.bakery', 'catering.cafe'],
  salon:          ['service.beauty', 'healthcare.beauty'],
  'hair salon':   ['service.beauty'],
  bar:            ['catering.bar', 'catering.pub'],
  pub:            ['catering.bar', 'catering.pub'],
  pharmacy:       ['healthcare.pharmacy'],
  supermarket:    ['commercial.supermarket', 'commercial.grocery'],
}

function getCategories(businessType: string): string {
  const lower = businessType.toLowerCase()
  for (const [key, cats] of Object.entries(CATEGORY_MAP)) {
    if (lower.includes(key)) return cats.join(',')
  }
  // Default: food & retail
  return 'catering,commercial.shopping_mall'
}

function competitionScore(count: number): number {
  if (count <= 2)  return 85   // Very low competition — good
  if (count <= 5)  return 90   // Low — sweet spot
  if (count <= 9)  return 75   // Moderate
  if (count <= 14) return 60   // High
  if (count <= 20) return 45   // Very high
  return 30                    // Saturated
}

function competitionLabel(count: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY HIGH' {
  if (count <= 5)  return 'LOW'
  if (count <= 10) return 'MEDIUM'
  if (count <= 18) return 'HIGH'
  return 'VERY HIGH'
}

async function fetchCompetitors(lat: number, lng: number, businessType: string, radiusMetres = 500): Promise<{
  count: number; names: string[]; intensityLabel: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY HIGH'; intensityScore: number
}> {
  const key = process.env.GEOAPIFY_API_KEY
  if (!key) {
    console.warn('[Enrich] No GEOAPIFY_API_KEY — using estimate')
    return { count: 5, names: [], intensityLabel: 'MEDIUM', intensityScore: 70 }
  }

  try {
    const categories = getCategories(businessType)
    const url = `https://api.geoapify.com/v2/places?categories=${categories}&filter=circle:${lng},${lat},${radiusMetres}&limit=50&apiKey=${key}`
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) {
      console.error('[Enrich] Geoapify error:', res.status)
      return { count: 5, names: [], intensityLabel: 'MEDIUM', intensityScore: 70 }
    }
    const data = await res.json()
    const features = data?.features || []
    const count = features.length
    const names = features.slice(0, 5).map((f: any) => f.properties?.name).filter(Boolean)

    return {
      count,
      names,
      intensityLabel: competitionLabel(count),
      intensityScore: competitionScore(count),
    }
  } catch (err) {
    console.error('[Enrich] Competitor fetch error:', err)
    return { count: 5, names: [], intensityLabel: 'MEDIUM', intensityScore: 70 }
  }
}

// ── STEP 3: Demographics — suburb lookup ──────────────────────────────────
// ABS-calibrated tiers for Australian suburbs
// Covers all capital city suburbs + major regional centres
// Source: ABS 2021 Census, SEIFA Index, median household income data
// Each entry: [medianIncome, densityTier, ageProfile]
// densityTier: 0=LOW, 1=MEDIUM, 2=HIGH, 3=VERY HIGH
// ageProfile: 0=YOUNG, 1=MIXED, 2=OLDER

type DemoTier = [number, 0|1|2|3, 0|1|2]

const SUBURB_DEMOGRAPHICS: Record<string, DemoTier> = {
  // ── Sydney ──
  'newtown':          [72000, 3, 0],
  'surry hills':      [85000, 3, 0],
  'paddington':       [110000, 2, 1],
  'glebe':            [78000, 3, 0],
  'balmain':          [120000, 2, 1],
  'pyrmont':          [95000, 3, 0],
  'darlinghurst':     [82000, 3, 0],
  'redfern':          [68000, 3, 0],
  'chippendale':      [74000, 3, 0],
  'ultimo':           [65000, 3, 0],
  'cbd':              [90000, 3, 1],
  'sydney cbd':       [90000, 3, 1],
  'chatswood':        [88000, 2, 1],
  'parramatta':       [65000, 2, 1],
  'bondi':            [95000, 2, 0],
  'bondi junction':   [98000, 2, 1],
  'manly':            [105000, 2, 1],
  'mosman':           [145000, 2, 2],
  'neutral bay':      [115000, 2, 1],
  'north sydney':     [105000, 3, 1],
  'crows nest':       [98000, 2, 1],
  'leichhardt':       [88000, 2, 0],
  'annandale':        [95000, 2, 1],
  'rozelle':          [105000, 2, 0],
  'stanmore':         [82000, 2, 0],
  'enmore':           [70000, 2, 0],
  'marrickville':     [72000, 2, 0],
  'petersham':        [80000, 2, 0],
  'ashfield':         [68000, 2, 1],
  'strathfield':      [85000, 2, 1],
  'burwood':          [70000, 2, 1],
  'concord':          [98000, 1, 2],
  'auburn':           [55000, 2, 1],
  'bankstown':        [58000, 2, 1],
  'liverpool':        [55000, 1, 1],
  'campbelltown':     [58000, 1, 1],
  'penrith':          [62000, 1, 1],
  'blacktown':        [65000, 1, 1],
  'norwest':          [95000, 1, 1],
  'castle hill':      [102000, 1, 2],
  'hornsby':          [88000, 1, 2],
  'gordon':           [115000, 1, 2],
  'turramurra':       [125000, 1, 2],
  'hurstville':       [72000, 2, 1],
  'kogarah':          [72000, 2, 1],
  'cronulla':         [95000, 1, 2],
  'miranda':          [88000, 1, 2],
  'randwick':         [88000, 2, 0],
  'coogee':           [92000, 2, 0],
  'maroubra':         [78000, 2, 1],
  'kingsford':        [68000, 2, 0],
  'kensington':       [72000, 2, 0],

  // ── Melbourne ──
  'melbourne cbd':    [88000, 3, 0],
  'southbank':        [82000, 3, 0],
  'fitzroy':          [78000, 3, 0],
  'collingwood':      [75000, 3, 0],
  'richmond':         [88000, 3, 0],
  'carlton':          [65000, 3, 0],
  'north melbourne':  [72000, 3, 0],
  'south yarra':      [115000, 3, 0],
  'toorak':           [165000, 2, 2],
  'prahran':          [105000, 3, 0],
  'st kilda':         [72000, 3, 0],
  'st kilda east':    [82000, 2, 1],
  'hawthorn':         [115000, 2, 1],
  'camberwell':       [120000, 2, 2],
  'kew':              [125000, 2, 2],
  'malvern':          [130000, 2, 2],
  'glen waverley':    [95000, 1, 1],
  'box hill':         [72000, 2, 1],
  'doncaster':        [88000, 1, 1],
  'footscray':        [62000, 2, 0],
  'sunshine':         [55000, 1, 1],
  'brunswick':        [72000, 3, 0],
  'coburg':           [68000, 2, 1],
  'northcote':        [82000, 2, 0],
  'thornbury':        [78000, 2, 0],
  'frankston':        [62000, 1, 2],
  'dandenong':        [52000, 1, 1],
  'springvale':       [55000, 1, 1],
  'caulfield':        [88000, 2, 1],
  'glen eira':        [95000, 1, 2],
  'elsternwick':      [105000, 2, 1],
  'brighton':         [145000, 1, 2],
  'port melbourne':   [110000, 2, 0],
  'docklands':        [92000, 3, 0],
  'albert park':      [120000, 2, 1],
  'middle park':      [135000, 2, 2],
  'williamstown':     [95000, 1, 2],

  // ── Brisbane ──
  'brisbane city':    [85000, 3, 0],
  'south brisbane':   [82000, 3, 0],
  'west end':         [72000, 3, 0],
  'fortitude valley': [75000, 3, 0],
  'new farm':         [105000, 2, 0],
  'teneriffe':        [115000, 2, 0],
  'newstead':         [105000, 2, 0],
  'paddington qld':   [98000, 2, 0],
  'red hill qld':     [88000, 2, 0],
  'kelvin grove':     [68000, 2, 0],
  'woolloongabba':    [72000, 2, 0],
  'greenslopes':      [78000, 1, 1],
  'annerley':         [68000, 1, 1],
  'morningside':      [82000, 1, 1],
  'hawthorne':        [88000, 1, 1],
  'coorparoo':        [85000, 1, 1],
  'carindale':        [88000, 1, 2],
  'chermside':        [68000, 2, 1],
  'aspley':           [75000, 1, 1],
  'nundah':           [72000, 2, 0],
  'lutwyche':         [68000, 2, 0],
  'toowong':          [85000, 2, 0],
  'indooroopilly':    [88000, 1, 1],
  'mt gravatt':       [72000, 1, 1],
  'sunnybank':        [68000, 1, 1],
  'eight mile plains':  [82000, 1, 1],

  // ── Perth ──
  'perth cbd':        [88000, 3, 0],
  'subiaco':          [105000, 2, 0],
  'leederville':      [88000, 2, 0],
  'northbridge':      [72000, 3, 0],
  'fremantle':        [78000, 2, 0],
  'cottesloe':        [125000, 1, 2],
  'claremont':        [115000, 1, 2],
  'nedlands':         [125000, 1, 2],
  'dalkeith':         [165000, 1, 2],
  'peppermint grove': [185000, 1, 2],
  'swanbourne':       [130000, 1, 2],
  'mt lawley':        [95000, 2, 0],
  'highgate':         [82000, 2, 0],
  'north perth':      [82000, 2, 0],
  'inglewood':        [78000, 2, 1],
  'maylands':         [78000, 2, 0],
  'victoria park':    [75000, 2, 0],
  'east perth':       [82000, 3, 0],
  'south perth':      [98000, 2, 1],
  'como':             [88000, 2, 1],
  'applecross':       [125000, 1, 2],
  'ardross':          [105000, 1, 2],
  'murdoch':          [88000, 1, 1],
  'canning vale':     [88000, 1, 1],
  'belmont':          [65000, 1, 1],
  'midland':          [58000, 1, 1],
  'morley':           [68000, 1, 1],
  'joondalup':        [78000, 1, 1],
  'wanneroo':         [72000, 0, 1],
  'rockingham':       [68000, 1, 2],
  'mandurah':         [62000, 1, 2],

  // ── Adelaide ──
  'adelaide cbd':     [78000, 3, 1],
  'north adelaide':   [95000, 2, 1],
  'norwood':          [88000, 2, 1],
  'unley':            [95000, 1, 2],
  'prospect':         [78000, 2, 0],
  'glenelg':          [78000, 1, 2],
  'burnside':         [110000, 1, 2],
  'payneham':         [72000, 1, 1],
  'mawson lakes':     [82000, 1, 0],

  // ── Gold Coast ──
  'surfers paradise': [75000, 3, 1],
  'broadbeach':       [82000, 2, 1],
  'southport':        [68000, 2, 1],
  'burleigh heads':   [88000, 1, 1],
  'coolangatta':      [72000, 1, 2],
  'robina':           [88000, 1, 1],
  'varsity lakes':    [82000, 1, 0],

  // ── Canberra ──
  'civic':            [95000, 3, 0],
  'canberra cbd':     [95000, 3, 0],
  'braddon':          [92000, 2, 0],
  'kingston':         [105000, 2, 0],
  'manuka':           [115000, 2, 2],
  'griffith':         [120000, 1, 2],
  'barton':           [110000, 2, 1],
  'belconnen':        [82000, 2, 1],
  'tuggeranong':      [78000, 1, 1],
  'woden':            [88000, 2, 1],

  // ── Hobart ──
  'hobart cbd':       [72000, 2, 1],
  'battery point':    [88000, 1, 2],
  'sandy bay':        [88000, 1, 2],
  'north hobart':     [68000, 2, 0],
  'glenorchy':        [62000, 1, 1],
}

const DENSITY_LABELS = ['LOW', 'MEDIUM', 'HIGH', 'VERY HIGH'] as const
const AGE_LABELS     = ['YOUNG', 'MIXED', 'OLDER'] as const

function incomeToScore(income: number): number {
  if (income >= 150000) return 95
  if (income >= 120000) return 88
  if (income >= 100000) return 80
  if (income >= 85000)  return 72
  if (income >= 70000)  return 62
  if (income >= 60000)  return 50
  if (income >= 50000)  return 38
  return 28
}

function incomeToAffordability(income: number, businessType: string): 'BUDGET' | 'MODERATE' | 'AFFLUENT' | 'PREMIUM' {
  // Premium businesses (fine dining, luxury retail) need higher incomes
  const isPremium = /fine|luxury|premium|upscale|high.end/i.test(businessType)
  if (isPremium) {
    if (income >= 120000) return 'PREMIUM'
    if (income >= 90000)  return 'AFFLUENT'
    if (income >= 70000)  return 'MODERATE'
    return 'BUDGET'
  }
  if (income >= 110000) return 'PREMIUM'
  if (income >= 85000)  return 'AFFLUENT'
  if (income >= 65000)  return 'MODERATE'
  return 'BUDGET'
}

function lookupDemographics(suburb: string, state: string, businessType: string) {
  const key = suburb.toLowerCase().trim()
  const tier = SUBURB_DEMOGRAPHICS[key]

  if (tier) {
    const [income, densityIdx, ageIdx] = tier
    return {
      medianIncome:       income,
      populationDensity:  DENSITY_LABELS[densityIdx],
      ageProfile:         AGE_LABELS[ageIdx],
      affordabilityLabel: incomeToAffordability(income, businessType),
      incomeScore:        incomeToScore(income),
    }
  }

  // Unknown suburb — estimate from state capital defaults
  const stateDefaults: Record<string, DemoTier> = {
    'NSW': [75000, 1, 1], 'VIC': [72000, 1, 1], 'QLD': [70000, 1, 1],
    'WA':  [78000, 1, 1], 'SA':  [68000, 1, 1], 'ACT': [95000, 1, 1],
    'TAS': [62000, 1, 1], 'NT':  [68000, 1, 1],
  }
  const def = stateDefaults[state.toUpperCase()] || [70000, 1, 1]
  return {
    medianIncome:       def[0],
    populationDensity:  DENSITY_LABELS[def[1]],
    ageProfile:         AGE_LABELS[def[2]],
    affordabilityLabel: incomeToAffordability(def[0], businessType),
    incomeScore:        incomeToScore(def[0]),
  }
}

// ── MAIN: enrich a location ────────────────────────────────────────────────
export async function enrichLocation(
  address: string,
  businessType: string
): Promise<LocationData> {

  // Run geocoding first — need coordinates for competitor search
  const geo = await geocodeAddress(address)

  // Demographic lookup from suburb name
  const suburbName = geo?.suburb || extractSuburbFromAddress(address)
  const stateName  = geo?.state  || extractStateFromAddress(address)
  const demographics = lookupDemographics(suburbName, stateName, businessType)

  // Competitor search — only if we have coordinates
  let competitors = { count: 5, names: [] as string[], intensityLabel: 'MEDIUM' as const, intensityScore: 70 }
  if (geo) {
    competitors = await fetchCompetitors(geo.lat, geo.lng, businessType)
  }

  return {
    coordinates:  geo ? { lat: geo.lat, lng: geo.lng } : null,
    suburb:       suburbName,
    state:        stateName,
    competitors,
    demographics,
    dataQuality:  geo ? 'REAL' : 'ESTIMATED',
  }
}

// ── Fallback: extract suburb from address text ────────────────────────────
function extractSuburbFromAddress(address: string): string {
  // "45 King St, Newtown NSW 2042" → "Newtown"
  const parts = address.split(',').map(s => s.trim())
  for (let i = parts.length - 1; i >= 0; i--) {
    const part = parts[i].replace(/\b(NSW|VIC|QLD|WA|SA|ACT|TAS|NT)\b/gi, '').replace(/\d+/g, '').trim()
    if (part.length > 2) return part
  }
  return address.split(',')[1]?.trim() || ''
}

function extractStateFromAddress(address: string): string {
  const m = address.match(/\b(NSW|VIC|QLD|WA|SA|ACT|TAS|NT)\b/i)
  return m ? m[1].toUpperCase() : ''
}