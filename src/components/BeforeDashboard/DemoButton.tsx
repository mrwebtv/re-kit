'use client'
import React, { useState } from 'react'

export const DemoButton: React.FC = () => {
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [msg, setMsg] = useState('')
  const run = async () => {
    if (state === 'loading') return
    setState('loading')
    setMsg('Downloading demo photos and creating listings, this takes about a minute…')
    try {
      const res = await fetch('/api/seed-demo', { method: 'POST', credentials: 'include' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed')
      setState('done')
      setMsg(json.message)
    } catch (e) {
      setState('error')
      setMsg(e instanceof Error ? e.message : 'Failed')
    }
  }
  return (
    <span>
      <button type="button" className="btn btn--style-primary btn--size-small" onClick={run} disabled={state === 'loading'} style={{ margin: 0 }}>
        {state === 'loading' ? 'Loading demo content…' : 'Load demo content'}
      </button>
      {msg && <span style={{ marginLeft: 12 }}>{msg}</span>}
    </span>
  )
}
