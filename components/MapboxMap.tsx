'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { lzRateLimitHeaders } from '@/lib/lz-rate-limit-headers'

// ── Types ─────────────────────────────────────────────────────────────────────
export interface Competitor {
  name: string
  lat: number
  lng: number
  distance: number
  category: string
  rating?: number
  reviewCount?: number
  isDirect?: boolean
  tier?: 'budget' | 'mid' | 'premium'
  sub_type?: 'fast_food' | 'casual' | 'premium'
  tierInsight?: string
  source?: 'google' | 'foursquare' | 'geoapify' | string
  // Strength scoring (added by nearby-places API)
  strength?: 'strong' | 'medium' | 'weak'
  strengthScore?: number
  reviewInsight?: string
  marketSignals?: string[]
}

export interface Landmark {
  name: string
  lat: number
  lng: number
  distance: number
  kind: 'transport' | 'school' | 'mall' | 'park' | 'other'
}

export interface Anchor {
  name: string
  lat: number
  lng: number
  distance: number
  kind: 'supermarket' | 'bigbox' | 'qsr' | 'pharmacy' | 'retail'
  footTraffic: string
}

export interface MapInsights {
  competitorCount500m: number
  competitorCountTotal: number
  density: 'low' | 'medium' | 'high'
  risk: 'low' | 'moderate' | 'high'
  directCount?: number
  indirectCount?: number
  tierBreakdown?: { budget: number; mid: number; premium: number }
  subTypeCounts?: { fast_food: number; casual: number; premium: number }
  gapOpportunity?: string | null
  typeSpecificInsight?: string | null
  anchorInsight?: string | null
  anchorCount?: number
  dataLimited?: boolean
  foursquareVerified?: boolean
  googleVerified?: boolean
  fsqError?: string | null
  // Strength intelligence
  strongCount?: number
  mediumCount?: number
  weakCount?: number
  dominantBrand?: string | null
  opportunityGap?: string | null
  marketInsights?: string[]
  // Demand signals
  demandScore?: number
  demandLabel?: string
  demandDrivers?: string[]
}

interface MapboxMapProps {
  lat: number
  lng: number
  businessType?: string
  radius?: number            // if provided, overrides API default
  /** Inner ring: competitor density search area (default 600m) */
  competitorRadiusM?: number
  /** Outer ring: realistic customer travel catchment (default 1500m) */
  catchmentRadiusM?: number
  onFlyEnd?: () => void
  onInsightsUpdate?: (insights: MapInsights) => void
  onCompetitorsUpdate?: (competitors: Competitor[]) => void
  onAnchorsUpdate?: (anchors: Anchor[]) => void
  showHeatmap?: boolean
  showIsochrones?: boolean
}

// ── Design tokens ─────────────────────────────────────────────────────────────
const BRAND       = '#0F766E'
const BRAND_LIGHT = '#14B8A6'
const SLATE_600   = '#475569'
const AMBER       = '#D97706'
const RED         = '#DC2626'
const ISO_5       = '#0F766E'
const ISO_10      = '#6366F1'

// Marker colours — strength-based (competitive threat level)
const STRENGTH_COLOR: Record<string, string> = {
  strong: '#DC2626',   // red    — dominant competitor (high threat)
  medium: '#D97706',   // amber  — moderate competitor
  weak:   '#14B8A6',   // teal   — weak/manageable competitor
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function haversineMeters(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371000
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function tierBadgeHTML(tier: string) {
  const cfg: Record<string, { bg: string; color: string; label: string }> = {
    premium: { bg: '#EEF2FF', color: '#4338CA', label: 'Premium' },
    budget:  { bg: '#F1F5F9', color: '#475569', label: 'Budget' },
    mid:     { bg: '#F0FDF4', color: '#15803D', label: 'Mid-market' },
  }
  const c = cfg[tier] || cfg.mid
  return `<span style="display:inline-block;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:700;background:${c.bg};color:${c.color}">${c.label}</span>`
}

function subTypeBadgeHTML(sub_type: string) {
  const cfg: Record<string, { bg: string; color: string; label: string }> = {
    premium:   { bg: '#EEF2FF', color: '#4338CA', label: 'Premium' },
    casual:    { bg: '#F0FDF4', color: '#15803D', label: 'Casual' },
    fast_food: { bg: '#F8FAFC', color: '#64748B', label: 'Fast Food' },
  }
  const c = cfg[sub_type] || cfg.casual
  return `<span style="display:inline-block;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:700;background:${c.bg};color:${c.color}">${c.label}</span>`
}

function strengthBadgeHTML(strength: string) {
  const cfg: Record<string, { bg: string; color: string; label: string }> = {
    strong: { bg: '#FEF2F2', color: '#DC2626', label: 'Warning Strong' },
    medium: { bg: '#FFFBEB', color: '#B45309', label: '◆ Medium' },
    weak:   { bg: '#F0FDFA', color: '#0F766E', label: 'Check Weak' },
  }
  const c = cfg[strength] || cfg.weak
  return `<span style="display:inline-block;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:700;background:${c.bg};color:${c.color}">${c.label}</span>`
}

function sourceBadgeHTML(source: string) {
  if (source === 'google')      return `<span style="font-size:9px;color:#1A73E8;font-weight:600;background:#EBF3FE;padding:1px 5px;border-radius:3px">G Verified</span>`
  if (source === 'foursquare')  return `<span style="font-size:9px;color:#F94877;font-weight:600;background:#FFF0F4;padding:1px 5px;border-radius:3px">4sq</span>`
  return `<span style="font-size:9px;color:#94A3B8;font-weight:600;background:#F8FAFC;padding:1px 5px;border-radius:3px">OSM</span>`
}

function buildPopupHTML(props: {
  name: string; distance: number; category: string; rating: number;
  isDirect: boolean; tier: string; sub_type: string; tierInsight: string;
  strength?: string; reviewCount?: number; reviewInsight?: string; source?: string;
}) {
  const { name, distance, category, rating, isDirect, sub_type, tierInsight,
          strength, reviewCount, reviewInsight, source } = props
  const typeLabel = sub_type === 'fast_food' ? 'Indirect — fast food' : isDirect ? 'Direct competitor' : 'Indirect competitor'

  const ratingRow = rating > 0
    ? `<div style="display:flex;align-items:center;gap:4px;margin-top:3px">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="#F59E0B" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        <span style="font-size:11px;color:#64748B;font-weight:600">${Number(rating).toFixed(1)}</span>
        ${reviewCount && reviewCount > 0 ? `<span style="font-size:10px;color:#94A3B8">${reviewCount >= 1000 ? (reviewCount/1000).toFixed(1)+'k' : reviewCount} reviews</span>` : ''}
       </div>` : ''

  const insightRow = reviewInsight
    ? `<div style="font-size:10px;color:#64748B;margin-top:4px;font-style:italic;line-height:1.4">${reviewInsight}</div>`
    : tierInsight
    ? `<div style="font-size:10px;color:#64748B;margin-top:4px;line-height:1.4">${tierInsight}</div>`
    : ''

  return `
    <div style="font-family:'DM Sans','Helvetica Neue',sans-serif;min-width:170px;max-width:230px">
      <div style="font-size:13px;font-weight:700;color:#0F172A;margin-bottom:5px;line-height:1.3;white-space:normal">${name}</div>
      <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:5px">
        ${strength ? strengthBadgeHTML(strength) : ''}
        <span style="font-size:10px;color:#94A3B8">${Math.round(distance)}m</span>
        ${source ? sourceBadgeHTML(source) : ''}
      </div>
      <div style="border-top:1px solid #F1F5F9;padding-top:5px;margin-top:2px">
        ${insightRow}
        <div style="font-size:10px;color:#94A3B8;margin-top:3px">${typeLabel} &middot; ${category}</div>
        ${ratingRow}
      </div>
    </div>`
}

// ── Component ─────────────────────────────────────────────────────────────────
// Anchor kind → display colour
const ANCHOR_COLOR: Record<string, string> = {
  supermarket: '#F59E0B',  // amber — daily necessity
  bigbox:      '#8B5CF6',  // violet — destination retail
  qsr:         '#EF4444',  // red — QSR
  pharmacy:    '#10B981',  // emerald — health
  retail:      '#3B82F6',  // blue — general retail
}

function anchorPopupHTML(name: string, footTraffic: string, distance: number) {
  return `
    <div style="font-family:'DM Sans','Helvetica Neue',sans-serif;min-width:150px;max-width:210px">
      <div style="font-size:12px;font-weight:700;color:#0F172A;margin-bottom:4px">${name}</div>
      <div style="font-size:10px;color:#F59E0B;font-weight:700;margin-bottom:5px">Anchor Anchor Tenant</div>
      <div style="font-size:10px;color:#475569;line-height:1.5">${footTraffic}</div>
      <div style="font-size:10px;color:#94A3B8;margin-top:4px">${Math.round(distance)}m away</div>
    </div>`
}

export default function MapboxMap({
  lat, lng, businessType = 'cafe', radius,
  competitorRadiusM = 600,
  catchmentRadiusM  = 1500,
  onFlyEnd, onInsightsUpdate, onCompetitorsUpdate, onAnchorsUpdate,
  showHeatmap = false, showIsochrones = true,
}: MapboxMapProps) {
  const containerRef   = useRef<HTMLDivElement>(null)
  const mapRef         = useRef<any>(null)
  const markerRef      = useRef<any>(null)
  const mapboxRef      = useRef<any>(null)
  const layersAdded    = useRef(false)
  const fetchCtrl      = useRef<AbortController | null>(null)
  const fetchDebounce  = useRef<NodeJS.Timeout | null>(null)
  const isoDebounce    = useRef<NodeJS.Timeout | null>(null)
  const lastFetchPos   = useRef({ lat, lng })
  const currentBizType = useRef(businessType)
  const currentRadius  = useRef(radius)
  const [mapLoaded, setMapLoaded]     = useState(false)
  const [dataLimited, setDataLimited] = useState(false)

  // ── Isochrone fetch ─────────────────────────────────────────────────────────
  const fetchIsochrones = useCallback(async (cLat: number, cLng: number) => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    if (!token || !mapRef.current || !layersAdded.current) return
    try {
      const res = await fetch(
        `https://api.mapbox.com/isochrone/v1/mapbox/driving/${cLng},${cLat}?contours_minutes=5,10&polygons=true&access_token=${token}`
      )
      if (!res.ok) return
      const data = await res.json()
      const features = data.features || []
      const poly10 = features.find((f: any) => f.properties?.contour === 10) || features[0]
      const poly5  = features.find((f: any) => f.properties?.contour === 5)  || features[1]
      mapRef.current?.getSource('iso-10min')?.setData(poly10 || { type: 'FeatureCollection', features: [] })
      mapRef.current?.getSource('iso-5min')?.setData(poly5  || { type: 'FeatureCollection', features: [] })
    } catch { /* silent — isochrone is an enhancement, not core */ }
  }, [])

  const debouncedIsochrones = useCallback((cLat: number, cLng: number) => {
    if (isoDebounce.current) clearTimeout(isoDebounce.current)
    isoDebounce.current = setTimeout(() => fetchIsochrones(cLat, cLng), 700)
  }, [fetchIsochrones])

  // ── Competitors fetch ───────────────────────────────────────────────────────
  const fetchNearby = useCallback(async (cLat: number, cLng: number, type: string) => {
    if (fetchCtrl.current) fetchCtrl.current.abort()
    const ctrl = new AbortController()
    fetchCtrl.current = ctrl
    lastFetchPos.current = { lat: cLat, lng: cLng }

    try {
      // Include radius only when explicitly provided (API has its own defaults per type)
      const r = currentRadius.current
      const radiusParam = r ? `&radius=${r}` : ''
      const res = await fetch(
        `/api/nearby-places?lat=${cLat}&lng=${cLng}&type=${type}${radiusParam}`,
        { signal: ctrl.signal, headers: { ...lzRateLimitHeaders() } },
      )
      if (!res.ok) {
        console.error('[MapboxMap] API error', res.status)
        return
      }
      const data = await res.json()
      console.log(`[MapboxMap] API response: ${data.competitors?.length ?? 0} competitors, ${data.anchors?.length ?? 0} anchors, dataLimited=${data.dataLimited}`)

      const map = mapRef.current
      if (!map || !layersAdded.current) return

      setDataLimited(!!data.dataLimited)

      // Guard: only include features with valid numeric coordinates
      function isValidCoord(lat: any, lng: any) {
        return typeof lat === 'number' && typeof lng === 'number' &&
          !isNaN(lat) && !isNaN(lng) &&
          lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
      }

      // Build GeoJSON features — competitors
      const compFeatures = (data.competitors || [])
        .filter((c: Competitor) => isValidCoord(c.lat, c.lng))
        .map((c: Competitor, idx: number) => ({
          type: 'Feature' as const,
          id: idx,           // ← explicit numeric ID required for feature-state
          geometry: { type: 'Point' as const, coordinates: [c.lng, c.lat] },
          properties: {
            name:          c.name,
            distance:      c.distance,
            category:      c.category,
            rating:        c.rating        ?? 0,
            reviewCount:   c.reviewCount   ?? 0,
            isDirect:      c.isDirect      ?? true,
            tier:          c.tier          ?? 'mid',
            sub_type:      c.sub_type      ?? 'casual',
            tierInsight:   c.tierInsight   ?? '',
            source:        c.source        ?? 'geoapify',
            strength:      c.strength      ?? 'weak',
            strengthScore: c.strengthScore ?? 0,
            reviewInsight: c.reviewInsight ?? '',
          },
        }))

      console.log(`[MapboxMap] Rendering ${compFeatures.length} competitor features on map`)

      const lmFeatures = (data.landmarks || [])
        .filter((l: Landmark) => isValidCoord(l.lat, l.lng))
        .map((l: Landmark) => ({
          type: 'Feature' as const,
          geometry: { type: 'Point' as const, coordinates: [l.lng, l.lat] },
          properties: { name: l.name, kind: l.kind, distance: l.distance },
        }))

      const anchorFeatures = (data.anchors || [])
        .filter((a: Anchor) => isValidCoord(a.lat, a.lng))
        .map((a: Anchor) => ({
          type: 'Feature' as const,
          geometry: { type: 'Point' as const, coordinates: [a.lng, a.lat] },
          properties: {
            name:        a.name,
            kind:        a.kind,
            distance:    a.distance,
            footTraffic: a.footTraffic,
          },
        }))

      map.getSource('competitors')?.setData({ type: 'FeatureCollection', features: compFeatures })
      map.getSource('heatmap-data')?.setData({ type: 'FeatureCollection', features: compFeatures })
      map.getSource('landmarks')?.setData({ type: 'FeatureCollection', features: lmFeatures })
      map.getSource('anchors')?.setData({ type: 'FeatureCollection', features: anchorFeatures })

      if (data.insights)    onInsightsUpdate?.(data.insights)
      if (data.competitors) onCompetitorsUpdate?.(data.competitors)
      if (data.anchors)     onAnchorsUpdate?.(data.anchors)
    } catch (e: any) {
      if (e.name !== 'AbortError') console.error('[MapboxMap] fetch error:', e)
    }
  }, [onInsightsUpdate, onCompetitorsUpdate, onAnchorsUpdate])

  const debouncedFetch = useCallback((cLat: number, cLng: number, type: string) => {
    if (fetchDebounce.current) clearTimeout(fetchDebounce.current)
    fetchDebounce.current = setTimeout(() => fetchNearby(cLat, cLng, type), 300)
  }, [fetchNearby])

  // ── Add all layers (once, after map load) ──────────────────────────────────
  const addAllLayers = useCallback((map: any, cLng: number, cLat: number) => {
    if (layersAdded.current) return
    layersAdded.current = true

    const emptyFC = { type: 'FeatureCollection' as const, features: [] }
    const centerPt = {
      type: 'Feature' as const,
      geometry: { type: 'Point' as const, coordinates: [cLng, cLat] },
      properties: {},
    }

    // ── Isochrone sources ────────────────────────────────────────────────────
    map.addSource('iso-10min', { type: 'geojson', data: emptyFC })
    map.addSource('iso-5min',  { type: 'geojson', data: emptyFC })

    map.addLayer({ id: 'iso-10min-fill',   type: 'fill', source: 'iso-10min', paint: { 'fill-color': ISO_10, 'fill-opacity': 0.05 } })
    map.addLayer({ id: 'iso-10min-border', type: 'line', source: 'iso-10min', paint: { 'line-color': ISO_10, 'line-opacity': 0.28, 'line-width': 1.5, 'line-dasharray': [3, 3] } })
    map.addLayer({ id: 'iso-5min-fill',    type: 'fill', source: 'iso-5min',  paint: { 'fill-color': ISO_5,  'fill-opacity': 0.08 } })
    map.addLayer({ id: 'iso-5min-border',  type: 'line', source: 'iso-5min',  paint: { 'line-color': ISO_5,  'line-opacity': 0.38, 'line-width': 1.5, 'line-dasharray': [4, 2] } })

    // ── Radius rings ─────────────────────────────────────────────────────────
    map.addSource('radius-center', { type: 'geojson', data: centerPt })

    const mpp = (z: number) =>
      (156543.03392 * Math.cos((cLat * Math.PI) / 180)) / Math.pow(2, z)
    const rPx = (m: number) => ['interpolate', ['exponential', 2], ['zoom'], 10, m / mpp(10), 20, m / mpp(20)]

    // Inner ring = competitor density area; outer ring = customer catchment
    map.addLayer({ id: 'r-outer-fill',   type: 'circle', source: 'radius-center', paint: { 'circle-radius': rPx(catchmentRadiusM),  'circle-color': ISO_10, 'circle-opacity': 0.04 } })
    map.addLayer({ id: 'r-outer-border', type: 'circle', source: 'radius-center', paint: { 'circle-radius': rPx(catchmentRadiusM),  'circle-color': 'transparent', 'circle-stroke-width': 1, 'circle-stroke-color': ISO_10, 'circle-stroke-opacity': 0.18 } })
    map.addLayer({ id: 'r-inner-fill',   type: 'circle', source: 'radius-center', paint: { 'circle-radius': rPx(competitorRadiusM), 'circle-color': BRAND, 'circle-opacity': 0.06 } })
    map.addLayer({ id: 'r-inner-border', type: 'circle', source: 'radius-center', paint: { 'circle-radius': rPx(competitorRadiusM), 'circle-color': 'transparent', 'circle-stroke-width': 1.5, 'circle-stroke-color': BRAND, 'circle-stroke-opacity': 0.30 } })

    // Radius text labels
    const addLabel = (id: string, coord: [number, number], text: string, color: string, minZoom = 12) => {
      map.addSource(id, {
        type: 'geojson',
        data: { type: 'Feature', geometry: { type: 'Point', coordinates: coord }, properties: { label: text } },
      })
      map.addLayer({ id: `${id}-txt`, type: 'symbol', source: id, minzoom: minZoom,
        layout: { 'text-field': ['get', 'label'], 'text-size': 10, 'text-font': ['DIN Pro Medium', 'Arial Unicode MS Regular'], 'text-allow-overlap': true },
        paint: { 'text-color': color, 'text-halo-color': '#fff', 'text-halo-width': 1.5, 'text-opacity': 0.75 },
      })
    }

    // Format radius label: show in km if >= 1000m
    const fmtRadius = (m: number) => m >= 1000 ? `${(m / 1000).toFixed(1).replace(/\.0$/, '')}km` : `${m}m`
    // lat offset per metre ≈ 1/111320; use half for inner to avoid label overlap
    const innerLatOffset = competitorRadiusM / 111320
    const outerLatOffset = catchmentRadiusM  / 111320
    addLabel('lbl-inner', [cLng, cLat + innerLatOffset], `${fmtRadius(competitorRadiusM)} competitor area`,  BRAND, 13)
    addLabel('lbl-outer', [cLng, cLat + outerLatOffset], `${fmtRadius(catchmentRadiusM)} catchment`,         ISO_10, 12)

    // ── Heatmap ──────────────────────────────────────────────────────────────
    map.addSource('heatmap-data', { type: 'geojson', data: emptyFC })
    map.addLayer({
      id: 'competitor-heatmap', type: 'heatmap', source: 'heatmap-data', maxzoom: 18,
      paint: {
        'heatmap-weight': 1,
        'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 10, 1, 15, 3],
        'heatmap-radius':    ['interpolate', ['linear'], ['zoom'], 10, 22, 15, 38],
        'heatmap-color': [
          'interpolate', ['linear'], ['heatmap-density'],
          0,   'rgba(0,0,0,0)',
          0.2, 'rgba(15,118,110,0.15)',
          0.4, 'rgba(15,118,110,0.30)',
          0.6, 'rgba(217,119,6,0.40)',
          0.8, 'rgba(220,38,38,0.45)',
          1,   'rgba(185,28,28,0.60)',
        ],
        'heatmap-opacity': 0,
      },
    })

    // ── Competitor source — generateId: true is REQUIRED for feature-state ───
    map.addSource('competitors', {
      type: 'geojson',
      data: emptyFC,
      cluster: true,
      clusterMaxZoom: 15,    // clusters break apart above zoom 15
      clusterRadius:  40,
      generateId: true,      // ← FIX: assigns stable numeric IDs to every feature
    })

    // Cluster circles (colour = density indicator)
    map.addLayer({
      id: 'comp-clusters', type: 'circle', source: 'competitors',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': ['step', ['get', 'point_count'], SLATE_600, 5, AMBER, 10, RED],
        'circle-radius': ['step', ['get', 'point_count'], 15, 5, 20, 10, 26],
        'circle-stroke-width': 2.5,
        'circle-stroke-color': '#fff',
        'circle-opacity': 0.92,
      },
    })
    map.addLayer({
      id: 'comp-cluster-count', type: 'symbol', source: 'competitors',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': ['get', 'point_count_abbreviated'],
        'text-font':  ['DIN Pro Bold', 'Arial Unicode MS Bold'],
        'text-size':  12, 'text-allow-overlap': true,
      },
      paint: { 'text-color': '#fff' },
    })

    // Individual competitor dots — colour by strength (competitive threat level)
    // RED = strong (high threat), AMBER = medium, TEAL = weak (manageable)
    map.addLayer({
      id: 'comp-points', type: 'circle', source: 'competitors',
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-color': [
          'case',
          ['boolean', ['feature-state', 'hover'], false], BRAND_LIGHT,
          ['==', ['get', 'strength'], 'strong'], STRENGTH_COLOR.strong,
          ['==', ['get', 'strength'], 'medium'], STRENGTH_COLOR.medium,
          STRENGTH_COLOR.weak,
        ],
        'circle-radius': [
          'case',
          ['==', ['get', 'strength'], 'strong'], ['case', ['boolean', ['feature-state', 'hover'], false], 11, 9],
          ['==', ['get', 'strength'], 'medium'], ['case', ['boolean', ['feature-state', 'hover'], false], 9,  8],
          ['case', ['boolean', ['feature-state', 'hover'], false], 8, 6],
        ],
        'circle-stroke-width': 2,
        'circle-stroke-color': '#fff',
        'circle-opacity': [
          'case',
          ['==', ['get', 'sub_type'], 'fast_food'], 0.50,  // fast food faded — indirect
          ['==', ['get', 'strength'], 'strong'],    0.95,
          ['==', ['get', 'strength'], 'medium'],    0.85,
          0.70,
        ],
      },
    })

    // ── Landmark markers ─────────────────────────────────────────────────────
    map.addSource('landmarks', { type: 'geojson', data: emptyFC })
    map.addLayer({
      id: 'landmark-points', type: 'circle', source: 'landmarks', minzoom: 13,
      paint: {
        'circle-color': ['match', ['get', 'kind'], 'transport', '#3B82F6', 'school', '#8B5CF6', 'mall', '#F59E0B', 'park', '#22C55E', '#94A3B8'],
        'circle-radius': 4, 'circle-stroke-width': 1.5, 'circle-stroke-color': '#fff', 'circle-opacity': 0.7,
      },
    })
    map.addLayer({
      id: 'landmark-labels', type: 'symbol', source: 'landmarks', minzoom: 14,
      layout: { 'text-field': ['get', 'name'], 'text-size': 9, 'text-font': ['DIN Pro Medium', 'Arial Unicode MS Regular'], 'text-offset': [0, 1.2], 'text-max-width': 8, 'text-allow-overlap': false },
      paint: { 'text-color': '#64748B', 'text-halo-color': '#fff', 'text-halo-width': 1, 'text-opacity': 0.8 },
    })

    // ── Anchor tenant markers ─────────────────────────────────────────────
    map.addSource('anchors', { type: 'geojson', data: emptyFC })
    map.addLayer({
      id: 'anchor-points', type: 'circle', source: 'anchors',
      paint: {
        'circle-color': [
          'match', ['get', 'kind'],
          'supermarket', ANCHOR_COLOR.supermarket,
          'bigbox',      ANCHOR_COLOR.bigbox,
          'qsr',         ANCHOR_COLOR.qsr,
          'pharmacy',    ANCHOR_COLOR.pharmacy,
          ANCHOR_COLOR.retail,
        ],
        'circle-radius': 9,
        'circle-stroke-width': 2.5,
        'circle-stroke-color': '#fff',
        'circle-opacity': 0.90,
      },
    })
    map.addLayer({
      id: 'anchor-labels', type: 'symbol', source: 'anchors', minzoom: 13,
      layout: {
        'text-field': ['get', 'name'],
        'text-size': 9,
        'text-font': ['DIN Pro Bold', 'Arial Unicode MS Bold'],
        'text-offset': [0, 1.5],
        'text-max-width': 10,
        'text-allow-overlap': false,
      },
      paint: { 'text-color': '#44403C', 'text-halo-color': '#fff', 'text-halo-width': 1.5, 'text-opacity': 0.9 },
    })

    // ── Popup & hover interactions ────────────────────────────────────────────
    const popup = new mapboxRef.current.Popup({
      closeButton: false, closeOnClick: false, offset: 12, maxWidth: '260px',
      className: 'locatalyze-popup',
    })

    let hoveredId: number | null = null

    const clearHover = () => {
      if (hoveredId !== null) {
        try { map.setFeatureState({ source: 'competitors', id: hoveredId }, { hover: false }) } catch {}
        hoveredId = null
      }
    }

    map.on('mouseenter', 'comp-points', (e: any) => {
      map.getCanvas().style.cursor = 'pointer'
      const f = e.features?.[0]
      if (!f) return
      clearHover()
      hoveredId = typeof f.id === 'number' ? f.id : null
      if (hoveredId !== null) map.setFeatureState({ source: 'competitors', id: hoveredId }, { hover: true })

      const p = f.properties || {}
      popup
        .setLngLat(f.geometry.coordinates.slice())
        .setHTML(buildPopupHTML({
          name:          p.name          || 'Unknown',
          distance:      Number(p.distance || 0),
          category:      p.category      || '',
          rating:        Number(p.rating  || 0),
          reviewCount:   Number(p.reviewCount || 0),
          isDirect:      p.isDirect      !== false,
          tier:          p.tier          || 'mid',
          sub_type:      p.sub_type      || 'casual',
          tierInsight:   p.tierInsight   || '',
          strength:      p.strength      || 'weak',
          reviewInsight: p.reviewInsight || '',
          source:        p.source        || 'geoapify',
        }))
        .addTo(map)
    })

    map.on('mouseleave', 'comp-points', () => {
      map.getCanvas().style.cursor = ''
      clearHover()
      popup.remove()
    })

    // Landmark tooltip
    map.on('mouseenter', 'landmark-points', (e: any) => {
      map.getCanvas().style.cursor = 'pointer'
      const f = e.features?.[0]
      if (!f) return
      popup
        .setLngLat(f.geometry.coordinates.slice())
        .setHTML(`<div style="font-family:'DM Sans',sans-serif;font-size:12px"><strong style="color:#0F172A">${f.properties.name}</strong><br><span style="color:#64748B;font-size:11px">${f.properties.kind} &middot; ${Math.round(f.properties.distance)}m</span></div>`)
        .addTo(map)
    })
    map.on('mouseleave', 'landmark-points', () => {
      map.getCanvas().style.cursor = ''
      popup.remove()
    })

    // Anchor tooltip
    map.on('mouseenter', 'anchor-points', (e: any) => {
      map.getCanvas().style.cursor = 'pointer'
      const f = e.features?.[0]
      if (!f) return
      const p = f.properties || {}
      popup
        .setLngLat(f.geometry.coordinates.slice())
        .setHTML(anchorPopupHTML(p.name || 'Anchor', p.footTraffic || '', Number(p.distance || 0)))
        .addTo(map)
    })
    map.on('mouseleave', 'anchor-points', () => {
      map.getCanvas().style.cursor = ''
      popup.remove()
    })

    // Click cluster → zoom to expand
    map.on('click', 'comp-clusters', (e: any) => {
      const features = map.queryRenderedFeatures(e.point, { layers: ['comp-clusters'] })
      if (!features.length) return
      const clusterId = features[0].properties.cluster_id
      ;(map.getSource('competitors') as any).getClusterExpansionZoom(
        clusterId,
        (err: any, zoom: number) => {
          if (err) return
          map.easeTo({ center: features[0].geometry.coordinates, zoom: zoom + 0.5, duration: 420 })
        }
      )
    })
    map.on('mouseenter', 'comp-clusters', () => { map.getCanvas().style.cursor = 'pointer' })
    map.on('mouseleave', 'comp-clusters', () => { map.getCanvas().style.cursor = '' })

    // Inject popup CSS once
    if (!document.getElementById('locatalyze-popup-css')) {
      const s = document.createElement('style')
      s.id = 'locatalyze-popup-css'
      s.textContent = `
        .locatalyze-popup .mapboxgl-popup-content {
          border-radius:12px!important;padding:12px 14px!important;
          box-shadow:0 6px 24px rgba(0,0,0,0.12),0 1px 4px rgba(0,0,0,0.06)!important;
          border:1px solid #F1F5F9!important;
          font-family:'DM Sans','Helvetica Neue',sans-serif!important;
        }
        .locatalyze-popup .mapboxgl-popup-tip{border-top-color:#fff!important;}
      `
      document.head.appendChild(s)
    }
  }, [])

  // ── Move-center helper (radii + labels) ────────────────────────────────────
  const updateCenter = useCallback((cLng: number, cLat: number) => {
    const map = mapRef.current
    if (!map || !layersAdded.current) return
    const pt = { type: 'Feature', geometry: { type: 'Point', coordinates: [cLng, cLat] }, properties: {} }
    map.getSource('radius-center')?.setData(pt)
    map.getSource('lbl-500m')?.setData({ type: 'Feature', geometry: { type: 'Point', coordinates: [cLng, cLat + 0.0045] }, properties: { label: '500m' } })
    map.getSource('lbl-1km')?.setData( { type: 'Feature', geometry: { type: 'Point', coordinates: [cLng, cLat + 0.009]  }, properties: { label: '1km'  } })
  }, [])

  // ── Mount / lat-lng change ─────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    if (!token) return

    currentBizType.current = businessType

    import('mapbox-gl').then((mapboxgl) => {
      if (!document.querySelector('link[href*="mapbox-gl"]')) {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.2.0/mapbox-gl.css'
        document.head.appendChild(link)
      }

      mapboxgl.default.accessToken = token
      mapboxRef.current = mapboxgl.default

      if (!mapRef.current) {
        // ── First mount ──────────────────────────────────────────────────────
        const map = new mapboxgl.default.Map({
          container: containerRef.current!,
          style: 'mapbox://styles/mapbox/light-v11',
          center: [lng, lat],
          zoom: 14.5,
          attributionControl: false,
          pitch: 0, bearing: 0,
        })

        map.addControl(new mapboxgl.default.NavigationControl({ showCompass: false }), 'bottom-right')
        map.addControl(new mapboxgl.default.ScaleControl({ unit: 'metric' }), 'bottom-left')

        // Draggable "You are here" pin
        const marker = new mapboxgl.default.Marker({ color: BRAND, draggable: true })
          .setLngLat([lng, lat])
          .addTo(map)

        marker.on('dragend', () => {
          const pos = marker.getLngLat()
          updateCenter(pos.lng, pos.lat)
          debouncedFetch(pos.lat, pos.lng, currentBizType.current)
          debouncedIsochrones(pos.lat, pos.lng)
        })

        mapRef.current  = map
        markerRef.current = marker

        map.on('load', () => {
          setMapLoaded(true)
          // Clean up noisy base-map layers for a more minimal SaaS look
          try { map.setLayoutProperty('poi-label', 'visibility', 'none') } catch {}

          addAllLayers(map, lng, lat)
          debouncedFetch(lat, lng, businessType)
          if (showIsochrones) debouncedIsochrones(lat, lng)
        })

        // Pan → update competitors when center shifts by >300m
        map.on('moveend', () => {
          const c    = map.getCenter()
          const dist = haversineMeters(lastFetchPos.current.lat, lastFetchPos.current.lng, c.lat, c.lng)
          if (dist > 300) {
            updateCenter(c.lng, c.lat)
            debouncedFetch(c.lat, c.lng, currentBizType.current)
            if (showIsochrones) debouncedIsochrones(c.lat, c.lng)
          }
        })
      } else {
        // ── Subsequent lat/lng prop changes (address change) ─────────────────
        mapRef.current.flyTo({ center: [lng, lat], zoom: 14.5, duration: 1100, essential: true })
        markerRef.current?.setLngLat([lng, lat])
        updateCenter(lng, lat)
        debouncedFetch(lat, lng, businessType)
        if (showIsochrones) debouncedIsochrones(lat, lng)
        onFlyEnd?.()
      }
    })

    return () => {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng])

  // ── Business type change → re-fetch ───────────────────────────────────────
  useEffect(() => {
    currentBizType.current = businessType
    if (!mapLoaded) return
    debouncedFetch(lat, lng, businessType)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessType, mapLoaded])

  // ── Radius change → re-fetch immediately ─────────────────────────────────
  useEffect(() => {
    currentRadius.current = radius
    if (!mapLoaded) return
    debouncedFetch(lat, lng, currentBizType.current)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [radius, mapLoaded])

  // ── Heatmap visibility ────────────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current
    if (!map || !layersAdded.current) return
    try { map.setPaintProperty('competitor-heatmap', 'heatmap-opacity', showHeatmap ? 0.65 : 0) } catch {}
  }, [showHeatmap, mapLoaded])

  // ── Isochrone visibility ──────────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current
    if (!map || !layersAdded.current) return
    const vis = showIsochrones ? 'visible' : 'none'
    ;['iso-5min-fill', 'iso-5min-border', 'iso-10min-fill', 'iso-10min-border'].forEach(id => {
      try { map.setLayoutProperty(id, 'visibility', vis) } catch {}
    })
  }, [showIsochrones, mapLoaded])

  // ── Cleanup ───────────────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      fetchCtrl.current?.abort()
      if (fetchDebounce.current) clearTimeout(fetchDebounce.current)
      if (isoDebounce.current)   clearTimeout(isoDebounce.current)
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        markerRef.current = null
        layersAdded.current = false
      }
    }
  }, [])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: 'inherit' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%', borderRadius: 'inherit' }} />
      {/* Data-limited badge */}
      {dataLimited && (
        <div style={{
          position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(255,251,235,0.95)', border: '1px solid #FDE68A',
          borderRadius: 20, padding: '5px 14px',
          fontSize: 11, fontWeight: 600, color: '#92400E',
          fontFamily: "'DM Sans',sans-serif",
          backdropFilter: 'blur(8px)',
          pointerEvents: 'none', zIndex: 5,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          Data may be limited in this area
        </div>
      )}
    </div>
  )
}
