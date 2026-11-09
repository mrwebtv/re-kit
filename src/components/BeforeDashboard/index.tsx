import type { Payload } from 'payload'
import React from 'react'
import { DemoButton } from './DemoButton'
import { Backups } from './Backups'
import './index.scss'

type U = { name?: string | null; email?: string; role?: string | null; agent?: number | { id: number } | null } | null | undefined

const money = (n: number, sym: string) => `${sym}${n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M` : n >= 10_000 ? `${Math.round(n / 1000)}K` : n.toLocaleString('en-GB')}`

const Icon = ({ d }: { d: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
)
const I = {
  home: 'M3 11l9-7 9 7v10H3zM9 21v-6h6v6',
  inbox: 'M3 13h5l2 3h4l2-3h5M5 5h14l2 8v6H3v-6z',
  chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  plus: 'M12 5v14M5 12h14',
  board: 'M4 4h5v16H4zM10 4h5v10h-5zM16 4h4v7h-4z',
  gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z',
  globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18',
  page: 'M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h7',
}

/** Dashboard overview: numbers that matter, quick actions, latest leads, setup. */
export default async function BeforeDashboard({ payload, user }: { payload: Payload; user?: U }) {
  const now = Date.now()
  const week = new Date(now - 7 * 86400_000).toISOString()
  const month = new Date(now - 29 * 86400_000).toISOString().slice(0, 10)
  const agentOnly = user?.role === 'agent'
  const agentId = user?.agent && typeof user.agent === 'object' ? user.agent.id : (user?.agent as number | undefined)
  const own = (field: string) => (agentOnly ? [{ [field]: { equals: agentId ?? -1 } }] : [])
  const [s, live, enqW, viewW, deals, stats, recentE, recentV] = await Promise.all([
    payload.findGlobal({ slug: 'site-settings', depth: 0 }),
    payload.count({ collection: 'properties', where: { and: [{ status: { in: ['for-sale', 'to-let'] } }, ...own('agent')] } }),
    payload.count({ collection: 'enquiries', where: { and: [{ createdAt: { greater_than: week } }, ...own('property.agent')] } }),
    payload.count({ collection: 'viewings', where: { and: [{ createdAt: { greater_than: week } }, ...own('property.agent')] } }),
    payload.find({ collection: 'deals', where: { and: [{ stage: { not_in: ['completed', 'lost'] } }, ...own('agent')] }, limit: 1000, depth: 0, pagination: false, select: { value: true, stage: true } }),
    payload.find({ collection: 'page-stats', where: { and: [{ day: { greater_than_equal: month } }, ...own('agent')] }, limit: 20000, depth: 0, pagination: false, select: { views: true, day: true } }),
    payload.find({ collection: 'enquiries', where: { and: own('property.agent') }, limit: 5, depth: 1, sort: '-createdAt' }),
    payload.find({ collection: 'viewings', where: { and: own('property.agent') }, limit: 5, depth: 1, sort: '-createdAt' }),
  ])
  const sym = s.currencySymbol || '$'
  const pipeline = deals.docs.reduce((a, d) => a + (d.value || 0), 0)
  const views = stats.docs.reduce((a, d) => a + (d.views || 0), 0)
  const perDay: Record<string, number> = {}
  for (const d of stats.docs) perDay[d.day] = (perDay[d.day] || 0) + (d.views || 0)
  const spark = Array.from({ length: 30 }, (_, i) => perDay[new Date(now - (29 - i) * 86400_000).toISOString().slice(0, 10)] || 0)
  const peak = Math.max(1, ...spark)
  const leads = [
    ...recentE.docs.map((e) => ({ id: e.id, kind: 'enquiries', label: e.type === 'valuation' ? 'Valuation' : e.type === 'contact' ? 'Contact' : e.type === 'signup' ? 'Signup' : 'Enquiry', name: e.name || e.email, about: e.property && typeof e.property === 'object' ? e.property.title : e.propertyAddress || '', at: e.createdAt })),
    ...recentV.docs.map((v) => ({ id: v.id, kind: 'viewings', label: 'Viewing', name: v.name, about: v.property && typeof v.property === 'object' ? v.property.title : '', at: v.createdAt })),
  ]
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 6)
  const hour = new Date().getUTCHours()
  const hello = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const first = (user?.name || '').split(' ')[0]
  const ago = (iso: string) => {
    const m = Math.round((now - new Date(iso).getTime()) / 60000)
    return m < 60 ? `${m}m ago` : m < 1440 ? `${Math.round(m / 60)}h ago` : `${Math.round(m / 1440)}d ago`
  }
  const cards = [
    { k: 'Live listings', v: live.totalDocs.toLocaleString('en-GB'), href: '/admin/collections/properties', icon: I.home },
    { k: 'New leads, 7 days', v: String(enqW.totalDocs + viewW.totalDocs), sub: `${viewW.totalDocs} viewings`, href: '/admin/collections/enquiries', icon: I.inbox },
    { k: 'Open pipeline', v: money(pipeline, sym), sub: `${deals.docs.length} deals`, href: '/admin/pipeline', icon: I.board },
    { k: 'Visits, 30 days', v: views.toLocaleString('en-GB'), href: '/admin/analytics', icon: I.eye, spark: true },
  ]
  const actions = [
    { label: 'Add a property', href: '/admin/collections/properties/create', icon: I.plus },
    { label: 'Pipeline board', href: '/admin/pipeline', icon: I.board },
    { label: 'New page', href: '/admin/collections/pages/create', icon: I.page },
    ...(agentOnly ? [] : [{ label: 'Site settings', href: '/admin/globals/site-settings', icon: I.gear }]),
    { label: 'View website', href: '/', icon: I.globe, external: true },
  ]
  return (
    <div className="rk-dash">
      <header className="rk-dash__head">
        <div>
          <p className="rk-dash__eyebrow">{s.agencyName || 'Your agency'}</p>
          <h1>{hello}{first ? `, ${first}` : ''}.</h1>
        </div>
        <div className="rk-dash__actions">
          {actions.map((a) => (
            <a key={a.href} href={a.href} target={'external' in a ? '_blank' : undefined} rel="noopener" className="rk-dash__action">
              <Icon d={a.icon} />
              <span>{a.label}</span>
            </a>
          ))}
        </div>
      </header>

      <section className="rk-dash__stats">
        {cards.map((c) => (
          <a key={c.k} href={c.href} className="rk-dash__stat">
            <span className="rk-dash__stat-icon"><Icon d={c.icon} /></span>
            <span className="rk-dash__stat-k">{c.k}</span>
            <strong>{c.v}</strong>
            {c.sub && <span className="rk-dash__stat-sub">{c.sub}</span>}
            {c.spark && (
              <svg className="rk-dash__spark" viewBox="0 0 300 40" preserveAspectRatio="none" aria-hidden="true">
                <polyline fill="none" stroke="currentColor" strokeWidth="2" points={spark.map((v, i) => `${i * (300 / 29)},${38 - (v / peak) * 34}`).join(' ')} />
              </svg>
            )}
          </a>
        ))}
      </section>

      <section className="rk-dash__grid">
        <div className="rk-dash__panel">
          <div className="rk-dash__panel-head">
            <h2>Latest leads</h2>
            <a href="/admin/collections/enquiries">All leads</a>
          </div>
          {leads.length === 0 ? (
            <p className="rk-dash__empty">No leads yet. They appear here the moment someone books a viewing or sends an enquiry.</p>
          ) : (
            <ul className="rk-dash__leads">
              {leads.map((l) => (
                <li key={`${l.kind}${l.id}`}>
                  <a href={`/admin/collections/${l.kind}/${l.id}`}>
                    <span className={`rk-dash__tag rk-dash__tag--${l.label.toLowerCase()}`}>{l.label}</span>
                    <span className="rk-dash__lead-name">{l.name}</span>
                    <span className="rk-dash__lead-about">{l.about}</span>
                    <span className="rk-dash__lead-at">{ago(l.at)}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        {!agentOnly && (
          <div className="rk-dash__panel">
            <div className="rk-dash__panel-head"><h2>Setup</h2></div>
            <ol className="rk-dash__setup">
              <li><DemoButton /> <span>8 sample homes, a development, pages, articles and photos. Remove them any time.</span></li>
              <li><a href="/admin/globals/site-settings">Site Settings</a> <span>Pick one of 4 designs, add your logo, contact details and email, and switch on extras.</span></li>
              <li><a href="/admin/collections/agents">Agents</a> and <a href="/admin/collections/properties">properties</a> <span>Leads go straight to the listing&apos;s agent.</span></li>
              <li><a href="/admin/collections/pages">Pages</a> and <a href="/admin/collections/posts">blog</a> <span>Start from a ready-made template.</span></li>
            </ol>
            <Backups />
          </div>
        )}
      </section>
    </div>
  )
}
