// lib/placesCache.ts
// 48-hour cache for Google Places / competitor lookups
// Reduces repeated API calls for the same location+category

export async function getCachedPlaces(
  lat: number,
  lng: number,
  type: string,
  supabase: ReturnType<typeof import('@supabase/supabase-js').createClient>,
  fetchFn: (lat: number, lng: number, type: string) => Promise<unknown>
): Promise<unknown> {
  const key = `${lat.toFixed(4)}_${lng.toFixed(4)}_${type}`
  const ttlMs = 48 * 60 * 60 * 1000 // 48 hours

  // Check cache
  const { data, error } = await supabase
    .from('places_cache')
    .select('results, created_at')
    .eq('cache_key', key)
    .single()

  if (!error && data) {
    const age = Date.now() - new Date(data.created_at).getTime()
    if (age < ttlMs) {
      console.log('[placesCache] HIT', key)
      return data.results
    }
  }

  // Cache miss — fetch fresh data
  console.log('[placesCache] MISS', key)
  const results = await fetchFn(lat, lng, type)

  // Store in cache (upsert handles key conflicts)
  await supabase.from('places_cache').upsert({
    cache_key: key,
    results,
    created_at: new Date().toISOString(),
  })

  return results
}
