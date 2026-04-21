/**
 * `/analyse/{city}/{slug}` static industry hub pages must not also appear as
 * `[city]/[suburb]` SSG paths — duplicate static params can cause the wrong
 * segment to resolve on some hosts (404 on the real hub).
 */
const STATIC_INDUSTRY_HUB_KEYS = new Set<string>([
  'adelaide/restaurant',
  'ballarat/cafe',
  'bendigo/cafe',
  'bendigo/restaurant',
  'brisbane/cafe',
  'bundaberg/cafe',
  'cairns/cafe',
  'geelong/cafe',
  'hervey-bay/restaurant',
  'hobart/cafe',
  'launceston/cafe',
  'mackay/retail',
  'melbourne/cafe',
  'melbourne/restaurant',
  'perth/cafe',
  'perth/restaurant',
  'rockhampton/cafe',
  'sunshine-coast/cafe',
  'sunshine-coast/restaurant',
  'sydney/bakery',
  'sydney/cafe',
  'sydney/gym',
  'sydney/restaurant',
  'sydney/retail',
  'sydney/salon',
  'toowoomba/cafe',
  'townsville/gym',
  'wollongong/restaurant',
])

export function isStaticIndustryHub(citySlug: string, suburbSlug: string): boolean {
  return STATIC_INDUSTRY_HUB_KEYS.has(`${citySlug}/${suburbSlug}`)
}
