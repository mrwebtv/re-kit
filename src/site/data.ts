import 'server-only'
import { getPayload, type Where } from 'payload'
import config from '@payload-config'
import { cache } from 'react'
import type { Agent, Media, Property, SiteSetting } from '@/payload-types'

export type ThemeId = 'editorial' | 'modern' | 'dark' | 'swiss'

export const payloadClient = cache(async () => getPayload({ config }))

export const getSettings = cache(async (): Promise<SiteSetting> => {
  const payload = await payloadClient()
  return payload.findGlobal({ slug: 'site-settings', depth: 1 })
})

export type ListingFilters = {
  mode?: 'buy' | 'rent'
  q?: string
  type?: string
  beds?: string
  min?: string
  max?: string
  sort?: string
  page?: string
}

export const PAGE_SIZE = 12

export async function getProperties(f: ListingFilters = {}, limit = PAGE_SIZE) {
  const payload = await payloadClient()
  const and: Where[] = []
  if (f.mode === 'rent') and.push({ status: { in: ['to-let', 'let'] } })
  else if (f.mode === 'buy') and.push({ status: { in: ['for-sale', 'sale-agreed', 'sold'] } })
  if (f.q) {
    and.push({
      or: [
        { title: { like: f.q } },
        { 'address.town': { like: f.q } },
        { 'address.region': { like: f.q } },
        { 'address.postcode': { like: f.q } },
      ],
    })
  }
  if (f.type) and.push({ propertyType: { equals: f.type } })
  if (f.beds) and.push({ bedrooms: { greater_than_equal: Number(f.beds) } })
  if (f.min) and.push({ price: { greater_than_equal: Number(f.min) } })
  if (f.max) and.push({ price: { less_than_equal: Number(f.max) } })
  const sort = f.sort === 'price-desc' ? '-price' : f.sort === 'price-asc' ? 'price' : '-createdAt'
  return payload.find({
    collection: 'properties',
    where: and.length ? { and } : undefined,
    sort,
    limit,
    page: Math.max(1, Number(f.page) || 1),
    depth: 1,
  })
}

export async function getFeatured(limit = 3) {
  const payload = await payloadClient()
  const featured = await payload.find({ collection: 'properties', where: { featured: { equals: true } }, limit, depth: 1, sort: '-createdAt' })
  if (featured.docs.length >= limit) return featured.docs
  const rest = await payload.find({ collection: 'properties', limit, depth: 1, sort: '-createdAt' })
  const seen = new Set(featured.docs.map((d) => d.id))
  return [...featured.docs, ...rest.docs.filter((d) => !seen.has(d.id))].slice(0, limit)
}

export async function getProperty(slug: string) {
  const payload = await payloadClient()
  const { docs } = await payload.find({ collection: 'properties', where: { slug: { equals: slug } }, depth: 2, limit: 1 })
  return docs[0] as Property | undefined
}

export async function getSimilar(p: Property, limit = 3) {
  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: 'properties',
    where: { and: [{ id: { not_equals: p.id } }, { status: { equals: p.status } }] },
    limit,
    depth: 1,
  })
  return docs
}

export async function getAgents() {
  const payload = await payloadClient()
  const { docs } = await payload.find({ collection: 'agents', limit: 50, depth: 1, sort: 'createdAt' })
  return docs as Agent[]
}

/* ---------- formatting helpers ---------- */

export const STATUS_LABEL: Record<string, string> = {
  'for-sale': 'For sale',
  'sale-agreed': 'Sale agreed',
  sold: 'Sold',
  'to-let': 'To let',
  let: 'Let',
}

export const TYPE_LABEL: Record<string, string> = {
  house: 'House',
  apartment: 'Apartment',
  townhouse: 'Townhouse',
  bungalow: 'Bungalow',
  site: 'Site',
  commercial: 'Commercial',
}

export const QUALIFIER_LABEL: Record<string, string> = {
  'offers-over': 'Offers over',
  'offers-in-the-region-of': 'Offers in the region of',
  'guide-price': 'Guide price',
  from: 'From',
  'fixed-price': 'Fixed price',
  'asking-price': 'Asking price',
}

export const qualifier = (p: Pick<Property, 'priceQualifier' | 'priceOnRequest'>) => (p.priceOnRequest ? '' : (p.priceQualifier && QUALIFIER_LABEL[p.priceQualifier]) || '')

/** Public base URL of the site, set at runtime from DOMAIN (see docker/entrypoint.sh). */
export const siteUrl = () => (process.env.SITE_URL || '').replace(/\/$/, '')

export function formatPrice(p: Pick<Property, 'price' | 'pricePeriod' | 'priceOnRequest'>, s: SiteSetting, short = false) {
  if (p.priceOnRequest) return 'Price on request'
  const sym = s.currencySymbol || '$'
  const n = p.price || 0
  let body: string
  if (short && n >= 1_000_000) body = `${sym}${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 2).replace(/\.?0+$/, '')}M`
  else if (short && n >= 10_000) body = `${sym}${Math.round(n / 1000)}K`
  else body = `${sym}${n.toLocaleString('en-US')}`
  return p.pricePeriod === 'month' ? `${body}${short ? '/mo' : ' per month'}` : body
}

export function formatArea(m2: number | null | undefined, s: SiteSetting) {
  if (!m2) return ''
  return s.areaUnit === 'sqft' ? `${Math.round(m2 * 10.7639).toLocaleString('en-US')} sq ft` : `${m2.toLocaleString('en-US')} m²`
}

export function place(p: Property) {
  return [p.address?.town, p.address?.region].filter(Boolean).join(', ')
}

export function img(m: number | Media | null | undefined, size: 'small' | 'medium' | 'large' | 'xlarge' | 'square' = 'large') {
  if (!m || typeof m === 'number') return null
  const url = m.sizes?.[size]?.url || m.url
  return url ? { url, alt: m.alt || '' } : null
}

export function firstPhoto(p: Property, size: Parameters<typeof img>[1] = 'large') {
  const g = (p.gallery || []) as (number | Media)[]
  return img(g[0], size)
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('')
}
