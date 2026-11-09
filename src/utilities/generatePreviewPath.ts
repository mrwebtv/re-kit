import { PayloadRequest, CollectionSlug } from 'payload'

const prefix: Partial<Record<CollectionSlug, string>> = { posts: '/blog', pages: '' }

type Props = { collection: 'posts' | 'pages'; slug: string; req: PayloadRequest }

/** Admin "Preview" opens the draft through /next/preview, which turns on draft mode. */
export const generatePreviewPath = ({ collection, slug }: Props) => {
  if (slug === undefined || slug === null) return null
  const params = new URLSearchParams({ path: `${prefix[collection]}/${encodeURIComponent(slug)}`, previewSecret: process.env.PREVIEW_SECRET || process.env.PAYLOAD_SECRET?.slice(0, 16) || '' })
  return `/next/preview?${params.toString()}`
}
