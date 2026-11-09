import { Link } from '../i18n/client'
import { formatArea, formatPrice, img, place } from '../data'
import { AgentCard, Brand, CardBadges, CardShell, ContactLines, FooterLegal, MainNav, menuOf, NAV, Photo, PriceLabel, PropertyPhoto, cardFields, href, statusLabel } from '../components/shared'
import type { CardProps, HomeProps, ThemeKit } from './types'
import type { Site } from '../data'

const HouseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /></svg>
)

function Header({ s }: { s: Site }) {
  return (
    <header className="rk-header">
      <div className="rk-wrap rk-header-inner">
        <span className="md-brand">
          {!s.logo && <span className="md-mark"><HouseIcon /></span>}
          <Brand s={s} />
        </span>
        <MainNav s={s} items={menuOf(s, NAV(s))} cta={{ label: s.$.t('Free valuation'), href: '/valuation' }} ctaClass="rk-btn rk-btn-accent rk-nav-cta" />
      </div>
    </header>
  )
}

function Footer({ s }: { s: Site }) {
  const t = s.$.t
  return (
    <footer className="rk-footer md-footer">
      <div className="rk-wrap">
        <div className="rk-footer-top">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 420 }}>
            <span style={{ fontWeight: 800, fontSize: 22 }}>{s.agencyName}</span>
            <div className="rk-contact-lines" style={{ fontSize: 15 }}><ContactLines s={s} /></div>
          </div>
          <div className="rk-footer-cols">
            <div><strong>{t('Search')}</strong><Link href="/properties?mode=buy">{t('Buy')}</Link><Link href="/properties?mode=rent">{t('Rent')}</Link><Link href="/favourites">{t('Favourites')}</Link></div>
            <div><strong>{t('Company')}</strong><Link href="/valuation">{t('Sell')}</Link><Link href="/agents">{t('Agents')}</Link><Link href="/contact">{t('Contact')}</Link></div>
          </div>
        </div>
        <div className="rk-footer-bottom"><FooterLegal s={s} /></div>
      </div>
    </footer>
  )
}

function Card({ p, s, distance }: CardProps) {
  const t = s.$.t
  return (
    <Link href={href(p)} className="rk-card md-card">
      <div className="rk-card-media" style={{ aspectRatio: '4 / 3' }}>
        <PropertyPhoto p={p} size="medium" />
        <CardBadges p={p} s={s} />
      </div>
      <div className="md-card-body">
        <PriceLabel p={p} s={s} className="md-card-price" />
        <span className="md-card-title">{p.title}</span>
        <span className="rk-muted" style={{ fontSize: 14 }}>
          {[p.bedrooms ? t('{n} bd', { n: p.bedrooms }) : '', p.bathrooms ? t('{n} ba', { n: p.bathrooms }) : '', formatArea(p.floorArea, s), place(p), ...cardFields(p)].filter(Boolean).join(' · ')}
        </span>
        {distance !== undefined && <span className="rk-distance">{t('{km} km away', { km: distance })}</span>}
      </div>
    </Link>
  )
}

function Home({ s, featured, latest, agents }: HomeProps) {
  const t = s.$.t
  const spotlight = featured[0]
  const STEPS = [
    { n: '1', title: t('Free valuation'), body: t('A local agent visits and gives you a written price within 48 hours.') },
    { n: '2', title: t('Photos and launch'), body: t('Professional photos, a floor plan and your listing live on every major portal.') },
    { n: '3', title: t('Viewings to keys'), body: t('We host viewings, negotiate offers and keep you updated until completion.') },
  ]
  return (
    <>
      <section className="rk-wrap md-hero">
        <div className="md-hero-copy">
          {s.tagline && <span className="md-pill">{s.tagline}</span>}
          <h1 className="rk-display">{s.heroHeadline}</h1>
          {s.heroText && <p>{s.heroText}</p>}
          <form action={s.$.L('/properties')} method="get" className="md-search">
            <div className="md-search-tabs" role="radiogroup" aria-label={t('Search type')}>
              <label><input type="radio" name="mode" value="buy" defaultChecked /><span>{t('Buy')}</span></label>
              <label><input type="radio" name="mode" value="rent" /><span>{t('Rent')}</span></label>
            </div>
            <div className="md-search-row">
              <label htmlFor="md-q" className="rk-sr">{t('Location')}</label>
              <input id="md-q" name="q" placeholder={t('City, neighbourhood or postcode')} />
              <button type="submit" className="rk-btn rk-btn-accent">{t('Search')}</button>
            </div>
          </form>
        </div>
        <div className="md-hero-media">
          <Photo src={img(s.heroImage, 'xlarge')} alt="" className="md-hero-photo" eager />
          {spotlight && (
            <Link href={href(spotlight)} className="md-float">
              <PropertyPhoto p={spotlight} size="small" className="md-float-photo" />
              <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#16a34a' }}>{statusLabel(spotlight, s)}</span>
                <span style={{ fontSize: 18, fontWeight: 800 }}>{formatPrice(spotlight, s)}</span>
                <span className="rk-muted" style={{ fontSize: 13 }}>{spotlight.title}</span>
              </span>
            </Link>
          )}
        </div>
      </section>

      {latest.length > 0 && (
        <section className="rk-wrap" style={{ paddingBottom: 96 }}>
          <div className="rk-section-head" style={{ marginBottom: 28 }}>
            <h2 className="rk-display">{t('Homes for you')}</h2>
            <div className="md-chips">
              <Link href="/properties" className="is-on">{t('All')}</Link>
              <Link href="/properties?type=house">{t('Houses')}</Link>
              <Link href="/properties?type=apartment">{t('Apartments')}</Link>
              <Link href="/properties?mode=rent">{t('To rent')}</Link>
            </div>
          </div>
          <div className="rk-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 24 }}>
            {latest.slice(0, 4).map((p) => <CardShell key={p.id} p={p} s={s}><Card p={p} s={s} /></CardShell>)}
          </div>
        </section>
      )}

      <section className="rk-wrap" style={{ paddingBottom: 96 }}>
        <div className="md-band">
          <div style={{ flex: '1 1 420px', padding: 'clamp(32px, 5vw, 64px)', display: 'flex', flexDirection: 'column', gap: 18, justifyContent: 'center' }}>
            <h2 className="rk-display" style={{ fontSize: 'clamp(30px, 3.2vw, 40px)' }}>{t('Search on the map')}</h2>
            <p className="rk-muted" style={{ margin: 0, fontSize: 17, lineHeight: 1.6 }}>{t('See every home we have, where it is, and open any listing straight from the map.')}</p>
            <Link href="/properties?view=map" className="rk-btn rk-btn-primary" style={{ alignSelf: 'flex-start' }}>{t('Open map search')}</Link>
          </div>
          <Photo src={img(s.sellImage, 'large')} alt="" className="md-band-photo" />
        </div>
      </section>

      <section className="rk-wrap" style={{ paddingBottom: 96 }}>
        <h2 className="rk-display" style={{ fontSize: 'clamp(30px, 3.2vw, 40px)', marginBottom: 28 }}>{t('Selling? Here is how it works')}</h2>
        <div className="rk-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
          {STEPS.map((x) => (
            <div key={x.n} className="md-step">
              <span className="md-step-n">{x.n}</span>
              <h3 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>{x.title}</h3>
              <p className="rk-muted" style={{ margin: 0, lineHeight: 1.6 }}>{x.body}</p>
            </div>
          ))}
        </div>
      </section>

      {agents.length > 0 && (
        <section className="rk-wrap" style={{ paddingBottom: 96 }}>
          <div className="rk-section-head" style={{ marginBottom: 28 }}>
            <h2 className="rk-display">{t('Meet your agents')}</h2>
            <Link href="/agents" className="rk-link">{t('All agents')}</Link>
          </div>
          <div className="rk-agents">{agents.slice(0, 4).map((a) => <AgentCard key={a.id} a={a} />)}</div>
        </section>
      )}

      <section className="rk-wrap" style={{ paddingBottom: 96 }}>
        <div className="md-cta">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 620 }}>
            <h2 className="rk-display" style={{ fontSize: 'clamp(30px, 3.6vw, 44px)', color: '#fff' }}>{t('What is your home worth?')}</h2>
            <p style={{ margin: 0, fontSize: 18, lineHeight: 1.6, opacity: 0.85 }}>{t('Get a free, no-obligation valuation from a local agent within 48 hours.')}</p>
          </div>
          <Link href="/valuation" className="rk-btn" style={{ background: '#fff', color: '#0f172a', fontWeight: 800 }}>{t('Book a valuation')}</Link>
        </div>
      </section>
    </>
  )
}

export const modern: ThemeKit = {
  id: 'modern',
  fonts: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap',
  defaultAccent: '#1D4ED8',
  Header,
  Footer,
  Home,
  Card,
}
