import type { Payload } from 'payload'
import { rtText } from './lexical'

/**
 * MLS / IDX sync over the RESO Web API (OData). Works with Bridge, Trestle, Spark, MLS Grid and any
 * RESO-certified feed: same field names (ListingKey, ListPrice, StandardStatus, Media...).
 */

type MlsSettings = {
  enabled?: boolean | null
  provider?: string | null
  apiUrl?: string | null
  auth?: string | null
  accessToken?: string | null
  tokenUrl?: string | null
  clientId?: string | null
  clientSecret?: string | null
  scope?: string | null
  filter?: string | null
  syncHours?: number | null
  maxListings?: number | null
  includeSold?: boolean | null
  defaultAgent?: number | { id: number } | null
  lastSync?: SyncResult | null
}

export type SyncResult = { at: string; ok: boolean; mode: 'full' | 'update' | 'test'; fetched: number; created: number; updated: number; removed: number; error?: string; cursor?: string; lastFullAt?: string; sample?: string[] }

type Reso = Record<string, unknown> & {
  ListingKey?: string
  ListingId?: string
  StandardStatus?: string
  PropertyType?: string
  PropertySubType?: string
  ListPrice?: number
  ClosePrice?: number
  Media?: { MediaURL?: string; Order?: number; MediaCategory?: string }[]
}

const ACTIVE = ['Active', 'Active Under Contract', 'ActiveUnderContract', 'Pending', 'Coming Soon', 'ComingSoon']

let tokenCache: { token: string; exp: number; key: string } | null = null

async function bearer(m: MlsSettings) {
  if (m.auth !== 'oauth') return m.accessToken || ''
  const key = `${m.tokenUrl}|${m.clientId}`
  if (tokenCache && tokenCache.key === key && tokenCache.exp > Date.now() + 60_000) return tokenCache.token
  const res = await fetch(m.tokenUrl!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'client_credentials', client_id: m.clientId || '', client_secret: m.clientSecret || '', scope: m.scope || 'api' }),
    signal: AbortSignal.timeout(15000),
  })
  if (!res.ok) throw new Error(`Login to the MLS failed (${res.status}). Check the client ID and secret.`)
  const j = (await res.json()) as { access_token: string; expires_in?: number }
  tokenCache = { token: j.access_token, exp: Date.now() + (j.expires_in || 3600) * 1000, key }
  return j.access_token
}

function resourceUrl(m: MlsSettings) {
  const base = (m.apiUrl || '').trim().replace(/\/$/, '')
  if (!base) throw new Error('Add the API address first.')
  return /\/Property$/i.test(base) ? base : `${base}/Property`
}

async function getJson(url: string, token: string) {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }, signal: AbortSignal.timeout(60000) })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    const err = new Error(`MLS returned ${res.status}${body ? `: ${body.slice(0, 200)}` : ''}`) as Error & { status?: number }
    err.status = res.status
    throw err
  }
  return (await res.json()) as { value?: Reso[]; '@odata.nextLink'?: string }
}

const str = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : undefined)
const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : typeof v === 'string' && v.trim() && !isNaN(Number(v)) ? Number(v) : undefined)
const list = (v: unknown) => (Array.isArray(v) ? v.filter((x) => typeof x === 'string') : typeof v === 'string' && v ? v.split(',').map((x) => x.trim()) : []) as string[]

export function mapReso(r: Reso, agent?: number) {
  const lease = /lease|rental/i.test(r.PropertyType || '')
  const st = r.StandardStatus || 'Active'
  const status = st === 'Closed' ? (lease ? 'let' : 'sold') : /Pending|Under Contract|UnderContract/i.test(st) ? (lease ? 'let' : 'sale-agreed') : lease ? 'to-let' : 'for-sale'
  const sub = `${r.PropertySubType || ''} ${r.PropertyType || ''}`
  const propertyType = /town/i.test(sub) ? 'townhouse' : /condo|apartment|co-?op|stock/i.test(sub) ? 'apartment' : /land|lot/i.test(sub) ? 'site' : /commercial|business|industrial|office|retail/i.test(sub) ? 'commercial' : /manufactured|mobile|cabin|bungalow/i.test(sub) ? 'bungalow' : 'house'
  const street = str(r.UnparsedAddress) || [r.StreetNumber, r.StreetDirPrefix, r.StreetName, r.StreetSuffix, r.UnitNumber ? `#${r.UnitNumber}` : ''].filter(Boolean).join(' ')
  const town = str(r.City)
  const sqft = /meter/i.test(String(r.LivingAreaUnits || '')) ? undefined : num(r.LivingArea)
  const m2 = /meter/i.test(String(r.LivingAreaUnits || '')) ? num(r.LivingArea) : sqft ? Math.round(sqft / 10.7639) : undefined
  const remarks = str(r.PublicRemarks) || ''
  const photos = (r.Media || [])
    .filter((x) => x.MediaURL && (!x.MediaCategory || /photo|image/i.test(x.MediaCategory)))
    .sort((a, b) => (a.Order ?? 0) - (b.Order ?? 0))
    .slice(0, 40)
    .map((x) => ({ url: x.MediaURL! }))
  const features = [...list(r.InteriorFeatures), ...list(r.ExteriorFeatures), ...list(r.ParkingFeatures), ...list(r.PoolFeatures), ...list(r.View)].filter((x) => x && !/none/i.test(x)).slice(0, 14)
  return {
    title: street || town || `MLS ${r.ListingId || r.ListingKey}`,
    status,
    propertyType,
    price: num(st === 'Closed' ? r.ClosePrice ?? r.ListPrice : r.ListPrice) || 0,
    pricePeriod: lease ? 'month' : 'total',
    bedrooms: num(r.BedroomsTotal),
    bathrooms: num(r.BathroomsTotalInteger) ?? num(r.BathroomsFull),
    floorArea: m2,
    yearBuilt: num(r.YearBuilt),
    summary: remarks ? (remarks.length > 290 ? `${remarks.slice(0, 287).replace(/\s+\S*$/, '')}…` : remarks) : undefined,
    description: remarks ? rtText(remarks) : undefined,
    features: features.map((feature) => ({ feature })),
    address: { line1: street || undefined, town, region: str(r.StateOrProvince), postcode: str(r.PostalCode), country: str(r.Country) },
    lat: num(r.Latitude),
    lng: num(r.Longitude),
    externalPhotos: photos,
    tourUrl: str(r.VirtualTourURLUnbranded),
    listingKey: String(r.ListingKey || r.ListingId),
    mlsNumber: str(r.ListingId),
    listOffice: str(r.ListOfficeName),
    listAgentName: str(r.ListAgentFullName),
    sourceUpdatedAt: str(r.ModificationTimestamp),
    source: 'mls' as const,
    agent,
  }
}

async function readSettings(payload: Payload) {
  const s = (await payload.findGlobal({ slug: 'site-settings', depth: 0, overrideAccess: true, showHiddenFields: true })) as { mls?: MlsSettings }
  return s.mls || {}
}

async function saveResult(payload: Payload, r: SyncResult) {
  const s = (await payload.findGlobal({ slug: 'site-settings', depth: 0, overrideAccess: true, showHiddenFields: true })) as { mls?: MlsSettings }
  const prev = s.mls?.lastSync
  const keep = { ...r, cursor: r.cursor || prev?.cursor, lastFullAt: r.mode === 'full' && r.ok ? r.at : prev?.lastFullAt }
  await payload.updateGlobal({ slug: 'site-settings', overrideAccess: true, context: { skipRevalidate: true }, data: { mls: { ...(s.mls || {}), lastSync: keep } } as never })
}

let running = false

export async function mlsSync(payload: Payload, mode: 'full' | 'update' | 'test' = 'update'): Promise<SyncResult> {
  const result: SyncResult = { at: new Date().toISOString(), ok: false, mode, fetched: 0, created: 0, updated: 0, removed: 0 }
  if (running) return { ...result, error: 'A sync is already running.' }
  running = true
  try {
    const m = await readSettings(payload)
    if (!m.enabled && mode !== 'test') throw new Error('MLS sync is switched off.')
    const token = await bearer(m)
    const statuses = [...ACTIVE, ...(m.includeSold ? ['Closed'] : [])]
    const statusFilter = `(${statuses.map((x) => `StandardStatus eq '${x}'`).join(' or ')})`
    const since = mode === 'update' ? m.lastSync?.cursor : undefined
    // Incremental runs also fetch withdrawn/expired listings so they can be removed here.
    const parts = [since ? `ModificationTimestamp gt ${since}` : statusFilter, m.filter ? `(${m.filter})` : ''].filter(Boolean)
    const max = mode === 'test' ? 5 : Math.max(1, m.maxListings || 2000)
    const top = Math.min(200, max)
    const qs = (expand: boolean) => `$filter=${encodeURIComponent(parts.join(' and '))}&$top=${top}&$orderby=ModificationTimestamp%20asc${expand ? '&$expand=Media' : ''}`
    let url = `${resourceUrl(m)}?${qs(true)}`
    let page: Awaited<ReturnType<typeof getJson>>
    try {
      page = await getJson(url, token)
    } catch (e) {
      // Feeds that embed Media reject $expand.
      if ((e as { status?: number }).status !== 400) throw e
      url = `${resourceUrl(m)}?${qs(false)}`
      page = await getJson(url, token)
    }
    const agent = typeof m.defaultAgent === 'object' && m.defaultAgent ? m.defaultAgent.id : (m.defaultAgent as number | undefined)
    const seen = new Set<string>()
    let cursor = since
    let capped = false
    for (;;) {
      for (const r of page.value || []) {
        result.fetched++
        const data = mapReso(r, agent)
        if (!data.listingKey || data.listingKey === 'undefined') continue
        seen.add(data.listingKey)
        if (r.ModificationTimestamp && (!cursor || String(r.ModificationTimestamp) > cursor)) cursor = String(r.ModificationTimestamp)
        if (mode === 'test') {
          ;(result.sample ||= []).push(`${data.title} · ${data.status} · ${data.price}`)
          continue
        }
        const keep = statuses.includes(r.StandardStatus || 'Active')
        const existing = await payload.find({ collection: 'properties', where: { and: [{ source: { equals: 'mls' } }, { listingKey: { equals: data.listingKey } }] }, limit: 1, depth: 0, overrideAccess: true })
        const doc = existing.docs[0]
        if (!keep) {
          if (doc) {
            await payload.delete({ collection: 'properties', id: doc.id, overrideAccess: true })
            result.removed++
          }
          continue
        }
        if (doc) {
          await payload.update({ collection: 'properties', id: doc.id, data: data as never, overrideAccess: true, context: { mls: true } })
          result.updated++
        } else {
          await payload.create({ collection: 'properties', data: data as never, overrideAccess: true, context: { mls: true } })
          result.created++
        }
      }
      if (result.fetched >= max) {
        capped = Boolean(page['@odata.nextLink'])
        break
      }
      const next = page['@odata.nextLink']
      if (!next) break
      page = await getJson(next, token)
    }
    // Full sync: anything we hold that the MLS no longer returns as active is removed.
    if (mode === 'full' && !capped) {
      const ours = await payload.find({ collection: 'properties', where: { source: { equals: 'mls' } }, limit: 10000, depth: 0, overrideAccess: true, select: { listingKey: true } })
      for (const d of ours.docs) {
        if (d.listingKey && !seen.has(d.listingKey)) {
          await payload.delete({ collection: 'properties', id: d.id, overrideAccess: true })
          result.removed++
        }
      }
    }
    result.ok = true
    result.cursor = cursor
  } catch (e) {
    result.error = e instanceof Error ? e.message : String(e)
  } finally {
    running = false
  }
  if (mode !== 'test') await saveResult(payload, result).catch(() => {})
  return result
}

/** Called hourly by maintenance: incremental update every N hours, full reconcile once a day. */
export async function mlsTick(payload: Payload) {
  const m = await readSettings(payload)
  if (!m.enabled || !m.apiUrl) return
  const last = m.lastSync?.at ? new Date(m.lastSync.at).getTime() : 0
  if (Date.now() - last < (m.syncHours || 6) * 3600_000 - 5 * 60_000) return
  const lastFull = m.lastSync?.lastFullAt ? new Date(m.lastSync.lastFullAt).getTime() : 0
  const full = !m.lastSync?.cursor || Date.now() - lastFull > 24 * 3600_000
  const r = await mlsSync(payload, full ? 'full' : 'update')
  payload.logger.info(`MLS sync (${r.mode}): ${r.created} new, ${r.updated} updated, ${r.removed} removed${r.error ? `, error: ${r.error}` : ''}`)
}
