import type { MetadataRoute } from 'next'
import { getSettings, siteUrl } from '@/site/data'

export const dynamic = 'force-dynamic'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const s = await getSettings()
  if (s.noindex) return { rules: { userAgent: '*', disallow: '/' } }
  return { rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api', '/alerts'] }, sitemap: `${siteUrl()}/sitemap.xml` }
}
