'use client'
import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import { usePathname } from 'next/navigation'
import { Link, useHref, useSite, useT } from '../i18n/client'

/* ---------------- header ---------------- */

export function NavToggle({ label }: { label: string }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  useEffect(() => setOpen(false), [pathname])
  return (
    <button
      type="button"
      className="rk-burger"
      aria-label={label}
      aria-expanded={open}
      onClick={(e) => {
        const header = (e.currentTarget as HTMLElement).closest('header')
        header?.classList.toggle('is-open', !open)
        setOpen(!open)
      }}
    >
      <span aria-hidden="true" />
    </button>
  )
}

export function HeaderTools({ languages, current, currencies, currency, labels }: { languages: { code: string; label: string; href: string }[]; current: string; currencies: string[]; currency: string; labels: { language: string; currency: string } }) {
  if (!languages.length && currencies.length < 2) return null
  return (
    <span className="rk-tools">
      {languages.length > 1 && (
        <label className="rk-tool">
          <span className="rk-sr">{labels.language}</span>
          <select value={current} onChange={(e) => (window.location.href = languages.find((l) => l.code === e.target.value)!.href + window.location.search)}>
            {languages.map((l) => <option key={l.code} value={l.code}>{l.code.toUpperCase()}</option>)}
          </select>
        </label>
      )}
      {currencies.length > 1 && (
        <label className="rk-tool">
          <span className="rk-sr">{labels.currency}</span>
          <select
            value={currency}
            onChange={(e) => {
              document.cookie = `rk-cur=${e.target.value}; path=/; max-age=31536000; samesite=lax`
              window.location.reload()
            }}
          >
            {currencies.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
      )}
    </span>
  )
}

/** Adds is-scrolled to the header (sticky shadow, transparent header turning solid). */
export function ScrollWatcher() {
  useEffect(() => {
    const onScroll = () => document.body.classList.toggle('rk-scrolled', window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return null
}

/** Privacy-friendly page view counter (no cookies). */
export function Tracker() {
  const pathname = usePathname()
  useEffect(() => {
    try {
      const body = JSON.stringify({ path: pathname, referrer: document.referrer })
      if (navigator.sendBeacon) navigator.sendBeacon('/api/track', new Blob([body], { type: 'application/json' }))
      else void fetch('/api/track', { method: 'POST', body, headers: { 'Content-Type': 'application/json' }, keepalive: true })
    } catch {}
  }, [pathname])
  return null
}

/* ---------------- favourites and compare (stored in the browser) ---------------- */

function makeStore(key: string, max: number) {
  const listeners = new Set<() => void>()
  let cache: number[] | null = null
  const read = (): number[] => {
    if (cache) return cache
    try {
      cache = JSON.parse(localStorage.getItem(key) || '[]')
    } catch {
      cache = []
    }
    return cache!
  }
  const write = (v: number[]) => {
    cache = v.slice(-max)
    try {
      localStorage.setItem(key, JSON.stringify(cache))
    } catch {}
    listeners.forEach((l) => l())
  }
  const EMPTY: number[] = []
  return {
    subscribe: (l: () => void) => {
      listeners.add(l)
      const onStorage = (e: StorageEvent) => {
        if (e.key === key) {
          cache = null
          l()
        }
      }
      window.addEventListener('storage', onStorage)
      return () => {
        listeners.delete(l)
        window.removeEventListener('storage', onStorage)
      }
    },
    get: read,
    server: () => EMPTY,
    toggle: (id: number) => {
      const cur = read()
      write(cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id])
    },
    clear: () => write([]),
  }
}

export const favourites = makeStore('rk-favs', 200)
export const compareList = makeStore('rk-compare', 4)
export const useFavourites = () => useSyncExternalStore(favourites.subscribe, favourites.get, favourites.server)
export const useCompare = () => useSyncExternalStore(compareList.subscribe, compareList.get, compareList.server)

const Heart = ({ on }: { on: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={on ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z" /></svg>
)
const CompareIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 3h5v5" /><path d="M8 21H3v-5" /><path d="M21 3l-7 7" /><path d="M3 21l7-7" /></svg>
)
const Eye = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg>
)

export type QuickData = { id: number; title: string; href: string; price: string; qualifier: string; status: string; place: string; summary: string; photos: string[]; facts: [string, string][] }

export function FavouriteButton({ id, className }: { id: number; className?: string }) {
  const t = useT()
  const favs = useFavourites()
  const on = favs.includes(id)
  return (
    <button type="button" className={`rk-act${on ? ' is-on' : ''} ${className || ''}`} aria-pressed={on} aria-label={on ? t('Remove from favourites') : t('Save to favourites')} title={on ? t('Remove from favourites') : t('Save to favourites')} onClick={() => favourites.toggle(id)}>
      <Heart on={on} />
    </button>
  )
}

export function CompareButton({ id, withLabel }: { id: number; withLabel?: boolean }) {
  const t = useT()
  const list = useCompare()
  const on = list.includes(id)
  return (
    <button type="button" className={`rk-act${on ? ' is-on' : ''}${withLabel ? ' has-label' : ''}`} aria-pressed={on} aria-label={on ? t('Remove from compare') : t('Add to compare')} title={on ? t('Remove from compare') : t('Add to compare')} onClick={() => compareList.toggle(id)}>
      <CompareIcon />
      {withLabel && <span>{on ? t('Comparing') : t('Compare')}</span>}
    </button>
  )
}

export function CardActions({ data }: { data: QuickData }) {
  const t = useT()
  const { flags } = useSite()
  const [open, setOpen] = useState(false)
  if (!flags.favourites && !flags.compare && !flags.quickView) return null
  return (
    <>
      <div className="rk-acts">
        {flags.favourites && <FavouriteButton id={data.id} />}
        {flags.compare && <CompareButton id={data.id} />}
        {flags.quickView && (
          <button type="button" className="rk-act" aria-label={t('Quick view')} title={t('Quick view')} onClick={() => setOpen(true)}>
            <Eye />
          </button>
        )}
      </div>
      {open && <QuickView data={data} onClose={() => setOpen(false)} />}
    </>
  )
}

function QuickView({ data, onClose }: { data: QuickData; onClose: () => void }) {
  const t = useT()
  const [i, setI] = useState(0)
  const n = data.photos.length
  const step = useCallback((d: number) => setI((x) => (n ? (x + d + n) % n : 0)), [n])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, step])
  return (
    <div className="rk-modal" role="dialog" aria-modal="true" aria-label={data.title} onClick={onClose}>
      <div className="rk-modal-box rk-quick" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="rk-modal-close" onClick={onClose} aria-label={t('Close')}>×</button>
        <div className="rk-quick-media">
          {n ? <img src={data.photos[i]} alt={`${data.title}, ${i + 1}/${n}`} /> : <div className="rk-ph" />}
          {n > 1 && (
            <>
              <button type="button" className="rk-quick-prev" onClick={() => step(-1)} aria-label={t('Previous photo')}>‹</button>
              <button type="button" className="rk-quick-next" onClick={() => step(1)} aria-label={t('Next photo')}>›</button>
              <span className="rk-quick-count">{i + 1} / {n}</span>
            </>
          )}
        </div>
        <div className="rk-quick-body">
          <span className="rk-eyebrow">{data.status}{data.place ? ` · ${data.place}` : ''}</span>
          <h2 className="rk-display">{data.title}</h2>
          <span className="rk-quick-price">{data.qualifier && <span className="rk-qualifier">{data.qualifier}</span>}{data.price}</span>
          {data.facts.length > 0 && (
            <div className="rk-quick-facts">
              {data.facts.map(([k, v]) => <span key={k}><small>{k}</small>{v}</span>)}
            </div>
          )}
          {data.summary && <p className="rk-muted">{data.summary}</p>}
          <div className="rk-quick-acts">
            <Link href={data.href} className="rk-btn rk-btn-primary">{t('View details')}</Link>
            <FavouriteButton id={data.id} />
            <CompareButton id={data.id} withLabel />
          </div>
        </div>
      </div>
    </div>
  )
}

/** Floating bar once 1+ homes are picked for comparison. */
export function CompareBar() {
  const t = useT()
  const L = useHref()
  const { flags } = useSite()
  const list = useCompare()
  const pathname = usePathname()
  if (!flags.compare || list.length === 0 || pathname.endsWith('/compare')) return null
  return (
    <div className="rk-comparebar" role="region" aria-label={t('Compare')}>
      <span>{t('{n} of 4 homes selected', { n: list.length })}</span>
      <button type="button" className="rk-linkbtn" onClick={() => compareList.clear()}>{t('Clear')}</button>
      <a className="rk-btn rk-btn-accent" href={L(`/compare?ids=${list.join(',')}`)} aria-disabled={list.length < 2}>{list.length < 2 ? t('Pick one more') : t('Compare now')}</a>
    </div>
  )
}

/** /favourites reads the browser list and asks the server for those homes. */
export function FavouritesLoader({ ids }: { ids?: string }) {
  const favs = useFavourites()
  const L = useHref()
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])
  useEffect(() => {
    if (!ready || ids !== undefined) return
    window.location.replace(L(`/favourites?ids=${favs.join(',')}`))
  }, [ready, ids, favs, L])
  return null
}
