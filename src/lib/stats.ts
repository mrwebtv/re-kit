import type { Payload } from 'payload'
import crypto from 'crypto'

/** Privacy-friendly visit counter: no cookies, no IP stored. Counts are buffered in memory and written every minute. */
type Bucket = { day: string; path: string; property?: number; agent?: number; views: number; visitors: Set<string>; devices: Record<string, number>; referrers: Record<string, number> }
const buffer = new Map<string, Bucket>()
const seenToday = new Map<string, Set<string>>()
const salt = crypto.randomBytes(16).toString('hex')
let timer: NodeJS.Timeout | null = null
const slugCache = new Map<string, { id: number; agent?: number } | null>()

const BOT = /bot|crawl|spider|slurp|preview|monitor|curl|wget|python|headless|lighthouse|facebookexternalhit|embedly|whatsapp|telegram/i

export function deviceOf(ua: string) {
  if (/ipad|tablet|kindle|silk/i.test(ua)) return 'tablet'
  if (/mobi|iphone|android/i.test(ua)) return 'mobile'
  return 'desktop'
}

export function refHost(ref: string, ownHost: string) {
  try {
    const h = new URL(ref).hostname.replace(/^www\./, '')
    return !h || h === ownHost.replace(/^www\./, '') ? null : h
  } catch {
    return null
  }
}

async function propertyFor(payload: Payload, path: string) {
  const m = /^\/properties\/([^/?#]+)$/.exec(path)
  if (!m) return null
  const slug = decodeURIComponent(m[1]!)
  if (slugCache.has(slug)) return slugCache.get(slug)!
  const { docs } = await payload.find({ collection: 'properties', where: { slug: { equals: slug } }, limit: 1, depth: 0, overrideAccess: true, select: { agent: true } })
  const hit = docs[0] ? { id: docs[0].id, agent: (docs[0].agent as number | null) || undefined } : null
  if (slugCache.size > 5000) slugCache.clear()
  slugCache.set(slug, hit)
  return hit
}

export async function track(payload: Payload, input: { path: string; referrer?: string; ua: string; ip: string; host: string }) {
  if (!input.path || BOT.test(input.ua) || input.path.startsWith('/admin') || input.path.startsWith('/api')) return
  const path = input.path.split('?')[0]!.replace(/^\/(fr|es|de|it|pt|nl|ar)(?=\/|$)/, '') || '/'
  const day = new Date().toISOString().slice(0, 10)
  const prop = await propertyFor(payload, path)
  const key = `${day}|${path}`
  let b = buffer.get(key)
  if (!b) {
    b = { day, path, property: prop?.id, agent: prop?.agent, views: 0, visitors: new Set(), devices: {}, referrers: {} }
    buffer.set(key, b)
  }
  const visitor = crypto.createHash('sha256').update(`${salt}${day}${input.ip}${input.ua}`).digest('hex').slice(0, 16)
  const seenKey = key
  const seen = seenToday.get(seenKey) || new Set<string>()
  b.views++
  if (!seen.has(visitor)) {
    seen.add(visitor)
    b.visitors.add(visitor)
    seenToday.set(seenKey, seen)
  }
  const dev = deviceOf(input.ua)
  b.devices[dev] = (b.devices[dev] || 0) + 1
  const ref = input.referrer ? refHost(input.referrer, input.host) : null
  const r = ref || 'direct'
  b.referrers[r] = (b.referrers[r] || 0) + 1
  if (!timer) timer = setTimeout(() => void flush(payload), 60_000)
}

export async function flush(payload: Payload) {
  timer = null
  const items = [...buffer.values()]
  buffer.clear()
  const today = new Date().toISOString().slice(0, 10)
  for (const k of seenToday.keys()) if (!k.startsWith(today)) seenToday.delete(k)
  for (const b of items) {
    try {
      const { docs } = await payload.find({ collection: 'page-stats', where: { and: [{ day: { equals: b.day } }, { path: { equals: b.path } }] }, limit: 1, depth: 0, overrideAccess: true })
      const cur = docs[0]
      const merge = (a: unknown, add: Record<string, number>) => {
        const o = { ...((a as Record<string, number>) || {}) }
        for (const [k, v] of Object.entries(add)) o[k] = (o[k] || 0) + v
        return o
      }
      if (cur) {
        await payload.update({ collection: 'page-stats', id: cur.id, overrideAccess: true, data: { views: (cur.views || 0) + b.views, visitors: (cur.visitors || 0) + b.visitors.size, devices: merge(cur.devices, b.devices), referrers: merge(cur.referrers, b.referrers) } })
      } else {
        await payload.create({ collection: 'page-stats', overrideAccess: true, data: { day: b.day, path: b.path, property: b.property, agent: b.agent, views: b.views, visitors: b.visitors.size, devices: b.devices, referrers: b.referrers } })
      }
    } catch (err) {
      payload.logger.warn({ err, msg: 'Could not save visit stats' })
    }
  }
}
