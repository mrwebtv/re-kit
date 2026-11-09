import { Link } from '@/site/i18n/client'
import { getSite, payloadClient } from '@/site/data'

export const metadata = { title: 'Unsubscribe', robots: { index: false } }

type SP = Promise<Record<string, string | string[] | undefined>>

export default async function Unsubscribe({ searchParams }: { searchParams: SP }) {
  const token = (await searchParams).token
  const t = (await getSite()).$.t
  let ok = false
  if (typeof token === 'string' && /^[a-f0-9]{36}$/.test(token)) {
    const payload = await payloadClient()
    const res = await payload.update({ collection: 'search-alerts', where: { token: { equals: token } }, data: { active: false }, overrideAccess: true })
    ok = res.docs.length > 0
  }
  return (
    <div className="rk-wrap">
      <div className="rk-prose-page">
        <h1 className="rk-display">{ok ? t('You are unsubscribed') : t('Link not valid')}</h1>
        <p>{ok ? t('You will not receive any more emails for this search.') : t('This unsubscribe link is invalid or has already been used.')}</p>
        <p><Link href="/properties" className="rk-link">{t('Browse properties')}</Link></p>
      </div>
    </div>
  )
}
