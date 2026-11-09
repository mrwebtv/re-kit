import { Link } from '../i18n/client'
import { formatArea, img, place, TYPE_LABEL } from '../data'
import { AgentCard, Brand, CardShell, ContactLines, FooterLegal, MainNav, menuOf, Photo, PriceLabel, PropertyPhoto, href, statusLabel, type NavItem } from '../components/shared'
import type { CardProps, HomeProps, ThemeKit } from './types'
import type { Site } from '../data'

const SW_NAV = (s: Site): NavItem[] => [
  { href: '/properties?mode=buy', label: `[01] ${s.$.t('Buy')}` },
  { href: '/properties?mode=rent', label: `[02] ${s.$.t('Rent')}` },
  { href: '/valuation', label: `[03] ${s.$.t('Sell')}` },
  { href: '/agents', label: `[04] ${s.$.t('Team')}` },
  { href: '/contact', label: `[05] ${s.$.t('Contact')}` },
]

function Header({ s }: { s: Site }) {
  return (
    <header className="rk-header sw-header">
      <div className="rk-wrap rk-header-inner" style={{ alignItems: 'baseline' }}>
        <Brand s={s} />
        <MainNav s={s} items={menuOf(s, SW_NAV(s))} cta={{ label: `${s.$.t('Valuation')} →`, href: '/valuation' }} ctaClass="sw-hl rk-nav-cta" className="sw-nav" />
      </div>
    </header>
  )
}

function Footer({ s }: { s: Site }) {
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
function Card({ p, s, index = 0, distance }: CardProps) {
  const t = s.$.t
  const labels = (p.labels || []).filter((l) => typeof l === 'object') as { id: number; name: string }[]
  return (
    <Link href={href(p)} className="sw-row">
      <span className="sw-mono sw-n">{String(index + 1).padStart(3, '0')}</span>
      <PropertyPhoto p={p} size="small" className="sw-thumb" />
      <span className="sw-row-title">
        {p.title}
        <span className="sw-mono sw-status">{statusLabel(p, s)}{labels.map((l) => ` / ${l.name}`).join('')}</span>
      </span>
      <span className="sw-dim">{place(p)}{distance !== undefined ? ` · ${t('{km} km away', { km: distance })}` : ''}</span>
      <span className="sw-mono">{p.bedrooms ? `${p.bedrooms} ${t('BD')}` : ''}</span>
      <span className="sw-mono">{formatArea(p.floorArea, s).toUpperCase()}</span>
      <PriceLabel p={p} s={s} className="sw-price" />
      <span aria-hidden="true" className="sw-arrow">→</span>
    </Link>
  )
}

function Home({ s, latest, agents }: HomeProps) {
  const t = s.$.t
  const FACTS = [
    { n: '/01', title: t('Real photos'), body: t('Shot by a professional, never edited to hide anything.') },
    { n: '/02', title: t('Floor plans'), body: t('Measured plans on listings, so you know the rooms before you visit.') },
    { n: '/03', title: t('Book online'), body: t('Pick a viewing time from the listing. The agent confirms by email or phone.') },
    { n: '/04', title: t('Fixed fees'), body: t('Sellers know the fee before they sign. No surprises at completion.') },
  ]
  return (
    <>
      <section className="rk-wrap sw-hero">
        <h1 className="sw-giant"><span className="sw-up">{t('Buy.')}</span><br /><span className="sw-up">{t('Rent.')}</span><br /><span className="sw-hl">{t('Sell.')}</span></h1>
        <p className="sw-lede">{s.heroText}</p>
        <Photo src={img(s.heroImage, 'xlarge')} alt="" className="sw-hero-photo" eager />
      </section>

      <section className="rk-wrap" style={{ paddingTop: 48 }}>
        <form action={s.$.L('/properties')} method="get" className="sw-search">
          <input type="hidden" name="mode" value="buy" />
          <div className="sw-sf"><label htmlFor="sw-q">{t('Where')}</label><input id="sw-q" name="q" placeholder={t('Any area')} /></div>
          <div className="sw-sf"><label htmlFor="sw-t">{t('What')}</label><select id="sw-t" name="type" defaultValue=""><option value="">{t('Any type')}</option>{['house', 'apartment', 'townhouse', 'villa'].map((v) => <option key={v} value={v}>{t(TYPE_LABEL[v]!)}</option>)}</select></div>
          <div className="sw-sf"><label htmlFor="sw-b">{t('Beds')}</label><select id="sw-b" name="beds" defaultValue=""><option value="">{t('Any')}</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option></select></div>
          <div className="sw-sf"><label htmlFor="sw-m">{t('Max')}</label><select id="sw-m" name="max" defaultValue=""><option value="">{t('No limit')}</option><option value="1000000">{(1000000).toLocaleString(s.$.intl)}</option><option value="2500000">{(2500000).toLocaleString(s.$.intl)}</option></select></div>
          <button type="submit" className="sw-go">{t('Search')} →</button>
        </form>
      </section>

      {latest.length > 0 && (
        <section className="rk-wrap" style={{ padding: '96px var(--gutter)' }}>
          <div className="sw-head">
            <h2 className="sw-h2">{t('Index of homes')}</h2>
            <Link href="/properties" className="sw-mono" style={{ textDecoration: 'underline', fontSize: 14 }}>{t('View all')} →</Link>
          </div>
          <div className="rk-rows">{latest.map((p, i) => <CardShell key={p.id} p={p} s={s}><Card p={p} s={s} index={i} /></CardShell>)}</div>
        </section>
      )}

      <section className="sw-band">
        <div className="rk-wrap" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40, alignItems: 'end', padding: '96px var(--gutter)' }}>
          <h2 className="sw-giant" style={{ fontSize: 'clamp(56px, 7vw, 96px)' }}>{t('Selling? Start with a number.')}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <p style={{ margin: 0, fontSize: 22, lineHeight: 1.35, fontWeight: 500 }}>{t('Free written valuation from a local agent within 48 hours.')}</p>
            <Link href="/valuation" className="sw-go" style={{ alignSelf: 'flex-start' }}>{t('Book a valuation')} →</Link>
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
          <div className="sw-head"><h2 className="sw-h2">{t('Team')}</h2><Link href="/agents" className="sw-mono" style={{ textDecoration: 'underline', fontSize: 14 }}>{t('All')} →</Link></div>
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
