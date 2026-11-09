import { notFound } from 'next/navigation'
import type { Media, Page } from '@/payload-types'
import { getSite, img, isDraft, payloadClient } from '@/site/data'
import { RenderBlocks } from '@/site/blocks/RenderBlocks'

type Params = Promise<{ slug: string }>

async function getPage(slug: string) {
  const payload = await payloadClient()
  const s = await getSite()
  const draft = await isDraft()
  const { docs } = await payload.find({ collection: 'pages', where: { slug: { equals: slug } }, limit: 1, depth: 2, locale: s.$.locale, draft })
  return docs[0] as Page | undefined
}

export async function generateMetadata({ params }: { params: Params }) {
  const page = await getPage((await params).slug)
  if (!page) return {}
  const og = img(page.meta?.image as Media, 'large')
  return { title: page.meta?.title || page.title, description: page.meta?.description || undefined, alternates: { canonical: `/${page.slug}` }, openGraph: og ? { images: [{ url: og.url }] } : undefined }
}

export default async function BuilderPage({ params }: { params: Params }) {
  const { slug } = await params
  const [page, s] = await Promise.all([getPage(slug), getSite()])
  if (!page) notFound()
  if (!page.layout?.length) return <div className="rk-wrap rk-prose-page"><h1 className="rk-display">{page.title}</h1></div>
  return <RenderBlocks blocks={page.layout} s={s} />
}
