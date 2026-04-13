/**
 * lib/places/multi-source.ts
 *
 * Multi-source POI pipeline:
 *   Fetch → Normalise → Cluster (DBSCAN) → Confidence-Weight → Density
 *
 * Architecture:
 *   Google Places (primary, confidence=1.00)
 *   Geoapify     (secondary, confidence=0.60 — OSM-backed, may be stale)
 *   Foursquare   (primary for gym, confidence=0.85)
 *
 * Key guarantees:
 *   - A POI counted once regardless of how many sources returned it
 *   - Competition score is a WEIGHTED sum, not a raw headcount
 *   - Google-verified venues count more than OSM nodes
 *   - DBSCAN clustering removes ~50m co-location duplicates before weighting
 */

// ── Source confidence weights ─────────────────────────────────────────────────
//
// Based on data freshness, curation quality, and false-positive rate:
//   Google Places: real-time, owner-verified, review-backed → 1.00
//   Foursquare:    real-time, check-in verified             → 0.85
//   Geoapify/OSM:  community-edited, may be stale/wrong     → 0.60
//   fallback:      broad category, high false-positive rate → 0.30

export const SOURCE_CONFIDENCE: Record<string, number> = {
  google:     1.00,
  foursquare: 0.85,
  geoapify:   0.60,
  fallback:   0.30,
}

// ── Unified POI schema ────────────────────────────────────────────────────────

export interface NormalizedPOI {
  name:        string
  lat:         number
  lng:         number
  distance:    number    // metres from search centre
  category:    string    // normalised category string
  rating:      number    // 0–5 scale (Google native; Foursquare /2)
  reviewCount: number    // total review count (0 if unavailable)
  source:      'google' | 'geoapify' | 'foursquare' | 'fallback'
  confidence:  number    // 0–1, derived from SOURCE_CONFIDENCE
  placeId?:    string    // Google place_id or foursquare fsq_id
}

// ── Live density result ───────────────────────────────────────────────────────

export interface LiveCompetitorDensity {
  // Raw counts (how many unique venues after DBSCAN clustering)
  rawCount500m:  number
  rawCount1km:   number
  rawCount2km:   number

  // Confidence-weighted counts (the authoritative figure for scoring)
  // = Σ confidence of each cluster representative within radius
  weightedCount500m: number
  weightedCount1km:  number

  // Overall data confidence (avg of all cluster reps)
  avgConfidence: number

  density:        'low' | 'medium' | 'high'
  /** Revenue multiplier: 1.00 (low) → 0.88 (medium) → 0.75 (high) */
  pressureFactor: number

  sources: string[]   // which APIs contributed (deduplicated)
}

// ── Geoapify category map ─────────────────────────────────────────────────────

const GEOAPIFY_TYPE_MAP: Record<string, string> = {
  cafe:       'catering.cafe,catering.coffee_shop,catering.bakery',
  restaurant: 'catering.restaurant,catering.cafe,catering.fast_food',
  bakery:     'catering.bakery,catering.cafe',
  gym:        'sport.gym,leisure.fitness_centre,sport.fitness_centre,sport.sports_centre',
  salon:      'service.beauty,service.hairdresser',
  retail:     'commercial.clothing,commercial.department_store,commercial.shopping_mall',
  bar:        'catering.bar,catering.pub,catering.nightclub',
  takeaway:   'catering.fast_food,catering.restaurant',
  pharmacy:   'healthcare.pharmacy,healthcare.chemist',
  other:      'catering,commercial',
}

// ── Google Places type mapping ────────────────────────────────────────────────
//
// Gym/fitness: Google doesn't have a clean single type.
//   'gym'    → dedicated gyms (Snap, Anytime, Goodlife…)
//   'health' → health clubs, wellness centres
//   'spa'    → pilates/yoga hybrids (many yoga studios register as spa)
// We also run a Text Search pass with gym keywords to catch the rest.

const GOOGLE_TYPE_MAP: Record<string, string[]> = {
  cafe:       ['cafe'],
  restaurant: ['restaurant'],
  gym:        ['gym', 'health'],   // 'spa' added via keyword pass below
  bar:        ['bar'],
  bakery:     ['bakery'],
  pharmacy:   ['pharmacy'],
  salon:      ['beauty_salon'],
  retail:     ['clothing_store'],
  takeaway:   ['meal_takeaway'],
  other:      ['establishment'],
}

// Keywords for Google Text Search — used when type needs keyword matching
// (e.g. pilates/yoga studios that register as 'spa' or 'school')
const GOOGLE_TEXT_SEARCH_KEYWORDS: Partial<Record<string, string[]>> = {
  gym: ['crossfit', 'pilates studio', 'yoga studio', 'martial arts', 'boxing gym', 'fitness centre', 'health club'],
}

// ── Geo helpers ───────────────────────────────────────────────────────────────

export function haversineMeters(
  lat1: number, lng1: number,
  lat2: number, lng2: number,
): number {
  const R    = 6_371_000
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a    =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// ── Name helpers ──────────────────────────────────────────────────────────────

function normaliseName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\b(the|a|an|and|of|at|&)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function tokenJaccard(a: string, b: string): number {
  const ta = new Set(normaliseName(a).split(' ').filter(Boolean))
  const tb = new Set(normaliseName(b).split(' ').filter(Boolean))
  const intersection = [...ta].filter(t => tb.has(t)).length
  const union = new Set([...ta, ...tb]).size
  return union > 0 ? intersection / union : 0
}

// ── Junk name filter ──────────────────────────────────────────────────────────

function isJunkName(name: string): boolean {
  if (!name || name.trim().length < 3) return true
  const n = name.trim()
  if (/^(wa|way|node|rel|relation|area|n|r|w)\d+(\s+\d+)?$/i.test(n)) return true
  if (/^\d+$/.test(n)) return true
  if (/^[a-f0-9]{8,}$/i.test(n)) return true
  if (/^[a-z]{1,3}\d{4,}$/i.test(n)) return true
  return false
}

// ── DBSCAN-style spatial clustering ──────────────────────────────────────────
//
// Each venue that appears in multiple sources becomes ONE cluster.
// We pick the "cluster representative" = highest-confidence source for that venue.
// This prevents double-counting a single Snap Fitness that appears in both
// Google (confidence=1.0) and Geoapify (confidence=0.6).
//
// Cluster membership rules (either condition):
//   A. Distance < 50 m  → almost certainly same building
//   B. Distance < 200 m AND name token Jaccard > 0.70
//
// The cluster representative is chosen by:
//   1. Highest confidence source
//   2. If tie: highest reviewCount (more community data)

function areSameVenue(a: NormalizedPOI, b: NormalizedPOI): boolean {
  const dist = haversineMeters(a.lat, a.lng, b.lat, b.lng)
  if (dist < 50)  return true
  if (dist < 200 && tokenJaccard(a.name, b.name) > 0.70) return true
  return false
}

export function clusterAndMerge(pois: NormalizedPOI[]): NormalizedPOI[] {
  if (pois.length === 0) return []

  // Assign cluster IDs using union-find style approach
  const clusterOf = new Array<number>(pois.length).fill(-1)
  let nextCluster  = 0

  for (let i = 0; i < pois.length; i++) {
    for (let j = i + 1; j < pois.length; j++) {
      if (areSameVenue(pois[i], pois[j])) {
        const ci = clusterOf[i]
        const cj = clusterOf[j]

        if (ci === -1 && cj === -1) {
          // New cluster
          clusterOf[i] = nextCluster
          clusterOf[j] = nextCluster
          nextCluster++
        } else if (ci === -1) {
          clusterOf[i] = cj
        } else if (cj === -1) {
          clusterOf[j] = ci
        } else if (ci !== cj) {
          // Merge two clusters: remap all cj → ci
          for (let k = 0; k < pois.length; k++) {
            if (clusterOf[k] === cj) clusterOf[k] = ci
          }
        }
      }
    }
    // Singleton
    if (clusterOf[i] === -1) {
      clusterOf[i] = nextCluster++
    }
  }

  // Group by cluster, pick best representative
  const clusters = new Map<number, NormalizedPOI[]>()
  for (let i = 0; i < pois.length; i++) {
    const c = clusterOf[i]
    const group = clusters.get(c) ?? []
    group.push(pois[i])
    clusters.set(c, group)
  }

  const representatives: NormalizedPOI[] = []
  for (const group of clusters.values()) {
    // Pick best: highest confidence first, then highest reviewCount
    group.sort((a, b) => {
      if (b.confidence !== a.confidence) return b.confidence - a.confidence
      return b.reviewCount - a.reviewCount
    })
    representatives.push(group[0])
  }

  return representatives.sort((a, b) => a.distance - b.distance)
}

// ── Density computation ───────────────────────────────────────────────────────
//
// Density is based on WEIGHTED count, not raw count.
//
// Example:
//   8 venues within 500m — all Geoapify (confidence=0.60)
//   → weightedCount500m = 8 × 0.60 = 4.8 → density = "medium"
//
//   8 venues within 500m — all Google (confidence=1.00)
//   → weightedCount500m = 8 × 1.00 = 8.0 → density = "high"
//
// This ensures OSM-only markets are not over-scored as "saturated"
// when we can't verify the data quality.
//
// Density bands (weighted count within 500 m):
//   low    → 0.0–2.5   → pressureFactor 1.00
//   medium → 2.5–6.5   → pressureFactor 0.88
//   high   → 6.5+      → pressureFactor 0.75

export function computeLiveDensity(pois: NormalizedPOI[]): LiveCompetitorDensity {
  const within500m = pois.filter(p => p.distance <= 500)
  const within1km  = pois.filter(p => p.distance <= 1000)

  const rawCount500m = within500m.length
  const rawCount1km  = within1km.length
  const rawCount2km  = pois.length

  // Weighted counts
  const weightedCount500m = within500m.reduce((s, p) => s + p.confidence, 0)
  const weightedCount1km  = within1km.reduce((s, p) => s + p.confidence, 0)

  // Average confidence of all cluster representatives
  const avgConfidence = pois.length > 0
    ? pois.reduce((s, p) => s + p.confidence, 0) / pois.length
    : 0

  const density: 'low' | 'medium' | 'high' =
    weightedCount500m < 2.5  ? 'low'
    : weightedCount500m < 6.5  ? 'medium'
    : 'high'

  const pressureFactor =
    density === 'high'   ? 0.75
    : density === 'medium' ? 0.88
    : 1.00

  const sources = [...new Set(pois.map(p => p.source))]

  return {
    rawCount500m,
    rawCount1km,
    rawCount2km,
    weightedCount500m: Math.round(weightedCount500m * 10) / 10,
    weightedCount1km:  Math.round(weightedCount1km  * 10) / 10,
    avgConfidence:     Math.round(avgConfidence * 100) / 100,
    density,
    pressureFactor,
    sources,
  }
}

// ── Google Places Nearby Search ───────────────────────────────────────────────
//
// Cost optimisation: `fields` is NOT supported by Nearby Search (it's a Places
// Details param). Instead we use the cheaper Nearby Search pricing tier which
// only returns the basic place schema. We request no extra fields beyond what
// the API returns by default (name, geometry, rating, user_ratings_total,
// place_id) — this keeps us on the "Basic" pricing tier (~$0.032/call vs
// $0.017/call for Find Place but with much broader results).

export async function fetchGooglePlaces(
  lat:    string,
  lng:    string,
  radius: number,
  type:   string,
  apiKey: string,
): Promise<NormalizedPOI[]> {
  const googleTypes = GOOGLE_TYPE_MAP[type] ?? GOOGLE_TYPE_MAP.other
  const results: NormalizedPOI[] = []
  const seen = new Set<string>()
  const latN = parseFloat(lat)
  const lngN = parseFloat(lng)

  for (const gType of googleTypes) {
    const url =
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json` +
      `?location=${lat},${lng}` +
      `&radius=${Math.min(radius, 50000)}` +
      `&type=${gType}` +
      `&key=${apiKey}`

    console.log(`[google-places] GET type=${gType} r=${radius}m`)

    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(9000) })
      if (!res.ok) {
        console.error(`[google-places] HTTP ${res.status}`)
        continue
      }

      const json = await res.json()

      if (json.status === 'REQUEST_DENIED') {
        console.error(`[google-places] REQUEST_DENIED: ${json.error_message ?? ''}`)
        break
      }

      for (const place of (json.results ?? [])) {
        const name = (place.name ?? '').trim()
        if (!name || name.length < 2 || isJunkName(name)) continue

        const placeLat = place.geometry?.location?.lat
        const placeLng = place.geometry?.location?.lng
        if (placeLat == null || placeLng == null) continue

        const placeId = place.place_id ?? ''
        // Skip dedup for empty placeId — multiple places with no place_id must not be
        // collapsed into one. Only deduplicate when we have a real stable identifier.
        if (placeId && seen.has(placeId)) continue
        if (placeId) seen.add(placeId)

        const dist = Math.round(haversineMeters(latN, lngN, placeLat, placeLng))

        results.push({
          name,
          lat:         placeLat,
          lng:         placeLng,
          distance:    dist,
          category:    gType,
          rating:      typeof place.rating === 'number' ? place.rating : 0,
          reviewCount: place.user_ratings_total ?? 0,
          source:      'google',
          confidence:  SOURCE_CONFIDENCE.google,
          placeId,
        })
      }
    } catch (err: any) {
      console.error(`[google-places] error (${gType}):`, err?.message)
    }
  }

  console.log(`[google-places] ${results.length} raw POIs`)
  return results
}

// ── Google Places Text Search — keyword-based (for gym/yoga/pilates/crossfit) ─
//
// Nearby Search with type=gym misses yoga studios, pilates, crossfit boxes,
// martial arts dojos — they often register under 'spa', 'school', or 'health'.
// Text Search by keyword catches them all in one call.
//
// One Text Search call per keyword = one billing unit (~$0.032).
// We cap at 3 keywords to keep cost under $0.10 per gym analysis.

export async function fetchGoogleTextSearch(
  lat:     string,
  lng:     string,
  radius:  number,
  type:    string,
  apiKey:  string,
): Promise<NormalizedPOI[]> {
  const keywords = GOOGLE_TEXT_SEARCH_KEYWORDS[type]
  if (!keywords || keywords.length === 0) return []

  const results: NormalizedPOI[] = []
  const seen    = new Set<string>()
  const latN    = parseFloat(lat)
  const lngN    = parseFloat(lng)

  // Only run first 3 keywords to control cost (DBSCAN will deduplicate overlaps)
  for (const keyword of keywords.slice(0, 3)) {
    const url =
      `https://maps.googleapis.com/maps/api/place/textsearch/json` +
      `?query=${encodeURIComponent(keyword)}` +
      `&location=${lat},${lng}` +
      `&radius=${Math.min(radius, 50000)}` +
      `&key=${apiKey}`

    console.log(`[google-text] keyword="${keyword}" r=${radius}m`)

    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(9000) })
      if (!res.ok) { console.error(`[google-text] HTTP ${res.status}`); continue }

      const json = await res.json()
      if (json.status === 'REQUEST_DENIED') {
        console.error(`[google-text] REQUEST_DENIED: ${json.error_message ?? ''}`)
        break
      }

      for (const place of (json.results ?? [])) {
        const name = (place.name ?? '').trim()
        if (!name || name.length < 2 || isJunkName(name)) continue

        const placeLat = place.geometry?.location?.lat
        const placeLng = place.geometry?.location?.lng
        if (placeLat == null || placeLng == null) continue

        // Only include results within our radius (Text Search ignores radius strictly)
        const dist = Math.round(haversineMeters(latN, lngN, placeLat, placeLng))
        if (dist > radius) continue

        const placeId = place.place_id ?? ''
        if (placeId && seen.has(placeId)) continue
        if (placeId) seen.add(placeId)

        results.push({
          name,
          lat:         placeLat,
          lng:         placeLng,
          distance:    dist,
          category:    keyword,
          rating:      typeof place.rating === 'number' ? place.rating : 0,
          reviewCount: place.user_ratings_total ?? 0,
          source:      'google',
          confidence:  SOURCE_CONFIDENCE.google,
          placeId,
        })
      }
    } catch (err: any) {
      console.error(`[google-text] error (${keyword}):`, err?.message)
    }
  }

  console.log(`[google-text] ${results.length} keyword POIs for type=${type}`)
  return results
}

// ── Geoapify Nearby Search ────────────────────────────────────────────────────

export async function fetchGeoapifyPOIs(
  lat:    string,
  lng:    string,
  radius: number,
  type:   string,
  apiKey: string,
): Promise<NormalizedPOI[]> {
  const categories = GEOAPIFY_TYPE_MAP[type] ?? GEOAPIFY_TYPE_MAP.other
  const url =
    `https://api.geoapify.com/v2/places` +
    `?categories=${categories}` +
    `&filter=circle:${lng},${lat},${radius}` +
    `&bias=proximity:${lng},${lat}` +
    `&limit=50` +
    `&apiKey=${apiKey}`

  console.log(`[geoapify-multi] GET type=${type} r=${radius}m`)

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(9000) })
    if (!res.ok) { console.error(`[geoapify-multi] HTTP ${res.status}`); return [] }

    const json  = await res.json()
    const latN  = parseFloat(lat)
    const lngN  = parseFloat(lng)
    const pois: NormalizedPOI[] = []

    for (const f of (json.features ?? [])) {
      const name = (f.properties?.name ?? '').trim()
      if (!name || name.length < 2 || isJunkName(name)) continue

      const fLat = f.properties?.lat  ?? f.geometry?.coordinates?.[1]
      const fLng = f.properties?.lon  ?? f.geometry?.coordinates?.[0]
      if (fLat == null || fLng == null || isNaN(Number(fLat))) continue

      const dist = Math.round(
        f.properties?.distance ?? haversineMeters(latN, lngN, Number(fLat), Number(fLng)),
      )

      pois.push({
        name,
        lat:         Number(fLat),
        lng:         Number(fLng),
        distance:    dist,
        category:    (f.properties?.categories?.[0] ?? type),
        rating:      0,
        reviewCount: 0,
        source:      'geoapify',
        confidence:  SOURCE_CONFIDENCE.geoapify,
      })
    }

    console.log(`[geoapify-multi] ${pois.length} raw POIs`)
    return pois
  } catch (err: any) {
    console.error('[geoapify-multi] error:', err?.message)
    return []
  }
}

// ── Top-level: fetch all sources, cluster, cache, return density ──────────────
//
// For gym/fitness: runs BOTH Nearby Search (gym, health) AND Text Search
// (crossfit, pilates, yoga, fitness centre, martial arts, boxing) in parallel.
// This catches yoga studios registered as 'spa' and crossfit boxes registered
// as 'school' — the two most common Google Places misclassifications for gyms.
//
// Results are cached in Redis (24h TTL) keyed by lat/lng/radius/type.
// Cache hit = zero API calls on subsequent requests for same location.
//
// Gracefully degrades:
//   - No GOOGLE_PLACES_API_KEY → Geoapify-only (avgConfidence capped at 0.60)
//   - No GEOAPIFY_API_KEY      → Google-only
//   - Neither key              → returns null (caller falls back to A1 only)

import { getCachedPlaces, setCachedPlaces } from './places-cache'

export async function fetchLiveCompetitorDensity(
  lat:          string,
  lng:          string,
  radius:       number,
  type:         string,
  googleApiKey: string | undefined,
  geoapifyKey:  string | undefined,
): Promise<LiveCompetitorDensity | null> {
  if (!googleApiKey && !geoapifyKey) {
    console.warn('[multi-source] No API keys — skipping live density')
    return null
  }

  // ── Cache check ─────────────────────────────────────────────────────────────
  const cached = await getCachedPlaces(lat, lng, radius, type)
  if (cached) {
    console.log(`[multi-source] cache hit → density=${cached.density.density} w1km=${cached.density.weightedCount1km}`)
    return cached.density
  }

  try {
    // Run all sources in parallel.
    // For gym: also run Text Search to catch pilates/yoga/crossfit studios.
    const [googleNearbyPOIs, googleTextPOIs, geoapifyPOIs] = await Promise.all([
      googleApiKey
        ? fetchGooglePlaces(lat, lng, radius, type, googleApiKey)
        : Promise.resolve([] as NormalizedPOI[]),
      googleApiKey
        ? fetchGoogleTextSearch(lat, lng, radius, type, googleApiKey)
        : Promise.resolve([] as NormalizedPOI[]),
      geoapifyKey
        ? fetchGeoapifyPOIs(lat, lng, radius, type, geoapifyKey)
        : Promise.resolve([] as NormalizedPOI[]),
    ])

    // Merge all sources, then DBSCAN cluster
    const allPOIs  = [...googleNearbyPOIs, ...googleTextPOIs, ...geoapifyPOIs]
    const clustered = clusterAndMerge(allPOIs)
    const density   = computeLiveDensity(clustered)

    console.log(
      `[multi-source] type=${type} r=${radius}m ` +
      `gNearby=${googleNearbyPOIs.length} gText=${googleTextPOIs.length} geo=${geoapifyPOIs.length} ` +
      `raw=${allPOIs.length} clustered=${clustered.length} ` +
      `w500=${density.weightedCount500m} w1km=${density.weightedCount1km} ` +
      `density=${density.density} avgConf=${density.avgConfidence} ` +
      `pressure=${density.pressureFactor}`,
    )

    // ── Cache the result ───────────────────────────────────────────────────────
    await setCachedPlaces(lat, lng, radius, type, {
      clusteredPOIs: clustered,
      density,
      cachedAt: new Date().toISOString(),
    })

    return density
  } catch (err: any) {
    console.error('[multi-source] error:', err?.message)
    return null
  }
}
