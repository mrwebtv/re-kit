'use client'
import { useEffect, useState, type FormEvent } from 'react'
import { useHref, useSite, useT } from '../i18n/client'
import { useCaptcha } from './Captcha'

type Kind = 'viewing' | 'property' | 'valuation' | 'contact' | 'signup'

type Slots = { enabled: boolean; tz?: string; days?: { date: string; slots: string[] }[] }

/** Day and time chips from Site Settings > Viewings. */
function SlotPicker({ propertyId, value, onChange }: { propertyId: number; value: string; onChange: (v: string) => void }) {
  const t = useT()
  const { intl } = useSite()
  const [data, setData] = useState<Slots | null>(null)
  const [day, setDay] = useState(0)
  useEffect(() => {
    fetch(`/api/viewing-slots?property=${propertyId}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({ enabled: false }))
  }, [propertyId])
  if (!data) return <p className="rk-muted" style={{ margin: 0 }}>{t('Loading times…')}</p>
  if (!data.enabled) return null
  if (!data.days?.length) return <p className="rk-muted" style={{ margin: 0 }}>{t('No viewing times are free right now. Send a question and the agent will suggest one.')}</p>
  const tz = data.tz || 'UTC'
  const d = data.days[day]!
  const dayLabel = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString(intl, { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' })
  return (
    <fieldset className="rk-slots">
      <legend>{t('Pick a day and time')}</legend>
      <div className="rk-slot-days" role="radiogroup" aria-label={t('Day')}>
        {data.days.map((x, i) => (
          <button key={x.date} type="button" role="radio" aria-checked={i === day} className={i === day ? 'is-on' : ''} onClick={() => { setDay(i); onChange('') }}>
            {dayLabel(x.date)}
          </button>
        ))}
      </div>
      <div className="rk-slot-times" role="radiogroup" aria-label={t('Time')}>
        {d.slots.map((iso) => (
          <button key={iso} type="button" role="radio" aria-checked={value === iso} className={value === iso ? 'is-on' : ''} onClick={() => onChange(iso)}>
            {new Date(iso).toLocaleTimeString(intl, { hour: '2-digit', minute: '2-digit', timeZone: tz })}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

/** Posts to the Enquiries / Viewings collections, which email the agent and the visitor. */
export function LeadForm({ kind, propertyId, submitLabel, compact, slotsEnabled }: { kind: Kind; propertyId?: number; submitLabel?: string; compact?: boolean; consentText?: string; slotsEnabled?: boolean }) {
  const t = useT()
  const L = useHref()
  const { consentText } = useSite()
  const captcha = useCaptcha()
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState('')
  const [slot, setSlot] = useState('')

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const get = (k: string) => (fd.get(k) as string | null)?.trim() || undefined
    const isViewing = kind === 'viewing'
    if (isViewing && slotsEnabled && !slot) {
      setState('error')
      setError(t('Please pick a time.'))
      return
    }
    const captchaToken = await captcha.getToken()
    const base = { name: get('name'), email: get('email'), phone: get('phone'), message: get('message'), website: get('website'), consent: fd.get('consent') === 'on', captchaToken }
    const when = slotsEnabled ? slot : get('preferredDate') ? new Date(get('preferredDate')!).toISOString() : undefined
    const body = isViewing ? { ...base, property: propertyId, preferredDate: when } : { ...base, type: kind, property: propertyId, propertyAddress: get('propertyAddress') }
    setState('sending')
    setError('')
    try {
      const res = await fetch(`/api/${isViewing ? 'viewings' : 'enquiries'}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j?.errors?.[0]?.message || t('Something went wrong. Please try again.'))
      }
      setState('sent')
    } catch (err) {
      setState('error')
      setError(err instanceof Error ? err.message : t('Something went wrong.'))
      captcha.reset()
    }
  }

  if (state === 'sent') {
    return (
      <div className="rk-form-done" role="status">
        <strong>{t('Thank you.')}</strong>
        <span>{kind === 'viewing' ? t('Your viewing request is with the agent, who will confirm by email or phone.') : kind === 'signup' ? t('You are on the list. We will be in touch.') : t('Your message is with us. We reply within one working day.')}</span>
      </div>
    )
  }

  const id = (k: string) => `${kind}-${k}`
  return (
    <form className={`rk-form${compact ? ' is-compact' : ''}`} onSubmit={onSubmit}>
      {kind !== 'signup' && <div className="rk-field"><label htmlFor={id('name')}>{t('Full name')}</label><input id={id('name')} name="name" required autoComplete="name" /></div>}
      <div className="rk-field"><label htmlFor={id('email')}>{t('Email')}</label><input id={id('email')} name="email" type="email" required autoComplete="email" /></div>
      {kind !== 'signup' && <div className="rk-field"><label htmlFor={id('phone')}>{t('Phone')}</label><input id={id('phone')} name="phone" type="tel" autoComplete="tel" /></div>}
      {kind === 'viewing' && propertyId && slotsEnabled && <SlotPicker propertyId={propertyId} value={slot} onChange={setSlot} />}
      {kind === 'viewing' && !slotsEnabled && (
        <div className="rk-field"><label htmlFor={id('date')}>{t('Preferred date and time')}</label><input id={id('date')} name="preferredDate" type="datetime-local" required /></div>
      )}
      {kind === 'valuation' && (
        <div className="rk-field"><label htmlFor={id('addr')}>{t('Property address')}</label><input id={id('addr')} name="propertyAddress" required autoComplete="street-address" /></div>
      )}
      {kind !== 'signup' && (
        <div className="rk-field"><label htmlFor={id('msg')}>{kind === 'contact' || kind === 'property' ? t('Message') : t('Message (optional)')}</label><textarea id={id('msg')} name="message" rows={compact ? 3 : 4} required={kind === 'contact' || kind === 'property'} /></div>
      )}
      <div aria-hidden="true" className="rk-hp">
        <label htmlFor={id('website')}>Leave this empty</label>
        <input id={id('website')} name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <label className="rk-consent">
        <input type="checkbox" name="consent" required />
        <span>{consentText || t('I agree to my details being used to answer this request.')} <a href={L('/privacy')} target="_blank">{t('Privacy policy')}</a></span>
      </label>
      {captcha.node}
      {state === 'error' && <p className="rk-form-error" role="alert">{error}</p>}
      <button type="submit" className="rk-btn rk-btn-primary" disabled={state === 'sending'}>
        {state === 'sending' ? t('Sending…') : submitLabel || t('Send')}
      </button>
    </form>
  )
}

/** Viewing / question tabs on a property page. */
export function PropertyContact({ propertyId, slotsEnabled }: { propertyId: number; slotsEnabled?: boolean }) {
  const t = useT()
  const [tab, setTab] = useState<'viewing' | 'property'>('viewing')
  return (
    <div className="rk-contact">
      <div role="tablist" aria-label={t('Enquiry type')} className="rk-tabs">
        <button type="button" role="tab" aria-selected={tab === 'viewing'} className={tab === 'viewing' ? 'is-active' : ''} onClick={() => setTab('viewing')}>{t('Book a viewing')}</button>
        <button type="button" role="tab" aria-selected={tab === 'property'} className={tab === 'property' ? 'is-active' : ''} onClick={() => setTab('property')}>{t('Ask a question')}</button>
      </div>
      <LeadForm key={tab} kind={tab} propertyId={propertyId} slotsEnabled={slotsEnabled} submitLabel={tab === 'viewing' ? t('Request viewing') : t('Send question')} compact />
    </div>
  )
}
