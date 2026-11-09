import Link from 'next/link'
import { formatArea, formatPrice, img, place } from '../data'
import { AgentCard, Brand, ContactLines, Photo, PropertyPhoto, href, statusLabel, FooterLegal, PriceLabel } from '../components/shared'
import type { CardProps, HomeProps, ThemeKit } from './types'
import type { SiteSetting } from '@/payload-types'

const NAV = [
  { href: '/properties?mode=buy', label: '[01] Buy' },
  { href: '/properties?mode=rent', label: '[02] Rent' },
  { href: '/valuation', label: '[03] Sell' },
  { href: '/agents', label: '[04] Team' },
  { href: '/contact', label: '[05] Contact' },
]

function Header({ s }: { s: SiteSetting }) {
  return (
    <header className="rk-header sw-header">
      <div className="rk-wrap rk-header-inner" style={{ alignItems: 'baseline' }}>
        <Brand s={s} />
        <nav aria-label="Main" className="rk-nav sw-nav">
          {NAV.map((n) => <Link key={n.href} href={n.href}>{n.label}</Link>)}
          <Link href="/valuation" className="sw-hl">Valuation →</Link>
        </nav>
      </div>
    </header>
  )
}

function Footer({ s }: { s: SiteSetting }) {
  return (
    <footer className="rk-footer sw-footer">
      <div className="rk-wrap" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, padding: '56px var(--gutter)' }}>
        <span className="sw-footer-mark">{s.agencyName}</span>
        <span className="sw-mono" style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, textAlign: 'right' }}>
          <ContactLines s={s} />
          <FooterLegal s={s} />
        </span>
      </div>
    </footer>
  )
}

/** Index-table row. Used for listings and "similar" in this theme. */
function Card({ p, s, index = 0 }: CardProps) {
  return (
    <Link href={href(p)} className="sw-row">
      <span className="sw-mono sw-n">{String(index + 1).padStart(3, '0')}</span>
      <PropertyPhoto p={p} size="small" className="sw-thumb" />
      <span className="sw-row-title">{p.title}<span className="sw-mono sw-status">{statusLabel(p)}</span></span>
      <span className="sw-dim">{place(p)}</span>
      <span className="sw-mono">{p.bedrooms ? `${p.bedrooms} BD` : ''}</span>
      <span className="sw-mono">{formatArea(p.floorArea, s).toUpperCase()}</span>
      <PriceLabel p={p} s={s} className="sw-price" />
      <span aria-hidden="true" className="sw-arrow">→</span>
    </Link>
  )
}

const FACTS = [
  { n: '/01', title: 'Real photos', body: 'Shot by a professional, never edited to hide anything.' },
  { n: '/02', title: 'Floor plans', body: 'Measured plans on listings, so you know the rooms before you visit.' },
  { n: '/03', title: 'Book online', body: 'Pick a viewing time from the listing. The agent confirms by email or phone.' },
  { n: '/04', title: 'Fixed fees', body: 'Sellers know the fee before they sign. No surprises at completion.' },
]

function Home({ s, latest, agents }: HomeProps) {
  return (
    <>
      <section className="rk-wrap sw-hero">
        <h1 className="sw-giant"><span className="sw-up">Buy.</span><br /><span className="sw-up">Rent.</span><br /><span className="sw-hl">Sell.</span></h1>
        <p className="sw-lede">{s.heroText}</p>
        <Photo src={img(s.heroImage, 'xlarge')} alt="" className="sw-hero-photo" eager />
      </section>

      <section className="rk-wrap" style={{ paddingTop: 48 }}>
        <form action="/properties" method="get" className="sw-search">
          <input type="hidden" name="mode" value="buy" />
          <div className="sw-sf"><label htmlFor="sw-q">Where</label><input id="sw-q" name="q" placeholder="Any area" /></div>
          <div className="sw-sf"><label htmlFor="sw-t">What</label><select id="sw-t" name="type" defaultValue=""><option value="">Any type</option><option value="house">House</option><option value="apartment">Apartment</option><option value="townhouse">Townhouse</option></select></div>
          <div className="sw-sf"><label htmlFor="sw-b">Beds</label><select id="sw-b" name="beds" defaultValue=""><option value="">Any</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option></select></div>
          <div className="sw-sf"><label htmlFor="sw-m">Max</label><select id="sw-m" name="max" defaultValue=""><option value="">No limit</option><option value="1000000">1,000,000</option><option value="2500000">2,500,000</option></select></div>
          <button type="submit" className="sw-go">Search →</button>
        </form>
      </section>

      {latest.length > 0 && (
        <section className="rk-wrap" style={{ padding: '96px var(--gutter)' }}>
          <div className="sw-head">
            <h2 className="sw-h2">Index of homes</h2>
            <Link href="/properties" className="sw-mono" style={{ textDecoration: 'underline', fontSize: 14 }}>View all →</Link>
          </div>
          <div className="rk-rows">{latest.map((p, i) => <Card key={p.id} p={p} s={s} index={i} />)}</div>
        </section>
      )}

      <section className="sw-band">
        <div className="rk-wrap" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40, alignItems: 'end', padding: '96px var(--gutter)' }}>
          <h2 className="sw-giant" style={{ fontSize: 'clamp(56px, 7vw, 96px)' }}>Selling? Start with a number.</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <p style={{ margin: 0, fontSize: 22, lineHeight: 1.35, fontWeight: 500 }}>Free written valuation from a local agent within 48 hours.</p>
            <Link href="/valuation" className="sw-go" style={{ alignSelf: 'flex-start' }}>Book a valuation →</Link>
          </div>
        </div>
      </section>

      <section className="rk-wrap sw-facts">
        {FACTS.map((f) => (
          <div key={f.n}>
            <span className="sw-mono" style={{ fontSize: 14 }}>{f.n}</span>
            <h3>{f.title}</h3>
            <p>{f.body}</p>
          </div>
        ))}
      </section>

      {agents.length > 0 && (
        <section className="rk-wrap" style={{ paddingBottom: 96 }}>
          <div className="sw-head"><h2 className="sw-h2">Team</h2><Link href="/agents" className="sw-mono" style={{ textDecoration: 'underline', fontSize: 14 }}>All →</Link></div>
          <div className="rk-agents" style={{ paddingTop: 32 }}>{agents.slice(0, 4).map((a) => <AgentCard key={a.id} a={a} />)}</div>
        </section>
      )}
    </>
  )
}

export const swiss: ThemeKit = {
  id: 'swiss',
  fonts: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap',
  defaultAccent: '#D8F34A',
  Header,
  Footer,
  Home,
  Card,
  listLayout: 'rows',
}
