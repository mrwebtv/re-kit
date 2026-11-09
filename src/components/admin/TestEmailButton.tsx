'use client'
import React, { useState } from 'react'

export const TestEmailButton: React.FC = () => {
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  return (
    <div style={{ marginBottom: 24 }}>
      <button
        type="button"
        className="btn btn--style-secondary btn--size-small"
        style={{ margin: 0 }}
        disabled={busy}
        onClick={async () => {
          setBusy(true)
          setMsg('Sending…')
          try {
            const r = await fetch('/api/test-email', { method: 'POST', credentials: 'include' })
            const j = await r.json()
            setMsg(j.message || j.error)
          } catch {
            setMsg('Could not reach the server.')
          }
          setBusy(false)
        }}
      >
        Send a test email
      </button>
      <span style={{ marginLeft: 12 }}>{msg || 'Save your SMTP details first, then test them.'}</span>
    </div>
  )
}
