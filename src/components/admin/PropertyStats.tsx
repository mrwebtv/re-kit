import type { UIFieldServerProps } from 'payload'
import React from 'react'

/** Views and leads for this listing, last 30 days. Shown in the property sidebar. */
export async function PropertyStats({ id, req }: UIFieldServerProps & { id?: number | string }) {
  if (!id || !req) return null
  const from = new Date(Date.now() - 29 * 86400_000).toISOString().slice(0, 10)
  const since = new Date(`${from}T00:00:00Z`).toISOString()
  const [stats, enq, vw] = await Promise.all([
    req.payload.find({ collection: 'page-stats', where: { and: [{ property: { equals: id } }, { day: { greater_than_equal: from } }] }, limit: 60, depth: 0, overrideAccess: true, pagination: false }),
    req.payload.count({ collection: 'enquiries', where: { and: [{ property: { equals: id } }, { createdAt: { greater_than_equal: since } }] }, overrideAccess: true }),
    req.payload.count({ collection: 'viewings', where: { and: [{ property: { equals: id } }, { createdAt: { greater_than_equal: since } }] }, overrideAccess: true }),
  ])
  const views = stats.docs.reduce((a, s) => a + (s.views || 0), 0)
  const visitors = stats.docs.reduce((a, s) => a + (s.visitors || 0), 0)
  const cell = (k: string, v: number) => (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <strong style={{ fontSize: 20 }}>{v}</strong>
      <span style={{ fontSize: 11, color: 'var(--theme-elevation-500)' }}>{k}</span>
    </div>
  )
  return (
    <div style={{ marginBottom: 24, padding: 12, background: 'var(--theme-elevation-50)', borderRadius: 6 }}>
      <div style={{ fontSize: 12, marginBottom: 8, color: 'var(--theme-elevation-600)' }}>Last 30 days</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {cell('Views', views)}
        {cell('Visitors', visitors)}
        {cell('Enquiries', enq.totalDocs)}
        {cell('Viewings', vw.totalDocs)}
      </div>
      <a href="/admin/analytics" style={{ fontSize: 12 }}>All analytics</a>
    </div>
  )
}
