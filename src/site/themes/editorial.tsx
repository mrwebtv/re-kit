import { Link } from '../i18n/client'
import { img } from '../data'
import { AgentCard, Brand, BrandName, CardBadges, CardShell, ContactLines, Facts, FooterLegal, MainNav, menuOf, NAV, Photo, PriceLabel, PropertyPhoto, SearchForm, href } from '../components/shared'
import type { CardProps, HomeProps, ThemeKit } from './types'
import type { Site } from '../data'

function Header({ s }: { s: Site }) {
  return (
    <header className="rk-header">
      <div className="rk-wrap rk-header-inner">
        <Brand s={s} />
        <MainNav s={s} items={menuOf(s, NAV(s))} cta={{ label: s.$.t('Book a valuation'), href: '/valuation' }} ctaClass="rk-btn rk-btn-outline rk-nav-cta" />
      </div>
    </header>
  )
}

function Footer({ s }: { s: Site }) {
  const t = s.$.t
  return (
    <footer className="rk-footer">
      <div className="rk-wrap">
        <div className="rk-footer-top">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 420 }}>
            <span className="rk-display" style={{ fontSize: 36 }}><BrandName name={s.agencyName || ''} /></span>
            <div className="rk-contact-lines" style={{ fontSize: 15, opacity: 0.8 }}><ContactLines s={s} /></div>
          </div>
          <div className="rk-footer-cols">
            <div><strong>{t('Properties')}</strong><Link href="/properties?mode=buy">{t('For sale')}</Link><Link href="/properties?mode=rent">{t('To let')}</Link><Link href="/favourites">{t('Favourites')}</Link></div>
            <div><strong>{t('Services')}</strong><Link href="/valuation">{t('Valuations')}</Link><Link href="/agents">{t('Our agents')}</Link><Link href="/contact">{t('Contact')}</Link></div>
          </div>
        </div>
        <div className="rk-footer-bottom"><FooterLegal s={s} /></div>
      </div>
    </footer>
  )
}

function Card({ p, s, distance }: CardProps) {
  return (
    <Link href={href(p)} className="rk-card">
      <div className="rk-card-media" style={{ aspectRatio: '4 / 4.4' }}>
        <PropertyPhoto p={p} />
        <CardBadges p={p} s={s} />
      </div>
      <div className="rk-card-top">
        <h3 className="rk-card-title">{p.title}</h3>
        <PriceLabel p={p} s={s} className="rk-card-price" />
      </div>
      <Facts p={p} s={s} />
      {distance !== undefined && <span className="rk-distance">{s.$.t('{km} km away', { km: distance })}</span>}
    </Link>
  )
}

function Home({ s, featured, agents }: HomeProps) {
  const t = s.$.t
  const PILLARS = [
    { n: 'i.', title: t('Photographed properly'), body: t('Every home is shot by a professional photographer, so buyers fall for it before they visit.') },
    { n: 'ii.', title: t('One agent, start to finish'), body: t('The person who values your home answers your calls, hosts the viewings and negotiates the offers.') },
    { n: 'iii.', title: t('Buyers we already know'), body: t('Registered buyers are matched to your home the day it lists.') },
  ]
  return (
    <>
      <section className="rk-wrap">
        <div className="ed-hero">
          <Photo src={img(s.heroImage, 'xlarge')} alt="" className="ed-hero-photo" eager />
          <div className="ed-hero-shade" />
          <div className="ed-hero-copy">
            {s.tagline && <span className="rk-eyebrow" style={{ color: '#fff' }}>{s.tagline}</span>}
            <h1 className="rk-display">{s.heroHeadline}</h1>
          </div>
        </div>
        <SearchForm s={s} className="rk-search ed-search" />
      </section>

      {featured.length > 0 && (
        <section className="rk-section">
          <div className="rk-wrap">
            <div className="rk-section-head">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <span className="rk-eyebrow">{t('Selected residences')}</span>
                <h2 className="rk-display">{t('New to the market')}</h2>
              </div>
              <Link href="/properties" className="rk-link">{t('View all properties')}</Link>
            </div>
            <div className="rk-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
              {featured.map((p) => <CardShell key={p.id} p={p} s={s}><Card p={p} s={s} /></CardShell>)}
            </div>
          </div>
        </section>
      )}

      <section className="rk-wrap" style={{ paddingBottom: 112 }}>
        <div className="ed-sell">
          <Photo src={img(s.sellImage, 'large')} alt="" className="ed-sell-photo" />
          <div className="ed-sell-copy">
            <span className="rk-eyebrow" style={{ color: '#C9AE84' }}>{t('Selling with us')}</span>
            <h2 className="rk-display" style={{ fontSize: 'clamp(40px, 4.4vw, 56px)' }}>{t('What is your home really worth?')}</h2>
            <p>{t('An agent who knows your street visits, walks every room and gives you a written valuation within 48 hours. No obligation, no pressure.')}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
              <Link href="/valuation" className="rk-btn" style={{ background: '#F6F4EF', color: '#1B1B19' }}>{t('Book a free valuation')}</Link>
              <Link href="/contact" className="rk-btn" style={{ color: '#F6F4EF', padding: '0 4px', borderBottom: '1px solid #6B665D' }}>{t('Talk to an agent')}</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="rk-wrap" style={{ paddingBottom: 112 }}>
        <div className="ed-pillars">
          {PILLARS.map((x) => (
            <div key={x.n}>
              <span className="rk-display" style={{ fontSize: 44, fontStyle: 'italic', color: 'var(--accent)' }}>{x.n}</span>
              <h3 className="rk-display" style={{ fontSize: 28, fontWeight: 500 }}>{x.title}</h3>
              <p className="rk-muted" style={{ margin: 0, lineHeight: 1.65 }}>{x.body}</p>
            </div>
          ))}
        </div>
      </section>

      {agents.length > 0 && (
        <section className="rk-section" style={{ background: 'var(--surface-2)' }}>
          <div className="rk-wrap">
            <div className="rk-section-head">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <span className="rk-eyebrow">{t('Our agents')}</span>
                <h2 className="rk-display">{t('The people behind every sale')}</h2>
              </div>
              <Link href="/agents" className="rk-link">{t('Meet the team')}</Link>
            </div>
            <div className="rk-agents">{agents.slice(0, 4).map((a) => <AgentCard key={a.id} a={a} />)}</div>
          </div>
        </section>
      )}
    </>
  )
}

export const editorial: ThemeKit = {
  id: 'editorial',
  fonts: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@400;500;600&display=swap',
  defaultAccent: '#8A6A3F',
  Header,
  Footer,
  Home,
  Card,
}
