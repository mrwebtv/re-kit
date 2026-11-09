import { formatArea, formatPrice, getProperties, getSite, photosOf, place, STATUS_LABEL, TYPE_LABEL } from '@/site/data'
import { Link } from '@/site/i18n/client'
import { CompareButton } from '@/site/components/Interactive'

export async function generateMetadata() {
  return { title: (await getSite()).$.t('Compare homes'), robots: { index: false } }
}

export default async function ComparePage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams
  const s = await getSite()
  const t = s.$.t
  const ids = (sp.ids || '').split(',').map(Number).filter(Boolean).slice(0, 4)
  const res = ids.length ? await getProperties({ ids: ids.join(',') }, 4) : { docs: [] }
  const homes = ids.map((id) => res.docs.find((d) => d.id === id)).filter(Boolean) as typeof res.docs
  const customNames = Array.from(new Set(homes.flatMap((h) => (h.customFields || []).map((c) => (c.field && typeof c.field === 'object' ? c.field.name : '')).filter(Boolean))))
  const rows: [string, (h: (typeof homes)[number]) => React.ReactNode][] = [
    [t('Price'), (h) => formatPrice(h, s)],
    [t('Status'), (h) => t(STATUS_LABEL[h.status] || h.status)],
    [t('Location'), (h) => place(h)],
    [t('Type'), (h) => (h.propertyType ? t(TYPE_LABEL[h.propertyType] || h.propertyType) : '')],
    [t('Bedrooms'), (h) => h.bedrooms ?? ''],
    [t('Bathrooms'), (h) => h.bathrooms ?? ''],
    [t('Floor area'), (h) => formatArea(h.floorArea, s)],
    [t('Price per m²'), (h) => (h.floorArea && h.price && h.pricePeriod !== 'month' ? `${s.$.cur?.symbol || s.currencySymbol || ''}${Math.round((h.price * (s.$.cur?.rate || 1)) / h.floorArea).toLocaleString(s.$.intl)}` : '')],
    [t('Year built'), (h) => h.yearBuilt ?? ''],
    [t('Energy rating'), (h) => h.energyRating || h.energyClass?.replace('plus', '+') || ''],
    ...customNames.map((n) => [n, (h: (typeof homes)[number]) => {
      const c = (h.customFields || []).find((x) => x.field && typeof x.field === 'object' && x.field.name === n)
      return c ? c.value || '✓' : ''
    }] as [string, (h: (typeof homes)[number]) => React.ReactNode]),
    [t('Features'), (h) => (h.features || []).slice(0, 8).map((f) => f.feature).join(', ')],
  ]
  return (
    <div className="rk-wrap" style={{ paddingBottom: 112 }}>
      <div className="rk-page-head">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span className="rk-eyebrow">{t('{n} homes', { n: homes.length })}</span>
          <h1 className="rk-display">{t('Compare homes')}</h1>
        </div>
      </div>
      {homes.length < 2 ? (
        <div className="rk-empty">
          <p>{t('Pick at least two homes to compare with the compare button on any listing.')}</p>
          <Link href="/properties" className="rk-btn rk-btn-outline">{t('Browse properties')}</Link>
        </div>
      ) : (
        <div className="rk-compare-wrap">
          <table className="rk-compare">
            <thead>
              <tr>
                <th />
                {homes.map((h) => {
                  const ph = photosOf(h, 'medium')[0]
                  return (
                    <th key={h.id} scope="col">
                      <Link href={`/properties/${h.slug}`} className="rk-compare-head">
                        <span className="rk-photo">{ph ? <img src={ph.url} alt={h.title} /> : <span className="rk-ph" />}</span>
                        <strong>{h.title}</strong>
                      </Link>
                      <CompareButton id={h.id} withLabel />
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {rows.map(([k, fn]) => (
                <tr key={k}><th scope="row">{k}</th>{homes.map((h) => <td key={h.id}>{fn(h)}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
