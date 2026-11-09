'use client'
import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useHref, useSite, useT } from '../i18n/client'
import { useCaptcha } from './Captcha'

/* ---------------- Share ---------------- */

export function ShareButtons({ url, title, brochureHref }: { url: string; title: string; brochureHref?: string }) {
  const t = useT()
  const [copied, setCopied] = useState(false)
  const [canNative, setCanNative] = useState(false)
  const [full, setFull] = useState(url)
  useEffect(() => {
    setCanNative(typeof navigator !== 'undefined' && 'share' in navigator)
    setFull(new URL(url, window.location.origin).toString())
  }, [url])
  const enc = encodeURIComponent
  const links = [
    { label: 'WhatsApp', href: `https://wa.me/?text=${enc(`${title} ${full}`)}` },
    { label: t('Email'), href: `mailto:?subject=${enc(title)}&body=${enc(full)}` },
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${enc(full)}` },
    { label: 'X', href: `https://x.com/intent/post?url=${enc(full)}&text=${enc(title)}` },
  ]
  return (
    <div className="rk-share">
      {brochureHref && (
        <a className="rk-btn rk-btn-outline rk-share-pdf" href={brochureHref} target="_blank" rel="noopener">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></svg>
          {t('Download brochure')}
        </a>
      )}
      <div className="rk-share-row" aria-label={t('Share this property')}>
        <span className="rk-share-label">{t('Share')}</span>
        {canNative && (
          <button type="button" onClick={() => navigator.share({ title, url: full }).catch(() => {})}>{t('Share…')}</button>
        )}
        {links.map((l) => (
          <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a>
        ))}
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(full)
              setCopied(true)
              setTimeout(() => setCopied(false), 2000)
            } catch {}
          }}
        >
          {copied ? t('Link copied') : t('Copy link')}
        </button>
        <button type="button" onClick={() => window.print()}>{t('Print')}</button>
      </div>
    </div>
  )
}

/* ---------------- Mortgage calculator ---------------- */

export function MortgageCalculator({ price, symbol, rate: r0, years: y0, deposit: d0 }: { price: number; symbol: string; rate: number; years: number; deposit: number }) {
  const t = useT()
  const { intl } = useSite()
  const [deposit, setDeposit] = useState(d0)
  const [rate, setRate] = useState(r0)
  const [years, setYears] = useState(y0)
  const loan = Math.max(0, price * (1 - deposit / 100))
  const monthly = useMemo(() => {
    const n = years * 12
    const m = rate / 100 / 12
    if (!n) return 0
    return m === 0 ? loan / n : (loan * m) / (1 - Math.pow(1 + m, -n))
  }, [loan, rate, years])
  const fmt = (n: number) => `${symbol}${Math.round(n).toLocaleString(intl)}`
  return (
    <div className="rk-mortgage">
      <div className="rk-mortgage-fields">
        <div className="rk-field"><label htmlFor="mc-dep">{t('Deposit %')}</label><input id="mc-dep" type="number" min={0} max={100} step={1} value={deposit} onChange={(e) => setDeposit(Number(e.target.value))} /></div>
        <div className="rk-field"><label htmlFor="mc-rate">{t('Interest rate %')}</label><input id="mc-rate" type="number" min={0} max={25} step={0.05} value={rate} onChange={(e) => setRate(Number(e.target.value))} /></div>
        <div className="rk-field"><label htmlFor="mc-years">{t('Term (years)')}</label><input id="mc-years" type="number" min={1} max={40} step={1} value={years} onChange={(e) => setYears(Number(e.target.value))} /></div>
      </div>
      <div className="rk-mortgage-result" aria-live="polite">
        <span>{t('Estimated monthly repayment')}</span>
        <strong>{fmt(monthly)}</strong>
        <small>{t('Deposit {a} · Loan {b}. For illustration only; not a mortgage offer.', { a: fmt(price - loan), b: fmt(loan) })}</small>
      </div>
    </div>
  )
}

/* ---------------- Saved search alert ---------------- */

export function AlertSignup({ filters, summary }: { filters: Record<string, string>; summary: string }) {
  const t = useT()
  const L = useHref()
  const { consentText } = useSite()
  const captcha = useCaptcha()
  const [state, setState] = useState<'idle' | 'open' | 'sending' | 'done' | 'error'>('idle')
  const [error, setError] = useState('')
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setState('sending')
    const captchaToken = await captcha.getToken()
    try {
      const res = await fetch('/api/search-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: fd.get('email'), filters, summary, consent: fd.get('consent') === 'on', website: fd.get('website') || undefined, captchaToken }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j?.errors?.[0]?.message || t('Something went wrong.'))
      }
      setState('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : t('Something went wrong.'))
      setState('error')
      captcha.reset()
    }
  }
  if (state === 'done') return <div className="rk-alert-box" role="status">{t('Done. We will email you when a new home matches:')} <strong>{summary}</strong></div>
  if (state === 'idle')
    return (
      <button type="button" className="rk-btn rk-btn-outline rk-alert-open" onClick={() => setState('open')}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
        {t('Email me new matches')}
      </button>
    )
  return (
    <form className="rk-alert-box" onSubmit={submit}>
      <span>{t('New homes matching your search, once a day at most:')} <strong>{summary}</strong></span>
      <div className="rk-alert-row">
        <div className="rk-field"><label htmlFor="al-email">{t('Email')}</label><input id="al-email" name="email" type="email" required autoComplete="email" /></div>
        <button type="submit" className="rk-btn rk-btn-primary" disabled={state === 'sending'}>{state === 'sending' ? t('Saving…') : t('Create alert')}</button>
      </div>
      <label className="rk-consent"><input type="checkbox" name="consent" required /> <span>{consentText || t('I agree to receive these emails.')} <a href={L('/privacy')}>{t('Privacy policy')}</a></span></label>
      {captcha.node}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px' }}><input name="website" tabIndex={-1} autoComplete="off" /></div>
      {state === 'error' && <p className="rk-form-error" role="alert">{error}</p>}
    </form>
  )
}

/* ---------------- Cookie consent (only used with Google Analytics) ---------------- */

export function CookieBanner({ gaId }: { gaId: string }) {
  const t = useT()
  const L = useHref()
  const [choice, setChoice] = useState<string | null | undefined>(undefined)
  useEffect(() => {
    let c: string | null = null
    try {
      c = localStorage.getItem('rk-cookies')
    } catch {}
    setChoice(c)
  }, [])
  useEffect(() => {
    if (choice !== 'yes' || !gaId || document.getElementById('rk-ga')) return
    const s = document.createElement('script')
    s.id = 'rk-ga'
    s.async = true
    s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`
    document.head.appendChild(s)
    const w = window as unknown as { dataLayer: unknown[]; gtag: (...a: unknown[]) => void }
    w.dataLayer = w.dataLayer || []
    w.gtag = function () {
      // eslint-disable-next-line prefer-rest-params
      w.dataLayer.push(arguments)
    }
    w.gtag('js', new Date())
    w.gtag('config', gaId, { anonymize_ip: true })
  }, [choice, gaId])
  if (choice !== null) return null
  const set = (v: 'yes' | 'no') => {
    try {
      localStorage.setItem('rk-cookies', v)
    } catch {}
    setChoice(v)
  }
  return (
    <div className="rk-cookies" role="dialog" aria-label={t('Cookie consent')}>
      <p>{t('We use analytics cookies to understand how the site is used.')} <a href={L('/privacy')}>{t('Privacy policy')}</a></p>
      <div>
        <button type="button" className="rk-btn rk-btn-outline" onClick={() => set('no')}>{t('Decline')}</button>
        <button type="button" className="rk-btn rk-btn-primary" onClick={() => set('yes')}>{t('Accept')}</button>
      </div>
    </div>
  )
}
