'use client'
import { useFormFields } from '@payloadcms/ui'
import React, { useState } from 'react'

type R = { ok: boolean; mode: string; at: string; fetched: number; created: number; updated: number; removed: number; error?: string; sample?: string[] }

export function MlsPanel() {
  const last = useFormFields(([fields]) => fields['mls.lastSync']?.value) as R | undefined
  const [busy, setBusy] = useState('')
  const [res, setRes] = useState<R | null>(null)
  const go = async (mode: 'test' | 'update' | 'full') => {
    setBusy(mode)
    const r = await fetch(`/api/mls-sync?mode=${mode}`, { method: 'POST', credentials: 'include' })
    setRes(await r.json())
    setBusy('')
  }
  const show = res || last
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
      <span style={{ fontSize: 13, color: 'var(--theme-elevation-500)' }}>Save your settings first. Syncs run automatically at the interval above; a full check removes listings that left the MLS once a day.</span>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button type="button" className="btn btn--style-secondary btn--size-small" style={{ margin: 0 }} disabled={Boolean(busy)} onClick={() => go('test')}>{busy === 'test' ? 'Testing…' : 'Test connection'}</button>
        <button type="button" className="btn btn--style-secondary btn--size-small" style={{ margin: 0 }} disabled={Boolean(busy)} onClick={() => go('update')}>{busy === 'update' ? 'Syncing…' : 'Sync new changes now'}</button>
        <button type="button" className="btn btn--style-secondary btn--size-small" style={{ margin: 0 }} disabled={Boolean(busy)} onClick={() => go('full')}>{busy === 'full' ? 'Running full sync…' : 'Full sync now'}</button>
      </div>
      {show && (
        <div style={{ fontSize: 13, background: 'var(--theme-elevation-50)', padding: 12, borderRadius: 6 }}>
          {show.error ? <span style={{ color: 'var(--theme-error-500)' }}>Last run failed: {show.error}</span> : show.mode === 'test' ? <span>Connected. Sample: {(show.sample || []).join('; ') || 'no listings matched the filter'}</span> : <span>Last {show.mode} sync {new Date(show.at).toLocaleString()}: {show.fetched} received, {show.created} new, {show.updated} updated, {show.removed} removed.</span>}
        </div>
      )}
    </div>
  )
}
