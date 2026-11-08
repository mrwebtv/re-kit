'use client'
import { useState, type FormEvent } from 'react'

type Kind = 'viewing' | 'property' | 'valuation' | 'contact'

/** Posts to the Enquiries / Viewings collections, which email the agent and the visitor. */
export function LeadForm({ kind, propertyId, submitLabel, compact }: { kind: Kind; propertyId?: number; submitLabel?: string; compact?: boolean }) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState('')

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const get = (k: string) => (fd.get(k) as string | null)?.trim() || undefined
    const base = { name: get('name'), email: get('email'), phone: get('phone'), message: get('message'), website: get('website') }
    const isViewing = kind === 'viewing'
    const body = isViewing
      ? { ...base, property: propertyId, preferredDate: get('preferredDate') ? new Date(get('preferredDate')!).toISOString() : undefined }
      : { ...base, type: kind, property: propertyId, propertyAddress: get('propertyAddress') }
    setState('sending')
    setError('')
    try {
      const res = await fetch(`/api/${isViewing ? 'viewings' : 'enquiries'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j?.errors?.[0]?.message || 'Something went wrong. Please try again.')
      }
      setState('sent')
    } catch (err) {
      setState('error')
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  if (state === 'sent') {
    return (
      <div className="rk-form-done" role="status">
        <strong>Thank you.</strong>
        <span>{kind === 'viewing' ? 'Your viewing request is with the agent, who will confirm by email or phone.' : 'Your message is with us. We reply within one working day.'}</span>
      </div>
    )
  }

  const id = (k: string) => `${kind}-${k}`
  return (
    <form className={`rk-form${compact ? ' is-compact' : ''}`} onSubmit={onSubmit}>
      <div className="rk-field"><label htmlFor={id('name')}>Full name</label><input id={id('name')} name="name" required autoComplete="name" /></div>
      <div className="rk-field"><label htmlFor={id('email')}>Email</label><input id={id('email')} name="email" type="email" required autoComplete="email" /></div>
      <div className="rk-field"><label htmlFor={id('phone')}>Phone</label><input id={id('phone')} name="phone" type="tel" autoComplete="tel" /></div>
      {kind === 'viewing' && (
        <div className="rk-field"><label htmlFor={id('date')}>Preferred date and time</label><input id={id('date')} name="preferredDate" type="datetime-local" required /></div>
      )}
      {kind === 'valuation' && (
        <div className="rk-field"><label htmlFor={id('addr')}>Property address</label><input id={id('addr')} name="propertyAddress" required autoComplete="street-address" /></div>
      )}
      <div className="rk-field"><label htmlFor={id('msg')}>{kind === 'contact' || kind === 'property' ? 'Message' : 'Message (optional)'}</label><textarea id={id('msg')} name="message" rows={4} required={kind === 'contact' || kind === 'property'} /></div>
      <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
        <label htmlFor={id('website')}>Leave this empty</label>
        <input id={id('website')} name="website" tabIndex={-1} autoComplete="off" />
      </div>
      {state === 'error' && <p className="rk-form-error" role="alert">{error}</p>}
      <button type="submit" className="rk-btn rk-btn-primary" disabled={state === 'sending'}>
        {state === 'sending' ? 'Sending…' : submitLabel || 'Send'}
      </button>
      <p className="rk-form-note">Your details are only used to answer this request.</p>
    </form>
  )
}

/** Viewing / question tabs on a property page. */
export function PropertyContact({ propertyId }: { propertyId: number }) {
  const [tab, setTab] = useState<'viewing' | 'property'>('viewing')
  return (
    <div className="rk-contact">
      <div role="tablist" aria-label="Enquiry type" className="rk-tabs">
        <button type="button" role="tab" aria-selected={tab === 'viewing'} className={tab === 'viewing' ? 'is-active' : ''} onClick={() => setTab('viewing')}>Book a viewing</button>
        <button type="button" role="tab" aria-selected={tab === 'property'} className={tab === 'property' ? 'is-active' : ''} onClick={() => setTab('property')}>Ask a question</button>
      </div>
      <LeadForm key={tab} kind={tab} propertyId={propertyId} submitLabel={tab === 'viewing' ? 'Request viewing' : 'Send question'} compact />
    </div>
  )
}
