import type { Payload, Where } from 'payload'
import { esc, getSettingsAdmin, layout, sendMail } from './mailer'
import { mlsTick } from './mls'
import { flush } from './stats'

let started = false
let running = false

/** Every 15 minutes: old leads, search alerts, MLS sync when due, visit stats. */
export function startMaintenance(payload: Payload) {
  if (started || process.env.NEXT_PHASE === 'phase-production-build') return
  started = true
  const tick = () => runMaintenance(payload).catch((err) => payload.logger.error({ err, msg: 'Maintenance failed' }))
  setTimeout(tick, 60_000)
  setInterval(tick, 15 * 60 * 1000).unref?.()
}

export async function runMaintenance(payload: Payload) {
  if (running) return
  running = true
  try {
    const s = await getSettingsAdmin(payload)
    if (s.features?.leadRetention && s.features.leadRetentionMonths) {
      const cutoff = new Date()
      cutoff.setMonth(cutoff.getMonth() - Number(s.features.leadRetentionMonths))
      for (const collection of ['enquiries', 'viewings'] as const) {
        await payload.delete({ collection, where: { createdAt: { less_than: cutoff.toISOString() } }, overrideAccess: true })
      }
    }
    if (s.features?.searchAlerts) await sendSearchAlerts(payload)
    await mlsTick(payload).catch((err) => payload.logger.error({ err, msg: 'MLS sync failed' }))
    await flush(payload)
  } finally {
    running = false
  }
}

type F = { mode?: string; q?: string; type?: string; beds?: string; min?: string; max?: string }

export function whereFor(f: F): Where[] {
  const and: Where[] = []
  if (f.mode === 'rent') and.push({ status: { equals: 'to-let' } })
  else and.push({ status: { equals: 'for-sale' } })
  if (f.q) and.push({ or: [{ title: { like: f.q } }, { 'address.town': { like: f.q } }, { 'address.region': { like: f.q } }, { 'address.postcode': { like: f.q } }] })
  if (f.type) and.push({ propertyType: { equals: f.type } })
  if (f.beds) and.push({ bedrooms: { greater_than_equal: Number(f.beds) } })
  if (f.min) and.push({ price: { greater_than_equal: Number(f.min) } })
  if (f.max) and.push({ price: { less_than_equal: Number(f.max) } })
  return and
}

async function sendSearchAlerts(payload: Payload) {
  const s = await getSettingsAdmin(payload)
  const site = process.env.SITE_URL || ''
  const dayAgo = new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString()
  const { docs } = await payload.find({
    collection: 'search-alerts',
    where: { and: [{ active: { equals: true } }, { lastSentAt: { less_than: dayAgo } }] },
    limit: 500,
    overrideAccess: true,
    showHiddenFields: true,
  })
  for (const alert of docs) {
    const since = alert.lastSentAt || alert.createdAt
    const matches = await payload.find({
      collection: 'properties',
      where: { and: [...whereFor((alert.filters || {}) as F), { createdAt: { greater_than: since } }] },
      limit: 10,
      depth: 0,
      overrideAccess: true,
    })
    if (matches.docs.length) {
      const list = matches.docs
        .map((p) => `<li style="margin-bottom:8px"><a href="${site}/properties/${p.slug}">${esc(p.title)}</a>${p.address?.town ? `, ${esc(p.address.town)}` : ''}</li>`)
        .join('')
      await sendMail(payload, {
        to: alert.email,
        subject: `${matches.docs.length} new ${matches.docs.length === 1 ? 'home matches' : 'homes match'} your search`,
        html: layout(s, `<p>New homes matching <strong>${esc(alert.summary || 'your search')}</strong>:</p><ul>${list}</ul><p style="font-size:12px;color:#777"><a href="${site}/alerts/unsubscribe?token=${alert.token}">Unsubscribe</a></p>`),
      }, s)
    }
    await payload.update({ collection: 'search-alerts', id: alert.id, data: { lastSentAt: new Date().toISOString() }, overrideAccess: true })
  }
}
