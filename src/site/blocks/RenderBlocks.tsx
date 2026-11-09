import type { Agent, Media, Page, Post, Property } from '@/payload-types'
import type { Where } from 'payload'
import RichText from '@/components/RichText'
import { getLocale, img, payloadClient, type Site } from '../data'
import { getTheme } from '../themes'
import { AgentCard, Photo, SearchForm } from '../components/shared'
import { LeadForm } from '../components/LeadForm'
import { Gallery } from '../components/Gallery'
import { Icon } from '../icons'
import { embedUrl } from '../embed'
import { Link } from '../i18n/client'

type Block = NonNullable<Page['layout']>[number]
type Btn = { label?: string | null; url?: string | null } | null | undefined

const Btn = ({ b, className }: { b: Btn; className: string }) => (b?.label && b.url ? <Link href={b.url} className={className}>{b.label}</Link> : null)

function Head({ eyebrow, heading, center }: { eyebrow?: string | null; heading?: string | null; center?: boolean }) {
  if (!eyebrow && !heading) return null
  return (
    <div className="pb-head" style={center ? { textAlign: 'center', alignItems: 'center' } : undefined}>
      {eyebrow && <span className="rk-eyebrow">{eyebrow}</span>}
      {heading && <h2 className="rk-display">{heading}</h2>}
    </div>
  )
}

const Section = ({ bg, children, id, className }: { bg?: string | null; children: React.ReactNode; id?: string; className?: string }) => (
  <section id={id} className={`pb-section pb-bg-${bg || 'default'} ${className || ''}`}>
    <div className="rk-wrap">{children}</div>
  </section>
)

async function PropertyGrid({ b, s }: { b: Extract<Block, { blockType: 'propertyGrid' }>; s: Site }) {
  const payload = await payloadClient()
  const { locale } = await getLocale()
  const theme = getTheme(s.theme)
  const where: Where[] = []
  if (b.show === 'featured') where.push({ featured: { equals: true } })
  if (b.show === 'sale') where.push({ status: { equals: 'for-sale' } })
  if (b.show === 'rent') where.push({ status: { equals: 'to-let' } })
  if (b.show === 'town' && b.town) where.push({ or: [{ 'address.town': { like: b.town } }, { 'address.region': { like: b.town } }] })
  if (b.show === 'label' && b.label) where.push({ labels: { in: [typeof b.label === 'object' ? b.label.id : b.label] } })
  if (b.show === 'development' && b.development) where.push({ parent: { equals: typeof b.development === 'object' ? b.development.id : b.development } })
  let docs: Property[]
  if (b.show === 'manual') {
    docs = ((b.properties || []) as (number | Property)[]).filter((x) => typeof x === 'object') as Property[]
    if (docs.length !== (b.properties || []).length) {
      const ids = (b.properties || []).map((x) => (typeof x === 'object' ? x.id : x))
      const r = await payload.find({ collection: 'properties', where: { id: { in: ids } }, depth: 1, locale, limit: ids.length })
      docs = ids.map((id) => r.docs.find((d) => d.id === id)).filter(Boolean) as Property[]
    }
  } else {
    docs = (await payload.find({ collection: 'properties', where: where.length ? { and: where } : undefined, depth: 1, locale, limit: b.limit || 6, sort: b.show === 'development' ? 'price' : '-createdAt' })).docs
  }
  return (
    <Section bg={b.background}>
      <div className="pb-row-head">
        <Head eyebrow={b.eyebrow} heading={b.heading} />
        <Btn b={b.button} className="rk-link" />
      </div>
      {docs.length ? <div className={theme.listLayout === 'rows' ? 'rk-rows' : 'rk-grid'}>{docs.map((p, i) => <theme.Card key={p.id} p={p} s={s} index={i} />)}</div> : <p className="rk-muted">{s.$.t('No homes to show yet.')}</p>}
    </Section>
  )
}

async function Posts({ b, s }: { b: Extract<Block, { blockType: 'latestPosts' }>; s: Site }) {
  const payload = await payloadClient()
  const { locale } = await getLocale()
  const cat = b.category && typeof b.category === 'object' ? b.category.id : b.category
  const { docs } = await payload.find({ collection: 'posts', where: cat ? { categories: { in: [cat] } } : undefined, limit: b.limit || 3, depth: 1, locale, sort: '-publishedAt' })
  if (!docs.length) return null
  return (
    <Section bg={b.background}>
      <div className="pb-row-head"><Head eyebrow={b.eyebrow} heading={b.heading} /><Link href="/blog" className="rk-link">{s.$.t('All articles')}</Link></div>
      <div className="rk-grid">{docs.map((p) => <PostCard key={p.id} p={p} s={s} />)}</div>
    </Section>
  )
}

export function PostCard({ p, s }: { p: Post; s: Site }) {
  const cover = img(p.heroImage as Media, 'medium') || img(p.meta?.image as Media, 'medium')
  return (
    <Link href={`/blog/${p.slug}`} className="rk-card rk-postcard">
      <div className="rk-card-media" style={{ aspectRatio: '16 / 10' }}><Photo src={cover} alt={p.title} /></div>
      {p.publishedAt && <span className="rk-eyebrow" style={{ color: 'var(--muted)' }}>{new Date(p.publishedAt).toLocaleDateString(s.$.intl, { day: 'numeric', month: 'long', year: 'numeric' })}</span>}
      <h3 className="rk-card-title">{p.title}</h3>
      {(p.excerpt || p.meta?.description) && <p className="rk-muted" style={{ margin: 0 }}>{p.excerpt || p.meta?.description}</p>}
    </Link>
  )
}

export function RenderBlocks({ blocks, s }: { blocks: Block[]; s: Site }) {
  const t = s.$.t
  return (
    <div className="pb">
      {blocks.map((b, i) => {
        const key = b.id || i
        switch (b.blockType) {
          case 'hero': {
            const pic = img(b.image as Media, 'xlarge')
            const mp4 = b.style === 'video' && b.videoUrl ? b.videoUrl : null
            if (b.style === 'split')
              return (
                <section key={key} className="pb-hero pb-hero-split rk-wrap">
                  <div className="pb-hero-copy">
                    {b.eyebrow && <span className="rk-eyebrow">{b.eyebrow}</span>}
                    {b.heading && <h1 className="rk-display">{b.heading}</h1>}
                    {b.text && <p>{b.text}</p>}
                    <div className="pb-btns"><Btn b={b.button} className="rk-btn rk-btn-primary" /><Btn b={b.secondaryButton} className="rk-btn rk-btn-outline" /></div>
                    {b.showSearch && <SearchForm s={s} />}
                  </div>
                  <Photo src={pic} alt="" className="pb-hero-photo" eager />
                </section>
              )
            if (b.style === 'minimal')
              return (
                <section key={key} className="pb-hero pb-hero-min rk-wrap">
                  {b.eyebrow && <span className="rk-eyebrow">{b.eyebrow}</span>}
                  {b.heading && <h1 className="rk-display">{b.heading}</h1>}
                  {b.text && <p>{b.text}</p>}
                  <div className="pb-btns"><Btn b={b.button} className="rk-btn rk-btn-primary" /><Btn b={b.secondaryButton} className="rk-btn rk-btn-outline" /></div>
                  {b.showSearch && <SearchForm s={s} />}
                </section>
              )
            return (
              <section key={key} className={`pb-hero pb-hero-image${b.style === 'fullscreen' ? ' is-full' : ''}`}>
                {mp4 ? <video className="pb-hero-video" src={mp4} autoPlay muted loop playsInline poster={pic?.url} /> : <Photo src={pic} alt="" className="pb-hero-bg" eager />}
                <div className="pb-hero-shade" />
                <div className="rk-wrap pb-hero-inner">
                  {b.eyebrow && <span className="rk-eyebrow">{b.eyebrow}</span>}
                  {b.heading && <h1 className="rk-display">{b.heading}</h1>}
                  {b.text && <p>{b.text}</p>}
                  <div className="pb-btns"><Btn b={b.button} className="rk-btn pb-btn-light" /><Btn b={b.secondaryButton} className="rk-btn pb-btn-ghost" /></div>
                  {b.showSearch && <SearchForm s={s} />}
                </div>
              </section>
            )
          }
          case 'text':
            return (
              <Section key={key} bg={b.background}>
                <div className={b.width === 'wide' ? 'pb-text' : 'pb-text pb-narrow'}>
                  <Head eyebrow={b.eyebrow} heading={b.heading} />
                  {b.body && <div className="rk-prose"><RichText data={b.body} enableGutter={false} enableProse={false} /></div>}
                </div>
              </Section>
            )
          case 'imageText':
            return (
              <Section key={key} bg={b.background}>
                <div className={`pb-imgtext${b.imageSide === 'right' ? ' is-right' : ''}`}>
                  <Photo src={img(b.image as Media, 'large')} alt="" className="pb-imgtext-photo" />
                  <div className="pb-imgtext-copy">
                    <Head eyebrow={b.eyebrow} heading={b.heading} />
                    {b.body && <div className="rk-prose"><RichText data={b.body} enableGutter={false} enableProse={false} /></div>}
                    <Btn b={b.button} className="rk-btn rk-btn-outline" />
                  </div>
                </div>
              </Section>
            )
          case 'propertyGrid':
            return <PropertyGrid key={key} b={b} s={s} />
          case 'searchBar':
            return (
              <Section key={key} bg={b.background}>
                <Head eyebrow={b.eyebrow} heading={b.heading} />
                <SearchForm s={s} defaults={{ mode: b.mode || 'buy' }} />
              </Section>
            )
          case 'agentsGrid': {
            const picked = ((b.agents || []) as (number | Agent)[]).filter((a) => typeof a === 'object') as Agent[]
            return <AgentsBlock key={key} b={b} s={s} picked={picked} />
          }
          case 'stats':
            return (
              <Section key={key} bg={b.background}>
                <Head eyebrow={b.eyebrow} heading={b.heading} />
                <div className="pb-stats">{(b.items || []).map((x) => <div key={x.id || x.label}><strong className="rk-display">{x.value}</strong><span>{x.label}</span></div>)}</div>
              </Section>
            )
          case 'iconGrid':
            return (
              <Section key={key} bg={b.background}>
                <Head eyebrow={b.eyebrow} heading={b.heading} />
                <div className="pb-icons">{(b.items || []).map((x) => <div key={x.id || x.title}><span className="pb-icon"><Icon name={x.icon} size={26} /></span><h3>{x.title}</h3>{x.text && <p className="rk-muted">{x.text}</p>}</div>)}</div>
              </Section>
            )
          case 'testimonials':
            return (
              <Section key={key} bg={b.background}>
                <Head eyebrow={b.eyebrow} heading={b.heading} />
                <div className="pb-quotes">{(b.items || []).map((x) => <figure key={x.id || x.name}><blockquote className="rk-display">“{x.quote}”</blockquote><figcaption><strong>{x.name}</strong>{x.detail && <span className="rk-muted"> · {x.detail}</span>}</figcaption></figure>)}</div>
              </Section>
            )
          case 'faq':
            return (
              <Section key={key} bg={b.background}>
                <div className="pb-narrow">
                  <Head eyebrow={b.eyebrow} heading={b.heading} />
                  <div className="pb-faq">{(b.items || []).map((x) => <details key={x.id || x.question}><summary>{x.question}</summary><p>{x.answer}</p></details>)}</div>
                  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: (b.items || []).map((x) => ({ '@type': 'Question', name: x.question, acceptedAnswer: { '@type': 'Answer', text: x.answer } })) }).replace(/</g, '\\u003c') }} />
                </div>
              </Section>
            )
          case 'ctaBanner': {
            const pic = img(b.image as Media, 'xlarge')
            return (
              <section key={key} className="rk-wrap pb-cta-wrap">
                <div className={`pb-cta${pic ? ' has-image' : ''}`}>
                  {pic && <Photo src={pic} alt="" className="pb-cta-bg" />}
                  <div className="pb-cta-copy">
                    {b.eyebrow && <span className="rk-eyebrow">{b.eyebrow}</span>}
                    {b.heading && <h2 className="rk-display">{b.heading}</h2>}
                    {b.text && <p>{b.text}</p>}
                  </div>
                  <div className="pb-btns"><Btn b={b.button} className="rk-btn pb-btn-light" /><Btn b={b.secondaryButton} className="rk-btn pb-btn-ghost" /></div>
                </div>
              </section>
            )
          }
          case 'leadForm':
            return (
              <Section key={key} bg={b.background} id="form">
                <div className="rk-split" style={{ padding: 0 }}>
                  <div>
                    <Head eyebrow={b.eyebrow} heading={b.heading} />
                    {b.text && <p>{b.text}</p>}
                  </div>
                  <div><LeadForm kind={b.form === 'alert' ? 'signup' : (b.form as 'contact' | 'valuation') || 'contact'} submitLabel={b.buttonLabel || t('Send')} /></div>
                </div>
              </Section>
            )
          case 'gallery': {
            const photos = ((b.images || []) as (number | Media)[]).map((m) => ({ s: img(m, 'large'), f: img(m, 'xlarge') })).filter((x) => x.s).map((x) => ({ url: x.s!.url, full: x.f?.url || x.s!.url, alt: x.s!.alt }))
            return (
              <Section key={key}>
                <Head eyebrow={b.eyebrow} heading={b.heading} />
                <Gallery photos={photos} title={b.heading || ''} />
              </Section>
            )
          }
          case 'video': {
            const src = embedUrl(b.url)
            return src ? (
              <Section key={key}>
                <Head eyebrow={b.eyebrow} heading={b.heading} />
                <div className="rk-embed"><iframe src={src} title={b.heading || 'Video'} allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen; xr-spatial-tracking" loading="lazy" /></div>
              </Section>
            ) : null
          }
          case 'latestPosts':
            return <Posts key={key} b={b} s={s} />
          default:
            return null
        }
      })}
    </div>
  )
}

async function AgentsBlock({ b, s, picked }: { b: Extract<Block, { blockType: 'agentsGrid' }>; s: Site; picked: Agent[] }) {
  let agents = picked
  if (!agents.length) {
    const payload = await payloadClient()
    const { locale } = await getLocale()
    agents = (await payload.find({ collection: 'agents', limit: 24, depth: 1, locale, sort: 'createdAt' })).docs
  }
  return (
    <Section bg={b.background}>
      <Head eyebrow={b.eyebrow} heading={b.heading} />
      <div className="rk-agents">{agents.map((a) => <AgentCard key={a.id} a={a} s={s} />)}</div>
    </Section>
  )
}
