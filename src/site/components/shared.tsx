import type { Agent, Media, Page, Property } from '@/payload-types'
import { Link } from '../i18n/client'
import { firstPhoto, formatArea, formatPrice, img, initials, photosOf, place, qualifier, STATUS_LABEL, TYPE_LABEL, type Site } from '../data'
import { Icon } from '../icons'
import { DEFAULT_LOCALE, localeInfo } from '@/i18n/locales'
import { CardActions, HeaderTools, NavToggle } from './Interactive'

export type NavItem = { href: string; label: string; columns?: { heading?: string; image?: { url: string; alt: string } | null; links: { href: string; label: string }[] }[] }

/** Theme default menu, used until the owner builds one in Site Settings > Menu. */
export const NAV = (s: Site): NavItem[] => [
  { href: '/properties?mode=buy', label: s.$.t('Buy') },
  { href: '/properties?mode=rent', label: s.$.t('Rent') },
  { href: '/valuation', label: s.$.t('Sell') },
  { href: '/agents', label: s.$.t('Our agents') },
  { href: '/contact', label: s.$.t('Contact') },
]

const linkOf = (x: { url?: string | null; page?: number | Page | null }) => (x.page && typeof x.page === 'object' ? `/${x.page.slug}` : x.url || '#')

export function menuOf(s: Site, fallback: NavItem[]): NavItem[] {
  if (!s.menu?.length) return fallback
  return s.menu.map((m) => ({
    href: linkOf(m),
    label: m.label,
    columns: (m.columns || []).map((c) => ({ heading: c.heading || undefined, image: img(c.image as Media, 'medium'), links: (c.links || []).map((l) => ({ href: linkOf(l), label: l.label })) })),
  }))
}

/** Menu with dropdowns / mega menus, language and currency switchers, header button and mobile toggle. */
export function MainNav({ s, items, cta, ctaClass, className, label = 'Main', tools = true }: { s: Site; items: NavItem[]; cta?: { label: string; href: string } | null; ctaClass?: string; className?: string; label?: string; tools?: boolean }) {
  const t = s.$.t
  const button = s.ctaLabel ? { label: s.ctaLabel, href: s.ctaUrl || '/valuation' } : cta
  return (
    <>
      <NavToggle label={t('Menu')} />
      <nav aria-label={label} className={`rk-nav ${className || ''}`}>
        {items.map((n) =>
          n.columns?.length ? (
            <div key={n.label} className={`rk-dd${n.columns.length > 1 ? ' is-mega' : ''}`}>
              <Link href={n.href} className="rk-dd-top" aria-haspopup="true">{n.label}<span aria-hidden="true" className="rk-caret" /></Link>
              <div className="rk-dd-panel">
                {n.columns.map((c, i) => (
                  <div key={i} className="rk-dd-col">
                    {c.image && <img src={c.image.url} alt="" className="rk-dd-img" loading="lazy" />}
                    {c.heading && <span className="rk-dd-head">{c.heading}</span>}
                    {c.links.map((l) => <Link key={l.href + l.label} href={l.href}>{l.label}</Link>)}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <Link key={n.href + n.label} href={n.href}>{n.label}</Link>
          ),
        )}
        {tools && (
          <HeaderTools
            languages={s.languageSwitcher !== false && s.$.languages.length > 1 ? s.$.languages.map((code) => ({ code, label: localeInfo(code).label, href: `${code === DEFAULT_LOCALE ? '' : `/${code}`}${s.$.path === '/' && code !== DEFAULT_LOCALE ? '' : s.$.path}` || '/' })) : []}
            current={s.$.locale}
            currencies={s.currencySwitcher ? Array.from(new Set([(s.currencyCode || 'USD').toUpperCase(), ...((s.currencies || []) as string[])])) : []}
            currency={s.$.cur?.code || (s.currencyCode || 'USD').toUpperCase()}
            labels={{ language: t('Language'), currency: t('Currency') }}
          />
        )}
        {button && <Link href={button.href} className={ctaClass || 'rk-btn rk-btn-outline rk-nav-cta'}>{button.label}</Link>}
      </nav>
    </>
  )
}

export function Brand({ s, className }: { s: Site; className?: string }) {
  const logo = img(s.logo, 'small')
  const name = s.agencyName || 'Real Estate'
  return (
    <Link href="/" className={className || 'rk-brand'} aria-label={`${name}, ${s.$.t('home')}`}>
      {logo ? <img src={logo.url} alt={name} style={{ height: 40, width: 'auto', display: 'block' }} /> : <BrandName name={name} />}
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
      {src ? <img src={src.url} alt={alt ?? src.alt} loading={eager ? 'eager' : 'lazy'} /> : <div className="rk-ph" aria-hidden="true" />}
    </div>
  )
}

export function PropertyPhoto({ p, className, size = 'large', eager }: { p: Property; className?: string; size?: 'small' | 'medium' | 'large' | 'xlarge'; eager?: boolean }) {
  return <Photo src={firstPhoto(p, size)} alt={p.title} className={className} eager={eager} />
}

export function Facts({ p, s, className }: { p: Property; s: Site; className?: string }) {
  const t = s.$.t
  const bits = [place(p), p.bedrooms ? t('{n} bed', { n: p.bedrooms }) : '', p.bathrooms ? t('{n} bath', { n: p.bathrooms }) : '', formatArea(p.floorArea, s), ...cardFields(p)].filter(Boolean)
  return (
    <div className={className || 'rk-facts'}>
      {bits.map((b) => <span key={b}>{b}</span>)}
    </div>
  )
}

/** Custom fields marked "show on card". */
export function cardFields(p: Property) {
  return (p.customFields || [])
    .filter((c) => c.field && typeof c.field === 'object' && c.field.showOnCard)
    .map((c) => {
      const f = c.field as { name: string; unit?: string | null }
      return c.value ? `${c.value}${f.unit ? ` ${f.unit}` : ''} ${f.name}`.trim() : f.name
    })
}

export const statusLabel = (p: Property, s: Site) => s.$.t(STATUS_LABEL[p.status] || p.status)
export const price = formatPrice
export const href = (p: Property) => `/properties/${p.slug}`

/** Status badge plus any labels ("New build", "Price reduced"). */
export function CardBadges({ p, s }: { p: Property; s: Site }) {
  const labels = (p.labels || []).filter((l) => typeof l === 'object') as { id: number; name: string; color?: string | null; icon?: string | null }[]
  return (
    <span className="rk-badges">
      <span className="rk-badge">{statusLabel(p, s)}</span>
      {labels.map((l) => (
        <span key={l.id} className="rk-badge rk-label" style={l.color ? { background: l.color, color: '#fff' } : undefined}>
          {l.icon && <Icon name={l.icon} size={12} />}
          {l.name}
        </span>
      ))}
    </span>
  )
}

/** Wraps any theme card with favourite, compare and quick view buttons. */
export function CardShell({ p, s, children }: { p: Property; s: Site; children: React.ReactNode }) {
  const t = s.$.t
  const quick = {
    id: p.id,
    title: p.title,
    href: s.$.L(href(p)),
    price: formatPrice(p, s),
    qualifier: qualifier(p, s),
    status: statusLabel(p, s),
    place: place(p),
    summary: p.summary || '',
    photos: photosOf(p, 'large').slice(0, 8).map((x) => x.url),
    facts: [
      p.bedrooms ? [t('Bedrooms'), String(p.bedrooms)] : null,
      p.bathrooms ? [t('Bathrooms'), String(p.bathrooms)] : null,
      p.floorArea ? [t('Floor area'), formatArea(p.floorArea, s)] : null,
      p.propertyType ? [t('Type'), t(TYPE_LABEL[p.propertyType] || p.propertyType)] : null,
    ].filter(Boolean) as [string, string][],
  }
  return (
    <div className="rk-cardshell">
      {children}
      <CardActions data={quick} />
    </div>
  )
}

export function SearchForm({ s, className, buttonLabel, defaults = {} }: { s: Site; className?: string; buttonLabel?: string; defaults?: Record<string, string | undefined> }) {
  const t = s.$.t
  return (
    <form action={s.$.L('/properties')} method="get" className={className || 'rk-search'}>
      <input type="hidden" name="mode" value={defaults.mode || 'buy'} />
      <div className="rk-field">
        <label htmlFor="s-q">{t('Location')}</label>
        <input id="s-q" name="q" placeholder={t('Town, area or postcode')} defaultValue={defaults.q} />
      </div>
      <div className="rk-field">
        <label htmlFor="s-type">{t('Property type')}</label>
        <select id="s-type" name="type" defaultValue={defaults.type || ''}>
          <option value="">{t('Any type')}</option>
          {['house', 'apartment', 'townhouse', 'bungalow', 'villa'].map((v) => <option key={v} value={v}>{t(TYPE_LABEL[v]!)}</option>)}
        </select>
      </div>
      <div className="rk-field">
        <label htmlFor="s-beds">{t('Bedrooms')}</label>
        <select id="s-beds" name="beds" defaultValue={defaults.beds || ''}>
          <option value="">{t('Any')}</option>
          {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}+</option>)}
        </select>
      </div>
      <div className="rk-field">
        <label htmlFor="s-max">{t('Max price')}</label>
        <select id="s-max" name="max" defaultValue={defaults.max || ''}>
          <option value="">{t('No max')}</option>
          {[500000, 750000, 1000000, 1500000, 2500000, 5000000].map((n) => <option key={n} value={n}>{(s.currencySymbol || '')}{n.toLocaleString(s.$.intl)}</option>)}
        </select>
      </div>
      <button type="submit" className="rk-btn rk-btn-primary">{buttonLabel || t('Search homes')}</button>
    </form>
  )
}

export function AgentCard({ a, className, s }: { a: Agent; className?: string; s?: Site }) {
  const photo = img(a.photo, 'medium')
  const link = a.slug ? `/agents/${a.slug}` : null
  const media = photo ? (
    <Photo src={photo} alt={a.name} className="rk-agent-photo" />
  ) : (
    <div className="rk-photo rk-agent-photo">
      <div className="rk-ph rk-initials" aria-hidden="true"><span>{initials(a.name)}</span></div>
    </div>
  )
  return (
    <div className={className || 'rk-agent'}>
      {link ? <Link href={link} aria-label={a.name}>{media}</Link> : media}
      <div className="rk-agent-meta">
        {link ? <Link href={link} className="rk-agent-name">{a.name}</Link> : <span className="rk-agent-name">{a.name}</span>}
        {a.jobTitle && <span className="rk-agent-role">{a.jobTitle}</span>}
        {(a.phone || a.email) && (
          <span className="rk-agent-contact">
            {a.phone && <a href={`tel:${a.phone.replace(/\s/g, '')}`}>{a.phone}</a>}
            {a.email && <a href={`mailto:${a.email}`}>{a.email}</a>}
          </span>
        )}
        {s && link && <Link href={link} className="rk-link" style={{ alignSelf: 'flex-start', marginTop: 8 }}>{s.$.t('View profile')}</Link>}
      </div>
    </div>
  )
}

export function ContactLines({ s }: { s: Site }) {
  return (
    <>
      {s.address && <span style={{ whiteSpace: 'pre-line' }}>{s.address}</span>}
      {s.phone && <a href={`tel:${s.phone.replace(/\s/g, '')}`}>{s.phone}</a>}
      {s.email && <a href={`mailto:${s.email}`}>{s.email}</a>}
    </>
  )
}

/** Privacy link, company name and optional "Website by" credit. Used by every theme footer. */
export function FooterLegal({ s }: { s: Site }) {
  return (
    <span className="rk-legal">
      <span>© {new Date().getFullYear()} {s.companyName || s.agencyName}</span>
      <Link href="/privacy">{s.$.t('Privacy policy')}</Link>
      <Link href="/blog">{s.$.t('Blog')}</Link>
      {s.showCredit && s.creditText && (s.creditUrl ? <a href={s.creditUrl} target="_blank" rel="noopener">{s.creditText}</a> : <span>{s.creditText}</span>)}
    </span>
  )
}

/** "Offers over" style label above a price. */
export function PriceLabel({ p, s, className }: { p: Property; s: Site; className?: string }) {
  const q = qualifier(p, s)
  return (
    <span className={className}>
      {q && <span className="rk-qualifier">{q}</span>}
      {formatPrice(p, s)}
    </span>
  )
}
