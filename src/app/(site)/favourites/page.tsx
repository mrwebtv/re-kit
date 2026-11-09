import { getProperties, getSite } from '@/site/data'
import { getTheme } from '@/site/themes'
import { FavouritesLoader } from '@/site/components/Interactive'
import { Link } from '@/site/i18n/client'

export async function generateMetadata() {
  return { title: (await getSite()).$.t('Favourites'), robots: { index: false } }
}

/** Favourites live in the visitor's browser; the page loads them by ID, and the URL can be shared. */
export default async function FavouritesPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams
  const s = await getSite()
  const t = s.$.t
  const theme = getTheme(s.theme)
  const ids = sp.ids
  const res = ids !== undefined && ids !== '' ? await getProperties({ ids }, 100) : { docs: [] }
  return (
    <div className="rk-wrap" style={{ paddingBottom: 112 }}>
      <FavouritesLoader ids={ids} />
      <div className="rk-page-head">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span className="rk-eyebrow">{t('Saved in this browser')}</span>
          <h1 className="rk-display">{t('Favourites')}</h1>
        </div>
      </div>
      {ids === undefined ? (
        <p className="rk-muted">{t('Loading…')}</p>
      ) : res.docs.length === 0 ? (
        <div className="rk-empty">
          <p>{t('No favourites yet. Tap the heart on any home to save it here.')}</p>
          <Link href="/properties" className="rk-btn rk-btn-outline">{t('Browse properties')}</Link>
        </div>
      ) : (
        <>
          <p className="rk-muted">{t('Share this page link to send your shortlist to someone.')}</p>
          <div className={theme.listLayout === 'rows' ? 'rk-rows' : 'rk-grid'}>{res.docs.map((p, i) => <theme.Card key={p.id} p={p} s={s} index={i} />)}</div>
        </>
      )}
    </div>
  )
}
