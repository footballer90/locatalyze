/**
 * Single source of truth for Sydney hub marketing pages: same composite / verdict
 * as `getSydneySuburbs()` and the factor directory.
 */
import type { SuburbModel } from './sydney'
import { getSydneySuburbs } from './sydney'

const BY_SLUG: ReadonlyMap<string, SuburbModel> = new Map(
  getSydneySuburbs().map((s) => [s.slug, s]),
)

export function sydneyModelForSlug(slug: string): SuburbModel | undefined {
  return BY_SLUG.get(slug)
}

export function sydneyComposite(slug: string): number {
  return BY_SLUG.get(slug)?.compositeScore ?? 0
}

export function sydneyForStaticPage(slug: string): SuburbModel {
  const m = BY_SLUG.get(slug)
  if (!m) {
    throw new Error(`[sydney-hub-scores] Missing suburb model for slug "${slug}"`)
  }
  return m
}
