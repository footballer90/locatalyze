// lib/placesCache.ts
// 48-hour cache for Google Places / competitor lookups

type PlacesCacheRow = {
  results: unknown
  created_at: string
}

export async function getCachedPlaces(
  lat: number,
  lng: number,
  type: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  fetchFn: (lat: number, lng: number, type: string) => Promise<unknown>
): Promise<unknown> {
  const key = `${lat.toFixed(4)}_${lng.toFixed(4)}_${type}`
  const ttlMs = 48 * 60 * 60 * 1000

  const { data, error } = await supabase
    .from('places_cache')
    .select('results, created_at')
    .eq('cache_key', key)
    .single()

  if (!error && data) {
    const row = data as PlacesCacheRow
    const age = Date.now() - new Date(row.created_at).getTime()
    if (age < ttlMs) {
      console.log('[placesCache] HIT', key)
      return row.results
    }
  }

  console.log('[placesCache] MISS', key)
  const results = await fetchFn(lat, lng, type)

  await supabase.from('places_cache').upsert({
    cache_key: key,
    results,
    created_at: new Date().toISOString(),
  })

  return results
}
