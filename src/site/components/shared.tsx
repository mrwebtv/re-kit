import Link from 'next/link'
import type { Agent, Property, SiteSetting } from '@/payload-types'
import { firstPhoto, formatArea, formatPrice, img, initials, place, qualifier, STATUS_LABEL } from '../data'

export const NAV = [
  { href: '/properties?mode=buy', label: 'Buy' },
  { href: '/properties?mode=rent', label: 'Rent' },
  { href: '/valuation', label: 'Sell' },
  { href: '/agents', label: 'Our agents' },
  { href: '/contact', label: 'Contact' },
]

export function Brand({ s, className }: { s: SiteSetting; className?: string }) {
  const logo = img(s.logo, 'small')
  const name = s.agencyName || 'Real Estate'
  return (
    <Link href="/" className={className || 'rk-brand'} aria-label={`${name}, home`}>
      {logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logo.url} alt={name} style={{ height: 40, width: 'auto', display: 'block' }} />
      ) : (
        <BrandName name={name} />
      )}
    </Link>
  )
}

/** Renders "A & B" with the ampersand styled as an accent. */
export function BrandName({ name }: { name: string }) {
  const parts = name.split('&')
  if (parts.length !== 2) return <>{name}</>
  return (
    <>
      {parts[0]}
      <em className="rk-amp">&amp;</em>
      {parts[1]}
    </>
  )
}

/** A property or settings image, or a toned placeholder when none is uploaded yet. */
export function Photo({ src, alt, className, eager }: { src: { url: string; alt: string } | null; alt?: string; className?: string; eager?: boolean }) {
  return (
    <div className={`rk-photo ${className || ''}`}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src.url} alt={alt ?? src.alt} loading={eager ? 'eager' : 'lazy'} />
      ) : (
        <div className="rk-ph" aria-hidden="true" />
      )}
    </div>
  )
}

export function PropertyPhoto({ p, className, size = 'large', eager }: { p: Property; className?: string; size?: 'small' | 'medium' | 'large' | 'xlarge'; eager?: boolean }) {
  return <Photo src={firstPhoto(p, size)} alt={p.title} className={className} eager={eager} />
}

export function Facts({ p, s, className }: { p: Property; s: SiteSetting; className?: string }) {
  const bits = [place(p), p.bedrooms ? `${p.bedrooms} bed` : '', p.bathrooms ? `${p.bathrooms} bath` : '', formatArea(p.floorArea, s)].filter(Boolean)
  return (
    <div className={className || 'rk-facts'}>
      {bits.map((b) => (
        <span key={b}>{b}</span>
      ))}
    </div>
  )
}

export const statusLabel = (p: Property) => STATUS_LABEL[p.status] || p.status
export const price = formatPrice
export const href = (p: Property) => `/properties/${p.slug}`

export function SearchForm({ className, buttonLabel = 'Search homes', defaults = {} }: { className?: string; buttonLabel?: string; defaults?: Record<string, string | undefined> }) {
  return (
    <form action="/properties" method="get" className={className || 'rk-search'}>
      <input type="hidden" name="mode" value={defaults.mode || 'buy'} />
      <div className="rk-field">
        <label htmlFor="s-q">Location</label>
        <input id="s-q" name="q" placeholder="Town, area or postcode" defaultValue={defaults.q} />
      </div>
      <div className="rk-field">
        <label htmlFor="s-type">Property type</label>
        <select id="s-type" name="type" defaultValue={defaults.type || ''}>
          <option value="">Any type</option>
          <option value="house">House</option>
          <option value="apartment">Apartment</option>
          <option value="townhouse">Townhouse</option>
          <option value="bungalow">Bungalow</option>
        </select>
      </div>
      <div className="rk-field">
        <label htmlFor="s-beds">Bedrooms</label>
        <select id="s-beds" name="beds" defaultValue={defaults.beds || ''}>
          <option value="">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
          <option value="5">5+</option>
        </select>
      </div>
      <div className="rk-field">
        <label htmlFor="s-max">Max price</label>
        <select id="s-max" name="max" defaultValue={defaults.max || ''}>
          <option value="">No max</option>
          <option value="500000">500,000</option>
          <option value="750000">750,000</option>
          <option value="1000000">1,000,000</option>
          <option value="1500000">1,500,000</option>
          <option value="2500000">2,500,000</option>
          <option value="5000000">5,000,000</option>
        </select>
      </div>
      <button type="submit" className="rk-btn rk-btn-primary">{buttonLabel}</button>
    </form>
  )
}

export function AgentCard({ a, className }: { a: Agent; className?: string }) {
  const photo = img(a.photo, 'medium')
  return (
    <div className={className || 'rk-agent'}>
      {photo ? (
        <Photo src={photo} alt={a.name} className="rk-agent-photo" />
      ) : (
        <div className="rk-photo rk-agent-photo">
          <div className="rk-ph rk-initials" aria-hidden="true">
            <span>{initials(a.name)}</span>
          </div>
        </div>
      )}
      <div className="rk-agent-meta">
        <span className="rk-agent-name">{a.name}</span>
        {a.jobTitle && <span className="rk-agent-role">{a.jobTitle}</span>}
        {(a.phone || a.email) && (
          <span className="rk-agent-contact">
            {a.phone && <a href={`tel:${a.phone.replace(/\s/g, '')}`}>{a.phone}</a>}
            {a.email && <a href={`mailto:${a.email}`}>{a.email}</a>}
          </span>
        )}
      </div>
    </div>
  )
}

export function ContactLines({ s }: { s: SiteSetting }) {
  return (
    <>
      {s.address && <span style={{ whiteSpace: 'pre-line' }}>{s.address}</span>}
      {s.phone && <a href={`tel:${s.phone.replace(/\s/g, '')}`}>{s.phone}</a>}
      {s.email && <a href={`mailto:${s.email}`}>{s.email}</a>}
    </>
  )
}

/** Privacy link, company name and optional "Website by" credit. Used by every theme footer. */
export function FooterLegal({ s }: { s: SiteSetting }) {
  return (
    <span className="rk-legal">
      <span>© {new Date().getFullYear()} {s.companyName || s.agencyName}</span>
      <Link href="/privacy">Privacy policy</Link>
      {s.showCredit && s.creditText && (s.creditUrl ? <a href={s.creditUrl} target="_blank" rel="noopener">{s.creditText}</a> : <span>{s.creditText}</span>)}
    </span>
  )
}

/** "Offers over" style label above a price. */
export function PriceLabel({ p, s, className }: { p: Property; s: SiteSetting; className?: string }) {
  const q = qualifier(p)
  return (
    <span className={className}>
      {q && <span className="rk-qualifier">{q}</span>}
      {formatPrice(p, s)}
    </span>
  )
}
