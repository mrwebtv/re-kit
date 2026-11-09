'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState, useTransition } from 'react'
import { useT } from '../i18n/client'

type Opt = { value: string; label: string }

/** Listing filters that update the results instantly (no page reload). */
export function Filters({ types, labels, symbol, rent, intl }: { types: Opt[]; labels: Opt[]; symbol: string; rent: boolean; intl: string }) {
  const t = useT()
  const router = useRouter()
  const pathname = usePathname()
  const sp = useSearchParams()
  const [pending, start] = useTransition()
  const [q, setQ] = useState(sp.get('q') || '')
  const [geoMsg, setGeoMsg] = useState('')
  const maxBound = rent ? 10000 : 5000000
  const step = rent ? 100 : 25000
  const [range, setRange] = useState<[number, number]>([Number(sp.get('min')) || 0, Number(sp.get('max')) || maxBound])
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [typesOpen, setTypesOpen] = useState(false)

  useEffect(() => {
    setQ(sp.get('q') || '')
    setRange([Number(sp.get('min')) || 0, Number(sp.get('max')) || maxBound])
  }, [sp, maxBound])

  const push = (patch: Record<string, string | undefined>, debounce = 0) => {
    const run = () => {
      const p = new URLSearchParams(sp.toString())
      for (const [k, v] of Object.entries(patch)) {
        if (v) p.set(k, v)
        else p.delete(k)
      }
      p.delete('page')
      start(() => router.replace(`${pathname}?${p.toString()}`, { scroll: false }))
    }
    if (timer.current) clearTimeout(timer.current)
    if (debounce) timer.current = setTimeout(run, debounce)
    else run()
  }

  const selectedTypes = (sp.get('type') || '').split(',').filter(Boolean)
  const selectedLabels = (sp.get('labels') || '').split(',').filter(Boolean)
  const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]).join(',') || undefined
  const money = (n: number) => `${symbol}${n.toLocaleString(intl)}`

  const nearMe = () => {
    if (!navigator.geolocation) return setGeoMsg(t('Location is not available in this browser.'))
    setGeoMsg(t('Finding you…'))
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoMsg('')
        setQ('')
        push({ near: `${pos.coords.latitude.toFixed(4)},${pos.coords.longitude.toFixed(4)}`, radius: sp.get('radius') || '5', q: undefined, sort: 'distance' })
      },
      () => setGeoMsg(t('Location permission was declined.')),
      { timeout: 10000 },
    )
  }

  return (
    <form className={`rk-filters${pending ? ' is-pending' : ''}`} onSubmit={(e) => { e.preventDefault(); push({ q: q || undefined, near: undefined }) }} role="search">
      <div className="rk-field" style={{ flex: '2 1 220px' }}>
        <label htmlFor="f-q">{t('Location')}</label>
        <input id="f-q" name="q" value={q} onChange={(e) => { setQ(e.target.value); push({ q: e.target.value || undefined, near: undefined }, 600) }} placeholder={t('Town, area, postcode or reference')} />
      </div>
      <div className="rk-field" style={{ flex: '0 1 150px' }}>
        <label htmlFor="f-radius">{t('Within')}</label>
        <select id="f-radius" value={sp.get('radius') || ''} onChange={(e) => push({ radius: e.target.value || undefined })}>
          <option value="">{t('This area only')}</option>
          {[1, 3, 5, 10, 25, 50].map((n) => <option key={n} value={n}>{t('{n} km', { n })}</option>)}
        </select>
      </div>
      <button type="button" className="rk-btn rk-btn-outline rk-near" onClick={nearMe}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /><circle cx="12" cy="12" r="8" /></svg>
        {sp.get('near') ? t('Near you') : t('Near me')}
      </button>
      <div className="rk-field rk-multi" style={{ flex: '1 1 170px' }}>
        <span className="rk-flabel" id="f-type-l">{t('Type')}</span>
        <button type="button" className="rk-multi-btn" aria-expanded={typesOpen} aria-labelledby="f-type-l" onClick={() => setTypesOpen(!typesOpen)}>
          {selectedTypes.length ? types.filter((x) => selectedTypes.includes(x.value)).map((x) => x.label).join(', ') : t('Any type')}
        </button>
        {typesOpen && (
          <div className="rk-multi-panel" onMouseLeave={() => setTypesOpen(false)}>
            {types.map((o) => (
              <label key={o.value}><input type="checkbox" checked={selectedTypes.includes(o.value)} onChange={() => push({ type: toggle(selectedTypes, o.value) })} /> {o.label}</label>
            ))}
          </div>
        )}
      </div>
      <div className="rk-field" style={{ flex: '0 1 110px' }}>
        <label htmlFor="f-beds">{t('Bedrooms')}</label>
        <select id="f-beds" value={sp.get('beds') || ''} onChange={(e) => push({ beds: e.target.value || undefined })}>
          <option value="">{t('Any')}</option>
          {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}+</option>)}
        </select>
      </div>
      <div className="rk-field" style={{ flex: '0 1 110px' }}>
        <label htmlFor="f-baths">{t('Bathrooms')}</label>
        <select id="f-baths" value={sp.get('baths') || ''} onChange={(e) => push({ baths: e.target.value || undefined })}>
          <option value="">{t('Any')}</option>
          {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}+</option>)}
        </select>
      </div>
      <div className="rk-field rk-range" style={{ flex: '2 1 260px' }}>
        <span className="rk-flabel">{t('Price')}: {money(range[0])} – {range[1] >= maxBound ? `${money(maxBound)}+` : money(range[1])}</span>
        <div className="rk-range-track">
          <input type="range" aria-label={t('Minimum price')} min={0} max={maxBound} step={step} value={range[0]} onChange={(e) => { const v = Math.min(Number(e.target.value), range[1] - step); setRange([v, range[1]]); push({ min: v ? String(v) : undefined }, 400) }} />
          <input type="range" aria-label={t('Maximum price')} min={0} max={maxBound} step={step} value={range[1]} onChange={(e) => { const v = Math.max(Number(e.target.value), range[0] + step); setRange([range[0], v]); push({ max: v < maxBound ? String(v) : undefined }, 400) }} />
        </div>
      </div>
      <div className="rk-field" style={{ flex: '0 1 170px' }}>
        <label htmlFor="f-sort">{t('Sort by')}</label>
        <select id="f-sort" value={sp.get('sort') || ''} onChange={(e) => push({ sort: e.target.value || undefined })}>
          <option value="">{t('Newest first')}</option>
          <option value="price-desc">{t('Price, high to low')}</option>
          <option value="price-asc">{t('Price, low to high')}</option>
          {(sp.get('radius') || sp.get('near')) && <option value="distance">{t('Nearest first')}</option>}
        </select>
      </div>
      {labels.length > 0 && (
        <div className="rk-chips" role="group" aria-label={t('Labels')}>
          {labels.map((l) => (
            <button key={l.value} type="button" aria-pressed={selectedLabels.includes(l.value)} className={selectedLabels.includes(l.value) ? 'is-on' : ''} onClick={() => push({ labels: toggle(selectedLabels, l.value) })}>{l.label}</button>
          ))}
        </div>
      )}
      {geoMsg && <p className="rk-muted" role="status" style={{ margin: 0, flexBasis: '100%' }}>{geoMsg}</p>}
      <noscript><button type="submit" className="rk-btn rk-btn-primary">{t('Update')}</button></noscript>
    </form>
  )
}
