import { MetadataRoute } from 'next'

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://locatalyze.com'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // ── Core pages ─────────────────────────────────────────────────────────────
    { url: BASE,                              lastModified: new Date(), changeFrequency: 'weekly',  priority: 1   },
    { url: `${BASE}/sample-report`,           lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/methodology`,             lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/about`,                   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/contact`,                 lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/changelog`,               lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.5 },
    { url: `${BASE}/help`,                    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },

    // ── Analyse hub pages ───────────────────────────────────────────────────────
    { url: `${BASE}/analyse`,                 lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/analyse/sydney`,          lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.85 },
    { url: `${BASE}/analyse/melbourne`,       lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.85 },
    { url: `${BASE}/analyse/brisbane`,        lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.85 },
    { url: `${BASE}/analyse/perth`,           lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.85 },
    { url: `${BASE}/analyse/adelaide`,        lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.80 },
    { url: `${BASE}/analyse/canberra`,        lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.75 },
    { url: `${BASE}/analyse/hobart`,          lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.70 },
    { url: `${BASE}/analyse/darwin`,          lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.65 },

    // ── Sydney suburb pages ─────────────────────────────────────────────────────
    { url: `${BASE}/analyse/sydney/surry-hills`,   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/analyse/sydney/newtown`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/analyse/sydney/bondi`,          lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/analyse/sydney/bondi-junction`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE}/analyse/sydney/marrickville`,   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE}/analyse/sydney/chatswood`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE}/analyse/sydney/parramatta`,     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE}/analyse/sydney/north-sydney`,   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE}/analyse/sydney/sydney-cbd`,     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.80 },
    { url: `${BASE}/analyse/sydney/blacktown`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.70 },
    { url: `${BASE}/analyse/sydney/penrith`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.70 },
    { url: `${BASE}/analyse/sydney/liverpool`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.70 },
    { url: `${BASE}/analyse/sydney/campbelltown`,   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${BASE}/analyse/sydney/bankstown`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.70 },
    { url: `${BASE}/analyse/sydney/strathfield`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${BASE}/analyse/sydney/burwood`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${BASE}/analyse/sydney/ryde`,           lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${BASE}/analyse/sydney/hornsby`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${BASE}/analyse/sydney/auburn`,         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${BASE}/analyse/sydney/fairfield`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${BASE}/analyse/sydney/lakemba`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${BASE}/analyse/sydney/merrylands`,     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${BASE}/analyse/sydney/granville`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.60 },
    { url: `${BASE}/analyse/sydney/mount-druitt`,   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.60 },
    { url: `${BASE}/analyse/sydney/alexandria`,     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.70 },
    { url: `${BASE}/analyse/sydney/ultimo`,         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },

    // ── Sydney business-type pages ──────────────────────────────────────────────
    { url: `${BASE}/analyse/sydney/cafe`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE}/analyse/sydney/restaurant`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE}/analyse/sydney/retail`,     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE}/analyse/sydney/gym`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.70 },
    { url: `${BASE}/analyse/sydney/bakery`,     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.70 },
    { url: `${BASE}/analyse/sydney/salon`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },

    // ── Melbourne suburb pages ──────────────────────────────────────────────────
    { url: `${BASE}/analyse/melbourne/melbourne-cbd`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.80 },
    { url: `${BASE}/analyse/melbourne/fitzroy`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.80 },
    { url: `${BASE}/analyse/melbourne/collingwood`,   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.80 },
    { url: `${BASE}/analyse/melbourne/brunswick`,     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.80 },
    { url: `${BASE}/analyse/melbourne/richmond`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE}/analyse/melbourne/south-yarra`,   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE}/analyse/melbourne/st-kilda`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE}/analyse/melbourne/carlton`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE}/analyse/melbourne/northcote`,     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.70 },
    { url: `${BASE}/analyse/melbourne/footscray`,     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.70 },
    { url: `${BASE}/analyse/melbourne/dandenong`,     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${BASE}/analyse/melbourne/frankston`,     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${BASE}/analyse/melbourne/cranbourne`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.60 },
    { url: `${BASE}/analyse/melbourne/pakenham`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.60 },
    { url: `${BASE}/analyse/melbourne/epping`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.60 },
    { url: `${BASE}/analyse/melbourne/werribee`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.60 },
    { url: `${BASE}/analyse/melbourne/sunshine`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.60 },
    { url: `${BASE}/analyse/melbourne/broadmeadows`,  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.60 },
    { url: `${BASE}/analyse/melbourne/hoppers-crossing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.60 },
    { url: `${BASE}/analyse/melbourne/narre-warren`,  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.55 },
    { url: `${BASE}/analyse/melbourne/cafe`,           lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE}/analyse/melbourne/restaurant`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.80 },

    // ── Brisbane suburb pages ───────────────────────────────────────────────────
    { url: `${BASE}/analyse/brisbane/brisbane-cbd`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.80 },
    { url: `${BASE}/analyse/brisbane/new-farm`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE}/analyse/brisbane/west-end`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE}/analyse/brisbane/paddington`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE}/analyse/brisbane/fortitude-valley`,lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE}/analyse/brisbane/south-brisbane`,  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.70 },
    { url: `${BASE}/analyse/brisbane/chermside`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${BASE}/analyse/brisbane/indooroopilly`,   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${BASE}/analyse/brisbane/carindale`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.60 },
    { url: `${BASE}/analyse/brisbane/mount-gravatt`,   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.60 },
    { url: `${BASE}/analyse/brisbane/cafe`,            lastModified: new Date(), changeFrequency: 'monthly', priority: 0.70 },

    // ── Perth pages ─────────────────────────────────────────────────────────────
    { url: `${BASE}/analyse/perth/perth-cbd`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.80 },
    { url: `${BASE}/analyse/perth/mount-lawley`,   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE}/analyse/perth/cafe`,           lastModified: new Date(), changeFrequency: 'monthly', priority: 0.70 },
    { url: `${BASE}/analyse/perth/restaurant`,     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },

    // ── Adelaide / other capitals ───────────────────────────────────────────────
    { url: `${BASE}/analyse/adelaide/restaurant`,  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${BASE}/analyse/canberra/retail`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.60 },
    { url: `${BASE}/analyse/darwin/retail`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.55 },
    { url: `${BASE}/analyse/hobart/cafe`,          lastModified: new Date(), changeFrequency: 'monthly', priority: 0.60 },

    // ── Regional cities ─────────────────────────────────────────────────────────
    { url: `${BASE}/analyse/gold-coast/gym`,           lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${BASE}/analyse/newcastle/bakery`,         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.60 },
    { url: `${BASE}/analyse/sunshine-coast/cafe`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.60 },
    { url: `${BASE}/analyse/sunshine-coast/restaurant`,lastModified: new Date(), changeFrequency: 'monthly', priority: 0.60 },
    { url: `${BASE}/analyse/wollongong/restaurant`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.60 },
    { url: `${BASE}/analyse/geelong/cafe`,             lastModified: new Date(), changeFrequency: 'monthly', priority: 0.60 },
    { url: `${BASE}/analyse/toowoomba/cafe`,           lastModified: new Date(), changeFrequency: 'monthly', priority: 0.55 },
    { url: `${BASE}/analyse/townsville/gym`,           lastModified: new Date(), changeFrequency: 'monthly', priority: 0.55 },
    { url: `${BASE}/analyse/cairns/cafe`,              lastModified: new Date(), changeFrequency: 'monthly', priority: 0.55 },
    { url: `${BASE}/analyse/ballarat/cafe`,            lastModified: new Date(), changeFrequency: 'monthly', priority: 0.55 },
    { url: `${BASE}/analyse/bendigo/restaurant`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.55 },
    { url: `${BASE}/analyse/launceston/cafe`,          lastModified: new Date(), changeFrequency: 'monthly', priority: 0.55 },
    { url: `${BASE}/analyse/mackay/retail`,            lastModified: new Date(), changeFrequency: 'monthly', priority: 0.50 },
    { url: `${BASE}/analyse/rockhampton/cafe`,         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.50 },
    { url: `${BASE}/analyse/bundaberg/cafe`,           lastModified: new Date(), changeFrequency: 'monthly', priority: 0.50 },
    { url: `${BASE}/analyse/hervey-bay/restaurant`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.50 },
    { url: `${BASE}/analyse/ipswich/gym`,              lastModified: new Date(), changeFrequency: 'monthly', priority: 0.50 },

    // ── Use case pages ──────────────────────────────────────────────────────────
    { url: `${BASE}/use-case/cafes`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.70 },
    { url: `${BASE}/use-case/restaurants`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.70 },
    { url: `${BASE}/use-case/gyms`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${BASE}/use-case/retail`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${BASE}/use-case/bakeries`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${BASE}/use-case/takeaway`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${BASE}/use-case/all`,         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.60 },

    // ── Blog ────────────────────────────────────────────────────────────────────
    { url: `${BASE}/blog`,                 lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.75 },

    // ── Suburb hub ──────────────────────────────────────────────────────────────
    { url: `${BASE}/suburb`,               lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.70 },

    // ── Legal pages ─────────────────────────────────────────────────────────────
    { url: `${BASE}/privacy`,              lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.20 },
    { url: `${BASE}/terms`,                lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.20 },
    { url: `${BASE}/disclaimer`,           lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.20 },
    { url: `${BASE}/refund`,               lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.20 },
  ]
}
