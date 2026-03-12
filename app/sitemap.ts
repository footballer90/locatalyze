import { MetadataRoute } from 'next'

const CITIES = ['sydney','melbourne','brisbane','perth','adelaide','gold_coast','canberra','hobart']
const BIZ_TYPES = ['cafe','restaurant','gym','retail','bakery','salon']
const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://locatalyze.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE,                  lastModified: new Date(), changeFrequency: 'weekly'  as const, priority: 1.0 },
    { url: `${BASE}/auth/signup`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${BASE}/auth/login`,  lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${BASE}/analyse`,     lastModified: new Date(), changeFrequency: 'weekly'  as const, priority: 0.9 },
    { url: `${BASE}/blog`,        lastModified: new Date(), changeFrequency: 'weekly'  as const, priority: 0.8 },
  ]

  const seoPages = BIZ_TYPES.flatMap(biz =>
    CITIES.map(city => ({
      url: `${BASE}/analyse/${biz}/${city}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  )

  return [...staticPages, ...seoPages]
}