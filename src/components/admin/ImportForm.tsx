'use client'
import React, { useState } from 'react'

type Result = { ok: boolean; format: string; rows: number; created: number; updated: number; skipped: number; errors: string[]; unmapped: string[]; preview: Record<string, unknown>[]; error?: string }

export function ImportForm() {
  const [file, setFile] = useState<File | null>(null)
  const [opts, setOpts] = useState({ downloadPhotos: false, updateExisting: true })
  const [busy, setBusy] = useState(false)
  const [res, setRes] = useState<Result | null>(null)
  const [tested, setTested] = useState(false)
  const run = async (dryRun: boolean) => {
    if (!file) return
    setBusy(true)
    setRes(null)
    const content = await file.text()
    const r = await fetch('/api/import-listings', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ filename: file.name, content, dryRun, ...opts }) })
    const j = (await r.json()) as Result
    setRes(j)
    setBusy(false)
    if (dryRun) setTested(true)
  }
  const sample = 'reference,title,status,type,price,bedrooms,bathrooms,area,address,town,postcode,lat,lng,description,features,photos\nA-101,Garden house,for sale,house,450000,3,2,140,12 Elm Road,Dublin,D06 X1,53.32,-6.26,"Bright family home.",Garden|Parking,https://example.com/1.jpg|https://example.com/2.jpg\n'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 760, paddingBottom: 48 }}>
      <input type="file" accept=".csv,.xml,.txt,.tsv" onChange={(e) => { setFile(e.target.files?.[0] || null); setTested(false); setRes(null) }} />
      <label style={{ display: 'flex', gap: 8 }}><input type="checkbox" checked={opts.updateExisting} onChange={(e) => setOpts({ ...opts, updateExisting: e.target.checked })} /> Update listings that already exist (matched by reference)</label>
      <label style={{ display: 'flex', gap: 8 }}><input type="checkbox" checked={opts.downloadPhotos} onChange={(e) => setOpts({ ...opts, downloadPhotos: e.target.checked })} /> Copy photos into the media library (slower, up to 20 per listing). Off = photos load from their original links.</label>
      <div style={{ display: 'flex', gap: 10 }}>
        <button type="button" className="btn btn--style-secondary btn--size-small" style={{ margin: 0 }} disabled={!file || busy} onClick={() => run(true)}>{busy ? 'Working…' : 'Test the file'}</button>
        <button type="button" className="btn btn--style-primary btn--size-small" style={{ margin: 0 }} disabled={!file || busy || !tested} onClick={() => run(false)}>Import</button>
        <a className="btn btn--style-secondary btn--size-small" style={{ margin: 0 }} href={`data:text/csv;charset=utf-8,${encodeURIComponent(sample)}`} download="listings-template.csv">Download a CSV template</a>
      </div>
      {res?.error && <p style={{ color: 'var(--theme-error-500)' }}>{res.error}</p>}
      {res && !res.error && (
        <div style={{ background: 'var(--theme-elevation-50)', borderRadius: 8, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <strong>{res.format}: {res.rows} listings found{res.created || res.updated || res.skipped ? `. Created ${res.created}, updated ${res.updated}, skipped ${res.skipped}.` : ''}</strong>
          {res.preview.length > 0 && (
            <table style={{ fontSize: 13, borderCollapse: 'collapse' }}>
              <thead><tr style={{ textAlign: 'left' }}>{Object.keys(res.preview[0]!).map((k) => <th key={k} style={{ paddingRight: 12 }}>{k}</th>)}</tr></thead>
              <tbody>{res.preview.map((r, i) => <tr key={i}>{Object.values(r).map((v, j) => <td key={j} style={{ paddingRight: 12, borderTop: '1px solid var(--theme-elevation-100)' }}>{String(v ?? '')}</td>)}</tr>)}</tbody>
            </table>
          )}
          {res.unmapped.length > 0 && <span style={{ fontSize: 13 }}>Columns not used: {res.unmapped.join(', ')}</span>}
          {res.errors.length > 0 && <ul style={{ color: 'var(--theme-error-500)', fontSize: 13 }}>{res.errors.map((e) => <li key={e}>{e}</li>)}</ul>}
          {tested && !res.created && !res.updated && <span style={{ fontSize: 13 }}>Looks right? Press Import.</span>}
        </div>
      )}
    </div>
  )
}
