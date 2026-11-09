import 'server-only'
import { getPayload, type Where } from 'payload'
import config from '@payload-config'
import { cache } from 'react'
import { cookies, draftMode, headers } from 'next/headers'
import type { Agent, Media, Property, SiteSetting } from '@/payload-types'
import { DEFAULT_LOCALE, isLocale, localeInfo, type Locale } from '@/i18n/locales'
import { localize, makeT, type T } from './i18n/core'
import { dictFor } from './i18n/dicts'
import { geocode, distanceKm } from '@/lib/geo'
import { getRates } from '@/lib/rates'

export type ThemeId = 'editorial' | 'modern' | 'dark' | 'swiss'

export type Ctx = {
  locale: Locale
  intl: string
  dir: 'ltr' | 'rtl'
  prefix: string
  t: T
  /** Localize an internal link */
  L: (href: string) => string
  cur: { code: string; symbol: string; rate: number; base: string } | null
  languages: Locale[]
  path: string
}
export type Site = SiteSetting & { $: Ctx }

export const payloadClient = cache(async () => getPayload({ config }))

export const getLocale = cache(async (): Promise<{ locale: Locale; path: string }> => {
  try {
    const h = await headers()
    const l = h.get('x-rk-locale')
    return { locale: isLocale(l) ? l : DEFAULT_LOCALE, path: h.get('x-rk-path') || '/' }
  } catch {
    return { locale: DEFAULT_LOCALE, path: '/' }
  }
})

export const isDraft = async () => {
  try {
    return (await draftMode()).isEnabled
  } catch {
    return false
  }
}

export const getSettings = cache(async (): Promise<SiteSetting> => {
  const payload = await payloadClient()
  const { locale } = await getLocale()
  return payload.findGlobal({ slug: 'site-settings', depth: 1, locale })
})

export function currencySymbol(code: string, intl = 'en-GB') {
  try {
    return new Intl.NumberFormat(intl, { style: 'currency', currency: code, currencyDisplay: 'narrowSymbol' }).formatToParts(0).find((p) => p.type === 'currency')?.value || code
  } catch {
    return code
  }
}

/** Settings plus everything needed to render in the visitor's language and currency. */
export const getSite = cache(async (): Promise<Site> => {
  const [s, { locale, path }] = await Promise.all([getSettings(), getLocale()])
  const info = localeInfo(locale)
  const prefix = locale === DEFAULT_LOCALE ? '' : `/${locale}`
  const base = (s.currencyCode || 'USD').toUpperCase()
  let cur: Ctx['cur'] = null
  if (s.currencySwitcher) {
    try {
      const want = (await cookies()).get('rk-cur')?.value?.toUpperCase()
      if (want && want !== base && (s.currencies || []).includes(want as never)) {
        const fixed = (s.currencyRates || []).find((r) => r.code.toUpperCase() === want)?.rate
        const rate = fixed || (await getRates(await payloadClient(), base))[want]
        if (rate) cur = { code: want, symbol: currencySymbol(want, info.intl), rate, base }
      }
    } catch {
      // outside a request
    }
  }
  const languages = ((s.languages?.length ? s.languages : [DEFAULT_LOCALE]) as Locale[]).filter(isLocale)
  if (!languages.includes(DEFAULT_LOCALE)) languages.unshift(DEFAULT_LOCALE)
  return {
    ...s,
    $: { locale, intl: info.intl, dir: 'rtl' in info && info.rtl ? 'rtl' : 'ltr', prefix, t: makeT(dictFor(locale)), L: (h) => localize(prefix, h), cur, languages, path },
  }
})

/* ---------------- listings ---------------- */

export type ListingFilters = {
  mode?: 'buy' | 'rent'
  q?: string
  type?: string
  beds?: string
  baths?: string
  min?: string
  max?: string
  labels?: string
  radius?: string
  near?: string
  sort?: string
  page?: string
  ids?: string
  agent?: string
  parent?: string
}

export const PAGE_SIZE = 12

const list = (v?: string) => (v || '').split(',').map((x) => x.trim()).filter(Boolean)

export function filterWhere(f: ListingFilters, opts: { textSearch?: boolean } = {}): Where[] {
  const and: Where[] = []
  if (f.mode === 'rent') and.push({ status: { in: ['to-let', 'let'] } })
  else if (f.mode === 'buy') and.push({ status: { in: ['for-sale', 'sale-agreed', 'sold'] } })
  if (f.q && opts.textSearch !== false) {
    and.push({ or: [{ title: { like: f.q } }, { reference: { equals: f.q.toUpperCase() } }, { 'address.town': { like: f.q } }, { 'address.region': { like: f.q } }, { 'address.postcode': { like: f.q } }] })
  }
  const types = list(f.type)
  if (types.length === 1) and.push({ propertyType: { equals: types[0] } })
  else if (types.length > 1) and.push({ propertyType: { in: types } })
  if (f.beds) and.push({ bedrooms: { greater_than_equal: Number(f.beds) } })
  if (f.baths) and.push({ bathrooms: { greater_than_equal: Number(f.baths) } })
  if (f.min) and.push({ price: { greater_than_equal: Number(f.min) } })
  if (f.max) and.push({ price: { less_than_equal: Number(f.max) } })
  for (const l of list(f.labels)) and.push({ labels: { in: [Number(l)] } })
  const ids = list(f.ids).map(Number).filter(Boolean)
  if (f.ids !== undefined) and.push({ id: { in: ids.length ? ids : [0] } })
  if (f.agent) and.push({ agent: { equals: Number(f.agent) } })
  if (f.parent) and.push({ parent: { equals: Number(f.parent) } })
  return and
}

export async function searchCenter(f: ListingFilters) {
  if (f.near) {
    const [lat, lng] = f.near.split(',').map(Number)
    if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat: lat!, lng: lng!, label: '' }
  }
  if (f.radius && f.q) {
    const hit = await geocode(f.q)
    if (hit) return { ...hit, label: f.q }
  }
  return null
}

export async function getProperties(f: ListingFilters = {}, limit = PAGE_SIZE) {
  const payload = await payloadClient()
  const { locale } = await getLocale()
  const radius = Number(f.radius) || 0
  const center = radius ? await searchCenter(f) : null
  const and = filterWhere(f, { textSearch: !center })
  const page = Math.max(1, Number(f.page) || 1)
  const sort = f.sort === 'price-desc' ? '-price' : f.sort === 'price-asc' ? 'price' : '-createdAt'
  let distances: Record<number, number> | undefined
  if (center) {
    const dLat = radius / 111
    const dLng = radius / (111 * Math.max(0.2, Math.cos((center.lat * Math.PI) / 180)))
    and.push({ lat: { greater_than_equal: center.lat - dLat } }, { lat: { less_than_equal: center.lat + dLat } }, { lng: { greater_than_equal: center.lng - dLng } }, { lng: { less_than_equal: center.lng + dLng } })
    const cand = await payload.find({ collection: 'properties', overrideAccess: false, where: { and }, pagination: false, limit: 5000, depth: 0, select: { lat: true, lng: true } })
    const within = cand.docs
      .map((d) => ({ id: d.id, km: distanceKm(center, { lat: d.lat!, lng: d.lng! }) }))
      .filter((d) => d.km <= radius)
      .sort((a, b) => a.km - b.km)
    distances = Object.fromEntries(within.map((d) => [d.id, Math.round(d.km * 10) / 10]))
    if (f.sort === 'distance' || !f.sort) {
      const slice = within.slice((page - 1) * limit, page * limit).map((d) => d.id)
      const docs = slice.length ? (await payload.find({ collection: 'properties', overrideAccess: false, where: { id: { in: slice } }, depth: 1, limit, locale, pagination: false })).docs : []
      const ordered = slice.map((id) => docs.find((d) => d.id === id)).filter(Boolean) as Property[]
      return { docs: ordered, totalDocs: within.length, totalPages: Math.max(1, Math.ceil(within.length / limit)), page, distances, center }
    }
    and.push({ id: { in: within.length ? within.map((d) => d.id) : [0] } })
  }
  const res = await payload.find({ collection: 'properties', overrideAccess: false, where: and.length ? { and } : undefined, sort, limit, page, depth: 1, locale })
  return { docs: res.docs, totalDocs: res.totalDocs, totalPages: res.totalPages, page: res.page || 1, distances, center }
}

export async function getFeatured(limit = 3) {
  const payload = await payloadClient()
  const { locale } = await getLocale()
  const featured = await payload.find({ collection: 'properties', overrideAccess: false, where: { featured: { equals: true } }, limit, depth: 1, sort: '-createdAt', locale })
  if (featured.docs.length >= limit) return featured.docs
  const rest = await payload.find({ collection: 'properties', overrideAccess: false, limit, depth: 1, sort: '-createdAt', locale })
  const seen = new Set(featured.docs.map((d) => d.id))
  return [...featured.docs, ...rest.docs.filter((d) => !seen.has(d.id))].slice(0, limit)
}

export async function getProperty(slug: string) {
  const payload = await payloadClient()
  const { locale } = await getLocale()
  const { docs } = await payload.find({ collection: 'properties', overrideAccess: false, where: { slug: { equals: slug } }, depth: 2, limit: 1, locale })
  return docs[0] as Property | undefined
}

export async function getUnits(p: Property) {
  const payload = await payloadClient()
  const { locale } = await getLocale()
  const { docs } = await payload.find({ collection: 'properties', overrideAccess: false, where: { parent: { equals: p.id } }, depth: 1, limit: 100, sort: 'price', locale })
  return docs
}

export async function getSimilar(p: Property, limit = 3) {
  const payload = await payloadClient()
  const { locale } = await getLocale()
  const { docs } = await payload.find({
    collection: 'properties', overrideAccess: false,
    where: { and: [{ id: { not_equals: p.id } }, { status: { equals: p.status } }, { parent: { not_equals: p.id } }] },
    limit,
    depth: 1,
    locale,
  })
  return docs
}

export async function getAgents() {
  const payload = await payloadClient()
  const { locale } = await getLocale()
  const { docs } = await payload.find({ collection: 'agents', limit: 50, depth: 1, sort: 'createdAt', locale })
  return docs as Agent[]
}

export async function getAgent(slug: string) {
  const payload = await payloadClient()
  const { locale } = await getLocale()
  const { docs } = await payload.find({ collection: 'agents', where: { slug: { equals: slug } }, limit: 1, depth: 1, locale })
  return docs[0] as Agent | undefined
}

export async function getLabels() {
  const payload = await payloadClient()
  const { locale } = await getLocale()
  const { docs } = await payload.find({ collection: 'property-labels', limit: 100, depth: 0, locale, where: { filterable: { equals: true } } })
  return docs
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
  villa: 'Villa',
  site: 'Site',
  commercial: 'Commercial',
  development: 'Development',
}

export const TYPE_PLURAL: Record<string, string> = {
  house: 'Houses',
  apartment: 'Apartments',
  townhouse: 'Townhouses',
  bungalow: 'Bungalows',
  villa: 'Villas',
  site: 'Sites',
  commercial: 'Commercial',
  development: 'Developments',
}

export const QUALIFIER_LABEL: Record<string, string> = {
  'offers-over': 'Offers over',
  'offers-in-the-region-of': 'Offers in the region of',
  'guide-price': 'Guide price',
  from: 'From',
  'fixed-price': 'Fixed price',
  'asking-price': 'Asking price',
}

type Fmt = SiteSetting & { $?: Ctx }
const tt = (s: Fmt, k: string) => (s.$ ? s.$.t(k) : k)

export const qualifier = (p: Pick<Property, 'priceQualifier' | 'priceOnRequest'>, s?: Fmt) => (p.priceOnRequest ? '' : (p.priceQualifier && (s ? tt(s, QUALIFIER_LABEL[p.priceQualifier]!) : QUALIFIER_LABEL[p.priceQualifier])) || '')

/** Public base URL of the site, set at runtime from DOMAIN (see docker/entrypoint.sh). */
export const siteUrl = () => (process.env.SITE_URL || '').replace(/\/$/, '')

export function formatMoney(n: number, s: Fmt, short = false) {
  const intl = s.$?.intl || 'en-GB'
  const cur = s.$?.cur
  const sym = cur ? cur.symbol : s.currencySymbol || '$'
  const v = cur ? n * cur.rate : n
  if (short && v >= 1_000_000) return `${sym}${(v / 1_000_000).toLocaleString(intl, { maximumFractionDigits: 2 })}M`
  if (short && v >= 10_000) return `${sym}${Math.round(v / 1000).toLocaleString(intl)}K`
  return `${sym}${Math.round(v).toLocaleString(intl)}`
}

export function formatPrice(p: Pick<Property, 'price' | 'pricePeriod' | 'priceOnRequest'>, s: Fmt, short = false) {
  if (p.priceOnRequest) return tt(s, 'Price on request')
  const body = formatMoney(p.price || 0, s, short)
  return p.pricePeriod === 'month' ? `${body}${short ? tt(s, '/mo') : ` ${tt(s, 'per month')}`}` : body
}

export function formatArea(m2: number | null | undefined, s: Fmt) {
  if (!m2) return ''
  const intl = s.$?.intl || 'en-GB'
  return s.areaUnit === 'sqft' ? `${Math.round(m2 * 10.7639).toLocaleString(intl)} sq ft` : `${m2.toLocaleString(intl)} m²`
}

export function place(p: Property) {
  return [p.address?.town, p.address?.region].filter(Boolean).join(', ')
}

export function img(m: number | Media | null | undefined, size: 'small' | 'medium' | 'large' | 'xlarge' | 'square' = 'large') {
  if (!m || typeof m === 'number') return null
  const url = m.sizes?.[size]?.url || m.url
  return url ? { url, alt: m.alt || '' } : null
}

/** Gallery photos, or photo links from an MLS feed / import when there is no gallery. */
export function photosOf(p: Property, size: Parameters<typeof img>[1] = 'large', fullSize: Parameters<typeof img>[1] = 'xlarge') {
  const g = ((p.gallery || []) as (number | Media)[])
    .map((m) => ({ small: img(m, size), full: img(m, fullSize) }))
    .filter((x) => x.small)
    .map((x) => ({ url: x.small!.url, full: x.full?.url || x.small!.url, alt: x.small!.alt || p.title }))
  if (g.length) return g
  return (p.externalPhotos || []).map((x) => ({ url: x.url, full: x.url, alt: p.title }))
}

export function firstPhoto(p: Property, size: Parameters<typeof img>[1] = 'large') {
  const x = photosOf(p, size)[0]
  return x ? { url: x.url, alt: x.alt } : null
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('')
}
