import { notFound } from 'next/navigation'
import type { Media, Post } from '@/payload-types'
import RichText from '@/components/RichText'
import { getSite, img, isDraft, payloadClient, siteUrl } from '@/site/data'
import { Photo } from '@/site/components/shared'
import { ShareButtons } from '@/site/components/Extras'
import { PostCard } from '@/site/blocks/RenderBlocks'
import { Link } from '@/site/i18n/client'

type Params = Promise<{ slug: string }>

async function getPost(slug: string) {
  const payload = await payloadClient()
  const s = await getSite()
  const { docs } = await payload.find({ collection: 'posts', where: { slug: { equals: slug } }, limit: 1, depth: 2, locale: s.$.locale, draft: await isDraft() })
  return docs[0] as Post | undefined
}

export async function generateMetadata({ params }: { params: Params }) {
  const p = await getPost((await params).slug)
  if (!p) return {}
  const og = img((p.meta?.image || p.heroImage) as Media, 'large')
  return { title: p.meta?.title || p.title, description: p.meta?.description || p.excerpt || undefined, alternates: { canonical: `/blog/${p.slug}` }, openGraph: { type: 'article', images: og ? [{ url: og.url }] : undefined } }
}

export default async function PostPage({ params }: { params: Params }) {
  const { slug } = await params
  const [p, s] = await Promise.all([getPost(slug), getSite()])
  if (!p) notFound()
  const t = s.$.t
  const cover = img(p.heroImage as Media, 'xlarge')
  const related = ((p.relatedPosts || []) as (number | Post)[]).filter((x) => typeof x === 'object') as Post[]
  const authors = (p.populatedAuthors || []).map((a) => a.name).filter(Boolean).join(', ')
  const jsonLd = { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: p.title, datePublished: p.publishedAt, dateModified: p.updatedAt, image: cover ? `${siteUrl()}${cover.url}` : undefined, author: authors ? { '@type': 'Person', name: authors } : undefined, publisher: { '@type': 'Organization', name: s.agencyName } }
  return (
    <article style={{ paddingBottom: 112 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <div className="rk-wrap rk-post-head">
        <nav className="rk-crumbs" aria-label={t('Breadcrumb')}><Link href="/blog">{t('Blog')}</Link></nav>
        <div className="rk-post-meta">
          {(p.categories || []).map((c) => (typeof c === 'object' ? <Link key={c.id} href={`/blog?category=${c.slug}`} className="rk-eyebrow">{c.title}</Link> : null))}
          {p.publishedAt && <span className="rk-muted">{new Date(p.publishedAt).toLocaleDateString(s.$.intl, { day: 'numeric', month: 'long', year: 'numeric' })}</span>}
          {authors && <span className="rk-muted">{authors}</span>}
        </div>
        <h1 className="rk-display">{p.title}</h1>
        {p.excerpt && <p className="rk-summary">{p.excerpt}</p>}
      </div>
      {cover && <div className="rk-wrap"><Photo src={cover} alt="" className="rk-post-cover" eager /></div>}
      <div className="rk-wrap"><div className="rk-prose rk-post-body">{p.content && <RichText data={p.content} enableGutter={false} enableProse={false} />}</div></div>
      <div className="rk-wrap"><div className="rk-post-body"><ShareButtons url={s.$.L(`/blog/${p.slug}`)} title={p.title} /></div></div>
      {related.length > 0 && (
        <section className="rk-wrap" style={{ paddingTop: 72 }}>
          <h2 className="rk-display" style={{ fontSize: 40, marginBottom: 32 }}>{t('Related articles')}</h2>
          <div className="rk-grid">{related.map((r) => <PostCard key={r.id} p={r} s={s} />)}</div>
        </section>
      )}
    </article>
  )
}
