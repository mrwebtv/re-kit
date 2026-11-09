'use client'
import React, { useState } from 'react'

type Deal = { id: number; title: string; stage: string; value: number; contact: string; agent: string; property: string; updatedAt: string }

export function PipelineBoard({ stages, deals: initial }: { stages: { label: string; value: string }[]; deals: Deal[] }) {
  const [deals, setDeals] = useState(initial)
  const [drag, setDrag] = useState<number | null>(null)
  const [err, setErr] = useState('')
  const move = async (id: number, stage: string) => {
    const prev = deals
    setDeals((d) => d.map((x) => (x.id === id ? { ...x, stage } : x)))
    const r = await fetch(`/api/deals/${id}`, { method: 'PATCH', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ stage }) })
    if (!r.ok) {
      setDeals(prev)
      setErr('Could not move that deal. You may not have access to it.')
    } else setErr('')
  }
  const money = (n: number) => (n ? n.toLocaleString() : '')
  return (
    <div>
      {err && <p style={{ color: 'var(--theme-error-500)' }}>{err}</p>}
      <p style={{ color: 'var(--theme-elevation-500)', marginTop: -12 }}>Drag a card to another column to change its stage. Click a card to open the deal, its notes and tasks.</p>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${stages.length}, minmax(220px, 1fr))`, gap: 12, overflowX: 'auto', paddingBottom: 24 }}>
        {stages.map((s) => {
          const items = deals.filter((d) => d.stage === s.value)
          const total = items.reduce((a, d) => a + (d.value || 0), 0)
          return (
            <div
              key={s.value}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => drag !== null && move(drag, s.value)}
              style={{ background: 'var(--theme-elevation-50)', borderRadius: 8, padding: 10, minHeight: 360 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '4px 4px 10px' }}>
                <strong>{s.label}</strong>
                <span style={{ fontSize: 12, color: 'var(--theme-elevation-500)' }}>{items.length}{total ? ` · ${money(total)}` : ''}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {items.map((d) => (
                  <a
                    key={d.id}
                    href={`/admin/collections/deals/${d.id}`}
                    draggable
                    onDragStart={() => setDrag(d.id)}
                    onDragEnd={() => setDrag(null)}
                    style={{ display: 'block', background: 'var(--theme-elevation-0)', border: '1px solid var(--theme-elevation-150)', borderRadius: 6, padding: '10px 12px', textDecoration: 'none', color: 'inherit', cursor: 'grab' }}
                  >
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{d.contact}</div>
                    {d.property && <div style={{ fontSize: 13, color: 'var(--theme-elevation-600)' }}>{d.property}</div>}
                    <div style={{ fontSize: 12, color: 'var(--theme-elevation-500)', marginTop: 4, display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                      <span>{d.agent}</span>
                      <span>{money(d.value)}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
