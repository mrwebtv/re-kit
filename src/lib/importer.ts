import type { Payload } from 'payload'
import { XMLParser } from 'fast-xml-parser'
import { rtText } from './lexical'

/** CSV and XML listing import. Recognises common column names, our own feed and the Kyero v3 XML format. */

export type ImportOptions = { dryRun?: boolean; downloadPhotos?: boolean; updateExisting?: boolean }
export type ImportResult = { ok: boolean; format: string; rows: number; created: number; updated: number; skipped: number; errors: string[]; unmapped: string[]; preview: Record<string, unknown>[] }

type Row = Record<string, unknown>

export function parseCsv(text: string): Row[] {
  const src = text.replace(/^﻿/, '')
  const firstLine = src.split(/\r?\n/, 1)[0] || ''
  const delim = [',', ';', '\t'].sort((a, b) => firstLine.split(b).length - firstLine.split(a).length)[0]!
  const rows: string[][] = []
  let row: string[] = []
  let cell = ''
  let q = false
  for (let i = 0; i < src.length; i++) {
    const c = src[i]!
    if (q) {
      if (c === '"' && src[i + 1] === '"') {
        cell += '"'
        i++
      } else if (c === '"') q = false
      else cell += c
    } else if (c === '"') q = true
    else if (c === delim) {
      row.push(cell)
      cell = ''
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && src[i + 1] === '\n') i++
      row.push(cell)
      rows.push(row)
      row = []
      cell = ''
    } else cell += c
  }
  if (cell || row.length) {
    row.push(cell)
    rows.push(row)
  }
  const [head, ...body] = rows.filter((r) => r.some((x) => x.trim()))
  if (!head) return []
  return body.map((r) => Object.fromEntries(head.map((h, i) => [h.trim(), (r[i] ?? '').trim()])))
}

const ALIASES: Record<string, string[]> = {
  ref: ['reference', 'ref', 'id', 'listingid', 'listing_id', 'mls', 'mlsnumber', 'propertyid', 'property_id', 'externalid'],
  title: ['title', 'name', 'headline', 'propertyname'],
  status: ['status', 'listingstatus', 'availability'],
  type: ['type', 'propertytype', 'property_type', 'category', 'subtype'],
  mode: ['mode', 'transaction', 'listingtype', 'pricefreq', 'price_freq', 'salerent', 'offer'],
  price: ['price', 'listprice', 'askingprice', 'amount', 'rent'],
  qualifier: ['pricequalifier', 'qualifier'],
  beds: ['bedrooms', 'beds', 'bed', 'bedroomstotal', 'rooms'],
  baths: ['bathrooms', 'baths', 'bath', 'bathroomstotalinteger'],
  area: ['floorarea', 'area', 'size', 'sqm', 'm2', 'livingarea', 'surfacearea', 'surface_area', 'built', 'sqft'],
  year: ['yearbuilt', 'year', 'built_year'],
  line1: ['address', 'line1', 'street', 'address1', 'streetaddress', 'unparsedaddress'],
  town: ['town', 'city', 'locality'],
  region: ['region', 'county', 'state', 'province', 'stateorprovince'],
  postcode: ['postcode', 'zip', 'zipcode', 'postalcode', 'postal_code'],
  country: ['country'],
  lat: ['lat', 'latitude'],
  lng: ['lng', 'lon', 'long', 'longitude'],
  summary: ['summary', 'shortdescription', 'teaser', 'excerpt'],
  description: ['description', 'desc', 'publicremarks', 'remarks', 'body', 'details'],
  features: ['features', 'amenities', 'feature'],
  photos: ['photos', 'images', 'image', 'photo', 'pictures', 'imageurls', 'photo_urls', 'media'],
  video: ['video', 'videourl', 'youtube'],
  tour: ['tour', 'toururl', 'virtualtour', '3dtour', 'virtualtoururl'],
  energy: ['energyrating', 'ber', 'epc', 'energy'],
  featured: ['featured'],
  agent: ['agent', 'agentemail', 'agent_email', 'agentname'],
}

const norm = (k: string) => k.toLowerCase().replace(/[^a-z0-9_]/g, '')

function pick(row: Row) {
  const byNorm = new Map(Object.entries(row).map(([k, v]) => [norm(k), v]))
  const used = new Set<string>()
  const out: Record<string, unknown> = {}
  for (const [field, names] of Object.entries(ALIASES)) {
    for (const n of names) {
      if (byNorm.has(n) && byNorm.get(n) !== '' && byNorm.get(n) != null) {
        out[field] = byNorm.get(n)
        used.add(n)
        break
      }
    }
    if (field === 'area' && out.area && (byNorm.has('sqft') && used.has('sqft'))) out.areaSqft = true
  }
  const unmapped = [...byNorm.keys()].filter((k) => !used.has(k) && !Object.values(ALIASES).flat().includes(k))
  return { out, unmapped }
}

const toNum = (v: unknown) => {
  if (typeof v === 'number') return v
  if (typeof v !== 'string') return undefined
  const n = Number(v.replace(/[^\d.,-]/g, '').replace(/,(?=\d{3}\b)/g, '').replace(',', '.'))
  return Number.isFinite(n) ? n : undefined
}
const toList = (v: unknown): string[] => {
  if (Array.isArray(v)) return v.flatMap(toList)
  if (v && typeof v === 'object') return Object.values(v).flatMap(toList)
  if (typeof v !== 'string') return []
  return v.split(/\s*[|;\n]\s*|,\s*(?=https?:)/).map((x) => x.trim()).filter(Boolean)
}
const text = (v: unknown): string | undefined => {
  if (typeof v === 'string') return v.trim() || undefined
  if (typeof v === 'number') return String(v)
  if (v && typeof v === 'object') {
    const o = v as Record<string, unknown>
    return text(o.en ?? o['#text'] ?? Object.values(o)[0])
  }
  return undefined
}

function toProperty(f: Record<string, unknown>) {
  const mode = String(f.mode || f.status || '').toLowerCase()
  const rent = /rent|let|lease|month|week/.test(mode)
  const st = String(f.status || '').toLowerCase()
  const status = /sold/.test(st) ? 'sold' : /agreed|pending|under offer|reserved/.test(st) ? (rent ? 'let' : 'sale-agreed') : /^let$|rented/.test(st) ? 'let' : rent ? 'to-let' : 'for-sale'
  const t = String(f.type || '').toLowerCase()
  const propertyType = /town/.test(t) ? 'townhouse' : /apart|flat|condo|penthouse|studio|duplex/.test(t) ? 'apartment' : /villa/.test(t) ? 'villa' : /bungalow|cottage|chalet/.test(t) ? 'bungalow' : /land|plot|site/.test(t) ? 'site' : /commercial|office|shop|retail|industrial/.test(t) ? 'commercial' : 'house'
  const area = toNum(f.area)
  const desc = text(f.description)
  const summary = text(f.summary) || (desc ? (desc.length > 290 ? `${desc.slice(0, 287).replace(/\s+\S*$/, '')}…` : desc) : undefined)
  const line1 = text(f.line1)
  const town = text(f.town)
  return {
    listingKey: text(f.ref),
    reference: text(f.ref),
    title: text(f.title) || [line1, town].filter(Boolean).join(', ') || `Property ${text(f.ref) || ''}`.trim(),
    status,
    propertyType,
    price: toNum(f.price) || 0,
    pricePeriod: rent ? 'month' : 'total',
    bedrooms: toNum(f.beds),
    bathrooms: toNum(f.baths),
    floorArea: area ? (f.areaSqft ? Math.round(area / 10.7639) : area) : undefined,
    yearBuilt: toNum(f.year),
    energyRating: text(f.energy),
    summary,
    description: desc ? rtText(desc) : undefined,
    features: toList(f.features).slice(0, 30).map((feature) => ({ feature })),
    address: { line1, town, region: text(f.region), postcode: text(f.postcode), country: text(f.country) },
    lat: toNum(f.lat),
    lng: toNum(f.lng),
    videoUrl: text(f.video),
    tourUrl: text(f.tour),
    featured: /^(1|yes|true|y)$/i.test(String(f.featured || '')),
    photos: toList(f.photos).filter((u) => /^https?:\/\//.test(u)).slice(0, 40),
    agentRef: text(f.agent),
  }
}

/** Kyero v3 and similar XML: <property> elements anywhere in the document. */
function xmlRows(xml: string): { rows: Row[]; format: string } {
  const doc = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@', textNodeName: '#text', isArray: (name) => ['property', 'image', 'feature', 'photo'].includes(name) }).parse(xml) as Record<string, unknown>
  const find = (o: unknown): Row[] | null => {
    if (!o || typeof o !== 'object') return null
    for (const [k, v] of Object.entries(o as Record<string, unknown>)) {
      if (/^(property|listing)$/i.test(k) && Array.isArray(v)) return v as Row[]
      const deeper = find(v)
      if (deeper) return deeper
    }
    return null
  }
  const items = find(doc) || []
  const kyero = JSON.stringify(doc).includes('"kyero"')
  const rows = items.map((it) => {
    const r: Row = { ...it }
    // Kyero / feed shapes
    const loc = (it.location || {}) as Row
    if (loc.latitude) r.latitude = loc.latitude
    if (loc.longitude) r.longitude = loc.longitude
    if (it.province && !it.region) r.region = it.province
    const addr = (it.address || null) as Row | null
    if (addr && typeof addr === 'object') Object.assign(r, { line1: addr.line1, town: addr.town, region: addr.region, postcode: addr.postcode, country: addr.country })
    const sa = it.surface_area as Row | undefined
    if (sa && typeof sa === 'object') r.area = sa.built
    const images = (it.images as Row | undefined)?.image as Row[] | undefined
    const photos = (it.photos as Row | undefined)?.photo as unknown[] | undefined
    if (images) r.photos = images.map((x) => (typeof x === 'object' ? x.url : x)).join('|')
    else if (photos) r.photos = photos.map((x) => (typeof x === 'object' ? (x as Row)['#text'] || (x as Row).url : x)).join('|')
    const feats = (it.features as Row | undefined)?.feature
    if (feats) r.features = (feats as unknown[]).map((x) => text(x)).join('|')
    if (it.desc) r.description = text(it.desc)
    if (it.price_freq) r.mode = it.price_freq
    return r
  })
  return { rows, format: kyero ? 'Kyero XML' : 'XML' }
}

async function downloadPhoto(payload: Payload, url: string, alt: string) {
  const res = await fetch(url, { signal: AbortSignal.timeout(30000) })
  if (!res.ok) throw new Error(`photo ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  const name = (new URL(url).pathname.split('/').pop() || 'photo.jpg').replace(/[^\w.-]/g, '_').slice(-80)
  const mimetype = res.headers.get('content-type') || 'image/jpeg'
  const doc = await payload.create({ collection: 'media', data: { alt }, file: { data: buf, mimetype, name: /\.\w{3,4}$/.test(name) ? name : `${name}.jpg`, size: buf.length }, overrideAccess: true })
  return doc.id
}

export async function importListings(payload: Payload, filename: string, content: string, opts: ImportOptions): Promise<ImportResult> {
  const isXml = /\.xml$/i.test(filename) || content.trimStart().startsWith('<')
  const { rows, format } = isXml ? xmlRows(content) : { rows: parseCsv(content), format: 'CSV' }
  const result: ImportResult = { ok: true, format, rows: rows.length, created: 0, updated: 0, skipped: 0, errors: [], unmapped: [], preview: [] }
  const unmapped = new Set<string>()
  const agents = await payload.find({ collection: 'agents', limit: 500, depth: 0, overrideAccess: true })
  for (const [i, row] of rows.entries()) {
    const { out, unmapped: u } = pick(row)
    u.forEach((x) => unmapped.add(x))
    const data = toProperty(out)
    if (result.preview.length < 5) result.preview.push({ title: data.title, status: data.status, type: data.propertyType, price: data.price, bedrooms: data.bedrooms, town: data.address.town, photos: data.photos.length, reference: data.reference })
    if (opts.dryRun) continue
    try {
      const { photos, agentRef, ...rest } = data
      const agent = agentRef ? agents.docs.find((a) => a.email?.toLowerCase() === agentRef.toLowerCase() || a.name.toLowerCase() === agentRef.toLowerCase())?.id : undefined
      const existing = data.listingKey ? await payload.find({ collection: 'properties', where: { or: [{ listingKey: { equals: data.listingKey } }, { reference: { equals: data.listingKey } }] }, limit: 1, depth: 0, overrideAccess: true }) : { docs: [] }
      const doc = existing.docs[0]
      if (doc && !opts.updateExisting) {
        result.skipped++
        continue
      }
      let media: { gallery?: number[]; externalPhotos?: { url: string }[] } = { externalPhotos: photos.map((url) => ({ url })) }
      if (opts.downloadPhotos && photos.length && !(doc && (doc.gallery as unknown[] | undefined)?.length)) {
        const ids: number[] = []
        for (const url of photos.slice(0, 20)) {
          try {
            ids.push(await downloadPhoto(payload, url, data.title))
          } catch {
            // keep going, the link stays as an external photo
          }
        }
        media = ids.length ? { gallery: ids, externalPhotos: [] } : media
      }
      const payloadData = { ...rest, ...media, agent, source: 'import', reference: doc ? undefined : rest.reference } as never
      if (doc) {
        await payload.update({ collection: 'properties', id: doc.id, data: payloadData, overrideAccess: true, context: { geocode: true } })
        result.updated++
      } else {
        await payload.create({ collection: 'properties', data: payloadData, overrideAccess: true, context: { geocode: true } })
        result.created++
      }
    } catch (e) {
      result.errors.push(`Row ${i + 2}: ${e instanceof Error ? e.message : e}`)
      if (result.errors.length > 50) break
    }
  }
  result.unmapped = [...unmapped].slice(0, 30)
  result.ok = result.errors.length === 0
  return result
}
