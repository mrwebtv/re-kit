import { Link } from '../i18n/client'
import { formatArea, formatPrice, img, place } from '../data'
import { AgentCard, Brand, CardBadges, ContactLines, FooterLegal, MainNav, menuOf, Photo, PriceLabel, PropertyPhoto, SearchForm, href, type NavItem } from '../components/shared'
import type { CardProps, HomeProps, ThemeKit } from './types'
import type { Site } from '../data'

const DARK_NAV = (s: Site): NavItem[] => [
  { href: '/properties?mode=buy', label: s.$.t('Buy') },
  { href: '/properties?mode=rent', label: s.$.t('Rent') },
  { href: '/valuation', label: s.$.t('Sell') },
  { href: '/agents', label: s.$.t('Advisors') },
]

function Header({ s }: { s: Site }) {
  return (
    <header className="rk-header dk-header">
      <div className="rk-wrap dk-header-inner">
        <Brand s={s} />
        <MainNav s={s} items={menuOf(s, DARK_NAV(s))} cta={{ label: s.$.t('Enquire'), href: '/contact' }} ctaClass="dk-outline rk-nav-cta" className="dk-nav" />
      </div>
    </header>
  )
}

function Footer({ s }: { s: Site }) {
  const t = s.$.t
  return (
    <footer className="rk-footer dk-footer">
      <div className="rk-wrap">
        <div className="rk-footer-top">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 420 }}>
            <span className="rk-brand">{s.agencyName}</span>
            <div className="rk-contact-lines" style={{ fontSize: 15, opacity: 0.75 }}><ContactLines s={s} /></div>
          </div>
          <div className="rk-footer-cols">
            <div><strong>{t('Residences')}</strong><Link href="/properties?mode=buy">{t('For sale')}</Link><Link href="/properties?mode=rent">{t('To let')}</Link><Link href="/favourites">{t('Favourites')}</Link></div>
            <div><strong>{t('Private office')}</strong><Link href="/valuation">{t('Valuations')}</Link><Link href="/agents">{t('Advisors')}</Link><Link href="/contact">{t('Enquire')}</Link></div>
          </div>
        </div>
        <div className="rk-footer-bottom"><FooterLegal s={s} /><span>{t('By appointment only')}</span></div>
      </div>
    </footer>
  )
}

function Card({ p, s, distance }: CardProps) {
  const t = s.$.t
  return (
    <Link href={href(p)} className="rk-card dk-card">
      <div className="rk-card-media" style={{ aspectRatio: '4 / 4.6' }}>
        <PropertyPhoto p={p} />
        <CardBadges p={p} s={s} />
      </div>
      <span className="rk-eyebrow" style={{ color: 'var(--muted)' }}>{place(p)}{distance !== undefined ? ` · ${t('{km} km away', { km: distance })}` : ''}</span>
      <h3 className="rk-card-title">{p.title}</h3>
      <div className="dk-card-meta">
        <span>{[p.bedrooms ? t('{n} bedrooms', { n: p.bedrooms }) : '', formatArea(p.floorArea, s)].filter(Boolean).join(' · ')}</span>
        <PriceLabel p={p} s={s} className="dk-gold" />
      </div>
    </Link>
  )
}

function Home({ s, featured, agents }: HomeProps) {
  const t = s.$.t
  return (
    <>
      <section className="dk-hero">
        <Photo src={img(s.heroImage, 'xlarge')} alt="" className="dk-hero-photo" eager />
        <div className="dk-hero-shade" />
        <div className="dk-hero-copy">
          {s.tagline && <span className="rk-eyebrow">{s.tagline}</span>}
          <h1 className="rk-display">{s.heroHeadline}</h1>
          <span aria-hidden="true" className="dk-rule" />
        </div>
        <div className="rk-wrap dk-hero-search"><SearchForm s={s} className="rk-search dk-glass" buttonLabel={t('Discover')} /></div>
      </section>

      {featured.length > 0 && (
        <section className="rk-wrap" style={{ padding: '140px var(--gutter) 40px', display: 'flex', flexDirection: 'column', gap: 100 }}>
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}>
            <span className="rk-eyebrow">{t('The collection')}</span>
            <h2 className="rk-display" style={{ fontSize: 'clamp(40px, 5vw, 64px)' }}>{t('Currently offered')}</h2>
          </div>
          {featured.slice(0, 3).map((p, i) => (
            <Link key={p.id} href={href(p)} className="dk-feature" style={{ flexDirection: i % 2 ? 'row-reverse' : 'row' }}>
              <PropertyPhoto p={p} size="xlarge" className="dk-feature-photo" />
              <div className="dk-feature-copy">
                <span className="rk-eyebrow" style={{ color: 'var(--muted)' }}>{place(p)}</span>
                <h3 className="rk-display" style={{ fontSize: 'clamp(36px, 3.8vw, 52px)' }}>{p.title}</h3>
                {p.summary && <p>{p.summary}</p>}
                <span className="dk-meta">{[p.bedrooms ? t('{n} bedrooms', { n: p.bedrooms }) : '', formatArea(p.floorArea, s)].filter(Boolean).join('   ·   ')}</span>
                <span className="rk-display dk-gold" style={{ fontSize: 30 }}>{formatPrice(p, s)}</span>
                <span className="dk-more">{t('View residence')}</span>
              </div>
            </Link>
          ))}
        </section>
      )}

      <section className="rk-wrap" style={{ padding: '100px var(--gutter)' }}>
        <div className="dk-quote">
          <span className="rk-eyebrow">{t('Discretion')}</span>
          <p className="rk-display">{t('Some of our finest homes are never advertised. Register privately to see them first.')}</p>
          <Link href="/contact" className="dk-outline" style={{ padding: '18px 34px' }}>{t('Request private access')}</Link>
        </div>
      </section>

      {agents.length > 0 && (
        <section className="rk-wrap" style={{ paddingBottom: 140 }}>
          <div className="rk-section-head">
            <h2 className="rk-display">{t('Your advisors')}</h2>
            <span className="rk-eyebrow" style={{ color: 'var(--muted)' }}>{t('By appointment only')}</span>
          </div>
          <div className="rk-agents" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>{agents.slice(0, 3).map((a) => <AgentCard key={a.id} a={a} />)}</div>
        </section>
      )}
    </>
  )
}

export const dark: ThemeKit = {
  id: 'dark',
  fonts: 'https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;1,6..96,400&family=Jost:wght@300;400;500&display=swap',
  defaultAccent: '#D4B97F',
  Header,
  Footer,
  Home,
  Card,
}
