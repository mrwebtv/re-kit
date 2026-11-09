import type { Agent, Property } from '@/payload-types'
import { getSettings, payloadClient, photosOf, siteUrl } from './data'

export type FeedItem = ReturnType<typeof toItem>

function toItem(p: Property, base: string) {
  const abs = (u?: string | null) => (!u ? null : u.startsWith('http') ? u : `${base}${u}`)
  const agent = p.agent && typeof p.agent === 'object' ? (p.agent as Agent) : null
  return {
    id: p.id,
    ref: p.reference || p.slug,
    url: `${base}/properties/${p.slug}`,
    title: p.title,
    status: p.status,
    listing: p.status === 'to-let' || p.status === 'let' ? 'rent' : 'sale',
    type: p.propertyType,
    price: p.priceOnRequest ? null : p.price,
    pricePeriod: p.pricePeriod,
    priceQualifier: p.priceQualifier || null,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    floorAreaSqm: p.floorArea,
    energyRating: p.energyRating,
    summary: p.summary,
    features: (p.features || []).map((f) => f.feature),
    address: { line1: p.address?.line1, town: p.address?.town, region: p.address?.region, postcode: p.address?.postcode },
    lat: p.lat,
    lng: p.lng,
    images: photosOf(p, 'xlarge').map((x) => abs(x.full)).filter(Boolean) as string[],
    agent: agent ? { name: agent.name, email: agent.email, phone: agent.phone } : null,
    updatedAt: p.updatedAt,
  }
}

/** Returns null when the feed feature is switched off. */
export async function getFeed() {
  const s = await getSettings()
  if (!s.features?.propertyFeed) return null
  const payload = await payloadClient()
  const { docs } = await payload.find({ collection: 'properties', overrideAccess: false, where: { and: [{ status: { in: ['for-sale', 'to-let'] } }, { source: { not_equals: 'mls' } }] }, limit: 2000, depth: 1, pagination: false })
  const base = siteUrl()
  return { s, items: docs.map((p) => toItem(p, base)) }
}
