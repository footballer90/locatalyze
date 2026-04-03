# A1 Competitor Intelligence — n8n Manual Fix Guide

## Why this is needed

The active workflow "Locatalyze v2 – A1 Competitor Intelligence (Nearbysearch 500m Fixed)"
has three confirmed bugs:

| Bug | Impact |
|-----|--------|
| Hardcoded `radius=500` on all business types | Gyms need 1500m; 500m misses most competitors |
| Single `type=gym` query | Google Places tags many gyms as `health`, `spa`, or `establishment` — `type=gym` alone misses them |
| Does not pass `google_types[]` to output | Engine's `isValidCompetitor` can't use API type matching |

**Real-world proof:** Wembley, Perth → 0 gym competitors reported. Multiple gyms confirmed nearby.

---

## The Fix — 3 Changes in n8n

Open the workflow: **Locatalyze v2 – A1 Competitor Intelligence (Nearbysearch 500m Fixed)**

---

### Change 1: Replace the "Parse Input / Set Radius" Code node

Find the Code node near the start that parses the incoming webhook body.
Replace its JavaScript with:

```javascript
// ── Parse & validate input from Master Orchestrator ──────────────────────────
const body = $input.first().json.body || $input.first().json;

const lat          = parseFloat(body.lat  || body.latitude  || 0);
const lng          = parseFloat(body.lng  || body.longitude || 0);
const businessType = String(body.businessType || body.business_type || 'other').toLowerCase();
const area         = String(body.area   || body.suburb || '');
const city         = String(body.city   || '');
const reportId     = String(body.reportId || body.report_id || '');

// ── Radius lookup (metres) — must match lib/compute/benchmarks.ts ────────────
const RADIUS_MAP = {
  gym:        1500,
  fitness:    1500,
  cafe:       600,
  restaurant: 600,
  bakery:     600,
  bar:        600,
  salon:      600,
  retail:     500,
  takeaway:   500,
  pharmacy:   800,
};

function resolveKey(bt) {
  const keys = Object.keys(RADIUS_MAP);
  for (let i = 0; i < keys.length; i++) {
    if (bt.indexOf(keys[i]) !== -1) return keys[i];
  }
  return 'other';
}

const bizKey = resolveKey(businessType);
const radius = RADIUS_MAP[bizKey] || 600;

// ── Google Places search types (primary) ─────────────────────────────────────
// Using 'type' is strict — Google only returns places that match exactly.
// We also need keyword searches to catch places tagged differently.
const TYPE_MAP = {
  gym:        'gym',
  fitness:    'gym',
  cafe:       'cafe',
  restaurant: 'restaurant',
  bakery:     'bakery',
  bar:        'bar',
  salon:      'beauty_salon',
  retail:     'clothing_store',
  takeaway:   'meal_takeaway',
  pharmacy:   'pharmacy',
};

// ── Keyword searches (broader — catches places with non-standard type tags) ──
const KEYWORD_MAP = {
  gym:        ['fitness centre', 'health club', 'yoga studio', 'pilates', 'crossfit'],
  fitness:    ['fitness centre', 'health club', 'yoga studio', 'pilates'],
  cafe:       ['coffee shop', 'espresso bar', 'brunch cafe'],
  restaurant: ['restaurant', 'dining'],
  bakery:     ['bakery', 'patisserie'],
  bar:        ['bar', 'pub', 'tavern'],
  salon:      ['hair salon', 'barber', 'beauty salon'],
  retail:     ['clothing store', 'boutique'],
  takeaway:   ['takeaway', 'fast food'],
  pharmacy:   ['pharmacy', 'chemist'],
};

const primaryType     = TYPE_MAP[bizKey] || null;
const keywordList     = KEYWORD_MAP[bizKey] || [];
// Use first 2 keywords max — each is a separate API call, don't over-fetch
const keywords        = keywordList.slice(0, 2);

if (!lat || !lng) {
  throw new Error('A1: lat/lng missing from input — check Master Orchestrator coordinate passing');
}

return [{
  json: {
    lat, lng, bizKey, businessType, area, city, reportId,
    radius, primaryType, keywords,
    locationString: lat + ',' + lng,
  }
}];
```

---

### Change 2: Replace/Update the Google Places HTTP Request nodes

The workflow currently has **one** NearbySearch HTTP Request node. You need **three**:

#### Node A: "Google Places — Type Search" (keep/update existing)

| Field | Value |
|-------|-------|
| Method | GET |
| URL | `https://maps.googleapis.com/maps/api/place/nearbysearch/json` |
| Query params | `location` = `{{ $json.locationString }}` |
| | `radius` = `{{ $json.radius }}` |
| | `type` = `{{ $json.primaryType }}` |
| | `key` = *(your Google API key credential)* |

#### Node B: "Google Places — Keyword 1" (add new)

Same URL and auth, but:
| Field | Value |
|-------|-------|
| Query params | `location` = `{{ $json.locationString }}` |
| | `radius` = `{{ $json.radius }}` |
| | `keyword` = `{{ $json.keywords[0] }}` |
| | `key` = *(same credential)* |

Connect the Parse node to Node B in parallel with Node A.

#### Node C: "Google Places — Keyword 2" (add new)

Same as Node B but:
| | `keyword` = `{{ $json.keywords[1] }}` |

Connect Parse node to Node C as well.

Then add a **Merge (Append, 3 inputs)** node after A, B, C.

---

### Change 3: Replace the "Process & Format Output" Code node

Find the Code node that formats the final competitor list. Replace with:

```javascript
// ── Collect all results from all 3 NearbySearch calls ────────────────────────
// Each input item has a `results` array from the Google Places API.
const allPlaces = [];

for (let i = 0; i < $input.all().length; i++) {
  const item = $input.all()[i].json;
  const results = item.results || item.result || [];
  for (let j = 0; j < results.length; j++) {
    allPlaces.push(results[j]);
  }
}

// ── Deduplicate by place_id (Google's unique identifier) ─────────────────────
const seen = {};
const unique = [];
for (let i = 0; i < allPlaces.length; i++) {
  const p = allPlaces[i];
  const key = p.place_id || p.name || ('idx-' + i);
  if (!seen[key]) {
    seen[key] = true;
    unique.push(p);
  }
}

// ── Calculate distance from search origin ────────────────────────────────────
// Use Haversine formula — Google Places NearbySearch doesn't return distance directly
const originLat = parseFloat($('Parse Input').first().json.lat);
const originLng = parseFloat($('Parse Input').first().json.lng);

function haversineM(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2)
    + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180)
    * Math.sin(dLng/2) * Math.sin(dLng/2);
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
}

// ── Map to standard competitor shape ─────────────────────────────────────────
const competitors = unique.map(function(p) {
  const loc = p.geometry && p.geometry.location ? p.geometry.location : {};
  const distM = (loc.lat && loc.lng)
    ? haversineM(originLat, originLng, loc.lat, loc.lng)
    : null;

  return {
    name:         p.name || 'Unknown',
    address:      p.vicinity || p.formatted_address || null,
    rating:       p.rating   || null,
    review_count: p.user_ratings_total || null,
    // CRITICAL: pass google_types[] so computeEngine's isValidCompetitor can match
    google_types: p.types    || [],
    place_id:     p.place_id || null,
    distance_m:   distM,
    // Mark as 'direct' so engine trusts it without keyword re-check
    competitor_type: 'direct',
    // Raw status flags for debugging
    business_status: p.business_status || null,
    open_now: p.opening_hours ? p.opening_hours.open_now : null,
  };
}).filter(function(c) {
  // Drop permanently closed places
  return c.business_status !== 'PERMANENTLY_CLOSED';
});

// ── Build final output ───────────────────────────────────────────────────────
const bizKey         = $('Parse Input').first().json.bizKey;
const radius         = $('Parse Input').first().json.radius;
const area           = $('Parse Input').first().json.area;
const city           = $('Parse Input').first().json.city;

return [{
  json: {
    // Primary output key — this is what computeEngine reads
    competitors: competitors,

    // Metadata for logging and data quality assessment
    total_found:    allPlaces.length,
    unique_found:   unique.length,
    validated_count: competitors.length,
    search_radius_m: radius,
    biz_key:        bizKey,
    area:           area,
    city:           city,
    data_source:    'google_places_nearbysearch',
    searched_at:    new Date().toISOString(),

    // Legacy fields (kept for backward compatibility)
    competitors_within_500m:   competitors.filter(function(c) { return c.distance_m !== null && c.distance_m <= 500; }).length,
    competitors_within_1000m:  competitors.filter(function(c) { return c.distance_m !== null && c.distance_m <= 1000; }).length,
    competitors_within_radius: competitors.length,
    saturation_level: competitors.length === 0 ? 'unknown'
                    : competitors.length <= 3   ? 'low'
                    : competitors.length <= 8   ? 'moderate'
                    : 'high',
  }
}];
```

> **Important:** In the Haversine function, replace `$('Parse Input')` with the actual name
> of your Parse node if it's named differently (e.g. `$('Set Variables')` or `$('Code')`).

---

## Testing After Applying

Run a test execution with:
```json
{
  "lat": -31.9295,
  "lng": 115.8186,
  "businessType": "Gym / Fitness",
  "area": "Wembley",
  "city": "Perth",
  "state": "WA",
  "reportId": "test-wembley-001"
}
```

Expected result:
- `competitors` array with ≥ 3 gym entries
- `google_types` on each entry (e.g. `["gym", "health", "establishment"]`)
- `distance_m` populated for each

---

## What the compute engine does with this data

The `computeEngine()` in `lib/compute/engine.ts` now:

1. Reads `a1.competitors` first (the primary key you're now outputting)
2. Also reads 9 other field name variants as fallback
3. Calls `isValidCompetitor(place, bizKey)` which:
   - First checks `google_types[]` against `GOOGLE_PLACES_TYPES[bizKey]`
   - Then falls back to keyword matching on name/type/category
   - Since you're tagging all as `competitor_type: 'direct'`, they pass immediately
4. Sets `competitorDataQuality = 'live_verified'` when ≥1 competitor found
5. Only gives competition score of 85+ for genuine blue ocean (`live_verified` + count=0)
