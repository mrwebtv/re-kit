import { notFound } from 'next/navigation'
import type { Agent, Media, Property } from '@/payload-types'
import RichText from '@/components/RichText'
import { formatArea, formatPrice, getProperty, getSite, getSimilar, getUnits, img, initials, photosOf, place, qualifier, siteUrl, STATUS_LABEL, TYPE_LABEL } from '@/site/data'
import { getTheme } from '@/site/themes'
import { Gallery } from '@/site/components/Gallery'
import { PropertyContact } from '@/site/components/LeadForm'
import { PropertyMap } from '@/site/components/PropertyMap'
import { CardBadges, Photo } from '@/site/components/shared'
import { MortgageCalculator, ShareButtons } from '@/site/components/Extras'
import { CompareButton, FavouriteButton } from '@/site/components/Interactive'
import { Nearby } from '@/site/components/Nearby'
import { embedUrl } from '@/site/embed'
import { Icon } from '@/site/icons'
import { Link } from '@/site/i18n/client'

type Params = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: Params }) {
  const p = await getProperty((await params).slug)
  if (!p) return {}
  const photo = photosOf(p)[0]
  return {
    title: p.title,
    description: p.summary || undefined,
    alternates: { canonical: `/properties/${p.slug}` },
    openGraph: { title: p.title, description: p.summary || undefined, images: photo ? [{ url: photo.full }] : undefined },
  }
}

const ENERGY = ['Aplus', 'A', 'B', 'C', 'D', 'E', 'F', 'G']
const ENERGY_COLORS = ['#00843d', '#19a24a', '#8cc63f', '#d7df23', '#fff200', '#fbb040', '#f37021', '#ed1c24']

function EnergyScale({ value, label }: { value: string; label: string }) {
  return (
    <div className="rk-energy" role="img" aria-label={`${label}: ${value.replace('plus', '+')}`}>
      {ENERGY.map((c, i) => (
        <span key={c} className={c === value ? 'is-on' : ''} style={{ background: ENERGY_COLORS[i], width: `${46 + i * 7}%` }}>
          {c.replace('plus', '+')}
          {c === value && <b aria-hidden="true">◀</b>}
        </span>
      ))}
    </div>
  )
}

export default async function PropertyPage({ params }: { params: Params }) {
  const { slug } = await params
  const [p, s] = await Promise.all([getProperty(slug), getSite()])
  if (!p) notFound()
  const t = s.$.t
  const theme = getTheme(s.theme)
  const [similar, units] = await Promise.all([getSimilar(p), getUnits(p)])
  const photos = photosOf(p)
  const plans = ((p.floorPlans || []) as (number | Media)[]).map((m) => img(m, 'large')).filter(Boolean)
  const agent = p.agent && typeof p.agent === 'object' ? (p.agent as Agent) : null
  const parent = p.parent && typeof p.parent === 'object' ? (p.parent as Property) : null
  const facts = [
    [t('Bedrooms'), p.bedrooms],
    [t('Bathrooms'), p.bathrooms],
    [t('Floor area'), formatArea(p.floorArea, s)],
    [t('Type'), p.propertyType ? t(TYPE_LABEL[p.propertyType] || p.propertyType) : null],
    [t('Year built'), p.yearBuilt],
    [t('Energy rating'), p.energyRating],
  ].filter(([, v]) => v !== null && v !== undefined && v !== '' && v !== 0)
  const custom = (p.customFields || []).filter((c) => c.field && typeof c.field === 'object') as { id?: string; value?: string | null; field: { name: string; icon?: string | null; unit?: string | null } }[]
  const attachments = (p.attachments || []).filter((a) => a.file && typeof a.file === 'object') as { id?: string; label: string; file: Media }[]
  const hasMap = typeof p.lat === 'number' && typeof p.lng === 'number'
  const rent = p.status === 'to-let' || p.status === 'let'
  const f = s.features
  const video = embedUrl(p.videoUrl)
  const tour = embedUrl(p.tourUrl)
  const now = Date.now()
  const upcoming = (p.openHouses || []).filter((o) => new Date(o.end || o.start).getTime() > now - 3600_000).sort((a, b) => a.start.localeCompare(b.start))
  const customBrochure = p.brochure && typeof p.brochure === 'object' ? (p.brochure as Media).url : null
  const brochureHref = s.brochureEnabled === false ? undefined : customBrochure || s.$.L(`/properties/${p.slug}/brochure`)
  const base = siteUrl()
  const mls = p.source === 'mls'
  const idx = s.mls
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: p.title,
    description: p.summary || undefined,
    url: `${base}${s.$.L(`/properties/${p.slug}`)}`,
    image: photos.slice(0, 6).map((x) => (x.full.startsWith('http') ? x.full : `${base}${x.full}`)),
    datePosted: p.createdAt,
    identifier: p.reference || undefined,
    offers: p.priceOnRequest ? undefined : { '@type': 'Offer', price: p.price, priceCurrency: s.currencyCode || 'USD', availability: p.status === 'for-sale' || p.status === 'to-let' ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut', businessFunction: rent ? 'http://purl.org/goodrelations/v1#LeaseOut' : 'http://purl.org/goodrelations/v1#Sell' },
    about: {
      '@type': p.propertyType === 'apartment' ? 'Apartment' : 'SingleFamilyResidence',
      numberOfRooms: p.bedrooms || undefined,
      numberOfBedrooms: p.bedrooms || undefined,
      numberOfBathroomsTotal: p.bathrooms || undefined,
      yearBuilt: p.yearBuilt || undefined,
      floorSize: p.floorArea ? { '@type': 'QuantitativeValue', value: p.floorArea, unitCode: 'MTK' } : undefined,
      address: { '@type': 'PostalAddress', streetAddress: p.address?.line1 || undefined, addressLocality: p.address?.town || undefined, addressRegion: p.address?.region || undefined, postalCode: p.address?.postcode || undefined },
      geo: hasMap ? { '@type': 'GeoCoordinates', latitude: p.lat, longitude: p.lng } : undefined,
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <div className="rk-wrap">
        <nav className="rk-crumbs" aria-label={t('Breadcrumb')}>
          <Link href={`/properties?mode=${rent ? 'rent' : 'buy'}`}>{rent ? t('Homes to rent') : t('Homes for sale')}</Link>
          {p.address?.town && (<><span aria-hidden="true">/</span><Link href={`/properties?mode=${rent ? 'rent' : 'buy'}&q=${encodeURIComponent(p.address.town)}`}>{p.address.town}</Link></>)}
          {parent && (<><span aria-hidden="true">/</span><Link href={`/properties/${parent.slug}`}>{parent.title}</Link></>)}
          <span aria-hidden="true">/</span><span aria-current="page" style={{ color: 'var(--ink)' }}>{p.title}</span>
        </nav>
        <Gallery photos={photos} title={p.title} />
        <div className="rk-detail">
          <div className="rk-detail-main">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div className="rk-detail-top">
                <span className="rk-eyebrow">{t(STATUS_LABEL[p.status] || p.status)}{place(p) ? ` · ${place(p)}` : ''}{p.reference ? ` · ${p.reference}` : ''}</span>
                <span className="rk-detail-acts"><FavouriteButton id={p.id} /><CompareButton id={p.id} withLabel /></span>
              </div>
              {(p.labels || []).length > 0 && <div className="rk-inline-badges"><CardBadges p={p} s={s} /></div>}
              <div className="rk-title-row">
                <h1 className="rk-display">{p.title}</h1>
                <span className="rk-price-lg">{qualifier(p, s) && <span className="rk-qualifier">{qualifier(p, s)}</span>}{formatPrice(p, s)}</span>
              </div>
              {s.$.cur && !p.priceOnRequest && <p className="rk-muted" style={{ margin: 0, fontSize: 13 }}>{t('Converted from {price} at today\'s rate.', { price: `${s.currencySymbol || ''}${p.price.toLocaleString(s.$.intl)}` })}</p>}
              {(p.address?.line1 || p.address?.postcode) && <p className="rk-muted" style={{ margin: 0 }}>{[p.address?.line1, p.address?.town, p.address?.postcode].filter(Boolean).join(', ')}</p>}
              {parent && <p className="rk-muted" style={{ margin: 0 }}>{t('Part of')} <Link href={`/properties/${parent.slug}`} className="rk-link">{parent.title}</Link></p>}
            </div>
            {facts.length > 0 && (
              <div className="rk-keyfacts">
                {facts.map(([k, v]) => <div className="rk-keyfact" key={k as string}><span>{k}</span><span>{v}</span></div>)}
              </div>
            )}
            {(p.summary || p.description) && (
              <div className="rk-prose">
                <h2>{t('About this home')}</h2>
                {p.summary && <p className="rk-summary">{p.summary}</p>}
                {p.description && <RichText data={p.description} enableGutter={false} enableProse={false} />}
              </div>
            )}
            {(custom.length > 0 || (p.features && p.features.length > 0)) && (
              <div>
                <h2>{t('Features')}</h2>
                {custom.length > 0 && (
                  <ul className="rk-custom">
                    {custom.map((c) => (
                      <li key={c.id || c.field.name}><Icon name={c.field.icon} size={22} /><span>{c.value ? <><strong>{c.value}{c.field.unit ? ` ${c.field.unit}` : ''}</strong> {c.field.name}</> : c.field.name}</span></li>
                    ))}
                  </ul>
                )}
                {p.features && p.features.length > 0 && <ul className="rk-features">{p.features.map((x) => <li key={x.id || x.feature}>{x.feature}</li>)}</ul>}
              </div>
            )}
            {units.length > 0 && (
              <div>
                <h2>{t('Homes in this development')}</h2>
                <table className="rk-units">
                  <thead><tr><th>{t('Home')}</th><th>{t('Bedrooms')}</th><th>{t('Floor area')}</th><th>{t('Status')}</th><th>{t('Price')}</th></tr></thead>
                  <tbody>
                    {units.map((u) => (
                      <tr key={u.id}>
                        <td><Link href={`/properties/${u.slug}`} className="rk-link">{u.title}</Link></td>
                        <td>{u.bedrooms ?? ''}</td>
                        <td>{formatArea(u.floorArea, s)}</td>
                        <td>{t(STATUS_LABEL[u.status] || u.status)}</td>
                        <td>{formatPrice(u, s)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {p.energyClass && (
              <div>
                <h2>{t('Energy efficiency')}</h2>
                <EnergyScale value={p.energyClass} label={t('Energy class')} />
              </div>
            )}
            {f?.videoTours && (video || tour) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h2>{video && tour ? t('Video and 3D tour') : video ? t('Video tour') : t('3D tour')}</h2>
                {video && <div className="rk-embed"><iframe src={video} title={`${p.title} video`} allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen" loading="lazy" /></div>}
                {tour && <div className="rk-embed"><iframe src={tour} title={`${p.title} 3D tour`} allow="fullscreen; xr-spatial-tracking" loading="lazy" /></div>}
              </div>
            )}
            {f?.openHouses && upcoming.length > 0 && (
              <div>
                <h2>{t('Open house')}</h2>
                <ul className="rk-openhouses">
                  {upcoming.map((o) => {
                    const d = new Date(o.start)
                    const tm = (x: Date) => x.toLocaleTimeString(s.$.intl, { hour: '2-digit', minute: '2-digit', timeZone: s.viewingSlots?.timezone || 'UTC' })
                    return (
                      <li key={o.id || o.start}>
                        <strong>{d.toLocaleDateString(s.$.intl, { weekday: 'long', day: 'numeric', month: 'long', timeZone: s.viewingSlots?.timezone || 'UTC' })}</strong>
                        <span className="rk-muted">{tm(d)}{o.end ? ` – ${tm(new Date(o.end))}` : ''}</span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
            {(plans.length > 0 || hasMap) && (
              <div className="rk-twocol">
                {plans.length > 0 && <div><h2>{t('Floor plan')}</h2><div className="rk-floorplan"><img src={plans[0]!.url} alt={`${p.title} floor plan`} /></div></div>}
                {hasMap && <div><h2>{t('Location')}</h2><PropertyMap points={[{ id: p.id, lat: p.lat!, lng: p.lng!, label: p.title, highlight: true }]} zoom={14} className="rk-map" /></div>}
              </div>
            )}
            {hasMap && (f?.nearbyPlaces || f?.walkScore) && <Nearby id={p.id} lat={p.lat!} lng={p.lng!} title={p.title} />}
            {f?.mortgageCalculator && p.status === 'for-sale' && !p.priceOnRequest && p.price > 0 && (
              <div>
                <h2>{t('Mortgage calculator')}</h2>
                <MortgageCalculator price={s.$.cur ? p.price * s.$.cur.rate : p.price} symbol={s.$.cur?.symbol || s.currencySymbol || '$'} rate={f.mortgageRate ?? 4.5} years={f.mortgageYears ?? 30} deposit={f.mortgageDeposit ?? 10} />
              </div>
            )}
            {attachments.length > 0 && (
              <div>
                <h2>{t('Documents')}</h2>
                <ul className="rk-docs">{attachments.map((a) => <li key={a.id || a.label}><a href={a.file.url || '#'} target="_blank" rel="noopener">{a.label}</a><span className="rk-muted">{(a.file.filename?.split('.').pop() || '').toUpperCase()}</span></li>)}</ul>
              </div>
            )}
            {mls && (
              <div className="rk-idx">
                {idx?.logo && typeof idx.logo === 'object' && img(idx.logo as Media, 'small') && <img src={img(idx.logo as Media, 'small')!.url} alt={idx.mlsName || 'MLS'} />}
                <div>
                  {p.listOffice && <p><strong>{t('Listing courtesy of {office}', { office: p.listOffice })}</strong>{p.listAgentName ? ` · ${p.listAgentName}` : ''}</p>}
                  {p.mlsNumber && <p>{idx?.mlsName || 'MLS'}® #{p.mlsNumber}{p.sourceUpdatedAt ? ` · ${t('Last updated {date}', { date: new Date(p.sourceUpdatedAt).toLocaleDateString(s.$.intl) })}` : ''}</p>}
                  {idx?.disclaimer && <p>{idx.disclaimer}</p>}
                </div>
              </div>
            )}
          </div>
          <aside className="rk-detail-side" aria-label={t('Contact the agent')}>
            {agent && (
              <div className="rk-side-agent">
                {img(agent.photo, 'square') ? <Photo src={img(agent.photo, 'square')} alt={agent.name} /> : <div className="rk-photo"><div className="rk-ph rk-initials" aria-hidden="true"><span>{initials(agent.name)}</span></div></div>}
                <div>
                  {agent.slug ? <Link href={`/agents/${agent.slug}`}><strong>{agent.name}</strong></Link> : <strong>{agent.name}</strong>}
                  <span className="rk-muted">{[agent.jobTitle, agent.phone].filter(Boolean).join(' · ')}</span>
                </div>
              </div>
            )}
            <PropertyContact propertyId={p.id} slotsEnabled={Boolean(s.viewingSlots?.enabled)} />
            <ShareButtons url={s.$.L(`/properties/${p.slug}`)} title={p.title} brochureHref={brochureHref} />
          </aside>
        </div>
      </div>
      {similar.length > 0 && (
        <section className="rk-section rk-similar" style={{ background: 'var(--surface-2)' }}>
          <div className="rk-wrap">
            <div className="rk-section-head"><h2 className="rk-display">{t('You may also like')}</h2></div>
            <div className={theme.listLayout === 'rows' ? 'rk-rows' : 'rk-grid'}>{similar.map((x, i) => <theme.Card key={x.id} p={x} s={s} index={i} />)}</div>
          </div>
        </section>
      )}
    </>
  )
}
