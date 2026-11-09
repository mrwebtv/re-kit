import Link from 'next/link'
import { formatPrice, img } from '../data'
import { AgentCard, Brand, BrandName, ContactLines, Facts, NAV, Photo, PropertyPhoto, SearchForm, href, statusLabel, FooterLegal, PriceLabel } from '../components/shared'
import type { CardProps, HomeProps, ThemeKit } from './types'
import type { SiteSetting } from '@/payload-types'

function Header({ s }: { s: SiteSetting }) {
  return (
    <header className="rk-header">
      <div className="rk-wrap rk-header-inner">
        <Brand s={s} />
        <nav aria-label="Main" className="rk-nav">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href}>{n.label}</Link>
          ))}
          <Link href="/valuation" className="rk-btn rk-btn-outline" style={{ minHeight: 44, padding: '0 22px' }}>Book a valuation</Link>
        </nav>
      </div>
    </header>
  )
}

function Footer({ s }: { s: SiteSetting }) {
  return (
    <footer className="rk-footer">
      <div className="rk-wrap">
        <div className="rk-footer-top">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 420 }}>
            <span className="rk-display" style={{ fontSize: 36 }}><BrandName name={s.agencyName || ''} /></span>
            <div className="rk-contact-lines" style={{ fontSize: 15, opacity: 0.8 }}><ContactLines s={s} /></div>
          </div>
          <div className="rk-footer-cols">
            <div><strong>Properties</strong><Link href="/properties?mode=buy">For sale</Link><Link href="/properties?mode=rent">To let</Link></div>
            <div><strong>Services</strong><Link href="/valuation">Valuations</Link><Link href="/agents">Our agents</Link><Link href="/contact">Contact</Link></div>
          </div>
        </div>
        <div className="rk-footer-bottom"><FooterLegal s={s} /></div>
      </div>
    </footer>
  )
}

function Card({ p, s }: CardProps) {
  return (
    <Link href={href(p)} className="rk-card">
      <div className="rk-card-media" style={{ aspectRatio: '4 / 4.4' }}>
        <PropertyPhoto p={p} />
        <span className="rk-badge">{statusLabel(p)}</span>
      </div>
      <div className="rk-card-top">
        <h3 className="rk-card-title">{p.title}</h3>
        <PriceLabel p={p} s={s} className="rk-card-price" />
      </div>
      <Facts p={p} s={s} />
    </Link>
  )
}

const PILLARS = [
  { n: 'i.', title: 'Photographed properly', body: 'Every home is shot by a professional photographer, so buyers fall for it before they visit.' },
  { n: 'ii.', title: 'One agent, start to finish', body: 'The person who values your home answers your calls, hosts the viewings and negotiates the offers.' },
  { n: 'iii.', title: 'Buyers we already know', body: 'Registered buyers are matched to your home the day it lists.' },
]

function Home({ s, featured, agents }: HomeProps) {
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
        <SearchForm className="rk-search ed-search" />
      </section>

      {featured.length > 0 && (
        <section className="rk-section">
          <div className="rk-wrap">
            <div className="rk-section-head">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <span className="rk-eyebrow">Selected residences</span>
                <h2 className="rk-display">New to the market</h2>
              </div>
              <Link href="/properties" className="rk-link">View all properties</Link>
            </div>
            <div className="rk-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
              {featured.map((p) => <Card key={p.id} p={p} s={s} />)}
            </div>
          </div>
        </section>
      )}

      <section className="rk-wrap" style={{ paddingBottom: 112 }}>
        <div className="ed-sell">
          <Photo src={img(s.sellImage, 'large')} alt="" className="ed-sell-photo" />
          <div className="ed-sell-copy">
            <span className="rk-eyebrow" style={{ color: '#C9AE84' }}>Selling with us</span>
            <h2 className="rk-display" style={{ fontSize: 'clamp(40px, 4.4vw, 56px)' }}>What is your home <em>really</em> worth?</h2>
            <p>An agent who knows your street visits, walks every room and gives you a written valuation within 48 hours. No obligation, no pressure.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
              <Link href="/valuation" className="rk-btn" style={{ background: '#F6F4EF', color: '#1B1B19' }}>Book a free valuation</Link>
              <Link href="/contact" className="rk-btn" style={{ color: '#F6F4EF', padding: '0 4px', borderBottom: '1px solid #6B665D' }}>Talk to an agent</Link>
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
                <span className="rk-eyebrow">Our agents</span>
                <h2 className="rk-display">The people behind every sale</h2>
              </div>
              <Link href="/agents" className="rk-link">Meet the team</Link>
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
