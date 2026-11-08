import Link from 'next/link'
import { formatArea, formatPrice, img, place } from '../data'
import { AgentCard, Brand, ContactLines, NAV, Photo, PropertyPhoto, href, statusLabel } from '../components/shared'
import type { CardProps, HomeProps, ThemeKit } from './types'
import type { SiteSetting } from '@/payload-types'

const HouseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /></svg>
)

function Header({ s }: { s: SiteSetting }) {
  return (
    <header className="rk-header">
      <div className="rk-wrap rk-header-inner">
        <span className="md-brand">
          {!s.logo && <span className="md-mark"><HouseIcon /></span>}
          <Brand s={s} />
        </span>
        <nav aria-label="Main" className="rk-nav">
          {NAV.map((n) => <Link key={n.href} href={n.href}>{n.label}</Link>)}
          <Link href="/valuation" className="rk-btn rk-btn-accent" style={{ minHeight: 44, padding: '0 20px' }}>Free valuation</Link>
        </nav>
      </div>
    </header>
  )
}

function Footer({ s }: { s: SiteSetting }) {
  return (
    <footer className="rk-footer md-footer">
      <div className="rk-wrap">
        <div className="rk-footer-top">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 420 }}>
            <span style={{ fontWeight: 800, fontSize: 22 }}>{s.agencyName}</span>
            <div className="rk-contact-lines" style={{ fontSize: 15 }}><ContactLines s={s} /></div>
          </div>
          <div className="rk-footer-cols">
            <div><strong>Search</strong><Link href="/properties?mode=buy">Buy</Link><Link href="/properties?mode=rent">Rent</Link></div>
            <div><strong>Company</strong><Link href="/valuation">Sell</Link><Link href="/agents">Agents</Link><Link href="/contact">Contact</Link></div>
          </div>
        </div>
        <div className="rk-footer-bottom"><span>© {new Date().getFullYear()} {s.agencyName}</span><span>Built with Payload CMS</span></div>
      </div>
    </footer>
  )
}

function Card({ p, s }: CardProps) {
  return (
    <Link href={href(p)} className="rk-card md-card">
      <div className="rk-card-media" style={{ aspectRatio: '4 / 3' }}>
        <PropertyPhoto p={p} size="medium" />
        <span className="rk-badge">{statusLabel(p)}</span>
      </div>
      <div className="md-card-body">
        <span className="md-card-price">{formatPrice(p, s)}</span>
        <span className="md-card-title">{p.title}</span>
        <span className="rk-muted" style={{ fontSize: 14 }}>
          {[p.bedrooms ? `${p.bedrooms} bd` : '', p.bathrooms ? `${p.bathrooms} ba` : '', formatArea(p.floorArea, s), place(p)].filter(Boolean).join(' · ')}
        </span>
      </div>
    </Link>
  )
}

const STEPS = [
  { n: '1', title: 'Free valuation', body: 'A local agent visits and gives you a written price within 48 hours.' },
  { n: '2', title: 'Photos and launch', body: 'Professional photos, a floor plan and your listing live on every major portal.' },
  { n: '3', title: 'Viewings to keys', body: 'We host viewings, negotiate offers and keep you updated until completion.' },
]

function Home({ s, featured, latest, agents }: HomeProps) {
  const spotlight = featured[0]
  return (
    <>
      <section className="rk-wrap md-hero">
        <div className="md-hero-copy">
          {s.tagline && <span className="md-pill">{s.tagline}</span>}
          <h1 className="rk-display">{s.heroHeadline}</h1>
          {s.heroText && <p>{s.heroText}</p>}
          <form action="/properties" method="get" className="md-search">
            <div className="md-search-tabs" role="radiogroup" aria-label="Search type">
              <label><input type="radio" name="mode" value="buy" defaultChecked /><span>Buy</span></label>
              <label><input type="radio" name="mode" value="rent" /><span>Rent</span></label>
            </div>
            <div className="md-search-row">
              <label htmlFor="md-q" className="rk-sr">Location</label>
              <input id="md-q" name="q" placeholder="City, neighbourhood or postcode" />
              <button type="submit" className="rk-btn rk-btn-accent">Search</button>
            </div>
          </form>
        </div>
        <div className="md-hero-media">
          <Photo src={img(s.heroImage, 'xlarge')} alt="" className="md-hero-photo" eager />
          {spotlight && (
            <Link href={href(spotlight)} className="md-float">
              <PropertyPhoto p={spotlight} size="small" className="md-float-photo" />
              <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#16a34a' }}>{statusLabel(spotlight)}</span>
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
            <h2 className="rk-display">Homes for you</h2>
            <div className="md-chips">
              <Link href="/properties" className="is-on">All</Link>
              <Link href="/properties?type=house">Houses</Link>
              <Link href="/properties?type=apartment">Apartments</Link>
              <Link href="/properties?mode=rent">To rent</Link>
            </div>
          </div>
          <div className="rk-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 24 }}>
            {latest.slice(0, 4).map((p) => <Card key={p.id} p={p} s={s} />)}
          </div>
        </section>
      )}

      <section className="rk-wrap" style={{ paddingBottom: 96 }}>
        <div className="md-band">
          <div style={{ flex: '1 1 420px', padding: 'clamp(32px, 5vw, 64px)', display: 'flex', flexDirection: 'column', gap: 18, justifyContent: 'center' }}>
            <h2 className="rk-display" style={{ fontSize: 'clamp(30px, 3.2vw, 40px)' }}>Search on the map</h2>
            <p className="rk-muted" style={{ margin: 0, fontSize: 17, lineHeight: 1.6 }}>See every home we have, where it is, and open any listing straight from the map.</p>
            <Link href="/properties" className="rk-btn rk-btn-primary" style={{ alignSelf: 'flex-start' }}>Open map search</Link>
          </div>
          <Photo src={img(s.sellImage, 'large')} alt="" className="md-band-photo" />
        </div>
      </section>

      <section className="rk-wrap" style={{ paddingBottom: 96 }}>
        <h2 className="rk-display" style={{ fontSize: 'clamp(30px, 3.2vw, 40px)', marginBottom: 28 }}>Selling? Here is how it works</h2>
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
            <h2 className="rk-display">Meet your agents</h2>
            <Link href="/agents" className="rk-link">All agents</Link>
          </div>
          <div className="rk-agents">{agents.slice(0, 4).map((a) => <AgentCard key={a.id} a={a} />)}</div>
        </section>
      )}

      <section className="rk-wrap" style={{ paddingBottom: 96 }}>
        <div className="md-cta">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 620 }}>
            <h2 className="rk-display" style={{ fontSize: 'clamp(30px, 3.6vw, 44px)', color: '#fff' }}>What is your home worth?</h2>
            <p style={{ margin: 0, fontSize: 18, lineHeight: 1.6, opacity: 0.85 }}>Get a free, no-obligation valuation from a local agent within 48 hours.</p>
          </div>
          <Link href="/valuation" className="rk-btn" style={{ background: '#fff', color: '#0f172a', fontWeight: 800 }}>Book a valuation</Link>
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
