import type { AdminViewServerProps } from 'payload'
import React from 'react'
import { AdminShell } from './shell'

type Stat = { day: string; path: string; property?: number | { id: number; title: string } | null; agent?: number | { id: number; name: string } | null; views?: number | null; visitors?: number | null; devices?: unknown; referrers?: unknown }

const add = (o: Record<string, number>, k: string, v: number) => ((o[k] = (o[k] || 0) + v), o)

function Bars({ rows, max }: { rows: [string, number][]; max?: number }) {
  const top = max || Math.max(1, ...rows.map((r) => r[1]))
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {rows.length === 0 && <span style={{ color: 'var(--theme-elevation-500)' }}>No data yet.</span>}
      {rows.map(([k, v]) => (
        <div key={k} style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 2fr) 3fr 60px', gap: 10, alignItems: 'center', fontSize: 13 }}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={k}>{k}</span>
          <span style={{ background: 'var(--theme-elevation-100)', borderRadius: 3, height: 10 }}><span style={{ display: 'block', height: 10, borderRadius: 3, width: `${(v / top) * 100}%`, background: 'var(--theme-success-500)' }} /></span>
          <span style={{ textAlign: 'right' }}>{v.toLocaleString()}</span>
        </div>
      ))}
    </div>
  )
}

const card: React.CSSProperties = { background: 'var(--theme-elevation-50)', borderRadius: 8, padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }

export async function AnalyticsView(props: AdminViewServerProps) {
  const { req } = props.initPageResult
  const sp = (props.searchParams || {}) as Record<string, string>
  const days = [7, 30, 90].includes(Number(sp.days)) ? Number(sp.days) : 30
  const from = new Date(Date.now() - (days - 1) * 86400_000).toISOString().slice(0, 10)
  const { docs } = await req.payload.find({ collection: 'page-stats', where: { day: { greater_than_equal: from } }, limit: 20000, depth: 1, req, overrideAccess: false, pagination: false })
  const stats = docs as unknown as Stat[]
  const since = new Date(`${from}T00:00:00Z`).toISOString()
  const leadWhere = { createdAt: { greater_than_equal: since } }
  const [enq, view] = await Promise.all([
    req.payload.find({ collection: 'enquiries', where: leadWhere, limit: 5000, depth: 0, req, overrideAccess: false, pagination: false, select: { property: true } }),
    req.payload.find({ collection: 'viewings', where: leadWhere, limit: 5000, depth: 0, req, overrideAccess: false, pagination: false, select: { property: true } }),
  ])
  const leadsBy: Record<number, number> = {}
  for (const l of [...enq.docs, ...view.docs]) if (l.property) leadsBy[l.property as number] = (leadsBy[l.property as number] || 0) + 1

  const perDay: Record<string, number> = {}
  const devices: Record<string, number> = {}
  const refs: Record<string, number> = {}
  const pages: Record<string, number> = {}
  const listings: Record<string, { title: string; views: number; leads: number; id: number }> = {}
  const agents: Record<string, number> = {}
  let views = 0
  let visitors = 0
  for (const s of stats) {
    const v = s.views || 0
    views += v
    visitors += s.visitors || 0
    add(perDay, s.day, v)
    add(pages, s.path, v)
    for (const [k, n] of Object.entries((s.devices as Record<string, number>) || {})) add(devices, k, n)
    for (const [k, n] of Object.entries((s.referrers as Record<string, number>) || {})) add(refs, k, n)
    if (s.property && typeof s.property === 'object') {
      const p = s.property
      listings[p.id] ||= { title: p.title, views: 0, leads: leadsBy[p.id] || 0, id: p.id }
      listings[p.id]!.views += v
    }
    if (s.agent && typeof s.agent === 'object') add(agents, s.agent.name, v)
  }
  const series: [string, number][] = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400_000).toISOString().slice(0, 10)
    series.push([d, perDay[d] || 0])
  }
  const peak = Math.max(1, ...series.map((x) => x[1]))
  const sort = (o: Record<string, number>, n = 10) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n)
  const leadsTotal = enq.docs.length + view.docs.length
  return (
    <AdminShell props={props} title="Analytics">
      <div style={{ display: 'flex', gap: 8, marginTop: -12, marginBottom: 20 }}>
        {[7, 30, 90].map((d) => (
          <a key={d} href={`/admin/analytics?days=${d}`} className={`btn btn--size-small ${d === days ? 'btn--style-primary' : 'btn--style-secondary'}`} style={{ margin: 0 }}>
            Last {d} days
          </a>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 16 }}>
        {[['Page views', views], ['Visitors', visitors], ['Leads', leadsTotal], ['Conversion', views ? `${((leadsTotal / Math.max(1, visitors)) * 100).toFixed(1)}%` : '0%']].map(([k, v]) => (
          <div key={k as string} style={card}>
            <span style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--theme-elevation-500)' }}>{k}</span>
            <strong style={{ fontSize: 30 }}>{typeof v === 'number' ? v.toLocaleString() : v}</strong>
          </div>
        ))}
      </div>
      <div style={{ ...card, marginBottom: 16 }}>
        <strong>Views per day</strong>
        <svg viewBox={`0 0 ${series.length * 10} 100`} preserveAspectRatio="none" style={{ width: '100%', height: 160 }} role="img" aria-label="Views per day">
          {series.map(([d, v], i) => (
            <rect key={d} x={i * 10 + 1} y={100 - (v / peak) * 96} width={8} height={(v / peak) * 96} fill="var(--theme-success-500)" rx={1}>
              <title>{`${d}: ${v}`}</title>
            </rect>
          ))}
        </svg>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--theme-elevation-500)' }}>
          <span>{series[0]?.[0]}</span>
          <span>{series.at(-1)?.[0]}</span>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16, paddingBottom: 40 }}>
        <div style={card}>
          <strong>Listings</strong>
          <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
            <thead><tr style={{ textAlign: 'left', color: 'var(--theme-elevation-500)' }}><th>Property</th><th style={{ textAlign: 'right' }}>Views</th><th style={{ textAlign: 'right' }}>Leads</th></tr></thead>
            <tbody>
              {Object.values(listings).sort((a, b) => b.views - a.views).slice(0, 15).map((l) => (
                <tr key={l.id} style={{ borderTop: '1px solid var(--theme-elevation-100)' }}>
                  <td style={{ padding: '6px 0' }}><a href={`/admin/collections/properties/${l.id}`}>{l.title}</a></td>
                  <td style={{ textAlign: 'right' }}>{l.views}</td>
                  <td style={{ textAlign: 'right' }}>{l.leads}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {Object.keys(listings).length === 0 && <span style={{ color: 'var(--theme-elevation-500)' }}>No listing views yet.</span>}
        </div>
        <div style={card}><strong>Views by agent</strong><Bars rows={sort(agents)} /></div>
        <div style={card}><strong>Where visitors come from</strong><Bars rows={sort(refs)} /></div>
        <div style={card}><strong>Devices</strong><Bars rows={sort(devices)} /></div>
        <div style={card}><strong>Top pages</strong><Bars rows={sort(pages, 12)} /></div>
      </div>
      <p style={{ color: 'var(--theme-elevation-500)', fontSize: 13, paddingBottom: 40 }}>Counted on your own server without cookies or IP addresses, so no consent banner is needed. Bots are excluded. Figures update every few minutes.</p>
    </AdminShell>
  )
}
