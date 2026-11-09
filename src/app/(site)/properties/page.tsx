import { formatMoney, formatPrice, getLabels, getProperties, getSite, PAGE_SIZE, TYPE_LABEL, TYPE_PLURAL, type ListingFilters } from '@/site/data'
import { getTheme } from '@/site/themes'
import { PropertyMap, type MapPoint } from '@/site/components/PropertyMap'
import { AlertSignup } from '@/site/components/Extras'
import { Filters } from '@/site/components/Filters'
import { Link } from '@/site/i18n/client'

export async function generateMetadata({ searchParams }: { searchParams: SP }) {
  const s = await getSite()
  const sp = await searchParams
  return { title: sp.mode === 'rent' ? s.$.t('Homes to rent') : s.$.t('Homes for sale'), alternates: { canonical: `/properties${sp.mode === 'rent' ? '?mode=rent' : ''}` } }
}

type SP = Promise<Record<string, string | string[] | undefined>>

const KEYS = ['mode', 'q', 'type', 'beds', 'baths', 'min', 'max', 'labels', 'radius', 'near', 'sort', 'page', 'view'] as const

export default async function PropertiesPage({ searchParams }: { searchParams: SP }) {
  const raw = await searchParams
  const one = (k: string) => (Array.isArray(raw[k]) ? raw[k]![0] : (raw[k] as string | undefined)) || undefined
  const f: ListingFilters = { mode: one('mode') === 'rent' ? 'rent' : 'buy', q: one('q'), type: one('type'), beds: one('beds'), baths: one('baths'), min: one('min'), max: one('max'), labels: one('labels'), radius: one('radius'), near: one('near'), sort: one('sort'), page: one('page') }
  const [s, labels] = await Promise.all([getSite(), getLabels()])
  const t = s.$.t
  const theme = getTheme(s.theme)
  const res = await getProperties(f)
  const view = (one('view') || s.defaultView || 'map') as 'map' | 'grid' | 'list'
  const qs = (patch: Record<string, string | undefined>) => {
    const p = new URLSearchParams()
    const all = { ...Object.fromEntries(KEYS.map((k) => [k, one(k)])), ...f, view: one('view'), ...patch }
    for (const [k, v] of Object.entries(all)) if (v) p.set(k, v)
    return `/properties?${p.toString()}`
  }
  const points: MapPoint[] = res.docs
    .filter((p) => typeof p.lat === 'number' && typeof p.lng === 'number')
    .map((p) => ({ id: p.id, lat: p.lat!, lng: p.lng!, label: formatPrice(p, s, true), href: s.$.L(`/properties/${p.slug}`), highlight: Boolean(p.featured) }))
  const rent = f.mode === 'rent'
  const types = f.type ? f.type.split(',') : []
  const sym = s.$.cur?.symbol || s.currencySymbol || '$'
  const summary = [
    types.length ? types.map((x) => t(TYPE_PLURAL[x] || x)).join(', ') : t('Homes'),
    rent ? t('to rent') : t('for sale'),
    f.q ? t('in {place}', { place: f.q }) : '',
    f.radius && (f.q || f.near) ? t('within {n} km', { n: f.radius }) : '',
    f.beds ? t('{n}+ bedrooms', { n: f.beds }) : '',
    f.max ? t('up to {price}', { price: formatMoney(Number(f.max), s) }) : '',
  ].filter(Boolean).join(' ')
  const showMap = view === 'map' && points.length > 0
  const listClass = theme.listLayout === 'rows' ? 'rk-rows' : view === 'list' ? 'rk-grid rk-listview' : 'rk-grid'

  return (
    <div className="rk-wrap">
      <div className="rk-page-head">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span className="rk-eyebrow">{res.totalDocs === 1 ? t('1 property') : t('{n} properties', { n: res.totalDocs })}</span>
          <h1 className="rk-display">{rent ? t('Homes to rent') : t('Homes for sale')}</h1>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          {theme.listLayout !== 'rows' && (
            <nav className="rk-toggle rk-views" aria-label={t('Layout')}>
              {(['map', 'grid', 'list'] as const).map((v) => (
                <Link key={v} href={qs({ view: v, page: undefined })} aria-current={view === v} scroll={false}>{t(v === 'map' ? 'Map' : v === 'grid' ? 'Grid' : 'List')}</Link>
              ))}
            </nav>
          )}
          <nav className="rk-toggle" aria-label={t('Buy or rent')}>
            <Link href={qs({ mode: 'buy', page: undefined, min: undefined, max: undefined })} aria-current={!rent}>{t('Buy')}</Link>
            <Link href={qs({ mode: 'rent', page: undefined, min: undefined, max: undefined })} aria-current={rent}>{t('Rent')}</Link>
          </nav>
        </div>
      </div>

      <Filters
        types={['house', 'apartment', 'townhouse', 'bungalow', 'villa', 'site', 'commercial', 'development'].map((v) => ({ value: v, label: t(TYPE_LABEL[v]!) }))}
        labels={labels.map((l) => ({ value: String(l.id), label: l.name }))}
        symbol={sym}
        rent={rent}
        intl={s.$.intl}
      />
      {f.radius && !res.center && f.q && <p className="rk-muted" role="status">{t('We could not find "{place}" on the map, so showing text matches instead.', { place: f.q })}</p>}
      {s.features?.searchAlerts && (
        <AlertSignup filters={Object.fromEntries(Object.entries({ mode: f.mode, q: f.q, type: f.type, beds: f.beds, min: f.min, max: f.max }).filter(([, v]) => v)) as Record<string, string>} summary={summary} />
      )}

      <div className={`rk-results${showMap ? ' has-map' : ''}`}>
        <div className="rk-results-list">
          {res.docs.length === 0 ? (
            <div className="rk-empty">
              <p className="rk-display" style={{ fontSize: 32 }}>{t('No homes match that search.')}</p>
              <Link href={`/properties?mode=${f.mode}`} className="rk-btn rk-btn-outline">{t('Clear filters')}</Link>
            </div>
          ) : (
            <div className={listClass}>
              {res.docs.map((p, i) => <theme.Card key={p.id} p={p} s={s} index={(res.page - 1) * PAGE_SIZE + i} distance={res.distances?.[p.id]} />)}
            </div>
          )}
          {res.totalPages > 1 && (
            <nav className="rk-pager" aria-label={t('Pages')}>
              {Array.from({ length: res.totalPages }, (_, i) => i + 1).map((n) => (n === res.page ? <span key={n} aria-current="page">{n}</span> : <Link key={n} href={qs({ page: String(n) })}>{n}</Link>))}
            </nav>
          )}
        </div>
        {showMap && (
          <aside className="rk-results-map" aria-label={t('Map')}>
            <PropertyMap points={points} className="rk-map" />
          </aside>
        )}
      </div>
    </div>
  )
}
