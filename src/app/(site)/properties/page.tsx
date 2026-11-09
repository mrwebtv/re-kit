import Link from 'next/link'
import { formatPrice, getProperties, getSettings, PAGE_SIZE, type ListingFilters } from '@/site/data'
import { getTheme } from '@/site/themes'
import { PropertyMap, type MapPoint } from '@/site/components/PropertyMap'
import { AlertSignup } from '@/site/components/Extras'
import { TYPE_LABEL } from '@/site/data'

export const metadata = { title: 'Properties' }

type SP = Promise<Record<string, string | string[] | undefined>>

export default async function PropertiesPage({ searchParams }: { searchParams: SP }) {
  const raw = await searchParams
  const one = (k: string) => (Array.isArray(raw[k]) ? raw[k]![0] : (raw[k] as string | undefined)) || undefined
  const f: ListingFilters = { mode: one('mode') === 'rent' ? 'rent' : 'buy', q: one('q'), type: one('type'), beds: one('beds'), min: one('min'), max: one('max'), sort: one('sort'), page: one('page') }
  const s = await getSettings()
  const theme = getTheme(s.theme)
  const res = await getProperties(f)
  const qs = (patch: Record<string, string | undefined>) => {
    const p = new URLSearchParams()
    for (const [k, v] of Object.entries({ ...f, ...patch })) if (v) p.set(k, v)
    return `/properties?${p.toString()}`
  }
  const points: MapPoint[] = res.docs
    .filter((p) => typeof p.lat === 'number' && typeof p.lng === 'number')
    .map((p) => ({ id: p.id, lat: p.lat!, lng: p.lng!, label: formatPrice(p, s, true), href: `/properties/${p.slug}`, highlight: Boolean(p.featured) }))
  const rent = f.mode === 'rent'

  return (
    <div className="rk-wrap">
      <div className="rk-page-head">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span className="rk-eyebrow">{res.totalDocs} {res.totalDocs === 1 ? 'property' : 'properties'}</span>
          <h1 className="rk-display">{rent ? 'Homes to rent' : 'Homes for sale'}</h1>
        </div>
        <nav className="rk-toggle" aria-label="Buy or rent">
          <Link href={qs({ mode: 'buy', page: undefined, min: undefined, max: undefined })} aria-current={!rent}>Buy</Link>
          <Link href={qs({ mode: 'rent', page: undefined, min: undefined, max: undefined })} aria-current={rent}>Rent</Link>
        </nav>
      </div>

      <form action="/properties" method="get" className="rk-filters">
        <input type="hidden" name="mode" value={f.mode} />
        <div className="rk-field" style={{ flex: '2 1 220px' }}><label htmlFor="f-q">Location</label><input id="f-q" name="q" defaultValue={f.q} placeholder="Town, area or postcode" /></div>
        <div className="rk-field"><label htmlFor="f-type">Type</label>
          <select id="f-type" name="type" defaultValue={f.type || ''}><option value="">Any type</option><option value="house">House</option><option value="apartment">Apartment</option><option value="townhouse">Townhouse</option><option value="bungalow">Bungalow</option></select></div>
        <div className="rk-field"><label htmlFor="f-beds">Bedrooms</label>
          <select id="f-beds" name="beds" defaultValue={f.beds || ''}><option value="">Any</option>{[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}+</option>)}</select></div>
        <div className="rk-field"><label htmlFor="f-max">Max price</label>
          <select id="f-max" name="max" defaultValue={f.max || ''}>
            <option value="">No max</option>
            {(rent ? [1500, 2500, 4000, 6000] : [500000, 750000, 1000000, 1500000, 2500000, 5000000]).map((n) => (
              <option key={n} value={n}>{s.currencySymbol || '$'}{n.toLocaleString('en-US')}{rent ? '/mo' : ''}</option>
            ))}
          </select></div>
        <div className="rk-field"><label htmlFor="f-sort">Sort by</label>
          <select id="f-sort" name="sort" defaultValue={f.sort || ''}><option value="">Newest first</option><option value="price-desc">Price, high to low</option><option value="price-asc">Price, low to high</option></select></div>
        <button type="submit" className="rk-btn rk-btn-primary">Update</button>
      </form>
      {s.features?.searchAlerts && (
        <AlertSignup
          filters={Object.fromEntries(Object.entries({ mode: f.mode, q: f.q, type: f.type, beds: f.beds, min: f.min, max: f.max }).filter(([, v]) => v)) as Record<string, string>}
          summary={[f.type ? `${TYPE_LABEL[f.type] || f.type}s` : 'Homes', rent ? 'to rent' : 'for sale', f.q ? `in ${f.q}` : '', f.beds ? `${f.beds}+ bedrooms` : '', f.max ? `up to ${s.currencySymbol || '$'}${Number(f.max).toLocaleString('en-US')}` : ''].filter(Boolean).join(' ')}
          consentText={s.consentText || 'I agree to receive these emails.'}
        />
      )}

      <div className="rk-results">
        <div className="rk-results-list">
          {res.docs.length === 0 ? (
            <div className="rk-empty">
              <p className="rk-display" style={{ fontSize: 32 }}>No homes match that search.</p>
              <Link href={`/properties?mode=${f.mode}`} className="rk-btn rk-btn-outline">Clear filters</Link>
            </div>
          ) : (
            <div className={theme.listLayout === 'rows' ? 'rk-rows' : 'rk-grid'}>
              {res.docs.map((p, i) => <theme.Card key={p.id} p={p} s={s} index={(res.page! - 1) * PAGE_SIZE + i} />)}
            </div>
          )}
          {res.totalPages > 1 && (
            <nav className="rk-pager" aria-label="Pages">
              {Array.from({ length: res.totalPages }, (_, i) => i + 1).map((n) =>
                n === res.page ? <span key={n} aria-current="page">{n}</span> : <Link key={n} href={qs({ page: String(n) })}>{n}</Link>,
              )}
            </nav>
          )}
        </div>
        {points.length > 0 && (
          <aside className="rk-results-map" aria-label="Map">
            <PropertyMap points={points} className="rk-map" />
          </aside>
        )}
      </div>
    </div>
  )
}
