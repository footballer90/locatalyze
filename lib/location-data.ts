// lib/location-data.ts — thin wrapper, data served from public/data/location.json
import _data from '../public/data/location.json'

const d = _data as any
export const CITY_SLUGS: string[] = d.CITY_SLUGS
export const TYPE_SLUGS: string[] = d.TYPE_SLUGS
export const CITIES: any[] = d.CITIES
export const BUSINESS_TYPES: any[] = d.BUSINESS_TYPES

export function getCityTypeInsight(citySlug: string, typeSlug: string) {
  const city = CITIES.find((c: any) => c.slug === citySlug)
  return city?.insights?.find((i: any) => i.typeSlug === typeSlug) ?? null
}
export function getCity(slug: string) { return CITIES.find((c: any) => c.slug === slug) ?? null }
export function getType(slug: string) { return BUSINESS_TYPES.find((t: any) => t.slug === slug) ?? null }
export function getScoreColor(score: number): string {
  if (score >= 70) return '#059669'
  if (score >= 40) return '#D97706'
  return '#DC2626'
}
export function getVerdictColor(v: string): string {
  if (v === 'go') return '#059669'
  if (v === 'caution') return '#D97706'
  return '#DC2626'
}
