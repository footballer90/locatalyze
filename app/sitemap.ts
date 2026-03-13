import { MetadataRoute } from 'next'

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.locatalyze.com'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE,                    lastModified: new Date(), changeFrequency: 'weekly',  priority: 1   },
    { url: `${BASE}/analyse`,      lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/suburb`,       lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/blog`,         lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE}/upgrade`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/methodology`,  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/use-case/cafes`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/use-case/restaurants`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/use-case/gyms`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/use-case/retail`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/use-case/bakeries`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/use-case/takeaway`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]
}
