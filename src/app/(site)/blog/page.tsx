import type { Where } from 'payload'
import { getSite, payloadClient } from '@/site/data'
import { PostCard } from '@/site/blocks/RenderBlocks'
import { Link } from '@/site/i18n/client'

export async function generateMetadata() {
  return { title: (await getSite()).$.t('Blog'), alternates: { canonical: '/blog' } }
}

export default async function BlogPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams
  const s = await getSite()
  const t = s.$.t
  const payload = await payloadClient()
  const cats = await payload.find({ collection: 'categories', limit: 50, depth: 0, locale: s.$.locale })
  const cat = cats.docs.find((c) => c.slug === sp.category)
  const where: Where | undefined = cat ? { categories: { in: [cat.id] } } : undefined
  const res = await payload.find({ collection: 'posts', overrideAccess: false, where, limit: 12, page: Number(sp.page) || 1, depth: 1, locale: s.$.locale, sort: '-publishedAt' })
  return (
    <div className="rk-wrap" style={{ paddingBottom: 112 }}>
      <div className="rk-page-head">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span className="rk-eyebrow">{t('Blog')}</span>
          <h1 className="rk-display">{cat ? cat.title : t('News and advice')}</h1>
        </div>
        {cats.docs.length > 0 && (
          <nav className="rk-chips" aria-label={t('Categories')}>
            <Link href="/blog" className={!cat ? 'is-on' : ''}>{t('All')}</Link>
            {cats.docs.map((c) => <Link key={c.id} href={`/blog?category=${c.slug}`} className={cat?.id === c.id ? 'is-on' : ''}>{c.title}</Link>)}
          </nav>
        )}
      </div>
      {res.docs.length ? <div className="rk-grid">{res.docs.map((p) => <PostCard key={p.id} p={p} s={s} />)}</div> : <p className="rk-muted">{t('No articles yet.')}</p>}
      {res.totalPages > 1 && (
        <nav className="rk-pager" aria-label={t('Pages')}>
          {Array.from({ length: res.totalPages }, (_, i) => i + 1).map((n) => (n === res.page ? <span key={n} aria-current="page">{n}</span> : <Link key={n} href={`/blog?${cat ? `category=${cat.slug}&` : ''}page=${n}`}>{n}</Link>))}
        </nav>
      )}
    </div>
  )
}
