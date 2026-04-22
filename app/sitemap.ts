import { MetadataRoute } from 'next'
import { getCanberraSuburbSlugs } from '@/lib/analyse-data/canberra'
import { getHobartSuburbSlugs } from '@/lib/analyse-data/hobart'
import { getDarwinHubSlugs } from '@/lib/analyse-data/darwin-hubs'
import { getBallaratSuburbSlugs } from '@/lib/analyse-data/ballarat'
import { getBendigoSuburbSlugs } from '@/lib/analyse-data/bendigo'
import { getCairnsSuburbSlugs } from '@/lib/analyse-data/cairns'
import { getTownsvilleSuburbSlugs } from '@/lib/analyse-data/townsville'
import { getToowoombaSuburbSlugs } from '@/lib/analyse-data/toowoomba'
import { getBundabergSuburbSlugs } from '@/lib/analyse-data/bundaberg'
import { getIpswichSuburbSlugs } from '@/lib/analyse-data/ipswich'
import { getLauncestonSuburbSlugs } from '@/lib/analyse-data/launceston'
import { getGeelongSuburbSlugs } from '@/lib/analyse-data/geelong'
import { getSunshineCoastSuburbSlugs } from '@/lib/analyse-data/sunshine-coast'
import { getHerveyBaySuburbSlugs } from '@/lib/analyse-data/hervey-bay'
import { getMackaySuburbSlugs } from '@/lib/analyse-data/mackay'
import { getRockhamptonSuburbSlugs } from '@/lib/analyse-data/rockhampton'
import { getAllSuburbKeys } from '@/lib/analyse-data/suburbs'
import { INSIGHTS } from '@/lib/insights-posts'

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.locatalyze.com'
const NOW = new Date()

function u(path: string, priority = 0.6, freq: MetadataRoute.Sitemap[number]['changeFrequency'] = 'monthly') {
  return { url: `${BASE}${path}`, lastModified: NOW, changeFrequency: freq, priority }
}

function suburbUrls(citySlug: string, slugs: string[], priority = 0.65): MetadataRoute.Sitemap {
  return slugs.map((s) => u(`/analyse/${citySlug}/${s}`, priority))
}

export default function sitemap(): MetadataRoute.Sitemap {
  // ── Dynamic suburb slugs ────────────────────────────────────────────────────
  const dynamicSuburbs = getAllSuburbKeys().map(({ citySlug, suburbSlug }) =>
    u(`/analyse/${citySlug}/${suburbSlug}`, 0.65)
  )

  return [
    // ── Core pages ─────────────────────────────────────────────────────────────
    u('/', 1, 'weekly'),
    u('/sample-report', 0.8, 'monthly'),
    u('/methodology', 0.7, 'monthly'),
    u('/about', 0.6, 'monthly'),
    u('/contact', 0.5, 'monthly'),
    u('/changelog', 0.5, 'weekly'),
    u('/help', 0.5, 'monthly'),

    // ── Free tools ──────────────────────────────────────────────────────────────
    u('/tools', 0.85, 'weekly'),
    u('/tools/business-viability-checker', 0.95, 'weekly'),
    u('/tools/break-even-foot-traffic', 0.85, 'weekly'),
    u('/tools/rent-overpriced-checker', 0.85, 'weekly'),
    u('/tools/lease-term-calculator', 0.85, 'weekly'),
    u('/tools/checklist', 0.80, 'weekly'),

    // ── Analyse hub ─────────────────────────────────────────────────────────────
    u('/analyse', 0.9, 'weekly'),

    // ── Major city hubs ─────────────────────────────────────────────────────────
    u('/analyse/sydney', 0.85, 'weekly'),
    u('/analyse/melbourne', 0.85, 'weekly'),
    u('/analyse/brisbane', 0.85, 'weekly'),
    u('/analyse/perth', 0.85, 'weekly'),
    u('/analyse/adelaide', 0.80, 'weekly'),
    u('/analyse/canberra', 0.80, 'weekly'),
    u('/analyse/hobart', 0.75, 'weekly'),
    u('/analyse/darwin', 0.70, 'weekly'),
    u('/analyse/gold-coast', 0.75, 'weekly'),
    u('/analyse/newcastle', 0.75, 'weekly'),
    u('/analyse/wollongong', 0.70, 'weekly'),
    u('/analyse/geelong', 0.65, 'weekly'),
    u('/analyse/sunshine-coast', 0.65, 'weekly'),

    // ── Regional city hubs ──────────────────────────────────────────────────────
    u('/analyse/ballarat', 0.65, 'monthly'),
    u('/analyse/bendigo', 0.65, 'monthly'),
    u('/analyse/cairns', 0.65, 'monthly'),
    u('/analyse/townsville', 0.65, 'monthly'),
    u('/analyse/toowoomba', 0.65, 'monthly'),
    u('/analyse/bundaberg', 0.60, 'monthly'),
    u('/analyse/ipswich', 0.60, 'monthly'),
    u('/analyse/launceston', 0.65, 'monthly'),
    u('/analyse/hervey-bay', 0.60, 'monthly'),
    u('/analyse/mackay', 0.60, 'monthly'),
    u('/analyse/rockhampton', 0.60, 'monthly'),

    // ── Sydney suburb + business-type pages ─────────────────────────────────────
    u('/analyse/sydney/surry-hills', 0.80),
    u('/analyse/sydney/newtown', 0.80),
    u('/analyse/sydney/bondi', 0.80),
    u('/analyse/sydney/bondi-junction', 0.75),
    u('/analyse/sydney/marrickville', 0.75),
    u('/analyse/sydney/chatswood', 0.75),
    u('/analyse/sydney/parramatta', 0.80),
    u('/analyse/sydney/north-sydney', 0.75),
    u('/analyse/sydney/sydney-cbd', 0.80),
    u('/analyse/sydney/blacktown', 0.70),
    u('/analyse/sydney/penrith', 0.70),
    u('/analyse/sydney/liverpool', 0.70),
    u('/analyse/sydney/campbelltown', 0.65),
    u('/analyse/sydney/bankstown', 0.70),
    u('/analyse/sydney/burwood', 0.65),
    u('/analyse/sydney/ryde', 0.65),
    u('/analyse/sydney/hornsby', 0.65),
    u('/analyse/sydney/auburn', 0.65),
    u('/analyse/sydney/fairfield', 0.65),
    u('/analyse/sydney/lakemba', 0.65),
    u('/analyse/sydney/merrylands', 0.65),
    u('/analyse/sydney/granville', 0.60),
    u('/analyse/sydney/mount-druitt', 0.60),
    u('/analyse/sydney/alexandria', 0.70),
    u('/analyse/sydney/ultimo', 0.65),
    u('/analyse/sydney/cafe', 0.75),
    u('/analyse/sydney/restaurant', 0.75),
    u('/analyse/sydney/retail', 0.75),
    u('/analyse/sydney/gym', 0.70),
    u('/analyse/sydney/bakery', 0.70),
    u('/analyse/sydney/salon', 0.65),

    // ── Melbourne suburb + business-type pages ───────────────────────────────────
    u('/analyse/melbourne/melbourne-cbd', 0.80),
    u('/analyse/melbourne/fitzroy', 0.80),
    u('/analyse/melbourne/collingwood', 0.80),
    u('/analyse/melbourne/brunswick', 0.80),
    u('/analyse/melbourne/richmond', 0.75),
    u('/analyse/melbourne/south-yarra', 0.75),
    u('/analyse/melbourne/st-kilda', 0.75),
    u('/analyse/melbourne/carlton', 0.75),
    u('/analyse/melbourne/northcote', 0.70),
    u('/analyse/melbourne/footscray', 0.70),
    u('/analyse/melbourne/dandenong', 0.65),
    u('/analyse/melbourne/frankston', 0.65),
    u('/analyse/melbourne/cafe', 0.75),
    u('/analyse/melbourne/restaurant', 0.80),

    // ── Brisbane suburb pages ────────────────────────────────────────────────────
    u('/analyse/brisbane/brisbane-cbd', 0.80),
    u('/analyse/brisbane/new-farm', 0.75),
    u('/analyse/brisbane/west-end', 0.75),
    u('/analyse/brisbane/paddington', 0.75),
    u('/analyse/brisbane/fortitude-valley', 0.75),
    u('/analyse/brisbane/south-brisbane', 0.70),
    u('/analyse/brisbane/chermside', 0.65),
    u('/analyse/brisbane/indooroopilly', 0.65),
    u('/analyse/brisbane/carindale', 0.60),
    u('/analyse/brisbane/cafe', 0.70),

    // ── Perth pages ──────────────────────────────────────────────────────────────
    u('/analyse/perth/perth-cbd', 0.80),
    u('/analyse/perth/cafe', 0.70),
    u('/analyse/perth/restaurant', 0.75),

    // ── Canberra suburb pages (engine-derived, static) ───────────────────────────
    ...suburbUrls('canberra', getCanberraSuburbSlugs(), 0.70),

    // ── Hobart suburb pages ──────────────────────────────────────────────────────
    ...suburbUrls('hobart', getHobartSuburbSlugs(), 0.65),
    u('/analyse/hobart/cafe', 0.60),

    // ── Darwin hub pages ─────────────────────────────────────────────────────────
    ...suburbUrls('darwin', getDarwinHubSlugs(), 0.60),
    u('/analyse/darwin/retail', 0.55),

    // ── Wollongong + Newcastle suburb pages ──────────────────────────────────────
    u('/analyse/wollongong/restaurant', 0.60),
    u('/analyse/newcastle/bakery', 0.60),

    // ── Gold Coast pages ─────────────────────────────────────────────────────────
    u('/analyse/gold-coast/gym', 0.65),

    // ── Regional city suburb pages ───────────────────────────────────────────────
    ...suburbUrls('ballarat', getBallaratSuburbSlugs(), 0.60),
    ...suburbUrls('bendigo', getBendigoSuburbSlugs(), 0.60),
    ...suburbUrls('cairns', getCairnsSuburbSlugs(), 0.60),
    ...suburbUrls('townsville', getTownsvilleSuburbSlugs(), 0.58),
    ...suburbUrls('toowoomba', getToowoombaSuburbSlugs(), 0.58),
    ...suburbUrls('bundaberg', getBundabergSuburbSlugs(), 0.55),
    ...suburbUrls('ipswich', getIpswichSuburbSlugs(), 0.55),
    ...suburbUrls('launceston', getLauncestonSuburbSlugs(), 0.58),
    ...suburbUrls('geelong', getGeelongSuburbSlugs(), 0.60),
    ...suburbUrls('sunshine-coast', getSunshineCoastSuburbSlugs(), 0.62),
    ...suburbUrls('hervey-bay', getHerveyBaySuburbSlugs(), 0.55),
    ...suburbUrls('mackay', getMackaySuburbSlugs(), 0.55),
    ...suburbUrls('rockhampton', getRockhamptonSuburbSlugs(), 0.55),

    // ── Dynamic city/suburb pages from suburbs.ts ────────────────────────────────
    ...dynamicSuburbs,

    // ── Use case pages ───────────────────────────────────────────────────────────
    u('/use-case/cafes', 0.70),
    u('/use-case/restaurants', 0.70),
    u('/use-case/gyms', 0.65),
    u('/use-case/retail', 0.65),
    u('/use-case/bakeries', 0.65),
    u('/use-case/takeaway', 0.65),
    u('/use-case/all', 0.60),

    // ── Blog & insights ──────────────────────────────────────────────────────────
    u('/blog', 0.75, 'weekly'),
    u('/insights', 0.75, 'weekly'),
    ...Object.keys(INSIGHTS).map((slug) => u(`/insights/${slug}`, 0.7, 'monthly')),
    u('/suburb', 0.70, 'weekly'),

    // ── Legal ────────────────────────────────────────────────────────────────────
    u('/privacy', 0.20, 'yearly'),
    u('/terms', 0.20, 'yearly'),
    u('/disclaimer', 0.20, 'yearly'),
    u('/refund', 0.20, 'yearly'),
  ]
}
