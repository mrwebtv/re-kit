import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Agent, Media } from '@/payload-types'
import RichText from '@/components/RichText'
import { formatArea, formatPrice, getProperty, getSettings, getSimilar, img, initials, place, qualifier, siteUrl, STATUS_LABEL, TYPE_LABEL } from '@/site/data'
import { getTheme } from '@/site/themes'
import { Gallery } from '@/site/components/Gallery'
import { PropertyContact } from '@/site/components/LeadForm'
import { PropertyMap } from '@/site/components/PropertyMap'
import { Photo } from '@/site/components/shared'
import { MortgageCalculator, ShareButtons } from '@/site/components/Extras'
import { embedUrl } from '@/site/embed'

type Params = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: Params }) {
  const p = await getProperty((await params).slug)
  if (!p) return {}
  const photo = ((p.gallery || []) as (number | Media)[]).map((m) => img(m, 'large')).find(Boolean)
  return {
    title: p.title,
    description: p.summary || undefined,
    alternates: { canonical: `/properties/${p.slug}` },
    openGraph: { title: p.title, description: p.summary || undefined, images: photo ? [{ url: photo.url }] : undefined },
  }
}

export default async function PropertyPage({ params }: { params: Params }) {
  const { slug } = await params
  const [p, s] = await Promise.all([getProperty(slug), getSettings()])
  if (!p) notFound()
  const theme = getTheme(s.theme)
  const similar = await getSimilar(p)
  const photos = ((p.gallery || []) as (number | Media)[])
    .map((m) => ({ small: img(m, 'large'), full: img(m, 'xlarge') }))
    .filter((x) => x.small)
    .map((x) => ({ url: x.small!.url, full: x.full?.url || x.small!.url, alt: x.small!.alt }))
  const plans = ((p.floorPlans || []) as (number | Media)[]).map((m) => img(m, 'large')).filter(Boolean)
  const agent = p.agent && typeof p.agent === 'object' ? (p.agent as Agent) : null
  const facts = [
    ['Bedrooms', p.bedrooms],
    ['Bathrooms', p.bathrooms],
    ['Floor area', formatArea(p.floorArea, s)],
    ['Type', p.propertyType ? TYPE_LABEL[p.propertyType] : null],
    ['Energy rating', p.energyRating],
  ].filter(([, v]) => v !== null && v !== undefined && v !== '' && v !== 0)
  const hasMap = typeof p.lat === 'number' && typeof p.lng === 'number'
  const rent = p.status === 'to-let' || p.status === 'let'
  const f = s.features
  const video = embedUrl(p.videoUrl)
  const tour = embedUrl(p.tourUrl)
  const now = Date.now()
  const upcoming = (p.openHouses || []).filter((o) => new Date(o.end || o.start).getTime() > now - 3600_000).sort((a, b) => a.start.localeCompare(b.start))
  const customBrochure = p.brochure && typeof p.brochure === 'object' ? (p.brochure as Media).url : null
  const brochureHref = s.brochureEnabled === false ? undefined : customBrochure || `/properties/${p.slug}/brochure`
  const base = siteUrl()
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: p.title,
    description: p.summary || undefined,
    url: `${base}/properties/${p.slug}`,
    image: photos.slice(0, 6).map((x) => (x.full.startsWith('http') ? x.full : `${base}${x.full}`)),
    datePosted: p.createdAt,
    offers: p.priceOnRequest ? undefined : { '@type': 'Offer', price: p.price, priceCurrency: s.currencyCode || 'USD', availability: p.status === 'for-sale' || p.status === 'to-let' ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut', businessFunction: rent ? 'http://purl.org/goodrelations/v1#LeaseOut' : 'http://purl.org/goodrelations/v1#Sell' },
    about: {
      '@type': p.propertyType === 'apartment' ? 'Apartment' : 'SingleFamilyResidence',
      numberOfRooms: p.bedrooms || undefined,
      numberOfBedrooms: p.bedrooms || undefined,
      numberOfBathroomsTotal: p.bathrooms || undefined,
      floorSize: p.floorArea ? { '@type': 'QuantitativeValue', value: p.floorArea, unitCode: 'MTK' } : undefined,
      address: { '@type': 'PostalAddress', streetAddress: p.address?.line1 || undefined, addressLocality: p.address?.town || undefined, addressRegion: p.address?.region || undefined, postalCode: p.address?.postcode || undefined },
      geo: hasMap ? { '@type': 'GeoCoordinates', latitude: p.lat, longitude: p.lng } : undefined,
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <div className="rk-wrap">
        <nav className="rk-crumbs" aria-label="Breadcrumb">
          <Link href={`/properties?mode=${rent ? 'rent' : 'buy'}`}>{rent ? 'Homes to rent' : 'Homes for sale'}</Link>
          {p.address?.town && (<><span aria-hidden="true">/</span><Link href={`/properties?mode=${rent ? 'rent' : 'buy'}&q=${encodeURIComponent(p.address.town)}`}>{p.address.town}</Link></>)}
          <span aria-hidden="true">/</span><span aria-current="page" style={{ color: 'var(--ink)' }}>{p.title}</span>
        </nav>
        <Gallery photos={photos} title={p.title} />
        <div className="rk-detail">
          <div className="rk-detail-main">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <span className="rk-eyebrow">{STATUS_LABEL[p.status]}{place(p) ? ` · ${place(p)}` : ''}</span>
              <div className="rk-title-row">
                <h1 className="rk-display">{p.title}</h1>
                <span className="rk-price-lg">{qualifier(p) && <span className="rk-qualifier">{qualifier(p)}</span>}{formatPrice(p, s)}</span>
              </div>
              {(p.address?.line1 || p.address?.postcode) && (
                <p className="rk-muted" style={{ margin: 0 }}>{[p.address?.line1, p.address?.town, p.address?.postcode].filter(Boolean).join(', ')}</p>
              )}
            </div>
            {facts.length > 0 && (
              <div className="rk-keyfacts">
                {facts.map(([k, v]) => (
                  <div className="rk-keyfact" key={k as string}><span>{k}</span><span>{v}</span></div>
                ))}
              </div>
            )}
            {(p.summary || p.description) && (
              <div className="rk-prose">
                <h2>About this home</h2>
                {p.summary && <p className="rk-summary">{p.summary}</p>}
                {p.description && <RichText data={p.description} enableGutter={false} enableProse={false} />}
              </div>
            )}
            {p.features && p.features.length > 0 && (
              <div>
                <h2>Features</h2>
                <ul className="rk-features">{p.features.map((f) => <li key={f.id || f.feature}>{f.feature}</li>)}</ul>
              </div>
            )}
            {f?.videoTours && (video || tour) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h2>{video && tour ? 'Video and 3D tour' : video ? 'Video tour' : '3D tour'}</h2>
                {video && <div className="rk-embed"><iframe src={video} title={`${p.title} video`} allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen" loading="lazy" /></div>}
                {tour && <div className="rk-embed"><iframe src={tour} title={`${p.title} 3D tour`} allow="fullscreen; xr-spatial-tracking" loading="lazy" /></div>}
              </div>
            )}
            {f?.openHouses && upcoming.length > 0 && (
              <div>
                <h2>Open house</h2>
                <ul className="rk-openhouses">
                  {upcoming.map((o) => {
                    const d = new Date(o.start)
                    const t = (x: Date) => x.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })
                    return (
                      <li key={o.id || o.start}>
                        <strong>{d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })}</strong>
                        <span className="rk-muted">{t(d)}{o.end ? ` to ${t(new Date(o.end))}` : ''}</span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
            {(plans.length > 0 || hasMap) && (
              <div className="rk-twocol">
                {plans.length > 0 && (
                  <div><h2>Floor plan</h2><div className="rk-floorplan">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={plans[0]!.url} alt={`${p.title} floor plan`} /></div></div>
                )}
                {hasMap && (
                  <div><h2>Location</h2><PropertyMap points={[{ id: p.id, lat: p.lat!, lng: p.lng!, label: p.title, highlight: true }]} zoom={14} className="rk-map" /></div>
                )}
              </div>
            )}
            {f?.mortgageCalculator && p.status === 'for-sale' && !p.priceOnRequest && p.price > 0 && (
              <div>
                <h2>Mortgage calculator</h2>
                <MortgageCalculator price={p.price} symbol={s.currencySymbol || '$'} rate={f.mortgageRate ?? 4.5} years={f.mortgageYears ?? 30} deposit={f.mortgageDeposit ?? 10} />
              </div>
            )}
          </div>
          <aside className="rk-detail-side" aria-label="Contact the agent">
            {agent && (
              <div className="rk-side-agent">
                {img(agent.photo, 'square') ? (
                  <Photo src={img(agent.photo, 'square')} alt={agent.name} />
                ) : (
                  <div className="rk-photo"><div className="rk-ph rk-initials" aria-hidden="true"><span>{initials(agent.name)}</span></div></div>
                )}
                <div>
                  <strong>{agent.name}</strong>
                  <span className="rk-muted">{[agent.jobTitle, agent.phone].filter(Boolean).join(' · ')}</span>
                </div>
              </div>
            )}
            <PropertyContact propertyId={p.id} consentText={s.consentText || undefined} />
            <ShareButtons url={`/properties/${p.slug}`} title={p.title} brochureHref={brochureHref} />
          </aside>
        </div>
      </div>
      {similar.length > 0 && (
        <section className="rk-section" style={{ background: 'var(--surface-2)' }}>
          <div className="rk-wrap">
            <div className="rk-section-head"><h2 className="rk-display">You may also like</h2></div>
            <div className={theme.listLayout === 'rows' ? 'rk-rows' : 'rk-grid'}>
              {similar.map((x, i) => <theme.Card key={x.id} p={x} s={s} index={i} />)}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
