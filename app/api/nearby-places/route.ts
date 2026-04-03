import { NextRequest, NextResponse }             from 'next/server'
import { fetchGooglePlaces, fetchGoogleTextSearch, haversineMeters } from '@/lib/places/multi-source'

// ── Types ──────────────────────────────────────────────────────────────────────
type Tier    = 'budget' | 'mid' | 'premium'
type SubType = 'fast_food' | 'casual' | 'premium'
type AnchorKind = 'supermarket' | 'bigbox' | 'qsr' | 'pharmacy' | 'retail'

// ── Radius presets per business type ─────────────────────────────────────────
export const RADIUS_PRESETS: Record<string, number[]> = {
  cafe:       [400, 800, 1500],
  restaurant: [500, 1000, 2000],
  bakery:     [400, 800, 1500],
  gym:        [1500, 3000, 5000],
  salon:      [500, 1000, 2000],
  retail:     [800, 1500, 3000],
  bar:        [400, 800, 1500],
  takeaway:   [400, 800, 1500],
  pharmacy:   [800, 1500, 3000],
  other:      [500, 1000, 2000],
}

const DEFAULT_RADIUS: Record<string, number> = Object.fromEntries(
  Object.entries(RADIUS_PRESETS).map(([k, v]) => [k, v[1]])
)

// ── Foursquare category IDs for gym/fitness ──────────────────────────────────
// Strictly typed gym categories — no parks, stadiums, fields
const FSQ_GYM_CATEGORY_IDS = [
  '4bf58dd8d48988d175941735', // Gym / Fitness Center
  '52e81612bcbc57f1066b7a45', // Health & Fitness Club
  '4bf58dd8d48988d174941735', // Yoga Studio
  '52e81612bcbc57f1066b7a44', // Pilates Studio
  '5744ccdfe4b0c0459246b4c1', // CrossFit Box
  '5744ccdfe4b0c0459246b4bf', // Boxing Gym
  '52e81612bcbc57f1066b7a46', // Martial Arts Dojo
  '4f4528bc4b90abdf24c9de85', // Indoor Sports
].join(',')

// Business types that use Foursquare exclusively
const GYM_TYPES = new Set([
  'gym', 'fitness', 'health club', 'yoga', 'pilates', 'crossfit',
  'martial arts', 'boxing', 'fitness centre', 'gym / fitness',
])
function isGymType(type: string): boolean {
  const lc = type.toLowerCase()
  return Array.from(GYM_TYPES).some(g => lc.includes(g))
}

// ── Junk name filter ──────────────────────────────────────────────────────────
// Reject OSM/Geoapify raw IDs like "wa45773 5", "node123456", "rel12345 67"
// Also reject purely numeric names, single chars, and other non-venue strings
function isJunkName(name: string): boolean {
  if (!name || name.trim().length < 3) return true
  const n = name.trim()
  // OSM-style IDs: wa12345, way12345, node12345, rel12345, area12345 (with optional suffix)
  if (/^(wa|way|node|rel|relation|area|n|r|w)\d+(\s+\d+)?$/i.test(n)) return true
  // Purely numeric
  if (/^\d+$/.test(n)) return true
  // Hex/UUID-like strings with no spaces (e.g. "abc123def456")
  if (/^[a-f0-9]{8,}$/i.test(n)) return true
  // Single word that's mostly digits with a letter prefix (e.g. "wa45773")
  if (/^[a-z]{1,3}\d{4,}$/i.test(n)) return true
  return false
}

// ── Foursquare fetch ──────────────────────────────────────────────────────────
async function fetchFoursquare(
  lat: string,
  lng: string,
  radius: number,
  apiKey: string,
  limit = 50,
): Promise<{ venues: any[]; error?: string }> {
  const url = `https://api.foursquare.com/v3/places/search` +
    `?ll=${lat},${lng}` +
    `&radius=${radius}` +
    `&categories=${FSQ_GYM_CATEGORY_IDS}` +
    `&limit=${Math.min(limit, 50)}` +
    `&fields=fsq_id,name,geocodes,location,categories,rating,stats,distance`

  console.log(`[Foursquare] GET radius=${radius}m limit=${limit}`)
  try {
    const res = await fetch(url, {
      headers: { Authorization: apiKey, Accept: 'application/json' },
      signal: AbortSignal.timeout(9000),
    })
    if (!res.ok) {
      const body = await res.text()
      console.error(`[Foursquare] HTTP ${res.status}: ${body.slice(0, 200)}`)
      return { venues: [], error: `HTTP ${res.status}` }
    }
    const json = await res.json()
    const venues = json.results ?? []
    console.log(`[Foursquare] ${venues.length} venues`)
    return { venues }
  } catch (err: any) {
    console.error('[Foursquare] error:', err?.message)
    return { venues: [], error: err?.message }
  }
}

// ── Geoapify category map ─────────────────────────────────────────────────────
const CATEGORY_MAP: Record<string, { primary: string[]; secondary: string[]; fallback: string[] }> = {
  cafe: {
    primary:   ['catering.cafe'],
    secondary: ['catering.coffee_shop', 'catering.bakery'],
    fallback:  ['catering'],
  },
  restaurant: {
    primary:   ['catering.restaurant'],
    secondary: ['catering.cafe', 'catering.fast_food'],
    fallback:  ['catering'],
  },
  bakery: {
    primary:   ['catering.bakery'],
    secondary: ['catering.cafe'],
    fallback:  ['catering'],
  },
  gym: {
    // Fallback only — Foursquare is the primary source for gym
    primary:   ['sport.gym', 'leisure.fitness_centre'],
    secondary: ['sport.fitness_centre', 'sport.sports_centre'],
    fallback:  ['sport', 'leisure'],
  },
  salon: {
    primary:   ['service.beauty', 'service.hairdresser'],
    secondary: ['service.beauty.hairdresser', 'service.beauty.cosmetics'],
    fallback:  ['service'],
  },
  retail: {
    primary:   ['commercial.clothing', 'commercial.department_store'],
    secondary: ['commercial.shopping_mall', 'commercial.supermarket', 'commercial.gift_and_souvenir'],
    fallback:  ['commercial'],
  },
  bar: {
    primary:   ['catering.bar', 'catering.pub'],
    secondary: ['catering.nightclub', 'catering.biergarten'],
    fallback:  ['catering'],
  },
  takeaway: {
    primary:   ['catering.fast_food'],
    secondary: ['catering.restaurant', 'catering.food_court'],
    fallback:  ['catering'],
  },
  pharmacy: {
    primary:   ['healthcare.pharmacy'],
    secondary: ['healthcare.chemist'],
    fallback:  ['healthcare'],
  },
  other: {
    primary:   ['catering', 'commercial'],
    secondary: [],
    fallback:  ['catering', 'commercial', 'service'],
  },
}

const LANDMARK_CATEGORIES =
  'public_transport.station,education.school,education.university,commercial.shopping_mall,leisure.park'

const ANCHOR_SEARCH_CATEGORIES =
  'commercial.supermarket,commercial.department_store,catering.fast_food,commercial.hardware,commercial.shopping_mall,healthcare.pharmacy'

// ── Fast-food brand set ───────────────────────────────────────────────────────
const FAST_FOOD_BRANDS = new Set([
  "mcdonald's", 'mcdonalds', 'kfc', 'hungry jacks', "domino's", 'dominos',
  'pizza hut', 'subway', 'oporto', 'red rooster', 'guzman y gomez',
  'nandos', "nando's", 'boost juice', 'sushi hub', 'schnitz',
  "roll'd", 'roll d', 'chatime', 'kung fu tea', 'easyway',
])

// ── Brand tier map ────────────────────────────────────────────────────────────
const BRAND_MAP: Record<string, { tier: Tier }> = {
  'starbucks': { tier: 'premium' }, 'gloria jean': { tier: 'mid' },
  'muffin break': { tier: 'mid' }, 'hudsons coffee': { tier: 'mid' },
  'zarraffa': { tier: 'mid' }, 'the coffee club': { tier: 'mid' },
  'mcafe': { tier: 'budget' }, "mcdonald's": { tier: 'budget' },
  'mcdonalds': { tier: 'budget' }, 'kfc': { tier: 'budget' },
  'hungry jacks': { tier: 'budget' }, 'subway': { tier: 'budget' },
  "domino's": { tier: 'budget' }, 'dominos': { tier: 'budget' },
  'pizza hut': { tier: 'budget' }, 'red rooster': { tier: 'budget' },
  'oporto': { tier: 'budget' }, "nando's": { tier: 'mid' }, 'nandos': { tier: 'mid' },
  'guzman y gomez': { tier: 'mid' }, "grill'd": { tier: 'mid' },
  'snap fitness': { tier: 'budget' }, 'anytime fitness': { tier: 'budget' },
  'plus fitness': { tier: 'budget' }, 'gym nation': { tier: 'budget' },
  'jetts': { tier: 'budget' }, 'fitness first': { tier: 'budget' },
  'ufc gym': { tier: 'budget' }, 'f45': { tier: 'premium' },
  'crossfit': { tier: 'premium' }, 'equinox': { tier: 'premium' },
  'virgin active': { tier: 'premium' }, 'goodlife health': { tier: 'mid' },
  'goodlife': { tier: 'mid' }, 'world gym': { tier: 'mid' },
  'genesis fitness': { tier: 'budget' }, 'genesis': { tier: 'budget' },
  'just cuts': { tier: 'budget' }, 'toni & guy': { tier: 'premium' },
  'chemist warehouse': { tier: 'budget' }, 'priceline': { tier: 'mid' },
  'kmart': { tier: 'budget' }, 'big w': { tier: 'budget' },
  'target': { tier: 'mid' }, 'myer': { tier: 'premium' },
  'david jones': { tier: 'premium' }, 'cotton on': { tier: 'budget' },
  'h&m': { tier: 'mid' }, 'zara': { tier: 'mid' },
}

const ANCHOR_CONFIG: Record<string, { kind: AnchorKind; footTraffic: string }> = {
  'coles':             { kind: 'supermarket', footTraffic: 'Very high daily foot traffic anchor' },
  'woolworths':        { kind: 'supermarket', footTraffic: 'Very high daily foot traffic anchor' },
  'aldi':              { kind: 'supermarket', footTraffic: 'High daily foot traffic anchor' },
  'iga':               { kind: 'supermarket', footTraffic: 'Moderate daily foot traffic' },
  'costco':            { kind: 'bigbox',      footTraffic: 'High weekend destination traffic' },
  'kmart':             { kind: 'bigbox',      footTraffic: 'High weekend destination traffic' },
  'big w':             { kind: 'bigbox',      footTraffic: 'High weekly destination traffic' },
  'target':            { kind: 'bigbox',      footTraffic: 'Moderate-high destination traffic' },
  'bunnings':          { kind: 'bigbox',      footTraffic: 'High weekend destination traffic' },
  'officeworks':       { kind: 'bigbox',      footTraffic: 'Steady weekly foot traffic' },
  'harvey norman':     { kind: 'bigbox',      footTraffic: 'Moderate destination traffic' },
  'jb hi-fi':          { kind: 'bigbox',      footTraffic: 'Moderate foot traffic' },
  "mcdonald's":        { kind: 'qsr',         footTraffic: 'Very high pedestrian flow' },
  'mcdonalds':         { kind: 'qsr',         footTraffic: 'Very high pedestrian flow' },
  'kfc':               { kind: 'qsr',         footTraffic: 'High pedestrian flow' },
  'hungry jacks':      { kind: 'qsr',         footTraffic: 'High pedestrian flow' },
  'subway':            { kind: 'qsr',         footTraffic: 'Steady pedestrian flow' },
  'chemist warehouse': { kind: 'pharmacy',    footTraffic: 'Very high daily foot traffic anchor' },
  'ikea':              { kind: 'bigbox',      footTraffic: 'Very high destination traffic' },
  "dan murphy's":      { kind: 'retail',      footTraffic: 'High weekly foot traffic' },
  'dan murphy':        { kind: 'retail',      footTraffic: 'High weekly foot traffic' },
  'bws':               { kind: 'retail',      footTraffic: 'Moderate daily foot traffic' },
}

function detectAnchor(name: string): { kind: AnchorKind; footTraffic: string } | null {
  const lc = name.toLowerCase()
  for (const [brand, cfg] of Object.entries(ANCHOR_CONFIG)) {
    if (lc.includes(brand)) return cfg
  }
  return null
}

const BUDGET_SIGNALS  = ['budget', 'cheap', 'discount', '24/7', '24hr', 'economy', 'express', 'value', 'low cost', 'affordable']
const PREMIUM_SIGNALS = ['boutique', 'elite', 'premium', 'luxury', 'performance', 'private', 'reformer', 'barre', 'pilates studio', 'studios', 'personal train', 'functional training', 'high performance', 'signature', 'artisan', 'craft', 'specialty', 'gourmet', 'fine dining']

function classifyName(name: string): { tier: Tier; sub_type: SubType } {
  const lc = name.toLowerCase()
  if (FAST_FOOD_BRANDS.has(lc) || Array.from(FAST_FOOD_BRANDS).some(b => lc.includes(b)))
    return { tier: 'budget', sub_type: 'fast_food' }
  for (const [brand, info] of Object.entries(BRAND_MAP)) {
    if (lc.includes(brand)) {
      const sub = info.tier === 'premium' ? 'premium' : 'casual'
      return { tier: info.tier, sub_type: sub }
    }
  }
  if (PREMIUM_SIGNALS.some(s => lc.includes(s))) return { tier: 'premium', sub_type: 'premium' }
  if (BUDGET_SIGNALS.some(s => lc.includes(s)))  return { tier: 'budget',  sub_type: 'casual' }
  return { tier: 'mid', sub_type: 'casual' }
}

function tierInsight(tier: Tier, sub_type: SubType, businessType: string): string {
  if (sub_type === 'fast_food') return 'Quick-service operator — different occasion, indirect competition'
  if (tier === 'premium')       return 'Premium segment — targets price-insensitive customers'
  if (tier === 'budget')        return 'Budget operator — competes on price and volume'
  return `Mid-market ${businessType} — broad audience, standard pricing`
}

// ── Geoapify fetch ────────────────────────────────────────────────────────────
async function fetchGeoapify(
  categories: string, lat: string, lng: string, radius: number, key: string, limit = 50,
): Promise<any> {
  const url =
    `https://api.geoapify.com/v2/places` +
    `?categories=${categories}` +
    `&filter=circle:${lng},${lat},${radius}` +
    `&bias=proximity:${lng},${lat}` +
    `&limit=${limit}` +
    `&apiKey=${key}`
  console.log(`[Geoapify] GET cats="${categories}" r=${radius}m`)
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(9000) })
    if (!res.ok) { console.error(`[Geoapify] HTTP ${res.status}`); return { features: [] } }
    const json = await res.json()
    console.log(`[Geoapify] ${json.features?.length ?? 0} features`)
    return json
  } catch (err: any) {
    console.error('[Geoapify] error:', err?.message)
    return { features: [] }
  }
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const lat   = searchParams.get('lat')
  const lng   = searchParams.get('lng')
  const type  = (searchParams.get('type') || 'cafe').toLowerCase()
  const debug = searchParams.get('debug') === '1'

  const rawRadius = searchParams.get('radius')
  const radius = rawRadius ? parseInt(rawRadius, 10) : (DEFAULT_RADIUS[type] ?? 1000)

  if (!lat || !lng)
    return NextResponse.json({ error: 'lat and lng required' }, { status: 400 })

  const geoapifyKey   = process.env.GEOAPIFY_API_KEY
  const foursquareKey = process.env.FOURSQUARE_API_KEY
  const googleKey     = process.env.GOOGLE_PLACES_API_KEY

  const gymMode = isGymType(type)
  console.log(`[nearby-places] type=${type} gymMode=${gymMode} lat=${lat} lng=${lng} radius=${radius}m`)

  // ── GYM MODE: Foursquare PRIMARY + Google Places PARALLEL ───────────────────
  //
  // Foursquare is the best source for gym classification (typed categories).
  // Google Places is required as a parallel source because:
  //   1. Foursquare coverage varies by region (e.g. Perth suburbs like Wembley)
  //   2. Google has pilates/yoga/crossfit under 'health', 'spa', or 'school'
  //   3. Text Search catches keyword-only venues Foursquare misses entirely
  //
  // Strategy: run both in parallel, merge results, deduplicate by distance+name.
  if (gymMode) {
    if (!foursquareKey && !googleKey) {
      console.warn('[nearby-places] No FOURSQUARE_API_KEY or GOOGLE_PLACES_API_KEY — falling back to Geoapify for gym')
      // Fall through to Geoapify path below
    } else {

    // Run Foursquare and Google in parallel
    const [fsqResult, googleNearbyPOIs, googleTextPOIs] = await Promise.all([
      foursquareKey
        ? fetchFoursquare(lat, lng, radius, foursquareKey, 50)
        : Promise.resolve({ venues: [] as any[], error: 'no_key' }),
      googleKey
        ? fetchGooglePlaces(lat, lng, radius, 'gym', googleKey)
        : Promise.resolve([] as any[]),
      googleKey
        ? fetchGoogleTextSearch(lat, lng, radius, 'gym', googleKey)
        : Promise.resolve([] as any[]),
    ])

    const { venues, error: fsqErr } = fsqResult

    console.log(`[nearby-places] gym: fsq=${venues.length} gNearby=${googleNearbyPOIs.length} gText=${googleTextPOIs.length}`)

    // ── Build competitor list from Foursquare ────────────────────────────────
    const fsqCompetitors = venues
      .map((v: any) => {
        const name = (v.name || '').trim()
        if (!name || name.length < 2 || isJunkName(name)) return null
        const fsqLat = v.geocodes?.main?.latitude ?? null
        const fsqLng = v.geocodes?.main?.longitude ?? null
        if (fsqLat == null || fsqLng == null) return null
        const dist = v.distance ?? 0
        const classified = classifyName(name)
        return {
          name,
          lat:          Number(fsqLat),
          lng:          Number(fsqLng),
          distance:     dist,
          category:     v.categories?.[0]?.name ?? 'Gym / Fitness',
          rating:       v.rating ? Math.round(v.rating * 2) / 2 : 0,  // Foursquare 0-10 → keep as-is
          isDirect:     true,
          tier:         classified.tier,
          sub_type:     classified.sub_type,
          tierInsight:  tierInsight(classified.tier, classified.sub_type, 'gym'),
          source:       'foursquare' as const,
        }
      })
      .filter(Boolean)
      .sort((a: any, b: any) => a.distance - b.distance) as any[]

    // ── Merge Google Places results into competitor list ──────────────────────
    // Convert Google NormalizedPOIs to the same competitor shape used above.
    // DBSCAN-style dedup: skip any Google POI within 80m of an existing FSQ entry
    // or with a name that's >70% similar to an existing entry.
    const latN = parseFloat(lat)
    const lngN = parseFloat(lng)
    const allGooglePOIs = [...googleNearbyPOIs, ...googleTextPOIs]

    for (const poi of allGooglePOIs) {
      if (!poi.name || isJunkName(poi.name)) continue

      // Check for duplicate with existing competitors
      const isDup = fsqCompetitors.some((c: any) => {
        const dist = haversineMeters(c.lat, c.lng, poi.lat, poi.lng)
        if (dist < 80) return true
        if (dist < 200) {
          const na = poi.name.toLowerCase().replace(/[^a-z0-9]/g, '')
          const nb = c.name.toLowerCase().replace(/[^a-z0-9]/g, '')
          if (na === nb || na.includes(nb) || nb.includes(na)) return true
        }
        return false
      })
      if (isDup) continue

      const dist = Math.round(haversineMeters(latN, lngN, poi.lat, poi.lng))
      if (dist > radius) continue

      const classified = classifyName(poi.name)
      fsqCompetitors.push({
        name:         poi.name,
        lat:          poi.lat,
        lng:          poi.lng,
        distance:     dist,
        category:     poi.category ?? 'Gym / Fitness',
        rating:       poi.rating ?? 0,
        reviewCount:  poi.reviewCount ?? 0,
        isDirect:     true,
        tier:         classified.tier,
        sub_type:     classified.sub_type,
        tierInsight:  tierInsight(classified.tier, classified.sub_type, 'gym'),
        source:       'google' as const,
      })
    }

    const competitors = fsqCompetitors.sort((a: any, b: any) => a.distance - b.distance)
    const dataSources = [...new Set(competitors.map((c: any) => c.source as string))]

    const within500m = competitors.filter((c: any) => c.distance <= 500).length
    const within1km  = competitors.length
    const density    = within500m <= 1 ? 'low' : within500m <= 4 ? 'medium' : 'high'
    const risk       = density === 'high' ? 'high' : density === 'medium' ? 'moderate' : 'low'

    const tierBreakdown = { budget: 0, mid: 0, premium: 0 }
    competitors.forEach((c: any) => { tierBreakdown[c.tier as Tier]++ })

    let gapOpportunity: string | null = null
    if (within500m === 0) {
      gapOpportunity = `No gyms found within 500m — potential underserved market`
    } else if (within500m <= 2) {
      gapOpportunity = `Only ${within500m} gym${within500m > 1 ? 's' : ''} within 500m — low gym saturation`
    }

    const typeSpecificInsight = (() => {
      const chains   = competitors.filter((c: any) =>
        ['anytime fitness', 'snap fitness', 'plus fitness', 'jetts', 'fitness first', 'f45', 'ufc', 'genesis'].some(
          b => c.name.toLowerCase().includes(b)
        )
      ).length
      const boutique = within1km - chains
      if (chains > 0 && boutique > 0) return `${chains} chain gym${chains > 1 ? 's' : ''} · ${boutique} independent/boutique`
      if (chains > 0) return `${chains} chain gym${chains > 1 ? 's' : ''} detected — franchise competition`
      if (boutique > 0) return `${boutique} independent gym${boutique > 1 ? 's' : ''} nearby`
      return null
    })()

    // Also fetch anchors + landmarks via Geoapify if key is available
    let landmarks: any[] = []
    let anchors: any[] = []
    if (geoapifyKey) {
      const anchorRadius = Math.max(Math.round(radius * 2), 2000)
      const [lmRes, anchorRes] = await Promise.all([
        fetchGeoapify(LANDMARK_CATEGORIES, lat, lng, radius, geoapifyKey, 30),
        fetchGeoapify(ANCHOR_SEARCH_CATEGORIES, lat, lng, anchorRadius, geoapifyKey, 60),
      ])
      const seenAnchorNames = new Set<string>()
      anchors = ((anchorRes?.features || []) as any[])
        .map((f: any) => {
          const name = (f.properties?.name || '').trim()
          if (!name) return null
          const match = detectAnchor(name)
          if (!match) return null
          const dk = name.toLowerCase().replace(/\s+/g, ' ')
          if (seenAnchorNames.has(dk)) return null
          seenAnchorNames.add(dk)
          const fLat = f.properties?.lat ?? f.geometry?.coordinates?.[1]
          const fLng = f.properties?.lon ?? f.geometry?.coordinates?.[0]
          if (fLat == null) return null
          return { name, lat: Number(fLat), lng: Number(fLng), distance: f.properties?.distance || 0, kind: match.kind, footTraffic: match.footTraffic }
        })
        .filter(Boolean).sort((a: any, b: any) => a.distance - b.distance).slice(0, 10) as any[]
      landmarks = ((lmRes?.features || []) as any[])
        .map((f: any) => {
          const fLat = f.properties?.lat ?? f.geometry?.coordinates?.[1]
          const fLng = f.properties?.lon ?? f.geometry?.coordinates?.[0]
          if (fLat == null) return null
          const cats: string[] = f.properties?.categories || []
          let kind: 'transport' | 'school' | 'mall' | 'park' | 'other' = 'other'
          if (cats.some(c => c.includes('transport')))      kind = 'transport'
          else if (cats.some(c => c.includes('education'))) kind = 'school'
          else if (cats.some(c => c.includes('shopping')))  kind = 'mall'
          else if (cats.some(c => c.includes('park') || c.includes('leisure'))) kind = 'park'
          return { name: (f.properties?.name || 'Unknown').trim(), lat: Number(fLat), lng: Number(fLng), distance: f.properties?.distance || 0, kind }
        })
        .filter(Boolean) as any[]
    }

    const responseBody: any = {
      competitors,
      landmarks,
      anchors,
      dataLimited: competitors.length < 3,
      dataSource: dataSources.join('+') || 'foursquare',
      competitorCountBeforeFilter: venues.length + allGooglePOIs.length,
      competitorCountAfterFilter: competitors.length,
      insights: {
        competitorCount500m:  within500m,
        competitorCountTotal: within1km,
        directCount:   within1km,
        indirectCount: 0,
        density,
        risk,
        tierBreakdown,
        subTypeCounts: { fast_food: 0, casual: competitors.filter((c: any) => c.sub_type === 'casual').length, premium: tierBreakdown.premium },
        gapOpportunity,
        typeSpecificInsight,
        anchorInsight: anchors.length > 0 ? `${anchors.length} major anchor tenant${anchors.length > 1 ? 's' : ''} nearby` : null,
        anchorCount: anchors.length,
        dataLimited: competitors.length < 3,
        foursquareVerified: venues.length > 0,
        googleVerified: allGooglePOIs.length > 0,
        fsqError: fsqErr ?? null,
      },
    }

    if (debug) {
      responseBody._debug = {
        mode: 'gym-multi-source',
        radius,
        fsqRawCount:    venues.length,
        googleNearby:   googleNearbyPOIs.length,
        googleText:     googleTextPOIs.length,
        mergedTotal:    competitors.length,
        dataSources,
        fsqError: fsqErr,
        sampleVenues: competitors.slice(0, 5).map((c: any) => ({
          name: c.name, source: c.source, distance: c.distance, rating: c.rating,
        })),
      }
    }

    return NextResponse.json(responseBody)
    } // end else (at least one key present)
  }   // end gymMode block — falls through to Geoapify when no keys at all

  // ── STANDARD MODE: Geoapify ───────────────────────────────────────────────
  if (!geoapifyKey)
    return NextResponse.json({ error: 'API key not configured' }, { status: 503 })

  const catConfig  = CATEGORY_MAP[type] || CATEGORY_MAP.other
  const allCats    = [...catConfig.primary, ...catConfig.secondary].join(',')
  const fallbackCats = catConfig.fallback.join(',')
  const LOW_RESULT_THRESHOLD = 5
  const anchorRadius = Math.max(Math.round(radius * 2), 2000)
  // googleKey already declared above (shared by gym mode + standard mode)

  try {
    // Pass 1: Geoapify + Google Places in parallel
    const [compRes, lmRes, anchorRes, googlePOIs] = await Promise.all([
      fetchGeoapify(allCats, lat, lng, radius, geoapifyKey),
      fetchGeoapify(LANDMARK_CATEGORIES, lat, lng, radius, geoapifyKey, 30),
      fetchGeoapify(ANCHOR_SEARCH_CATEGORIES, lat, lng, anchorRadius, geoapifyKey, 60),
      googleKey
        ? fetchGooglePlaces(lat, lng, radius, type, googleKey)
        : Promise.resolve([] as any[]),
    ])
    let rawFeatures: any[] = compRes.features || []
    const countBefore = rawFeatures.length

    // Pass 2: expand to 2× radius if Geoapify is sparse (Google may have covered it)
    if (rawFeatures.length < LOW_RESULT_THRESHOLD) {
      const retry = await fetchGeoapify(allCats, lat, lng, radius * 2, geoapifyKey, 60)
      const retryF = retry.features || []
      if (retryF.length > rawFeatures.length) rawFeatures = retryF
    }

    // Pass 3: broad Geoapify fallback
    let dataLimited = false
    if (rawFeatures.length < LOW_RESULT_THRESHOLD && googlePOIs.length < LOW_RESULT_THRESHOLD) {
      const fallback = await fetchGeoapify(fallbackCats, lat, lng, radius * 3, geoapifyKey, 60)
      const fallbackF = fallback.features || []
      if (fallbackF.length > rawFeatures.length) rawFeatures = fallbackF
      dataLimited = rawFeatures.length < LOW_RESULT_THRESHOLD && googlePOIs.length < LOW_RESULT_THRESHOLD
    }

    // ── Build Geoapify competitor objects ────────────────────────────────────
    let missingCoords = 0, missingNames = 0
    const geoapifyCompetitors: any[] = rawFeatures
      .map((f: any) => {
        const name = (f.properties?.name || '').trim()
        if (!name || name.length < 2 || isJunkName(name)) { missingNames++; return null }
        const fLat = f.properties?.lat  ?? f.geometry?.coordinates?.[1]
        const fLng = f.properties?.lon  ?? f.geometry?.coordinates?.[0]
        if (fLat == null || fLng == null || isNaN(Number(fLat)) || isNaN(Number(fLng))) {
          missingCoords++; return null
        }
        const featureCats: string[] = f.properties?.categories || []
        const classified = classifyName(name)
        let isDirect: boolean
        if (type === 'restaurant') {
          isDirect = classified.sub_type !== 'fast_food'
        } else {
          isDirect = catConfig.primary.some(p =>
            featureCats.some(c => c === p || c.startsWith(p + '.') || p.startsWith(c + '.'))
          )
        }
        return {
          name, lat: Number(fLat), lng: Number(fLng),
          distance: f.properties?.distance || 0,
          category: featureCats[0]?.split('.')?.[1] || type,
          rating: 0, isDirect,
          tier: classified.tier, sub_type: classified.sub_type,
          tierInsight: tierInsight(classified.tier, classified.sub_type, type),
          source: 'geoapify' as const,
        }
      })
      .filter(Boolean) as any[]

    // ── Build Google Places competitor objects ───────────────────────────────
    const latN = parseFloat(lat)
    const lngN = parseFloat(lng)
    const googleCompetitors: any[] = (googlePOIs as any[])
      .map((poi: any) => {
        const name = (poi.name || '').trim()
        if (!name || name.length < 2 || isJunkName(name)) return null
        if (poi.lat == null || poi.lng == null) return null
        const classified = classifyName(name)
        const dist = poi.distance ?? Math.round(haversineMeters(latN, lngN, poi.lat, poi.lng))
        // Google Places always counts as direct (it searches by business type)
        return {
          name, lat: poi.lat, lng: poi.lng,
          distance: dist,
          category: poi.category || type,
          rating: typeof poi.rating === 'number' ? Number(poi.rating.toFixed(1)) : 0,
          isDirect: true,
          tier: classified.tier, sub_type: classified.sub_type,
          tierInsight: tierInsight(classified.tier, classified.sub_type, type),
          source: 'google' as const,
          reviewCount: poi.reviewCount ?? 0,
        }
      })
      .filter(Boolean) as any[]

    // ── Merge: Google primary, Geoapify secondary — deduplicate ──────────────
    // Inline dedup (clusterAndMerge handles this for /api/compute; here we use a Map)
    const mergedMap = new Map<string, any>()   // key = dedupKey → competitor object

    // Add Google first (preferred)
    for (const c of googleCompetitors) {
      const key = `${Math.round(c.lat * 1000)},${Math.round(c.lng * 1000)}`
      mergedMap.set(key, c)
    }

    // Add Geoapify only if not a duplicate of anything already in map
    for (const c of geoapifyCompetitors) {
      const cLat = Math.round(c.lat * 1000)
      const cLng = Math.round(c.lng * 1000)
      // Check distance-based dedup first
      let isDup = false
      for (const existing of mergedMap.values()) {
        const dist = haversineMeters(existing.lat, existing.lng, c.lat, c.lng)
        if (dist < 50) { isDup = true; break }
        // Name similarity at close range
        if (dist < 200) {
          const na = c.name.toLowerCase().replace(/[^a-z0-9]/g, '')
          const nb = existing.name.toLowerCase().replace(/[^a-z0-9]/g, '')
          if (na === nb || na.includes(nb) || nb.includes(na)) { isDup = true; break }
        }
      }
      if (!isDup) {
        mergedMap.set(`geo_${cLat}_${cLng}`, c)
      }
    }

    const competitors = Array.from(mergedMap.values())
      .sort((a: any, b: any) => a.distance - b.distance)

    const seenAnchorNames = new Set<string>()
    const anchors = ((anchorRes?.features || []) as any[])
      .map((f: any) => {
        const name = (f.properties?.name || '').trim()
        if (!name) return null
        const match = detectAnchor(name)
        if (!match) return null
        const dk = name.toLowerCase().replace(/\s+/g, ' ')
        if (seenAnchorNames.has(dk)) return null
        seenAnchorNames.add(dk)
        const fLat = f.properties?.lat ?? f.geometry?.coordinates?.[1]
        const fLng = f.properties?.lon ?? f.geometry?.coordinates?.[0]
        if (fLat == null) return null
        return { name, lat: Number(fLat), lng: Number(fLng), distance: f.properties?.distance || 0, kind: match.kind, footTraffic: match.footTraffic }
      })
      .filter(Boolean).sort((a: any, b: any) => a.distance - b.distance).slice(0, 10) as any[]

    const landmarks = ((lmRes?.features || []) as any[])
      .map((f: any) => {
        const fLat = f.properties?.lat ?? f.geometry?.coordinates?.[1]
        const fLng = f.properties?.lon ?? f.geometry?.coordinates?.[0]
        if (fLat == null) return null
        const cats: string[] = f.properties?.categories || []
        let kind: 'transport' | 'school' | 'mall' | 'park' | 'other' = 'other'
        if (cats.some(c => c.includes('transport')))      kind = 'transport'
        else if (cats.some(c => c.includes('education'))) kind = 'school'
        else if (cats.some(c => c.includes('shopping')))  kind = 'mall'
        else if (cats.some(c => c.includes('park') || c.includes('leisure'))) kind = 'park'
        return { name: (f.properties?.name || 'Unknown').trim(), lat: Number(fLat), lng: Number(fLng), distance: f.properties?.distance || 0, kind }
      })
      .filter(Boolean) as any[]

    const within500m    = competitors.filter((c: any) => c.distance <= 500).length
    const within1km     = competitors.length
    const directCount   = competitors.filter((c: any) => c.isDirect).length
    const indirectCount = within1km - directCount
    const subTypeCounts = { fast_food: 0, casual: 0, premium: 0 }
    competitors.forEach((c: any) => { subTypeCounts[c.sub_type as SubType]++ })
    const density = within500m <= 2 ? 'low' : within500m <= 7 ? 'medium' : 'high'
    const risk    = density === 'high' ? 'high' : density === 'medium' ? 'moderate' : 'low'
    const tierBreakdown = { budget: 0, mid: 0, premium: 0 }
    competitors.forEach((c: any) => { tierBreakdown[c.tier as Tier]++ })

    let gapOpportunity: string | null = null
    if (density === 'low' && within500m <= 1) {
      gapOpportunity = `Only ${within500m} ${type === 'cafe' ? 'café' : type} within 500m — potential underserved area`
    } else if (directCount > 2 && subTypeCounts.premium === 0) {
      gapOpportunity = `No premium operators detected — opportunity for a high-quality ${type}`
    } else if (within500m > 10) {
      gapOpportunity = `High saturation (${within500m} within 500m) — strong differentiation required`
    }

    let typeSpecificInsight: string | null = null
    if (type === 'restaurant') {
      const dineIn = directCount, fastFood = subTypeCounts.fast_food
      if (fastFood > 0 && dineIn > 0) {
        typeSpecificInsight = fastFood > dineIn * 2
          ? `High fast-food saturation (${fastFood}) but moderate dine-in competition (${dineIn})`
          : `${dineIn} dine-in restaurants · ${fastFood} fast food (indirect)`
      } else if (dineIn > 0) {
        typeSpecificInsight = `${dineIn} dine-in restaurants in radius`
      }
    } else if (type === 'cafe') {
      if (subTypeCounts.premium > 3) typeSpecificInsight = `Strong specialty coffee culture — ${subTypeCounts.premium} premium cafés detected`
    }

    const anchorInsight = anchors.length > 0
      ? `${anchors.length} major anchor tenant${anchors.length > 1 ? 's' : ''} nearby — elevated foot traffic potential`
      : null

    const dataSource = googlePOIs.length > 0 ? 'google+geoapify' : 'geoapify'

    const responseBody: any = {
      competitors, landmarks, anchors, dataLimited,
      dataSource,
      competitorCountBeforeFilter: countBefore + googlePOIs.length,
      competitorCountAfterFilter:  competitors.length,
      insights: {
        competitorCount500m: within500m, competitorCountTotal: within1km,
        directCount, indirectCount, density, risk, tierBreakdown, subTypeCounts,
        gapOpportunity, typeSpecificInsight, anchorInsight, anchorCount: anchors.length, dataLimited,
        foursquareVerified: false,
        googleVerified: googlePOIs.length > 0,
        googleCount: googlePOIs.length,
        geoapifyCount: geoapifyCompetitors.length,
      },
    }

    if (debug) {
      responseBody._debug = {
        mode: dataSource,
        queriedCategories: allCats, fallbackCategories: fallbackCats,
        radius,
        geoapifyRawCount: rawFeatures.length,
        googleRawCount: googlePOIs.length,
        mergedCount: competitors.length,
        droppedNames: missingNames, droppedCoords: missingCoords,
      }
    }

    return NextResponse.json(responseBody)

  } catch (err) {
    console.error('[nearby-places] Error:', err)
    return NextResponse.json(
      { error: 'Failed', competitors: [], landmarks: [], anchors: [], dataLimited: true,
        dataSource: 'none', competitorCountBeforeFilter: 0, competitorCountAfterFilter: 0, insights: null },
      { status: 500 }
    )
  }
}
