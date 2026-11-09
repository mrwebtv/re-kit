import type { MetadataRoute } from 'next'
import { payloadClient, siteUrl } from '@/site/data'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl()
  const payload = await payloadClient()
  const { docs } = await payload.find({ collection: 'properties', limit: 5000, depth: 0, pagination: false, select: { slug: true, updatedAt: true } })
  const fixed = ['', '/properties?mode=buy', '/properties?mode=rent', '/agents', '/valuation', '/contact', '/privacy'].map((p) => ({ url: `${base}${p}`, changeFrequency: 'daily' as const }))
  return [...fixed, ...docs.map((d) => ({ url: `${base}/properties/${d.slug}`, lastModified: d.updatedAt, changeFrequency: 'weekly' as const }))]
}
