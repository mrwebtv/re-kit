import type { MetadataRoute } from 'next'
import { payloadClient, siteUrl } from '@/site/data'
import { DEFAULT_LOCALE } from '@/i18n/locales'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl()
  const payload = await payloadClient()
  const s = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
  const langs = ((s.languages?.length ? s.languages : [DEFAULT_LOCALE]) as string[]).filter((l) => l !== DEFAULT_LOCALE)
  const alt = (path: string) => (langs.length ? { languages: Object.fromEntries([[DEFAULT_LOCALE, `${base}${path}`], ...langs.map((l) => [l, `${base}/${l}${path === '/' ? '' : path}`])]) } : undefined)
  const [props, pages, posts, agents] = await Promise.all([
    payload.find({ collection: 'properties', limit: 10000, depth: 0, pagination: false, select: { slug: true, updatedAt: true } }),
    payload.find({ collection: 'pages', limit: 1000, depth: 0, pagination: false, select: { slug: true, updatedAt: true }, where: { _status: { equals: 'published' } } }),
    payload.find({ collection: 'posts', limit: 5000, depth: 0, pagination: false, select: { slug: true, updatedAt: true }, where: { _status: { equals: 'published' } } }),
    payload.find({ collection: 'agents', limit: 500, depth: 0, pagination: false, select: { slug: true, updatedAt: true } }),
  ])
  const entry = (path: string, lastModified?: string, changeFrequency: 'daily' | 'weekly' | 'monthly' = 'weekly') => ({ url: `${base}${path}`, lastModified, changeFrequency, alternates: alt(path) })
  return [
    ...['/', '/properties?mode=buy', '/properties?mode=rent', '/agents', '/valuation', '/contact', '/blog', '/privacy'].map((p) => entry(p, undefined, 'daily')),
    ...props.docs.map((d) => entry(`/properties/${d.slug}`, d.updatedAt)),
    ...pages.docs.filter((d) => d.slug).map((d) => entry(`/${d.slug}`, d.updatedAt, 'monthly')),
    ...posts.docs.filter((d) => d.slug).map((d) => entry(`/blog/${d.slug}`, d.updatedAt, 'monthly')),
    ...agents.docs.filter((d) => d.slug).map((d) => entry(`/agents/${d.slug}`, d.updatedAt, 'monthly')),
  ]
}
