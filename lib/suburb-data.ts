// lib/suburb-data.ts — thin wrapper, data served from public/data/suburbs.json
import _data from '../public/data/suburbs.json'

const d = _data as any
export const SUBURB_SLUGS: string[] = d.SUBURB_SLUGS
export const SUBURBS: any[] = d.SUBURBS

export function getSuburb(slug: string) { return SUBURBS.find((s: any) => s.slug === slug) ?? null }
export function getSuburbsByCity(city: string) { return SUBURBS.filter((s: any) => s.citySlug === city) }
export function getSuburbScore(suburb: any): number {
  if (!suburb?.businessTypes) return 0
  const scores = Object.values(suburb.businessTypes).map((b: any) => b.demandScore ?? 0)
  return scores.length ? Math.round((scores as number[]).reduce((a, b) => a + b, 0) / scores.length) : 0
}
