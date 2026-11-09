import { getAgents, getFeatured, getProperties, getSite, isDraft, payloadClient } from '@/site/data'
import { getTheme } from '@/site/themes'
import { RenderBlocks } from '@/site/blocks/RenderBlocks'
import type { Page } from '@/payload-types'

export default async function HomePage() {
  const s = await getSite()
  if (s.homePage && typeof s.homePage === 'object') {
    const payload = await payloadClient()
    const draft = await isDraft()
    const page = (await payload.findByID({ collection: 'pages', id: s.homePage.id, depth: 2, locale: s.$.locale, draft, disableErrors: true, overrideAccess: draft })) as Page | null
    if (page?.layout?.length) return <RenderBlocks blocks={page.layout} s={s} />
  }
  const theme = getTheme(s.theme)
  const [featured, latest, agents] = await Promise.all([getFeatured(3), getProperties({}, 6), getAgents()])
  return <theme.Home s={s} featured={featured} latest={latest.docs} agents={agents} />
}
